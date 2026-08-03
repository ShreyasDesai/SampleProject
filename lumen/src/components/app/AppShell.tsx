"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND, MODULES } from "@/lib/constants";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen atmosphere">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        <aside className="border-b border-[var(--line)] bg-[rgba(247,251,249,0.72)] backdrop-blur-md lg:w-64 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between px-5 py-5 lg:block lg:px-6 lg:py-7">
            <Link href="/" className="font-display text-2xl font-extrabold tracking-tight text-ink">
              {BRAND.name}
            </Link>
            <p className="mt-1 hidden text-xs text-ink-soft lg:block">Visibility workspace</p>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col lg:px-3 lg:pb-6">
            <NavItem href="/app" active={pathname === "/app"} label="Overview" />
            {MODULES.map((m) => (
              <NavItem
                key={m.id}
                href={m.href}
                active={pathname.startsWith(m.href)}
                label={m.name}
                hint={m.full}
              />
            ))}
          </nav>
        </aside>
        <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}

function NavItem({
  href,
  active,
  label,
  hint,
}: {
  href: string;
  active: boolean;
  label: string;
  hint?: string;
}) {
  return (
    <Link
      href={href}
      className={`whitespace-nowrap rounded-xl px-3 py-2.5 text-sm transition ${
        active
          ? "bg-sea text-foam"
          : "text-ink-soft hover:bg-sea/8 hover:text-ink"
      }`}
      title={hint}
    >
      <span className="font-semibold">{label}</span>
      {hint ? (
        <span className={`mt-0.5 hidden text-[11px] lg:block ${active ? "text-foam/70" : "text-ink-soft/80"}`}>
          {hint}
        </span>
      ) : null}
    </Link>
  );
}
