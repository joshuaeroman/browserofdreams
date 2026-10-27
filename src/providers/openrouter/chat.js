import { normalizeOpenRouterModelId } from "./models.js";
import { getAppReferrerOrigin } from "./referer.js";

export function sendOpenRouterStreaming(opts) {
  var apiKey = opts.apiKey || "";
  var model = normalizeOpenRouterModelId(opts.model || "google/gemini-2.5-flash");
  var temperature = opts.temperature !== undefined ? opts.temperature : 0.7;
  var tempFloat = temperature > 2 ? temperature / 100.0 : temperature;
  var onChunk = opts.onChunk || function() {};
  var onComplete = opts.onComplete || function() {};

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://openrouter.ai/api/v1/chat/completions");
  xhr.timeout = 600000;
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
  xhr.setRequestHeader("HTTP-Referer", getAppReferrerOrigin());
  xhr.setRequestHeader("X-Title", "Browser of Dreams");

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
    // Non-streaming JSON fallback
    try {
      var obj = JSON.parse(xhr.responseText);
      var content = obj.choices &&
        obj.choices[0] &&
        obj.choices[0].message &&
        obj.choices[0].message.content;
      if (typeof content === "string" && content.length > 0) {
        onComplete(content, null);
      } else {
        onComplete("", "Empty response from OpenRouter");
      }
    } catch (e) {
      onComplete("", "Failed to parse OpenRouter response");
    }
  }

  xhr.ontimeout = function() {
    finish("OpenRouter request timed out");
  };

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 3) {
      processSSE();
    } else if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        processSSE();
        finish(null);
      } else {
        var errMsg = "OpenRouter HTTP " + xhr.status;
        try {
          var body = JSON.parse(xhr.responseText);
          if (body && body.error && body.error.message) {
            errMsg += ": " + body.error.message;
          }
        } catch (e) {
          // ignore
        }
        finish(errMsg);
      }
    }
  };

  var payload = JSON.stringify({
    model: model,
    messages: opts.messages || [],
    temperature: tempFloat,
    stream: true,
    reasoning: { effort: "none" }
  });

  xhr.send(payload);

  return {
    xhr: xhr,
    abort: function() {
      completeCalled = true;
      xhr.abort();
    }
  };
}

/**
 * Quick non-streaming completion for fast utility queries (memes, etc.)
 * Reasoning disabled ({ effort: "none" }).
 */
export function completeOpenRouterOnce(opts, callback) {
  var maxTokens = opts.maxTokens !== undefined ? opts.maxTokens : 180;
  var temp = opts.temperature !== undefined ? opts.temperature : 0.5;
  var apiKey = (opts.apiKey || "").trim();
  var model = normalizeOpenRouterModelId(opts.model || "google/gemini-2.5-flash");
  var completed = false;

  function done(err, text) {
    if (completed) return;
    completed = true;
    callback(err, text);
  }

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://openrouter.ai/api/v1/chat/completions");
  xhr.timeout = opts.timeout || 8000;
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
  xhr.setRequestHeader("HTTP-Referer", getAppReferrerOrigin());
  xhr.setRequestHeader("X-Title", "Browser of Dreams");

  xhr.ontimeout = function() {
    done("OpenRouter request timed out", null);
  };
  xhr.onerror = function() {
    done("OpenRouter network error", null);
  };
  xhr.onreadystatechange = function() {
    if (xhr.readyState !== 4) return;
    if (xhr.status === 200) {
      try {
        var data = JSON.parse(xhr.responseText);
        var content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
        done(null, content || "");
      } catch (e) {
        done("Failed to parse OpenRouter response", null);
      }
    } else {
      done("OpenRouter HTTP " + xhr.status, null);
    }
  };

  xhr.send(JSON.stringify({
    model: model,
    messages: opts.messages || [],
    stream: false,
    max_tokens: maxTokens,
    temperature: temp,
    reasoning: { effort: "none" }
  }));

  return {
    xhr: xhr,
    abort: function() {
      completed = true;
      xhr.abort();
    }
  };
}
