import { AUDIT_CATEGORIES, REFERRING_TYPES } from "./lexicon";
import {
  clamp,
  float,
  hashString,
  int,
  monthsBack,
  mulberry32,
  normalizeDomain,
  pick,
  pickN,
} from "./seed";
import { inventishDomain } from "./helpers";

export interface BacklinkRow {
  sourceUrl: string;
  sourceDomain: string;
  targetUrl: string;
  anchor: string;
  dr: number;
  ur: number;
  domainTraffic: number;
  type: string;
  dofollow: boolean;
  firstSeen: string;
  isLost: boolean;
}

export interface BacklinkProfile {
  domain: string;
  backlinks: number;
  refDomains: number;
  dofollowPct: number;
  nofollowPct: number;
  ugcPct: number;
  sponsoredPct: number;
  newLast30: number;
  lostLast30: number;
  drDistribution: { bucket: string; count: number }[];
  anchors: { anchor: string; backlinks: number; refDomains: number; pct: number }[];
  topLinks: BacklinkRow[];
  linkHistory: { month: string; refDomains: number; newLinks: number; lostLinks: number }[];
}

export interface AuditIssue {
  id: string;
  category: string;
  severity: "error" | "warning" | "notice";
  title: string;
  affected: number;
  description: string;
  howToFix: string;
}

export interface SiteAuditResult {
  domain: string;
  healthScore: number;
  pagesCrawled: number;
  errors: number;
  warnings: number;
  notices: number;
  issues: AuditIssue[];
  categoryScores: { category: string; score: number; issues: number }[];
  crawlTrend: { day: string; health: number }[];
}

export interface RankTrackedKeyword {
  keyword: string;
  location: string;
  device: "Desktop" | "Mobile";
  position: number;
  prevPosition: number;
  bestPosition: number;
  volume: number;
  url: string;
  serpFeatures: string[];
  history: { day: string; position: number }[];
  tags: string[];
}

export interface RankTrackerProject {
  domain: string;
  avgPosition: number;
  visibility: number;
  shareOfVoice: number;
  improved: number;
  declined: number;
  keywords: RankTrackedKeyword[];
  visibilityHistory: { day: string; visibility: number; avgPosition: number }[];
}

const AUDIT_DEFS: Omit<AuditIssue, "affected">[] = [
  { id: "4xx", category: "Crawlability", severity: "error", title: "4XX pages", description: "Broken pages waste crawl budget and leak equity.", howToFix: "Redirect or restore broken URLs; update internal links." },
  { id: "5xx", category: "Crawlability", severity: "error", title: "5XX server errors", description: "Server failures block indexing and rankings.", howToFix: "Fix server/config issues and monitor uptime." },
  { id: "orphan", category: "Crawlability", severity: "warning", title: "Orphan pages", description: "Pages with no internal links are hard to discover.", howToFix: "Add contextual internal links from relevant hubs." },
  { id: "canonical", category: "Indexability", severity: "error", title: "Canonical points to redirect", description: "Broken canonical chains confuse index selection.", howToFix: "Point canonicals to the final 200 OK URL." },
  { id: "noindex", category: "Indexability", severity: "warning", title: "Important pages noindexed", description: "Revenue or ranking pages may be excluded from the index.", howToFix: "Remove noindex on pages that should rank." },
  { id: "duplicate-title", category: "Content", severity: "warning", title: "Duplicate title tags", description: "Duplicate titles weaken relevance signals.", howToFix: "Make each title unique and intent-aligned." },
  { id: "thin", category: "Content", severity: "warning", title: "Thin content pages", description: "Low-value pages struggle to rank and dilute quality.", howToFix: "Expand, consolidate, or noindex thin URLs." },
  { id: "missing-h1", category: "Content", severity: "notice", title: "Missing H1", description: "Pages without H1 miss a clear topical signal.", howToFix: "Add one descriptive H1 per page." },
  { id: "broken-out", category: "Links", severity: "error", title: "Broken outbound links", description: "Dead outbound links hurt UX and trust.", howToFix: "Update or remove broken destinations." },
  { id: "nofollow-internal", category: "Links", severity: "notice", title: "Nofollow internal links", description: "Internal nofollow can waste equity flow.", howToFix: "Allowfollow important internal paths." },
  { id: "lcp", category: "Performance", severity: "warning", title: "Slow LCP URLs", description: "Poor LCP correlates with lower engagement and rankings.", howToFix: "Optimize hero media, server TTFB, and critical CSS." },
  { id: "cls", category: "Performance", severity: "notice", title: "High CLS", description: "Layout shift harms Core Web Vitals.", howToFix: "Reserve media space and avoid late-injected UI." },
  { id: "hreflang", category: "International", severity: "warning", title: "Hreflang errors", description: "Incorrect hreflang causes wrong locale indexing.", howToFix: "Validate reciprocal hreflang annotations." },
  { id: "https", category: "Security", severity: "error", title: "HTTP to HTTPS issues", description: "Mixed content or insecure pages reduce trust.", howToFix: "Force HTTPS and fix mixed assets." },
  { id: "schema", category: "Structured data", severity: "notice", title: "Invalid structured data", description: "Broken schema loses rich result eligibility.", howToFix: "Validate JSON-LD against Google requirements." },
  { id: "viewport", category: "Mobile", severity: "warning", title: "Viewport not configured", description: "Mobile usability issues affect mobile rankings.", howToFix: "Add a correct responsive viewport meta tag." },
  { id: "alt", category: "Images", severity: "notice", title: "Missing image alt text", description: "Accessibility and image search suffer.", howToFix: "Add descriptive alt attributes." },
  { id: "heavy-img", category: "Images", severity: "warning", title: "Unoptimized images", description: "Large images slow pages and burn LCP.", howToFix: "Compress, lazy-load, and serve modern formats." },
];

