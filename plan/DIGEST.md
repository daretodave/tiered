# DIGEST — 2026-09-29

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

Four clean `march` ticks since last night's briefing, zero
dispatcher crashes. Rule 2 squeezed out one more fact-checked drain
before stalling again: **90 Day Fiancé Season 12** (finale-shift,
aired 09-27) landed with a genuine format reversal as its headline
fact — seven entirely new couples, zero returning or crossover
pairings, the first fully fresh cast since Season 6 (2018) — fully
draining the show and dropping the gap table to **37 shows / 37
gap-slots** (from 39/37 last night). Every remaining slot is
starred confirmed-but-unaired, so the next two ticks fell through to
Rule 3: themed-list extends on `some-casts-didnt-need-week-one` and
`the-clock-had-to-make-room`. Critique pass 175 also shipped clean —
4 findings (0 HIGH, 1 MED, 3 LOW), no spoiler leakage, two raw
observations correctly dropped as false positives at self-assessment.
Overnight, `e2e-full` posted its **second consecutive red night**
(09-28, then 09-29) — same standing duration-ceiling breach
(candidate #34, now **70 days unpromoted**), test count up again
(10,695 → 10,711) tracking today's content adds, all completed
checks still passing. Catalog holds at **68 shows / 1,057 seasons /
68 canons / 182 themes**. Deploy ready at HEAD `6da7ac40`.

## While you were out

| time (UTC) | commit | verb | outcome |
|---|---|---|---|
| 22:37–23:28 (09-28) | ffaa9066, 47869945 | content (Rule 2) | 90 Day Fiancé S12 finale-shift filed; show fully drained, gap table → 37 shows / 37 slots |
| — 02:28 | — | e2e-full (nightly) | **red** — second consecutive breach; standard duration-ceiling wall, 8,859/10,711 complete (82.7%), all completed checks passing |
| 02:19–03:12 | c88a11cc, 87d92095 | content (Rule 3) | themed-list extend — `some-casts-didnt-need-week-one`; gap table unchanged (Rule 2 stalled again, all rows starred) |
| 09:02–09:49 | 3f3d5ec0, bbef2177 | content (Rule 3) | themed-list extend — `the-clock-had-to-make-room`; gap table unchanged |
| 16:06–16:19 | 6da7ac40 | critique | pass 175 — 4 findings (0 high, 1 med, 3 low) |

All 4 ticks shipped real work; no dispatcher crashes this window.

## The saga

**Rule 2 (season-fill drain):** one more real air date cleared the
starred backlog — 90 Day Fiancé's Season 12 (finale aired 09-27)
drained same-night with blurb + stats + canon rebase + gap-table row
removal, the show's first fully fresh cast since Season 6 closing a
six-season comeback/crossover streak. Gap table: **39 → 37
gap-slots**, shows-with-a-gap holds at 37 (90-day-fiance's own removal
offset by no new gap appearing). Every remaining slot reverted to
fully starred (confirmed-but-unaired) immediately after, so Rule 2
stayed non-actionable for the rest of the window. Next sweep due
2026-10-04.

**Rule 3 (themed lists):** picked up the fallback for two consecutive
ticks once Rule 2 re-stalled — both same-show single-entry extends
(`some-casts-didnt-need-week-one`, `the-clock-had-to-make-room`),
neither touching the gap table. `content-curator` debt is
accumulating on the fact-repetition defect class critique keeps
flagging: pass 174 caught it on DWTS S35 and Traitors New Blood; pass
175 caught a third instance on tonight's own 90-Day-Fiancé S12 page
(same clause restated across "THE TAKE," the shape-of-the-season
heading, and that section's body). Three same-defect instances in two
days — worth promoting to a `content-check` invariant if a fourth
lands, per pass 174's own suggestion.

Catalog: **68 shows / 1,057 seasons / 68 canons / 182 themes** — up 1
season from yesterday, matching the single Rule 2 drain; themes flat
(both Rule 3 ticks extended existing lists, no new list created).

## Queues now

- **`plan/CRITIQUE.md`**: last pass 175 (2026-09-29, commit 6da7ac40),
  4 new findings (0 HIGH, 1 MED, 3 LOW) — the `/themes` catalog
  heading-navigation gap (MED, a11y), a canon-fit sentence breaking
  plain-sentence voice, the third repetition-defect instance above,
  and an authed "Save (this device)" ambiguity. Pass 174's 2 MED
  findings (themed-list SEO-clip budget, 168/182 pages over; the
  DWTS/Traitors repetition pair) remain open, plus older MED rows
  (Shark Tank S17 repetition, dragrace S18 meta-fallback). File too
  large for a direct `Read`; grep is the safe path.
- **`plan/AUDIT.md`**: same open-row shape as yesterday plus one
  update appended tonight (the recurring e2e-full row, now **70 days**
  unpromoted as candidate #34). Still carries 2 HIGH (`the-voice`
  factual corruption #762, frozen since 2026-08-08; the historical
  night.yml starvation row), 1 standing MED (season-fill drain — now
  37/37, all starred), 1 MED (e2e-full duration-ceiling, red two
  nights running), 2 LOW (SERP description budget; `YEAR_TENURE_RE`
  teen-number gap), 1 LOW (heartbeat false-positive #806, no
  recurrence since filing).
- **`plan/PHASE_CANDIDATES.md`**: last `/expand` pass still 73
  (2026-09-26) — no new pass this window. Candidate #34 (shard
  e2e-full) crossed **70 days unpromoted**, still the file's
  longest-lived open item; two catalog-growth-tracking breaches in a
  row is a small data point against "the ceiling just needed a
  quieter catalog."
- **Open `triage:needs-user`**: 9 issues, unchanged — #762
  (the-voice) remains the oldest live urgency; several stale from
  June–August (#398, #399, #565, #586, #758, #763, #777) plus #817
  (self-resolved digest crash from 09-25).
- **Open `triage:loop-queued`**: 5 issues, unchanged (#636, #754,
  #785, #787, #806); #636 picked up tonight's recurrence.

## Needs you

1. **Candidate #34 (shard e2e-full) crossed 70 unpromoted days**,
   still blocked on a `.github/workflows/e2e-full.yml` edit the cloud
   loop cannot push (lacks the `workflows` OAuth scope). Two straight
   breaches tracking real catalog growth (10,695 → 10,711) is the
   clearest signal yet that a quiet catalog was masking, not fixing,
   the ceiling — worth promoting the shard fix rather than watching a
   third cycle.
2. **the-voice factual corruption (issue #762) is still going
   stale.** No comment since 2026-08-08. Still needs a
   human-reviewed fix — can't ship from the loop given the blast
   radius (8-file renumbering cascade + canon rebase).
3. **9 open `triage:needs-user` issues**, several stale (oldest:
   #398/#399 from 2026-06-11). Worth an `/oversight` sweep to close
   what's since been superseded.
4. **Content-curator debt on the repetition defect class** is now
   3-for-3 on the last three season/content drains (Shark Tank S17,
   DWTS S35 + Traitors New Blood, and tonight's 90 Day Fiancé S12).
   Small, well-scoped, safely cloud-actionable — a good `/iterate`
   pickup, or the systemic `content-check` invariant pass-174 floated
   if a fourth instance lands first.
5. **Themed-list SEO-clip budget** (168/182 pages over ~160 chars) is
   a single missing `clipToSeoBudget()` call in
   `themes/[theme]/page.tsx` — highest-leverage MED finding sitting
   open, one-line fix touching the whole catalog's search snippets.

## Today's intent

With Rule 2 fully starred again, expect the next tick to continue
the Rule 3 fallback or pick up one of the well-scoped CRITIQUE MED
findings above — the SEO-clip-budget fix is the highest-leverage
single-file change sitting open. Top non-content signal: candidate
#34's second consecutive catalog-growth-tracking breach, now 70 days
unpromoted, is the strongest case yet for an `/oversight` session to
promote the shard fix directly rather than wait for another quiet
night.

## Tuning proposals

None filed tonight. No fresh gate-mistuning or starvation pattern
surfaced this window — Rule 2/Rule 3 handed off cleanly on their own,
and `/expand`'s cadence gates correctly stayed closed (no new pass
due, no pending phase/data rows). The e2e-full pattern is unchanged
from prior nights' assessment: already fully diagnosed as candidate
#34, nothing new to propose beyond continuing to press for its
promotion (see Needs you #1).
