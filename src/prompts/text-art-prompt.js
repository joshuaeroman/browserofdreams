import { getEraInfo } from "../core/era.js";
import { getTimelineDivergenceProfile } from "../core/timeline.js";

export function resolveTextArtStyleMode(imageEngine, year) {
  var y = parseInt(year, 10) || 2001;
  if (imageEngine === "text-pixel") return "pixel";
  if (imageEngine === "text-svg") return "svg";
  if (imageEngine === "text-auto") return y <= 1999 ? "pixel" : "svg";
  return "image-model";
}

export function computePixelGridDimensions(width, height, role, aspectRatio) {
  var r = String(role || "photo").toLowerCase();
  var w = parseInt(width, 10) || (r === "ad" ? 468 : (r === "icon" ? 32 : 360));
  var h = parseInt(height, 10) || (r === "ad" ? 60 : (r === "icon" ? 32 : 240));
  var ratio = w / Math.max(1, h);

  if (r === "icon") {
    return { width: w, height: h, gridW: 16, gridH: 16 };
  }

  if (r === "ad" && ratio >= 2.4) {
    return {
      width: w,
      height: h,
      gridW: 117,
      gridH: 15
    };
  }

  if (aspectRatio === "16:9" || ratio >= 1.65) {
    return { width: w, height: h, gridW: 56, gridH: 32 };
  }
  if (aspectRatio === "9:16" || ratio <= 0.62) {
    return { width: w, height: h, gridW: 27, gridH: 48 };
  }
  if (aspectRatio === "3:4" || ratio <= 0.82) {
    return { width: w, height: h, gridW: 36, gridH: 48 };
  }
  if (aspectRatio === "1:1" || (ratio >= 0.92 && ratio <= 1.08)) {
    return { width: w, height: h, gridW: 40, gridH: 40 };
  }
  return {
    width: w,
    height: h,
    gridW: 48,
    gridH: Math.max(20, Math.min(48, Math.round(48 / ratio)))
  };
}

export function buildTextArtPrompts(opts) {
  var o = opts || {};
  var role = String(o.role || "photo").toLowerCase();
  var era = getEraInfo(o.dateStr || "1999-12-31");
  var timelineProfile = getTimelineDivergenceProfile(o.timelineDivergence, era.year);
  var styleMode = o.styleMode || resolveTextArtStyleMode(o.imageEngine || "text-pixel", era.year);
  var dims = computePixelGridDimensions(o.width, o.height, role, o.aspectRatio);
  var roleNoun = role === "ad" ? "web ad" : (role === "icon" ? "icon" : "editorial");
  var promptText = String(o.prompt || (role === "ad" ? "Vintage web banner advertisement" : (role === "icon" ? "Small interface icon glyph" : "Editorial illustration"))).trim();

  if (styleMode === "pixel") {
    var sysPixel =
      "Output one integer-grid pixel-art <svg>. No markdown.";

    var userPixel =
      era.year + " pixel " + roleNoun + ". " + promptText + "\n" +
      timelineProfile.imageDirective + "\n" +
      "Open with <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 " + dims.gridW + " " + dims.gridH + "\" width=\"" + dims.width + "\" height=\"" + dims.height + "\" shape-rendering=\"crispEdges\">.\n" +
      "Only integer <rect> on a " + dims.gridW + "×" + dims.gridH + " grid. No circle, ellipse, smooth path, or rx/ry.\n" +
      "12–16 VGA colors, dithered ground, outlined subject, 1px highlights. Spoof brands only. Unnamed generic people. No real logos or public figures. " +
      (role === "ad"
        ? "Bevel (light top/left, dark bottom/right), icon left, Courier headline font-size=\"" + Math.max(4, Math.round(dims.gridH * 0.34)) + "\", [CLICK HERE] button right."
        : (role === "icon"
          ? "Single centered glyph on a flat single-color background. No text, no border, no bevel."
          : "Foreground, midground, and light.")) +
      "\nOnly the <svg>.";

    return {
      styleMode: "pixel",
      dims: dims,
      systemPrompt: sysPixel,
      userPrompt: userPixel
    };
  }

  var sysSvg = "Output one era-faithful <svg>. No markdown.";

  var userSvg =
    era.year + " vector " + roleNoun + ". " + promptText + "\n" +
    timelineProfile.imageDirective + "\n" +
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 " + dims.width + " " + dims.height + "\" width=\"" + dims.width + "\" height=\"" + dims.height + "\">. " +
    "defs gradients, layered path/polygon/rect/circle. Text stays inside the viewBox. Spoof brands only. Unnamed generic people. No real logos or public figures. " +
    (role === "ad"
      ? "Logo, headline, subcopy, border, and a CLICK HERE / SHOP NOW / LEARN MORE button."
      : (role === "icon"
        ? "Single centered glyph, flat fills, no text, transparent background."
        : "Depth, light, and period detail.")) +
    " Only the <svg>.";

  return {
    styleMode: "svg",
    dims: dims,
    systemPrompt: sysSvg,
    userPrompt: userSvg
  };
}
