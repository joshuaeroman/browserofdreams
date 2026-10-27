import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

test("manifest.webmanifest adheres to PWA installability criteria", () => {
  const manifestPath = path.resolve("manifest.webmanifest");
  assert.ok(fs.existsSync(manifestPath), "manifest.webmanifest must exist at root");

  const raw = fs.readFileSync(manifestPath, "utf8");
  const manifest = JSON.parse(raw);

  assert.equal(manifest.name, "Browser of Dreams", "Manifest name must match");
  assert.equal(manifest.short_name, "DreamBrowser", "Manifest short_name must match");
  assert.equal(manifest.display, "standalone", "Display mode must be standalone");
  assert.ok(manifest.start_url, "start_url must be defined");
  assert.ok(manifest.theme_color, "theme_color must be defined");
  assert.ok(manifest.background_color, "background_color must be defined");
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length >= 2, "Icons array must contain at least 2 entries");

  // Check 192 and 512 icons exist
  const sizes = manifest.icons.map(i => i.sizes);
  assert.ok(sizes.includes("192x192"), "Must include 192x192 icon");
  assert.ok(sizes.includes("512x512"), "Must include 512x512 icon");

  // Verify each icon file physically exists on disk and is non-empty
  for (const icon of manifest.icons) {
    const iconFile = path.resolve(icon.src);
    assert.ok(fs.existsSync(iconFile), `Icon file ${icon.src} must exist`);
    const stat = fs.statSync(iconFile);
    assert.ok(stat.size > 0, `Icon file ${icon.src} must not be empty`);
  }
});

test("sw.js service worker script is valid and implements required caching rules", () => {
  const swPath = path.resolve("sw.js");
  assert.ok(fs.existsSync(swPath), "sw.js must exist at root for root scope");

  const code = fs.readFileSync(swPath, "utf8");
  assert.ok(code.includes("install"), "Must have install listener");
  assert.ok(code.includes("activate"), "Must have activate listener");
  assert.ok(code.includes("fetch"), "Must have fetch listener");
  assert.ok(code.includes("isExternalApiRequest"), "Must have external API bypass logic");
  assert.ok(code.includes("PRECACHE_ASSETS"), "Must define precached app shell assets");

  // Verify syntax by compiling in vm
  const script = new vm.Script(code);
  assert.ok(script, "sw.js must compile without syntax errors");
});

test("index.html contains all essential PWA headers, manifest link, and install triggers", () => {
  const htmlPath = path.resolve("index.html");
  const html = fs.readFileSync(htmlPath, "utf8");

  assert.ok(html.includes('rel="manifest"'), "index.html must link to web manifest");
  assert.ok(html.includes('manifest.webmanifest'), "index.html must reference manifest.webmanifest");
  assert.ok(html.includes('name="theme-color"'), "index.html must have theme-color meta tag");
  assert.ok(html.includes('name="apple-mobile-web-app-capable"'), "index.html must have apple-mobile-web-app-capable");
  assert.ok(html.includes('rel="apple-touch-icon"'), "index.html must link apple touch icon");
  assert.ok(html.includes('id="btn-install-app"'), "index.html must have toolbar install button");
  assert.ok(html.includes('id="btn-modal-install-app"'), "index.html must have modal install button");
  assert.ok(html.includes('id="win-min"'), "index.html must have win-min button");
  assert.ok(html.includes('id="win-max"'), "index.html must have win-max button");
  assert.ok(html.includes('id="win-close"'), "index.html must have win-close button");
  assert.ok(html.includes('id="chk-show-standalone-titlebar"'), "index.html must have standalone titlebar toggle checkbox");

  // Verify simplified interface removals
  assert.ok(!html.includes('id="preset-select"'), "preset-select dropdown must be removed from interface");
  assert.ok(!html.includes('id="timeline-divergence-slider"'), "timeline-divergence-slider must be removed from main interface");
  assert.ok(!html.includes('id="provider-status-badge"'), "provider-status-badge must be removed from top right");
  assert.ok(!html.includes('id="era-pill"'), "era-pill must be removed from fake browser header");
});

