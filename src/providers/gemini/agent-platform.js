export const NON_CHAT_MARKERS = [
  "-tts", "embedding", "image", "nano-banana", "live", "native-audio",
  "lyria", "veo", "imagen"
];

export const IMAGE_MARKERS = [
  "image", "nano-banana", "imagen"
];

export function isChatModel(modelId) {
  var lower = String(modelId || "").toLowerCase();
  for (var i = 0; i < NON_CHAT_MARKERS.length; i++) {
    if (lower.indexOf(NON_CHAT_MARKERS[i]) !== -1)
      return false;
  }
  return true;
}

export function isImageModel(modelId) {
  var lower = String(modelId || "").toLowerCase();
  for (var i = 0; i < IMAGE_MARKERS.length; i++) {
    if (lower.indexOf(IMAGE_MARKERS[i]) !== -1)
      return true;
  }
  return false;
}

export const EXPRESS_HOST = "://aiplatform.googleapis.com";
export const PROJECT_PROBE_MODEL = "plasmallm-project-probe";
export const COUNT_TOKENS_BODY = JSON.stringify({
  contents: [{ role: "user", parts: [{ text: "hi" }] }]
});

var projectByKey = {};

export function projectFromError(text) {
  var m = /projects\/(\d+)\//.exec(String(text || ""));
  return m ? m[1] : "";
}

export function usesExpressKey(opts, apiKey, baseUrl) {
  if (!opts || opts.geminiAuthMethod !== "agentplatform" || opts.geminiVertexAuthType === "gcloud")
    return false;
  if (!apiKey || apiKey.indexOf("ya29.") === 0)
    return false;
  if (opts.geminiProjectId && String(opts.geminiProjectId).trim().length > 0)
    return false;
  return String(baseUrl || "").indexOf(EXPRESS_HOST) !== -1;
}

export function cachedProject(apiKey) {
  return projectByKey[apiKey] || "";
}

export function modelUrl(baseUrl, projectId, location, model, method) {
  if (projectId && projectId.length > 0) {
    return baseUrl +
      "/v1/projects/" + encodeURIComponent(projectId) +
      "/locations/" + encodeURIComponent(location || "global") +
      "/publishers/google/models/" + encodeURIComponent(model) +
      ":" + method;
  }
  return baseUrl + "/v1/publishers/google/models/" + encodeURIComponent(model) + ":" + method;
}

export function discoverProject(baseUrl, apiKey, callback) {
  var cancelled = false;
  var xhr = new XMLHttpRequest();
  xhr.open("POST", modelUrl(baseUrl, "", "", PROJECT_PROBE_MODEL, "countTokens"));
  xhr.timeout = 15000;
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("x-goog-api-key", apiKey);
  function done() {
    if (cancelled) return;
    cancelled = true;
    var project = projectFromError(xhr.responseText);
    if (project) projectByKey[apiKey] = project;
    callback(project);
  }
  xhr.ontimeout = done;
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) done();
  };
  xhr.send(COUNT_TOKENS_BODY);
  return {
    abort: function() {
      cancelled = true;
      xhr.abort();
    }
  };
}

export function probeModels(ids, urlFor, apiKey, callback) {
  if (!ids || ids.length === 0) {
    callback([]);
    return;
  }
  var reachable = [];
  var pending = ids.length;
  function settle(index, ok) {
    reachable[index] = ok;
    pending--;
    if (pending === 0) {
      callback(ids.filter(function(id, i) { return reachable[i]; }));
    }
  }
  for (var i = 0; i < ids.length; i++) {
    (function(index) {
      var xhr = new XMLHttpRequest();
      var settled = false;
      function done() {
        if (settled) return;
        settled = true;
        settle(index, xhr.status !== 404);
      }
      xhr.open("POST", urlFor(ids[index]));
      xhr.timeout = 15000;
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("x-goog-api-key", apiKey);
      xhr.ontimeout = done;
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) done();
      };
      xhr.send(COUNT_TOKENS_BODY);
    })(i);
  }
}

export function verifyModels(baseUrl, apiKey, location, ids, callback) {
  if (!ids || ids.length === 0) {
    callback([]);
    return;
  }
  function probeAll(projectId) {
    probeModels(ids, function(id) {
      return modelUrl(baseUrl, projectId, location, id, "countTokens");
    }, apiKey, callback);
  }
  var cached = cachedProject(apiKey);
  if (cached) {
    probeAll(cached);
  } else {
    discoverProject(baseUrl, apiKey, probeAll);
  }
}

export function verifyStudioModels(baseUrl, apiKey, ids, callback) {
  probeModels(ids, function(id) {
    return baseUrl + "/v1beta/models/" + encodeURIComponent(id) + ":countTokens";
  }, apiKey, callback);
}

export const AgentPlatform = {
  NON_CHAT_MARKERS,
  IMAGE_MARKERS,
  isChatModel,
  isImageModel,
  projectFromError,
  usesExpressKey,
  cachedProject,
  modelUrl,
  discoverProject,
  probeModels,
  verifyModels,
  verifyStudioModels
};
