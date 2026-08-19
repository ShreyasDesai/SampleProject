import Link from "next/link";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink-800/10 bg-ink-950 text-sand-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-sand-200/70">
            Hyperlocal marketing-to-commerce software for multi-location brands —
            from discovery and reputation to ads, calls, and in-store transactions.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-moss-300">
            Product
          </p>
          <ul className="mt-3 space-y-2 text-sm text-sand-200/75">
            <li>
              <Link href="/dashboard/presence" className="hover:text-white">
                Presence
              </Link>
            </li>
            <li>
              <Link href="/dashboard/reputation" className="hover:text-white">
                Reputation
              </Link>
            </li>
            <li>
              <Link href="/dashboard/spotlight" className="hover:text-white">
                Spotlight Ads
              </Link>
            </li>
            <li>
              <Link href="/dashboard/hyper-xai" className="hover:text-white">
                Hyper Xai
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-moss-300">
            Platform
          </p>
          <ul className="mt-3 space-y-2 text-sm text-sand-200/75">
            <li>
              <Link href="/dashboard" className="hover:text-white">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/dashboard/locations" className="hover:text-white">
                Locations
              </Link>
            </li>
            <li>
              <Link href="/dashboard/transactions" className="hover:text-white">
                Transactions
              </Link>
            </li>
            <li>
              <Link href="/dashboard/calls" className="hover:text-white">
                Call Leads
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-sand-200/50 md:px-8">
        © {new Date().getFullYear()} NearReach. Demo platform inspired by hyperlocal
        marketing-to-commerce suites.
      </div>
    </footer>
  );
}
