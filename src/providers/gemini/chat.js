import { AgentPlatform } from "./agent-platform.js";
import { GeminiThinking } from "./thinking.js";
import { setGeminiHeaders, formatGeminiError, translateMessages, parseGeminiSSEChunks } from "./messages.js";
import { outputTokenBudget } from "../../core/effort.js";

export function sendGeminiStreaming(opts) {
  var endpoint = opts.endpoint || "https://aiplatform.googleapis.com";
  var apiKey = opts.apiKey || "";
  var model = opts.model || "gemini-2.5-flash";
  var temperature = opts.temperature !== undefined ? opts.temperature : 70;
  var maxTokens = opts.maxTokens || 16384;
  var onChunk = opts.onChunk || function() {};
  var onComplete = opts.onComplete || function() {};

  var translated = translateMessages(opts.messages || []);
  var xhr = new XMLHttpRequest();
  var url;
  var baseUrl = endpoint.replace(/\/+$/, "");
  var location = "global";
  var findProject = false;

  if (opts && opts.opencodeAuth) {
    // OpenCode Zen/Go serves Gemini under {base}/models/{m}:streamGenerateContent
    url = baseUrl + "/models/" + encodeURIComponent(model) + ":streamGenerateContent?alt=sse";
  } else if (opts && opts.geminiAuthMethod === "agentplatform") {
    var projectId = (opts.geminiProjectId ? opts.geminiProjectId.trim() : "");
    location = opts.geminiLocation || "global";

    if (location !== "global" && baseUrl.indexOf("://aiplatform.googleapis.com") !== -1) {
      baseUrl = baseUrl.replace("://", "://" + location + "-");
    }

    if (AgentPlatform.usesExpressKey(opts, apiKey, baseUrl)) {
      projectId = AgentPlatform.cachedProject(apiKey);
      findProject = projectId.length === 0;
    }
    url = AgentPlatform.modelUrl(baseUrl, projectId, location, model, "streamGenerateContent?alt=sse");
  } else {
    url = baseUrl + "/v1beta/models/" + encodeURIComponent(model) + ":streamGenerateContent?alt=sse";
  }

  var lastParseIndex = 0;
  var accumulatedText = "";
  var streamError = null;
  var completeCalled = false;

  function processBuffer() {
    var result = parseGeminiSSEChunks(xhr.responseText, lastParseIndex);
    lastParseIndex = result.newIndex;
    for (var i = 0; i < result.tokens.length; i++) {
      var tok = result.tokens[i];
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

  function finish(error) {
    if (completeCalled) return;
    completeCalled = true;
    if (error) {
      onComplete(accumulatedText, error, null, null);
    } else if (accumulatedText.length > 0) {
      onComplete(accumulatedText, null, null, { role: "assistant", content: accumulatedText });
    } else {
      try {
        var response = JSON.parse(xhr.responseText);
        var text = "";
        if (response.candidates && response.candidates[0] && response.candidates[0].content) {
          var partsArr = response.candidates[0].content.parts || [];
          for (var i = 0; i < partsArr.length; i++) {
            var part = partsArr[i];
            if (!part.thought && typeof part.text === "string") {
              text += part.text;
            }
          }
        }
        if (text.length > 0) {
          onComplete(text, null, null, { role: "assistant", content: text });
        } else {
          onComplete("", "Invalid response format from Gemini");
        }
      } catch (e) {
        onComplete("", "Failed to parse response: " + e.message);
      }
    }
  }

  xhr.ontimeout = function() {
    finish("Request timed out");
  };

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 3) {
      processBuffer();
    } else if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        processBuffer();
        finish(streamError);
      } else {
        finish(formatGeminiError(xhr, "Request failed"));
      }
    }
  };

  var tempFloat = temperature > 2 ? temperature / 100.0 : temperature;
  var body = {
    contents: translated.contents,
    generationConfig: {
      temperature: tempFloat,
      maxOutputTokens: outputTokenBudget(maxTokens, opts.thinkingBudget || 0)
    }
  };

  body.generationConfig.thinkingConfig = GeminiThinking.buildThinkingConfig(
    model,
    opts.thinkingBudget || 0,
    !!opts.showThoughts,
    opts.geminiAuthMethod || "aistudio"
  );

  if (translated.systemText && translated.systemText.length > 0) {
    body.systemInstruction = { parts: [{ text: translated.systemText }] };
  }

  var payload = JSON.stringify(body, null, 2);

  var handle = {
    xhr: xhr,
    processBuffer: processBuffer,
    abort: function() {
      completeCalled = true;
      if (handle.xhr && typeof handle.xhr.abort === "function") {
        handle.xhr.abort();
      }
    }
  };

  function openAndSend(requestUrl) {
    xhr.open("POST", requestUrl);
    xhr.timeout = 600000;
    setGeminiHeaders(xhr, apiKey, opts);
    handle.xhr = xhr;
    xhr.send(payload);
  }

  if (findProject) {
    handle.xhr = AgentPlatform.discoverProject(baseUrl, apiKey, function(project) {
      openAndSend(project
        ? AgentPlatform.modelUrl(baseUrl, project, location, model, "streamGenerateContent?alt=sse")
        : url);
    });
  } else {
    openAndSend(url);
  }

  return handle;
}

