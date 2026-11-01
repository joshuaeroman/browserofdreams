// Message types spoken between the host page and the frame-side stream sink
// (src/bridge/stream-sink.runtime.js). The frame owns document.write because
// the dream iframe is sandboxed without allow-same-origin, which leaves the
// host with no contentDocument access.
export var STREAM_MSG = {
  READY: "DREAM_STREAM_READY",
  OPENED: "DREAM_STREAM_OPENED",
  OPEN: "DREAM_STREAM_OPEN",
  CHUNK: "DREAM_STREAM_CHUNK",
  CLOSE: "DREAM_STREAM_CLOSE"
};

// Transport shaped like the Document API the ProgressiveHtmlWriter writes to.
// Messages queue until the freshly installed shell reports READY, so the host
// can start feeding a stream before the frame document exists.
export function createFrameStreamSink(frame, streamId) {
  var queue = [];
  var ready = false;
  var closed = false;
  var head = "";
  var sentOpen = false;

  function deliver(message) {
    if (!frame || !frame.contentWindow) return;
    try {
      frame.contentWindow.postMessage(message, "*");
    } catch (e) {}
  }

  function enqueue(message) {
    if (closed) return;
    if (!ready) {
      queue.push(message);
      return;
    }
    deliver(message);
  }

  function onMessage(ev) {
    if (!frame || ev.source !== frame.contentWindow) return;
    var msg = ev.data;
    if (!msg || typeof msg !== "object") return;
    if (msg.type !== STREAM_MSG.READY || ready) return;
    ready = true;
    var pending = queue;
    queue = [];
    for (var i = 0; i < pending.length; i++) deliver(pending[i]);
  }

  function sendOpen() {
    if (sentOpen) return;
    sentOpen = true;
    enqueue({ type: STREAM_MSG.OPEN, streamId: streamId, head: head });
    head = "";
  }

  if (typeof window !== "undefined" && window.addEventListener) {
    window.addEventListener("message", onMessage);
  }

  return {
    open: function () {},

    writeHead: function (markup) {
      if (!markup) return;
      if (sentOpen) {
        enqueue({ type: STREAM_MSG.CHUNK, streamId: streamId, html: markup });
        return;
      }
      head += markup;
    },

    write: function (html) {
      if (!html) return;
      sendOpen();
      enqueue({ type: STREAM_MSG.CHUNK, streamId: streamId, html: html });
    },

    close: function () {
      if (closed) return;
      sendOpen();
      if (ready) {
        deliver({ type: STREAM_MSG.CLOSE, streamId: streamId });
      } else {
        queue.push({ type: STREAM_MSG.CLOSE, streamId: streamId });
      }
      closed = true;
      if (typeof window !== "undefined" && window.removeEventListener) {
        window.removeEventListener("message", onMessage);
      }
    }
  };
}
