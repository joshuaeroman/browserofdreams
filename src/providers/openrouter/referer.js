/**
 * OpenRouter attribution headers ("HTTP-Referer" / "X-Title") are how OpenRouter
 * attributes leaderboard traffic. Report the real deploy origin instead of a
 * hardcoded fake domain.
 */
export function getAppReferrerOrigin() {
  if (typeof globalThis !== "undefined" && globalThis.location && globalThis.location.origin) {
    return globalThis.location.origin;
  }
  return "https://browser-of-dreams.local";
}
