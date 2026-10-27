import test from "node:test";
import assert from "node:assert/strict";
import { BOOKMARK_FOLDERS } from "../src/data/bookmarks.js";

test("bookmarks are static folders with dated urls", function() {
  assert.ok(BOOKMARK_FOLDERS.length >= 4);
  var seen = {};
  var count = 0;
  for (var f = 0; f < BOOKMARK_FOLDERS.length; f++) {
    var folder = BOOKMARK_FOLDERS[f];
    assert.ok(folder.name);
    assert.ok(folder.items.length >= 2);
    for (var i = 0; i < folder.items.length; i++) {
      var item = folder.items[i];
      assert.match(item.date, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(item.url.indexOf(" ") === -1);
      assert.ok(item.label);
      var key = item.url + "@" + item.date;
      assert.equal(seen[key], undefined);
      seen[key] = true;
      count++;
    }
  }
  assert.ok(count >= 20);
  assert.ok(seen["nycnews.com@1999-12-31"]);
  assert.ok(seen["yahoo.com@1997-11-20"]);
  assert.ok(seen["pets.com@1999-11-15"]);
});
