/** Deterministic PRNG utilities — same seed always yields the same “index” data. */

export function hashString(input: string): number {
  let h = 2166136261;
  const s = input.toLowerCase().trim();
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function pick<T>(rand: () => number, arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)]!;
}

export function pickN<T>(rand: () => number, arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  while (out.length < n && copy.length) {
    const i = Math.floor(rand() * copy.length);
    out.push(copy.splice(i, 1)[0]!);
  }
  return out;
}

export function int(rand: () => number, min: number, max: number) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

export function float(rand: () => number, min: number, max: number, digits = 1) {
  const v = min + rand() * (max - min);
  const p = 10 ** digits;
  return Math.round(v * p) / p;
}

export function normalizeDomain(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "")
    .replace(/\s+/g, "");
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(Math.round(n));
}

export function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${Math.round(n)}`;
}

export function formatPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function monthsBack(count: number): string[] {
  const labels: string[] = [];
  const now = new Date(2026, 7, 1); // Aug 2026 aligned with environment
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(d.toLocaleString("en-US", { month: "short", year: "2-digit" }));
  }
  return labels;
}

export function titleCase(s: string) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}
