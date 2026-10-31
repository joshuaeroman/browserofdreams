import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { resolveSlotImageEngine } from "../src/features/images.js";
import { formatImageDescriptor } from "../src/core/cache.js";
import { migrateSettings } from "../src/core/settings.js";
import { buildTextArtPrompts, computePixelGridDimensions } from "../src/prompts/text-art-prompt.js";
import { buildDreamPrompt } from "../src/prompts/dream-prompt.js";
import { buildFallbackArtSvg } from "../src/features/text-art.js";

function loadBundleSandbox() {
  const code = fs.readFileSync(path.resolve("dist/app.js"), "utf8");
  const sandbox = {
    console: console,
    Math: Math,
    Date: Date,
    String: String,
    Object: Object,
    Array: Array,
    RegExp: RegExp,
    JSON: JSON,
    Promise: Promise,
    URL: URL,
    parseInt: parseInt,
    parseFloat: parseFloat,
    isNaN: isNaN,
    encodeURIComponent: encodeURIComponent,
    decodeURIComponent: decodeURIComponent,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  const store = new Map();
  sandbox.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
    key: (i) => Array.from(store.keys())[i] ?? null,
    get length() { return store.size; }
  };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return sandbox;
}

function configureHybrid(sandbox, overrides) {
  const B = sandbox.BrowserOfDreams;
  Object.assign(B.state.settings, {
    pageProvider: "commandcode",
    pageModel: "deepseek/deepseek-v4.1-flash",
    imageEngine: "hybrid",
    imageProvider: "openrouter",
    imageModel: "openai/gpt-image-2.5-flare",
    imageMode: "all",
    maxImagesPerPage: 12,
    timelineDivergence: 0,
    accounts: {
      commandcode: { apiKey: "cmd-key" },
      openrouter: { apiKey: "or-key" }
    }
  }, overrides || {});
  B.state.activeImageSlots = [];
  B.state.imageMemoryCache = {};
  B.state.currentNavigationUrl = "http://www.snapple.com/";
  B.state.currentNavigationDate = "1999-05-12";
  B.state.navigationEpoch = 0;
  return B;
}

test("hybrid maps ads and icons to text-svg and photos to image-model", () => {
  assert.equal(resolveSlotImageEngine({ imageEngine: "hybrid" }, { role: "ad" }), "text-svg");
  assert.equal(resolveSlotImageEngine({ imageEngine: "hybrid" }, { role: "icon" }), "text-svg");
  assert.equal(resolveSlotImageEngine({ imageEngine: "hybrid" }, { role: "photo" }), "image-model");
  assert.equal(resolveSlotImageEngine({ imageEngine: "hybrid" }, {}), "image-model");
  assert.equal(resolveSlotImageEngine({ imageEngine: "text-pixel" }, { role: "icon" }), "text-pixel");
  assert.equal(resolveSlotImageEngine({}, { role: "ad" }), "image-model");

  assert.equal(
    formatImageDescriptor({ role: "icon", label: "Mail", width: 32, height: 32 }),
    "[ICON: Mail, square, 32x32]"
  );

  const iconDims = computePixelGridDimensions(32, 32, "icon", "1:1");
  assert.deepEqual(iconDims, { width: 32, height: 32, gridW: 16, gridH: 16 });

  const iconPrompts = buildTextArtPrompts({ role: "icon", width: 32, height: 32, styleMode: "svg", dateStr: "1999-05-12" });
  assert.ok(iconPrompts.userPrompt.includes("icon"));
  assert.ok(iconPrompts.userPrompt.includes("transparent background"));

  const resetHybrid = migrateSettings({
    pageProvider: "commandcode",
    imageEngine: "hybrid",
    imageProvider: "commandcode",
    accounts: { commandcode: { apiKey: "k" } }
  });
  assert.equal(resetHybrid.imageProvider, "", "hybrid must reset a text-only image provider");
  const keptHybrid = migrateSettings({
    pageProvider: "commandcode",
    imageEngine: "hybrid",
    imageProvider: "openrouter",
    accounts: { commandcode: { apiKey: "k" }, openrouter: { apiKey: "k" } }
  });
  assert.equal(keptHybrid.imageProvider, "openrouter", "hybrid keeps a raster image provider");

  const iconFallback = buildFallbackArtSvg({ role: "icon", width: 32, height: 32, styleMode: "svg" });
  assert.ok(iconFallback.includes('viewBox="0 0 32 32"'));

  const dream = buildDreamPrompt({ url: "http://www.snapple.com/", date: "1999-05-12", timelineDivergence: 0, imageMode: "all" });
  assert.ok(dream.systemPrompt.includes('data-dream-role="icon"'));

  const html = fs.readFileSync(path.resolve("index.html"), "utf8");
  assert.ok(html.includes('<option value="hybrid">'));
});

