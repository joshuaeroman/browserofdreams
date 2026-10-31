import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { getProvider, hasValidCredentials, resolveConfig, getEffectiveImageProvider } from "../src/providers/registry.js";
import { migrateSettings, providerById, emptyAccounts } from "../src/core/settings.js";
import { normalizeOpenRouterModelId } from "../src/providers/openrouter/models.js";
import {
  CommandCodeAdapter,
  resolveCommandCodeProtocol,
  cacheCommandCodeModelRoutes,
  commandCodeUrl,
  sendCommandCodeChatStreaming,
  completeCommandCodeChatOnce,
  sendCommandCodeMessagesStreaming,
  completeCommandCodeMessagesOnce,
  STATIC_COMMANDCODE_MODELS
} from "../src/providers/commandcode/index.js";
import { translateMessages as translateGeminiMessages } from "../src/providers/gemini/messages.js";
import { translateResponsesMessages } from "../src/providers/opencode/protocols/responses.js";
import { translateAnthropicMessages } from "../src/providers/opencode/protocols/anthropic.js";

function installRetryXHR(instances) {
  var prev = globalThis.XMLHttpRequest;
  class FakeXHR {
    constructor() {
      this.headers = {};
      this.bodies = [];
      this.readyState = 0;
      this.status = 200;
      this.responseText = "";
      instances.push(this);
    }
    open(method, url) {
      this.method = method;
      this.url = url;
      this.headers = {};
      this.readyState = 1;
      this.status = 0;
      this.responseText = "";
    }
    setRequestHeader(name, value) { this.headers[name] = value; }
    send(body) {
      if (body != null) this.bodies.push(JSON.parse(body));
    }
    abort() {}
  }
  globalThis.XMLHttpRequest = FakeXHR;
  return function() {
    globalThis.XMLHttpRequest = prev;
  };
}

function assertAuthHeaders(xhr, key) {
  assert.deepEqual(Object.keys(xhr.headers).sort(), ["Authorization", "Content-Type"]);
  assert.equal(xhr.headers["Content-Type"], "application/json");
  assert.equal(xhr.headers.Authorization, "Bearer " + key);
}

test("Registry resolves registered provider adapters", () => {
  assert.equal(getProvider("gemini").id, "gemini");
  assert.equal(getProvider("agentplatform").id, "agentplatform");
  assert.equal(getProvider("openrouter").id, "openrouter");
  assert.equal(getProvider("commandcode").id, "commandcode");
  assert.equal(getProvider("commandcode").name, "Command Code");
  // OpenCode Zen/Go are disabled for the public release (opencode.ai CORS wall).
  // Unregistered ids resolve to the default Agent Platform adapter.
  assert.equal(getProvider("opencode-zen").id, "agentplatform");
  assert.equal(getProvider("opencode-go").id, "agentplatform");
});

test("Command Code is a text-only provider with an empty account slot", () => {
  var provider = providerById("commandcode");
  assert.ok(provider, "Command Code must be in PROVIDER_CATALOG");
  assert.equal(provider.raster, false);
  assert.equal(provider.defaultEndpoint, "https://api.commandcode.ai/provider/v1");
  assert.equal(emptyAccounts().commandcode.apiKey, "");
  assert.equal(STATIC_COMMANDCODE_MODELS[0], "deepseek/deepseek-v4.1-flash");
});

test("Command Code routes Claude to /messages and open models to /chat/completions", () => {
  assert.equal(resolveCommandCodeProtocol("claude-sonnet-5"), "messages");
  assert.equal(resolveCommandCodeProtocol("claude-opus-4-7"), "messages");
  assert.equal(resolveCommandCodeProtocol("gpt-6-astra"), "chat");
  assert.equal(resolveCommandCodeProtocol("deepseek/deepseek-v4.1-flash"), "chat");

  cacheCommandCodeModelRoutes([{ id: "vendor/route-test", supported_endpoints: ["/messages"] }]);
  assert.equal(resolveCommandCodeProtocol("vendor/route-test"), "messages");
  cacheCommandCodeModelRoutes([{ id: "vendor/route-test", supported_endpoints: ["/chat/completions"] }]);
  assert.equal(resolveCommandCodeProtocol("vendor/route-test"), "chat");

  assert.equal(
    commandCodeUrl("https://api.commandcode.ai/provider/v1/", "/models"),
    "https://api.commandcode.ai/provider/v1/models"
  );
});

