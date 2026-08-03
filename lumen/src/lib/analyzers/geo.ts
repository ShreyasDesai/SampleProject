import {
  clamp,
  gradeFromScore,
  insight,
  sentenceCount,
  uniqueKeywords,
  wordCount,
} from "./shared";
import type { AnalysisResult, GeoInput } from "./types";

export function analyzeGeo(input: GeoInput): AnalysisResult {
  const brand = input.brand.trim();
  const topic = input.topic.trim();
  const content = input.content.trim();
  const entities = input.entities
    .split(/[,;\n]+/)
    .map((e) => e.trim())
    .filter(Boolean);
  const words = wordCount(content);
  const sentences = sentenceCount(content);
  const avgSentence = words / Math.max(sentences, 1);
  const hasDefinition =
    /\bis\b|\bare\b|refers to|means|defined as/i.test(content.slice(0, 500));
  const hasLists = /(^|\n)\s*([-•*]|\d+\.)\s+/m.test(content);
  const hasStats = /\d+%|\d{4}|\$\d+|million|billion/i.test(content);
  const hasBrand = brand
    ? content.toLowerCase().includes(brand.toLowerCase())
    : false;
  const hasTopic = topic
    ? content.toLowerCase().includes(topic.toLowerCase())
    : false;
  const entityHits = entities.filter((e) =>
    content.toLowerCase().includes(e.toLowerCase()),
  ).length;
  const citeability =
    (hasDefinition ? 20 : 0) +
    (hasLists ? 15 : 0) +
    (hasStats ? 15 : 0) +
    (words >= 400 ? 20 : words >= 200 ? 10 : 0) +
    (entityHits > 0 ? 15 : 0) +
    (avgSentence <= 24 ? 15 : 5);

  let score = 30 + citeability * 0.55;
  if (brand) score += 5;
  if (topic) score += 5;
  if (entities.length >= 3) score += 6;
  if (hasBrand && hasTopic) score += 8;
  score = clamp(score);

  const insights = [
    !brand
      ? insight("brand", "Brand entity not set", "Generative engines need a clear brand entity to attribute answers.", "critical", "State the brand name and what category it belongs to.")
      : !hasBrand
        ? insight("brand-body", "Brand rarely appears in the content", "Models struggle to connect claims to your brand.", "high", "Mention the brand in the definition and key claims.")
        : insight("brand-ok", "Brand entity is present", "Content reinforces brand attribution.", "pass"),
    !topic
      ? insight("topic", "Topic / query intent missing", "GEO works best when optimized for a specific generative query.", "high", "Define the question you want AI engines to answer with your brand.")
      : !hasTopic
        ? insight("topic-body", "Topic not anchored in content", `“${topic}” should appear early and clearly.`, "medium", "Open with a direct answer sentence about the topic.")
        : insight("topic-ok", "Topic is clearly represented", "Good alignment with the target generative query.", "pass"),
    !hasDefinition
      ? insight("definition", "No crisp definition / answer lead", "AI engines prefer extractable, quotable opening statements.", "high", "Start with: “[Topic] is… [Brand] helps by…”")
      : insight("definition-ok", "Definition-style opening detected", "Cite-friendly framing for generative answers.", "pass"),
    entities.length < 3
      ? insight("entities", "Entity coverage is thin", `Only ${entities.length} entities provided.`, "medium", "Add people, products, places, standards, and related concepts.")
      : entityHits < Math.ceil(entities.length / 2)
        ? insight("entity-use", "Entities not woven into copy", "Listed entities should appear naturally in the narrative.", "medium", "Connect entities with clear relationships.")
        : insight("entities-ok", "Entities are well utilized", `${entityHits}/${entities.length} entities appear in content.`, "pass"),
    !hasStats
      ? insight("stats", "Few concrete facts or statistics", "Generative engines favor verifiable, specific claims.", "medium", "Add dated stats, measurable outcomes, or named standards.")
      : insight("stats-ok", "Concrete facts detected", "Specificity improves citation likelihood.", "pass"),
    !hasLists
      ? insight("structure", "Limited scannable structure", "Bullets and numbered steps are easy for models to quote.", "low", "Add a short list of key points or steps.")
      : insight("structure-ok", "Scannable structure present", "Lists help generative extraction.", "pass"),
    avgSentence > 28
      ? insight("clarity", "Sentences may be too long for citation", `Average ~${avgSentence.toFixed(1)} words/sentence.`, "low", "Use shorter, declarative sentences for quotability.")
      : insight("clarity-ok", "Sentence clarity looks citeable", `Average ~${avgSentence.toFixed(1)} words/sentence.`, "pass"),
  ];

  return {
    module: "geo",
    score,
    grade: gradeFromScore(score),
    summary:
      score >= 80
        ? "Content is structured for generative citation. Strengthen entity graph and original facts next."
        : score >= 60
          ? "Partially citeable. Improve definition leads, entities, and factual specificity."
          : "Generative engines will struggle to quote this. Rebuild around clear entities and answer-first copy.",
    metrics: [
      { label: "Citeability index", value: `${clamp(citeability)}`, hint: "Definition + facts + structure" },
      { label: "Word count", value: `${words}` },
      { label: "Entities", value: `${entityHits}/${entities.length || 0}` },
      { label: "Avg sentence", value: `${avgSentence.toFixed(1)} words` },
      { label: "Brand", value: brand || "—" },
    ],
    insights,
    keywords: uniqueKeywords(`${brand} ${topic} ${content} ${entities.join(" ")}`),
  };
}
