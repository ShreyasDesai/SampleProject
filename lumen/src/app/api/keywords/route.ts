import { NextResponse } from "next/server";
import { researchKeyword } from "@/lib/real/keywords";
import { getDataForSeoConfig, fetchSerpLive } from "@/lib/real/dataforseo";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { keyword?: string; includeSerp?: boolean };
    if (!body.keyword) {
      return NextResponse.json({ error: "keyword is required" }, { status: 400 });
    }
    const research = await researchKeyword(body.keyword);
    let serp: Awaited<ReturnType<typeof fetchSerpLive>> | null = null;
    const cfg = getDataForSeoConfig();
    if (body.includeSerp && cfg) {
      try {
        serp = await fetchSerpLive(body.keyword, cfg);
      } catch (err) {
        research.notes.push(
          err instanceof Error ? `SERP: ${err.message}` : "SERP lookup failed",
        );
      }
    } else if (body.includeSerp) {
      research.notes.push("Configure DataForSEO credentials to pull live Google SERPs.");
    }
    return NextResponse.json({ ok: true, research, serp });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Keyword research failed" },
      { status: 500 },
    );
  }
}
