import assert from "node:assert/strict";
import test from "node:test";
import { buildDayMemesPrompt, parseMemeList } from "../src/prompts/memes-prompt.js";
import { getFallbackMemes, fetchDayMemesFromModel, clearMemeCache, setCachedMemesForDate } from "../src/features/memes.js";

test("buildDayMemesPrompt formats historical instructions for 10 keywords", () => {
  var prompt = buildDayMemesPrompt("2001-09-11", 0);
  assert.ok(prompt.systemPrompt.includes("exactly 10 distinct"));
  assert.ok(prompt.systemPrompt.includes("2001"));
  assert.ok(prompt.userPrompt.includes("2001-09-11"));
});

test("parseMemeList handles comma, newline, numbered, and JSON formats", () => {
  var raw1 = "iPod, Napster, broadband, Flash, Dreamcast, Matrix, Britney, AIM, Windows XP, Harry Potter";
  var parsed1 = parseMemeList(raw1);
  assert.equal(parsed1.length, 10);
  assert.equal(parsed1[0], "iPod");
  assert.equal(parsed1[9], "Harry Potter");

  var raw2 = "1. Y2K\n2. Dotcom\n3. GeoCities\n4. Netscape\n5. ICQ\n6. Dial-up\n7. Winamp\n8. Napster\n9. MP3\n10. Beanie Babies";
  var parsed2 = parseMemeList(raw2);
  assert.equal(parsed2.length, 10);
  assert.equal(parsed2[0], "Y2K");
});

test("fetchDayMemesFromModel uses non-streaming completeOnce before page dream request", async () => {
  clearMemeCache();
  var completeOnceCalls = [];

  var mockAdapter = {
    completeOnce: function(req, callback) {
      completeOnceCalls.push(req);
      // Simulate non-streaming response with reasoning disabled
      assert.equal(req.maxTokens, 180);
      assert.equal(req.temperature, 0.5);
      callback(null, "word1, word2, word3, word4, word5, word6, word7, word8, word9, word10");
      return { abort: () => {} };
    }
  };

  await new Promise((resolve) => {
    fetchDayMemesFromModel({
      date: "1999-12-31",
      timelineDivergence: 0,
      providerAdapter: mockAdapter,
      hasCredentials: true
    }, function(memes) {
      assert.equal(memes.length, 10);
      assert.equal(completeOnceCalls.length, 1);
      resolve();
    });
  });

  // Second fetch for the same date should hit cache immediately without calling completeOnce again
  await new Promise((resolve) => {
    fetchDayMemesFromModel({
      date: "1999-12-31",
      timelineDivergence: 0,
      providerAdapter: mockAdapter,
      hasCredentials: true
    }, function(memes) {
      assert.equal(memes.length, 10);
      assert.equal(completeOnceCalls.length, 1); // Still 1
      resolve();
    });
  });
});
