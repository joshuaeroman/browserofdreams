import fs from "node:fs";

/**
 * UTC build stamp used as the shell cache version: YYYYMMDDHHMMSS.
 *
 * Digits only, so the same string is safe in a query string, in a Cache
 * Storage bucket name, and in the numeric assertion in tests/pwa.test.mjs.
 */
export function formatShellVersion(date) {
  var d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error("shell-version: invalid build date");
  }
  var pad = function(value) {
    return String(value).padStart(2, "0");
  };
  return String(d.getUTCFullYear()) +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds());
}

/**
 * Writes `version` into the service worker cache name and into every
 * app.js/app.css asset URL in sw.js and index.html, so both files always
 * agree. Throws instead of silently leaving a stale shell behind if the
 * expected markers disappear. Returns the version and the files it rewrote.
 */
export function stampShellVersion(opts) {
  var options = opts || {};
  var version = String(options.version || "").trim();
  var swPath = options.swPath || "sw.js";
  var htmlPath = options.htmlPath || "index.html";
  if (!/^[0-9A-Za-z.-]+$/.test(version)) {
    throw new Error("shell-version: unsafe version " + JSON.stringify(version));
  }

  var sw = fs.readFileSync(swPath, "utf8");
  if (!/CACHE_NAME = "dreams-pwa-v[^"]*"/.test(sw)) {
    throw new Error("shell-version: CACHE_NAME not found in " + swPath);
  }
  if (!/dist\/app\.js\?v=/.test(sw) || !/dist\/app\.css\?v=/.test(sw)) {
    throw new Error("shell-version: versioned app assets not found in " + swPath);
  }
  var nextSw = sw
    .replace(/CACHE_NAME = "dreams-pwa-v[^"]*"/, 'CACHE_NAME = "dreams-pwa-v' + version + '"')
    .replace(/(dist\/app\.js\?v=)[^"]*/g, "$1" + version)
    .replace(/(dist\/app\.css\?v=)[^"]*/g, "$1" + version);

  var html = fs.readFileSync(htmlPath, "utf8");
  if (!/dist\/app\.js\?v=/.test(html) || !/dist\/app\.css\?v=/.test(html)) {
    throw new Error("shell-version: versioned app assets not found in " + htmlPath);
  }
  var nextHtml = html
    .replace(/(dist\/app\.js\?v=)[^"']*/g, "$1" + version)
    .replace(/(dist\/app\.css\?v=)[^"']*/g, "$1" + version);

  var changed = [];
  if (nextSw !== sw) {
    fs.writeFileSync(swPath, nextSw);
    changed.push(swPath);
  }
  if (nextHtml !== html) {
    fs.writeFileSync(htmlPath, nextHtml);
    changed.push(htmlPath);
  }
  return { version: version, changed: changed };
}
