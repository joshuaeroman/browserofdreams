import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { formatShellVersion, stampShellVersion } from "../scripts/shell-version.mjs";

const SW_FIXTURE = 'const CACHE_NAME = "dreams-pwa-v6";\n' +
  'const PRECACHE_ASSETS = [\n' +
  '  "./",\n' +
  '  "./dist/app.js?v=6",\n' +
  '  "./dist/app.css?v=6",\n' +
  '  "./icons/icon-192.png"\n' +
  '];\n';

const HTML_FIXTURE = '<link rel="stylesheet" href="dist/app.css?v=6" />\n' +
  '<script src="dist/app.js?v=6" defer></script>\n' +
  '<img src="icons/icon.svg" alt="">\n';

function makeFixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "shell-version-"));
  const swPath = path.join(dir, "sw.js");
  const htmlPath = path.join(dir, "index.html");
  fs.writeFileSync(swPath, SW_FIXTURE);
  fs.writeFileSync(htmlPath, HTML_FIXTURE);
  t.after(function() {
    fs.rmSync(dir, { recursive: true, force: true });
  });
  return { swPath, htmlPath };
}

test("formatShellVersion renders a zero-padded UTC timestamp", () => {
  assert.equal(formatShellVersion(new Date(Date.UTC(2026, 10, 1, 3, 4, 5))), "20261101030405");
  assert.equal(formatShellVersion(new Date(Date.UTC(2030, 0, 9, 0, 0, 0))), "20300109000000");
  assert.equal(formatShellVersion("2026-11-01T13:44:05Z"), "20261101134405");
  assert.throws(function() {
    formatShellVersion(new Date("nope"));
  }, /invalid build date/);
});

test("stampShellVersion versions sw.js and index.html together", (t) => {
  const { swPath, htmlPath } = makeFixture(t);

  const result = stampShellVersion({ swPath: swPath, htmlPath: htmlPath, version: "20261101030405" });

  const sw = fs.readFileSync(swPath, "utf8");
  assert.ok(sw.includes('CACHE_NAME = "dreams-pwa-v20261101030405"'), "cache name must carry the build stamp");
  assert.ok(sw.includes('"./dist/app.js?v=20261101030405"'), "precached app.js must carry the build stamp");
  assert.ok(sw.includes('"./dist/app.css?v=20261101030405"'), "precached app.css must carry the build stamp");
  assert.ok(sw.includes('"./icons/icon-192.png"'), "unrelated precache entries must be untouched");

  const html = fs.readFileSync(htmlPath, "utf8");
  assert.ok(html.includes("dist/app.js?v=20261101030405"), "index.html must request the stamped app.js");
  assert.ok(html.includes("dist/app.css?v=20261101030405"), "index.html must request the stamped app.css");
  assert.ok(html.includes('src="icons/icon.svg"'), "unrelated markup must be untouched");

  assert.deepEqual(result.changed, [swPath, htmlPath]);
});

test("re-stamping the same version changes nothing", (t) => {
  const { swPath, htmlPath } = makeFixture(t);
  stampShellVersion({ swPath: swPath, htmlPath: htmlPath, version: "20261101030405" });
  const swBefore = fs.readFileSync(swPath, "utf8");
  const htmlBefore = fs.readFileSync(htmlPath, "utf8");

  const again = stampShellVersion({ swPath: swPath, htmlPath: htmlPath, version: "20261101030405" });

  assert.deepEqual(again.changed, [], "a same-second rebuild must not rewrite the shell");
  assert.equal(fs.readFileSync(swPath, "utf8"), swBefore);
  assert.equal(fs.readFileSync(htmlPath, "utf8"), htmlBefore);
});

test("stampShellVersion fails loudly when the shell markers disappear", (t) => {
  const { swPath, htmlPath } = makeFixture(t);
  fs.writeFileSync(swPath, "self.addEventListener('install', function() {});\n");

  assert.throws(function() {
    stampShellVersion({ swPath: swPath, htmlPath: htmlPath, version: "20261101030405" });
  }, /CACHE_NAME not found/);

  const { swPath: otherSw, htmlPath: otherHtml } = makeFixture(t);
  fs.writeFileSync(otherHtml, "<!doctype html><html></html>");
  assert.throws(function() {
    stampShellVersion({ swPath: otherSw, htmlPath: otherHtml, version: "20261101030405" });
  }, /versioned app assets not found/);
});
