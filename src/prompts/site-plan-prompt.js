import { getEraInfo, getCharsetGuide } from "../core/era.js";
import { getTimelineDivergenceProfile } from "../core/timeline.js";
import { extractDomain, getHomepageUrl } from "../core/urls.js";
import { listBrowserProfiles } from "../core/era-stylesheets.js";

// A plan shorter than this is almost always a truncated stream, not a terse
// design brief. Such text is used once but never cached.
export var MIN_SITE_PLAN_CHARS = 200;

export function buildSitePlanPrompt(params) {
  var url = params.url;
  var dateStr = params.date;
  var era = getEraInfo(dateStr);
  var charset = getCharsetGuide(era.year);
  var timelineProfile = getTimelineDivergenceProfile(params.timelineDivergence, era.year);
  var homepageUrl = params.homepageUrl || getHomepageUrl(url);
  var domain = extractDomain(url) || extractDomain(homepageUrl) || homepageUrl;
  var browserMenu = listBrowserProfiles().map(function (p) {
    return p.id + " — " + p.label;
  }).join("; ") + "; none — no browser overrides";

  var systemPrompt =
    "Dream Web Engine site planner. You are the art director for a fictional website: another model will build every page of it from your plan.\n" +
    "The site at " + domain + " is invented — its organization, people, products, and history. Never check whether it existed, and never refuse because it is fictional.\n" +
    "\n" +
    "WHAT THE PLAN IS FOR: the generator first builds this site's homepage from your plan, then builds each child page from your plan plus that homepage. Describe the shared design system concretely enough that every page can be built from your words alone: identity and voice, era look, page structure, navigation, recurring widgets, imagery direction, and the sitemap. Skip article copy and code.\n" +
    "\n" +
    "ERA: the designer is working in " + era.year + ". Every design choice must be believable for web design in " + era.year + " — the layout techniques, type, colors, textures, and widgets of that year, nothing from later web eras.\n" +
    era.styleGuide + "\n" +
    (charset.text
      ? charset.text + " The page generator reads this plan, so keep its wording inside the same set.\n"
      : "") +
    "\n" +
    "REALITY SETTING (" + timelineProfile.badgeText + "): " + timelineProfile.description + "\n" +
    "The site itself is still fictional; this setting only defines the world around it. Let it shape the site's departments, organization names, recurring figures, and imagery where it matters. The visual design still belongs to " + era.year + ".\n" +
    "\n" +
    "BROWSER PROFILE: the visitor's browser is part of the design. Pick the one this site was built for, appropriate to the year above, and put it on the very first line of the plan, exactly as \"BROWSER PROFILE: <id>\", before any other text.\n" +
    "Options: " + browserMenu + "\n" +
    "The viewer supplies that browser's own text, link, and form-control styling; design the rest around it. Choose none only if this site should take the viewer's own defaults.\n" +
    "\n" +
    "COVER AT LEAST: the site's name and one-sentence concept; palette with concrete colors; typography; page framing and layout approach; masthead/header treatment; navigation placement and style; body column layout with sidebars; recurring widgets and interactive elements; imagery and advertising direction (what the recurring photos, ads, and icons show, and where they sit); footer; and a sitemap listing each page's path, navigation label, and purpose, starting with \"/\" for the homepage.\n" +
    "\n" +
    "DESCRIBE, DO NOT PRESCRIBE. The page generator chooses every implementation detail.\n" +
    "In this plan, never write: HTML, CSS, JavaScript, tags, attributes, properties, code of any kind, image file names, asset paths, image URLs, pixel measurements, or fixed counts of elements. Say what the visitor sees, not how to build it.\n" +
    "Naming an era technique in plain words is expected — the nested layout tables, the beveled button look, animated GIF spotlights — because that is what makes the design read as " + era.year + ". Written markup is not.\n" +
    "Every color MUST come with its hex code, written plainly as #003366. A hex code is a color, not CSS, and the generator needs it to keep every page on the same palette.\n" +
    "Still describe proportion and character (a wide reading column between two narrow rails, a slim masthead) instead of measurements. No article or page copy.\n" +
    "Be specific about identity, voice, palette, and design intent rather than brief. Plain text; prose or short bullet lists are both fine. No article copy. No fences or commentary around the plan.";

  var userPrompt =
    "Domain: " + domain + "\n" +
    "Home: " + homepageUrl + "\n" +
    "Date: " + dateStr + "\n" +
    "Timeline: " + timelineProfile.shortLabel + " " + timelineProfile.pct + "%\n";

  return {
    systemPrompt: systemPrompt,
    userPrompt: userPrompt,
    era: era,
    timelineProfile: timelineProfile,
    domain: domain,
    homepageUrl: homepageUrl
  };
}

// Strips code fences the model may wrap around the plan; otherwise keeps it verbatim.
export function normalizeSitePlan(rawText) {
  return String(rawText || "").replace(/```[a-z]*\s*/gi, "").trim();
}

// Accepts a cached site-plan entry: { text }.
export function formatSitePlanForPrompt(entry) {
  if (!entry || !entry.text) return "";
  return String(entry.text).trim();
}
