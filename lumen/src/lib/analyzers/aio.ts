import {
  clamp,
  gradeFromScore,
  insight,
  sentenceCount,
  uniqueKeywords,
  wordCount,
} from "./shared";
import type { AnalysisResult, AioInput } from "./types";

export function analyzeAio(input: AioInput): AnalysisResult {
  const question = input.question.trim();
  const answer = input.answer.trim();
  const sources = input.sources
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const facts = input.facts
    .split(/[\n;]+/)
    .map((f) => f.trim())
    .filter(Boolean);
  const answerWords = wordCount(answer);
  const answerSentences = sentenceCount(answer);
  const isQuestion = /\?$|^(how|what|why|when|where|who|which|can|does|is|are)\b/i.test(
    question,
  );
  const directLead =
    answerSentences > 0 &&
    wordCount(answer.split(/[.!?]/)[0] ?? "") <= 28 &&
    answerWords > 0;
  const hasFaqShape = /\b(q:|a:|faq|frequently asked)\b/i.test(
    `${question}\n${answer}`,
  );
  const hasSchemaHint = /schema\.org|faqpage|speakable|json-ld/i.test(
    `${answer}\n${input.sources}`,
  );
  const factualDensity = facts.length;
  const sourceScore = Math.min(sources.length * 8, 24);

  let score = 35;
  if (question) score += 8;
  if (isQuestion) score += 6;
  if (answerWords >= 60 && answerWords <= 220) score += 14;
  else if (answerWords > 0) score += 6;
  if (directLead) score += 10;
  if (factualDensity >= 3) score += 12;
  else if (factualDensity > 0) score += 5;
  score += sourceScore * 0.5;
  if (hasFaqShape) score += 4;
  if (hasSchemaHint) score += 4;
  if (sources.some((s) => /^https?:\/\//i.test(s))) score += 4;
  score = clamp(score);

  const insights = [
    !question
      ? insight("q-missing", "No target question", "Answer engines optimize around explicit user questions.", "critical", "Write the exact question you want to win in AI answers.")
      : !isQuestion
        ? insight("q-shape", "Target phrasing is not question-like", "AI answer surfaces map closely to natural-language questions.", "medium", "Reframe as a how/what/why question users actually ask.")
        : insight("q-ok", "Question framing looks strong", question, "pass"),
    answerWords === 0
      ? insight("a-missing", "Answer content is empty", "There is nothing for an answer engine to extract.", "critical", "Provide a concise, factual answer under ~150 words.")
      : !directLead
        ? insight("a-lead", "Answer does not lead with a direct response", "Models prefer an immediate, self-contained first sentence.", "high", "Open with a one-sentence answer, then supporting detail.")
        : insight("a-lead-ok", "Direct answer lead detected", "First sentence is extractable.", "pass"),
    answerWords > 0 && (answerWords < 40 || answerWords > 260)
      ? insight("a-length", "Answer length is suboptimal", `~${answerWords} words. Ideal extractable answers are often 60–180 words.`, "medium", "Tighten long answers; expand thin ones with 2–3 proof points.")
      : answerWords > 0
        ? insight("a-length-ok", "Answer length suits extraction", `~${answerWords} words.`, "pass")
        : insight("a-length-skip", "Length check skipped", "Add an answer to evaluate.", "low"),
    factualDensity === 0
      ? insight("facts", "No discrete facts provided", "Answer engines prefer atomic, verifiable claims.", "high", "List 3–5 dated or measurable facts supporting the answer.")
      : factualDensity < 3
        ? insight("facts-few", "Fact set is light", `${factualDensity} facts listed.`, "medium", "Add original data, comparisons, or named references.")
        : insight("facts-ok", "Solid factual density", `${factualDensity} supporting facts.`, "pass"),
    sources.length === 0
      ? insight("sources", "No sources listed", "Attribution improves trust for AI citations.", "high", "Add canonical URLs, docs, or primary research links.")
      : insight("sources-ok", "Sources available for attribution", `${sources.length} source(s) listed.`, "pass"),
    !hasSchemaHint && !hasFaqShape
      ? insight("structure", "Limited answer-engine structure signals", "FAQ formatting and schema help machines parse Q&A pairs.", "low", "Consider FAQPage schema and clear Q/A formatting.")
      : insight("structure-ok", "Answer structure signals present", "FAQ/schema cues detected.", "pass"),
  ];

  return {
    module: "aio",
    score,
    grade: gradeFromScore(score),
    summary:
      score >= 80
        ? "Answer package is engine-ready. Maintain freshness and source authority."
        : score >= 60
          ? "Good base answer, but needs tighter leads, more atomic facts, or clearer sources."
          : "Not yet optimized for answer engines. Rebuild as question → direct answer → facts → sources.",
    metrics: [
      { label: "Answer words", value: `${answerWords}`, hint: "60–180 ideal" },
      { label: "Facts", value: `${factualDensity}`, hint: "3+ recommended" },
      { label: "Sources", value: `${sources.length}` },
      { label: "Direct lead", value: directLead ? "Yes" : "No" },
      { label: "Question", value: question ? "Set" : "Missing" },
    ],
    insights,
    keywords: uniqueKeywords(
      `${question} ${answer} ${facts.join(" ")} ${sources.join(" ")}`,
    ),
  };
}
