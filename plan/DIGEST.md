# DIGEST — 2026-09-11

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

Seven for seven again: every tracked `march` run since yesterday's
digest succeeded, zero crashes, zero self-heals. The story of the
window is issue #758's content-gap workaround doing exactly the job
it was queued for — with Rule 2's gap table locked and Rule 3 not
review-due, three straight ticks (15:22, 18:26, 21:27) redirected
into draining `plan/CRITIQUE.md`'s oldest open findings instead of
zero-shipping: pass-146's MED (perfect-match S4 repetition) and LOW
(meta-description truncation) both cleared, then pass-151's HIGH
(show-index community canonical URL, confirmed systemic across every
show-index page) cleared too. Triage queued one issue (#806, a
heartbeat false-positive hardening fix). Pass 157 fired on schedule
overnight — 1 new MED finding (MAFS S20 five-way repetition) plus a
systemic severity bump (American Idol's community-header confusion
now confirmed on desktop, not just mobile) — and its finale-gate
sub-step caught something real: Project Runway Season 22 had aired
(2026-09-10) but was never authored, frontmatter still reading
`seasons: 21`. This morning's tick filed it as a fresh season+canon
insertion, the second time in two digests the finale-gate mechanism
has delivered a genuine season-fill outside the stalled Rule 2 drain
table (Alone S13 was the first, yesterday). One tick (07:19) came up
genuinely empty — Rule 2 stalled, Rule 3 not due, and this time even
the CRITIQUE-redirect and a three-list extend sweep found nothing
actionable — the only true zero-ship of the window. The one story
that still needs attention: **`e2e-full` breached its 75-minute wall
again both nights** (09-10 at a low 82.5% complete, tonight recovering
to 87.2%) — candidate #34 (shard the crawl) is now **52 days
unpromoted**, six of the last seven nights red. Deploy is ready at
HEAD (dd54ec63).

## While you were out

| time (UTC) | commit | verb | outcome |
|---|---|---|---|
| 15:21–15:22 | 7f2d27aa / 0c14f1d3 | content / critique | perfect-match S4 repetition drain — pass-146 MED resolved (content-gap redirect, issue #758) |
| 18:26 | 0bd265c3 | critique | pass-146 LOW resolved — perfect-match S4 meta-description truncation (content-gap redirect) |
| 21:27 | ebad7329 | critique | pass-151 HIGH resolved — show-index `?view=community` canonical URL, confirmed systemic (content-gap redirect) |
| 23:07 | 51312421 | triage | #806 queued — heartbeat "march has flatlined" false-positive hardening fix |
| 01:40 | bb759848 | critique | pass 157 — 1 MED finding (MAFS S20 5-way repetition), 1 systemic bump (American Idol community header, LOW→MED), finale-gate filed project-runway S22 row |
| 07:19 | 7f3673ec | audit | content-gap progress — Rule 2 stalled, Rule 3 not due, redirect sweep + 3-list extend search all exhausted — zero content shipped |
| 12:40–12:41 | a9d79ff5 / dd54ec63 | content / audit | Project Runway S22 finale-shift drain — season+canon insert, gap table 41→40 shows |

7 of 7 tracked `march` runs since yesterday's digest (14:38 09-10
through 12:43 09-11 UTC) succeeded — no crashes, no self-heals. 6 of
7 ticks shipped a real change; the 07:19 tick is the window's one
genuine zero-ship (documented, not a bug).

## The saga

**Rule 2 (season-fill drain):** the CADENCE gap table itself stayed
stalled most of the window (41 shows/42 gap-slots, all
confirmed-but-unaired, next sweep due 2026-09-13) — but the
finale-gate mechanism, which watches `content/calendar.yml` air dates
independent of the drain table, caught Project Runway Season 22: it
aired 2026-09-10 and was never authored at all. Today's last tick
filed it as a fresh season+canon insertion (canon rebased, S22 at rank
6), and the gap table lost its project-runway row in the process — it
was the last starred row at 21/22, so the confirmed-gap count moved
**41 shows/42 gap-slots → 40 shows/41 gap-slots**. Second
finale-gate-driven season-fill in two digests (Alone S13 was
yesterday's).

**Rule 3 (themed lists):** quiet and, for one tick, exhausted — the
07:19 tick's extend-first sweep across the three lowest-floor
cross-show lists (`the-vote-left-the-phone-line`,
`the-pitch-names-where-the-idea-came-from`,
`the-calendar-moved-the-format-didnt`) found no valid new entry
clearing any list's thesis bar. All three ledger rows bumped to
`last_reviewed 2026-09-11` with dead-end notes. Catalog holds flat at
**182/182** themes.

**Content-gap redirect (issue #758):** did the heavy lifting this
window. With both drain rules blocked, three consecutive ticks pulled
from `plan/CRITIQUE.md`'s Pending queue instead — clearing pass-146's
MED and LOW findings and pass-151's HIGH finding (the canonical-URL
bug, now confirmed systemic across every show-index page). This is
the workaround functioning exactly as designed when it was queued.

Catalog holds at **68 shows / 1051 seasons / 68 canons / 182 themes /
3 legal docs** — seasons +1 (Project Runway S22), themes flat.

## Queues now

- **`plan/CRITIQUE.md`**: pass 157 fired overnight (01:40), very
  fresh — 1 new MED (MAFS S20), 1 severity bump (American Idol header
  confusion, LOW→MED, now confirmed on both viewports). Combined with
  the window's 3 redirect-resolutions (pass-146 MED+LOW, pass-151
  HIGH), the Pending section now carries **39 open findings** on a
  direct count (plus 24 marked resolved-in-place but not yet archived
  to Done — a housekeeping gap, not a live backlog number). Gate
  thresholds reset with pass 157; next pass due per the usual 24h/12-
  commit-or-pending-HIGH rule.