test("Command Code normalizes model page URLs to canonical ids", () => {
  var n = CommandCodeAdapter.normalizeModelId;
  assert.equal(n("https://commandcode.ai/models/deepseek-v4-1-flash", STATIC_COMMANDCODE_MODELS), "deepseek/deepseek-v4.1-flash");
  assert.equal(n("https://commandcode.ai/models/claude-sonnet-5?tab=x#y", STATIC_COMMANDCODE_MODELS), "claude-sonnet-5");
  assert.equal(n("https://www.commandcode.ai/models/claude-sonnet-5-5/", STATIC_COMMANDCODE_MODELS), "claude-sonnet-5-5");
  assert.equal(n("deepseek/deepseek-v4.1-flash", STATIC_COMMANDCODE_MODELS), "deepseek/deepseek-v4.1-flash");
  assert.equal(n("vendor/custom-model", STATIC_COMMANDCODE_MODELS), "vendor/custom-model");
  assert.equal(n("   "), "");

  var instances = [];
  var restore = installRetryXHR(instances);
  try {
    CommandCodeAdapter.streamChat({
      endpoint: "https://api.commandcode.ai/provider/v1",
      apiKey: "cmd-key",
      model: "https://commandcode.ai/models/deepseek-v4-1-flash",
      messages: [{ role: "user", content: "Question" }]
    });
    assert.equal(instances[0].bodies[0].model, "deepseek/deepseek-v4.1-flash");
  } finally {
    restore();
  }
});

test("Command Code requests stay inside the CORS-allowed header set", () => {
  var instances = [];
  var prevXHR = globalThis.XMLHttpRequest;
  class FakeXHR {
    constructor() { this.headers = {}; instances.push(this); }
    open(method, url) { this.method = method; this.url = url; }
    setRequestHeader(name, value) { this.headers[name] = value; }
    send(body) { this.body = body; }
    abort() {}
  }
  globalThis.XMLHttpRequest = FakeXHR;
  try {
    CommandCodeAdapter.streamChat({
      endpoint: "https://api.commandcode.ai/provider/v1",
      apiKey: "cmd-key",
      model: "claude-sonnet-5",
      maxTokens: 64,
      temperature: 0.2,
      messages: [
        { role: "system", content: "System prompt" },
        { role: "user", content: "Question" }
      ]
    });
    var messagesReq = instances.shift();
    assert.equal(messagesReq.url, "https://api.commandcode.ai/provider/v1/messages");
    assert.deepEqual(Object.keys(messagesReq.headers).sort(), ["Authorization", "Content-Type"]);
    assert.equal(messagesReq.headers.Authorization, "Bearer cmd-key");
    var messagesBody = JSON.parse(messagesReq.body);
    assert.equal(messagesBody.system, "System prompt");
    assert.equal(messagesBody.messages.length, 1);
    assert.equal(messagesBody.max_tokens, 64);
    assert.equal(messagesBody.stream, true);
    assert.equal(messagesBody.temperature, undefined);

    CommandCodeAdapter.streamChat({
      endpoint: "https://api.commandcode.ai/provider/v1/",
      apiKey: "cmd-key",
      model: "deepseek/deepseek-v4.1-flash",
      messages: [{ role: "user", content: "Question" }]
    });
    var chatReq = instances.shift();
    assert.equal(chatReq.url, "https://api.commandcode.ai/provider/v1/chat/completions");
    assert.deepEqual(Object.keys(chatReq.headers).sort(), ["Authorization", "Content-Type"]);
    assert.equal(JSON.parse(chatReq.body).stream, true);
  } finally {
    globalThis.XMLHttpRequest = prevXHR;
  }
});

