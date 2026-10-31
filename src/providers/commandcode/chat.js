import { commandCodeUrl, formatCommandCodeHttpError, isRetryableFieldError } from "./route.js";
import { readDataLines } from "./sse.js";

// OpenAI Chat Completions (/chat/completions). No output-token cap is sent:
// OpenAI reasoning models on this proxy reject the legacy `max_tokens` field,
// and the app streams until the model stops. Reasoning deltas are ignored so
// the generated page contains only final content.
export function sendCommandCodeChatStreaming(opts) {
  var url = commandCodeUrl(opts.endpoint, "/chat/completions");
  var apiKey = String(opts.apiKey || "").trim();
  var model = opts.model || "deepseek/deepseek-v4.1-flash";
  var temperature = opts.temperature !== undefined ? opts.temperature : 0.7;
  var reasoningEffort = opts.reasoningEffort;
  var onChunk = opts.onChunk || function() {};
  var onComplete = opts.onComplete || function() {};

  var xhr = new XMLHttpRequest();

  var lastIndex = 0;
  var accumulatedText = "";
  var completeCalled = false;
  var droppedReasoningEffort = false;

  function sendRequest() {
    xhr.open("POST", url);
    xhr.timeout = 600000;
    xhr.setRequestHeader("Content-Type", "application/json");
    if (apiKey) xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
    var payload = {
      model: model,
      messages: opts.messages || [],
      temperature: temperature,
      stream: true
    };
    if (!droppedReasoningEffort && reasoningEffort) {
      payload.reasoning_effort = reasoningEffort;
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
        // Reasoning tokens (delta.reasoning / reasoning_content) are ignored:
        // the page should contain only final content, and streaming them into
        // the page produced invalid HTML comments.
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
      onComplete("", "Empty response from Command Code");
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
        onComplete("", "Empty response from Command Code");
      }
    } catch (e) {
      onComplete("", "Failed to parse Command Code response");
    }
  }

  xhr.ontimeout = function() {
    finish("Command Code request timed out");
  };

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 3) {
      processSSE(false);
    } else if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        processSSE(true);
        finish(null);
      } else if (!droppedReasoningEffort && reasoningEffort &&
                 isRetryableFieldError(xhr, /reasoning_effort/i)) {
        droppedReasoningEffort = true;
        lastIndex = 0;
        accumulatedText = "";
        sendRequest();
      } else {
        finish(formatCommandCodeHttpError(xhr, "Command Code chat"));
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

export function completeCommandCodeChatOnce(opts, callback) {
  var url = commandCodeUrl(opts.endpoint, "/chat/completions");
  var apiKey = String(opts.apiKey || "").trim();
  var model = opts.model || "deepseek/deepseek-v4.1-flash";
  var temperature = opts.temperature !== undefined ? opts.temperature : 0.5;
  var reasoningEffort = opts.reasoningEffort;

  var completed = false;
  function done(err, text) {
    if (completed) return;
    completed = true;
    callback(err, text);
  }

  var xhr = new XMLHttpRequest();
  var droppedReasoningEffort = false;

  function sendRequest() {
    xhr.open("POST", url);
    xhr.timeout = opts.timeout || 20000;
    xhr.setRequestHeader("Content-Type", "application/json");
    if (apiKey) xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
    var payload = {
      model: model,
      messages: opts.messages || [],
      temperature: temperature,
      stream: false
    };
    if (!droppedReasoningEffort && reasoningEffort) {
      payload.reasoning_effort = reasoningEffort;
    }
    xhr.send(JSON.stringify(payload));
  }

  xhr.ontimeout = function() {
    done("Command Code request timed out", null);
  };
  xhr.onerror = function() {
    done("Command Code network error", null);
  };
  xhr.onreadystatechange = function() {
    if (xhr.readyState !== 4) return;
    if (xhr.status === 200) {
      try {
        var data = JSON.parse(xhr.responseText);
        var content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
        done(null, typeof content === "string" ? content : "");
      } catch (e) {
        done("Failed to parse Command Code response", null);
      }
    } else {
      if (!droppedReasoningEffort && reasoningEffort &&
          isRetryableFieldError(xhr, /reasoning_effort/i)) {
        droppedReasoningEffort = true;
        sendRequest();
      } else {
        done(formatCommandCodeHttpError(xhr, "Command Code"), null);
      }
    }
  };

  sendRequest();

  return {
    xhr: xhr,
    abort: function() {
      completed = true;
      xhr.abort();
    }
  };
}
