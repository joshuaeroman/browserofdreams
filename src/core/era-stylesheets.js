// Era browser default stylesheets.
//
// The site planner chooses which period browser a site was built for; this
// module owns the profile definitions, the plan-text parsing, and the CSS the
// viewer injects as that browser's own default layer. Nothing here maps a year
// to a profile — the planner decides, informed by the era it is designing for.

export var BROWSER_PROFILES = [
  {
    id: "mosaic",
    label: "NCSA Mosaic 1.x",
    pageBackground: "#c0c0c0",
    bodyFont: '"Times New Roman", Times, serif',
    bodySize: "16px",
    linkColor: "#0000EE",
    visitedColor: "#551A8B",
    activeColor: "#FF0000",
    buttonBackground: "#c0c0c0",
    buttonEdge: "#dfdfdf",
    buttonFont: '"MS Sans Serif", sans-serif',
    buttonSize: "13px"
  },
  {
    id: "netscape3",
    label: "Netscape Navigator 3",
    pageBackground: "#c0c0c0",
    bodyFont: '"Times New Roman", Times, serif',
    bodySize: "16px",
    linkColor: "#0000EE",
    visitedColor: "#551A8B",
    activeColor: "#FF0000",
    buttonBackground: "#c0c0c0",
    buttonEdge: "#dfdfdf",
    buttonFont: '"MS Sans Serif", sans-serif',
    buttonSize: "13px"
  },
  {
    id: "netscape4",
    label: "Netscape Navigator 4",
    pageBackground: "#c0c0c0",
    bodyFont: '"Times New Roman", Times, serif',
    bodySize: "16px",
    linkColor: "#0000EE",
    visitedColor: "#551A8B",
    activeColor: "#FF0000",
    buttonBackground: "#c0c0c0",
    buttonEdge: "#dfdfdf",
    buttonFont: '"MS Sans Serif", sans-serif',
    buttonSize: "13px"
  },
  {
    id: "ie4",
    label: "Internet Explorer 4",
    pageBackground: "#ffffff",
    bodyFont: '"Times New Roman", Times, serif',
    bodySize: "16px",
    linkColor: "#0000EE",
    visitedColor: "#551A8B",
    activeColor: "#FF0000",
    buttonBackground: "#c0c0c0",
    buttonEdge: "#dfdfdf",
    buttonFont: '"MS Sans Serif", sans-serif',
    buttonSize: "13px"
  },
  {
    id: "ie5",
    label: "Internet Explorer 5",
    pageBackground: "#ffffff",
    bodyFont: '"Times New Roman", Times, serif',
    bodySize: "16px",
    linkColor: "#0000EE",
    visitedColor: "#551A8B",
    activeColor: "#FF0000",
    buttonBackground: "#d4d0c8",
    buttonEdge: "#ffffff",
    buttonFont: 'Tahoma, "MS Sans Serif", sans-serif',
    buttonSize: "12px"
  },
  {
    id: "ie6",
    label: "Internet Explorer 6",
    pageBackground: "#ffffff",
    bodyFont: '"Times New Roman", Times, serif',
    bodySize: "16px",
    linkColor: "#0000EE",
    visitedColor: "#551A8B",
    activeColor: "#FF0000",
    buttonBackground: "#d4d0c8",
    buttonEdge: "#ffffff",
    buttonFont: 'Tahoma, "MS Sans Serif", sans-serif',
    buttonSize: "12px"
  },
  {
    id: "firefox1",
    label: "Mozilla Firefox 1.0",
    pageBackground: "#ffffff",
    bodyFont: '"Times New Roman", Times, serif',
    bodySize: "16px",
    linkColor: "#0000EE",
    visitedColor: "#551A8B",
    activeColor: "#FF0000",
    buttonBackground: "#d4d0c8",
    buttonEdge: "#ffffff",
    buttonFont: 'Tahoma, "MS Sans Serif", sans-serif',
    buttonSize: "12px"
  }
];

export function profileById(id) {
  var key = String(id || "").trim().toLowerCase();
  if (!key) return null;
  for (var i = 0; i < BROWSER_PROFILES.length; i++) {
    if (BROWSER_PROFILES[i].id === key) return BROWSER_PROFILES[i];
  }
  return null;
}

export function listBrowserProfiles() {
  return BROWSER_PROFILES.map(function (p) {
    return { id: p.id, label: p.label };
  });
}

function profileCss(p) {
  // A named cascade layer loses to every unlayered author rule, which is what
  // makes this behave like the browser's own defaults: a page's `a { ... }`
  // beats these rules regardless of selector specificity. A plain <style>
  // block cannot do that — injected `a:link` outspecifies a bare author `a`.
  return [
    "@layer era-defaults {",
    "body { background: " + p.pageBackground + "; color: #000000; font-family: " + p.bodyFont + "; font-size: " + p.bodySize + "; margin: 8px; }",
    "h1, h2, h3, h4, h5, h6 { font-family: " + p.bodyFont + "; }",
    "a:link { color: " + p.linkColor + "; text-decoration: underline; }",
    "a:visited { color: " + p.visitedColor + "; text-decoration: underline; }",
    "a:active { color: " + p.activeColor + "; text-decoration: underline; }",
    "a:hover { text-decoration: underline; }",
    "hr { border: 1px inset #808080; height: 2px; }",
    "button, input[type=\"button\"], input[type=\"submit\"], input[type=\"reset\"] { font-family: " + p.buttonFont + "; font-size: " + p.buttonSize + "; color: #000000; background: " + p.buttonBackground + "; border: 2px outset " + p.buttonEdge + "; padding: 1px 6px; }",
    "input[type=\"text\"], input[type=\"password\"], input[type=\"search\"], textarea { font-family: " + p.buttonFont + "; font-size: " + p.buttonSize + "; color: #000000; background: #ffffff; border: 2px inset " + p.buttonEdge + "; padding: 1px 2px; }",
    "select { font-family: " + p.buttonFont + "; font-size: " + p.buttonSize + "; background: #ffffff; color: #000000; border: 2px inset " + p.buttonEdge + "; }",
    "}"
  ].join("\n");
}

export function buildEraStylesheetCss(profileId) {
  var profile = profileById(profileId);
  if (!profile) return "";
  return profileCss(profile);
}

// Reads the planner's "BROWSER PROFILE: <id>" line. Unknown ids, "none", and
// plans without the line all yield "", meaning no injected era CSS.
export function parseBrowserProfileFromPlan(text) {
  var m = /\bBROWSER PROFILE:\s*([a-z0-9-]+)/i.exec(String(text || ""));
  if (!m) return "";
  var profile = profileById(m[1]);
  return profile ? profile.id : "";
}

// Cached plans store the choice directly; older plans only carry it in text.
export function resolveBrowserProfile(planEntry) {
  var stored = planEntry && planEntry.browserProfile;
  if (stored && profileById(stored)) return profileById(stored).id;
  return parseBrowserProfileFromPlan(planEntry && planEntry.text);
}
