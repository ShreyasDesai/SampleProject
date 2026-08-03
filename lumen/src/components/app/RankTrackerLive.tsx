"use client";

import { useState } from "react";
import { LiveSearch, LiveStatus, postJson } from "@/components/app/LiveSearch";
import { DataTable } from "@/components/ui/DataTable";
import { MetricCard, Panel } from "@/components/ui/Primitives";

export function RankTrackerLive() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [rows, setRows] = useState<
    {
      keyword: string;
      position: number | null;
      url: string | null;
      title: string | null;
      suggestCount: number;
      volume: number | null;
      difficulty: number | null;
    }[]
  >([]);
  const [domain, setDomain] = useState("");

  async function run(input: string) {
    setLoading(true);
    setError(null);
    try {
      // support "domain | kw1, kw2"
      const [domPart, kwPart] = input.split("|").map((s) => s.trim());
      const keywords = kwPart
        ? kwPart.split(",").map((k) => k.trim()).filter(Boolean)
        : undefined;
      const res = await postJson<{
        domain: string;
        rows: typeof rows;
        note: string;
        dataForSeo: boolean;
      }>("/api/serp", {
        domain: domPart,
        keywords,
      });
      setDomain(res.domain);
      setRows(res.rows);
      setNote(res.note);
    } catch (err) {
      setRows([]);
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <LiveSearch
        placeholder="yourdomain.com | keyword one, keyword two"
        example="example.com | example domain, what is an example"
        buttonLabel="Check rankings"
        loading={loading}
        onSubmit={run}
      />
      <LiveStatus
        error={error}
        info={
          note ||
          "Enter your domain. Optionally add keywords after | . Without DataForSEO, we bootstrap keywords from your site content and Google Suggest coverage."
        }
      />
      {rows.length ? (
        <div className="space-y-4">
          <MetricCard label="Domain" value={domain} hint={`${rows.length} keywords checked`} />
          <Panel title="Tracked keywords">
            <DataTable headers={["Keyword", "Google pos", "Volume", "KD", "Suggests", "Ranking URL"]}>
              {rows.map((r) => (
                <tr key={r.keyword}>
                  <td className="font-semibold">{r.keyword}</td>
                  <td className="font-bold">{r.position ?? "Not in top 10*"}</td>
                  <td>{r.volume ?? "—"}</td>
                  <td>{r.difficulty ?? "—"}</td>
                  <td>{r.suggestCount}</td>
                  <td className="max-w-[240px] truncate text-sea">{r.url ?? "—"}</td>
                </tr>
              ))}
            </DataTable>
            <p className="mt-3 text-xs text-muted">
              * Live positions require DataForSEO. Configure it under Settings for Ahrefs-style rank tracking.
            </p>
          </Panel>
        </div>
      ) : null}
    </div>
  );
}
