import { Suspense } from "react";
import type { Metadata } from "next";
import { ExplorerSearch } from "@/components/app/ExplorerSearch";
import { ToolHeader } from "@/components/app/ToolHeader";
import { TrafficAreaChart, SimpleBarChart } from "@/components/ui/Charts";
import { DataTable } from "@/components/ui/DataTable";
import { EmptyState, MetricCard, Panel } from "@/components/ui/Primitives";
import { analyzeGeo, formatNumber } from "@/lib/intel";
import { TOOL_META } from "@/lib/nav";

export const metadata: Metadata = { title: "GEO Visibility" };

function Content({ q }: { q?: string }) {
  if (!q) {
    return (
      <EmptyState
        title="Measure generative engine visibility"
        body="Track brand citations and prompt coverage across ChatGPT, Perplexity, Gemini, Copilot, Claude, and AI Overviews."
      />
    );
  }
  const data = analyzeGeo(q);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Brand" value={data.brand} hint={data.domain} />
        <MetricCard label="GEO score" value={data.overallScore} hint="/100" />
        <MetricCard label="Citation share" value={`${data.citationShare}%`} />
        <MetricCard label="Prompts tracked" value={data.prompts.length} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Engine scores">
          <SimpleBarChart
            data={data.engines.map((e) => ({ engine: e.engine, score: e.score }))}
            xKey="engine"
            dataKey="score"
          />
        </Panel>
        <Panel title="Citation trend">
          <TrafficAreaChart data={data.trend} dataKey="citations" />
        </Panel>
      </div>

      <Panel title="Engine breakdown">
        <DataTable headers={["Engine", "Score", "Citations", "Sentiment", "Sample answer"]}>
          {data.engines.map((e) => (
            <tr key={e.engine}>
              <td className="font-semibold">{e.engine}</td>
              <td>{e.score}</td>
              <td>{formatNumber(e.citations)}</td>
              <td>
                <span className={`badge ${e.sentiment === "Positive" ? "badge-ok" : e.sentiment === "Mixed" ? "badge-warn" : "badge-muted"}`}>
                  {e.sentiment}
                </span>
              </td>
              <td className="max-w-[360px] text-ink-soft">{e.sampleAnswer}</td>
            </tr>
          ))}
        </DataTable>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Prompt monitor">
          <DataTable headers={["Prompt", "Mentioned", "Pos", "Engine", "Cited URL"]} maxHeight={400}>
            {data.prompts.map((p) => (
              <tr key={p.prompt}>
                <td className="max-w-[220px] font-medium">{p.prompt}</td>
                <td>
                  <span className={`badge ${p.mentioned ? "badge-ok" : "badge-danger"}`}>
                    {p.mentioned ? "Yes" : "No"}
                  </span>
                </td>
                <td>{p.position ?? "—"}</td>
                <td>{p.engine}</td>
                <td className="max-w-[160px] truncate text-sea">{p.citedUrl ?? "—"}</td>
              </tr>
            ))}
          </DataTable>
        </Panel>
        <Panel title="Entity graph">
          <DataTable headers={["Entity", "Strength", "Related"]} maxHeight={400}>
            {data.entities.map((e) => (
              <tr key={e.entity}>
                <td className="font-semibold">{e.entity}</td>
                <td>{e.strength}</td>
                <td>{e.related.join(", ")}</td>
              </tr>
            ))}
          </DataTable>
        </Panel>
      </div>
    </div>
  );
}

export default async function GeoPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const meta = TOOL_META["/app/geo"];
  return (
    <div className="space-y-5">
      <ToolHeader path="/app/geo" />
      <Suspense>
        <ExplorerSearch placeholder={meta.placeholder} example={meta.example} />
      </Suspense>
      <Content q={q} />
    </div>
  );
}
