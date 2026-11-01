import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const BRIDGE_SRC = fs
  .readFileSync(path.resolve("src/bridge/runtime.runtime.js"), "utf8")
  .replace("__BASE_URL__", JSON.stringify("http://www.example.com/"));

function matchesSelector(node, selector) {
  var s = String(selector || "").trim();
  if (!s || !node || !node.getAttribute) return false;
  if (s.charAt(0) === ".") {
    return String(node.className || "").split(/\s+/).indexOf(s.slice(1)) !== -1;
  }
  var withAttr = /^([a-zA-Z]*)\[([a-zA-Z-]+)="(.*)"\]$/.exec(s);
  if (withAttr) {
    if (withAttr[1] && node.tagName !== withAttr[1].toUpperCase()) return false;
    return node.getAttribute(withAttr[2]) === withAttr[3];
  }
  var attrOnly = /^\[([a-zA-Z-]+)\]$/.exec(s);
  if (attrOnly) return node.getAttribute(attrOnly[1]) !== null;
  return node.tagName === s.toUpperCase();
}

function collect(node, selector, out) {
  if (node !== out.root && matchesSelector(node, selector)) out.push(node);
  var children = node.children || [];
  for (var i = 0; i < children.length; i++) collect(children[i], selector, out);
}

function findAll(root, selector) {
  var out = [];
  out.root = root;
  collect(root, selector, out);
  return out;
}

function findFirst(root, selector) {
  var all = findAll(root, selector);
  return all.length > 0 ? all[0] : null;
}

function createNode(tag) {
  var el = {
    tagName: String(tag).toUpperCase(),
    attributes: {},
    children: [],
    parentNode: null,
    className: "",
    style: {},
    textContent: "",
    listeners: {}
  };
  Object.defineProperty(el, "parentElement", {
    get: function() { return el.parentNode; }
  });
  Object.defineProperty(el, "src", {
    get: function() { return el.attributes.src || ""; },
    set: function(value) { el.attributes.src = String(value); }
  });
  el.getAttribute = function(name) {
    return Object.prototype.hasOwnProperty.call(el.attributes, name) ? el.attributes[name] : null;
  };
  el.setAttribute = function(name, value) {
    el.attributes[name] = String(value);
    if (name === "class") el.className = String(value);
  };
  el.removeAttribute = function(name) { delete el.attributes[name]; };
  el.appendChild = function(child) {
    if (child.parentNode) child.parentNode.removeChild(child);
    child.parentNode = el;
    el.children.push(child);
    return child;
  };
  el.insertBefore = function(child, ref) {
    if (child.parentNode) child.parentNode.removeChild(child);
    child.parentNode = el;
    var idx = ref ? el.children.indexOf(ref) : -1;
    if (idx === -1) el.children.push(child);
    else el.children.splice(idx, 0, child);
    return child;
  };
  el.removeChild = function(child) {
    var idx = el.children.indexOf(child);
    if (idx !== -1) el.children.splice(idx, 1);
    child.parentNode = null;
    return child;
  };
  el.addEventListener = function(type, fn) {
    (el.listeners[type] || (el.listeners[type] = [])).push(fn);
  };
  el.dispatch = function(type, event) {
    (el.listeners[type] || []).forEach(function(fn) { fn(event); });
  };
  el.classList = {
    add: function(name) {
      var parts = String(el.className || "").split(/\s+/).filter(Boolean);
      if (parts.indexOf(name) === -1) parts.push(name);
      el.className = parts.join(" ");
    },
    remove: function(name) {
      el.className = String(el.className || "").split(/\s+/).filter(function(part) {
        return part && part !== name;
      }).join(" ");
    },
    contains: function(name) {
      return String(el.className || "").split(/\s+/).indexOf(name) !== -1;
    }
  };
  el.closest = function(selector) {
    var node = el;
    while (node) {
      if (matchesSelector(node, selector)) return node;
      node = node.parentNode;
    }
    return null;
  };
  el.querySelector = function(selector) { return findFirst(el, selector); };
  el.querySelectorAll = function(selector) { return findAll(el, selector); };
  return el;
}

function createDocument(width, height) {
  var doc = {
    readyState: "complete",
    listeners: {},
    documentElement: createNode("html"),
    body: createNode("body")
  };
  doc.documentElement.clientWidth = width;
  doc.documentElement.clientHeight = height;
  doc.documentElement.appendChild(doc.body);
  doc.createElement = function(tag) { return createNode(tag); };
  doc.addEventListener = function(type, fn) {
    (doc.listeners[type] || (doc.listeners[type] = [])).push(fn);
  };
  doc.dispatch = function(type, event) {
    (doc.listeners[type] || []).forEach(function(fn) { fn(event); });
  };
  doc.querySelector = function(selector) { return findFirst(doc.documentElement, selector); };
  doc.querySelectorAll = function(selector) { return findAll(doc.documentElement, selector); };
  return doc;
}

