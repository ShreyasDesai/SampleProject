"use client";

import { useState } from "react";
import { LiveSearch, LiveStatus, postJson } from "@/components/app/LiveSearch";
import { DataTable } from "@/components/ui/DataTable";
import { MetricCard, Panel } from "@/components/ui/Primitives";

export function BacklinksLive() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    domain: string;
    outboundDomains: { domain: string; links: number }[];
    pagesCrawled: number;
    healthScore: number;
  } | null>(null);

  async function run(url: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await postJson<{
        overview: {
          domain: string;
          outboundDomains: { domain: string; links: number }[];
          pagesCrawled: number;
          healthScore: number;
        };
      }>("/api/site", { url, maxPages: 10 });
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
        placeholder="Your website"
        example="example.com"
        buttonLabel="Analyze link graph"
        loading={loading}
        onSubmit={run}
      />
      <LiveStatus
        error={error}
        info="Live outbound link graph from your crawl. Full inbound backlink indexes (like Ahrefs) require DataForSEO Backlinks API — configure in Settings."
      />
      {data ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <MetricCard label="Domain" value={data.domain} />
            <MetricCard label="Pages crawled" value={data.pagesCrawled} />
            <MetricCard label="Outbound domains" value={data.outboundDomains.length} />
          </div>
          <Panel title="Domains your site links out to">
            <DataTable headers={["Domain", "Links from your crawl"]}>
              {data.outboundDomains.map((d) => (
                <tr key={d.domain}>
                  <td className="font-semibold text-sea">{d.domain}</td>
                  <td>{d.links}</td>
                </tr>
              ))}
            </DataTable>
          </Panel>
        </div>
      ) : null}
    </div>
  );
}
