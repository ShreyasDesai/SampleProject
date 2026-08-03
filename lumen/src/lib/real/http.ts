export function normalizeUrl(input: string): string {
  let raw = input.trim();
  if (!raw) throw new Error("Enter a website URL or domain");
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
  const url = new URL(raw);
  url.hash = "";
  return url.toString().replace(/\/$/, "") || url.origin;
}

export function normalizeDomain(input: string): string {
  const url = new URL(normalizeUrl(input));
  return url.hostname.replace(/^www\./, "");
}

export function sameHost(a: string, b: string): boolean {
  try {
    const ha = new URL(a).hostname.replace(/^www\./, "");
    const hb = new URL(b).hostname.replace(/^www\./, "");
    return ha === hb;
  } catch {
    return false;
  }
}

export function absolutize(base: string, href: string): string | null {
  try {
    if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) {
      return null;
    }
    const url = new URL(href, base);
    if (!/^https?:$/i.test(url.protocol)) return null;
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

export async function fetchText(
  url: string,
  opts: { timeoutMs?: number; method?: "GET" | "HEAD" } = {},
): Promise<{
  ok: boolean;
  status: number;
  url: string;
  headers: Record<string, string>;
  body: string;
  elapsedMs: number;
}> {
  const timeoutMs = opts.timeoutMs ?? 12000;
  const method = opts.method ?? "GET";
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method,
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "LumenBot/1.0 (+https://lumen.app; SEO audit crawler; respectful)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      cache: "no-store",
    });
    const body = method === "HEAD" ? "" : await res.text();
    const headers: Record<string, string> = {};
    res.headers.forEach((v, k) => {
      headers[k.toLowerCase()] = v;
    });
    return {
      ok: res.ok,
      status: res.status,
      url: res.url,
      headers,
      body,
      elapsedMs: Date.now() - started,
    };
  } finally {
    clearTimeout(timer);
  }
}

export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(Math.round(n));
}
