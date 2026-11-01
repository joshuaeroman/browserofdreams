import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

test("index.html configures sandbox with allow-same-origin and removes stream preview terminal", () => {
  const html = fs.readFileSync(path.resolve("index.html"), "utf8");
  assert.ok(
    html.includes('sandbox="allow-scripts allow-forms allow-same-origin"'),
    "Iframe must have allow-same-origin in sandbox to support parent progressive document.write stream"
  );
  assert.ok(
    !html.includes('id="loading-stream-preview"'),
    "Loading dialog should not contain raw loading-stream-preview pre terminal"
  );
});

test("dist/app.css styles loading-overlay as non-blocking floating window over viewport", () => {
  const css = fs.readFileSync(path.resolve("dist/app.css"), "utf8");
  assert.ok(
    css.includes("background: transparent") || css.includes("background:transparent"),
    "loading-overlay must have transparent background so viewport is visible while streaming"
  );
  assert.ok(
    css.includes("pointer-events: none") || css.includes("pointer-events:none"),
    "loading-overlay must have pointer-events: none so clicks outside dialog pass to viewport"
  );
  assert.ok(
    css.includes("pointer-events: auto") || css.includes("pointer-events:auto"),
    "loading-dialog must have pointer-events: auto so controls remain clickable"
  );
});

test("ProgressiveHtmlWriter correctly strips opening markdown fences and streams HTML chunks", () => {
  const code = fs.readFileSync(path.resolve("dist/app.js"), "utf8");
  const sandbox = {
    console: console,
    Math: Math,
    Date: Date,
    String: String,
    Object: Object,
    Array: Array,
    RegExp: RegExp
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);

  const ProgressiveHtmlWriter = sandbox.BrowserOfDreams.ProgressiveHtmlWriter;
  assert.ok(ProgressiveHtmlWriter, "ProgressiveHtmlWriter must be exported on BrowserOfDreams");

  let writtenParts = [];
  let isClosed = false;
  const mockDoc = {
    open: () => { writtenParts = []; isClosed = false; },
    write: (chunk) => { writtenParts.push(chunk); },
    close: () => { isClosed = true; }
  };

  const writer = new ProgressiveHtmlWriter(mockDoc, { initialStyle: "body { margin: 0; }" });
  writer.open();

  // First chunk has leading fence
  let acc = "```html\n<!DOCTYPE html>\n<html>\n<head><title>Retro World</title></head>";
  writer.writeChunk(acc);

  // Subsequent chunk has body
  acc += "\n<body>\n<h1>Welcome to 1999</h1>\n<p>Progressive loading active.</p>";
  writer.writeChunk(acc);

  // Final chunk has closing tag and trailing fence
  acc += "\n</body>\n</html>\n```\nHere is your retro page!";
  writer.writeChunk(acc);

  writer.close();

  const fullWritten = writtenParts.join("");
  assert.ok(fullWritten.includes('<style id="dream-bridge-style">body { margin: 0; }</style>'), "Must inject initialStyle");
  assert.ok(fullWritten.includes("<!DOCTYPE html>"), "Must include DOCTYPE");
  assert.ok(fullWritten.includes("<h1>Welcome to 1999</h1>"), "Must include headings");
  assert.ok(fullWritten.includes("</html>"), "Must include closing html tag");
  assert.ok(!fullWritten.includes("```"), "Must never write markdown fences into document");
  assert.ok(!fullWritten.includes("Here is your retro page!"), "Must not write trailing commentary");
  assert.equal(isClosed, true, "Must have called doc.close()");
});

test("ProgressiveHtmlWriter handles raw HTML stream without fences", () => {
  const code = fs.readFileSync(path.resolve("dist/app.js"), "utf8");
  const sandbox = {
    console: console,
    Math: Math,
    Date: Date,
    String: String,
    Object: Object,
    Array: Array,
    RegExp: RegExp
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);

  const ProgressiveHtmlWriter = sandbox.BrowserOfDreams.ProgressiveHtmlWriter;

  let writtenParts = [];
  const mockDoc = {
    open: () => { writtenParts = []; },
    write: (chunk) => { writtenParts.push(chunk); },
    close: () => {}
  };

  const writer = new ProgressiveHtmlWriter(mockDoc);
  writer.open();

  let acc = "  \n  <html><body><p>Dial-up flow</p></body></html>";
  writer.writeChunk(acc);
  writer.close();

  const fullWritten = writtenParts.join("");
  assert.equal(fullWritten, "<html><body><p>Dial-up flow</p></body></html>");
});

