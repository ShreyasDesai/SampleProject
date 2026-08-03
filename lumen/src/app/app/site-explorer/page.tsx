import { Suspense } from "react";
import type { Metadata } from "next";
import { ExplorerSearch } from "@/components/app/ExplorerSearch";
import { ToolHeader } from "@/components/app/ToolHeader";
import { TrafficAreaChart, SimpleBarChart } from "@/components/ui/Charts";
import { DataTable } from "@/components/ui/DataTable";
import { EmptyState, KdBadge, MetricCard, Panel } from "@/components/ui/Primitives";
import { exploreSite, formatMoney, formatNumber } from "@/lib/intel";
import { TOOL_META } from "@/lib/nav";

export const metadata: Metadata = { title: "Site Explorer" };

function Content({ q }: { q?: string }) {
  if (!q) {
    return (
      <EmptyState
        title="Explore any domain"
        body="Enter a domain to unlock organic traffic, keyword portfolios, top pages, competitors, and content gaps."
      />
    );
  }
  const data = exploreSite(q);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Domain Rating" value={data.dr} hint={`URL Rating ${data.ur}`} />
        <MetricCard label="Organic traffic" value={formatNumber(data.organicTraffic)} delta="+4.8%" deltaPositive hint="est. monthly" />
        <MetricCard label="Organic keywords" value={formatNumber(data.organicKeywords)} />
        <MetricCard label="Traffic value" value={formatMoney(data.trafficValue)} />
        <MetricCard label="Backlinks" value={formatNumber(data.backlinks)} />
        <MetricCard label="Referring domains" value={formatNumber(data.refDomains)} hint={`${data.dofollowPct}% dofollow`} />
        <MetricCard label="Brand searches" value={formatNumber(data.brandSearches)} />
        <MetricCard label="AI visibility" value={`${data.aiVisibility}%`} hint="GEO citation share" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="Organic traffic (12 mo)" className="xl:col-span-2">
          <TrafficAreaChart data={data.trafficTrend} />
        </Panel>
        <Panel title="Position distribution">
          <SimpleBarChart data={data.positionDist} xKey="label" dataKey="count" />
        </Panel>
      </div>

      <Panel title="Top organic keywords">
        <DataTable headers={["#", "Keyword", "Volume", "KD", "Pos", "Traffic", "Intent", "URL"]}>
          {data.topKeywords.slice(0, 25).map((k, i) => (
            <tr key={k.keyword}>
              <td className="text-muted">{i + 1}</td>
              <td className="font-semibold">{k.keyword}</td>
              <td>{formatNumber(k.volume)}</td>
              <td><KdBadge kd={k.kd} /></td>
              <td>{k.position}</td>
              <td>{formatNumber(k.traffic)}</td>
              <td><span className="badge badge-muted">{k.intent}</span></td>
              <td className="max-w-[220px] truncate text-sea">{k.url}</td>
            </tr>
          ))}
        </DataTable>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Top pages">
          <DataTable headers={["Page", "Traffic", "Keywords", "Top keyword", "Value"]} maxHeight={360}>
            {data.topPages.map((p) => (
              <tr key={p.url}>
                <td className="max-w-[240px] truncate font-medium text-sea">{p.url}</td>
                <td>{formatNumber(p.traffic)}</td>
                <td>{formatNumber(p.keywords)}</td>
                <td>{p.topKeyword}</td>
                <td>{formatMoney(p.value)}</td>
              </tr>
            ))}
          </DataTable>
        </Panel>
        <Panel title="Organic competitors">
          <DataTable headers={["Domain", "Competition", "Common KW", "Traffic", "DR"]} maxHeight={360}>
            {data.competitors.map((c) => (
              <tr key={c.domain}>
                <td className="font-semibold text-sea">{c.domain}</td>
                <td>{Math.round(c.competition * 100)}%</td>
                <td>{formatNumber(c.commonKeywords)}</td>
                <td>{formatNumber(c.traffic)}</td>
                <td>{c.dr}</td>
              </tr>
            ))}
          </DataTable>
        </Panel>
      </div>

      <Panel title="Content gap opportunities">
        <DataTable headers={["Keyword", "Volume", "KD", "You", "Competitor pos", "Competitor", "Intent"]}>
          {data.contentGap.map((g) => (
            <tr key={`${g.keyword}-${g.competitorDomain}`}>
              <td className="font-semibold">{g.keyword}</td>
              <td>{formatNumber(g.volume)}</td>
              <td><KdBadge kd={g.kd} /></td>
              <td>{g.you ?? "—"}</td>
              <td>{g.competitor}</td>
              <td className="text-sea">{g.competitorDomain}</td>
              <td>{g.intent}</td>
            </tr>
          ))}
        </DataTable>
      </Panel>
    </div>
  );
}

export default async function SiteExplorerPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const meta = TOOL_META["/app/site-explorer"];
  return (
    <div className="space-y-5">
      <ToolHeader path="/app/site-explorer" />
      <Suspense>
        <ExplorerSearch placeholder={meta.placeholder} example={meta.example} />
      </Suspense>
      <Content q={q} />
    </div>
  );
}
