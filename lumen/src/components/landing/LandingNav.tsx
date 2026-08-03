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
          ? "border-b border-line bg-[rgba(247,251,249,0.9)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="font-display text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
          {BRAND.name}
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-ink-soft md:flex">
          <a href="#platform" className="hover:text-ink">
            Platform
          </a>
          <Link href="/app/site-explorer" className="hover:text-ink">
            Site Explorer
          </Link>
          <Link href="/app/keywords" className="hover:text-ink">
            Keywords
          </Link>
        </nav>
        <Link href="/app" className="btn-primary !px-4 !py-2.5 text-sm">
          Open platform
        </Link>
      </div>
    </header>
  );
}
