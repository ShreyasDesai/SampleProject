"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { BRAND } from "@/lib/constants";
import { NAV } from "@/lib/nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-[260px] shrink-0 border-r border-line bg-panel lg:flex lg:flex-col">
          <div className="border-b border-line px-5 py-5">
            <Link href="/" className="font-display text-2xl font-extrabold tracking-tight text-ink">
              {BRAND.name}
            </Link>
            <p className="mt-1 text-xs text-ink-soft">Competitive intelligence suite</p>
          </div>
          <nav className="sidebar-scroll flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {NAV.map((item) => {
              const active =
                "exact" in item && item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                    active ? "bg-sea text-white" : "text-ink-soft hover:bg-panel-2 hover:text-ink",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-90" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-line p-4 text-xs text-muted">
            Demo index · deterministic synthetic data for product UX. Wire DataForSEO / your crawl cluster for production.
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-line bg-[rgba(238,243,249,0.9)] backdrop-blur-md">
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
              <div className="lg:hidden">
                <Link href="/" className="font-display text-xl font-extrabold text-ink">
                  {BRAND.name}
                </Link>
              </div>
              <div className="hidden text-sm text-ink-soft md:block">
                SEO · ASO · GEO · AIO intelligence
              </div>
              <Link href="/" className="btn-secondary !px-3 !py-1.5 text-sm">
                Marketing site
              </Link>
            </div>
            <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:hidden">
              {NAV.map((item) => {
                const active =
                "exact" in item && item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      "whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold",
                      active ? "bg-sea text-white" : "bg-panel text-ink-soft",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </header>
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
