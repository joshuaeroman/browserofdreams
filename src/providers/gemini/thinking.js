export function isAgentPlatformAuth(authMethod) {
  return authMethod === "agentplatform";
}

export function rejectsBudgetZeroOnAiStudio(model) {
  var m = String(model || "").toLowerCase();
  if (!m) return false;
  if (m === "gemini-flash-lite-latest") return true;
  if (m.indexOf("3.5-flash-lite") !== -1 || m.indexOf("3.6-flash-lite") !== -1)
    return true;
  if (m.indexOf("flash-lite-latest") !== -1)
    return true;
  return false;
}

export function supportsMinimalThinkingLevel(model) {
  var m = String(model || "").toLowerCase();
  if (m === "gemini-flash-latest") return false;
  return true;
}

export function budgetToThinkingLevel(budget, model) {
  var b = budget | 0;
  if (b <= 0) {
    if (supportsMinimalThinkingLevel(model))
      return "MINIMAL";
    return "LOW";
  }
  if (b <= 1024) return "LOW";
  if (b <= 8192) return "MEDIUM";
  return "HIGH";
}

export function buildThinkingConfig(model, thinkingBudget, showThoughts, authMethod) {
  var budget = thinkingBudget | 0;
  if (budget < 0) budget = 0;

  var cfg = {};
  if (showThoughts) cfg.includeThoughts = true;

  if (isAgentPlatformAuth(authMethod)) {
    cfg.thinkingBudget = budget;
    return cfg;
  }

  if (budget === 0 && rejectsBudgetZeroOnAiStudio(model)) {
    cfg.thinkingLevel = budgetToThinkingLevel(0, model);
    return cfg;
  }

  cfg.thinkingBudget = budget;
  return cfg;
}

export const GeminiThinking = {
  isAgentPlatform: isAgentPlatformAuth,
  rejectsBudgetZeroOnAiStudio,
  supportsMinimalThinkingLevel,
  budgetToThinkingLevel,
  buildThinkingConfig
};
