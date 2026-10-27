import { els } from "./dom.js";
import { state } from "../core/state.js";
import { hasValidCredentials, getProviderDisplayName, getEffectiveImageProvider } from "../providers/registry.js";
import { isOpenCodeProvider } from "../providers/adapter.js";
import { isRasterProvider } from "../core/settings.js";
import { resolveActiveTextArtModel } from "../features/images.js";

export function setStatusText(text) {
  if (els.statusText) {
    els.statusText.textContent = text;
  }
}

export function setStatusProgress(percent) {
  if (!els.statusProgressPanel || !els.statusProgressBar) return;
  if (percent === null || percent === undefined || percent < 0) {
    els.statusProgressPanel.hidden = true;
    els.statusProgressBar.style.width = "0%";
  } else {
    els.statusProgressPanel.hidden = false;
    var clamped = Math.min(100, Math.max(0, Math.round(percent)));
    els.statusProgressBar.style.width = clamped + "%";
  }
}

export function setStatusImages(text) {
  if (els.statusImages) {
    els.statusImages.textContent = text;
  }
}

export function updateMemeStatusUI(memes, dateStr) {
  if (!els.statusMemes) return;
  var curDate = dateStr || (els.dateInput ? els.dateInput.value : "today");
  if (Array.isArray(memes) && memes.length > 0) {
    var preview = memes.slice(0, 3).join(", ");
    els.statusMemes.textContent = "🎭 Memes: " + preview + (memes.length > 3 ? "..." : "");
    els.statusMemes.title = "Cultural Zeitgeist Memes (" + curDate + ") — Click to view all 10:\n• " + memes.join("\n• ");
  } else {
    els.statusMemes.textContent = "🎭 Memes: Ready";
    els.statusMemes.title = "Cultural Zeitgeist Memes Active";
  }
}

export function updateProviderStatusUI() {
  var settings = state.settings;
  var configured = hasValidCredentials(settings, settings.pageProvider);
  var pName = getProviderDisplayName(settings.pageProvider);
  var corsNote = isOpenCodeProvider(settings.pageProvider)
    ? " <span class=\"cors-inline-badge\" title=\"opencode.ai requires a CORS browser extension for direct browser POST requests\">⚠️ Needs CORS Extension</span>"
    : "";

  var imgSummary = "";
  if (settings.imageMode !== "off") {
    var effImg = getEffectiveImageProvider(settings);
    if (settings.imageEngine === "text-pixel") {
      imgSummary = ", Images: <code>👾 Text Pixel Art (" + resolveActiveTextArtModel(settings, effImg) + ")</code>";
    } else if (settings.imageEngine === "text-svg") {
      imgSummary = ", Images: <code>✨ Text Vector SVG (" + resolveActiveTextArtModel(settings, effImg) + ")</code>";
    } else if (settings.imageEngine === "text-auto") {
      imgSummary = ", Images: <code>🕰️ Era Text Art (" + resolveActiveTextArtModel(settings, effImg) + ")</code>";
    } else if (!settings.imageProvider || !isRasterProvider(settings.imageProvider) || !hasValidCredentials(settings, settings.imageProvider)) {
      imgSummary = ", Images: save an image provider in Settings";
    } else {
      imgSummary = ", Image Model: <code>" + settings.imageModel + "</code>";
    }
  }

  if (els.apiStatusDot) {
    els.apiStatusDot.classList.toggle("ready", configured);
  }
  if (els.providerSummaryText) {
    els.providerSummaryText.textContent = configured
      ? pName + ": " + settings.pageModel
      : pName + " (Click to set API Key)";
  }
  if (els.homeApiWarning) {
    if (configured) {
      els.homeApiWarning.classList.add("configured");
      var bannerText = els.homeApiWarning.querySelector(".home-api-banner-text");
      if (bannerText) {
        bannerText.innerHTML =
          "<strong>Ready to Dream:</strong> Connected to <strong>" + pName +
          "</strong> (Page LLM: <code>" + settings.pageModel + "</code>" +
          imgSummary + ")." + corsNote;
      }
    } else {
      els.homeApiWarning.classList.remove("configured");
      var warnText = els.homeApiWarning.querySelector(".home-api-banner-text");
      if (warnText) {
        warnText.innerHTML =
          "<strong>Provider API Key Required:</strong> To explore the web across time, configure your " +
          "<strong>" + pName + "</strong> API key in Settings.";
      }
    }
  }
}

export function updateEraStatusUI(era) {
  if (els.htmlRoot) {
    els.htmlRoot.setAttribute("data-era", era.eraKey);
  }
  if (els.eraPill) {
    els.eraPill.textContent = era.badgeLabel;
  }
  if (els.statusDate) {
    els.statusDate.textContent = "📅 " + era.formattedShort;
  }
  if (els.homeEraBadge) {
    els.homeEraBadge.textContent = "ACTIVE ERA: " + era.badgeLabel.toUpperCase();
  }
}
