import { PageHeader, Panel, StatCard, StatusBadge } from "@/components/ui";
import { campaigns, formatINR, formatNumber } from "@/lib/mock-data";

export default function SpotlightPage() {
  const active = campaigns.filter((c) => c.status === "active");
  const spend = active.reduce((s, c) => s + c.spend, 0);
  const conversions = active.reduce((s, c) => s + c.conversions, 0);

  return (
    <div>
      <PageHeader
        title="Spotlight — Hyperlocal Ads"
        description="Run micro-targeted local campaigns across search, display, social, and offers. Maximize growth opportunities at each store."
        action={
          <button
            type="button"
            className="rounded-full bg-coral-500 px-4 py-2 text-sm font-semibold text-white hover:bg-coral-400"
          >
            Create campaign
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active campaigns" value={active.length} />
        <StatCard label="Spend (active)" value={formatINR(spend)} />
        <StatCard label="Conversions" value={formatNumber(conversions)} />
        <StatCard
          label="Blended CPL"
          value={`₹${Math.round(spend / (conversions || 1))}`}
        />
      </div>

      <div className="mt-8">
        <Panel title="Campaigns">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-ink-700/50">
                  <th className="pb-3 font-semibold">Name</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Locations</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Spend</th>
                  <th className="pb-3 font-semibold">Impr.</th>
                  <th className="pb-3 font-semibold">Clicks</th>
                  <th className="pb-3 font-semibold">Conv.</th>
                  <th className="pb-3 font-semibold">CPL</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id} className="border-t border-ink-900/5">
                    <td className="py-3 font-semibold text-ink-950">{c.name}</td>
                    <td className="py-3">{c.type}</td>
                    <td className="py-3">{c.locationCount}</td>
                    <td className="py-3">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3">{c.spend ? formatINR(c.spend) : "—"}</td>
                    <td className="py-3">
                      {c.impressions ? formatNumber(c.impressions) : "—"}
                    </td>
                    <td className="py-3">
                      {c.clicks ? formatNumber(c.clicks) : "—"}
                    </td>
                    <td className="py-3">
                      {c.conversions ? formatNumber(c.conversions) : "—"}
                    </td>
                    <td className="py-3">{c.cpl ? `₹${c.cpl}` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          {
            title: "Search near-me",
            desc: "Capture high-intent queries with location extensions and store pages.",
          },
          {
            title: "Offer amplification",
            desc: "Push weekend and festival offers only to geo-relevant audiences.",
          },
          {
            title: "Brand lift locally",
            desc: "Display and social to grow awareness in catchment zones around stores.",
          },
        ].map((b) => (
          <div
            key={b.title}
            className="rounded-2xl border border-ink-900/6 bg-white p-5"
          >
            <h3 className="font-display text-lg font-semibold text-ink-950">
              {b.title}
            </h3>
            <p className="mt-2 text-sm text-ink-700/65">{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
