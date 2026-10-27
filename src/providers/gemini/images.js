import { AgentPlatform } from "./agent-platform.js";
import { setGeminiHeaders, formatGeminiError } from "./messages.js";
import { normalizeSupportedAspectRatio } from "../../core/aspect.js";

/* Native Gemini / Agent Platform Image Generation (:generateContent & :predict) */
export function generateGeminiImage(opts, callback) {
  var endpoint = opts.endpoint || "https://aiplatform.googleapis.com";
  var apiKey = opts.apiKey || "";
  var model = opts.model || "gemini-2.5-flash-image";
  var prompt = opts.prompt || "";
  var aspectRatio = normalizeSupportedAspectRatio(opts.aspectRatio || "1:1", opts.width, opts.height, opts.geminiAuthMethod || "gemini");
  var baseUrl = endpoint.replace(/\/+$/, "");
  var location = (opts && opts.geminiLocation) || "global";

  if (location !== "global" && baseUrl.indexOf("://aiplatform.googleapis.com") !== -1) {
    baseUrl = baseUrl.replace("://", "://" + location + "-");
  }

  var isImagen = model.toLowerCase().indexOf("imagen") !== -1;
  var method = isImagen ? "predict" : "generateContent";

  function buildUrl(projectId) {
    if (opts && opts.geminiAuthMethod === "agentplatform") {
      return AgentPlatform.modelUrl(baseUrl, projectId, location, model, method);
    }
    return baseUrl + "/v1beta/models/" + encodeURIComponent(model) + ":" + method;
  }

  function sendRequest(projectId, includeModalities) {
    var xhr = new XMLHttpRequest();
    var reqUrl = buildUrl(projectId);
    xhr.open("POST", reqUrl);
    xhr.timeout = 90000;
    setGeminiHeaders(xhr, apiKey, opts);

    var bodyObj;
    if (isImagen) {
      bodyObj = {
        instances: [{ prompt: prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: aspectRatio
        }
      };
    } else {
      bodyObj = {
        contents: [
          {
            role: "user",
            parts: [{ text: "Generate an image: " + prompt }]
          }
        ]
      };
      if (includeModalities) {
        bodyObj.generationConfig = {
          responseModalities: ["TEXT", "IMAGE"]
        };
      }
    }

    xhr.ontimeout = function() {
      callback("Image generation timed out", null);
    };

    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200) {
        try {
          var data = JSON.parse(xhr.responseText);
          // 1. Check Imagen predictions
          if (data.predictions && data.predictions[0] && data.predictions[0].bytesBase64Encoded) {
            var mime = data.predictions[0].mimeType || "image/png";
            callback(null, "data:" + mime + ";base64," + data.predictions[0].bytesBase64Encoded);
            return;
          }
          // 2. Check Gemini generateContent candidates inlineData
          if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            var parts = data.candidates[0].content.parts || [];
            for (var i = 0; i < parts.length; i++) {
              var p = parts[i];
              if (p.inlineData && p.inlineData.data) {
                var mType = p.inlineData.mimeType || "image/png";
                callback(null, "data:" + mType + ";base64," + p.inlineData.data);
                return;
              }
            }
          }
          callback("Model response did not include image bytes", null);
        } catch (e) {
          callback("Failed to parse image response: " + e.message, null);
        }
      } else if (!isImagen && includeModalities && xhr.status === 400) {
        // Retry without responseModalities if rejected by specific model version
        sendRequest(projectId, false);
      } else {
        callback(formatGeminiError(xhr, "Image request failed"), null);
      }
    };

    xhr.send(JSON.stringify(bodyObj));
  }

  var explicitProject = (opts && opts.geminiProjectId ? opts.geminiProjectId.trim() : "");
  if (opts && opts.geminiAuthMethod === "agentplatform" && AgentPlatform.usesExpressKey(opts, apiKey, baseUrl)) {
    var cached = AgentPlatform.cachedProject(apiKey);
    if (cached) {
      sendRequest(cached, true);
    } else {
      AgentPlatform.discoverProject(baseUrl, apiKey, function(discovered) {
        sendRequest(discovered, true);
      });
    }
  } else {
    sendRequest(explicitProject, true);
  }
}
