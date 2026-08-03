import {
  clamp,
  density,
  gradeFromScore,
  insight,
  uniqueKeywords,
  wordCount,
} from "./shared";
import type { AnalysisResult, SeoInput } from "./types";

export function analyzeSeo(input: SeoInput): AnalysisResult {
  const title = input.title.trim();
  const meta = input.metaDescription.trim();
  const content = input.content.trim();
  const keyword = input.targetKeyword.trim().toLowerCase();
  const words = wordCount(content);
  const titleLen = title.length;
  const metaLen = meta.length;
  const kwInTitle = keyword ? title.toLowerCase().includes(keyword) : false;
  const kwInMeta = keyword ? meta.toLowerCase().includes(keyword) : false;
  const kwInContent = keyword ? content.toLowerCase().includes(keyword) : false;
  const kwDensity = keyword ? density(content, keyword) : 0;
  const hasHStructure =
    /^#{1,3}\s|\bh1\b|\bh2\b|<h[1-3]/i.test(content) ||
    content.split("\n").some((l) => l.trim().length > 0 && l === l.toUpperCase());
  const hasLinks = /https?:\/\/|www\./i.test(content);

  let score = 40;
  if (titleLen >= 30 && titleLen <= 60) score += 12;
  else if (titleLen > 0) score += 5;
  if (metaLen >= 120 && metaLen <= 160) score += 12;
  else if (metaLen > 40) score += 5;
  if (words >= 600) score += 14;
  else if (words >= 300) score += 8;
  else if (words >= 120) score += 4;
  if (kwInTitle) score += 8;
  if (kwInMeta) score += 6;
  if (kwInContent) score += 6;
  if (kwDensity >= 0.5 && kwDensity <= 2.5) score += 8;
  else if (kwDensity > 0) score += 2;
  if (hasHStructure) score += 4;
  if (hasLinks) score += 3;
  score = clamp(score);

  const insights = [
    titleLen === 0
      ? insight("title-missing", "Title is missing", "Search engines need a clear title tag to rank and display your page.", "critical", "Write a 30–60 character title with the primary keyword near the front.")
      : titleLen < 30 || titleLen > 60
        ? insight("title-length", "Title length is off", `Title is ${titleLen} characters. Ideal range is 30–60.`, "high", "Tighten or expand the title so it reads fully in SERPs.")
        : insight("title-ok", "Title length looks solid", `Title is ${titleLen} characters — within the ideal SERP range.`, "pass"),
    metaLen === 0
      ? insight("meta-missing", "Meta description missing", "Without a meta description, search engines invent a snippet.", "critical", "Add a compelling 120–160 character summary with the keyword.")
      : metaLen < 120 || metaLen > 160
        ? insight("meta-length", "Meta description length needs work", `Meta is ${metaLen} characters. Aim for 120–160.`, "medium", "Rewrite the snippet to sell the click without truncation.")
        : insight("meta-ok", "Meta description length is strong", `Meta is ${metaLen} characters.`, "pass"),
    !keyword
      ? insight("kw-missing", "No target keyword set", "Optimization needs a primary intent keyword.", "high", "Add one clear head term to guide title, meta, and body.")
      : !kwInTitle
        ? insight("kw-title", "Keyword missing from title", `“${input.targetKeyword}” does not appear in the title.`, "high", "Place the keyword early in the title without stuffing.")
        : insight("kw-title-ok", "Keyword present in title", "Primary keyword is represented in the title tag.", "pass"),
    keyword && !kwInContent
      ? insight("kw-body", "Keyword missing from body", "Search engines look for topical relevance in the main content.", "high", "Use the keyword naturally in the opening and a subheading.")
      : keyword && (kwDensity < 0.4 || kwDensity > 3)
        ? insight("kw-density", "Keyword density is unbalanced", `Estimated density is ${kwDensity.toFixed(2)}%. Ideal is roughly 0.5–2.5%.`, "medium", "Adjust mentions so the page reads naturally while staying on-topic.")
        : keyword
          ? insight("kw-density-ok", "Keyword usage looks natural", `Density around ${kwDensity.toFixed(2)}%.`, "pass")
          : insight("kw-skip", "Keyword checks skipped", "Provide a target keyword for density analysis.", "low"),
    words < 300
      ? insight("thin-content", "Content looks thin", `Only ~${words} words detected. Thin pages struggle to rank for competitive queries.`, "high", "Expand with useful sections, examples, and FAQs.")
      : words < 600
        ? insight("content-okish", "Content depth is moderate", `~${words} words. Competitive topics often need more comprehensive coverage.`, "medium", "Add supporting sections that answer related intents.")
        : insight("content-strong", "Content depth looks competitive", `~${words} words of body copy.`, "pass"),
    !hasLinks
      ? insight("links", "No outbound/reference links detected", "Citations and related links reinforce topical authority.", "low", "Link to authoritative sources and key internal pages.")
      : insight("links-ok", "Links detected", "Reference links help context and crawl paths.", "pass"),
  ];

  return {
    module: "seo",
    score,
    grade: gradeFromScore(score),
    summary:
      score >= 80
        ? "Strong on-page SEO foundation. Fine-tune intent matching and internal linking next."
        : score >= 60
          ? "Solid start, but title/meta/keyword alignment still leave ranking upside on the table."
          : "Foundational SEO gaps will hold this page back. Fix title, meta, and topical depth first.",
    metrics: [
      { label: "Title length", value: `${titleLen} chars`, hint: "30–60 ideal" },
      { label: "Meta length", value: `${metaLen} chars`, hint: "120–160 ideal" },
      { label: "Word count", value: `${words}`, hint: "600+ for competitive topics" },
      { label: "Keyword density", value: keyword ? `${kwDensity.toFixed(2)}%` : "—", hint: "0.5–2.5%" },
      { label: "URL", value: input.url?.trim() || "Not provided" },
    ],
    insights,
    keywords: uniqueKeywords(`${title} ${meta} ${content} ${keyword}`),
  };
}
