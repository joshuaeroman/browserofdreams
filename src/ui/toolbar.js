import { els } from "./dom.js";
import { state } from "../core/state.js";
import { canGoBack, canGoForward, goBack, goForward } from "../core/history.js";
import { getTimelineDivergenceProfile } from "../core/timeline.js";
import { applyEraTheme } from "../core/era.js";
import { updateEraStatusUI } from "./statusbar.js";

export function updateNavButtons() {
  if (els.btnBack) els.btnBack.disabled = !canGoBack();
  if (els.btnForward) els.btnForward.disabled = !canGoForward();
}

export function shiftDate(currentDateStr, days) {
  var d = new Date(currentDateStr + "T00:00:00Z");
  if (isNaN(d.getTime())) d = new Date("1999-12-31T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  var yyyy = d.getUTCFullYear();
  var mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  var dd = String(d.getUTCDate()).padStart(2, "0");
  return yyyy + "-" + mm + "-" + dd;
}

export function syncTimelineDivergenceUI(val) {
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
    els.timelineDivergenceBadge.title = prof.fullTitle + " — " + prof.description;
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
