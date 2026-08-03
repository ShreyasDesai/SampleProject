import { AI_ENGINES, ASO_CATEGORIES, CONTENT_TYPES, INTENT_TYPES } from "./lexicon";
import { inventishDomain } from "./helpers";
import {
  float,
  hashString,
  int,
  monthsBack,
  mulberry32,
  normalizeDomain,
  pick,
  pickN,
  titleCase,
} from "./seed";
import type { GapKeyword } from "./site";
import { exploreSite } from "./site";

export interface CompetitorCompare {
  domains: string[];
  overlapMatrix: number[][];
  sharedKeywords: number;
  gapKeywords: GapKeyword[];
  metrics: {
    domain: string;
    dr: number;
    traffic: number;
    keywords: number;
    refDomains: number;
    aiVisibility: number;
  }[];
  keywordBattle: {
    keyword: string;
    volume: number;
    positions: (number | null)[];
  }[];
}

export interface ContentIdea {
  title: string;
  type: string;
  keyword: string;
  volume: number;
  kd: number;
  intent: string;
  difficultyFit: "Easy win" | "Stretch" | "Moonshot";
  estimatedTraffic: number;
  outline: string[];
}

export interface AsoIntel {
  appName: string;
  publisher: string;
  category: string;
  store: "App Store" | "Google Play";
  rating: number;
  ratingsCount: number;
  installs: string;
  keywordCoverage: number;
  visibilityScore: number;
  topKeywords: {
    keyword: string;
    difficulty: number;
    traffic: number;
    rank: number;
    chance: number;
  }[];
  competitors: {
    name: string;
    rating: number;
    ratingsCount: number;
    overlap: number;
    category: string;
  }[];
  creativeInsights: string[];
  listingScore: number;
}

export interface GeoVisibility {
  brand: string;
  domain: string;
  overallScore: number;
  citationShare: number;
  engines: {
    engine: string;
    score: number;
    citations: number;
    sentiment: "Positive" | "Neutral" | "Mixed";
    sampleAnswer: string;
  }[];
  prompts: {
    prompt: string;
    mentioned: boolean;
    position: number | null;
    engine: string;
    citedUrl: string | null;
  }[];
  entities: { entity: string; strength: number; related: string[] }[];
  trend: { month: string; score: number; citations: number }[];
}

export interface AioVisibility {
  brand: string;
  answerPresence: number;
  featuredAnswers: number;
  zeroClickRisk: number;
  questions: {
    question: string;
    owned: boolean;
    answerQuality: number;
    competitors: string[];
    suggestedAnswer: string;
  }[];
  schemaCoverage: number;
  freshnessScore: number;
  recommendations: string[];
}

export function compareCompetitors(rawDomains: string[]): CompetitorCompare {
  const domains = (rawDomains.length ? rawDomains : ["ahrefs.com", "semrush.com", "moz.com"])
    .map(normalizeDomain)
    .filter(Boolean)
    .slice(0, 4);
  while (domains.length < 2) domains.push(inventishDomain(mulberry32(1), "x"));
  const rand = mulberry32(hashString(`cmp:${domains.join("|")}`));
  const siteData = domains.map((d) => exploreSite(d));
  const metrics = siteData.map((s) => ({
    domain: s.domain,
    dr: s.dr,
    traffic: s.organicTraffic,
    keywords: s.organicKeywords,
    refDomains: s.refDomains,
    aiVisibility: s.aiVisibility,
  }));
  const overlapMatrix = domains.map((_, i) =>
    domains.map((_, j) => (i === j ? 1 : float(rand, 0.08, 0.72, 2))),
  );
  const gapKeywords = siteData[0]!.contentGap.map((g, i) => ({
    ...g,
    competitorDomain: domains[1 + (i % (domains.length - 1))]!,
  }));
  const keywordBattle = Array.from({ length: 25 }, (_, i) => {
    const keyword = siteData[0]!.topKeywords[i % siteData[0]!.topKeywords.length]?.keyword || `topic ${i}`;
    return {
      keyword,
      volume: int(rand, 100, 80000),
      positions: domains.map(() => (rand() > 0.18 ? int(rand, 1, 95) : null)),
    };
  });

  return {
    domains,
    overlapMatrix,
    sharedKeywords: int(rand, 200, 18000),
    gapKeywords,
    metrics,
    keywordBattle,
  };
}

