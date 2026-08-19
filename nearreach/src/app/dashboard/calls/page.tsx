import { PageHeader, Panel, StatCard, StatusBadge } from "@/components/ui";
import { callLeads } from "@/lib/mock-data";

export default function CallsPage() {
  return (
    <div>
      <PageHeader
        title="Call Leads"
        description="Granular visibility into inbound calls — virtual numbers, intent detection, transcription, and conversion tracking per location."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Calls today" value={callLeads.length} />
        <StatCard
          label="Qualified"
          value={callLeads.filter((c) => c.status === "qualified" || c.status === "converted").length}
        />
        <StatCard
          label="Missed"
          value={callLeads.filter((c) => c.status === "missed").length}
          hint="Callback queue"
        />
        <StatCard
          label="Transcribed"
          value={callLeads.filter((c) => c.transcribed).length}
        />
      </div>

      <div className="mt-8">
        <Panel title="Call log">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-ink-700/50">
                  <th className="pb-3 font-semibold">Caller</th>
                  <th className="pb-3 font-semibold">Location</th>
                  <th className="pb-3 font-semibold">Duration</th>
                  <th className="pb-3 font-semibold">Intent</th>
                  <th className="pb-3 font-semibold">Sentiment</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">When</th>
                  <th className="pb-3 font-semibold">Transcript</th>
                </tr>
              </thead>
              <tbody>
                {callLeads.map((c) => (
                  <tr key={c.id} className="border-t border-ink-900/5">
                    <td className="py-3 font-semibold text-ink-950">{c.caller}</td>
                    <td className="py-3">{c.locationName}</td>
                    <td className="py-3">{c.duration}</td>
                    <td className="py-3">{c.intent}</td>
                    <td className="py-3">
                      <StatusBadge status={c.sentiment} />
                    </td>
                    <td className="py-3">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3 text-ink-700/60">{c.time}</td>
                    <td className="py-3">
                      {c.transcribed ? (
                        <button
                          type="button"
                          className="text-xs font-semibold text-coral-600 hover:underline"
                        >
                          View
                        </button>
                      ) : (
                        <span className="text-xs text-ink-700/40">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Intent mix">
          <div className="grid gap-3 sm:grid-cols-5">
            {(["Purchase", "Inquiry", "Support", "Appointment", "Spam"] as const).map(
              (intent) => {
                const count = callLeads.filter((c) => c.intent === intent).length;
                return (
                  <div
                    key={intent}
                    className="rounded-xl bg-moss-50 px-4 py-4 text-center"
                  >
                    <p className="font-display text-2xl font-semibold text-ink-950">
                      {count}
                    </p>
                    <p className="mt-1 text-xs font-medium text-ink-700/60">
                      {intent}
                    </p>
                  </div>
                );
              }
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
