import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

function loadBundle(extraGlobals) {
  const code = fs.readFileSync(path.resolve("dist/app.js"), "utf8");
  const sandbox = Object.assign({
    console: console,
    Math: Math,
    Date: Date,
    String: String,
    Number: Number,
    Object: Object,
    Array: Array,
    JSON: JSON,
    RegExp: RegExp,
    parseInt: parseInt,
    parseFloat: parseFloat,
    isNaN: isNaN,
    encodeURIComponent: encodeURIComponent,
    decodeURIComponent: decodeURIComponent,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    setInterval: setInterval,
    clearInterval: clearInterval
  }, extraGlobals || {});
  sandbox.window = extraGlobals && extraGlobals.window ? extraGlobals.window : sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return sandbox.BrowserOfDreams || (sandbox.window && sandbox.window.BrowserOfDreams);
}

function readShellSinkScript(shellHtml) {
  const match = /<script[^>]*>([\s\S]*?)<\/script>/.exec(shellHtml);
  assert.ok(match, "stream shell must embed the sink script");
  return match[1];
}

test("injectBridgeScript runs the storage shim before author head scripts and never duplicates it", () => {
  const B = loadBundle();
  const html = "<html><head><script>localStorage.getItem('x')</script></head><body>b</body></html>";

  const out = B.injectBridgeScript(html, "http://x.com/", "1999-12-31", "");
  const shimAt = out.indexOf('id="dream-storage-shim"');
  const authorAt = out.indexOf("localStorage.getItem('x')");
  assert.ok(shimAt !== -1, "shim script must be injected");
  assert.ok(authorAt !== -1, "author script must survive injection");
  assert.ok(shimAt < authorAt, "shim must run before author scripts that touch storage");

  const again = B.injectBridgeScript(out, "http://x.com/", "1999-12-31", "");
  assert.equal(
    (again.match(/id="dream-storage-shim"/g) || []).length,
    1,
    "re-injection must not duplicate the shim"
  );
});

test("storage shim implements the Web Storage API per document without touching real storage", () => {
  const B = loadBundle();
  const win = {};
  const sandbox = { window: win, Object: Object, String: String, Number: Number };
  vm.createContext(sandbox);
  vm.runInContext(B.storageShimJs, sandbox);

  const local = win.localStorage;
  assert.equal(local.getItem("theme"), null, "empty store returns null");
  local.setItem("theme", "netscape");
  local.setItem("hits", 42);
  assert.equal(local.getItem("theme"), "netscape");
  assert.equal(local.getItem("hits"), "42", "values are stringified like the real API");
  assert.equal(local.length, 2);
  assert.equal(local.key(0), "theme");
  assert.equal(local.key(9), null);

  const session = win.sessionStorage;
  assert.equal(session.getItem("theme"), null, "sessionStorage is a separate store");
  session.setItem("theme", "ie5");
  assert.equal(local.getItem("theme"), "netscape", "stores do not leak into each other");

  local.removeItem("theme");
  assert.equal(local.getItem("theme"), null);
  local.clear();
  assert.equal(local.length, 0);

  // Re-reading the global must return the same backing store.
  local.setItem("k", "v");
  assert.equal(win.localStorage.getItem("k"), "v");
});

