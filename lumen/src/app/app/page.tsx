import type { Metadata } from "next";
import Link from "next/link";
import { MetricCard, Panel } from "@/components/ui/Primitives";
import { TrafficAreaChart, SimpleBarChart } from "@/components/ui/Charts";
import { exploreSite, formatMoney, formatNumber } from "@/lib/intel";
import { NAV } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Dashboard",
};

const WATCHLIST = ["ahrefs.com", "semrush.com", "moz.com", "notion.so"];

export default function DashboardPage() {
  const sites = WATCHLIST.map((d) => exploreSite(d));
  const primary = sites[0]!;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-sea">Command center</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Visibility portfolio
          </h1>
          <p className="mt-2 max-w-2xl text-ink-soft">
            Ahrefs/SEMrush-class workspace covering organic search, app stores, generative citations, and answer engines.
          </p>
        </div>
        <Link href="/app/site-explorer?q=ahrefs.com" className="btn-primary">
          Open Site Explorer
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Tracked domains" value={WATCHLIST.length} hint="Demo watchlist" />
        <MetricCard
          label="Portfolio organic traffic"
          value={formatNumber(sites.reduce((a, b) => a + b.organicTraffic, 0))}
          delta="+6.4%"
          deltaPositive
          hint="vs prior month"
        />
        <MetricCard
          label="Portfolio keywords"
          value={formatNumber(sites.reduce((a, b) => a + b.organicKeywords, 0))}
        />
        <MetricCard
          label="AI citation share (avg)"
          value={`${(sites.reduce((a, b) => a + b.aiVisibility, 0) / sites.length).toFixed(1)}%`}
          hint="GEO visibility"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title={`${primary.domain} traffic trend`} className="xl:col-span-2">
          <TrafficAreaChart data={primary.trafficTrend} />
        </Panel>
        <Panel title="Position distribution">
          <SimpleBarChart data={primary.positionDist} xKey="label" dataKey="count" />
        </Panel>
      </div>

      <Panel title="Watchlist">
        <div className="table-wrap !overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Domain</th>
                <th>DR</th>
                <th>Organic traffic</th>
                <th>Keywords</th>
                <th>Traffic value</th>
                <th>Ref. domains</th>
                <th>AI visibility</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sites.map((s) => (
                <tr key={s.domain}>
                  <td className="font-semibold text-sea">{s.domain}</td>
                  <td>{s.dr}</td>
                  <td>{formatNumber(s.organicTraffic)}</td>
                  <td>{formatNumber(s.organicKeywords)}</td>
                  <td>{formatMoney(s.trafficValue)}</td>
                  <td>{formatNumber(s.refDomains)}</td>
                  <td>{s.aiVisibility}%</td>
                  <td>
                    <Link className="text-sm font-semibold text-sea" href={`/app/site-explorer?q=${s.domain}`}>
                      Explore
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
              <p className="mt-2 text-sm text-ink-soft">Open module →</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
