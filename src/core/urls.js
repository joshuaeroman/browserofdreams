export function normalizeDreamUrl(rawInput, year) {
  var trimmed = String(rawInput || "").trim();
  if (!trimmed || trimmed === "about:dreams" || trimmed === "about:home") {
    return "about:dreams";
  }
  var scheme = (year && year >= 2014) ? "https://" : "http://";
  // If it contains spaces or looks like a search query without a dot
  if (/\s/.test(trimmed) || trimmed.indexOf(".") === -1) {
    var q = encodeURIComponent(trimmed);
    if (year && year < 1995) return "http://info.cern.ch/hypertext/DataSources/bySubject.html?q=" + q;
    if (year && year <= 1998) return "http://www.altavista.digital.com/cgi-bin/query?pg=q&q=" + q;
    if (year && year <= 2003) return "http://www.google.com/search?q=" + q;
    return scheme + "www.google.com/search?q=" + q;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  var withScheme = scheme + trimmed;
  try {
    var u = new URL(withScheme);
    if (!u.hostname.startsWith("www.") && u.hostname.split(".").length === 2 && (!year || year <= 2008)) {
      u.hostname = "www." + u.hostname;
    }
    return u.toString();
  } catch (e) {
    return withScheme;
  }
}

export function getHomepageUrl(normalizedUrl) {
  var raw = String(normalizedUrl || "").trim();
  if (!raw || raw === "about:dreams" || raw === "about:home") {
    return "about:dreams";
  }
  try {
    var u = new URL(raw);
    return u.origin + "/";
  } catch (e) {
    var m = /^(https?:\/\/[^\/?#]+)/i.exec(raw);
    return m ? (m[1] + "/") : raw;
  }
}

export function isHomepageUrl(normalizedUrl) {
  var raw = String(normalizedUrl || "").trim();
  if (!raw || raw === "about:dreams" || raw === "about:home") {
    return true;
  }
  try {
    var u = new URL(raw);
    if (u.search && u.search.length > 1) return false;
    var p = (u.pathname || "/").toLowerCase();
    return (
      p === "/" ||
      p === "/index.html" ||
      p === "/index.htm" ||
      p === "/default.htm" ||
      p === "/default.asp" ||
      p === "/home.html"
    );
  } catch (e) {
    return raw === getHomepageUrl(raw);
  }
}

export function extractDomain(rawUrl) {
  var raw = String(rawUrl || "").trim();
  if (!raw || raw.startsWith("about:") || raw.startsWith("data:")) {
    return "";
  }
  try {
    var withScheme = /^https?:\/\//i.test(raw) ? raw : ("http://" + raw);
    var u = new URL(withScheme);
    var host = (u.hostname || "").toLowerCase();
    return host.replace(/^www\./, "");
  } catch (e) {
    var m = /^(?:https?:\/\/)?(?:www\.)?([^\/\s:#?]+)/i.exec(raw);
    return m ? m[1].toLowerCase() : "";
  }
}

