export function getTimelineDivergenceProfile(divergenceValue, year) {
  var raw = typeof divergenceValue === "number" ? divergenceValue : parseFloat(divergenceValue);
  if (isNaN(raw)) raw = 0;
  var pct = Math.max(0, Math.min(100, Math.round(raw)));
  var y = parseInt(year, 10) || 2001;

  if (pct <= 15) {
    return {
      pct: pct,
      tierKey: "grounded",
      shortLabel: "🏛️ Grounded",
      badgeText: "🏛️ Grounded (" + pct + "%)",
      fullTitle: pct + "% — 🏛️ Grounded (Strict Historical & Real-World Accuracy)",
      description: "100% anchored to real-world history, real companies, real events, and authentic facts of the selected date.",
      imageDirective: "Strictly historically accurate " + y + " real-world documentary/commercial realism.",
      promptGuide:
        "Timeline " + pct + "% grounded: real people, companies, products, scores, and events as of this date. No alternate history. An obscure or fictional domain is still a real " + y + " site in our world."
    };
  }

  if (pct <= 39) {
    return {
      pct: pct,
      tierKey: "plausible",
      shortLabel: "📰 Plausible",
      badgeText: "📰 Plausible (" + pct + "%)",
      fullTitle: pct + "% — 📰 Plausible Era (Historically Anchored + Creative Detail)",
      description: "Anchored in real history, with creative latitude for quirky local stories, indie startups, and colorful period flavor.",
      imageDirective: "Plausible " + y + " period-authentic scene with colorful period detail.",
      promptGuide:
        "Timeline " + pct + "% plausible: real " + y + " events, technology, and politics. Invent only local stories, niche products, forum threads, and ads that could have existed then."
    };
  }

  if (pct <= 64) {
    return {
      pct: pct,
      tierKey: "divergent",
      shortLabel: "🌀 What-If",
      badgeText: "🌀 What-If (" + pct + "%)",
      fullTitle: pct + "% — 🌀 Divergent History (One Counterfactual What-If)",
      description: "Real era look and technology, plus one counterfactual what-if in the news, products, and politics.",
      imageDirective: "Alternate-history " + y + " scene: one changed event, photographed like a real " + y + " picture.",
      promptGuide:
        "Timeline " + pct + "% what-if: real " + y + " web, technology, and culture, plus one clear historical change (election, company, treaty, or product) visible in the news, products, and ads."
    };
  }

  if (pct <= 84) {
    return {
      pct: pct,
      tierKey: "alternate",
      shortLabel: "⚡ Alt History",
      badgeText: "⚡ Alt History (" + pct + "%)",
      fullTitle: pct + "% — ⚡ Alternate History (Different Outcomes, Same Era)",
      description: "A rewritten branch of history: different elections, companies, and borders, using the technology and design of that year.",
      imageDirective: "Alternate-history " + y + " scene: different politics and products, photographed like a real " + y + " picture.",
      promptGuide:
        "Timeline " + pct + "% alternate history: rewrite " + y + " political and commercial outcomes. Same science and everyday technology as our " + y + ". Tickers, weather, sidebars, and ads belong to that branch, in a period-faithful layout."
    };
  }

  return {
    pct: pct,
    tierKey: "fanciful",
    shortLabel: "🌌 Fever Dream",
    badgeText: "🌌 Alt Reality (" + pct + "%)",
    fullTitle: pct + "% — 🌌 Fever-Dream Alternate History",
    description: "An earnest, exaggerated alternate history: impossible products and odd headlines, still looking like that year.",
    imageDirective: "Fanciful alternate-history " + y + " scene: impossible products and odd headlines, rendered as a real " + y + " photograph.",
    promptGuide:
      "Timeline " + pct + "% fever dream: an earnest alternate history of " + y + " — impossible products, odd headlines, strange tickers — in authentic " + y + " HTML."
  };
}
