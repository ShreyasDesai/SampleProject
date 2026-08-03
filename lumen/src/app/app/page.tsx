import type { Metadata } from "next";
import Link from "next/link";
import { MODULES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Workspace",
};

export default function AppOverviewPage() {
  return (
    <div className="space-y-10">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sea">Overview</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Choose a visibility surface.
        </h1>
        <p className="mt-3 max-w-2xl text-ink-soft">
          Run instant audits for search pages, app listings, generative
          citations, and answer-engine packages. Each module returns a score,
          metrics, and prioritized fixes.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {MODULES.map((mod) => (
          <Link
            key={mod.id}
            href={mod.href}
            className="panel group rounded-3xl p-6 transition duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow)] sm:p-7"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display text-3xl font-extrabold text-ink">{mod.name}</h2>
              <span className="text-sm text-sea opacity-0 transition-opacity group-hover:opacity-100">
                Open →
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-sea-bright">{mod.full}</p>
            <p className="mt-3 text-ink-soft">{mod.detail}</p>
          </Link>
        ))}
      </div>

      <section className="panel rounded-3xl p-6 sm:p-8">
        <h2 className="font-display text-2xl font-bold text-ink">What Lumen checks</h2>
        <ul className="mt-4 grid gap-3 text-sm text-ink-soft sm:grid-cols-2">
          <li>Title, meta, keyword density, and content depth for SEO</li>
          <li>App name, subtitle, keyword field, and store description for ASO</li>
          <li>Brand entities, definitions, facts, and citeability for GEO</li>
          <li>Question framing, direct answers, sources, and facts for AIO</li>
        </ul>
      </section>
    </div>
  );
}
