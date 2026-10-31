import { DEFAULT_LOCAL_ENDPOINT, normalizeLocalEndpoint, localUrl, describeLocalError } from "./endpoint.js";
import { STATIC_LOCAL_MODELS, normalizeLocalModelId, fetchLocalModels } from "./models.js";
import { sendLocalStreaming, completeLocalOnce } from "./chat.js";

export { DEFAULT_LOCAL_ENDPOINT, normalizeLocalEndpoint, localUrl, describeLocalError };
export { STATIC_LOCAL_MODELS, normalizeLocalModelId, fetchLocalModels };
export { sendLocalStreaming, completeLocalOnce };

export const LocalAdapter = {
  id: "local",
  name: "Local LLM (OpenAI-compatible)",
  DEFAULT_LOCAL_ENDPOINT: DEFAULT_LOCAL_ENDPOINT,
  STATIC_LOCAL_MODELS: STATIC_LOCAL_MODELS,
  normalizeEndpoint: normalizeLocalEndpoint,
  normalizeModelId: normalizeLocalModelId,
  fetchModels: fetchLocalModels,
  sendStreaming: sendLocalStreaming,
  streamChat: sendLocalStreaming,
  completeOnce: completeLocalOnce,
  hasCredentials: function(config) {
    return !!(config && config.localEnabled && String(config.endpoint || "").trim().length > 0);
  }
};
