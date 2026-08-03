import Link from "next/link";
import { BRAND } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden atmosphere grain">
      <div className="pointer-events-none absolute inset-0">
        <svg
          className="animate-drift absolute -right-[8%] top-[-5%] h-[78%] w-[78%] opacity-80"
          viewBox="0 0 800 800"
          fill="none"
          aria-hidden
        >
          <defs>
            <radialGradient id="beam" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#14856f" stopOpacity="0.55" />
              <stop offset="45%" stopColor="#e8a317" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#e8a317" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="ray" x1="0" y1="400" x2="800" y2="400">
              <stop offset="0%" stopColor="#14856f" stopOpacity="0" />
              <stop offset="50%" stopColor="#14856f" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#e8a317" stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle cx="520" cy="280" r="260" fill="url(#beam)" className="animate-pulse-soft" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * Math.PI) / 6;
            const x2 = 520 + Math.cos(a) * 340;
            const y2 = 280 + Math.sin(a) * 340;
            return (
              <line
                key={i}
                x1="520"
                y1="280"
                x2={x2}
                y2={y2}
                stroke="url(#ray)"
                strokeWidth="2"
                opacity={0.55}
              />
            );
          })}
          <circle cx="520" cy="280" r="18" fill="#0d5c4d" />
          <circle cx="520" cy="280" r="8" fill="#e8a317" />
        </svg>
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-5 pb-20 pt-28 sm:px-8 sm:pb-28 sm:pt-32">
        <p className="animate-rise font-display text-6xl font-extrabold leading-[0.92] tracking-[-0.04em] text-ink sm:text-7xl md:text-8xl lg:text-9xl">
          {BRAND.name}
        </p>
        <h1 className="animate-rise-delay-1 mt-6 max-w-xl font-display text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl md:text-4xl">
          {BRAND.tagline}
        </h1>
        <p className="animate-rise-delay-2 mt-5 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg">
          One workspace for SEO, ASO, GEO, and AIO — illuminate rankings across
          search engines, app stores, and generative answers.
        </p>
        <div className="animate-rise-delay-3 mt-9 flex flex-wrap items-center gap-3">
          <Link href="/app" className="btn-primary">
            Launch workspace
          </Link>
          <a href="#pillars" className="btn-secondary">
            Explore pillars
          </a>
        </div>
      </div>
    </section>
  );
}
