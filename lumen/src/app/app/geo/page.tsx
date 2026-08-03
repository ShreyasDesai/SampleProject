"use client";

import { useState } from "react";
import { AnalyzerForm, Field } from "@/components/app/AnalyzerForm";
import { analyzeGeo } from "@/lib/analyzers";

const SAMPLE = {
  brand: "Lumen",
  topic: "generative engine optimization",
  entities:
    "ChatGPT, Perplexity, Gemini, brand entity, citation, structured content, E-E-A-T",
  content: `Generative engine optimization (GEO) is the practice of structuring brand content so AI answer engines can cite it accurately.

Lumen helps teams improve generative engine optimization by clarifying brand entities, writing definition-led openings, and packing pages with verifiable facts.

Key GEO practices:
1. Lead with a crisp definition of the topic
2. Name related entities and how they connect
3. Include dated statistics and original research
4. Use short, quotable sentences models can extract

In 2025, more than 40% of product researchers start with an AI assistant. Brands that publish citeable GEO content earn attribution inside those answers.`,
};

export default function GeoPage() {
  const [form, setForm] = useState(SAMPLE);

  return (
    <AnalyzerForm
      title="GEO analyzer"
      subtitle="Measure how citeable your content is for ChatGPT, Perplexity, Gemini, and similar generative engines."
      onSample={() => setForm(SAMPLE)}
      onAnalyze={() => analyzeGeo(form)}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Brand">
          <input
            className="input-field"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            required
          />
        </Field>
        <Field label="Target topic / query">
          <input
            className="input-field"
            value={form.topic}
            onChange={(e) => setForm({ ...form, topic: e.target.value })}
            required
          />
        </Field>
      </div>
      <Field label="Entities (comma-separated)">
        <textarea
          className="input-field min-h-24"
          value={form.entities}
          onChange={(e) => setForm({ ...form, entities: e.target.value })}
        />
      </Field>
      <Field label="Content to optimize">
        <textarea
          className="input-field min-h-48"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />
      </Field>
    </AnalyzerForm>
  );
}
