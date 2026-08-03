import {
  Binoculars,
  Bot,
  FileSearch,
  Gauge,
  KeyRound,
  LayoutDashboard,
  Link2,
  Radar,
  Settings,
  Sparkles,
  Store,
  Swords,
  type LucideIcon,
} from "lucide-react";

export const NAV = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/app/site-explorer", label: "Site Explorer", icon: Binoculars },
  { href: "/app/keywords", label: "Keywords Explorer", icon: KeyRound },
  { href: "/app/competitors", label: "Competitive Gap", icon: Swords },
  { href: "/app/site-audit", label: "Site Audit", icon: FileSearch },
  { href: "/app/rank-tracker", label: "Rank Tracker", icon: Gauge },
  { href: "/app/backlinks", label: "Backlink Profile", icon: Link2 },
  { href: "/app/content", label: "Content Lab", icon: Sparkles },
  { href: "/app/aso", label: "ASO Intelligence", icon: Store },
  { href: "/app/geo", label: "GEO Visibility", icon: Radar },
  { href: "/app/aio", label: "AIO Answers", icon: Bot },
  { href: "/app/settings", label: "Settings", icon: Settings },
] as const satisfies ReadonlyArray<{
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}>;

export const TOOL_META: Record<
  string,
  { title: string; blurb: string; placeholder: string; example: string }
> = {
  "/app/site-explorer": {
    title: "Site Explorer",
    blurb: "Live crawl of your website — health, pages, keywords found on-page, robots/sitemap, and issues.",
    placeholder: "yourdomain.com",
    example: "example.com",
  },
  "/app/keywords": {
    title: "Keywords Explorer",
    blurb: "Live Google Suggest + related terms. Add DataForSEO for volume, KD, CPC, and SERPs.",
    placeholder: "Enter a keyword",
    example: "seo tools",
  },
  "/app/competitors": {
    title: "Competitive Gap",
    blurb: "Live crawl comparison between your site and a competitor’s content coverage.",
    placeholder: "yours.com, competitor.com",
    example: "example.com, wikipedia.org",
  },
  "/app/site-audit": {
    title: "Site Audit",
    blurb: "Real crawler auditing titles, meta, H1s, schema, HTTPS, thin pages, and more.",
    placeholder: "yourdomain.com",
    example: "example.com",
  },
  "/app/rank-tracker": {
    title: "Rank Tracker",
    blurb: "Track keywords for your domain. Live Google positions with DataForSEO; Suggest coverage without it.",
    placeholder: "yourdomain.com | keyword1, keyword2",
    example: "example.com | example domain, what is an example",
  },
  "/app/backlinks": {
    title: "Backlink Profile",
    blurb: "Live outbound link graph from your crawl. Inbound backlink index via DataForSEO when configured.",
    placeholder: "yourdomain.com",
    example: "example.com",
  },
  "/app/content": {
    title: "Content Lab",
    blurb: "Content briefs from your real on-site terms + live Google Suggest questions.",
    placeholder: "yourdomain.com",
    example: "example.com",
  },
  "/app/aso": {
    title: "ASO Intelligence",
    blurb: "Analyze your App Store / Play listing or app marketing page for real on-page listing quality.",
    placeholder: "Listing or marketing URL",
    example: "https://example.com",
  },
  "/app/geo": {
    title: "GEO Visibility",
    blurb: "Score a live URL for generative-engine citeability: definitions, facts, schema, clarity.",
    placeholder: "https://yoursite.com/guide",
    example: "https://example.com",
  },
  "/app/aio": {
    title: "AIO Answers",
    blurb: "Check a live FAQ/answer page for extractability and answer-engine readiness.",
    placeholder: "https://yoursite.com/faq",
    example: "https://example.com",
  },
  "/app/settings": {
    title: "Settings",
    blurb: "Connect DataForSEO for search volume, KD, live SERPs, and backlink indexes.",
    placeholder: "",
    example: "",
  },
};
