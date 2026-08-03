"use client";

import { useState } from "react";
import { AnalyzerForm, Field } from "@/components/app/AnalyzerForm";
import { analyzeAio } from "@/lib/analyzers";

const SAMPLE = {
  question: "What is AI optimization for answer engines?",
  answer:
    "AI optimization (AIO) is the practice of packaging content as clear questions, direct answers, atomic facts, and sources so answer engines can extract and attribute your response. AIO sits beside SEO and GEO: SEO wins ranked links, GEO wins generative citations, and AIO wins the short answer itself.",
  facts: `Answer engines prefer 60–180 word extractable responses
Direct first sentences improve citation likelihood
FAQPage schema helps machines parse Q&A pairs
Primary sources increase attribution confidence
Freshness signals matter for time-sensitive topics`,
  sources: `https://schema.org/FAQPage
https://developers.google.com/search/docs/appearance/structured-data/faqpage
https://example.com/research/aio-2026`,
};

export default function AioPage() {
  const [form, setForm] = useState(SAMPLE);

  return (
    <AnalyzerForm
      title="AIO analyzer"
      subtitle="Craft answer-engine packages: question, direct response, supporting facts, and sources."
      onSample={() => setForm(SAMPLE)}
      onAnalyze={() => analyzeAio(form)}
    >
      <Field label="Target question">
        <input
          className="input-field"
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
          required
        />
      </Field>
      <Field label="Direct answer">
        <textarea
          className="input-field min-h-32"
          value={form.answer}
          onChange={(e) => setForm({ ...form, answer: e.target.value })}
          required
        />
      </Field>
      <Field label="Supporting facts (one per line)">
        <textarea
          className="input-field min-h-32"
          value={form.facts}
          onChange={(e) => setForm({ ...form, facts: e.target.value })}
        />
      </Field>
      <Field label="Sources (URLs or citations)">
        <textarea
          className="input-field min-h-28"
          value={form.sources}
          onChange={(e) => setForm({ ...form, sources: e.target.value })}
        />
      </Field>
    </AnalyzerForm>
  );
}
