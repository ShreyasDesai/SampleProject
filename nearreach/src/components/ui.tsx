import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-950">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-700/70">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-ink-900/6 bg-white p-5 shadow-sm shadow-ink-950/5">
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-700/55">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-semibold text-ink-950">{value}</p>
      {hint && <p className="mt-1 text-xs text-moss-500">{hint}</p>}
    </div>
  );
}

export function Panel({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-ink-900/6 bg-white shadow-sm shadow-ink-950/5">
      <div className="flex items-center justify-between border-b border-ink-900/6 px-5 py-4">
        <h2 className="font-display text-lg font-semibold text-ink-950">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles: Record<string, string> = {
    live: "bg-moss-100 text-ink-800",
    syncing: "bg-sand-200 text-ink-800",
    needs_attention: "bg-coral-500/15 text-coral-600",
    offline: "bg-ink-900/10 text-ink-700",
    active: "bg-moss-100 text-ink-800",
    paused: "bg-sand-200 text-ink-800",
    draft: "bg-ink-900/8 text-ink-700",
    completed: "bg-moss-200 text-ink-800",
    open: "bg-coral-500/15 text-coral-600",
    replied: "bg-moss-100 text-ink-800",
    escalated: "bg-coral-500/20 text-coral-600",
    new: "bg-sand-200 text-ink-800",
    qualified: "bg-moss-100 text-ink-800",
    converted: "bg-moss-200 text-ink-900",
    missed: "bg-coral-500/15 text-coral-600",
    in_stock: "bg-moss-100 text-ink-800",
    low: "bg-sand-200 text-ink-800",
    out: "bg-coral-500/15 text-coral-600",
    positive: "bg-moss-100 text-ink-800",
    neutral: "bg-sand-200 text-ink-800",
    negative: "bg-coral-500/15 text-coral-600",
    high: "bg-coral-500/15 text-coral-600",
    medium: "bg-sand-200 text-ink-800",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
        styles[status] ?? "bg-ink-900/8 text-ink-700"
      }`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

export function EmptyHint({ children }: { children: ReactNode }) {
  return <p className="text-sm text-ink-700/60">{children}</p>;
}
