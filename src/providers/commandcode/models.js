import { commandCodeUrl, cacheCommandCodeModelRoutes, formatCommandCodeHttpError, DEFAULT_COMMANDCODE_MODEL } from "./route.js";

// Curated fallback shown before the live /models list is fetched. The live list
// is authoritative and includes every model plus its supported_endpoints.
export const STATIC_COMMANDCODE_MODELS = [
  "deepseek/deepseek-v4.1-flash",
  "claude-sonnet-5-5",
  "claude-sonnet-5",
  "claude-sonnet-4-6",
  "claude-opus-5-5",
  "claude-opus-5",
  "claude-haiku-5-5",
  "gpt-6-astra",
  "gpt-6.1-sol",
  "gpt-6-sol",
  "gpt-6-luna",
  "gpt-5.6-sol",
  "gpt-5.4",
  "gpt-5.4-mini",
  "gpt-5.3-codex",
  "deepseek/deepseek-v4-pro",
  "deepseek/deepseek-v4-flash",
  "moonshotai/Kimi-K3.1-Pro",
  "moonshotai/Kimi-K3",
  "moonshotai/Kimi-K2.7-Code",
  "z-ai/glm-5.3-flash",
  "zai-org/GLM-5.3",
  "zai-org/GLM-5.2",
  "zai-org/GLM-5.1",
  "MiniMaxAI/MiniMax-M3",
  "minimax/minimax-m3.1-flash",
  "xiaomi/mimo-v2.6-pro",
  "xiaomi/mimo-v2.6-flash",
  "Qwen/Qwen3.8-Max",
  "Qwen/Qwen3.8-Flash",
  "Qwen/Qwen3.7-Plus",
  "google/gemini-4-argon",
  "google/gemini-3.8-flash",
  "xai/grok-4.7",
  "xai/grok-4.6",
  "mistral/mistral-large-4",
  "inclusionai/ling-3.1-flash",
  "stealth/glyph-cluster:free",
  "reflection/beam:free"
];

function slugifyModelPart(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function normalizeCommandCodeModelId(rawModel, knownIds) {
  var s = String(rawModel || "").trim();
  if (!s) return "";
  s = s.split("?")[0].split("#")[0];
  var isUrl = /^https?:\/\//i.test(s);
  if (isUrl) {
    s = s.replace(/\/+$/, "");
    s = s.substring(s.lastIndexOf("/") + 1);
  }
  s = s.replace(/^\/+|\/+$/g, "");
  if (!s) return "";
  if (!isUrl || !Array.isArray(knownIds) || knownIds.length === 0) return s;
  if (knownIds.indexOf(s) !== -1) return s;
  var wanted = slugifyModelPart(s);
  for (var i = 0; i < knownIds.length; i++) {
    var id = String(knownIds[i] || "");
    var modelPart = id.substring(id.lastIndexOf("/") + 1);
    if (modelPart && slugifyModelPart(modelPart) === wanted) return id;
  }
  return s;
}

export function fetchCommandCodeModels(endpoint, apiKey, callback) {
  var settled = false;
  function done(err, models) {
    if (settled) return;
    settled = true;
    callback(err, models);
  }
  var xhr = new XMLHttpRequest();
  xhr.open("GET", commandCodeUrl(endpoint, "/models"));
  xhr.timeout = 20000;
  if (apiKey && String(apiKey).trim()) {
    xhr.setRequestHeader("Authorization", "Bearer " + String(apiKey).trim());
  }
  xhr.ontimeout = function() {
    done("Command Code model fetch timed out", null);
  };
  xhr.onerror = function() {
    done("Command Code network error while fetching models", null);
  };
  xhr.onreadystatechange = function() {
    if (xhr.readyState !== 4) return;
    if (xhr.status === 200) {
      try {
        var body = JSON.parse(xhr.responseText);
        var raw = body.data || [];
        cacheCommandCodeModelRoutes(raw);
        var ids = [];
        for (var i = 0; i < raw.length; i++) {
          if (raw[i] && raw[i].id) ids.push(raw[i].id);
        }
        var preferred = DEFAULT_COMMANDCODE_MODEL;
        var preferredIndex = ids.indexOf(preferred);
        if (preferredIndex > 0) {
          ids.splice(preferredIndex, 1);
          ids.unshift(preferred);
        }
        if (ids.length > 0) {
          done(null, ids);
          return;
        }
        done("No models returned from Command Code", null);
      } catch (e) {
        done("Failed to parse Command Code models: " + e.message, null);
      }
    } else {
      done(formatCommandCodeHttpError(xhr, "Failed to fetch Command Code models"), null);
    }
  };
  xhr.send();
}
