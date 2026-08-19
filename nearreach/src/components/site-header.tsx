import Link from "next/link";
import { Logo } from "./logo";

const links = [
  { href: "/#products", label: "Products" },
  { href: "/#outcomes", label: "Outcomes" },
  { href: "/#industries", label: "Industries" },
  { href: "/dashboard", label: "Platform" },
];

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <Logo light />
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-sand-100/85 transition hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/dashboard"
          className="rounded-full bg-coral-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-coral-500/25 transition hover:bg-coral-400"
        >
          Open dashboard
        </Link>
      </div>
    </header>
  );
}
