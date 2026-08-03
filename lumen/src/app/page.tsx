import Link from "next/link";
import { Footer } from "@/components/landing/Footer";
import { LandingNav } from "@/components/landing/LandingNav";
import { BRAND, LANDING_FEATURES } from "@/lib/constants";

export default function HomePage() {
  return (
    <>
      <LandingNav />
      <main>
        <section className="relative min-h-[100svh] overflow-hidden atmosphere grain">
          <div className="pointer-events-none absolute inset-0">
            <svg
              className="animate-drift absolute -right-[10%] top-[-8%] h-[82%] w-[82%] opacity-80"
              viewBox="0 0 800 800"
              fill="none"
              aria-hidden
            >
              <defs>
                <radialGradient id="beam" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#14856f" stopOpacity="0.5" />
                  <stop offset="55%" stopColor="#e7a116" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="#e7a116" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="520" cy="280" r="270" fill="url(#beam)" className="animate-pulse-soft" />
              {Array.from({ length: 14 }).map((_, i) => {
                const a = (i * Math.PI) / 7;
                return (
                  <line
                    key={i}
                    x1="520"
                    y1="280"
                    x2={520 + Math.cos(a) * 350}
                    y2={280 + Math.sin(a) * 350}
                    stroke="#14856f"
                    strokeOpacity="0.25"
                    strokeWidth="2"
                  />
                );
              })}
              <circle cx="520" cy="280" r="16" fill="#0f6b5c" />
              <circle cx="520" cy="280" r="7" fill="#e7a116" />
            </svg>
          </div>

          <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-5 pb-20 pt-28 sm:px-8">
            <p className="animate-rise font-display text-6xl font-extrabold leading-[0.92] tracking-[-0.04em] text-ink sm:text-7xl md:text-8xl lg:text-9xl">
              {BRAND.name}
            </p>
            <h1 className="animate-rise-delay-1 mt-6 max-w-2xl font-display text-2xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
              {BRAND.tagline}
            </h1>
            <p className="animate-rise-delay-2 mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
              Site Explorer, Keywords, Backlinks, Site Audit, Rank Tracker, ASO, GEO, and AIO —
              built to compete with Ahrefs and Semrush, plus AI-search visibility they barely cover.
            </p>
            <div className="animate-rise-delay-3 mt-9 flex flex-wrap gap-3">
              <Link href="/app" className="btn-primary">
                Launch platform
              </Link>
              <a href="#platform" className="btn-secondary">
                See modules
              </a>
            </div>
          </div>
        </section>

        <section id="platform" className="border-t border-line bg-panel py-24 sm:py-28">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="font-display text-sm font-bold uppercase tracking-[0.18em] text-sea">
              Platform
            </p>
            <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
              Everything growth teams open Ahrefs or Semrush for — and the AI layer they still bolt on.
            </h2>
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {LANDING_FEATURES.map((f) => (
                <div key={f.title} className="border-t border-line pt-5">
                  <h3 className="font-display text-2xl font-bold text-ink">{f.title}</h3>
                  <p className="mt-2 text-ink-soft">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-line atmosphere py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
              Built for operators who live in the data.
            </h2>
            <p className="mt-4 max-w-2xl text-ink-soft">
              Dense tables, trend charts, KD scoring, SERP feature detection, crawl health,
              competitive gaps, store intelligence, and generative citation tracking — one OS.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["11", "Intelligence modules"],
                ["SEO+ASO", "Plus GEO & AIO"],
                ["1", "Unified workspace"],
              ].map(([k, v]) => (
                <div key={v} className="card p-5">
                  <p className="font-display text-4xl font-extrabold text-sea">{k}</p>
                  <p className="mt-1 text-ink-soft">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-line bg-sea-deep py-24 text-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 sm:flex-row sm:items-end sm:justify-between sm:px-8">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">
                Open the Lumen platform.
              </h2>
              <p className="mt-4 text-white/70">
                Explore domains, keywords, backlinks, audits, ranks, ASO, and AI visibility without leaving the workspace.
              </p>
            </div>
            <Link
              href="/app"
              className="inline-flex rounded-full bg-signal px-6 py-3.5 font-semibold text-ink transition hover:bg-[#f0b42e]"
            >
              Start exploring
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
