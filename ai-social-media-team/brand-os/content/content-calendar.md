# Content calendar

> Read by: content-engine (takes the next row marked `ready`), the orchestrator, and the playbook content-calendar-looks-thin.
> If your calendar lives in Airtable, keep these exact column names there and export it to this file each week,
> or connect it later. The agents read the same columns either way.
> Agents may add rows, always with the status `idea`.
> Personal brand of Shreyas Desai since 2026-11-16. Assumptions to confirm: rows 006+ written by Claude.
> Rows 001-005 were for Lumen and are dropped (no product mentions).

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
| 001 | 2026-11-18 | linkedin | Is your site visible in AI answers? (Lumen) | AI visibility | reach | | dropped | | drafts/archive/lumen/ | Rebranded to personal brand |
| 002 | 2026-11-20 | linkedin | Crawl your own site before chasing keywords (Lumen) | Fix the basics | clicks | | dropped | | drafts/archive/lumen/ | Rebranded to personal brand |
| 003 | 2026-11-24 | blog | GEO and AIO for a small team (Lumen) | AI visibility | clicks | | dropped | | | Rebranded |
| 004 | 2026-11-25 | linkedin | Four tools or one workspace (Lumen) | One workspace | reach | | dropped | | | Rebranded |
| 005 | 2026-11-27 | linkedin | Which SEO numbers need paid data (Lumen) | Honest data | reach | | dropped | | | Rebranded |
| 006 | 2026-11-18 | x | I set up my social media team as AI agents in Claude Code, day 1 | Building with AI | reach | | briefed | drafts/briefs/2026-11-16-content-engine-ai-team-day-one.md (earlier text here: Claim C3; what the orchestrator does, in one post) | | |
| 007 | 2026-11-19 | linkedin | I asked AI answer engines the same question: how to check if your site gets cited | SEO and AI search | reach | | briefed | drafts/briefs/2026-11-16-content-engine-ai-answers-cited-checks.md (earlier text here: Explain GEO and AIO plainly, three checks anyone can run; no product names) | | |
| 008 | 2026-11-20 | x | Learning in public: why NumPy is faster than a Python loop | Learning data science | reach | | briefed | drafts/briefs/2026-11-16-content-engine-numpy-vs-python-loop.md (earlier text here: Claim C2; one plain explanation, sourced) | | |
| 009 | 2026-11-24 | linkedin | How my 9-agent social media team is wired (and where I stay in control) | Building with AI | reach | | briefed | drafts/briefs/2026-11-16-content-engine-ai-team-wiring.md (earlier text here: Claim C3; orchestrator, departments, approval queue, kill switch) | | |
| 010 | 2026-11-23 | x | Fix what is broken before you buy more traffic | Growth marketing | reach | | idea | | | |
| 011 | 2026-11-28 | instagram | Carousel: SEO vs GEO vs AIO in plain words | SEO and AI search | reach | | idea | Needs a visual from creative-studio | | |
| 012 | 2026-11-26 | linkedin | One growth fundamental I wish I'd learned first | Growth marketing | reach | | idea | | | |
| 013 | 2026-12-01 | linkedin | Learning data science in public: what week one taught me | Learning data science | reach | | idea | Claim C2 | | |

## When the calendar counts as thin
- Thin means fewer than 3 ready or scheduled items in the next 14 days.
- What happens: the orchestrator runs /content-calendar-looks-thin. New rows arrive as `idea`. They become `ready` only when you, or owner/approval-bar.md, say so.

## How often each channel posts
See social/posting-schedule.md. The calendar fills those slots; it does not set them.
