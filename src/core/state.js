import { loadSettings } from "./settings.js";
import { loadPageCache, loadDomainImageCache, loadSitePlanCache } from "./cache.js";

export const state = {
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

export function resetActiveRequest() {
  state.navigationEpoch++;
  state.activeImageSlots = [];
  if (state.activeStreamWriter) {
    try {
      state.activeStreamWriter.close();
    } catch (e) {}
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
