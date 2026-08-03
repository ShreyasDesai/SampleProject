"use client";

import { useState } from "react";
import { AnalyzerForm, Field } from "@/components/app/AnalyzerForm";
import { analyzeAso } from "@/lib/analyzers";

const SAMPLE = {
  appName: "Pulse Habit Tracker",
  subtitle: "Build routines that stick",
  category: "Health & Fitness",
  keywords:
    "habit tracker, routine, streak, goals, mindfulness, productivity, daily planner, wellness",
  description: `Pulse helps you build lasting habits with streaks, reminders, and gentle accountability.

Track daily routines, visualize progress, and stay consistent without overwhelm. Whether you are building a morning ritual or training for a marathon, Pulse adapts to your goals.

Features:
- Smart reminders timed to your best windows
- Streak protection for busy days
- Shared habits with friends
- Apple Health and Google Fit sync

Download Pulse and turn intention into identity.`,
};

export default function AsoPage() {
  const [form, setForm] = useState(SAMPLE);

  return (
    <AnalyzerForm
      title="ASO analyzer"
      subtitle="Optimize App Store and Play listing fields for discoverability and conversion."
      onSample={() => setForm(SAMPLE)}
      onAnalyze={() => analyzeAso(form)}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="App name">
          <input
            className="input-field"
            value={form.appName}
            onChange={(e) => setForm({ ...form, appName: e.target.value })}
            required
          />
        </Field>
        <Field label="Subtitle / short description">
          <input
            className="input-field"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            required
          />
        </Field>
      </div>
      <Field label="Category">
        <input
          className="input-field"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
      </Field>
      <Field label="Keyword field (comma-separated)">
        <textarea
          className="input-field min-h-24"
          value={form.keywords}
          onChange={(e) => setForm({ ...form, keywords: e.target.value })}
        />
      </Field>
      <Field label="Full description">
        <textarea
          className="input-field min-h-48"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
      </Field>
    </AnalyzerForm>
  );
}
