import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

test("dist/app.js exports all core API symbols to window and globalScope", () => {
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
  assert.ok(BrowserOfDreams, "BrowserOfDreams should be defined on window/globalThis");

  var expectedSymbols = [
    "AgentPlatform",
    "GeminiThinking",
    "GeminiAdapter",
    "AgentPlatformAdapter",
    "OpenRouterAdapter",
    "OpenCodeRoute",
    "OpenCodeAdapter",
    "TextArtGenerator",
    "DayMemesEngine",
    "SUPPORTED_ASPECT_RATIOS",
    "GEMINI_SUPPORTED_ASPECT_RATIOS",
    "normalizeSupportedAspectRatio",
    "getEraInfo",
    "getTimelineDivergenceProfile",
    "normalizeDreamUrl",
    "getHomepageUrl",
    "isHomepageUrl",
    "compactHtmlForContext",
    "buildDreamPrompt",
    "extractHtml",
    "extractTitleFromHtml",
    "injectBridgeScript",
    "initApp",
    "navigateToDream",
    "cancelActiveGeneration"
  ];

  for (var i = 0; i < expectedSymbols.length; i++) {
    var sym = expectedSymbols[i];
    assert.ok(BrowserOfDreams[sym] !== undefined, "Expected symbol " + sym + " to be defined on BrowserOfDreams");
  }

  // Also check top-level global exports for legacy script compatibility
  assert.ok(sandbox.GeminiAdapter, "sandbox.GeminiAdapter should exist");
  assert.ok(sandbox.OpenRouterAdapter, "sandbox.OpenRouterAdapter should exist");
  assert.ok(sandbox.OpenCodeAdapter, "sandbox.OpenCodeAdapter should exist");
  assert.ok(sandbox.AgentPlatform, "sandbox.AgentPlatform should exist");
  assert.ok(sandbox.TextArtGenerator, "sandbox.TextArtGenerator should exist");
  assert.ok(sandbox.DayMemesEngine, "sandbox.DayMemesEngine should exist");
});

test("Provider adapters conform to ProviderAdapter interface", () => {
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
    decodeURIComponent: decodeURIComponent
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);

  const BrowserOfDreams = sandbox.BrowserOfDreams;
  var adapters = [
    BrowserOfDreams.GeminiAdapter,
    BrowserOfDreams.AgentPlatformAdapter,
    BrowserOfDreams.OpenRouterAdapter,
    BrowserOfDreams.OpenCodeAdapter
  ];

  for (var i = 0; i < adapters.length; i++) {
    var ad = adapters[i];
    assert.ok(typeof ad.id === "string", "id must be string");
    assert.ok(typeof ad.streamChat === "function", "streamChat must be function");
    assert.ok(typeof ad.completeOnce === "function", "completeOnce must be function");
    assert.ok(typeof ad.hasCredentials === "function", "hasCredentials must be function");
  }
});

test("buildDreamPrompt and getEraInfo instruct model to be inventive but not anachronistic with webpage design", () => {
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
    decodeURIComponent: decodeURIComponent
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);

  const { buildDreamPrompt, getEraInfo } = sandbox.BrowserOfDreams;

  const promptBundle = buildDreamPrompt({
    url: "http://www.barackobama.com",
    date: "2009-01-20",
    timelineDivergence: 0
  });

  assert.match(
    promptBundle.systemPrompt,
    /inventive but not anachronistic with the webpage design/i,
    "systemPrompt must instruct model to be inventive but not anachronistic"
  );
  assert.match(
    promptBundle.systemPrompt,
    /cookie-cutter/i,
    "systemPrompt must discourage cookie-cutter templates"
  );
  assert.match(
    promptBundle.systemPrompt,
    /era-appropriate dimensions/i,
    "systemPrompt must remind model to ensure era-appropriate dimensions"
  );

  const era2001 = getEraInfo("2001-09-11");
  assert.match(
    era2001.styleGuide,
    /inventive but not anachronistic/i,
    "era styleGuide must include inventive yet non-anachronistic guidance"
  );
  assert.match(
    era2001.styleGuide,
    /strictly no modern spas/i,
    "2001 styleGuide must explicitly restrict modern SPAs"
  );

  const era2009 = getEraInfo("2009-06-15");
  assert.match(
    era2009.styleGuide,
    /barackobama\.com/i,
    "2009 styleGuide should mention bespoke campaign sites like barackobama.com"
  );
});
