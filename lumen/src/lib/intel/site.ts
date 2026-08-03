import { INTENT_TYPES, KEYWORD_MODIFIERS, SERP_FEATURES, TLDS } from "./lexicon";
import {
  clamp,
  float,
  formatNumber,
  hashString,
  int,
  monthsBack,
  mulberry32,
  normalizeDomain,
  pick,
  pickN,
  titleCase,
} from "./seed";

export interface DomainOverview {
  domain: string;
  dr: number;
  ur: number;
  organicTraffic: number;
  organicKeywords: number;
  trafficValue: number;
  backlinks: number;
  refDomains: number;
  dofollowPct: number;
  govEduLinks: number;
  topCountry: string;
  trafficTrend: { month: string; traffic: number; keywords: number }[];
  positionDist: { label: string; count: number; traffic: number }[];
  topKeywords: KeywordRow[];
  topPages: PageRow[];
  competitors: CompetitorRow[];
  contentGap: GapKeyword[];
  aiVisibility: number;
  brandSearches: number;
}

export interface KeywordRow {
  keyword: string;
  volume: number;
  kd: number;
  cpc: number;
  position: number;
  traffic: number;
  url: string;
  intent: string;
  trend: number[];
  serpFeatures: string[];
}

export interface PageRow {
  url: string;
  traffic: number;
  keywords: number;
  topKeyword: string;
  position: number;
  value: number;
}

export interface CompetitorRow {
  domain: string;
  competition: number;
  commonKeywords: number;
  traffic: number;
  dr: number;
  keywords: number;
}

export interface GapKeyword {
  keyword: string;
  volume: number;
  kd: number;
  you: number | null;
  competitor: number;
  competitorDomain: string;
  intent: string;
}

export interface KeywordOverview {
  keyword: string;
  volume: number;
  kd: number;
  cpc: number;
  trafficPotential: number;
  intent: string;
  globalVolume: number;
  clicks: number;
  parentTopic: string;
  serpFeatures: string[];
  volumeHistory: { month: string; volume: number }[];
  serp: SerpResult[];
  related: RelatedKeyword[];
  questions: RelatedKeyword[];
  alsoRankFor: RelatedKeyword[];
}

export interface SerpResult {
  position: number;
  domain: string;
  url: string;
  title: string;
  traffic: number;
  dr: number;
  backlinks: number;
  type: "organic" | "ai-overview" | "featured" | "paa" | "video";
}

export interface RelatedKeyword {
  keyword: string;
  volume: number;
  kd: number;
  cpc: number;
  intent: string;
  parentTopic?: string;
}

function domainTokens(domain: string): string[] {
  const base = domain.split(".")[0] || domain;
  return base.split(/[-_]/).filter(Boolean);
}

function inventKeyword(rand: () => number, seed: string, i: number): string {
  const tokens = domainTokens(seed);
  const core = tokens[0] || seed.replace(/\..*$/, "");
  const mod = pick(rand, KEYWORD_MODIFIERS);
  const patterns = [
    `${core} ${mod}`,
    `${mod} ${core}`,
    `${core} software`,
    `${core} alternative`,
    `${core} pricing`,
    `how to use ${core}`,
    `${core} vs ${pick(rand, ["notion", "asana", "hubspot", "ahrefs", "semrush", "moz"])}`,
    `${mod} ${core} tool`,
    `${core} for ${pick(rand, ["startups", "agencies", "enterprise", "seo", "marketing"])}`,
    `${core} ${pick(rand, ["template", "checklist", "examples", "guide", "api"])}`,
  ];
  return patterns[i % patterns.length]!;
}

function inventCompetitor(rand: () => number, seed: string): string {
  const base = (seed.split(".")[0] || "brand").slice(0, 6);
  const suffix = pick(rand, ["ly", "ify", "hq", "labs", "flow", "kit", "wise", "stack"]);
  const tld = pick(rand, [...TLDS]);
  const options = [
    `${base}${suffix}${tld}`,
    `${pick(rand, ["get", "try", "use", "my"])}${base}${tld}`,
    `${base}${int(rand, 1, 99)}${tld}`,
    `${pick(rand, ["rank", "grow", "pulse", "signal", "orbit", "metric"])}${suffix}${tld}`,
  ];
  return pick(rand, options);
}

