import bridgeCss from "./bridge.runtime.css";
import bridgeRuntimeJs from "./runtime.runtime.js";
import { extractHtml } from "../core/html.js";
import { buildEraStylesheetCss } from "../core/era-stylesheets.js";

var ERA_BLOCK_PATTERN = /<!-- DREAM_ERA_START -->[\s\S]*?<!-- DREAM_ERA_END -->/g;

function eraMarkupFor(browserProfileId) {
  var eraCss = buildEraStylesheetCss(browserProfileId);
  if (!eraCss) return "";
  return "<!-- DREAM_ERA_START -->\n" +
    "<style id=\"dream-era-style\">\n" +
    eraCss +
    "\n</style>\n" +
    "<!-- DREAM_ERA_END -->\n";
}

// Inserts as the first child of <head> so author rules of equal specificity win.
function insertEraIntoHtml(html, eraMarkup) {
  if (!eraMarkup) return html;
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head([^>]*)>/i, function (match, attrs) {
      return "<head" + attrs + ">\n" + eraMarkup;
    });
  }
  if (/<html[^>]*>/i.test(html)) {
    return html.replace(/<html([^>]*)>/i, function (match, attrs) {
      return "<html" + attrs + ">\n" + eraMarkup;
    });
  }
  return eraMarkup + html;
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

  cleanHtml = insertEraIntoHtml(cleanHtml, eraMarkupFor(browserProfileId));

  if (/<\/body\s*>/i.test(cleanHtml)) {
    return cleanHtml.replace(/<\/body\s*>/i, bridgeMarkup + "</body>");
  }
  return cleanHtml + bridgeMarkup;
}

export { bridgeCss, bridgeRuntimeJs };

export function ensureBridgeInDocument(doc, currentUrl, dateStr, browserProfileId) {
  if (!doc) return;
  try {
    if (!doc.getElementById("dream-bridge-style")) {
      var style = doc.createElement("style");
      style.id = "dream-bridge-style";
      style.textContent = bridgeCss;
      var targetHead = doc.head || doc.documentElement || doc.body;
      if (targetHead) {
        targetHead.appendChild(style);
      }
    }
    var eraCss = buildEraStylesheetCss(browserProfileId);
    var eraStyle = doc.getElementById("dream-era-style");
    if (!eraCss) {
      if (eraStyle) eraStyle.remove();
    } else if (eraStyle) {
      eraStyle.textContent = eraCss;
    } else {
      eraStyle = doc.createElement("style");
      eraStyle.id = "dream-era-style";
      eraStyle.textContent = eraCss;
      var eraHead = doc.head || doc.documentElement;
      if (eraHead) {
        eraHead.insertBefore(eraStyle, eraHead.firstChild);
      }
    }
    if (!doc.getElementById("dream-bridge-script")) {
      var script = doc.createElement("script");
      script.id = "dream-bridge-script";
      var substitutedJs = bridgeRuntimeJs.replace(
        "__BASE_URL__",
        JSON.stringify(currentUrl || "http://www.example.com/")
      );
      script.textContent = substitutedJs;
      var targetBody = doc.body || doc.documentElement;
      if (targetBody) {
        targetBody.appendChild(script);
      }
    }
  } catch (e) {
    console.warn("Could not ensure bridge in document:", e);
  }
}
