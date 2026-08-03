import Link from "next/link";
import { BRAND } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-line bg-panel py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="font-display text-lg font-bold text-ink">{BRAND.name}</p>
          <p className="text-sm text-ink-soft">SEO · ASO · GEO · AIO intelligence platform</p>
        </div>
        <Link href="/app" className="text-sm font-semibold text-sea hover:text-sea-bright">
          Launch platform
        </Link>
      </div>
    </footer>
  );
}