test("Command Code maps reasoning effort per protocol", () => {
  var instances = [];
  var prevXHR = globalThis.XMLHttpRequest;
  class FakeXHR {
    constructor() { this.headers = {}; instances.push(this); }
    open() {}
    setRequestHeader(name, value) { this.headers[name] = value; }
    send(body) { this.body = body; }
    abort() {}
  }
  globalThis.XMLHttpRequest = FakeXHR;
  try {
    function send(model, effort) {
      CommandCodeAdapter.streamChat({
        endpoint: "https://api.commandcode.ai/provider/v1",
        apiKey: "cmd-key",
        model: model,
        reasoningEffort: effort,
        messages: [{ role: "user", content: "Question" }]
      });
      return JSON.parse(instances.shift().body);
    }

    assert.equal(send("deepseek/deepseek-v4.1-flash", "off").reasoning_effort, "off");
    assert.equal(send("deepseek/deepseek-v4.1-flash", "low").reasoning_effort, "low");

    var off = send("claude-haiku-5-5", "off");
    assert.deepEqual(off.thinking, { type: "disabled" });
    assert.equal(off.output_config, undefined);

    var medium = send("claude-haiku-5-5", "medium");
    assert.deepEqual(medium.thinking, { type: "adaptive" });
    assert.deepEqual(medium.output_config, { effort: "medium" });
  } finally {
    globalThis.XMLHttpRequest = prevXHR;
  }
});

test("Command Code streams only final content and drops reasoning deltas", () => {
  var instances = [];
  var prevXHR = globalThis.XMLHttpRequest;
  class FakeXHR {
    constructor() { this.headers = {}; this.readyState = 0; this.status = 200; this.responseText = ""; instances.push(this); }
    open() {}
    setRequestHeader(name, value) { this.headers[name] = value; }
    send() {}
    abort() {}
  }
  globalThis.XMLHttpRequest = FakeXHR;
  try {
    var chunks = [];
    var result = null;
    sendCommandCodeChatStreaming({
      endpoint: "https://api.commandcode.ai/provider/v1",
      apiKey: "cmd-key",
      model: "deepseek/deepseek-v4.1-flash",
      messages: [{ role: "user", content: "build a page" }],
      onChunk: function(chunk) { chunks.push(chunk); },
      onComplete: function(text, err) { result = { text: text, err: err }; }
    });
    var xhr = instances[0];
    xhr.responseText = [
      'data: {"choices":[{"delta":{"reasoning_content":"secret chain of thought"}}]}',
      'data: {"choices":[{"delta":{"content":"<!doctype html>"}}]}',
      'data: {"choices":[{"delta":{"content":"<p>hi</p>"}}]}',
      "data: [DONE]",
      ""
    ].join("\n");
    xhr.readyState = 3;
    xhr.onreadystatechange();
    xhr.readyState = 4;
    xhr.onreadystatechange();

    assert.equal(chunks.join(""), "<!doctype html><p>hi</p>");
    assert.deepEqual(result, { text: "<!doctype html><p>hi</p>", err: null });
  } finally {
    globalThis.XMLHttpRequest = prevXHR;
  }
});

test("Command Code flushes an unterminated final SSE line", () => {
  var instances = [];
  var prevXHR = globalThis.XMLHttpRequest;
  class FakeXHR {
    constructor() { this.headers = {}; this.readyState = 0; this.status = 200; this.responseText = ""; instances.push(this); }
    open() {}
    setRequestHeader(name, value) { this.headers[name] = value; }
    send() {}
    abort() {}
  }
  globalThis.XMLHttpRequest = FakeXHR;
  try {
    var result = null;
    sendCommandCodeChatStreaming({
      endpoint: "https://api.commandcode.ai/provider/v1",
      apiKey: "k",
      model: "deepseek/deepseek-v4.1-flash",
      messages: [{ role: "user", content: "x" }],
      onComplete: function(text, err) { result = { text: text, err: err }; }
    });
    var xhr = instances[0];
    xhr.responseText = 'data:{"choices":[{"delta":{"content":"<html>"}}]}\n';
    xhr.readyState = 3;
    xhr.onreadystatechange();
    xhr.responseText += 'data: {"choices":[{"delta":{"content":"</html>"}}]}';
    xhr.readyState = 4;
    xhr.onreadystatechange();
    assert.deepEqual(result, { text: "<html></html>", err: null });
  } finally {
    globalThis.XMLHttpRequest = prevXHR;
  }
});

