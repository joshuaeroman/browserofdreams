export function resolveNavigationStages(needsSitePlan, needsHomepage) {
  var stages = [];
  if (needsSitePlan) stages.push("site-plan");
  if (needsHomepage) stages.push("homepage");
  stages.push("page");
  return stages;
}

export function stageLabel(stages, name) {
  var idx = stages.indexOf(name);
  if (idx === -1) return "";
  return "[" + (idx + 1) + "/" + stages.length + "] ";
}
