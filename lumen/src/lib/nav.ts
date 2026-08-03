import {
  BarChart3,
  Binoculars,
  Bot,
  FileSearch,
  Gauge,
  KeyRound,
  LayoutDashboard,
  Link2,
  Radar,
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
    blurb: "Organic traffic, keywords, pages, competitors, and authority — Ahrefs-grade domain intelligence.",
    placeholder: "Enter a domain (e.g. ahrefs.com)",
    example: "ahrefs.com",
  },
  "/app/keywords": {
    title: "Keywords Explorer",
    blurb: "Volume, difficulty, SERP, AI Overviews, related terms, and questions for any query.",
    placeholder: "Enter a keyword (e.g. seo tools)",
    example: "seo tools",
  },
  "/app/competitors": {
    title: "Competitive Gap",
    blurb: "Compare domains, keyword battles, overlap, and content gaps worth stealing.",
    placeholder: "domain1.com, domain2.com, domain3.com",
    example: "ahrefs.com, semrush.com, moz.com",
  },
  "/app/site-audit": {
    title: "Site Audit",
    blurb: "Crawl health across crawlability, content, links, CWV, schema, and more.",
    placeholder: "Enter a domain to audit",
    example: "semrush.com",
  },
  "/app/rank-tracker": {
    title: "Rank Tracker",
    blurb: "Daily positions, visibility, share of voice, and SERP feature tracking.",
    placeholder: "Enter your domain",
    example: "notion.so",
  },
  "/app/backlinks": {
    title: "Backlink Profile",
    blurb: "Referring domains, anchors, new/lost links, and link quality distribution.",
    placeholder: "Enter a domain",
    example: "nytimes.com",
  },
  "/app/content": {
    title: "Content Lab",
    blurb: "Opportunity-ranked briefs with outlines mapped to keyword difficulty fit.",
    placeholder: "Enter your domain",
    example: "hubspot.com",
  },
  "/app/aso": {
    title: "ASO Intelligence",
    blurb: "Store visibility, keyword ranks, competitor overlap, and listing creative insights.",
    placeholder: "App name or category keyword",
    example: "habit tracker",
  },
  "/app/geo": {
    title: "GEO Visibility",
    blurb: "Track brand citations across ChatGPT, Perplexity, Gemini, Copilot, and AI Overviews.",
    placeholder: "Brand or domain",
    example: "perplexity.ai",
  },
  "/app/aio": {
    title: "AIO Answers",
    blurb: "Own extractable answers — question coverage, schema, freshness, and zero-click risk.",
    placeholder: "Brand or domain",
    example: "openai.com",
  },
};

export { BarChart3 };
