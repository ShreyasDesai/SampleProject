import { Suspense } from "react";
import type { Metadata } from "next";
import { ExplorerSearch } from "@/components/app/ExplorerSearch";
import { ToolHeader } from "@/components/app/ToolHeader";
import { DataTable } from "@/components/ui/DataTable";
import { EmptyState, MetricCard, Panel } from "@/components/ui/Primitives";
import { analyzeAso, formatNumber } from "@/lib/intel";
import { TOOL_META } from "@/lib/nav";

export const metadata: Metadata = { title: "ASO Intelligence" };

function Content({ q }: { q?: string }) {
  if (!q) {
    return (
      <EmptyState
        title="App Store & Play intelligence"
        body="Analyze keyword coverage, competitor overlap, listing score, and creative insights for any app query."
      />
    );
  }
  const data = analyzeAso(q);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="App" value={data.appName} hint={data.publisher} />
        <MetricCard label="Store / category" value={data.store} hint={data.category} />
        <MetricCard label="Rating" value={data.rating} hint={`${formatNumber(data.ratingsCount)} ratings`} />
        <MetricCard label="Visibility score" value={data.visibilityScore} hint={`Listing ${data.listingScore}/100`} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Installs" value={data.installs} />
        <MetricCard label="Keyword coverage" value={formatNumber(data.keywordCoverage)} />
        <MetricCard label="Listing score" value={data.listingScore} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Ranked keywords">
          <DataTable headers={["Keyword", "Rank", "Traffic", "Difficulty", "Chance"]} maxHeight={400}>
            {data.topKeywords.map((k) => (
              <tr key={k.keyword}>
                <td className="font-semibold">{k.keyword}</td>
                <td>{k.rank}</td>
                <td>{formatNumber(k.traffic)}</td>
                <td>{k.difficulty}</td>
                <td>{k.chance}%</td>
              </tr>
            ))}
          </DataTable>
        </Panel>
        <Panel title="Store competitors">
          <DataTable headers={["App", "Rating", "Ratings", "Overlap", "Category"]} maxHeight={400}>
            {data.competitors.map((c) => (
              <tr key={c.name}>
                <td className="font-semibold">{c.name}</td>
                <td>{c.rating}</td>
                <td>{formatNumber(c.ratingsCount)}</td>
                <td>{Math.round(c.overlap * 100)}%</td>
                <td>{c.category}</td>
              </tr>
            ))}
          </DataTable>
        </Panel>
      </div>

      <Panel title="Creative & listing insights">
        <ul className="space-y-2">
          {data.creativeInsights.map((insight) => (
            <li key={insight} className="rounded-xl border border-line bg-panel-2 px-4 py-3 text-sm text-ink-soft">
              {insight}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

export default async function AsoPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const meta = TOOL_META["/app/aso"];
  return (
    <div className="space-y-5">
      <ToolHeader path="/app/aso" />
      <Suspense>
        <ExplorerSearch placeholder={meta.placeholder} example={meta.example} />
      </Suspense>
      <Content q={q} />
    </div>
  );
}
