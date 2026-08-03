import { TOOL_META } from "@/lib/nav";

export function ToolHeader({ path }: { path: keyof typeof TOOL_META | string }) {
  const meta = TOOL_META[path];
  if (!meta) return null;
  return (
    <header className="mb-5">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {meta.title}
      </h1>
      <p className="mt-2 max-w-3xl text-ink-soft">{meta.blurb}</p>
    </header>
  );
}
