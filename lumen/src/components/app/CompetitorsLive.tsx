"use client";

import { useState } from "react";
import { LiveSearch, LiveStatus, postJson } from "@/components/app/LiveSearch";
import { DataTable } from "@/components/ui/DataTable";
import { MetricCard, Panel } from "@/components/ui/Primitives";

type Crawl = {
  domain: string;
  keywordCandidates: { term: string; count: number }[];
  outboundDomains: { domain: string; links: number }[];
  healthScore: number;
  pagesCrawled: number;
  topInternalPages: { url: string; title: string; score: number }[];
};

export function CompetitorsLive() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [yours, setYours] = useState<Crawl | null>(null);
  const [theirs, setTheirs] = useState<Crawl | null>(null);
  const [gap, setGap] = useState<string[]>([]);

  async function run(input: string) {
    setLoading(true);
    setError(null);
    try {
      const parts = input.split(/[,|]+/).map((s) => s.trim()).filter(Boolean);
      if (parts.length < 2) throw new Error("Enter two domains: yours.com, competitor.com");
      const [a, b] = parts;
      const [ra, rb] = await Promise.all([
        postJson<{ overview: Crawl }>("/api/site", { url: a, maxPages: 8 }),
        postJson<{ overview: Crawl }>("/api/site", { url: b, maxPages: 8 }),
      ]);
      setYours(ra.overview);
      setTheirs(rb.overview);
      const yourTerms = new Set(ra.overview.keywordCandidates.map((k) => k.term));
      setGap(
        rb.overview.keywordCandidates
          .map((k) => k.term)
          .filter((t) => !yourTerms.has(t))
          .slice(0, 30),
      );
    } catch (err) {
      setYours(null);
      setTheirs(null);
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <LiveSearch
        placeholder="yourdomain.com, competitor.com"
        example="example.com, wikipedia.org"
        buttonLabel="Compare live"
        loading={loading}
        onSubmit={run}
      />
      <LiveStatus
        error={error}
        info="Live crawl of both sites. Compares content keyword coverage and page health — real pages, not invented scores."
      />
      {yours && theirs ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard label={yours.domain} value={yours.healthScore} hint={`${yours.pagesCrawled} pages`} />
            <MetricCard label={theirs.domain} value={theirs.healthScore} hint={`${theirs.pagesCrawled} pages`} />
          </div>
          <Panel title="Content terms they use that you don’t">
            <div className="flex flex-wrap gap-2">
              {gap.map((t) => (
                <span key={t} className="badge badge-warn">
                  {t}
                </span>
              ))}
              {!gap.length ? <p className="text-sm text-ink-soft">No clear content-term gap in this sample crawl.</p> : null}
            </div>
          </Panel>
          <div className="grid gap-4 xl:grid-cols-2">
            <Panel title={`${yours.domain} top pages`}>
              <DataTable headers={["Score", "Title", "URL"]} maxHeight={300}>
                {yours.topInternalPages.slice(0, 10).map((p) => (
                  <tr key={p.url}>
                    <td>{p.score}</td>
                    <td className="max-w-[180px] truncate">{p.title}</td>
                    <td className="max-w-[180px] truncate text-sea">{p.url}</td>
                  </tr>
                ))}
              </DataTable>
            </Panel>
            <Panel title={`${theirs.domain} top pages`}>
              <DataTable headers={["Score", "Title", "URL"]} maxHeight={300}>
                {theirs.topInternalPages.slice(0, 10).map((p) => (
                  <tr key={p.url}>
                    <td>{p.score}</td>
                    <td className="max-w-[180px] truncate">{p.title}</td>
                    <td className="max-w-[180px] truncate text-sea">{p.url}</td>
                  </tr>
                ))}
              </DataTable>
            </Panel>
          </div>
        </div>
      ) : null}
    </div>
  );
}
