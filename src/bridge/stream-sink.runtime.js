(function () {
  /*
   * Frame-side receiver for the progressive page stream.
   *
   * The dream frame is sandboxed without allow-same-origin, so the host page
   * cannot touch contentDocument. The host therefore posts markup here and this
   * sink owns document.write for the frame. document.open() clears every
   * listener registered on the window, so the listener is re-attached by hand
   * right after the reset.
   */
  var activeStream = null;

  function onStream(ev) {
    var msg = ev.data;
    if (!msg || typeof msg !== "object" || typeof msg.streamId !== "string") return;

    if (msg.type === "DREAM_STREAM_OPEN") {
      activeStream = msg.streamId;
      document.open();
      window.addEventListener("message", onStream);
      document.write(msg.head || "");
      window.parent.postMessage({ type: "DREAM_STREAM_OPENED", streamId: activeStream }, "*");
      return;
    }

    if (msg.streamId !== activeStream) return;

    if (msg.type === "DREAM_STREAM_CHUNK") {
      document.write(String(msg.html || ""));
    } else if (msg.type === "DREAM_STREAM_CLOSE") {
      activeStream = null;
      try {
        document.close();
      } catch (e) {}
    }
  }

  window.addEventListener("message", onStream);
  window.parent.postMessage({ type: "DREAM_STREAM_READY" }, "*");
})();