test("hybrid routes ads and icons to text SVG and photos to the image model", () => {
  const sandbox = loadBundleSandbox();
  const B = configureHybrid(sandbox);

  const artCalls = [];
  const imageCalls = [];
  sandbox.TextArtGenerator.generateArt = (opts, cb) => {
    artCalls.push(opts);
    cb(null, "data:image/svg+xml;charset=UTF-8,%3Csvg%3E%3C/svg%3E");
  };
  sandbox.OpenRouterAdapter.generateImage = (opts, cb) => {
    imageCalls.push(opts);
    cb(null, "data:image/png;base64,photo");
  };

  const posts = [];
  const post = (msg) => { posts.push(msg); };

  B.handleDiscoveredImages([
    { slotId: "ad1", prompt: "spoof soda banner", role: "ad", width: 468, height: 60, aspectRatio: "21:9" },
    { slotId: "ph1", prompt: "city hall hero photo", role: "photo", width: 400, height: 300, aspectRatio: "4:3" },
    { slotId: "ic1", prompt: "envelope mail icon", role: "icon", width: 32, height: 32, aspectRatio: "1:1" }
  ], "1999-05-12", post, () => {}, "http://www.snapple.com/");

  assert.equal(artCalls.length, 2, "ad and icon must both use the text art engine");
  const adCall = artCalls.find((c) => c.role === "ad");
  const iconCall = artCalls.find((c) => c.role === "icon");
  assert.ok(adCall && iconCall);
  assert.equal(adCall.styleMode, "svg");
  assert.ok(adCall.prompt.includes("web ad"));
  assert.equal(iconCall.styleMode, "svg");
  assert.equal(adCall.provider, "commandcode");
  assert.equal(adCall.model, "deepseek/deepseek-v4.1-flash");
  assert.equal(iconCall.provider, "commandcode");
  assert.equal(iconCall.model, "deepseek/deepseek-v4.1-flash");

  assert.equal(imageCalls.length, 1, "only the photo slot uses the image model");
  assert.equal(imageCalls[0].model, "openai/gpt-image-2.5-flare");
  assert.ok(imageCalls[0].prompt.includes("editorial photo"));

  const ready = posts.filter((m) => m.type === "DREAM_IMAGE_READY");
  assert.equal(ready.length, 3);
  const readyById = {};
  ready.forEach((m) => { readyById[m.slotId] = m; });
  assert.ok(readyById.ad1.dataUrl.startsWith("data:image/svg+xml"));
  assert.ok(readyById.ic1.dataUrl.startsWith("data:image/svg+xml"));
  assert.equal(readyById.ph1.dataUrl, "data:image/png;base64,photo");

  const statuses = posts.filter((m) => m.type === "DREAM_IMAGE_STATUS").map((m) => m.statusText);
  assert.ok(statuses.includes("✨ Drawing Vector SVG..."));
  assert.ok(statuses.includes("⏳ Generating..."));
});

