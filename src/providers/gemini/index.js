import { AgentPlatform } from "./agent-platform.js";
import { GeminiThinking } from "./thinking.js";
import { setGeminiHeaders, formatGeminiError, translateMessages, parseGeminiSSEChunks } from "./messages.js";
import { STATIC_VERTEX_GEMINI_MODELS, STATIC_GEMINI_IMAGE_MODELS, fetchGeminiModels } from "./models.js";
import { generateGeminiImage } from "./images.js";
import { sendGeminiStreaming, completeGeminiOnce } from "./chat.js";
import { GEMINI_SUPPORTED_ASPECT_RATIOS, normalizeSupportedAspectRatio } from "../../core/aspect.js";

export {
  AgentPlatform,
  GeminiThinking,
  setGeminiHeaders,
  formatGeminiError,
  translateMessages,
  parseGeminiSSEChunks,
  STATIC_VERTEX_GEMINI_MODELS,
  STATIC_GEMINI_IMAGE_MODELS,
  fetchGeminiModels,
  generateGeminiImage,
  sendGeminiStreaming,
  completeGeminiOnce
};

export const GeminiAdapter = {
  id: "gemini",
  name: "Google AI Studio",
  STATIC_VERTEX_GEMINI_MODELS: STATIC_VERTEX_GEMINI_MODELS,
  STATIC_GEMINI_IMAGE_MODELS: STATIC_GEMINI_IMAGE_MODELS,
  SUPPORTED_ASPECT_RATIOS: GEMINI_SUPPORTED_ASPECT_RATIOS,
  supportedAspectRatios: GEMINI_SUPPORTED_ASPECT_RATIOS,
  normalizeSupportedAspectRatio: normalizeSupportedAspectRatio,
  setHeaders: setGeminiHeaders,
  fetchModels: fetchGeminiModels,
  formatGeminiError: formatGeminiError,
  translateMessages: translateMessages,
  parseSSEChunks: parseGeminiSSEChunks,
  sendStreaming: sendGeminiStreaming,
  streamChat: sendGeminiStreaming,
  completeOnce: completeGeminiOnce,
  generateImage: generateGeminiImage,
  hasCredentials: function(config) {
    return !!(config && config.googleApiKey && config.googleApiKey.trim().length > 0);
  }
};

export const AgentPlatformAdapter = {
  ...GeminiAdapter,
  id: "agentplatform",
  name: "Google Cloud Agent Platform (Vertex AI)",
  hasCredentials: function(config) {
    if (!config) return false;
    if (config.vertexAuthType === "gcloud") {
      return !!(config.googleApiKey && config.googleApiKey.trim().length > 0 && config.googleProjectId && config.googleProjectId.trim().length > 0);
    }
    return !!(config.googleApiKey && config.googleApiKey.trim().length > 0);
  }
};
