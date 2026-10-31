import { buildTextArtPrompts, computePixelGridDimensions, resolveTextArtStyleMode } from "../prompts/text-art-prompt.js";
import { getEraInfo } from "../core/era.js";
import { isTextArtEngine } from "../providers/adapter.js";
import { OpenRouterAdapter } from "../providers/openrouter/index.js";
import { CommandCodeAdapter } from "../providers/commandcode/index.js";
import { LocalAdapter } from "../providers/local/index.js";
import { OpenCodeAdapter } from "../providers/opencode/index.js";
import { GeminiAdapter } from "../providers/gemini/index.js";

export function pixelGridJsonToSvg(spec, width, height) {
  if (!spec || typeof spec !== "object") return null;
  var rows = Array.isArray(spec.rows) ? spec.rows : (Array.isArray(spec.grid) ? spec.grid : null);
  var palette = spec.palette || spec.colors || {};
  if (!rows || rows.length === 0) return null;

  var gridH = rows.length;
  var gridW = 0;
  for (var r = 0; r < gridH; r++) {
    var rowStr = String(rows[r] || "");
    if (rowStr.length > gridW) gridW = rowStr.length;
  }
  if (gridW === 0) return null;

  var w = parseInt(width, 10) || gridW * 8;
  var h = parseInt(height, 10) || gridH * 8;
  var rects = [];
  var bgFill = palette["."] || palette[" "] || spec.background || "#1a1c2c";
  rects.push("<rect x=\"0\" y=\"0\" width=\"" + gridW + "\" height=\"" + gridH + "\" fill=\"" + bgFill + "\"/>");

  for (var y = 0; y < gridH; y++) {
    var line = String(rows[y] || "");
    var x = 0;
    while (x < line.length) {
      var ch = line.charAt(x);
      var run = 1;
      while (x + run < line.length && line.charAt(x + run) === ch) {
        run++;
      }
      var color = palette[ch];
      if (color && color !== "transparent" && color !== "none" && color !== bgFill) {
        rects.push("<rect x=\"" + x + "\" y=\"" + y + "\" width=\"" + run + "\" height=\"1\" fill=\"" + color + "\"/>");
      }
      x += run;
    }
  }

  return "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 " + gridW + " " + gridH +
    "\" width=\"" + w + "\" height=\"" + h +
    "\" shape-rendering=\"crispEdges\" style=\"image-rendering:pixelated;image-rendering:crisp-edges;\">" +
    rects.join("") + "</svg>";
}

