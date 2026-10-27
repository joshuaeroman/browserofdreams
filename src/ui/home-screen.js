import { els } from "./dom.js";
import { state } from "../core/state.js";
import { FEATURED_PORTALS } from "../data/portals.js";
import { getEraInfo, applyEraTheme } from "../core/era.js";
import { setStatusText } from "./statusbar.js";

export function renderFeaturedPortals(onNavigate) {
  if (!els.featuredPortalsGrid) return;
  els.featuredPortalsGrid.innerHTML = "";
  for (var i = 0; i < FEATURED_PORTALS.length; i++) {
    (function(portal) {
      var card = document.createElement("button");
      card.type = "button";
      card.className = "portal-card";
      var era = getEraInfo(portal.date);
      card.innerHTML =
        "<div class=\"portal-card-top\">" +
          "<span class=\"portal-card-url\">" + portal.url + "</span>" +
          "<span class=\"portal-card-date\">" + era.formattedShort + "</span>" +
        "</div>" +
        "<p class=\"portal-card-desc\"><strong>" + portal.title + ":</strong> " + portal.desc + "</p>";
      card.addEventListener("click", function() {
        if (els.urlInput) els.urlInput.value = portal.url;
        if (els.dateInput) els.dateInput.value = portal.date;
        applyEraTheme(portal.date);
        if (onNavigate) {
          onNavigate(portal.url, portal.date, { pushHistory: true, forceReload: false });
        }
      });
      els.featuredPortalsGrid.appendChild(card);
    })(FEATURED_PORTALS[i]);
  }
}

export function renderRecentHistory(onNavigate) {
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
      // Build the row via the DOM API: entry.title/entry.url originate from
      // LLM-generated pages and must never be interpolated as HTML
      var left = document.createElement("div");
      left.className = "recent-item-left";
      var icon = document.createElement("span");
      icon.textContent = "📄";
      var textCol = document.createElement("div");
      var urlLine = document.createElement("div");
      urlLine.className = "recent-item-url";
      urlLine.textContent = entry.title || entry.url;
      var dateLine = document.createElement("div");
      dateLine.className = "recent-item-date";
      dateLine.textContent = entry.url + " • " + era.formattedLong;
      textCol.appendChild(urlLine);
      textCol.appendChild(dateLine);
      left.appendChild(icon);
      left.appendChild(textCol);
      row.appendChild(left);
      var badge = document.createElement("span");
      badge.className = "portal-card-date";
      badge.textContent = "⚡ Instant Cache";
      row.appendChild(badge);
      row.addEventListener("click", function() {
        if (els.urlInput) els.urlInput.value = entry.url;
        if (els.dateInput) els.dateInput.value = entry.date;
        applyEraTheme(entry.date);
        if (onNavigate) {
          onNavigate(entry.url, entry.date, { pushHistory: true, forceReload: false });
        }
      });
      els.recentHistoryList.appendChild(row);
    })(state.pageCache[keys[i]]);
  }
}

export function showHomeScreen(onNavigate) {
  if (els.dreamFrame) els.dreamFrame.hidden = true;
  if (els.loadingOverlay) els.loadingOverlay.hidden = true;
  if (els.homeScreen) els.homeScreen.hidden = false;
  var curDate = (els.dateInput && els.dateInput.value) || "1999-12-31";
  var era = applyEraTheme(curDate);
  var winTitle = document.getElementById("window-title");
  if (winTitle) winTitle.textContent = era.browserName + " — [Dream Directory]";
  if (typeof document !== "undefined") {
    document.title = "Browser of Dreams — [about:dreams] (" + era.badgeLabel + ")";
  }
  setStatusText("Document: Done (Dream Directory)");
  renderRecentHistory(onNavigate);
}
