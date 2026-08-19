import { PageHeader, Panel, StatCard, StatusBadge } from "@/components/ui";
import { formatNumber, locations } from "@/lib/mock-data";

export default function LocationsPage() {
  return (
    <div>
      <PageHeader
        title="Locations"
        description="Centralized registry of every store, franchise, and branch — hours, NAP, and performance in one place."
        action={
          <button
            type="button"
            className="rounded-full bg-ink-950 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-800"
          >
            Add location
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total locations" value={locations.length} />
        <StatCard
          label="Live"
          value={locations.filter((l) => l.status === "live").length}
        />
        <StatCard
          label="Needs attention"
          value={locations.filter((l) => l.status === "needs_attention" || l.status === "offline").length}
        />
      </div>

      <div className="mt-8">
        <Panel title="All locations">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-ink-700/50">
                  <th className="pb-3 font-semibold">Store</th>
                  <th className="pb-3 font-semibold">City</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Rating</th>
                  <th className="pb-3 font-semibold">Visits</th>
                  <th className="pb-3 font-semibold">Calls</th>
                  <th className="pb-3 font-semibold">Orders</th>
                  <th className="pb-3 font-semibold">Hours</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((loc) => (
                  <tr key={loc.id} className="border-t border-ink-900/5">
                    <td className="py-3">
                      <p className="font-semibold text-ink-950">
                        {loc.name.replace("NearReach ", "")}
                      </p>
                      <p className="text-xs text-ink-700/50">{loc.address}</p>
                    </td>
                    <td className="py-3 text-ink-800">
                      {loc.city}, {loc.state}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={loc.status} />
                    </td>
                    <td className="py-3">
                      {loc.rating}★ ({loc.reviewCount})
                    </td>
                    <td className="py-3">{formatNumber(loc.weeklyVisits)}</td>
                    <td className="py-3">{formatNumber(loc.weeklyCalls)}</td>
                    <td className="py-3">{formatNumber(loc.weeklyOrders)}</td>
                    <td className="py-3 text-xs text-ink-700/65">{loc.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}
