export function setGeminiHeaders(xhr, apiKey, opts) {
  xhr.setRequestHeader("Content-Type", "application/json");
  // Note: Do NOT send "Api-Revision" from a web browser. Google's CORS
  // preflight on aiplatform.googleapis.com and generativelanguage.googleapis.com
  // only allows content-type, x-goog-api-key, and authorization, and returns
  // HTTP 403 on OPTIONS if api-revision is in Access-Control-Request-Headers.
  if (apiKey && apiKey.length > 0) {
    var isGcloud = opts && opts.geminiAuthMethod === "agentplatform" && opts.geminiVertexAuthType === "gcloud";
    if (opts && opts.opencodeAuth) {
      xhr.setRequestHeader("x-goog-api-key", apiKey);
    } else if (isGcloud || apiKey.indexOf("ya29.") === 0) {
      xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
    } else {
      xhr.setRequestHeader("x-goog-api-key", apiKey);
    }
  }
  if (opts && opts.extraHeaders) {
    for (var h in opts.extraHeaders) {
      if (Object.prototype.hasOwnProperty.call(opts.extraHeaders, h)) {
        xhr.setRequestHeader(h, opts.extraHeaders[h]);
      }
    }
  }
}

export function formatGeminiError(xhr, prefix) {
  var detail = "";
  try {
    var body = JSON.parse(xhr.responseText);
    if (body && body.error && body.error.message) {
      detail = body.error.message;
    }
  } catch (e) {
    if (xhr.responseText) detail = xhr.responseText.substring(0, 200);
  }
  if (xhr.status === 400 && detail.toLowerCase().indexOf("api key") !== -1) {
    return "Authentication failed — check your API key (HTTP 400): " + detail;
  }
  if (xhr.status === 401 || xhr.status === 403) {
    return "Authentication failed (HTTP " + xhr.status + ") — check your API key: " + detail;
  }
  if (xhr.status > 0) {
    return prefix + " (HTTP " + xhr.status + ")" + (detail ? ": " + detail : "");
  }
  return prefix + ": blocked by browser CORS policy or network failure (HTTP 0). If using OpenCode (opencode.ai), please enable a CORS-unblocking browser extension (e.g. 'Allow CORS: Access-Control-Allow-Origin') for https://opencode.ai.";
}

export function translateMessages(neutralMessages) {
  var systemText = "";
  var contents = [];
  for (var i = 0; i < neutralMessages.length; i++) {
    var m = neutralMessages[i];
    if (m.role === "system") {
      if (typeof m.content === "string") {
        systemText += (systemText.length > 0 ? "\n\n" : "") + m.content;
      }
    } else if (m.role === "assistant") {
      contents.push({
        role: "model",
        parts: [{ text: typeof m.content === "string" ? m.content : "" }]
      });
    } else if (m.role === "user") {
      contents.push({
        role: "user",
        parts: [{ text: typeof m.content === "string" ? m.content : "" }]
      });
    }
  }
  return { systemText: systemText, contents: contents };
}

export function parseGeminiSSEChunks(buffer, lastIndex) {
  var tokens = [];
  var searchFrom = lastIndex;
  while (true) {
    var nlPos = buffer.indexOf("\n", searchFrom);
    if (nlPos === -1) break;
    var line = buffer.substring(searchFrom, nlPos).replace(/\r$/, "");
    searchFrom = nlPos + 1;
    if (line === "") continue;
    if (line.substring(0, 6) !== "data: ") continue;
    var payload = line.substring(6);
    try {
      var obj = JSON.parse(payload);
      if (obj.candidates && obj.candidates[0] && obj.candidates[0].content) {
        var partsArr = obj.candidates[0].content.parts || [];
        for (var p = 0; p < partsArr.length; p++) {
          var part = partsArr[p];
          if (part.thought === true) {
            var tt = typeof part.text === "string" ? part.text : "";
            tokens.push({
              thinking_delta: {
                text: tt,
                signature: part.thoughtSignature || ""
              }
            });
          } else if (typeof part.text === "string" && part.text.length > 0) {
            tokens.push({ content: part.text });
          }
        }
      }
      if (obj.error) {
        tokens.push({ error: (obj.error && obj.error.message) || "stream error" });
      }
    } catch (e) {
      // skip unparseable chunk
    }
  }
  return { tokens: tokens, newIndex: searchFrom };
}
