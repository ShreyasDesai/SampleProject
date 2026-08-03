import { Suspense } from "react";
import type { Metadata } from "next";
import { ExplorerSearch } from "@/components/app/ExplorerSearch";
import { ToolHeader } from "@/components/app/ToolHeader";
import { DualLineChart } from "@/components/ui/Charts";
import { DataTable } from "@/components/ui/DataTable";
import { EmptyState, MetricCard, Panel, PositionDelta } from "@/components/ui/Primitives";
import { buildRankTracker, formatNumber } from "@/lib/intel";
import { TOOL_META } from "@/lib/nav";

export const metadata: Metadata = { title: "Rank Tracker" };

function Content({ q }: { q?: string }) {
  if (!q) {
    return (
      <EmptyState
        title="Track rankings daily"
        body="Monitor keyword positions, visibility, share of voice, and SERP feature changes for your domain."
      />
    );
  }
  const data = buildRankTracker(q);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Avg position" value={data.avgPosition} />
        <MetricCard label="Visibility" value={`${data.visibility}%`} delta="+1.2" deltaPositive />
        <MetricCard label="Share of voice" value={`${data.shareOfVoice}%`} />
        <MetricCard label="Improved" value={data.improved} deltaPositive delta="▲" />
        <MetricCard label="Declined" value={data.declined} delta="▼" deltaPositive={false} />
      </div>

      <Panel title="Visibility & average position">
        <DualLineChart data={data.visibilityHistory} xKey="day" aKey="visibility" bKey="avgPosition" />
      </Panel>

      <Panel title="Tracked keywords">
        <DataTable
          headers={["Keyword", "Pos", "Change", "Best", "Vol", "Location", "Device", "Tags", "URL"]}
        >
          {data.keywords.map((k) => (
            <tr key={`${k.keyword}-${k.device}-${k.location}`}>
              <td className="font-semibold">{k.keyword}</td>
              <td className="font-bold">{k.position}</td>
              <td><PositionDelta current={k.position} previous={k.prevPosition} /></td>
              <td>{k.bestPosition}</td>
              <td>{formatNumber(k.volume)}</td>
              <td>{k.location}</td>
              <td>{k.device}</td>
              <td>
                <div className="flex flex-wrap gap-1">
                  {k.tags.map((t) => (
                    <span key={t} className="badge badge-muted">{t}</span>
                  ))}
                </div>
              </td>
              <td className="max-w-[180px] truncate text-sea">{k.url}</td>
            </tr>
          ))}
        </DataTable>
      </Panel>
    </div>
  );
}

export default async function RankTrackerPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const meta = TOOL_META["/app/rank-tracker"];
  return (
    <div className="space-y-5">
      <ToolHeader path="/app/rank-tracker" />
      <Suspense>
        <ExplorerSearch placeholder={meta.placeholder} example={meta.example} buttonLabel="Load project" />
      </Suspense>
      <Content q={q} />
    </div>
  );
}
