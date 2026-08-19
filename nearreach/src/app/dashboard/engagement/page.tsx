"use client";

import { useState } from "react";
import { PageHeader, Panel, StatCard, StatusBadge } from "@/components/ui";
import { engagements } from "@/lib/mock-data";

export default function EngagementPage() {
  const [items, setItems] = useState(engagements);

  function markReplied(id: string) {
    setItems((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "replied" } : e))
    );
  }

  return (
    <div>
      <PageHeader
        title="Engagement Management"
        description="Interact with customers across Q&A, messages, chat, and social — address queries and augment the local experience."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open threads" value={items.filter((e) => e.status === "open").length} />
        <StatCard label="Escalated" value={items.filter((e) => e.status === "escalated").length} />
        <StatCard label="Replied today" value={items.filter((e) => e.status === "replied").length} />
        <StatCard label="High priority" value={items.filter((e) => e.priority === "high").length} />
      </div>

      <div className="mt-8">
        <Panel title="Conversation inbox">
          <ul className="space-y-3">
            {items.map((e) => (
              <li
                key={e.id}
                className="flex flex-col gap-3 rounded-xl border border-ink-900/6 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-moss-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-ink-800">
                      {e.channel}
                    </span>
                    <StatusBadge status={e.priority} />
                    <StatusBadge status={e.status} />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-ink-950">
                    {e.customer}
                  </p>
                  <p className="mt-0.5 text-sm text-ink-700/75">{e.preview}</p>
                  <p className="mt-1 text-xs text-ink-700/45">
                    {e.locationName} · {e.time}
                  </p>
                </div>
                {e.status === "open" || e.status === "escalated" ? (
                  <button
                    type="button"
                    onClick={() => markReplied(e.id)}
                    className="shrink-0 rounded-full bg-coral-500 px-4 py-2 text-xs font-semibold text-white hover:bg-coral-400"
                  >
                    Respond
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
