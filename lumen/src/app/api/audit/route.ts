import { NextResponse } from "next/server";
import { crawlSite } from "@/lib/real/crawler";
import { upsertProject, touchAudit, listProjects } from "@/lib/real/projects";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { url?: string; maxPages?: number; saveProject?: boolean };
    if (!body.url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }
    const result = await crawlSite(body.url, Math.min(body.maxPages || 12, 25));
    let project = null;
    if (body.saveProject !== false) {
      project = await upsertProject({ url: result.startUrl, name: result.domain });
      await touchAudit(project.id);
    }
    return NextResponse.json({ ok: true, result, project });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Audit failed" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const projects = await listProjects();
  return NextResponse.json({ projects });
}
