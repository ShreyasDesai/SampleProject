"use client";

import { useState } from "react";
import { LiveSearch, LiveStatus, postJson } from "@/components/app/LiveSearch";
import { DataTable } from "@/components/ui/DataTable";
import { MetricCard, Panel } from "@/components/ui/Primitives";

type ResearchResponse = {
  research: {
    keyword: string;
    suggestions: { keyword: string; source: string; score: number }[];
    questions: { keyword: string; source: string; score: number }[];
    related: { keyword: string; source: string; score: number }[];
    providers: string[];
    notes: string[];
    dataForSeo: {
      volume?: number;
      cpc?: number;
      competition?: number;
      difficulty?: number;
    } | null;
  };
  serp: {
    position: number;
    domain: string;
    url: string;
    title: string;
    description: string;
  }[] | null;
};

export function KeywordsLive() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ResearchResponse | null>(null);

  async function run(keyword: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await postJson<ResearchResponse>("/api/keywords", {
        keyword,
        includeSerp: true,
      });
      setData(res);
    } catch (err) {
      setData(null);
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <LiveSearch
        placeholder="Keyword (e.g. project management software)"
        example="seo tools"
        buttonLabel="Research keyword"
        loading={loading}
        onSubmit={run}
      />
      <LiveStatus
        error={error}
        info="Live Google Suggest + Datamuse. Volume/SERP unlock when DataForSEO is set in Settings."
      />
      {data ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Seed keyword" value={data.research.keyword} />
            <MetricCard
              label="Search volume"
              value={data.research.dataForSeo?.volume ?? "—"}
              hint={data.research.dataForSeo ? "DataForSEO" : "Add API key for volume"}
            />
            <MetricCard
              label="KD / CPC"
              value={
                data.research.dataForSeo
                  ? `${data.research.dataForSeo.difficulty ?? "—"} / $${data.research.dataForSeo.cpc ?? "—"}`
                  : "—"
              }
            />
            <MetricCard label="Providers" value={data.research.providers.join(", ") || "—"} />
          </div>
          {data.research.notes.length ? (
            <ul className="space-y-1 text-sm text-ink-soft">
              {data.research.notes.map((n) => (
                <li key={n}>• {n}</li>
              ))}
            </ul>
          ) : null}
          <div className="grid gap-4 xl:grid-cols-3">
            <Panel title="Google suggestions">
              <DataTable headers={["Keyword", "Score", "Source"]} maxHeight={360}>
                {data.research.suggestions.map((s) => (
                  <tr key={s.keyword}>
                    <td className="font-semibold">{s.keyword}</td>
                    <td>{s.score}</td>
                    <td>{s.source}</td>
                  </tr>
                ))}
              </DataTable>
            </Panel>
            <Panel title="Questions people ask">
              <DataTable headers={["Question", "Score"]} maxHeight={360}>
                {data.research.questions.map((s) => (
                  <tr key={s.keyword}>
                    <td className="font-semibold">{s.keyword}</td>
                    <td>{s.score}</td>
                  </tr>
                ))}
              </DataTable>
            </Panel>
            <Panel title="Related ideas">
              <DataTable headers={["Keyword", "Score"]} maxHeight={360}>
                {data.research.related.map((s) => (
                  <tr key={s.keyword}>
                    <td className="font-semibold">{s.keyword}</td>
                    <td>{s.score}</td>
                  </tr>
                ))}
              </DataTable>
            </Panel>
          </div>
          {data.serp && data.serp.length > 0 ? (
            <Panel title="Live Google SERP">
              <DataTable headers={["Pos", "Domain", "Title", "URL"]}>
                {data.serp.map((r) => (
                  <tr key={`${r.position}-${r.url}`}>
                    <td>{r.position}</td>
                    <td className="font-semibold text-sea">{r.domain}</td>
                    <td className="max-w-[280px] truncate">{r.title}</td>
                    <td className="max-w-[220px] truncate">{r.url}</td>
                  </tr>
                ))}
              </DataTable>
            </Panel>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
