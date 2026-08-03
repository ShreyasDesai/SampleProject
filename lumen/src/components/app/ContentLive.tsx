"use client";

import { useState } from "react";
import { LiveSearch, LiveStatus, postJson } from "@/components/app/LiveSearch";
import { DataTable } from "@/components/ui/DataTable";
import { MetricCard, Panel } from "@/components/ui/Primitives";

export function ContentLive() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<
    { title: string; keyword: string; mentions: number; type: string; why: string }[]
  >([]);
  const [domain, setDomain] = useState("");

  async function run(url: string) {
    setLoading(true);
    setError(null);
    try {
      const site = await postJson<{
        overview: {
          domain: string;
          keywordCandidates: { term: string; count: number }[];
          issues: { title: string; howToFix: string; severity: string }[];
        };
      }>("/api/site", { url, maxPages: 8 });

      const top = site.overview.keywordCandidates.slice(0, 12);
      const built = [];
      for (const term of top) {
        const kw = await postJson<{
          research: { suggestions: { keyword: string }[]; questions: { keyword: string }[] };
        }>("/api/keywords", { keyword: term.term });
        const suggestion = kw.research.suggestions[1]?.keyword || term.term;
        const question = kw.research.questions[0]?.keyword;
        built.push({
          title: `Complete guide to ${suggestion}`,
          keyword: suggestion,
          mentions: term.count,
          type: "Pillar guide",
          why: `Your site already mentions “${term.term}” ${term.count}× — expand into a ranking page.`,
        });
        if (question) {
          built.push({
            title: question,
            keyword: question,
            mentions: term.count,
            type: "FAQ / AIO answer",
            why: "Live Google Suggest question — strong AIO/GEO target.",
          });
        }
      }
      setDomain(site.overview.domain);
      setIdeas(built.slice(0, 20));
    } catch (err) {
      setIdeas([]);
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <LiveSearch
        placeholder="Your website"
        example="example.com"
        buttonLabel="Build content plan"
        loading={loading}
        onSubmit={run}
      />
      <LiveStatus
        error={error}
        info="Live plan from your crawled terms + Google Suggest questions — actionable briefs for your site."
      />
      {ideas.length ? (
        <div className="space-y-4">
          <MetricCard label="Site" value={domain} hint={`${ideas.length} opportunities`} />
          <Panel title="Content opportunities">
            <DataTable headers={["Type", "Title / angle", "Keyword", "On-site mentions", "Why"]}>
              {ideas.map((idea) => (
                <tr key={`${idea.type}-${idea.keyword}`}>
                  <td>
                    <span className="badge badge-info">{idea.type}</span>
                  </td>
                  <td className="font-semibold">{idea.title}</td>
                  <td>{idea.keyword}</td>
                  <td>{idea.mentions}</td>
                  <td className="max-w-[280px] text-ink-soft">{idea.why}</td>
                </tr>
              ))}
            </DataTable>
          </Panel>
        </div>
      ) : null}
    </div>
  );
}
