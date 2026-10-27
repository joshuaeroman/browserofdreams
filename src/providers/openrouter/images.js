import { normalizeOpenRouterModelId } from "./models.js";
import { normalizeSupportedAspectRatio } from "../../core/aspect.js";
import { getAppReferrerOrigin } from "./referer.js";

export function parseOpenRouterError(xhr, prefix) {
  var errMsg = (prefix || "OpenRouter error") + " (HTTP " + xhr.status + ")";
  try {
    var body = JSON.parse(xhr.responseText);
    if (body && body.error && body.error.message) {
      errMsg += ": " + body.error.message;
    }
  } catch (e) {
    // ignore
  }
  return errMsg;
}

export function extractOpenRouterImageFromChatResponse(data) {
  if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
    return null;
  }
  var msg = data.choices[0].message;

  // 1. message.images array
  if (Array.isArray(msg.images) && msg.images.length > 0) {
    var img0 = msg.images[0];
    if (typeof img0 === "string") return img0;
    if (img0.image_url && img0.image_url.url) return img0.image_url.url;
    if (img0.url) return img0.url;
    if (img0.b64_json) {
      return "data:" + (img0.media_type || "image/png") + ";base64," + img0.b64_json;
    }
  }

  // 2. message.content array
  if (Array.isArray(msg.content)) {
    for (var i = 0; i < msg.content.length; i++) {
      var part = msg.content[i];
      if (part.image_url && part.image_url.url) return part.image_url.url;
      if (part.b64_json) return "data:image/png;base64," + part.b64_json;
    }
  }

  // 3. Inline data URI in string content
  if (typeof msg.content === "string") {
    var m = /(data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+)/.exec(msg.content);
    if (m) return m[1];
  }

  return null;
}

export function generateOpenRouterImage(opts, callback) {
  var apiKey = opts.apiKey || "";
  var model = normalizeOpenRouterModelId(opts.model || "openai/gpt-image-2.5-flare");
  var prompt = opts.prompt || "";
  var aspectRatio = normalizeSupportedAspectRatio(opts.aspectRatio || "1:1", opts.width, opts.height, "openrouter");

  function isFatalBillingOrAuthStatus(status) {
    return status === 401 || status === 402 || status === 403 || status === 429;
  }

  function tryChatCompletions(onFallback, primaryErr) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://openrouter.ai/api/v1/chat/completions");
    xhr.timeout = 90000;
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
    xhr.setRequestHeader("HTTP-Referer", getAppReferrerOrigin());
    xhr.setRequestHeader("X-Title", "Browser of Dreams");

    xhr.ontimeout = function() {
      callback("OpenRouter image generation timed out", null);
    };

    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200) {
        try {
          var data = JSON.parse(xhr.responseText);
          var url = extractOpenRouterImageFromChatResponse(data);
          if (url) {
            callback(null, url);
            return;
          }
        } catch (e) {
          // fall through
        }
      }
      var errStr = parseOpenRouterError(xhr, "OpenRouter image request failed");
      if (onFallback && !isFatalBillingOrAuthStatus(xhr.status)) {
        onFallback(errStr);
      } else {
        callback(primaryErr || errStr, null);
      }
    };

    xhr.send(JSON.stringify({
      model: model,
      messages: [{ role: "user", content: prompt }],
      modalities: ["image", "text"]
    }));
  }

  function tryUnifiedImagesEndpoint(onFallback, primaryErr) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://openrouter.ai/api/v1/images");
    xhr.timeout = 90000;
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
    xhr.setRequestHeader("HTTP-Referer", getAppReferrerOrigin());
    xhr.setRequestHeader("X-Title", "Browser of Dreams");

    xhr.ontimeout = function() {
      callback("OpenRouter /api/v1/images timed out", null);
    };

    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200) {
        try {
          var data = JSON.parse(xhr.responseText);
          if (data.data && data.data[0]) {
            var item = data.data[0];
            if (item.b64_json) {
              var mime = item.media_type || "image/png";
              callback(null, "data:" + mime + ";base64," + item.b64_json);
              return;
            }
            if (item.url) {
              callback(null, item.url);
              return;
            }
          }
        } catch (e) {
          // fall through
        }
      }
      var errStr = parseOpenRouterError(xhr, "OpenRouter image generation failed");
      if (onFallback && !isFatalBillingOrAuthStatus(xhr.status)) {
        onFallback(errStr);
      } else {
        callback(primaryErr || errStr, null);
      }
    };

    xhr.send(JSON.stringify({
      model: model,
      prompt: prompt,
      aspect_ratio: aspectRatio
    }));
  }

  var lower = model.toLowerCase();
  var prefersChatCompletions =
    lower.indexOf("gemini-") !== -1 ||
    lower.indexOf("gpt-5") !== -1 ||
    lower.indexOf("openrouter/auto") !== -1;

  if (!prefersChatCompletions) {
    tryUnifiedImagesEndpoint(function(primaryErr) {
      tryChatCompletions(null, primaryErr);
    });
  } else {
    tryChatCompletions(function(primaryErr) {
      tryUnifiedImagesEndpoint(null, primaryErr);
    });
  }
}
