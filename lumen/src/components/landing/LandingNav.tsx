"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BRAND } from "@/lib/constants";

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[var(--line)] bg-[rgba(247,251,249,0.86)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-16 sm:px-8">
        <Link href="/" className="font-display text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
          {BRAND.name}
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-ink-soft md:flex">
          <a href="#pillars" className="hover:text-ink">
            Pillars
          </a>
          <a href="#how" className="hover:text-ink">
            How it works
          </a>
          <a href="#workspace" className="hover:text-ink">
            Workspace
          </a>
        </nav>
        <Link href="/app" className="btn-primary !px-4 !py-2.5 text-sm">
          Open app
        </Link>
      </div>
    </header>
  );
}
