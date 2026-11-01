var BrowserOfDreamsBundle = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/main.js
  var main_exports = {};
  __export(main_exports, {
    default: () => main_default,
    initApp: () => initApp
  });

  // src/ui/dom.js
  var els = {};
  function initDOM() {
    if (typeof document === "undefined") return els;
    els.htmlRoot = document.documentElement;
    els.browserWindow = document.getElementById("browser-window");
    els.titleBar = document.getElementById("title-bar");
    els.eraPill = document.getElementById("era-pill");
    els.menuEraPill = document.getElementById("menu-era-pill");
    els.providerBadge = document.getElementById("provider-status-badge");
    els.apiStatusDot = document.getElementById("api-status-dot");
    els.providerSummaryText = document.getElementById("provider-summary-text");
    els.btnBack = document.getElementById("btn-back");
    els.btnForward = document.getElementById("btn-forward");
    els.btnReload = document.getElementById("btn-reload");
    els.btnStop = document.getElementById("btn-stop");
    els.btnHome = document.getElementById("btn-home");
    els.btnSource = document.getElementById("btn-source");
    els.btnSettings = document.getElementById("btn-settings");
    els.btnInstallApp = document.getElementById("btn-install-app");
    els.menuInstallBtn = document.getElementById("menu-install-btn");
    els.menuHomeBtn = document.getElementById("menu-home-btn");
    els.menuSourceBtn = document.getElementById("menu-source-btn");
    els.menuBookmarksBtn = document.getElementById("menu-bookmarks-btn");
    els.menuRegenerateImgsBtn = document.getElementById("menu-regenerate-imgs-btn");
    els.menuSettingsBtn = document.getElementById("menu-settings-btn");
    els.throbber = document.getElementById("throbber");
    els.btnWinMin = document.getElementById("win-min");
    els.btnWinMax = document.getElementById("win-max");
    els.btnWinClose = document.getElementById("win-close");
    els.metaThemeColor = document.getElementById("meta-theme-color");
    els.omniboxForm = document.getElementById("omnibox-form");
    els.urlInput = document.getElementById("url-input");
    els.dateInput = document.getElementById("date-input");
    els.btnPrevDay = document.getElementById("btn-prev-day");
    els.btnNextDay = document.getElementById("btn-next-day");
    els.timelineDivergenceSlider = document.getElementById("timeline-divergence-slider");
    els.timelineDivergenceBadge = document.getElementById("timeline-divergence-badge");
    els.presetSelect = document.getElementById("preset-select");
    els.homeScreen = document.getElementById("home-screen");
    els.homeEraBadge = document.getElementById("home-era-badge");
    els.homeApiWarning = document.getElementById("home-api-warning");
    els.homeOpenSettingsBtn = document.getElementById("home-open-settings-btn");
    els.featuredPortalsGrid = document.getElementById("featured-portals-grid");
    els.recentHistorySection = document.getElementById("recent-history-section");
    els.recentHistoryList = document.getElementById("recent-history-list");
    els.btnClearCacheHome = document.getElementById("btn-clear-cache-home");
    els.dreamFrame = document.getElementById("dream-frame");
    els.loadingOverlay = document.getElementById("loading-overlay");
    els.loadingDialogTitle = document.getElementById("loading-dialog-title");
    els.loadingHeadline = document.getElementById("loading-headline");
    els.loadingSubline = document.getElementById("loading-subline");
    els.loadingProgressBar = document.getElementById("loading-progress-bar");
    els.loadingBytes = document.getElementById("loading-bytes");
    els.loadingElapsed = document.getElementById("loading-elapsed");
    els.loadingStreamPreview = document.getElementById("loading-stream-preview");
    els.loadingCancelBtn = document.getElementById("loading-cancel-btn");
    els.loadingStopBtn = document.getElementById("loading-stop-btn");
    els.loadingAnimIcon = document.getElementById("loading-anim-icon");
    els.transferAnimStage = document.getElementById("transfer-animation-stage");
    els.transferIconSource = document.getElementById("transfer-icon-source");
    els.transferIconDest = document.getElementById("transfer-icon-dest");
    els.flyingGlyphs = [
      document.getElementById("flying-glyph-1"),
      document.getElementById("flying-glyph-2"),
      document.getElementById("flying-glyph-3")
    ];
    els.statusText = document.getElementById("status-text");
    els.statusProgressPanel = document.getElementById("status-progress-panel");
    els.statusProgressBar = document.getElementById("status-progress-bar");
    els.statusMemes = document.getElementById("status-memes-display");
    els.statusImages = document.getElementById("status-images");
    els.statusDate = document.getElementById("status-date-display");
    els.textModelPair = document.getElementById("text-model-pair");
    els.textProviderSelect = document.getElementById("text-provider-select");
    els.textModelSelect = document.getElementById("text-model-select");
    els.textModelCustom = document.getElementById("text-model-custom");
    els.textModelEmpty = document.getElementById("text-model-empty");
    els.imageModelPair = document.getElementById("image-model-pair");
    els.imageProviderSelect = document.getElementById("image-provider-select");
    els.imageModelSelect = document.getElementById("image-model-select");
    els.imageModelCustom = document.getElementById("image-model-custom");
    els.imageModelEmpty = document.getElementById("image-model-empty");
    els.settingsModal = document.getElementById("settings-modal");
    els.settingsCloseBtn = document.getElementById("settings-close-btn");
    els.settingsCancelBtn = document.getElementById("settings-cancel-btn");
    els.settingsSaveBtn = document.getElementById("settings-save-btn");
    els.settingsGithubLink = document.getElementById("settings-github-link");
    els.settingsGithubBtn = document.getElementById("settings-github-btn");
    els.providerAccountList = document.getElementById("provider-account-list");
    els.providerEditPanel = document.getElementById("provider-edit-panel");
    els.providerEditTitle = document.getElementById("provider-edit-title");
    els.providerCorsNotice = document.getElementById("provider-cors-notice");
    els.editAuthRow = document.getElementById("edit-auth-row");
    els.editAuthType = document.getElementById("edit-auth-type");
    els.editKeyLabel = document.getElementById("edit-key-label");
    els.editApiKey = document.getElementById("edit-api-key");
    els.editToggleKeyVis = document.getElementById("edit-toggle-key-vis");
    els.editProjectRow = document.getElementById("edit-project-row");
    els.editProjectId = document.getElementById("edit-project-id");
    els.editLocation = document.getElementById("edit-location");
    els.editEndpointRow = document.getElementById("edit-endpoint-row");
    els.editEndpoint = document.getElementById("edit-endpoint");
    els.editEndpointHelp = document.getElementById("edit-endpoint-help");
    els.editReasoningRow = document.getElementById("edit-reasoning-row");
    els.editReasoningEffort = document.getElementById("edit-reasoning-effort");
    els.editSitePlanReasoningRow = document.getElementById("edit-site-plan-reasoning-row");
    els.editSitePlanReasoningEffort = document.getElementById("edit-site-plan-reasoning-effort");
    els.providerEditSave = document.getElementById("provider-edit-save");
    els.providerEditFetch = document.getElementById("provider-edit-fetch");
    els.providerEditClose = document.getElementById("provider-edit-close");
    els.providerEditStatus = document.getElementById("provider-edit-status");
    els.temperatureSlider = document.getElementById("temperature-slider");
    els.tempValLabel = document.getElementById("temp-val-label");
    els.settingsTimelineSlider = document.getElementById("settings-timeline-slider");
    els.settingsTimelineLabel = document.getElementById("settings-timeline-label");
    els.settingsTimelineDesc = document.getElementById("settings-timeline-desc");
    els.imageModeSelect = document.getElementById("image-mode-select");
    els.imageEngineSelect = document.getElementById("image-engine-select");
    els.imageEngineHint = document.getElementById("image-engine-hint");
    els.maxImagesSlider = document.getElementById("max-images-slider");
    els.maxImagesLabel = document.getElementById("max-images-label");
    els.btnClearCache = document.getElementById("btn-clear-cache");
    els.pwaStatusLine = document.getElementById("pwa-status-line");
    els.btnModalInstallApp = document.getElementById("btn-modal-install-app");
    els.chkShowStandaloneTitlebar = document.getElementById("chk-show-standalone-titlebar");
    els.sourceModal = document.getElementById("source-modal");
    els.sourceCloseBtn = document.getElementById("source-close-btn");
    els.sourceDoneBtn = document.getElementById("source-done-btn");
    els.sourceTextarea = document.getElementById("source-textarea");
    els.sourceCharCount = document.getElementById("source-char-count");
    els.btnCopySource = document.getElementById("btn-copy-source");
    els.btnDownloadSource = document.getElementById("btn-download-source");
    return els;
  }

  // src/core/effort.js
  var REASONING_EFFORT_LEVELS = ["off", "low", "medium", "high", "xhigh", "max"];
  var EFFORT_THINKING_BUDGETS = { off: 0, low: 1024, medium: 4096, high: 16384, xhigh: 24576, max: 32768 };
  var DEFAULT_OUTPUT_CEILING = 32768;
  function outputTokenBudget(contentTokens, thinkingBudget, ceiling) {
    var content = parseInt(contentTokens, 10);
    if (!isFinite(content) || content < 0) content = 0;
    var budget = parseInt(thinkingBudget, 10) || 0;
    if (budget <= 0) return content;
    var total = content + budget;
    var cap = parseInt(ceiling, 10) || DEFAULT_OUTPUT_CEILING;
    return total > cap ? cap : total;
  }
  function normalizeReasoningEffort(value) {
    var v = String(value == null ? "" : value).toLowerCase();
    return REASONING_EFFORT_LEVELS.indexOf(v) === -1 ? "off" : v;
  }
  function effortToThinkingBudget(effort) {
    return EFFORT_THINKING_BUDGETS[normalizeReasoningEffort(effort)];
  }
  function thinkingBudgetToEffort(budget) {
    var b = parseInt(budget, 10) || 0;
    if (b <= 0) return "off";
    if (b <= 1024) return "low";
    if (b <= 8192) return "medium";
    return "high";
  }
  function providerReasoningEffort(effort) {
    var e = normalizeReasoningEffort(effort);
    if (e === "off") return "";
    if (e === "xhigh" || e === "max") return "high";
    return e;
  }
  function openRouterReasoningEffort(effort) {
    return providerReasoningEffort(effort) || "none";
  }
  function localReasoningEffort(effort) {
    return providerReasoningEffort(effort);
  }

  // src/core/settings.js
  var STORAGE_KEY_SETTINGS = "browser_of_dreams_settings_v1";
  var PROVIDER_CATALOG = [
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
      id: "commandcode",
      name: "Command Code",
      raster: false,
      defaultEndpoint: "https://api.commandcode.ai/provider/v1"
    },
    {
      id: "openrouter",
      name: "OpenRouter",
      raster: true,
      defaultEndpoint: "https://openrouter.ai/api/v1"
    },
    {
      id: "local",
      name: "Local LLM (OpenAI-compatible)",
      raster: false,
      keyless: true,
      defaultEndpoint: "http://localhost:11434/v1"
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
  function normalizeProviderId(id) {
    if (id === "aistudio") return "gemini";
    return id || "";
  }
  function providerById(id) {
    var normalized = normalizeProviderId(id);
    for (var i = 0; i < PROVIDER_CATALOG.length; i++) {
      if (PROVIDER_CATALOG[i].id === normalized) return PROVIDER_CATALOG[i];
    }
    return null;
  }
  function isRasterProvider(id) {
    var provider = providerById(id);
    return !!(provider && provider.raster);
  }
  function emptyAccounts() {
    var accounts = {};
    for (var i = 0; i < PROVIDER_CATALOG.length; i++) {
      var provider = PROVIDER_CATALOG[i];
      var account = { apiKey: "" };
      if (provider.id === "agentplatform") {
        account.vertexAuthType = "apikey";
        account.projectId = "";
        account.location = "global";
        account.endpoint = provider.defaultEndpoint;
      } else if (provider.id === "opencode-zen" || provider.id === "opencode-go") {
        account.endpoint = provider.defaultEndpoint;
      } else if (provider.id === "local") {
        account.endpoint = provider.defaultEndpoint;
        account.enabled = false;
      }
      account.reasoningEffort = "off";
      account.sitePlanReasoningEffort = "off";
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
        if (accounts[id].thinkingBudget !== void 0) {
          if (accounts[id].reasoningEffort === "off") {
            accounts[id].reasoningEffort = thinkingBudgetToEffort(accounts[id].thinkingBudget);
          }
          delete accounts[id].thinkingBudget;
        }
        if (accounts[id].homepageReasoningEffort !== void 0) {
          if (accounts[id].sitePlanReasoningEffort === "off") {
            accounts[id].sitePlanReasoningEffort = accounts[id].homepageReasoningEffort;
          }
          delete accounts[id].homepageReasoningEffort;
        }
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
  function buildAccountsFromFlat(raw) {
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
      if (zenSelected || !zenSelected && !goSelected) {
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
    accounts.agentplatform.reasoningEffort = thinkingBudgetToEffort(source.googleThinkingBudget);
    var googleKey = trimKey(source.googleApiKey);
    var agentSelected = page === "agentplatform" || image === "agentplatform";
    var geminiSelected = page === "gemini" || image === "gemini";
    if (googleKey) {
      if (agentSelected || !agentSelected && !geminiSelected) {
        accounts.agentplatform.apiKey = googleKey;
      }
      if (geminiSelected) accounts.gemini.apiKey = googleKey;
    }
    return accounts;
  }
  function accountsHaveLegacyEffortFields(accounts) {
    if (!accounts || typeof accounts !== "object") return false;
    for (var id in accounts) {
      var a = accounts[id];
      if (a && typeof a === "object" && (a.thinkingBudget !== void 0 || a.homepageReasoningEffort !== void 0)) {
        return true;
      }
    }
    return false;
  }
  function legacySecretsPresent(raw) {
    if (!raw) return false;
    for (var i = 0; i < LEGACY_SECRET_FIELDS.length; i++) {
      if (Object.prototype.hasOwnProperty.call(raw, LEGACY_SECRET_FIELDS[i])) return true;
    }
    return false;
  }
  function migrateSettings(raw) {
    var source = raw && typeof raw === "object" ? raw : {};
    var next = Object.assign({}, DEFAULT_SETTINGS, source);
    var hadAccounts = !!(source.accounts && typeof source.accounts === "object");
    next.accounts = hadAccounts ? cloneAccounts(source.accounts) : buildAccountsFromFlat(source);
    next.pageProvider = normalizeProviderId(next.pageProvider) || "agentplatform";
    var imageProvider = normalizeProviderId(next.imageProvider);
    if (!imageProvider || imageProvider === "same") {
      imageProvider = isRasterProvider(next.pageProvider) ? next.pageProvider : "";
    }
    var engine = next.imageEngine || "image-model";
    if ((engine === "image-model" || engine === "hybrid") && imageProvider && !isRasterProvider(imageProvider)) {
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
  var DEFAULT_SETTINGS = {
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
      commandcodeChat: [],
      localChat: [],
      orChat: [],
      orImage: []
    }
  };
  function loadSettings() {
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
        var needsSave = !parsed.accounts || parsed.pageProvider === "aistudio" || parsed.imageProvider === "same" || legacySecretsPresent(parsed) || accountsHaveLegacyEffortFields(parsed.accounts);
        if (needsSave) saveSettings(migrated);
        return migrated;
      }
    } catch (e) {
    }
    return migrateSettings(null);
  }
  function saveSettings(settings) {
    try {
      if (typeof localStorage === "undefined") return;
      var copy = Object.assign({}, settings);
      delete copy._migratedFromLegacy;
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(copy));
    } catch (e) {
    }
  }

  // src/core/timeline.js
  function getTimelineDivergenceProfile(divergenceValue, year) {
    var raw = typeof divergenceValue === "number" ? divergenceValue : parseFloat(divergenceValue);
    if (isNaN(raw)) raw = 0;
    var pct = Math.max(0, Math.min(100, Math.round(raw)));
    var y = parseInt(year, 10) || 2001;
    if (pct <= 15) {
      return {
        pct,
        tierKey: "grounded",
        shortLabel: "\u{1F3DB}\uFE0F Grounded",
        badgeText: "\u{1F3DB}\uFE0F Grounded (" + pct + "%)",
        fullTitle: pct + "% \u2014 \u{1F3DB}\uFE0F Grounded (Strict Historical & Real-World Accuracy)",
        description: "100% anchored to real-world history, real companies, real events, and authentic facts of the selected date.",
        imageDirective: "Strictly historically accurate " + y + " real-world documentary/commercial realism.",
        promptGuide: "Timeline " + pct + "% grounded: real people, companies, products, scores, and events as of this date. No alternate history. An obscure or fictional domain is still a real " + y + " site in our world."
      };
    }
    if (pct <= 39) {
      return {
        pct,
        tierKey: "plausible",
        shortLabel: "\u{1F4F0} Plausible",
        badgeText: "\u{1F4F0} Plausible (" + pct + "%)",
        fullTitle: pct + "% \u2014 \u{1F4F0} Plausible Era (Historically Anchored + Creative Detail)",
        description: "Anchored in real history, with creative latitude for quirky local stories, indie startups, and colorful period flavor.",
        imageDirective: "Plausible " + y + " period-authentic scene with colorful period detail.",
        promptGuide: "Timeline " + pct + "% plausible: real " + y + " events, technology, and politics. Invent only local stories, niche products, forum threads, and ads that could have existed then."
      };
    }
    if (pct <= 64) {
      return {
        pct,
        tierKey: "divergent",
        shortLabel: "\u{1F300} What-If",
        badgeText: "\u{1F300} What-If (" + pct + "%)",
        fullTitle: pct + "% \u2014 \u{1F300} Divergent History (One Counterfactual What-If)",
        description: "Real era look and technology, plus one counterfactual what-if in the news, products, and politics.",
        imageDirective: "Alternate-history " + y + " scene: one changed event, photographed like a real " + y + " picture.",
        promptGuide: "Timeline " + pct + "% what-if: real " + y + " web, technology, and culture, plus one clear historical change (election, company, treaty, or product) visible in the news, products, and ads."
      };
    }
    if (pct <= 84) {
      return {
        pct,
        tierKey: "alternate",
        shortLabel: "\u26A1 Alt History",
        badgeText: "\u26A1 Alt History (" + pct + "%)",
        fullTitle: pct + "% \u2014 \u26A1 Alternate History (Different Outcomes, Same Era)",
        description: "A rewritten branch of history: different elections, companies, and borders, using the technology and design of that year.",
        imageDirective: "Alternate-history " + y + " scene: different politics and products, photographed like a real " + y + " picture.",
        promptGuide: "Timeline " + pct + "% alternate history: rewrite " + y + " political and commercial outcomes. Same science and everyday technology as our " + y + ". Tickers, weather, sidebars, and ads belong to that branch, in a period-faithful layout."
      };
    }
    return {
      pct,
      tierKey: "fanciful",
      shortLabel: "\u{1F30C} Fever Dream",
      badgeText: "\u{1F30C} Alt Reality (" + pct + "%)",
      fullTitle: pct + "% \u2014 \u{1F30C} Fever-Dream Alternate History",
      description: "An earnest, exaggerated alternate history: impossible products and odd headlines, still looking like that year.",
      imageDirective: "Fanciful alternate-history " + y + " scene: impossible products and odd headlines, rendered as a real " + y + " photograph.",
      promptGuide: "Timeline " + pct + "% fever dream: an earnest alternate history of " + y + " \u2014 impossible products, odd headlines, strange tickers \u2014 in authentic " + y + " HTML."
    };
  }

  // src/core/era.js
  function getEraInfo(dateStr) {
    var parts = String(dateStr || "1999-12-31").split("-");
    var year = parseInt(parts[0], 10) || 1999;
    var month = parseInt(parts[1], 10) || 12;
    var day = parseInt(parts[2], 10) || 31;
    var dt = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var formattedLong = days[dt.getUTCDay()] + ", " + months[dt.getUTCMonth()] + " " + dt.getUTCDate() + ", " + year;
    var formattedShort = shortMonths[dt.getUTCMonth()] + " " + dt.getUTCDate() + ", " + year;
    if (year < 1990) {
      return {
        eraKey: "pre90s",
        year,
        formattedLong,
        formattedShort,
        badgeLabel: "ARPANET / BBS Terminal (" + year + ")",
        browserName: "TELE-NET CRT Navigator",
        styleGuide: "Design " + year + " (pre-WWW): BBS, ARPANET, CompuServe, Minitel, or Gopher. Be inventive but not anachronistic with the webpage design. Courier, phosphor CRT (green #33ff66 or amber #ffb000 on #050a05), ASCII borders, baud notice, text menus. No HTML chrome."
      };
    }
    if (year <= 1994) {
      return {
        eraKey: "1990s",
        year,
        formattedLong,
        formattedShort,
        badgeLabel: "Early Mosaic Web 1.0 (" + year + ")",
        browserName: "NCSA Mosaic / Netscape 1.0",
        styleGuide: "Design " + year + " (Mosaic / HTML 2): Be inventive but not anachronistic with the webpage design. Gray #c0c0c0 or plain background, Times, blue #0000ee links, purple #551a8b visited. h1\u2013h3, hr, lists, pre, blockquote, dithered images. No CSS, no nested layout tables."
      };
    }
    if (year <= 1999) {
      return {
        eraKey: "1990s",
        year,
        formattedLong,
        formattedShort,
        badgeLabel: "Web 1.0 / Netscape Era (" + year + ")",
        browserName: "Netscape Dreamicator 4.0",
        styleGuide: "Design " + year + " (Web 1.0): Be inventive but not anachronistic with the webpage design. Own palette and layout, not one repeated homepage. Nested tables, font tags, tiled backgrounds, beveled borders, web-safe colors, hit counters, 800x600 badge, banner ads. No Flexbox, Grid, or later JS."
      };
    }
    if (year <= 2005) {
      return {
        eraKey: "2000s",
        year,
        formattedLong,
        formattedShort,
        badgeLabel: "Early 2000s Portal Era (" + year + ")",
        browserName: "Dream Explorer 6.0",
        styleGuide: "Design " + year + ": Be inventive but not anachronistic with the webpage design. Not one generic layout \u2014 corporate, editorial, startup, fan, and shop sites each had their own. Fixed 760\u2013960px, tables or early CSS, Verdana/Tahoma/Georgia/Arial, tab nav, pixel borders, banner and box ads. Strictly NO modern SPAs, reactive components, CSS Grid, or Flexbox."
      };
    }
    if (year <= 2011) {
      return {
        eraKey: "2000s",
        year,
        formattedLong,
        formattedShort,
        badgeLabel: "Web 2.0 Glossy Era (" + year + ")",
        browserName: "Dream Explorer / Web 2.0",
        styleGuide: "Design " + year + " (Web 2.0): Be inventive but not anachronistic with the webpage design. A campaign site like barackobama.com, a tech company, a network, or an indie each had its own type, hero, and layout. Floats, rounded corners, gloss, soft shadows, RSS, BETA badges. No CSS Grid, no reactive SPAs, no 2020s flat systems."
      };
    }
    if (year <= 2029) {
      return {
        eraKey: "modern",
        year,
        formattedLong,
        formattedShort,
        badgeLabel: "Modern Web (" + year + ")",
        browserName: "Dreamium Browser",
        styleGuide: "Design " + year + ": Be inventive but not anachronistic with the webpage design. Distinct magazine, showcase, portfolio, or product layout \u2014 not a boilerplate. Flexbox/Grid, a real type scale, hero, cards, contemporary ads."
      };
    }
    return {
      eraKey: "future",
      year,
      formattedLong,
      formattedShort,
      badgeLabel: "ChronoNet Future (" + year + ")",
      browserName: "ChronoNet Quantum Nexus",
      styleGuide: "Design " + year + ": Be inventive but not anachronistic with the webpage design. Interface for that year \u2014 glass, telemetry, or latency \u2014 specific to this service."
    };
  }
  function getCharsetGuide(year) {
    var y = parseInt(year, 10);
    if (!y || isNaN(y)) y = 1999;
    if (y < 1990) {
      return {
        id: "ascii",
        label: "7-bit ASCII",
        text: 'CHARACTER SET (7-bit ASCII): type only what an ASCII keyboard produced - letters, digits, and ASCII punctuation. Curly quotes, apostrophes, en and em dashes, ellipses, bullets, accented letters, copyright and trademark signs, and emoji have no byte here; use straight quotes, "-", and "..." instead.'
      };
    }
    if (y <= 2007) {
      return {
        id: "windows-1252",
        label: "Windows-1252",
        text: "CHARACTER SET (Windows-1252): curly quotes and apostrophes, en and em dashes, the ellipsis, bullets, copyright and trademark signs, and Western European accents all have bytes. Letters outside Latin-1 (Slavic, Greek, Turkish, Vietnamese), arrows, box drawing, check marks, emoji, and combining marks do not - keep to what a Latin-1 keyboard produced."
      };
    }
    return { id: "utf-8", label: "UTF-8", text: "" };
  }
  var ERA_THEME_COLORS = {
    pre90s: "#050a05",
    "1990s": "#000080",
    "2000s": "#1f4b99",
    modern: "#1e1e2f",
    future: "#0c0728"
  };
  function applyEraTheme(dateStr, dom) {
    var era = getEraInfo(dateStr);
    var root = dom && dom.htmlRoot || (typeof document !== "undefined" ? document.documentElement : null);
    var eraPill = dom && dom.eraPillEl || (typeof document !== "undefined" ? document.getElementById("era-pill") : null);
    var menuEraPill = dom && dom.menuEraPill || (typeof document !== "undefined" ? document.getElementById("menu-era-pill") : null);
    var statusDate = dom && dom.statusDateEl || (typeof document !== "undefined" ? document.getElementById("status-date-display") : null);
    var homeBadge = dom && dom.homeEraBadge || (typeof document !== "undefined" ? document.getElementById("home-era-badge") : null);
    if (root) root.setAttribute("data-era", era.eraKey);
    if (eraPill) eraPill.textContent = era.badgeLabel;
    if (menuEraPill) menuEraPill.textContent = era.badgeLabel;
    if (statusDate) statusDate.textContent = "\u{1F4C5} " + era.formattedShort;
    if (homeBadge) homeBadge.textContent = "ACTIVE ERA: " + era.badgeLabel.toUpperCase();
    var themeColor = ERA_THEME_COLORS[era.eraKey] || "#1f4b99";
    era.themeColor = themeColor;
    if (typeof document !== "undefined") {
      var meta = document.getElementById("meta-theme-color") || document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", themeColor);
    }
    return era;
  }

  // src/core/urls.js
  function normalizeDreamUrl(rawInput, year) {
    var trimmed = String(rawInput || "").trim();
    if (!trimmed || trimmed === "about:dreams" || trimmed === "about:home") {
      return "about:dreams";
    }
    var scheme = year && year >= 2014 ? "https://" : "http://";
    if (/\s/.test(trimmed) || trimmed.indexOf(".") === -1) {
      var q = encodeURIComponent(trimmed);
      if (year && year < 1995) return "http://info.cern.ch/hypertext/DataSources/bySubject.html?q=" + q;
      if (year && year <= 1998) return "http://www.altavista.digital.com/cgi-bin/query?pg=q&q=" + q;
      if (year && year <= 2003) return "http://www.google.com/search?q=" + q;
      return scheme + "www.google.com/search?q=" + q;
    }
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }
    var withScheme = scheme + trimmed;
    try {
      var u = new URL(withScheme);
      if (!u.hostname.startsWith("www.") && u.hostname.split(".").length === 2 && (!year || year <= 2008)) {
        u.hostname = "www." + u.hostname;
      }
      return u.toString();
    } catch (e) {
      return withScheme;
    }
  }
  function getHomepageUrl(normalizedUrl) {
    var raw = String(normalizedUrl || "").trim();
    if (!raw || raw === "about:dreams" || raw === "about:home") {
      return "about:dreams";
    }
    try {
      var u = new URL(raw);
      return u.origin + "/";
    } catch (e) {
      var m = /^(https?:\/\/[^\/?#]+)/i.exec(raw);
      return m ? m[1] + "/" : raw;
    }
  }
  function isHomepageUrl(normalizedUrl) {
    var raw = String(normalizedUrl || "").trim();
    if (!raw || raw === "about:dreams" || raw === "about:home") {
      return true;
    }
    try {
      var u = new URL(raw);
      if (u.search && u.search.length > 1) return false;
      var p = (u.pathname || "/").toLowerCase();
      return p === "/" || p === "/index.html" || p === "/index.htm" || p === "/default.htm" || p === "/default.asp" || p === "/home.html";
    } catch (e) {
      return raw === getHomepageUrl(raw);
    }
  }
  function extractDomain(rawUrl) {
    var raw = String(rawUrl || "").trim();
    if (!raw || raw.startsWith("about:") || raw.startsWith("data:")) {
      return "";
    }
    try {
      var withScheme = /^https?:\/\//i.test(raw) ? raw : "http://" + raw;
      var u = new URL(withScheme);
      var host = (u.hostname || "").toLowerCase();
      return host.replace(/^www\./, "");
    } catch (e) {
      var m = /^(?:https?:\/\/)?(?:www\.)?([^\/\s:#?]+)/i.exec(raw);
      return m ? m[1].toLowerCase() : "";
    }
  }

  // src/core/cache.js
  var STORAGE_KEY_PAGE_CACHE = "browser_of_dreams_pages_v1";
  var STORAGE_KEY_DOMAIN_IMAGES = "browser_of_dreams_domain_images_v1";
  var STORAGE_KEY_SITE_PLANS = "browser_of_dreams_site_plans_v1";
  var _internalDomainCache = null;
  var _internalSitePlanCache = null;
  function loadPageCache() {
    try {
      if (typeof localStorage === "undefined") return {};
      var raw = localStorage.getItem(STORAGE_KEY_PAGE_CACHE);
      if (raw) {
        var pageCache = JSON.parse(raw) || {};
        for (var key in pageCache) {
          if (pageCache[key] && pageCache[key].slotImages) {
            var slots = pageCache[key].slotImages;
            for (var sId in slots) {
              var item = slots[sId];
              if (typeof item === "string") {
                delete slots[sId];
              } else if (item && item.url && !key.toLowerCase().startsWith(item.url.toLowerCase())) {
                delete slots[sId];
              }
            }
          }
        }
        return pageCache;
      }
    } catch (e) {
    }
    return {};
  }
  function savePageCache(pageCache) {
    try {
      if (typeof localStorage === "undefined") return;
      var keys = Object.keys(pageCache);
      if (keys.length > 20) {
        keys.sort(function(a, b) {
          return (pageCache[a].timestamp || 0) - (pageCache[b].timestamp || 0);
        });
        while (keys.length > 20) {
          delete pageCache[keys.shift()];
        }
      }
      localStorage.setItem(STORAGE_KEY_PAGE_CACHE, JSON.stringify(pageCache));
    } catch (e) {
      try {
        var k = Object.keys(pageCache);
        if (k.length > 3) {
          delete pageCache[k[0]];
          localStorage.setItem(STORAGE_KEY_PAGE_CACHE, JSON.stringify(pageCache));
        }
      } catch (e2) {
      }
    }
  }
  function makeCacheKey(url, dateStr, divergenceVal) {
    var div = typeof divergenceVal === "number" ? divergenceVal : 0;
    var tier = getTimelineDivergenceProfile(div).tierKey;
    var base = String(url).toLowerCase() + "__" + String(dateStr);
    return tier === "grounded" ? base : base + "__" + tier;
  }
  function findClosestHomepage(pageCache, homepageUrl, dateStr, divergenceVal) {
    if (!pageCache || !homepageUrl || !dateStr) return null;
    var domain = extractDomain(homepageUrl);
    if (!domain) return null;
    var target = Date.parse(String(dateStr));
    if (isNaN(target)) return null;
    var best = null;
    var bestDist = Infinity;
    for (var key in pageCache) {
      var entry = pageCache[key];
      if (!entry || !entry.html || !entry.url || !entry.date) continue;
      if (String(entry.date) === String(dateStr)) continue;
      if (extractDomain(entry.url) !== domain) continue;
      if (!isHomepageUrl(entry.url)) continue;
      if (makeCacheKey(entry.url, entry.date, divergenceVal) !== key) continue;
      var when = Date.parse(String(entry.date));
      if (isNaN(when)) continue;
      var dist = Math.abs(when - target);
      var newer = best && (entry.timestamp || 0) > (best.timestamp || 0);
      if (dist < bestDist || dist === bestDist && newer) {
        best = entry;
        bestDist = dist;
      }
    }
    return best;
  }
  function loadDomainImageCache() {
    try {
      if (typeof localStorage === "undefined") {
        _internalDomainCache = _internalDomainCache || {};
        return _internalDomainCache;
      }
      var raw = localStorage.getItem(STORAGE_KEY_DOMAIN_IMAGES);
      if (raw) {
        _internalDomainCache = JSON.parse(raw) || {};
        return _internalDomainCache;
      }
    } catch (e) {
    }
    _internalDomainCache = _internalDomainCache || {};
    return _internalDomainCache;
  }
  function resetDomainImageCache() {
    _internalDomainCache = null;
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(STORAGE_KEY_DOMAIN_IMAGES);
      }
    } catch (e) {
    }
    return {};
  }
  function saveDomainImageCache(domainImageCache) {
    var target = domainImageCache || _internalDomainCache;
    if (!target) return;
    _internalDomainCache = target;
    try {
      if (typeof localStorage === "undefined") return;
      var allKeys = Object.keys(target);
      var totalEntries = 0;
      for (var i = 0; i < allKeys.length; i++) {
        if (Array.isArray(target[allKeys[i]])) {
          totalEntries += target[allKeys[i]].length;
        }
      }
      if (totalEntries > 40) {
        allKeys.forEach(function(k) {
          if (Array.isArray(target[k]) && target[k].length > 10) {
            target[k].sort(function(a, b) {
              return (a.timestamp || 0) - (b.timestamp || 0);
            });
            target[k] = target[k].slice(-10);
          }
        });
      }
      localStorage.setItem(STORAGE_KEY_DOMAIN_IMAGES, JSON.stringify(target));
    } catch (e) {
      try {
        var keys = Object.keys(target);
        if (keys.length > 1) {
          delete target[keys[0]];
          localStorage.setItem(STORAGE_KEY_DOMAIN_IMAGES, JSON.stringify(target));
        }
      } catch (e2) {
      }
    }
  }
  function resolveTimePeriod(dateOrYear) {
    var str = String(dateOrYear || "").trim();
    if (!str) return "2001";
    if (/^\d{4}$/.test(str)) return str;
    try {
      var era = getEraInfo(str);
      if (era && era.year) return String(era.year);
    } catch (e) {
    }
    var m = /^(\d{4})/.exec(str);
    return m ? m[1] : str;
  }
  function getOrientation(width, height) {
    var w = parseInt(width, 10) || 300;
    var h = parseInt(height, 10) || 200;
    if (w >= h * 1.25) return "horizontal";
    if (h >= w * 1.25) return "vertical";
    return "square";
  }
  function extractImageLabel(prompt, alt, domain, role) {
    if (alt && typeof alt === "string" && alt.trim().length > 1) {
      var cleanAlt = alt.trim().replace(/^alt\s*:\s*/i, "");
      if (!/^(ad|advertisement|photo|photograph|image|graphic|picture|banner)$/i.test(cleanAlt)) {
        return cleanAlt.slice(0, 32);
      }
    }
    var p = String(prompt || "").trim();
    p = p.replace(/^\[[^\]]+\]\s*/g, "");
    p = p.replace(/^(an?\s+)?(authentic|vintage|period|lead|breaking|editorial)?\s*(ad|advertisement|banner|photo|photograph|graphic|image|shot|illustration)\s+(for|of|showing)\s+/i, "");
    var match = /^([^,.;\(\)\n]+)/.exec(p);
    if (match && match[1].trim().length > 1) {
      var candidate = match[1].trim();
      if (candidate.length <= 32) return candidate;
      var truncated = candidate.slice(0, 30).replace(/\s+\S*$/, "");
      if (truncated.length > 2) return truncated;
    }
    var dom = extractDomain(domain);
    if (dom) {
      var brand = dom.split(".")[0];
      if (brand && brand !== "www" && brand !== "com" && brand.length > 1) {
        return brand.charAt(0).toUpperCase() + brand.slice(1);
      }
    }
    return role === "ad" ? "Advertisement" : role === "icon" ? "Icon" : role === "graphic" ? "Graphic" : "Editorial Photo";
  }
  function isImageCacheEngineCompatible(item, engine) {
    var requested = String(engine || "").trim();
    if (!requested) return true;
    var stored = String(item && item.engine || "").trim();
    if (stored) return stored === requested;
    var isSvg = /^data:image\/svg/i.test(String(item && item.dataUrl || ""));
    return requested === "image-model" ? !isSvg : false;
  }
  function formatImageDescriptor(item) {
    if (!item) return "";
    var normalizedRole = (item.role || "photo").toLowerCase();
    var role = normalizedRole === "ad" ? "AD" : normalizedRole === "icon" ? "ICON" : normalizedRole === "graphic" ? "GRAPHIC" : "PHOTO";
    var label = item.label || extractImageLabel(item.prompt, item.alt, item.domain, normalizedRole);
    var w = parseInt(item.width, 10) || (role === "AD" ? 468 : role === "ICON" ? 32 : 400);
    var h = parseInt(item.height, 10) || (role === "AD" ? 60 : role === "ICON" ? 32 : 300);
    var orientation = item.orientation || getOrientation(w, h);
    return "[" + role + ": " + label + ", " + orientation + ", " + w + "x" + h + "]";
  }
  function makeDomainImageKey(domain, dateOrYear, divergenceVal) {
    var d = extractDomain(domain) || String(domain || "").toLowerCase().replace(/^https?:\/\//i, "").replace(/\/.*$/, "").replace(/^www\./, "");
    var tp = resolveTimePeriod(dateOrYear);
    var div = typeof divergenceVal === "number" ? divergenceVal : 0;
    var tier = getTimelineDivergenceProfile(div).tierKey;
    var base = d + "__" + tp;
    return tier === "grounded" ? base : base + "__" + tier;
  }
  function resolveActiveDomainCache(optionalCache) {
    if (optionalCache && typeof optionalCache === "object") {
      return optionalCache;
    }
    if (!_internalDomainCache) {
      _internalDomainCache = loadDomainImageCache();
    }
    return _internalDomainCache;
  }
  function saveDomainImage(item, optionalCache) {
    if (!item || !item.domain || !item.dataUrl) return null;
    var domain = extractDomain(item.domain) || String(item.domain).toLowerCase().replace(/^www\./, "");
    var timePeriod = resolveTimePeriod(item.date || item.timePeriod);
    var div = typeof item.divergence === "number" ? item.divergence : 0;
    var cacheKey = makeDomainImageKey(domain, timePeriod, div);
    var cache = resolveActiveDomainCache(optionalCache);
    cache[cacheKey] = cache[cacheKey] || [];
    var list = cache[cacheKey];
    var normalizedRole = String(item.role || "photo").toLowerCase();
    var role = normalizedRole === "ad" || normalizedRole === "icon" || normalizedRole === "graphic" ? normalizedRole : "photo";
    var w = parseInt(item.width, 10) || (role === "ad" ? 468 : role === "icon" ? 32 : 400);
    var h = parseInt(item.height, 10) || (role === "ad" ? 60 : role === "icon" ? 32 : 300);
    var orientation = item.orientation || getOrientation(w, h);
    var label = item.label || extractImageLabel(item.prompt, item.alt, domain, role);
    var prompt = String(item.prompt || "").trim();
    var descriptor = item.descriptor || formatImageDescriptor({
      role,
      label,
      orientation,
      width: w,
      height: h
    });
    var id = item.id || domain.replace(/[^a-z0-9]/g, "-") + "-" + role + "-" + w + "x" + h + "-" + (list.length + 1);
    var existingIdx = -1;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id || prompt && list[i].prompt && list[i].prompt === prompt || list[i].descriptor === descriptor) {
        existingIdx = i;
        break;
      }
    }
    var entry = {
      id,
      domain,
      timePeriod,
      date: item.date || "",
      divergence: div,
      role,
      label,
      prompt,
      alt: item.alt || "",
      aspectRatio: item.aspectRatio || "",
      orientation,
      width: w,
      height: h,
      descriptor,
      engine: String(item.engine || ""),
      dataUrl: item.dataUrl,
      timestamp: item.timestamp || Date.now()
    };
    if (existingIdx >= 0) {
      list[existingIdx] = entry;
    } else {
      list.push(entry);
    }
    if (list.length > 25) {
      list.shift();
    }
    cache[cacheKey] = list;
    saveDomainImageCache(cache);
    return entry;
  }
  function getAvailableDomainImages(domain, dateOrYear, divergenceVal, optionalCache) {
    var d = extractDomain(domain) || String(domain || "").toLowerCase().replace(/^www\./, "");
    if (!d) return [];
    var tp = resolveTimePeriod(dateOrYear);
    var div = typeof divergenceVal === "number" ? divergenceVal : 0;
    var cacheKey = makeDomainImageKey(d, tp, div);
    var cache = resolveActiveDomainCache(optionalCache);
    var list = cache[cacheKey];
    if (Array.isArray(list)) {
      return list.slice();
    }
    return [];
  }
  function findMatchingDomainImage(domain, dateOrYear, divergenceVal, slotQuery, optionalCache) {
    if (!slotQuery) return null;
    var available = getAvailableDomainImages(domain, dateOrYear, divergenceVal, optionalCache);
    if (!available || available.length === 0) return null;
    var requestedEngine = String(slotQuery.engine || "").trim();
    if (requestedEngine) {
      available = available.filter(function(entry) {
        return isImageCacheEngineCompatible(entry, requestedEngine);
      });
      if (available.length === 0) return null;
    }
    var reuse = String(slotQuery.reuse || slotQuery.dataDreamReuse || "").trim();
    var prompt = String(slotQuery.prompt || slotQuery.dataDreamPrompt || "").trim();
    var alt = String(slotQuery.alt || "").trim().toLowerCase();
    var role = String(slotQuery.role || slotQuery.dataDreamRole || "").toLowerCase();
    if (reuse) {
      for (var i = 0; i < available.length; i++) {
        var it = available[i];
        if (it.id && it.id.toLowerCase() === reuse.toLowerCase()) return it;
        if (it.descriptor && it.descriptor.toLowerCase() === reuse.toLowerCase()) return it;
        if (it.label && it.label.toLowerCase() === reuse.toLowerCase()) return it;
      }
    }
    if (prompt) {
      for (var j = 0; j < available.length; j++) {
        var item = available[j];
        if (item.prompt && (item.prompt === prompt || item.prompt.trim() === prompt.trim())) {
          return item;
        }
        if (item.descriptor && prompt.includes(item.descriptor)) {
          return item;
        }
        if (item.label && prompt.toLowerCase().includes(item.label.toLowerCase()) && (!role || item.role === role)) {
          if (slotQuery.width && slotQuery.height) {
            var sw = parseInt(slotQuery.width, 10);
            var sh = parseInt(slotQuery.height, 10);
            if (Math.abs(sw - item.width) <= 20 && Math.abs(sh - item.height) <= 20) {
              return item;
            }
          }
        }
      }
    }
    if (alt && !/^(ad|photo|image|banner|picture)$/i.test(alt)) {
      for (var k = 0; k < available.length; k++) {
        var candidate = available[k];
        if (candidate.label && candidate.label.toLowerCase() === alt) {
          if (!role || candidate.role === role) return candidate;
        }
      }
    }
    return null;
  }
  function loadSitePlanCache() {
    try {
      if (typeof localStorage === "undefined") {
        _internalSitePlanCache = _internalSitePlanCache || {};
        return _internalSitePlanCache;
      }
      var raw = localStorage.getItem(STORAGE_KEY_SITE_PLANS);
      if (raw) {
        _internalSitePlanCache = JSON.parse(raw) || {};
        return _internalSitePlanCache;
      }
    } catch (e) {
    }
    _internalSitePlanCache = _internalSitePlanCache || {};
    return _internalSitePlanCache;
  }
  function resetSitePlanCache() {
    _internalSitePlanCache = null;
  }
  function saveSitePlanCache(sitePlanCache) {
    var target = sitePlanCache || _internalSitePlanCache;
    if (!target) return;
    _internalSitePlanCache = target;
    try {
      if (typeof localStorage === "undefined") return;
      var keys = Object.keys(target);
      if (keys.length > 60) {
        keys.sort(function(a, b) {
          return (target[a] && target[a].timestamp || 0) - (target[b] && target[b].timestamp || 0);
        });
        while (keys.length > 60) {
          delete target[keys.shift()];
        }
      }
      localStorage.setItem(STORAGE_KEY_SITE_PLANS, JSON.stringify(target));
    } catch (e) {
      try {
        var retryKeys = Object.keys(target);
        if (retryKeys.length > 1) {
          retryKeys.sort(function(a, b) {
            return (target[a] && target[a].timestamp || 0) - (target[b] && target[b].timestamp || 0);
          });
          delete target[retryKeys[0]];
          localStorage.setItem(STORAGE_KEY_SITE_PLANS, JSON.stringify(target));
        }
      } catch (e2) {
      }
    }
  }
  function makeSitePlanKey(domainOrUrl, dateOrYear, divergenceVal) {
    var d = extractDomain(domainOrUrl) || String(domainOrUrl || "").toLowerCase().replace(/^https?:\/\//i, "").replace(/\/.*$/, "").replace(/^www\./, "");
    var tp = resolveTimePeriod(dateOrYear);
    var div = typeof divergenceVal === "number" ? divergenceVal : 0;
    var tier = getTimelineDivergenceProfile(div).tierKey;
    var base = d + "__" + tp;
    return tier === "grounded" ? base : base + "__" + tier;
  }
  function resolveActiveSitePlanCache(optionalCache) {
    if (optionalCache && typeof optionalCache === "object") {
      return optionalCache;
    }
    if (!_internalSitePlanCache) {
      _internalSitePlanCache = loadSitePlanCache();
    }
    return _internalSitePlanCache;
  }
  function getCachedSitePlan(domainOrUrl, dateOrYear, divergenceVal, optionalCache) {
    var cache = resolveActiveSitePlanCache(optionalCache);
    var entry = cache[makeSitePlanKey(domainOrUrl, dateOrYear, divergenceVal)];
    return entry && entry.text ? entry : null;
  }
  function saveSitePlan(item, optionalCache) {
    if (!item) return null;
    var text = String(item.text || "").trim();
    if (!text) return null;
    var domain = extractDomain(item.domain) || String(item.domain || "").toLowerCase().replace(/^https?:\/\//i, "").replace(/\/.*$/, "").replace(/^www\./, "");
    var timePeriod = resolveTimePeriod(item.date);
    var div = typeof item.divergence === "number" ? item.divergence : 0;
    var cacheKey = makeSitePlanKey(domain, timePeriod, div);
    var entry = {
      domain,
      year: timePeriod,
      divergence: div,
      date: item.date || "",
      text,
      browserProfile: String(item.browserProfile || ""),
      timestamp: Date.now()
    };
    var cache = resolveActiveSitePlanCache(optionalCache);
    cache[cacheKey] = entry;
    saveSitePlanCache(cache);
    return entry;
  }

  // src/core/state.js
  var state = {
    settings: loadSettings(),
    pageCache: loadPageCache(),
    domainImageCache: loadDomainImageCache(),
    sitePlanCache: loadSitePlanCache(),
    imageMemoryCache: {},
    activeRequest: null,
    activeTimer: null,
    currentRawHtml: "",
    activeImageSlots: [],
    navigationEpoch: 0,
    currentNavigationUrl: "",
    currentNavigationDate: "",
    activeStreamWriter: null,
    activeBrowserProfile: ""
  };
  function resetActiveRequest() {
    state.navigationEpoch++;
    state.activeImageSlots = [];
    if (state.activeStreamWriter) {
      try {
        state.activeStreamWriter.close();
      } catch (e) {
      }
      state.activeStreamWriter = null;
    }
    if (state.activeRequest && typeof state.activeRequest.abort === "function") {
      state.activeRequest.abort();
    }
    state.activeRequest = null;
    if (state.activeTimer) {
      clearInterval(state.activeTimer);
      state.activeTimer = null;
    }
  }

  // src/core/history.js
  var historyStack = [];
  var historyIndex = -1;
  function pushHistory(entry) {
    historyStack = historyStack.slice(0, historyIndex + 1);
    historyStack.push(entry);
    historyIndex = historyStack.length - 1;
  }
  function getCurrentEntry2() {
    return historyIndex >= 0 && historyIndex < historyStack.length ? historyStack[historyIndex] : null;
  }
  function canGoBack() {
    return historyIndex > 0;
  }
  function canGoForward() {
    return historyIndex >= 0 && historyIndex < historyStack.length - 1;
  }
  function goBack() {
    if (canGoBack()) {
      historyIndex--;
      return historyStack[historyIndex];
    }
    return null;
  }
  function goForward() {
    if (canGoForward()) {
      historyIndex++;
      return historyStack[historyIndex];
    }
    return null;
  }

  // src/core/html.js
  function compactHtmlForContext(html, maxChars) {
    if (!html) return "";
    var limit = maxChars || 28e3;
    var cleaned = String(html).replace(/<!-- BROWSER_OF_DREAMS_BRIDGE_START -->[\s\S]*?<!-- BROWSER_OF_DREAMS_BRIDGE_END -->/g, "").replace(/src=(["'])data:image\/[^"']+\1/gi, "src=$1[cached-dream-image]$1").replace(/\n{3,}/g, "\n\n").trim();
    if (cleaned.length > limit) {
      cleaned = cleaned.substring(0, limit) + "\n<!-- [truncated for context length] -->\n</html>";
    }
    return cleaned;
  }
  function extractHtml(rawText) {
    var text = String(rawText || "").trim();
    if (!text) return "";
    var fenceMatch = /```(?:html)?\s*([\s\S]*?)```/i.exec(text);
    if (fenceMatch && fenceMatch[1] && fenceMatch[1].indexOf("<") !== -1) {
      text = fenceMatch[1].trim();
    }
    var docStart = text.search(/<!doctype\s+html/i);
    if (docStart === -1) {
      docStart = text.search(/<html[\s>]/i);
    }
    if (docStart > 0) {
      text = text.substring(docStart);
    }
    var docEnd = text.search(/<\/html\s*>/i);
    if (docEnd !== -1) {
      text = text.substring(0, docEnd + 7);
    }
    if (text.indexOf("<html") === -1 && text.indexOf("<body") === -1) {
      text = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Dream Page</title></head><body>' + text + "</body></html>";
    }
    return text;
  }
  function extractTitleFromHtml(html, fallbackUrl) {
    var m = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(String(html || ""));
    if (m && m[1]) {
      var clean = m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      if (clean) return clean;
    }
    return fallbackUrl || "Untitled Dream Page";
  }
  var ProgressiveHtmlWriter = class {
    constructor(doc, options) {
      this.doc = doc;
      var opts = options || {};
      this.initialStyle = opts.initialStyle || "";
      this.initialEraStyle = opts.initialEraStyle || "";
      this.initialScript = opts.initialScript || "";
      this.onImageRendered = opts.onImageRendered || null;
      this.imageCounter = 0;
      this.written = "";
      this.hasOpened = false;
      this.hasClosed = false;
      this.leadingFenceRemoved = false;
      this.stripOffset = 0;
      this.completed = false;
    }
    open() {
      if (this.doc && !this.hasOpened) {
        try {
          this.doc.open();
          if (this.initialEraStyle) {
            this.doc.write('<style id="dream-era-style">' + this.initialEraStyle + "</style>");
          }
          if (this.initialStyle) {
            this.doc.write('<style id="dream-bridge-style">' + this.initialStyle + "</style>");
          }
          if (this.initialScript) {
            this.doc.write('<script id="dream-bridge-script">' + this.initialScript + "<\/script>");
          }
          this.hasOpened = true;
        } catch (e) {
          console.warn("Could not open iframe document for progressive streaming:", e);
        }
      }
    }
    scanNewImages() {
      if (!this.doc) return;
      try {
        if (this.doc.defaultView && typeof this.doc.defaultView.__setupDreamImages === "function") {
          this.doc.defaultView.__setupDreamImages();
        }
      } catch (e) {
      }
      if (typeof this.onImageRendered !== "function") return;
      try {
        var imgs = this.doc.querySelectorAll("img[data-dream-prompt]:not([data-dream-writer-scanned]), img[data-dream-reuse]:not([data-dream-writer-scanned])");
        for (var i = 0; i < imgs.length; i++) {
          var img = imgs[i];
          img.setAttribute("data-dream-writer-scanned", "true");
          var prompt = img.getAttribute("data-dream-prompt") || "";
          var reuse = img.getAttribute("data-dream-reuse") || "";
          var slotId = img.getAttribute("data-dream-id") || "dream-img-" + this.imageCounter++;
          img.setAttribute("data-dream-id", slotId);
          var role = (img.getAttribute("data-dream-role") || (reuse && /^\[AD\b/i.test(reuse.trim()) ? "ad" : reuse && /^\[ICON\b/i.test(reuse.trim()) ? "icon" : reuse && /^\[GRAPHIC\b/i.test(reuse.trim()) ? "graphic" : "photo")).toLowerCase();
          var w = parseInt(img.getAttribute("width"), 10) || img.width || (role === "ad" ? 468 : 360);
          var h = parseInt(img.getAttribute("height"), 10) || img.height || (role === "ad" ? 60 : 240);
          var aspect = img.getAttribute("data-dream-aspect") || (w > h * 1.5 ? "16:9" : h > w * 1.3 ? "3:4" : "1:1");
          this.onImageRendered({
            slotId,
            prompt: prompt || reuse,
            reuse,
            role,
            width: w,
            height: h,
            aspectRatio: aspect,
            alt: img.alt || "",
            alreadyLoaded: false
          });
        }
      } catch (e) {
        console.warn("Error scanning new images in progressive stream:", e);
      }
    }
    writeChunk(accumulated) {
      if (this.completed) return;
      if (!this.hasOpened) {
        this.open();
      }
      if (!this.doc || !this.hasOpened) return;
      if (!this.leadingFenceRemoved) {
        if (/^\s*```/.test(accumulated)) {
          var newlineIdx = accumulated.search(/\r?\n/);
          var tagIdx = accumulated.search(/<[a-zA-Z!]/);
          if (newlineIdx !== -1 && (tagIdx === -1 || newlineIdx < tagIdx)) {
            var afterNewline = accumulated.substring(newlineIdx);
            var nlMatch = afterNewline.match(/^\r?\n/);
            var nlLen = nlMatch ? nlMatch[0].length : 1;
            this.stripOffset = newlineIdx + nlLen;
            this.leadingFenceRemoved = true;
          } else if (tagIdx !== -1) {
            this.stripOffset = tagIdx;
            this.leadingFenceRemoved = true;
          } else {
            return;
          }
        } else {
          var firstTag = accumulated.search(/<[a-zA-Z!]/);
          if (firstTag !== -1) {
            this.stripOffset = firstTag;
            this.leadingFenceRemoved = true;
          } else if (accumulated.length > 40) {
            this.stripOffset = 0;
            this.leadingFenceRemoved = true;
          } else {
            return;
          }
        }
      }
      var clean = accumulated.substring(this.stripOffset);
      var htmlCloseIdx = clean.search(/<\/html\s*>/i);
      if (htmlCloseIdx !== -1) {
        var endPos = clean.indexOf(">", htmlCloseIdx) + 1;
        clean = clean.substring(0, endPos);
        this.completed = true;
      } else {
        var fenceCloseIdx = clean.search(/```/);
        if (fenceCloseIdx !== -1) {
          clean = clean.substring(0, fenceCloseIdx);
          this.completed = true;
        } else {
          if (clean.endsWith("``")) {
            clean = clean.substring(0, clean.length - 2);
          } else if (clean.endsWith("`")) {
            clean = clean.substring(0, clean.length - 1);
          }
        }
      }
      if (clean.length > this.written.length) {
        var toWrite = clean.substring(this.written.length);
        try {
          this.doc.write(toWrite);
          this.written = clean;
          this.scanNewImages();
        } catch (e) {
          console.warn("Failed writing chunk to iframe document:", e);
        }
      }
    }
    close() {
      if (this.doc && this.hasOpened && !this.hasClosed) {
        try {
          this.doc.close();
          this.hasClosed = true;
        } catch (e) {
          console.warn("Could not close iframe document:", e);
        }
      }
    }
  };

  // src/core/aspect.js
  var SUPPORTED_ASPECT_RATIOS = ["1:1", "3:2", "2:3", "4:3", "3:4", "16:9", "9:16", "21:9"];
  var GEMINI_SUPPORTED_ASPECT_RATIOS = ["1:1", "4:3", "3:4", "16:9", "9:16"];
  var ASPECT_RATIO_NUMERICAL_VALUES = {
    "21:9": 21 / 9,
    "16:9": 16 / 9,
    "3:2": 3 / 2,
    "4:3": 4 / 3,
    "1:1": 1,
    "3:4": 3 / 4,
    "2:3": 2 / 3,
    "9:16": 9 / 16
  };
  function normalizeSupportedAspectRatio(rawAspect, width, height, provider) {
    var p = String(provider || "").toLowerCase();
    var isGemini = p === "gemini" || p === "agentplatform" || p === "google";
    var allowed = isGemini ? GEMINI_SUPPORTED_ASPECT_RATIOS : SUPPORTED_ASPECT_RATIOS;
    var cleaned = typeof rawAspect === "string" ? rawAspect.trim().toLowerCase() : "";
    for (var i = 0; i < allowed.length; i++) {
      if (cleaned === allowed[i].toLowerCase()) {
        return allowed[i];
      }
    }
    var ratioVal = null;
    if (cleaned) {
      var match = cleaned.match(/^([0-9]+(?:\.[0-9]+)?)\s*[:\/xX]\s*([0-9]+(?:\.[0-9]+)?)$/);
      if (match) {
        var numW = parseFloat(match[1]);
        var numH = parseFloat(match[2]);
        if (numW > 0 && numH > 0) {
          ratioVal = numW / numH;
        }
      } else {
        var parsedFloat = parseFloat(cleaned);
        if (!isNaN(parsedFloat) && parsedFloat > 0) {
          ratioVal = parsedFloat;
        }
      }
    }
    if (ratioVal === null && width && height) {
      var wNum = parseFloat(width);
      var hNum = parseFloat(height);
      if (wNum > 0 && hNum > 0) {
        ratioVal = wNum / hNum;
      }
    }
    if (ratioVal === null || isNaN(ratioVal) || ratioVal <= 0) {
      return "1:1";
    }
    var closest = allowed[0];
    var minDiff = Infinity;
    for (var j = 0; j < allowed.length; j++) {
      var cand = allowed[j];
      var candVal = ASPECT_RATIO_NUMERICAL_VALUES[cand] || 1;
      var diff = Math.abs(ratioVal - candVal);
      if (diff < minDiff) {
        minDiff = diff;
        closest = cand;
      }
    }
    return closest;
  }

  // src/core/era-stylesheets.js
  var BROWSER_PROFILES = [
    {
      id: "mosaic",
      label: "NCSA Mosaic 1.x",
      pageBackground: "#c0c0c0",
      bodyFont: '"Times New Roman", Times, serif',
      bodySize: "16px",
      linkColor: "#0000EE",
      visitedColor: "#551A8B",
      activeColor: "#FF0000",
      buttonBackground: "#c0c0c0",
      buttonEdge: "#dfdfdf",
      buttonFont: '"MS Sans Serif", sans-serif',
      buttonSize: "13px"
    },
    {
      id: "netscape3",
      label: "Netscape Navigator 3",
      pageBackground: "#c0c0c0",
      bodyFont: '"Times New Roman", Times, serif',
      bodySize: "16px",
      linkColor: "#0000EE",
      visitedColor: "#551A8B",
      activeColor: "#FF0000",
      buttonBackground: "#c0c0c0",
      buttonEdge: "#dfdfdf",
      buttonFont: '"MS Sans Serif", sans-serif',
      buttonSize: "13px"
    },
    {
      id: "netscape4",
      label: "Netscape Navigator 4",
      pageBackground: "#c0c0c0",
      bodyFont: '"Times New Roman", Times, serif',
      bodySize: "16px",
      linkColor: "#0000EE",
      visitedColor: "#551A8B",
      activeColor: "#FF0000",
      buttonBackground: "#c0c0c0",
      buttonEdge: "#dfdfdf",
      buttonFont: '"MS Sans Serif", sans-serif',
      buttonSize: "13px"
    },
    {
      id: "ie4",
      label: "Internet Explorer 4",
      pageBackground: "#ffffff",
      bodyFont: '"Times New Roman", Times, serif',
      bodySize: "16px",
      linkColor: "#0000EE",
      visitedColor: "#551A8B",
      activeColor: "#FF0000",
      buttonBackground: "#c0c0c0",
      buttonEdge: "#dfdfdf",
      buttonFont: '"MS Sans Serif", sans-serif',
      buttonSize: "13px"
    },
    {
      id: "ie5",
      label: "Internet Explorer 5",
      pageBackground: "#ffffff",
      bodyFont: '"Times New Roman", Times, serif',
      bodySize: "16px",
      linkColor: "#0000EE",
      visitedColor: "#551A8B",
      activeColor: "#FF0000",
      buttonBackground: "#d4d0c8",
      buttonEdge: "#ffffff",
      buttonFont: 'Tahoma, "MS Sans Serif", sans-serif',
      buttonSize: "12px"
    },
    {
      id: "ie6",
      label: "Internet Explorer 6",
      pageBackground: "#ffffff",
      bodyFont: '"Times New Roman", Times, serif',
      bodySize: "16px",
      linkColor: "#0000EE",
      visitedColor: "#551A8B",
      activeColor: "#FF0000",
      buttonBackground: "#d4d0c8",
      buttonEdge: "#ffffff",
      buttonFont: 'Tahoma, "MS Sans Serif", sans-serif',
      buttonSize: "12px"
    },
    {
      id: "firefox1",
      label: "Mozilla Firefox 1.0",
      pageBackground: "#ffffff",
      bodyFont: '"Times New Roman", Times, serif',
      bodySize: "16px",
      linkColor: "#0000EE",
      visitedColor: "#551A8B",
      activeColor: "#FF0000",
      buttonBackground: "#d4d0c8",
      buttonEdge: "#ffffff",
      buttonFont: 'Tahoma, "MS Sans Serif", sans-serif',
      buttonSize: "12px"
    }
  ];
  function profileById(id) {
    var key = String(id || "").trim().toLowerCase();
    if (!key) return null;
    for (var i = 0; i < BROWSER_PROFILES.length; i++) {
      if (BROWSER_PROFILES[i].id === key) return BROWSER_PROFILES[i];
    }
    return null;
  }
  function listBrowserProfiles() {
    return BROWSER_PROFILES.map(function(p) {
      return { id: p.id, label: p.label };
    });
  }
  function profileCss(p) {
    return [
      "@layer era-defaults {",
      "body { background: " + p.pageBackground + "; color: #000000; font-family: " + p.bodyFont + "; font-size: " + p.bodySize + "; margin: 8px; }",
      "h1, h2, h3, h4, h5, h6 { font-family: " + p.bodyFont + "; }",
      "a:link { color: " + p.linkColor + "; text-decoration: underline; }",
      "a:visited { color: " + p.visitedColor + "; text-decoration: underline; }",
      "a:active { color: " + p.activeColor + "; text-decoration: underline; }",
      "a:hover { text-decoration: underline; }",
      "hr { border: 1px inset #808080; height: 2px; }",
      'button, input[type="button"], input[type="submit"], input[type="reset"] { font-family: ' + p.buttonFont + "; font-size: " + p.buttonSize + "; color: #000000; background: " + p.buttonBackground + "; border: 2px outset " + p.buttonEdge + "; padding: 1px 6px; }",
      'input[type="text"], input[type="password"], input[type="search"], textarea { font-family: ' + p.buttonFont + "; font-size: " + p.buttonSize + "; color: #000000; background: #ffffff; border: 2px inset " + p.buttonEdge + "; padding: 1px 2px; }",
      "select { font-family: " + p.buttonFont + "; font-size: " + p.buttonSize + "; background: #ffffff; color: #000000; border: 2px inset " + p.buttonEdge + "; }",
      "}"
    ].join("\n");
  }
  function buildEraStylesheetCss(profileId) {
    var profile = profileById(profileId);
    if (!profile) return "";
    return profileCss(profile);
  }
  function parseBrowserProfileFromPlan(text) {
    var m = /\bBROWSER PROFILE:\s*([a-z0-9-]+)/i.exec(String(text || ""));
    if (!m) return "";
    var profile = profileById(m[1]);
    return profile ? profile.id : "";
  }
  function resolveBrowserProfile(planEntry) {
    var stored = planEntry && planEntry.browserProfile;
    if (stored && profileById(stored)) return profileById(stored).id;
    return parseBrowserProfileFromPlan(planEntry && planEntry.text);
  }

  // src/prompts/dream-prompt.js
  function buildDreamPrompt(params) {
    var url = params.url;
    var dateStr = params.date;
    var era = getEraInfo(dateStr);
    var charset = getCharsetGuide(era.year);
    var timelineProfile = getTimelineDivergenceProfile(params.timelineDivergence, era.year);
    var navContext = params.navContext || null;
    var imageMode = params.imageMode || "all";
    var homepageUrl = params.homepageUrl || getHomepageUrl(url);
    var homepageHtml = compactHtmlForContext(params.homepageHtml || "");
    var referrerUrl = params.referrerUrl || navContext && navContext.referrerUrl || "";
    var referrerHtml = compactHtmlForContext(
      params.referrerHtml || navContext && navContext.referrerHtml || ""
    );
    var seedTargetContext = params.seedTargetContext || null;
    var sitePlanText = String(params.sitePlanText || "").trim();
    var priorHomepageHtml = compactHtmlForContext(params.priorHomepageHtml || "");
    var priorHomepageDate = params.priorHomepageDate || "";
    var rawMemes = params.memes;
    var memesList = Array.isArray(rawMemes) ? rawMemes : typeof rawMemes === "string" && rawMemes.trim() ? rawMemes.split(/,\s*/) : [];
    var cleanMemes = memesList.map(function(w) {
      return String(w).trim();
    }).filter(Boolean);
    var domain = extractDomain(url);
    var client = profileById(params.browserProfile);
    var eraCss = client ? buildEraStylesheetCss(client.id) : "";
    var availableDomainImages = domain ? getAvailableDomainImages(domain, dateStr, params.timelineDivergence) : [];
    var availableImagesListText = "";
    if (availableDomainImages.length > 0) {
      availableImagesListText = availableDomainImages.map(function(item) {
        return "- " + formatImageDescriptor(item) + ' (reuse id: "' + item.id + '")';
      }).join("\n");
    }
    var hasHomepageContext = Boolean(homepageHtml && !isHomepageUrl(url));
    var hasReferrerContext = Boolean(referrerUrl || referrerHtml || navContext);
    var isSameSiteReferrer = Boolean(referrerUrl && getHomepageUrl(referrerUrl) === homepageUrl);
    var parts = String(dateStr || "1999-12-31").split("-");
    var mm = parts[1] ? parseInt(parts[1], 10) < 10 ? "0" + parseInt(parts[1], 10) : parts[1] : "01";
    var dd = parts[2] ? parseInt(parts[2], 10) < 10 ? "0" + parseInt(parts[2], 10) : parts[2] : "01";
    var yyyy = parts[0] || "2001";
    var formattedDateUs = mm + "/" + dd + "/" + yyyy;
    var imageRules;
    if (imageMode === "off") {
      imageRules = "Visuals: inline SVG, CSS, or ASCII. No data-dream-prompt images. Spoof marks and unnamed figures only.";
    } else {
      var engine = String(params.imageEngine || "image-model");
      var maxImages = parseInt(params.maxImagesPerPage, 10) || 12;
      var allSvg = engine === "text-pixel" || engine === "text-svg" || engine === "text-auto";
      var imageBudget = allSvg ? "Images: 4\u20138 <img> \u2014 unlimited ads, photos, icons, and graphics." : engine === "hybrid" ? "Images: no more than " + maxImages + " photos \u2014 unlimited ads, icons, and graphics." : "Images: no more than " + maxImages + " total \u2014 photos, ads, icons, and graphics share that cap.";
      imageRules = imageBudget + "\nAt least one " + era.year + ' ad (468\xD760, 300\xD7250, or 120\xD7240/160\xD7600) inside <a href>. Photos use data-dream-role="photo".\nSmall interface icons use data-dream-role="icon", width="32" height="32", data-dream-aspect="1:1".\nGeneric graphics \u2014 a page logo, masthead emblem, or decorative spot art \u2014 use data-dream-role="graphic".\nArticle text may name real people and companies. data-dream-prompt may not: spoof brands only, and people only as generic roles (a reporter, a crowd, an athlete). No real logos, celebrity names, or likenesses.\nEvery new image: data-dream-prompt="[Date: ' + formattedDateUs + "] subject, " + era.year + ' style" plus data-dream-role, data-dream-aspect, width, height, alt.\ndata-dream-aspect is only 21:9, 16:9, 4:3, 1:1, 3:4, 9:16, 3:2, or 2:3. Example: <img data-dream-prompt="[Date: ' + formattedDateUs + '] spoof-brand banner, unnamed shoppers" data-dream-role="ad" data-dream-aspect="21:9" width="468" height="60" alt="...">\nIcon example: <img data-dream-prompt="[Date: ' + formattedDateUs + '] spoof-brand envelope icon, flat glyph" data-dream-role="icon" data-dream-aspect="1:1" width="32" height="32" alt="Mail">\nGraphic example: <img data-dream-prompt="[Date: ' + formattedDateUs + '] spoof-brand masthead emblem, bold wordmark" data-dream-role="graphic" data-dream-aspect="4:3" width="240" height="180" alt="...">\n' + (availableImagesListText ? 'Reuse a listed image with data-dream-reuse="[TYPE: Label, orientation, WxH]" or its id. Example: <img data-dream-reuse="[AD: Snapple, vertical, 100x300]" width="100" height="300" alt="Snapple">. New slots still use data-dream-prompt.' : "No cached images yet. Do not emit data-dream-reuse.");
    }
    var continuity = "";
    if (hasHomepageContext) {
      continuity += "site_homepage is the design system: same name, masthead, CSS, nav, footer, and ongoing stories. Replace only the body for " + url + " and mark the active nav item.\n";
    }
    if (isHomepageUrl(url) && priorHomepageHtml) {
      continuity += "prior_homepage is this same site on " + (priorHomepageDate || "a nearby date") + ". Keep its name, masthead, CSS, nav, and footer. Rewrite headlines, stories, prices, and dates for " + dateStr + ".\n";
    }
    if (hasReferrerContext) {
      continuity += "referring_page is the click or form that opened " + url + ". Write that destination, not a copy of the referrer. Keep its names, headlines, prices, and facts. ";
      continuity += isSameSiteReferrer ? "Same site: keep branding and link back to " + homepageUrl + ".\n" : "External referrer: do not copy its masthead or layout.\n";
    }
    if (sitePlanText) {
      continuity += "site_plan is this domain's design spec: keep its palette, typography, layout, nav, widgets, and graphics, and include its sitemap entries in the nav. Write the page content yourself; never output the plan.\n";
    }
    var systemPrompt = "Dream Web Engine. One complete HTML page for the requested URL as it existed on " + era.formattedLong + " (" + dateStr + ").\nThat date is today. Headlines, prices, tech, and culture stop there. Present tense. Full articles, nav, sidebars, and footer \u2014 not a stub.\nNo cookie-cutter templates. Era-appropriate dimensions. Only layout tools that existed in " + era.year + ".\n" + timelineProfile.promptGuide + "\n" + (cleanMemes.length > 0 ? "Use these date keywords only where they fit: " + cleanMemes.join(", ") + ".\n" : "") + era.styleGuide + "\nERA FIDELITY: the browser of " + era.year + " renders this page, so nothing may come from after " + era.year + " \u2014 not a character, icon style, typeface, or rendering trick that did not exist then. Let that browser's own defaults show through (visible link underlines, native form controls, its own scrolling) instead of a modern reset, and match the density and spacing conventions of " + era.year + " sites rather than today's.\n" + (charset.text ? charset.text + "\n" : "") + (eraCss ? "CLIENT: " + client.label + ". The viewer applies the browser defaults below under your page; leave links, buttons, and form fields unstyled unless this site styled them.\n<browser_defaults>\n" + eraCss + "\n</browser_defaults>\n" : "") + continuity + imageRules + '\nMany internal and external <a href>, plus one <form method="GET">. External links may point at made-up domains and pages.\nOutput only the document from <!DOCTYPE html> to </html>. No markdown fences or commentary.';
    var userPrompt = "URL: " + url + "\nHome: " + homepageUrl + "\nDate: " + dateStr + "\nTimeline: " + timelineProfile.shortLabel + " " + timelineProfile.pct + "%\n";
    if (seedTargetContext && seedTargetContext.targetSubpageUrl) {
      userPrompt += "\n<homepage_architecture_note>\nThis is the root " + homepageUrl + ". Establish header, CSS, and nav, and link to " + seedTargetContext.targetSubpageUrl + (seedTargetContext.navContext && seedTargetContext.navContext.linkText ? ' ("' + seedTargetContext.navContext.linkText + '")' : "") + ".\n</homepage_architecture_note>\n";
    }
    if (sitePlanText) {
      userPrompt += '\n<site_plan domain="' + (domain || homepageUrl) + '" era="' + era.year + '">\n' + sitePlanText + "\n</site_plan>\n";
    }
    if (isHomepageUrl(url) && priorHomepageHtml) {
      userPrompt += '\n<prior_homepage url="' + homepageUrl + '" date="' + priorHomepageDate + '">\n' + priorHomepageHtml + "\n</prior_homepage>\n";
    }
    if (homepageHtml) {
      userPrompt += '\n<site_homepage url="' + homepageUrl + '">\n' + homepageHtml + "\n</site_homepage>\n";
    }
    if (hasReferrerContext) {
      var sameAsHome = Boolean(
        homepageHtml && referrerHtml && (referrerUrl === homepageUrl || referrerHtml === homepageHtml)
      );
      userPrompt += '\n<referring_page url="' + (referrerUrl || "previous_page") + '"' + (sameAsHome ? ' same_as_site_homepage="true"' : "") + (referrerUrl && !isSameSiteReferrer ? ' external_referrer="true"' : "") + ">\n";
      if (navContext) {
        if (navContext.referrerUrl) {
          userPrompt += "Referrer URL (page where link was clicked): " + navContext.referrerUrl + "\n";
        }
        if (navContext.linkText) {
          userPrompt += 'Clicked Link / Headline Text: "' + navContext.linkText + '"\n';
        }
        if (navContext.linkContext) {
          userPrompt += 'Surrounding Context on Referring Page: "' + navContext.linkContext + '"\n';
        }
        if (navContext.formData) {
          userPrompt += "Submitted Form Input Parameters: " + JSON.stringify(navContext.formData) + "\n";
        }
      }
      if (sameAsHome) {
        userPrompt += "Referrer HTML: Identical to `<site_homepage>` above.\n";
      } else if (referrerHtml) {
        userPrompt += "Referrer Page HTML (for link context):\n" + referrerHtml + "\n";
      }
      userPrompt += "</referring_page>\n";
    }
    if (availableImagesListText) {
      userPrompt += '\n<available_domain_images domain="' + (domain || homepageUrl) + '" time_period="' + era.year + '">\n' + availableImagesListText + "\n</available_domain_images>\n";
    }
    return {
      systemPrompt,
      userPrompt,
      era,
      timelineProfile,
      homepageUrl,
      domain,
      browserProfile: client ? client.id : "",
      availableDomainImages,
      hasHomepageContext,
      hasReferrerContext,
      hasSitePlan: Boolean(sitePlanText),
      memes: cleanMemes
    };
  }

  // src/prompts/site-plan-prompt.js
  var MIN_SITE_PLAN_CHARS = 200;
  function buildSitePlanPrompt(params) {
    var url = params.url;
    var dateStr = params.date;
    var era = getEraInfo(dateStr);
    var charset = getCharsetGuide(era.year);
    var timelineProfile = getTimelineDivergenceProfile(params.timelineDivergence, era.year);
    var homepageUrl = params.homepageUrl || getHomepageUrl(url);
    var domain = extractDomain(url) || extractDomain(homepageUrl) || homepageUrl;
    var browserMenu = listBrowserProfiles().map(function(p) {
      return p.id + " \u2014 " + p.label;
    }).join("; ") + "; none \u2014 no browser overrides";
    var systemPrompt = "Dream Web Engine site planner. You are the art director for a fictional website: another model will build every page of it from your plan.\nThe site at " + domain + " is invented \u2014 its organization, people, products, and history. Never check whether it existed, and never refuse because it is fictional.\n\nWHAT THE PLAN IS FOR: the generator first builds this site's homepage from your plan, then builds each child page from your plan plus that homepage. Describe the shared design system concretely enough that every page can be built from your words alone: identity and voice, era look, page structure, navigation, recurring widgets, imagery direction, and the sitemap. Skip article copy and code.\n\nERA: the designer is working in " + era.year + ". Every design choice must be believable for web design in " + era.year + " \u2014 the layout techniques, type, colors, textures, and widgets of that year, nothing from later web eras.\n" + era.styleGuide + "\n" + (charset.text ? charset.text + " The page generator reads this plan, so keep its wording inside the same set.\n" : "") + "\nREALITY SETTING (" + timelineProfile.badgeText + "): " + timelineProfile.description + "\nThe site itself is still fictional; this setting only defines the world around it. Let it shape the site's departments, organization names, recurring figures, and imagery where it matters. The visual design still belongs to " + era.year + `.

BROWSER PROFILE: the visitor's browser is part of the design. Pick the one this site was built for, appropriate to the year above, and put it on the very first line of the plan, exactly as "BROWSER PROFILE: <id>", before any other text.
Options: ` + browserMenu + `
The viewer supplies that browser's own text, link, and form-control styling; design the rest around it. Choose none only if this site should take the viewer's own defaults.

COVER AT LEAST: the site's name and one-sentence concept; palette with concrete colors; typography; page framing and layout approach; masthead/header treatment; navigation placement and style; body column layout with sidebars; recurring widgets and interactive elements; imagery and advertising direction (what the recurring photos, ads, icons, and graphics show, and where they sit); footer; and a sitemap listing each page's path, navigation label, and purpose, starting with "/" for the homepage.

DESCRIBE, DO NOT PRESCRIBE. The page generator chooses every implementation detail.
In this plan, never write: HTML, CSS, JavaScript, tags, attributes, properties, code of any kind, image file names, asset paths, image URLs, pixel measurements, or fixed counts of elements. Say what the visitor sees, not how to build it.
Naming an era technique in plain words is expected \u2014 the nested layout tables, the beveled button look, animated GIF spotlights \u2014 because that is what makes the design read as ` + era.year + ". Written markup is not.\nEvery color MUST come with its hex code, written plainly as #003366. A hex code is a color, not CSS, and the generator needs it to keep every page on the same palette.\nStill describe proportion and character (a wide reading column between two narrow rails, a slim masthead) instead of measurements. No article or page copy.\nBe specific about identity, voice, palette, and design intent rather than brief. Plain text; prose or short bullet lists are both fine. No article copy. No fences or commentary around the plan.";
    var userPrompt = "Domain: " + domain + "\nHome: " + homepageUrl + "\nDate: " + dateStr + "\nTimeline: " + timelineProfile.shortLabel + " " + timelineProfile.pct + "%\n";
    return {
      systemPrompt,
      userPrompt,
      era,
      timelineProfile,
      domain,
      homepageUrl
    };
  }
  function normalizeSitePlan(rawText) {
    return String(rawText || "").replace(/```[a-z]*\s*/gi, "").trim();
  }
  function formatSitePlanForPrompt(entry) {
    if (!entry || !entry.text) return "";
    return String(entry.text).trim();
  }

  // src/core/nav-stages.js
  function resolveNavigationStages(needsSitePlan, needsHomepage) {
    var stages = [];
    if (needsSitePlan) stages.push("site-plan");
    if (needsHomepage) stages.push("homepage");
    stages.push("page");
    return stages;
  }
  function stageLabel(stages, name) {
    var idx = stages.indexOf(name);
    if (idx === -1) return "";
    return "[" + (idx + 1) + "/" + stages.length + "] ";
  }

  // src/bridge/bridge.runtime.css
  var bridge_runtime_default = ".dream-img-wrapper {\n  position: relative;\n  display: inline-block;\n  max-width: 100%;\n  vertical-align: middle;\n}\nimg[data-dream-prompt],\nimg[data-dream-reuse] {\n  object-fit: cover;\n}\nimg[data-dream-prompt]:not([data-dream-loaded='true']),\nimg[data-dream-reuse]:not([data-dream-loaded='true']) {\n  background: repeating-linear-gradient(135deg, #d8d5c8 0px, #d8d5c8 8px, #ece9de 8px, #ece9de 16px);\n  border: 2px inset #999999;\n  color: #222222;\n  font-family: Tahoma, Verdana, monospace;\n  font-size: 11px;\n}\n.dream-img-badge {\n  position: absolute;\n  right: 4px;\n  bottom: 4px;\n  padding: 2px 6px;\n  font-family: Tahoma, Verdana, sans-serif;\n  font-size: 10px;\n  font-weight: bold;\n  background: rgba(0, 0, 0, 0.75);\n  color: #ffffff;\n  border: 1px solid rgba(255, 255, 255, 0.5);\n  border-radius: 3px;\n  cursor: pointer;\n  z-index: 10;\n  line-height: 1.2;\n  opacity: 0;\n  pointer-events: none;\n  transition: opacity 0.15s ease-in-out;\n}\n.dream-img-wrapper:hover .dream-img-badge,\n.dream-img-wrapper:focus-within .dream-img-badge,\n.dream-img-badge:hover,\n.dream-img-badge:focus {\n  opacity: 1;\n  pointer-events: auto;\n}\n.dream-img-badge:hover {\n  background: #0050ee;\n}\n@keyframes dreamScanlineReveal {\n  0% { clip-path: inset(0 0 96% 0); filter: contrast(1.4) saturate(0.6); }\n  35% { clip-path: inset(0 0 60% 0); }\n  70% { clip-path: inset(0 0 22% 0); }\n  100% { clip-path: inset(0 0 0 0); filter: none; }\n}\nimg.dream-scanline-reveal {\n  animation: dreamScanlineReveal 0.85s steps(12, end) forwards;\n}\n";

  // src/bridge/runtime.runtime.js
  var runtime_runtime_default = `(function() {
  var BASE_URL = __BASE_URL__;
  function resolveUrl(href) {
    if (!href) return BASE_URL;
    var trimmed = String(href).trim();
    if (!trimmed || trimmed === '#' || /^javascript:/i.test(trimmed)) return null;
    try {
      return new URL(trimmed, BASE_URL).toString();
    } catch (e) {
      return trimmed;
    }
  }
  function makePlaceholderSvg(w, h, label, role) {
    if (role === 'icon') {
      var iw = parseInt(w, 10) || 32;
      var ih = parseInt(h, 10) || 32;
      var iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + iw + '" height="' + ih + '" viewBox="0 0 32 32">' +
        '<rect x="6" y="6" width="20" height="20" rx="5" fill="#cbd5e1"/></svg>';
      return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(iconSvg);
    }
    var width = parseInt(w, 10) || (role === 'ad' ? 468 : 320);
    var height = parseInt(h, 10) || (role === 'ad' ? 60 : 200);
    var safeLabel = String(label || (role === 'ad' ? 'Advertisement' : 'Image')).replace(/[<>&"']/g, ' ').substring(0, 65);
    var bg = role === 'ad' ? '#fffbe6' : '#e9ecef';
    var border = role === 'ad' ? '#d97706' : '#868e96';
    var tag = role === 'ad' ? '[AD]' : '[IMG]';
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '">' +
      '<rect width="100%" height="100%" fill="' + bg + '" stroke="' + border + '" stroke-width="2"/>' +
      '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Tahoma, Verdana, monospace" font-size="11" fill="#333333">' +
      tag + ' ' + safeLabel + '</text></svg>';
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }
  var dispatchedSlotIds = {};

  function setupImages() {
    function normalizeAspect(raw, width, height) {
      var allowed = ['1:1', '3:2', '2:3', '4:3', '3:4', '16:9', '9:16', '21:9'];
      var vals = { '21:9': 2.333, '16:9': 1.778, '3:2': 1.5, '4:3': 1.333, '1:1': 1.0, '3:4': 0.75, '2:3': 0.667, '9:16': 0.5625 };
      var cl = typeof raw === 'string' ? raw.trim().toLowerCase() : '';
      for (var k = 0; k < allowed.length; k++) {
        if (cl === allowed[k].toLowerCase()) return allowed[k];
      }
      var r = null;
      if (cl) {
        var m = cl.match(/^([0-9]+(?:\\.[0-9]+)?)\\s*[:\\/xX]\\s*([0-9]+(?:\\.[0-9]+)?)$/);
        if (m && parseFloat(m[1]) > 0 && parseFloat(m[2]) > 0) r = parseFloat(m[1]) / parseFloat(m[2]);
      }
      if (r === null && width && height && width > 0 && height > 0) r = width / height;
      if (r === null || isNaN(r) || r <= 0) return (width > height * 1.5 ? '16:9' : (height > width * 1.3 ? '3:4' : '1:1'));
      var best = allowed[0], minD = Infinity;
      for (var j = 0; j < allowed.length; j++) {
        var d = Math.abs(r - vals[allowed[j]]);
        if (d < minD) { minD = d; best = allowed[j]; }
      }
      return best;
    }
    var slots = [];
    var imgs = document.querySelectorAll('img');
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      var prompt = img.getAttribute('data-dream-prompt');
      var reuse = img.getAttribute('data-dream-reuse');
      if (!prompt && !reuse) {
        img.addEventListener('error', (function(el) {
          return function() {
            if (!el.getAttribute('data-fallback-applied')) {
              el.setAttribute('data-fallback-applied', '1');
              el.src = makePlaceholderSvg(el.width || 240, el.height || 140, el.alt || 'Graphic', 'photo');
            }
          };
        })(img));
        continue;
      }
      var slotId = img.getAttribute('data-dream-id') || ('dream-img-' + i);
      img.setAttribute('data-dream-id', slotId);
      var role = (img.getAttribute('data-dream-role') || (reuse && /^\\[AD\\b/i.test(reuse.trim()) ? 'ad' : (reuse && /^\\[ICON\\b/i.test(reuse.trim()) ? 'icon' : (reuse && /^\\[GRAPHIC\\b/i.test(reuse.trim()) ? 'graphic' : 'photo')))).toLowerCase();
      var w = parseInt(img.getAttribute('width'), 10) || img.width || (role === 'ad' ? 468 : (role === 'icon' ? 32 : 360));
      var h = parseInt(img.getAttribute('height'), 10) || img.height || (role === 'ad' ? 60 : (role === 'icon' ? 32 : 240));
      if (!img.getAttribute('width') && w > 0) {
        img.setAttribute('width', String(w));
      }
      if (!img.getAttribute('height') && h > 0) {
        img.setAttribute('height', String(h));
      }
      var rawAspect = img.getAttribute('data-dream-aspect');
      var aspect = normalizeAspect(rawAspect, w, h);
      var alreadyLoaded = img.getAttribute('data-dream-loaded') === 'true' && !!img.src;
      if (!alreadyLoaded) {
        img.src = makePlaceholderSvg(w, h, img.alt || prompt || reuse, role);
      }
      if (!img.parentElement || !img.parentElement.classList.contains('dream-img-wrapper')) {
        var wrap = document.createElement('span');
        wrap.className = 'dream-img-wrapper';
        img.parentNode.insertBefore(wrap, img);
        wrap.appendChild(img);
        var badge = document.createElement('button');
        badge.type = 'button';
        badge.className = 'dream-img-badge';
        badge.setAttribute('data-badge-for', slotId);
        badge.textContent = alreadyLoaded ? '\u21BB Redream' : '\u{1F3A8} Dream ' + (role === 'ad' ? 'Ad' : (role === 'icon' ? 'Icon' : (role === 'graphic' ? 'Graphic' : 'Photo')));
        badge.title = prompt || reuse || '';
        badge.addEventListener('click', (function(sId, p, re, r, a, sw, sh) {
          return function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            window.parent.postMessage({
              type: 'DREAM_GENERATE_SINGLE_IMAGE',
              url: BASE_URL,
              slotId: sId,
              prompt: p,
              reuse: re,
              role: r,
              aspectRatio: a,
              width: sw,
              height: sh
            }, '*');
          };
        })(slotId, prompt, reuse, role, aspect, w, h));
        wrap.appendChild(badge);
      }
      if (!dispatchedSlotIds[slotId]) {
        dispatchedSlotIds[slotId] = true;
        slots.push({
          slotId: slotId,
          prompt: prompt || reuse,
          reuse: reuse || '',
          role: role,
          width: w,
          height: h,
          aspectRatio: aspect,
          alt: img.alt || '',
          alreadyLoaded: alreadyLoaded
        });
      }
    }
    if (slots.length > 0) {
      window.parent.postMessage({ type: 'DREAM_IMAGES_DISCOVERED', url: BASE_URL, slots: slots }, '*');
    }
  }
  window.addEventListener('message', function(ev) {
    var msg = ev.data;
    if (!msg || typeof msg !== 'object') return;
    if (msg.type === 'DREAM_IMAGE_STATUS') {
      var b = document.querySelector('[data-badge-for="' + msg.slotId + '"]');
      if (b) b.textContent = msg.statusText;
    } else if (msg.type === 'DREAM_IMAGE_READY') {
      var target = document.querySelector('img[data-dream-id="' + msg.slotId + '"]');
      if (target && msg.dataUrl) {
        target.classList.remove('dream-scanline-reveal');
        if (msg.isPixelArt || String(msg.dataUrl).indexOf('crispEdges') !== -1) {
          target.style.imageRendering = 'pixelated';
        } else {
          target.style.imageRendering = '';
        }
        target.src = msg.dataUrl;
        target.setAttribute('data-dream-loaded', 'true');
        void target.offsetWidth;
        target.classList.add('dream-scanline-reveal');
      }
      var badge = document.querySelector('[data-badge-for="' + msg.slotId + '"]');
      if (badge) badge.textContent = '\u21BB Redream';
    }
  });
  document.addEventListener('mouseover', function(ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
    if (a) {
      var resolved = resolveUrl(a.getAttribute('href'));
      if (resolved) window.parent.postMessage({ type: 'DREAM_HOVER', url: resolved }, '*');
    }
  });
  document.addEventListener('mouseout', function(ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
    if (a) window.parent.postMessage({ type: 'DREAM_HOVER', url: '' }, '*');
  });
  document.addEventListener('click', function(ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
    if (!a) return;
    var rawHref = a.getAttribute('href');
    var resolved = resolveUrl(rawHref);
    if (!resolved) return;
    ev.preventDefault();
    var linkText = (a.innerText || a.textContent || '').replace(/\\s+/g, ' ').trim();
    var childImg = a.querySelector('img');
    if (!linkText && childImg) {
      linkText = childImg.alt || childImg.getAttribute('data-dream-prompt') || 'Banner Advertisement';
    }
    var parentBlock = a.closest('td, article, section, li, div, p') || a.parentElement;
    var linkContext = parentBlock ? (parentBlock.innerText || '').replace(/\\s+/g, ' ').trim().substring(0, 260) : '';
    window.parent.postMessage({
      type: 'DREAM_NAVIGATE',
      url: resolved,
      referrerUrl: BASE_URL,
      linkText: linkText.substring(0, 160),
      linkContext: linkContext
    }, '*');
  });
  document.addEventListener('submit', function(ev) {
    var form = ev.target;
    if (!form || form.tagName !== 'FORM') return;
    ev.preventDefault();
    var action = form.getAttribute('action') || BASE_URL;
    var resolved = resolveUrl(action) || BASE_URL;
    var formDataObj = {};
    var elements = form.elements || [];
    var qs = [];
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      if (!el.name) continue;
      if ((el.type === 'checkbox' || el.type === 'radio') && !el.checked) continue;
      formDataObj[el.name] = el.value;
      qs.push(encodeURIComponent(el.name) + '=' + encodeURIComponent(el.value));
    }
    if (qs.length > 0 && resolved.indexOf('?') === -1) {
      resolved += '?' + qs.join('&');
    }
    window.parent.postMessage({
      type: 'DREAM_NAVIGATE',
      url: resolved,
      referrerUrl: BASE_URL,
      linkText: 'Form submission',
      formData: formDataObj
    }, '*');
  });
  window.__setupDreamImages = setupImages;

  if (typeof MutationObserver !== 'undefined') {
    try {
      var observer = new MutationObserver(function() {
        setupImages();
      });
      observer.observe(document.documentElement || document, { childList: true, subtree: true });
    } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupImages);
  } else {
    setupImages();
  }
})();
`;

  // src/bridge/inject.js
  var ERA_BLOCK_PATTERN = /<!-- DREAM_ERA_START -->[\s\S]*?<!-- DREAM_ERA_END -->/g;
  function eraMarkupFor(browserProfileId) {
    var eraCss = buildEraStylesheetCss(browserProfileId);
    if (!eraCss) return "";
    return '<!-- DREAM_ERA_START -->\n<style id="dream-era-style">\n' + eraCss + "\n</style>\n<!-- DREAM_ERA_END -->\n";
  }
  function insertEraIntoHtml(html, eraMarkup) {
    if (!eraMarkup) return html;
    if (/<head[^>]*>/i.test(html)) {
      return html.replace(/<head([^>]*)>/i, function(match, attrs) {
        return "<head" + attrs + ">\n" + eraMarkup;
      });
    }
    if (/<html[^>]*>/i.test(html)) {
      return html.replace(/<html([^>]*)>/i, function(match, attrs) {
        return "<html" + attrs + ">\n" + eraMarkup;
      });
    }
    return eraMarkup + html;
  }
  function injectBridgeScript(html, currentUrl, dateStr, browserProfileId) {
    var cleanHtml = extractHtml(html);
    var substitutedJs = runtime_runtime_default.replace(
      "__BASE_URL__",
      JSON.stringify(currentUrl || "http://www.example.com/")
    );
    var bridgeMarkup = '\n<!-- BROWSER_OF_DREAMS_BRIDGE_START -->\n<style id="dream-bridge-style">\n' + bridge_runtime_default + '\n</style>\n<script id="dream-bridge-script">\n' + substitutedJs + "\n<\/script>\n<!-- BROWSER_OF_DREAMS_BRIDGE_END -->\n";
    cleanHtml = cleanHtml.replace(
      /<!-- BROWSER_OF_DREAMS_BRIDGE_START -->[\s\S]*?<!-- BROWSER_OF_DREAMS_BRIDGE_END -->/g,
      ""
    );
    cleanHtml = cleanHtml.replace(ERA_BLOCK_PATTERN, "");
    cleanHtml = insertEraIntoHtml(cleanHtml, eraMarkupFor(browserProfileId));
    if (/<\/body\s*>/i.test(cleanHtml)) {
      return cleanHtml.replace(/<\/body\s*>/i, bridgeMarkup + "</body>");
    }
    return cleanHtml + bridgeMarkup;
  }
  function ensureBridgeInDocument(doc, currentUrl, dateStr, browserProfileId) {
    if (!doc) return;
    try {
      if (!doc.getElementById("dream-bridge-style")) {
        var style = doc.createElement("style");
        style.id = "dream-bridge-style";
        style.textContent = bridge_runtime_default;
        var targetHead = doc.head || doc.documentElement || doc.body;
        if (targetHead) {
          targetHead.appendChild(style);
        }
      }
      var eraCss = buildEraStylesheetCss(browserProfileId);
      var eraStyle = doc.getElementById("dream-era-style");
      if (!eraCss) {
        if (eraStyle) eraStyle.remove();
      } else if (eraStyle) {
        eraStyle.textContent = eraCss;
      } else {
        eraStyle = doc.createElement("style");
        eraStyle.id = "dream-era-style";
        eraStyle.textContent = eraCss;
        var eraHead = doc.head || doc.documentElement;
        if (eraHead) {
          eraHead.insertBefore(eraStyle, eraHead.firstChild);
        }
      }
      if (!doc.getElementById("dream-bridge-script")) {
        var script = doc.createElement("script");
        script.id = "dream-bridge-script";
        var substitutedJs = runtime_runtime_default.replace(
          "__BASE_URL__",
          JSON.stringify(currentUrl || "http://www.example.com/")
        );
        script.textContent = substitutedJs;
        var targetBody = doc.body || doc.documentElement;
        if (targetBody) {
          targetBody.appendChild(script);
        }
      }
    } catch (e) {
      console.warn("Could not ensure bridge in document:", e);
    }
  }

  // src/providers/gemini/agent-platform.js
  var NON_CHAT_MARKERS = [
    "-tts",
    "embedding",
    "image",
    "nano-banana",
    "live",
    "native-audio",
    "lyria",
    "veo",
    "imagen"
  ];
  var IMAGE_MARKERS = [
    "image",
    "nano-banana",
    "imagen"
  ];
  function isChatModel(modelId) {
    var lower = String(modelId || "").toLowerCase();
    for (var i = 0; i < NON_CHAT_MARKERS.length; i++) {
      if (lower.indexOf(NON_CHAT_MARKERS[i]) !== -1)
        return false;
    }
    return true;
  }
  function isImageModel(modelId) {
    var lower = String(modelId || "").toLowerCase();
    for (var i = 0; i < IMAGE_MARKERS.length; i++) {
      if (lower.indexOf(IMAGE_MARKERS[i]) !== -1)
        return true;
    }
    return false;
  }
  var EXPRESS_HOST = "://aiplatform.googleapis.com";
  var PROJECT_PROBE_MODEL = "plasmallm-project-probe";
  var COUNT_TOKENS_BODY = JSON.stringify({
    contents: [{ role: "user", parts: [{ text: "hi" }] }]
  });
  var projectByKey = {};
  function projectFromError(text) {
    var m = /projects\/(\d+)\//.exec(String(text || ""));
    return m ? m[1] : "";
  }
  function usesExpressKey(opts, apiKey, baseUrl) {
    if (!opts || opts.geminiAuthMethod !== "agentplatform" || opts.geminiVertexAuthType === "gcloud")
      return false;
    if (!apiKey || apiKey.indexOf("ya29.") === 0)
      return false;
    if (opts.geminiProjectId && String(opts.geminiProjectId).trim().length > 0)
      return false;
    return String(baseUrl || "").indexOf(EXPRESS_HOST) !== -1;
  }
  function cachedProject(apiKey) {
    return projectByKey[apiKey] || "";
  }
  function modelUrl(baseUrl, projectId, location, model, method) {
    if (projectId && projectId.length > 0) {
      return baseUrl + "/v1/projects/" + encodeURIComponent(projectId) + "/locations/" + encodeURIComponent(location || "global") + "/publishers/google/models/" + encodeURIComponent(model) + ":" + method;
    }
    return baseUrl + "/v1/publishers/google/models/" + encodeURIComponent(model) + ":" + method;
  }
  function discoverProject(baseUrl, apiKey, callback) {
    var cancelled = false;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", modelUrl(baseUrl, "", "", PROJECT_PROBE_MODEL, "countTokens"));
    xhr.timeout = 15e3;
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("x-goog-api-key", apiKey);
    function done() {
      if (cancelled) return;
      cancelled = true;
      var project = projectFromError(xhr.responseText);
      if (project) projectByKey[apiKey] = project;
      callback(project);
    }
    xhr.ontimeout = done;
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) done();
    };
    xhr.send(COUNT_TOKENS_BODY);
    return {
      abort: function() {
        cancelled = true;
        xhr.abort();
      }
    };
  }
  function probeModels(ids, urlFor, apiKey, callback) {
    if (!ids || ids.length === 0) {
      callback([]);
      return;
    }
    var reachable = [];
    var pending = ids.length;
    function settle(index, ok) {
      reachable[index] = ok;
      pending--;
      if (pending === 0) {
        callback(ids.filter(function(id, i2) {
          return reachable[i2];
        }));
      }
    }
    for (var i = 0; i < ids.length; i++) {
      (function(index) {
        var xhr = new XMLHttpRequest();
        var settled = false;
        function done() {
          if (settled) return;
          settled = true;
          settle(index, xhr.status !== 404);
        }
        xhr.open("POST", urlFor(ids[index]));
        xhr.timeout = 15e3;
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("x-goog-api-key", apiKey);
        xhr.ontimeout = done;
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) done();
        };
        xhr.send(COUNT_TOKENS_BODY);
      })(i);
    }
  }
  function verifyModels(baseUrl, apiKey, location, ids, callback) {
    if (!ids || ids.length === 0) {
      callback([]);
      return;
    }
    function probeAll(projectId) {
      probeModels(ids, function(id) {
        return modelUrl(baseUrl, projectId, location, id, "countTokens");
      }, apiKey, callback);
    }
    var cached = cachedProject(apiKey);
    if (cached) {
      probeAll(cached);
    } else {
      discoverProject(baseUrl, apiKey, probeAll);
    }
  }
  function verifyStudioModels(baseUrl, apiKey, ids, callback) {
    probeModels(ids, function(id) {
      return baseUrl + "/v1beta/models/" + encodeURIComponent(id) + ":countTokens";
    }, apiKey, callback);
  }
  var AgentPlatform = {
    NON_CHAT_MARKERS,
    IMAGE_MARKERS,
    isChatModel,
    isImageModel,
    projectFromError,
    usesExpressKey,
    cachedProject,
    modelUrl,
    discoverProject,
    probeModels,
    verifyModels,
    verifyStudioModels
  };

  // src/providers/gemini/thinking.js
  function isAgentPlatformAuth(authMethod) {
    return authMethod === "agentplatform";
  }
  function rejectsBudgetZeroOnAiStudio(model) {
    var m = String(model || "").toLowerCase();
    if (!m) return false;
    if (m === "gemini-flash-lite-latest") return true;
    if (m.indexOf("3.5-flash-lite") !== -1 || m.indexOf("3.6-flash-lite") !== -1)
      return true;
    if (m.indexOf("flash-lite-latest") !== -1)
      return true;
    return false;
  }
  function supportsMinimalThinkingLevel(model) {
    var m = String(model || "").toLowerCase();
    if (m === "gemini-flash-latest") return false;
    return true;
  }
  function budgetToThinkingLevel(budget, model) {
    var b = budget | 0;
    if (b <= 0) {
      if (supportsMinimalThinkingLevel(model))
        return "MINIMAL";
      return "LOW";
    }
    if (b <= 1024) return "LOW";
    if (b <= 8192) return "MEDIUM";
    return "HIGH";
  }
  function buildThinkingConfig(model, thinkingBudget, showThoughts, authMethod) {
    var budget = thinkingBudget | 0;
    if (budget < 0) budget = 0;
    var cfg = {};
    if (showThoughts) cfg.includeThoughts = true;
    if (isAgentPlatformAuth(authMethod)) {
      cfg.thinkingBudget = budget;
      return cfg;
    }
    if (budget === 0 && rejectsBudgetZeroOnAiStudio(model)) {
      cfg.thinkingLevel = budgetToThinkingLevel(0, model);
      return cfg;
    }
    cfg.thinkingBudget = budget;
    return cfg;
  }
  var GeminiThinking = {
    isAgentPlatform: isAgentPlatformAuth,
    rejectsBudgetZeroOnAiStudio,
    supportsMinimalThinkingLevel,
    budgetToThinkingLevel,
    buildThinkingConfig
  };

  // src/providers/gemini/messages.js
  function setGeminiHeaders(xhr, apiKey, opts) {
    xhr.setRequestHeader("Content-Type", "application/json");
    if (apiKey && apiKey.length > 0) {
      var isGcloud = opts && opts.geminiAuthMethod === "agentplatform" && opts.geminiVertexAuthType === "gcloud";
      if (opts && opts.opencodeAuth) {
        xhr.setRequestHeader("x-goog-api-key", apiKey);
      } else if (isGcloud || apiKey.indexOf("ya29.") === 0) {
        xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
      } else {
        xhr.setRequestHeader("x-goog-api-key", apiKey);
      }
    }
    if (opts && opts.extraHeaders) {
      for (var h in opts.extraHeaders) {
        if (Object.prototype.hasOwnProperty.call(opts.extraHeaders, h)) {
          xhr.setRequestHeader(h, opts.extraHeaders[h]);
        }
      }
    }
  }
  function formatGeminiError(xhr, prefix) {
    var detail = "";
    try {
      var body = JSON.parse(xhr.responseText);
      if (body && body.error && body.error.message) {
        detail = body.error.message;
      }
    } catch (e) {
      if (xhr.responseText) detail = xhr.responseText.substring(0, 200);
    }
    if (xhr.status === 400 && detail.toLowerCase().indexOf("api key") !== -1) {
      return "Authentication failed \u2014 check your API key (HTTP 400): " + detail;
    }
    if (xhr.status === 401 || xhr.status === 403) {
      return "Authentication failed (HTTP " + xhr.status + ") \u2014 check your API key: " + detail;
    }
    if (xhr.status > 0) {
      return prefix + " (HTTP " + xhr.status + ")" + (detail ? ": " + detail : "");
    }
    return prefix + ": blocked by browser CORS policy or network failure (HTTP 0). If using OpenCode (opencode.ai), please enable a CORS-unblocking browser extension (e.g. 'Allow CORS: Access-Control-Allow-Origin') for https://opencode.ai.";
  }
  function translateMessages(neutralMessages) {
    var systemText = "";
    var contents = [];
    for (var i = 0; i < neutralMessages.length; i++) {
      var m = neutralMessages[i];
      if (m.role === "system") {
        if (typeof m.content === "string") {
          systemText += (systemText.length > 0 ? "\n\n" : "") + m.content;
        }
      } else if (m.role === "assistant") {
        contents.push({
          role: "model",
          parts: [{ text: typeof m.content === "string" ? m.content : "" }]
        });
      } else if (m.role === "user") {
        contents.push({
          role: "user",
          parts: [{ text: typeof m.content === "string" ? m.content : "" }]
        });
      }
    }
    return { systemText, contents };
  }
  function parseGeminiSSEChunks(buffer, lastIndex) {
    var tokens = [];
    var searchFrom = lastIndex;
    while (true) {
      var nlPos = buffer.indexOf("\n", searchFrom);
      if (nlPos === -1) break;
      var line = buffer.substring(searchFrom, nlPos).replace(/\r$/, "");
      searchFrom = nlPos + 1;
      if (line === "") continue;
      if (line.substring(0, 6) !== "data: ") continue;
      var payload = line.substring(6);
      try {
        var obj = JSON.parse(payload);
        if (obj.candidates && obj.candidates[0] && obj.candidates[0].content) {
          var partsArr = obj.candidates[0].content.parts || [];
          for (var p = 0; p < partsArr.length; p++) {
            var part = partsArr[p];
            if (part.thought === true) {
              var tt = typeof part.text === "string" ? part.text : "";
              tokens.push({
                thinking_delta: {
                  text: tt,
                  signature: part.thoughtSignature || ""
                }
              });
            } else if (typeof part.text === "string" && part.text.length > 0) {
              tokens.push({ content: part.text });
            }
          }
        }
        if (obj.error) {
          tokens.push({ error: obj.error && obj.error.message || "stream error" });
        }
      } catch (e) {
      }
    }
    return { tokens, newIndex: searchFrom };
  }

  // src/providers/gemini/models.js
  var STATIC_VERTEX_GEMINI_MODELS = [
    "gemini-3.8-flash",
    "gemini-4-argon",
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.1-pro-preview",
    "gemini-3.1-pro-preview-customtools",
    "gemini-3.1-flash-lite",
    "gemini-3-flash-preview",
    "gemini-omni-flash-preview",
    "gemini-2.5-pro",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite"
  ];
  var STATIC_GEMINI_IMAGE_MODELS = [
    "gemini-3.1-flash-image",
    "gemini-3.1-flash-lite-image",
    "gemini-3-pro-image",
    "gemini-nano-banana-2.1",
    "gemini-2.5-flash-image"
  ];
  function fetchModelsDev(providerId, filterFn, fallbackList, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://models.dev/api.json");
    xhr.timeout = 1e4;
    xhr.ontimeout = function() {
      callback(null, fallbackList, 200);
    };
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            var data = JSON.parse(xhr.responseText);
            var providers = Array.isArray(providerId) ? providerId : [providerId, "google"];
            var seen = {};
            var ids = [];
            for (var p = 0; p < providers.length; p++) {
              var entry = data[providers[p]];
              if (entry && entry.models) {
                var keys = Object.keys(entry.models);
                for (var k = 0; k < keys.length; k++) {
                  if (!seen[keys[k]]) {
                    seen[keys[k]] = true;
                    ids.push(keys[k]);
                  }
                }
              }
            }
            if (filterFn) ids = ids.filter(filterFn);
            if (ids.length > 0) {
              callback(null, ids, 200);
              return;
            }
          } catch (e) {
          }
        }
        callback(null, fallbackList, 200);
      }
    };
    xhr.send();
  }
  function fetchGeminiModels(endpoint, apiKey, opts, callback) {
    if (typeof opts === "function") {
      callback = opts;
      opts = null;
    }
    var location = opts && opts.geminiLocation || "global";
    var baseUrl = String(endpoint || "https://aiplatform.googleapis.com").replace(/\/+$/, "");
    if (location !== "global" && baseUrl.indexOf("://aiplatform.googleapis.com") !== -1) {
      baseUrl = baseUrl.replace("://", "://" + location + "-");
    }
    var isAgentPlatform = opts && opts.geminiAuthMethod === "agentplatform";
    var isGcloud = opts && opts.geminiVertexAuthType === "gcloud";
    var projectId = opts && opts.geminiProjectId ? opts.geminiProjectId.trim() : "";
    var includeImages = !!(opts && opts.includeImageModels);
    var geminiFilter = function(m) {
      var lower = m.toLowerCase();
      if (lower.indexOf("gemini") === -1) return false;
      if (includeImages) {
        return AgentPlatform.isChatModel(m) || AgentPlatform.isImageModel(m);
      }
      return AgentPlatform.isChatModel(m);
    };
    function splitAndFinish(err, allModels, status) {
      if (err || !allModels) {
        callback(err, allModels, status, []);
        return;
      }
      if (!includeImages) {
        callback(null, allModels, status, STATIC_GEMINI_IMAGE_MODELS.slice());
        return;
      }
      var chatList = [];
      var imageList = [];
      for (var i = 0; i < allModels.length; i++) {
        var id = allModels[i];
        if (AgentPlatform.isImageModel(id)) {
          imageList.push(id);
        } else if (AgentPlatform.isChatModel(id)) {
          chatList.push(id);
        }
      }
      if (chatList.length === 0) chatList = STATIC_VERTEX_GEMINI_MODELS.slice();
      if (imageList.length === 0) imageList = STATIC_GEMINI_IMAGE_MODELS.slice();
      callback(null, chatList, status, imageList);
    }
    var fallbackCombined = includeImages ? STATIC_VERTEX_GEMINI_MODELS.concat(STATIC_GEMINI_IMAGE_MODELS) : STATIC_VERTEX_GEMINI_MODELS;
    if (isAgentPlatform) {
      if (isGcloud && projectId.length > 0) {
        var xhr = new XMLHttpRequest();
        var url = baseUrl + "/v1beta1/projects/" + encodeURIComponent(projectId) + "/locations/" + encodeURIComponent(location) + "/publishers/google/models";
        xhr.open("GET", url);
        xhr.timeout = 15e3;
        setGeminiHeaders(xhr, apiKey, opts);
        xhr.ontimeout = function() {
          fetchModelsDev("google-vertex", geminiFilter, fallbackCombined, splitAndFinish);
        };
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              try {
                var response = JSON.parse(xhr.responseText);
                var models = [];
                var rawModels = response.publisherModels || response.models || [];
                for (var i = 0; i < rawModels.length; i++) {
                  var modelItem = rawModels[i];
                  var name = modelItem.name || "";
                  if (name.indexOf("models/") === 0) name = name.substring(7);
                  else if (name.indexOf("publishers/google/models/") !== -1) {
                    name = name.split("/").pop();
                  }
                  if (geminiFilter(name)) {
                    models.push(name);
                  }
                }
                if (models.length > 0) {
                  splitAndFinish(null, models, xhr.status);
                  return;
                }
              } catch (e) {
              }
            }
            fetchModelsDev("google-vertex", geminiFilter, fallbackCombined, splitAndFinish);
          }
        };
        xhr.send();
        return;
      }
      if (AgentPlatform.usesExpressKey(opts, apiKey, baseUrl)) {
        fetchModelsDev("google-vertex", geminiFilter, fallbackCombined, function(err, ids, status) {
          AgentPlatform.verifyModels(baseUrl, apiKey, location, ids, function(reachable) {
            splitAndFinish(null, reachable.length > 0 ? reachable : ids, status);
          });
        });
        return;
      }
      fetchModelsDev("google-vertex", geminiFilter, fallbackCombined, splitAndFinish);
      return;
    }
    var studioXhr = new XMLHttpRequest();
    var studioUrl = baseUrl + "/v1beta/models?pageSize=1000";
    studioXhr.open("GET", studioUrl);
    studioXhr.timeout = 3e4;
    setGeminiHeaders(studioXhr, apiKey, opts);
    studioXhr.ontimeout = function() {
      callback("Request timed out after 30 seconds", null);
    };
    studioXhr.onreadystatechange = function() {
      if (studioXhr.readyState === 4) {
        if (studioXhr.status === 200) {
          try {
            var response = JSON.parse(studioXhr.responseText);
            var models = [];
            var rawModels = response.models || [];
            for (var i = 0; i < rawModels.length; i++) {
              var m = rawModels[i];
              var name = m.name || "";
              if (name.indexOf("models/") === 0) name = name.substring(7);
              var methods = m.supportedGenerationMethods || [];
              if (methods.indexOf("generateContent") !== -1 && (AgentPlatform.isChatModel(name) || includeImages && AgentPlatform.isImageModel(name))) {
                models.push(name);
              }
            }
            if (!apiKey || apiKey.indexOf("ya29.") === 0 || models.length === 0) {
              splitAndFinish(null, models, studioXhr.status);
              return;
            }
            var listStatus = studioXhr.status;
            AgentPlatform.verifyStudioModels(baseUrl, apiKey, models, function(usable) {
              splitAndFinish(null, usable.length > 0 ? usable : models, listStatus);
            });
          } catch (e) {
            callback("Failed to parse models: " + e.message, null, studioXhr.status);
          }
        } else {
          callback(formatGeminiError(studioXhr, "Failed to fetch models"), null, studioXhr.status);
        }
      }
    };
    studioXhr.send();
  }

  // src/providers/gemini/images.js
  function generateGeminiImage(opts, callback) {
    var endpoint = opts.endpoint || "https://aiplatform.googleapis.com";
    var apiKey = opts.apiKey || "";
    var model = opts.model || "gemini-2.5-flash-image";
    var prompt = opts.prompt || "";
    var aspectRatio = normalizeSupportedAspectRatio(opts.aspectRatio || "1:1", opts.width, opts.height, opts.geminiAuthMethod || "gemini");
    var baseUrl = endpoint.replace(/\/+$/, "");
    var location = opts && opts.geminiLocation || "global";
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
      xhr.timeout = 9e4;
      setGeminiHeaders(xhr, apiKey, opts);
      var bodyObj;
      if (isImagen) {
        bodyObj = {
          instances: [{ prompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio
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
            if (data.predictions && data.predictions[0] && data.predictions[0].bytesBase64Encoded) {
              var mime = data.predictions[0].mimeType || "image/png";
              callback(null, "data:" + mime + ";base64," + data.predictions[0].bytesBase64Encoded);
              return;
            }
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
          sendRequest(projectId, false);
        } else {
          callback(formatGeminiError(xhr, "Image request failed"), null);
        }
      };
      xhr.send(JSON.stringify(bodyObj));
    }
    var explicitProject = opts && opts.geminiProjectId ? opts.geminiProjectId.trim() : "";
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

  // src/providers/gemini/chat.js
  function sendGeminiStreaming(opts) {
    var endpoint = opts.endpoint || "https://aiplatform.googleapis.com";
    var apiKey = opts.apiKey || "";
    var model = opts.model || "gemini-2.5-flash";
    var temperature = opts.temperature !== void 0 ? opts.temperature : 70;
    var maxTokens = opts.maxTokens || 16384;
    var onChunk = opts.onChunk || function() {
    };
    var onComplete = opts.onComplete || function() {
    };
    var translated = translateMessages(opts.messages || []);
    var xhr = new XMLHttpRequest();
    var url;
    var baseUrl = endpoint.replace(/\/+$/, "");
    var location = "global";
    var findProject = false;
    if (opts && opts.opencodeAuth) {
      url = baseUrl + "/models/" + encodeURIComponent(model) + ":streamGenerateContent?alt=sse";
    } else if (opts && opts.geminiAuthMethod === "agentplatform") {
      var projectId = opts.geminiProjectId ? opts.geminiProjectId.trim() : "";
      location = opts.geminiLocation || "global";
      if (location !== "global" && baseUrl.indexOf("://aiplatform.googleapis.com") !== -1) {
        baseUrl = baseUrl.replace("://", "://" + location + "-");
      }
      if (AgentPlatform.usesExpressKey(opts, apiKey, baseUrl)) {
        projectId = AgentPlatform.cachedProject(apiKey);
        findProject = projectId.length === 0;
      }
      url = AgentPlatform.modelUrl(baseUrl, projectId, location, model, "streamGenerateContent?alt=sse");
    } else {
      url = baseUrl + "/v1beta/models/" + encodeURIComponent(model) + ":streamGenerateContent?alt=sse";
    }
    var lastParseIndex = 0;
    var accumulatedText = "";
    var streamError = null;
    var completeCalled = false;
    function processBuffer() {
      var result = parseGeminiSSEChunks(xhr.responseText, lastParseIndex);
      lastParseIndex = result.newIndex;
      for (var i = 0; i < result.tokens.length; i++) {
        var tok = result.tokens[i];
        if (tok.error) {
          streamError = tok.error;
          continue;
        }
        if (tok.content) {
          accumulatedText += tok.content;
          onChunk(tok.content, accumulatedText);
        }
      }
    }
    function finish(error) {
      if (completeCalled) return;
      completeCalled = true;
      if (error) {
        onComplete(accumulatedText, error, null, null);
      } else if (accumulatedText.length > 0) {
        onComplete(accumulatedText, null, null, { role: "assistant", content: accumulatedText });
      } else {
        try {
          var response = JSON.parse(xhr.responseText);
          var text = "";
          if (response.candidates && response.candidates[0] && response.candidates[0].content) {
            var partsArr = response.candidates[0].content.parts || [];
            for (var i = 0; i < partsArr.length; i++) {
              var part = partsArr[i];
              if (!part.thought && typeof part.text === "string") {
                text += part.text;
              }
            }
          }
          if (text.length > 0) {
            onComplete(text, null, null, { role: "assistant", content: text });
          } else {
            onComplete("", "Invalid response format from Gemini");
          }
        } catch (e) {
          onComplete("", "Failed to parse response: " + e.message);
        }
      }
    }
    xhr.ontimeout = function() {
      finish("Request timed out");
    };
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 3) {
        processBuffer();
      } else if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          processBuffer();
          finish(streamError);
        } else {
          finish(formatGeminiError(xhr, "Request failed"));
        }
      }
    };
    var tempFloat = temperature > 2 ? temperature / 100 : temperature;
    var body = {
      contents: translated.contents,
      generationConfig: {
        temperature: tempFloat,
        maxOutputTokens: outputTokenBudget(maxTokens, opts.thinkingBudget || 0)
      }
    };
    body.generationConfig.thinkingConfig = GeminiThinking.buildThinkingConfig(
      model,
      opts.thinkingBudget || 0,
      !!opts.showThoughts,
      opts.geminiAuthMethod || "aistudio"
    );
    if (translated.systemText && translated.systemText.length > 0) {
      body.systemInstruction = { parts: [{ text: translated.systemText }] };
    }
    var payload = JSON.stringify(body, null, 2);
    var handle = {
      xhr,
      processBuffer,
      abort: function() {
        completeCalled = true;
        if (handle.xhr && typeof handle.xhr.abort === "function") {
          handle.xhr.abort();
        }
      }
    };
    function openAndSend(requestUrl) {
      xhr.open("POST", requestUrl);
      xhr.timeout = 6e5;
      setGeminiHeaders(xhr, apiKey, opts);
      handle.xhr = xhr;
      xhr.send(payload);
    }
    if (findProject) {
      handle.xhr = AgentPlatform.discoverProject(baseUrl, apiKey, function(project) {
        openAndSend(project ? AgentPlatform.modelUrl(baseUrl, project, location, model, "streamGenerateContent?alt=sse") : url);
      });
    } else {
      openAndSend(url);
    }
    return handle;
  }
  function completeGeminiOnce(opts, callback) {
    var maxTokens = opts.maxTokens !== void 0 ? opts.maxTokens : 180;
    var temp = opts.temperature !== void 0 ? opts.temperature : 0.5;
    var provider = opts.geminiAuthMethod || opts.provider || "agentplatform";
    var model = opts.model || "gemini-2.5-flash";
    var apiKey = (opts.apiKey || "").trim();
    var completed = false;
    function done(err, text) {
      if (completed) return;
      completed = true;
      callback(err, text);
    }
    var baseUrl = (provider === "agentplatform" ? opts.endpoint || "https://aiplatform.googleapis.com" : "https://generativelanguage.googleapis.com").replace(/\/+$/, "");
    var location = opts.geminiLocation || "global";
    var translated = translateMessages(opts.messages || []);
    var body = {
      contents: translated.contents,
      generationConfig: {
        temperature: temp,
        maxOutputTokens: maxTokens,
        thinkingConfig: GeminiThinking.buildThinkingConfig(model, 0, false, provider)
      }
    };
    if (translated.systemText) {
      body.systemInstruction = { parts: [{ text: translated.systemText }] };
    }
    var xhr = new XMLHttpRequest();
    var handle = {
      xhr,
      abort: function() {
        completed = true;
        if (handle.xhr && typeof handle.xhr.abort === "function") {
          handle.xhr.abort();
        }
      }
    };
    function sendToUrl(reqUrl) {
      xhr.open("POST", reqUrl);
      xhr.timeout = opts.timeout || 8e3;
      setGeminiHeaders(xhr, apiKey, {
        geminiAuthMethod: provider,
        geminiVertexAuthType: opts.vertexAuthType || opts.geminiVertexAuthType
      });
      xhr.ontimeout = function() {
        done("Gemini request timed out", null);
      };
      xhr.onerror = function() {
        done("Gemini network error", null);
      };
      xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4) return;
        if (xhr.status === 200) {
          try {
            var data = JSON.parse(xhr.responseText);
            var part = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0];
            var text = part && part.text || "";
            done(null, text);
          } catch (e) {
            done("Failed to parse Gemini response: " + e.message, null);
          }
        } else {
          done(formatGeminiError(xhr, "Gemini request failed"), null);
        }
      };
      xhr.send(JSON.stringify(body));
    }
    if (provider === "agentplatform" && AgentPlatform.usesExpressKey(opts, apiKey, baseUrl)) {
      var cachedProj = AgentPlatform.cachedProject(apiKey);
      if (cachedProj) {
        sendToUrl(AgentPlatform.modelUrl(baseUrl, cachedProj, location, model, "generateContent"));
      } else {
        handle.xhr = AgentPlatform.discoverProject(baseUrl, apiKey, function(discovered) {
          sendToUrl(discovered ? AgentPlatform.modelUrl(baseUrl, discovered, location, model, "generateContent") : baseUrl + "/v1beta/models/" + encodeURIComponent(model) + ":generateContent");
        });
      }
    } else {
      var explicitProj = (opts.geminiProjectId || "").trim();
      if (provider === "agentplatform") {
        sendToUrl(AgentPlatform.modelUrl(baseUrl, explicitProj, location, model, "generateContent"));
      } else {
        sendToUrl(baseUrl + "/v1beta/models/" + encodeURIComponent(model) + ":generateContent");
      }
    }
    return handle;
  }

  // src/providers/gemini/index.js
  var GeminiAdapter = {
    id: "gemini",
    name: "Google AI Studio",
    STATIC_VERTEX_GEMINI_MODELS,
    STATIC_GEMINI_IMAGE_MODELS,
    SUPPORTED_ASPECT_RATIOS: GEMINI_SUPPORTED_ASPECT_RATIOS,
    supportedAspectRatios: GEMINI_SUPPORTED_ASPECT_RATIOS,
    normalizeSupportedAspectRatio,
    setHeaders: setGeminiHeaders,
    fetchModels: fetchGeminiModels,
    formatGeminiError,
    translateMessages,
    parseSSEChunks: parseGeminiSSEChunks,
    sendStreaming: sendGeminiStreaming,
    streamChat: sendGeminiStreaming,
    completeOnce: completeGeminiOnce,
    generateImage: generateGeminiImage,
    hasCredentials: function(config) {
      return !!(config && config.googleApiKey && config.googleApiKey.trim().length > 0);
    }
  };
  var AgentPlatformAdapter = {
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

  // src/providers/openrouter/models.js
  var STATIC_OR_TEXT_MODELS = [
    "anthropic/claude-3.5-sonnet",
    "google/gemini-2.5-flash",
    "google/gemini-2.5-pro",
    "google/gemini-3-flash-preview",
    "openai/gpt-4o",
    "deepseek/deepseek-chat"
  ];
  var STATIC_OR_IMAGE_MODELS = [
    "openai/gpt-image-2.5-flare",
    "openai/gpt-image-2.5-flare-20260908",
    "openai/gpt-image-2.5-sunburst",
    "openai/gpt-image-2.5-sunburst-20260908",
    "openai/gpt-image-2",
    "openai/gpt-image-1",
    "openai/gpt-image-1-mini",
    "google/gemini-nano-banana-2.1",
    "google/gemini-3.1-flash-image",
    "google/gemini-3.1-flash-image-preview",
    "google/gemini-3.1-flash-lite-image",
    "google/gemini-3-pro-image",
    "google/gemini-3-pro-image-preview",
    "google/gemini-2.5-flash-image",
    "google/gemini-2.5-flash-image-preview",
    "black-forest-labs/flux-3-image",
    "black-forest-labs/flux-3-image-klein",
    "black-forest-labs/flux.2-max",
    "black-forest-labs/flux.2-pro",
    "black-forest-labs/flux.2-flex",
    "black-forest-labs/flux.2-klein-4b",
    "bytedance-seed/seedream-5-0-pro",
    "bytedance-seed/seedream-5-0-flash",
    "bytedance-seed/seedream-5-0-lite",
    "bytedance-seed/seedream-4.5",
    "qwen/qwen-image-3-pro",
    "qwen/qwen-image-3",
    "qwen/qwen-image-2.1-pro",
    "qwen/qwen-image-2.1-turbo",
    "qwen/qwen-image-2-pro",
    "qwen/qwen-image-2",
    "recraft/recraft-v4.1-pro",
    "recraft/recraft-v4.1-flash",
    "recraft/recraft-v4.1-vector",
    "recraft/recraft-v4-pro",
    "recraft/recraft-v4",
    "microsoft/mai-image-2.6",
    "microsoft/mai-image-2.6-flash",
    "microsoft/mai-image-2",
    "x-ai/grok-imagine-image-2.0",
    "x-ai/grok-imagine-image-pro",
    "x-ai/grok-imagine-image",
    "sourceful/riverflow-v2.5-pro",
    "sourceful/riverflow-v2.5-fast",
    "sourceful/riverflow-v2-pro",
    "sourceful/riverflow-v2-fast",
    "krea/krea-2-large",
    "tencent/hy-image-v3.5-preview",
    "meta/muse-image",
    "meta/muse-image-fast",
    "openai/gpt-5.4-image-2",
    "openai/gpt-5-image",
    "openai/gpt-5-image-mini"
  ];
  function normalizeOpenRouterModelId(rawModel) {
    var s = String(rawModel || "").trim();
    if (!s) return "";
    s = s.replace(/^https?:\/\/(?:www\.)?openrouter\.ai\/(?:models\/)?/i, "");
    s = s.split("?")[0].split("#")[0].replace(/^\/+|\/+$/g, "");
    return s;
  }
  function fetchOpenRouterModels(apiKey, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://openrouter.ai/api/v1/models?output_modalities=all");
    xhr.timeout = 2e4;
    if (apiKey) {
      xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
    }
    xhr.ontimeout = function() {
      callback("OpenRouter model fetch timed out", null);
    };
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200) {
        try {
          let pushImageModel = function(id) {
            if (!id || seenImage[id]) return;
            seenImage[id] = true;
            imageModels.push(id);
          }, pushTextModel = function(id) {
            if (!id || seenText[id]) return;
            seenText[id] = true;
            textModels.push(id);
          };
          var body = JSON.parse(xhr.responseText);
          var raw = body.data || [];
          var textModels = [];
          var imageModels = [];
          var seenImage = {};
          var seenText = {};
          for (var i = 0; i < raw.length; i++) {
            var m = raw[i];
            if (!m || !m.id) continue;
            var outMods = m.architecture && m.architecture.output_modalities || [];
            var isEmbed = outMods.indexOf("embeddings") !== -1 || m.id.indexOf("embed") !== -1;
            var isImg = !isEmbed && (outMods.indexOf("image") !== -1 || outMods.length === 0 && (AgentPlatform.isImageModel(m.id) || m.id.indexOf("gpt-image") !== -1 || m.id.indexOf("flux") !== -1 || m.id.indexOf("seedream") !== -1 || m.id.indexOf("recraft") !== -1 || m.id.indexOf("qwen-image") !== -1 || m.id.indexOf("mai-image") !== -1 || m.id.indexOf("muse-image") !== -1));
            if (isImg) {
              pushImageModel(m.id);
              if (m.canonical_slug && m.canonical_slug !== m.id) {
                pushImageModel(m.canonical_slug);
              }
            }
            if (!isEmbed && (outMods.indexOf("text") !== -1 || outMods.length === 0)) {
              pushTextModel(m.id);
            }
          }
          callback(null, { textModels, imageModels });
        } catch (e) {
          callback("Failed to parse OpenRouter models: " + e.message, null);
        }
      } else {
        callback("Failed to fetch OpenRouter models (HTTP " + xhr.status + ")", null);
      }
    };
    xhr.send();
  }

  // src/providers/openrouter/referer.js
  function getAppReferrerOrigin() {
    if (typeof globalThis !== "undefined" && globalThis.location && globalThis.location.origin) {
      return globalThis.location.origin;
    }
    return "https://browser-of-dreams.local";
  }

  // src/providers/openrouter/images.js
  function parseOpenRouterError(xhr, prefix) {
    var errMsg = (prefix || "OpenRouter error") + " (HTTP " + xhr.status + ")";
    try {
      var body = JSON.parse(xhr.responseText);
      if (body && body.error && body.error.message) {
        errMsg += ": " + body.error.message;
      }
    } catch (e) {
    }
    return errMsg;
  }
  function extractOpenRouterImageFromChatResponse(data) {
    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
      return null;
    }
    var msg = data.choices[0].message;
    if (Array.isArray(msg.images) && msg.images.length > 0) {
      var img0 = msg.images[0];
      if (typeof img0 === "string") return img0;
      if (img0.image_url && img0.image_url.url) return img0.image_url.url;
      if (img0.url) return img0.url;
      if (img0.b64_json) {
        return "data:" + (img0.media_type || "image/png") + ";base64," + img0.b64_json;
      }
    }
    if (Array.isArray(msg.content)) {
      for (var i = 0; i < msg.content.length; i++) {
        var part = msg.content[i];
        if (part.image_url && part.image_url.url) return part.image_url.url;
        if (part.b64_json) return "data:image/png;base64," + part.b64_json;
      }
    }
    if (typeof msg.content === "string") {
      var m = /(data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+)/.exec(msg.content);
      if (m) return m[1];
    }
    return null;
  }
  function generateOpenRouterImage(opts, callback) {
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
      xhr.timeout = 9e4;
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
        model,
        messages: [{ role: "user", content: prompt }],
        modalities: ["image", "text"]
      }));
    }
    function tryUnifiedImagesEndpoint(onFallback, primaryErr) {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "https://openrouter.ai/api/v1/images");
      xhr.timeout = 9e4;
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
        model,
        prompt,
        aspect_ratio: aspectRatio
      }));
    }
    var lower = model.toLowerCase();
    var prefersChatCompletions = lower.indexOf("gemini-") !== -1 || lower.indexOf("gpt-5") !== -1 || lower.indexOf("openrouter/auto") !== -1;
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

  // src/providers/openrouter/chat.js
  function sendOpenRouterStreaming(opts) {
    var apiKey = opts.apiKey || "";
    var model = normalizeOpenRouterModelId(opts.model || "google/gemini-2.5-flash");
    var temperature = opts.temperature !== void 0 ? opts.temperature : 0.7;
    var tempFloat = temperature > 2 ? temperature / 100 : temperature;
    var onChunk = opts.onChunk || function() {
    };
    var onComplete = opts.onComplete || function() {
    };
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://openrouter.ai/api/v1/chat/completions");
    xhr.timeout = 6e5;
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
    xhr.setRequestHeader("HTTP-Referer", getAppReferrerOrigin());
    xhr.setRequestHeader("X-Title", "Browser of Dreams");
    var lastIndex = 0;
    var accumulatedText = "";
    var completeCalled = false;
    function processSSE() {
      var buffer = xhr.responseText;
      while (true) {
        var nl = buffer.indexOf("\n", lastIndex);
        if (nl === -1) break;
        var line = buffer.substring(lastIndex, nl).replace(/\r$/, "");
        lastIndex = nl + 1;
        if (!line || line.indexOf("data: ") !== 0) continue;
        var dataStr = line.substring(6).trim();
        if (dataStr === "[DONE]") continue;
        try {
          var parsed = JSON.parse(dataStr);
          if (parsed.error && parsed.error.message) {
            finish(parsed.error.message);
            return;
          }
          var choice = parsed.choices && parsed.choices[0];
          if (!choice) continue;
          var delta = choice.delta;
          var content = delta && delta.content;
          var reasoning = delta && (delta.reasoning || delta.reasoning_content);
          if (typeof content === "string" && content.length > 0) {
            accumulatedText += content;
            onChunk(content, accumulatedText);
          } else if (typeof reasoning === "string" && reasoning.length > 0) {
            if (!accumulatedText.startsWith("<!-- [Reasoning]")) {
              accumulatedText = "<!-- [Reasoning]\n" + reasoning;
            } else {
              accumulatedText += reasoning;
            }
            onChunk(reasoning, accumulatedText);
          }
        } catch (e) {
        }
      }
    }
    function finish(err) {
      if (completeCalled) return;
      completeCalled = true;
      if (err) {
        onComplete(accumulatedText, err);
        return;
      }
      if (accumulatedText.length > 0) {
        onComplete(accumulatedText, null);
        return;
      }
      try {
        var obj = JSON.parse(xhr.responseText);
        var content = obj.choices && obj.choices[0] && obj.choices[0].message && obj.choices[0].message.content;
        if (typeof content === "string" && content.length > 0) {
          onComplete(content, null);
        } else {
          onComplete("", "Empty response from OpenRouter");
        }
      } catch (e) {
        onComplete("", "Failed to parse OpenRouter response");
      }
    }
    xhr.ontimeout = function() {
      finish("OpenRouter request timed out");
    };
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 3) {
        processSSE();
      } else if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          processSSE();
          finish(null);
        } else {
          var errMsg = "OpenRouter HTTP " + xhr.status;
          try {
            var body = JSON.parse(xhr.responseText);
            if (body && body.error && body.error.message) {
              errMsg += ": " + body.error.message;
            }
          } catch (e) {
          }
          finish(errMsg);
        }
      }
    };
    var payload = JSON.stringify({
      model,
      messages: opts.messages || [],
      temperature: tempFloat,
      stream: true,
      reasoning: { effort: openRouterReasoningEffort(opts.reasoningEffort) }
    });
    xhr.send(payload);
    return {
      xhr,
      abort: function() {
        completeCalled = true;
        xhr.abort();
      }
    };
  }
  function completeOpenRouterOnce(opts, callback) {
    var maxTokens = opts.maxTokens !== void 0 ? opts.maxTokens : 180;
    var temp = opts.temperature !== void 0 ? opts.temperature : 0.5;
    var apiKey = (opts.apiKey || "").trim();
    var model = normalizeOpenRouterModelId(opts.model || "google/gemini-2.5-flash");
    var completed = false;
    function done(err, text) {
      if (completed) return;
      completed = true;
      callback(err, text);
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://openrouter.ai/api/v1/chat/completions");
    xhr.timeout = opts.timeout || 8e3;
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
    xhr.setRequestHeader("HTTP-Referer", getAppReferrerOrigin());
    xhr.setRequestHeader("X-Title", "Browser of Dreams");
    xhr.ontimeout = function() {
      done("OpenRouter request timed out", null);
    };
    xhr.onerror = function() {
      done("OpenRouter network error", null);
    };
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200) {
        try {
          var data = JSON.parse(xhr.responseText);
          var content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
          done(null, content || "");
        } catch (e) {
          done("Failed to parse OpenRouter response", null);
        }
      } else {
        done("OpenRouter HTTP " + xhr.status, null);
      }
    };
    xhr.send(JSON.stringify({
      model,
      messages: opts.messages || [],
      stream: false,
      max_tokens: maxTokens,
      temperature: temp,
      reasoning: { effort: openRouterReasoningEffort(opts.reasoningEffort) }
    }));
    return {
      xhr,
      abort: function() {
        completed = true;
        xhr.abort();
      }
    };
  }

  // src/providers/openrouter/index.js
  var OpenRouterAdapter = {
    id: "openrouter",
    name: "OpenRouter",
    STATIC_OR_TEXT_MODELS,
    STATIC_OR_IMAGE_MODELS,
    SUPPORTED_ASPECT_RATIOS,
    supportedAspectRatios: SUPPORTED_ASPECT_RATIOS,
    normalizeSupportedAspectRatio,
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

  // src/providers/commandcode/route.js
  var COMMANDCODE_BASE = "https://api.commandcode.ai/provider/v1";
  var DEFAULT_COMMANDCODE_MODEL = "deepseek/deepseek-v4.1-flash";
  function commandCodeUrl(endpoint, path) {
    var base = String(endpoint || COMMANDCODE_BASE).replace(/\/+$/, "");
    if (/\/(chat\/completions|messages|responses|models|systemone)$/.test(base)) {
      base = base.replace(/\/(chat\/completions|messages|responses|models|systemone)$/, "");
    }
    return base + path;
  }
  var modelRoutes = /* @__PURE__ */ Object.create(null);
  function cacheCommandCodeModelRoutes(rawModels) {
    if (!Array.isArray(rawModels)) return;
    for (var i = 0; i < rawModels.length; i++) {
      var m = rawModels[i];
      if (m && m.id && Array.isArray(m.supported_endpoints)) {
        modelRoutes[m.id] = m.supported_endpoints.slice();
      }
    }
  }
  function resolveCommandCodeProtocol(modelId) {
    var id = String(modelId || "");
    var routes = modelRoutes[id];
    if (routes) {
      if (routes.indexOf("/messages") !== -1) return "messages";
      if (routes.indexOf("/chat/completions") !== -1) return "chat";
    }
    if (/^claude/i.test(id)) return "messages";
    return "chat";
  }
  function isRetryableFieldError(xhr, pattern) {
    return xhr.status === 400 && pattern.test(String(xhr.responseText || ""));
  }
  function formatCommandCodeHttpError(xhr, label) {
    var msg = (label || "Command Code error") + " (HTTP " + xhr.status + ")";
    if (xhr.status === 0) {
      return msg + ": request blocked before a response. Check the network tab and that https://api.commandcode.ai is reachable.";
    }
    try {
      var body = JSON.parse(xhr.responseText);
      var err = body && body.error;
      if (err && typeof err === "object" && err.message) {
        msg += ": " + err.message;
      } else if (typeof err === "string") {
        msg += ": " + err;
      }
    } catch (e) {
      if (xhr.responseText) {
        msg += ": " + xhr.responseText.substring(0, 200);
      }
    }
    return msg;
  }

  // src/providers/commandcode/models.js
  var STATIC_COMMANDCODE_MODELS = [
    "deepseek/deepseek-v4.1-flash",
    "claude-sonnet-5-5",
    "claude-sonnet-5",
    "claude-sonnet-4-6",
    "claude-opus-5-5",
    "claude-opus-5",
    "claude-haiku-5-5",
    "gpt-6-astra",
    "gpt-6.1-sol",
    "gpt-6-sol",
    "gpt-6-luna",
    "gpt-5.6-sol",
    "gpt-5.4",
    "gpt-5.4-mini",
    "gpt-5.3-codex",
    "deepseek/deepseek-v4-pro",
    "deepseek/deepseek-v4-flash",
    "moonshotai/Kimi-K3.1-Pro",
    "moonshotai/Kimi-K3",
    "moonshotai/Kimi-K2.7-Code",
    "z-ai/glm-5.3-flash",
    "zai-org/GLM-5.3",
    "zai-org/GLM-5.2",
    "zai-org/GLM-5.1",
    "MiniMaxAI/MiniMax-M3",
    "minimax/minimax-m3.1-flash",
    "xiaomi/mimo-v2.6-pro",
    "xiaomi/mimo-v2.6-flash",
    "Qwen/Qwen3.8-Max",
    "Qwen/Qwen3.8-Flash",
    "Qwen/Qwen3.7-Plus",
    "google/gemini-4-argon",
    "google/gemini-3.8-flash",
    "xai/grok-4.7",
    "xai/grok-4.6",
    "mistral/mistral-large-4",
    "inclusionai/ling-3.1-flash",
    "stealth/glyph-cluster:free",
    "reflection/beam:free"
  ];
  function slugifyModelPart(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
  }
  function normalizeCommandCodeModelId(rawModel, knownIds) {
    var s = String(rawModel || "").trim();
    if (!s) return "";
    s = s.split("?")[0].split("#")[0];
    var isUrl = /^https?:\/\//i.test(s);
    if (isUrl) {
      s = s.replace(/\/+$/, "");
      s = s.substring(s.lastIndexOf("/") + 1);
    }
    s = s.replace(/^\/+|\/+$/g, "");
    if (!s) return "";
    if (!isUrl || !Array.isArray(knownIds) || knownIds.length === 0) return s;
    if (knownIds.indexOf(s) !== -1) return s;
    var wanted = slugifyModelPart(s);
    for (var i = 0; i < knownIds.length; i++) {
      var id = String(knownIds[i] || "");
      var modelPart = id.substring(id.lastIndexOf("/") + 1);
      if (modelPart && slugifyModelPart(modelPart) === wanted) return id;
    }
    return s;
  }
  function fetchCommandCodeModels(endpoint, apiKey, callback) {
    var settled = false;
    function done(err, models) {
      if (settled) return;
      settled = true;
      callback(err, models);
    }
    var xhr = new XMLHttpRequest();
    xhr.open("GET", commandCodeUrl(endpoint, "/models"));
    xhr.timeout = 2e4;
    if (apiKey && String(apiKey).trim()) {
      xhr.setRequestHeader("Authorization", "Bearer " + String(apiKey).trim());
    }
    xhr.ontimeout = function() {
      done("Command Code model fetch timed out", null);
    };
    xhr.onerror = function() {
      done("Command Code network error while fetching models", null);
    };
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200) {
        try {
          var body = JSON.parse(xhr.responseText);
          var raw = body.data || [];
          cacheCommandCodeModelRoutes(raw);
          var ids = [];
          for (var i = 0; i < raw.length; i++) {
            if (raw[i] && raw[i].id) ids.push(raw[i].id);
          }
          var preferred = DEFAULT_COMMANDCODE_MODEL;
          var preferredIndex = ids.indexOf(preferred);
          if (preferredIndex > 0) {
            ids.splice(preferredIndex, 1);
            ids.unshift(preferred);
          }
          if (ids.length > 0) {
            done(null, ids);
            return;
          }
          done("No models returned from Command Code", null);
        } catch (e) {
          done("Failed to parse Command Code models: " + e.message, null);
        }
      } else {
        done(formatCommandCodeHttpError(xhr, "Failed to fetch Command Code models"), null);
      }
    };
    xhr.send();
  }

  // src/providers/sse.js
  function dataPayload(line) {
    if (line.indexOf("data:") !== 0) return null;
    var rest = line.substring(5);
    if (rest.charAt(0) === " ") rest = rest.substring(1);
    return rest.trim();
  }
  function readDataLines(buffer, lastIndex, final) {
    var payloads = [];
    var index = lastIndex || 0;
    while (true) {
      var nl = buffer.indexOf("\n", index);
      if (nl === -1) break;
      var line = buffer.substring(index, nl).replace(/\r$/, "");
      index = nl + 1;
      var payload = dataPayload(line);
      if (payload) payloads.push(payload);
    }
    if (final && index < buffer.length) {
      var tail = buffer.substring(index).replace(/\r$/, "");
      var tailPayload = dataPayload(tail);
      if (tailPayload) payloads.push(tailPayload);
      index = buffer.length;
    }
    return { payloads, index };
  }

  // src/providers/commandcode/chat.js
  function sendCommandCodeChatStreaming(opts) {
    var url = commandCodeUrl(opts.endpoint, "/chat/completions");
    var apiKey = String(opts.apiKey || "").trim();
    var model = opts.model || "deepseek/deepseek-v4.1-flash";
    var temperature = opts.temperature !== void 0 ? opts.temperature : 0.7;
    var reasoningEffort = opts.reasoningEffort;
    var onChunk = opts.onChunk || function() {
    };
    var onComplete = opts.onComplete || function() {
    };
    var xhr = new XMLHttpRequest();
    var lastIndex = 0;
    var accumulatedText = "";
    var completeCalled = false;
    var droppedReasoningEffort = false;
    function sendRequest() {
      xhr.open("POST", url);
      xhr.timeout = 6e5;
      xhr.setRequestHeader("Content-Type", "application/json");
      if (apiKey) xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
      var payload = {
        model,
        messages: opts.messages || [],
        temperature,
        stream: true
      };
      if (!droppedReasoningEffort && reasoningEffort) {
        payload.reasoning_effort = reasoningEffort;
      }
      xhr.send(JSON.stringify(payload));
    }
    function processSSE(final) {
      var res = readDataLines(xhr.responseText, lastIndex, final);
      lastIndex = res.index;
      for (var i = 0; i < res.payloads.length; i++) {
        var dataStr = res.payloads[i];
        if (dataStr === "[DONE]") continue;
        try {
          var parsed = JSON.parse(dataStr);
          if (parsed.error && parsed.error.message) {
            finish(parsed.error.message);
            return;
          }
          var choice = parsed.choices && parsed.choices[0];
          if (!choice) continue;
          var delta = choice.delta;
          var content = delta && delta.content;
          if (typeof content === "string" && content.length > 0) {
            accumulatedText += content;
            onChunk(content, accumulatedText);
          }
        } catch (e) {
        }
      }
    }
    function finish(err) {
      if (completeCalled) return;
      completeCalled = true;
      if (err) {
        onComplete(accumulatedText, err);
        return;
      }
      if (accumulatedText.length > 0) {
        onComplete(accumulatedText, null);
        return;
      }
      var body = String(xhr.responseText || "");
      if (/^\s*data:/m.test(body)) {
        onComplete("", "Empty response from Command Code");
        return;
      }
      try {
        var obj = JSON.parse(xhr.responseText);
        var content = obj.choices && obj.choices[0] && obj.choices[0].message && obj.choices[0].message.content;
        if (typeof content === "string" && content.length > 0) {
          onComplete(content, null);
        } else {
          onComplete("", "Empty response from Command Code");
        }
      } catch (e) {
        onComplete("", "Failed to parse Command Code response");
      }
    }
    xhr.ontimeout = function() {
      finish("Command Code request timed out");
    };
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 3) {
        processSSE(false);
      } else if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          processSSE(true);
          finish(null);
        } else if (!droppedReasoningEffort && reasoningEffort && isRetryableFieldError(xhr, /reasoning_effort/i)) {
          droppedReasoningEffort = true;
          lastIndex = 0;
          accumulatedText = "";
          sendRequest();
        } else {
          finish(formatCommandCodeHttpError(xhr, "Command Code chat"));
        }
      }
    };
    sendRequest();
    return {
      xhr,
      abort: function() {
        completeCalled = true;
        xhr.abort();
      }
    };
  }
  function completeCommandCodeChatOnce(opts, callback) {
    var url = commandCodeUrl(opts.endpoint, "/chat/completions");
    var apiKey = String(opts.apiKey || "").trim();
    var model = opts.model || "deepseek/deepseek-v4.1-flash";
    var temperature = opts.temperature !== void 0 ? opts.temperature : 0.5;
    var reasoningEffort = opts.reasoningEffort;
    var completed = false;
    function done(err, text) {
      if (completed) return;
      completed = true;
      callback(err, text);
    }
    var xhr = new XMLHttpRequest();
    var droppedReasoningEffort = false;
    function sendRequest() {
      xhr.open("POST", url);
      xhr.timeout = opts.timeout || 2e4;
      xhr.setRequestHeader("Content-Type", "application/json");
      if (apiKey) xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
      var payload = {
        model,
        messages: opts.messages || [],
        temperature,
        stream: false
      };
      if (!droppedReasoningEffort && reasoningEffort) {
        payload.reasoning_effort = reasoningEffort;
      }
      xhr.send(JSON.stringify(payload));
    }
    xhr.ontimeout = function() {
      done("Command Code request timed out", null);
    };
    xhr.onerror = function() {
      done("Command Code network error", null);
    };
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200) {
        try {
          var data = JSON.parse(xhr.responseText);
          var content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
          done(null, typeof content === "string" ? content : "");
        } catch (e) {
          done("Failed to parse Command Code response", null);
        }
      } else {
        if (!droppedReasoningEffort && reasoningEffort && isRetryableFieldError(xhr, /reasoning_effort/i)) {
          droppedReasoningEffort = true;
          sendRequest();
        } else {
          done(formatCommandCodeHttpError(xhr, "Command Code"), null);
        }
      }
    };
    sendRequest();
    return {
      xhr,
      abort: function() {
        completed = true;
        xhr.abort();
      }
    };
  }

  // src/providers/commandcode/messages.js
  function translateCommandCodeMessages(neutralMessages) {
    var systemText = "";
    var out = [];
    for (var i = 0; i < (neutralMessages || []).length; i++) {
      var m = neutralMessages[i];
      if (m.role === "system") {
        if (typeof m.content === "string" && m.content.length > 0) {
          systemText += (systemText.length > 0 ? "\n\n" : "") + m.content;
        }
      } else if (m.role === "assistant" || m.role === "user") {
        out.push({
          role: m.role,
          content: typeof m.content === "string" ? m.content : ""
        });
      }
    }
    return { system: systemText, messages: out };
  }
  function parseCommandCodeMessageSSE(buffer, lastIndex, final) {
    var res = readDataLines(buffer, lastIndex, final);
    var tokens = [];
    for (var i = 0; i < res.payloads.length; i++) {
      try {
        var obj = JSON.parse(res.payloads[i]);
        switch (obj.type) {
          case "content_block_delta":
            if (obj.delta && obj.delta.type === "text_delta" && typeof obj.delta.text === "string") {
              tokens.push({ content: obj.delta.text });
            }
            break;
          case "message_stop":
            tokens.push({ done: true });
            break;
          case "error":
            tokens.push({ error: obj.error && obj.error.message || "stream error" });
            break;
          default:
            break;
        }
      } catch (e) {
      }
    }
    return { tokens, newIndex: res.index };
  }
  function buildMessageBody(opts, stream, stage) {
    var translated = translateCommandCodeMessages(opts.messages || []);
    var effort = opts.reasoningEffort || "off";
    var body = {
      model: opts.model || "claude-sonnet-5-5",
      max_tokens: outputTokenBudget(opts.maxTokens || 16384, effortToThinkingBudget(effort)),
      messages: translated.messages,
      stream
    };
    if (translated.system) body.system = translated.system;
    var attempt = stage || 0;
    if (attempt === 0) {
      body.thinking = effort === "off" ? { type: "disabled" } : { type: "adaptive" };
    }
    if (effort !== "off" && attempt < 2) {
      body.output_config = { effort };
    }
    return body;
  }
  function extractMessageText(response) {
    var text = "";
    if (response && response.content && response.content.length) {
      for (var i = 0; i < response.content.length; i++) {
        var block = response.content[i];
        if (block.type === "text" && typeof block.text === "string") {
          text += block.text;
        }
      }
    }
    return text;
  }
  function sendCommandCodeMessagesStreaming(opts) {
    var url = commandCodeUrl(opts.endpoint, "/messages");
    var apiKey = String(opts.apiKey || "").trim();
    var onChunk = opts.onChunk || function() {
    };
    var onComplete = opts.onComplete || function() {
    };
    var xhr = new XMLHttpRequest();
    var lastParseIndex = 0;
    var accumulatedText = "";
    var streamError = null;
    var completeCalled = false;
    var effort = opts.reasoningEffort || "off";
    var maxAttempt = effort === "off" ? 1 : 2;
    var attempt = 0;
    function sendRequest() {
      xhr.open("POST", url);
      xhr.timeout = 6e5;
      xhr.setRequestHeader("Content-Type", "application/json");
      if (apiKey) xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
      xhr.send(JSON.stringify(buildMessageBody(opts, true, attempt)));
    }
    function processBuffer(final) {
      var res = parseCommandCodeMessageSSE(xhr.responseText, lastParseIndex, final);
      lastParseIndex = res.newIndex;
      for (var i = 0; i < res.tokens.length; i++) {
        var tok = res.tokens[i];
        if (tok.error) {
          streamError = tok.error;
          continue;
        }
        if (tok.content) {
          accumulatedText += tok.content;
          onChunk(tok.content, accumulatedText);
        }
      }
    }
    function finish(err) {
      if (completeCalled) return;
      completeCalled = true;
      if (err) {
        onComplete(accumulatedText, err);
        return;
      }
      if (accumulatedText.length > 0) {
        onComplete(accumulatedText, null);
        return;
      }
      var body = String(xhr.responseText || "");
      if (/^\s*data:/m.test(body)) {
        onComplete("", "Empty response from Command Code messages");
        return;
      }
      try {
        var text = extractMessageText(JSON.parse(xhr.responseText));
        if (text.length > 0) {
          onComplete(text, null);
        } else {
          onComplete("", "Empty response from Command Code messages");
        }
      } catch (e) {
        onComplete("", "Failed to parse Command Code messages response");
      }
    }
    xhr.ontimeout = function() {
      finish("Command Code messages request timed out");
    };
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 3) {
        processBuffer(false);
      } else if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          processBuffer(true);
          finish(streamError);
        } else if (attempt < maxAttempt && isRetryableFieldError(xhr, /thinking|output_config|effort/i)) {
          attempt++;
          lastParseIndex = 0;
          accumulatedText = "";
          streamError = null;
          sendRequest();
        } else {
          finish(formatCommandCodeHttpError(xhr, "Command Code messages"));
        }
      }
    };
    sendRequest();
    return {
      xhr,
      abort: function() {
        completeCalled = true;
        xhr.abort();
      }
    };
  }
  function completeCommandCodeMessagesOnce(opts, callback) {
    var url = commandCodeUrl(opts.endpoint, "/messages");
    var apiKey = String(opts.apiKey || "").trim();
    var completed = false;
    function done(err, text) {
      if (completed) return;
      completed = true;
      callback(err, text);
    }
    var xhr = new XMLHttpRequest();
    var effort = opts.reasoningEffort || "off";
    var maxAttempt = effort === "off" ? 1 : 2;
    var attempt = 0;
    function sendRequest() {
      xhr.open("POST", url);
      xhr.timeout = opts.timeout || 2e4;
      xhr.setRequestHeader("Content-Type", "application/json");
      if (apiKey) xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
      xhr.send(JSON.stringify(buildMessageBody(opts, false, attempt)));
    }
    xhr.ontimeout = function() {
      done("Command Code messages request timed out", null);
    };
    xhr.onerror = function() {
      done("Command Code network error", null);
    };
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200) {
        try {
          done(null, extractMessageText(JSON.parse(xhr.responseText)));
        } catch (e) {
          done("Failed to parse Command Code messages response", null);
        }
      } else {
        if (attempt < maxAttempt && isRetryableFieldError(xhr, /thinking|output_config|effort/i)) {
          attempt++;
          sendRequest();
        } else {
          done(formatCommandCodeHttpError(xhr, "Command Code messages"), null);
        }
      }
    };
    sendRequest();
    return {
      xhr,
      abort: function() {
        completed = true;
        xhr.abort();
      }
    };
  }

  // src/providers/commandcode/index.js
  function prepare(opts) {
    var o = Object.assign({}, opts || {});
    o.model = normalizeCommandCodeModelId(o.model, STATIC_COMMANDCODE_MODELS) || DEFAULT_COMMANDCODE_MODEL;
    o.endpoint = o.endpoint || COMMANDCODE_BASE;
    return o;
  }
  function sendCommandCodeStreaming(opts) {
    var o = prepare(opts);
    if (resolveCommandCodeProtocol(o.model) === "messages") {
      return sendCommandCodeMessagesStreaming(o);
    }
    return sendCommandCodeChatStreaming(o);
  }
  function completeCommandCodeOnce(opts, callback) {
    var o = prepare(opts);
    if (resolveCommandCodeProtocol(o.model) === "messages") {
      return completeCommandCodeMessagesOnce(o, callback);
    }
    return completeCommandCodeChatOnce(o, callback);
  }
  var CommandCodeAdapter = {
    id: "commandcode",
    name: "Command Code",
    STATIC_COMMANDCODE_MODELS,
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

  // src/providers/local/endpoint.js
  var DEFAULT_LOCAL_ENDPOINT = "http://localhost:11434/v1";
  var ENDPOINT_SUFFIX = /\/+(?:chat\/completions|completions|models)\/?$/i;
  function normalizeLocalEndpoint(raw) {
    var s = String(raw == null ? "" : raw).trim().split("?")[0].split("#")[0];
    if (!s) return DEFAULT_LOCAL_ENDPOINT;
    s = s.replace(/\/+$/, "").replace(ENDPOINT_SUFFIX, "").replace(/\/+$/, "");
    if (!/^https?:\/\//i.test(s)) s = "http://" + s;
    var m = s.match(/^([a-z]+:\/\/[^/]+)(\/.*)?$/i);
    if (!m) return DEFAULT_LOCAL_ENDPOINT;
    var host = m[1].replace(/^[a-z]+:\/\//i, "");
    if (!host || /:$/.test(host)) return DEFAULT_LOCAL_ENDPOINT;
    var path = m[2] || "";
    if (!path || path === "/") path = "/v1";
    var candidate = m[1] + path;
    try {
      new URL(candidate);
    } catch (e) {
      return DEFAULT_LOCAL_ENDPOINT;
    }
    return candidate;
  }
  function localUrl(endpoint, path) {
    return normalizeLocalEndpoint(endpoint) + path;
  }
  function describeLocalError(xhr, label) {
    if (xhr.status === 0) {
      return label + ": cannot reach the local server at " + String(xhr.__url || "the configured endpoint") + ". Is it running? Some servers also reject cross-origin requests \u2014 allow this page's origin (Ollama: set OLLAMA_ORIGINS).";
    }
    var msg = label + " (HTTP " + xhr.status + ")";
    try {
      var body = JSON.parse(xhr.responseText);
      var err = body && body.error;
      if (err && typeof err === "object" && err.message) msg += ": " + err.message;
      else if (typeof err === "string") msg += ": " + err;
    } catch (e) {
      if (xhr.responseText) msg += ": " + String(xhr.responseText).substring(0, 200);
    }
    return msg;
  }

  // src/providers/local/models.js
  var STATIC_LOCAL_MODELS = [];
  function normalizeLocalModelId(raw) {
    return String(raw == null ? "" : raw).trim().replace(/\/+$/, "");
  }
  function fetchLocalModels(endpoint, apiKey, callback) {
    var url = localUrl(endpoint, "/models");
    var key = String(apiKey || "").trim();
    var xhr = new XMLHttpRequest();
    var settled = false;
    function done(err, models) {
      if (settled) return;
      settled = true;
      callback(err, models);
    }
    xhr.open("GET", url);
    xhr.timeout = 2e4;
    xhr.__url = url;
    if (key) xhr.setRequestHeader("Authorization", "Bearer " + key);
    xhr.ontimeout = function() {
      done("Local model fetch timed out", null);
    };
    xhr.onerror = function() {
      done(describeLocalError({ status: 0, __url: url }, "Local model fetch"), null);
    };
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 0) return;
      if (xhr.status !== 200) {
        done(describeLocalError(xhr, "Local model fetch"), null);
        return;
      }
      var body;
      try {
        body = JSON.parse(xhr.responseText);
      } catch (e) {
        done("Failed to parse the local model list", null);
        return;
      }
      var data = body && body.data;
      if (!Array.isArray(data)) {
        done("Failed to parse the local model list", null);
        return;
      }
      var seen = {};
      var models = [];
      for (var i = 0; i < data.length; i++) {
        var id = data[i] && data[i].id;
        if (typeof id !== "string" || !id || seen[id]) continue;
        seen[id] = true;
        models.push(id);
      }
      models.sort();
      done(null, models);
    };
    xhr.send();
    return {
      xhr,
      abort: function() {
        settled = true;
        xhr.abort();
      }
    };
  }

  // src/providers/local/chat.js
  var MISSING_MODEL = "No local model selected. Open Settings \u2192 Providers \u2192 Local LLM, fetch models, and pick one.";
  function sendLocalStreaming(opts) {
    var url = localUrl(opts.endpoint, "/chat/completions");
    var apiKey = String(opts.apiKey || "").trim();
    var model = normalizeLocalModelId(opts.model);
    var temperature = opts.temperature !== void 0 ? opts.temperature : 0.7;
    var onChunk = opts.onChunk || function() {
    };
    var onComplete = opts.onComplete || function() {
    };
    if (!model) {
      onComplete("", MISSING_MODEL);
      return { abort: function() {
      } };
    }
    var xhr = new XMLHttpRequest();
    var lastIndex = 0;
    var accumulatedText = "";
    var completeCalled = false;
    function sendRequest() {
      xhr.open("POST", url);
      xhr.timeout = 6e5;
      xhr.__url = url;
      xhr.setRequestHeader("Content-Type", "application/json");
      if (apiKey) xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
      var payload = {
        model,
        messages: opts.messages || [],
        temperature,
        stream: true
      };
      var effort = localReasoningEffort(opts.reasoningEffort);
      if (typeof opts.maxTokens === "number" && isFinite(opts.maxTokens)) {
        payload.max_tokens = outputTokenBudget(opts.maxTokens, effortToThinkingBudget(opts.reasoningEffort));
      }
      if (effort) payload.reasoning_effort = effort;
      xhr.send(JSON.stringify(payload));
    }
    function processSSE(final) {
      var res = readDataLines(xhr.responseText, lastIndex, final);
      lastIndex = res.index;
      for (var i = 0; i < res.payloads.length; i++) {
        var dataStr = res.payloads[i];
        if (dataStr === "[DONE]") continue;
        try {
          var parsed = JSON.parse(dataStr);
          if (parsed.error && parsed.error.message) {
            finish(parsed.error.message);
            return;
          }
          var choice = parsed.choices && parsed.choices[0];
          if (!choice) continue;
          var delta = choice.delta;
          var content = delta && delta.content;
          if (typeof content === "string" && content.length > 0) {
            accumulatedText += content;
            onChunk(content, accumulatedText);
          }
        } catch (e) {
        }
      }
    }
    function finish(err) {
      if (completeCalled) return;
      completeCalled = true;
      if (err) {
        onComplete(accumulatedText, err);
        return;
      }
      if (accumulatedText.length > 0) {
        onComplete(accumulatedText, null);
        return;
      }
      var body = String(xhr.responseText || "");
      if (/^\s*data:/m.test(body)) {
        onComplete("", "Empty response from the local model");
        return;
      }
      try {
        var obj = JSON.parse(xhr.responseText);
        var content = obj.choices && obj.choices[0] && obj.choices[0].message && obj.choices[0].message.content;
        if (typeof content === "string" && content.length > 0) {
          onComplete(content, null);
        } else {
          onComplete("", "Empty response from the local model");
        }
      } catch (e) {
        onComplete("", "Failed to parse the local response");
      }
    }
    xhr.ontimeout = function() {
      finish("Local request timed out");
    };
    xhr.onerror = function() {
      finish(describeLocalError({ status: 0, __url: url }, "Local chat"));
    };
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 3) {
        processSSE(false);
      } else if (xhr.readyState === 4) {
        if (xhr.status === 0) return;
        if (xhr.status === 200) {
          processSSE(true);
          finish(null);
        } else {
          finish(describeLocalError(xhr, "Local chat"));
        }
      }
    };
    sendRequest();
    return {
      xhr,
      abort: function() {
        completeCalled = true;
        xhr.abort();
      }
    };
  }
  function completeLocalOnce(opts, callback) {
    var url = localUrl(opts.endpoint, "/chat/completions");
    var apiKey = String(opts.apiKey || "").trim();
    var model = normalizeLocalModelId(opts.model);
    var temperature = opts.temperature !== void 0 ? opts.temperature : 0.5;
    var completed = false;
    function done(err, text) {
      if (completed) return;
      completed = true;
      callback(err, text);
    }
    if (!model) {
      done(MISSING_MODEL, null);
      return { abort: function() {
      } };
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.timeout = opts.timeout || 2e4;
    xhr.__url = url;
    xhr.setRequestHeader("Content-Type", "application/json");
    if (apiKey) xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
    var payload = {
      model,
      messages: opts.messages || [],
      stream: false,
      max_tokens: opts.maxTokens !== void 0 ? opts.maxTokens : 180,
      temperature
    };
    var effort = localReasoningEffort(opts.reasoningEffort);
    if (effort) payload.reasoning_effort = effort;
    xhr.ontimeout = function() {
      done("Local request timed out", null);
    };
    xhr.onerror = function() {
      done(describeLocalError({ status: 0, __url: url }, "Local chat"), null);
    };
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 0) return;
      if (xhr.status !== 200) {
        done(describeLocalError(xhr, "Local chat"), null);
        return;
      }
      try {
        var obj = JSON.parse(xhr.responseText);
        var content = obj.choices && obj.choices[0] && obj.choices[0].message && obj.choices[0].message.content;
        done(null, typeof content === "string" ? content : "");
      } catch (e) {
        done("Failed to parse the local response", null);
      }
    };
    xhr.send(JSON.stringify(payload));
    return {
      xhr,
      abort: function() {
        completed = true;
        xhr.abort();
      }
    };
  }

  // src/providers/local/index.js
  var LocalAdapter = {
    id: "local",
    name: "Local LLM (OpenAI-compatible)",
    DEFAULT_LOCAL_ENDPOINT,
    STATIC_LOCAL_MODELS,
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

  // src/providers/adapter.js
  function isOpenCodeProvider(providerId) {
    return providerId === "opencode-zen" || providerId === "opencode-go";
  }
  function isTextArtEngine(engine) {
    return engine === "text-pixel" || engine === "text-svg" || engine === "text-auto";
  }

  // src/providers/registry.js
  var registry = {
    "agentplatform": AgentPlatformAdapter,
    "gemini": GeminiAdapter,
    "openrouter": OpenRouterAdapter,
    "commandcode": CommandCodeAdapter,
    "local": LocalAdapter
    // "opencode-zen": OpenCodeZenAdapter,
    // "opencode-go": OpenCodeGoAdapter
  };
  function getProvider(id) {
    return registry[id] || registry["agentplatform"];
  }
  function getProviderDisplayName(id) {
    var p = registry[id];
    if (p && p.name) return p.name;
    switch (id) {
      case "gemini":
        return "Google AI Studio (Gemini API)";
      case "agentplatform":
        return "Google Cloud Agent Platform (Vertex AI)";
      case "openrouter":
        return "OpenRouter";
      case "commandcode":
        return "Command Code";
      case "local":
        return "Local LLM (OpenAI-compatible)";
      case "opencode-zen":
        return "OpenCode Zen";
      case "opencode-go":
        return "OpenCode Go";
      default:
        return id || "Google Cloud Agent Platform (Vertex AI)";
    }
  }
  function hasValidCredentials(settings, providerId) {
    var p = normalizeProviderId(providerId || settings && settings.pageProvider || "agentplatform");
    var adapter = registry[p];
    var conf = resolveConfig(settings, p);
    var view = {
      apiKey: conf.apiKey,
      googleApiKey: conf.apiKey,
      openrouterApiKey: conf.apiKey,
      commandcodeApiKey: conf.apiKey,
      opencodeApiKey: conf.apiKey,
      localApiKey: conf.apiKey,
      endpoint: conf.endpoint,
      localEnabled: !!conf.localEnabled,
      googleProjectId: conf.geminiProjectId,
      vertexAuthType: conf.vertexAuthType
    };
    if (adapter && typeof adapter.hasCredentials === "function") {
      return adapter.hasCredentials(view);
    }
    return !!(conf.apiKey && String(conf.apiKey).trim().length > 0);
  }
  function getEffectiveImageProvider(settings, overrideRawImgProv, overridePageProv, overrideEngine) {
    var s = settings || {};
    var pageProv = normalizeProviderId(overridePageProv || s.pageProvider || "agentplatform");
    var engine = overrideEngine || s.imageEngine || "image-model";
    if (isTextArtEngine(engine)) return pageProv;
    var rawImg = overrideRawImgProv;
    if (rawImg === void 0 || rawImg === null || rawImg === "") rawImg = s.imageProvider || "";
    rawImg = normalizeProviderId(rawImg);
    if (!rawImg) {
      if (isRasterProvider(pageProv)) return pageProv;
      for (var i = 0; i < PROVIDER_CATALOG.length; i++) {
        var candidate = PROVIDER_CATALOG[i];
        if (candidate.raster && hasValidCredentials(s, candidate.id)) return candidate.id;
      }
      return "gemini";
    }
    if (rawImg === "same") return pageProv;
    return rawImg;
  }
  function resolveConfig(settings, providerId) {
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
      reasoningEffort: "off",
      sitePlanReasoningEffort: "off",
      sitePlanThinkingBudget: 0,
      geminiAuthMethod: p === "agentplatform" ? "agentplatform" : p,
      geminiLocation: "global",
      geminiProjectId: "",
      vertexAuthType: "apikey",
      localEnabled: false
    };
    if (p === "commandcode") {
      conf.apiKey = useAccount ? account && account.apiKey || "" : s.commandcodeApiKey || "";
      conf.endpoint = account && account.endpoint || providerById(p) && providerById(p).defaultEndpoint || "";
    } else if (p === "openrouter") {
      conf.apiKey = useAccount ? account && account.apiKey || "" : s.openrouterApiKey || "";
      conf.endpoint = "https://openrouter.ai/api/v1";
    } else if (p === "opencode-go" || p === "opencode-zen") {
      var fallbackEndpoint = p === "opencode-go" ? "https://opencode.ai/zen/go/v1" : "https://opencode.ai/zen/v1";
      if (useAccount) {
        conf.apiKey = account && account.apiKey || "";
        conf.endpoint = account && account.endpoint || fallbackEndpoint;
      } else {
        conf.apiKey = s.opencodeApiKey || "";
        conf.endpoint = p === "opencode-go" ? s.opencodeGoEndpoint || fallbackEndpoint : s.opencodeZenEndpoint || fallbackEndpoint;
      }
    } else if (p === "gemini") {
      conf.apiKey = useAccount ? account && account.apiKey || "" : s.googleApiKey || "";
      conf.endpoint = "https://generativelanguage.googleapis.com";
      conf.geminiAuthMethod = "gemini";
    } else if (p === "local") {
      conf.apiKey = useAccount ? account && account.apiKey || "" : "";
      conf.endpoint = account && account.endpoint || "http://localhost:11434/v1";
      conf.localEnabled = !!(account && account.enabled);
    } else {
      if (useAccount && account) {
        conf.apiKey = account.apiKey || "";
        conf.endpoint = account.endpoint || "https://aiplatform.googleapis.com";
        conf.geminiLocation = account.location || "global";
        conf.geminiProjectId = account.projectId || "";
        conf.vertexAuthType = account.vertexAuthType || "apikey";
      } else {
        conf.apiKey = s.googleApiKey || "";
        conf.endpoint = s.googleEndpoint || "https://aiplatform.googleapis.com";
        conf.geminiLocation = s.googleLocation || "global";
        conf.geminiProjectId = s.googleProjectId || "";
        conf.vertexAuthType = s.vertexAuthType || "apikey";
      }
      conf.geminiAuthMethod = "agentplatform";
    }
    conf.reasoningEffort = normalizeReasoningEffort(account && account.reasoningEffort);
    conf.sitePlanReasoningEffort = normalizeReasoningEffort(account && account.sitePlanReasoningEffort);
    if (p === "agentplatform" || p === "gemini") {
      conf.thinkingBudget = effortToThinkingBudget(conf.reasoningEffort);
      conf.sitePlanThinkingBudget = effortToThinkingBudget(conf.sitePlanReasoningEffort);
    }
    return conf;
  }

  // src/data/fallback-memes.js
  var ERA_FALLBACK_MEMES = {
    pre90s: [
      "BBS",
      "ARPANET",
      "Floppy Disk",
      "Usenet",
      "Modem 1200 baud",
      "CRT Terminal",
      "MS-DOS",
      "Commodore 64",
      "ASCII Art",
      "Mainframe"
    ],
    "1990s": [
      "Netscape",
      "Dial-up",
      "Y2K Bug",
      "GeoCities",
      "AOL Messenger",
      "Windows 95",
      "Tamagotchi",
      "CD-ROM",
      "Cyber",
      "Dot-com"
    ],
    "2000s": [
      "iPod",
      "Broadband",
      "Web 2.0",
      "MySpace",
      "Macromedia Flash",
      "Blogging",
      "Google",
      "WiFi",
      "Digital Cameras",
      "Wikipedia"
    ],
    modern: [
      "Smartphone",
      "Social Media",
      "Cloud",
      "Memes",
      "Streaming",
      "App Store",
      "Selfie",
      "Hashtag",
      "Bitcoin",
      "4G LTE"
    ],
    future: [
      "Neural Link",
      "Quantum Computing",
      "Holo-Web",
      "Mars Colony",
      "Synthetic Biology",
      "Orbital Solar",
      "Fusion Power",
      "Cybernetics",
      "AGI",
      "Zero-G"
    ]
  };

  // src/prompts/memes-prompt.js
  function buildDayMemesPrompt(dateStr, timelineDivergence) {
    var era = getEraInfo(dateStr);
    var isAlt = (timelineDivergence || 0) >= 50;
    var systemPrompt = "Date " + era.formattedLong + " (" + dateStr + "). Reply with exactly 10 distinct 1-2 word keywords across news, culture, tech, slang, music, and fashion of that day. " + (isAlt ? "Timeline is " + timelineDivergence + "% alternate history: mix in period-plausible what-ifs. " : "") + "Comma-separated only. No numbering or commentary.";
    var userPrompt = dateStr;
    return {
      systemPrompt,
      userPrompt
    };
  }
  function parseMemeList(rawText) {
    if (!rawText) return [];
    var cleaned = String(rawText).replace(/```(?:json|txt)?/gi, "").replace(/```/g, "").trim();
    var items = cleaned.split(/[\n,;]+/);
    var list = [];
    var seen = {};
    for (var i = 0; i < items.length; i++) {
      var w = items[i].trim().replace(/^[0-9]+[.)\-:\s]+/g, "").replace(/^["'\[\s]+|["'\]\s]+$/g, "").replace(/\s+/g, " ").trim();
      if (!w || w.length > 40 || w.indexOf(":") !== -1 || /^(here are|certainly|sure|below|list of|10 words)/i.test(w)) {
        continue;
      }
      var lower = w.toLowerCase();
      if (!seen[lower]) {
        seen[lower] = true;
        list.push(w);
      }
      if (list.length >= 10) break;
    }
    return list;
  }

  // src/features/memes.js
  var STORAGE_KEY_MEMES = "browser_of_dreams_memes_v1";
  function loadMemeCache() {
    try {
      if (typeof localStorage === "undefined") return {};
      var raw = localStorage.getItem(STORAGE_KEY_MEMES);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }
  function saveMemeCache(cache) {
    try {
      if (typeof localStorage === "undefined") return;
      localStorage.setItem(STORAGE_KEY_MEMES, JSON.stringify(cache));
    } catch (e) {
    }
  }
  function getFallbackMemes(dateStr) {
    var era = getEraInfo(dateStr);
    return (ERA_FALLBACK_MEMES[era.eraKey] || ERA_FALLBACK_MEMES["2000s"]).slice();
  }
  var DayMemesEngine = {
    STORAGE_KEY: STORAGE_KEY_MEMES,
    getFallbackMemes,
    loadCache: loadMemeCache,
    saveCache: saveMemeCache,
    buildPrompt: buildDayMemesPrompt,
    parseMemeList
  };
  var memeCache = loadMemeCache();
  var inFlightMemeFetches = {};
  var activeMemeRequest = null;
  function getCachedMemesForDate(dateStr) {
    return memeCache && memeCache[dateStr] ? memeCache[dateStr].slice() : null;
  }
  function setCachedMemesForDate(dateStr, memes) {
    memeCache[dateStr] = memes;
    saveMemeCache(memeCache);
  }
  function clearMemeCache() {
    memeCache = {};
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(STORAGE_KEY_MEMES);
      }
    } catch (e) {
    }
  }
  function fetchDayMemesFromModel(opts, callback) {
    var d = opts.date || "1999-12-31";
    var timelineDivergence = opts.timelineDivergence || 0;
    var providerAdapter = opts.providerAdapter;
    var providerConfig = opts.providerConfig || {};
    var hasCredentials = opts.hasCredentials;
    var onStart = opts.onStart || function() {
    };
    var onUIUpdate = opts.onUIUpdate || function() {
    };
    var cached = getCachedMemesForDate(d);
    if (cached) {
      onUIUpdate(cached, d);
      if (callback) callback(cached);
      return;
    }
    if (inFlightMemeFetches[d]) {
      if (callback) inFlightMemeFetches[d].push(callback);
      return;
    }
    inFlightMemeFetches[d] = callback ? [callback] : [];
    if (!hasCredentials) {
      var fb = getFallbackMemes(d);
      setCachedMemesForDate(d, fb);
      var cbs0 = inFlightMemeFetches[d] || [];
      delete inFlightMemeFetches[d];
      onUIUpdate(fb, d);
      for (var i0 = 0; i0 < cbs0.length; i0++) {
        try {
          cbs0[i0](fb);
        } catch (e) {
        }
      }
      return;
    }
    onStart();
    var promptBundle = buildDayMemesPrompt(d, timelineDivergence);
    var messages = [
      { role: "system", content: promptBundle.systemPrompt },
      { role: "user", content: promptBundle.userPrompt }
    ];
    var req = {
      ...providerConfig,
      messages,
      maxTokens: 180,
      temperature: 0.5,
      reasoningEffort: "off"
    };
    activeMemeRequest = providerAdapter.completeOnce(req, function(err, finalText) {
      activeMemeRequest = null;
      var parsed = parseMemeList(finalText);
      var results = parsed && parsed.length >= 3 ? parsed : getFallbackMemes(d);
      setCachedMemesForDate(d, results);
      var pending = inFlightMemeFetches[d] || [];
      delete inFlightMemeFetches[d];
      onUIUpdate(results, d);
      for (var ip = 0; ip < pending.length; ip++) {
        try {
          pending[ip](results);
        } catch (e) {
        }
      }
    });
  }

  // src/prompts/text-art-prompt.js
  function resolveTextArtStyleMode(imageEngine, year) {
    var y = parseInt(year, 10) || 2001;
    if (imageEngine === "text-pixel") return "pixel";
    if (imageEngine === "text-svg") return "svg";
    if (imageEngine === "text-auto") return y <= 1999 ? "pixel" : "svg";
    return "image-model";
  }
  function computePixelGridDimensions(width, height, role, aspectRatio) {
    var r = String(role || "photo").toLowerCase();
    var w = parseInt(width, 10) || (r === "ad" ? 468 : r === "icon" ? 32 : 360);
    var h = parseInt(height, 10) || (r === "ad" ? 60 : r === "icon" ? 32 : 240);
    var ratio = w / Math.max(1, h);
    if (r === "icon") {
      return { width: w, height: h, gridW: 16, gridH: 16 };
    }
    if (r === "ad" && ratio >= 2.4) {
      return {
        width: w,
        height: h,
        gridW: 117,
        gridH: 15
      };
    }
    if (aspectRatio === "16:9" || ratio >= 1.65) {
      return { width: w, height: h, gridW: 56, gridH: 32 };
    }
    if (aspectRatio === "9:16" || ratio <= 0.62) {
      return { width: w, height: h, gridW: 27, gridH: 48 };
    }
    if (aspectRatio === "3:4" || ratio <= 0.82) {
      return { width: w, height: h, gridW: 36, gridH: 48 };
    }
    if (aspectRatio === "1:1" || ratio >= 0.92 && ratio <= 1.08) {
      return { width: w, height: h, gridW: 40, gridH: 40 };
    }
    return {
      width: w,
      height: h,
      gridW: 48,
      gridH: Math.max(20, Math.min(48, Math.round(48 / ratio)))
    };
  }
  function buildTextArtPrompts(opts) {
    var o = opts || {};
    var role = String(o.role || "photo").toLowerCase();
    var era = getEraInfo(o.dateStr || "1999-12-31");
    var timelineProfile = getTimelineDivergenceProfile(o.timelineDivergence, era.year);
    var styleMode = o.styleMode || resolveTextArtStyleMode(o.imageEngine || "text-pixel", era.year);
    var dims = computePixelGridDimensions(o.width, o.height, role, o.aspectRatio);
    var roleNoun = role === "ad" ? "web ad" : role === "icon" ? "icon" : role === "graphic" ? "graphic" : "editorial";
    var promptText = String(o.prompt || (role === "ad" ? "Vintage web banner advertisement" : role === "icon" ? "Small interface icon glyph" : role === "graphic" ? "Page logo or decorative emblem" : "Editorial illustration")).trim();
    if (styleMode === "pixel") {
      var sysPixel = "Output one integer-grid pixel-art <svg>. No markdown.";
      var userPixel = era.year + " pixel " + roleNoun + ". " + promptText + "\n" + timelineProfile.imageDirective + '\nOpen with <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + dims.gridW + " " + dims.gridH + '" width="' + dims.width + '" height="' + dims.height + '" shape-rendering="crispEdges">.\nOnly integer <rect> on a ' + dims.gridW + "\xD7" + dims.gridH + " grid. No circle, ellipse, smooth path, or rx/ry.\n12\u201316 VGA colors, dithered ground, outlined subject, 1px highlights. Spoof brands only. Unnamed generic people. No real logos or public figures. " + (role === "ad" ? 'Bevel (light top/left, dark bottom/right), icon left, Courier headline font-size="' + Math.max(4, Math.round(dims.gridH * 0.34)) + '", [CLICK HERE] button right.' : role === "icon" ? "Single centered glyph on a flat single-color background. No text, no border, no bevel." : role === "graphic" ? "Flat emblem: one geometric mark plus a short Courier wordmark. Solid fills, no scenery." : "Foreground, midground, and light.") + "\nOnly the <svg>.";
      return {
        styleMode: "pixel",
        dims,
        systemPrompt: sysPixel,
        userPrompt: userPixel
      };
    }
    var sysSvg = "Output one era-faithful <svg>. No markdown.";
    var userSvg = era.year + " vector " + roleNoun + ". " + promptText + "\n" + timelineProfile.imageDirective + '\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + dims.width + " " + dims.height + '" width="' + dims.width + '" height="' + dims.height + '">. defs gradients, layered path/polygon/rect/circle. Text stays inside the viewBox. Spoof brands only. Unnamed generic people. No real logos or public figures. ' + (role === "ad" ? "Logo, headline, subcopy, border, and a CLICK HERE / SHOP NOW / LEARN MORE button." : role === "icon" ? "Single centered glyph, flat fills, no text, transparent background." : role === "graphic" ? "Flat geometric mark with a short wordmark, solid fills, transparent background, no photographic detail." : "Depth, light, and period detail.") + " Only the <svg>.";
    return {
      styleMode: "svg",
      dims,
      systemPrompt: sysSvg,
      userPrompt: userSvg
    };
  }

  // src/providers/opencode/route.js
  function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0;
      var v = c === "x" ? r : r & 3 | 8;
      return v.toString(16);
    });
  }
  var activeOpenCodeSessionId = uuidv4();
  function productFromEndpoint(endpoint, providerName) {
    var name = String(providerName || "").toLowerCase();
    if (name.indexOf("opencode") !== -1 && name.indexOf("go") !== -1)
      return "go";
    var ep = String(endpoint || "").toLowerCase();
    if (ep.indexOf("/zen/go") !== -1 || ep.indexOf("/inference/go") !== -1)
      return "go";
    return "zen";
  }
  function npmToProtocol(npm) {
    if (npm === "@ai-sdk/openai")
      return "responses";
    if (npm === "@ai-sdk/anthropic")
      return "anthropic";
    if (npm === "@ai-sdk/google")
      return "gemini";
    return "chat";
  }
  function resolveProtocol(product, modelId, overlay) {
    var id = String(modelId || "").toLowerCase();
    var prod = product === "go" ? "go" : "zen";
    if (!id)
      return "chat";
    if (overlay) {
      if (overlay[id])
        return overlay[id];
      if (modelId && overlay[modelId])
        return overlay[modelId];
    }
    if (id.indexOf("gpt-") === 0 || id.indexOf("grok-") === 0 || id.indexOf("muse-spark-") === 0)
      return "responses";
    if (id.indexOf("gemini-") === 0)
      return "gemini";
    if (id.indexOf("claude-") === 0)
      return "anthropic";
    if (id.indexOf("qwen3.") === 0)
      return "anthropic";
    if (prod === "go" && id.indexOf("minimax-") === 0)
      return "anthropic";
    return "chat";
  }
  var OpenCodeRoute = {
    productFromEndpoint,
    npmToProtocol,
    resolveProtocol
  };
  function sessionHeaders(opts) {
    var h = {};
    if (opts && opts.extraHeaders) {
      for (var k in opts.extraHeaders) {
        if (Object.prototype.hasOwnProperty.call(opts.extraHeaders, k)) {
          h[k] = opts.extraHeaders[k];
        }
      }
    }
    h["x-opencode-session"] = opts && opts.sessionId ? opts.sessionId : activeOpenCodeSessionId || uuidv4();
    return h;
  }
  function formatOpenCodeHttpError(xhr, label) {
    if (xhr.status === 0) {
      return label + " blocked by browser CORS policy (HTTP 0). OpenCode (opencode.ai) does not include Access-Control-Allow-Origin headers on inference POST endpoints. Please enable a CORS-unblocking browser extension (e.g. 'Allow CORS: Access-Control-Allow-Origin' or 'CORS Unblock') for https://opencode.ai.";
    }
    var msg = label + " error (HTTP " + xhr.status + ")";
    try {
      var errBody = JSON.parse(xhr.responseText);
      if (errBody && errBody.error && errBody.error.message) {
        msg += ": " + errBody.error.message;
      }
    } catch (e) {
      if (xhr.responseText) {
        msg += ": " + xhr.responseText.substring(0, 200);
      }
    }
    return msg;
  }

  // src/providers/opencode/models.js
  var STATIC_OPENCODE_ZEN_MODELS = [
    "claude-sonnet-4-6",
    "claude-sonnet-4-5",
    "claude-opus-4-6",
    "claude-haiku-4-5",
    "gemini-3.8-flash",
    "gemini-3-flash",
    "gemini-3.1-pro",
    "gpt-5.4",
    "gpt-5.4-mini",
    "gpt-5.3-codex",
    "qwen3.8-flash",
    "qwen3.6-plus",
    "glm-5.3-flash",
    "glm-5.1",
    "kimi-k2.5",
    "minimax-m2.5",
    "big-pickle",
    "glm-5.3-flash-free",
    "deepseek-v4.1-flash-free",
    "mimo-v2.6-flash-free"
  ];
  var STATIC_OPENCODE_GO_MODELS = [
    "qwen3.8-flash",
    "qwen3.8-max",
    "qwen3.7-plus",
    "qwen3.6-plus",
    "glm-5.3-flash",
    "glm-5.3",
    "glm-5.2",
    "glm-5.1",
    "kimi-k3",
    "kimi-k2.7-code",
    "kimi-k2.6",
    "minimax-m3",
    "minimax-m3.1-flash",
    "minimax-m2.7",
    "minimax-m2.5",
    "deepseek-v4.1-flash",
    "deepseek-v4-pro",
    "mimo-v2.6-flash",
    "mimo-v2.5-pro",
    "gpt-6-luna",
    "gpt-5.6-luna",
    "grok-4.7",
    "claude-haiku-5-5",
    "gemini-4-argon",
    "beam-free"
  ];
  function fetchOpenCodeModels(endpoint, apiKey, callback) {
    var base = String(endpoint || "https://opencode.ai/zen/v1").replace(/\/+$/, "");
    var url = /\/v1$/.test(base) ? base + "/models" : base + "/v1/models";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.timeout = 15e3;
    if (apiKey && apiKey.trim().length > 0) {
      xhr.setRequestHeader("Authorization", "Bearer " + apiKey.trim());
    }
    xhr.ontimeout = function() {
      callback("OpenCode model fetch timed out", null);
    };
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200) {
        try {
          var body = JSON.parse(xhr.responseText);
          var raw = body.data || [];
          var ids = [];
          for (var i = 0; i < raw.length; i++) {
            if (raw[i] && raw[i].id && raw[i].id !== "test") {
              ids.push(raw[i].id);
            }
          }
          if (ids.length > 0) {
            callback(null, ids);
            return;
          }
          callback("No models returned from OpenCode endpoint", null);
        } catch (e) {
          callback("Failed to parse OpenCode models: " + e.message, null);
        }
      } else {
        callback(formatOpenCodeHttpError(xhr, "Failed to fetch OpenCode models"), null);
      }
    };
    xhr.send();
  }

  // src/providers/opencode/protocols/responses.js
  function translateResponsesMessages(neutralMessages) {
    var input = [];
    for (var i = 0; i < (neutralMessages || []).length; i++) {
      var m = neutralMessages[i];
      if (m.role === "system") {
        if (typeof m.content === "string" && m.content.length > 0) {
          input.push({
            type: "message",
            role: "system",
            content: [{ type: "input_text", text: m.content }]
          });
        }
      } else if (m.role === "assistant") {
        if (typeof m.content === "string" && m.content.length > 0) {
          input.push({
            type: "message",
            role: "assistant",
            content: [{ type: "output_text", text: m.content }]
          });
        }
      } else if (m.role === "user") {
        input.push({
          type: "message",
          role: "user",
          content: [{ type: "input_text", text: typeof m.content === "string" ? m.content : "" }]
        });
      }
    }
    return { input };
  }
  function parseResponsesSSEChunks(buffer, lastIndex) {
    var tokens = [];
    var searchFrom = lastIndex;
    while (true) {
      var nlPos = buffer.indexOf("\n", searchFrom);
      if (nlPos === -1) break;
      var line = buffer.substring(searchFrom, nlPos).replace(/\r$/, "");
      searchFrom = nlPos + 1;
      if (line === "" || line.substring(0, 6) !== "data: ") continue;
      var payload = line.substring(6);
      if (payload === "[DONE]") {
        tokens.push({ done: true });
        continue;
      }
      try {
        var obj = JSON.parse(payload);
        switch (obj.type) {
          case "response.output_text.delta":
            if (typeof obj.delta === "string" && obj.delta.length > 0) {
              tokens.push({ content: obj.delta });
            }
            break;
          case "response.output_text.done":
            if (typeof obj.text === "string" && obj.text.length > 0) {
              tokens.push({ content_full: obj.text });
            }
            break;
          case "response.completed":
            tokens.push({ done: true });
            break;
          case "response.failed":
          case "error":
          case "response.error":
            tokens.push({ error: obj.error && obj.error.message || obj.message || "stream error" });
            break;
          default:
            break;
        }
      } catch (e) {
      }
    }
    return { tokens, newIndex: searchFrom };
  }
  function sendOpenAIResponsesStreaming(opts) {
    var endpoint = (opts.endpoint || "https://opencode.ai/zen/v1").replace(/\/+$/, "");
    var apiKey = opts.apiKey || "";
    var model = opts.model || "gpt-5.4";
    var temperature = opts.temperature !== void 0 ? opts.temperature : 0.7;
    var tempFloat = temperature > 2 ? temperature / 100 : temperature;
    var maxTokens = opts.maxTokens || 16384;
    var onChunk = opts.onChunk || function() {
    };
    var onComplete = opts.onComplete || function() {
    };
    var translated = translateResponsesMessages(opts.messages || []);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint + "/responses");
    xhr.timeout = 6e5;
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept", "text/event-stream");
    if (apiKey) {
      xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
    }
    if (opts && opts.extraHeaders) {
      for (var h in opts.extraHeaders) {
        if (Object.prototype.hasOwnProperty.call(opts.extraHeaders, h)) {
          xhr.setRequestHeader(h, opts.extraHeaders[h]);
        }
      }
    }
    var lastParseIndex = 0;
    var accumulatedText = "";
    var streamError = null;
    var completeCalled = false;
    function processBuffer() {
      var res = parseResponsesSSEChunks(xhr.responseText, lastParseIndex);
      lastParseIndex = res.newIndex;
      for (var i = 0; i < res.tokens.length; i++) {
        var tok = res.tokens[i];
        if (tok.error) {
          streamError = tok.error;
          continue;
        }
        if (tok.content) {
          accumulatedText += tok.content;
          onChunk(tok.content, accumulatedText);
        } else if (typeof tok.content_full === "string" && accumulatedText.length === 0) {
          accumulatedText = tok.content_full;
          onChunk(tok.content_full, accumulatedText);
        }
      }
    }
    function finish(err) {
      if (completeCalled) return;
      completeCalled = true;
      if (err) {
        onComplete(accumulatedText, err);
        return;
      }
      if (accumulatedText.length > 0) {
        onComplete(accumulatedText, null);
        return;
      }
      try {
        var response = JSON.parse(xhr.responseText);
        var text = "";
        if (response.output && response.output.length) {
          for (var i = 0; i < response.output.length; i++) {
            var item = response.output[i];
            if (item.type === "message" && item.content) {
              for (var ci = 0; ci < item.content.length; ci++) {
                var c = item.content[ci];
                if (c.type === "output_text" && typeof c.text === "string") {
                  text += c.text;
                }
              }
            }
          }
        }
        if (text.length > 0) {
          onComplete(text, null);
        } else {
          onComplete("", "Empty response from Responses endpoint");
        }
      } catch (e) {
        onComplete("", "Failed to parse Responses payload: " + e.message);
      }
    }
    xhr.ontimeout = function() {
      finish("OpenAI Responses request timed out");
    };
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 3) {
        processBuffer();
      } else if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          processBuffer();
          finish(streamError);
        } else {
          finish(formatOpenCodeHttpError(xhr, "OpenCode Responses"));
        }
      }
    };
    xhr.send(JSON.stringify({
      model,
      input: translated.input,
      temperature: tempFloat,
      max_output_tokens: maxTokens,
      stream: true
    }));
    return {
      xhr,
      abort: function() {
        completeCalled = true;
        xhr.abort();
      }
    };
  }

  // src/providers/opencode/protocols/anthropic.js
  function translateAnthropicMessages(neutralMessages) {
    var systemText = "";
    var out = [];
    for (var i = 0; i < (neutralMessages || []).length; i++) {
      var m = neutralMessages[i];
      if (m.role === "system") {
        if (typeof m.content === "string" && m.content.length > 0) {
          systemText += (systemText.length > 0 ? "\n\n" : "") + m.content;
        }
      } else if (m.role === "assistant" || m.role === "user") {
        out.push({
          role: m.role,
          content: typeof m.content === "string" ? m.content : ""
        });
      }
    }
    return { system: systemText, messages: out };
  }
  function parseAnthropicSSEChunks(buffer, lastIndex) {
    var tokens = [];
    var searchFrom = lastIndex;
    while (true) {
      var nlPos = buffer.indexOf("\n", searchFrom);
      if (nlPos === -1) break;
      var line = buffer.substring(searchFrom, nlPos).replace(/\r$/, "");
      searchFrom = nlPos + 1;
      if (line === "" || line.substring(0, 6) !== "data: ") continue;
      var payload = line.substring(6);
      try {
        var obj = JSON.parse(payload);
        switch (obj.type) {
          case "content_block_delta":
            if (obj.delta && obj.delta.type === "text_delta" && typeof obj.delta.text === "string") {
              tokens.push({ content: obj.delta.text });
            }
            break;
          case "message_stop":
            tokens.push({ done: true });
            break;
          case "error":
            tokens.push({ error: obj.error && obj.error.message || "stream error" });
            break;
          default:
            break;
        }
      } catch (e) {
      }
    }
    return { tokens, newIndex: searchFrom };
  }
  function sendAnthropicStreaming(opts) {
    var base = (opts.endpoint || "https://opencode.ai/zen/v1").replace(/\/+$/, "");
    var url = /\/v1$/.test(base) ? base + "/messages" : base + "/v1/messages";
    var apiKey = opts.apiKey || "";
    var model = opts.model || "claude-sonnet-4-6";
    var temperature = opts.temperature !== void 0 ? opts.temperature : 0.7;
    var tempFloat = temperature > 2 ? temperature / 100 : temperature;
    var maxTokens = opts.maxTokens || 16384;
    var onChunk = opts.onChunk || function() {
    };
    var onComplete = opts.onComplete || function() {
    };
    var translated = translateAnthropicMessages(opts.messages || []);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.timeout = 6e5;
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("anthropic-version", "2023-06-01");
    xhr.setRequestHeader("anthropic-dangerous-direct-browser-access", "true");
    if (apiKey) {
      xhr.setRequestHeader("x-api-key", apiKey);
      if (opts && opts.opencodeAuth) {
        xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
      }
    }
    if (opts && opts.extraHeaders) {
      for (var h in opts.extraHeaders) {
        if (Object.prototype.hasOwnProperty.call(opts.extraHeaders, h)) {
          xhr.setRequestHeader(h, opts.extraHeaders[h]);
        }
      }
    }
    var lastParseIndex = 0;
    var accumulatedText = "";
    var streamError = null;
    var completeCalled = false;
    function processBuffer() {
      var res = parseAnthropicSSEChunks(xhr.responseText, lastParseIndex);
      lastParseIndex = res.newIndex;
      for (var i = 0; i < res.tokens.length; i++) {
        var tok = res.tokens[i];
        if (tok.error) {
          streamError = tok.error;
          continue;
        }
        if (tok.content) {
          accumulatedText += tok.content;
          onChunk(tok.content, accumulatedText);
        }
      }
    }
    function finish(err) {
      if (completeCalled) return;
      completeCalled = true;
      if (err) {
        onComplete(accumulatedText, err);
        return;
      }
      if (accumulatedText.length > 0) {
        onComplete(accumulatedText, null);
        return;
      }
      try {
        var response = JSON.parse(xhr.responseText);
        var text = "";
        if (response.content && response.content.length) {
          for (var i = 0; i < response.content.length; i++) {
            var b = response.content[i];
            if (b.type === "text" && typeof b.text === "string") {
              text += b.text;
            }
          }
        }
        if (text.length > 0) {
          onComplete(text, null);
        } else {
          onComplete("", "Empty response from Anthropic messages endpoint");
        }
      } catch (e) {
        onComplete("", "Failed to parse Anthropic response: " + e.message);
      }
    }
    xhr.ontimeout = function() {
      finish("Anthropic messages request timed out");
    };
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 3) {
        processBuffer();
      } else if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          processBuffer();
          finish(streamError);
        } else {
          finish(formatOpenCodeHttpError(xhr, "OpenCode Messages"));
        }
      }
    };
    var body = {
      model,
      max_tokens: maxTokens,
      messages: translated.messages,
      temperature: tempFloat,
      stream: true
    };
    if (opts && opts.opencodeAuth) {
      body.thinking = { type: "disabled" };
    }
    if (translated.system && translated.system.length > 0) {
      body.system = translated.system;
    }
    xhr.send(JSON.stringify(body));
    return {
      xhr,
      abort: function() {
        completeCalled = true;
        xhr.abort();
      }
    };
  }

  // src/providers/opencode/protocols/chat.js
  function sendOpenAIChatStreaming(opts) {
    var base = (opts.endpoint || "https://opencode.ai/zen/v1").replace(/\/+$/, "");
    var url = /\/v1$/.test(base) ? base + "/chat/completions" : base + "/v1/chat/completions";
    var apiKey = opts.apiKey || "";
    var model = opts.model || "glm-5.3-flash";
    var temperature = opts.temperature !== void 0 ? opts.temperature : 0.7;
    var tempFloat = temperature > 2 ? temperature / 100 : temperature;
    var maxTokens = opts.maxTokens || 16384;
    var onChunk = opts.onChunk || function() {
    };
    var onComplete = opts.onComplete || function() {
    };
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.timeout = 6e5;
    xhr.setRequestHeader("Content-Type", "application/json");
    if (apiKey) {
      xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
    }
    if (opts && opts.extraHeaders) {
      for (var h in opts.extraHeaders) {
        if (Object.prototype.hasOwnProperty.call(opts.extraHeaders, h)) {
          xhr.setRequestHeader(h, opts.extraHeaders[h]);
        }
      }
    }
    var lastIndex = 0;
    var accumulatedText = "";
    var completeCalled = false;
    function processSSE() {
      var buffer = xhr.responseText;
      while (true) {
        var nl = buffer.indexOf("\n", lastIndex);
        if (nl === -1) break;
        var line = buffer.substring(lastIndex, nl).replace(/\r$/, "");
        lastIndex = nl + 1;
        if (!line || line.indexOf("data: ") !== 0) continue;
        var dataStr = line.substring(6).trim();
        if (dataStr === "[DONE]") continue;
        try {
          var parsed = JSON.parse(dataStr);
          if (parsed.error && parsed.error.message) {
            finish(parsed.error.message);
            return;
          }
          var choice = parsed.choices && parsed.choices[0];
          if (!choice) continue;
          var delta = choice.delta;
          var content = delta && delta.content;
          var reasoning = delta && (delta.reasoning || delta.reasoning_content);
          if (typeof content === "string" && content.length > 0) {
            accumulatedText += content;
            onChunk(content, accumulatedText);
          } else if (typeof reasoning === "string" && reasoning.length > 0) {
            if (!accumulatedText.startsWith("<!-- [Reasoning]")) {
              accumulatedText = "<!-- [Reasoning]\n" + reasoning;
            } else {
              accumulatedText += reasoning;
            }
            onChunk(reasoning, accumulatedText);
          }
        } catch (e) {
        }
      }
    }
    function finish(err) {
      if (completeCalled) return;
      completeCalled = true;
      if (err) {
        onComplete(accumulatedText, err);
        return;
      }
      if (accumulatedText.length > 0) {
        onComplete(accumulatedText, null);
        return;
      }
      try {
        var obj = JSON.parse(xhr.responseText);
        var content = obj.choices && obj.choices[0] && obj.choices[0].message && obj.choices[0].message.content;
        if (typeof content === "string" && content.length > 0) {
          onComplete(content, null);
        } else {
          onComplete("", "Empty response from OpenCode Chat Completions");
        }
      } catch (e) {
        onComplete("", "Failed to parse OpenCode Chat Completions response");
      }
    }
    xhr.ontimeout = function() {
      finish("OpenCode Chat Completions request timed out");
    };
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 3) {
        processSSE();
      } else if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          processSSE();
          finish(null);
        } else {
          finish(formatOpenCodeHttpError(xhr, "OpenCode Chat"));
        }
      }
    };
    xhr.send(JSON.stringify({
      model,
      messages: opts.messages || [],
      temperature: tempFloat,
      max_tokens: maxTokens,
      stream: true,
      reasoning_effort: "none"
    }));
    return {
      xhr,
      abort: function() {
        completeCalled = true;
        xhr.abort();
      }
    };
  }

  // src/providers/opencode/chat.js
  function sendOpenCodeStreaming(opts) {
    var product = OpenCodeRoute.productFromEndpoint(opts && opts.endpoint, opts && opts.providerName);
    var protocol = OpenCodeRoute.resolveProtocol(product, opts && opts.model, opts && opts.overlay);
    var o = {};
    if (opts) {
      for (var k in opts) {
        if (Object.prototype.hasOwnProperty.call(opts, k)) {
          o[k] = opts[k];
        }
      }
    }
    o.opencodeAuth = true;
    o.extraHeaders = sessionHeaders(o);
    if (protocol === "responses") {
      o.usesResponsesAPI = true;
      return sendOpenAIResponsesStreaming(o);
    }
    if (protocol === "anthropic") {
      return sendAnthropicStreaming(o);
    }
    if (protocol === "gemini") {
      return sendGeminiStreaming(o);
    }
    return sendOpenAIChatStreaming(o);
  }
  function completeOpenCodeOnce(opts, callback) {
    var maxTokens = opts.maxTokens !== void 0 ? opts.maxTokens : 180;
    var temp = opts.temperature !== void 0 ? opts.temperature : 0.5;
    var isGo = opts.provider === "opencode-go";
    var ocEndpoint = isGo ? opts.endpoint || opts.opencodeGoEndpoint || "https://opencode.ai/zen/go/v1" : opts.endpoint || opts.opencodeZenEndpoint || "https://opencode.ai/zen/v1";
    var base = ocEndpoint.replace(/\/+$/, "");
    var url = /\/v1$/.test(base) ? base + "/chat/completions" : base + "/v1/chat/completions";
    var completed = false;
    function done(err, text) {
      if (completed) return;
      completed = true;
      callback(err, text);
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.timeout = opts.timeout || 8e3;
    xhr.setRequestHeader("Content-Type", "application/json");
    var apiKey = (opts.apiKey || opts.opencodeApiKey || "").trim();
    if (apiKey) {
      xhr.setRequestHeader("Authorization", "Bearer " + apiKey);
    }
    xhr.ontimeout = function() {
      done("OpenCode request timed out", null);
    };
    xhr.onerror = function() {
      done("OpenCode network error", null);
    };
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200) {
        try {
          var data = JSON.parse(xhr.responseText);
          var content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
          done(null, content || "");
        } catch (e) {
          done("Failed to parse OpenCode response", null);
        }
      } else {
        done("OpenCode HTTP " + xhr.status, null);
      }
    };
    xhr.send(JSON.stringify({
      model: opts.model || (isGo ? "qwen3.8-flash" : "claude-sonnet-4-6"),
      messages: opts.messages || [],
      stream: false,
      max_tokens: maxTokens,
      temperature: temp,
      reasoning_effort: "none"
    }));
    return {
      xhr,
      abort: function() {
        completed = true;
        xhr.abort();
      }
    };
  }

  // src/providers/opencode/index.js
  var OpenCodeZenAdapter = {
    id: "opencode-zen",
    name: "OpenCode Zen",
    STATIC_OPENCODE_ZEN_MODELS,
    STATIC_OPENCODE_GO_MODELS,
    presets: [
      { id: "opencode-zen", name: "OpenCode Zen", url: "https://opencode.ai/zen/v1" },
      { id: "opencode-go", name: "OpenCode Go", url: "https://opencode.ai/zen/go/v1" }
    ],
    sessionHeaders,
    fetchModels: fetchOpenCodeModels,
    sendStreaming: sendOpenCodeStreaming,
    streamChat: sendOpenCodeStreaming,
    completeOnce: completeOpenCodeOnce,
    sendResponsesStreaming: sendOpenAIResponsesStreaming,
    sendAnthropicStreaming,
    sendChatStreaming: sendOpenAIChatStreaming,
    parseResponsesSSEChunks,
    parseAnthropicSSEChunks,
    translateResponsesMessages,
    translateAnthropicMessages,
    hasCredentials: function(config) {
      return !!(config && config.opencodeApiKey && config.opencodeApiKey.trim().length > 0);
    }
  };
  var OpenCodeGoAdapter = {
    ...OpenCodeZenAdapter,
    id: "opencode-go",
    name: "OpenCode Go"
  };
  var OpenCodeAdapter = OpenCodeZenAdapter;

  // src/features/text-art.js
  function pixelGridJsonToSvg(spec, width, height) {
    if (!spec || typeof spec !== "object") return null;
    var rows = Array.isArray(spec.rows) ? spec.rows : Array.isArray(spec.grid) ? spec.grid : null;
    var palette = spec.palette || spec.colors || {};
    if (!rows || rows.length === 0) return null;
    var gridH = rows.length;
    var gridW = 0;
    for (var r = 0; r < gridH; r++) {
      var rowStr = String(rows[r] || "");
      if (rowStr.length > gridW) gridW = rowStr.length;
    }
    if (gridW === 0) return null;
    var w = parseInt(width, 10) || gridW * 8;
    var h = parseInt(height, 10) || gridH * 8;
    var rects = [];
    var bgFill = palette["."] || palette[" "] || spec.background || "#1a1c2c";
    rects.push('<rect x="0" y="0" width="' + gridW + '" height="' + gridH + '" fill="' + bgFill + '"/>');
    for (var y = 0; y < gridH; y++) {
      var line = String(rows[y] || "");
      var x = 0;
      while (x < line.length) {
        var ch = line.charAt(x);
        var run = 1;
        while (x + run < line.length && line.charAt(x + run) === ch) {
          run++;
        }
        var color = palette[ch];
        if (color && color !== "transparent" && color !== "none" && color !== bgFill) {
          rects.push('<rect x="' + x + '" y="' + y + '" width="' + run + '" height="1" fill="' + color + '"/>');
        }
        x += run;
      }
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + gridW + " " + gridH + '" width="' + w + '" height="' + h + '" shape-rendering="crispEdges" style="image-rendering:pixelated;image-rendering:crisp-edges;">' + rects.join("") + "</svg>";
  }
  function buildFallbackArtSvg(opts) {
    var o = opts || {};
    var role = String(o.role || "photo").toLowerCase();
    var styleMode = o.styleMode || "pixel";
    var dims = computePixelGridDimensions(o.width, o.height, role, o.aspectRatio);
    var safePrompt = String(o.prompt || (role === "ad" ? "Sponsored Banner" : "Dream Graphic")).replace(/[<>&"']/g, " ").replace(/\s+/g, " ").trim();
    var shortTitle = safePrompt.substring(0, 34);
    var subTitle = safePrompt.substring(34, 72);
    if (role === "icon") {
      var iw = parseInt(dims.width, 10) || 32;
      var ih = parseInt(dims.height, 10) || 32;
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="' + iw + '" height="' + ih + '"><rect x="6" y="6" width="20" height="20" rx="5" fill="#334155"/><circle cx="16" cy="16" r="5" fill="#e2e8f0"/></svg>';
    }
    if (role === "graphic") {
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + dims.width + " " + dims.height + '" width="' + dims.width + '" height="' + dims.height + '"><rect x="4" y="4" width="' + Math.max(8, dims.width - 8) + '" height="' + Math.max(8, dims.height - 8) + '" rx="6" fill="#1e293b" stroke="#64748b" stroke-width="2"/><circle cx="' + Math.round(dims.width * 0.3) + '" cy="' + Math.round(dims.height * 0.5) + '" r="' + Math.max(4, Math.round(Math.min(dims.width, dims.height) * 0.18)) + '" fill="#93c5fd"/><text x="' + Math.round(dims.width * 0.56) + '" y="' + Math.round(dims.height * 0.54) + '" text-anchor="middle" dominant-baseline="middle" font-family="Verdana, sans-serif" font-weight="bold" font-size="' + Math.max(7, Math.round(dims.height * 0.16)) + '" fill="#ffffff">' + shortTitle.substring(0, 16) + "</text></svg>";
    }
    if (styleMode === "pixel") {
      var gw = dims.gridW;
      var gh = dims.gridH;
      var sky = role === "ad" ? "#000080" : "#1d2b53";
      var mid = role === "ad" ? "#008080" : "#29adff";
      var accent = role === "ad" ? "#ffcc00" : "#ff004d";
      var ground = role === "ad" ? "#002244" : "#008751";
      var dither = [];
      for (var dx = 2; dx < gw - 2; dx += 2) {
        dither.push('<rect x="' + dx + '" y="' + Math.floor(gh * 0.45) + '" width="1" height="1" fill="' + mid + '"/>');
      }
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + gw + " " + gh + '" width="' + dims.width + '" height="' + dims.height + '" shape-rendering="crispEdges" style="image-rendering:pixelated;image-rendering:crisp-edges;"><rect x="0" y="0" width="' + gw + '" height="' + gh + '" fill="' + sky + '"/><rect x="0" y="' + Math.floor(gh * 0.48) + '" width="' + gw + '" height="' + (gh - Math.floor(gh * 0.48)) + '" fill="' + ground + '"/>' + dither.join("") + '<rect x="0" y="0" width="' + gw + '" height="1" fill="#ffffff"/><rect x="0" y="0" width="1" height="' + gh + '" fill="#ffffff"/><rect x="0" y="' + (gh - 1) + '" width="' + gw + '" height="1" fill="#000000"/><rect x="' + (gw - 1) + '" y="0" width="1" height="' + gh + '" fill="#000000"/><rect x="3" y="3" width="6" height="6" fill="' + accent + '"/><rect x="4" y="4" width="4" height="4" fill="#fff1e8"/><text x="' + Math.floor(gw * 0.52) + '" y="' + Math.floor(gh * 0.56) + `" text-anchor="middle" dominant-baseline="middle" font-family="'Courier New', monospace" font-weight="bold" font-size="` + Math.max(4, Math.min(7, Math.floor(gh * 0.28))) + '" fill="#fff1e8">' + shortTitle.substring(0, 22) + "</text></svg>";
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + dims.width + " " + dims.height + '" width="' + dims.width + '" height="' + dims.height + '"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="' + (role === "ad" ? "#1e3a8a" : "#0f172a") + '"/><stop offset="100%" stop-color="' + (role === "ad" ? "#0284c7" : "#334155") + '"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#bg)" stroke="#94a3b8" stroke-width="2"/><text x="50%" y="44%" text-anchor="middle" dominant-baseline="middle" font-family="Verdana, sans-serif" font-weight="bold" font-size="13" fill="#ffffff">' + shortTitle + "</text>" + (subTitle ? '<text x="50%" y="68%" text-anchor="middle" dominant-baseline="middle" font-family="Verdana, sans-serif" font-size="10" fill="#e2e8f0">' + subTitle + "</text>" : "") + "</svg>";
  }
  function sanitizeExtractedSvg(svgStr, opts) {
    var o = opts || {};
    var styleMode = o.styleMode || "svg";
    var dims = computePixelGridDimensions(o.width, o.height, o.role, o.aspectRatio);
    var s = String(svgStr || "").trim();
    var scriptRe = new RegExp("<script[\\s\\S]*?<\\/script>", "gi");
    s = s.replace(scriptRe, "");
    s = s.replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*')/gi, "");
    var openMatch = /^<svg([^>]*)>/i.exec(s);
    if (!openMatch) return null;
    var attrs = openMatch[1] || "";
    if (!/\bxmlns\s*=/i.test(attrs)) {
      attrs += ' xmlns="http://www.w3.org/2000/svg"';
    }
    if (!/\bviewBox\s*=/i.test(attrs)) {
      if (styleMode === "pixel") {
        attrs += ' viewBox="0 0 ' + dims.gridW + " " + dims.gridH + '"';
      } else {
        attrs += ' viewBox="0 0 ' + dims.width + " " + dims.height + '"';
      }
    }
    if (!/\bwidth\s*=/i.test(attrs)) {
      attrs += ' width="' + dims.width + '"';
    }
    if (!/\bheight\s*=/i.test(attrs)) {
      attrs += ' height="' + dims.height + '"';
    }
    if (styleMode === "pixel") {
      if (!/\bshape-rendering\s*=/i.test(attrs)) {
        attrs += ' shape-rendering="crispEdges"';
      }
      if (!/\bimage-rendering\s*:/i.test(attrs)) {
        attrs += ' style="image-rendering:pixelated;image-rendering:crisp-edges;"';
      }
    }
    return "<svg" + attrs + ">" + s.substring(openMatch[0].length);
  }
  function extractOrBuildSvgDataUrl(rawText, opts) {
    var o = opts || {};
    var text = String(rawText || "");
    text = text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
    text = text.replace(/^```(?:svg|xml|html|json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
    var svgMatch = /<svg[\s\S]*?<\/svg\s*>/i.exec(text);
    if (!svgMatch && /<svg[\s\S]*/i.test(text)) {
      var partial = /<svg[\s\S]*/i.exec(text)[0];
      svgMatch = [partial + "</svg>"];
    }
    var finalSvg = null;
    if (svgMatch && svgMatch[0]) {
      finalSvg = sanitizeExtractedSvg(svgMatch[0], o);
    }
    if (!finalSvg) {
      var jsonMatch = /\{[\s\S]*\}/.exec(text);
      if (jsonMatch) {
        try {
          var parsed = JSON.parse(jsonMatch[0]);
          finalSvg = pixelGridJsonToSvg(parsed, o.width, o.height);
        } catch (e) {
        }
      }
    }
    if (!finalSvg) {
      finalSvg = buildFallbackArtSvg(o);
    }
    return {
      svg: finalSvg,
      isPixelArt: o.styleMode === "pixel",
      dataUrl: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(finalSvg)
    };
  }
  function generateTextModelArt(opts, callback) {
    var o = opts || {};
    var era = getEraInfo(o.dateStr || "1999-12-31");
    var styleMode = o.styleMode || resolveTextArtStyleMode(o.imageEngine || "text-pixel", era.year);
    var promptBundle = buildTextArtPrompts({
      prompt: o.prompt,
      role: o.role,
      width: o.width,
      height: o.height,
      aspectRatio: o.aspectRatio,
      dateStr: o.dateStr,
      timelineDivergence: o.timelineDivergence,
      styleMode
    });
    var messages = [
      { role: "system", content: promptBundle.systemPrompt },
      { role: "user", content: promptBundle.userPrompt }
    ];
    var provider = o.provider || "agentplatform";
    var model = String(o.model || "").trim();
    function onDone(finalText, err) {
      if (err && (!finalText || !finalText.trim())) {
        callback(err, null);
        return;
      }
      var built = extractOrBuildSvgDataUrl(finalText, {
        prompt: o.prompt,
        role: o.role,
        width: promptBundle.dims.width,
        height: promptBundle.dims.height,
        aspectRatio: o.aspectRatio,
        styleMode
      });
      callback(null, built.dataUrl, built);
    }
    if (provider === "local") {
      return LocalAdapter.sendStreaming({
        endpoint: o.endpoint,
        apiKey: (o.localApiKey || o.apiKey || "").trim(),
        model: model || "",
        temperature: 0.65,
        maxTokens: 8192,
        messages,
        onChunk: o.onChunk || function() {
        },
        onComplete: onDone
      });
    }
    if (provider === "openrouter") {
      return OpenRouterAdapter.sendStreaming({
        apiKey: (o.openrouterApiKey || o.apiKey || "").trim(),
        model: model || "google/gemini-2.5-flash",
        temperature: 0.65,
        messages,
        onChunk: o.onChunk || function() {
        },
        onComplete: onDone
      });
    }
    if (provider === "commandcode") {
      return CommandCodeAdapter.sendStreaming({
        endpoint: o.endpoint,
        apiKey: (o.commandcodeApiKey || o.apiKey || "").trim(),
        model: model || "deepseek/deepseek-v4.1-flash",
        temperature: 0.65,
        reasoningEffort: o.reasoningEffort,
        maxTokens: 8192,
        messages,
        onChunk: o.onChunk || function() {
        },
        onComplete: onDone
      });
    }
    if (provider === "opencode-zen" || provider === "opencode-go") {
      var isGo = provider === "opencode-go";
      return OpenCodeAdapter.sendStreaming({
        endpoint: o.endpoint || (isGo ? "https://opencode.ai/zen/go/v1" : "https://opencode.ai/zen/v1"),
        providerName: isGo ? "OpenCode Go" : "OpenCode Zen",
        apiKey: (o.opencodeApiKey || o.apiKey || "").trim(),
        model: model || (isGo ? "qwen3.8-flash" : "claude-sonnet-4-6"),
        temperature: 0.65,
        maxTokens: 4096,
        messages,
        onChunk: o.onChunk || function() {
        },
        onComplete: onDone
      });
    }
    return GeminiAdapter.sendStreaming({
      endpoint: provider === "agentplatform" ? o.endpoint || "https://aiplatform.googleapis.com" : "https://generativelanguage.googleapis.com",
      apiKey: (o.googleApiKey || o.apiKey || "").trim(),
      model: model || "gemini-3.8-flash",
      temperature: 65,
      maxTokens: 4096,
      thinkingBudget: 0,
      geminiAuthMethod: provider === "aistudio" ? "aistudio" : "agentplatform",
      geminiVertexAuthType: o.geminiVertexAuthType || "apikey",
      geminiProjectId: o.geminiProjectId || "",
      geminiLocation: o.geminiLocation || "global",
      messages,
      onChunk: o.onChunk || function() {
      },
      onComplete: onDone
    });
  }
  var TextArtGenerator = {
    isTextArtEngine,
    resolveStyleMode: resolveTextArtStyleMode,
    computePixelGridDimensions,
    buildTextArtPrompts,
    pixelGridJsonToSvg,
    buildFallbackArtSvg,
    sanitizeExtractedSvg,
    extractOrBuildSvgDataUrl,
    generateArt: generateTextModelArt
  };

  // src/features/images.js
  function resolveSlotImageEngine(settings, slot) {
    var engine = settings && settings.imageEngine || "image-model";
    if (engine !== "hybrid") return engine;
    var role = String(slot && slot.role || "photo").toLowerCase();
    return role === "ad" || role === "icon" || role === "graphic" ? "text-svg" : "image-model";
  }
  function slotCountsTowardImageCap(settings, slot) {
    return resolveSlotImageEngine(settings, slot) === "image-model";
  }
  function resolveActiveTextArtModel(settings, imgProvider) {
    var s = settings || state.settings;
    if (imgProvider === "commandcode") {
      return s.pageModel || "deepseek/deepseek-v4.1-flash";
    }
    if (imgProvider === "local") {
      return s.pageModel || "";
    }
    var rawModel = String(s.imageModel || "").trim();
    var isDedicatedImageId = /(-image|^imagen|flux|stable-diffusion|recraft|seedream)/i.test(rawModel);
    if (!rawModel || rawModel === "same-as-page" || isDedicatedImageId) {
      if (imgProvider === s.pageProvider) {
        return s.pageModel || "gemini-3.8-flash";
      }
      if (imgProvider === "openrouter") return "google/gemini-2.5-flash";
      if (imgProvider === "opencode-go") return "qwen3.8-flash";
      if (imgProvider === "opencode-zen") return "claude-sonnet-4-6";
      return "gemini-3.8-flash";
    }
    return rawModel;
  }
  function downscaleImageToSlot(dataUrl, targetWidth, targetHeight, callback) {
    if (typeof Image === "undefined" || typeof document === "undefined" || !dataUrl) {
      return callback(null, dataUrl);
    }
    if (String(dataUrl).startsWith("data:image/svg+xml")) {
      return callback(null, dataUrl);
    }
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function() {
      try {
        var w = parseInt(targetWidth, 10);
        var h = parseInt(targetHeight, 10);
        var naturalW = img.naturalWidth || img.width;
        var naturalH = img.naturalHeight || img.height;
        if (!w || !h || w <= 0 || h <= 0) {
          var maxDim = 640;
          if (naturalW > maxDim || naturalH > maxDim) {
            if (naturalW >= naturalH) {
              w = maxDim;
              h = Math.round(naturalH / naturalW * maxDim);
            } else {
              h = maxDim;
              w = Math.round(naturalW / naturalH * maxDim);
            }
          } else {
            w = naturalW;
            h = naturalH;
          }
        }
        if (naturalW <= w && naturalH <= h) {
          return callback(null, dataUrl);
        }
        var canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext("2d");
        var scale = Math.max(w / naturalW, h / naturalH);
        var scaledW = naturalW * scale;
        var scaledH = naturalH * scale;
        var offsetX = (w - scaledW) / 2;
        var offsetY = (h - scaledH) / 2;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, offsetX, offsetY, scaledW, scaledH);
        var resized = canvas.toDataURL("image/jpeg", 0.85);
        callback(null, resized);
      } catch (e) {
        console.warn("Could not downscale image on canvas:", e);
        callback(null, dataUrl);
      }
    };
    img.onerror = function() {
      callback(null, dataUrl);
    };
    img.src = dataUrl;
  }
  function patchCachedHtmlWithImage(targetUrl, targetDate, slotId, dataUrl, prompt, engine) {
    var url = targetUrl || getCurrentEntry2() && getCurrentEntry2().url || state.currentNavigationUrl;
    var dateStr = targetDate || getCurrentEntry2() && getCurrentEntry2().date || state.currentNavigationDate;
    if (!url || !slotId) return;
    var cacheKey = makeCacheKey(url, dateStr, state.settings.timelineDivergence);
    if (state.pageCache[cacheKey]) {
      state.pageCache[cacheKey].slotImages = state.pageCache[cacheKey].slotImages || {};
      state.pageCache[cacheKey].slotImages[slotId] = {
        dataUrl,
        prompt: prompt || "",
        url,
        date: dateStr,
        engine: String(engine || ""),
        timestamp: Date.now()
      };
      savePageCache(state.pageCache);
    }
  }
  function generateSingleSlotImage(slot, dateStr, postToIframe3, onDone) {
    var settings = state.settings;
    var targetUrl = slot.targetUrl || state.currentNavigationUrl || getCurrentEntry2() && getCurrentEntry2().url;
    var targetDate = dateStr || slot.targetDate || state.currentNavigationDate || getCurrentEntry2() && getCurrentEntry2().date;
    var reqEpoch = slot.epoch !== void 0 ? slot.epoch : state.navigationEpoch;
    var activeEngine = resolveSlotImageEngine(settings, slot);
    var imgProvider = getEffectiveImageProvider(settings, settings.imageProvider, settings.pageProvider, activeEngine);
    if (!hasValidCredentials(settings, imgProvider)) {
      if (targetUrl === state.currentNavigationUrl) {
        postToIframe3({
          type: "DREAM_IMAGE_STATUS",
          slotId: slot.slotId,
          statusText: "\u26A0\uFE0F No API Key"
        });
      }
      if (onDone) onDone();
      return;
    }
    var era = getEraInfo(targetDate);
    var timelineProfile = getTimelineDivergenceProfile(settings.timelineDivergence, era.year);
    var styleMode = TextArtGenerator.resolveStyleMode(activeEngine, era.year);
    var isPixel = styleMode === "pixel";
    var activeModelId = isTextArtEngine(activeEngine) ? resolveActiveTextArtModel(settings, imgProvider) : settings.imageModel || "gemini-3.1-flash-image";
    var parts = String(targetDate || "1999-12-31").split("-");
    var mm = parts[1] ? parseInt(parts[1], 10) < 10 ? "0" + parseInt(parts[1], 10) : parts[1] : "01";
    var dd = parts[2] ? parseInt(parts[2], 10) < 10 ? "0" + parseInt(parts[2], 10) : parts[2] : "01";
    var yyyy = parts[0] || "2001";
    var formattedDateUs = mm + "/" + dd + "/" + yyyy;
    var basePrompt = slot.prompt || "";
    var dateTag = "[Date: " + formattedDateUs + " (" + era.formattedLong + ")]";
    if (!basePrompt.includes(formattedDateUs)) {
      basePrompt = dateTag + " " + basePrompt;
    }
    var fullPrompt = basePrompt + " " + era.year + " " + (slot.role === "ad" ? "web ad." : slot.role === "icon" ? "icon." : slot.role === "graphic" ? "graphic." : "editorial photo.") + " " + timelineProfile.imageDirective + " Spoof brands only. Unnamed generic people. No real logos or public figures.";
    var promptCacheKey = imgProvider + "__" + activeEngine + "__" + activeModelId + "__" + timelineProfile.tierKey + "__" + fullPrompt;
    if (slot.forceRegenerate) {
      delete state.imageMemoryCache[promptCacheKey];
    }
    if (!slot.forceRegenerate && state.imageMemoryCache[promptCacheKey]) {
      var cachedData = state.imageMemoryCache[promptCacheKey];
      patchCachedHtmlWithImage(targetUrl, targetDate, slot.slotId, cachedData, slot.prompt, activeEngine);
      if (targetUrl === state.currentNavigationUrl) {
        postToIframe3({
          type: "DREAM_IMAGE_READY",
          slotId: slot.slotId,
          dataUrl: cachedData,
          isPixelArt: isPixel
        });
      }
      if (onDone) onDone();
      return;
    }
    if (targetUrl === state.currentNavigationUrl) {
      postToIframe3({
        type: "DREAM_IMAGE_STATUS",
        slotId: slot.slotId,
        statusText: styleMode === "pixel" ? "\u{1F47E} Drawing Pixel Art..." : styleMode === "svg" ? "\u2728 Drawing Vector SVG..." : "\u23F3 Generating..."
      });
    }
    function handleResult(err, rawDataUrl) {
      if (err || !rawDataUrl) {
        finalizeImage(err, null);
        return;
      }
      downscaleImageToSlot(rawDataUrl, slot.width, slot.height, function(_resizeErr, finalDataUrl) {
        finalizeImage(null, finalDataUrl || rawDataUrl);
      });
    }
    function finalizeImage(err, dataUrl) {
      var isCurrent = targetUrl === state.currentNavigationUrl;
      if (!err && dataUrl) {
        state.imageMemoryCache[promptCacheKey] = dataUrl;
        patchCachedHtmlWithImage(targetUrl, targetDate, slot.slotId, dataUrl, slot.prompt, activeEngine);
        if (targetUrl) {
          saveDomainImage({
            domain: extractDomain(targetUrl),
            date: targetDate,
            divergence: settings.timelineDivergence,
            role: slot.role,
            width: slot.width,
            height: slot.height,
            aspectRatio: slot.aspectRatio,
            prompt: slot.prompt,
            alt: slot.alt,
            engine: activeEngine,
            dataUrl
          });
        }
        if (Array.isArray(state.activeImageSlots)) {
          for (var a = 0; a < state.activeImageSlots.length; a++) {
            var other = state.activeImageSlots[a];
            if (other.slotId !== slot.slotId && !other.alreadyLoaded && resolveSlotImageEngine(settings, other) === activeEngine) {
              var matchPrompt = other.prompt && slot.prompt && other.prompt.trim() === slot.prompt.trim();
              var matchReuse = other.reuse && (other.reuse === slot.reuse || other.reuse === slot.prompt || other.reuse === slot.label);
              if (matchPrompt || matchReuse) {
                other.alreadyLoaded = true;
                other.inFlight = false;
                patchCachedHtmlWithImage(targetUrl, targetDate, other.slotId, dataUrl, slot.prompt, activeEngine);
                if (isCurrent) {
                  postToIframe3({
                    type: "DREAM_IMAGE_READY",
                    slotId: other.slotId,
                    dataUrl,
                    isPixelArt: isPixel
                  });
                }
              }
            }
          }
        }
        if (isCurrent) {
          postToIframe3({
            type: "DREAM_IMAGE_READY",
            slotId: slot.slotId,
            dataUrl,
            isPixelArt: isPixel
          });
        }
      } else {
        if (isCurrent) {
          postToIframe3({
            type: "DREAM_IMAGE_STATUS",
            slotId: slot.slotId,
            statusText: "\u26A0\uFE0F Retry Image"
          });
        }
        if (err) console.warn("Browser of Dreams image generation error:", err);
      }
      if (onDone) onDone();
    }
    var rawSlotAspect = slot.aspectRatio || slot.dataDreamAspect || "";
    var normalizedAspect = normalizeSupportedAspectRatio(rawSlotAspect, slot.width, slot.height, imgProvider);
    var imgConf = resolveConfig(settings, imgProvider);
    if (isTextArtEngine(activeEngine)) {
      TextArtGenerator.generateArt({
        provider: imgProvider,
        model: activeModelId,
        imageEngine: activeEngine,
        styleMode,
        prompt: fullPrompt,
        role: slot.role || "photo",
        width: slot.width || (slot.role === "ad" ? 468 : 360),
        height: slot.height || (slot.role === "ad" ? 60 : 240),
        aspectRatio: normalizedAspect,
        dateStr: targetDate,
        timelineDivergence: settings.timelineDivergence,
        endpoint: imgConf.endpoint,
        apiKey: imgConf.apiKey,
        googleApiKey: imgConf.apiKey,
        opencodeApiKey: imgConf.apiKey,
        commandcodeApiKey: imgConf.apiKey,
        reasoningEffort: imgConf.reasoningEffort,
        openrouterApiKey: imgConf.apiKey,
        geminiVertexAuthType: imgConf.vertexAuthType,
        geminiProjectId: imgConf.geminiProjectId,
        geminiLocation: imgConf.geminiLocation || "global"
      }, handleResult);
      return;
    }
    if (imgProvider === "openrouter") {
      OpenRouterAdapter.generateImage({
        apiKey: String(imgConf.apiKey || "").trim(),
        model: settings.imageModel.trim() || "openai/gpt-image-2.5-flare",
        prompt: fullPrompt,
        aspectRatio: normalizedAspect,
        width: slot.width,
        height: slot.height
      }, handleResult);
    } else {
      GeminiAdapter.generateImage({
        endpoint: imgConf.endpoint,
        apiKey: String(imgConf.apiKey || "").trim(),
        model: settings.imageModel.trim() || "gemini-2.5-flash-image",
        prompt: fullPrompt,
        aspectRatio: normalizedAspect,
        width: slot.width,
        height: slot.height,
        geminiAuthMethod: imgProvider,
        geminiVertexAuthType: imgConf.vertexAuthType,
        geminiProjectId: imgConf.geminiProjectId,
        geminiLocation: imgConf.geminiLocation || "global"
      }, handleResult);
    }
  }
  function handleDiscoveredImages(slots, dateStr, postToIframe3, onStatusUpdate, pageUrl) {
    var curEntry = getCurrentEntry2();
    var targetUrl = pageUrl || curEntry && curEntry.url || state.currentNavigationUrl;
    var targetDate = dateStr || curEntry && curEntry.date || state.currentNavigationDate;
    var currentEpoch = state.navigationEpoch;
    if (!Array.isArray(state.activeImageSlots)) {
      state.activeImageSlots = [];
    }
    var incoming = slots || [];
    var addedSlots = [];
    for (var i = 0; i < incoming.length; i++) {
      var inSlot = incoming[i];
      var exists = false;
      for (var j = 0; j < state.activeImageSlots.length; j++) {
        if (state.activeImageSlots[j].slotId === inSlot.slotId) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        state.activeImageSlots.push(inSlot);
        addedSlots.push(inSlot);
      }
    }
    if (state.activeImageSlots.length === 0) {
      if (onStatusUpdate) onStatusUpdate("\u{1F5BC}\uFE0F Images: None on page");
      return;
    }
    if (addedSlots.length === 0) {
      return;
    }
    if (targetUrl) {
      var cKey = makeCacheKey(targetUrl, targetDate, state.settings ? state.settings.timelineDivergence : 0);
      var savedSlots = state.pageCache[cKey] && state.pageCache[cKey].slotImages;
      if (savedSlots) {
        for (var s = 0; s < addedSlots.length; s++) {
          var sl = addedSlots[s];
          var cached = savedSlots[sl.slotId];
          if (cached) {
            var cachedDataUrl = typeof cached === "string" ? cached : cached.dataUrl;
            var cachedPrompt = typeof cached === "object" ? cached.prompt || "" : "";
            var cachedUrl = typeof cached === "object" ? cached.url || "" : "";
            var hasPromptConflict = cachedPrompt && sl.prompt && cachedPrompt.trim() !== sl.prompt.trim();
            var hasUrlConflict = cachedUrl && targetUrl && cachedUrl.toLowerCase() !== targetUrl.toLowerCase();
            var hasEngineConflict = !isImageCacheEngineCompatible({
              dataUrl: cachedDataUrl,
              engine: typeof cached === "object" ? cached.engine : ""
            }, resolveSlotImageEngine(state.settings, sl));
            if (hasPromptConflict || hasUrlConflict || hasEngineConflict) {
              delete savedSlots[sl.slotId];
              continue;
            }
            if (cachedDataUrl) {
              sl.alreadyLoaded = true;
              postToIframe3({
                type: "DREAM_IMAGE_READY",
                slotId: sl.slotId,
                dataUrl: cachedDataUrl
              });
            }
          }
        }
      }
      var domain = extractDomain(targetUrl);
      if (domain) {
        var divergence = state.settings ? state.settings.timelineDivergence : 0;
        for (var d = 0; d < addedSlots.length; d++) {
          var dSlot = addedSlots[d];
          if (!dSlot.alreadyLoaded) {
            var slotEngine = resolveSlotImageEngine(state.settings, dSlot);
            var matchedDomainImg = findMatchingDomainImage(
              domain,
              targetDate,
              divergence,
              Object.assign({}, dSlot, { engine: slotEngine })
            );
            if (matchedDomainImg && matchedDomainImg.dataUrl) {
              dSlot.alreadyLoaded = true;
              patchCachedHtmlWithImage(targetUrl, targetDate, dSlot.slotId, matchedDomainImg.dataUrl, matchedDomainImg.prompt || dSlot.prompt, slotEngine);
              postToIframe3({
                type: "DREAM_IMAGE_READY",
                slotId: dSlot.slotId,
                dataUrl: matchedDomainImg.dataUrl
              });
            }
          }
        }
      }
    }
    var mode = state.settings.imageMode || "all";
    if (mode === "off" || mode === "ondemand") {
      if (onStatusUpdate) onStatusUpdate("\u{1F5BC}\uFE0F " + state.activeImageSlots.length + " slot(s) (Click \u{1F3A8} to generate)");
      return;
    }
    function updateImagesStatus() {
      if (targetUrl !== state.currentNavigationUrl) return;
      var inFlight = state.activeImageSlots.filter(function(s2) {
        return s2.inFlight;
      }).length;
      var loaded = state.activeImageSlots.filter(function(s2) {
        return s2.alreadyLoaded;
      }).length;
      var total = state.activeImageSlots.length;
      if (inFlight > 0) {
        if (onStatusUpdate) onStatusUpdate("\u{1F5BC}\uFE0F Loading images (" + loaded + "/" + total + ")...");
      } else if (loaded > 0) {
        if (onStatusUpdate) onStatusUpdate("\u{1F5BC}\uFE0F Images: Ready (" + loaded + ")");
      } else {
        if (onStatusUpdate) onStatusUpdate("\u{1F5BC}\uFE0F Images: " + total + " slot(s)");
      }
    }
    var maxCount = parseInt(state.settings.maxImagesPerPage, 10) || 12;
    var capSlots = state.activeImageSlots.filter(function(s2) {
      return slotCountsTowardImageCap(state.settings, s2);
    });
    var inFlightOrLoaded = capSlots.filter(function(s2) {
      return s2.inFlight || s2.alreadyLoaded;
    }).length;
    var remainingSlotsToStart = Math.max(0, maxCount - inFlightOrLoaded);
    var newlyEligible = addedSlots.filter(function(slot) {
      if (slot.alreadyLoaded || slot.inFlight) return false;
      if (mode === "ads") return slot.role === "ad";
      if (mode === "photos") return slot.role === "photo";
      return true;
    });
    var toGenerate = [];
    for (var g = 0; g < newlyEligible.length; g++) {
      var eligible = newlyEligible[g];
      if (slotCountsTowardImageCap(state.settings, eligible)) {
        if (remainingSlotsToStart <= 0) continue;
        remainingSlotsToStart--;
      }
      toGenerate.push(eligible);
    }
    if (toGenerate.length === 0) {
      updateImagesStatus();
      return;
    }
    for (var k = 0; k < toGenerate.length; k++) {
      var slotItem = toGenerate[k];
      slotItem.inFlight = true;
      slotItem.targetUrl = targetUrl;
      slotItem.targetDate = targetDate;
      slotItem.epoch = currentEpoch;
      generateSingleSlotImage(slotItem, targetDate, postToIframe3, /* @__PURE__ */ (function(item) {
        return function() {
          item.inFlight = false;
          item.alreadyLoaded = true;
          updateImagesStatus();
        };
      })(slotItem));
    }
    updateImagesStatus();
  }

  // src/ui/statusbar.js
  function setStatusText(text) {
    if (els.statusText) {
      els.statusText.textContent = text;
    }
  }
  function setStatusProgress(percent) {
    if (!els.statusProgressPanel || !els.statusProgressBar) return;
    if (percent === null || percent === void 0 || percent < 0) {
      els.statusProgressPanel.hidden = true;
      els.statusProgressBar.style.width = "0%";
    } else {
      els.statusProgressPanel.hidden = false;
      var clamped = Math.min(100, Math.max(0, Math.round(percent)));
      els.statusProgressBar.style.width = clamped + "%";
    }
  }
  function setStatusImages(text) {
    if (els.statusImages) {
      els.statusImages.textContent = text;
    }
  }
  function updateMemeStatusUI(memes, dateStr) {
    if (!els.statusMemes) return;
    var curDate = dateStr || (els.dateInput ? els.dateInput.value : "today");
    if (Array.isArray(memes) && memes.length > 0) {
      var preview = memes.slice(0, 3).join(", ");
      els.statusMemes.textContent = "\u{1F3AD} Memes: " + preview + (memes.length > 3 ? "..." : "");
      els.statusMemes.title = "Cultural Zeitgeist Memes (" + curDate + ") \u2014 Click to view all 10:\n\u2022 " + memes.join("\n\u2022 ");
    } else {
      els.statusMemes.textContent = "\u{1F3AD} Memes: Ready";
      els.statusMemes.title = "Cultural Zeitgeist Memes Active";
    }
  }
  function updateProviderStatusUI() {
    var settings = state.settings;
    var configured = hasValidCredentials(settings, settings.pageProvider);
    var hasModel = !!String(settings.pageModel || "").trim();
    var ready = configured && hasModel;
    var pName = getProviderDisplayName(settings.pageProvider);
    var keyless = !!(providerById(settings.pageProvider) && providerById(settings.pageProvider).keyless);
    var corsNote = isOpenCodeProvider(settings.pageProvider) ? ' <span class="cors-inline-badge" title="opencode.ai requires a CORS browser extension for direct browser POST requests">\u26A0\uFE0F Needs CORS Extension</span>' : "";
    var imgSummary = "";
    if (settings.imageMode !== "off") {
      var effImg = getEffectiveImageProvider(settings);
      if (settings.imageEngine === "text-pixel") {
        imgSummary = ", Images: <code>\u{1F47E} Text Pixel Art (" + resolveActiveTextArtModel(settings, effImg) + ")</code>";
      } else if (settings.imageEngine === "text-svg") {
        imgSummary = ", Images: <code>\u2728 Text Vector SVG (" + resolveActiveTextArtModel(settings, effImg) + ")</code>";
      } else if (settings.imageEngine === "text-auto") {
        imgSummary = ", Images: <code>\u{1F570}\uFE0F Era Text Art (" + resolveActiveTextArtModel(settings, effImg) + ")</code>";
      } else if (settings.imageEngine === "hybrid") {
        var hybridImageReady = !!(settings.imageProvider && isRasterProvider(settings.imageProvider) && hasValidCredentials(settings, settings.imageProvider));
        imgSummary = ", Images: <code>\u2728 Ads/Icons: SVG (" + resolveActiveTextArtModel(settings, settings.pageProvider) + ")</code>" + (hybridImageReady ? " \xB7 \u{1F5BC}\uFE0F Photos: <code>" + settings.imageModel + "</code>" : " \xB7 Photos: save an image provider in Settings");
      } else if (!settings.imageProvider || !isRasterProvider(settings.imageProvider) || !hasValidCredentials(settings, settings.imageProvider)) {
        imgSummary = ", Images: save an image provider in Settings";
      } else {
        imgSummary = ", Image Model: <code>" + settings.imageModel + "</code>";
      }
    }
    if (els.apiStatusDot) {
      els.apiStatusDot.classList.toggle("ready", ready);
    }
    if (els.providerSummaryText) {
      els.providerSummaryText.textContent = ready ? pName + ": " + settings.pageModel : configured ? pName + " (Click to select a model)" : pName + (keyless ? " (Click to set endpoint)" : " (Click to set API Key)");
    }
    if (els.homeApiWarning) {
      if (ready) {
        els.homeApiWarning.classList.add("configured");
        var bannerText = els.homeApiWarning.querySelector(".home-api-banner-text");
        if (bannerText) {
          bannerText.innerHTML = "<strong>Ready to Dream:</strong> Connected to <strong>" + pName + "</strong> (Page LLM: <code>" + settings.pageModel + "</code>" + imgSummary + ")." + corsNote;
        }
      } else {
        els.homeApiWarning.classList.remove("configured");
        var warnText = els.homeApiWarning.querySelector(".home-api-banner-text");
        if (warnText) {
          warnText.innerHTML = configured ? "<strong>Select a Model:</strong> Choose a model for <strong>" + pName + "</strong> in Settings." : (keyless ? "<strong>Provider Setup Required:</strong> To explore the web across time, configure your " : "<strong>Provider API Key Required:</strong> To explore the web across time, configure your ") + "<strong>" + pName + "</strong> " + (keyless ? "endpoint" : "API key") + " in Settings.";
        }
      }
    }
  }

  // src/ui/loading-overlay.js
  function configureLoadingAnimationEra(eraKey) {
    var era = eraKey || typeof document !== "undefined" && document.documentElement && document.documentElement.getAttribute("data-era") || "2000s";
    var sourceIcon = "\u{1F310}";
    var flyingGlyph = "\u{1F4C4}";
    var destIcon = "\u{1F4C1}";
    if (era === "pre90s") {
      sourceIcon = "\u{1F4E1}";
      flyingGlyph = "\u25B8";
      destIcon = "\u{1F4FA}";
    } else if (era === "1990s") {
      sourceIcon = "\u{1F310}";
      flyingGlyph = "\u{1F4C4}";
      destIcon = "\u{1F4C1}";
    } else if (era === "2000s") {
      sourceIcon = "\u{1F310}";
      flyingGlyph = "\u{1F4C4}";
      destIcon = "\u{1F4C1}";
    } else if (era === "modern") {
      sourceIcon = "\u2601\uFE0F";
      flyingGlyph = "\u{1F4E6}";
      destIcon = "\u{1F4BB}";
    } else if (era === "future") {
      sourceIcon = "\u{1FA90}";
      flyingGlyph = "\u2726";
      destIcon = "\u{1F6F8}";
    }
    if (els.transferIconSource) els.transferIconSource.textContent = sourceIcon;
    if (els.transferIconDest) els.transferIconDest.textContent = destIcon;
    if (els.loadingAnimIcon) els.loadingAnimIcon.textContent = sourceIcon;
    if (els.flyingGlyphs && Array.isArray(els.flyingGlyphs)) {
      for (var i = 0; i < els.flyingGlyphs.length; i++) {
        if (els.flyingGlyphs[i]) els.flyingGlyphs[i].textContent = flyingGlyph;
      }
    }
  }
  function showLoadingOverlay(opts) {
    var o = opts || {};
    if (els.loadingOverlay) els.loadingOverlay.hidden = true;
    if (els.dreamFrame) els.dreamFrame.hidden = false;
    if (els.homeScreen) els.homeScreen.hidden = true;
    if (els.btnStop) els.btnStop.disabled = false;
    if (els.throbber) els.throbber.classList.add("loading");
    if (o.headline) setStatusText(o.headline);
    if (o.progressPct !== void 0) setStatusProgress(o.progressPct);
    if (els.loadingDialogTitle && o.dialogTitle) els.loadingDialogTitle.textContent = o.dialogTitle;
    if (els.loadingHeadline && o.headline) els.loadingHeadline.textContent = o.headline;
    if (els.loadingSubline && o.subline) els.loadingSubline.textContent = o.subline;
    if (els.loadingProgressBar) els.loadingProgressBar.style.width = (o.progressPct !== void 0 ? o.progressPct : 8) + "%";
    if (els.loadingBytes && o.bytesText) els.loadingBytes.textContent = o.bytesText;
    if (els.loadingStreamPreview && o.streamPreview) els.loadingStreamPreview.textContent = o.streamPreview;
    configureLoadingAnimationEra(o.eraKey);
  }
  function updateLoadingOverlayProgress(opts) {
    var o = opts || {};
    if (o.headline) setStatusText(o.headline);
    if (o.progressPct !== void 0) setStatusProgress(o.progressPct);
    if (els.loadingHeadline && o.headline) els.loadingHeadline.textContent = o.headline;
    if (els.loadingBytes && o.bytesText) els.loadingBytes.textContent = o.bytesText;
    if (els.loadingProgressBar && o.progressPct !== void 0) els.loadingProgressBar.style.width = o.progressPct + "%";
    if (els.loadingStreamPreview && o.streamPreview) els.loadingStreamPreview.textContent = o.streamPreview;
  }
  function hideLoadingOverlay() {
    if (els.loadingOverlay) els.loadingOverlay.hidden = true;
    if (els.btnStop) els.btnStop.disabled = true;
    if (els.throbber) els.throbber.classList.remove("loading");
    setStatusProgress(null);
  }

  // src/ui/toolbar.js
  function updateNavButtons() {
    if (els.btnBack) els.btnBack.disabled = !canGoBack();
    if (els.btnForward) els.btnForward.disabled = !canGoForward();
  }
  function shiftDate(currentDateStr, days) {
    var d = /* @__PURE__ */ new Date(currentDateStr + "T00:00:00Z");
    if (isNaN(d.getTime())) d = /* @__PURE__ */ new Date("1999-12-31T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + days);
    var yyyy = d.getUTCFullYear();
    var mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    var dd = String(d.getUTCDate()).padStart(2, "0");
    return yyyy + "-" + mm + "-" + dd;
  }
  function syncTimelineDivergenceUI(val) {
    var num = typeof val === "number" ? val : parseInt(val, 10);
    if (isNaN(num)) num = state.settings.timelineDivergence || 0;
    num = Math.max(0, Math.min(100, num));
    var prof = getTimelineDivergenceProfile(num);
    if (els.timelineDivergenceSlider) {
      els.timelineDivergenceSlider.value = num;
    }
    if (els.timelineDivergenceBadge) {
      els.timelineDivergenceBadge.textContent = prof.badgeText;
      els.timelineDivergenceBadge.setAttribute("data-tier", prof.tierKey);
      els.timelineDivergenceBadge.title = prof.fullTitle + " \u2014 " + prof.description;
    }
    if (els.settingsTimelineSlider) {
      els.settingsTimelineSlider.value = num;
    }
    if (els.settingsTimelineLabel) {
      els.settingsTimelineLabel.textContent = prof.fullTitle;
    }
    if (els.settingsTimelineDesc) {
      els.settingsTimelineDesc.textContent = prof.description;
    }
  }

  // src/data/portals.js
  var FEATURED_PORTALS = [
    {
      url: "nycnews.com",
      date: "2001-09-11",
      title: "New York City News Portal",
      desc: "Breaking morning bulletins from Lower Manhattan, NY1/local eyewitness dispatches, bridge & transit closures, and early-2000s 3-column portal layout."
    },
    {
      url: "pets.com",
      date: "1999-11-15",
      title: "Pets.com \u2014 Because Pets Can't Drive!",
      desc: "Peak late-90s dot-com e-commerce store complete with the famous Sock Puppet mascot, holiday pet deals, and 468x60 Web 1.0 banner ads."
    },
    {
      url: "y2kreadiness.gov",
      date: "1999-12-31",
      title: "U.S. Y2K Rollover Command Center",
      desc: "New Year's Eve 1999 countdown status board tracking global power grids, banking mainframes, FAA radar, and emergency preparedness checklists."
    },
    {
      url: "geocities.com/Area51/Vault/4821",
      date: "1997-08-19",
      title: "X-Files & UFO Truth Seeker '97",
      desc: "Classic 1997 GeoCities personal homepage with starry background, WebRings, guestbook, hit counter, and Roswell conspiracy archives."
    },
    {
      url: "macrumors.com",
      date: "2007-01-09",
      title: "Macworld 2007 Live Coverage",
      desc: "Steve Jobs unveils a widescreen iPod with touch controls, a revolutionary mobile phone, and a breakthrough internet communicator."
    },
    {
      url: "olympus-mons-gazette.mars",
      date: "2048-11-03",
      title: "The Olympus Mons Daily Gazette",
      desc: "Tharsis Dome municipal news, Earth-Mars cycler arrival schedules, terraforming atmospheric telemetry, and off-world colony classifieds."
    }
  ];

  // src/ui/home-screen.js
  function renderFeaturedPortals(onNavigate2) {
    if (!els.featuredPortalsGrid) return;
    els.featuredPortalsGrid.innerHTML = "";
    for (var i = 0; i < FEATURED_PORTALS.length; i++) {
      (function(portal) {
        var card = document.createElement("button");
        card.type = "button";
        card.className = "portal-card";
        var era = getEraInfo(portal.date);
        card.innerHTML = '<div class="portal-card-top"><span class="portal-card-url">' + portal.url + '</span><span class="portal-card-date">' + era.formattedShort + '</span></div><p class="portal-card-desc"><strong>' + portal.title + ":</strong> " + portal.desc + "</p>";
        card.addEventListener("click", function() {
          if (els.urlInput) els.urlInput.value = portal.url;
          if (els.dateInput) els.dateInput.value = portal.date;
          applyEraTheme(portal.date);
          if (onNavigate2) {
            onNavigate2(portal.url, portal.date, { pushHistory: true, forceReload: false });
          }
        });
        els.featuredPortalsGrid.appendChild(card);
      })(FEATURED_PORTALS[i]);
    }
  }
  function renderRecentHistory(onNavigate2) {
    if (!els.recentHistorySection || !els.recentHistoryList) return;
    var keys = Object.keys(state.pageCache);
    if (keys.length === 0) {
      els.recentHistorySection.hidden = true;
      return;
    }
    keys.sort(function(a, b) {
      return (state.pageCache[b].timestamp || 0) - (state.pageCache[a].timestamp || 0);
    });
    els.recentHistorySection.hidden = false;
    els.recentHistoryList.innerHTML = "";
    var limit = Math.min(keys.length, 8);
    for (var i = 0; i < limit; i++) {
      (function(entry) {
        var row = document.createElement("div");
        row.className = "recent-item";
        var era = getEraInfo(entry.date);
        var left = document.createElement("div");
        left.className = "recent-item-left";
        var icon = document.createElement("span");
        icon.textContent = "\u{1F4C4}";
        var textCol = document.createElement("div");
        var urlLine = document.createElement("div");
        urlLine.className = "recent-item-url";
        urlLine.textContent = entry.title || entry.url;
        var dateLine = document.createElement("div");
        dateLine.className = "recent-item-date";
        dateLine.textContent = entry.url + " \u2022 " + era.formattedLong;
        textCol.appendChild(urlLine);
        textCol.appendChild(dateLine);
        left.appendChild(icon);
        left.appendChild(textCol);
        row.appendChild(left);
        var badge = document.createElement("span");
        badge.className = "portal-card-date";
        badge.textContent = "\u26A1 Instant Cache";
        row.appendChild(badge);
        row.addEventListener("click", function() {
          if (els.urlInput) els.urlInput.value = entry.url;
          if (els.dateInput) els.dateInput.value = entry.date;
          applyEraTheme(entry.date);
          if (onNavigate2) {
            onNavigate2(entry.url, entry.date, { pushHistory: true, forceReload: false });
          }
        });
        els.recentHistoryList.appendChild(row);
      })(state.pageCache[keys[i]]);
    }
  }
  function showHomeScreen(onNavigate2) {
    if (els.dreamFrame) els.dreamFrame.hidden = true;
    if (els.loadingOverlay) els.loadingOverlay.hidden = true;
    if (els.homeScreen) els.homeScreen.hidden = false;
    var curDate = els.dateInput && els.dateInput.value || "1999-12-31";
    var era = applyEraTheme(curDate);
    var winTitle = document.getElementById("window-title");
    if (winTitle) winTitle.textContent = era.browserName + " \u2014 [Dream Directory]";
    if (typeof document !== "undefined") {
      document.title = "Browser of Dreams \u2014 [about:dreams] (" + era.badgeLabel + ")";
    }
    setStatusText("Document: Done (Dream Directory)");
    renderRecentHistory(onNavigate2);
  }

  // src/features/pwa.js
  var deferredPrompt = null;
  var pwaListeners = [];
  var pwaState = {
    isSupported: typeof navigator !== "undefined" && "serviceWorker" in navigator,
    isRegistered: false,
    isInstallable: false,
    isStandalone: false,
    registration: null
  };
  function isStandaloneMode() {
    if (typeof window === "undefined") return false;
    const isStandaloneMedia = window.matchMedia && window.matchMedia("(display-mode: standalone)").matches;
    const isIosStandalone = window.navigator && Boolean(window.navigator.standalone);
    const isAndroidTwa = typeof document !== "undefined" && document.referrer && document.referrer.includes("android-app://");
    return Boolean(isStandaloneMedia || isIosStandalone || isAndroidTwa);
  }
  function syncStandaloneDOM(showStandaloneTitlebar = false) {
    if (typeof document === "undefined") return;
    const standalone = isStandaloneMode();
    const root = document.documentElement;
    const win = document.getElementById("browser-window");
    const installBtn = document.getElementById("btn-install-app");
    const menuInstallBtn = document.getElementById("menu-install-btn");
    const menuEraPill = document.getElementById("menu-era-pill");
    if (standalone) {
      if (root && root.classList) root.classList.add("is-standalone");
      if (win && win.classList) {
        win.classList.add("is-standalone");
        if (showStandaloneTitlebar) {
          win.classList.add("show-standalone-titlebar");
        } else {
          win.classList.remove("show-standalone-titlebar");
        }
      }
      if (installBtn) installBtn.hidden = true;
      if (menuInstallBtn) menuInstallBtn.hidden = true;
      if (menuEraPill && !showStandaloneTitlebar) menuEraPill.hidden = false;
    } else {
      if (root && root.classList) root.classList.remove("is-standalone");
      if (win && win.classList) {
        win.classList.remove("is-standalone");
        win.classList.remove("show-standalone-titlebar");
      }
      if (menuEraPill) menuEraPill.hidden = true;
      if (canPromptInstall() && installBtn) {
        installBtn.hidden = false;
      }
      if (menuInstallBtn) {
        menuInstallBtn.hidden = false;
      }
    }
  }
  function onPwaStateChange(callback) {
    if (typeof callback === "function") {
      pwaListeners.push(callback);
    }
  }
  function notifyPwaStateChange() {
    for (const cb of pwaListeners) {
      try {
        cb(pwaState);
      } catch (e) {
        console.warn("[PWA] Error in listener:", e);
      }
    }
  }
  function initPWA(options = {}) {
    if (typeof window === "undefined") return pwaState;
    pwaState.isStandalone = isStandaloneMode();
    syncStandaloneDOM(Boolean(options.showStandaloneTitlebar));
    if (window.matchMedia) {
      const mq = window.matchMedia("(display-mode: standalone)");
      const handleMqChange = function(e) {
        pwaState.isStandalone = Boolean(e && e.matches);
        syncStandaloneDOM(Boolean(options.showStandaloneTitlebar));
        notifyPwaStateChange();
      };
      if (mq.addEventListener) {
        mq.addEventListener("change", handleMqChange);
      } else if (mq.addListener) {
        mq.addListener(handleMqChange);
      }
    }
    window.addEventListener("beforeinstallprompt", function(event) {
      event.preventDefault();
      deferredPrompt = event;
      pwaState.isInstallable = true;
      syncStandaloneDOM(Boolean(options.showStandaloneTitlebar));
      notifyPwaStateChange();
    });
    window.addEventListener("appinstalled", function() {
      deferredPrompt = null;
      pwaState.isInstallable = false;
      pwaState.isStandalone = true;
      syncStandaloneDOM(Boolean(options.showStandaloneTitlebar));
      notifyPwaStateChange();
    });
    if (pwaState.isSupported && options.registerWorker !== false) {
      const swPath = options.swPath || "./sw.js";
      navigator.serviceWorker.register(swPath, { scope: "./" }).then(function(reg) {
        pwaState.isRegistered = true;
        pwaState.registration = reg;
        notifyPwaStateChange();
      }).catch(function(err) {
        console.warn("[PWA] Service Worker registration failed:", err);
      });
    }
    return pwaState;
  }
  async function promptInstall() {
    if (isStandaloneMode()) {
      return { outcome: "already_installed" };
    }
    if (!deferredPrompt) {
      return { outcome: "unsupported" };
    }
    try {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice && choice.outcome === "accepted") {
        deferredPrompt = null;
        pwaState.isInstallable = false;
        notifyPwaStateChange();
      }
      return choice || { outcome: "dismissed" };
    } catch (err) {
      console.error("[PWA] Error invoking prompt:", err);
      return { outcome: "error", error: err };
    }
  }
  function canPromptInstall() {
    return Boolean(deferredPrompt && !isStandaloneMode());
  }
  function setupWindowControls(elements = {}, onHomeNav) {
    const { btnMin, btnMax, btnClose } = elements;
    if (btnMax) {
      btnMax.addEventListener("click", function() {
        if (!document.fullscreenElement) {
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(function() {
            });
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen().catch(function() {
            });
          }
        }
      });
    }
    if (btnMin) {
      btnMin.addEventListener("click", function() {
        document.body.classList.toggle("retro-compact-mode");
      });
    }
    if (btnClose) {
      btnClose.addEventListener("click", function() {
        if (typeof onHomeNav === "function") {
          onHomeNav();
        }
      });
    }
  }

  // build-stamp:build-stamp
  var BUILD_TIME = "2026-11-01T02:19:56.280Z";

  // src/ui/settings-modal.js
  var OTHER = "__other__";
  var draftAccounts = null;
  var editingProviderId = "";
  var editorKeyAtOpen = "";
  var syncingPickers = false;
  function cloneDraft(accounts) {
    var base = emptyAccounts();
    var source = accounts || {};
    for (var i = 0; i < PROVIDER_CATALOG.length; i++) {
      var id = PROVIDER_CATALOG[i].id;
      base[id] = Object.assign({}, base[id], source[id] || {});
    }
    return base;
  }
  function maskKey(key) {
    var value = String(key || "").trim();
    if (!value) return "Not configured";
    var tail = value.length <= 4 ? value : value.slice(-4);
    return "\u2022\u2022\u2022\u2022" + tail;
  }
  function isAccountConfigured(provider, account) {
    if (!provider || !account) return false;
    if (provider.keyless) return !!account.enabled;
    return !!String(account.apiKey || "").trim();
  }
  function setEditStatus(text) {
    if (els.providerEditStatus) els.providerEditStatus.textContent = text || "";
  }
  function syncPwaStatusInModal() {
    var standalone = isStandaloneMode();
    if (els.pwaStatusLine) {
      els.pwaStatusLine.textContent = standalone ? "Running as an installed app." : "Running in a browser tab. Use Install on the toolbar when the browser offers it.";
    }
    if (els.btnModalInstallApp) {
      els.btnModalInstallApp.hidden = standalone;
      els.btnModalInstallApp.disabled = standalone;
    }
  }
  function getAvailableModelList(provider, isImage) {
    var settings = state.settings || {};
    var cm = settings.cachedModels || {};
    var p = provider === "aistudio" ? "gemini" : provider;
    if (p === "local") {
      return cm.localChat && cm.localChat.length > 0 ? cm.localChat.slice() : [];
    }
    if (p === "openrouter") {
      if (isImage) {
        var orImgs = cm.orImage && cm.orImage.length > 0 ? cm.orImage.slice() : STATIC_OR_IMAGE_MODELS.slice();
        if (orImgs.length <= 20) {
          for (var oi = 0; oi < STATIC_OR_IMAGE_MODELS.length; oi++) {
            if (orImgs.indexOf(STATIC_OR_IMAGE_MODELS[oi]) === -1) orImgs.push(STATIC_OR_IMAGE_MODELS[oi]);
          }
        }
        return orImgs;
      }
      return cm.orChat && cm.orChat.length > 0 ? cm.orChat.slice() : STATIC_OR_TEXT_MODELS.slice();
    }
    if (p === "opencode-zen") {
      return cm.opencodeZenChat && cm.opencodeZenChat.length > 0 ? cm.opencodeZenChat.slice() : STATIC_OPENCODE_ZEN_MODELS.slice();
    }
    if (p === "commandcode") {
      return cm.commandcodeChat && cm.commandcodeChat.length > 0 ? cm.commandcodeChat.slice() : STATIC_COMMANDCODE_MODELS.slice();
    }
    if (p === "opencode-go") {
      return cm.opencodeGoChat && cm.opencodeGoChat.length > 0 ? cm.opencodeGoChat.slice() : STATIC_OPENCODE_GO_MODELS.slice();
    }
    if (isImage) {
      return cm.googleImage && cm.googleImage.length > 0 ? cm.googleImage.slice() : STATIC_GEMINI_IMAGE_MODELS.slice();
    }
    return cm.googleChat && cm.googleChat.length > 0 ? cm.googleChat.slice() : STATIC_VERTEX_GEMINI_MODELS.slice();
  }
  function fillProviderSelect(selectEl, providers, current) {
    if (!selectEl) return "";
    selectEl.innerHTML = "";
    for (var i = 0; i < providers.length; i++) {
      var opt = document.createElement("option");
      opt.value = providers[i].id;
      opt.textContent = providers[i].name;
      selectEl.appendChild(opt);
    }
    var ids = providers.map(function(provider) {
      return provider.id;
    });
    selectEl.value = current && ids.indexOf(current) !== -1 ? current : providers[0].id;
    return selectEl.value;
  }
  function fillModelSelect(selectEl, models, current) {
    if (!selectEl) return;
    var active = String(current || "").trim();
    selectEl.innerHTML = "";
    for (var i = 0; i < models.length; i++) {
      var opt = document.createElement("option");
      opt.value = models[i];
      opt.textContent = models[i];
      selectEl.appendChild(opt);
    }
    var other = document.createElement("option");
    other.value = OTHER;
    other.textContent = "Other\u2026";
    selectEl.appendChild(other);
    if (active && models.indexOf(active) !== -1) selectEl.value = active;
    else if (active) selectEl.value = OTHER;
    else if (models.length) selectEl.value = models[0];
    else selectEl.value = OTHER;
  }
  function applyCustomVisibility(selectEl, customEl, current) {
    if (!customEl) return;
    var show = !!(selectEl && selectEl.value === OTHER);
    customEl.hidden = !show;
    if (show) customEl.value = current || "";
  }
  function readPickerModel(selectEl, customEl, providerId) {
    if (!selectEl) return "";
    var value = selectEl.value === OTHER ? customEl ? customEl.value.trim() : "" : selectEl.value;
    if (providerId === "openrouter" || /^https?:\/\/(?:www\.)?openrouter\.ai\//i.test(value)) {
      value = OpenRouterAdapter.normalizeModelId(value);
    }
    if (providerId === "commandcode") {
      value = CommandCodeAdapter.normalizeModelId(value, getAvailableModelList("commandcode", false));
    }
    if (providerId === "local") {
      value = LocalAdapter.normalizeModelId(value);
    }
    return value;
  }
  function configuredProviders(predicate) {
    var found = [];
    for (var i = 0; i < PROVIDER_CATALOG.length; i++) {
      var provider = PROVIDER_CATALOG[i];
      if (provider.disabled) continue;
      if (predicate && !predicate(provider)) continue;
      if (hasValidCredentials(state.settings, provider.id)) found.push(provider);
    }
    return found;
  }
  function persistChoice() {
    saveSettings(state.settings);
    updateProviderStatusUI();
  }
  function syncModelPickers() {
    if (!els.textProviderSelect) return;
    syncingPickers = true;
    var settings = state.settings;
    var changed = false;
    var textProviders = configuredProviders();
    if (textProviders.length === 0) {
      if (els.textModelPair) els.textModelPair.hidden = true;
      if (els.textModelEmpty) els.textModelEmpty.hidden = false;
      if (els.imageModelPair) els.imageModelPair.hidden = true;
      if (els.imageModelEmpty) els.imageModelEmpty.hidden = true;
    } else {
      if (els.textModelPair) els.textModelPair.hidden = false;
      if (els.textModelEmpty) els.textModelEmpty.hidden = true;
      var textProvider = fillProviderSelect(els.textProviderSelect, textProviders, settings.pageProvider);
      var providerChanged = textProvider !== settings.pageProvider;
      if (providerChanged) {
        settings.pageProvider = textProvider;
        changed = true;
      }
      var textModels = getAvailableModelList(textProvider, false);
      fillModelSelect(els.textModelSelect, textModels, providerChanged ? "" : settings.pageModel);
      applyCustomVisibility(els.textModelSelect, els.textModelCustom, providerChanged ? "" : settings.pageModel);
      var resolvedText = readPickerModel(els.textModelSelect, els.textModelCustom, textProvider) || textModels[0] || "";
      if (resolvedText && resolvedText !== settings.pageModel) {
        settings.pageModel = resolvedText;
        changed = true;
      } else if (!resolvedText && providerChanged && settings.pageModel) {
        settings.pageModel = "";
        changed = true;
      }
    }
    var showImage = textProviders.length > 0 && settings.imageMode !== "off" && !isTextArtEngine(settings.imageEngine || "image-model");
    var imageProviders = configuredProviders(function(provider) {
      return provider.raster;
    });
    if (!showImage) {
      if (els.imageModelPair) els.imageModelPair.hidden = true;
      if (els.imageModelEmpty) els.imageModelEmpty.hidden = true;
    } else if (imageProviders.length === 0) {
      if (els.imageModelPair) els.imageModelPair.hidden = true;
      if (els.imageModelEmpty) els.imageModelEmpty.hidden = false;
    } else {
      if (els.imageModelPair) els.imageModelPair.hidden = false;
      if (els.imageModelEmpty) els.imageModelEmpty.hidden = true;
      var imageProvider = fillProviderSelect(els.imageProviderSelect, imageProviders, settings.imageProvider);
      var imageProviderChanged = imageProvider !== settings.imageProvider;
      if (imageProviderChanged) {
        settings.imageProvider = imageProvider;
        changed = true;
      }
      var imageModels = getAvailableModelList(imageProvider, true);
      fillModelSelect(els.imageModelSelect, imageModels, imageProviderChanged ? "" : settings.imageModel);
      applyCustomVisibility(els.imageModelSelect, els.imageModelCustom, imageProviderChanged ? "" : settings.imageModel);
      var resolvedImage = readPickerModel(els.imageModelSelect, els.imageModelCustom, imageProvider) || imageModels[0] || "";
      if (resolvedImage && resolvedImage !== settings.imageModel) {
        settings.imageModel = resolvedImage;
        changed = true;
      }
    }
    syncingPickers = false;
    if (changed) persistChoice();
  }
  function syncImageEngineHint() {
    if (!els.imageEngineHint || !els.imageEngineSelect) return;
    var engine = els.imageEngineSelect.value;
    if (engine === "text-pixel") {
      els.imageEngineHint.textContent = "Pixel art is drawn by the text model. The Image pair stays hidden.";
    } else if (engine === "text-svg") {
      els.imageEngineHint.textContent = "Vector art is drawn by the text model. The Image pair stays hidden.";
    } else if (engine === "text-auto") {
      els.imageEngineHint.textContent = "Era-adaptive art is drawn by the text model. The Image pair stays hidden.";
    } else if (engine === "hybrid") {
      els.imageEngineHint.textContent = "Ads, icons, and graphics are drawn as vector SVG by the text model. Hero and article photos use the Image provider and model below.";
    } else {
      els.imageEngineHint.textContent = "Raster photos, ads, icons, and graphics use the Image provider and model in the bar below.";
    }
  }
  function renderProviderList() {
    var list = els.providerAccountList;
    if (!list || !draftAccounts) return;
    list.innerHTML = "";
    for (var i = 0; i < PROVIDER_CATALOG.length; i++) {
      let addButton = function(label, action) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "small-btn";
        button.textContent = label;
        button.dataset.providerAction = action;
        button.dataset.providerId = provider.id;
        actions.appendChild(button);
      };
      var provider = PROVIDER_CATALOG[i];
      if (provider.disabled) continue;
      var account = draftAccounts[provider.id];
      var configured = isAccountConfigured(provider, account);
      var row = document.createElement("li");
      row.className = "provider-account-row";
      var name = document.createElement("span");
      name.className = "provider-account-name";
      name.textContent = provider.name;
      var key = document.createElement("span");
      key.className = "provider-account-key";
      key.textContent = provider.keyless ? configured ? account.endpoint || provider.defaultEndpoint : "Not configured" : maskKey(account && account.apiKey);
      var actions = document.createElement("span");
      actions.className = "provider-account-actions";
      addButton(configured ? "Edit" : provider.keyless ? "Save endpoint" : "Save key", "edit");
      if (configured) {
        addButton("Remove", "remove");
        addButton("Fetch models", "fetch");
      }
      row.appendChild(name);
      row.appendChild(key);
      row.appendChild(actions);
      list.appendChild(row);
    }
  }
  function openEditor(providerId) {
    var provider = providerById(providerId);
    var account = draftAccounts && draftAccounts[providerId];
    if (!provider || !account || !els.providerEditPanel) return;
    editingProviderId = providerId;
    editorKeyAtOpen = String(account.apiKey || "");
    els.providerEditPanel.hidden = false;
    if (els.providerEditTitle) els.providerEditTitle.textContent = provider.name;
    setEditStatus("");
    var isAgent = providerId === "agentplatform";
    var keyless = !!provider.keyless;
    var openCode = isOpenCodeProvider(providerId);
    if (els.editAuthRow) els.editAuthRow.hidden = !isAgent;
    if (els.editProjectRow) els.editProjectRow.hidden = !isAgent;
    if (els.editReasoningRow) els.editReasoningRow.hidden = false;
    if (els.editSitePlanReasoningRow) els.editSitePlanReasoningRow.hidden = false;
    if (els.editEndpointRow) els.editEndpointRow.hidden = !(isAgent || openCode || keyless);
    if (els.providerCorsNotice) els.providerCorsNotice.hidden = !openCode;
    if (els.editKeyLabel) {
      els.editKeyLabel.textContent = keyless ? "API Key (optional):" : isAgent ? "API Key or Access Token:" : "API Key:";
    }
    if (els.editApiKey) {
      els.editApiKey.value = account.apiKey || "";
      els.editApiKey.type = "password";
      els.editApiKey.placeholder = keyless ? "Optional \u2014 leave empty unless your server requires a key" : "Paste API key";
    }
    if (els.providerEditSave) els.providerEditSave.textContent = keyless ? "Save endpoint" : "Save key";
    if (els.editEndpointHelp) {
      els.editEndpointHelp.hidden = !keyless;
      if (keyless) {
        els.editEndpointHelp.textContent = "OpenAI-compatible base URL. Examples: http://localhost:11434/v1 (Ollama), http://localhost:1234/v1 (LM Studio), http://localhost:8080/v1 (llama.cpp). Trailing /v1 is added when omitted. The server must allow this page's origin \u2014 for Ollama set OLLAMA_ORIGINS.";
      }
    }
    if (isAgent) {
      if (els.editAuthType) els.editAuthType.value = account.vertexAuthType || "apikey";
      if (els.editProjectId) {
        els.editProjectId.value = account.projectId || AgentPlatform.cachedProject(account.apiKey) || "";
      }
      if (els.editLocation) els.editLocation.value = account.location || "global";
      if (els.editEndpoint) els.editEndpoint.value = account.endpoint || provider.defaultEndpoint;
    } else if ((openCode || keyless) && els.editEndpoint) {
      els.editEndpoint.value = account.endpoint || provider.defaultEndpoint;
    }
    if (els.editReasoningEffort) {
      els.editReasoningEffort.value = account.reasoningEffort || "off";
    }
    if (els.editSitePlanReasoningEffort) {
      els.editSitePlanReasoningEffort.value = account.sitePlanReasoningEffort || "off";
    }
  }
  function readEditorIntoDraft() {
    if (!editingProviderId || !draftAccounts) return;
    var id = editingProviderId;
    var account = draftAccounts[id];
    var provider = providerById(id);
    account.apiKey = els.editApiKey ? els.editApiKey.value.trim() : account.apiKey;
    if (id === "agentplatform") {
      account.vertexAuthType = els.editAuthType ? els.editAuthType.value : account.vertexAuthType;
      account.projectId = els.editProjectId ? els.editProjectId.value.trim() : account.projectId;
      account.location = els.editLocation ? els.editLocation.value.trim() || "global" : account.location;
      account.endpoint = els.editEndpoint ? els.editEndpoint.value.trim() || provider.defaultEndpoint : account.endpoint;
    } else if (isOpenCodeProvider(id) && els.editEndpoint) {
      account.endpoint = els.editEndpoint.value.trim() || provider.defaultEndpoint;
    } else if (provider && provider.keyless) {
      if (els.editEndpoint) account.endpoint = LocalAdapter.normalizeEndpoint(els.editEndpoint.value);
      account.enabled = true;
    }
    if (els.editReasoningEffort) {
      account.reasoningEffort = els.editReasoningEffort.value || "off";
    }
    if (els.editSitePlanReasoningEffort) {
      account.sitePlanReasoningEffort = els.editSitePlanReasoningEffort.value || "off";
    }
  }
  function maybeCopySiblingKey() {
    var provider = providerById(editingProviderId);
    if (!provider || !provider.sibling) return;
    var key = draftAccounts[editingProviderId].apiKey;
    var sibling = draftAccounts[provider.sibling];
    if (!key || key === editorKeyAtOpen || String(sibling.apiKey || "").trim()) return;
    var siblingInfo = providerById(provider.sibling);
    var copy = typeof window !== "undefined" && typeof window.confirm === "function" ? window.confirm("Use this key for " + siblingInfo.name + " too?") : false;
    if (copy) sibling.apiKey = key;
  }
  function commitEditor(askCopy) {
    if (!editingProviderId) return;
    readEditorIntoDraft();
    if (askCopy) maybeCopySiblingKey();
    editorKeyAtOpen = draftAccounts[editingProviderId].apiKey || "";
    renderProviderList();
  }
  function removeProviderKey(providerId) {
    if (!draftAccounts || !draftAccounts[providerId]) return;
    var provider = providerById(providerId);
    if (provider && provider.keyless) {
      draftAccounts[providerId].enabled = false;
      draftAccounts[providerId].endpoint = provider.defaultEndpoint;
    } else {
      draftAccounts[providerId].apiKey = "";
    }
    if (editingProviderId === providerId) {
      editingProviderId = "";
      if (els.providerEditPanel) els.providerEditPanel.hidden = true;
    }
    renderProviderList();
    if (provider && provider.keyless) {
      setEditStatus(provider.name + " endpoint disabled. Choose Save Settings to keep this.");
    } else {
      setEditStatus(providerById(providerId).name + " key removed. Choose Save Settings to keep this.");
    }
  }
  function cacheAndRefresh(note) {
    state.settings.cachedModels = state.settings.cachedModels || {};
    saveSettings(state.settings);
    syncModelPickers();
    setEditStatus(note);
  }
  function fetchEditingProvider() {
    if (!editingProviderId) return;
    readEditorIntoDraft();
    var id = editingProviderId;
    var account = draftAccounts[id];
    var provider = providerById(id);
    var key = String(account.apiKey || "").trim();
    if (!key && !(provider && provider.keyless)) {
      setEditStatus("Paste a key before fetching models.");
      return;
    }
    if (provider && provider.keyless && !String(account.endpoint || "").trim()) {
      setEditStatus("Enter an endpoint URL before fetching models.");
      return;
    }
    setEditStatus("Fetching " + provider.name + " models\u2026");
    if (id === "local") {
      LocalAdapter.fetchModels(account.endpoint, key, function(err, models) {
        if (err || !models) {
          setEditStatus("\u26A0\uFE0F " + (err || "Failed to fetch models"));
          return;
        }
        state.settings.cachedModels = state.settings.cachedModels || {};
        var cached = models.slice(0, 200);
        state.settings.cachedModels.localChat = cached;
        cacheAndRefresh("\u2713 Loaded " + cached.length + " local model(s).");
      });
      return;
    }
    if (id === "commandcode") {
      var ccEndpoint = account.endpoint || provider.defaultEndpoint;
      CommandCodeAdapter.fetchModels(ccEndpoint, key, function(err, models) {
        if (err || !models) {
          setEditStatus("\u26A0\uFE0F " + (err || "Failed to fetch models"));
          return;
        }
        state.settings.cachedModels = state.settings.cachedModels || {};
        var cached = models.slice(0, 200);
        state.settings.cachedModels.commandcodeChat = cached;
        cacheAndRefresh("\u2713 Loaded " + cached.length + " Command Code models.");
      });
      return;
    }
    if (id === "openrouter") {
      OpenRouterAdapter.fetchModels(key, function(err, result) {
        if (err || !result) {
          setEditStatus("\u26A0\uFE0F " + (err || "Failed"));
          return;
        }
        var cached = state.settings.cachedModels || {};
        state.settings.cachedModels = cached;
        if (result.textModels && result.textModels.length > 0) cached.orChat = result.textModels.slice(0, 120);
        if (result.imageModels && result.imageModels.length > 0) cached.orImage = result.imageModels.slice();
        cacheAndRefresh("\u2713 Loaded " + (result.textModels ? result.textModels.length : 0) + " text and " + (result.imageModels ? result.imageModels.length : 0) + " image models.");
      });
      return;
    }
    if (isOpenCodeProvider(id)) {
      var endpoint = account.endpoint || provider.defaultEndpoint;
      OpenCodeAdapter.fetchModels(endpoint, key, function(err, models) {
        if (err || !models) {
          setEditStatus("\u26A0\uFE0F " + (err || "Failed to fetch models"));
          return;
        }
        state.settings.cachedModels = state.settings.cachedModels || {};
        if (id === "opencode-go") state.settings.cachedModels.opencodeGoChat = models.slice();
        else state.settings.cachedModels.opencodeZenChat = models.slice();
        cacheAndRefresh("\u2713 Loaded " + models.length + " " + provider.name + " models.");
      });
      return;
    }
    var endpoint = id === "agentplatform" ? account.endpoint || provider.defaultEndpoint : provider.defaultEndpoint;
    GeminiAdapter.fetchModels(endpoint, key, {
      geminiAuthMethod: id === "agentplatform" ? "agentplatform" : "gemini",
      geminiVertexAuthType: account.vertexAuthType || "apikey",
      geminiProjectId: account.projectId || "",
      geminiLocation: account.location || "global",
      includeImageModels: true
    }, function(err, chatModels, _status, imageModels) {
      var discovered = AgentPlatform.cachedProject(key);
      if (discovered && els.editProjectId && !els.editProjectId.value.trim() && id === "agentplatform") {
        els.editProjectId.value = discovered;
        account.projectId = discovered;
      }
      if (err) {
        setEditStatus("\u26A0\uFE0F " + err);
        return;
      }
      state.settings.cachedModels = state.settings.cachedModels || {};
      if (chatModels && chatModels.length > 0) state.settings.cachedModels.googleChat = chatModels.slice();
      if (imageModels && imageModels.length > 0) state.settings.cachedModels.googleImage = imageModels.slice();
      var chatCount = chatModels && chatModels.length || 0;
      var imageCount = imageModels && imageModels.length || 0;
      cacheAndRefresh("\u2713 Verified " + chatCount + " chat and " + imageCount + " image model(s)" + (discovered ? " (Project #" + discovered + ")" : "") + ".");
    });
  }
  function syncBuildStamp() {
    var el = document.getElementById("build-stamp");
    if (!el || !BUILD_TIME) return;
    var when = new Date(BUILD_TIME);
    var label = isNaN(when.getTime()) ? BUILD_TIME : when.toLocaleString();
    el.textContent = "Build " + label;
  }
  function openSettingsModal() {
    if (!els.settingsModal) return;
    var settings = state.settings;
    draftAccounts = cloneDraft(settings.accounts);
    editingProviderId = "";
    if (els.providerEditPanel) els.providerEditPanel.hidden = true;
    setEditStatus("");
    renderProviderList();
    if (els.temperatureSlider) els.temperatureSlider.value = settings.temperature;
    if (els.tempValLabel) els.tempValLabel.textContent = settings.temperature;
    syncTimelineDivergenceUI(settings.timelineDivergence || 0);
    if (els.imageModeSelect) els.imageModeSelect.value = settings.imageMode;
    if (els.imageEngineSelect) els.imageEngineSelect.value = settings.imageEngine || "image-model";
    syncImageEngineHint();
    if (els.maxImagesSlider) els.maxImagesSlider.value = settings.maxImagesPerPage;
    if (els.maxImagesLabel) els.maxImagesLabel.textContent = settings.maxImagesPerPage;
    if (els.chkShowStandaloneTitlebar) {
      els.chkShowStandaloneTitlebar.checked = Boolean(settings.showStandaloneTitlebar);
    }
    syncPwaStatusInModal();
    syncBuildStamp();
    els.settingsModal.hidden = false;
  }
  function closeSettingsModal() {
    draftAccounts = null;
    editingProviderId = "";
    if (els.settingsModal) els.settingsModal.hidden = true;
  }
  function onTextProviderChanged() {
    if (syncingPickers) return;
    state.settings.pageProvider = els.textProviderSelect.value;
    var models = getAvailableModelList(state.settings.pageProvider, false);
    fillModelSelect(els.textModelSelect, models, "");
    applyCustomVisibility(els.textModelSelect, els.textModelCustom, "");
    state.settings.pageModel = readPickerModel(els.textModelSelect, els.textModelCustom, state.settings.pageProvider) || models[0] || "";
    persistChoice();
  }
  function onTextModelChanged() {
    if (syncingPickers) return;
    applyCustomVisibility(els.textModelSelect, els.textModelCustom, els.textModelCustom ? els.textModelCustom.value : "");
    if (els.textModelSelect.value === OTHER) {
      if (els.textModelCustom) els.textModelCustom.focus();
      return;
    }
    state.settings.pageModel = readPickerModel(els.textModelSelect, els.textModelCustom, state.settings.pageProvider);
    persistChoice();
  }
  function onTextCustomChanged() {
    if (syncingPickers) return;
    var model = readPickerModel(els.textModelSelect, els.textModelCustom, state.settings.pageProvider);
    if (!model) return;
    state.settings.pageModel = model;
    persistChoice();
  }
  function onImageProviderChanged() {
    if (syncingPickers) return;
    state.settings.imageProvider = els.imageProviderSelect.value;
    var models = getAvailableModelList(state.settings.imageProvider, true);
    fillModelSelect(els.imageModelSelect, models, "");
    applyCustomVisibility(els.imageModelSelect, els.imageModelCustom, "");
    state.settings.imageModel = readPickerModel(els.imageModelSelect, els.imageModelCustom, state.settings.imageProvider) || models[0] || "";
    persistChoice();
  }
  function onImageModelChanged() {
    if (syncingPickers) return;
    applyCustomVisibility(els.imageModelSelect, els.imageModelCustom, els.imageModelCustom ? els.imageModelCustom.value : "");
    if (els.imageModelSelect.value === OTHER) {
      if (els.imageModelCustom) els.imageModelCustom.focus();
      return;
    }
    state.settings.imageModel = readPickerModel(els.imageModelSelect, els.imageModelCustom, state.settings.imageProvider);
    persistChoice();
  }
  function onImageCustomChanged() {
    if (syncingPickers) return;
    var model = readPickerModel(els.imageModelSelect, els.imageModelCustom, state.settings.imageProvider);
    if (!model) return;
    state.settings.imageModel = model;
    persistChoice();
  }
  function initSettingsModalEvents(onSettingsSaved) {
    if (!els.settingsModal) return;
    if (els.settingsCloseBtn) els.settingsCloseBtn.addEventListener("click", closeSettingsModal);
    if (els.settingsCancelBtn) els.settingsCancelBtn.addEventListener("click", closeSettingsModal);
    if (els.btnModalInstallApp) {
      els.btnModalInstallApp.addEventListener("click", async function() {
        if (canPromptInstall()) {
          var res = await promptInstall();
          if (res && res.outcome === "accepted") {
            syncPwaStatusInModal();
            closeSettingsModal();
          }
        } else {
          alert("To install Browser of Dreams as a Web App:\n\n\u2022 Google Chrome / Chromium / Edge (Desktop): Click the Install icon in the address bar.\n\u2022 Apple Safari (iOS / iPadOS): Tap the Share button (square with arrow up) \u2794 'Add to Home Screen'.\n\u2022 Android Chrome: Tap the three dots (\u22EE) menu \u2794 'Install app'.");
        }
      });
    }
    if (els.chkShowStandaloneTitlebar) {
      els.chkShowStandaloneTitlebar.addEventListener("change", function() {
        syncStandaloneDOM(els.chkShowStandaloneTitlebar.checked);
      });
    }
    if (els.providerAccountList) {
      els.providerAccountList.addEventListener("click", function(event) {
        var button = event.target.closest ? event.target.closest("[data-provider-action]") : null;
        if (!button) return;
        var id = button.dataset.providerId;
        var action = button.dataset.providerAction;
        if (action === "edit") openEditor(id);
        else if (action === "remove") removeProviderKey(id);
        else if (action === "fetch") {
          openEditor(id);
          fetchEditingProvider();
        }
      });
    }
    if (els.providerEditSave) {
      els.providerEditSave.addEventListener("click", function() {
        commitEditor(true);
        var provider = providerById(editingProviderId);
        if (provider && provider.keyless) {
          setEditStatus(provider.name + " endpoint saved. Choose Save Settings to keep it.");
          var cachedLocal = state.settings.cachedModels && state.settings.cachedModels.localChat;
          if (!cachedLocal || cachedLocal.length === 0) fetchEditingProvider();
          return;
        }
        setEditStatus("Key saved for " + (provider ? provider.name : "provider") + ". Choose Save Settings to keep it.");
      });
    }
    if (els.providerEditFetch) {
      els.providerEditFetch.addEventListener("click", fetchEditingProvider);
    }
    if (els.providerEditClose) {
      els.providerEditClose.addEventListener("click", function() {
        editingProviderId = "";
        if (els.providerEditPanel) els.providerEditPanel.hidden = true;
      });
    }
    if (els.editToggleKeyVis && els.editApiKey) {
      els.editToggleKeyVis.addEventListener("click", function() {
        els.editApiKey.type = els.editApiKey.type === "password" ? "text" : "password";
      });
    }
    if (els.temperatureSlider) {
      els.temperatureSlider.addEventListener("input", function() {
        if (els.tempValLabel) els.tempValLabel.textContent = els.temperatureSlider.value;
      });
    }
    if (els.settingsTimelineSlider) {
      els.settingsTimelineSlider.addEventListener("input", function() {
        syncTimelineDivergenceUI(els.settingsTimelineSlider.value);
      });
    }
    if (els.maxImagesSlider) {
      els.maxImagesSlider.addEventListener("input", function() {
        if (els.maxImagesLabel) els.maxImagesLabel.textContent = els.maxImagesSlider.value;
      });
    }
    if (els.imageEngineSelect) {
      els.imageEngineSelect.addEventListener("change", syncImageEngineHint);
    }
    if (els.textProviderSelect) els.textProviderSelect.addEventListener("change", onTextProviderChanged);
    if (els.textModelSelect) els.textModelSelect.addEventListener("change", onTextModelChanged);
    if (els.textModelCustom) els.textModelCustom.addEventListener("change", onTextCustomChanged);
    if (els.imageProviderSelect) els.imageProviderSelect.addEventListener("change", onImageProviderChanged);
    if (els.imageModelSelect) els.imageModelSelect.addEventListener("change", onImageModelChanged);
    if (els.imageModelCustom) els.imageModelCustom.addEventListener("change", onImageCustomChanged);
    if (els.settingsSaveBtn) {
      els.settingsSaveBtn.addEventListener("click", function() {
        var s = state.settings;
        if (editingProviderId) commitEditor(true);
        s.accounts = cloneDraft(draftAccounts || s.accounts);
        s.temperature = els.temperatureSlider ? parseFloat(els.temperatureSlider.value) || 0.7 : s.temperature;
        if (els.settingsTimelineSlider) {
          s.timelineDivergence = parseInt(els.settingsTimelineSlider.value, 10) || 0;
        }
        syncTimelineDivergenceUI(s.timelineDivergence);
        if (els.imageModeSelect) s.imageMode = els.imageModeSelect.value;
        if (els.imageEngineSelect) s.imageEngine = els.imageEngineSelect.value;
        if (els.maxImagesSlider) s.maxImagesPerPage = parseInt(els.maxImagesSlider.value, 10) || 12;
        s.showStandaloneTitlebar = Boolean(els.chkShowStandaloneTitlebar && els.chkShowStandaloneTitlebar.checked);
        syncStandaloneDOM(s.showStandaloneTitlebar);
        saveSettings(s);
        syncModelPickers();
        updateProviderStatusUI();
        closeSettingsModal();
        if (onSettingsSaved) onSettingsSaved(s);
      });
    }
  }

  // src/core/navigation.js
  function postToIframe(message) {
    if (els.dreamFrame && els.dreamFrame.contentWindow) {
      els.dreamFrame.contentWindow.postMessage(message, "*");
    }
  }
  function cancelActiveGeneration() {
    if (state.activeStreamWriter) {
      try {
        state.activeStreamWriter.close();
        if (state.activeStreamWriter.doc && state.currentNavigationUrl) {
          ensureBridgeInDocument(state.activeStreamWriter.doc, state.currentNavigationUrl, state.currentNavigationDate, state.activeBrowserProfile);
        }
      } catch (e) {
      }
      state.activeStreamWriter = null;
    }
    resetActiveRequest();
    hideLoadingOverlay();
    setStatusProgress(null);
    setStatusText("Document: Stopped");
  }
  function mountHtmlInViewport(rawHtml, normalizedUrl, dateStr, fromCache, browserProfileId) {
    state.currentRawHtml = rawHtml;
    state.currentNavigationUrl = normalizedUrl;
    state.currentNavigationDate = dateStr;
    var era = applyEraTheme(dateStr);
    var title = extractTitleFromHtml(rawHtml, normalizedUrl);
    var injected = injectBridgeScript(rawHtml, normalizedUrl, dateStr, browserProfileId);
    if (els.homeScreen) els.homeScreen.hidden = true;
    if (els.dreamFrame) {
      els.dreamFrame.hidden = false;
      els.dreamFrame.srcdoc = injected;
    }
    var winTitle = document.getElementById("window-title");
    if (winTitle) winTitle.textContent = title + " - " + era.browserName;
    if (typeof document !== "undefined") {
      document.title = (title || normalizedUrl) + " \u2014 [" + normalizedUrl + "] (" + era.badgeLabel + ") - Browser of Dreams";
    }
    setStatusText(fromCache ? "Loaded from Dream Cache (" + normalizedUrl + ")" : "Document: Done (" + normalizedUrl + ")");
  }
  function renderEraErrorPage(normalizedUrl, dateStr, errorMessage) {
    var era = getEraInfo(dateStr);
    var escapedErr = String(errorMessage || "Unknown error").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var errorHtml = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Cannot find server</title><style>body{font-family:Verdana,Tahoma,sans-serif;background:#ffffff;color:#000000;padding:32px;max-width:680px;margin:0 auto;}h1{font-size:18px;color:#990000;border-bottom:1px solid #cccccc;padding-bottom:8px;}.box{background:#f7f7f2;border:1px solid #cccccc;padding:14px;font-family:monospace;font-size:12px;margin:16px 0;white-space:pre-wrap;}p,li{font-size:12px;line-height:1.5;}</style></head><body><h1>\u26A0\uFE0F The Dream Page Cannot Be Displayed</h1><p>The server at <strong>' + normalizedUrl + "</strong> on <strong>" + era.formattedLong + '</strong> could not be reached.</p><div class="box">' + escapedErr + "</div><p>Please try the following:</p><ul><li>Click the <strong>\u2699 Settings</strong> button in the browser toolbar to verify your provider settings and selected model.</li><li>Click <strong>Reload</strong> to try dreaming the page again.</li></ul></body></html>";
    mountHtmlInViewport(errorHtml, normalizedUrl, dateStr, false, "");
    setStatusText("Error: " + errorMessage);
  }
  function dispatchStreaming(messages, onChunk, onComplete, customOpts) {
    var settings = state.settings;
    var provider = getProvider(settings.pageProvider);
    var config = resolveConfig(settings, settings.pageProvider);
    var copts = customOpts || {};
    var req = {
      ...config,
      messages,
      temperature: copts.temperature !== void 0 ? copts.temperature : settings.temperature,
      maxTokens: copts.maxTokens !== void 0 ? copts.maxTokens : 16384,
      reasoningEffort: copts.sitePlan ? config.sitePlanReasoningEffort : config.reasoningEffort,
      thinkingBudget: copts.sitePlan ? config.sitePlanThinkingBudget || 0 : config.thinkingBudget || 0,
      geminiAuthMethod: config.geminiAuthMethod,
      vertexAuthType: config.vertexAuthType,
      geminiProjectId: config.geminiProjectId,
      geminiLocation: config.geminiLocation || "global",
      onChunk,
      onComplete
    };
    return provider.streamChat(req);
  }
  function navigateToDream(rawUrl, dateStr, options) {
    var opts = options || {};
    var era = applyEraTheme(dateStr);
    var normalizedUrl = normalizeDreamUrl(rawUrl, era.year);
    state.navigationEpoch++;
    state.currentNavigationUrl = normalizedUrl;
    state.currentNavigationDate = dateStr;
    state.activeImageSlots = [];
    if (normalizedUrl === "about:dreams") {
      showHomeScreen(navigateToDream);
      return;
    }
    if (els.urlInput) els.urlInput.value = normalizedUrl;
    if (els.dateInput) els.dateInput.value = dateStr;
    var homepageUrl = getHomepageUrl(normalizedUrl);
    var isHome = isHomepageUrl(normalizedUrl);
    var cacheKey = makeCacheKey(normalizedUrl, dateStr, state.settings.timelineDivergence);
    var homeCacheKey = makeCacheKey(homepageUrl, dateStr, state.settings.timelineDivergence);
    if (!opts.forceReload && state.pageCache[cacheKey] && state.pageCache[cacheKey].html) {
      var cachedEntry = state.pageCache[cacheKey];
      if (opts.pushHistory !== false) {
        pushHistory({
          url: normalizedUrl,
          date: dateStr,
          title: cachedEntry.title || normalizedUrl,
          html: cachedEntry.html,
          browserProfile: cachedEntry.browserProfile || ""
        });
        updateNavButtons();
      }
      mountHtmlInViewport(cachedEntry.html, normalizedUrl, dateStr, true, cachedEntry.browserProfile || "");
      return;
    }
    if (!hasValidCredentials(state.settings, state.settings.pageProvider)) {
      openSettingsModal();
      var pageProviderInfo = providerById(state.settings.pageProvider);
      setStatusText(pageProviderInfo && pageProviderInfo.keyless ? "Please configure your local endpoint in Settings to dream webpages." : "Please configure your API key in Settings to dream webpages.");
      return;
    }
    var navCtx = opts.navContext ? Object.assign({}, opts.navContext) : null;
    var referrerUrl = navCtx && navCtx.referrerUrl ? normalizeDreamUrl(navCtx.referrerUrl, era.year) : "";
    var referrerHtml = navCtx && navCtx.referrerHtml || "";
    if (referrerUrl && !referrerHtml) {
      var refKey = makeCacheKey(referrerUrl, dateStr, state.settings.timelineDivergence);
      if (state.pageCache[refKey] && state.pageCache[refKey].html) {
        referrerHtml = state.pageCache[refKey].html;
      } else if (state.currentRawHtml) {
        referrerHtml = state.currentRawHtml;
      }
    }
    if (navCtx && referrerUrl) {
      navCtx.referrerUrl = referrerUrl;
    }
    if (navCtx && referrerHtml && !navCtx.referrerHtml) {
      navCtx.referrerHtml = referrerHtml;
    }
    function startNavigationWithMemes(dayMemes) {
      cancelActiveGeneration();
      var hostName = normalizedUrl;
      try {
        hostName = new URL(normalizedUrl).hostname;
      } catch (e) {
      }
      var firstChunkReceived = false;
      var startTime = Date.now();
      var handshakeIndex = 0;
      var handshakeSpinners = ["\u280B", "\u2819", "\u2839", "\u2838", "\u283C", "\u2834", "\u2826", "\u2827", "\u2807", "\u280F"];
      state.activeTimer = setInterval(function() {
        var elapsedSec = (Date.now() - startTime) / 1e3;
        var elapsed = elapsedSec.toFixed(1);
        if (els.loadingElapsed) els.loadingElapsed.textContent = elapsed + "s";
        if (!firstChunkReceived) {
          if (elapsedSec >= 5 && els.loadingHeadline) {
            els.loadingHeadline.textContent = "Awaiting temporal stream from " + hostName + "...";
          } else if (elapsedSec >= 2.5 && els.loadingHeadline) {
            els.loadingHeadline.textContent = "Transmitting HTTP request to " + hostName + "...";
          } else if (elapsedSec >= 1 && els.loadingHeadline) {
            els.loadingHeadline.textContent = "Connecting to " + hostName + "...";
          }
          if (els.loadingStreamPreview) {
            handshakeIndex++;
            var spin = handshakeSpinners[handshakeIndex % handshakeSpinners.length];
            var lines = [
              "<!-- Handshaking with temporal node " + normalizedUrl + " (" + dateStr + ")... [" + spin + "] -->"
            ];
            if (elapsedSec >= 1) {
              lines.push("<!-- [" + elapsed + "s] DNS route resolved: " + hostName + " (epoch " + era.year + ") OK -->");
            }
            if (elapsedSec >= 2.4) {
              lines.push("<!-- [" + elapsed + "s] TCP connection established (latency: 38ms)... -->");
            }
            if (elapsedSec >= 3.8) {
              lines.push("<!-- [" + elapsed + "s] HTTP GET / transmitted. Awaiting temporal stream... [" + spin + "] -->");
            }
            if (elapsedSec >= 6.5) {
              lines.push("<!-- [" + elapsed + "s] Temporal synthesis in progress... [" + spin + "] -->");
            }
            els.loadingStreamPreview.textContent = lines.join("\n");
          }
        }
      }, 120);
      var planDomain = extractDomain(normalizedUrl) || homepageUrl;
      var existingPlanEntry = getCachedSitePlan(planDomain, dateStr, state.settings.timelineDivergence);
      var needsPlan = !existingPlanEntry;
      var needsHomepageFirst = !isHome && (!state.pageCache[homeCacheKey] || !state.pageCache[homeCacheKey].html);
      var stages = resolveNavigationStages(needsPlan, needsHomepageFirst);
      var existingHomepageHtml = state.pageCache[homeCacheKey] && state.pageCache[homeCacheKey].html || "";
      var priorHomepage = findClosestHomepage(
        state.pageCache,
        homepageUrl,
        dateStr,
        state.settings.timelineDivergence
      );
      function streamTargetPage(resolvedHomepageHtml, planEntry) {
        var stage = stageLabel(stages, "page");
        var hasPrepStages = stages.length > 1;
        var tlProf = getTimelineDivergenceProfile(state.settings.timelineDivergence, era.year);
        var profileId = resolveBrowserProfile(planEntry);
        state.activeBrowserProfile = profileId;
        showLoadingOverlay({
          eraKey: era.eraKey,
          dialogTitle: era.browserName + " \u2014 " + stage + "Transferring from " + hostName,
          headline: stage + "Contacting host: " + hostName + "...",
          subline: "Temporal coordinates: " + era.formattedLong + " \u2022 " + tlProf.badgeText + (dayMemes && dayMemes.length ? " \u2022 \u{1F3AD} " + dayMemes.slice(0, 3).join(", ") + "..." : "") + (resolvedHomepageHtml && !isHome ? " \u2022 Cohesive Site Context Active" : "") + " \u2022 Model: " + state.settings.pageModel,
          progressPct: hasPrepStages ? 50 : 8,
          bytesText: "0.0 KB received"
        });
        setStatusText(stage + "Connecting to " + hostName + " (" + era.formattedShort + " \u2022 " + tlProf.shortLabel + ")...");
        var streamWriter = null;
        if (els.dreamFrame) {
          els.dreamFrame.hidden = false;
          if (els.homeScreen) els.homeScreen.hidden = true;
          try {
            if (els.dreamFrame.contentDocument) {
              var substitutedJs = runtime_runtime_default.replace(
                "__BASE_URL__",
                JSON.stringify(normalizedUrl || "http://www.example.com/")
              );
              streamWriter = new ProgressiveHtmlWriter(els.dreamFrame.contentDocument, {
                initialStyle: bridge_runtime_default,
                initialEraStyle: buildEraStylesheetCss(profileId),
                initialScript: substitutedJs,
                onImageRendered: function(slot) {
                  handleDiscoveredImages([slot], dateStr, postToIframe, setStatusImages, normalizedUrl);
                }
              });
              streamWriter.open();
              state.activeStreamWriter = streamWriter;
            }
          } catch (e) {
            console.warn("Could not open iframe for progressive streaming:", e);
            streamWriter = null;
          }
        }
        var promptBundle = buildDreamPrompt({
          url: normalizedUrl,
          date: dateStr,
          timelineDivergence: state.settings.timelineDivergence,
          homepageUrl,
          homepageHtml: resolvedHomepageHtml || "",
          priorHomepageHtml: isHome && priorHomepage ? priorHomepage.html : "",
          priorHomepageDate: isHome && priorHomepage ? priorHomepage.date : "",
          referrerUrl,
          referrerHtml,
          navContext: navCtx,
          imageMode: state.settings.imageMode,
          imageEngine: state.settings.imageEngine,
          maxImagesPerPage: state.settings.maxImagesPerPage,
          memes: dayMemes,
          sitePlanText: formatSitePlanForPrompt(planEntry),
          browserProfile: profileId
        });
        var messages = [
          { role: "system", content: promptBundle.systemPrompt },
          { role: "user", content: promptBundle.userPrompt }
        ];
        function onStreamChunk(delta, accumulated) {
          firstChunkReceived = true;
          var kb = (accumulated.length / 1024).toFixed(1);
          var basePct = hasPrepStages ? 50 : 10;
          var spanPct = hasPrepStages ? 46 : 85;
          var pct = Math.min(96, basePct + Math.round(accumulated.length / 7500 * spanPct));
          if (streamWriter) {
            streamWriter.writeChunk(accumulated);
          }
          updateLoadingOverlayProgress({
            headline: stage + "Transferring page from " + hostName + "...",
            bytesText: kb + " KB received",
            progressPct: pct
          });
          setStatusText(stage + "Receiving " + hostName + " (" + kb + " KB transferred)...");
        }
        function onStreamComplete(finalText, error) {
          if (state.activeRequest) {
            state.activeRequest = null;
          }
          if (state.activeTimer) {
            clearInterval(state.activeTimer);
            state.activeTimer = null;
          }
          hideLoadingOverlay();
          if (error) {
            if (streamWriter && streamWriter.written && streamWriter.written.length > 0) {
              streamWriter.close();
              ensureBridgeInDocument(streamWriter.doc, normalizedUrl, dateStr, profileId);
              setStatusProgress(null);
              setStatusText("Stopped receiving " + hostName + " (" + error + ")");
              return;
            }
            renderEraErrorPage(normalizedUrl, dateStr, error);
            return;
          }
          var cleanHtml = extractHtml(finalText);
          if (!cleanHtml) {
            renderEraErrorPage(normalizedUrl, dateStr, "Model returned an empty document.");
            return;
          }
          var pageTitle = extractTitleFromHtml(cleanHtml, normalizedUrl);
          var entryObj = {
            url: normalizedUrl,
            date: dateStr,
            title: pageTitle,
            html: cleanHtml,
            browserProfile: profileId,
            timestamp: Date.now()
          };
          state.pageCache[cacheKey] = entryObj;
          if (isHome) {
            state.pageCache[homeCacheKey] = {
              url: homepageUrl,
              date: dateStr,
              title: pageTitle,
              html: cleanHtml,
              browserProfile: profileId,
              timestamp: Date.now()
            };
          }
          savePageCache(state.pageCache);
          renderRecentHistory(navigateToDream);
          if (opts.pushHistory !== false) {
            pushHistory({
              url: normalizedUrl,
              date: dateStr,
              title: pageTitle,
              html: cleanHtml,
              browserProfile: profileId
            });
            updateNavButtons();
          }
          state.currentRawHtml = cleanHtml;
          state.currentNavigationUrl = normalizedUrl;
          state.currentNavigationDate = dateStr;
          if (streamWriter && streamWriter.hasOpened) {
            streamWriter.close();
            ensureBridgeInDocument(streamWriter.doc, normalizedUrl, dateStr, profileId);
            var winTitle = document.getElementById("window-title");
            if (winTitle) winTitle.textContent = pageTitle + " - " + era.browserName;
            if (typeof document !== "undefined") {
              document.title = (pageTitle || normalizedUrl) + " \u2014 [" + normalizedUrl + "] (" + era.badgeLabel + ") - Browser of Dreams";
            }
            setStatusProgress(null);
            setStatusText("Document: Done (" + normalizedUrl + ")");
          } else {
            mountHtmlInViewport(cleanHtml, normalizedUrl, dateStr, false, profileId);
          }
        }
        state.activeRequest = dispatchStreaming(messages, onStreamChunk, onStreamComplete);
      }
      function streamSitePlan(next) {
        var stage = stageLabel(stages, "site-plan");
        var tlProf = getTimelineDivergenceProfile(state.settings.timelineDivergence, era.year);
        showLoadingOverlay({
          eraKey: era.eraKey,
          dialogTitle: era.browserName + " \u2014 " + stage + "Planning " + hostName,
          headline: stage + "Drafting site plan for " + hostName + "...",
          subline: "Temporal coordinates: " + era.formattedLong + " \u2022 " + tlProf.badgeText + " \u2022 Model: " + state.settings.pageModel,
          progressPct: 4,
          bytesText: "0.0 KB (Site Plan)"
        });
        setStatusText(stage + "Planning " + hostName + "...");
        var bundle = buildSitePlanPrompt({
          url: normalizedUrl,
          date: dateStr,
          timelineDivergence: state.settings.timelineDivergence
        });
        var messages = [
          { role: "system", content: bundle.systemPrompt },
          { role: "user", content: bundle.userPrompt }
        ];
        state.activeRequest = dispatchStreaming(messages, function(_delta, accumulated) {
          firstChunkReceived = true;
          var kb = (accumulated.length / 1024).toFixed(1);
          updateLoadingOverlayProgress({
            headline: stage + "Drafting site plan for " + hostName + "...",
            bytesText: kb + " KB (Site Plan)",
            progressPct: Math.min(14, 4 + Math.round(accumulated.length / 3e3 * 10))
          });
          setStatusText(stage + "Receiving site plan (" + kb + " KB)...");
        }, function(finalText, error) {
          state.activeRequest = null;
          if (error) {
            cancelActiveGeneration();
            renderEraErrorPage(normalizedUrl, dateStr, error);
            return;
          }
          var text = normalizeSitePlan(finalText);
          var parsedProfile = parseBrowserProfileFromPlan(text);
          var cacheable = text.length >= MIN_SITE_PLAN_CHARS;
          var entry = !text ? null : cacheable ? saveSitePlan({
            domain: planDomain,
            date: dateStr,
            divergence: state.settings.timelineDivergence,
            text,
            browserProfile: parsedProfile
          }) : { text, browserProfile: parsedProfile };
          next(entry);
        }, { sitePlan: true });
      }
      function streamHomepage(planEntry, next) {
        var stage = stageLabel(stages, "homepage");
        var planText = formatSitePlanForPrompt(planEntry);
        var homeProfileId = resolveBrowserProfile(planEntry);
        showLoadingOverlay({
          eraKey: era.eraKey,
          dialogTitle: era.browserName + " \u2014 " + stage + "Building Site Homepage (" + hostName + ")",
          headline: stage + "Generating canonical homepage (" + homepageUrl + ")...",
          subline: "Establishing site branding & layout before rendering " + normalizedUrl,
          progressPct: 16,
          bytesText: "0.0 KB (Homepage)"
        });
        setStatusText(stage + "Generating homepage " + homepageUrl + "...");
        var homePromptBundle = buildDreamPrompt({
          url: homepageUrl,
          date: dateStr,
          timelineDivergence: state.settings.timelineDivergence,
          homepageUrl,
          homepageHtml: "",
          priorHomepageHtml: priorHomepage ? priorHomepage.html : "",
          priorHomepageDate: priorHomepage ? priorHomepage.date : "",
          referrerUrl: "",
          referrerHtml: "",
          navContext: null,
          seedTargetContext: {
            targetSubpageUrl: normalizedUrl,
            navContext: navCtx
          },
          imageMode: state.settings.imageMode,
          imageEngine: state.settings.imageEngine,
          maxImagesPerPage: state.settings.maxImagesPerPage,
          memes: dayMemes,
          sitePlanText: planText,
          browserProfile: homeProfileId
        });
        var homeMessages = [
          { role: "system", content: homePromptBundle.systemPrompt },
          { role: "user", content: homePromptBundle.userPrompt }
        ];
        state.activeRequest = dispatchStreaming(homeMessages, function(_delta, accumulated) {
          firstChunkReceived = true;
          var kb = (accumulated.length / 1024).toFixed(1);
          updateLoadingOverlayProgress({
            headline: stage + "Generating site homepage (" + hostName + ")...",
            bytesText: kb + " KB (Homepage)",
            progressPct: Math.min(48, 16 + Math.round(accumulated.length / 7500 * 32))
          });
          setStatusText(stage + "Receiving homepage " + homepageUrl + " (" + kb + " KB)...");
        }, function(homeFinalText, homeError) {
          state.activeRequest = null;
          if (homeError) {
            cancelActiveGeneration();
            renderEraErrorPage(normalizedUrl, dateStr, homeError);
            return;
          }
          var homeCleanHtml = extractHtml(homeFinalText);
          if (homeCleanHtml) {
            state.pageCache[homeCacheKey] = {
              url: homepageUrl,
              date: dateStr,
              title: extractTitleFromHtml(homeCleanHtml, homepageUrl),
              html: homeCleanHtml,
              browserProfile: homeProfileId,
              timestamp: Date.now()
            };
            savePageCache(state.pageCache);
            renderRecentHistory(navigateToDream);
          }
          next(homeCleanHtml || "");
        });
      }
      function beginHomepage(planEntry) {
        if (needsHomepageFirst) {
          streamHomepage(planEntry, function(homeHtml) {
            streamTargetPage(homeHtml, planEntry);
          });
        } else {
          streamTargetPage(existingHomepageHtml, planEntry);
        }
      }
      if (needsPlan) {
        streamSitePlan(function(entry) {
          beginHomepage(entry);
        });
      } else {
        beginHomepage(existingPlanEntry);
      }
    }
    var cachedMemes = getCachedMemesForDate(dateStr);
    if (cachedMemes) {
      updateMemeStatusUI(cachedMemes, dateStr);
      startNavigationWithMemes(cachedMemes);
    } else {
      cancelActiveGeneration();
      showLoadingOverlay({
        eraKey: era.eraKey,
        dialogTitle: era.browserName + " \u2014 Synchronizing Temporal Zeitgeist",
        headline: "Gathering cultural zeitgeist keywords for " + dateStr + "...",
        subline: "Temporal coordinates: " + era.formattedLong + " \u2022 Querying 10 era memes (quick response, stream & reasoning disabled)",
        progressPct: 4,
        bytesText: "Connecting to timeline...",
        streamPreview: "<!-- Querying cultural zeitgeist keywords for " + dateStr + " prior to webpage generation... -->"
      });
      setStatusText("\u{1F52E} Gathering cultural zeitgeist keywords for " + dateStr + "...");
      var provAdapter = getProvider(state.settings.pageProvider);
      var provConf = resolveConfig(state.settings, state.settings.pageProvider);
      fetchDayMemesFromModel({
        date: dateStr,
        timelineDivergence: state.settings.timelineDivergence,
        providerAdapter: provAdapter,
        providerConfig: provConf,
        hasCredentials: hasValidCredentials(state.settings, state.settings.pageProvider),
        onStart: function() {
          if (els.statusMemes) els.statusMemes.textContent = "\u{1F52E} Memes: Fetching...";
        },
        onUIUpdate: function(memes, d) {
          updateMemeStatusUI(memes, d);
        }
      }, function(memes) {
        if (els.dateInput && els.dateInput.value !== dateStr && els.dateInput.value !== "") {
          return;
        }
        startNavigationWithMemes(memes);
      });
    }
  }

  // src/data/bookmarks.js
  var BOOKMARK_FOLDERS = [
    {
      id: "news",
      name: "News",
      items: [
        { label: "nycnews.com (Dec 31, 1999)", url: "nycnews.com", date: "1999-12-31" },
        { label: "CNN.com", url: "cnn.com", date: "2001-09-11" },
        { label: "Drudge Report", url: "drudgereport.com", date: "1998-01-17" },
        { label: "BBC News", url: "news.bbc.co.uk", date: "1997-09-01" },
        { label: "NYTimes election night", url: "nytimes.com", date: "2008-11-05" },
        { label: "Macworld live", url: "macrumors.com", date: "2007-01-09" }
      ]
    },
    {
      id: "portals",
      name: "Portals",
      items: [
        { label: "Yahoo! Portal (1997)", url: "yahoo.com", date: "1997-11-20" },
        { label: "AltaVista", url: "altavista.com", date: "1996-06-01" },
        { label: "Lycos", url: "lycos.com", date: "1995-08-01" },
        { label: "Excite", url: "excite.com", date: "1996-10-01" },
        { label: "Ask Jeeves", url: "askjeeves.com", date: "1999-04-01" },
        { label: "Google", url: "google.com", date: "1998-09-27" },
        { label: "AOL.com", url: "aol.com", date: "1996-01-15" }
      ]
    },
    {
      id: "shops",
      name: "Shops",
      items: [
        { label: "Pets.com (1999)", url: "pets.com", date: "1999-11-15" },
        { label: "eBay Beanie Babies", url: "ebay.com", date: "1998-06-01" },
        { label: "Amazon Books", url: "amazon.com", date: "1997-07-16" },
        { label: "Webvan", url: "webvan.com", date: "1999-06-01" },
        { label: "Kozmo.com", url: "kozmo.com", date: "2000-03-01" }
      ]
    },
    {
      id: "social",
      name: "Social",
      items: [
        { label: "MySpace (2005)", url: "myspace.com/tom", date: "2005-08-14" },
        { label: "Digg (2007)", url: "digg.com", date: "2007-05-10" },
        { label: "Friendster", url: "friendster.com", date: "2003-06-01" },
        { label: "LiveJournal", url: "livejournal.com", date: "2001-04-01" },
        { label: "Slashdot", url: "slashdot.org", date: "1998-10-01" },
        { label: "Reddit", url: "reddit.com", date: "2005-06-23" },
        { label: "Thefacebook", url: "thefacebook.com", date: "2004-02-04" }
      ]
    },
    {
      id: "homepages",
      name: "Homepages",
      items: [
        { label: "GeoCities UFO vault", url: "geocities.com/Area51/Vault/4821", date: "1997-08-19" },
        { label: "Angelfire shrine", url: "angelfire.com/scifi/xfileshrine", date: "1998-05-12" },
        { label: "Hampsterdance", url: "hampsterdance.com", date: "1999-03-01" },
        { label: "Y2K Readiness", url: "y2kreadiness.gov", date: "1999-12-31" },
        { label: "1987 Dial-Up BBS", url: "bbs.cyberpunk-nexus.net", date: "1987-09-02" }
      ]
    },
    {
      id: "later",
      name: "Later",
      items: [
        { label: "Orbital Transit (2052)", url: "orbital-transit.space", date: "2052-04-19" },
        { label: "Olympus Mons Gazette", url: "olympus-mons-gazette.mars", date: "2048-11-03" }
      ]
    }
  ];

  // src/ui/bookmarks.js
  var onNavigate = null;
  var openMenu = null;
  var docCloser = null;
  function closeMenu() {
    if (openMenu && openMenu.el && openMenu.el.parentNode) {
      openMenu.el.parentNode.removeChild(openMenu.el);
    }
    if (openMenu && openMenu.anchor) {
      openMenu.anchor.setAttribute("aria-expanded", "false");
    }
    openMenu = null;
    if (docCloser) {
      document.removeEventListener("click", docCloser, true);
      document.removeEventListener("keydown", docCloser, true);
      docCloser = null;
    }
  }
  function openBookmark(item) {
    closeMenu();
    if (!item || !item.url) return;
    if (els.urlInput) els.urlInput.value = item.url;
    if (els.dateInput) els.dateInput.value = item.date;
    applyEraTheme(item.date);
    if (onNavigate) {
      onNavigate(item.url, item.date, { pushHistory: true, forceReload: false });
    }
  }
  function placeMenu(menu, anchor) {
    var rect = anchor.getBoundingClientRect();
    var margin = 8;
    menu.style.visibility = "hidden";
    menu.style.left = "0px";
    menu.style.top = "0px";
    var width = menu.offsetWidth;
    var height = menu.offsetHeight;
    var left = rect.left;
    if (left + width > window.innerWidth - margin) {
      left = Math.max(margin, window.innerWidth - width - margin);
    }
    var top = rect.bottom + 2;
    if (top + height > window.innerHeight - margin && rect.top > height) {
      top = rect.top - height - 2;
    }
    menu.style.left = left + "px";
    menu.style.top = top + "px";
    menu.style.visibility = "visible";
  }
  function attachCloser(anchor) {
    docCloser = function(ev) {
      if (ev.type === "keydown") {
        if (ev.key === "Escape") closeMenu();
        return;
      }
      if (openMenu && openMenu.el && openMenu.el.contains(ev.target)) return;
      if (anchor && anchor.contains(ev.target)) return;
      closeMenu();
    };
    document.addEventListener("click", docCloser, true);
    document.addEventListener("keydown", docCloser, true);
  }
  function showMenu(anchor, build) {
    if (openMenu && openMenu.anchor === anchor) {
      closeMenu();
      return;
    }
    closeMenu();
    var menu = document.createElement("div");
    menu.className = "bookmark-menu";
    menu.setAttribute("role", "menu");
    build(menu);
    document.body.appendChild(menu);
    placeMenu(menu, anchor);
    anchor.setAttribute("aria-expanded", "true");
    openMenu = { el: menu, anchor };
    attachCloser(anchor);
  }
  function addItemButton(parent, item) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "bookmark-menu-item";
    btn.setAttribute("role", "menuitem");
    btn.textContent = item.label;
    btn.title = item.url + " \xB7 " + item.date;
    btn.addEventListener("click", function(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      openBookmark(item);
    });
    parent.appendChild(btn);
  }
  function showFolder(anchor, folder) {
    showMenu(anchor, function(menu) {
      for (var i = 0; i < folder.items.length; i++) {
        addItemButton(menu, folder.items[i]);
      }
    });
  }
  function openAllBookmarksMenu(anchor) {
    if (!anchor) return;
    showMenu(anchor, function(menu) {
      menu.classList.add("bookmark-menu-all");
      for (var f = 0; f < BOOKMARK_FOLDERS.length; f++) {
        var folder = BOOKMARK_FOLDERS[f];
        var heading = document.createElement("div");
        heading.className = "bookmark-menu-heading";
        heading.textContent = folder.name;
        menu.appendChild(heading);
        for (var i = 0; i < folder.items.length; i++) {
          addItemButton(menu, folder.items[i]);
        }
      }
    });
  }
  function renderBookmarks(navigate) {
    onNavigate = navigate;
    var bar = document.getElementById("bookmarks-bar");
    if (!bar) return;
    bar.innerHTML = "";
    var title = document.createElement("span");
    title.className = "bookmarks-title";
    title.textContent = "Bookmarks:";
    bar.appendChild(title);
    for (var f = 0; f < BOOKMARK_FOLDERS.length; f++) {
      (function(folder) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "bookmark-chip bookmark-folder";
        btn.setAttribute("aria-haspopup", "menu");
        btn.setAttribute("aria-expanded", "false");
        btn.textContent = folder.name;
        btn.title = folder.items.length + " bookmarks";
        btn.addEventListener("click", function(ev) {
          ev.preventDefault();
          ev.stopPropagation();
          showFolder(btn, folder);
        });
        bar.appendChild(btn);
      })(BOOKMARK_FOLDERS[f]);
    }
  }

  // src/ui/source-modal.js
  function openSourceModal(html) {
    if (!els.sourceModal) return;
    var content = String(html || "");
    if (els.sourceTextarea) els.sourceTextarea.value = content;
    if (els.sourceCharCount) els.sourceCharCount.textContent = content.length.toLocaleString() + " characters";
    els.sourceModal.hidden = false;
  }
  function closeSourceModal() {
    if (els.sourceModal) els.sourceModal.hidden = true;
  }
  function copySourceToClipboard() {
    if (!els.sourceTextarea) return;
    els.sourceTextarea.select();
    try {
      navigator.clipboard.writeText(els.sourceTextarea.value);
      if (els.btnCopySource) {
        var orig = els.btnCopySource.textContent;
        els.btnCopySource.textContent = "\u2713 Copied!";
        setTimeout(function() {
          if (els.btnCopySource) els.btnCopySource.textContent = orig;
        }, 1500);
      }
    } catch (e) {
      document.execCommand("copy");
    }
  }
  function downloadSourceFile() {
    if (!els.sourceTextarea) return;
    var text = els.sourceTextarea.value;
    var blob = new Blob([text], { type: "text/html;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "dream-source.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // src/main.js
  function postToIframe2(message) {
    if (els.dreamFrame && els.dreamFrame.contentWindow) {
      els.dreamFrame.contentWindow.postMessage(message, "*");
    }
  }
  function initApp() {
    if (typeof document === "undefined") return;
    initDOM();
    if (els.omniboxForm) {
      els.omniboxForm.addEventListener("submit", function(ev) {
        ev.preventDefault();
        var targetUrl = els.urlInput.value.trim();
        if (!targetUrl) return;
        applyEraTheme(els.dateInput.value);
        navigateToDream(targetUrl, els.dateInput.value, { pushHistory: true, forceReload: false });
      });
    }
    if (els.dateInput) {
      els.dateInput.addEventListener("change", function() {
        applyEraTheme(els.dateInput.value);
      });
      els.dateInput.addEventListener("keydown", function(ev) {
        if (ev.key !== "Enter") return;
        ev.preventDefault();
        if (els.omniboxForm && typeof els.omniboxForm.requestSubmit === "function") {
          els.omniboxForm.requestSubmit();
        }
      });
    }
    if (els.btnPrevDay) {
      els.btnPrevDay.addEventListener("click", function() {
        els.dateInput.value = shiftDate(els.dateInput.value, -1);
        applyEraTheme(els.dateInput.value);
      });
    }
    if (els.btnNextDay) {
      els.btnNextDay.addEventListener("click", function() {
        els.dateInput.value = shiftDate(els.dateInput.value, 1);
        applyEraTheme(els.dateInput.value);
      });
    }
    if (els.btnBack) {
      els.btnBack.addEventListener("click", function() {
        var prev = goBack();
        if (prev) {
          els.urlInput.value = prev.url;
          els.dateInput.value = prev.date;
          applyEraTheme(prev.date);
          updateNavButtons();
          mountHtmlInViewport(prev.html, prev.url, prev.date, true, prev.browserProfile);
        }
      });
    }
    if (els.btnForward) {
      els.btnForward.addEventListener("click", function() {
        var next = goForward();
        if (next) {
          els.urlInput.value = next.url;
          els.dateInput.value = next.date;
          applyEraTheme(next.date);
          updateNavButtons();
          mountHtmlInViewport(next.html, next.url, next.date, true, next.browserProfile);
        }
      });
    }
    if (els.btnReload) {
      els.btnReload.addEventListener("click", function() {
        var curUrl = els.urlInput.value.trim();
        var curDate = els.dateInput.value;
        if (curUrl && curUrl !== "about:dreams") {
          navigateToDream(curUrl, curDate, { pushHistory: false, forceReload: true });
        } else {
          showHomeScreen(navigateToDream);
        }
      });
    }
    if (els.btnStop) {
      els.btnStop.addEventListener("click", cancelActiveGeneration);
    }
    if (els.loadingCancelBtn) {
      els.loadingCancelBtn.addEventListener("click", cancelActiveGeneration);
    }
    if (els.loadingStopBtn) {
      els.loadingStopBtn.addEventListener("click", cancelActiveGeneration);
    }
    if (els.btnHome) {
      els.btnHome.addEventListener("click", function() {
        showHomeScreen(navigateToDream);
      });
    }
    if (els.btnSource) {
      els.btnSource.addEventListener("click", function() {
        openSourceModal(state.currentRawHtml);
      });
    }
    if (els.sourceCloseBtn) els.sourceCloseBtn.addEventListener("click", closeSourceModal);
    if (els.sourceDoneBtn) els.sourceDoneBtn.addEventListener("click", closeSourceModal);
    if (els.btnCopySource) els.btnCopySource.addEventListener("click", copySourceToClipboard);
    if (els.btnDownloadSource) els.btnDownloadSource.addEventListener("click", downloadSourceFile);
    if (els.btnSettings) {
      els.btnSettings.addEventListener("click", openSettingsModal);
    }
    if (els.providerBadge) {
      els.providerBadge.addEventListener("click", openSettingsModal);
    }
    if (els.homeOpenSettingsBtn) {
      els.homeOpenSettingsBtn.addEventListener("click", openSettingsModal);
    }
    initSettingsModalEvents(function(_updatedSettings) {
      renderRecentHistory(navigateToDream);
    });
    syncModelPickers();
    function clearAllCaches() {
      state.pageCache = {};
      state.imageMemoryCache = {};
      state.domainImageCache = resetDomainImageCache();
      state.sitePlanCache = {};
      clearMemeCache();
      try {
        localStorage.removeItem("browser_of_dreams_pages_v1");
        localStorage.removeItem("browser_of_dreams_memes_v1");
        localStorage.removeItem(STORAGE_KEY_SITE_PLANS);
      } catch (e) {
      }
      resetSitePlanCache();
      state.sitePlanCache = loadSitePlanCache();
      renderRecentHistory(navigateToDream);
      fetchDayMemesFromModel({
        date: els.dateInput.value,
        timelineDivergence: state.settings.timelineDivergence,
        providerAdapter: getProvider(state.settings.pageProvider),
        providerConfig: resolveConfig(state.settings, state.settings.pageProvider),
        hasCredentials: hasValidCredentials(state.settings, state.settings.pageProvider),
        onUIUpdate: updateMemeStatusUI
      });
      setStatusText("Dream page & zeitgeist memes cache cleared.");
    }
    if (els.btnClearCache) els.btnClearCache.addEventListener("click", clearAllCaches);
    if (els.btnClearCacheHome) els.btnClearCacheHome.addEventListener("click", clearAllCaches);
    if (els.menuHomeBtn) {
      els.menuHomeBtn.addEventListener("click", function() {
        showHomeScreen(navigateToDream);
      });
    }
    if (els.menuSourceBtn) {
      els.menuSourceBtn.addEventListener("click", function() {
        openSourceModal(state.currentRawHtml);
      });
    }
    if (els.menuBookmarksBtn) {
      els.menuBookmarksBtn.setAttribute("aria-haspopup", "menu");
      els.menuBookmarksBtn.setAttribute("aria-expanded", "false");
      els.menuBookmarksBtn.addEventListener("click", function(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        openAllBookmarksMenu(els.menuBookmarksBtn);
      });
    }
    if (els.menuSettingsBtn) {
      els.menuSettingsBtn.addEventListener("click", openSettingsModal);
    }
    setupWindowControls({
      btnMin: els.btnWinMin,
      btnMax: els.btnWinMax,
      btnClose: els.btnWinClose
    }, function() {
      showHomeScreen(navigateToDream);
    });
    function updatePwaUI() {
      var standalone = isStandaloneMode();
      var canPrompt = canPromptInstall();
      syncStandaloneDOM(Boolean(state.settings.showStandaloneTitlebar));
      if (els.btnInstallApp) {
        if (standalone) {
          els.btnInstallApp.hidden = true;
        } else if (canPrompt) {
          els.btnInstallApp.hidden = false;
        } else {
          els.btnInstallApp.hidden = true;
        }
      }
      if (els.menuInstallBtn) {
        if (standalone) {
          els.menuInstallBtn.hidden = true;
        } else {
          els.menuInstallBtn.hidden = false;
          els.menuInstallBtn.title = "Install Web App";
        }
      }
    }
    if (els.btnInstallApp) {
      els.btnInstallApp.addEventListener("click", function() {
        promptInstall();
      });
    }
    if (els.menuInstallBtn) {
      els.menuInstallBtn.addEventListener("click", function() {
        if (canPromptInstall()) {
          promptInstall();
        } else {
          openSettingsModal();
        }
      });
    }
    onPwaStateChange(updatePwaUI);
    initPWA({ showStandaloneTitlebar: state.settings.showStandaloneTitlebar });
    updatePwaUI();
    if (els.statusMemes) {
      els.statusMemes.addEventListener("click", function() {
        var curDate = els.dateInput.value;
        var curMemes = getCachedMemesForDate(curDate) || DayMemesEngine.getFallbackMemes(curDate);
        alert("\u{1F3AD} Cultural Zeitgeist Memes (" + curDate + "):\n\n" + curMemes.map(function(m, i) {
          return i + 1 + ". " + m;
        }).join("\n") + '\n\n(These 10 keywords are lightly suggested to the model when dreaming pages for this date: "you may consider content related to these keywords if they fit the content")');
      });
    }
    window.addEventListener("message", function(ev) {
      if (!els.dreamFrame || ev.source !== els.dreamFrame.contentWindow) return;
      var msg = ev.data;
      if (!msg || typeof msg !== "object") return;
      if (msg.type === "DREAM_HOVER") {
        if (msg.url) {
          setStatusText("Link: " + msg.url);
        } else {
          setStatusText("Document: Done");
        }
      } else if (msg.type === "DREAM_NAVIGATE") {
        if (msg.url) {
          navigateToDream(msg.url, els.dateInput.value, {
            pushHistory: true,
            forceReload: false,
            navContext: {
              referrerUrl: msg.referrerUrl,
              linkText: msg.linkText,
              linkContext: msg.linkContext,
              formData: msg.formData
            }
          });
        }
      } else if (msg.type === "DREAM_IMAGES_DISCOVERED") {
        handleDiscoveredImages(msg.slots || [], els.dateInput.value, postToIframe2, setStatusImages, msg.url);
      } else if (msg.type === "DREAM_GENERATE_SINGLE_IMAGE") {
        setStatusImages("\u{1F5BC}\uFE0F Generating image...");
        var curUrl = msg.url || state.currentNavigationUrl || getCurrentEntry() && getCurrentEntry().url;
        var curDate = els.dateInput.value || state.currentNavigationDate || getCurrentEntry() && getCurrentEntry().date;
        if (curUrl) {
          var cKey = makeCacheKey(curUrl, curDate, state.settings.timelineDivergence);
          if (state.pageCache[cKey] && state.pageCache[cKey].slotImages) {
            delete state.pageCache[cKey].slotImages[msg.slotId];
            savePageCache(state.pageCache);
          }
        }
        generateSingleSlotImage({
          slotId: msg.slotId,
          prompt: msg.prompt,
          role: msg.role || "photo",
          aspectRatio: msg.aspectRatio || "1:1",
          width: msg.width,
          height: msg.height,
          targetUrl: curUrl,
          targetDate: curDate,
          epoch: state.navigationEpoch,
          forceRegenerate: true
        }, curDate, postToIframe2, function() {
          setStatusImages("\u{1F5BC}\uFE0F Image updated");
        });
      }
    });
    var initialDate = els.dateInput && els.dateInput.value || "1999-12-31";
    applyEraTheme(initialDate);
    syncTimelineDivergenceUI(state.settings.timelineDivergence || 0);
    updateProviderStatusUI();
    renderBookmarks(navigateToDream);
    renderFeaturedPortals(navigateToDream);
    renderRecentHistory(navigateToDream);
    updateNavButtons();
    fetchDayMemesFromModel({
      date: initialDate,
      timelineDivergence: state.settings.timelineDivergence,
      providerAdapter: getProvider(state.settings.pageProvider),
      providerConfig: resolveConfig(state.settings, state.settings.pageProvider),
      hasCredentials: hasValidCredentials(state.settings, state.settings.pageProvider),
      onUIUpdate: updateMemeStatusUI
    });
  }
  var BrowserOfDreams = {
    AgentPlatform,
    GeminiThinking,
    GeminiAdapter,
    AgentPlatformAdapter,
    OpenRouterAdapter,
    OpenCodeRoute,
    OpenCodeAdapter,
    CommandCodeAdapter,
    LocalAdapter,
    TextArtGenerator,
    DayMemesEngine,
    SUPPORTED_ASPECT_RATIOS,
    GEMINI_SUPPORTED_ASPECT_RATIOS,
    normalizeSupportedAspectRatio,
    getEraInfo,
    getTimelineDivergenceProfile,
    normalizeDreamUrl,
    getHomepageUrl,
    isHomepageUrl,
    compactHtmlForContext,
    buildDreamPrompt,
    buildSitePlanPrompt,
    normalizeSitePlan,
    extractHtml,
    extractTitleFromHtml,
    extractDomain,
    loadDomainImageCache,
    saveDomainImageCache,
    saveDomainImage,
    getAvailableDomainImages,
    findMatchingDomainImage,
    formatImageDescriptor,
    resolveTimePeriod,
    makeDomainImageKey,
    injectBridgeScript,
    ensureBridgeInDocument,
    buildEraStylesheetCss,
    parseBrowserProfileFromPlan,
    ProgressiveHtmlWriter,
    setStatusProgress,
    downscaleImageToSlot,
    handleDiscoveredImages,
    state,
    initApp,
    navigateToDream,
    cancelActiveGeneration,
    pwa: {
      initPWA,
      promptInstall,
      canPromptInstall,
      isStandaloneMode,
      syncStandaloneDOM,
      pwaState,
      setupWindowControls
    }
  };
  if (typeof window !== "undefined") {
    window.BrowserOfDreams = BrowserOfDreams;
    window.AgentPlatform = AgentPlatform;
    window.GeminiThinking = GeminiThinking;
    window.GeminiAdapter = GeminiAdapter;
    window.OpenRouterAdapter = OpenRouterAdapter;
    window.OpenCodeRoute = OpenCodeRoute;
    window.OpenCodeAdapter = OpenCodeAdapter;
    window.CommandCodeAdapter = CommandCodeAdapter;
    window.LocalAdapter = LocalAdapter;
    window.TextArtGenerator = TextArtGenerator;
    window.DayMemesEngine = DayMemesEngine;
    if (typeof document !== "undefined" && typeof document.getElementById === "function") {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initApp);
      } else {
        initApp();
      }
    }
  } else if (typeof globalThis !== "undefined") {
    globalThis.BrowserOfDreams = BrowserOfDreams;
    globalThis.AgentPlatform = AgentPlatform;
    globalThis.GeminiThinking = GeminiThinking;
    globalThis.GeminiAdapter = GeminiAdapter;
    globalThis.OpenRouterAdapter = OpenRouterAdapter;
    globalThis.OpenCodeRoute = OpenCodeRoute;
    globalThis.OpenCodeAdapter = OpenCodeAdapter;
    globalThis.CommandCodeAdapter = CommandCodeAdapter;
    globalThis.LocalAdapter = LocalAdapter;
    globalThis.TextArtGenerator = TextArtGenerator;
    globalThis.DayMemesEngine = DayMemesEngine;
  }
  var main_default = BrowserOfDreams;
  return __toCommonJS(main_exports);
})();
//# sourceMappingURL=app.js.map
