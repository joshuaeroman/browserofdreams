#!/usr/bin/env node
// OpenAI-compatible mock server for testing the Local LLM provider without
// downloading a model. Dev-only: nothing imports this file and it is not
// bundled into the app.
//
//   npm run mock:llm            # 127.0.0.1:11434 (Ollama's default port)
//   PORT=11435 npm run mock:llm

import http from "node:http";

var PORT = parseInt(process.env.PORT, 10) || 11434;
var HOST = "127.0.0.1";
var MODEL_ID = "mock-local-model";

var CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "600"
};

var MEME_KEYWORDS = [
  "dream modem",
  "dial tone",
  "web ring",
  "chat room",
  "CD-ROM",
  "pixel art",
  "cyber cafe",
  "VHS tape",
  "geocities",
  "dial-up"
];

var SITE_PLAN_TEXT =
  "BROWSER PROFILE: netscape4\n" +
  "Mock Dial-Up Daily is a one-editor neighborhood newspaper, loading from a home page with a stacked centered wordmark over a 32px banner.\n" +
  "Navy #000080, silver #c0c0c0, and yellow #ffff00 on Times New Roman; nested tables and a tiled starburst background.\n" +
  "A yellow button row under the masthead leads to the borough desks; the front page runs three columns with a sidebar holding a hit counter, webring box, weather strip, and guestbook link.\n" +
  "Pages: / (Home, the front page), /manhattan (Manhattan, borough desk), /archives (Archives, back issues), /guestbook (Guestbook, reader sign-in).\n" +
  "Graphics: tiled starburst background, beveled banner ad, animated envelope icon.";

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function pageHtml(model, promptSnippet) {
  return "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><title>Mock Local LLM</title></head>" +
    "<body style=\"font-family:Verdana,Tahoma,sans-serif;padding:24px\">" +
    "<h1>Mock Local LLM</h1>" +
    "<p>Served by the local OpenAI-compatible mock on port " + PORT + ".</p>" +
    "<p>Model: <code>" + escapeHtml(model) + "</code></p>" +
    "<p>Prompt echo: <code>" + escapeHtml(promptSnippet) + "</code></p>" +
    "</body></html>";
}

function sendJson(res, status, body, extraHeaders) {
  var headers = Object.assign({}, CORS_HEADERS, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body)
  }, extraHeaders || {});
  res.writeHead(status, headers);
  res.end(body);
}

function firstUserContent(messages) {
  if (!Array.isArray(messages)) return "";
  for (var i = 0; i < messages.length; i++) {
    var message = messages[i];
    if (message && message.role === "user") {
      var content = typeof message.content === "string" ? message.content : "";
      return content.substring(0, 80);
    }
  }
  return "";
}

function firstSystemContent(messages) {
  if (!Array.isArray(messages)) return "";
  for (var i = 0; i < messages.length; i++) {
    var message = messages[i];
    if (message && message.role === "system") {
      return typeof message.content === "string" ? message.content : "";
    }
  }
  return "";
}

function fullUserContent(messages) {
  if (!Array.isArray(messages)) return "";
  var out = "";
  for (var i = 0; i < messages.length; i++) {
    var message = messages[i];
    if (message && typeof message.content === "string") out += message.content + "\n";
  }
  return out;
}

function streamContent(res, content) {
  res.writeHead(200, Object.assign({}, CORS_HEADERS, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive"
  }));
  res.write("data: " + JSON.stringify({ choices: [{ delta: { role: "assistant" } }] }) + "\n\n");

  var slices = [];
  for (var i = 0; i < content.length; i += 24) slices.push(content.substring(i, i + 24));

  function writeSlice(index) {
    if (index >= slices.length) {
      res.write("data: " + JSON.stringify({ choices: [{ delta: {}, finish_reason: "stop" }] }) + "\n\n");
      res.write("data: [DONE]\n\n");
      res.end();
      return;
    }
    res.write("data: " + JSON.stringify({ choices: [{ delta: { content: slices[index] } }] }) + "\n\n");
    setTimeout(function() { writeSlice(index + 1); }, 15);
  }

  writeSlice(0);
}

function handleChat(req, res, body) {
  var payload = body && typeof body === "object" ? body : {};
  var model = payload.model || MODEL_ID;
  var prompt = firstUserContent(payload.messages);
  var wantsStream = payload.stream === true;
  var memesOnly = !wantsStream && typeof payload.max_tokens === "number" && payload.max_tokens <= 200;
  var system = firstSystemContent(payload.messages);
  var kind = /site planner/i.test(system) ? "site-plan" : (memesOnly ? "memes" : "page");
  var content = kind === "site-plan"
    ? SITE_PLAN_TEXT
    : (kind === "memes" ? MEME_KEYWORDS.join(", ") : pageHtml(model, prompt));

  console.log("[mock-local-llm] POST /v1/chat/completions model=" + model +
    " stream=" + wantsStream + " messages=" + ((payload.messages && payload.messages.length) || 0) +
    " kind=" + kind + " sitePlan=" +
    (fullUserContent(payload.messages).indexOf("<site_plan ") !== -1 ? "yes" : "no"));

  if (wantsStream) {
    streamContent(res, content);
    return;
  }
  sendJson(res, 200, JSON.stringify({
    id: "chatcmpl-mock",
    object: "chat.completion",
    model: model,
    choices: [{
      index: 0,
      message: { role: "assistant", content: content },
      finish_reason: "stop"
    }]
  }));
}

var server = http.createServer(function(req, res) {
  console.log("[mock-local-llm] " + req.method + " " + req.url);

  if (req.method === "OPTIONS") {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  var path = String(req.url || "").split("?")[0].replace(/\/+$/, "");

  if (req.method === "GET" && path === "/v1/models") {
    sendJson(res, 200, JSON.stringify({
      object: "list",
      data: [{ id: MODEL_ID, object: "model" }]
    }));
    return;
  }

  if (req.method === "POST" && path === "/v1/chat/completions") {
    var chunks = [];
    req.on("data", function(chunk) { chunks.push(chunk); });
    req.on("end", function() {
      var body;
      try {
        body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
      } catch (e) {
        sendJson(res, 400, JSON.stringify({ error: { message: "invalid JSON body" } }));
        return;
      }
      handleChat(req, res, body);
    });
    return;
  }

  sendJson(res, 404, JSON.stringify({ error: { message: "not found" } }));
});

server.on("error", function(err) {
  if (err && err.code === "EADDRINUSE") {
    console.error(
      "Port " + PORT + " is already in use (a real server may be running). " +
      "Start the mock with PORT=11435 npm run mock:llm and use http://localhost:11435/v1 as the endpoint."
    );
    process.exit(1);
  }
  console.error("[mock-local-llm] server error: " + (err && err.message ? err.message : err));
  process.exit(1);
});

server.listen(PORT, HOST, function() {
  console.log("[mock-local-llm] listening on http://" + HOST + ":" + PORT + "/v1");
});
