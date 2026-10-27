import assert from "node:assert/strict";
import test from "node:test";
import {
  SUPPORTED_ASPECT_RATIOS,
  GEMINI_SUPPORTED_ASPECT_RATIOS,
  normalizeSupportedAspectRatio
} from "../src/core/aspect.js";

test("SUPPORTED_ASPECT_RATIOS includes standard 8 ratios", () => {
  assert.deepEqual(SUPPORTED_ASPECT_RATIOS, [
    "1:1", "3:2", "2:3", "4:3", "3:4", "16:9", "9:16", "21:9"
  ]);
});

test("GEMINI_SUPPORTED_ASPECT_RATIOS includes 5 standard ratios", () => {
  assert.deepEqual(GEMINI_SUPPORTED_ASPECT_RATIOS, [
    "1:1", "4:3", "3:4", "16:9", "9:16"
  ]);
});

test("normalizeSupportedAspectRatio exact match returns normalized string", () => {
  assert.equal(normalizeSupportedAspectRatio("16:9", 400, 300, "openrouter"), "16:9");
  assert.equal(normalizeSupportedAspectRatio("21:9", 468, 60, "openrouter"), "21:9");
  assert.equal(normalizeSupportedAspectRatio("1:1", 200, 200, "openrouter"), "1:1");
});

test("normalizeSupportedAspectRatio snaps 1:2 to 9:16 for OpenRouter", () => {
  // 1:2 has ratio 0.5, closest to 9:16 (0.5625)
  assert.equal(normalizeSupportedAspectRatio("1:2", 120, 240, "openrouter"), "9:16");
});

test("normalizeSupportedAspectRatio snaps 468x60 banner to 21:9", () => {
  // 468 / 60 = 7.8, closest to 21:9 (2.333)
  assert.equal(normalizeSupportedAspectRatio("", 468, 60, "openrouter"), "21:9");
});

test("normalizeSupportedAspectRatio for Gemini restricts 21:9 or 3:2 to supported Gemini set", () => {
  // 21:9 is not in GEMINI_SUPPORTED_ASPECT_RATIOS; closest is 16:9
  assert.equal(normalizeSupportedAspectRatio("21:9", 468, 60, "agentplatform"), "16:9");
  // 3:2 is not in Gemini set; closest is 4:3
  assert.equal(normalizeSupportedAspectRatio("3:2", 300, 200, "gemini"), "4:3");
});