/**
 * Quick non-streaming completion for fast utility queries (memes, etc.)
 * Reasoning disabled (budget: 0).
 */
export function completeGeminiOnce(opts, callback) {
  var maxTokens = opts.maxTokens !== undefined ? opts.maxTokens : 180;
  var temp = opts.temperature !== undefined ? opts.temperature : 0.5;
  var provider = opts.geminiAuthMethod || opts.provider || "agentplatform";
  var model = opts.model || "gemini-2.5-flash";
  var apiKey = (opts.apiKey || "").trim();
  var completed = false;

  function done(err, text) {
    if (completed) return;
    completed = true;
    callback(err, text);
  }

  var baseUrl = (provider === "agentplatform"
    ? (opts.endpoint || "https://aiplatform.googleapis.com")
    : "https://generativelanguage.googleapis.com").replace(/\/+$/, "");
  var location = opts.geminiLocation || "global";
  var translated = translateMessages(opts.messages || []);

  var body = {
    contents: translated.contents,
    generationConfig: {
      temperature: temp,
      maxOutputTokens: maxTokens,
      thinkingConfig: GeminiThinking.buildThinkingConfig(model, 0, false, provider)
    }
  };
  if (translated.systemText) {
    body.systemInstruction = { parts: [{ text: translated.systemText }] };
  }

  var xhr = new XMLHttpRequest();
  var handle = {
    xhr: xhr,
    abort: function() {
      completed = true;
      if (handle.xhr && typeof handle.xhr.abort === "function") {
        handle.xhr.abort();
      }
    }
  };

  function sendToUrl(reqUrl) {
    xhr.open("POST", reqUrl);
    xhr.timeout = opts.timeout || 8000;
    setGeminiHeaders(xhr, apiKey, {
      geminiAuthMethod: provider,
      geminiVertexAuthType: opts.vertexAuthType || opts.geminiVertexAuthType
    });
    xhr.ontimeout = function() {
      done("Gemini request timed out", null);
    };
    xhr.onerror = function() {
      done("Gemini network error", null);
    };
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200) {
        try {
          var data = JSON.parse(xhr.responseText);
          var part = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0];
          var text = (part && part.text) || "";
          done(null, text);
        } catch (e) {
          done("Failed to parse Gemini response: " + e.message, null);
        }
      } else {
        done(formatGeminiError(xhr, "Gemini request failed"), null);
      }
    };
    xhr.send(JSON.stringify(body));
  }

  if (provider === "agentplatform" && AgentPlatform.usesExpressKey(opts, apiKey, baseUrl)) {
    var cachedProj = AgentPlatform.cachedProject(apiKey);
    if (cachedProj) {
      sendToUrl(AgentPlatform.modelUrl(baseUrl, cachedProj, location, model, "generateContent"));
    } else {
      handle.xhr = AgentPlatform.discoverProject(baseUrl, apiKey, function(discovered) {
        sendToUrl(discovered
          ? AgentPlatform.modelUrl(baseUrl, discovered, location, model, "generateContent")
          : baseUrl + "/v1beta/models/" + encodeURIComponent(model) + ":generateContent");
      });
    }
  } else {
    var explicitProj = (opts.geminiProjectId || "").trim();
    if (provider === "agentplatform") {
      sendToUrl(AgentPlatform.modelUrl(baseUrl, explicitProj, location, model, "generateContent"));
    } else {
      sendToUrl(baseUrl + "/v1beta/models/" + encodeURIComponent(model) + ":generateContent");
    }
  }

  return handle;
}