export function generateContentIdeas(rawDomain: string): ContentIdea[] {
  const domain = normalizeDomain(rawDomain) || "example.com";
  const site = exploreSite(domain);
  const rand = mulberry32(hashString(`content:${domain}`));
  return Array.from({ length: 18 }, (_, i) => {
    const kw = site.topKeywords[i % site.topKeywords.length]!;
    const type = pick(rand, [...CONTENT_TYPES]);
    const fit =
      kw.kd < 25 ? "Easy win" : kw.kd < 55 ? "Stretch" : "Moonshot";
    return {
      title:
        type === "Comparison"
          ? `${titleCase(domain.split(".")[0] || "Brand")} vs ${titleCase((site.competitors[i % site.competitors.length]?.domain || "rival").split(".")[0] || "Rival")}`
          : type === "How-to"
            ? `How to ${kw.keyword}`
            : type === "Listicle"
              ? `${int(rand, 7, 21)} Best ${titleCase(kw.keyword)} in 2026`
              : `${titleCase(kw.keyword)}: The Complete Guide`,
      type,
      keyword: kw.keyword,
      volume: kw.volume,
      kd: kw.kd,
      intent: pick(rand, [...INTENT_TYPES]),
      difficultyFit: fit,
      estimatedTraffic: Math.round(kw.volume * float(rand, 0.05, 0.28)),
      outline: [
        `What is ${kw.keyword}?`,
        "Why it matters in 2026",
        "Step-by-step framework",
        "Examples and templates",
        "Common mistakes",
        "FAQs + AI-ready answers",
      ],
    };
  });
}

export function analyzeAso(appQuery: string): AsoIntel {
  const q = appQuery.trim() || "habit tracker";
  const rand = mulberry32(hashString(`aso:${q}`));
  const appName = titleCase(q.split(" ").slice(0, 3).join(" "));
  return {
    appName,
    publisher: `${titleCase(pick(rand, ["north", "pulse", "orbit", "cedar"]))} Labs`,
    category: pick(rand, [...ASO_CATEGORIES]),
    store: rand() > 0.5 ? "App Store" : "Google Play",
    rating: float(rand, 3.6, 4.9, 1),
    ratingsCount: int(rand, 800, 2_400_000),
    installs: pick(rand, ["50K+", "100K+", "500K+", "1M+", "5M+", "10M+"]),
    keywordCoverage: int(rand, 120, 4200),
    visibilityScore: int(rand, 28, 92),
    listingScore: int(rand, 45, 96),
    topKeywords: Array.from({ length: 20 }, (_, i) => ({
      keyword: i === 0 ? q : `${pick(rand, ["best", "free", "simple", "daily", "ai"])} ${q}`,
      difficulty: int(rand, 5, 95),
      traffic: int(rand, 30, 48000),
      rank: int(rand, 1, 120),
      chance: int(rand, 8, 92),
    })),
    competitors: Array.from({ length: 8 }, () => ({
      name: titleCase(`${pick(rand, ["glow", "rise", "habit", "focus", "streak"])} ${pick(rand, ["app", "go", "ly", "pro"])}`),
      rating: float(rand, 3.8, 4.9, 1),
      ratingsCount: int(rand, 1000, 1_500_000),
      overlap: float(rand, 0.1, 0.8, 2),
      category: pick(rand, [...ASO_CATEGORIES]),
    })),
    creativeInsights: [
      "Icon contrast is below category leaders — test a brighter glyph on dark field.",
      "Subtitle underuses the #1 ranking keyword; move it earlier.",
      "Screenshot stack lacks social proof on frame 1; add rating callout.",
      "Localization gap: ES/DE metadata missing high-volume modifiers.",
      "Description above-the-fold should lead with outcome, not feature list.",
    ],
  };
}

