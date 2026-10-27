export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0;
    var v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export var activeOpenCodeSessionId = uuidv4();

export function productFromEndpoint(endpoint, providerName) {
  var name = String(providerName || "").toLowerCase();
  if (name.indexOf("opencode") !== -1 && name.indexOf("go") !== -1)
    return "go";
  var ep = String(endpoint || "").toLowerCase();
  if (ep.indexOf("/zen/go") !== -1 || ep.indexOf("/inference/go") !== -1)
    return "go";
  return "zen";
}

export function npmToProtocol(npm) {
  if (npm === "@ai-sdk/openai")
    return "responses";
  if (npm === "@ai-sdk/anthropic")
    return "anthropic";
  if (npm === "@ai-sdk/google")
    return "gemini";
  return "chat";
}

export function resolveProtocol(product, modelId, overlay) {
  var id = String(modelId || "").toLowerCase();
  var prod = product === "go" ? "go" : "zen";
  if (!id)
    return "chat";
  if (overlay) {
    if (overlay[id])
      return overlay[id];
    if (modelId && overlay[modelId])
      return overlay[modelId];
  }
  if (id.indexOf("gpt-") === 0 || id.indexOf("grok-") === 0 || id.indexOf("muse-spark-") === 0)
    return "responses";
  if (id.indexOf("gemini-") === 0)
    return "gemini";
  if (id.indexOf("claude-") === 0)
    return "anthropic";
  // Official tables list qwen3.N-* on /messages. Do not use a bare "qwen3"
  // prefix — Zen also serves qwen3-coder on chat completions.
  if (id.indexOf("qwen3.") === 0)
    return "anthropic";
  if (prod === "go" && id.indexOf("minimax-") === 0)
    return "anthropic";
  return "chat";
}

export var OpenCodeRoute = {
  productFromEndpoint: productFromEndpoint,
  npmToProtocol: npmToProtocol,
  resolveProtocol: resolveProtocol
};

export function sessionHeaders(opts) {
  var h = {};
  if (opts && opts.extraHeaders) {
    for (var k in opts.extraHeaders) {
      if (Object.prototype.hasOwnProperty.call(opts.extraHeaders, k)) {
        h[k] = opts.extraHeaders[k];
      }
    }
  }
  h["x-opencode-session"] = (opts && opts.sessionId) ? opts.sessionId : (activeOpenCodeSessionId || uuidv4());
  return h;
}

export function formatOpenCodeHttpError(xhr, label) {
  if (xhr.status === 0) {
    return label + " blocked by browser CORS policy (HTTP 0). " +
      "OpenCode (opencode.ai) does not include Access-Control-Allow-Origin headers on inference POST endpoints. " +
      "Please enable a CORS-unblocking browser extension (e.g. 'Allow CORS: Access-Control-Allow-Origin' or 'CORS Unblock') for https://opencode.ai.";
  }
  var msg = label + " error (HTTP " + xhr.status + ")";
  try {
    var errBody = JSON.parse(xhr.responseText);
    if (errBody && errBody.error && errBody.error.message) {
      msg += ": " + errBody.error.message;
    }
  } catch (e) {
    if (xhr.responseText) {
      msg += ": " + xhr.responseText.substring(0, 200);
    }
  }
  return msg;
}
