"use client";

import { useState } from "react";
import { LiveSearch, LiveStatus, postJson } from "@/components/app/LiveSearch";
import { SimpleBarChart } from "@/components/ui/Charts";
import { DataTable } from "@/components/ui/DataTable";
import { MetricCard, Panel } from "@/components/ui/Primitives";

type AuditResponse = {
  result: {
    domain: string;
    startUrl: string;
    crawledAt: string;
    pagesCrawled: number;
    healthScore: number;
    errors: number;
    warnings: number;
    notices: number;
    categoryScores: { category: string; score: number; issues: number }[];
    issues: {
      severity: string;
      category: string;
      title: string;
      detail: string;
      howToFix: string;
      url?: string;
    }[];
    topInternalPages: { url: string; score: number; title: string; wordCount: number; status: number }[];
    robotsTxt: string | null;
    sitemapUrls: string[];
  };
};

export function AuditLive() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AuditResponse["result"] | null>(null);

  async function run(url: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await postJson<AuditResponse>("/api/audit", { url, maxPages: 12, saveProject: true });
      setData(res.result);
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
        placeholder="Website to audit"
        example="example.com"
        buttonLabel="Start live crawl"
        loading={loading}
        onSubmit={run}
      />
      <LiveStatus
        error={error}
        info="Real crawler: fetches your pages, robots.txt, and sitemap, then scores on-page SEO issues."
      />
      {data ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard label="Health" value={data.healthScore} />
            <MetricCard label="Pages crawled" value={data.pagesCrawled} />
            <MetricCard label="Errors" value={data.errors} />
            <MetricCard label="Warnings" value={data.warnings} />
            <MetricCard label="Notices" value={data.notices} />
          </div>
          <Panel title="Category scores">
            <SimpleBarChart data={data.categoryScores} xKey="category" dataKey="score" />
          </Panel>
          <Panel title="Issues found on your site">
            <DataTable headers={["Severity", "Category", "Issue", "URL", "Fix"]}>
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
                  <td className="max-w-[180px] truncate text-sea">{issue.url}</td>
                  <td className="max-w-[240px] text-ink-soft">{issue.howToFix}</td>
                </tr>
              ))}
            </DataTable>
          </Panel>
          <Panel title="Pages">
            <DataTable headers={["Score", "Status", "Title", "Words", "URL"]}>
              {data.topInternalPages.map((p) => (
                <tr key={p.url}>
                  <td>{p.score}</td>
                  <td>{p.status}</td>
                  <td className="max-w-[220px] truncate">{p.title}</td>
                  <td>{p.wordCount}</td>
                  <td className="max-w-[240px] truncate text-sea">{p.url}</td>
                </tr>
              ))}
            </DataTable>
          </Panel>
          <Panel title="Discovery">
            <p className="text-sm text-ink-soft">
              robots.txt: {data.robotsTxt ? "found" : "missing"} · sitemap URLs discovered:{" "}
              {data.sitemapUrls.length}
            </p>
            {data.sitemapUrls.length ? (
              <ul className="mt-3 max-h-40 space-y-1 overflow-auto text-sm text-sea">
                {data.sitemapUrls.slice(0, 20).map((u) => (
                  <li key={u} className="truncate">
                    {u}
                  </li>
                ))}
              </ul>
            ) : null}
          </Panel>
        </div>
      ) : null}
    </div>
  );
}
