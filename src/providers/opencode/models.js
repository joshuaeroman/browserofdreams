import { formatOpenCodeHttpError } from "./route.js";

export const STATIC_OPENCODE_ZEN_MODELS = [
  "claude-sonnet-4-6",
  "claude-sonnet-4-5",
  "claude-opus-4-6",
  "claude-haiku-4-5",
  "gemini-3.8-flash",
  "gemini-3-flash",
  "gemini-3.1-pro",
  "gpt-5.4",
  "gpt-5.4-mini",
  "gpt-5.3-codex",
  "qwen3.8-flash",
  "qwen3.6-plus",
  "glm-5.3-flash",
  "glm-5.1",
  "kimi-k2.5",
  "minimax-m2.5",
  "big-pickle",
  "glm-5.3-flash-free",
  "deepseek-v4.1-flash-free",
  "mimo-v2.6-flash-free"
];

export const STATIC_OPENCODE_GO_MODELS = [
  "qwen3.8-flash",
  "qwen3.8-max",
  "qwen3.7-plus",
  "qwen3.6-plus",
  "glm-5.3-flash",
  "glm-5.3",
  "glm-5.2",
  "glm-5.1",
  "kimi-k3",
  "kimi-k2.7-code",
  "kimi-k2.6",
  "minimax-m3",
  "minimax-m3.1-flash",
  "minimax-m2.7",
  "minimax-m2.5",
  "deepseek-v4.1-flash",
  "deepseek-v4-pro",
  "mimo-v2.6-flash",
  "mimo-v2.5-pro",
  "gpt-6-luna",
  "gpt-5.6-luna",
  "grok-4.7",
  "claude-haiku-5-5",
  "gemini-4-argon",
  "beam-free"
];

export function fetchOpenCodeModels(endpoint, apiKey, callback) {
  var base = String(endpoint || "https://opencode.ai/zen/v1").replace(/\/+$/, "");
  var url = /\/v1$/.test(base) ? (base + "/models") : (base + "/v1/models");
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.timeout = 15000;
  // Note: Do NOT send x-opencode-session on GET /models because opencode.ai's
  // CORS Access-Control-Allow-Headers on /models only permits:
  // Content-Type, Authorization, X-Api-Key, X-Opencode-Org-Id
  if (apiKey && apiKey.trim().length > 0) {
    xhr.setRequestHeader("Authorization", "Bearer " + apiKey.trim());
  }
  xhr.ontimeout = function() {
    callback("OpenCode model fetch timed out", null);
  };
  xhr.onreadystatechange = function() {
    if (xhr.readyState !== 4) return;
    if (xhr.status === 200) {
      try {
        var body = JSON.parse(xhr.responseText);
        var raw = body.data || [];
        var ids = [];
        for (var i = 0; i < raw.length; i++) {
          if (raw[i] && raw[i].id && raw[i].id !== "test") {
            ids.push(raw[i].id);
          }
        }
        if (ids.length > 0) {
          callback(null, ids);
          return;
        }
        callback("No models returned from OpenCode endpoint", null);
      } catch (e) {
        callback("Failed to parse OpenCode models: " + e.message, null);
      }
    } else {
      callback(formatOpenCodeHttpError(xhr, "Failed to fetch OpenCode models"), null);
    }
  };
  xhr.send();
}
