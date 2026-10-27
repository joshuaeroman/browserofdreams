import { OpenCodeRoute, sessionHeaders } from "./route.js";
import { sendOpenAIResponsesStreaming } from "./protocols/responses.js";
import { sendAnthropicStreaming } from "./protocols/anthropic.js";
import { sendOpenAIChatStreaming } from "./protocols/chat.js";
import { sendGeminiStreaming } from "../gemini/chat.js";

export function sendOpenCodeStreaming(opts) {
  var product = OpenCodeRoute.productFromEndpoint(opts && opts.endpoint, opts && opts.providerName);
  var protocol = OpenCodeRoute.resolveProtocol(product, opts && opts.model, opts && opts.overlay);
  var o = {};
  if (opts) {
    for (var k in opts) {
      if (Object.prototype.hasOwnProperty.call(opts, k)) {
        o[k] = opts[k];
      }
    }
  }
  o.opencodeAuth = true;
  o.extraHeaders = sessionHeaders(o);

  if (protocol === "responses") {
    o.usesResponsesAPI = true;
    return sendOpenAIResponsesStreaming(o);
  }
  if (protocol === "anthropic") {
    return sendAnthropicStreaming(o);
  }
  if (protocol === "gemini") {
    return sendGeminiStreaming(o);
  }
  return sendOpenAIChatStreaming(o);
}

/**
 * Quick non-streaming completion for fast utility queries (memes, etc.)
 */
export function completeOpenCodeOnce(opts, callback) {
  var maxTokens = opts.maxTokens !== undefined ? opts.maxTokens : 180;
  var temp = opts.temperature !== undefined ? opts.temperature : 0.5;
  var isGo = opts.provider === "opencode-go";
  var ocEndpoint = isGo
    ? (opts.endpoint || opts.opencodeGoEndpoint || "https://opencode.ai/zen/go/v1")
    : (opts.endpoint || opts.opencodeZenEndpoint || "https://opencode.ai/zen/v1");
  var base = ocEndpoint.replace(/\/+$/, "");
  var url = /\/v1$/.test(base) ? (base + "/chat/completions") : (base + "/v1/chat/completions");

  var completed = false;
  function done(err, text) {
    if (completed) return;
    completed = true;
    callback(err, text);
  }

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.timeout = opts.timeout || 8000;
  xhr.setRequestHeader("Content-Type", "application/json");
  var apiKey = (opts.apiKey || opts.opencodeApiKey || "").trim();
  if (apiKey) {
    xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
  }

  xhr.ontimeout = function() {
    done("OpenCode request timed out", null);
  };
  xhr.onerror = function() {
    done("OpenCode network error", null);
  };
  xhr.onreadystatechange = function() {
    if (xhr.readyState !== 4) return;
    if (xhr.status === 200) {
      try {
        var data = JSON.parse(xhr.responseText);
        var content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
        done(null, content || "");
      } catch (e) {
        done("Failed to parse OpenCode response", null);
      }
    } else {
      done("OpenCode HTTP " + xhr.status, null);
    }
  };

  xhr.send(JSON.stringify({
    model: opts.model || (isGo ? "qwen3.8-flash" : "claude-sonnet-4-6"),
    messages: opts.messages || [],
    stream: false,
    max_tokens: maxTokens,
    temperature: temp,
    reasoning_effort: "none"
  }));

  return {
    xhr: xhr,
    abort: function() {
      completed = true;
      xhr.abort();
    }
  };
}
