export type ModuleId = "seo" | "aso" | "geo" | "aio";

export type Severity = "critical" | "high" | "medium" | "low" | "pass";

export interface Insight {
  id: string;
  title: string;
  detail: string;
  severity: Severity;
  tip?: string;
}

export interface Metric {
  label: string;
  value: string;
  hint?: string;
}

export interface AnalysisResult {
  module: ModuleId;
  score: number;
  grade: string;
  summary: string;
  metrics: Metric[];
  insights: Insight[];
  keywords: string[];
}

export interface SeoInput {
  url?: string;
  title: string;
  metaDescription: string;
  content: string;
  targetKeyword: string;
}

export interface AsoInput {
  appName: string;
  subtitle: string;
  description: string;
  keywords: string;
  category: string;
}

export interface GeoInput {
  brand: string;
  topic: string;
  content: string;
  entities: string;
}

export interface AioInput {
  question: string;
  answer: string;
  sources: string;
  facts: string;
}
