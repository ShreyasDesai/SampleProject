"use client";

import { useState } from "react";
import { PageHeader, Panel, StatCard, StatusBadge } from "@/components/ui";
import { reviews } from "@/lib/mock-data";

export default function ReputationPage() {
  const [items, setItems] = useState(reviews);
  const unreplied = items.filter((r) => !r.replied).length;
  const avg =
    items.reduce((s, r) => s + r.rating, 0) / (items.length || 1);

  function reply(id: string) {
    setItems((prev) =>
      prev.map((r) => (r.id === id ? { ...r, replied: true } : r))
    );
  }

  return (
    <div>
      <PageHeader
        title="Reputation Management"
        description="From national to hyperlocal — monitor, analyze, and respond to reviews across Google, Facebook, Apple Maps, and more."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Avg rating" value={avg.toFixed(1)} />
        <StatCard label="Total reviews" value={items.length} />
        <StatCard label="Awaiting reply" value={unreplied} hint="Respond within SLA" />
        <StatCard
          label="Negative open"
          value={items.filter((r) => r.sentiment === "negative" && !r.replied).length}
        />
      </div>

      <div className="mt-8">
        <Panel title="Review inbox">
          <ul className="space-y-4">
            {items.map((r) => (
              <li
                key={r.id}
                className="rounded-xl border border-ink-900/6 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-ink-950">{r.author}</p>
                    <span className="text-sm text-coral-500">
                      {"★".repeat(r.rating)}
                      <span className="text-ink-900/20">
                        {"★".repeat(5 - r.rating)}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={r.sentiment} />
                    {r.replied ? (
                      <StatusBadge status="replied" />
                    ) : (
                      <span className="text-xs font-semibold text-coral-600">
                        Unreplied
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-800/80">
                  {r.text}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-ink-700/50">
                    {r.locationName} · {r.platform} · {r.date}
                  </p>
                  {!r.replied && (
                    <button
                      type="button"
                      onClick={() => reply(r.id)}
                      className="rounded-full bg-ink-950 px-3 py-1.5 text-xs font-semibold text-white hover:bg-ink-800"
                    >
                      Reply with template
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
