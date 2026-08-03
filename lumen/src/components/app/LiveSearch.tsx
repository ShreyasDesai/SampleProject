"use client";

import { Loader2, Search } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";

export function LiveSearch({
  placeholder,
  example,
  buttonLabel = "Run live analysis",
  onSubmit,
  loading,
}: {
  placeholder: string;
  example: string;
  buttonLabel?: string;
  loading?: boolean;
  onSubmit: (query: string) => void | Promise<void>;
}) {
  const [value, setValue] = useState(example);

  async function submit(e: FormEvent) {
    e.preventDefault();
    await onSubmit(value.trim() || example);
  }

  return (
    <form onSubmit={submit} className="card flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:p-4">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          className="input-field !pl-10"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          disabled={loading}
        />
      </div>
      <button type="submit" className="btn-primary whitespace-nowrap" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Working…
          </>
        ) : (
          buttonLabel
        )}
      </button>
    </form>
  );
}

export function LiveStatus({
  error,
  info,
  children,
}: {
  error?: string | null;
  info?: string | null;
  children?: ReactNode;
}) {
  return (
    <div className="space-y-3">
      {error ? (
        <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}
      {info ? (
        <div className="rounded-xl border border-info/20 bg-info/5 px-4 py-3 text-sm text-ink-soft">
          {info}
        </div>
      ) : null}
      {children}
    </div>
  );
}

export async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data as T;
}
