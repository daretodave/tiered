# DIGEST — 2026-09-28

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

Six clean `march` ticks, zero dispatcher crashes — and the best
content news in weeks: **Rule 2 broke its week-long stall.** Three
previously-starred (confirmed-but-unaired) gap-table slots actually
aired and got drained same-day — `rhony` S16, `traitors` S5 ("New
Blood"), and `dancing-with-the-stars` S35 — each filed with blurb,
stats, canon rebase, and gap-table row removal. Gap table drops from
43 slots/41 shows to **39 slots/37 shows**, its lowest count since
the 09-13 sweep. Also shipped: a same-day fix for critique pass-174's
freshest finding (`the-voice` tagline still falsely framed the show
as having "signed off" despite S30 already airing), and critique
pass 174 itself (2 MED findings, 0 HIGH) — one of which flags the
very seasons filed today (near-verbatim fact restatement on the
`dancing-with-the-stars`/`traitors` pages, owed to a content-curator
pass). Overnight, the chronic `e2e-full` timeout (candidate #34)
reverted to red after one green night — and for the first time in
two weeks, the test count actually grew (10,603 → 10,695), directly
tracking today's three new season pages. Catalog holds at **68 shows
/ 1,056 seasons / 68 canons / 182 themes**. Deploy ready at HEAD
`db859f84`.

## While you were out

| time (UTC) | commit | verb | outcome |
|---|---|---|---|
| 17:16–17:29 | 1677185c | critique | pass 173 — 1 finding (0 high, 1 med, 0 low) |
| 20:23–21:20 | 0a5584e3, 704f9d08 | content (Rule 2) | `rhony` S16 filed — first Rule 2 drain in a week, gap table corrected |
| 23:23–00:11 (09-28) | c441f968, 6e6f756e | content (Rule 2) | `traitors` S5 "New Blood" filed |
| 01:58–02:51 | 68c969aa, 57a6c20d | content (Rule 2) | `dancing-with-the-stars` S35 filed |
| — 01:24 | — | e2e-full (nightly) | **red** — reverted after one green night (09-27); standard duration-ceiling breach, 9,209/10,695 complete, all completed checks passing |
| 08:36–09:27 | 606287d9, 576769c1 | content + audit | `the-voice` tagline/`card_tagline` rewritten off the false "signed off" framing (S30 already airing) |
| 17:01–17:18 | db859f84 | critique | pass 174 — 2 findings (0 high, 2 med, 0 low), one flagging today's own fresh season pages |

All 6 ticks shipped real work; no dispatcher crashes this window.

## The saga

**Rule 2 (season-fill drain):** stall broken. Three of the 43
starred slots the 09-27 sweep left fully blocked actually had real
air dates land this window — `rhony` S16 (premiered 2026-09-08),
`traitors` S5 (`New Blood`), and `dancing-with-the-stars` S35 (the
16-couple cast tying the series record) — and all three drained
same-day with blurb + stats + canon rebase + gap-table row removal,
the same 31a discipline the standing row requires. Net: gap table
**43 → 39 slots, across 41 → 37 shows**. Every remaining slot is
still starred confirmed-but-unaired; the next sweep is due 2026-10-04.
One side effect worth naming: critique pass 174 caught both
freshly-filed seasons restating their single headline fact 5-6 times
each (a known drafting-pattern defect, not a one-off) — a
content-curator pass on both files is the cheapest next Rule-2-linked
pickup.

**Rule 3 (themed lists):** no activity this window — Rule 2 finally
had real work, so nothing fell through to the single-show fallback.

Catalog: **68 shows / 1,056 seasons / 68 canons / 182 themes** — up
3 seasons from yesterday, matching the three drains exactly.

## Queues now

- **`plan/CRITIQUE.md`**: last pass 174 (2026-09-28, commit
  db859f84), 2 findings (0 HIGH, 2 MED, 0 LOW) — both still open:
  the themed-list SEO-clip gap (168/182 pages over budget) and the
  fresh-season repetition finding above. File too large for a direct
  `Read`; grep is the safe path.
- **`plan/AUDIT.md`**: same open-row shape as yesterday plus one
  update appended tonight (the recurring e2e-full row, now 69 days
  unpromoted as candidate #34). Still carries 2 HIGH (`the-voice`
  factual corruption #762, frozen since 2026-08-08; a historical
  night.yml starvation row), 1 standing MED (season-fill drain — now
  39 slots, all starred), 1 MED (e2e-full duration-ceiling, red again
  tonight), 2 LOW (SERP description budget; `YEAR_TENURE_RE`
  teen-number gap), 1 LOW (heartbeat false-positive #806, no
  recurrence since filing).
- **`plan/PHASE_CANDIDATES.md`**: last `/expand` pass still 73
  (2026-09-26) — no new pass this window. 21 candidates sit in
  "awaiting promotion." Candidate #34 (shard e2e-full) is now **69
  days unpromoted**, still the file's longest-lived open item; tonight's
  breach (with the first test-count growth in two weeks) is a small
  data point against "the ceiling just needed a quieter catalog."
- **Open `triage:needs-user`**: 9 issues, unchanged — #762
  (the-voice) remains the oldest live urgency; several stale from
  June–August (#398, #399, #565, #586, #758, #763, #777) plus #817
  (self-resolved digest crash from 09-25).
- **Open `triage:loop-queued`**: 5 issues, unchanged (#636, #754,
  #785, #787, #806).

## Needs you

1. **Candidate #34 (shard e2e-full) crossed 69 unpromoted days**,
   still blocked on a `.github/workflows/e2e-full.yml` edit the cloud
   loop cannot push (lacks the `workflows` OAuth scope). Tonight's
   breach came with the catalog's first test-count growth in two
   weeks (10,603 → 10,695) — worth weighing whether a resumed Rule 2
   drain (see above) makes the ceiling erode faster from here, which
   would tip the case toward promoting the shard fix rather than
   watching another cycle.
2. **the-voice factual corruption (issue #762) is still going
   stale.** No comment since 2026-08-08. Today's tick fixed the
   surface-level tagline/"signed off" framing (a smaller LOW row),
   but the underlying 8-season factual corruption (S22-29) is
   untouched and still needs a human-reviewed fix — can't ship from
   the loop.
3. **9 open `triage:needs-user` issues**, several stale (oldest:
   #398/#399 from 2026-06-11). Worth an `/oversight` sweep to close
   what's since been superseded.
4. **Content-curator pass owed** on `dancing-with-the-stars` S35 and
   `traitors` S5 — pass 174's fresh finding that both season pages
   restate their one headline fact 5-6 times across eyebrow/lede/meta/
   body. Small, well-scoped, safely cloud-actionable.

## Today's intent

With Rule 2 unstalled, expect the next tick to either continue
draining any further slots that have quietly aired, or pick up pass
174's two open findings (the repetition fix on today's own new
seasons, and the themed-list SEO-clip gap) if no new air dates have
landed. Top non-content signal: candidate #34's 69-day-unpromoted
status just posted its first test-count growth in two weeks, worth
flagging to `/oversight` as a reason to stop waiting for a quiet
night and consider the shard fix directly.

## Tuning proposals

None filed tonight. No fresh gate-mistuning or starvation pattern
surfaced this window — Rule 2 resumed real work on its own once air
dates landed, and `/expand`'s cadence gates correctly stayed closed
(critique spacing floor unmet, no pending phase/data rows).
