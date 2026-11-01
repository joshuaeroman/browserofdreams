import assert from "node:assert/strict";
import test from "node:test";
import { findClosestHomepage, makeCacheKey } from "../src/core/cache.js";
import { buildDreamPrompt } from "../src/prompts/dream-prompt.js";

test("findClosestHomepage picks the nearest other date of the same site and tier", () => {
  const home = "http://www.nycnews.com/";
  const cache = {};
  function put(url, date, html, divergence, timestamp) {
    cache[makeCacheKey(url, date, divergence)] = {
      url: url,
      date: date,
      html: html,
      timestamp: timestamp
    };
  }
  put(home, "2001-09-11", "<html>sept11</html>", 0, 1);
  put(home, "2001-09-01", "<html>sept1</html>", 0, 2);
  put(home, "2002-09-11", "<html>nextyear</html>", 0, 3);
  put("http://www.nycnews.com/manhattan", "2001-09-12", "<html>sub</html>", 0, 9);
  put(home, "2001-09-12", "<html>other-tier</html>", 90, 9);

  const nearest = findClosestHomepage(cache, home, "2001-09-10", 0);
  assert.equal(nearest.html, "<html>sept11</html>");
  assert.equal(findClosestHomepage(cache, home, "2001-09-11", 0).html, "<html>sept1</html>");
  assert.equal(findClosestHomepage(cache, home, "2001-09-10", 90).html, "<html>other-tier</html>");
});

test("a new homepage prompt carries the prior date as design reference", () => {
  const bundle = buildDreamPrompt({
    url: "http://www.nycnews.com/",
    date: "2001-09-10",
    timelineDivergence: 0,
    homepageUrl: "http://www.nycnews.com/",
    priorHomepageHtml: "<html><title>NYC News</title></html>",
    priorHomepageDate: "2001-09-11"
  });
  assert.match(bundle.systemPrompt, /prior_homepage is this same site on 2001-09-11/);
  assert.match(bundle.systemPrompt, /Rewrite headlines, stories, prices, and dates for 2001-09-10/);
  assert.match(bundle.userPrompt, /<prior_homepage url="http:\/\/www\.nycnews\.com\/" date="2001-09-11">/);
  assert.match(bundle.userPrompt, /NYC News/);
  assert.equal(bundle.userPrompt.includes("<site_homepage"), false);
});

test("Page prompt carries an era-neutral fidelity rule", () => {
  var old = buildDreamPrompt({ url: "http://www.nycnews.com/", date: "1999-12-31", timelineDivergence: 0 });
  var modern = buildDreamPrompt({ url: "http://www.nycnews.com/", date: "2011-06-01", timelineDivergence: 0 });

  assert.ok(old.systemPrompt.includes("ERA FIDELITY"));
  assert.ok(old.systemPrompt.includes("nothing may come from after 1999"));
  assert.ok(modern.systemPrompt.includes("nothing may come from after 2011"));

  // Same reminder in every era: only the year may differ, and no measurements.
  var a = /ERA FIDELITY:[^\n]+/.exec(old.systemPrompt)[0];
  var b = /ERA FIDELITY:[^\n]+/.exec(modern.systemPrompt)[0];
  assert.equal(a.split("1999").join("YEAR"), b.split("2011").join("YEAR"));
  assert.equal(/\d+\s*(?:px|pixels)/.test(a), false, "fidelity rule must not prescribe measurements");
  assert.ok(/emoji|character/i.test(a), "covers post-era characters");
  assert.ok(/link underlines/i.test(a), "covers default browser affordances");
});
