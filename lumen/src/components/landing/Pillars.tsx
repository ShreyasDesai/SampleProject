import Link from "next/link";
import { MODULES } from "@/lib/constants";

export function Pillars() {
  return (
    <section id="pillars" className="relative border-t border-[var(--line)] bg-foam py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="font-display text-sm font-bold uppercase tracking-[0.18em] text-sea">
          Four discovery surfaces
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
          Optimize every path to being found.
        </h2>
        <p className="mt-4 max-w-xl text-ink-soft">
          Classic search, app stores, generative engines, and answer boxes each
          reward different signals. Lumen scores them in one place.
        </p>

        <div className="mt-14 grid gap-10 sm:grid-cols-2">
          {MODULES.map((mod, i) => (
            <Link
              key={mod.id}
              href={mod.href}
              className="group block border-t border-[var(--line)] pt-6 transition-transform duration-300 hover:-translate-y-0.5"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
                  {mod.name}
                </h3>
                <span className="text-sm text-sea opacity-0 transition-opacity group-hover:opacity-100">
                  Open →
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-sea-bright">{mod.full}</p>
              <p className="mt-3 max-w-md text-ink-soft">{mod.blurb}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
