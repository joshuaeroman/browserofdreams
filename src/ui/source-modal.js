import { els } from "./dom.js";

export function openSourceModal(html) {
  if (!els.sourceModal) return;
  var content = String(html || "");
  if (els.sourceTextarea) els.sourceTextarea.value = content;
  if (els.sourceCharCount) els.sourceCharCount.textContent = content.length.toLocaleString() + " characters";
  els.sourceModal.hidden = false;
}

export function closeSourceModal() {
  if (els.sourceModal) els.sourceModal.hidden = true;
}

export function copySourceToClipboard() {
  if (!els.sourceTextarea) return;
  els.sourceTextarea.select();
  try {
    navigator.clipboard.writeText(els.sourceTextarea.value);
    if (els.btnCopySource) {
      var orig = els.btnCopySource.textContent;
      els.btnCopySource.textContent = "✓ Copied!";
      setTimeout(function() {
        if (els.btnCopySource) els.btnCopySource.textContent = orig;
      }, 1500);
    }
  } catch (e) {
    document.execCommand("copy");
  }
}

export function downloadSourceFile() {
  if (!els.sourceTextarea) return;
  var text = els.sourceTextarea.value;
  var blob = new Blob([text], { type: "text/html;charset=utf-8" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "dream-source.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
