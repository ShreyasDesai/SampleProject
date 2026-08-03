import { Suspense } from "react";
import type { Metadata } from "next";
import { ExplorerSearch } from "@/components/app/ExplorerSearch";
import { ToolHeader } from "@/components/app/ToolHeader";
import { DataTable } from "@/components/ui/DataTable";
import { EmptyState, MetricCard, Panel } from "@/components/ui/Primitives";
import { analyzeAio } from "@/lib/intel";
import { TOOL_META } from "@/lib/nav";

export const metadata: Metadata = { title: "AIO Answers" };

function Content({ q }: { q?: string }) {
  if (!q) {
    return (
      <EmptyState
        title="Own the answer"
        body="Audit question coverage, answer quality, schema readiness, freshness, and zero-click risk for your brand."
      />
    );
  }
  const data = analyzeAio(q);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Brand" value={data.brand} />
        <MetricCard label="Answer presence" value={`${data.answerPresence}%`} />
        <MetricCard label="Featured answers" value={data.featuredAnswers} />
        <MetricCard label="Zero-click risk" value={`${data.zeroClickRisk}%`} deltaPositive={false} delta="Monitor" />
        <MetricCard label="Schema coverage" value={`${data.schemaCoverage}%`} />
        <MetricCard label="Freshness" value={`${data.freshnessScore}%`} />
      </div>

      <Panel title="Question coverage">
        <DataTable headers={["Question", "Owned", "Quality", "Competitors", "Suggested answer"]}>
          {data.questions.map((item) => (
            <tr key={item.question}>
              <td className="font-semibold">{item.question}</td>
              <td>
                <span className={`badge ${item.owned ? "badge-ok" : "badge-danger"}`}>
                  {item.owned ? "Yes" : "Gap"}
                </span>
              </td>
              <td>{item.answerQuality}</td>
              <td>{item.competitors.join(", ")}</td>
              <td className="max-w-[320px] text-ink-soft">{item.suggestedAnswer}</td>
            </tr>
          ))}
        </DataTable>
      </Panel>

      <Panel title="Recommendations">
        <ul className="space-y-2">
          {data.recommendations.map((r) => (
            <li key={r} className="rounded-xl border border-line bg-panel-2 px-4 py-3 text-sm">
              {r}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

export default async function AioPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const meta = TOOL_META["/app/aio"];
  return (
    <div className="space-y-5">
      <ToolHeader path="/app/aio" />
      <Suspense>
        <ExplorerSearch placeholder={meta.placeholder} example={meta.example} />
      </Suspense>
      <Content q={q} />
    </div>
  );
}
