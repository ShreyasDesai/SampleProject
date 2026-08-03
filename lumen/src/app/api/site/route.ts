import { NextResponse } from "next/server";
import { crawlSite } from "@/lib/real/crawler";
import { analyzeSinglePage } from "@/lib/real/crawler";
import { upsertProject } from "@/lib/real/projects";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { url?: string; maxPages?: number };
    if (!body.url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }
    const crawl = await crawlSite(body.url, Math.min(body.maxPages || 10, 20));
    const homepage = crawl.pages[0] || (await analyzeSinglePage(body.url));
    const project = await upsertProject({ url: crawl.startUrl, name: crawl.domain });

    return NextResponse.json({
      ok: true,
      project,
      overview: {
        domain: crawl.domain,
        url: crawl.startUrl,
        crawledAt: crawl.crawledAt,
        healthScore: crawl.healthScore,
        pagesCrawled: crawl.pagesCrawled,
        errors: crawl.errors,
        warnings: crawl.warnings,
        notices: crawl.notices,
        httpsPct: crawl.summary.httpsPct,
        pagesWithSchema: crawl.summary.pagesWithSchema,
        pagesWithH1: crawl.summary.pagesWithH1,
        robotsConfigured: Boolean(crawl.robotsTxt),
        sitemapCount: crawl.sitemapUrls.length,
        title: homepage.title,
        metaDescription: homepage.metaDescription,
        h1: homepage.h1,
        topPages: crawl.topInternalPages,
        keywordCandidates: crawl.keywordCandidates,
        outboundDomains: crawl.outboundDomains,
        categoryScores: crawl.categoryScores,
        issues: crawl.issues.slice(0, 30),
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Site explore failed" },
      { status: 500 },
    );
  }
}