export function analyzeGeo(brandOrDomain: string): GeoVisibility {
  const domain = normalizeDomain(brandOrDomain) || brandOrDomain.trim() || "lumen.dev";
  const brand = titleCase(domain.split(".")[0] || "Brand");
  const rand = mulberry32(hashString(`geo:${domain}`));
  const overallScore = float(rand, 18, 88, 1);
  const engines = AI_ENGINES.map((engine) => ({
    engine,
    score: float(rand, 10, 95, 1),
    citations: int(rand, 0, 420),
    sentiment: pick(rand, ["Positive", "Neutral", "Mixed"] as const),
    sampleAnswer: `${brand} is often mentioned as a ${pick(rand, ["visibility", "SEO", "ASO", "AI search"])} platform that helps teams monitor discovery across search and generative engines.`,
  }));
  const prompts = Array.from({ length: 16 }, (_, i) => {
    const mentioned = rand() > 0.35;
    return {
      prompt: pick(rand, [
        `best ${brand.toLowerCase()} alternatives`,
        `what is the best seo tool for agencies`,
        `how to track ai search citations`,
        `top aso platforms 2026`,
        `tools like ahrefs for startups`,
        `best generative engine optimization software`,
      ]) + (i > 10 ? ` #${i}` : ""),
      mentioned,
      position: mentioned ? int(rand, 1, 6) : null,
      engine: pick(rand, [...AI_ENGINES]),
      citedUrl: mentioned ? `https://${domain}/${pick(rand, ["blog", "docs", "features"])}` : null,
    };
  });
  const months = monthsBack(12);
  let score = overallScore * 0.7;
  let citations = int(rand, 20, 100);
  const trend = months.map((month) => {
    score *= float(rand, 0.97, 1.08);
    citations = Math.round(citations * float(rand, 0.92, 1.15));
    return { month, score: Math.round(score * 10) / 10, citations };
  });

  return {
    brand,
    domain,
    overallScore,
    citationShare: float(rand, 1.5, 28, 1),
    engines,
    prompts,
    entities: [
      { entity: brand, strength: float(rand, 55, 96, 1), related: ["SEO", "ASO", "GEO"] },
      { entity: "Generative Engine Optimization", strength: float(rand, 30, 80, 1), related: ["ChatGPT", "Perplexity"] },
      { entity: "App Store Optimization", strength: float(rand, 20, 75, 1), related: ["App Store", "Play Store"] },
      { entity: "Answer Engine Optimization", strength: float(rand, 15, 70, 1), related: ["FAQ", "schema"] },
    ],
    trend,
  };
}

export function analyzeAio(brandOrDomain: string): AioVisibility {
  const domain = normalizeDomain(brandOrDomain) || brandOrDomain.trim() || "lumen.dev";
  const brand = titleCase(domain.split(".")[0] || "Brand");
  const rand = mulberry32(hashString(`aio:${domain}`));
  const questions = Array.from({ length: 12 }, () => {
    const owned = rand() > 0.4;
    const q = pick(rand, [
      `What is ${brand}?`,
      `How does ${brand} compare to Ahrefs?`,
      `Is ${brand} good for ASO?`,
      `How to improve GEO with ${brand}?`,
      `What does AI optimization mean?`,
      `Best tools for answer engine optimization`,
    ]);
    return {
      question: q,
      owned,
      answerQuality: int(rand, 35, 96),
      competitors: pickN(rand, ["Ahrefs", "Semrush", "Moz", "Surfer", "AlsoAsked"], 2),
      suggestedAnswer: `${brand} is an all-in-one visibility platform covering SEO, ASO, GEO, and AIO so teams can monitor classic search, app stores, and AI answers in one workspace.`,
    };
  });

  return {
    brand,
    answerPresence: float(rand, 12, 82, 1),
    featuredAnswers: int(rand, 2, 48),
    zeroClickRisk: float(rand, 18, 74, 1),
    questions,
    schemaCoverage: float(rand, 20, 95, 1),
    freshnessScore: float(rand, 30, 96, 1),
    recommendations: [
      "Ship FAQPage schema on top 20 commercial URLs.",
      "Rewrite answer leads to ≤25 words for extractability.",
      "Add dated primary-source stats to increase citation trust.",
      "Create entity-consistent About + Product definitions.",
      "Monitor AI Overview presence weekly for money queries.",
    ],
  };
}
