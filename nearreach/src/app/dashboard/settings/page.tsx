"use client";

import { useState } from "react";
import { PageHeader, Panel, StatCard } from "@/components/ui";
import { locations } from "@/lib/mock-data";

const roles = [
  { role: "Brand admin", access: "All modules · approve edits · billing" },
  { role: "Regional manager", access: "Region locations · campaigns · reviews" },
  { role: "Store manager", access: "Own location · inventory · reply reviews" },
  { role: "Agency partner", access: "Ads & presence · no billing" },
];

export default function SettingsPage() {
  const [toggles, setToggles] = useState(
    Object.fromEntries(locations.map((l) => [l.id, l.status !== "offline"]))
  );

  return (
    <div>
      <PageHeader
        title="Configuration Center"
        description="Manage the near-me journey from discovery to transaction — switch locations, edit hours, control roles, and configure reputation workflows."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Locations configured" value={locations.length} />
        <StatCard
          label="Currently live"
          value={Object.values(toggles).filter(Boolean).length}
        />
        <StatCard label="Role templates" value={roles.length} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Panel title="Location-level configuration">
          <ul className="space-y-3">
            {locations.map((loc) => (
              <li
                key={loc.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-ink-900/6 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-ink-950">
                    {loc.name.replace("NearReach ", "")}
                  </p>
                  <p className="text-xs text-ink-700/55">{loc.hours}</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setToggles((t) => ({ ...t, [loc.id]: !t[loc.id] }))
                  }
                  className={`relative h-7 w-12 rounded-full transition ${
                    toggles[loc.id] ? "bg-moss-500" : "bg-ink-900/20"
                  }`}
                  aria-label={`Toggle ${loc.city}`}
                >
                  <span
                    className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
                      toggles[loc.id] ? "left-5" : "left-0.5"
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-ink-700/50">
            Toggle stores on/off, update hours, and post location-level offers from
            one hub.
          </p>
        </Panel>

        <Panel title="Role management">
          <ul className="space-y-3">
            {roles.map((r) => (
              <li
                key={r.role}
                className="rounded-xl bg-moss-50 px-4 py-3"
              >
                <p className="text-sm font-semibold text-ink-950">{r.role}</p>
                <p className="mt-0.5 text-xs text-ink-700/60">{r.access}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-ink-700/50">
            Flexible workflows: request edits, approve field changes, or automate
            brand responses.
          </p>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Reputation workflow">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              "Central team replies to all reviews",
              "Store managers reply to own location",
              "Smart automation for 4–5★ reviews",
            ].map((opt, i) => (
              <label
                key={opt}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-ink-900/6 p-4"
              >
                <input
                  type="radio"
                  name="rep-flow"
                  defaultChecked={i === 2}
                  className="mt-1 accent-coral-500"
                />
                <span className="text-sm text-ink-800">{opt}</span>
              </label>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
