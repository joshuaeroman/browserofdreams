import { els } from "../ui/dom.js";
import { state, resetActiveRequest } from "./state.js";
import { makeCacheKey, savePageCache, findClosestHomepage } from "./cache.js";
import { pushHistory, setHistoryIndex } from "./history.js";
import { normalizeDreamUrl, getHomepageUrl, isHomepageUrl } from "./urls.js";
import { extractHtml, extractTitleFromHtml, ProgressiveHtmlWriter } from "./html.js";
import { applyEraTheme, getEraInfo } from "./era.js";
import { getTimelineDivergenceProfile } from "./timeline.js";
import { buildDreamPrompt } from "../prompts/dream-prompt.js";
import { injectBridgeScript, ensureBridgeInDocument, bridgeCss, bridgeRuntimeJs } from "../bridge/inject.js";
import { getProvider, hasValidCredentials, resolveConfig } from "../providers/registry.js";
import { getCachedMemesForDate, fetchDayMemesFromModel } from "../features/memes.js";
import { handleDiscoveredImages } from "../features/images.js";
import { setStatusText, setStatusImages, setStatusProgress, updateMemeStatusUI } from "../ui/statusbar.js";
import { showLoadingOverlay, updateLoadingOverlayProgress, hideLoadingOverlay } from "../ui/loading-overlay.js";
import { updateNavButtons } from "../ui/toolbar.js";
import { showHomeScreen, renderRecentHistory } from "../ui/home-screen.js";
import { openSettingsModal } from "../ui/settings-modal.js";

function postToIframe(message) {
  if (els.dreamFrame && els.dreamFrame.contentWindow) {
    els.dreamFrame.contentWindow.postMessage(message, "*");
  }
}

export function cancelActiveGeneration() {
  if (state.activeStreamWriter) {
    try {
      state.activeStreamWriter.close();
      if (state.activeStreamWriter.doc && state.currentNavigationUrl) {
        ensureBridgeInDocument(state.activeStreamWriter.doc, state.currentNavigationUrl, state.currentNavigationDate);
      }
    } catch (e) {}
    state.activeStreamWriter = null;
  }
  resetActiveRequest();
  hideLoadingOverlay();
  setStatusProgress(null);
  setStatusText("Document: Stopped");
}

export function mountHtmlInViewport(rawHtml, normalizedUrl, dateStr, fromCache) {
  state.currentRawHtml = rawHtml;
  state.currentNavigationUrl = normalizedUrl;
  state.currentNavigationDate = dateStr;
  var era = applyEraTheme(dateStr);
  var title = extractTitleFromHtml(rawHtml, normalizedUrl);
  var injected = injectBridgeScript(rawHtml, normalizedUrl, dateStr);

  if (els.homeScreen) els.homeScreen.hidden = true;
  if (els.dreamFrame) {
    els.dreamFrame.hidden = false;
    els.dreamFrame.srcdoc = injected;
  }

  var winTitle = document.getElementById("window-title");
  if (winTitle) winTitle.textContent = title + " - " + era.browserName;
  if (typeof document !== "undefined") {
    document.title = (title || normalizedUrl) + " — [" + normalizedUrl + "] (" + era.badgeLabel + ") - Browser of Dreams";
  }

  setStatusText(fromCache
    ? "Loaded from Dream Cache (" + normalizedUrl + ")"
    : "Document: Done (" + normalizedUrl + ")");
}

