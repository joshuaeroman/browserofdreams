import { els } from "./dom.js";
import { setStatusProgress, setStatusText } from "./statusbar.js";

export function configureLoadingAnimationEra(eraKey) {
  var era = eraKey || (typeof document !== "undefined" && document.documentElement && document.documentElement.getAttribute("data-era")) || "2000s";
  var sourceIcon = "🌐";
  var flyingGlyph = "📄";
  var destIcon = "📁";

  if (era === "pre90s") {
    sourceIcon = "📡";
    flyingGlyph = "▸";
    destIcon = "📺";
  } else if (era === "1990s") {
    sourceIcon = "🌐";
    flyingGlyph = "📄";
    destIcon = "📁";
  } else if (era === "2000s") {
    sourceIcon = "🌐";
    flyingGlyph = "📄";
    destIcon = "📁";
  } else if (era === "modern") {
    sourceIcon = "☁️";
    flyingGlyph = "📦";
    destIcon = "💻";
  } else if (era === "future") {
    sourceIcon = "🪐";
    flyingGlyph = "✦";
    destIcon = "🛸";
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

export function showLoadingOverlay(opts) {
  var o = opts || {};
  if (els.loadingOverlay) els.loadingOverlay.hidden = true;
  if (els.dreamFrame) els.dreamFrame.hidden = false;
  if (els.homeScreen) els.homeScreen.hidden = true;
  if (els.btnStop) els.btnStop.disabled = false;
  if (els.throbber) els.throbber.classList.add("loading");

  if (o.headline) setStatusText(o.headline);
  if (o.progressPct !== undefined) setStatusProgress(o.progressPct);

  if (els.loadingDialogTitle && o.dialogTitle) els.loadingDialogTitle.textContent = o.dialogTitle;
  if (els.loadingHeadline && o.headline) els.loadingHeadline.textContent = o.headline;
  if (els.loadingSubline && o.subline) els.loadingSubline.textContent = o.subline;
  if (els.loadingProgressBar) els.loadingProgressBar.style.width = (o.progressPct !== undefined ? o.progressPct : 8) + "%";
  if (els.loadingBytes && o.bytesText) els.loadingBytes.textContent = o.bytesText;
  if (els.loadingStreamPreview && o.streamPreview) els.loadingStreamPreview.textContent = o.streamPreview;

  configureLoadingAnimationEra(o.eraKey);
}

export function updateLoadingOverlayProgress(opts) {
  var o = opts || {};
  if (o.headline) setStatusText(o.headline);
  if (o.progressPct !== undefined) setStatusProgress(o.progressPct);

  if (els.loadingHeadline && o.headline) els.loadingHeadline.textContent = o.headline;
  if (els.loadingBytes && o.bytesText) els.loadingBytes.textContent = o.bytesText;
  if (els.loadingProgressBar && o.progressPct !== undefined) els.loadingProgressBar.style.width = o.progressPct + "%";
  if (els.loadingStreamPreview && o.streamPreview) els.loadingStreamPreview.textContent = o.streamPreview;
}

export function hideLoadingOverlay() {
  if (els.loadingOverlay) els.loadingOverlay.hidden = true;
  if (els.btnStop) els.btnStop.disabled = true;
  if (els.throbber) els.throbber.classList.remove("loading");
  setStatusProgress(null);
}
