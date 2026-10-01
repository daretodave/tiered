# DIGEST — 2026-10-01

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

Five clean `march` ticks since last night's briefing, zero
dispatcher crashes, catalog flat. Rule 2 stayed fully stalled all
window (37/37 gap-slots, every row starred confirmed-but-unaired
except `the-voice`, still blocked behind #762), so the loop worked
its fallback lanes: two Rule 3 themed-list extends (`the-cast-
outgrew-the-format` gained a Dancing with the Stars S35 entry,
`best-comeback-seasons` gained an RHONY S16 entry), a logged
zero-ship Rule 3 research pass, critique pass 177 (2 findings — 1
HIGH, 1 MED), and a content-gap redirect that closed the HIGH
same-day (RHONY's "eight seasons" vs. "eight years"
self-contradiction, standardized on the math-correct "eight years"
across four files). **The red streak broke:** `e2e-full` posted
**green** last night (01:48–03:03 UTC, 75m duration — the same wall
candidate #34 targets, but this run finished clean inside it) after
three consecutive red nights through 2026-09-30. Deploy is ready at
HEAD `ffa844d9`. Catalog holds at **68 shows / 1,057 seasons / 68
canons / 182 themes**.

One correction to last night's briefing: the "83-row CRITIQUE.md
pending queue" figure was wrong. A fresh, careful count this tick
(the file mixes an older `- [ ]` checkbox format with a newer
`### [SEV]` heading format introduced around pass-170+, and a naive
grep undercounts the newer rows) puts the true open count at **55**
(0 HIGH, 32 MED, 23 LOW), 7 of them `[needs-user-call]`. Noted here
so the number doesn't propagate further; see Queues now below for
the corrected baseline.

## While you were out

| time (UTC) | commit | verb | outcome |
|---|---|---|---|
| 19:13 (09-30) | ff45c15d | content (Rule 3, zero-ship) | targeted re-pass on two newest seasons; no candidate cleared the excellence gate — logged, not silent |
| 23:26 (09-30) | d67b507e, 0d0c5af1 | content (Rule 3) | themed-list extend — `best-comeback-seasons` gains rank-13 RHONY S16 entry (12→13 entries, 10→11 shows) |
| — 01:48–03:03 | — | e2e-full (nightly) | **green** — breaks the three-night red streak, 75m duration (same wall as the red runs, this one finished clean) |
| 02:24–02:25 | 9bfe503f, 85ef95ec | content (Rule 3) | themed-list extend — `the-cast-outgrew-the-format` gains rank-8 DWTS S35 entry (18→19 entries, 15→16 shows) |
| 08:00 | c1042342 | critique | pass 177 — 2 findings (1 high, 1 med, 0 low) |
| 16:02 | e479b844, ffa844d9 | content (gap redirect) | RHONY `the-legacy-return` "eight seasons" vs. "eight years" self-contradiction fixed same-day, closing critique pass-177's HIGH across 3 files |

All 5 ticks shipped real work (one a deliberately logged zero-ship,
not a silent no-op); no dispatcher crashes this window.

## The saga

**Rule 2 (season-fill drain):** fully non-actionable the entire
window. Gap table unchanged at **37 shows / 37 gap-slots**; every
row is starred confirmed-but-unaired except `the-voice`, still
blocked behind issue #762's unresolved factual-corruption fix. Next
sweep due 2026-10-04 — the only near-term lever that could reopen
Rule 2 before then is a real air date crossing on an already-starred
row.

**Rule 3 (themed lists):** two genuine extends this window plus one
honestly logged zero-ship. A narrow same-day re-pass first came back
empty (90-day-fiance S12 and DWTS S35's headline facts already
claimed elsewhere), then a widened net across the three
most-recently-filed seasons cleared RHONY S16 ("The Legacy Return" —
Carole Radziwill's full-time return onto a twice-overhauled cast,
added to `best-comeback-seasons`) and DWTS S35 (record-tying 16-pair
cast + first Olympic/Paralympic pairing, added to `the-cast-
outgrew-the-format`). Alone S13 and Traitors S05 both dead-ended on
the same pass (facts already staked elsewhere, or too close to
existing framing).

**Content-gap redirect:** same-day closure of critique pass-177's
HIGH — RHONY's `the-legacy-return` season body, `watch_list` entry,
and `canon.md`'s own `slot_argument` field all said "eight seasons
away" for Carole Radziwill's absence, while `canon.md`'s own
rationale prose two lines later said "eight years away" —
internally self-contradicting within one file, and visibly
contradicting within one page scroll. The math backs "years" (season
ten to season sixteen is a five-season/eight-year gap): standardized
on "eight years away" across all four locations, including the
freshly-shipped `best-comeback-seasons` entry it had already
propagated into. Followed the established content-gap-redirect
pattern (issue #758) rather than hunting a third same-day Rule 3
candidate.

**e2e-full breadth watch:** the three-night red streak (candidate
#34's single-worker throughput ceiling) broke last night — the run
finished **green** in 75 minutes, the same duration as the red
nights but this time inside the wall rather than hitting it
mid-suite. Candidate #34 itself is unchanged in substance (still a
fixed single-worker ceiling, still needs sharding) — a green night
doesn't retire the underlying fix, just means tonight's catalog size
happened to clear it. Now **71 days unpromoted** since filing
(2026-07-22), still the file's longest-lived open candidate.

Catalog: **68 shows / 1,057 seasons / 68 canons / 182 themes** —
flat overnight (both content ticks extended existing lists plus one
same-day redirect fix; no new season or list filed, Rule 2 stayed
dry).

## Queues now

- **`plan/CRITIQUE.md`**: last pass 177 (2026-10-01, commit
  c1042342), 2 new findings (1 HIGH — resolved same-day, 1 MED, 0
  LOW). The HIGH (RHONY self-contradiction) closed same-day per the
  content-gap redirect above; the MED (Amazing Race `family-edition`
  — a near word-for-word duplicate paragraph between the season body
  and `canon.md`'s rationale, unusually blatant) remains open.
  **Corrected pending count: 55 open findings (0 HIGH, 32 MED, 23
  LOW)**, 7 explicitly parked `needs-user-call` — see the Headline
  correction above for why last night's "83" was wrong. Most of the
  55 are single-surface content/voice fixes or a11y/SEO items
  already well-scoped for `/iterate`.
- **`plan/AUDIT.md`**: 8 open rows (7 non-content-gaps + the standing
  content-gaps season-fill row) — 2 HIGH (`the-voice` factual
  corruption #762, frozen since 2026-08-08; the historical
  night.yml-starvation row), 1 standing MED (season-fill drain,
  37/37, all starred), 1 MED (e2e-full duration-ceiling — green last
  night, but the underlying ceiling candidate is unchanged), 2 LOW
  (SERP description budget; `YEAR_TENURE_RE` teen-number gap), 1 LOW
  (heartbeat false-positive #806, no recurrence since filing).
- **`plan/PHASE_CANDIDATES.md`**: last `/expand` pass still 73
  (2026-09-26, commit c66d6e53) — no new pass this window, 5 days
  since last. Candidate #34 (shard e2e-full) crossed **71 days
  unpromoted**; last night's green run is a relief reading, not new
  evidence against the fix — still the standing `/oversight`
  recommendation.
- **Open `triage:needs-user`**: 9 issues, unchanged from yesterday —
  #762 (the-voice) remains the oldest live urgency; several stale
  from June–August (#398, #399, #565, #586, #758, #763, #777) plus
  #817 (self-resolved digest crash from 09-25).
- **Open `triage:loop-queued`**: 5 issues, unchanged (#636, #754,
  #785, #787, #806).
- **0 unlabeled open issues** — `/march` Step 1's triage sweep has
  nothing waiting.

## Needs you

1. **Candidate #34 (shard e2e-full) crossed 71 unpromoted days**,
   still blocked on a `.github/workflows/e2e-full.yml` edit the
   cloud loop cannot push (lacks the `workflows` OAuth scope). Last
   night's run finished green, but that's the ceiling clearing by
   margin on a flat-catalog night, not the fix landing — worth
   promoting now rather than waiting for the next red night to force
   the issue again.
2. **the-voice factual corruption (issue #762) is still going
   stale.** No comment since 2026-08-08. Still needs a
   human-reviewed fix — can't ship from the loop given the blast
   radius (8-file renumbering cascade + canon rebase) — and it's the
   sole blocker keeping Rule 2 from fully draining the gap table.
3. **9 open `triage:needs-user` issues**, several stale (oldest:
   #398/#399 from 2026-06-11). Worth an `/oversight` sweep to close
   what's since been superseded.
4. **55-row CRITIQUE.md pending queue** (32 MED, 23 LOW) is large
   enough that a few high-leverage single-file fixes (the fresh
   Amazing Race duplicate-paragraph MED, the `/themes`
   heading-navigation a11y gap) are sitting open behind lower-value
   rows purely by queue order. A scored sweep could surface the best
   `/iterate` picks faster than sequential reading.

## Today's intent

With Rule 2 fully starred and Rule 3 freshly mined (two extends
landed this window), expect the next tick to pick up a well-scoped
CRITIQUE finding — the fresh Amazing Race `family-edition`
duplicate-paragraph MED (pass-177, same defect class fixed dozens of
times elsewhere in the catalog) is the cleanest single-file pick
sitting open. Top non-content signal: candidate #34's 71-day
unpromoted mark (Needs you #1) is the single clearest case for an
`/oversight` pickup — it's fully diagnosed, well-scoped, and blocked
purely on OAuth scope the loop doesn't have.

## Tuning proposals

None filed tonight. No fresh gate-mistuning or starvation pattern
surfaced this window — Rule 2/Rule 3 handed off cleanly, the
content-gap-redirect pattern closed a same-day HIGH cleanly, and
`/expand`'s cadence gates correctly stayed closed (no new pass due,
5 days since pass 73). The e2e-full pattern is unchanged in shape
from prior assessment — already fully diagnosed as candidate #34 —
and last night's green run doesn't change that diagnosis, just
confirms the ceiling is marginal rather than broken outright (see
Needs you #1 for the promotion ask, not a new proposal).
