var historyStack = [];
var historyIndex = -1;

export function getHistoryStack() {
  return historyStack;
}

export function getHistoryIndex() {
  return historyIndex;
}

export function setHistoryIndex(index) {
  historyIndex = index;
}

export function pushHistory(entry) {
  historyStack = historyStack.slice(0, historyIndex + 1);
  historyStack.push(entry);
  historyIndex = historyStack.length - 1;
}

export function getCurrentEntry() {
  return historyIndex >= 0 && historyIndex < historyStack.length
    ? historyStack[historyIndex]
    : null;
}

export function canGoBack() {
  return historyIndex > 0;
}

export function canGoForward() {
  return historyIndex >= 0 && historyIndex < historyStack.length - 1;
}

export function goBack() {
  if (canGoBack()) {
    historyIndex--;
    return historyStack[historyIndex];
  }
  return null;
}

export function goForward() {
  if (canGoForward()) {
    historyIndex++;
    return historyStack[historyIndex];
  }
  return null;
}

export function resetHistory() {
  historyStack = [];
  historyIndex = -1;
}
