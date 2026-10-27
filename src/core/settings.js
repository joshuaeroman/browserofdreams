export const STORAGE_KEY_SETTINGS = "browser_of_dreams_settings_v1";

export const PROVIDER_CATALOG = [
  {
    id: "agentplatform",
    name: "Google Cloud Agent Platform",
    raster: true,
    defaultEndpoint: "https://aiplatform.googleapis.com"
  },
  {
    id: "gemini",
    name: "Google AI Studio",
    raster: true,
    defaultEndpoint: "https://generativelanguage.googleapis.com"
  },
  // DISABLED for the public release: opencode.ai omits Access-Control-Allow-Origin
  // on inference POST routes, so direct in-browser calls need a CORS-unblocking
  // browser extension (see README Providers table). The full adapter code lives on
  // in src/providers/opencode/ — flip these `disabled` flags to re-enable.
  {
    id: "opencode-zen",
    name: "OpenCode Zen",
    raster: false,
    defaultEndpoint: "https://opencode.ai/zen/v1",
    sibling: "opencode-go",
    disabled: true
  },
  {
    id: "opencode-go",
    name: "OpenCode Go",
    raster: false,
    defaultEndpoint: "https://opencode.ai/zen/go/v1",
    sibling: "opencode-zen",
    disabled: true
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    raster: true,
    defaultEndpoint: "https://openrouter.ai/api/v1"
  }
];

var LEGACY_SECRET_FIELDS = [
  "vertexAuthType",
  "googleApiKey",
  "googleProjectId",
  "googleLocation",
  "googleEndpoint",
  "googleThinkingBudget",
  "opencodeApiKey",
  "opencodeZenEndpoint",
  "opencodeGoEndpoint",
  "openrouterApiKey"
];

export function normalizeProviderId(id) {
  if (id === "aistudio") return "gemini";
  return id || "";
}

export function providerById(id) {
  var normalized = normalizeProviderId(id);
  for (var i = 0; i < PROVIDER_CATALOG.length; i++) {
    if (PROVIDER_CATALOG[i].id === normalized) return PROVIDER_CATALOG[i];
  }
  return null;
}

export function isRasterProvider(id) {
  var provider = providerById(id);
  return !!(provider && provider.raster);
}

export function emptyAccounts() {
  var accounts = {};
  for (var i = 0; i < PROVIDER_CATALOG.length; i++) {
    var provider = PROVIDER_CATALOG[i];
    var account = { apiKey: "" };
    if (provider.id === "agentplatform") {
      account.vertexAuthType = "apikey";
      account.projectId = "";
      account.location = "global";
      account.endpoint = provider.defaultEndpoint;
      account.thinkingBudget = 0;
    } else if (provider.id === "opencode-zen" || provider.id === "opencode-go") {
      account.endpoint = provider.defaultEndpoint;
    }
    accounts[provider.id] = account;
  }
  return accounts;
}

function cloneAccounts(source) {
  var accounts = emptyAccounts();
  if (!source) return accounts;
  for (var i = 0; i < PROVIDER_CATALOG.length; i++) {
    var id = PROVIDER_CATALOG[i].id;
    if (source[id] && typeof source[id] === "object") {
      accounts[id] = Object.assign({}, accounts[id], source[id]);
    }
  }
  return accounts;
}

function trimKey(value) {
  return String(value || "").trim();
}

function selectedImageProvider(raw) {
  var image = normalizeProviderId(raw && raw.imageProvider);
  if (!image || image === "same") return normalizeProviderId(raw && raw.pageProvider);
  return image;
}

