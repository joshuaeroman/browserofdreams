import {
  COMMANDCODE_BASE,
  DEFAULT_COMMANDCODE_MODEL,
  resolveCommandCodeProtocol,
  cacheCommandCodeModelRoutes,
  commandCodeUrl,
  formatCommandCodeHttpError
} from "./route.js";
import {
  STATIC_COMMANDCODE_MODELS,
  normalizeCommandCodeModelId,
  fetchCommandCodeModels
} from "./models.js";
import { sendCommandCodeChatStreaming, completeCommandCodeChatOnce } from "./chat.js";
import {
  translateCommandCodeMessages,
  parseCommandCodeMessageSSE,
  sendCommandCodeMessagesStreaming,
  completeCommandCodeMessagesOnce
} from "./messages.js";

export {
  COMMANDCODE_BASE,
  DEFAULT_COMMANDCODE_MODEL,
  STATIC_COMMANDCODE_MODELS,
  normalizeCommandCodeModelId,
  fetchCommandCodeModels,
  resolveCommandCodeProtocol,
  cacheCommandCodeModelRoutes,
  commandCodeUrl,
  formatCommandCodeHttpError,
  translateCommandCodeMessages,
  parseCommandCodeMessageSSE,
  sendCommandCodeChatStreaming,
  completeCommandCodeChatOnce,
  sendCommandCodeMessagesStreaming,
  completeCommandCodeMessagesOnce
};

function prepare(opts) {
  var o = Object.assign({}, opts || {});
  o.model = normalizeCommandCodeModelId(o.model, STATIC_COMMANDCODE_MODELS) || DEFAULT_COMMANDCODE_MODEL;
  o.endpoint = o.endpoint || COMMANDCODE_BASE;
  return o;
}

export function sendCommandCodeStreaming(opts) {
  var o = prepare(opts);
  if (resolveCommandCodeProtocol(o.model) === "messages") {
    return sendCommandCodeMessagesStreaming(o);
  }
  return sendCommandCodeChatStreaming(o);
}

export function completeCommandCodeOnce(opts, callback) {
  var o = prepare(opts);
  if (resolveCommandCodeProtocol(o.model) === "messages") {
    return completeCommandCodeMessagesOnce(o, callback);
  }
  return completeCommandCodeChatOnce(o, callback);
}

export const CommandCodeAdapter = {
  id: "commandcode",
  name: "Command Code",
  STATIC_COMMANDCODE_MODELS: STATIC_COMMANDCODE_MODELS,
  presets: [
    { id: "commandcode", name: "Command Code", url: COMMANDCODE_BASE }
  ],
  fetchModels: fetchCommandCodeModels,
  sendStreaming: sendCommandCodeStreaming,
  streamChat: sendCommandCodeStreaming,
  completeOnce: completeCommandCodeOnce,
  normalizeModelId: normalizeCommandCodeModelId,
  resolveProtocol: resolveCommandCodeProtocol,
  hasCredentials: function(config) {
    return !!(config && config.commandcodeApiKey && String(config.commandcodeApiKey).trim().length > 0);
  }
};
