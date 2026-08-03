import Link from "next/link";

export function WorkspaceCTA() {
  return (
    <section
      id="workspace"
      className="border-t border-[var(--line)] bg-sea-deep py-24 text-foam sm:py-28"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-5 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">
            Open the Lumen workspace.
          </h2>
          <p className="mt-4 text-foam/75">
            Run live audits for search pages, store listings, generative
            citations, and answer-engine packages — no setup required.
          </p>
        </div>
        <Link
          href="/app"
          className="inline-flex rounded-full bg-signal px-6 py-3.5 font-semibold text-ink transition hover:bg-[#f0b42e]"
        >
          Start analyzing
        </Link>
      </div>
    </section>
  );
}