export function exploreSite(rawDomain: string): DomainOverview {
  const domain = normalizeDomain(rawDomain) || "example.com";
  const rand = mulberry32(hashString(`site:${domain}`));
  const dr = int(rand, 12, 92);
  const ur = clamp(dr + int(rand, -18, 8), 5, 95);
  const organicKeywords = int(rand, 800, 185000);
  const organicTraffic = int(rand, Math.max(500, organicKeywords * 0.4), organicKeywords * 4.5);
  const trafficValue = Math.round(organicTraffic * float(rand, 0.35, 2.8));
  const refDomains = int(rand, 120, 28000);
  const backlinks = Math.round(refDomains * float(rand, 4.2, 38));
  const months = monthsBack(12);
  let trafficCursor = organicTraffic * float(rand, 0.55, 0.85);
  let kwCursor = organicKeywords * float(rand, 0.6, 0.9);
  const trafficTrend = months.map((month) => {
    trafficCursor *= float(rand, 0.96, 1.08);
    kwCursor *= float(rand, 0.97, 1.06);
    return {
      month,
      traffic: Math.round(trafficCursor),
      keywords: Math.round(kwCursor),
    };
  });
  trafficTrend[trafficTrend.length - 1]!.traffic = organicTraffic;
  trafficTrend[trafficTrend.length - 1]!.keywords = organicKeywords;

  const positionDist = [
    { label: "1–3", count: Math.round(organicKeywords * float(rand, 0.04, 0.12)), traffic: 0 },
    { label: "4–10", count: Math.round(organicKeywords * float(rand, 0.08, 0.18)), traffic: 0 },
    { label: "11–20", count: Math.round(organicKeywords * float(rand, 0.12, 0.22)), traffic: 0 },
    { label: "21–50", count: Math.round(organicKeywords * float(rand, 0.2, 0.32)), traffic: 0 },
    { label: "51–100", count: 0, traffic: 0 },
  ];
  positionDist[4]!.count = Math.max(
    0,
    organicKeywords - positionDist.slice(0, 4).reduce((a, b) => a + b.count, 0),
  );
  const weights = [0.55, 0.25, 0.12, 0.06, 0.02];
  positionDist.forEach((row, i) => {
    row.traffic = Math.round(organicTraffic * weights[i]!);
  });

  const topKeywords: KeywordRow[] = Array.from({ length: 40 }, (_, i) => {
    const keyword = inventKeyword(rand, domain, i);
    const volume = int(rand, 70, 120000);
    const position = clamp(Math.round(1 + i * 0.7 + rand() * 8), 1, 92);
    const traffic = Math.round(volume * (1 / Math.sqrt(position)) * float(rand, 0.08, 0.35));
    return {
      keyword,
      volume,
      kd: int(rand, 0, 95),
      cpc: float(rand, 0.1, 28, 2),
      position,
      traffic,
      url: `https://${domain}/${keyword.split(" ").slice(0, 3).join("-")}`,
      intent: pick(rand, [...INTENT_TYPES]),
      trend: Array.from({ length: 12 }, () => int(rand, 20, 100)),
      serpFeatures: pickN(rand, [...SERP_FEATURES], int(rand, 0, 4)),
    };
  }).sort((a, b) => b.traffic - a.traffic);

  const topPages: PageRow[] = Array.from({ length: 20 }, (_, i) => {
    const topKeyword = topKeywords[i % topKeywords.length]!;
    const path = i === 0 ? "" : `/${topKeyword.keyword.split(" ").slice(0, 3).join("-")}`;
    return {
      url: `https://${domain}${path}`,
      traffic: Math.round(topKeyword.traffic * float(rand, 1.1, 4.5)),
      keywords: int(rand, 5, 2400),
      topKeyword: topKeyword.keyword,
      position: topKeyword.position,
      value: Math.round(topKeyword.traffic * float(rand, 0.4, 3.2) * topKeyword.cpc),
    };
  }).sort((a, b) => b.traffic - a.traffic);

  const competitors: CompetitorRow[] = Array.from({ length: 12 }, () => {
    const cDomain = inventCompetitor(rand, domain);
    return {
      domain: cDomain,
      competition: float(rand, 0.12, 0.94, 2),
      commonKeywords: int(rand, 40, Math.min(12000, organicKeywords)),
      traffic: int(rand, 800, organicTraffic * 1.8),
      dr: int(rand, 15, 94),
      keywords: int(rand, 500, 160000),
    };
  }).sort((a, b) => b.competition - a.competition);

  const contentGap: GapKeyword[] = Array.from({ length: 25 }, (_, i) => {
    const competitor = competitors[i % competitors.length]!;
    return {
      keyword: inventKeyword(rand, competitor.domain, i + 17),
      volume: int(rand, 90, 48000),
      kd: int(rand, 5, 85),
      you: rand() > 0.72 ? int(rand, 18, 95) : null,
      competitor: int(rand, 1, 15),
      competitorDomain: competitor.domain,
      intent: pick(rand, [...INTENT_TYPES]),
    };
  }).sort((a, b) => b.volume - a.volume);

  return {
    domain,
    dr,
    ur,
    organicTraffic,
    organicKeywords,
    trafficValue,
    backlinks,
    refDomains,
    dofollowPct: float(rand, 42, 88, 1),
    govEduLinks: int(rand, 0, 180),
    topCountry: pick(rand, ["United States", "United Kingdom", "India", "Germany", "Canada"]),
    trafficTrend,
    positionDist,
    topKeywords,
    topPages,
    competitors,
    contentGap,
    aiVisibility: float(rand, 4, 78, 1),
    brandSearches: int(rand, 200, 90000),
  };
}

