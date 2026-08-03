"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import type { AnalysisResult } from "@/lib/analyzers/types";
import { ResultPanel } from "./ResultPanel";

export function AnalyzerForm({
  title,
  subtitle,
  children,
  onAnalyze,
  sampleLabel = "Load sample",
  onSample,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  onAnalyze: () => AnalysisResult;
  sampleLabel?: string;
  onSample: () => void;
}) {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setAnalyzing(true);
    window.setTimeout(() => {
      setResult(onAnalyze());
      setAnalyzing(false);
    }, 280);
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-ink-soft">{subtitle}</p>
      </header>

      <form onSubmit={handleSubmit} className="panel rounded-3xl p-6 sm:p-8">
        <div className="grid gap-4">{children}</div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="submit" className="btn-primary" disabled={analyzing}>
            {analyzing ? "Analyzing…" : "Analyze"}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              onSample();
              setResult(null);
            }}
          >
            {sampleLabel}
          </button>
        </div>
      </form>

      {result ? <ResultPanel result={result} /> : null}
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
      {children}
    </label>
  );
}
