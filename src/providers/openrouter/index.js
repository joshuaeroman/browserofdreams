import { STATIC_OR_TEXT_MODELS, STATIC_OR_IMAGE_MODELS, normalizeOpenRouterModelId, fetchOpenRouterModels } from "./models.js";
import { generateOpenRouterImage, extractOpenRouterImageFromChatResponse, parseOpenRouterError } from "./images.js";
import { sendOpenRouterStreaming, completeOpenRouterOnce } from "./chat.js";
import { SUPPORTED_ASPECT_RATIOS, normalizeSupportedAspectRatio } from "../../core/aspect.js";

export {
  STATIC_OR_TEXT_MODELS,
  STATIC_OR_IMAGE_MODELS,
  normalizeOpenRouterModelId,
  fetchOpenRouterModels,
  generateOpenRouterImage,
  extractOpenRouterImageFromChatResponse,
  parseOpenRouterError,
  sendOpenRouterStreaming,
  completeOpenRouterOnce
};

export const OpenRouterAdapter = {
  id: "openrouter",
  name: "OpenRouter",
  STATIC_OR_TEXT_MODELS: STATIC_OR_TEXT_MODELS,
  STATIC_OR_IMAGE_MODELS: STATIC_OR_IMAGE_MODELS,
  SUPPORTED_ASPECT_RATIOS: SUPPORTED_ASPECT_RATIOS,
  supportedAspectRatios: SUPPORTED_ASPECT_RATIOS,
  normalizeSupportedAspectRatio: normalizeSupportedAspectRatio,
  normalizeModelId: normalizeOpenRouterModelId,
  sendStreaming: sendOpenRouterStreaming,
  streamChat: sendOpenRouterStreaming,
  completeOnce: completeOpenRouterOnce,
  generateImage: generateOpenRouterImage,
  fetchModels: fetchOpenRouterModels,
  extractImageFromChatResponse: extractOpenRouterImageFromChatResponse,
  hasCredentials: function(config) {
    return !!(config && config.openrouterApiKey && config.openrouterApiKey.trim().length > 0);
  }
};
