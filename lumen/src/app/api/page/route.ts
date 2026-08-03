import { NextResponse } from "next/server";
import { analyzeSinglePage } from "@/lib/real/crawler";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { url?: string };
    if (!body.url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }
    const page = await analyzeSinglePage(body.url);
    return NextResponse.json({ ok: true, page });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Page analysis failed" },
      { status: 500 },
    );
  }
}
