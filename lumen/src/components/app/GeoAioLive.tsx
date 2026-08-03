"use client";

import { useState } from "react";
import { LiveSearch, LiveStatus, postJson } from "@/components/app/LiveSearch";
import { DataTable } from "@/components/ui/DataTable";
import { MetricCard, Panel } from "@/components/ui/Primitives";

type Page = {
  url: string;
  finalUrl: string;
  title: string;
  metaDescription: string;
  h1: string[];
  wordCount: number;
  score: number;
  issues: { severity: string; title: string; howToFix: string }[];
  jsonLdTypes: string[];
  textSample: string;
};

function scoreGeo(page: Page) {
  let score = 40;
  if (page.h1.length === 1) score += 8;
  if (page.wordCount > 400) score += 12;
  if (page.jsonLdTypes.length) score += 10;
  if (/\bis\b|refers to|means/i.test(page.textSample.slice(0, 400))) score += 10;
  if (/\d+%|\d{4}|\$\d+/.test(page.textSample)) score += 8;
  if (page.metaDescription) score += 6;
  return Math.min(100, score);
}

export function GeoAioLive({ mode }: { mode: "geo" | "aio" | "aso" }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<Page | null>(null);

  async function run(url: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await postJson<{ page: Page }>("/api/page", { url });
      setPage(res.page);
    } catch (err) {
      setPage(null);
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  const label =
    mode === "geo" ? "GEO page check" : mode === "aio" ? "AIO answer check" : "ASO / listing page check";
  const info =
    mode === "aso"
      ? "Paste your App Store / Play listing URL or marketing page. We analyze real on-page listing signals."
      : mode === "geo"
        ? "Paste a URL you want AI engines to cite. We score definition leads, facts, schema, and clarity from the live page."
        : "Paste a FAQ or answer URL. We check extractability: direct answers, schema, and factual density.";

  const geoScore = page ? scoreGeo(page) : 0;

  return (
    <div className="space-y-5">
      <LiveSearch
        placeholder="https://yoursite.com/page"
        example="https://example.com"
        buttonLabel={label}
        loading={loading}
        onSubmit={run}
      />
      <LiveStatus error={error} info={info} />
      {page ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Live score" value={mode === "aso" ? page.score : geoScore} />
            <MetricCard label="Word count" value={page.wordCount} />
            <MetricCard label="H1 count" value={page.h1.length} hint={page.h1[0] || "—"} />
            <MetricCard label="Schema types" value={page.jsonLdTypes.join(", ") || "None"} />
          </div>
          <Panel title="Page">
            <p className="text-sm">
              <span className="font-semibold">Title:</span> {page.title || "—"}
            </p>
            <p className="mt-2 text-sm text-ink-soft">{page.metaDescription || "No meta description"}</p>
            <p className="mt-2 truncate text-sm text-sea">{page.finalUrl}</p>
          </Panel>
          <Panel title="Issues to fix for visibility">
            <DataTable headers={["Severity", "Issue", "Fix"]}>
              {page.issues.map((issue, i) => (
                <tr key={`${issue.title}-${i}`}>
                  <td>
                    <span
                      className={`badge ${
                        issue.severity === "error"
                          ? "badge-danger"
                          : issue.severity === "warning"
                            ? "badge-warn"
                            : "badge-muted"
                      }`}
                    >
                      {issue.severity}
                    </span>
                  </td>
                  <td className="font-semibold">{issue.title}</td>
                  <td className="text-ink-soft">{issue.howToFix}</td>
                </tr>
              ))}
            </DataTable>
          </Panel>
          {mode !== "aso" ? (
            <Panel title="AI extractability checklist">
              <ul className="space-y-2 text-sm text-ink-soft">
                <li>• Definition-style opening: {/\bis\b|refers to|means/i.test(page.textSample.slice(0, 400)) ? "detected" : "missing — lead with “X is…”"}</li>
                <li>• Concrete facts/stats: {/\d+%|\d{4}|\$\d+/.test(page.textSample) ? "detected" : "add dated stats"}</li>
                <li>• Schema: {page.jsonLdTypes.length ? page.jsonLdTypes.join(", ") : "add FAQPage / Article / Organization"}</li>
                <li>• Direct H1: {page.h1.length === 1 ? "good" : "use a single clear H1"}</li>
              </ul>
            </Panel>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
