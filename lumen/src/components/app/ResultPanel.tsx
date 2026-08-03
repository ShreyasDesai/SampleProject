"use client";

import type { AnalysisResult, Severity } from "@/lib/analyzers/types";

const SEVERITY_STYLES: Record<Severity, string> = {
  critical: "text-[#9f1d1d] bg-[#9f1d1d]/10",
  high: "text-[#9a4d00] bg-[#e8a317]/18",
  medium: "text-sea bg-sea/10",
  low: "text-ink-soft bg-ink/5",
  pass: "text-sea-bright bg-sea/8",
};

export function ScoreRing({ score, grade }: { score: number; grade: string }) {
  const offset = 314 - (314 * Math.min(Math.max(score, 0), 100)) / 100;
  return (
    <div className="relative grid h-36 w-36 place-items-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120" aria-hidden>
        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(11,31,28,0.08)" strokeWidth="10" />
        <circle
          key={score}
          className="score-ring"
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="#14856f"
          strokeWidth="10"
          strokeLinecap="round"
          style={{ strokeDashoffset: offset }}
        />
      </svg>
      <div className="text-center">
        <p className="font-display text-3xl font-extrabold text-ink">{score}</p>
        <p className="text-xs font-semibold uppercase tracking-wider text-sea">{grade}</p>
      </div>
    </div>
  );
}

export function ResultPanel({ result }: { result: AnalysisResult }) {
  return (
    <div className="panel rounded-3xl p-6 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sea">
            {result.module.toUpperCase()} score
          </p>
          <p className="mt-2 text-lg text-ink-soft">{result.summary}</p>
        </div>
        <ScoreRing score={result.score} grade={result.grade} />
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {result.metrics.map((m) => (
          <div key={m.label} className="rounded-2xl border border-[var(--line)] bg-white/50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{m.label}</p>
            <p className="mt-1 font-display text-xl font-bold text-ink">{m.value}</p>
            {m.hint ? <p className="mt-1 text-xs text-ink-soft">{m.hint}</p> : null}
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        <h3 className="font-display text-xl font-bold text-ink">Insights</h3>
        {result.insights.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-[var(--line)] bg-white/45 px-4 py-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${SEVERITY_STYLES[item.severity]}`}
              >
                {item.severity}
              </span>
              <p className="font-semibold text-ink">{item.title}</p>
            </div>
            <p className="mt-1.5 text-sm text-ink-soft">{item.detail}</p>
            {item.tip ? (
              <p className="mt-2 text-sm text-sea">
                <span className="font-semibold">Fix:</span> {item.tip}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      {result.keywords.length > 0 ? (
        <div className="mt-8">
          <h3 className="font-display text-xl font-bold text-ink">Detected terms</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {result.keywords.map((kw) => (
              <span
                key={kw}
                className="rounded-md border border-[var(--line)] bg-mist/70 px-2.5 py-1 text-sm text-ink-soft"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
