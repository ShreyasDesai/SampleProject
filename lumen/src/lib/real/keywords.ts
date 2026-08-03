import { fetchText } from "./http";

export interface KeywordIdea {
  keyword: string;
  source: "google-suggest" | "datamuse" | "related" | "seed";
  score: number;
}

export interface KeywordResearch {
  keyword: string;
  researchedAt: string;
  suggestions: KeywordIdea[];
  questions: KeywordIdea[];
  related: KeywordIdea[];
  providers: string[];
  notes: string[];
  dataForSeo?: {
    volume?: number;
    cpc?: number;
    competition?: number;
    difficulty?: number;
  } | null;
}

export async function researchKeyword(keyword: string): Promise<KeywordResearch> {
  const seed = keyword.trim().toLowerCase();
  if (!seed) throw new Error("Enter a keyword");

  const providers: string[] = [];
  const notes: string[] = [];
  const suggestions: KeywordIdea[] = [{ keyword: seed, source: "seed", score: 100 }];
  const questions: KeywordIdea[] = [];
  const related: KeywordIdea[] = [];

  // Google Suggest (live autocomplete)
  try {
    const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(seed)}`;
    const res = await fetchText(url, { timeoutMs: 8000 });
    const json = JSON.parse(res.body) as [string, string[]];
    const list = Array.isArray(json?.[1]) ? json[1] : [];
    list.forEach((item, i) => {
      suggestions.push({
        keyword: item,
        source: "google-suggest",
        score: Math.max(10, 95 - i * 5),
      });
    });
    providers.push("Google Suggest");
  } catch {
    notes.push("Google Suggest unavailable from this network.");
  }

  // Question prefixes
  const prefixes = ["what is", "how to", "why", "best", "vs"];
  await Promise.all(
    prefixes.map(async (prefix) => {
      try {
        const q = `${prefix} ${seed}`;
        const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(q)}`;
        const res = await fetchText(url, { timeoutMs: 8000 });
        const json = JSON.parse(res.body) as [string, string[]];
        (json?.[1] || []).slice(0, 5).forEach((item, i) => {
          questions.push({
            keyword: item,
            source: "google-suggest",
            score: Math.max(10, 80 - i * 5),
          });
        });
      } catch {
        /* ignore */
      }
    }),
  );
  if (questions.length) providers.push("Google Suggest (questions)");

  // Datamuse related terms
  try {
    const url = `https://api.datamuse.com/words?ml=${encodeURIComponent(seed)}&max=30`;
    const res = await fetchText(url, { timeoutMs: 8000 });
    const json = JSON.parse(res.body) as { word: string; score?: number }[];
    json.forEach((row) => {
      related.push({
        keyword: `${row.word} ${seed}`.trim(),
        source: "datamuse",
        score: Math.min(90, Math.round((row.score || 0) / 50000) || 40),
      });
    });
    providers.push("Datamuse");
  } catch {
    notes.push("Datamuse related terms unavailable.");
  }

  // Optional DataForSEO search volume
  let dataForSeo: KeywordResearch["dataForSeo"] = null;
  try {
    const { getDataForSeoConfig, fetchKeywordMetrics } = await import("./dataforseo");
    const cfg = getDataForSeoConfig();
    if (cfg) {
      dataForSeo = await fetchKeywordMetrics(seed, cfg);
      if (dataForSeo) providers.push("DataForSEO");
    } else {
      notes.push(
        "Add DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD in Settings for live search volume, CPC, and KD.",
      );
    }
  } catch (err) {
    notes.push(
      err instanceof Error
        ? `DataForSEO: ${err.message}`
        : "DataForSEO metrics unavailable.",
    );
  }

  const dedupe = (items: KeywordIdea[]) => {
    const seen = new Set<string>();
    return items.filter((item) => {
      const key = item.keyword.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  return {
    keyword: seed,
    researchedAt: new Date().toISOString(),
    suggestions: dedupe(suggestions).slice(0, 40),
    questions: dedupe(questions).slice(0, 30),
    related: dedupe(related).slice(0, 30),
    providers: [...new Set(providers)],
    notes,
    dataForSeo,
  };
}