export function analyzeBacklinks(rawDomain: string): BacklinkProfile {
  const domain = normalizeDomain(rawDomain) || "example.com";
  const rand = mulberry32(hashString(`bl:${domain}`));
  const refDomains = int(rand, 180, 42000);
  const backlinks = Math.round(refDomains * float(rand, 3.5, 45));
  const dofollowPct = float(rand, 48, 86, 1);
  const months = monthsBack(12);
  let refs = refDomains * float(rand, 0.55, 0.8);
  const linkHistory = months.map((month) => {
    const newLinks = int(rand, 20, 900);
    const lostLinks = int(rand, 10, 700);
    refs = clamp(refs + newLinks - lostLinks, refDomains * 0.4, refDomains * 1.2);
    return { month, refDomains: Math.round(refs), newLinks, lostLinks };
  });

  const anchors = Array.from({ length: 15 }, (_, i) => {
    const anchor =
      i === 0
        ? domain
        : i < 4
          ? pick(rand, ["click here", "homepage", "website", "official site", "learn more"])
          : pick(rand, [
              "seo tool",
              "best software",
              "marketing platform",
              "read more",
              domain.split(".")[0] || "brand",
              "this guide",
              "pricing",
            ]);
    const bl = int(rand, 5, Math.max(20, backlinks / 8));
    return {
      anchor,
      backlinks: bl,
      refDomains: int(rand, 1, Math.max(2, bl)),
      pct: 0,
    };
  });
  const anchorTotal = anchors.reduce((a, b) => a + b.backlinks, 0) || 1;
  anchors.forEach((a) => {
    a.pct = Math.round((a.backlinks / anchorTotal) * 1000) / 10;
  });

  const topLinks: BacklinkRow[] = Array.from({ length: 40 }, (_, i) => {
    const sourceDomain = inventishDomain(rand, `src${i}`);
    return {
      sourceUrl: `https://${sourceDomain}/blog/${pick(rand, ["seo", "growth", "tools", "reviews"])}-${i}`,
      sourceDomain,
      targetUrl: `https://${domain}/${pick(rand, ["", "pricing", "blog", "features", "docs"])}`,
      anchor: anchors[i % anchors.length]!.anchor,
      dr: int(rand, 5, 95),
      ur: int(rand, 5, 90),
      domainTraffic: int(rand, 50, 2_500_000),
      type: pick(rand, [...REFERRING_TYPES]),
      dofollow: rand() < dofollowPct / 100,
      firstSeen: `202${int(rand, 3, 6)}-${String(int(rand, 1, 12)).padStart(2, "0")}-${String(int(rand, 1, 28)).padStart(2, "0")}`,
      isLost: rand() > 0.88,
    };
  }).sort((a, b) => b.dr - a.dr);

  return {
    domain,
    backlinks,
    refDomains,
    dofollowPct,
    nofollowPct: float(rand, 10, 40, 1),
    ugcPct: float(rand, 1, 12, 1),
    sponsoredPct: float(rand, 0.2, 6, 1),
    newLast30: int(rand, 40, 1800),
    lostLast30: int(rand, 20, 1200),
    drDistribution: [
      { bucket: "0–10", count: int(rand, 20, 400) },
      { bucket: "11–20", count: int(rand, 30, 500) },
      { bucket: "21–30", count: int(rand, 40, 600) },
      { bucket: "31–40", count: int(rand, 50, 700) },
      { bucket: "41–50", count: int(rand, 40, 500) },
      { bucket: "51–60", count: int(rand, 20, 300) },
      { bucket: "61–70", count: int(rand, 10, 180) },
      { bucket: "71–100", count: int(rand, 5, 90) },
    ],
    anchors: anchors.sort((a, b) => b.backlinks - a.backlinks),
    topLinks,
    linkHistory,
  };
}