test("stream shell sink streams head and chunks, ignores foreign streams, and closes the document", () => {
  const B = loadBundle();
  const listeners = [];
  const writes = [];
  const posted = [];
  const doc = {
    open: () => writes.push("open"),
    write: (text) => writes.push(text),
    close: () => writes.push("close")
  };
  const win = {
    addEventListener: (type, fn) => {
      if (type === "message") listeners.push(fn);
    },
    removeEventListener: () => {},
    parent: { postMessage: (message) => posted.push(message) }
  };
  const sandbox = { window: win, document: doc, String: String };
  vm.createContext(sandbox);
  vm.runInContext(readShellSinkScript(B.buildStreamShell()), sandbox);

  assert.deepEqual(posted.map((m) => m.type), ["DREAM_STREAM_READY"], "shell announces readiness");
  assert.equal(listeners.length, 1, "sink listens for stream messages");

  listeners[0]({ data: { type: "DREAM_STREAM_OPEN", streamId: "s1", head: "<style id=\"h\"></style>" } });
  assert.deepEqual(writes, ["open", "<style id=\"h\"></style>"], "open resets the document and writes the head");
  assert.ok(
    posted.some((m) => m.type === "DREAM_STREAM_OPENED" && m.streamId === "s1"),
    "sink acknowledges the opened stream"
  );
  assert.equal(listeners.length, 2, "sink re-attaches its listener after document.open() clears listeners");

  const onStream = listeners[listeners.length - 1];
  onStream({ data: { type: "DREAM_STREAM_CHUNK", streamId: "s1", html: "<p>one</p>" } });
  assert.equal(writes[writes.length - 1], "<p>one</p>", "chunks are written as they arrive");

  onStream({ data: { type: "DREAM_STREAM_CHUNK", streamId: "other", html: "<p>stale</p>" } });
  assert.equal(writes[writes.length - 1], "<p>one</p>", "chunks from another stream are ignored");

  onStream({ data: { type: "DREAM_STREAM_CLOSE", streamId: "s1" } });
  assert.equal(writes[writes.length - 1], "close", "close ends the document");

  const writeCount = writes.length;
  onStream({ data: { type: "DREAM_STREAM_CHUNK", streamId: "s1", html: "<p>late</p>" } });
  assert.equal(writes.length, writeCount, "chunks after close are ignored");
});

test("frame stream sink queues a whole stream until the fresh frame reports ready", () => {
  const posted = [];
  const listeners = [];
  const win = {
    addEventListener: (type, fn) => {
      if (type === "message") listeners.push(fn);
    },
    removeEventListener: (type, fn) => {
      const index = listeners.indexOf(fn);
      if (index !== -1) listeners.splice(index, 1);
    }
  };
  const B = loadBundle({ window: win });
  const STREAM_MSG = B.STREAM_MSG;
  const frame = { contentWindow: { postMessage: (message) => posted.push(message) } };

  const sink = B.createFrameStreamSink(frame, "stream-1");
  sink.open();
  sink.writeHead("<style id=\"era\"></style>");
  sink.writeHead("<style id=\"bridge\"></style>");
  sink.write("<p>one</p>");
  assert.deepEqual(posted, [], "nothing is posted before the shell is ready");

  listeners[0]({ source: {}, data: { type: STREAM_MSG.READY } });
  assert.deepEqual(posted, [], "readiness from a foreign source is ignored");

  listeners[0]({ source: frame.contentWindow, data: { type: STREAM_MSG.READY } });
  assert.equal(posted.length, 2, "queued open and chunk flush once the frame is ready");
  assert.equal(posted[0].type, STREAM_MSG.OPEN);
  assert.equal(posted[0].streamId, "stream-1");
  assert.equal(
    posted[0].head,
    "<style id=\"era\"></style><style id=\"bridge\"></style>",
    "head markup travels with the open message"
  );
  assert.deepEqual(
    { type: posted[1].type, html: posted[1].html },
    { type: STREAM_MSG.CHUNK, html: "<p>one</p>" }
  );

  sink.write("<p>two</p>");
  assert.equal(posted[2].type, STREAM_MSG.CHUNK);
  assert.equal(posted[2].html, "<p>two</p>", "later chunks post immediately");

  sink.close();
  assert.equal(posted[3].type, STREAM_MSG.CLOSE);
  assert.equal(listeners.length, 0, "sink unsubscribes on close");

  const afterClose = posted.length;
  sink.write("<p>three</p>");
  assert.equal(posted.length, afterClose, "writes after close are dropped");
});