test("Command Code messages flush an unterminated final text_delta", () => {
  var instances = [];
  var prevXHR = globalThis.XMLHttpRequest;
  class FakeXHR {
    constructor() { this.headers = {}; this.readyState = 0; this.status = 200; this.responseText = ""; instances.push(this); }
    open() {}
    setRequestHeader(name, value) { this.headers[name] = value; }
    send() {}
    abort() {}
  }
  globalThis.XMLHttpRequest = FakeXHR;
  try {
    var result = null;
    sendCommandCodeMessagesStreaming({
      endpoint: "https://api.commandcode.ai/provider/v1",
      apiKey: "k",
      model: "claude-sonnet-5",
      messages: [{ role: "user", content: "x" }],
      onComplete: function(text, err) { result = { text: text, err: err }; }
    });
    var xhr = instances[0];
    xhr.responseText = [
      'event: content_block_delta',
      'data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"A"}}',
      'data: {"type":"content_block_delta","delta":{"type":"thinking_delta","thinking":"SECRET"}}',
      'data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"TAIL"}}'
    ].join("\n");
    xhr.readyState = 4;
    xhr.onreadystatechange();
    assert.deepEqual(result, { text: "ATAIL", err: null });
  } finally {
    globalThis.XMLHttpRequest = prevXHR;
  }
});

test("Command Code chat retries without reasoning_effort when unsupported", () => {
  var instances = [];
  var restore = installRetryXHR(instances);
  try {
    var result = null;
    sendCommandCodeChatStreaming({
      endpoint: "https://api.commandcode.ai/provider/v1",
      apiKey: "k",
      model: "z-ai/glm-5.3-flash",
      reasoningEffort: "off",
      messages: [{ role: "user", content: "x" }],
      onComplete: function(text, err) { result = { text: text, err: err }; }
    });
    var xhr = instances[0];
    assert.equal(xhr.bodies.length, 1);
    assert.equal(xhr.bodies[0].reasoning_effort, "off");

    xhr.status = 400;
    xhr.responseText = '{"error":{"message":"Model does not support reasoning_effort \\"off\\"","type":"invalid_request_error","param":"reasoning_effort","code":"unsupported_value"}}';
    xhr.readyState = 4;
    xhr.onreadystatechange();

    assert.equal(xhr.bodies.length, 2);
    assert.equal("reasoning_effort" in xhr.bodies[1], false);
    assert.equal(xhr.bodies[1].stream, true);
    assertAuthHeaders(xhr, "k");

    xhr.status = 200;
    xhr.responseText = 'data: {"choices":[{"delta":{"content":"OK"}}]}\n';
    xhr.readyState = 4;
    xhr.onreadystatechange();
    assert.deepEqual(result, { text: "OK", err: null });

    result = null;
    sendCommandCodeChatStreaming({
      endpoint: "https://api.commandcode.ai/provider/v1",
      apiKey: "k",
      model: "xiaomi/mimo-v2.6-flash",
      reasoningEffort: "off",
      messages: [{ role: "user", content: "x" }],
      onComplete: function(text, err) { result = { text: text, err: err }; }
    });
    var retryXhr = instances[1];
    retryXhr.status = 400;
    retryXhr.responseText = '{"error":{"message":"reasoning_effort unsupported"}}';
    retryXhr.readyState = 4;
    retryXhr.onreadystatechange();
    assert.equal(retryXhr.bodies.length, 2);
    assertAuthHeaders(retryXhr, "k");

    retryXhr.status = 400;
    retryXhr.responseText = '{"error":{"message":"reasoning_effort still unsupported"}}';
    retryXhr.readyState = 4;
    retryXhr.onreadystatechange();
    assert.equal(retryXhr.bodies.length, 2);
    assert.match(result.err, /still unsupported/);
  } finally {
    restore();
  }
});

