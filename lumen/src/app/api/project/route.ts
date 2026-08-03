import { NextResponse } from "next/server";
import {
  listProjects,
  upsertProject,
  addTrackedKeywords,
  getProject,
} from "@/lib/real/projects";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ projects: await listProjects() });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      url?: string;
      name?: string;
      keywords?: string[];
      projectId?: string;
    };

    if (body.projectId && body.keywords) {
      const updated = await addTrackedKeywords(body.projectId, body.keywords);
      if (!updated) return NextResponse.json({ error: "Project not found" }, { status: 404 });
      return NextResponse.json({ ok: true, project: updated });
    }

    if (!body.url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }
    const project = await upsertProject({
      url: body.url,
      name: body.name,
      trackedKeywords: body.keywords,
    });
    return NextResponse.json({ ok: true, project });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Project save failed" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  const body = (await req.json()) as { id?: string };
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const project = await getProject(body.id);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ project });
}
