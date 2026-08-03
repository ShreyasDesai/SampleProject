const STEPS = [
  {
    n: "01",
    title: "Paste your assets",
    body: "Drop in page copy, app listing fields, or the Q&A you want AI engines to cite.",
  },
  {
    n: "02",
    title: "Score each surface",
    body: "Lumen runs heuristic checks tuned for SEO, ASO, GEO, and AIO signals.",
  },
  {
    n: "03",
    title: "Ship the fixes",
    body: "Prioritized insights tell you what to rewrite, structure, and cite next.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative overflow-hidden border-t border-[var(--line)] atmosphere py-24 sm:py-32">
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <p className="font-display text-sm font-bold uppercase tracking-[0.18em] text-sea">
          How it works
        </p>
        <h2 className="mt-3 max-w-xl font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
          From draft to discoverable in three moves.
        </h2>

        <ol className="mt-14 grid gap-12 md:grid-cols-3">
          {STEPS.map((step) => (
            <li key={step.n}>
              <span className="font-display text-5xl font-extrabold text-sea/25">{step.n}</span>
              <h3 className="mt-3 font-display text-2xl font-bold text-ink">{step.title}</h3>
              <p className="mt-2 text-ink-soft">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
