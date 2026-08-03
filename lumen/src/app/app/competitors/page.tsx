import { Suspense } from "react";
import type { Metadata } from "next";
import { ExplorerSearch } from "@/components/app/ExplorerSearch";
import { ToolHeader } from "@/components/app/ToolHeader";
import { DataTable } from "@/components/ui/DataTable";
import { EmptyState, KdBadge, MetricCard, Panel } from "@/components/ui/Primitives";
import { compareCompetitors, formatNumber } from "@/lib/intel";
import { TOOL_META } from "@/lib/nav";

export const metadata: Metadata = { title: "Competitive Gap" };

function Content({ q }: { q?: string }) {
  if (!q) {
    return (
      <EmptyState
        title="Compare competing domains"
        body="Paste 2–4 domains separated by commas to unlock overlap, metric bake-offs, and keyword gaps."
      />
    );
  }
  const domains = q.split(/[,|\s]+/).map((d) => d.trim()).filter(Boolean);
  const data = compareCompetitors(domains);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((m) => (
          <MetricCard
            key={m.domain}
            label={m.domain}
            value={`DR ${m.dr}`}
            hint={`${formatNumber(m.traffic)} traffic · ${formatNumber(m.keywords)} KW`}
          />
        ))}
      </div>
      <MetricCard label="Shared keywords (approx)" value={formatNumber(data.sharedKeywords)} />

      <Panel title="Metric comparison">
        <DataTable headers={["Domain", "DR", "Traffic", "Keywords", "Ref domains", "AI visibility"]}>
          {data.metrics.map((m) => (
            <tr key={m.domain}>
              <td className="font-semibold text-sea">{m.domain}</td>
              <td>{m.dr}</td>
              <td>{formatNumber(m.traffic)}</td>
              <td>{formatNumber(m.keywords)}</td>
              <td>{formatNumber(m.refDomains)}</td>
              <td>{m.aiVisibility}%</td>
            </tr>
          ))}
        </DataTable>
      </Panel>

      <Panel title="Keyword battle">
        <DataTable headers={["Keyword", "Volume", ...data.domains]}>
          {data.keywordBattle.map((row) => (
            <tr key={row.keyword}>
              <td className="font-semibold">{row.keyword}</td>
              <td>{formatNumber(row.volume)}</td>
              {row.positions.map((p, i) => (
                <td key={data.domains[i]} className={p && p <= 10 ? "font-bold text-ok" : ""}>
                  {p ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </DataTable>
      </Panel>

      <Panel title="Content gap (they rank, you don’t — or weaker)">
        <DataTable headers={["Keyword", "Volume", "KD", "You", "Them", "Competitor", "Intent"]}>
          {data.gapKeywords.map((g) => (
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

export default async function CompetitorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const meta = TOOL_META["/app/competitors"];
  return (
    <div className="space-y-5">
      <ToolHeader path="/app/competitors" />
      <Suspense>
        <ExplorerSearch placeholder={meta.placeholder} example={meta.example} />
      </Suspense>
      <Content q={q} />
    </div>
  );
}
