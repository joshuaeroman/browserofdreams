import { AgentPlatform } from "./agent-platform.js";
import { setGeminiHeaders, formatGeminiError } from "./messages.js";

export const STATIC_VERTEX_GEMINI_MODELS = [
  "gemini-3.8-flash",
  "gemini-4-argon",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-pro-preview",
  "gemini-3.1-pro-preview-customtools",
  "gemini-3.1-flash-lite",
  "gemini-3-flash-preview",
  "gemini-omni-flash-preview",
  "gemini-2.5-pro",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite"
];

export const STATIC_GEMINI_IMAGE_MODELS = [
  "gemini-3.1-flash-image",
  "gemini-3.1-flash-lite-image",
  "gemini-3-pro-image",
  "gemini-nano-banana-2.1",
  "gemini-2.5-flash-image"
];

export function fetchModelsDev(providerId, filterFn, fallbackList, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://models.dev/api.json");
  xhr.timeout = 10000;
  xhr.ontimeout = function() {
    callback(null, fallbackList, 200);
  };
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          var data = JSON.parse(xhr.responseText);
          var providers = Array.isArray(providerId) ? providerId : [providerId, "google"];
          var seen = {};
          var ids = [];
          for (var p = 0; p < providers.length; p++) {
            var entry = data[providers[p]];
            if (entry && entry.models) {
              var keys = Object.keys(entry.models);
              for (var k = 0; k < keys.length; k++) {
                if (!seen[keys[k]]) {
                  seen[keys[k]] = true;
                  ids.push(keys[k]);
                }
              }
            }
          }
          if (filterFn) ids = ids.filter(filterFn);
          if (ids.length > 0) {
            callback(null, ids, 200);
            return;
          }
        } catch (e) {
          // ignore parse error
        }
      }
      callback(null, fallbackList, 200);
    }
  };
  xhr.send();
}

