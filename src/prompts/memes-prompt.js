import { getEraInfo } from "../core/era.js";

export function buildDayMemesPrompt(dateStr, timelineDivergence) {
  var era = getEraInfo(dateStr);
  var isAlt = (timelineDivergence || 0) >= 50;
  var systemPrompt =
    "Date " + era.formattedLong + " (" + dateStr + "). Reply with exactly 10 distinct 1-2 word keywords across news, culture, tech, slang, music, and fashion of that day. " +
    (isAlt ? "Timeline is " + timelineDivergence + "% alternate history: mix in period-plausible what-ifs. " : "") +
    "Comma-separated only. No numbering or commentary.";

  var userPrompt = dateStr;
  return {
    systemPrompt: systemPrompt,
    userPrompt: userPrompt
  };
}

export function parseMemeList(rawText) {
  if (!rawText) return [];
  var cleaned = String(rawText)
    .replace(/```(?:json|txt)?/gi, "")
    .replace(/```/g, "")
    .trim();
  var items = cleaned.split(/[\n,;]+/);
  var list = [];
  var seen = {};
  for (var i = 0; i < items.length; i++) {
    var w = items[i]
      .trim()
      .replace(/^[0-9]+[.)\-:\s]+/g, "")
      .replace(/^["'\[\s]+|["'\]\s]+$/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (!w || w.length > 40 || w.indexOf(":") !== -1 || /^(here are|certainly|sure|below|list of|10 words)/i.test(w)) {
      continue;
    }
    var lower = w.toLowerCase();
    if (!seen[lower]) {
      seen[lower] = true;
      list.push(w);
    }
    if (list.length >= 10) break;
  }
  return list;
}
