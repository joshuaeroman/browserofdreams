import { formatOpenCodeHttpError } from "../route.js";

// Anthropic Messages API (/messages) translator & SSE parser
export function translateAnthropicMessages(neutralMessages) {
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

export function parseAnthropicSSEChunks(buffer, lastIndex) {
  var tokens = [];
  var searchFrom = lastIndex;
  while (true) {
    var nlPos = buffer.indexOf("\n", searchFrom);
    if (nlPos === -1) break;
    var line = buffer.substring(searchFrom, nlPos).replace(/\r$/, "");
    searchFrom = nlPos + 1;
    if (line === "" || line.substring(0, 6) !== "data: ") continue;
    var payload = line.substring(6);
    try {
      var obj = JSON.parse(payload);
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
  return { tokens: tokens, newIndex: searchFrom };
}

export function sendAnthropicStreaming(opts) {
  var base = (opts.endpoint || "https://opencode.ai/zen/v1").replace(/\/+$/, "");
  var url = /\/v1$/.test(base) ? (base + "/messages") : (base + "/v1/messages");
  var apiKey = opts.apiKey || "";
  var model = opts.model || "claude-sonnet-4-6";
  var temperature = opts.temperature !== undefined ? opts.temperature : 0.7;
  var tempFloat = temperature > 2 ? temperature / 100.0 : temperature;
  var maxTokens = opts.maxTokens || 16384;
  var onChunk = opts.onChunk || function() {};
  var onComplete = opts.onComplete || function() {};

  var translated = translateAnthropicMessages(opts.messages || []);
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.timeout = 600000;
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("anthropic-version", "2023-06-01");
  xhr.setRequestHeader("anthropic-dangerous-direct-browser-access", "true");
  if (apiKey) {
    xhr.setRequestHeader("x-api-key", apiKey);
    if (opts && opts.opencodeAuth) {
      xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
    }
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
    var res = parseAnthropicSSEChunks(xhr.responseText, lastParseIndex);
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
    try {
      var response = JSON.parse(xhr.responseText);
      var text = "";
      if (response.content && response.content.length) {
        for (var i = 0; i < response.content.length; i++) {
          var b = response.content[i];
          if (b.type === "text" && typeof b.text === "string") {
            text += b.text;
          }
        }
      }
      if (text.length > 0) {
        onComplete(text, null);
      } else {
        onComplete("", "Empty response from Anthropic messages endpoint");
      }
    } catch (e) {
      onComplete("", "Failed to parse Anthropic response: " + e.message);
    }
  }

  xhr.ontimeout = function() {
    finish("Anthropic messages request timed out");
  };

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 3) {
      processBuffer();
    } else if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        processBuffer();
        finish(streamError);
      } else {
        finish(formatOpenCodeHttpError(xhr, "OpenCode Messages"));
      }
    }
  };

  var body = {
    model: model,
    max_tokens: maxTokens,
    messages: translated.messages,
    temperature: tempFloat,
    stream: true
  };
  if (opts && opts.opencodeAuth) {
    // Qwen and MiniMax on OpenCode default to thinking-on; disable explicitly for fast HTML output
    body.thinking = { type: "disabled" };
  }
  if (translated.system && translated.system.length > 0) {
    body.system = translated.system;
  }

  xhr.send(JSON.stringify(body));

  return {
    xhr: xhr,
    abort: function() {
      completeCalled = true;
      xhr.abort();
    }
  };
}
