/**
 * @typedef {Object} ChatRequest
 * @property {Array<{role: string, content: string}>} messages
 * @property {string} [model]
 * @property {number} [temperature]
 * @property {number} [maxTokens]
 * @property {string} [apiKey]
 * @property {string} [endpoint]
 * @property {Function} [onChunk]
 * @property {Function} [onComplete]
 *
 * @typedef {Object} ImageRequest
 * @property {string} prompt
 * @property {string} [aspectRatio]
 * @property {number} [width]
 * @property {number} [height]
 * @property {string} [model]
 * @property {string} [apiKey]
 * @property {string} [endpoint]
 *
 * @typedef {{ abort: () => void, xhr?: XMLHttpRequest }} Handle
 *
 * @typedef {Object} ProviderAdapter
 * @property {string} id
 * @property {string} name
 * @property {(config: Object) => boolean} hasCredentials
 * @property {(req: ChatRequest) => Handle} streamChat
 * @property {(req: ChatRequest, callback: (err: string|null, text: string) => void) => Handle} completeOnce
 * @property {(req: ImageRequest, callback: (err: string|null, dataUrl: string) => void) => Handle} [generateImage]
 * @property {(...args: any[]) => void} [fetchModels]
 * @property {string[]} [supportedAspectRatios]
 */

export function isOpenCodeProvider(providerId) {
  return providerId === "opencode-zen" || providerId === "opencode-go";
}

export function isTextArtEngine(engine) {
  return engine === "text-pixel" || engine === "text-svg" || engine === "text-auto";
}
