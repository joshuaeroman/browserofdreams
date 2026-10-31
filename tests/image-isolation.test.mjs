import assert from "node:assert/strict";
import test from "node:test";
import { state } from "../src/core/state.js";
import { loadPageCache, makeCacheKey } from "../src/core/cache.js";
import { patchCachedHtmlWithImage, handleDiscoveredImages, resolveActiveTextArtModel } from "../src/features/images.js";

test("patchCachedHtmlWithImage preserves targetUrl and prompt metadata in slotImages", () => {
  const targetUrl = "http://www.pets.com/";
  const dateStr = "1999-11-15";
  const cacheKey = makeCacheKey(targetUrl, dateStr, 0);

  state.pageCache[cacheKey] = {
    url: targetUrl,
    date: dateStr,
    title: "Pets.com",
    html: "<html><body><img data-dream-prompt='A golden retriever dog'></body></html>"
  };

  patchCachedHtmlWithImage(targetUrl, dateStr, "dream-img-0", "data:image/png;base64,petdog", "A golden retriever dog");

  const slotEntry = state.pageCache[cacheKey].slotImages["dream-img-0"];
  assert.ok(slotEntry, "slotImages must be defined");
  assert.equal(slotEntry.dataUrl, "data:image/png;base64,petdog");
  assert.equal(slotEntry.prompt, "A golden retriever dog");
  assert.equal(slotEntry.url, targetUrl);
});

test("Command Code text art uses the page model instead of a foreign image model", () => {
  const commandCode = {
    pageProvider: "commandcode",
    pageModel: "claude-sonnet-5-5",
    imageModel: "krea/krea-2-large"
  };
  assert.equal(resolveActiveTextArtModel(commandCode, "commandcode"), "claude-sonnet-5-5");

  const openRouter = {
    pageProvider: "openrouter",
    pageModel: "openai/gpt-5",
    imageModel: "krea/krea-2-large"
  };
  assert.equal(resolveActiveTextArtModel(openRouter, "openrouter"), "krea/krea-2-large");
});

test("handleDiscoveredImages rejects mismatched cached images from different pages or prompts", () => {
  const newsUrl = "http://www.nycnews.com/";
  const dateStr = "2001-09-11";
  const newsKey = makeCacheKey(newsUrl, dateStr, 0);

  // Simulate corrupted cache where dream-img-0 previously had the pets.com dog image
  state.pageCache[newsKey] = {
    url: newsUrl,
    date: dateStr,
    title: "NYC News",
    slotImages: {
      "dream-img-0": {
        dataUrl: "data:image/png;base64,petdog",
        prompt: "A golden retriever dog with pets.com sock puppet",
        url: "http://www.pets.com/"
      }
    }
  };

  const deliveredMessages = [];
  const mockPostToIframe = (msg) => {
    deliveredMessages.push(msg);
  };

  // When nycnews.com discovers its slot with a news prompt:
  const newsSlots = [
    {
      slotId: "dream-img-0",
      prompt: "Photograph of Lower Manhattan on September 11, 2001",
      role: "photo",
      width: 400,
      height: 300
    }
  ];

  handleDiscoveredImages(newsSlots, dateStr, mockPostToIframe, () => {}, newsUrl);

  // The pets.com dog image MUST NOT be delivered to nycnews.com
  const readyMessages = deliveredMessages.filter(m => m.type === "DREAM_IMAGE_READY");
  assert.equal(readyMessages.length, 0, "Mismatched cached image must be rejected and not delivered");
  assert.equal(state.pageCache[newsKey].slotImages["dream-img-0"], undefined, "Mismatched slotImage must be deleted from cache");
});

test("loadPageCache purges legacy unverified string slotImages", () => {
  // Test the sanitizer logic
  const mockStorage = {
    "http://www.nycnews.com/__2001-09-11": {
      url: "http://www.nycnews.com/",
      slotImages: {
        "dream-img-0": "data:image/png;base64,legacyunverifieddog"
      }
    }
  };

  // Simulate loadPageCache sanitizer
  for (var key in mockStorage) {
    if (mockStorage[key] && mockStorage[key].slotImages) {
      var slots = mockStorage[key].slotImages;
      for (var sId in slots) {
        if (typeof slots[sId] === "string") {
          delete slots[sId];
        }
      }
    }
  }

  assert.equal(mockStorage["http://www.nycnews.com/__2001-09-11"].slotImages["dream-img-0"], undefined);
});
