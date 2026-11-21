# Needs your OK

Items waiting for an owner decision. Agents add items at the bottom of "Open". Only the owner
ticks a box. After ticking, tell the orchestrator: "Process my approvals in queue/needs-your-ok.md."
URGENT items go at the top of "Open". OVER CAP in a title means the spend would pass owner/budget-cap.md.

## Format for every item

    ### Q-YYYYMMDD-NN: <short title>
    - [ ] Approve
    - [ ] Reject
    - What: <what will happen if you approve, in one line>
    - Why it waits: <the rule from owner/approval-bar.md or CLAUDE.md>
    - File: <drafts/... path>
    - Spend: <amount and channel, or none>
    - Requested by: <agent> for brief <B-YYYYMMDD-NN>
    - Owner note: <write here if you reject or want a change>

## Open

### Q-20261026-01: Reply to a one-star review on Google Business Profile (EXAMPLE, delete me)
- [ ] Approve
- [ ] Reject
- What: post the drafted public reply to a one-star review about a long wait at the counter.
- Why it waits: any reply to a negative review always waits (owner/approval-bar.md).
- File: drafts/2026-10-26-gbp-reply-long-wait-review.md
- Spend: none
- Requested by: reviews-reputation for brief B-20261026-01
- Owner note:

### Q-20261116-01: Set a posting cadence in brand-os/social/posting-schedule.md (calendar looks thin)
- [ ] Approve
- [ ] Reject
- What: you fill in the time zone, posts per week, days and times per channel in brand-os/social/posting-schedule.md, so the team can find empty slots instead of guessing them. Approve once it is filled.
- Why it waits: posting-schedule.md is still an unfilled template, and the content-calendar-looks-thin playbook says "If posting-schedule.md sets no cadence for a channel, do not guess one. The orchestrator adds an item to queue/needs-your-ok.md asking the owner to set it, and skips that channel." The calendar is thin: only 2 rows are `ready` or `scheduled` between 2026-11-16 and 2026-11-30 (rule: fewer than 3).
- File: drafts/briefs/2026-11-16-week-plan.md
- Spend: none
- Requested by: orchestrator for brief none (playbook event: content-calendar-looks-thin)
- Owner note:

### Q-20261116-02: Mark calendar rows 003, 004 and 005 as ready to brief and draft
- [ ] Approve
- [ ] Reject
- What: rows 003 (blog, 2026-11-24, GEO and AIO for small teams), 004 (LinkedIn, 2026-11-25, four tools or one workspace) and 005 (LinkedIn, 2026-11-27, which SEO numbers need a paid data source) move from `idea` to `ready`, and the orchestrator briefs them in next week's loop.
- Why it waits: content-calendar.md says new rows "become `ready` only when you, or owner/approval-bar.md, say so", and approval-bar.md lets nothing auto-ship until 2026-12-14. Row 003 is a blog article, which always waits.
- File: drafts/briefs/2026-11-16-week-plan.md
- Spend: none
- Requested by: orchestrator for brief none (playbook event: content-calendar-looks-thin)
- Owner note:

### Q-20261121-01: X post, calendar row 006 "AI team, day 1" (proposed new slot Wed 2026-11-25 19:00 IST)
- [ ] Approve
- [ ] Reject
- What: approve the X post (269 characters, no hashtags, no emoji) for row 006. Its calendar date 2026-11-18 has passed; proposed new slot is X Wed 2026-11-25 19:00 IST (next open X day: Mon 2026-11-23 holds idea row 010). The slot itself is decided in Q-20261121-05. If approved, the orchestrator briefs publishing-social to schedule it.
- Why it waits: until 2026-12-14 nothing auto-ships (owner/approval-bar.md); the post names Claude Code ("Anything that names a real ... company", owner/approval-bar.md). Voice check: pass. [VERIFY] marks: none.
- File: drafts/2026-11-18-x-ai-team-day-one.md
- Spend: none
- Requested by: orchestrator for brief B-20261116-03
- Owner note:

### Q-20261121-02: LinkedIn post, calendar row 007 "Do AI answers cite your site? Three checks" (has [VERIFY]; proposed new slot Thu 2026-12-03 09:00 IST)
- [ ] Approve
- [ ] Reject
- What: approve the LinkedIn post (9 short lines, no hashtags) for row 007 once the [VERIFY] is resolved. Its calendar date 2026-11-19 has passed; proposed new slot is LinkedIn Thu 2026-12-03 09:00 IST (Tue 11-24 holds row 009, Thu 11-26 idea row 012, Tue 12-01 idea row 013). The slot itself is decided in Q-20261121-05.
- Why it waits: every LinkedIn post waits; anything with an unresolved [VERIFY] mark waits (owner/approval-bar.md). Open [VERIFY] in check 3 of the post body: "the crawler names each engine uses, and whether blocking one changes what gets cited". Hook option B (not used in the post) also carries a [VERIFY]: use it only if you actually ran that test. Source URLs in the draft were not opened (no network); please confirm them, and the Perplexity source still needs a URL. Voice check: pass.
- File: drafts/2026-11-19-linkedin-ai-answers-cited-checks.md
- Spend: none
- Requested by: orchestrator for brief B-20261116-04
- Owner note:

