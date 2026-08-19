import { PageHeader, Panel, StatCard, StatusBadge } from "@/components/ui";
import { locations, publishers } from "@/lib/mock-data";

export default function PresencePage() {
  return (
    <div>
      <PageHeader
        title="Presence Management"
        description="Establish local digital presence — store locator pages, publisher sync, and location-level content so customers find the nearest outlet."
        action={
          <button
            type="button"
            className="rounded-full bg-coral-500 px-4 py-2 text-sm font-semibold text-white hover:bg-coral-400"
          >
            Sync all publishers
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Publishers connected" value={publishers.length} />
        <StatCard
          label="Fully synced stores"
          value={locations.filter((l) => l.listingsSynced === l.listingsTotal).length}
        />
        <StatCard
          label="Avg sync rate"
          value={`${Math.round(
            (locations.reduce((s, l) => s + l.listingsSynced / l.listingsTotal, 0) /
              locations.length) *
              100
          )}%`}
        />
        <StatCard label="Store pages live" value={locations.filter((l) => l.status !== "offline").length} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Panel title="Publisher health">
          <ul className="space-y-4">
            {publishers.map((p) => (
              <li key={p.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-ink-950">{p.name}</span>
                  <span className="text-ink-700/60">
                    {p.synced}/{p.total} · {p.health}%
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-moss-100">
                  <div
                    className="h-full rounded-full bg-ink-800"
                    style={{ width: `${p.health}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Location listing sync">
          <ul className="space-y-3">
            {locations.map((loc) => (
              <li
                key={loc.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-ink-900/6 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-ink-950">
                    {loc.city}
                  </p>
                  <p className="text-xs text-ink-700/55">
                    {loc.listingsSynced}/{loc.listingsTotal} publishers · NAP · hours · offers
                  </p>
                </div>
                <StatusBadge status={loc.status} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Location page content">
          <p className="mb-4 text-sm text-ink-700/65">
            Enrich each store page with hours, payment methods, parking, local offers,
            and in-stock inventory to lift local SEO and conversion.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Business hours & holidays",
              "Payment methods",
              "Parking availability",
              "Local offers & festivals",
              "In-stock inventory teasers",
              "Store photos & amenities",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl bg-moss-50 px-4 py-3 text-sm font-medium text-ink-900"
              >
                {item}
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
