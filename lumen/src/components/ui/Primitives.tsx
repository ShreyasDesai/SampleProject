import clsx from "clsx";
import type { ReactNode } from "react";

export function MetricCard({
  label,
  value,
  hint,
  delta,
  deltaPositive,
}: {
  label: string;
  value: string | number;
  hint?: string;
  delta?: string;
  deltaPositive?: boolean;
}) {
  return (
    <div className="card p-4 sm:p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">{label}</p>
      <p className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        {value}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
        {delta ? (
          <span className={clsx("font-bold", deltaPositive ? "text-ok" : "text-danger")}>
            {delta}
          </span>
        ) : null}
        {hint ? <span className="text-muted">{hint}</span> : null}
      </div>
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={clsx("card p-4 sm:p-5", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title ? <h2 className="font-display text-lg font-bold text-ink">{title}</h2> : <span />}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function KdBadge({ kd }: { kd: number }) {
  const cls = kd < 30 ? "kd-easy" : kd < 60 ? "kd-mid" : "kd-hard";
  return <span className={clsx("kd", cls)}>{kd}</span>;
}

export function PositionDelta({ current, previous }: { current: number; previous: number }) {
  const diff = previous - current;
  if (diff === 0) return <span className="text-muted">—</span>;
  const up = diff > 0;
  return (
    <span className={clsx("font-bold", up ? "text-ok" : "text-danger")}>
      {up ? "▲" : "▼"} {Math.abs(diff)}
    </span>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="card grid place-items-center px-6 py-16 text-center">
      <h2 className="font-display text-2xl font-bold text-ink">{title}</h2>
      <p className="mt-2 max-w-md text-ink-soft">{body}</p>
    </div>
  );
}
