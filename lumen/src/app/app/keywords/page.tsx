import { Suspense } from "react";
import type { Metadata } from "next";
import { ExplorerSearch } from "@/components/app/ExplorerSearch";
import { ToolHeader } from "@/components/app/ToolHeader";
import { TrafficAreaChart } from "@/components/ui/Charts";
import { DataTable } from "@/components/ui/DataTable";
import { EmptyState, KdBadge, MetricCard, Panel } from "@/components/ui/Primitives";
import { exploreKeyword, formatNumber } from "@/lib/intel";
import { TOOL_META } from "@/lib/nav";

export const metadata: Metadata = { title: "Keywords Explorer" };

function Content({ q }: { q?: string }) {
  if (!q) {
    return (
      <EmptyState
        title="Research any keyword"
        body="Get volume, difficulty, SERP composition including AI Overviews, related terms, and question clusters."
      />
    );
  }
  const data = exploreKeyword(q);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Search volume" value={formatNumber(data.volume)} hint="monthly US" />
        <MetricCard label="Keyword difficulty" value={data.kd} hint="0–100" />
        <MetricCard label="CPC" value={`$${data.cpc.toFixed(2)}`} />
        <MetricCard label="Traffic potential" value={formatNumber(data.trafficPotential)} />
        <MetricCard label="Global volume" value={formatNumber(data.globalVolume)} />
        <MetricCard label="Clicks" value={formatNumber(data.clicks)} hint="est. after SERP features" />
        <MetricCard label="Intent" value={data.intent} />
        <MetricCard label="Parent topic" value={data.parentTopic} />
      </div>

      <div className="flex flex-wrap gap-2">
        {data.serpFeatures.map((f) => (
          <span key={f} className="badge badge-info">{f}</span>
        ))}
      </div>

      <Panel title="Volume history (24 mo)">
        <TrafficAreaChart data={data.volumeHistory} dataKey="volume" />
      </Panel>

      <Panel title="SERP overview">
        <DataTable headers={["Pos", "Type", "Domain", "Title", "DR", "Traffic", "Backlinks"]}>
          {data.serp.map((r, i) => (
            <tr key={`${r.domain}-${i}`}>
              <td>{r.position || "—"}</td>
              <td>
                <span className={`badge ${r.type === "ai-overview" ? "badge-warn" : r.type === "featured" ? "badge-info" : "badge-muted"}`}>
                  {r.type}
                </span>
              </td>
              <td className="font-semibold text-sea">{r.domain}</td>
              <td className="max-w-[320px] truncate">{r.title}</td>
              <td>{r.dr}</td>
              <td>{formatNumber(r.traffic)}</td>
              <td>{formatNumber(r.backlinks)}</td>
            </tr>
          ))}
        </DataTable>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="Related keywords">
          <DataTable headers={["Keyword", "Vol", "KD", "CPC"]} maxHeight={380}>
            {data.related.slice(0, 15).map((k) => (
              <tr key={k.keyword}>
                <td className="font-medium">{k.keyword}</td>
                <td>{formatNumber(k.volume)}</td>
                <td><KdBadge kd={k.kd} /></td>
                <td>${k.cpc.toFixed(2)}</td>
              </tr>
            ))}
          </DataTable>
        </Panel>
        <Panel title="Questions">
          <DataTable headers={["Question", "Vol", "KD"]} maxHeight={380}>
            {data.questions.map((k) => (
              <tr key={k.keyword}>
                <td className="font-medium">{k.keyword}</td>
                <td>{formatNumber(k.volume)}</td>
                <td><KdBadge kd={k.kd} /></td>
              </tr>
            ))}
          </DataTable>
        </Panel>
        <Panel title="Also rank for">
          <DataTable headers={["Keyword", "Vol", "Intent"]} maxHeight={380}>
            {data.alsoRankFor.slice(0, 15).map((k) => (
              <tr key={k.keyword}>
                <td className="font-medium">{k.keyword}</td>
                <td>{formatNumber(k.volume)}</td>
                <td>{k.intent}</td>
              </tr>
            ))}
          </DataTable>
        </Panel>
      </div>
    </div>
  );
}

export default async function KeywordsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const meta = TOOL_META["/app/keywords"];
  return (
    <div className="space-y-5">
      <ToolHeader path="/app/keywords" />
      <Suspense>
        <ExplorerSearch placeholder={meta.placeholder} example={meta.example} />
      </Suspense>
      <Content q={q} />
    </div>
  );
}
