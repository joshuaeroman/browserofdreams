// Extracts the payload of an SSE `data:` line. The spec allows either
// `data:value` or `data: value`; at most one leading space is stripped.
function dataPayload(line) {
  if (line.indexOf("data:") !== 0) return null;
  var rest = line.substring(5);
  if (rest.charAt(0) === " ") rest = rest.substring(1);
  return rest.trim();
}

// Splits `data:` payload lines out of an SSE buffer. With final=true, an
// unterminated trailing line is consumed instead of left buffered.
export function readDataLines(buffer, lastIndex, final) {
  var payloads = [];
  var index = lastIndex || 0;
  while (true) {
    var nl = buffer.indexOf("\n", index);
    if (nl === -1) break;
    var line = buffer.substring(index, nl).replace(/\r$/, "");
    index = nl + 1;
    var payload = dataPayload(line);
    if (payload) payloads.push(payload);
  }
  if (final && index < buffer.length) {
    var tail = buffer.substring(index).replace(/\r$/, "");
    var tailPayload = dataPayload(tail);
    if (tailPayload) payloads.push(tailPayload);
    index = buffer.length;
  }
  return { payloads: payloads, index: index };
}
