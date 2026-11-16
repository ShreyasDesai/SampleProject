# Content calendar

> Read by: content-engine (takes the next row marked `ready`), the orchestrator, and the playbook content-calendar-looks-thin.
> If your calendar lives in Airtable, keep these exact column names there and export it to this file each week,
> or connect it later. The agents read the same columns either way.
> Agents may add rows, always with the status `idea`.
> Assumptions to confirm: starter rows written by Claude for the first two weeks.

## Status values
| Status | Means | Set by |
|---|---|---|
| idea | Worth doing, nothing written yet | you or any agent |
| briefed | The orchestrator wrote the brief | orchestrator |
| ready | Approved to draft. The content engine takes the next one | you, or the orchestrator when owner/approval-bar.md allows |
| drafted | A draft is saved in drafts/ | content-engine |
| held | Failed the voice check, waiting in queue/held-for-voice-review.md | content-engine |
| approved | Passed your review | you, or the orchestrator when owner/approval-bar.md allows |
| scheduled | In Metricool with a date and time | publishing-social |
| published | Live | publishing-social |
| dropped | Not doing it, kept for the record | you |

## The calendar
| ID | Publish date | Channel | Topic | Pillar | Goal | Keyword | Status | Brief | Draft file | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 001 | 2026-11-18 | linkedin | Is your site visible in AI answers? Three things to check | AI visibility | reach | | ready | Explain GEO and AIO in plain words and give three checks (claims C3) | | |
| 002 | 2026-11-20 | linkedin | Crawl your own site before chasing keywords | Fix the basics | clicks | | ready | robots.txt, sitemap and broken pages first (claim C1) | | |
| 003 | 2026-11-24 | blog | What GEO and AIO mean for a small team's website | AI visibility | clicks | generative engine optimization | idea | Step-by-step article, one worked example | | Blog always waits for the owner |
| 004 | 2026-11-25 | linkedin | Four tools or one workspace: SEO, ASO, GEO, AIO | One workspace | reach | | idea | Claim C4; no competitor names | | |
| 005 | 2026-11-27 | linkedin | Which SEO numbers need a paid data source, and why | Honest data | reach | | idea | Claim C5 | | |

## When the calendar counts as thin
- Thin means fewer than 3 ready or scheduled items in the next 14 days.
- What happens: the orchestrator runs /content-calendar-looks-thin. New rows arrive as `idea`. They become `ready` only when you, or owner/approval-bar.md, say so.

## How often each channel posts
See social/posting-schedule.md. The calendar fills those slots; it does not set them.
