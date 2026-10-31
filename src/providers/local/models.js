import { localUrl, describeLocalError } from "./endpoint.js";

// No curated list: local model names are machine-specific. An empty list makes
// the Settings picker fall back to "Other…" so the user can type the id that
// their server reports, and models are auto-fetched once an endpoint is saved.
export var STATIC_LOCAL_MODELS = [];

export function normalizeLocalModelId(raw) {
  return String(raw == null ? "" : raw).trim().replace(/\/+$/, "");
}

export function fetchLocalModels(endpoint, apiKey, callback) {
  var url = localUrl(endpoint, "/models");
  var key = String(apiKey || "").trim();

  var xhr = new XMLHttpRequest();
  var settled = false;

  function done(err, models) {
    if (settled) return;
    settled = true;
    callback(err, models);
  }

  xhr.open("GET", url);
  xhr.timeout = 20000;
  xhr.__url = url;
  // Never send an empty bearer: some servers reject it.
  if (key) xhr.setRequestHeader("Authorization", "Bearer " + key);

  xhr.ontimeout = function() {
    done("Local model fetch timed out", null);
  };

  xhr.onerror = function() {
    done(describeLocalError({ status: 0, __url: url }, "Local model fetch"), null);
  };

  xhr.onreadystatechange = function() {
    if (xhr.readyState !== 4) return;
    // Timed-out/failed requests reach DONE with status 0 before their event.
    if (xhr.status === 0) return;
    if (xhr.status !== 200) {
      done(describeLocalError(xhr, "Local model fetch"), null);
      return;
    }
    var body;
    try {
      body = JSON.parse(xhr.responseText);
    } catch (e) {
      done("Failed to parse the local model list", null);
      return;
    }
    var data = body && body.data;
    if (!Array.isArray(data)) {
      done("Failed to parse the local model list", null);
      return;
    }
    var seen = {};
    var models = [];
    for (var i = 0; i < data.length; i++) {
      var id = data[i] && data[i].id;
      if (typeof id !== "string" || !id || seen[id]) continue;
      seen[id] = true;
      models.push(id);
    }
    models.sort();
    done(null, models);
  };

  xhr.send();

  return {
    xhr: xhr,
    abort: function() {
      settled = true;
      xhr.abort();
    }
  };
}
