import { formatOpenCodeHttpError } from "../route.js";

// OpenAI Chat Completions (/chat/completions) for OpenCode chat models
export function sendOpenAIChatStreaming(opts) {
  var base = (opts.endpoint || "https://opencode.ai/zen/v1").replace(/\/+$/, "");
  var url = /\/v1$/.test(base) ? (base + "/chat/completions") : (base + "/v1/chat/completions");
  var apiKey = opts.apiKey || "";
  var model = opts.model || "glm-5.3-flash";
  var temperature = opts.temperature !== undefined ? opts.temperature : 0.7;
  var tempFloat = temperature > 2 ? temperature / 100.0 : temperature;
  var maxTokens = opts.maxTokens || 16384;
  var onChunk = opts.onChunk || function() {};
  var onComplete = opts.onComplete || function() {};

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.timeout = 600000;
  xhr.setRequestHeader("Content-Type", "application/json");
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

  var lastIndex = 0;
  var accumulatedText = "";
  var completeCalled = false;

  function processSSE() {
    var buffer = xhr.responseText;
    while (true) {
      var nl = buffer.indexOf("\n", lastIndex);
      if (nl === -1) break;
      var line = buffer.substring(lastIndex, nl).replace(/\r$/, "");
      lastIndex = nl + 1;
      if (!line || line.indexOf("data: ") !== 0) continue;
      var dataStr = line.substring(6).trim();
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
        var reasoning = delta && (delta.reasoning || delta.reasoning_content);

        if (typeof content === "string" && content.length > 0) {
          accumulatedText += content;
          onChunk(content, accumulatedText);
        } else if (typeof reasoning === "string" && reasoning.length > 0) {
          if (!accumulatedText.startsWith("<!-- [Reasoning]")) {
            accumulatedText = "<!-- [Reasoning]\n" + reasoning;
          } else {
            accumulatedText += reasoning;
          }
          onChunk(reasoning, accumulatedText);
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
    try {
      var obj = JSON.parse(xhr.responseText);
      var content = obj.choices &&
        obj.choices[0] &&
        obj.choices[0].message &&
        obj.choices[0].message.content;
      if (typeof content === "string" && content.length > 0) {
        onComplete(content, null);
      } else {
        onComplete("", "Empty response from OpenCode Chat Completions");
      }
    } catch (e) {
      onComplete("", "Failed to parse OpenCode Chat Completions response");
    }
  }

  xhr.ontimeout = function() {
    finish("OpenCode Chat Completions request timed out");
  };

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 3) {
      processSSE();
    } else if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        processSSE();
        finish(null);
      } else {
        finish(formatOpenCodeHttpError(xhr, "OpenCode Chat"));
      }
    }
  };

  xhr.send(JSON.stringify({
    model: model,
    messages: opts.messages || [],
    temperature: tempFloat,
    max_tokens: maxTokens,
    stream: true,
    reasoning_effort: "none"
  }));

  return {
    xhr: xhr,
    abort: function() {
      completeCalled = true;
      xhr.abort();
    }
  };
}