export function renderEraErrorPage(normalizedUrl, dateStr, errorMessage) {
  var era = getEraInfo(dateStr);
  var escapedErr = String(errorMessage || "Unknown error")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  var errorHtml = "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><title>Cannot find server</title>" +
    "<style>body{font-family:Verdana,Tahoma,sans-serif;background:#ffffff;color:#000000;padding:32px;max-width:680px;margin:0 auto;}" +
    "h1{font-size:18px;color:#990000;border-bottom:1px solid #cccccc;padding-bottom:8px;}" +
    ".box{background:#f7f7f2;border:1px solid #cccccc;padding:14px;font-family:monospace;font-size:12px;margin:16px 0;white-space:pre-wrap;}" +
    "p,li{font-size:12px;line-height:1.5;}</style></head><body>" +
    "<h1>⚠️ The Dream Page Cannot Be Displayed</h1>" +
    "<p>The server at <strong>" + normalizedUrl + "</strong> on <strong>" + era.formattedLong + "</strong> could not be reached.</p>" +
    "<div class=\"box\">" + escapedErr + "</div>" +
    "<p>Please try the following:</p>" +
    "<ul><li>Click the <strong>⚙ Settings</strong> button in the browser toolbar to verify your API key and selected model.</li>" +
    "<li>Click <strong>Reload</strong> to try dreaming the page again.</li></ul>" +
    "</body></html>";

  mountHtmlInViewport(errorHtml, normalizedUrl, dateStr, false);
  setStatusText("Error: " + errorMessage);
}

function dispatchStreaming(messages, onChunk, onComplete, customOpts) {
  var settings = state.settings;
  var provider = getProvider(settings.pageProvider);
  var config = resolveConfig(settings, settings.pageProvider);
  var copts = customOpts || {};

  var req = {
    ...config,
    messages: messages,
    temperature: copts.temperature !== undefined ? copts.temperature : settings.temperature,
    maxTokens: copts.maxTokens !== undefined ? copts.maxTokens : 16384,
    reasoningEffort: copts.homepage ? config.homepageReasoningEffort : config.reasoningEffort,
    thinkingBudget: config.thinkingBudget || 0,
    geminiAuthMethod: config.geminiAuthMethod,
    vertexAuthType: config.vertexAuthType,
    geminiProjectId: config.geminiProjectId,
    geminiLocation: config.geminiLocation || "global",
    onChunk: onChunk,
    onComplete: onComplete
  };

  return provider.streamChat(req);
}

