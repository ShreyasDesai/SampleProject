"use client";

import { useState } from "react";
import { AnalyzerForm, Field } from "@/components/app/AnalyzerForm";
import { analyzeSeo } from "@/lib/analyzers";

const SAMPLE = {
  url: "https://example.com/project-management",
  title: "Project management software for growing teams | Northboard",
  metaDescription:
    "Plan sprints, align stakeholders, and ship on time with Northboard — the project management software built for product and ops teams.",
  targetKeyword: "project management software",
  content: `# Project management software that keeps teams aligned

Northboard is project management software designed for growing product teams. Plan work, track progress, and communicate status without switching tools.

## Why teams switch
- Shared timelines across product, design, and engineering
- Lightweight docs next to every task
- Automations that cut status-meeting churn

Use project management software that mirrors how modern teams actually ship. Northboard connects goals to delivery so leaders see risk early.

Learn more at https://example.com/features and compare plans at https://example.com/pricing.`,
};

export default function SeoPage() {
  const [form, setForm] = useState(SAMPLE);

  return (
    <AnalyzerForm
      title="SEO analyzer"
      subtitle="Audit on-page search signals: titles, meta descriptions, keyword placement, and content depth."
      onSample={() => setForm(SAMPLE)}
      onAnalyze={() => analyzeSeo(form)}
    >
      <Field label="URL (optional)">
        <input
          className="input-field"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          placeholder="https://"
        />
      </Field>
      <Field label="Title tag">
        <input
          className="input-field"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
      </Field>
      <Field label="Meta description">
        <textarea
          className="input-field min-h-24"
          value={form.metaDescription}
          onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
          required
        />
      </Field>
      <Field label="Target keyword">
        <input
          className="input-field"
          value={form.targetKeyword}
          onChange={(e) => setForm({ ...form, targetKeyword: e.target.value })}
          required
        />
      </Field>
      <Field label="Page content">
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