test("photo-only mode skips icons and ads mode skips photos under hybrid", () => {
  const sandbox = loadBundleSandbox();
  const B = configureHybrid(sandbox, { imageMode: "photos" });

  const artCalls = [];
  const imageCalls = [];
  sandbox.TextArtGenerator.generateArt = (opts, cb) => {
    artCalls.push(opts);
    cb(null, "data:image/svg+xml;charset=UTF-8,%3Csvg%3E%3C/svg%3E");
  };
  sandbox.OpenRouterAdapter.generateImage = (opts, cb) => {
    imageCalls.push(opts);
    cb(null, "data:image/png;base64,photo");
  };
  const post = () => {};

  B.handleDiscoveredImages([
    { slotId: "ic1", prompt: "envelope mail icon", role: "icon", width: 32, height: 32, aspectRatio: "1:1" }
  ], "1999-05-12", post, () => {}, "http://www.snapple.com/");

  assert.equal(artCalls.length, 0, "photo-only mode must not draw icons");
  assert.equal(imageCalls.length, 0, "photo-only mode cannot rasterize icons");

  B.state.settings.imageMode = "all";
  B.state.activeImageSlots = [];
  B.handleDiscoveredImages([
    { slotId: "ic2", prompt: "telephone handset icon", role: "icon", width: 32, height: 32, aspectRatio: "1:1" }
  ], "1999-05-12", post, () => {}, "http://www.snapple.com/");

  assert.equal(artCalls.length, 1);
  assert.equal(artCalls[0].styleMode, "svg");
});

function stubAdapters(sandbox, artCalls, imageCalls) {
  sandbox.TextArtGenerator.generateArt = (opts, cb) => {
    artCalls.push(opts);
    cb(null, "data:image/svg+xml;charset=UTF-8,%3Csvg%3E%3C/svg%3E");
  };
  sandbox.OpenRouterAdapter.generateImage = (opts, cb) => {
    imageCalls.push(opts);
    cb(null, "data:image/png;base64,photo");
  };
}

test("domain cache replay respects the slot engine", () => {
  const sandbox = loadBundleSandbox();
  const B = configureHybrid(sandbox);
  const svgData = "data:image/svg+xml;charset=UTF-8,%3Csvg%3E%3C/svg%3E";
  const base = { domain: "snapple.com", date: "1999-05-12", divergence: 0, role: "photo" };

  B.saveDomainImage(Object.assign({}, base, {
    width: 360, height: 240, prompt: "stale photo prompt", dataUrl: svgData,
    engine: "text-svg", id: "snapple-com-photo-360x240-1"
  }));
  B.saveDomainImage(Object.assign({}, base, {
    width: 400, height: 300, prompt: "fresh raster prompt", dataUrl: "data:image/png;base64,reuse",
    engine: "image-model", id: "snapple-com-photo-400x300-2"
  }));
  // Legacy entries recorded no engine: SVG came from a text engine, raster from the image model.
  B.saveDomainImage(Object.assign({}, base, {
    width: 300, height: 200, prompt: "legacy svg prompt", dataUrl: svgData,
    id: "snapple-com-photo-300x200-3"
  }));
  B.saveDomainImage(Object.assign({}, base, {
    width: 320, height: 240, prompt: "legacy raster prompt", dataUrl: "data:image/png;base64,legacy",
    id: "snapple-com-photo-320x240-4"
  }));

  const artCalls = [];
  const imageCalls = [];
  stubAdapters(sandbox, artCalls, imageCalls);
  const posts = [];
  B.handleDiscoveredImages([
    { slotId: "ph-stale", reuse: "snapple-com-photo-360x240-1", prompt: "stale photo prompt", role: "photo", width: 360, height: 240, aspectRatio: "3:2" },
    { slotId: "ph-raster", reuse: "snapple-com-photo-400x300-2", prompt: "fresh raster prompt", role: "photo", width: 400, height: 300, aspectRatio: "4:3" },
    { slotId: "ph-legacy-svg", reuse: "snapple-com-photo-300x200-3", prompt: "legacy svg prompt", role: "photo", width: 300, height: 200, aspectRatio: "3:2" },
    { slotId: "ph-legacy-raster", reuse: "snapple-com-photo-320x240-4", prompt: "legacy raster prompt", role: "photo", width: 320, height: 240, aspectRatio: "4:3" }
  ], "1999-05-12", (m) => posts.push(m), () => {}, "http://www.snapple.com/");

  assert.equal(artCalls.length, 0, "photos never use the text art engine");
  assert.equal(imageCalls.length, 2, "text-engine and legacy SVG entries must be regenerated");

  const ready = {};
  posts.filter((m) => m.type === "DREAM_IMAGE_READY").forEach((m) => { ready[m.slotId] = m; });
  assert.ok(ready["ph-stale"].dataUrl.startsWith("data:image/png"), "stale SVG must be replaced");
  assert.ok(ready["ph-legacy-svg"].dataUrl.startsWith("data:image/png"), "legacy SVG must not reach an image-model slot");
  assert.equal(ready["ph-raster"].dataUrl, "data:image/png;base64,reuse");
  assert.equal(ready["ph-legacy-raster"].dataUrl, "data:image/png;base64,legacy");

  const rewritten = B.getAvailableDomainImages("snapple.com", "1999-05-12", 0)
    .filter((entry) => entry.width === 360 && entry.height === 240);
  assert.equal(rewritten.length, 1);
  assert.equal(rewritten[0].engine, "image-model", "regeneration must rewrite the domain entry engine");
  assert.ok(rewritten[0].dataUrl.startsWith("data:image/png"));
});

