export function getEraInfo(dateStr) {
  var parts = String(dateStr || "1999-12-31").split("-");
  var year = parseInt(parts[0], 10) || 1999;
  var month = parseInt(parts[1], 10) || 12;
  var day = parseInt(parts[2], 10) || 31;

  var dt = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  var formattedLong = days[dt.getUTCDay()] + ", " + months[dt.getUTCMonth()] + " " + dt.getUTCDate() + ", " + year;
  var formattedShort = shortMonths[dt.getUTCMonth()] + " " + dt.getUTCDate() + ", " + year;

  if (year < 1990) {
    return {
      eraKey: "pre90s",
      year: year,
      formattedLong: formattedLong,
      formattedShort: formattedShort,
      badgeLabel: "ARPANET / BBS Terminal (" + year + ")",
      browserName: "TELE-NET CRT Navigator",
      styleGuide:
        "Design " + year + " (pre-WWW): BBS, ARPANET, CompuServe, Minitel, or Gopher. Be inventive but not anachronistic with the webpage design. Courier, phosphor CRT (green #33ff66 or amber #ffb000 on #050a05), ASCII borders, baud notice, text menus. No HTML chrome."
    };
  }

  if (year <= 1994) {
    return {
      eraKey: "1990s",
      year: year,
      formattedLong: formattedLong,
      formattedShort: formattedShort,
      badgeLabel: "Early Mosaic Web 1.0 (" + year + ")",
      browserName: "NCSA Mosaic / Netscape 1.0",
      styleGuide:
        "Design " + year + " (Mosaic / HTML 2): Be inventive but not anachronistic with the webpage design. Gray #c0c0c0 or plain background, Times, blue #0000ee links, purple #551a8b visited. h1–h3, hr, lists, pre, blockquote, dithered images. No CSS, no nested layout tables."
    };
  }

  if (year <= 1999) {
    return {
      eraKey: "1990s",
      year: year,
      formattedLong: formattedLong,
      formattedShort: formattedShort,
      badgeLabel: "Web 1.0 / Netscape Era (" + year + ")",
      browserName: "Netscape Dreamicator 4.0",
      styleGuide:
        "Design " + year + " (Web 1.0): Be inventive but not anachronistic with the webpage design. Own palette and layout, not one repeated homepage. Nested tables, font tags, tiled backgrounds, beveled borders, web-safe colors, hit counters, 800x600 badge, banner ads. No Flexbox, Grid, or later JS."
    };
  }

  if (year <= 2005) {
    return {
      eraKey: "2000s",
      year: year,
      formattedLong: formattedLong,
      formattedShort: formattedShort,
      badgeLabel: "Early 2000s Portal Era (" + year + ")",
      browserName: "Dream Explorer 6.0",
      styleGuide:
        "Design " + year + ": Be inventive but not anachronistic with the webpage design. Not one generic layout — corporate, editorial, startup, fan, and shop sites each had their own. Fixed 760–960px, tables or early CSS, Verdana/Tahoma/Georgia/Arial, tab nav, pixel borders, banner and box ads. Strictly NO modern SPAs, reactive components, CSS Grid, or Flexbox."
    };
  }

  if (year <= 2011) {
    return {
      eraKey: "2000s",
      year: year,
      formattedLong: formattedLong,
      formattedShort: formattedShort,
      badgeLabel: "Web 2.0 Glossy Era (" + year + ")",
      browserName: "Dream Explorer / Web 2.0",
      styleGuide:
        "Design " + year + " (Web 2.0): Be inventive but not anachronistic with the webpage design. A campaign site like barackobama.com, a tech company, a network, or an indie each had its own type, hero, and layout. Floats, rounded corners, gloss, soft shadows, RSS, BETA badges. No CSS Grid, no reactive SPAs, no 2020s flat systems."
    };
  }

  if (year <= 2029) {
    return {
      eraKey: "modern",
      year: year,
      formattedLong: formattedLong,
      formattedShort: formattedShort,
      badgeLabel: "Modern Web (" + year + ")",
      browserName: "Dreamium Browser",
      styleGuide:
        "Design " + year + ": Be inventive but not anachronistic with the webpage design. Distinct magazine, showcase, portfolio, or product layout — not a boilerplate. Flexbox/Grid, a real type scale, hero, cards, contemporary ads."
    };
  }

  return {
    eraKey: "future",
    year: year,
    formattedLong: formattedLong,
    formattedShort: formattedShort,
    badgeLabel: "ChronoNet Future (" + year + ")",
    browserName: "ChronoNet Quantum Nexus",
    styleGuide:
      "Design " + year + ": Be inventive but not anachronistic with the webpage design. Interface for that year — glass, telemetry, or latency — specific to this service."
  };
}

// The character repertoire a page of that year could actually carry. Written
// in ASCII itself so the instruction never models the characters it forbids.
export function getCharsetGuide(year) {
  var y = parseInt(year, 10);
  if (!y || isNaN(y)) y = 1999;

  if (y < 1990) {
    return {
      id: "ascii",
      label: "7-bit ASCII",
      text:
        "CHARACTER SET (7-bit ASCII): type only what an ASCII keyboard produced - letters, digits, and ASCII punctuation. " +
        "Curly quotes, apostrophes, en and em dashes, ellipses, bullets, accented letters, copyright and trademark signs, and emoji have no byte here; " +
        "use straight quotes, \"-\", and \"...\" instead."
    };
  }

  if (y <= 2007) {
    return {
      id: "windows-1252",
      label: "Windows-1252",
      text:
        "CHARACTER SET (Windows-1252): curly quotes and apostrophes, en and em dashes, the ellipsis, bullets, copyright and trademark signs, and Western European accents all have bytes. " +
        "Letters outside Latin-1 (Slavic, Greek, Turkish, Vietnamese), arrows, box drawing, check marks, emoji, and combining marks do not - keep to what a Latin-1 keyboard produced."
    };
  }

  return { id: "utf-8", label: "UTF-8", text: "" };
}

export const ERA_THEME_COLORS = {
  pre90s: "#050a05",
  "1990s": "#000080",
  "2000s": "#1f4b99",
  modern: "#1e1e2f",
  future: "#0c0728"
};

export function applyEraTheme(dateStr, dom) {
  var era = getEraInfo(dateStr);
  var root = (dom && dom.htmlRoot) || (typeof document !== "undefined" ? document.documentElement : null);
  var eraPill = (dom && dom.eraPillEl) || (typeof document !== "undefined" ? document.getElementById("era-pill") : null);
  var menuEraPill = (dom && dom.menuEraPill) || (typeof document !== "undefined" ? document.getElementById("menu-era-pill") : null);
  var statusDate = (dom && dom.statusDateEl) || (typeof document !== "undefined" ? document.getElementById("status-date-display") : null);
  var homeBadge = (dom && dom.homeEraBadge) || (typeof document !== "undefined" ? document.getElementById("home-era-badge") : null);

  if (root) root.setAttribute("data-era", era.eraKey);
  if (eraPill) eraPill.textContent = era.badgeLabel;
  if (menuEraPill) menuEraPill.textContent = era.badgeLabel;
  if (statusDate) statusDate.textContent = "📅 " + era.formattedShort;
  if (homeBadge) homeBadge.textContent = "ACTIVE ERA: " + era.badgeLabel.toUpperCase();

  var themeColor = ERA_THEME_COLORS[era.eraKey] || "#1f4b99";
  era.themeColor = themeColor;
  if (typeof document !== "undefined") {
    var meta = document.getElementById("meta-theme-color") || document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", themeColor);
  }

  return era;
}
