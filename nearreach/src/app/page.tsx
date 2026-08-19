import Link from "next/link";
import {
  ArrowRight,
  MapPinned,
  Star,
  MessagesSquare,
  Megaphone,
  PhoneCall,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const products = [
  {
    title: "Presence Management",
    desc: "Publish and sync location pages, hours, offers, and NAP data across search and maps publishers.",
    href: "/dashboard/presence",
    icon: MapPinned,
  },
  {
    title: "Reputation Management",
    desc: "Monitor reviews from Google to Justdial, reply at scale, and track sentiment by location.",
    href: "/dashboard/reputation",
    icon: Star,
  },
  {
    title: "Engagement Management",
    desc: "Answer Q&A, messages, and social mentions so every store stays responsive near the customer.",
    href: "/dashboard/engagement",
    icon: MessagesSquare,
  },
  {
    title: "Spotlight Ads",
    desc: "Launch hyperlocal search, display, and offer campaigns with location-level spend and CPL.",
    href: "/dashboard/spotlight",
    icon: Megaphone,
  },
  {
    title: "Call Leads",
    desc: "Track inbound calls with virtual numbers, intent detection, transcripts, and conversion status.",
    href: "/dashboard/calls",
    icon: PhoneCall,
  },
  {
    title: "Transaction Management",
    desc: "Publish location catalogs, inventory, and orders so discovery turns into local commerce.",
    href: "/dashboard/transactions",
    icon: ShoppingBag,
  },
  {
    title: "Hyper Xai",
    desc: "Move from unknown audiences to actionable segments, interaction intelligence, and campaigns.",
    href: "/dashboard/hyper-xai",
    icon: Sparkles,
  },
];

const outcomes = [
  { label: "Store visits", value: "60X" },
  { label: "Lead volume", value: "139%" },
  { label: "Marketing ROI", value: "145X" },
  { label: "Digital visibility", value: "155%" },
];

export default function HomePage() {
  return (
    <div className="bg-sand-50">
      <SiteHeader />

      {/* Hero — one composition: brand, headline, support, CTA, dominant visual */}
      <section className="relative min-h-[100svh] overflow-hidden bg-hero-mesh text-sand-50">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:justify-center md:px-8 md:pb-24 md:pt-20">
          <div className="grid items-end gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="animate-fade-up font-display text-5xl font-semibold tracking-tight text-white sm:text-6xl md:text-7xl">
                NearReach
              </p>
              <h1 className="animate-fade-up mt-5 max-w-xl text-balance font-display text-2xl font-medium leading-snug text-sand-100/95 sm:text-3xl [animation-delay:120ms] opacity-0">
                Acquire customers, locally.
              </h1>
              <p className="animate-fade-up mt-4 max-w-md text-base leading-relaxed text-sand-200/75 [animation-delay:220ms] opacity-0">
                AI-driven multi-location marketing-to-commerce — from discovery and
                reputation to ads, calls, and store-level transactions.
              </p>
              <div className="animate-fade-up mt-8 flex flex-wrap gap-3 [animation-delay:320ms] opacity-0">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-coral-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-coral-500/30 transition hover:bg-coral-400"
                >
                  Open the platform
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#products"
                  className="inline-flex items-center rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
                >
                  Explore products
                </a>
              </div>
            </div>

            {/* Dominant visual plane — map / store network */}
            <div className="animate-fade-in relative lg:col-span-6 [animation-delay:200ms] opacity-0">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/15 bg-ink-900/40 shadow-2xl shadow-black/30 backdrop-blur-sm md:aspect-[5/4]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(74,143,111,0.45),transparent_45%),radial-gradient(circle_at_75%_60%,rgba(232,93,56,0.35),transparent_40%)]" />
                <svg
                  className="absolute inset-0 h-full w-full opacity-30"
                  viewBox="0 0 400 320"
                  fill="none"
                >
                  <path
                    d="M40 180 C80 120, 140 100, 200 140 S320 220, 360 160"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeDasharray="4 6"
                  />
                  <path
                    d="M60 240 C120 200, 180 220, 240 180 S320 100, 380 120"
                    stroke="white"
                    strokeWidth="1"
                    strokeDasharray="3 8"
                  />
                </svg>
                {[
                  { top: "22%", left: "28%", delay: "0s", label: "Delhi" },
                  { top: "48%", left: "18%", delay: "0.4s", label: "Mumbai" },
                  { top: "58%", left: "42%", delay: "0.8s", label: "Bengaluru" },
                  { top: "38%", left: "62%", delay: "1.2s", label: "Hyderabad" },
                  { top: "28%", left: "78%", delay: "1.6s", label: "Kolkata" },
                ].map((pin) => (
                  <div
                    key={pin.label}
                    className="absolute"
                    style={{ top: pin.top, left: pin.left }}
                  >
                    <span
                      className="location-pin block h-3.5 w-3.5 rounded-full bg-coral-400"
                      style={{ animationDelay: pin.delay }}
                    />
                    <span className="mt-1 block whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide text-white/80">
                      {pin.label}
                    </span>
                  </div>
                ))}
                <div className="absolute bottom-4 left-4 right-4 flex animate-float items-center justify-between rounded-2xl border border-white/10 bg-ink-950/70 px-4 py-3 backdrop-blur">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-moss-300">
                      Live network
                    </p>
                    <p className="text-sm font-semibold text-white">
                      6 cities · 86% listing health
                    </p>
                  </div>
                  <span className="rounded-full bg-moss-500/30 px-3 py-1 text-xs font-semibold text-moss-200">
                    Syncing
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="outcomes" className="border-b border-ink-900/8 bg-section-wash py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink-950 md:text-4xl">
            Outcome-focused capabilities for every location.
          </h2>
          <p className="mt-3 max-w-xl text-ink-700/70">
            Streamline discovery, engage customers, handle feedback, and deliver
            omnichannel experiences with actionable insights per store.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
            {outcomes.map((o) => (
              <div key={o.label} className="border-l-2 border-coral-500 pl-4">
                <p className="font-display text-4xl font-semibold text-ink-950">
                  {o.value}
                </p>
                <p className="mt-1 text-sm text-ink-700/65">{o.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-950 md:text-4xl">
            AI-powered suite for hyperlocal needs
          </h2>
          <p className="mt-3 max-w-2xl text-ink-700/70">
            Build presence, drive engagement, manage reputation, facilitate
            transactions, run hyperlocal ads, and unlock consumer insights.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => {
              const Icon = p.icon;
              return (
                <Link
                  key={p.title}
                  href={p.href}
                  className="group block border-b border-ink-900/10 pb-6 transition hover:border-coral-500"
                >
                  <Icon className="h-6 w-6 text-coral-500" strokeWidth={1.75} />
                  <h3 className="mt-4 font-display text-xl font-semibold text-ink-950 group-hover:text-coral-600">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700/70">
                    {p.desc}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink-800 opacity-0 transition group-hover:opacity-100">
                    Open module <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="industries" className="bg-ink-950 py-20 text-sand-50">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Built for multi-location brands
          </h2>
          <p className="mt-3 max-w-xl text-sand-200/65">
            Automotive, retail, BFSI, healthcare, QSR, and franchise networks —
            manage the near-me journey from one control center.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {[
              "Automotive",
              "Retail & Fashion",
              "Banking & BFSI",
              "Healthcare",
              "QSR & Hospitality",
              "Telecom",
              "Education",
            ].map((ind) => (
              <span
                key={ind}
                className="rounded-full border border-white/15 px-4 py-2 text-sm text-sand-100/85"
              >
                {ind}
              </span>
            ))}
          </div>
          <div className="mt-14 flex flex-wrap items-center gap-8 text-sm text-sand-200/60">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-moss-300" /> Regular VAPT
            </span>
            <span className="inline-flex items-center gap-2">
              <Lock className="h-4 w-4 text-moss-300" /> End-to-end encryption
            </span>
            <span>Role-based brand · region · store control</span>
          </div>
        </div>
      </section>

      <section className="bg-section-wash py-20">
        <div className="mx-auto max-w-6xl px-5 text-center md:px-8">
          <h2 className="font-display text-3xl font-semibold text-ink-950 md:text-4xl">
            Ready to win the near-me moment?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-ink-700/70">
            Explore the full demo dashboard with locations, listings, reviews,
            ads, calls, commerce, and AI segments.
          </p>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink-950 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-ink-800"
          >
            Launch NearReach dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
