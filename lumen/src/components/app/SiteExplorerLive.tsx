"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LiveSearch, LiveStatus, postJson } from "@/components/app/LiveSearch";
import { SimpleBarChart } from "@/components/ui/Charts";
import { DataTable } from "@/components/ui/DataTable";
import { MetricCard, Panel } from "@/components/ui/Primitives";
import { formatNumber } from "@/lib/real/http";

type Overview = {
  domain: string;
  url: string;
  crawledAt: string;
  healthScore: number;
  pagesCrawled: number;
  errors: number;
  warnings: number;
  notices: number;
  httpsPct: number;
  pagesWithSchema: number;
  pagesWithH1: number;
  robotsConfigured: boolean;
  sitemapCount: number;
  title: string;
  metaDescription: string;
  h1: string[];
  topPages: { url: string; score: number; title: string; wordCount: number; status: number }[];
  keywordCandidates: { term: string; count: number }[];
  outboundDomains: { domain: string; links: number }[];
  categoryScores: { category: string; score: number; issues: number }[];
  issues: {
    severity: string;
    category: string;
    title: string;
    detail: string;
    howToFix: string;
    url?: string;
  }[];
};

export function SiteExplorerLive() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Overview | null>(null);

  async function run(url: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await postJson<{ overview: Overview }>("/api/site", { url, maxPages: 10 });
      setData(res.overview);
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
        placeholder="Your website (e.g. example.com)"
        example="example.com"
        buttonLabel="Crawl my site"
        loading={loading}
        onSubmit={run}
      />
      <LiveStatus
        error={error}
        info="Live crawl of your public pages — robots.txt, sitemap, on-page SEO, internal links. No fake metrics."
      />
      {data ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Domain" value={data.domain} hint={data.url} />
            <MetricCard label="Health score" value={data.healthScore} hint={`${data.pagesCrawled} pages crawled`} />
            <MetricCard label="Issues" value={`${data.errors}E / ${data.warnings}W`} hint={`${data.notices} notices`} />
            <MetricCard label="HTTPS pages" value={`${data.httpsPct}%`} hint={`Sitemap URLs: ${data.sitemapCount}`} />
          </div>

          <Panel title="Homepage signals">
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-ink-soft">Title</dt>
                <dd className="font-semibold">{data.title || "—"}</dd>
              </div>
              <div>
                <dt className="text-ink-soft">H1</dt>
                <dd className="font-semibold">{data.h1.join(" · ") || "—"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-ink-soft">Meta description</dt>
                <dd>{data.metaDescription || "—"}</dd>
              </div>
              <div>
                <dt className="text-ink-soft">robots.txt</dt>
                <dd>{data.robotsConfigured ? "Found" : "Missing"}</dd>
              </div>
              <div>
                <dt className="text-ink-soft">Pages with schema / H1</dt>
                <dd>
                  {data.pagesWithSchema} schema · {data.pagesWithH1} H1
                </dd>
              </div>
            </dl>
          </Panel>

          <div className="grid gap-4 xl:grid-cols-2">
            <Panel title="Category health">
              <SimpleBarChart data={data.categoryScores} xKey="category" dataKey="score" />
            </Panel>
            <Panel title="Keyword candidates from your content">
              <DataTable headers={["Term", "Mentions"]} maxHeight={280}>
                {data.keywordCandidates.slice(0, 20).map((k) => (
                  <tr key={k.term}>
                    <td className="font-semibold">{k.term}</td>
                    <td>{k.count}</td>
                  </tr>
                ))}
              </DataTable>
              <p className="mt-3 text-sm text-ink-soft">
                Tip: research these in{" "}
                <Link className="text-sea font-semibold" href="/app/keywords">
                  Keywords Explorer
                </Link>
                .
              </p>
            </Panel>
          </div>

          <Panel title="Crawled pages">
            <DataTable headers={["Score", "Status", "Title", "Words", "URL"]}>
              {data.topPages.map((p) => (
                <tr key={p.url}>
                  <td className="font-bold">{p.score}</td>
                  <td>{p.status}</td>
                  <td className="max-w-[220px] truncate">{p.title}</td>
                  <td>{formatNumber(p.wordCount)}</td>
                  <td className="max-w-[260px] truncate text-sea">{p.url}</td>
                </tr>
              ))}
            </DataTable>
          </Panel>

          <Panel title="Live issues">
            <DataTable headers={["Severity", "Category", "Issue", "Detail", "Fix"]}>
              {data.issues.map((issue, i) => (
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
                  <td>{issue.category}</td>
                  <td className="font-semibold">{issue.title}</td>
                  <td className="max-w-[220px] text-ink-soft">{issue.detail}</td>
                  <td className="max-w-[220px] text-sea">{issue.howToFix}</td>
                </tr>
              ))}
            </DataTable>
          </Panel>
        </div>
      ) : null}
    </div>
  );
}

export function useProjects() {
  const [projects, setProjects] = useState<{ id: string; domain: string; url: string; trackedKeywords: string[] }[]>([]);
  useEffect(() => {
    fetch("/api/project")
      .then((r) => r.json())
      .then((d) => setProjects(d.projects || []))
      .catch(() => undefined);
  }, []);
  return projects;
}
