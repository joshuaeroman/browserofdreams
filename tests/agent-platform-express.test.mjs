import assert from "node:assert/strict";
import test from "node:test";
import { usesExpressKey } from "../src/providers/gemini/agent-platform.js";

test("a saved Agent Platform project id does not take the express countTokens path", () => {
  assert.equal(usesExpressKey({
    geminiAuthMethod: "agentplatform",
    geminiVertexAuthType: "apikey",
    geminiProjectId: "123456789"
  }, "AQ.express-key", "https://aiplatform.googleapis.com"), false);
});
