export var REASONING_EFFORT_LEVELS = ["off", "low", "medium", "high", "xhigh", "max"];

export var EFFORT_THINKING_BUDGETS = { off: 0, low: 1024, medium: 4096, high: 16384, xhigh: 24576, max: 32768 };

// Reasoning tokens are billed inside the output cap on Anthropic and Gemini, so
// a request that asks for N text tokens while thinking M tokens needs a cap of
// N + M. Ceilings keep the transmitted cap inside common model limits.
export var DEFAULT_OUTPUT_CEILING = 32768;

export function outputTokenBudget(contentTokens, thinkingBudget, ceiling) {
  var content = parseInt(contentTokens, 10);
  if (!isFinite(content) || content < 0) content = 0;
  var budget = parseInt(thinkingBudget, 10) || 0;
  if (budget <= 0) return content;
  var total = content + budget;
  var cap = parseInt(ceiling, 10) || DEFAULT_OUTPUT_CEILING;
  return total > cap ? cap : total;
}

export function normalizeReasoningEffort(value) {
  var v = String(value == null ? "" : value).toLowerCase();
  return REASONING_EFFORT_LEVELS.indexOf(v) === -1 ? "off" : v;
}

export function effortToThinkingBudget(effort) {
  return EFFORT_THINKING_BUDGETS[normalizeReasoningEffort(effort)];
}

export function thinkingBudgetToEffort(budget) {
  var b = parseInt(budget, 10) || 0;
  if (b <= 0) return "off";
  if (b <= 1024) return "low";
  if (b <= 8192) return "medium";
  return "high";
}

// Levels OpenRouter and local OpenAI-compatible servers accept. Empty string means "send nothing".
export function providerReasoningEffort(effort) {
  var e = normalizeReasoningEffort(effort);
  if (e === "off") return "";
  if (e === "xhigh" || e === "max") return "high";
  return e;
}

export function openRouterReasoningEffort(effort) {
  return providerReasoningEffort(effort) || "none";
}

export function localReasoningEffort(effort) {
  return providerReasoningEffort(effort);
}