test("Command Code chat completion retries without reasoning_effort", () => {
  var instances = [];
  var restore = installRetryXHR(instances);
  try {
    var calls = [];
    completeCommandCodeChatOnce({
      endpoint: "https://api.commandcode.ai/provider/v1",
      apiKey: "k",
      model: "z-ai/glm-5.3-flash",
      reasoningEffort: "off",
      messages: [{ role: "user", content: "x" }]
    }, function(err, text) {
      calls.push({ err: err, text: text });
    });

    var xhr = instances[0];
    assert.equal(xhr.bodies[0].reasoning_effort, "off");
    assert.equal(xhr.bodies[0].stream, false);
    xhr.status = 400;
    xhr.responseText = '{"error":{"message":"reasoning_effort unsupported","param":"reasoning_effort"}}';
    xhr.readyState = 4;
    xhr.onreadystatechange();

    assert.equal(xhr.bodies.length, 2);
    assert.equal("reasoning_effort" in xhr.bodies[1], false);
    assertAuthHeaders(xhr, "k");

    xhr.status = 200;
    xhr.responseText = '{"choices":[{"message":{"content":"OK"}}]}';
    xhr.readyState = 4;
    xhr.onreadystatechange();
    assert.deepEqual(calls, [{ err: null, text: "OK" }]);
  } finally {
    restore();
  }
});

test("Command Code messages retry without thinking when disabled is rejected", () => {
  var instances = [];
  var restore = installRetryXHR(instances);
  try {
    var result = null;
    sendCommandCodeMessagesStreaming({
      endpoint: "https://api.commandcode.ai/provider/v1",
      apiKey: "k",
      model: "claude-sonnet-5-5",
      reasoningEffort: "off",
      messages: [{ role: "user", content: "x" }],
      onComplete: function(text, err) { result = { text: text, err: err }; }
    });

    var xhr = instances[0];
    assert.deepEqual(xhr.bodies[0].thinking, { type: "disabled" });
    xhr.status = 400;
    xhr.responseText = '{"type":"error","error":{"type":"invalid_request_error","message":"thinking.disabled is not supported"}}';
    xhr.readyState = 4;
    xhr.onreadystatechange();

    assert.equal(xhr.bodies.length, 2);
    assert.equal(xhr.bodies[1].thinking, undefined);
    assert.equal(xhr.bodies[1].output_config, undefined);
    assertAuthHeaders(xhr, "k");

    xhr.status = 200;
    xhr.responseText = 'event: content_block_delta\ndata: {"type":"content_block_delta","delta":{"type":"text_delta","text":"A"}}\n';
    xhr.readyState = 4;
    xhr.onreadystatechange();
    assert.deepEqual(result, { text: "A", err: null });

    result = null;
    sendCommandCodeMessagesStreaming({
      endpoint: "https://api.commandcode.ai/provider/v1",
      apiKey: "k",
      model: "claude-sonnet-5-5",
      reasoningEffort: "off",
      messages: [{ role: "user", content: "x" }],
      onComplete: function(text, err) { result = { text: text, err: err }; }
    });
    var exhausted = instances[1];
    exhausted.status = 400;
    exhausted.responseText = '{"error":{"message":"thinking.disabled is not supported"}}';
    exhausted.readyState = 4;
    exhausted.onreadystatechange();
    assert.equal(exhausted.bodies.length, 2);
    assertAuthHeaders(exhausted, "k");

    exhausted.status = 400;
    exhausted.responseText = '{"error":{"message":"thinking.disabled is still not supported"}}';
    exhausted.readyState = 4;
    exhausted.onreadystatechange();
    assert.equal(exhausted.bodies.length, 2);
    assert.match(result.err, /still not supported/);
  } finally {
    restore();
  }
});