export function runSiteAudit(rawDomain: string): SiteAuditResult {
  const domain = normalizeDomain(rawDomain) || "example.com";
  const rand = mulberry32(hashString(`audit:${domain}`));
  const pagesCrawled = int(rand, 250, 28000);
  const issues: AuditIssue[] = AUDIT_DEFS.map((def) => ({
    ...def,
    affected: def.severity === "error" ? int(rand, 1, 180) : def.severity === "warning" ? int(rand, 5, 900) : int(rand, 10, 2500),
  }));
  // randomly drop a few "clean" checks
  const kept = issues.filter(() => rand() > 0.18);
  const errors = kept.filter((i) => i.severity === "error").reduce((a, b) => a + b.affected, 0);
  const warnings = kept.filter((i) => i.severity === "warning").reduce((a, b) => a + b.affected, 0);
  const notices = kept.filter((i) => i.severity === "notice").reduce((a, b) => a + b.affected, 0);
  const healthScore = clamp(
    100 - errors * 0.08 - warnings * 0.015 - notices * 0.004 + int(rand, -3, 4),
    18,
    98,
  );
  const categoryScores = AUDIT_CATEGORIES.map((category) => {
    const catIssues = kept.filter((i) => i.category === category);
    const penalty = catIssues.reduce(
      (a, b) => a + (b.severity === "error" ? 12 : b.severity === "warning" ? 5 : 2),
      0,
    );
    return {
      category,
      score: clamp(100 - penalty + int(rand, -5, 5), 20, 100),
      issues: catIssues.length,
    };
  });

  return {
    domain,
    healthScore: Math.round(healthScore),
    pagesCrawled,
    errors,
    warnings,
    notices,
    issues: kept.sort((a, b) => {
      const rank = { error: 0, warning: 1, notice: 2 };
      return rank[a.severity] - rank[b.severity] || b.affected - a.affected;
    }),
    categoryScores,
    crawlTrend: Array.from({ length: 14 }, (_, i) => ({
      day: `D-${13 - i}`,
      health: clamp(healthScore + int(rand, -8, 6), 20, 99),
    })),
  };
}

export function buildRankTracker(rawDomain: string): RankTrackerProject {
  const domain = normalizeDomain(rawDomain) || "example.com";
  const rand = mulberry32(hashString(`rank:${domain}`));
  const keywords: RankTrackedKeyword[] = Array.from({ length: 35 }, (_, i) => {
    const position = int(rand, 1, 80);
    const prevPosition = clamp(position + int(rand, -12, 12), 1, 100);
    const history = Array.from({ length: 30 }, (_, d) => ({
      day: `Day ${d + 1}`,
      position: clamp(position + int(rand, -6, 6), 1, 100),
    }));
    const kw = pick(rand, [
      `${domain.split(".")[0]} software`,
      `${domain.split(".")[0]} pricing`,
      `best ${domain.split(".")[0]} alternative`,
      `${domain.split(".")[0]} review`,
      `how to use ${domain.split(".")[0]}`,
      `${pick(rand, ["seo", "aso", "content", "keyword", "backlink"])} ${pick(rand, ["tool", "checker", "analyzer", "platform"])}`,
      `${pick(rand, ["ai", "local", "enterprise", "free"])} seo tools`,
    ]) + (i > 20 ? ` ${i}` : "");
    return {
      keyword: kw.replace(/\s+\d+$/, (m) => m),
      location: pick(rand, ["United States", "United Kingdom", "Canada", "Germany"]),
      device: rand() > 0.35 ? "Desktop" : "Mobile",
      position,
      prevPosition,
      bestPosition: Math.min(position, prevPosition, int(rand, 1, position)),
      volume: int(rand, 50, 90000),
      url: `https://${domain}/${kw.split(" ").slice(0, 3).join("-")}`,
      serpFeatures: pickN(rand, ["AI Overview", "PAA", "Sitelinks", "Video", "Featured snippet"], int(rand, 0, 3)),
      history,
      tags: pickN(rand, ["Brand", "Competitor", "Money", "Informational", "Expansion"], int(rand, 1, 2)),
    };
  });

  const improved = keywords.filter((k) => k.position < k.prevPosition).length;
  const declined = keywords.filter((k) => k.position > k.prevPosition).length;
  const avgPosition =
    Math.round((keywords.reduce((a, b) => a + b.position, 0) / keywords.length) * 10) / 10;
  const visibility = float(rand, 8, 72, 1);

  return {
    domain,
    avgPosition,
    visibility,
    shareOfVoice: float(rand, 3, 41, 1),
    improved,
    declined,
    keywords: keywords.sort((a, b) => a.position - b.position),
    visibilityHistory: Array.from({ length: 30 }, (_, i) => ({
      day: `D${i + 1}`,
      visibility: float(rand, visibility - 8, visibility + 8, 1),
      avgPosition: float(rand, avgPosition - 4, avgPosition + 4, 1),
    })),
  };
}
