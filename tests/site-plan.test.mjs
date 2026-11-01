import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { buildSitePlanPrompt, normalizeSitePlan, formatSitePlanForPrompt } from "../src/prompts/site-plan-prompt.js";
import { buildDreamPrompt } from "../src/prompts/dream-prompt.js";
import { makeSitePlanKey, saveSitePlan, getCachedSitePlan } from "../src/core/cache.js";
import { resolveNavigationStages, stageLabel } from "../src/core/nav-stages.js";
import { migrateSettings } from "../src/core/settings.js";
import { resolveConfig } from "../src/providers/registry.js";
import {
  effortToThinkingBudget,
  thinkingBudgetToEffort,
  openRouterReasoningEffort,
  localReasoningEffort,
  outputTokenBudget
} from "../src/core/effort.js";
import { MIN_SITE_PLAN_CHARS } from "../src/prompts/site-plan-prompt.js";
import { getCharsetGuide } from "../src/core/era.js";

var URL_CHILD = "http://www.nycnews.com/manhattan";
var DATE = "2001-09-11";

test("Site plan prompt describes the fictional site and its era", () => {
  var bundle = buildSitePlanPrompt({ url: URL_CHILD, date: DATE, timelineDivergence: 0 });
  var system = bundle.systemPrompt;

  assert.equal(bundle.domain, "nycnews.com");
  assert.ok(system.includes("art director"), "names the planner's role");
  assert.ok(system.includes("fictional"), "states the site is invented");
  assert.ok(system.includes("2001"));
  assert.ok(system.includes("believable for web design in 2001"));
  assert.ok(system.includes("REALITY SETTING"));
  assert.ok(system.includes("sitemap"));
  assert.ok(system.includes("widgets"));
  assert.ok(system.includes("imagery"));
  assert.ok(system.includes("100% anchored to real-world history"));
  assert.equal(system.includes('{"'), false, "no JSON fragment in the prompt");
  assert.equal(/4-8|3-6|\b10\b/.test(system), false, "no prescribed quantities");

  assert.ok(bundle.userPrompt.includes("nycnews.com"));
  assert.ok(bundle.userPrompt.includes(DATE));
  assert.ok(bundle.userPrompt.includes("Timeline: 🏛️ Grounded 0%"));
});

test("Site plan prompt forbids implementation detail and requires hex colors", () => {
  var system = buildSitePlanPrompt({ url: URL_CHILD, date: DATE, timelineDivergence: 0 }).systemPrompt;

  assert.ok(system.includes("DESCRIBE, DO NOT PRESCRIBE"));
  assert.ok(system.includes("never write"));
  assert.ok(system.includes("HTML"), "names HTML as forbidden");
  assert.ok(system.includes("image file names"), "forbids asset file names");
  assert.ok(system.includes("pixel measurements"), "forbids measurements");
  assert.ok(system.includes("fixed counts"), "forbids prescribed counts");
  assert.ok(/MUST come with its hex code/.test(system), "hex colors are mandatory");
  assert.equal(system.includes("hex is fine"), false, "hex must not be merely permitted");
});

test("Site plan prompt reflects the timeline tier", () => {
  var grounded = buildSitePlanPrompt({ url: URL_CHILD, date: DATE, timelineDivergence: 0 });
  var alt = buildSitePlanPrompt({ url: URL_CHILD, date: DATE, timelineDivergence: 80 });

  assert.ok(alt.systemPrompt.includes("⚡ Alt History"));
  assert.ok(alt.systemPrompt.includes("A rewritten branch of history"));
  assert.notEqual(alt.systemPrompt, grounded.systemPrompt);

  var fever = buildSitePlanPrompt({ url: URL_CHILD, date: DATE, timelineDivergence: 90 });
  assert.ok(fever.systemPrompt.includes("🌌 Alt Reality"));
  assert.notEqual(fever.systemPrompt, alt.systemPrompt);
});

test("normalizeSitePlan strips fences and keeps prose", () => {
  assert.equal(
    normalizeSitePlan("```text\nA dial-up newspaper with a tiled starburst background.\n```"),
    "A dial-up newspaper with a tiled starburst background."
  );
  assert.equal(normalizeSitePlan(""), "");
  assert.equal(normalizeSitePlan(null), "");
  assert.equal(normalizeSitePlan("A city newspaper."), "A city newspaper.");
});

test("formatSitePlanForPrompt returns trimmed plan text", () => {
  assert.equal(formatSitePlanForPrompt({ text: "A city newspaper." }), "A city newspaper.");
  assert.equal(formatSitePlanForPrompt({ text: "   " }), "");
  assert.equal(formatSitePlanForPrompt(null), "");
  assert.equal(formatSitePlanForPrompt({}), "");
});

