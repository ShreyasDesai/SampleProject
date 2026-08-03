import { NextResponse } from "next/server";
import { dataForSeoStatus } from "@/lib/real/dataforseo";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

const ENV_FILE = path.join(process.cwd(), ".env.local");

export async function GET() {
  return NextResponse.json({
    dataForSeo: dataForSeoStatus(),
    hasEnvFile: await fs
      .access(ENV_FILE)
      .then(() => true)
      .catch(() => false),
    hints: {
      dataforseo:
        "Create an account at https://app.dataforseo.com/ and set DATAFORSEO_LOGIN + DATAFORSEO_PASSWORD. Use DATAFORSEO_SANDBOX=true for free sandbox testing.",
      freeStack:
        "Site Audit, Site Explorer crawl, and Keywords (Google Suggest + Datamuse) work with no API keys.",
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      login?: string;
      password?: string;
      sandbox?: boolean;
    };
    if (!body.login || !body.password) {
      return NextResponse.json({ error: "login and password required" }, { status: 400 });
    }

    let existing = "";
    try {
      existing = await fs.readFile(ENV_FILE, "utf8");
    } catch {
      existing = "";
    }

    const lines = existing
      .split("\n")
      .filter(
        (l) =>
          l &&
          !l.startsWith("DATAFORSEO_LOGIN=") &&
          !l.startsWith("DATAFORSEO_PASSWORD=") &&
          !l.startsWith("DATAFORSEO_SANDBOX="),
      );
    lines.push(`DATAFORSEO_LOGIN=${body.login}`);
    lines.push(`DATAFORSEO_PASSWORD=${body.password}`);
    lines.push(`DATAFORSEO_SANDBOX=${body.sandbox ? "true" : "false"}`);
    await fs.writeFile(ENV_FILE, `${lines.join("\n")}\n`);

    // Apply to current process so routes work without full restart when possible
    process.env.DATAFORSEO_LOGIN = body.login;
    process.env.DATAFORSEO_PASSWORD = body.password;
    process.env.DATAFORSEO_SANDBOX = body.sandbox ? "true" : "false";

    return NextResponse.json({
      ok: true,
      dataForSeo: dataForSeoStatus(),
      note: "Credentials saved to .env.local. Restart `npm run dev` if routes still report unconfigured.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save settings" },
      { status: 500 },
    );
  }
}