test("dist/app.css ensures [hidden] is never overridden and defines standalone deduplication rules", () => {
  const css = fs.readFileSync(path.resolve("dist/app.css"), "utf8");

  assert.ok(css.includes("[hidden]") && /display:\s*none\s*!important/i.test(css), "CSS must enforce display: none !important for [hidden]");
  assert.ok(css.includes("display-mode: standalone") || css.includes("display-mode:standalone"), "CSS must handle display-mode: standalone");
  assert.ok(css.includes(".is-standalone"), "CSS must handle .is-standalone class");
});

test("dist/app.js exposes pwa controller to BrowserOfDreams bundle", () => {
  const code = fs.readFileSync(path.resolve("dist/app.js"), "utf8");
  const sandbox = {
    console: console,
    Math: Math,
    Date: Date,
    parseInt: parseInt,
    parseFloat: parseFloat,
    isNaN: isNaN,
    String: String,
    Object: Object,
    Array: Array,
    JSON: JSON,
    RegExp: RegExp,
    encodeURIComponent: encodeURIComponent,
    decodeURIComponent: decodeURIComponent,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    setInterval: setInterval,
    clearInterval: clearInterval
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);

  const BrowserOfDreams = sandbox.BrowserOfDreams;
  assert.ok(BrowserOfDreams.pwa, "BrowserOfDreams.pwa should be exposed");
  assert.equal(typeof BrowserOfDreams.pwa.initPWA, "function", "initPWA should be a function");
  assert.equal(typeof BrowserOfDreams.pwa.promptInstall, "function", "promptInstall should be a function");
  assert.equal(typeof BrowserOfDreams.pwa.canPromptInstall, "function", "canPromptInstall should be a function");
  assert.equal(typeof BrowserOfDreams.pwa.isStandaloneMode, "function", "isStandaloneMode should be a function");
  assert.equal(typeof BrowserOfDreams.pwa.syncStandaloneDOM, "function", "syncStandaloneDOM should be a function");
});

test("syncStandaloneDOM updates classes and hides redundant elements in standalone mode", () => {
  const code = fs.readFileSync(path.resolve("dist/app.js"), "utf8");

  function createMockElement(id) {
    const classes = new Set();
    const attrs = new Map();
    return {
      id: id,
      hidden: false,
      addEventListener: () => {},
      removeEventListener: () => {},
      setAttribute: (k, v) => attrs.set(k, v),
      getAttribute: (k) => attrs.get(k) || null,
      classList: {
        add: (c) => classes.add(c),
        remove: (c) => classes.delete(c),
        contains: (c) => classes.has(c)
      }
    };
  }

  const rootEl = createMockElement("html");
  const winEl = createMockElement("browser-window");
  const installBtn = createMockElement("btn-install-app");
  const menuInstallBtn = createMockElement("menu-install-btn");

  const elementsById = {
    "browser-window": winEl,
    "btn-install-app": installBtn,
    "menu-install-btn": menuInstallBtn
  };

  const sandbox = {
    console: console,
    Math: Math,
    Date: Date,
    parseInt: parseInt,
    parseFloat: parseFloat,
    isNaN: isNaN,
    String: String,
    Object: Object,
    Array: Array,
    JSON: JSON,
    RegExp: RegExp,
    encodeURIComponent: encodeURIComponent,
    decodeURIComponent: decodeURIComponent,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    setInterval: setInterval,
    clearInterval: clearInterval,
    document: {
      documentElement: rootEl,
      getElementById: (id) => elementsById[id] || null,
      querySelector: () => null
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    navigator: {
      standalone: true // Simulate standalone mode
    }
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);

  const sync = sandbox.BrowserOfDreams.pwa.syncStandaloneDOM;
  assert.ok(sync, "syncStandaloneDOM must exist");

  // Run in standalone mode without inner retro titlebar
  sync(false);

  assert.ok(rootEl.classList.contains("is-standalone"), "Root should have is-standalone class");
  assert.ok(winEl.classList.contains("is-standalone"), "Window should have is-standalone class");
  assert.equal(winEl.classList.contains("show-standalone-titlebar"), false, "show-standalone-titlebar should not be set");
  assert.equal(installBtn.hidden, true, "Install App button must be hidden in standalone mode");
  assert.equal(menuInstallBtn.hidden, true, "Menu App button must be hidden in standalone mode");

  // Run in standalone mode with inner retro titlebar enabled
  sync(true);
  assert.ok(winEl.classList.contains("show-standalone-titlebar"), "show-standalone-titlebar should be set when true");
});