- **`plan/AUDIT.md`**: 8 open rows. Standing rows: the season-fill
  STANDING ROW (MED, Rule 2 still locked), 2 HIGH (the-voice factual
  corruption issue #762, unchanged; night.yml concurrency-starvation
  issue #763, quiet this window), 1 MED (e2e-full duration-ceiling —
  two more breach nights logged, 52 days unpromoted), 2 LOW (SERP
  description budget; `YEAR_TENURE_RE` regex gap), 1 LOW (heartbeat
  false-positive #806, hardening fix queued not yet shipped).
- **`plan/PHASE_CANDIDATES.md`**: ~29 candidates awaiting promotion,
  unchanged in count — no new candidate filed this window, only
  reinforcement. Candidate #34 (shard e2e-full) got tonight's
  update: 87.2% completion, an improvement on 09-10's 82.5% low but
  still a full breach, now **52 days unpromoted**.
- **Open `triage:needs-user`**: 8 issues, unchanged — #762 and #763
  remain the two live ones needing an actual decision, both untouched
  since 2026-08-08 (34 days). #758 continues functioning as designed,
  no state change needed.
- **Open `triage:loop-queued`**: 5 issues (#636, #754, #785, #787,
  and newly #806) — #636 (e2e-full tracking issue) picked up two more
  "Recurred" comments this window (09-10 and tonight).

## Needs you

1. **Candidate #34 (shard e2e-full) is now 52 days unpromoted, and
   the pattern has stopped being ambiguous.** Six of the last seven
   nights (09-06 through 09-11, only 09-09 green) have breached the
   75-minute wall. This is a `.github/workflows/e2e-full.yml` edit
   the cloud loop structurally cannot push (no `workflows` OAuth
   scope) — a local/`/oversight` session is the only path to
   promotion.
2. **the-voice factual corruption (issue #762) — 10 days to
   premiere.** S22-29 stays frozen pending a human-reviewed 8-file
   renumbering fix. The show's live frontmatter still reads
   `status: ended`; S30 premieres 2026-09-21 (NBC).
3. **Nothing new to action on #758** — the content-gap redirect
   workaround shipped three real fixes this window exactly as
   designed. Worth a passing note only: it's now carried the loop
   through several consecutive Rule-2/Rule-3 stalls without a true
   zero-ship streak forming, which is the outcome it was queued for.

## Today's intent

Content-gap ticks should keep draining `plan/CRITIQUE.md`'s Pending
queue while Rule 2 stays locked until the 2026-09-13 sweep and Rule 3
sits on its three freshly-dead-ended lists — pass 157's fresh MED
finding (MAFS S20) is the natural next redirect target. Top
non-content finding, unchanged in kind and now sharper on frequency:
candidate #34 (shard e2e-full) at 52 days unpromoted, six of the last
seven nights red — this is well past the point where another
reinforcement pass adds new information; it needs an `/oversight`
decision.

## Tuning proposals

No new candidates filed tonight. One reinforcement update: candidate
#34 got tonight's breach data (87.2% completion, up from 09-10's
82.5% low but still a full breach) appended to its existing write-up
in `plan/PHASE_CANDIDATES.md`, with a matching continuity update to
the source row in `plan/AUDIT.md`. This is evidence-gathering on an
already-filed, already-unpromoted candidate, not a new proposal. No
gate mistuning observed otherwise: the content-gap redirect (#758)
handled three consecutive Rule-2/Rule-3 stalls exactly as designed,
`/expand` isn't due, and 6 of 7 march runs shipped real content with
zero crashes.