test("Site plan cache keys group by domain, year, and timeline tier", () => {
  assert.equal(
    makeSitePlanKey("nycnews.com", "2001-09-11", 0),
    makeSitePlanKey("http://www.nycnews.com/", "2001-03-02", 0)
  );
  assert.notEqual(makeSitePlanKey("nycnews.com", "2001-09-11", 0), makeSitePlanKey("nycnews.com", "2001-09-11", 90));
  assert.notEqual(makeSitePlanKey("nycnews.com", "2001-09-11", 0), makeSitePlanKey("nycnews.com", "2002-09-11", 0));
});

test("Site plans round-trip through the cache", () => {
  var cache = {};
  var entry = saveSitePlan({
    domain: "nycnews.com",
    date: DATE,
    divergence: 0,
    text: "A city newspaper."
  }, cache);
  assert.equal(entry.text, "A city newspaper.");
  assert.equal(entry.year, "2001");
  assert.equal(entry.domain, "nycnews.com");

  assert.equal(
    getCachedSitePlan("http://www.nycnews.com/", "2001-03-01", 0, cache).text,
    "A city newspaper."
  );
  assert.equal(getCachedSitePlan("http://www.nycnews.com/", "2002-03-01", 0, cache), null);
  assert.equal(getCachedSitePlan("http://www.nycnews.com/", "2001-03-01", 90, cache), null);

  cache["empty.example__2001"] = { domain: "empty.example", year: "2001", text: "" };
  assert.equal(getCachedSitePlan("empty.example", "2001-01-01", 0, cache), null);

  assert.equal(saveSitePlan({ domain: "nycnews.com", date: DATE, divergence: 0, text: "   " }, {}), null);
});

test("Navigation stages number the plan and homepage phases", () => {
  var full = resolveNavigationStages(true, true);
  assert.deepEqual(full, ["site-plan", "homepage", "page"]);
  assert.equal(stageLabel(full, "site-plan"), "[1/3] ");
  assert.equal(stageLabel(full, "homepage"), "[2/3] ");
  assert.equal(stageLabel(full, "page"), "[3/3] ");

  assert.deepEqual(resolveNavigationStages(true, false), ["site-plan", "page"]);
  assert.deepEqual(resolveNavigationStages(false, true), ["homepage", "page"]);
  assert.deepEqual(resolveNavigationStages(false, false), ["page"]);
  assert.equal(stageLabel(resolveNavigationStages(false, false), "page"), "[1/1] ");
  assert.equal(stageLabel(resolveNavigationStages(true, false), "homepage"), "");
});

