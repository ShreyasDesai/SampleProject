import * as cheerio from "cheerio";
import { absolutize, sameHost } from "./http";

export interface PageAnalysis {
  url: string;
  finalUrl: string;
  status: number;
  elapsedMs: number;
  title: string;
  titleLength: number;
  metaDescription: string;
  metaLength: number;
  canonical: string | null;
  robots: string | null;
  viewport: string | null;
  lang: string | null;
  h1: string[];
  h2: string[];
  wordCount: number;
  internalLinks: string[];
  externalLinks: string[];
  images: { src: string; alt: string | null }[];
  imagesMissingAlt: number;
  hasHttps: boolean;
  jsonLdTypes: string[];
  openGraph: Record<string, string>;
  textSample: string;
  issues: AuditIssue[];
  score: number;
}

export interface AuditIssue {
  id: string;
  severity: "error" | "warning" | "notice";
  category: string;
  title: string;
  detail: string;
  howToFix: string;
  url?: string;
}

function words(text: string): number {
  return text
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter((w) => w.length > 1).length;
}

export function analyzeHtml(
  html: string,
  requestUrl: string,
  meta: { status: number; finalUrl: string; elapsedMs: number },
): PageAnalysis {
  const $ = cheerio.load(html);
  $("script, style, noscript, svg").remove();

  const title = $("title").first().text().replace(/\s+/g, " ").trim();
  const metaDescription =
    $('meta[name="description"]').attr("content")?.replace(/\s+/g, " ").trim() ||
    $('meta[property="og:description"]').attr("content")?.replace(/\s+/g, " ").trim() ||
    "";
  const canonical =
    $('link[rel="canonical"]').attr("href") ||
    $('meta[property="og:url"]').attr("content") ||
    null;
  const robots = $('meta[name="robots"]').attr("content") || null;
  const viewport = $('meta[name="viewport"]').attr("content") || null;
  const lang = $("html").attr("lang") || null;
  const h1 = $("h1")
    .map((_, el) => $(el).text().replace(/\s+/g, " ").trim())
    .get()
    .filter(Boolean);
  const h2 = $("h2")
    .map((_, el) => $(el).text().replace(/\s+/g, " ").trim())
    .get()
    .filter(Boolean)
    .slice(0, 30);

  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = words(bodyText);

  const internalLinks = new Set<string>();
  const externalLinks = new Set<string>();
  $("a[href]").each((_, el) => {
    const abs = absolutize(meta.finalUrl || requestUrl, $(el).attr("href") || "");
    if (!abs) return;
    if (sameHost(abs, requestUrl)) internalLinks.add(abs.split("#")[0]!);
    else externalLinks.add(abs.split("#")[0]!);
  });

  const images = $("img")
    .map((_, el) => ({
      src: absolutize(meta.finalUrl || requestUrl, $(el).attr("src") || "") || $(el).attr("src") || "",
      alt: $(el).attr("alt") ?? null,
    }))
    .get()
    .filter((img) => img.src);
  const imagesMissingAlt = images.filter((img) => img.alt === null || img.alt.trim() === "").length;

  const jsonLdTypes: string[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const raw = $(el).text();
      const parsed = JSON.parse(raw);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of items) {
        if (item?.["@type"]) {
          const t = item["@type"];
          jsonLdTypes.push(Array.isArray(t) ? t.join(",") : String(t));
        }
      }
    } catch {
      jsonLdTypes.push("invalid-json-ld");
    }
  });

  const openGraph: Record<string, string> = {};
  $('meta[property^="og:"]').each((_, el) => {
    const prop = $(el).attr("property");
    const content = $(el).attr("content");
    if (prop && content) openGraph[prop] = content;
  });

  const hasHttps = (meta.finalUrl || requestUrl).startsWith("https://");
  const issues = buildIssues({
    url: meta.finalUrl || requestUrl,
    status: meta.status,
    title,
    metaDescription,
    h1,
    wordCount,
    imagesMissingAlt,
    imageCount: images.length,
    viewport,
    canonical,
    robots,
    hasHttps,
    jsonLdTypes,
    elapsedMs: meta.elapsedMs,
  });

  const score = scorePage(issues);

  return {
    url: requestUrl,
    finalUrl: meta.finalUrl || requestUrl,
    status: meta.status,
    elapsedMs: meta.elapsedMs,
    title,
    titleLength: title.length,
    metaDescription,
    metaLength: metaDescription.length,
    canonical,
    robots,
    viewport,
    lang,
    h1,
    h2,
    wordCount,
    internalLinks: [...internalLinks].slice(0, 200),
    externalLinks: [...externalLinks].slice(0, 100),
    images: images.slice(0, 100),
    imagesMissingAlt,
    hasHttps,
    jsonLdTypes,
    openGraph,
    textSample: bodyText.slice(0, 1200),
    issues,
    score,
  };
}

