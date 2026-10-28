import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";

test("index.html contains GitHub link in settings menu pointing to main repo", () => {
  const html = fs.readFileSync(path.resolve("index.html"), "utf8");
  const targetRepoUrl = "https://github.com/joshuaeroman/browserofdreams";

  // Check that settings modal has github link
  assert.ok(
    html.includes('id="settings-github-link"'),
    "settings modal should contain element with id 'settings-github-link'"
  );
  assert.ok(
    html.includes('id="settings-github-btn"'),
    "settings modal footer should contain element with id 'settings-github-btn'"
  );

  // Check URL
  assert.ok(
    html.includes(`href="${targetRepoUrl}"`),
    `settings menu should link directly to ${targetRepoUrl}`
  );

  // Check security attributes for external link
  assert.ok(
    html.includes('target="_blank"'),
    "GitHub link should open in a new tab (target='_blank')"
  );
  assert.ok(
    html.includes('rel="noopener noreferrer"'),
    "GitHub link should include rel='noopener noreferrer' for security"
  );
});
