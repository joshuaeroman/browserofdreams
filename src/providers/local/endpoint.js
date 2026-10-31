export var DEFAULT_LOCAL_ENDPOINT = "http://localhost:11434/v1";

var ENDPOINT_SUFFIX = /\/+(?:chat\/completions|completions|models)\/?$/i;

// Accepts "localhost:11434", "http://127.0.0.1:1234/v1/", "…/v1/chat/completions".
// Always returns scheme://host[:port]/<path>, defaulting the path to /v1.
export function normalizeLocalEndpoint(raw) {
  var s = String(raw == null ? "" : raw).trim().split("?")[0].split("#")[0];
  if (!s) return DEFAULT_LOCAL_ENDPOINT;
  s = s.replace(/\/+$/, "").replace(ENDPOINT_SUFFIX, "").replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(s)) s = "http://" + s;
  var m = s.match(/^([a-z]+:\/\/[^/]+)(\/.*)?$/i);
  if (!m) return DEFAULT_LOCAL_ENDPOINT;
  // Reject a host that is empty or truncated ("http://" and "http:/host"
  // normalize to "http://http:…" above; both must fall back to the default).
  var host = m[1].replace(/^[a-z]+:\/\//i, "");
  if (!host || /:$/.test(host)) return DEFAULT_LOCAL_ENDPOINT;
  var path = m[2] || "";
  if (!path || path === "/") path = "/v1";
  var candidate = m[1] + path;
  // xhr.open() throws SyntaxError on an unparsable URL, which would strand the
  // caller (settings panel stuck on "Fetching", dream request unwinds). Fall
  // back to the default for bad ports, spaces, and other illegal authorities.
  try {
    new URL(candidate);
  } catch (e) {
    return DEFAULT_LOCAL_ENDPOINT;
  }
  return candidate;
}

export function localUrl(endpoint, path) {
  return normalizeLocalEndpoint(endpoint) + path;
}

// Error text for XHR failures. status 0 means blocked/unreachable.
export function describeLocalError(xhr, label) {
  if (xhr.status === 0) {
    return label + ": cannot reach the local server at " + String(xhr.__url || "the configured endpoint") +
      ". Is it running? Some servers also reject cross-origin requests — allow this page's origin (Ollama: set OLLAMA_ORIGINS).";
  }
  var msg = label + " (HTTP " + xhr.status + ")";
  try {
    var body = JSON.parse(xhr.responseText);
    var err = body && body.error;
    if (err && typeof err === "object" && err.message) msg += ": " + err.message;
    else if (typeof err === "string") msg += ": " + err;
  } catch (e) {
    if (xhr.responseText) msg += ": " + String(xhr.responseText).substring(0, 200);
  }
  return msg;
}
