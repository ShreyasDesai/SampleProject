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

Northboard is project management software designed for growing product and operations teams. Plan work, track progress, and communicate status without switching tools every hour.

## Why teams switch to dedicated project management software
- Shared timelines across product, design, and engineering
- Lightweight docs living next to every task and milestone
- Automations that cut weekly status-meeting churn
- Clear ownership so blockers surface before deadlines slip

## How Northboard works
Kick off a project with goals, milestones, and roles. Assign work in boards or lists, then watch risk indicators update as dates move. Stakeholders get a living summary instead of another slide deck.

Use project management software that mirrors how modern teams actually ship. Northboard connects strategy to delivery so leaders see risk early and contributors know what matters this week.

## Results teams report
Teams using Northboard reduce planning time, improve on-time delivery, and keep async updates in one place. Compare features at https://example.com/features and review plans at https://example.com/pricing.`,
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