test("ensureBridgeInDocument attaches bridge style and script without duplicates", () => {
  const code = fs.readFileSync(path.resolve("dist/app.js"), "utf8");
  const sandbox = {
    console: console,
    Math: Math,
    Date: Date,
    String: String,
    Object: Object,
    Array: Array,
    RegExp: RegExp,
    JSON: JSON
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);

  const ensureBridgeInDocument = sandbox.BrowserOfDreams.ensureBridgeInDocument;
  assert.ok(ensureBridgeInDocument, "ensureBridgeInDocument must be exported");

  const elements = {};
  const mockHead = {
    appendChild: (el) => { elements[el.id] = el; }
  };
  const mockBody = {
    appendChild: (el) => { elements[el.id] = el; }
  };
  const mockDoc = {
    head: mockHead,
    body: mockBody,
    getElementById: (id) => elements[id] || null,
    createElement: (tag) => ({ tagName: tag, textContent: "", id: "" })
  };

  ensureBridgeInDocument(mockDoc, "http://www.oldsite.com/", "1999-05-01");
  assert.ok(elements["dream-bridge-style"], "Must create dream-bridge-style");
  assert.ok(elements["dream-bridge-script"], "Must create dream-bridge-script");
  assert.ok(elements["dream-bridge-script"].textContent.includes("www.oldsite.com"), "Must substitute base URL");

  // Call second time to ensure idempotency
  let headAppends = 0;
  mockHead.appendChild = () => { headAppends++; };
  mockBody.appendChild = () => { headAppends++; };
  ensureBridgeInDocument(mockDoc, "http://www.oldsite.com/", "1999-05-01");
  assert.equal(headAppends, 0, "Second call must not re-append bridge elements");
});

test("index.html contains status-progress-panel and status-progress-bar in footer", () => {
  const html = fs.readFileSync(path.resolve("index.html"), "utf8");
  assert.ok(html.includes('id="status-progress-panel"'), "Status bar must contain status-progress-panel");
  assert.ok(html.includes('id="status-progress-bar"'), "Status bar must contain status-progress-bar");

  const css = fs.readFileSync(path.resolve("dist/app.css"), "utf8");
  assert.ok(css.includes(".status-progress"), "Must style status-progress");
  assert.ok(css.includes(".status-progress-bar"), "Must style status-progress-bar");
});

test("ProgressiveHtmlWriter immediately invokes onImageRendered as soon as an img tag renders", () => {
  const code = fs.readFileSync(path.resolve("dist/app.js"), "utf8");
  const sandbox = {
    console: console,
    Math: Math,
    Date: Date,
    String: String,
    Object: Object,
    Array: Array,
    RegExp: RegExp,
    parseInt: parseInt
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);

  const ProgressiveHtmlWriter = sandbox.BrowserOfDreams.ProgressiveHtmlWriter;

  const discoveredSlots = [];
  const fakeImages = [];

  const mockDoc = {
    open: () => {},
    write: (chunk) => {
      // Simulate browser parser detecting img tag
      if (chunk.includes("<img")) {
        fakeImages.push({
          tagName: "IMG",
          getAttribute: (attr) => {
            if (attr === "data-dream-prompt") return "Golden Gate Bridge";
            if (attr === "data-dream-role") return "photo";
            if (attr === "width") return "400";
            if (attr === "height") return "300";
            return null;
          },
          setAttribute: (attr, val) => {}
        });
      }
    },
    close: () => {},
    querySelectorAll: (sel) => {
      if (sel.includes("img[data-dream-prompt]")) {
        return fakeImages;
      }
      return [];
    }
  };

  const writer = new ProgressiveHtmlWriter(mockDoc, {
    onImageRendered: (slot) => {
      discoveredSlots.push(slot);
    }
  });
  writer.open();

  // Chunk 1 has header only, no images yet
  writer.writeChunk("<!DOCTYPE html><html><body><h1>Bay Area News</h1>");
  assert.equal(discoveredSlots.length, 0, "No image slots should be reported before img renders");

  // Chunk 2 contains the img tag
  writer.writeChunk("<!DOCTYPE html><html><body><h1>Bay Area News</h1><img data-dream-prompt=\"Golden Gate Bridge\" width=\"400\" height=\"300\">");
  assert.equal(discoveredSlots.length, 1, "Image request slot must be dispatched immediately as img tag renders");
  assert.equal(discoveredSlots[0].prompt, "Golden Gate Bridge");

  writer.close();
});

test("ProgressiveHtmlWriter writes the era style before the bridge style", () => {
  const code = fs.readFileSync(path.resolve("dist/app.js"), "utf8");
  const sandbox = {
    console: console,
    Math: Math,
    Date: Date,
    parseInt: parseInt,
    parseFloat: parseFloat,
    isNaN: isNaN,
    String: String,
    Object: Object,
    Array: Array,
    JSON: JSON,
    RegExp: RegExp,
    encodeURIComponent: encodeURIComponent,
    decodeURIComponent: decodeURIComponent,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    setInterval: setInterval,
    clearInterval: clearInterval
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);

  const ProgressiveHtmlWriter = sandbox.BrowserOfDreams.ProgressiveHtmlWriter;
  let writtenParts = [];
  const mockDoc = {
    open: () => { writtenParts = []; },
    write: (chunk) => { writtenParts.push(chunk); },
    close: () => {}
  };

  const writer = new ProgressiveHtmlWriter(mockDoc, {
    initialEraStyle: "a{text-decoration:underline}",
    initialStyle: "body{margin:0}"
  });
  writer.open();

  const written = writtenParts.join("");
  const eraAt = written.indexOf('<style id="dream-era-style">');
  const bridgeAt = written.indexOf('<style id="dream-bridge-style">');
  assert.ok(eraAt !== -1, "era style must be written into the document");
  assert.ok(bridgeAt !== -1, "bridge style must still be written");
  assert.ok(eraAt < bridgeAt, "era style must precede the bridge style");
});