export function navigateToDream(rawUrl, dateStr, options) {
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
        html: cachedEntry.html
      });
      updateNavButtons();
    }
    mountHtmlInViewport(cachedEntry.html, normalizedUrl, dateStr, true);
    return;
  }

  if (!hasValidCredentials(state.settings, state.settings.pageProvider)) {
    openSettingsModal();
    setStatusText("Please configure your API key in Settings to dream webpages.");
    return;
  }

  var navCtx = opts.navContext ? Object.assign({}, opts.navContext) : null;
  var referrerUrl = (navCtx && navCtx.referrerUrl)
    ? normalizeDreamUrl(navCtx.referrerUrl, era.year)
    : "";
  var referrerHtml = (navCtx && navCtx.referrerHtml) || "";
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
    } catch (e) {}

    var firstChunkReceived = false;
    var startTime = Date.now();
    var handshakeIndex = 0;
    var handshakeSpinners = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

    state.activeTimer = setInterval(function() {
      var elapsedSec = (Date.now() - startTime) / 1000;
      var elapsed = elapsedSec.toFixed(1);
      if (els.loadingElapsed) els.loadingElapsed.textContent = elapsed + "s";

      if (!firstChunkReceived) {
        if (elapsedSec >= 5.0 && els.loadingHeadline) {
          els.loadingHeadline.textContent = "Awaiting temporal stream from " + hostName + "...";
        } else if (elapsedSec >= 2.5 && els.loadingHeadline) {
          els.loadingHeadline.textContent = "Transmitting HTTP request to " + hostName + "...";
        } else if (elapsedSec >= 1.0 && els.loadingHeadline) {
          els.loadingHeadline.textContent = "Connecting to " + hostName + "...";
        }
        if (els.loadingStreamPreview) {
          handshakeIndex++;
          var spin = handshakeSpinners[handshakeIndex % handshakeSpinners.length];
          var lines = [
            "<!-- Handshaking with temporal node " + normalizedUrl + " (" + dateStr + ")... [" + spin + "] -->"
          ];
          if (elapsedSec >= 1.0) {
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

    var needsHomepageFirst = !isHome && (!state.pageCache[homeCacheKey] || !state.pageCache[homeCacheKey].html);
    var priorHomepage = findClosestHomepage(
      state.pageCache,
      homepageUrl,
      dateStr,
      state.settings.timelineDivergence
    );

    function streamTargetPage(resolvedHomepageHtml, isStageTwo) {
      var stagePrefix = isStageTwo ? "[Stage 2/2] " : "";
      var tlProf = getTimelineDivergenceProfile(state.settings.timelineDivergence, era.year);

      showLoadingOverlay({
        eraKey: era.eraKey,
        dialogTitle: era.browserName + " — " + stagePrefix + "Transferring from " + hostName,
        headline: stagePrefix + "Contacting host: " + hostName + "...",
        subline: "Temporal coordinates: " + era.formattedLong +
          " • " + tlProf.badgeText +
          (dayMemes && dayMemes.length ? " • 🎭 " + dayMemes.slice(0, 3).join(", ") + "..." : "") +
          (resolvedHomepageHtml && !isHome ? " • Cohesive Site Context Active" : "") +
          " • Model: " + state.settings.pageModel,
        progressPct: isStageTwo ? 50 : 8,
        bytesText: "0.0 KB received"
      });

      setStatusText(stagePrefix + "Connecting to " + hostName + " (" + era.formattedShort + " • " + tlProf.shortLabel + ")...");

      var streamWriter = null;
      if (els.dreamFrame) {
        els.dreamFrame.hidden = false;
        if (els.homeScreen) els.homeScreen.hidden = true;
        try {
          if (els.dreamFrame.contentDocument) {
            var substitutedJs = bridgeRuntimeJs.replace(
              "__BASE_URL__",
              JSON.stringify(normalizedUrl || "http://www.example.com/")
            );
            streamWriter = new ProgressiveHtmlWriter(els.dreamFrame.contentDocument, {
              initialStyle: bridgeCss,
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
        homepageUrl: homepageUrl,
        homepageHtml: resolvedHomepageHtml || "",
        priorHomepageHtml: isHome && priorHomepage ? priorHomepage.html : "",
        priorHomepageDate: isHome && priorHomepage ? priorHomepage.date : "",
        referrerUrl: referrerUrl,
        referrerHtml: referrerHtml,
        navContext: navCtx,
        imageMode: state.settings.imageMode,
        memes: dayMemes
      });

      var messages = [
        { role: "system", content: promptBundle.systemPrompt },
        { role: "user", content: promptBundle.userPrompt }
      ];

      function onStreamChunk(delta, accumulated) {
        firstChunkReceived = true;
        var kb = (accumulated.length / 1024).toFixed(1);
        var basePct = isStageTwo ? 50 : 10;
        var spanPct = isStageTwo ? 46 : 85;
        var pct = Math.min(96, basePct + Math.round((accumulated.length / 7500) * spanPct));

        if (streamWriter) {
          streamWriter.writeChunk(accumulated);
        }

        updateLoadingOverlayProgress({
          headline: stagePrefix + "Transferring page from " + hostName + "...",
          bytesText: kb + " KB received",
          progressPct: pct
        });
        setStatusText(stagePrefix + "Receiving " + hostName + " (" + kb + " KB transferred)...");
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
            ensureBridgeInDocument(streamWriter.doc, normalizedUrl, dateStr);
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
          timestamp: Date.now()
        };
        state.pageCache[cacheKey] = entryObj;
        if (isHome) {
          state.pageCache[homeCacheKey] = {
            url: homepageUrl,
            date: dateStr,
            title: pageTitle,
            html: cleanHtml,
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
            html: cleanHtml
          });
          updateNavButtons();
        }

        state.currentRawHtml = cleanHtml;
        state.currentNavigationUrl = normalizedUrl;
        state.currentNavigationDate = dateStr;

        if (streamWriter && streamWriter.hasOpened) {
          streamWriter.close();
          ensureBridgeInDocument(streamWriter.doc, normalizedUrl, dateStr);

          var winTitle = document.getElementById("window-title");
          if (winTitle) winTitle.textContent = pageTitle + " - " + era.browserName;
          if (typeof document !== "undefined") {
            document.title = (pageTitle || normalizedUrl) + " — [" + normalizedUrl + "] (" + era.badgeLabel + ") - Browser of Dreams";
          }
          setStatusProgress(null);
          setStatusText("Document: Done (" + normalizedUrl + ")");
        } else {
          mountHtmlInViewport(cleanHtml, normalizedUrl, dateStr, false);
        }
      }

      state.activeRequest = dispatchStreaming(messages, onStreamChunk, onStreamComplete, { homepage: isHome });
    }

    if (needsHomepageFirst) {
      showLoadingOverlay({
        eraKey: era.eraKey,
        dialogTitle: era.browserName + " — [Stage 1/2] Building Site Homepage (" + hostName + ")",
        headline: "[Stage 1/2] Generating canonical homepage (" + homepageUrl + ")...",
        subline: "Establishing site branding & layout before rendering " + normalizedUrl,
        progressPct: 6,
        bytesText: "0.0 KB (Homepage)",
        streamPreview: "<!-- [Stage 1/2] Synthesizing root homepage " + homepageUrl + " for cohesive site context... -->"
      });

      setStatusText("[Stage 1/2] Generating homepage " + homepageUrl + "...");

      var homePromptBundle = buildDreamPrompt({
        url: homepageUrl,
        date: dateStr,
        timelineDivergence: state.settings.timelineDivergence,
        homepageUrl: homepageUrl,
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
        memes: dayMemes
      });

      var homeMessages = [
        { role: "system", content: homePromptBundle.systemPrompt },
        { role: "user", content: homePromptBundle.userPrompt }
      ];

      state.activeRequest = dispatchStreaming(
        homeMessages,
        function(_delta, accumulated) {
          var kb = (accumulated.length / 1024).toFixed(1);
          var pct = Math.min(48, 6 + Math.round((accumulated.length / 7500) * 42));
          updateLoadingOverlayProgress({
            headline: "[Stage 1/2] Generating site homepage (" + hostName + ")...",
            bytesText: kb + " KB (Homepage)",
            progressPct: pct,
            streamPreview: accumulated.slice(-480)
          });
          setStatusText("[Stage 1/2] Receiving homepage " + homepageUrl + " (" + kb + " KB)...");
        },
        function(homeFinalText, homeError) {
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
              timestamp: Date.now()
            };
            savePageCache(state.pageCache);
            renderRecentHistory(navigateToDream);
          }
          streamTargetPage(homeCleanHtml || "", true);
        },
        { homepage: true }
      );
      return;
    }

    var existingHomepageHtml = (state.pageCache[homeCacheKey] && state.pageCache[homeCacheKey].html) || "";
    streamTargetPage(existingHomepageHtml, false);
  }

  var cachedMemes = getCachedMemesForDate(dateStr);
  if (cachedMemes) {
    updateMemeStatusUI(cachedMemes, dateStr);
    startNavigationWithMemes(cachedMemes);
  } else {
    cancelActiveGeneration();

    showLoadingOverlay({
      eraKey: era.eraKey,
      dialogTitle: era.browserName + " — Synchronizing Temporal Zeitgeist",
      headline: "Gathering cultural zeitgeist keywords for " + dateStr + "...",
      subline: "Temporal coordinates: " + era.formattedLong + " • Querying 10 era memes (quick response, stream & reasoning disabled)",
      progressPct: 4,
      bytesText: "Connecting to timeline...",
      streamPreview: "<!-- Querying cultural zeitgeist keywords for " + dateStr + " prior to webpage generation... -->"
    });

    setStatusText("🔮 Gathering cultural zeitgeist keywords for " + dateStr + "...");

    var provAdapter = getProvider(state.settings.pageProvider);
    var provConf = resolveConfig(state.settings, state.settings.pageProvider);

    fetchDayMemesFromModel({
      date: dateStr,
      timelineDivergence: state.settings.timelineDivergence,
      providerAdapter: provAdapter,
      providerConfig: provConf,
      hasCredentials: hasValidCredentials(state.settings, state.settings.pageProvider),
      onStart: function() {
        if (els.statusMemes) els.statusMemes.textContent = "🔮 Memes: Fetching...";
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