function mountBridge(doc, width, height) {
  var windowObj = {
    innerWidth: width,
    innerHeight: height,
    listeners: {},
    addEventListener: function(type, fn) {
      (windowObj.listeners[type] || (windowObj.listeners[type] = [])).push(fn);
    },
    dispatch: function(type, event) {
      (windowObj.listeners[type] || []).forEach(function(fn) { fn(event); });
    },
    parent: { postMessage: function() {} }
  };
  var sandbox = {
    console: console,
    window: windowObj,
    document: doc,
    Math: Math,
    String: String,
    Number: Number,
    Object: Object,
    Array: Array,
    RegExp: RegExp,
    JSON: JSON,
    Date: Date,
    URL: URL,
    parseInt: parseInt,
    parseFloat: parseFloat,
    isNaN: isNaN,
    encodeURIComponent: encodeURIComponent,
    decodeURIComponent: decodeURIComponent
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(BRIDGE_SRC, sandbox);
  return sandbox;
}

function addSlotImage(doc, attrs) {
  var img = doc.createElement("img");
  Object.keys(attrs).forEach(function(key) {
    if (key === "alt") img.alt = attrs[key];
    else if (key === "width") img.width = attrs[key];
    else img.setAttribute(key, attrs[key]);
  });
  doc.body.appendChild(img);
  return img;
}

function clickNode(node) {
  node.dispatch("click", { preventDefault: function() {}, stopPropagation: function() {} });
}

test("hover expand button opens image-model art at natural size capped to the viewport", () => {
  var doc = createDocument(1000, 800);
  var img = addSlotImage(doc, {
    "data-dream-prompt": "[Date: 01/01/1999] test photo",
    "data-dream-role": "photo",
    "data-dream-loaded": "true",
    "data-dream-id": "dream-img-0",
    "src": "data:image/png;base64,AAAA",
    "width": "360",
    "height": "240",
    "alt": "Test photo"
  });
  img.naturalWidth = 1024;
  img.naturalHeight = 768;

  mountBridge(doc, 1000, 800);

  var wrapper = img.parentNode;
  assert.equal(wrapper.className.split(" ")[0], "dream-img-wrapper");
  assert.ok(wrapper.classList.contains("is-dream-loaded"), "generated images toggle the loaded wrapper state");
  var expand = wrapper.querySelector(".dream-img-expand");
  assert.ok(expand, "wrapper must expose a full size button");
  assert.equal(expand.getAttribute("aria-label"), "View full size");

  clickNode(expand);

  var overlay = doc.querySelector(".dream-lightbox");
  assert.ok(overlay, "clicking the expand button must open the lightbox");
  var full = overlay.querySelector(".dream-lightbox-img");
  assert.equal(full.getAttribute("src"), "data:image/png;base64,AAAA");
  assert.equal(full.style.width, "936px");
  assert.equal(full.style.height, "702px");
});

test("image-model art smaller than the viewport opens at its natural size", () => {
  var doc = createDocument(1000, 800);
  var img = addSlotImage(doc, {
    "data-dream-prompt": "[Date: 01/01/1999] small photo",
    "data-dream-loaded": "true",
    "src": "data:image/jpeg;base64,BBBB",
    "width": "320",
    "height": "200"
  });
  img.naturalWidth = 320;
  img.naturalHeight = 200;

  mountBridge(doc, 1000, 800);
  clickNode(img.parentNode.querySelector(".dream-img-expand"));

  var full = doc.querySelector(".dream-lightbox-img");
  assert.equal(full.style.width, "320px");
  assert.equal(full.style.height, "200px");
});

test("SVG art opens at half the smaller viewport dimension", () => {
  var doc = createDocument(1000, 800);
  var img = addSlotImage(doc, {
    "data-dream-prompt": "[Date: 01/01/1999] ad",
    "data-dream-role": "ad",
    "data-dream-loaded": "true",
    "src": "data:image/svg+xml;charset=UTF-8,%3Csvg%3E%3C%2Fsvg%3E",
    "width": "468",
    "height": "60"
  });
  img.naturalWidth = 468;
  img.naturalHeight = 60;

  mountBridge(doc, 1000, 800);
  clickNode(img.parentNode.querySelector(".dream-img-expand"));

  var full = doc.querySelector(".dream-lightbox-img");
  assert.equal(full.style.width, "400px");
  assert.equal(full.style.height, "51px");
});

test("placeholder slots hide the expand control until art arrives", () => {
  var doc = createDocument(1000, 800);
  var img = addSlotImage(doc, {
    "data-dream-prompt": "[Date: 01/01/1999] pending",
    "data-dream-role": "photo",
    "width": "300",
    "height": "200"
  });

  var bridge = mountBridge(doc, 1000, 800);

  var wrapper = img.parentNode;
  assert.ok(!wrapper.classList.contains("is-dream-loaded"), "unloaded slots must not reveal the expand control");
  var expand = wrapper.querySelector(".dream-img-expand");
  assert.ok(expand, "the control exists but stays hidden");
  clickNode(expand);
  assert.equal(doc.querySelector(".dream-lightbox"), null, "placeholders must not open a full size view");

  bridge.window.dispatch("message", {
    data: {
      type: "DREAM_IMAGE_READY",
      slotId: "dream-img-0",
      dataUrl: "data:image/png;base64,CCCC"
    }
  });

  assert.ok(wrapper.classList.contains("is-dream-loaded"), "DREAM_IMAGE_READY must reveal the expand control");
  clickNode(expand);
  var overlay = doc.querySelector(".dream-lightbox");
  assert.ok(overlay, "loaded art opens the lightbox");
  assert.equal(overlay.querySelector(".dream-lightbox-img").getAttribute("src"), "data:image/png;base64,CCCC");

  doc.dispatch("keydown", { key: "Escape" });
  assert.equal(doc.querySelector(".dream-lightbox"), null, "Escape must close the lightbox");
});
