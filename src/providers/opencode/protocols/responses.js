import { formatOpenCodeHttpError } from "../route.js";

// OpenAI Responses API (/responses) message translator & SSE parser
export function translateResponsesMessages(neutralMessages) {
  var input = [];
  for (var i = 0; i < (neutralMessages || []).length; i++) {
    var m = neutralMessages[i];
    if (m.role === "system") {
      if (typeof m.content === "string" && m.content.length > 0) {
        input.push({
          type: "message",
          role: "system",
          content: [{ type: "input_text", text: m.content }]
        });
      }
    } else if (m.role === "assistant") {
      if (typeof m.content === "string" && m.content.length > 0) {
        input.push({
          type: "message",
          role: "assistant",
          content: [{ type: "output_text", text: m.content }]
        });
      }
    } else if (m.role === "user") {
      input.push({
        type: "message",
        role: "user",
        content: [{ type: "input_text", text: typeof m.content === "string" ? m.content : "" }]
      });
    }
  }
  return { input: input };
}

export function parseResponsesSSEChunks(buffer, lastIndex) {
  var tokens = [];
  var searchFrom = lastIndex;
  while (true) {
    var nlPos = buffer.indexOf("\n", searchFrom);
    if (nlPos === -1) break;
    var line = buffer.substring(searchFrom, nlPos).replace(/\r$/, "");
    searchFrom = nlPos + 1;
    if (line === "" || line.substring(0, 6) !== "data: ") continue;
    var payload = line.substring(6);
    if (payload === "[DONE]") {
      tokens.push({ done: true });
      continue;
    }
    try {
      var obj = JSON.parse(payload);
      switch (obj.type) {
        case "response.output_text.delta":
          if (typeof obj.delta === "string" && obj.delta.length > 0) {
            tokens.push({ content: obj.delta });
          }
          break;
        case "response.output_text.done":
          if (typeof obj.text === "string" && obj.text.length > 0) {
            tokens.push({ content_full: obj.text });
          }
          break;
        case "response.completed":
          tokens.push({ done: true });
          break;
        case "response.failed":
        case "error":
        case "response.error":
          tokens.push({ error: (obj.error && obj.error.message) || obj.message || "stream error" });
          break;
        default:
          break;
      }
    } catch (e) {
      // ignore unparseable chunk
    }
  }
  return { tokens: tokens, newIndex: searchFrom };
}

export function sendOpenAIResponsesStreaming(opts) {
  var endpoint = (opts.endpoint || "https://opencode.ai/zen/v1").replace(/\/+$/, "");
  var apiKey = opts.apiKey || "";
  var model = opts.model || "gpt-5.4";
  var temperature = opts.temperature !== undefined ? opts.temperature : 0.7;
  var tempFloat = temperature > 2 ? temperature / 100.0 : temperature;
  var maxTokens = opts.maxTokens || 16384;
  var onChunk = opts.onChunk || function() {};
  var onComplete = opts.onComplete || function() {};

  var translated = translateResponsesMessages(opts.messages || []);
  var xhr = new XMLHttpRequest();
  xhr.open("POST", endpoint + "/responses");
  xhr.timeout = 600000;
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Accept", "text/event-stream");
  if (apiKey) {
    xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
  }
  if (opts && opts.extraHeaders) {
    for (var h in opts.extraHeaders) {
      if (Object.prototype.hasOwnProperty.call(opts.extraHeaders, h)) {
        xhr.setRequestHeader(h, opts.extraHeaders[h]);
      }
    }
  }

  var lastParseIndex = 0;
  var accumulatedText = "";
  var streamError = null;
  var completeCalled = false;

  function processBuffer() {
    var res = parseResponsesSSEChunks(xhr.responseText, lastParseIndex);
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
      } else if (typeof tok.content_full === "string" && accumulatedText.length === 0) {
        accumulatedText = tok.content_full;
        onChunk(tok.content_full, accumulatedText);
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
    try {
      var response = JSON.parse(xhr.responseText);
      var text = "";
      if (response.output && response.output.length) {
        for (var i = 0; i < response.output.length; i++) {
          var item = response.output[i];
          if (item.type === "message" && item.content) {
            for (var ci = 0; ci < item.content.length; ci++) {
              var c = item.content[ci];
              if (c.type === "output_text" && typeof c.text === "string") {
                text += c.text;
              }
            }
          }
        }
      }
      if (text.length > 0) {
        onComplete(text, null);
      } else {
        onComplete("", "Empty response from Responses endpoint");
      }
    } catch (e) {
      onComplete("", "Failed to parse Responses payload: " + e.message);
    }
  }

  xhr.ontimeout = function() {
    finish("OpenAI Responses request timed out");
  };

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 3) {
      processBuffer();
    } else if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        processBuffer();
        finish(streamError);
      } else {
        finish(formatOpenCodeHttpError(xhr, "OpenCode Responses"));
      }
    }
  };

  xhr.send(JSON.stringify({
    model: model,
    input: translated.input,
    temperature: tempFloat,
    max_output_tokens: maxTokens,
    stream: true
  }));

  return {
    xhr: xhr,
    abort: function() {
      completeCalled = true;
      xhr.abort();
    }
  };
}
