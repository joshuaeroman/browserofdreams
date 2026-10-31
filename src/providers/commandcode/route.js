export var COMMANDCODE_BASE = "https://api.commandcode.ai/provider/v1";
export var DEFAULT_COMMANDCODE_MODEL = "deepseek/deepseek-v4.1-flash";

// The browser CORS preflight on api.commandcode.ai allows exactly
// "Content-Type,Authorization". Every request from this app MUST stay inside
// that header set: no anthropic-version, no x-api-key, no x-cmd-zdr.
export function commandCodeUrl(endpoint, path) {
  var base = String(endpoint || COMMANDCODE_BASE).replace(/\/+$/, "");
  if (/\/(chat\/completions|messages|responses|models|systemone)$/.test(base)) {
    base = base.replace(/\/(chat\/completions|messages|responses|models|systemone)$/, "");
  }
  return base + path;
}

var modelRoutes = Object.create(null);

export function cacheCommandCodeModelRoutes(rawModels) {
  if (!Array.isArray(rawModels)) return;
  for (var i = 0; i < rawModels.length; i++) {
    var m = rawModels[i];
    if (m && m.id && Array.isArray(m.supported_endpoints)) {
      modelRoutes[m.id] = m.supported_endpoints.slice();
    }
  }
}

export function resolveCommandCodeProtocol(modelId) {
  var id = String(modelId || "");
  var routes = modelRoutes[id];
  if (routes) {
    if (routes.indexOf("/messages") !== -1) return "messages";
    if (routes.indexOf("/chat/completions") !== -1) return "chat";
  }
  // Claude models answer on /messages only; every open and OpenAI model in the
  // live catalog answers on /chat/completions.
  if (/^claude/i.test(id)) return "messages";
  return "chat";
}

export function isRetryableFieldError(xhr, pattern) {
  return xhr.status === 400 && pattern.test(String(xhr.responseText || ""));
}

export function formatCommandCodeHttpError(xhr, label) {
  var msg = (label || "Command Code error") + " (HTTP " + xhr.status + ")";
  if (xhr.status === 0) {
    return msg + ": request blocked before a response. Check the network tab and that " +
      "https://api.commandcode.ai is reachable.";
  }
  try {
    var body = JSON.parse(xhr.responseText);
    var err = body && body.error;
    if (err && typeof err === "object" && err.message) {
      msg += ": " + err.message;
    } else if (typeof err === "string") {
      msg += ": " + err;
    }
  } catch (e) {
    if (xhr.responseText) {
      msg += ": " + xhr.responseText.substring(0, 200);
    }
  }
  return msg;
}
