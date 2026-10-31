import { commandCodeUrl, formatCommandCodeHttpError, isRetryableFieldError } from "./route.js";
import { readDataLines } from "./sse.js";

// Anthropic Messages (/messages) for Claude models. Command Code authenticates
// with `Authorization: Bearer` and does not require `anthropic-version`; sending
// it would break CORS because the preflight only allows Content-Type and
// Authorization.
export function translateCommandCodeMessages(neutralMessages) {
  var systemText = "";
  var out = [];
  for (var i = 0; i < (neutralMessages || []).length; i++) {
    var m = neutralMessages[i];
    if (m.role === "system") {
      if (typeof m.content === "string" && m.content.length > 0) {
        systemText += (systemText.length > 0 ? "\n\n" : "") + m.content;
      }
    } else if (m.role === "assistant" || m.role === "user") {
      out.push({
        role: m.role,
        content: typeof m.content === "string" ? m.content : ""
      });
    }
  }
  return { system: systemText, messages: out };
}

export function parseCommandCodeMessageSSE(buffer, lastIndex, final) {
  var res = readDataLines(buffer, lastIndex, final);
  var tokens = [];
  for (var i = 0; i < res.payloads.length; i++) {
    try {
      var obj = JSON.parse(res.payloads[i]);
      switch (obj.type) {
        case "content_block_delta":
          if (obj.delta && obj.delta.type === "text_delta" && typeof obj.delta.text === "string") {
            tokens.push({ content: obj.delta.text });
          }
          break;
        case "message_stop":
          tokens.push({ done: true });
          break;
        case "error":
          tokens.push({ error: (obj.error && obj.error.message) || "stream error" });
          break;
        default:
          break;
      }
    } catch (e) {
      // ignore unparseable chunk
    }
  }
  return { tokens: tokens, newIndex: res.index };
}

function buildMessageBody(opts, stream, stage) {
  var translated = translateCommandCodeMessages(opts.messages || []);
  var body = {
    model: opts.model || "claude-sonnet-5-5",
    max_tokens: opts.maxTokens || 16384,
    messages: translated.messages,
    stream: stream
  };
  if (translated.system) body.system = translated.system;
  var effort = opts.reasoningEffort || "off";
  var attempt = stage || 0;
  if (attempt === 0) {
    body.thinking = effort === "off" ? { type: "disabled" } : { type: "adaptive" };
  }
  if (effort !== "off" && attempt < 2) {
    body.output_config = { effort: effort };
  }
  return body;
}

function extractMessageText(response) {
  var text = "";
  if (response && response.content && response.content.length) {
    for (var i = 0; i < response.content.length; i++) {
      var block = response.content[i];
      if (block.type === "text" && typeof block.text === "string") {
        text += block.text;
      }
    }
  }
  return text;
}

export function sendCommandCodeMessagesStreaming(opts) {
  var url = commandCodeUrl(opts.endpoint, "/messages");
  var apiKey = String(opts.apiKey || "").trim();
  var onChunk = opts.onChunk || function() {};
  var onComplete = opts.onComplete || function() {};

  var xhr = new XMLHttpRequest();

  var lastParseIndex = 0;
  var accumulatedText = "";
  var streamError = null;
  var completeCalled = false;
  var effort = opts.reasoningEffort || "off";
  var maxAttempt = effort === "off" ? 1 : 2;
  var attempt = 0;

  function sendRequest() {
    xhr.open("POST", url);
    xhr.timeout = 600000;
    xhr.setRequestHeader("Content-Type", "application/json");
    if (apiKey) xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
    xhr.send(JSON.stringify(buildMessageBody(opts, true, attempt)));
  }

  function processBuffer(final) {
    var res = parseCommandCodeMessageSSE(xhr.responseText, lastParseIndex, final);
    lastParseIndex = res.newIndex;
    for (var i = 0; i < res.tokens.length; i++) {
      var tok = res.tokens[i];
      if (tok.error) {
        streamError = tok.error;
        continue;
      }
      if (tok.content) {
        accumulatedText += tok.content;
        onChunk(tok.content, accumulatedText);
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
      onComplete("", "Empty response from Command Code messages");
      return;
    }
    try {
      var text = extractMessageText(JSON.parse(xhr.responseText));
      if (text.length > 0) {
        onComplete(text, null);
      } else {
        onComplete("", "Empty response from Command Code messages");
      }
    } catch (e) {
      onComplete("", "Failed to parse Command Code messages response");
    }
  }

  xhr.ontimeout = function() {
    finish("Command Code messages request timed out");
  };

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 3) {
      processBuffer(false);
    } else if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        processBuffer(true);
        finish(streamError);
      } else if (attempt < maxAttempt &&
                 isRetryableFieldError(xhr, /thinking|output_config|effort/i)) {
        attempt++;
        lastParseIndex = 0;
        accumulatedText = "";
        streamError = null;
        sendRequest();
      } else {
        finish(formatCommandCodeHttpError(xhr, "Command Code messages"));
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

export function completeCommandCodeMessagesOnce(opts, callback) {
  var url = commandCodeUrl(opts.endpoint, "/messages");
  var apiKey = String(opts.apiKey || "").trim();

  var completed = false;
  function done(err, text) {
    if (completed) return;
    completed = true;
    callback(err, text);
  }

  var xhr = new XMLHttpRequest();
  var effort = opts.reasoningEffort || "off";
  var maxAttempt = effort === "off" ? 1 : 2;
  var attempt = 0;

  function sendRequest() {
    xhr.open("POST", url);
    xhr.timeout = opts.timeout || 20000;
    xhr.setRequestHeader("Content-Type", "application/json");
    if (apiKey) xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
    xhr.send(JSON.stringify(buildMessageBody(opts, false, attempt)));
  }

  xhr.ontimeout = function() {
    done("Command Code messages request timed out", null);
  };
  xhr.onerror = function() {
    done("Command Code network error", null);
  };
  xhr.onreadystatechange = function() {
    if (xhr.readyState !== 4) return;
    if (xhr.status === 200) {
      try {
        done(null, extractMessageText(JSON.parse(xhr.responseText)));
      } catch (e) {
        done("Failed to parse Command Code messages response", null);
      }
    } else {
      if (attempt < maxAttempt &&
          isRetryableFieldError(xhr, /thinking|output_config|effort/i)) {
        attempt++;
        sendRequest();
      } else {
        done(formatCommandCodeHttpError(xhr, "Command Code messages"), null);
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
