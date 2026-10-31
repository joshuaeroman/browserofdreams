import { localUrl, describeLocalError } from "./endpoint.js";
import { normalizeLocalModelId } from "./models.js";
import { readDataLines } from "../sse.js";

var MISSING_MODEL =
  "No local model selected. Open Settings → Providers → Local LLM, fetch models, and pick one.";

// OpenAI Chat Completions against a user-supplied local server. Sends no
// vendor-specific fields (no `reasoning_effort`) and no Authorization header
// unless the user configured a key, so Ollama/llama.cpp/LM Studio all accept it.
export function sendLocalStreaming(opts) {
  var url = localUrl(opts.endpoint, "/chat/completions");
  var apiKey = String(opts.apiKey || "").trim();
  var model = normalizeLocalModelId(opts.model);
  var temperature = opts.temperature !== undefined ? opts.temperature : 0.7;
  var onChunk = opts.onChunk || function() {};
  var onComplete = opts.onComplete || function() {};

  if (!model) {
    onComplete("", MISSING_MODEL);
    return { abort: function() {} };
  }

  var xhr = new XMLHttpRequest();
  var lastIndex = 0;
  var accumulatedText = "";
  var completeCalled = false;

  function sendRequest() {
    xhr.open("POST", url);
    xhr.timeout = 600000;
    xhr.__url = url;
    xhr.setRequestHeader("Content-Type", "application/json");
    if (apiKey) xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
    var payload = {
      model: model,
      messages: opts.messages || [],
      temperature: temperature,
      stream: true
    };
    if (typeof opts.maxTokens === "number" && isFinite(opts.maxTokens)) {
      payload.max_tokens = opts.maxTokens;
    }
    xhr.send(JSON.stringify(payload));
  }

  function processSSE(final) {
    var res = readDataLines(xhr.responseText, lastIndex, final);
    lastIndex = res.index;
    for (var i = 0; i < res.payloads.length; i++) {
      var dataStr = res.payloads[i];
      if (dataStr === "[DONE]") continue;
      try {
        var parsed = JSON.parse(dataStr);
        if (parsed.error && parsed.error.message) {
          finish(parsed.error.message);
          return;
        }
        var choice = parsed.choices && parsed.choices[0];
        if (!choice) continue;
        var delta = choice.delta;
        var content = delta && delta.content;
        // Reasoning deltas are ignored so generated pages contain only content.
        if (typeof content === "string" && content.length > 0) {
          accumulatedText += content;
          onChunk(content, accumulatedText);
        }
      } catch (e) {
        // ignore partial JSON line
      }
    }
  }

  function finish(err) {
    if (completeCalled) return;
    completeCalled = true;
    if (err) {
      onComplete(accumulatedText, err);
      return;
    }
    if (accumulatedText.length > 0) {
      onComplete(accumulatedText, null);
      return;
    }
    var body = String(xhr.responseText || "");
    if (/^\s*data:/m.test(body)) {
      onComplete("", "Empty response from the local model");
      return;
    }
    try {
      var obj = JSON.parse(xhr.responseText);
      var content = obj.choices &&
        obj.choices[0] &&
        obj.choices[0].message &&
        obj.choices[0].message.content;
      if (typeof content === "string" && content.length > 0) {
        onComplete(content, null);
      } else {
        onComplete("", "Empty response from the local model");
      }
    } catch (e) {
      onComplete("", "Failed to parse the local response");
    }
  }

  xhr.ontimeout = function() {
    finish("Local request timed out");
  };

  xhr.onerror = function() {
    finish(describeLocalError({ status: 0, __url: url }, "Local chat"));
  };

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 3) {
      processSSE(false);
    } else if (xhr.readyState === 4) {
      // A timed-out or failed request reaches DONE with status 0 before the
      // timeout/error event; let those handlers report the real cause.
      if (xhr.status === 0) return;
      if (xhr.status === 200) {
        processSSE(true);
        finish(null);
      } else {
        finish(describeLocalError(xhr, "Local chat"));
      }
    }
  };

  sendRequest();

  return {
    xhr: xhr,
    abort: function() {
      completeCalled = true;
      xhr.abort();
    }
  };
}

export function completeLocalOnce(opts, callback) {
  var url = localUrl(opts.endpoint, "/chat/completions");
  var apiKey = String(opts.apiKey || "").trim();
  var model = normalizeLocalModelId(opts.model);
  var temperature = opts.temperature !== undefined ? opts.temperature : 0.5;

  var completed = false;
  function done(err, text) {
    if (completed) return;
    completed = true;
    callback(err, text);
  }

  if (!model) {
    done(MISSING_MODEL, null);
    return { abort: function() {} };
  }

  var xhr = new XMLHttpRequest();

  xhr.open("POST", url);
  xhr.timeout = opts.timeout || 20000;
  xhr.__url = url;
  xhr.setRequestHeader("Content-Type", "application/json");
  if (apiKey) xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
  var payload = {
    model: model,
    messages: opts.messages || [],
    stream: false,
    max_tokens: opts.maxTokens !== undefined ? opts.maxTokens : 180,
    temperature: temperature
  };

  xhr.ontimeout = function() {
    done("Local request timed out", null);
  };

  xhr.onerror = function() {
    done(describeLocalError({ status: 0, __url: url }, "Local chat"), null);
  };

  xhr.onreadystatechange = function() {
    if (xhr.readyState !== 4) return;
    // Timed-out/failed requests reach DONE with status 0 before their event.
    if (xhr.status === 0) return;
    if (xhr.status !== 200) {
      done(describeLocalError(xhr, "Local chat"), null);
      return;
    }
    try {
      var obj = JSON.parse(xhr.responseText);
      var content = obj.choices &&
        obj.choices[0] &&
        obj.choices[0].message &&
        obj.choices[0].message.content;
      done(null, typeof content === "string" ? content : "");
    } catch (e) {
      done("Failed to parse the local response", null);
    }
  };

  xhr.send(JSON.stringify(payload));

  return {
    xhr: xhr,
    abort: function() {
      completed = true;
      xhr.abort();
    }
  };
}
