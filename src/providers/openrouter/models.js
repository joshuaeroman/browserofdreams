import { AgentPlatform } from "../gemini/agent-platform.js";

export const STATIC_OR_TEXT_MODELS = [
  "anthropic/claude-3.5-sonnet",
  "google/gemini-2.5-flash",
  "google/gemini-2.5-pro",
  "google/gemini-3-flash-preview",
  "openai/gpt-4o",
  "deepseek/deepseek-chat"
];

export const STATIC_OR_IMAGE_MODELS = [
  "openai/gpt-image-2.5-flare",
  "openai/gpt-image-2.5-flare-20260908",
  "openai/gpt-image-2.5-sunburst",
  "openai/gpt-image-2.5-sunburst-20260908",
  "openai/gpt-image-2",
  "openai/gpt-image-1",
  "openai/gpt-image-1-mini",
  "google/gemini-nano-banana-2.1",
  "google/gemini-3.1-flash-image",
  "google/gemini-3.1-flash-image-preview",
  "google/gemini-3.1-flash-lite-image",
  "google/gemini-3-pro-image",
  "google/gemini-3-pro-image-preview",
  "google/gemini-2.5-flash-image",
  "google/gemini-2.5-flash-image-preview",
  "black-forest-labs/flux-3-image",
  "black-forest-labs/flux-3-image-klein",
  "black-forest-labs/flux.2-max",
  "black-forest-labs/flux.2-pro",
  "black-forest-labs/flux.2-flex",
  "black-forest-labs/flux.2-klein-4b",
  "bytedance-seed/seedream-5-0-pro",
  "bytedance-seed/seedream-5-0-flash",
  "bytedance-seed/seedream-5-0-lite",
  "bytedance-seed/seedream-4.5",
  "qwen/qwen-image-3-pro",
  "qwen/qwen-image-3",
  "qwen/qwen-image-2.1-pro",
  "qwen/qwen-image-2.1-turbo",
  "qwen/qwen-image-2-pro",
  "qwen/qwen-image-2",
  "recraft/recraft-v4.1-pro",
  "recraft/recraft-v4.1-flash",
  "recraft/recraft-v4.1-vector",
  "recraft/recraft-v4-pro",
  "recraft/recraft-v4",
  "microsoft/mai-image-2.6",
  "microsoft/mai-image-2.6-flash",
  "microsoft/mai-image-2",
  "x-ai/grok-imagine-image-2.0",
  "x-ai/grok-imagine-image-pro",
  "x-ai/grok-imagine-image",
  "sourceful/riverflow-v2.5-pro",
  "sourceful/riverflow-v2.5-fast",
  "sourceful/riverflow-v2-pro",
  "sourceful/riverflow-v2-fast",
  "krea/krea-2-large",
  "tencent/hy-image-v3.5-preview",
  "meta/muse-image",
  "meta/muse-image-fast",
  "openai/gpt-5.4-image-2",
  "openai/gpt-5-image",
  "openai/gpt-5-image-mini"
];

export function normalizeOpenRouterModelId(rawModel) {
  var s = String(rawModel || "").trim();
  if (!s) return "";
  // Allow pasting full OpenRouter model URLs like https://openrouter.ai/openai/gpt-image-2.5-flare-20260908
  s = s.replace(/^https?:\/\/(?:www\.)?openrouter\.ai\/(?:models\/)?/i, "");
  s = s.split("?")[0].split("#")[0].replace(/^\/+|\/+$/g, "");
  return s;
}

export function fetchOpenRouterModels(apiKey, callback) {
  var xhr = new XMLHttpRequest();
  // Critical: ?output_modalities=all is required so OpenRouter returns dedicated image models
  xhr.open("GET", "https://openrouter.ai/api/v1/models?output_modalities=all");
  xhr.timeout = 20000;
  if (apiKey) {
    xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
  }
  xhr.ontimeout = function() {
    callback("OpenRouter model fetch timed out", null);
  };
  xhr.onreadystatechange = function() {
    if (xhr.readyState !== 4) return;
    if (xhr.status === 200) {
      try {
        var body = JSON.parse(xhr.responseText);
        var raw = body.data || [];
        var textModels = [];
        var imageModels = [];
        var seenImage = {};
        var seenText = {};
        function pushImageModel(id) {
          if (!id || seenImage[id]) return;
          seenImage[id] = true;
          imageModels.push(id);
        }
        function pushTextModel(id) {
          if (!id || seenText[id]) return;
          seenText[id] = true;
          textModels.push(id);
        }
        for (var i = 0; i < raw.length; i++) {
          var m = raw[i];
          if (!m || !m.id) continue;
          var outMods = (m.architecture && m.architecture.output_modalities) || [];
          var isEmbed = outMods.indexOf("embeddings") !== -1 || m.id.indexOf("embed") !== -1;
          var isImg = !isEmbed && (
            outMods.indexOf("image") !== -1 ||
            (outMods.length === 0 && (
              AgentPlatform.isImageModel(m.id) ||
              m.id.indexOf("gpt-image") !== -1 ||
              m.id.indexOf("flux") !== -1 ||
              m.id.indexOf("seedream") !== -1 ||
              m.id.indexOf("recraft") !== -1 ||
              m.id.indexOf("qwen-image") !== -1 ||
              m.id.indexOf("mai-image") !== -1 ||
              m.id.indexOf("muse-image") !== -1
            ))
          );
          if (isImg) {
            pushImageModel(m.id);
            // Also expose dated/canonical slug (e.g. openai/gpt-image-2.5-flare-20260908)
            if (m.canonical_slug && m.canonical_slug !== m.id) {
              pushImageModel(m.canonical_slug);
            }
          }
          if (!isEmbed && (outMods.indexOf("text") !== -1 || outMods.length === 0)) {
            pushTextModel(m.id);
          }
        }
        callback(null, { textModels: textModels, imageModels: imageModels });
      } catch (e) {
        callback("Failed to parse OpenRouter models: " + e.message, null);
      }
    } else {
      callback("Failed to fetch OpenRouter models (HTTP " + xhr.status + ")", null);
    }
  };
  xhr.send();
}
