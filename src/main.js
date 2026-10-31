// Import bundled CSS via esbuild
import "./styles/index.css";

// Import Core Modules
import { els, initDOM } from "./ui/dom.js";
import { state } from "./core/state.js";
import { DEFAULT_SETTINGS, loadSettings, saveSettings } from "./core/settings.js";
import { loadPageCache, savePageCache, makeCacheKey, loadDomainImageCache, saveDomainImageCache, saveDomainImage, getAvailableDomainImages, findMatchingDomainImage, formatImageDescriptor, resolveTimePeriod, makeDomainImageKey } from "./core/cache.js";
import { getHistoryStack, getHistoryIndex, setHistoryIndex, pushHistory, canGoBack, canGoForward, goBack, goForward, resetHistory } from "./core/history.js";
import { getEraInfo, applyEraTheme } from "./core/era.js";
import { getTimelineDivergenceProfile } from "./core/timeline.js";
import { normalizeDreamUrl, getHomepageUrl, isHomepageUrl, extractDomain } from "./core/urls.js";
import { extractHtml, extractTitleFromHtml, compactHtmlForContext, ProgressiveHtmlWriter } from "./core/html.js";
import { SUPPORTED_ASPECT_RATIOS, GEMINI_SUPPORTED_ASPECT_RATIOS, normalizeSupportedAspectRatio } from "./core/aspect.js";
import { navigateToDream, cancelActiveGeneration, mountHtmlInViewport, renderEraErrorPage } from "./core/navigation.js";

// Import Providers
import { AgentPlatform } from "./providers/gemini/agent-platform.js";
import { GeminiThinking } from "./providers/gemini/thinking.js";
import { GeminiAdapter, AgentPlatformAdapter, STATIC_VERTEX_GEMINI_MODELS, STATIC_GEMINI_IMAGE_MODELS } from "./providers/gemini/index.js";
import { OpenRouterAdapter, STATIC_OR_TEXT_MODELS, STATIC_OR_IMAGE_MODELS, normalizeOpenRouterModelId } from "./providers/openrouter/index.js";
import { CommandCodeAdapter } from "./providers/commandcode/index.js";
import { LocalAdapter } from "./providers/local/index.js";
import { OpenCodeRoute, sessionHeaders, formatOpenCodeHttpError } from "./providers/opencode/route.js";
import { OpenCodeAdapter, OpenCodeZenAdapter, OpenCodeGoAdapter, STATIC_OPENCODE_ZEN_MODELS, STATIC_OPENCODE_GO_MODELS } from "./providers/opencode/index.js";
import { getProvider, registerProvider, hasValidCredentials, getEffectiveImageProvider, resolveConfig, getProviderDisplayName } from "./providers/registry.js";
import { isOpenCodeProvider, isTextArtEngine } from "./providers/adapter.js";

// Import Prompts & Features
import { buildDreamPrompt } from "./prompts/dream-prompt.js";
import { buildDayMemesPrompt, parseMemeList } from "./prompts/memes-prompt.js";
import { buildTextArtPrompts, computePixelGridDimensions, resolveTextArtStyleMode } from "./prompts/text-art-prompt.js";
import { FEATURED_PORTALS } from "./data/portals.js";
import { ERA_FALLBACK_MEMES } from "./data/fallback-memes.js";
import { DayMemesEngine, getCachedMemesForDate, fetchDayMemesFromModel, clearMemeCache } from "./features/memes.js";
import { TextArtGenerator } from "./features/text-art.js";
import { handleDiscoveredImages, generateSingleSlotImage, resolveActiveTextArtModel, downscaleImageToSlot } from "./features/images.js";
import { injectBridgeScript, ensureBridgeInDocument } from "./bridge/inject.js";
import { initPWA, promptInstall, canPromptInstall, isStandaloneMode, onPwaStateChange, setupWindowControls, pwaState, syncStandaloneDOM } from "./features/pwa.js";

// Import UI Controllers
import { setStatusText, setStatusImages, setStatusProgress, updateMemeStatusUI, updateProviderStatusUI, updateEraStatusUI } from "./ui/statusbar.js";
import { updateNavButtons, shiftDate, syncTimelineDivergenceUI } from "./ui/toolbar.js";
import { renderFeaturedPortals, renderRecentHistory, showHomeScreen } from "./ui/home-screen.js";
import { renderBookmarks, openAllBookmarksMenu } from "./ui/bookmarks.js";
import { showLoadingOverlay, updateLoadingOverlayProgress, hideLoadingOverlay } from "./ui/loading-overlay.js";
import { openSettingsModal, closeSettingsModal, initSettingsModalEvents, syncModelPickers } from "./ui/settings-modal.js";
import { openSourceModal, closeSourceModal, copySourceToClipboard, downloadSourceFile } from "./ui/source-modal.js";

