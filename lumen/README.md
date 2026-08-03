# Lumen

Real SEO / ASO / GEO / AIO workspace you can run on **your website**.

## What works without API keys (live)

- **Site Explorer / Site Audit** — crawls your public pages, robots.txt, sitemap
- **Keywords Explorer** — live Google Suggest + Datamuse related terms
- **Competitive Gap** — live crawl comparison
- **Content Lab** — briefs from your on-site terms + Suggest questions
- **ASO / GEO / AIO** — live URL on-page + extractability checks
- **Projects** — saved websites after crawl

## What needs DataForSEO (Ahrefs/Semrush-grade indexes)

Search volume, keyword difficulty, CPC, live Google SERP positions, inbound backlinks.

1. Create an account: https://app.dataforseo.com/
2. Open **Settings** in the app (or copy `.env.example` → `.env.local`)
3. Paste API login + password (use sandbox for free testing)
4. Restart `npm run dev`

## Run

```bash
cd lumen
npm install
npm run dev
```

Open http://localhost:3000/app — enter **your domain** and click **Crawl & save project**.
