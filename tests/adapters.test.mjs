import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { getProvider, hasValidCredentials, resolveConfig, getEffectiveImageProvider } from "../src/providers/registry.js";
import { migrateSettings } from "../src/core/settings.js";
import { normalizeOpenRouterModelId } from "../src/providers/openrouter/models.js";
import { translateMessages as translateGeminiMessages } from "../src/providers/gemini/messages.js";
import { translateResponsesMessages } from "../src/providers/opencode/protocols/responses.js";
import { translateAnthropicMessages } from "../src/providers/opencode/protocols/anthropic.js";

test("Registry resolves registered provider adapters", () => {
  assert.equal(getProvider("gemini").id, "gemini");
  assert.equal(getProvider("agentplatform").id, "agentplatform");
  assert.equal(getProvider("openrouter").id, "openrouter");
  // OpenCode Zen/Go are disabled for the public release (opencode.ai CORS wall).
  // Unregistered ids resolve to the default Agent Platform adapter.
  assert.equal(getProvider("opencode-zen").id, "agentplatform");
  assert.equal(getProvider("opencode-go").id, "agentplatform");
});

test("normalizeOpenRouterModelId cleans URLs and whitespace", () => {
  assert.equal(
    normalizeOpenRouterModelId("https://openrouter.ai/models/openai/gpt-image-2.5-flare?tab=overview"),
    "openai/gpt-image-2.5-flare"
  );
  assert.equal(
    normalizeOpenRouterModelId("  anthropic/claude-3.5-sonnet  "),
    "anthropic/claude-3.5-sonnet"
  );
});

test("Gemini message translation structures contents array", () => {
  var messages = [
    { role: "system", content: "You are an assistant." },
    { role: "user", content: "Hello" },
    { role: "assistant", content: "Hi there" }
  ];
  var translated = translateGeminiMessages(messages);
  assert.equal(translated.systemText, "You are an assistant.");
  assert.equal(translated.contents.length, 2);
  assert.equal(translated.contents[0].role, "user");
  assert.equal(translated.contents[1].role, "model");
});

test("OpenCode Responses message translation structures input array", () => {
  var messages = [
    { role: "system", content: "System instructions" },
    { role: "user", content: "Prompt" }
  ];
  var translated = translateResponsesMessages(messages);
  assert.equal(translated.input.length, 2);
  assert.equal(translated.input[0].type, "message");
  assert.equal(translated.input[0].role, "system");
  assert.equal(translated.input[1].role, "user");
});

test("OpenCode Anthropic message translation separates system prompt", () => {
  var messages = [
    { role: "system", content: "System prompt" },
    { role: "user", content: "Question" }
  ];
  var translated = translateAnthropicMessages(messages);
  assert.equal(translated.system, "System prompt");
  assert.equal(translated.messages.length, 1);
  assert.equal(translated.messages[0].role, "user");
});

test("getEffectiveImageProvider handles text art engines vs raster models", () => {
  var settings = {
    pageProvider: "opencode-zen",
    imageProvider: "same",
    imageEngine: "text-pixel",
    opencodeApiKey: "test-key"
  };
  // Text art works directly with any provider including OpenCode
  assert.equal(getEffectiveImageProvider(settings), "opencode-zen");

  // Raster image mode keeps the selected provider. It does not borrow another provider's key.
  var rasterSettings = {
    pageProvider: "opencode-zen",
    imageProvider: "same",
    imageEngine: "image-model",
    opencodeApiKey: "test-key",
    googleApiKey: "google-key"
  };
  assert.equal(getEffectiveImageProvider(rasterSettings), "opencode-zen");
});