test("page cache replay respects the slot engine", () => {
  const sandbox = loadBundleSandbox();
  const B = configureHybrid(sandbox);
  const url = "http://www.snapple.com/";
  const date = "1999-05-12";
  const svgData = "data:image/svg+xml;charset=UTF-8,%3Csvg%3E%3C/svg%3E";

  B.state.pageCache[url.toLowerCase() + "__" + date] = {
    url: url,
    date: date,
    title: "Snapple",
    slotImages: {
      "s-svg": { dataUrl: svgData, prompt: "stale", url: url, engine: "text-svg" },
      "s-raster": { dataUrl: "data:image/png;base64,cached", prompt: "cached photo", url: url, engine: "image-model" },
      "s-legacy-svg": { dataUrl: svgData, prompt: "legacy svg", url: url }
    }
  };

  const artCalls = [];
  const imageCalls = [];
  stubAdapters(sandbox, artCalls, imageCalls);
  const posts = [];
  B.handleDiscoveredImages([
    { slotId: "s-svg", prompt: "stale", role: "photo", width: 400, height: 300, aspectRatio: "4:3" },
    { slotId: "s-raster", prompt: "cached photo", role: "photo", width: 400, height: 300, aspectRatio: "4:3" },
    { slotId: "s-legacy-svg", prompt: "legacy svg", role: "photo", width: 400, height: 300, aspectRatio: "4:3" }
  ], date, (m) => posts.push(m), () => {}, url);

  assert.equal(artCalls.length, 0);
  assert.equal(imageCalls.length, 2, "text-engine and legacy SVG slot images must be regenerated");

  const ready = {};
  posts.filter((m) => m.type === "DREAM_IMAGE_READY").forEach((m) => { ready[m.slotId] = m; });
  assert.ok(ready["s-svg"].dataUrl.startsWith("data:image/png"));
  assert.ok(ready["s-legacy-svg"].dataUrl.startsWith("data:image/png"));
  assert.equal(ready["s-raster"].dataUrl, "data:image/png;base64,cached");
});

test("same-prompt slots with different roles never share art", () => {
  const sandbox = loadBundleSandbox();
  const B = configureHybrid(sandbox);
  const artCalls = [];
  const imageCalls = [];
  stubAdapters(sandbox, artCalls, imageCalls);
  const posts = [];

  B.handleDiscoveredImages([
    { slotId: "ad-x", role: "ad", prompt: "shared prompt", width: 468, height: 60, aspectRatio: "21:9" },
    { slotId: "ph-x", role: "photo", prompt: "shared prompt", width: 400, height: 300, aspectRatio: "4:3" }
  ], "1999-05-12", (m) => posts.push(m), () => {}, "http://www.snapple.com/");

  assert.equal(artCalls.length, 1);
  assert.equal(imageCalls.length, 1);

  const photoReady = posts.filter((m) => m.type === "DREAM_IMAGE_READY" && m.slotId === "ph-x");
  assert.equal(photoReady.length, 1, "the photo must receive exactly one image");
  assert.ok(photoReady[0].dataUrl.startsWith("data:image/png"));
});
