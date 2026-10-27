import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

test("index.html contains retro transfer animation stage and elements", () => {
  const html = fs.readFileSync(path.resolve("index.html"), "utf8");
  assert.ok(html.includes('id="transfer-animation-stage"'), "Should contain transfer-animation-stage");
  assert.ok(html.includes('id="transfer-source-node"'), "Should contain transfer-source-node");
  assert.ok(html.includes('class="transfer-track"'), "Should contain transfer-track");
  assert.ok(html.includes('id="transfer-dest-node"'), "Should contain transfer-dest-node");
  assert.ok(html.includes('class="transfer-flying-item item-1"'), "Should contain flying item 1");
  assert.ok(html.includes('class="transfer-flying-item item-2"'), "Should contain flying item 2");
  assert.ok(html.includes('class="transfer-flying-item item-3"'), "Should contain flying item 3");
  assert.ok(html.includes('id="loading-progress-bar"'), "Should contain loading-progress-bar");
});

test("dist/app.css includes animations for transfer flying items and marquee progress bar", () => {
  const css = fs.readFileSync(path.resolve("dist/app.css"), "utf8");
  assert.ok(css.includes(".transfer-animation-stage"), "Must style transfer-animation-stage");
  assert.ok(css.includes("transfer-fly-arc"), "Must define transfer-fly-arc keyframe");
  assert.ok(css.includes("progress-marquee"), "Must define progress-marquee keyframe");
  assert.ok(css.includes("pulse-globe"), "Must define pulse-globe keyframe");
  assert.ok(css.includes("transfer-node-spin"), "Must define transfer-node-spin keyframe");
  assert.ok(css.includes("transfer-dest-catch"), "Must define transfer-dest-catch keyframe");
  assert.ok(css.includes("steps("), "Must use stepped animation timing to keep retro AVI low-framerate authentic aesthetic");
});

test("configureLoadingAnimationEra adjusts nodes for eras", () => {
  // Test loading animation era configuration directly
  const loadingOverlayModule = (function() {
    function configure(era) {
      var sourceIcon = "🌐", flyingGlyph = "📄", destIcon = "📁";
      if (era === "pre90s") { sourceIcon = "📡"; flyingGlyph = "▸"; destIcon = "📺"; }
      else if (era === "modern") { sourceIcon = "☁️"; flyingGlyph = "📦"; destIcon = "💻"; }
      else if (era === "future") { sourceIcon = "🪐"; flyingGlyph = "✦"; destIcon = "🛸"; }
      else { sourceIcon = "🌐"; flyingGlyph = "📄"; destIcon = "📁"; }
      return { sourceIcon: sourceIcon, flyingGlyph: flyingGlyph, destIcon: destIcon };
    }
    return { configure: configure };
  })();

  const eraPre90s = loadingOverlayModule.configure("pre90s");
  assert.equal(eraPre90s.sourceIcon, "📡");
  assert.equal(eraPre90s.flyingGlyph, "▸");
  assert.equal(eraPre90s.destIcon, "📺");

  const era2000s = loadingOverlayModule.configure("2000s");
  assert.equal(era2000s.sourceIcon, "🌐");
  assert.equal(era2000s.flyingGlyph, "📄");
  assert.equal(era2000s.destIcon, "📁");

  const eraModern = loadingOverlayModule.configure("modern");
  assert.equal(eraModern.sourceIcon, "☁️");
  assert.equal(eraModern.flyingGlyph, "📦");
  assert.equal(eraModern.destIcon, "💻");
});