function postToIframe(message) {
  if (els.dreamFrame && els.dreamFrame.contentWindow) {
    els.dreamFrame.contentWindow.postMessage(message, "*");
  }
}

export function initApp() {
  if (typeof document === "undefined") return;

  initDOM();

  // Toolbar & Omnibox Event Listeners
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
        mountHtmlInViewport(prev.html, prev.url, prev.date, true);
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
        mountHtmlInViewport(next.html, next.url, next.date, true);
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
    state.domainImageCache = {};
    clearMemeCache();
    try {
      localStorage.removeItem("browser_of_dreams_pages_v1");
      localStorage.removeItem("browser_of_dreams_memes_v1");
      localStorage.removeItem("browser_of_dreams_domain_images_v1");
    } catch (e) {}
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

  // Menu bar buttons
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

  // PWA Installation & Window Controls
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
      alert("🎭 Cultural Zeitgeist Memes (" + curDate + "):\n\n" +
        curMemes.map(function(m, i) { return (i + 1) + ". " + m; }).join("\n") +
        "\n\n(These 10 keywords are lightly suggested to the model when dreaming pages for this date: \"you may consider content related to these keywords if they fit the content\")");
    });
  }

  // Listen for messages from the injected iframe bridge
  window.addEventListener("message", function(ev) {
    // Only accept messages from the dream frame so external pages embedding the
    // app cannot trigger navigation (and billed LLM generation) on the user's behalf
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
      handleDiscoveredImages(msg.slots || [], els.dateInput.value, postToIframe, setStatusImages, msg.url);
    } else if (msg.type === "DREAM_GENERATE_SINGLE_IMAGE") {
      setStatusImages("🖼️ Generating image...");
      var curUrl = msg.url || state.currentNavigationUrl || (getCurrentEntry() && getCurrentEntry().url);
      var curDate = els.dateInput.value || state.currentNavigationDate || (getCurrentEntry() && getCurrentEntry().date);
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
      }, curDate, postToIframe, function() {
        setStatusImages("🖼️ Image updated");
      });
    }
  });

  // Initial Boot
  var initialDate = (els.dateInput && els.dateInput.value) || "1999-12-31";
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

// Global Exports
var BrowserOfDreams = {
  AgentPlatform: AgentPlatform,
  GeminiThinking: GeminiThinking,
  GeminiAdapter: GeminiAdapter,
  AgentPlatformAdapter: AgentPlatformAdapter,
  OpenRouterAdapter: OpenRouterAdapter,
  OpenCodeRoute: OpenCodeRoute,
  OpenCodeAdapter: OpenCodeAdapter,
  CommandCodeAdapter: CommandCodeAdapter,
  LocalAdapter: LocalAdapter,
  TextArtGenerator: TextArtGenerator,
  DayMemesEngine: DayMemesEngine,
  SUPPORTED_ASPECT_RATIOS: SUPPORTED_ASPECT_RATIOS,
  GEMINI_SUPPORTED_ASPECT_RATIOS: GEMINI_SUPPORTED_ASPECT_RATIOS,
  normalizeSupportedAspectRatio: normalizeSupportedAspectRatio,
  getEraInfo: getEraInfo,
  getTimelineDivergenceProfile: getTimelineDivergenceProfile,
  normalizeDreamUrl: normalizeDreamUrl,
  getHomepageUrl: getHomepageUrl,
  isHomepageUrl: isHomepageUrl,
  compactHtmlForContext: compactHtmlForContext,
  buildDreamPrompt: buildDreamPrompt,
  extractHtml: extractHtml,
  extractTitleFromHtml: extractTitleFromHtml,
  extractDomain: extractDomain,
  loadDomainImageCache: loadDomainImageCache,
  saveDomainImageCache: saveDomainImageCache,
  saveDomainImage: saveDomainImage,
  getAvailableDomainImages: getAvailableDomainImages,
  findMatchingDomainImage: findMatchingDomainImage,
  formatImageDescriptor: formatImageDescriptor,
  resolveTimePeriod: resolveTimePeriod,
  makeDomainImageKey: makeDomainImageKey,
  injectBridgeScript: injectBridgeScript,
  ensureBridgeInDocument: ensureBridgeInDocument,
  ProgressiveHtmlWriter: ProgressiveHtmlWriter,
  setStatusProgress: setStatusProgress,
  downscaleImageToSlot: downscaleImageToSlot,
  handleDiscoveredImages: handleDiscoveredImages,
  state: state,
  initApp: initApp,
  navigateToDream: navigateToDream,
  cancelActiveGeneration: cancelActiveGeneration,
  pwa: {
    initPWA: initPWA,
    promptInstall: promptInstall,
    canPromptInstall: canPromptInstall,
    isStandaloneMode: isStandaloneMode,
    syncStandaloneDOM: syncStandaloneDOM,
    pwaState: pwaState,
    setupWindowControls: setupWindowControls
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

export default BrowserOfDreams;