export function buildFallbackArtSvg(opts) {
  var o = opts || {};
  var role = String(o.role || "photo").toLowerCase();
  var styleMode = o.styleMode || "pixel";
  var dims = computePixelGridDimensions(o.width, o.height, role, o.aspectRatio);
  var safePrompt = String(o.prompt || (role === "ad" ? "Sponsored Banner" : "Dream Graphic"))
    .replace(/[<>&"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  var shortTitle = safePrompt.substring(0, 34);
  var subTitle = safePrompt.substring(34, 72);

  if (styleMode === "pixel") {
    var gw = dims.gridW;
    var gh = dims.gridH;
    var sky = role === "ad" ? "#000080" : "#1d2b53";
    var mid = role === "ad" ? "#008080" : "#29adff";
    var accent = role === "ad" ? "#ffcc00" : "#ff004d";
    var ground = role === "ad" ? "#002244" : "#008751";
    var dither = [];
    for (var dx = 2; dx < gw - 2; dx += 2) {
      dither.push("<rect x=\"" + dx + "\" y=\"" + Math.floor(gh * 0.45) + "\" width=\"1\" height=\"1\" fill=\"" + mid + "\"/>");
    }
    return "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 " + gw + " " + gh +
      "\" width=\"" + dims.width + "\" height=\"" + dims.height +
      "\" shape-rendering=\"crispEdges\" style=\"image-rendering:pixelated;image-rendering:crisp-edges;\">" +
      "<rect x=\"0\" y=\"0\" width=\"" + gw + "\" height=\"" + gh + "\" fill=\"" + sky + "\"/>" +
      "<rect x=\"0\" y=\"" + Math.floor(gh * 0.48) + "\" width=\"" + gw + "\" height=\"" + (gh - Math.floor(gh * 0.48)) + "\" fill=\"" + ground + "\"/>" +
      dither.join("") +
      "<rect x=\"0\" y=\"0\" width=\"" + gw + "\" height=\"1\" fill=\"#ffffff\"/>" +
      "<rect x=\"0\" y=\"0\" width=\"1\" height=\"" + gh + "\" fill=\"#ffffff\"/>" +
      "<rect x=\"0\" y=\"" + (gh - 1) + "\" width=\"" + gw + "\" height=\"1\" fill=\"#000000\"/>" +
      "<rect x=\"" + (gw - 1) + "\" y=\"0\" width=\"1\" height=\"" + gh + "\" fill=\"#000000\"/>" +
      "<rect x=\"3\" y=\"3\" width=\"6\" height=\"6\" fill=\"" + accent + "\"/>" +
      "<rect x=\"4\" y=\"4\" width=\"4\" height=\"4\" fill=\"#fff1e8\"/>" +
      "<text x=\"" + Math.floor(gw * 0.52) + "\" y=\"" + Math.floor(gh * 0.56) +
      "\" text-anchor=\"middle\" dominant-baseline=\"middle\" font-family=\"'Courier New', monospace\" font-weight=\"bold\" font-size=\"" +
      Math.max(4, Math.min(7, Math.floor(gh * 0.28))) + "\" fill=\"#fff1e8\">" + shortTitle.substring(0, 22) + "</text>" +
      "</svg>";
  }

  return "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 " + dims.width + " " + dims.height +
    "\" width=\"" + dims.width + "\" height=\"" + dims.height + "\">" +
    "<defs><linearGradient id=\"bg\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">" +
    "<stop offset=\"0%\" stop-color=\"" + (role === "ad" ? "#1e3a8a" : "#0f172a") + "\"/>" +
    "<stop offset=\"100%\" stop-color=\"" + (role === "ad" ? "#0284c7" : "#334155") + "\"/>" +
    "</linearGradient></defs>" +
    "<rect width=\"100%\" height=\"100%\" fill=\"url(#bg)\" stroke=\"#94a3b8\" stroke-width=\"2\"/>" +
    "<text x=\"50%\" y=\"44%\" text-anchor=\"middle\" dominant-baseline=\"middle\" font-family=\"Verdana, sans-serif\" font-weight=\"bold\" font-size=\"13\" fill=\"#ffffff\">" +
    shortTitle + "</text>" +
    (subTitle
      ? "<text x=\"50%\" y=\"68%\" text-anchor=\"middle\" dominant-baseline=\"middle\" font-family=\"Verdana, sans-serif\" font-size=\"10\" fill=\"#e2e8f0\">" + subTitle + "</text>"
      : "") +
    "</svg>";
}

export function sanitizeExtractedSvg(svgStr, opts) {
  var o = opts || {};
  var styleMode = o.styleMode || "svg";
  var dims = computePixelGridDimensions(o.width, o.height, o.role, o.aspectRatio);
  var s = String(svgStr || "").trim();

  // Strip any embedded <script> tags or inline event handlers for safety
  var scriptRe = new RegExp("<script[\\s\\S]*?<\\/script>", "gi");
  s = s.replace(scriptRe, "");
  s = s.replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*')/gi, "");

  var openMatch = /^<svg([^>]*)>/i.exec(s);
  if (!openMatch) return null;
  var attrs = openMatch[1] || "";

  if (!/\bxmlns\s*=/i.test(attrs)) {
    attrs += " xmlns=\"http://www.w3.org/2000/svg\"";
  }
  if (!/\bviewBox\s*=/i.test(attrs)) {
    if (styleMode === "pixel") {
      attrs += " viewBox=\"0 0 " + dims.gridW + " " + dims.gridH + "\"";
    } else {
      attrs += " viewBox=\"0 0 " + dims.width + " " + dims.height + "\"";
    }
  }
  if (!/\bwidth\s*=/i.test(attrs)) {
    attrs += " width=\"" + dims.width + "\"";
  }
  if (!/\bheight\s*=/i.test(attrs)) {
    attrs += " height=\"" + dims.height + "\"";
  }
  if (styleMode === "pixel") {
    if (!/\bshape-rendering\s*=/i.test(attrs)) {
      attrs += " shape-rendering=\"crispEdges\"";
    }
    if (!/\bimage-rendering\s*:/i.test(attrs)) {
      attrs += " style=\"image-rendering:pixelated;image-rendering:crisp-edges;\"";
    }
  }

  return "<svg" + attrs + ">" + s.substring(openMatch[0].length);
}

export function extractOrBuildSvgDataUrl(rawText, opts) {
  var o = opts || {};
  var text = String(rawText || "");
  text = text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  text = text.replace(/^```(?:svg|xml|html|json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();

  var svgMatch = /<svg[\s\S]*?<\/svg\s*>/i.exec(text);
  if (!svgMatch && /<svg[\s\S]*/i.test(text)) {
    // Handle slightly truncated SVG by closing </svg>
    var partial = /<svg[\s\S]*/i.exec(text)[0];
    svgMatch = [partial + "</svg>"];
  }

  var finalSvg = null;
  if (svgMatch && svgMatch[0]) {
    finalSvg = sanitizeExtractedSvg(svgMatch[0], o);
  }

  if (!finalSvg) {
    var jsonMatch = /\{[\s\S]*\}/.exec(text);
    if (jsonMatch) {
      try {
        var parsed = JSON.parse(jsonMatch[0]);
        finalSvg = pixelGridJsonToSvg(parsed, o.width, o.height);
      } catch (e) {
        // ignore JSON parse error and use fallback
      }
    }
  }

  if (!finalSvg) {
    finalSvg = buildFallbackArtSvg(o);
  }

  return {
    svg: finalSvg,
    isPixelArt: o.styleMode === "pixel",
    dataUrl: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(finalSvg)
  };
}

export function generateTextModelArt(opts, callback) {
  var o = opts || {};
  var era = getEraInfo(o.dateStr || "1999-12-31");
  var styleMode = o.styleMode || resolveTextArtStyleMode(o.imageEngine || "text-pixel", era.year);
  var promptBundle = buildTextArtPrompts({
    prompt: o.prompt,
    role: o.role,
    width: o.width,
    height: o.height,
    aspectRatio: o.aspectRatio,
    dateStr: o.dateStr,
    timelineDivergence: o.timelineDivergence,
    styleMode: styleMode
  });

  var messages = [
    { role: "system", content: promptBundle.systemPrompt },
    { role: "user", content: promptBundle.userPrompt }
  ];

  var provider = o.provider || "agentplatform";
  var model = String(o.model || "").trim();

  function onDone(finalText, err) {
    if (err && (!finalText || !finalText.trim())) {
      callback(err, null);
      return;
    }
    var built = extractOrBuildSvgDataUrl(finalText, {
      prompt: o.prompt,
      role: o.role,
      width: promptBundle.dims.width,
      height: promptBundle.dims.height,
      aspectRatio: o.aspectRatio,
      styleMode: styleMode
    });
    callback(null, built.dataUrl, built);
  }

  if (provider === "local") {
    return LocalAdapter.sendStreaming({
      endpoint: o.endpoint,
      apiKey: (o.localApiKey || o.apiKey || "").trim(),
      model: model || "",
      temperature: 0.65,
      maxTokens: 8192,
      messages: messages,
      onChunk: o.onChunk || function() {},
      onComplete: onDone
    });
  }

  if (provider === "openrouter") {
    return OpenRouterAdapter.sendStreaming({
      apiKey: (o.openrouterApiKey || o.apiKey || "").trim(),
      model: model || "google/gemini-2.5-flash",
      temperature: 0.65,
      messages: messages,
      onChunk: o.onChunk || function() {},
      onComplete: onDone
    });
  }

  if (provider === "commandcode") {
    return CommandCodeAdapter.sendStreaming({
      endpoint: o.endpoint,
      apiKey: (o.commandcodeApiKey || o.apiKey || "").trim(),
      model: model || "deepseek/deepseek-v4.1-flash",
      temperature: 0.65,
      reasoningEffort: o.reasoningEffort,
      maxTokens: 8192,
      messages: messages,
      onChunk: o.onChunk || function() {},
      onComplete: onDone
    });
  }

  if (provider === "opencode-zen" || provider === "opencode-go") {
    var isGo = provider === "opencode-go";
    return OpenCodeAdapter.sendStreaming({
      endpoint: o.endpoint || (isGo ? "https://opencode.ai/zen/go/v1" : "https://opencode.ai/zen/v1"),
      providerName: isGo ? "OpenCode Go" : "OpenCode Zen",
      apiKey: (o.opencodeApiKey || o.apiKey || "").trim(),
      model: model || (isGo ? "qwen3.8-flash" : "claude-sonnet-4-6"),
      temperature: 0.65,
      maxTokens: 4096,
      messages: messages,
      onChunk: o.onChunk || function() {},
      onComplete: onDone
    });
  }

  return GeminiAdapter.sendStreaming({
    endpoint: provider === "agentplatform"
      ? (o.endpoint || "https://aiplatform.googleapis.com")
      : "https://generativelanguage.googleapis.com",
    apiKey: (o.googleApiKey || o.apiKey || "").trim(),
    model: model || "gemini-3.8-flash",
    temperature: 65,
    maxTokens: 4096,
    thinkingBudget: 0,
    geminiAuthMethod: provider === "aistudio" ? "aistudio" : "agentplatform",
    geminiVertexAuthType: o.geminiVertexAuthType || "apikey",
    geminiProjectId: o.geminiProjectId || "",
    geminiLocation: o.geminiLocation || "global",
    messages: messages,
    onChunk: o.onChunk || function() {},
    onComplete: onDone
  });
}

export const TextArtGenerator = {
  isTextArtEngine: isTextArtEngine,
  resolveStyleMode: resolveTextArtStyleMode,
  computePixelGridDimensions: computePixelGridDimensions,
  buildTextArtPrompts: buildTextArtPrompts,
  pixelGridJsonToSvg: pixelGridJsonToSvg,
  buildFallbackArtSvg: buildFallbackArtSvg,
  sanitizeExtractedSvg: sanitizeExtractedSvg,
  extractOrBuildSvgDataUrl: extractOrBuildSvgDataUrl,
  generateArt: generateTextModelArt
};
