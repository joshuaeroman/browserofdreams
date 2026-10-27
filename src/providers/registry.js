import { GeminiAdapter, AgentPlatformAdapter } from "./gemini/index.js";
import { OpenRouterAdapter } from "./openrouter/index.js";

// OpenCode Zen/Go are disabled for the public release: opencode.ai omits
// Access-Control-Allow-Origin on inference POST routes, which makes direct
// browser calls impossible without a CORS-unblocking browser extension.
// The adapter code remains in src/providers/opencode/ (still exposed on the
// bundle for tests) — uncomment these lines to re-enable the providers.
// import { OpenCodeZenAdapter, OpenCodeGoAdapter } from "./opencode/index.js";
import { isTextArtEngine } from "./adapter.js";
import { normalizeProviderId, isRasterProvider } from "../core/settings.js";

var registry = {
  "agentplatform": AgentPlatformAdapter,
  "gemini": GeminiAdapter,
  "openrouter": OpenRouterAdapter
  // "opencode-zen": OpenCodeZenAdapter,
  // "opencode-go": OpenCodeGoAdapter
};

export function registerProvider(id, adapter) {
  registry[id] = adapter;
}

export function getProvider(id) {
  return registry[id] || registry["agentplatform"];
}

export function getProviderDisplayName(id) {
  var p = registry[id];
  if (p && p.name) return p.name;
  switch (id) {
    case "gemini": return "Google AI Studio (Gemini API)";
    case "agentplatform": return "Google Cloud Agent Platform (Vertex AI)";
    case "openrouter": return "OpenRouter";
    case "opencode-zen": return "OpenCode Zen";
    case "opencode-go": return "OpenCode Go";
    default: return id || "Google Cloud Agent Platform (Vertex AI)";
  }
}

export function hasValidCredentials(settings, providerId) {
  var p = normalizeProviderId(providerId || (settings && settings.pageProvider) || "agentplatform");
  var adapter = registry[p];
  var conf = resolveConfig(settings, p);
  var view = {
    apiKey: conf.apiKey,
    googleApiKey: conf.apiKey,
    openrouterApiKey: conf.apiKey,
    opencodeApiKey: conf.apiKey,
    googleProjectId: conf.geminiProjectId,
    vertexAuthType: conf.vertexAuthType
  };
  if (adapter && typeof adapter.hasCredentials === "function") {
    return adapter.hasCredentials(view);
  }
  return !!(conf.apiKey && String(conf.apiKey).trim().length > 0);
}

export function getEffectiveImageProvider(settings, overrideRawImgProv, overridePageProv, overrideEngine) {
  var s = settings || {};
  var pageProv = normalizeProviderId(overridePageProv || s.pageProvider || "agentplatform");
  var engine = overrideEngine || s.imageEngine || "image-model";
  if (isTextArtEngine(engine)) return pageProv;

  var rawImg = overrideRawImgProv;
  if (rawImg === undefined || rawImg === null || rawImg === "") rawImg = s.imageProvider || "";
  rawImg = normalizeProviderId(rawImg);
  if (!rawImg || rawImg === "same") {
    return isRasterProvider(pageProv) ? pageProv : pageProv;
  }
  return rawImg;
}

export function resolveConfig(settings, providerId) {
  var s = settings || {};
  var p = normalizeProviderId(providerId || s.pageProvider || "agentplatform");
  var useAccount = !!(s.accounts && typeof s.accounts === "object");
  var account = useAccount && s.accounts[p] ? s.accounts[p] : null;
  var conf = {
    provider: p,
    apiKey: "",
    endpoint: "",
    model: s.pageModel,
    thinkingBudget: 0,
    geminiAuthMethod: p === "agentplatform" ? "agentplatform" : p,
    geminiLocation: "global",
    geminiProjectId: "",
    vertexAuthType: "apikey"
  };

  if (p === "openrouter") {
    conf.apiKey = useAccount ? ((account && account.apiKey) || "") : (s.openrouterApiKey || "");
    conf.endpoint = "https://openrouter.ai/api/v1";
  } else if (p === "opencode-go" || p === "opencode-zen") {
    var fallbackEndpoint = p === "opencode-go" ? "https://opencode.ai/zen/go/v1" : "https://opencode.ai/zen/v1";
    if (useAccount) {
      conf.apiKey = (account && account.apiKey) || "";
      conf.endpoint = (account && account.endpoint) || fallbackEndpoint;
    } else {
      conf.apiKey = s.opencodeApiKey || "";
      conf.endpoint = p === "opencode-go"
        ? (s.opencodeGoEndpoint || fallbackEndpoint)
        : (s.opencodeZenEndpoint || fallbackEndpoint);
    }
  } else if (p === "gemini") {
    conf.apiKey = useAccount ? ((account && account.apiKey) || "") : (s.googleApiKey || "");
    conf.endpoint = "https://generativelanguage.googleapis.com";
    conf.geminiAuthMethod = "gemini";
  } else {
    if (useAccount && account) {
      conf.apiKey = account.apiKey || "";
      conf.endpoint = account.endpoint || "https://aiplatform.googleapis.com";
      conf.geminiLocation = account.location || "global";
      conf.geminiProjectId = account.projectId || "";
      conf.vertexAuthType = account.vertexAuthType || "apikey";
      conf.thinkingBudget = parseInt(account.thinkingBudget, 10) || 0;
    } else {
      conf.apiKey = s.googleApiKey || "";
      conf.endpoint = s.googleEndpoint || "https://aiplatform.googleapis.com";
      conf.geminiLocation = s.googleLocation || "global";
      conf.geminiProjectId = s.googleProjectId || "";
      conf.vertexAuthType = s.vertexAuthType || "apikey";
      conf.thinkingBudget = parseInt(s.googleThinkingBudget, 10) || 0;
    }
    conf.geminiAuthMethod = "agentplatform";
  }

  return conf;
}
