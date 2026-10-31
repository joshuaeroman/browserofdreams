import { ERA_FALLBACK_MEMES } from "../data/fallback-memes.js";
import { getEraInfo } from "../core/era.js";
import { buildDayMemesPrompt, parseMemeList } from "../prompts/memes-prompt.js";

export const STORAGE_KEY_MEMES = "browser_of_dreams_memes_v1";

export function loadMemeCache() {
  try {
    if (typeof localStorage === "undefined") return {};
    var raw = localStorage.getItem(STORAGE_KEY_MEMES);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export function saveMemeCache(cache) {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(STORAGE_KEY_MEMES, JSON.stringify(cache));
  } catch (e) {
    // ignore
  }
}

export function getFallbackMemes(dateStr) {
  var era = getEraInfo(dateStr);
  return (ERA_FALLBACK_MEMES[era.eraKey] || ERA_FALLBACK_MEMES["2000s"]).slice();
}

export const DayMemesEngine = {
  STORAGE_KEY: STORAGE_KEY_MEMES,
  getFallbackMemes: getFallbackMemes,
  loadCache: loadMemeCache,
  saveCache: saveMemeCache,
  buildPrompt: buildDayMemesPrompt,
  parseMemeList: parseMemeList
};

// In-memory cache & in-flight requests registry
var memeCache = loadMemeCache();
var inFlightMemeFetches = {};
var activeMemeRequest = null;

export function getCachedMemesForDate(dateStr) {
  return memeCache && memeCache[dateStr] ? memeCache[dateStr].slice() : null;
}

export function setCachedMemesForDate(dateStr, memes) {
  memeCache[dateStr] = memes;
  saveMemeCache(memeCache);
}

export function clearMemeCache() {
  memeCache = {};
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(STORAGE_KEY_MEMES);
    }
  } catch (e) {}
}

export function getActiveMemeRequest() {
  return activeMemeRequest;
}

export function abortActiveMemeRequest() {
  if (activeMemeRequest && typeof activeMemeRequest.abort === "function") {
    activeMemeRequest.abort();
  }
  activeMemeRequest = null;
}

/**
 * Fetch cultural zeitgeist keywords/memes from the LLM prior to dream navigation.
 * Non-streaming, reasoning disabled (<1s).
 */
export function fetchDayMemesFromModel(opts, callback) {
  var d = opts.date || "1999-12-31";
  var timelineDivergence = opts.timelineDivergence || 0;
  var providerAdapter = opts.providerAdapter;
  var providerConfig = opts.providerConfig || {};
  var hasCredentials = opts.hasCredentials;
  var onStart = opts.onStart || function() {};
  var onUIUpdate = opts.onUIUpdate || function() {};

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
      try { cbs0[i0](fb); } catch (e) {}
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
    messages: messages,
    maxTokens: 180,
    temperature: 0.5,
    reasoningEffort: "off"
  };

  activeMemeRequest = providerAdapter.completeOnce(req, function(err, finalText) {
    activeMemeRequest = null;
    var parsed = parseMemeList(finalText);
    var results = (parsed && parsed.length >= 3)
      ? parsed
      : getFallbackMemes(d);

    setCachedMemesForDate(d, results);
    var pending = inFlightMemeFetches[d] || [];
    delete inFlightMemeFetches[d];
    onUIUpdate(results, d);
    for (var ip = 0; ip < pending.length; ip++) {
      try {
        pending[ip](results);
      } catch (e) {}
    }
  });
}