test("Command Code messages degrade adaptive thinking then output_config", () => {
  var instances = [];
  var restore = installRetryXHR(instances);
  try {
    var result = null;
    sendCommandCodeMessagesStreaming({
      endpoint: "https://api.commandcode.ai/provider/v1",
      apiKey: "k",
      model: "claude-sonnet-5-5",
      reasoningEffort: "medium",
      messages: [{ role: "user", content: "x" }],
      onComplete: function(text, err) { result = { text: text, err: err }; }
    });

    var xhr = instances[0];
    assert.deepEqual(xhr.bodies[0].thinking, { type: "adaptive" });
    assert.deepEqual(xhr.bodies[0].output_config, { effort: "medium" });

    xhr.status = 400;
    xhr.responseText = '{"error":{"message":"thinking is not supported"}}';
    xhr.readyState = 4;
    xhr.onreadystatechange();
    assert.equal(xhr.bodies.length, 2);
    assert.equal(xhr.bodies[1].thinking, undefined);
    assert.deepEqual(xhr.bodies[1].output_config, { effort: "medium" });
    assertAuthHeaders(xhr, "k");

    xhr.status = 400;
    xhr.responseText = '{"error":{"message":"output_config is not supported"}}';
    xhr.readyState = 4;
    xhr.onreadystatechange();
    assert.equal(xhr.bodies.length, 3);
    assert.equal(xhr.bodies[2].thinking, undefined);
    assert.equal(xhr.bodies[2].output_config, undefined);
    assertAuthHeaders(xhr, "k");

    xhr.status = 200;
    xhr.responseText = 'event: content_block_delta\ndata: {"type":"content_block_delta","delta":{"type":"text_delta","text":"A"}}\n';
    xhr.readyState = 4;
    xhr.onreadystatechange();
    assert.deepEqual(result, { text: "A", err: null });

    result = null;
    sendCommandCodeMessagesStreaming({
      endpoint: "https://api.commandcode.ai/provider/v1",
      apiKey: "k",
      model: "claude-sonnet-5-5",
      reasoningEffort: "medium",
      messages: [{ role: "user", content: "x" }],
      onComplete: function(text, err) { result = { text: text, err: err }; }
    });
    var exhausted = instances[1];
    exhausted.status = 400;
    exhausted.responseText = '{"error":{"message":"thinking is not supported"}}';
    exhausted.readyState = 4;
    exhausted.onreadystatechange();
    assert.equal(exhausted.bodies.length, 2);

    exhausted.status = 400;
    exhausted.responseText = '{"error":{"message":"output_config is not supported"}}';
    exhausted.readyState = 4;
    exhausted.onreadystatechange();
    assert.equal(exhausted.bodies.length, 3);

    exhausted.status = 400;
    exhausted.responseText = '{"error":{"message":"effort is still not supported"}}';
    exhausted.readyState = 4;
    exhausted.onreadystatechange();
    assert.equal(exhausted.bodies.length, 3);
    assert.match(result.err, /effort is still not supported/);
  } finally {
    restore();
  }
});

test("Command Code messages completion retries without thinking", () => {
  var instances = [];
  var restore = installRetryXHR(instances);
  try {
    var calls = [];
    completeCommandCodeMessagesOnce({
      endpoint: "https://api.commandcode.ai/provider/v1",
      apiKey: "k",
      model: "claude-sonnet-5-5",
      reasoningEffort: "off",
      messages: [{ role: "user", content: "x" }]
    }, function(err, text) {
      calls.push({ err: err, text: text });
    });

    var xhr = instances[0];
    assert.deepEqual(xhr.bodies[0].thinking, { type: "disabled" });
    assert.equal(xhr.bodies[0].stream, false);
    xhr.status = 400;
    xhr.responseText = '{"error":{"message":"thinking.disabled is not supported"}}';
    xhr.readyState = 4;
    xhr.onreadystatechange();
    assert.equal(xhr.bodies.length, 2);
    assert.equal(xhr.bodies[1].thinking, undefined);
    assertAuthHeaders(xhr, "k");

    xhr.status = 200;
    xhr.responseText = '{"content":[{"type":"text","text":"A"}]}';
    xhr.readyState = 4;
    xhr.onreadystatechange();
    assert.deepEqual(calls, [{ err: null, text: "A" }]);

    calls = [];
    completeCommandCodeMessagesOnce({
      endpoint: "https://api.commandcode.ai/provider/v1",
      apiKey: "k",
      model: "claude-sonnet-5-5",
      reasoningEffort: "off",
      messages: [{ role: "user", content: "x" }]
    }, function(err, text) {
      calls.push({ err: err, text: text });
    });
    var exhausted = instances[1];
    exhausted.status = 400;
    exhausted.responseText = '{"error":{"message":"thinking.disabled is not supported"}}';
    exhausted.readyState = 4;
    exhausted.onreadystatechange();
    assert.equal(exhausted.bodies.length, 2);

    exhausted.status = 400;
    exhausted.responseText = '{"error":{"message":"thinking.disabled is still not supported"}}';
    exhausted.readyState = 4;
    exhausted.onreadystatechange();
    assert.equal(exhausted.bodies.length, 2);
    assert.match(calls[0].err, /still not supported/);
  } finally {
    restore();
  }
});