test("migrateSettings stores a key on the provider that was selected", () => {
  var openrouterOnly = migrateSettings({
    pageProvider: "openrouter",
    imageProvider: "same",
    openrouterApiKey: "sk-or-test"
  });
  assert.equal(openrouterOnly.accounts.openrouter.apiKey, "sk-or-test");
  assert.equal(openrouterOnly.accounts["opencode-zen"].apiKey, "");
  assert.equal(openrouterOnly.googleApiKey, undefined);

  var goOnly = migrateSettings({
    pageProvider: "opencode-go",
    imageProvider: "same",
    opencodeApiKey: "oc-key",
    opencodeGoEndpoint: "https://example.test/go"
  });
  assert.equal(goOnly.accounts["opencode-go"].apiKey, "oc-key");
  assert.equal(goOnly.accounts["opencode-go"].endpoint, "https://example.test/go");
  assert.equal(goOnly.accounts["opencode-zen"].apiKey, "");

  var unusedOpenCode = migrateSettings({
    pageProvider: "openrouter",
    imageProvider: "openrouter",
    opencodeApiKey: "oc-spare"
  });
  assert.equal(unusedOpenCode.accounts["opencode-zen"].apiKey, "oc-spare");
  assert.equal(unusedOpenCode.accounts["opencode-go"].apiKey, "");

  var bothGoogle = migrateSettings({
    pageProvider: "agentplatform",
    imageProvider: "aistudio",
    googleApiKey: "shared-google",
    googleProjectId: "proj-1"
  });
  assert.equal(bothGoogle.pageProvider, "agentplatform");
  assert.equal(bothGoogle.imageProvider, "gemini");
  assert.equal(bothGoogle.accounts.agentplatform.apiKey, "shared-google");
  assert.equal(bothGoogle.accounts.agentplatform.projectId, "proj-1");
  assert.equal(bothGoogle.accounts.gemini.apiKey, "shared-google");

  var studioOnly = migrateSettings({
    pageProvider: "aistudio",
    imageProvider: "same",
    googleApiKey: "studio-key"
  });
  assert.equal(studioOnly.pageProvider, "gemini");
  assert.equal(studioOnly.accounts.gemini.apiKey, "studio-key");
  assert.equal(studioOnly.accounts.agentplatform.apiKey, "");

  var preserved = migrateSettings({
    pageProvider: "openrouter",
    imageProvider: "openrouter",
    googleApiKey: "leftover-google"
  });
  assert.equal(preserved.accounts.agentplatform.apiKey, "leftover-google");
  assert.equal(preserved.accounts.gemini.apiKey, "");
});

test("resolveConfig and hasValidCredentials read the account for that provider", () => {
  var settings = {
    pageProvider: "gemini",
    pageModel: "gemini-3.8-flash",
    accounts: {
      agentplatform: { apiKey: "vertex-key", projectId: "proj", vertexAuthType: "apikey", location: "global", endpoint: "https://aiplatform.googleapis.com", thinkingBudget: 256 },
      gemini: { apiKey: "studio-key" },
      openrouter: { apiKey: "" },
      "opencode-zen": { apiKey: "", endpoint: "https://opencode.ai/zen/v1" },
      "opencode-go": { apiKey: "", endpoint: "https://opencode.ai/zen/go/v1" }
    }
  };
  assert.equal(resolveConfig(settings, "gemini").apiKey, "studio-key");
  assert.equal(resolveConfig(settings, "gemini").endpoint, "https://generativelanguage.googleapis.com");
  assert.equal(resolveConfig(settings, "agentplatform").apiKey, "vertex-key");
  assert.equal(resolveConfig(settings, "agentplatform").thinkingBudget, 256);
  assert.equal(hasValidCredentials(settings, "gemini"), true);
  assert.equal(hasValidCredentials(settings, "openrouter"), false);

  var legacy = { pageProvider: "agentplatform", googleApiKey: "flat-key", googleProjectId: "p" };
  assert.equal(resolveConfig(legacy, "agentplatform").apiKey, "flat-key");
  assert.equal(hasValidCredentials(legacy, "agentplatform"), true);
});

test("OpenRouter and OpenCode streamChat disable reasoning effort by default", () => {
  const orChatCode = fs.readFileSync(path.resolve("src/providers/openrouter/chat.js"), "utf8");
  assert.ok(orChatCode.includes('reasoning: { effort: "none" }'), "OpenRouter streaming must set reasoning: { effort: 'none' }");

  const ocChatCode = fs.readFileSync(path.resolve("src/providers/opencode/protocols/chat.js"), "utf8");
  assert.ok(ocChatCode.includes('reasoning_effort: "none"'), "OpenCode chat streaming must set reasoning_effort: 'none'");
});
