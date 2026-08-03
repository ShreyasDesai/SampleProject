import { NextResponse } from "next/server";
import { crawlSite } from "@/lib/real/crawler";
import { researchKeyword } from "@/lib/real/keywords";
import { getDataForSeoConfig, fetchSerpLive } from "@/lib/real/dataforseo";
import { listProjects, getProject, addTrackedKeywords } from "@/lib/real/projects";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      projectId?: string;
      domain?: string;
      keywords?: string[];
    };

    let domain = body.domain;
    let keywords = body.keywords || [];
    if (body.projectId) {
      const project = await getProject(body.projectId);
      if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
      domain = project.domain;
      if (!keywords.length) keywords = project.trackedKeywords;
      if (body.keywords?.length) await addTrackedKeywords(project.id, body.keywords);
    }

    if (!domain) {
      return NextResponse.json({ error: "domain or projectId required" }, { status: 400 });
    }
    if (!keywords.length) {
      // bootstrap keywords from site content
      const crawl = await crawlSite(domain, 6);
      keywords = crawl.keywordCandidates.slice(0, 8).map((k) => k.term);
    }

    const cfg = getDataForSeoConfig();
    const rows = [];
    for (const keyword of keywords.slice(0, 10)) {
      let position: number | null = null;
      let serpTitle: string | null = null;
      let url: string | null = null;
      if (cfg) {
        try {
          const serp = await fetchSerpLive(keyword, cfg);
          const hit = serp.find((r) => r.domain.replace(/^www\./, "").includes(domain.replace(/^www\./, "")));
          if (hit) {
            position = hit.position;
            serpTitle = hit.title;
            url = hit.url;
          }
        } catch {
          /* continue */
        }
      }
      const research = await researchKeyword(keyword);
      rows.push({
        keyword,
        position,
        url,
        title: serpTitle,
        suggestCount: research.suggestions.length,
        providers: research.providers,
        volume: research.dataForSeo?.volume ?? null,
        difficulty: research.dataForSeo?.difficulty ?? null,
      });
    }

    return NextResponse.json({
      ok: true,
      domain,
      rows,
      dataForSeo: Boolean(cfg),
      note: cfg
        ? "Live SERP positions via DataForSEO."
        : "Showing keyword coverage signals. Add DataForSEO credentials in Settings for live Google positions.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Rank check failed" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ projects: await listProjects() });
}
