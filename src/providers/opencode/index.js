import { OpenCodeRoute, sessionHeaders, formatOpenCodeHttpError } from "./route.js";
import { STATIC_OPENCODE_ZEN_MODELS, STATIC_OPENCODE_GO_MODELS, fetchOpenCodeModels } from "./models.js";
import { translateResponsesMessages, parseResponsesSSEChunks, sendOpenAIResponsesStreaming } from "./protocols/responses.js";
import { translateAnthropicMessages, parseAnthropicSSEChunks, sendAnthropicStreaming } from "./protocols/anthropic.js";
import { sendOpenAIChatStreaming } from "./protocols/chat.js";
import { sendOpenCodeStreaming, completeOpenCodeOnce } from "./chat.js";

export {
  OpenCodeRoute,
  sessionHeaders,
  formatOpenCodeHttpError,
  STATIC_OPENCODE_ZEN_MODELS,
  STATIC_OPENCODE_GO_MODELS,
  fetchOpenCodeModels,
  translateResponsesMessages,
  parseResponsesSSEChunks,
  sendOpenAIResponsesStreaming,
  translateAnthropicMessages,
  parseAnthropicSSEChunks,
  sendAnthropicStreaming,
  sendOpenAIChatStreaming,
  sendOpenCodeStreaming,
  completeOpenCodeOnce
};

export const OpenCodeZenAdapter = {
  id: "opencode-zen",
  name: "OpenCode Zen",
  STATIC_OPENCODE_ZEN_MODELS: STATIC_OPENCODE_ZEN_MODELS,
  STATIC_OPENCODE_GO_MODELS: STATIC_OPENCODE_GO_MODELS,
  presets: [
    { id: "opencode-zen", name: "OpenCode Zen", url: "https://opencode.ai/zen/v1" },
    { id: "opencode-go",  name: "OpenCode Go",  url: "https://opencode.ai/zen/go/v1" }
  ],
  sessionHeaders: sessionHeaders,
  fetchModels: fetchOpenCodeModels,
  sendStreaming: sendOpenCodeStreaming,
  streamChat: sendOpenCodeStreaming,
  completeOnce: completeOpenCodeOnce,
  sendResponsesStreaming: sendOpenAIResponsesStreaming,
  sendAnthropicStreaming: sendAnthropicStreaming,
  sendChatStreaming: sendOpenAIChatStreaming,
  parseResponsesSSEChunks: parseResponsesSSEChunks,
  parseAnthropicSSEChunks: parseAnthropicSSEChunks,
  translateResponsesMessages: translateResponsesMessages,
  translateAnthropicMessages: translateAnthropicMessages,
  hasCredentials: function(config) {
    return !!(config && config.opencodeApiKey && config.opencodeApiKey.trim().length > 0);
  }
};

export const OpenCodeGoAdapter = {
  ...OpenCodeZenAdapter,
  id: "opencode-go",
  name: "OpenCode Go"
};

export const OpenCodeAdapter = OpenCodeZenAdapter;
