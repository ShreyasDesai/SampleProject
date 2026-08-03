/**
 * Optional DataForSEO integration.
 * Set DATAFORSEO_LOGIN + DATAFORSEO_PASSWORD (API credentials from app.dataforseo.com).
 * Use DATAFORSEO_SANDBOX=true to hit the free sandbox.
 */

export interface DataForSeoConfig {
  login: string;
  password: string;
  sandbox: boolean;
}

export function getDataForSeoConfig(): DataForSeoConfig | null {
  const login = process.env.DATAFORSEO_LOGIN?.trim();
  const password = process.env.DATAFORSEO_PASSWORD?.trim();
  if (!login || !password) return null;
  return {
    login,
    password,
    sandbox: process.env.DATAFORSEO_SANDBOX === "true",
  };
}

function baseUrl(cfg: DataForSeoConfig) {
  return cfg.sandbox
    ? "https://sandbox.dataforseo.com/v3"
    : "https://api.dataforseo.com/v3";
}

async function dfsFetch<T>(
  cfg: DataForSeoConfig,
  path: string,
  body: unknown,
): Promise<T> {
  const auth = Buffer.from(`${cfg.login}:${cfg.password}`).toString("base64");
  const res = await fetch(`${baseUrl(cfg)}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DataForSEO ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchKeywordMetrics(
  keyword: string,
  cfg: DataForSeoConfig,
): Promise<{ volume?: number; cpc?: number; competition?: number; difficulty?: number } | null> {
  type Resp = {
    tasks?: {
      result?: {
        items?: {
          keyword: string;
          keyword_info?: { search_volume?: number; cpc?: number; competition?: number };
          keyword_properties?: { keyword_difficulty?: number };
        }[];
      }[];
    }[];
  };

  const data = await dfsFetch<Resp>(cfg, "/dataforseo_labs/google/keyword_overview/live", [
    {
      keywords: [keyword],
      location_code: 2840,
      language_code: "en",
    },
  ]);

  const item = data.tasks?.[0]?.result?.[0]?.items?.[0];
  if (!item) return null;
  return {
    volume: item.keyword_info?.search_volume,
    cpc: item.keyword_info?.cpc,
    competition: item.keyword_info?.competition,
    difficulty: item.keyword_properties?.keyword_difficulty,
  };
}

export async function fetchSerpLive(
  keyword: string,
  cfg: DataForSeoConfig,
): Promise<
  {
    position: number;
    domain: string;
    url: string;
    title: string;
    description: string;
  }[]
> {
  type Resp = {
    tasks?: {
      result?: {
        items?: {
          type?: string;
          rank_absolute?: number;
          domain?: string;
          url?: string;
          title?: string;
          description?: string;
        }[];
      }[];
    }[];
  };

  const data = await dfsFetch<Resp>(cfg, "/serp/google/organic/live/advanced", [
    {
      keyword,
      location_code: 2840,
      language_code: "en",
      depth: 10,
    },
  ]);

  const items = data.tasks?.[0]?.result?.[0]?.items || [];
  return items
    .filter((i) => i.type === "organic" && i.url)
    .map((i) => ({
      position: i.rank_absolute || 0,
      domain: i.domain || "",
      url: i.url || "",
      title: i.title || "",
      description: i.description || "",
    }));
}

export function dataForSeoStatus() {
  const cfg = getDataForSeoConfig();
  return {
    configured: Boolean(cfg),
    sandbox: cfg?.sandbox ?? false,
  };
}