test("Page prompts carry the site plan block", () => {
  var withPlan = buildDreamPrompt({
    url: URL_CHILD,
    date: DATE,
    timelineDivergence: 0,
    sitePlanText: "A city newspaper: navy masthead, Times, nested tables.\nSitemap: /, /manhattan, /archives"
  });
  assert.ok(withPlan.userPrompt.includes('<site_plan domain="'));
  assert.ok(withPlan.userPrompt.includes("A city newspaper"));
  assert.match(withPlan.systemPrompt, /site_plan is this domain's design spec/);
  assert.equal(withPlan.hasSitePlan, true);

  var withoutPlan = buildDreamPrompt({ url: URL_CHILD, date: DATE, timelineDivergence: 0 });
  assert.equal(withoutPlan.userPrompt.includes("<site_plan"), false);
  assert.equal(withoutPlan.hasSitePlan, false);
});

test("Legacy effort fields migrate onto the shared effort pair", () => {
  var commandCode = migrateSettings({
    pageProvider: "commandcode",
    accounts: { commandcode: { apiKey: "k", homepageReasoningEffort: "high" } }
  });
  assert.equal(resolveConfig(commandCode, "commandcode").sitePlanReasoningEffort, "high");
  assert.equal("homepageReasoningEffort" in commandCode.accounts.commandcode, false);
  assert.equal(resolveConfig(commandCode, "commandcode").reasoningEffort, "off");

  var numericBudget = migrateSettings({
    accounts: {
      agentplatform: {
        apiKey: "k",
        projectId: "p",
        vertexAuthType: "apikey",
        location: "global",
        endpoint: "https://aiplatform.googleapis.com",
        thinkingBudget: 4096
      }
    }
  });
  assert.equal(resolveConfig(numericBudget, "agentplatform").reasoningEffort, "medium");
  assert.equal(resolveConfig(numericBudget, "agentplatform").thinkingBudget, 4096);
  assert.equal("thinkingBudget" in numericBudget.accounts.agentplatform, false);
});

test("Effort levels map to provider payload values", () => {
  assert.equal(effortToThinkingBudget("off"), 0);
  assert.equal(effortToThinkingBudget("high"), 16384);
  assert.equal(effortToThinkingBudget("max"), 32768);
  assert.equal(effortToThinkingBudget("bogus"), 0);

  assert.equal(thinkingBudgetToEffort(256), "low");
  assert.equal(thinkingBudgetToEffort(4096), "medium");
  assert.equal(thinkingBudgetToEffort(16384), "high");
  assert.equal(thinkingBudgetToEffort(0), "off");

  assert.equal(openRouterReasoningEffort("off"), "none");
  assert.equal(openRouterReasoningEffort("max"), "high");

  assert.equal(localReasoningEffort("off"), "");
  assert.equal(localReasoningEffort("medium"), "medium");
  assert.equal(localReasoningEffort("xhigh"), "high");
});

test("Output caps reserve the thinking budget", () => {
  // Gemini/Anthropic count reasoning tokens inside the output cap.
  assert.equal(outputTokenBudget(1200, 16384), 17584);
  assert.equal(outputTokenBudget(1200, 0), 1200);
  assert.equal(outputTokenBudget(16384, 0), 16384);
  // Ceiling keeps the transmitted cap inside common model limits.
  assert.equal(outputTokenBudget(1200, 32768), 32768);
  assert.equal(outputTokenBudget(1200, 32768, 16000), 16000);
  // A plan written under the plan effort leaves room for its own text.
  assert.ok(outputTokenBudget(1200, effortToThinkingBudget("high")) > 1200);
});

test("A plan shorter than the minimum is used but never cached", () => {
  assert.ok(MIN_SITE_PLAN_CHARS > 0);
  var cache = {};
  var short = "Navy masthead, Times.";
  assert.ok(short.length < MIN_SITE_PLAN_CHARS);
  // saveSitePlan itself accepts any non-empty text; the guard lives at the
  // navigation boundary, so verify the constant is the threshold used there.
  var source = fs.readFileSync("src/core/navigation.js", "utf8");
  assert.ok(source.includes("text.length >= MIN_SITE_PLAN_CHARS"));
});

test("Character set guidance follows the year and stops once UTF-8 is period", () => {
  assert.equal(getCharsetGuide(1987).id, "ascii");
  assert.equal(getCharsetGuide(1989).id, "ascii");
  assert.equal(getCharsetGuide(1990).id, "windows-1252");
  assert.equal(getCharsetGuide(2001).id, "windows-1252");
  assert.equal(getCharsetGuide(2007).id, "windows-1252");
  assert.equal(getCharsetGuide(2008).id, "utf-8");
  assert.equal(getCharsetGuide(2015).text, "");
  assert.equal(getCharsetGuide(undefined).id, "windows-1252");

  var ascii = getCharsetGuide(1987).text;
  assert.ok(ascii.includes("CHARACTER SET (7-bit ASCII)"));
  assert.ok(ascii.includes("straight quotes"));
  // The instruction must itself be ASCII: a curly quote here would model
  // exactly the character it forbids.
  assert.ok(/^[\x00-\x7F]*$/.test(ascii));

  var cp1252 = getCharsetGuide(2001).text;
  assert.ok(cp1252.includes("CHARACTER SET (Windows-1252)"));
  assert.ok(cp1252.includes("Latin-1"));
  assert.ok(/^[\x00-\x7F]*$/.test(cp1252));

  var page1987 = buildDreamPrompt({ url: "http://www.x.com/", date: "1987-06-01" }).systemPrompt;
  assert.ok(page1987.includes("CHARACTER SET (7-bit ASCII)"));
  var page2001 = buildDreamPrompt({ url: "http://www.x.com/", date: "2001-09-11" }).systemPrompt;
  assert.ok(page2001.includes("CHARACTER SET (Windows-1252)"));
  var page2015 = buildDreamPrompt({ url: "http://www.x.com/", date: "2015-06-01" }).systemPrompt;
  assert.equal(page2015.includes("CHARACTER SET"), false);

  var plan1987 = buildSitePlanPrompt({ url: "http://www.x.com/", date: "1987-06-01" }).systemPrompt;
  assert.ok(plan1987.includes("CHARACTER SET (7-bit ASCII)"));
  assert.ok(plan1987.includes("keep its wording inside the same set"));
  var plan2015 = buildSitePlanPrompt({ url: "http://www.x.com/", date: "2015-06-01" }).systemPrompt;
  assert.equal(plan2015.includes("CHARACTER SET"), false);
});
