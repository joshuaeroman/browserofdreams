export function compactHtmlForContext(html, maxChars) {
  if (!html) return "";
  var limit = maxChars || 28000;
  var cleaned = String(html)
    // Remove injected Browser of Dreams iframe bridge
    .replace(/<!-- BROWSER_OF_DREAMS_BRIDGE_START -->[\s\S]*?<!-- BROWSER_OF_DREAMS_BRIDGE_END -->/g, "")
    // Strip embedded base64 or inline SVG data URLs so image bytes never bloat context
    .replace(/src=(["'])data:image\/[^"']+\1/gi, "src=$1[cached-dream-image]$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (cleaned.length > limit) {
    cleaned = cleaned.substring(0, limit) + "\n<!-- [truncated for context length] -->\n</html>";
  }
  return cleaned;
}

export function extractHtml(rawText) {
  var text = String(rawText || "").trim();
  if (!text) return "";

  // Strip markdown code fences if present
  var fenceMatch = /```(?:html)?\s*([\s\S]*?)```/i.exec(text);
  if (fenceMatch && fenceMatch[1] && fenceMatch[1].indexOf("<") !== -1) {
    text = fenceMatch[1].trim();
  }

  var docStart = text.search(/<!doctype\s+html/i);
  if (docStart === -1) {
    docStart = text.search(/<html[\s>]/i);
  }
  if (docStart > 0) {
    text = text.substring(docStart);
  }

  var docEnd = text.search(/<\/html\s*>/i);
  if (docEnd !== -1) {
    text = text.substring(0, docEnd + 7);
  }

  if (text.indexOf("<html") === -1 && text.indexOf("<body") === -1) {
    text = "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><title>Dream Page</title></head><body>" +
      text + "</body></html>";
  }

  return text;
}

export function extractTitleFromHtml(html, fallbackUrl) {
  var m = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(String(html || ""));
  if (m && m[1]) {
    var clean = m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    if (clean) return clean;
  }
  return fallbackUrl || "Untitled Dream Page";
}

export class ProgressiveHtmlWriter {
  constructor(doc, options) {
    this.doc = doc;
    var opts = options || {};
    this.initialShim = opts.initialShim || "";
    this.initialStyle = opts.initialStyle || "";
    this.initialEraStyle = opts.initialEraStyle || "";
    this.initialScript = opts.initialScript || "";
    this.onImageRendered = opts.onImageRendered || null;
    this.imageCounter = 0;
    this.written = "";
    this.hasOpened = false;
    this.hasClosed = false;
    this.leadingFenceRemoved = false;
    this.stripOffset = 0;
    this.completed = false;
  }

  // Head markup goes through writeHead when the sink supports it, so a
  // postMessage transport can tell "before the page starts" apart from chunks.
  writeHead(markup) {
    if (!markup) return;
    if (this.doc && typeof this.doc.writeHead === "function") {
      this.doc.writeHead(markup);
    } else if (this.doc) {
      this.doc.write(markup);
    }
  }

  open() {
    if (this.doc && !this.hasOpened) {
      try {
        this.doc.open();
        if (this.initialShim) {
          this.writeHead('<script id="dream-storage-shim">' + this.initialShim + '</script>');
        }
        if (this.initialEraStyle) {
          this.writeHead('<style id="dream-era-style">' + this.initialEraStyle + '</style>');
        }
        if (this.initialStyle) {
          this.writeHead('<style id="dream-bridge-style">' + this.initialStyle + '</style>');
        }
        if (this.initialScript) {
          this.writeHead('<script id="dream-bridge-script">' + this.initialScript + '</script>');
        }
        this.hasOpened = true;
      } catch (e) {
        console.warn("Could not open iframe document for progressive streaming:", e);
      }
    }
  }

  scanNewImages() {
    if (!this.doc || typeof this.doc.querySelectorAll !== "function") return;
    try {
      if (this.doc.defaultView && typeof this.doc.defaultView.__setupDreamImages === "function") {
        this.doc.defaultView.__setupDreamImages();
      }
    } catch (e) {}

    if (typeof this.onImageRendered !== "function") return;
    try {
      var imgs = this.doc.querySelectorAll("img[data-dream-prompt]:not([data-dream-writer-scanned]), img[data-dream-reuse]:not([data-dream-writer-scanned])");
      for (var i = 0; i < imgs.length; i++) {
        var img = imgs[i];
        img.setAttribute("data-dream-writer-scanned", "true");
        var prompt = img.getAttribute("data-dream-prompt") || "";
        var reuse = img.getAttribute("data-dream-reuse") || "";
        var slotId = img.getAttribute("data-dream-id") || ("dream-img-" + this.imageCounter++);
        img.setAttribute("data-dream-id", slotId);
        var role = (img.getAttribute("data-dream-role") || (reuse && /^\[AD\b/i.test(reuse.trim()) ? "ad" : (reuse && /^\[ICON\b/i.test(reuse.trim()) ? "icon" : (reuse && /^\[GRAPHIC\b/i.test(reuse.trim()) ? "graphic" : "photo")))).toLowerCase();
        var w = parseInt(img.getAttribute("width"), 10) || img.width || (role === "ad" ? 468 : 360);
        var h = parseInt(img.getAttribute("height"), 10) || img.height || (role === "ad" ? 60 : 240);
        var aspect = img.getAttribute("data-dream-aspect") || (w > h * 1.5 ? "16:9" : (h > w * 1.3 ? "3:4" : "1:1"));

        this.onImageRendered({
          slotId: slotId,
          prompt: prompt || reuse,
          reuse: reuse,
          role: role,
          width: w,
          height: h,
          aspectRatio: aspect,
          alt: img.alt || "",
          alreadyLoaded: false
        });
      }
    } catch (e) {
      console.warn("Error scanning new images in progressive stream:", e);
    }
  }

  writeChunk(accumulated) {
    if (this.completed) return;
    if (!this.hasOpened) {
      this.open();
    }
    if (!this.doc || !this.hasOpened) return;

    if (!this.leadingFenceRemoved) {
      if (/^\s*```/.test(accumulated)) {
        var newlineIdx = accumulated.search(/\r?\n/);
        var tagIdx = accumulated.search(/<[a-zA-Z!]/);
        if (newlineIdx !== -1 && (tagIdx === -1 || newlineIdx < tagIdx)) {
          var afterNewline = accumulated.substring(newlineIdx);
          var nlMatch = afterNewline.match(/^\r?\n/);
          var nlLen = nlMatch ? nlMatch[0].length : 1;
          this.stripOffset = newlineIdx + nlLen;
          this.leadingFenceRemoved = true;
        } else if (tagIdx !== -1) {
          this.stripOffset = tagIdx;
          this.leadingFenceRemoved = true;
        } else {
          return;
        }
      } else {
        var firstTag = accumulated.search(/<[a-zA-Z!]/);
        if (firstTag !== -1) {
          this.stripOffset = firstTag;
          this.leadingFenceRemoved = true;
        } else if (accumulated.length > 40) {
          this.stripOffset = 0;
          this.leadingFenceRemoved = true;
        } else {
          return;
        }
      }
    }

    var clean = accumulated.substring(this.stripOffset);
    var htmlCloseIdx = clean.search(/<\/html\s*>/i);
    if (htmlCloseIdx !== -1) {
      var endPos = clean.indexOf(">", htmlCloseIdx) + 1;
      clean = clean.substring(0, endPos);
      this.completed = true;
    } else {
      var fenceCloseIdx = clean.search(/```/);
      if (fenceCloseIdx !== -1) {
        clean = clean.substring(0, fenceCloseIdx);
        this.completed = true;
      } else {
        if (clean.endsWith("``")) {
          clean = clean.substring(0, clean.length - 2);
        } else if (clean.endsWith("`")) {
          clean = clean.substring(0, clean.length - 1);
        }
      }
    }

    if (clean.length > this.written.length) {
      var toWrite = clean.substring(this.written.length);
      try {
        this.doc.write(toWrite);
        this.written = clean;
        this.scanNewImages();
      } catch (e) {
        console.warn("Failed writing chunk to iframe document:", e);
      }
    }
  }

  close() {
    if (this.doc && this.hasOpened && !this.hasClosed) {
      try {
        this.doc.close();
        this.hasClosed = true;
      } catch (e) {
        console.warn("Could not close iframe document:", e);
      }
    }
  }
}
