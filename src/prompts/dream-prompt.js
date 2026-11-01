import { getEraInfo } from "../core/era.js";
import { getTimelineDivergenceProfile } from "../core/timeline.js";
import { getHomepageUrl, isHomepageUrl, extractDomain } from "../core/urls.js";
import { compactHtmlForContext } from "../core/html.js";
import { getAvailableDomainImages, formatImageDescriptor } from "../core/cache.js";

export function buildDreamPrompt(params) {
  var url = params.url;
  var dateStr = params.date;
  var era = getEraInfo(dateStr);
  var timelineProfile = getTimelineDivergenceProfile(params.timelineDivergence, era.year);
  var navContext = params.navContext || null;
  var imageMode = params.imageMode || "all";
  var homepageUrl = params.homepageUrl || getHomepageUrl(url);
  var homepageHtml = compactHtmlForContext(params.homepageHtml || "");
  var referrerUrl = params.referrerUrl || (navContext && navContext.referrerUrl) || "";
  var referrerHtml = compactHtmlForContext(
    params.referrerHtml || (navContext && navContext.referrerHtml) || ""
  );
  var seedTargetContext = params.seedTargetContext || null;
  var sitePlanText = String(params.sitePlanText || "").trim();
  var priorHomepageHtml = compactHtmlForContext(params.priorHomepageHtml || "");
  var priorHomepageDate = params.priorHomepageDate || "";
  var rawMemes = params.memes;
  var memesList = Array.isArray(rawMemes)
    ? rawMemes
    : (typeof rawMemes === "string" && rawMemes.trim() ? rawMemes.split(/,\s*/) : []);
  var cleanMemes = memesList.map(function(w) { return String(w).trim(); }).filter(Boolean);

  var domain = extractDomain(url);
  var availableDomainImages = domain
    ? getAvailableDomainImages(domain, dateStr, params.timelineDivergence)
    : [];

  var availableImagesListText = "";
  if (availableDomainImages.length > 0) {
    availableImagesListText = availableDomainImages.map(function(item) {
      return "- " + formatImageDescriptor(item) + ' (reuse id: "' + item.id + '")';
    }).join("\n");
  }

  var hasHomepageContext = Boolean(homepageHtml && !isHomepageUrl(url));
  var hasReferrerContext = Boolean(referrerUrl || referrerHtml || navContext);
  var isSameSiteReferrer = Boolean(referrerUrl && getHomepageUrl(referrerUrl) === homepageUrl);

  var parts = String(dateStr || "1999-12-31").split("-");
  var mm = parts[1] ? (parseInt(parts[1], 10) < 10 ? "0" + parseInt(parts[1], 10) : parts[1]) : "01";
  var dd = parts[2] ? (parseInt(parts[2], 10) < 10 ? "0" + parseInt(parts[2], 10) : parts[2]) : "01";
  var yyyy = parts[0] || "2001";
  var formattedDateUs = mm + "/" + dd + "/" + yyyy;

  var imageRules = imageMode === "off"
    ? "Visuals: inline SVG, CSS, or ASCII. No data-dream-prompt images. Spoof marks and unnamed figures only."
    : "Images: 4–8 <img> (max 12). At least one " + era.year + " ad (468×60, 300×250, or 120×240/160×600) inside <a href>. Photos use data-dream-role=\"photo\".\n" +
      "Up to 3 small interface icons use data-dream-role=\"icon\", width=\"32\" height=\"32\", data-dream-aspect=\"1:1\".\n" +
      "Article text may name real people and companies. data-dream-prompt may not: spoof brands only, and people only as generic roles (a reporter, a crowd, an athlete). No real logos, celebrity names, or likenesses.\n" +
      "Every new image: data-dream-prompt=\"[Date: " + formattedDateUs + "] subject, " + era.year + " style\" plus data-dream-role, data-dream-aspect, width, height, alt.\n" +
      "data-dream-aspect is only 21:9, 16:9, 4:3, 1:1, 3:4, 9:16, 3:2, or 2:3. Example: <img data-dream-prompt=\"[Date: " + formattedDateUs + "] spoof-brand banner, unnamed shoppers\" data-dream-role=\"ad\" data-dream-aspect=\"21:9\" width=\"468\" height=\"60\" alt=\"...\">\n" +
      "Icon example: <img data-dream-prompt=\"[Date: " + formattedDateUs + "] spoof-brand envelope icon, flat glyph\" data-dream-role=\"icon\" data-dream-aspect=\"1:1\" width=\"32\" height=\"32\" alt=\"Mail\">\n" +
      (availableImagesListText
        ? "Reuse a listed image with data-dream-reuse=\"[TYPE: Label, orientation, WxH]\" or its id. Example: <img data-dream-reuse=\"[AD: Snapple, vertical, 100x300]\" width=\"100\" height=\"300\" alt=\"Snapple\">. New slots still use data-dream-prompt."
        : "No cached images yet. Do not emit data-dream-reuse.");

  var continuity = "";
  if (hasHomepageContext) {
    continuity += "site_homepage is the design system: same name, masthead, CSS, nav, footer, and ongoing stories. Replace only the body for " + url + " and mark the active nav item.\n";
  }
  if (isHomepageUrl(url) && priorHomepageHtml) {
    continuity += "prior_homepage is this same site on " + (priorHomepageDate || "a nearby date") + ". Keep its name, masthead, CSS, nav, and footer. Rewrite headlines, stories, prices, and dates for " + dateStr + ".\n";
  }
  if (hasReferrerContext) {
    continuity += "referring_page is the click or form that opened " + url + ". Write that destination, not a copy of the referrer. Keep its names, headlines, prices, and facts. ";
    continuity += isSameSiteReferrer
      ? "Same site: keep branding and link back to " + homepageUrl + ".\n"
      : "External referrer: do not copy its masthead or layout.\n";
  }
  if (sitePlanText) {
    continuity += "site_plan is this domain's design spec: keep its palette, typography, layout, nav, widgets, and graphics, and include its sitemap entries in the nav. Write the page content yourself; never output the plan.\n";
  }

  var systemPrompt =
    "Dream Web Engine. One complete HTML page for the requested URL as it existed on " + era.formattedLong + " (" + dateStr + ").\n" +
    "That date is today. Headlines, prices, tech, and culture stop there. Present tense. Full articles, nav, sidebars, and footer — not a stub.\n" +
    "No cookie-cutter templates. Era-appropriate dimensions. Only layout tools that existed in " + era.year + ".\n" +
    timelineProfile.promptGuide + "\n" +
    (cleanMemes.length > 0
      ? "Use these date keywords only where they fit: " + cleanMemes.join(", ") + ".\n"
      : "") +
    era.styleGuide + "\n" +
    "ERA FIDELITY: the browser of " + era.year + " renders this page, so nothing may come from after " + era.year + " — not a character, icon style, typeface, or rendering trick that did not exist then. Let that browser's own defaults show through (visible link underlines, native form controls, its own scrolling) instead of a modern reset, and match the density and spacing conventions of " + era.year + " sites rather than today's.\n" +
    continuity +
    imageRules + "\n" +
    "Many internal and external <a href>, plus one <form method=\"GET\">. External links may point at made-up domains and pages.\n" +
    "Output only the document from <!DOCTYPE html> to </html>. No markdown fences or commentary.";

  var userPrompt =
    "URL: " + url + "\n" +
    "Home: " + homepageUrl + "\n" +
    "Date: " + dateStr + "\n" +
    "Timeline: " + timelineProfile.shortLabel + " " + timelineProfile.pct + "%\n";

  if (seedTargetContext && seedTargetContext.targetSubpageUrl) {
    userPrompt +=
      "\n<homepage_architecture_note>\n" +
      "This is the root " + homepageUrl + ". Establish header, CSS, and nav, and link to " +
      seedTargetContext.targetSubpageUrl +
      (seedTargetContext.navContext && seedTargetContext.navContext.linkText
        ? " (\"" + seedTargetContext.navContext.linkText + "\")"
        : "") +
      ".\n</homepage_architecture_note>\n";
  }

  if (sitePlanText) {
    userPrompt += "\n<site_plan domain=\"" + (domain || homepageUrl) + "\" era=\"" + era.year + "\">\n" + sitePlanText + "\n</site_plan>\n";
  }

  if (isHomepageUrl(url) && priorHomepageHtml) {
    userPrompt +=
      "\n<prior_homepage url=\"" + homepageUrl + "\" date=\"" + priorHomepageDate + "\">\n" +
      priorHomepageHtml + "\n" +
      "</prior_homepage>\n";
  }

  if (homepageHtml) {
    userPrompt +=
      "\n<site_homepage url=\"" + homepageUrl + "\">\n" +
      homepageHtml + "\n" +
      "</site_homepage>\n";
  }

  if (hasReferrerContext) {
    var sameAsHome = Boolean(
      homepageHtml &&
      referrerHtml &&
      (referrerUrl === homepageUrl || referrerHtml === homepageHtml)
    );
    userPrompt += "\n<referring_page url=\"" + (referrerUrl || "previous_page") + "\"" +
      (sameAsHome ? " same_as_site_homepage=\"true\"" : "") +
      (referrerUrl && !isSameSiteReferrer ? " external_referrer=\"true\"" : "") + ">\n";
    if (navContext) {
      if (navContext.referrerUrl) {
        userPrompt += "Referrer URL (page where link was clicked): " + navContext.referrerUrl + "\n";
      }
      if (navContext.linkText) {
        userPrompt += "Clicked Link / Headline Text: \"" + navContext.linkText + "\"\n";
      }
      if (navContext.linkContext) {
        userPrompt += "Surrounding Context on Referring Page: \"" + navContext.linkContext + "\"\n";
      }
      if (navContext.formData) {
        userPrompt += "Submitted Form Input Parameters: " + JSON.stringify(navContext.formData) + "\n";
      }
    }
    if (sameAsHome) {
      userPrompt += "Referrer HTML: Identical to `<site_homepage>` above.\n";
    } else if (referrerHtml) {
      userPrompt += "Referrer Page HTML (for link context):\n" + referrerHtml + "\n";
    }
    userPrompt += "</referring_page>\n";
  }

  if (availableImagesListText) {
    userPrompt +=
      "\n<available_domain_images domain=\"" + (domain || homepageUrl) + "\" time_period=\"" + era.year + "\">\n" +
      availableImagesListText + "\n" +
      "</available_domain_images>\n";
  }

  return {
    systemPrompt: systemPrompt,
    userPrompt: userPrompt,
    era: era,
    timelineProfile: timelineProfile,
    homepageUrl: homepageUrl,
    domain: domain,
    availableDomainImages: availableDomainImages,
    hasHomepageContext: hasHomepageContext,
    hasReferrerContext: hasReferrerContext,
    hasSitePlan: Boolean(sitePlanText),
    memes: cleanMemes
  };
}
