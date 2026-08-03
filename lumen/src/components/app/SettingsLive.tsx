"use client";

import { useEffect, useState } from "react";
import { LiveStatus, postJson } from "@/components/app/LiveSearch";
import { MetricCard, Panel } from "@/components/ui/Primitives";

export function SettingsLive() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [sandbox, setSandbox] = useState(true);
  const [status, setStatus] = useState<{ configured: boolean; sandbox: boolean } | null>(null);
  const [hints, setHints] = useState<{ dataforseo: string; freeStack: string } | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    const res = await fetch("/api/settings").then((r) => r.json());
    setStatus(res.dataForSeo);
    setHints(res.hints);
  }

  useEffect(() => {
    refresh().catch(() => undefined);
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await postJson<{ note: string; dataForSeo: { configured: boolean; sandbox: boolean } }>(
        "/api/settings",
        { login, password, sandbox },
      );
      setStatus(res.dataForSeo);
      setMessage(res.note);
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <LiveStatus
        error={error}
        info={hints?.freeStack}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard
          label="DataForSEO"
          value={status?.configured ? "Connected" : "Not configured"}
          hint={status?.sandbox ? "Sandbox mode" : status?.configured ? "Live mode" : "Optional"}
        />
        <MetricCard label="Free live stack" value="Ready" hint="Crawl · Suggest · Audit" />
      </div>

      <Panel title="Connect DataForSEO (volume, KD, SERP, backlinks)">
        <p className="mb-4 text-sm text-ink-soft">
          {hints?.dataforseo}
        </p>
        <form onSubmit={save} className="grid max-w-xl gap-3">
          <label className="text-sm font-semibold">
            API login
            <input className="input-field mt-1" value={login} onChange={(e) => setLogin(e.target.value)} required />
          </label>
          <label className="text-sm font-semibold">
            API password
            <input
              className="input-field mt-1"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={sandbox} onChange={(e) => setSandbox(e.target.checked)} />
            Use sandbox (free testing)
          </label>
          <button className="btn-primary w-fit" disabled={saving}>
            {saving ? "Saving…" : "Save credentials"}
          </button>
        </form>
        {message ? <p className="mt-3 text-sm text-ok">{message}</p> : null}
      </Panel>
    </div>
  );
}
