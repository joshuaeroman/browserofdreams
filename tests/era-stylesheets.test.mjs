import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {
  BROWSER_PROFILES,
  profileById,
  listBrowserProfiles,
  buildEraStylesheetCss,
  parseBrowserProfileFromPlan,
  resolveBrowserProfile
} from "../src/core/era-stylesheets.js";
import { buildSitePlanPrompt } from "../src/prompts/site-plan-prompt.js";
import { buildDreamPrompt } from "../src/prompts/dream-prompt.js";

test("profile catalog keeps its documented order and has no year mapping", () => {
  assert.deepEqual(
    listBrowserProfiles().map(function (p) { return p.id; }),
    ["mosaic", "netscape3", "netscape4", "ie4", "ie5", "ie6", "firefox1"]
  );
  assert.ok(BROWSER_PROFILES.every(function (p) { return p.label && p.id; }));
  assert.equal(BROWSER_PROFILES.some(function (p) { return "fromYear" in p || "toYear" in p; }), false);
  assert.equal(profileById("ie5").label, "Internet Explorer 5");
  assert.equal(profileById("IE5").id, "ie5", "id lookup is case-insensitive");
  assert.equal(profileById("tailwind"), null);
  assert.equal(profileById(""), null);
});

test("era stylesheet CSS carries the profile's own colours and chrome", () => {
  var ie5 = buildEraStylesheetCss("ie5");
  assert.ok(ie5.includes("2px outset #ffffff"));
  assert.ok(ie5.includes("#d4d0c8"));
  assert.ok(ie5.includes("text-decoration: underline"));
  assert.ok(ie5.includes("font-family: Tahoma"));

  var mosaic = buildEraStylesheetCss("mosaic");
  assert.ok(mosaic.includes("background: #c0c0c0"));
  assert.ok(mosaic.includes("2px outset #dfdfdf"));
  assert.equal(mosaic.includes("Tahoma"), false);

  assert.equal(buildEraStylesheetCss("nope"), "");
  assert.equal(buildEraStylesheetCss(""), "");
});

test("plan text parsing accepts only known profile ids", () => {
  assert.equal(parseBrowserProfileFromPlan("BROWSER PROFILE: ie5\nThe rest of the plan"), "ie5");
  assert.equal(parseBrowserProfileFromPlan("browser profile:   netscape4"), "netscape4");
  assert.equal(parseBrowserProfileFromPlan("BROWSER PROFILE: none"), "");
  assert.equal(parseBrowserProfileFromPlan("BROWSER PROFILE: tailwind"), "");
  assert.equal(parseBrowserProfileFromPlan("No profile line here"), "");
  assert.equal(parseBrowserProfileFromPlan(""), "");
});

test("cached profile wins over plan text, text is the fallback", () => {
  assert.equal(resolveBrowserProfile({ browserProfile: "ie4", text: "BROWSER PROFILE: netscape4" }), "ie4");
  assert.equal(resolveBrowserProfile({ browserProfile: "bogus", text: "BROWSER PROFILE: firefox1" }), "firefox1");
  assert.equal(resolveBrowserProfile({ text: "BROWSER PROFILE: ie6" }), "ie6");
  assert.equal(resolveBrowserProfile({ browserProfile: "", text: "BROWSER PROFILE: none" }), "");
  assert.equal(resolveBrowserProfile(null), "");
  assert.equal(resolveBrowserProfile({}), "");
});

test("plan prompt offers every profile regardless of year", () => {
  var old = buildSitePlanPrompt({ url: "http://x.com/", date: "1999-12-31" }).systemPrompt;
  var recent = buildSitePlanPrompt({ url: "http://x.com/", date: "2015-06-01" }).systemPrompt;

  assert.ok(old.includes("BROWSER PROFILE: the visitor's browser"));
  assert.ok(old.includes("netscape4 — Netscape Navigator 4"));
  assert.ok(old.includes("firefox1 — Mozilla Firefox 1.0"));
  assert.ok(old.includes("none — no browser overrides"));
  assert.ok(recent.includes("firefox1 — Mozilla Firefox 1.0"), "the menu is year-independent");
  assert.ok(recent.includes("mosaic — NCSA Mosaic 1.x"));

  var menuOld = old.slice(old.indexOf("Options: "), old.indexOf("The viewer supplies"));
  var menuRecent = recent.slice(recent.indexOf("Options: "), recent.indexOf("The viewer supplies"));
  assert.equal(menuOld, menuRecent);
});

test("page prompt embeds the applied browser defaults", () => {
  var withProfile = buildDreamPrompt({ url: "http://www.x.com/", date: "1999-12-31", browserProfile: "netscape4" });
  assert.equal(withProfile.browserProfile, "netscape4");
  assert.ok(withProfile.systemPrompt.includes("CLIENT: Netscape Navigator 4"));
  assert.ok(withProfile.systemPrompt.includes("<browser_defaults>"));
  assert.ok(withProfile.systemPrompt.includes("border: 2px outset #dfdfdf"));

  var without = buildDreamPrompt({ url: "http://www.x.com/", date: "1999-12-31" });
  assert.equal(without.browserProfile, "");
  assert.equal(without.systemPrompt.includes("CLIENT:"), false);
  assert.equal(without.systemPrompt.includes("<browser_defaults>"), false);

  var unknown = buildDreamPrompt({ url: "http://www.x.com/", date: "1999-12-31", browserProfile: "tailwind" });
  assert.equal(unknown.browserProfile, "");
  assert.equal(unknown.systemPrompt.includes("<browser_defaults>"), false);
});

test("injected era style lands first in head and is idempotent", () => {
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

  const injectBridgeScript = sandbox.BrowserOfDreams.injectBridgeScript;
  assert.equal(typeof injectBridgeScript, "function");

  const html = "<html><head><title>t</title><style>a{color:red}</style></head><body>x</body></html>";
  const out = injectBridgeScript(html, "http://x.com/", "1999-12-31", "netscape4");
  const eraAt = out.indexOf('<style id="dream-era-style">');
  const authorAt = out.indexOf("<style>a{color:red}</style>");
  const bodyAt = out.indexOf("<body");
  assert.ok(eraAt !== -1, "era style must be injected");
  assert.ok(eraAt < authorAt, "era style must precede author CSS");
  assert.ok(eraAt < bodyAt, "era style must sit in the head");
  assert.ok(out.includes("2px outset #dfdfdf"));

  const again = injectBridgeScript(out, "http://x.com/", "1999-12-31", "netscape4");
  assert.equal((again.match(/dream-era-style/g) || []).length, 1, "re-injection must not duplicate the style");
  assert.ok(again.indexOf('<style id="dream-era-style">') < again.indexOf("<style>a{color:red}</style>"));

  const none = injectBridgeScript(html, "http://x.com/", "1999-12-31", "");
  assert.equal(none.includes("dream-era-style"), false);

  const switched = injectBridgeScript(out, "http://x.com/", "1999-12-31", "ie5");
  assert.equal((switched.match(/dream-era-style/g) || []).length, 1);
  assert.ok(switched.includes("#d4d0c8"));
});
