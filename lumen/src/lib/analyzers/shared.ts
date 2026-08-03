import type { Insight, Severity } from "./types";

export function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

export function gradeFromScore(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

export function uniqueKeywords(text: string, limit = 12): string[] {
  const stop = new Set([
    "the",
    "and",
    "for",
    "with",
    "that",
    "this",
    "from",
    "your",
    "you",
    "are",
    "our",
    "can",
    "will",
    "into",
    "about",
    "have",
    "has",
    "was",
    "were",
    "been",
    "also",
    "more",
    "than",
    "when",
    "what",
    "which",
    "their",
    "they",
    "them",
    "how",
    "why",
    "who",
    "not",
    "but",
    "all",
    "any",
    "out",
    "use",
    "using",
    "used",
  ]);
  const counts = new Map<string, number>();
  for (const token of tokenize(text)) {
    if (stop.has(token)) continue;
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

export function density(text: string, phrase: string): number {
  if (!phrase.trim() || !text.trim()) return 0;
  const hay = text.toLowerCase();
  const needle = phrase.toLowerCase().trim();
  let count = 0;
  let idx = 0;
  while ((idx = hay.indexOf(needle, idx)) !== -1) {
    count += 1;
    idx += needle.length;
  }
  const words = Math.max(tokenize(text).length, 1);
  return (count / words) * 100;
}

export function wordCount(text: string): number {
  return tokenize(text).length;
}

export function sentenceCount(text: string): number {
  return text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length || 1;
}

export function insight(
  id: string,
  title: string,
  detail: string,
  severity: Severity,
  tip?: string,
): Insight {
  return { id, title, detail, severity, tip };
}

export function average(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}
