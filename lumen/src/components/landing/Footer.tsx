import Link from "next/link";
import { BRAND } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-foam py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="font-display text-lg font-bold text-ink">{BRAND.name}</p>
          <p className="text-sm text-ink-soft">SEO · ASO · GEO · AIO</p>
        </div>
        <Link href="/app" className="text-sm font-medium text-sea hover:text-sea-bright">
          Launch app
        </Link>
      </div>
    </footer>
  );
}
