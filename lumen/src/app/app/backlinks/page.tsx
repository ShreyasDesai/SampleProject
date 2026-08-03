import { Suspense } from "react";
import type { Metadata } from "next";
import { ExplorerSearch } from "@/components/app/ExplorerSearch";
import { ToolHeader } from "@/components/app/ToolHeader";
import { DualLineChart, SimpleBarChart } from "@/components/ui/Charts";
import { DataTable } from "@/components/ui/DataTable";
import { EmptyState, MetricCard, Panel } from "@/components/ui/Primitives";
import { analyzeBacklinks, formatNumber } from "@/lib/intel";
import { TOOL_META } from "@/lib/nav";

export const metadata: Metadata = { title: "Backlink Profile" };

function Content({ q }: { q?: string }) {
  if (!q) {
    return (
      <EmptyState
        title="Inspect a backlink profile"
        body="Analyze referring domains, anchors, dofollow mix, and new vs lost links with quality distributions."
      />
    );
  }
  const data = analyzeBacklinks(q);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Backlinks" value={formatNumber(data.backlinks)} />
        <MetricCard label="Referring domains" value={formatNumber(data.refDomains)} />
        <MetricCard label="Dofollow" value={`${data.dofollowPct}%`} hint={`Nofollow ${data.nofollowPct}%`} />
        <MetricCard label="New / lost (30d)" value={`${formatNumber(data.newLast30)} / ${formatNumber(data.lostLast30)}`} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Referring domains over time">
          <DualLineChart data={data.linkHistory} xKey="month" aKey="refDomains" bKey="newLinks" />
        </Panel>
        <Panel title="DR distribution of ref. domains">
          <SimpleBarChart data={data.drDistribution} xKey="bucket" dataKey="count" color="#2563eb" />
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Top anchors">
          <DataTable headers={["Anchor", "Backlinks", "Ref domains", "%"]} maxHeight={360}>
            {data.anchors.map((a) => (
              <tr key={a.anchor}>
                <td className="font-semibold">{a.anchor}</td>
                <td>{formatNumber(a.backlinks)}</td>
                <td>{formatNumber(a.refDomains)}</td>
                <td>{a.pct}%</td>
              </tr>
            ))}
          </DataTable>
        </Panel>
        <Panel title="Link attributes">
          <div className="grid grid-cols-2 gap-3">
            <MetricCard label="UGC" value={`${data.ugcPct}%`} />
            <MetricCard label="Sponsored" value={`${data.sponsoredPct}%`} />
            <MetricCard label="Nofollow" value={`${data.nofollowPct}%`} />
            <MetricCard label="Dofollow" value={`${data.dofollowPct}%`} />
          </div>
        </Panel>
      </div>

      <Panel title="Top backlinks">
        <DataTable headers={["Source", "DR", "UR", "Traffic", "Type", "Anchor", "Target", "Status"]}>
          {data.topLinks.map((l) => (
            <tr key={l.sourceUrl}>
              <td className="max-w-[220px] truncate font-medium text-sea">{l.sourceDomain}</td>
              <td>{l.dr}</td>
              <td>{l.ur}</td>
              <td>{formatNumber(l.domainTraffic)}</td>
              <td>{l.type}</td>
              <td className="max-w-[140px] truncate">{l.anchor}</td>
              <td className="max-w-[160px] truncate">{l.targetUrl}</td>
              <td>
                <span className={`badge ${l.isLost ? "badge-danger" : l.dofollow ? "badge-ok" : "badge-muted"}`}>
                  {l.isLost ? "Lost" : l.dofollow ? "Dofollow" : "Nofollow"}
                </span>
              </td>
            </tr>
          ))}
        </DataTable>
      </Panel>
    </div>
  );
}

export default async function BacklinksPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const meta = TOOL_META["/app/backlinks"];
  return (
    <div className="space-y-5">
      <ToolHeader path="/app/backlinks" />
      <Suspense>
        <ExplorerSearch placeholder={meta.placeholder} example={meta.example} />
      </Suspense>
      <Content q={q} />
    </div>
  );
}
