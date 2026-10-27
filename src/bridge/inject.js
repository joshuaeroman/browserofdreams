import bridgeCss from "./bridge.runtime.css";
import bridgeRuntimeJs from "./runtime.runtime.js";
import { extractHtml } from "../core/html.js";

export function injectBridgeScript(html, currentUrl, dateStr) {
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

  // Remove any previously injected bridge block if re-injecting
  cleanHtml = cleanHtml.replace(
    /<!-- BROWSER_OF_DREAMS_BRIDGE_START -->[\s\S]*?<!-- BROWSER_OF_DREAMS_BRIDGE_END -->/g,
    ""
  );

  if (/<\/body\s*>/i.test(cleanHtml)) {
    return cleanHtml.replace(/<\/body\s*>/i, bridgeMarkup + "</body>");
  }
  return cleanHtml + bridgeMarkup;
}

export { bridgeCss, bridgeRuntimeJs };

export function ensureBridgeInDocument(doc, currentUrl, dateStr) {
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
