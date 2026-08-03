import { Suspense } from "react";
import type { Metadata } from "next";
import { ExplorerSearch } from "@/components/app/ExplorerSearch";
import { ToolHeader } from "@/components/app/ToolHeader";
import { DataTable } from "@/components/ui/DataTable";
import { EmptyState, KdBadge, MetricCard, Panel } from "@/components/ui/Primitives";
import { formatNumber, generateContentIdeas } from "@/lib/intel";
import { TOOL_META } from "@/lib/nav";

export const metadata: Metadata = { title: "Content Lab" };

function Content({ q }: { q?: string }) {
  if (!q) {
    return (
      <EmptyState
        title="Generate a content roadmap"
        body="Enter your domain to get opportunity-ranked briefs with outlines, difficulty fit, and traffic estimates."
      />
    );
  }
  const ideas = generateContentIdeas(q);
  const easy = ideas.filter((i) => i.difficultyFit === "Easy win").length;
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Ideas generated" value={ideas.length} />
        <MetricCard label="Easy wins" value={easy} deltaPositive delta="Prioritize" />
        <MetricCard
          label="Est. traffic upside"
          value={formatNumber(ideas.reduce((a, b) => a + b.estimatedTraffic, 0))}
        />
      </div>

      <Panel title="Content opportunities">
        <DataTable headers={["Title", "Type", "Keyword", "Vol", "KD", "Fit", "Est. traffic", "Outline"]}>
          {ideas.map((idea) => (
            <tr key={idea.title}>
              <td className="max-w-[260px] font-semibold">{idea.title}</td>
              <td><span className="badge badge-info">{idea.type}</span></td>
              <td>{idea.keyword}</td>
              <td>{formatNumber(idea.volume)}</td>
              <td><KdBadge kd={idea.kd} /></td>
              <td>
                <span
                  className={`badge ${
                    idea.difficultyFit === "Easy win"
                      ? "badge-ok"
                      : idea.difficultyFit === "Stretch"
                        ? "badge-warn"
                        : "badge-danger"
                  }`}
                >
                  {idea.difficultyFit}
                </span>
              </td>
              <td>{formatNumber(idea.estimatedTraffic)}</td>
              <td className="max-w-[220px] text-xs text-ink-soft">{idea.outline.slice(0, 3).join(" · ")}</td>
            </tr>
          ))}
        </DataTable>
      </Panel>
    </div>
  );
}

export default async function ContentPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const meta = TOOL_META["/app/content"];
  return (
    <div className="space-y-5">
      <ToolHeader path="/app/content" />
      <Suspense>
        <ExplorerSearch placeholder={meta.placeholder} example={meta.example} buttonLabel="Build roadmap" />
      </Suspense>
      <Content q={q} />
    </div>
  );
}
