import robotsParser from "robots-parser";
import { analyzeHtml, type AuditIssue, type PageAnalysis } from "./page";
import { absolutize, fetchText, normalizeDomain, normalizeUrl, sameHost } from "./http";

export interface CrawlResult {
  domain: string;
  startUrl: string;
  crawledAt: string;
  pagesCrawled: number;
  healthScore: number;
  errors: number;
  warnings: number;
  notices: number;
  pages: PageAnalysis[];
  issues: AuditIssue[];
  robotsTxt: string | null;
  sitemapUrls: string[];
  categoryScores: { category: string; score: number; issues: number }[];
  topInternalPages: { url: string; score: number; title: string; wordCount: number; status: number }[];
  outboundDomains: { domain: string; links: number }[];
  keywordCandidates: { term: string; count: number }[];
  summary: {
    avgTitleLength: number;
    avgMetaLength: number;
    httpsPct: number;
    pagesWithH1: number;
    pagesWithSchema: number;
  };
}

export async function crawlSite(input: string, maxPages = 15): Promise<CrawlResult> {
  const startUrl = normalizeUrl(input);
  const domain = normalizeDomain(startUrl);
  const origin = new URL(startUrl).origin;

  let robotsTxt: string | null = null;
  let robots = robotsParser(`${origin}/robots.txt`, "");
  try {
    const robotsRes = await fetchText(`${origin}/robots.txt`, { timeoutMs: 8000 });
    if (robotsRes.ok) {
      robotsTxt = robotsRes.body;
      robots = robotsParser(`${origin}/robots.txt`, robotsRes.body);
    }
  } catch {
    /* ignore */
  }

  const sitemapUrls: string[] = [];
  const seedQueue: string[] = [startUrl];
  for (const path of ["/sitemap.xml", "/sitemap_index.xml"]) {
    try {
      const sm = await fetchText(`${origin}${path}`, { timeoutMs: 8000 });
      if (sm.ok && sm.body.includes("<")) {
        const locs = [...sm.body.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => m[1]!);
        for (const loc of locs.slice(0, 40)) {
          sitemapUrls.push(loc);
          if (sameHost(loc, startUrl) && seedQueue.length < maxPages) seedQueue.push(loc);
        }
      }
    } catch {
      /* ignore */
    }
  }

  const visited = new Set<string>();
  const pages: PageAnalysis[] = [];
  const queue = [...new Set(seedQueue)];

  while (queue.length && pages.length < maxPages) {
    const next = queue.shift()!;
    const key = next.replace(/\/$/, "");
    if (visited.has(key)) continue;
    visited.add(key);

    if (robots.isDisallowed(next, "LumenBot")) {
      pages.push({
        ...emptyBlockedPage(next),
        issues: [
          {
            id: "robots-block",
            severity: "warning",
            category: "Crawlability",
            title: "Blocked by robots.txt",
            detail: `${next} is disallowed for LumenBot.`,
            howToFix: "Allow crawling in robots.txt if the page should be indexed.",
            url: next,
          },
        ],
      });
      continue;
    }

    try {
      const res = await fetchText(next, { timeoutMs: 12000 });
      const contentType = res.headers["content-type"] || "";
      if (!contentType.includes("html") && res.body && !res.body.includes("<html") && !res.body.includes("<!DOCTYPE")) {
        continue;
      }
      const page = analyzeHtml(res.body, next, {
        status: res.status,
        finalUrl: res.url,
        elapsedMs: res.elapsedMs,
      });
      pages.push(page);
      for (const link of page.internalLinks) {
        const normalized = link.replace(/\/$/, "");
        if (!visited.has(normalized) && sameHost(link, startUrl) && queue.length + pages.length < maxPages * 3) {
          queue.push(link);
        }
      }
    } catch (err) {
      pages.push({
        ...emptyBlockedPage(next),
        status: 0,
        issues: [
          {
            id: "fetch-fail",
            severity: "error",
            category: "Crawlability",
            title: "Failed to fetch page",
            detail: err instanceof Error ? err.message : "Unknown fetch error",
            howToFix: "Check DNS, SSL, firewall, and that the site is publicly reachable.",
            url: next,
          },
        ],
        score: 0,
      });
    }
  }

  const issues = pages.flatMap((p) => p.issues);
  const errors = issues.filter((i) => i.severity === "error").length;
  const warnings = issues.filter((i) => i.severity === "warning").length;
  const notices = issues.filter((i) => i.severity === "notice").length;
  const healthScore = Math.round(
    pages.length
      ? pages.reduce((a, b) => a + b.score, 0) / pages.length
      : 0,
  );

  const categories = [
    "Crawlability",
    "Indexability",
    "Content",
    "Links",
    "Performance",
    "Security",
    "Structured data",
    "Mobile",
    "Images",
  ];
  const categoryScores = categories.map((category) => {
    const catIssues = issues.filter((i) => i.category === category);
    const penalty = catIssues.reduce(
      (a, b) => a + (b.severity === "error" ? 14 : b.severity === "warning" ? 6 : 2),
      0,
    );
    return {
      category,
      score: Math.max(0, 100 - penalty),
      issues: catIssues.length,
    };
  });

  const outbound = new Map<string, number>();
  for (const page of pages) {
    for (const link of page.externalLinks) {
      try {
        const host = new URL(link).hostname.replace(/^www\./, "");
        outbound.set(host, (outbound.get(host) ?? 0) + 1);
      } catch {
        /* ignore */
      }
    }
  }

  const termCounts = new Map<string, number>();
  for (const page of pages) {
    for (const { term, count } of extractTerms(page.textSample)) {
      termCounts.set(term, (termCounts.get(term) ?? 0) + count);
    }
  }

  return {
    domain,
    startUrl,
    crawledAt: new Date().toISOString(),
    pagesCrawled: pages.length,
    healthScore,
    errors,
    warnings,
    notices,
    pages,
    issues: dedupeIssues(issues).slice(0, 100),
    robotsTxt,
    sitemapUrls: [...new Set(sitemapUrls)].slice(0, 50),
    categoryScores,
    topInternalPages: pages
      .map((p) => ({
        url: p.finalUrl,
        score: p.score,
        title: p.title || "(untitled)",
        wordCount: p.wordCount,
        status: p.status,
      }))
      .sort((a, b) => b.score - a.score),
    outboundDomains: [...outbound.entries()]
      .map(([domain, links]) => ({ domain, links }))
      .sort((a, b) => b.links - a.links)
      .slice(0, 20),
    keywordCandidates: [...termCounts.entries()]
      .map(([term, count]) => ({ term, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 40),
    summary: {
      avgTitleLength: avg(pages.map((p) => p.titleLength)),
      avgMetaLength: avg(pages.map((p) => p.metaLength)),
      httpsPct: pages.length
        ? Math.round((pages.filter((p) => p.hasHttps).length / pages.length) * 100)
        : 0,
      pagesWithH1: pages.filter((p) => p.h1.length > 0).length,
      pagesWithSchema: pages.filter((p) => p.jsonLdTypes.length > 0).length,
    },
  };
}

function emptyBlockedPage(url: string): PageAnalysis {
  return {
    url,
    finalUrl: url,
    status: 0,
    elapsedMs: 0,
    title: "",
    titleLength: 0,
    metaDescription: "",
    metaLength: 0,
    canonical: null,
    robots: null,
    viewport: null,
    lang: null,
    h1: [],
    h2: [],
    wordCount: 0,
    internalLinks: [],
    externalLinks: [],
    images: [],
    imagesMissingAlt: 0,
    hasHttps: url.startsWith("https://"),
    jsonLdTypes: [],
    openGraph: {},
    textSample: "",
    issues: [],
    score: 40,
  };
}

function extractTerms(text: string) {
  const stop = new Set("the a an and or for with from this that your you are was were been have has".split(" "));
  const map = new Map<string, number>();
  for (const t of text.toLowerCase().match(/[a-z][a-z0-9-]{3,}/g) || []) {
    if (stop.has(t)) continue;
    map.set(t, (map.get(t) ?? 0) + 1);
  }
  return [...map.entries()].map(([term, count]) => ({ term, count }));
}

function dedupeIssues(issues: AuditIssue[]): AuditIssue[] {
  const seen = new Set<string>();
  const out: AuditIssue[] = [];
  for (const issue of issues) {
    const key = `${issue.id}|${issue.title}|${issue.url || ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(issue);
  }
  const rank = { error: 0, warning: 1, notice: 2 };
  return out.sort((a, b) => rank[a.severity] - rank[b.severity]);
}

function avg(nums: number[]) {
  if (!nums.length) return 0;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

export async function analyzeSinglePage(input: string): Promise<PageAnalysis> {
  const url = normalizeUrl(input);
  const res = await fetchText(url);
  return analyzeHtml(res.body, url, {
    status: res.status,
    finalUrl: res.url,
    elapsedMs: res.elapsedMs,
  });
}

export { absolutize };
