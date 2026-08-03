"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, type FormEvent } from "react";

export function ExplorerSearch({
  param = "q",
  placeholder,
  example,
  buttonLabel = "Analyze",
}: {
  param?: string;
  placeholder: string;
  example: string;
  buttonLabel?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get(param) || "";
  const inputRef = useRef<HTMLInputElement>(null);

  function go(q: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(param, q);
    router.push(`?${params.toString()}`);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    go(inputRef.current?.value.trim() || example);
  }

  return (
    <form onSubmit={submit} className="card flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:p-4">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          key={current || "empty"}
          ref={inputRef}
          className="input-field !pl-10"
          defaultValue={current}
          placeholder={placeholder}
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary whitespace-nowrap">
          {buttonLabel}
        </button>
        <button type="button" className="btn-secondary whitespace-nowrap" onClick={() => go(example)}>
          Try sample
        </button>
      </div>
    </form>
  );
}