test("Command Code chat reports an empty SSE body as empty", () => {
  var instances = [];
  var restore = installRetryXHR(instances);
  try {
    var result = null;
    sendCommandCodeChatStreaming({
      endpoint: "https://api.commandcode.ai/provider/v1",
      apiKey: "k",
      model: "deepseek/deepseek-v4.1-flash",
      messages: [{ role: "user", content: "x" }],
      onComplete: function(text, err) { result = { text: text, err: err }; }
    });
    var xhr = instances[0];
    xhr.status = 200;
    xhr.responseText = 'data: {"choices":[{"delta":{"reasoning_content":"x"}}]}\ndata: [DONE]\n';
    xhr.readyState = 4;
    xhr.onreadystatechange();
    assert.deepEqual(result, { text: "", err: "Empty response from Command Code" });
  } finally {
    restore();
  }
});

test("Command Code messages report an empty SSE body as empty", () => {
  var instances = [];
  var restore = installRetryXHR(instances);
  try {
    var result = null;
    sendCommandCodeMessagesStreaming({
      endpoint: "https://api.commandcode.ai/provider/v1",
      apiKey: "k",
      model: "claude-sonnet-5-5",
      messages: [{ role: "user", content: "x" }],
      onComplete: function(text, err) { result = { text: text, err: err }; }
    });
    var xhr = instances[0];
    xhr.status = 200;
    xhr.responseText = [
      'event: message_start',
      'data: {"type":"message_start"}',
      'event: message_stop',
      'data: {"type":"message_stop"}'
    ].join("\n");
    xhr.readyState = 4;
    xhr.onreadystatechange();
    assert.deepEqual(result, { text: "", err: "Empty response from Command Code messages" });
  } finally {
    restore();
  }
});

test("Command Code model fetch caches routes and prefers the default model", () => {
  var instances = [];
  var restore = installRetryXHR(instances);
  try {
    var calls = [];
    CommandCodeAdapter.fetchModels("https://api.commandcode.ai/provider/v1", "k", function(err, models) {
      calls.push({ err: err, models: models });
    });
    var xhr = instances[0];
    assert.equal(xhr.method, "GET");
    assert.equal(xhr.url, "https://api.commandcode.ai/provider/v1/models");
    assert.deepEqual(Object.keys(xhr.headers), ["Authorization"]);
    assert.equal(xhr.headers.Authorization, "Bearer k");

    xhr.status = 200;
    xhr.responseText = JSON.stringify({
      data: [
        { id: "vendor/fetch-route-test", supported_endpoints: ["/messages"] },
        { id: "zeta/model" },
        { id: "deepseek/deepseek-v4.1-flash", supported_endpoints: ["/chat/completions"] }
      ]
    });
    xhr.readyState = 4;
    xhr.onreadystatechange();

    assert.equal(calls.length, 1);
    assert.equal(calls[0].err, null);
    assert.deepEqual(calls[0].models, [
      "deepseek/deepseek-v4.1-flash",
      "vendor/fetch-route-test",
      "zeta/model"
    ]);
    assert.equal(resolveCommandCodeProtocol("vendor/fetch-route-test"), "messages");
  } finally {
    restore();
  }
});

test("Command Code model fetch surfaces HTTP and timeout errors", () => {
  var instances = [];
  var restore = installRetryXHR(instances);
  try {
    var calls = [];
    CommandCodeAdapter.fetchModels("https://api.commandcode.ai/provider/v1", "k", function(err, models) {
      calls.push({ err: err, models: models });
    });
    var xhr = instances[0];
    xhr.status = 401;
    xhr.responseText = '{"error":{"message":"bad key"}}';
    xhr.readyState = 4;
    xhr.onreadystatechange();
    assert.equal(calls.length, 1);
    assert.match(calls[0].err, /bad key/);
    assert.equal(calls[0].models, null);

    calls = [];
    CommandCodeAdapter.fetchModels("https://api.commandcode.ai/provider/v1", "k", function(err, models) {
      calls.push({ err: err, models: models });
    });
    instances[1].ontimeout();
    assert.equal(calls.length, 1);
    assert.match(calls[0].err, /timed out/);
    assert.equal(calls[0].models, null);
  } finally {
    restore();
  }
});