export function buildAccountsFromFlat(raw) {
  var source = raw || {};
  var accounts = emptyAccounts();
  var page = normalizeProviderId(source.pageProvider);
  var image = selectedImageProvider(source);

  var openrouterKey = trimKey(source.openrouterApiKey);
  if (openrouterKey) accounts.openrouter.apiKey = openrouterKey;

  var opencodeKey = trimKey(source.opencodeApiKey);
  var zenSelected = page === "opencode-zen" || image === "opencode-zen";
  var goSelected = page === "opencode-go" || image === "opencode-go";
  if (opencodeKey) {
    if (zenSelected || (!zenSelected && !goSelected)) {
      accounts["opencode-zen"].apiKey = opencodeKey;
    }
    if (goSelected) accounts["opencode-go"].apiKey = opencodeKey;
  }
  if (source.opencodeZenEndpoint) accounts["opencode-zen"].endpoint = source.opencodeZenEndpoint;
  if (source.opencodeGoEndpoint) accounts["opencode-go"].endpoint = source.opencodeGoEndpoint;

  accounts.agentplatform.vertexAuthType = source.vertexAuthType || "apikey";
  accounts.agentplatform.projectId = source.googleProjectId || "";
  accounts.agentplatform.location = source.googleLocation || "global";
  accounts.agentplatform.endpoint = source.googleEndpoint || accounts.agentplatform.endpoint;
  accounts.agentplatform.thinkingBudget = parseInt(source.googleThinkingBudget, 10) || 0;

  var googleKey = trimKey(source.googleApiKey);
  var agentSelected = page === "agentplatform" || image === "agentplatform";
  var geminiSelected = page === "gemini" || image === "gemini";
  if (googleKey) {
    if (agentSelected || (!agentSelected && !geminiSelected)) {
      accounts.agentplatform.apiKey = googleKey;
    }
    if (geminiSelected) accounts.gemini.apiKey = googleKey;
  }
  return accounts;
}

function legacySecretsPresent(raw) {
  if (!raw) return false;
  for (var i = 0; i < LEGACY_SECRET_FIELDS.length; i++) {
    if (Object.prototype.hasOwnProperty.call(raw, LEGACY_SECRET_FIELDS[i])) return true;
  }
  return false;
}

export function migrateSettings(raw) {
  var source = raw && typeof raw === "object" ? raw : {};
  var next = Object.assign({}, DEFAULT_SETTINGS, source);
  var hadAccounts = !!(source.accounts && typeof source.accounts === "object");
  next.accounts = hadAccounts ? cloneAccounts(source.accounts) : buildAccountsFromFlat(source);
  next.pageProvider = normalizeProviderId(next.pageProvider) || "agentplatform";

  var imageProvider = normalizeProviderId(next.imageProvider);
  if (!imageProvider || imageProvider === "same") {
    imageProvider = isRasterProvider(next.pageProvider) ? next.pageProvider : "";
  }
  if ((next.imageEngine || "image-model") === "image-model" && imageProvider && !isRasterProvider(imageProvider)) {
    imageProvider = isRasterProvider(next.pageProvider) ? next.pageProvider : "";
  }
  next.imageProvider = imageProvider;

  var cached = Object.assign({}, DEFAULT_SETTINGS.cachedModels, source.cachedModels || {});
  next.cachedModels = {};
  var cacheKeys = Object.keys(cached);
  for (var c = 0; c < cacheKeys.length; c++) {
    var cacheKey = cacheKeys[c];
    next.cachedModels[cacheKey] = Array.isArray(cached[cacheKey]) ? cached[cacheKey].slice() : cached[cacheKey];
  }

  for (var i = 0; i < LEGACY_SECRET_FIELDS.length; i++) {
    delete next[LEGACY_SECRET_FIELDS[i]];
  }
  next._migratedFromLegacy = !hadAccounts && legacySecretsPresent(source);
  return next;
}

export const DEFAULT_SETTINGS = {
  pageProvider: "agentplatform",
  pageModel: "gemini-3.8-flash",
  temperature: 0.7,
  timelineDivergence: 0,
  imageMode: "all",
  imageEngine: "image-model",
  imageProvider: "",
  imageModel: "gemini-3.1-flash-image",
  maxImagesPerPage: 12,
  showStandaloneTitlebar: false,
  accounts: emptyAccounts(),
  cachedModels: {
    googleChat: [],
    googleImage: [],
    opencodeZenChat: [],
    opencodeGoChat: [],
    orChat: [],
    orImage: []
  }
};

export function loadSettings() {
  try {
    if (typeof localStorage === "undefined") return migrateSettings(null);
    var raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && parsed.maxImagesPerPage === 3) {
        parsed.maxImagesPerPage = 12;
      }
      var migrated = migrateSettings(parsed);
      delete migrated._migratedFromLegacy;
      var needsSave = !parsed.accounts || parsed.pageProvider === "aistudio" ||
        parsed.imageProvider === "same" || legacySecretsPresent(parsed);
      if (needsSave) saveSettings(migrated);
      return migrated;
    }
  } catch (e) {
    // ignore
  }
  return migrateSettings(null);
}

export function saveSettings(settings) {
  try {
    if (typeof localStorage === "undefined") return;
    var copy = Object.assign({}, settings);
    delete copy._migratedFromLegacy;
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(copy));
  } catch (e) {
    // ignore
  }
}
