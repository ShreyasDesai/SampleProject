import { PageHeader, Panel, StatCard } from "@/components/ui";
import { formatNumber, segments } from "@/lib/mock-data";

export default function HyperXaiPage() {
  return (
    <div>
      <PageHeader
        title="Hyper Xai"
        description="Move from unknown and non-insightful data to actionable audience intelligence — interaction signals, custom segments, and campaign management."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Audience reach"
          value={formatNumber(segments.reduce((s, seg) => s + seg.size, 0))}
        />
        <StatCard label="Active segments" value={segments.length} />
        <StatCard
          label="Top conversion"
          value={`${Math.max(...segments.map((s) => s.conversionRate))}%`}
        />
        <StatCard label="Signals tracked" value="14" hint="Calls · visits · reviews · ads" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {[
          {
            title: "Interaction intelligence",
            body: "Unify page views, calls, Q&A, reviews, and ad clicks into a location-aware customer graph.",
          },
          {
            title: "Custom segment creation",
            body: "Build audiences by radius, intent, recency, and channel — then push to Spotlight campaigns.",
          },
          {
            title: "Campaign management",
            body: "Recommend budgets, creatives, and geo-fences based on segment lift and store capacity.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-ink-900/6 bg-gradient-to-br from-white to-moss-50 p-6"
          >
            <h3 className="font-display text-xl font-semibold text-ink-950">
              {f.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-700/70">{f.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Panel title="Audience segments">
          <div className="grid gap-4 md:grid-cols-2">
            {segments.map((seg) => (
              <div
                key={seg.id}
                className="rounded-xl border border-ink-900/6 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-ink-950">{seg.name}</h3>
                  <span
                    className={`text-xs font-bold ${
                      seg.growth >= 0 ? "text-moss-500" : "text-coral-600"
                    }`}
                  >
                    {seg.growth >= 0 ? "+" : ""}
                    {seg.growth}%
                  </span>
                </div>
                <p className="mt-2 font-display text-3xl font-semibold text-ink-950">
                  {formatNumber(seg.size)}
                </p>
                <p className="mt-1 text-xs text-ink-700/55">
                  {seg.locations} locations · {seg.conversionRate}% conversion
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {seg.traits.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-moss-100 px-2.5 py-1 text-[11px] font-medium text-ink-800"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  className="mt-4 text-xs font-semibold text-coral-600 hover:underline"
                >
                  Activate in Spotlight →
                </button>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