test("Command Code model fetch settles once on network failure", () => {
  var instances = [];
  var prevXHR = globalThis.XMLHttpRequest;
  class FakeXHR {
    constructor() { this.headers = {}; this.readyState = 0; this.status = 0; this.responseText = ""; instances.push(this); }
    open() {}
    setRequestHeader(name, value) { this.headers[name] = value; }
    send() {}
    abort() {}
  }
  globalThis.XMLHttpRequest = FakeXHR;
  try {
    var calls = [];
    CommandCodeAdapter.fetchModels("https://api.commandcode.ai/provider/v1", "k", function(err, models) {
      calls.push({ err: err, models: models });
    });
    var xhr = instances[0];
    xhr.onerror();
    xhr.readyState = 4;
    xhr.onreadystatechange();
    assert.equal(calls.length, 1);
    assert.match(calls[0].err, /network error/);
    assert.equal(calls[0].models, null);
  } finally {
    globalThis.XMLHttpRequest = prevXHR;
  }
});

test("Image provider falls back to a raster provider when the page provider is text-only", () => {
  var onlyCommandCode = migrateSettings({
    pageProvider: "commandcode",
    imageProvider: "",
    accounts: { commandcode: { apiKey: "cmd-key" } }
  });
  assert.equal(
    getEffectiveImageProvider(onlyCommandCode, onlyCommandCode.imageProvider, onlyCommandCode.pageProvider, "image-model"),
    "gemini"
  );
  assert.equal(
    getEffectiveImageProvider(onlyCommandCode, onlyCommandCode.imageProvider, onlyCommandCode.pageProvider, "text-pixel"),
    "commandcode"
  );

  var withOpenRouter = migrateSettings({
    pageProvider: "commandcode",
    imageProvider: "",
    accounts: { commandcode: { apiKey: "cmd-key" }, openrouter: { apiKey: "or-key" } }
  });
  assert.equal(
    getEffectiveImageProvider(withOpenRouter, withOpenRouter.imageProvider, withOpenRouter.pageProvider, "image-model"),
    "openrouter"
  );
});

test("Command Code key survives settings migration and resolves its endpoint", () => {
  var settings = migrateSettings({
    pageProvider: "commandcode",
    imageProvider: "same",
    accounts: { commandcode: { apiKey: "cmd-key" } }
  });
  assert.equal(settings.pageProvider, "commandcode");
  assert.equal(settings.accounts.commandcode.apiKey, "cmd-key");
  assert.equal(resolveConfig(settings, "commandcode").apiKey, "cmd-key");
  assert.equal(resolveConfig(settings, "commandcode").endpoint, "https://api.commandcode.ai/provider/v1");
  assert.equal(resolveConfig(settings, "commandcode").reasoningEffort, "off");
  assert.equal(resolveConfig(settings, "commandcode").homepageReasoningEffort, "off");
  assert.equal(hasValidCredentials(settings, "commandcode"), true);

  var tuned = migrateSettings({
    pageProvider: "commandcode",
    accounts: {
      commandcode: {
        apiKey: "cmd-key",
        reasoningEffort: "high",
        homepageReasoningEffort: "low"
      }
    }
  });
  assert.equal(resolveConfig(tuned, "commandcode").reasoningEffort, "high");
  assert.equal(resolveConfig(tuned, "commandcode").homepageReasoningEffort, "low");
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

  var flatCommandCode = { pageProvider: "commandcode", commandcodeApiKey: "flat-cc" };
  assert.equal(resolveConfig(flatCommandCode, "commandcode").apiKey, "flat-cc");
});

test("OpenRouter and OpenCode streamChat disable reasoning effort by default", () => {
  const orChatCode = fs.readFileSync(path.resolve("src/providers/openrouter/chat.js"), "utf8");
  assert.ok(orChatCode.includes('reasoning: { effort: "none" }'), "OpenRouter streaming must set reasoning: { effort: 'none' }");

  const ocChatCode = fs.readFileSync(path.resolve("src/providers/opencode/protocols/chat.js"), "utf8");
  assert.ok(ocChatCode.includes('reasoning_effort: "none"'), "OpenCode chat streaming must set reasoning_effort: 'none'");
});
