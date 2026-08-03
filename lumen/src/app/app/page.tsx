"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LiveSearch, LiveStatus, postJson } from "@/components/app/LiveSearch";
import { MetricCard, Panel } from "@/components/ui/Primitives";
import { NAV } from "@/lib/nav";

type Project = {
  id: string;
  name: string;
  domain: string;
  url: string;
  lastAuditAt?: string;
  trackedKeywords: string[];
};

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(
    "Add your website to run a real crawl. Results are saved as a project.",
  );

  async function refresh() {
    const res = await fetch("/api/project").then((r) => r.json());
    setProjects(res.projects || []);
  }

  useEffect(() => {
    refresh().catch(() => undefined);
  }, []);

  async function addSite(url: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await postJson<{
        result: { domain: string; healthScore: number; pagesCrawled: number; errors: number };
        project: Project;
      }>("/api/audit", { url, maxPages: 10, saveProject: true });
      setInfo(
        `Crawled ${res.result.domain}: health ${res.result.healthScore}/100 across ${res.result.pagesCrawled} pages (${res.result.errors} errors).`,
      );
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add site");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-sea">Get started</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Add your website
        </h1>
        <p className="mt-2 max-w-2xl text-ink-soft">
          Lumen now runs <strong>live analysis</strong> on real URLs — crawl, audit, keyword research, and more.
          Enter your domain to begin.
        </p>
      </header>

      <LiveSearch
        placeholder="yourdomain.com"
        example="example.com"
        buttonLabel="Crawl & save project"
        loading={loading}
        onSubmit={addSite}
      />
      <LiveStatus error={error} info={info} />

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Projects" value={projects.length} />
        <MetricCard label="Live crawl" value="Ready" hint="No API key needed" />
        <MetricCard
          label="DataForSEO"
          value="Optional"
          hint="Settings → volume, SERP, backlinks"
        />
      </div>

      <Panel title="Your websites">
        {projects.length === 0 ? (
          <p className="text-sm text-ink-soft">No projects yet. Crawl a site above to create one.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Domain</th>
                  <th>URL</th>
                  <th>Keywords tracked</th>
                  <th>Last audit</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id}>
                    <td className="font-semibold">{p.domain}</td>
                    <td className="max-w-[220px] truncate text-sea">{p.url}</td>
                    <td>{p.trackedKeywords.length}</td>
                    <td>{p.lastAuditAt ? new Date(p.lastAuditAt).toLocaleString() : "—"}</td>
                    <td className="space-x-3 whitespace-nowrap text-sm">
                      <Link className="font-semibold text-sea" href={`/app/site-explorer`}>
                        Explore
                      </Link>
                      <Link className="font-semibold text-sea" href={`/app/site-audit`}>
                        Audit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {NAV.filter((n) => n.href !== "/app").map((n) => {
          const Icon = n.icon;
          return (
            <Link key={n.href} href={n.href} className="card group p-5 transition hover:-translate-y-0.5">
              <div className="flex items-center gap-2 text-sea">
                <Icon className="h-4 w-4" />
                <h2 className="font-display text-lg font-bold text-ink">{n.label}</h2>
              </div>
              <p className="mt-2 text-sm text-ink-soft">Open →</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