export function fetchGeminiModels(endpoint, apiKey, opts, callback) {
  if (typeof opts === "function") {
    callback = opts;
    opts = null;
  }

  var location = (opts && opts.geminiLocation) || "global";
  var baseUrl = String(endpoint || "https://aiplatform.googleapis.com").replace(/\/+$/, "");

  if (location !== "global" && baseUrl.indexOf("://aiplatform.googleapis.com") !== -1) {
    baseUrl = baseUrl.replace("://", "://" + location + "-");
  }

  var isAgentPlatform = opts && opts.geminiAuthMethod === "agentplatform";
  var isGcloud = opts && opts.geminiVertexAuthType === "gcloud";
  var projectId = (opts && opts.geminiProjectId ? opts.geminiProjectId.trim() : "");

  var includeImages = !!(opts && opts.includeImageModels);

  var geminiFilter = function(m) {
    var lower = m.toLowerCase();
    if (lower.indexOf("gemini") === -1) return false;
    if (includeImages) {
      return AgentPlatform.isChatModel(m) || AgentPlatform.isImageModel(m);
    }
    return AgentPlatform.isChatModel(m);
  };

  function splitAndFinish(err, allModels, status) {
    if (err || !allModels) {
      callback(err, allModels, status, []);
      return;
    }
    if (!includeImages) {
      callback(null, allModels, status, STATIC_GEMINI_IMAGE_MODELS.slice());
      return;
    }
    var chatList = [];
    var imageList = [];
    for (var i = 0; i < allModels.length; i++) {
      var id = allModels[i];
      if (AgentPlatform.isImageModel(id)) {
        imageList.push(id);
      } else if (AgentPlatform.isChatModel(id)) {
        chatList.push(id);
      }
    }
    if (chatList.length === 0) chatList = STATIC_VERTEX_GEMINI_MODELS.slice();
    if (imageList.length === 0) imageList = STATIC_GEMINI_IMAGE_MODELS.slice();
    callback(null, chatList, status, imageList);
  }

  var fallbackCombined = includeImages
    ? STATIC_VERTEX_GEMINI_MODELS.concat(STATIC_GEMINI_IMAGE_MODELS)
    : STATIC_VERTEX_GEMINI_MODELS;

  if (isAgentPlatform) {
    if (isGcloud && projectId.length > 0) {
      var xhr = new XMLHttpRequest();
      var url = baseUrl + "/v1beta1/projects/" + encodeURIComponent(projectId) +
        "/locations/" + encodeURIComponent(location) + "/publishers/google/models";
      xhr.open("GET", url);
      xhr.timeout = 15000;
      setGeminiHeaders(xhr, apiKey, opts);

      xhr.ontimeout = function() {
        fetchModelsDev("google-vertex", geminiFilter, fallbackCombined, splitAndFinish);
      };

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            try {
              var response = JSON.parse(xhr.responseText);
              var models = [];
              var rawModels = response.publisherModels || response.models || [];
              for (var i = 0; i < rawModels.length; i++) {
                var modelItem = rawModels[i];
                var name = modelItem.name || "";
                if (name.indexOf("models/") === 0) name = name.substring(7);
                else if (name.indexOf("publishers/google/models/") !== -1) {
                  name = name.split("/").pop();
                }
                if (geminiFilter(name)) {
                  models.push(name);
                }
              }
              if (models.length > 0) {
                splitAndFinish(null, models, xhr.status);
                return;
              }
            } catch (e) {
              // fallback
            }
          }
          fetchModelsDev("google-vertex", geminiFilter, fallbackCombined, splitAndFinish);
        }
      };
      xhr.send();
      return;
    }

    if (AgentPlatform.usesExpressKey(opts, apiKey, baseUrl)) {
      fetchModelsDev("google-vertex", geminiFilter, fallbackCombined, function(err, ids, status) {
        AgentPlatform.verifyModels(baseUrl, apiKey, location, ids, function(reachable) {
          splitAndFinish(null, reachable.length > 0 ? reachable : ids, status);
        });
      });
      return;
    }

    fetchModelsDev("google-vertex", geminiFilter, fallbackCombined, splitAndFinish);
    return;
  }

  // Google AI Studio
  var studioXhr = new XMLHttpRequest();
  var studioUrl = baseUrl + "/v1beta/models?pageSize=1000";
  studioXhr.open("GET", studioUrl);
  studioXhr.timeout = 30000;
  setGeminiHeaders(studioXhr, apiKey, opts);

  studioXhr.ontimeout = function() {
    callback("Request timed out after 30 seconds", null);
  };

  studioXhr.onreadystatechange = function() {
    if (studioXhr.readyState === 4) {
      if (studioXhr.status === 200) {
        try {
          var response = JSON.parse(studioXhr.responseText);
          var models = [];
          var rawModels = response.models || [];
          for (var i = 0; i < rawModels.length; i++) {
            var m = rawModels[i];
            var name = m.name || "";
            if (name.indexOf("models/") === 0) name = name.substring(7);
            var methods = m.supportedGenerationMethods || [];
            if (methods.indexOf("generateContent") !== -1 &&
                (AgentPlatform.isChatModel(name) || (includeImages && AgentPlatform.isImageModel(name)))) {
              models.push(name);
            }
          }
          if (!apiKey || apiKey.indexOf("ya29.") === 0 || models.length === 0) {
            splitAndFinish(null, models, studioXhr.status);
            return;
          }
          var listStatus = studioXhr.status;
          AgentPlatform.verifyStudioModels(baseUrl, apiKey, models, function(usable) {
            splitAndFinish(null, usable.length > 0 ? usable : models, listStatus);
          });
        } catch (e) {
          callback("Failed to parse models: " + e.message, null, studioXhr.status);
        }
      } else {
        callback(formatGeminiError(studioXhr, "Failed to fetch models"), null, studioXhr.status);
      }
    }
  };

  studioXhr.send();
}
