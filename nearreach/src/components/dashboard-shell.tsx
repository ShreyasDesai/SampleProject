"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPinned,
  Star,
  MessagesSquare,
  Megaphone,
  PhoneCall,
  ShoppingBag,
  Sparkles,
  Settings2,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "./logo";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/locations", label: "Locations", icon: MapPinned },
  { href: "/dashboard/presence", label: "Presence", icon: MapPinned },
  { href: "/dashboard/reputation", label: "Reputation", icon: Star },
  { href: "/dashboard/engagement", label: "Engagement", icon: MessagesSquare },
  { href: "/dashboard/spotlight", label: "Spotlight Ads", icon: Megaphone },
  { href: "/dashboard/calls", label: "Call Leads", icon: PhoneCall },
  { href: "/dashboard/transactions", label: "Transactions", icon: ShoppingBag },
  { href: "/dashboard/hyper-xai", label: "Hyper Xai", icon: Sparkles },
  { href: "/dashboard/settings", label: "Configuration", icon: Settings2 },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-moss-50">
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-ink-900/8 bg-ink-950 text-sand-50 transition md:static md:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center justify-between px-5">
            <Logo light className="scale-95" />
            <button
              type="button"
              className="rounded-lg p-1 text-sand-200 md:hidden"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="space-y-1 px-3 pb-8 pt-2">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-coral-500 text-white"
                      : "text-sand-200/75 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink-900/8 bg-sand-50/90 px-4 backdrop-blur md:px-8">
            <button
              type="button"
              className="rounded-lg p-2 text-ink-800 md:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden text-sm text-ink-700/70 md:block">
              Multi-location control center
            </div>
            <div className="ml-auto flex items-center gap-3">
              <span className="rounded-full bg-moss-100 px-3 py-1 text-xs font-semibold text-ink-800">
                Demo brand · 6 locations
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 text-xs font-bold text-white">
                NR
              </div>
            </div>
          </header>
          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-ink-950/40 md:hidden"
          aria-label="Close overlay"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