export function exploreKeyword(rawKeyword: string): KeywordOverview {
  const keyword = rawKeyword.trim().toLowerCase() || "seo tools";
  const rand = mulberry32(hashString(`kw:${keyword}`));
  const volume = int(rand, 110, 450000);
  const kd = int(rand, 0, 98);
  const cpc = float(rand, 0.05, 42, 2);
  const parentTopic = keyword.split(" ").slice(0, 2).join(" ") || keyword;
  const months = monthsBack(24);
  let vol = volume * float(rand, 0.7, 1.15);
  const volumeHistory = months.map((month) => {
    vol *= float(rand, 0.94, 1.07);
    return { month, volume: Math.round(vol) };
  });
  volumeHistory[volumeHistory.length - 1]!.volume = volume;

  const serp: SerpResult[] = [];
  if (rand() > 0.35) {
    serp.push({
      position: 0,
      domain: "ai.google",
      url: "https://www.google.com/ai-overview",
      title: `AI Overview — ${titleCase(keyword)}`,
      traffic: Math.round(volume * 0.18),
      dr: 98,
      backlinks: 0,
      type: "ai-overview",
    });
  }
  if (rand() > 0.45) {
    serp.push({
      position: 0,
      domain: inventCompetitor(rand, keyword.replace(/\s+/g, "")),
      url: `https://example.com/${keyword.replace(/\s+/g, "-")}`,
      title: `${titleCase(keyword)}: Complete Guide (2026)`,
      traffic: Math.round(volume * 0.12),
      dr: int(rand, 40, 90),
      backlinks: int(rand, 20, 4000),
      type: "featured",
    });
  }
  for (let i = 1; i <= 10; i++) {
    const domain = inventCompetitor(rand, `${keyword}${i}`);
    serp.push({
      position: i,
      domain,
      url: `https://${domain}/${keyword.split(" ").join("-")}`,
      title: `${titleCase(keyword)} | ${titleCase(domain.split(".")[0] || "Brand")}`,
      traffic: Math.round(volume * (0.22 / i) * float(rand, 0.7, 1.2)),
      dr: int(rand, 18, 95),
      backlinks: int(rand, 5, 12000),
      type: i === 7 && rand() > 0.6 ? "video" : "organic",
    });
  }

  const related = (count: number, prefix?: string): RelatedKeyword[] =>
    Array.from({ length: count }, (_, i) => {
      const mod = pick(rand, KEYWORD_MODIFIERS);
      const kw = prefix
        ? `${prefix} ${keyword}`
        : i % 3 === 0
          ? `${keyword} ${mod}`
          : `${mod} ${keyword}`;
      return {
        keyword: kw,
        volume: int(rand, 20, volume),
        kd: int(rand, 0, 90),
        cpc: float(rand, 0.05, cpc * 1.4, 2),
        intent: pick(rand, [...INTENT_TYPES]),
        parentTopic,
      };
    }).sort((a, b) => b.volume - a.volume);

  return {
    keyword,
    volume,
    kd,
    cpc,
    trafficPotential: Math.round(volume * float(rand, 0.18, 0.42)),
    intent: pick(rand, [...INTENT_TYPES]),
    globalVolume: Math.round(volume * float(rand, 1.4, 4.8)),
    clicks: Math.round(volume * float(rand, 0.45, 0.85)),
    parentTopic,
    serpFeatures: pickN(rand, [...SERP_FEATURES], int(rand, 2, 6)),
    volumeHistory,
    serp,
    related: related(30),
    questions: related(15, pick(rand, ["what is", "how to", "why", "best way to", "does"])),
    alsoRankFor: related(20),
  };
}

export function summarizeDomainLine(domain: string) {
  const d = exploreSite(domain);
  return {
    domain: d.domain,
    dr: d.dr,
    traffic: formatNumber(d.organicTraffic),
    keywords: formatNumber(d.organicKeywords),
    value: d.trafficValue,
  };
}
