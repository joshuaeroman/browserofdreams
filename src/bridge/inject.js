import bridgeCss from "./bridge.runtime.css";
import bridgeRuntimeJs from "./runtime.runtime.js";
import storageShimJs from "./storage-shim.runtime.js";
import streamSinkJs from "./stream-sink.runtime.js";
import { extractHtml } from "../core/html.js";
import { buildEraStylesheetCss } from "../core/era-stylesheets.js";

var ERA_BLOCK_PATTERN = /<!-- DREAM_ERA_START -->[\s\S]*?<!-- DREAM_ERA_END -->/g;
var STORAGE_SHIM_PATTERN = /<!-- DREAM_STORAGE_SHIM_START -->[\s\S]*?<!-- DREAM_STORAGE_SHIM_END -->/g;

// Runs before any author script: the frame's opaque origin makes the real Web
// Storage API throw, so generated pages get a per-document in-memory store.
function storageShimMarkup() {
  return "<!-- DREAM_STORAGE_SHIM_START -->\n" +
    "<script id=\"dream-storage-shim\">\n" +
    storageShimJs +
    "\n</script>\n" +
    "<!-- DREAM_STORAGE_SHIM_END -->\n";
}

// Minimal document that only hosts the stream sink. Assigned to srcdoc before
// streaming so the host can post markup into a frame it cannot reach directly.
export function buildStreamShell() {
  return "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>Dream Stream</title></head>" +
    "<body><script id=\"dream-stream-sink\">\n" +
    streamSinkJs +
    "\n</script></body></html>";
}

function eraMarkupFor(browserProfileId) {
  var eraCss = buildEraStylesheetCss(browserProfileId);
  if (!eraCss) return "";
  return "<!-- DREAM_ERA_START -->\n" +
    "<style id=\"dream-era-style\">\n" +
    eraCss +
    "\n</style>\n" +
    "<!-- DREAM_ERA_END -->\n";
}

// Inserts as the first child of <head> so author rules of equal specificity win
// and the storage shim runs before any author script.
function insertIntoHead(html, headMarkup) {
  if (!headMarkup) return html;
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head([^>]*)>/i, function (match, attrs) {
      return "<head" + attrs + ">\n" + headMarkup;
    });
  }
  if (/<html[^>]*>/i.test(html)) {
    return html.replace(/<html([^>]*)>/i, function (match, attrs) {
      return "<html" + attrs + ">\n" + headMarkup;
    });
  }
  return headMarkup + html;
}

export function injectBridgeScript(html, currentUrl, dateStr, browserProfileId) {
  var cleanHtml = extractHtml(html);

  var substitutedJs = bridgeRuntimeJs.replace(
    "__BASE_URL__",
    JSON.stringify(currentUrl || "http://www.example.com/")
  );

  var bridgeMarkup =
    "\n<!-- BROWSER_OF_DREAMS_BRIDGE_START -->\n" +
    "<style id=\"dream-bridge-style\">\n" +
    bridgeCss +
    "\n</style>\n" +
    "<script id=\"dream-bridge-script\">\n" +
    substitutedJs +
    "\n</script>\n" +
    "<!-- BROWSER_OF_DREAMS_BRIDGE_END -->\n";

  // Remove any previously injected blocks if re-injecting
  cleanHtml = cleanHtml.replace(
    /<!-- BROWSER_OF_DREAMS_BRIDGE_START -->[\s\S]*?<!-- BROWSER_OF_DREAMS_BRIDGE_END -->/g,
    ""
  );
  cleanHtml = cleanHtml.replace(ERA_BLOCK_PATTERN, "");
  cleanHtml = cleanHtml.replace(STORAGE_SHIM_PATTERN, "");

  cleanHtml = insertIntoHead(cleanHtml, storageShimMarkup() + eraMarkupFor(browserProfileId));

  if (/<\/body\s*>/i.test(cleanHtml)) {
    return cleanHtml.replace(/<\/body\s*>/i, bridgeMarkup + "</body>");
  }
  return cleanHtml + bridgeMarkup;
}

export { bridgeCss, bridgeRuntimeJs, storageShimJs, streamSinkJs };