### Q-20261121-03: X post, calendar row 008 "Why NumPy is faster than a Python loop" (proposed new slot Fri 2026-11-27 19:00 IST)
- [ ] Approve
- [ ] Reject
- What: approve the X post (270 characters, no hashtags, no emoji) for row 008. Its calendar date 2026-11-20 has passed; proposed new slot is X Fri 2026-11-27 19:00 IST (row 006 is proposed for Wed 11-25). The slot itself is decided in Q-20261121-05. If approved, the orchestrator briefs publishing-social to schedule it.
- Why it waits: until 2026-12-14 nothing auto-ships (owner/approval-bar.md). Voice check: pass. [VERIFY] marks: none. The NumPy documentation URL was not opened (no network); please confirm it.
- File: drafts/2026-11-20-x-numpy-vs-python-loop.md
- Spend: none
- Requested by: orchestrator for brief B-20261116-05
- Owner note:

### Q-20261121-04: LinkedIn post, calendar row 009 "How my AI social media team is wired" (slot unchanged: Tue 2026-11-24 09:00 IST)
- [ ] Approve
- [ ] Reject
- What: approve the LinkedIn post (9 short lines, no hashtags) for row 009 on its calendar slot, LinkedIn Tue 2026-11-24 09:00 IST. Please review by Monday 2026-11-23 to keep that slot. If approved, the orchestrator briefs publishing-social to schedule it.
- Why it waits: every LinkedIn post waits; until 2026-12-14 nothing auto-ships; the post names Claude Code ("Anything that names a real ... company") (owner/approval-bar.md). Voice check: pass. [VERIFY] marks: none. It shares the "AI team" topic with row 006, but on a different channel (LinkedIn vs X), so the 7-day same-topic rule does not apply.
- File: drafts/2026-11-24-linkedin-ai-team-wiring.md
- Spend: none
- Requested by: orchestrator for brief B-20261116-06
- Owner note:

### Q-20261121-05: Move publish dates for calendar rows 006, 007 and 008 (their dates have passed)
- [ ] Approve
- [ ] Reject
- What: you change the Publish date column in brand-os/content/content-calendar.md: 006 X 2026-11-18 -> Wed 2026-11-25 19:00; 007 LinkedIn 2026-11-19 -> Thu 2026-12-03 09:00; 008 X 2026-11-20 -> Fri 2026-11-27 19:00 (IST). These are the next open posting days after today (2026-11-21) under brand-os/social/posting-schedule.md, counting idea rows 010 (X Mon 11-23), 012 (LinkedIn Thu 11-26) and 013 (LinkedIn Tue 12-01) as taken. Spacing holds: at least 1 day between posts on a channel, and no same-topic repeat inside 7 days on one channel. Option if you prefer: put 007 on Thu 2026-11-26 and move idea row 012 back, since 007 is already drafted. Row 009 keeps 2026-11-24.
- Why it waits: the content calendar is owner-set, and moving a publish date changes what is on the content calendar ("Anything not on the content calendar", owner/approval-bar.md). The orchestrator does not change calendar dates.
- File: brand-os/content/content-calendar.md
- Spend: none
- Requested by: orchestrator for brief B-20261116-03, B-20261116-04, B-20261116-05
- Owner note:

## Done

### Q-20261116-03: Confirm publish slots for calendar rows 006-009 (dates fall one day off the posting days)
- [x] Approve
- [ ] Reject
- What: rows 006-009 go out on these slots instead of their calendar dates: 006 X Wed 2026-11-18 19:00, 007 LinkedIn Thu 2026-11-19 09:00, 008 X Fri 2026-11-20 19:00, 009 LinkedIn Tue 2026-11-24 09:00 (IST). Each calendar date is one day after a posting-schedule day (2026-11-16 is a Monday). If you approve, please update the Publish date column yourself or say so in the note; drafts still wait for their own approval.
- Why it waits: the content calendar and posting schedule are owner-set, and moving a publish date changes what is on the content calendar ("Anything not on the content calendar", owner/approval-bar.md). The orchestrator may only set Status and Brief.
- File: drafts/briefs/2026-11-16-week-plan.md
- Spend: none
- Requested by: orchestrator for brief B-20261116-03, B-20261116-04, B-20261116-05, B-20261116-06
- Owner note: Approved by Shreyas in chat on 2026-11-16 ("fix the calendar dates"). Calendar dates updated: 006-009 as proposed; idea rows 010 to 2026-11-23, 011 to 2026-11-28, 012 to 2026-11-26, 013 to 2026-12-01.