function buildIssues(p: {
  url: string;
  status: number;
  title: string;
  metaDescription: string;
  h1: string[];
  wordCount: number;
  imagesMissingAlt: number;
  imageCount: number;
  viewport: string | null;
  canonical: string | null;
  robots: string | null;
  hasHttps: boolean;
  jsonLdTypes: string[];
  elapsedMs: number;
}): AuditIssue[] {
  const issues: AuditIssue[] = [];
  const add = (
    id: string,
    severity: AuditIssue["severity"],
    category: string,
    title: string,
    detail: string,
    howToFix: string,
  ) => issues.push({ id, severity, category, title, detail, howToFix, url: p.url });

  if (p.status >= 400) {
    add("status", "error", "Crawlability", `${p.status} response`, `Page returned HTTP ${p.status}.`, "Restore the URL or fix server errors / redirects.");
  }
  if (!p.hasHttps) {
    add("https", "error", "Security", "Not served over HTTPS", "Insecure HTTP reduces trust and can hurt rankings.", "Force HTTPS and redirect all HTTP traffic.");
  }
  if (!p.title) {
    add("title-missing", "error", "Content", "Missing title tag", "Search engines need a unique title.", "Add a 30–60 character title with the primary keyword.");
  } else if (p.title.length < 30 || p.title.length > 65) {
    add("title-length", "warning", "Content", "Title length outside ideal range", `Title is ${p.title.length} characters.`, "Aim for roughly 30–60 characters.");
  }
  if (!p.metaDescription) {
    add("meta-missing", "warning", "Content", "Missing meta description", "Engines may invent a weak snippet.", "Write a compelling 120–160 character description.");
  } else if (p.metaDescription.length < 70 || p.metaDescription.length > 170) {
    add("meta-length", "notice", "Content", "Meta description length suboptimal", `Meta is ${p.metaDescription.length} characters.`, "Target about 120–160 characters.");
  }
  if (p.h1.length === 0) {
    add("h1-missing", "warning", "Content", "Missing H1", "No primary heading found.", "Add one clear H1 that describes the page topic.");
  } else if (p.h1.length > 1) {
    add("h1-multiple", "notice", "Content", "Multiple H1 tags", `Found ${p.h1.length} H1 elements.`, "Prefer a single H1 per page.");
  }
  if (p.wordCount < 200) {
    add("thin", "warning", "Content", "Thin content", `Only ~${p.wordCount} words of visible text.`, "Expand with useful, unique content for the query intent.");
  }
  if (p.imagesMissingAlt > 0) {
    add("alt", "notice", "Images", "Images missing alt text", `${p.imagesMissingAlt}/${p.imageCount} images lack alt attributes.`, "Add descriptive alt text for accessibility and image SEO.");
  }
  if (!p.viewport) {
    add("viewport", "warning", "Mobile", "Missing viewport meta", "Mobile rendering may be broken.", "Add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">.");
  }
  if (!p.canonical) {
    add("canonical", "notice", "Indexability", "No canonical tag", "Duplicate URL variants may compete.", "Add a self-referencing canonical to the preferred URL.");
  }
  if (p.robots && /noindex/i.test(p.robots)) {
    add("noindex", "error", "Indexability", "Page is noindexed", `robots meta: ${p.robots}`, "Remove noindex if this page should rank.");
  }
  if (p.jsonLdTypes.includes("invalid-json-ld")) {
    add("schema", "warning", "Structured data", "Invalid JSON-LD", "Structured data failed to parse.", "Validate JSON-LD with Google’s rich results test.");
  } else if (p.jsonLdTypes.length === 0) {
    add("schema-missing", "notice", "Structured data", "No structured data detected", "Schema can unlock rich results and AI extractability.", "Add relevant schema.org JSON-LD (Organization, Article, FAQ, etc.).");
  }
  if (p.elapsedMs > 3000) {
    add("ttfb", "warning", "Performance", "Slow server response", `Fetched in ${p.elapsedMs}ms.`, "Improve TTFB with caching, CDN, and faster hosting.");
  }
  return issues;
}

function scorePage(issues: AuditIssue[]): number {
  let score = 100;
  for (const issue of issues) {
    if (issue.severity === "error") score -= 12;
    else if (issue.severity === "warning") score -= 5;
    else score -= 2;
  }
  return Math.max(0, Math.min(100, score));
}

export function extractKeywordsFromText(text: string, limit = 25): { term: string; count: number }[] {
  const stop = new Set(
    "the a an and or but if in on at to for of as is are was were be been being with from by this that these those it its you your we our they their not no yes can could should would will just about into over under again more most other some such than too very also how what when where which who why".split(
      " ",
    ),
  );
  const counts = new Map<string, number>();
  for (const raw of text.toLowerCase().match(/[a-z0-9][a-z0-9'-]{2,}/g) || []) {
    if (stop.has(raw)) continue;
    counts.set(raw, (counts.get(raw) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([term, count]) => ({ term, count }));
}
