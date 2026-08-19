import Link from "next/link";
import { PageHeader, Panel, StatCard, StatusBadge } from "@/components/ui";
import {
  dashboardStats,
  formatNumber,
  locations,
  reviews,
  campaigns,
  callLeads,
} from "@/lib/mock-data";
import { ArrowUpRight } from "lucide-react";

export default function DashboardOverview() {
  return (
    <div>
      <PageHeader
        title="Overview"
        description="National-to-hyperlocal pulse across presence, reputation, engagement, ads, calls, and commerce."
        action={
          <Link
            href="/dashboard/locations"
            className="inline-flex items-center gap-1 rounded-full bg-ink-950 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-800"
          >
            Manage locations <ArrowUpRight className="h-4 w-4" />
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Locations live"
          value={`${dashboardStats.liveLocations}/${dashboardStats.totalLocations}`}
          hint="Across India network"
        />
        <StatCard
          label="Weekly store visits"
          value={formatNumber(dashboardStats.weeklyStoreVisits)}
          hint="+12% vs last week"
        />
        <StatCard
          label="Listing health"
          value={`${dashboardStats.listingHealth}%`}
          hint="Publisher sync score"
        />
        <StatCard
          label="Marketing ROI"
          value={dashboardStats.marketingRoi}
          hint="Attributed local growth"
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Avg rating" value={dashboardStats.avgRating} hint={`${dashboardStats.openReviews} unreplied reviews`} />
        <StatCard label="Open engagements" value={dashboardStats.openEngagements} hint="Q&A · messages · social" />
        <StatCard label="Active campaigns" value={dashboardStats.activeCampaigns} hint="Spotlight hyperlocal" />
        <StatCard
          label="Weekly calls / orders"
          value={`${formatNumber(dashboardStats.weeklyCalls)} / ${formatNumber(dashboardStats.weeklyOrders)}`}
          hint="Call leads → commerce"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Panel
          title="Location health"
          action={
            <Link href="/dashboard/presence" className="text-sm font-semibold text-coral-600">
              Presence →
            </Link>
          }
        >
          <ul className="space-y-3">
            {locations.map((loc) => (
              <li
                key={loc.id}
                className="flex items-center justify-between gap-3 border-b border-ink-900/5 pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-semibold text-ink-950">{loc.name.replace("NearReach ", "")}</p>
                  <p className="text-xs text-ink-700/55">
                    {loc.city} · {loc.listingsSynced}/{loc.listingsTotal} listings
                  </p>
                </div>
                <StatusBadge status={loc.status} />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Needs attention"
          action={
            <Link href="/dashboard/reputation" className="text-sm font-semibold text-coral-600">
              Reputation →
            </Link>
          }
        >
          <ul className="space-y-3">
            {reviews
              .filter((r) => !r.replied)
              .slice(0, 4)
              .map((r) => (
                <li key={r.id} className="border-b border-ink-900/5 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-ink-950">
                      {r.author} · {r.rating}★
                    </p>
                    <StatusBadge status={r.sentiment} />
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-ink-700/65">{r.text}</p>
                  <p className="mt-1 text-[11px] text-ink-700/45">
                    {r.locationName} · {r.platform} · {r.date}
                  </p>
                </li>
              ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Spotlight performance">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-ink-700/50">
                  <th className="pb-2 font-semibold">Campaign</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 font-semibold">Conv.</th>
                  <th className="pb-2 font-semibold">CPL</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.slice(0, 3).map((c) => (
                  <tr key={c.id} className="border-t border-ink-900/5">
                    <td className="py-2.5 font-medium text-ink-950">{c.name}</td>
                    <td className="py-2.5">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-2.5">{formatNumber(c.conversions)}</td>
                    <td className="py-2.5">₹{c.cpl || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Recent call leads">
          <ul className="space-y-3">
            {callLeads.slice(0, 4).map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-3 border-b border-ink-900/5 pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-semibold text-ink-950">
                    {c.caller} · {c.intent}
                  </p>
                  <p className="text-xs text-ink-700/55">
                    {c.locationName} · {c.duration} · {c.time}
                  </p>
                </div>
                <StatusBadge status={c.status} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
