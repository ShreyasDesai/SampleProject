import { Suspense } from "react";
import type { Metadata } from "next";
import { ExplorerSearch } from "@/components/app/ExplorerSearch";
import { ToolHeader } from "@/components/app/ToolHeader";
import { DualLineChart, SimpleBarChart } from "@/components/ui/Charts";
import { DataTable } from "@/components/ui/DataTable";
import { EmptyState, MetricCard, Panel } from "@/components/ui/Primitives";
import { formatNumber, runSiteAudit } from "@/lib/intel";
import { TOOL_META } from "@/lib/nav";

export const metadata: Metadata = { title: "Site Audit" };

function SeverityBadge({ severity }: { severity: string }) {
  const cls =
    severity === "error" ? "badge-danger" : severity === "warning" ? "badge-warn" : "badge-muted";
  return <span className={`badge ${cls}`}>{severity}</span>;
}

function Content({ q }: { q?: string }) {
  if (!q) {
    return (
      <EmptyState
        title="Crawl any site"
        body="Run a full technical SEO health check across crawlability, indexability, content, links, performance, and schema."
      />
    );
  }
  const data = runSiteAudit(q);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Health score" value={data.healthScore} hint="/100" deltaPositive={data.healthScore >= 70} delta={data.healthScore >= 70 ? "Healthy" : "Needs work"} />
        <MetricCard label="Pages crawled" value={formatNumber(data.pagesCrawled)} />
        <MetricCard label="Errors" value={formatNumber(data.errors)} />
        <MetricCard label="Warnings" value={formatNumber(data.warnings)} />
        <MetricCard label="Notices" value={formatNumber(data.notices)} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Category scores">
          <SimpleBarChart data={data.categoryScores} xKey="category" dataKey="score" />
        </Panel>
        <Panel title="Health trend">
          <DualLineChart
            data={data.crawlTrend}
            xKey="day"
            aKey="health"
            bKey="health"
          />
        </Panel>
      </div>

      <Panel title="Issues">
        <DataTable headers={["Severity", "Category", "Issue", "Affected", "Why it matters", "How to fix"]}>
          {data.issues.map((issue) => (
            <tr key={issue.id}>
              <td><SeverityBadge severity={issue.severity} /></td>
              <td>{issue.category}</td>
              <td className="font-semibold">{issue.title}</td>
              <td>{formatNumber(issue.affected)}</td>
              <td className="max-w-[240px] text-ink-soft">{issue.description}</td>
              <td className="max-w-[240px] text-sea">{issue.howToFix}</td>
            </tr>
          ))}
        </DataTable>
      </Panel>
    </div>
  );
}

export default async function SiteAuditPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const meta = TOOL_META["/app/site-audit"];
  return (
    <div className="space-y-5">
      <ToolHeader path="/app/site-audit" />
      <Suspense>
        <ExplorerSearch placeholder={meta.placeholder} example={meta.example} buttonLabel="Start audit" />
      </Suspense>
      <Content q={q} />
    </div>
  );
}
