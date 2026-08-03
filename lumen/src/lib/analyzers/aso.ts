import {
  clamp,
  density,
  gradeFromScore,
  insight,
  uniqueKeywords,
  wordCount,
} from "./shared";
import type { AnalysisResult, AsoInput } from "./types";

export function analyzeAso(input: AsoInput): AnalysisResult {
  const name = input.appName.trim();
  const subtitle = input.subtitle.trim();
  const description = input.description.trim();
  const keywordField = input.keywords.trim();
  const category = input.category.trim();
  const nameLen = name.length;
  const subtitleLen = subtitle.length;
  const descWords = wordCount(description);
  const keywordList = keywordField
    .split(/[,;\n]+/)
    .map((k) => k.trim())
    .filter(Boolean);
  const primary = keywordList[0]?.toLowerCase() ?? "";
  const nameHasKw = primary ? name.toLowerCase().includes(primary) : false;
  const subHasKw = primary ? subtitle.toLowerCase().includes(primary) : false;
  const descDensity = primary ? density(description, primary) : 0;
  const duplicateInName = keywordList.some((k) =>
    name.toLowerCase().includes(k.toLowerCase()),
  );

  let score = 38;
  if (nameLen > 0 && nameLen <= 30) score += 14;
  else if (nameLen > 30) score += 4;
  if (subtitleLen > 0 && subtitleLen <= 30) score += 12;
  else if (subtitleLen > 0) score += 4;
  if (descWords >= 150) score += 12;
  else if (descWords >= 80) score += 7;
  else if (descWords > 0) score += 3;
  if (keywordList.length >= 5 && keywordList.length <= 14) score += 10;
  else if (keywordList.length > 0) score += 4;
  if (nameHasKw) score += 6;
  if (subHasKw) score += 5;
  if (descDensity >= 0.4 && descDensity <= 2.8) score += 6;
  if (category) score += 3;
  if (duplicateInName && keywordList.length) score += 2;
  score = clamp(score);

  const insights = [
    nameLen === 0
      ? insight("name-missing", "App name is required", "Store listings without a clear name cannot convert or rank.", "critical", "Use a memorable brand + benefit within 30 characters.")
      : nameLen > 30
        ? insight("name-long", "App name exceeds common store limits", `Name is ${nameLen} characters. Apple truncates around 30.`, "high", "Shorten while keeping brand recognition.")
        : insight("name-ok", "App name length is store-safe", `${nameLen}/30 characters.`, "pass"),
    subtitleLen === 0
      ? insight("subtitle-missing", "Subtitle / short description missing", "This field is high-visibility keyword real estate.", "critical", "Add a benefit-led subtitle under 30 characters.")
      : subtitleLen > 30
        ? insight("subtitle-long", "Subtitle may truncate", `Subtitle is ${subtitleLen} characters.`, "medium", "Prioritize the strongest ranking term first.")
        : insight("subtitle-ok", "Subtitle length looks good", `${subtitleLen}/30 characters.`, "pass"),
    keywordList.length === 0
      ? insight("kw-field", "Keyword field is empty", "ASO relies on indexed keyword tokens beyond the title.", "critical", "Add 8–12 relevant, non-duplicative keywords.")
      : keywordList.length < 5
        ? insight("kw-few", "Keyword coverage is thin", `Only ${keywordList.length} keywords provided.`, "high", "Expand with related intents and competitor terms.")
        : insight("kw-ok", "Keyword field has useful breadth", `${keywordList.length} keywords detected.`, "pass"),
    primary && !nameHasKw && !subHasKw
      ? insight("kw-placement", "Primary keyword not in name or subtitle", "Highest-weight ASO fields are underused.", "high", "Place the primary term in subtitle if brand name is occupied.")
      : primary
        ? insight("kw-placement-ok", "Primary keyword surfaces in metadata", "Good visibility in high-weight fields.", "pass")
        : insight("kw-primary", "No primary keyword detected", "List keywords comma-separated, strongest first.", "medium"),
    descWords < 80
      ? insight("desc-thin", "Description is too short", `~${descWords} words. Store users and algorithms prefer richer copy.`, "high", "Lead with benefits, then features, social proof, and CTAs.")
      : insight("desc-ok", "Description has usable depth", `~${descWords} words.`, "pass"),
    !category
      ? insight("category", "Category not set", "Wrong or missing category hurts discoverability.", "medium", "Choose the most specific relevant category.")
      : insight("category-ok", "Category provided", category, "pass"),
  ];

  return {
    module: "aso",
    score,
    grade: gradeFromScore(score),
    summary:
      score >= 80
        ? "Listing metadata is conversion-ready. Next: creative tests and localization."
        : score >= 60
          ? "Core ASO fields exist, but keyword placement and description depth need polish."
          : "Store listing fundamentals are incomplete. Fix name, subtitle, and keyword field first.",
    metrics: [
      { label: "App name", value: `${nameLen}/30`, hint: "Brand + benefit" },
      { label: "Subtitle", value: `${subtitleLen}/30`, hint: "Primary ranking term" },
      { label: "Keywords", value: `${keywordList.length}`, hint: "8–12 recommended" },
      { label: "Description words", value: `${descWords}`, hint: "150+ ideal" },
      { label: "Category", value: category || "—" },
    ],
    insights,
    keywords: uniqueKeywords(
      `${name} ${subtitle} ${description} ${keywordField} ${category}`,
    ),
  };
}
