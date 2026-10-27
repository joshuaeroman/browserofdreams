export const SUPPORTED_ASPECT_RATIOS = ["1:1", "3:2", "2:3", "4:3", "3:4", "16:9", "9:16", "21:9"];
export const GEMINI_SUPPORTED_ASPECT_RATIOS = ["1:1", "4:3", "3:4", "16:9", "9:16"];

export const ASPECT_RATIO_NUMERICAL_VALUES = {
  "21:9": 21 / 9,
  "16:9": 16 / 9,
  "3:2": 3 / 2,
  "4:3": 4 / 3,
  "1:1": 1.0,
  "3:4": 3 / 4,
  "2:3": 2 / 3,
  "9:16": 9 / 16
};

/**
 * Normalizes any arbitrary aspect ratio string (e.g. "1:2", "120x240", "16/9")
 * or width/height pair to the closest supported aspect ratio for the target provider.
 * OpenRouter/OpenAI accepts: 1:1, 3:2, 2:3, 4:3, 3:4, 16:9, 9:16, 21:9.
 * Gemini / Imagen accepts: 1:1, 4:3, 3:4, 16:9, 9:16.
 */
export function normalizeSupportedAspectRatio(rawAspect, width, height, provider) {
  var p = String(provider || "").toLowerCase();
  var isGemini = p === "gemini" || p === "agentplatform" || p === "google";
  var allowed = isGemini ? GEMINI_SUPPORTED_ASPECT_RATIOS : SUPPORTED_ASPECT_RATIOS;

  var cleaned = typeof rawAspect === "string" ? rawAspect.trim().toLowerCase() : "";

  // Direct match check (case-insensitive)
  for (var i = 0; i < allowed.length; i++) {
    if (cleaned === allowed[i].toLowerCase()) {
      return allowed[i];
    }
  }

  var ratioVal = null;

  // Parse W:H, W/H, or WxH formats
  if (cleaned) {
    var match = cleaned.match(/^([0-9]+(?:\.[0-9]+)?)\s*[:\/xX]\s*([0-9]+(?:\.[0-9]+)?)$/);
    if (match) {
      var numW = parseFloat(match[1]);
      var numH = parseFloat(match[2]);
      if (numW > 0 && numH > 0) {
        ratioVal = numW / numH;
      }
    } else {
      var parsedFloat = parseFloat(cleaned);
      if (!isNaN(parsedFloat) && parsedFloat > 0) {
        ratioVal = parsedFloat;
      }
    }
  }

  // Try width and height if aspect string did not yield a valid ratio
  if (ratioVal === null && width && height) {
    var wNum = parseFloat(width);
    var hNum = parseFloat(height);
    if (wNum > 0 && hNum > 0) {
      ratioVal = wNum / hNum;
    }
  }

  // Default fallback
  if (ratioVal === null || isNaN(ratioVal) || ratioVal <= 0) {
    return "1:1";
  }

  // Mathematical snapping to nearest supported ratio
  var closest = allowed[0];
  var minDiff = Infinity;
  for (var j = 0; j < allowed.length; j++) {
    var cand = allowed[j];
    var candVal = ASPECT_RATIO_NUMERICAL_VALUES[cand] || 1.0;
    var diff = Math.abs(ratioVal - candVal);
    if (diff < minDiff) {
      minDiff = diff;
      closest = cand;
    }
  }

  return closest;
}
