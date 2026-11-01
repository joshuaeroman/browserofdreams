import { getTimelineDivergenceProfile } from "./timeline.js";
import { getEraInfo } from "./era.js";
import { extractDomain, isHomepageUrl } from "./urls.js";

export const STORAGE_KEY_PAGE_CACHE = "browser_of_dreams_pages_v1";
export const STORAGE_KEY_DOMAIN_IMAGES = "browser_of_dreams_domain_images_v1";
export const STORAGE_KEY_SITE_PLANS = "browser_of_dreams_site_plans_v1";

var _internalDomainCache = null;
var _internalSitePlanCache = null;

export function loadPageCache() {
  try {
    if (typeof localStorage === "undefined") return {};
    var raw = localStorage.getItem(STORAGE_KEY_PAGE_CACHE);
    if (raw) {
      var pageCache = JSON.parse(raw) || {};
      // Sanitize legacy or cross-polluted slotImages
      for (var key in pageCache) {
        if (pageCache[key] && pageCache[key].slotImages) {
          var slots = pageCache[key].slotImages;
          for (var sId in slots) {
            var item = slots[sId];
            // Purge unverified legacy strings or mismatched URLs
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
    // ignore
  }
  return {};
}

export function savePageCache(pageCache) {
  try {
    if (typeof localStorage === "undefined") return;
    var keys = Object.keys(pageCache);
    // Keep most recent 20 pages in localStorage to avoid quota overflow
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
    // If quota exceeded due to embedded base64 images, strip oldest entries
    try {
      var k = Object.keys(pageCache);
      if (k.length > 3) {
        delete pageCache[k[0]];
        localStorage.setItem(STORAGE_KEY_PAGE_CACHE, JSON.stringify(pageCache));
      }
    } catch (e2) {
      // ignore
    }
  }
}

export function makeCacheKey(url, dateStr, divergenceVal) {
  var div = typeof divergenceVal === "number" ? divergenceVal : 0;
  var tier = getTimelineDivergenceProfile(div).tierKey;
  var base = String(url).toLowerCase() + "__" + String(dateStr);
  return tier === "grounded" ? base : (base + "__" + tier);
}

// Same site and timeline tier, excluding the date being generated.
// Closest calendar day wins; a tie keeps the newer cache entry.
export function findClosestHomepage(pageCache, homepageUrl, dateStr, divergenceVal) {
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
    if (dist < bestDist || (dist === bestDist && newer)) {
      best = entry;
      bestDist = dist;
    }
  }
  return best;
}

export function loadDomainImageCache() {
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
    // ignore
  }
  _internalDomainCache = _internalDomainCache || {};
  return _internalDomainCache;
}

export function saveDomainImageCache(domainImageCache) {
  var target = domainImageCache || _internalDomainCache;
  if (!target) return;
  _internalDomainCache = target;
  try {
    if (typeof localStorage === "undefined") return;
    // Cap total stored domain images across all keys to prevent quota overflow
    var allKeys = Object.keys(target);
    var totalEntries = 0;
    for (var i = 0; i < allKeys.length; i++) {
      if (Array.isArray(target[allKeys[i]])) {
        totalEntries += target[allKeys[i]].length;
      }
    }
    if (totalEntries > 40) {
      // Trim oldest entries in largest lists
      allKeys.forEach(function(k) {
        if (Array.isArray(target[k]) && target[k].length > 10) {
          target[k].sort(function(a, b) { return (a.timestamp || 0) - (b.timestamp || 0); });
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
      // ignore
    }
  }
}

export function resolveTimePeriod(dateOrYear) {
  var str = String(dateOrYear || "").trim();
  if (!str) return "2001";
  if (/^\d{4}$/.test(str)) return str;
  try {
    var era = getEraInfo(str);
    if (era && era.year) return String(era.year);
  } catch (e) {}
  var m = /^(\d{4})/.exec(str);
  return m ? m[1] : str;
}

export function getOrientation(width, height) {
  var w = parseInt(width, 10) || 300;
  var h = parseInt(height, 10) || 200;
  if (w >= h * 1.25) return "horizontal";
  if (h >= w * 1.25) return "vertical";
  return "square";
}

export function extractImageLabel(prompt, alt, domain, role) {
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
  return role === "ad" ? "Advertisement" : (role === "icon" ? "Icon" : "Editorial Photo");
}

/**
 * A cached image may only be replayed in the engine that produced its bytes.
 * Entries written before engine affinity existed have no engine field: raster
 * bytes could only come from the image model, while SVG bytes came from a text
 * engine and must not be served to image-model slots.
 */
export function isImageCacheEngineCompatible(item, engine) {
  var requested = String(engine || "").trim();
  if (!requested) return true;
  var stored = String((item && item.engine) || "").trim();
  if (stored) return stored === requested;
  var isSvg = /^data:image\/svg/i.test(String((item && item.dataUrl) || ""));
  return requested === "image-model" ? !isSvg : false;
}

export function formatImageDescriptor(item) {
  if (!item) return "";
  var normalizedRole = (item.role || "photo").toLowerCase();
  var role = normalizedRole === "ad" ? "AD" : (normalizedRole === "icon" ? "ICON" : "PHOTO");
  var label = item.label || extractImageLabel(item.prompt, item.alt, item.domain, normalizedRole);
  var w = parseInt(item.width, 10) || (role === "AD" ? 468 : (role === "ICON" ? 32 : 400));
  var h = parseInt(item.height, 10) || (role === "AD" ? 60 : (role === "ICON" ? 32 : 300));
  var orientation = item.orientation || getOrientation(w, h);
  return "[" + role + ": " + label + ", " + orientation + ", " + w + "x" + h + "]";
}

export function makeDomainImageKey(domain, dateOrYear, divergenceVal) {
  var d = extractDomain(domain) || String(domain || "").toLowerCase().replace(/^https?:\/\//i, "").replace(/\/.*$/, "").replace(/^www\./, "");
  var tp = resolveTimePeriod(dateOrYear);
  var div = typeof divergenceVal === "number" ? divergenceVal : 0;
  var tier = getTimelineDivergenceProfile(div).tierKey;
  var base = d + "__" + tp;
  return tier === "grounded" ? base : (base + "__" + tier);
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

export function saveDomainImage(item, optionalCache) {
  if (!item || !item.domain || !item.dataUrl) return null;
  var domain = extractDomain(item.domain) || String(item.domain).toLowerCase().replace(/^www\./, "");
  var timePeriod = resolveTimePeriod(item.date || item.timePeriod);
  var div = typeof item.divergence === "number" ? item.divergence : 0;
  var cacheKey = makeDomainImageKey(domain, timePeriod, div);

  var cache = resolveActiveDomainCache(optionalCache);
  cache[cacheKey] = cache[cacheKey] || [];
  var list = cache[cacheKey];

  var normalizedRole = String(item.role || "photo").toLowerCase();
  var role = normalizedRole === "ad" || normalizedRole === "icon" ? normalizedRole : "photo";
  var w = parseInt(item.width, 10) || (role === "ad" ? 468 : (role === "icon" ? 32 : 400));
  var h = parseInt(item.height, 10) || (role === "ad" ? 60 : (role === "icon" ? 32 : 300));
  var orientation = item.orientation || getOrientation(w, h);
  var label = item.label || extractImageLabel(item.prompt, item.alt, domain, role);
  var prompt = String(item.prompt || "").trim();
  var descriptor = item.descriptor || formatImageDescriptor({
    role: role,
    label: label,
    orientation: orientation,
    width: w,
    height: h
  });

  var id = item.id || (domain.replace(/[^a-z0-9]/g, "-") + "-" + role + "-" + w + "x" + h + "-" + (list.length + 1));

  // Deduplicate
  var existingIdx = -1;
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === id || (prompt && list[i].prompt && list[i].prompt === prompt) || list[i].descriptor === descriptor) {
      existingIdx = i;
      break;
    }
  }

  var entry = {
    id: id,
    domain: domain,
    timePeriod: timePeriod,
    date: item.date || "",
    divergence: div,
    role: role,
    label: label,
    prompt: prompt,
    alt: item.alt || "",
    aspectRatio: item.aspectRatio || "",
    orientation: orientation,
    width: w,
    height: h,
    descriptor: descriptor,
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

export function getAvailableDomainImages(domain, dateOrYear, divergenceVal, optionalCache) {
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

export function findMatchingDomainImage(domain, dateOrYear, divergenceVal, slotQuery, optionalCache) {
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

  // 1. Direct match on reuse ID, descriptor, or label
  if (reuse) {
    for (var i = 0; i < available.length; i++) {
      var it = available[i];
      if (it.id && it.id.toLowerCase() === reuse.toLowerCase()) return it;
      if (it.descriptor && it.descriptor.toLowerCase() === reuse.toLowerCase()) return it;
      if (it.label && it.label.toLowerCase() === reuse.toLowerCase()) return it;
    }
  }

  // 2. Direct match on prompt or prompt containing descriptor
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

  // 3. Match by alt if specified and not generic
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

export function loadSitePlanCache() {
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
    // ignore
  }
  _internalSitePlanCache = _internalSitePlanCache || {};
  return _internalSitePlanCache;
}

export function resetSitePlanCache() {
  _internalSitePlanCache = null;
}

export function saveSitePlanCache(sitePlanCache) {
  var target = sitePlanCache || _internalSitePlanCache;
  if (!target) return;
  _internalSitePlanCache = target;
  try {
    if (typeof localStorage === "undefined") return;
    var keys = Object.keys(target);
    if (keys.length > 60) {
      keys.sort(function(a, b) {
        return ((target[a] && target[a].timestamp) || 0) - ((target[b] && target[b].timestamp) || 0);
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
          return ((target[a] && target[a].timestamp) || 0) - ((target[b] && target[b].timestamp) || 0);
        });
        delete target[retryKeys[0]];
        localStorage.setItem(STORAGE_KEY_SITE_PLANS, JSON.stringify(target));
      }
    } catch (e2) {
      // ignore
    }
  }
}

export function makeSitePlanKey(domainOrUrl, dateOrYear, divergenceVal) {
  var d = extractDomain(domainOrUrl) || String(domainOrUrl || "").toLowerCase().replace(/^https?:\/\//i, "").replace(/\/.*$/, "").replace(/^www\./, "");
  var tp = resolveTimePeriod(dateOrYear);
  var div = typeof divergenceVal === "number" ? divergenceVal : 0;
  var tier = getTimelineDivergenceProfile(div).tierKey;
  var base = d + "__" + tp;
  return tier === "grounded" ? base : (base + "__" + tier);
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

// entry: { domain, year, divergence, date, text, timestamp }
export function getCachedSitePlan(domainOrUrl, dateOrYear, divergenceVal, optionalCache) {
  var cache = resolveActiveSitePlanCache(optionalCache);
  var entry = cache[makeSitePlanKey(domainOrUrl, dateOrYear, divergenceVal)];
  return entry && entry.text ? entry : null;
}

export function saveSitePlan(item, optionalCache) {
  if (!item) return null;
  var text = String(item.text || "").trim();
  if (!text) return null;
  var domain = extractDomain(item.domain) || String(item.domain || "").toLowerCase().replace(/^https?:\/\//i, "").replace(/\/.*$/, "").replace(/^www\./, "");
  var timePeriod = resolveTimePeriod(item.date);
  var div = typeof item.divergence === "number" ? item.divergence : 0;
  var cacheKey = makeSitePlanKey(domain, timePeriod, div);

  var entry = {
    domain: domain,
    year: timePeriod,
    divergence: div,
    date: item.date || "",
    text: text,
    timestamp: Date.now()
  };

  var cache = resolveActiveSitePlanCache(optionalCache);
  cache[cacheKey] = entry;
  saveSitePlanCache(cache);
  return entry;
}
