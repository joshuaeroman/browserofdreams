/**
 * Central DOM element registry caching all UI nodes by id.
 */
export const els = {};

export function initDOM() {
  if (typeof document === "undefined") return els;

  els.htmlRoot = document.documentElement;
  els.browserWindow = document.getElementById("browser-window");
  els.titleBar = document.getElementById("title-bar");

  // Header & Status
  els.eraPill = document.getElementById("era-pill");
  els.menuEraPill = document.getElementById("menu-era-pill");
  els.providerBadge = document.getElementById("provider-status-badge");
  els.apiStatusDot = document.getElementById("api-status-dot");
  els.providerSummaryText = document.getElementById("provider-summary-text");

  // Navigation Buttons
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

  // Window Controls
  els.btnWinMin = document.getElementById("win-min");
  els.btnWinMax = document.getElementById("win-max");
  els.btnWinClose = document.getElementById("win-close");
  els.metaThemeColor = document.getElementById("meta-theme-color");

  // Omnibox & Date controls
  els.omniboxForm = document.getElementById("omnibox-form");
  els.urlInput = document.getElementById("url-input");
  els.dateInput = document.getElementById("date-input");
  els.btnPrevDay = document.getElementById("btn-prev-day");
  els.btnNextDay = document.getElementById("btn-next-day");
  els.timelineDivergenceSlider = document.getElementById("timeline-divergence-slider");
  els.timelineDivergenceBadge = document.getElementById("timeline-divergence-badge");
  els.presetSelect = document.getElementById("preset-select");

  // Home Screen
  els.homeScreen = document.getElementById("home-screen");
  els.homeEraBadge = document.getElementById("home-era-badge");
  els.homeApiWarning = document.getElementById("home-api-warning");
  els.homeOpenSettingsBtn = document.getElementById("home-open-settings-btn");
  els.featuredPortalsGrid = document.getElementById("featured-portals-grid");
  els.recentHistorySection = document.getElementById("recent-history-section");
  els.recentHistoryList = document.getElementById("recent-history-list");
  els.btnClearCacheHome = document.getElementById("btn-clear-cache-home");

  // Viewport Frame & Overlay
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

  // Status Bar
  els.statusText = document.getElementById("status-text");
  els.statusProgressPanel = document.getElementById("status-progress-panel");
  els.statusProgressBar = document.getElementById("status-progress-bar");
  els.statusMemes = document.getElementById("status-memes-display");
  els.statusImages = document.getElementById("status-images");
  els.statusDate = document.getElementById("status-date-display");

  // Model strip
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

  // Settings Modal Elements
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
  els.editThinkingRow = document.getElementById("edit-thinking-row");
  els.editThinkingBudget = document.getElementById("edit-thinking-budget");
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

  // Source Modal Elements
  els.sourceModal = document.getElementById("source-modal");
  els.sourceCloseBtn = document.getElementById("source-close-btn");
  els.sourceDoneBtn = document.getElementById("source-done-btn");
  els.sourceTextarea = document.getElementById("source-textarea");
  els.sourceCharCount = document.getElementById("source-char-count");
  els.btnCopySource = document.getElementById("btn-copy-source");
  els.btnDownloadSource = document.getElementById("btn-download-source");

  return els;
}
