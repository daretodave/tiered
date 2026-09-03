# DIGEST — 2026-09-03

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

A clean, high-output day: 12 shipping commits, critique pass 150
fired and all 5 of its findings (2 HIGH, 2 MED, 1 LOW) drained
same-day. Breadth verdict is green. One transient march crash
(API overload, self-recovered) is the only blemish. Rule 2 stays
locked at a 42-show gap table (all starred, confirmed-but-unaired)
and Rule 3's idea space stays saturated per issue #758 — today's
entire content output came from the critique-redirect path, which
is working exactly as designed.

## While you were out

| time (UTC) | commit | verb | outcome |
|---|---|---|---|
| 15:05 | dedc5094 | content | filming_caption bare-restatement drain round 6 (bake-off, rhony) |
| 15:05 | d8d9310c | audit | progress note for round 6 |
| 15:15 | 607a86f7 | digest | 2026-09-02 nightly briefing |
| 18:47 | ab2df09f | content | filming_caption bare-restatement drain round 7 (hells-kitchen) |
| 18:48 | 62aab5a3 | audit | progress note for round 7 |
| 22:00 | ab1b8f7d | content | filming_caption bare-restatement drain round 8 (below-deck-med, masterchef-au, queer-eye, the-challenge, the-real-world) |
| 22:00 | 4c53a8f0 | audit | progress note for round 8 |
| 00:20 | 8db89494 | content | WHY THIS SLOT restatement drain — top-chef, bake-off, hells-kitchen, project-runway, the-voice |
| 00:27 | 4dbdea4f | audit | HIGH bare-restatement finding closed |
| 01:34 | e9650396 | critique | pass 150 — 5 fresh findings (2 HIGH, 2 MED, 1 LOW) |
| 07:13 | 0a93f65d | content | pass-150 HIGH findings drained (survivor s50, amazing-race canon) |
| 07:24 | 4940bc06 | audit | pass-150 HIGH findings marked addressed |
| 12:28 | fa64c3eb | content | pass-150 MED/LOW findings drained |
| 12:30 | 11e6a15f | audit | pass-150 MED/LOW findings marked addressed |
| 11:42 (no-op) | — | march | **crashed** — transient `API Error: 529 Overloaded`, no code shipped, no-op. Auto-appended to the recurring crash-tracker issue #565 (14-day dedup match). Self-recovered by the next scheduled tick. |

37 of 40 tracked march runs since 2026-08-31 succeeded; the 3
non-successes are 1 genuine crash (today, transient overload) and
2 GitHub-side cancellations (concurrency-group churn, not agent
failures).

## The saga

**Rule 2 (season-fill drain):** flat. The gap table has read 42
starred (confirmed-but-unaired) rows since the 2026-08-30 eighth
full weekly sweep — nothing actionable, nothing to drain. Next
sweep due 2026-09-06. `show-add` stays LOCKED (won't arm until the
table reads zero). Near-term real events that will unlock fresh
Rule 2 material once they air: Survivor S51 (2026-09-23, CBS,
confirmed), The Voice S30 (2026-09-21, NBC, confirmed — but see
"Needs you," this show's back catalog is under a content freeze),
America's Got Talent S21 finale (2026-09-23).

**Rule 3 (themed lists):** saturated per issue #758 — the idea
space has been exhaustively searched for weeks with no new raw
material. No list-drain activity today.

**Content-gap redirect (issue #758's escape valve):** carried the
entire day's content output. Critique pass 150 filed 5 findings at
01:34 and all 5 were drained within the same 26-hour window — 2
HIGH (Survivor 50's fan-vote/cast-size fact repeated 4-6x across
sections; a fifth show, Amazing Race, caught by the "WHY THIS
SLOT re-paraphrases body copy" systemic defect class first found
on top-chef/bake-off) and 2 MED + 1 LOW (Big Brother's "three
stacked twists" restated 4x; Top Chef's LCK rule-change restated
5x; two themed lists over-concentrating entries in 2 shows each,
left as a future-extension guideline rather than retrofitted).
Separately, an 8-round `filming_caption` bare-restatement sweep
ran across the day (rounds 6-8: bake-off, rhony, hells-kitchen,
below-deck-med, masterchef-au, queer-eye, the-challenge,
the-real-world) plus a `slot_argument` ("WHY THIS SLOT") sweep
across top-chef, bake-off, hells-kitchen, project-runway, and
the-voice's founding-five span (S1-S5 only — S22-29 stays frozen
per the corruption block).

Catalog stands at 68 shows / 1048 seasons / 68 canons / 181 themes
(per the last verify-gate `content:check` run).

## Queues now

- **`plan/CRITIQUE.md`**: pass 150 (2026-09-03, today) — fully
  drained same-day, first time in a while a pass closed out
  same-window rather than carrying leftovers. 8 rows remain `[ ]`
  in the file, but 7 of them are `[needs-user-call]`-flagged
  (genuine editorial/product tradeoffs already surfaced for a
  human decision — B-tier browse filters, the meta-count-vs-date
  chip label, the ISR/dynamic-caching investigation split, the
  own-profile stat-chip question) and the 8th is a LOW,
  not-urgent themed-list concentration note. Nothing pending is
  cloud-actionable right now.
- **`plan/AUDIT.md`**: 5 real pending rows (excluding the row
  template). 2 HIGH: the-voice factual corruption (issue #762,
  `triage:needs-user`, blast-radius fix needs a dedicated
  oversight-reviewed pass) and the night.yml/march
  concurrency-eviction race (issue #763, `triage:needs-user`,
  needs a workflow-file edit the cloud token can't push). 1 MED:
  the e2e-full 75-minute duration-ceiling breach pattern (BLOCKED
  FROM CLOUD, same OAuth-scope wall) — though the two most recent
  breadth runs both came back green, so this is currently quiet.
  2 LOW: themed-list SERP description-length budget (parked,
  needs an oversight call between a mass-trim pass and relaxing
  the budget) and the `YEAR_TENURE_RE` teens/bare-"ten" regex gap
  (re-scoped, genuinely not a one-tick fix, tangled with the
  the-voice freeze).
- **`plan/PHASE_CANDIDATES.md`**: last pass 67 (2026-08-30), ~30
  considered rows awaiting promotion. The two most load-bearing —
  #34 (shard the e2e-full crawl) and #35 (decouple night.yml's
  concurrency group) — are both unpromoted 43+ days now and are
  the direct fixes for the two HIGH AUDIT rows above. Both are
  workflow-file edits the cloud loop cannot push; both are ready
  to apply at the next local `/oversight` session.
- **Open `triage:needs-user`**: 8 issues, most stale. The two live
  ones are #762 (the-voice corruption) and #758 (content-gap
  starvation escape valve, working as designed, itself needs no
  further action). #565 (recurring crash-tracker) just got a
  fresh comment today from the transient 529 overload.
- **Open `triage:loop-queued`**: 4 issues; #636 (nightly e2e-full
  duration-ceiling, mirrors the AUDIT MED row) is the only live
  one — #785/#787/#754 all read as already resolved via linked
  commits.

## Needs you

1. **the-voice factual corruption (issue #762)** — 8 season files
   (S22-29) carry conflated dates/casts and a fabricated "series
   finale" that produces a live false "the show has ended" claim.
   Fix is an 8-file renumbering cascade with a canon rebase and
   themed-list cross-reference sweep — correctly gated behind a
   human-reviewed session, not a cloud tick. The Voice's real S30
   premieres 2026-09-21; that date will make the live-false-claim
   problem more visible, not less, the longer this sits.
2. **Two workflow-file infra fixes, both blocked from cloud push**
   — candidate #34 (shard the e2e-full crawl, breadth run has
   been recurring on a duration-ceiling wall on and off for 43
   days, currently quiet but unfixed) and candidate #35 (decouple
   night.yml's concurrency group from march, the digest has gone
   dark for multi-night stretches four times since 2026-07-21,
   most recently two clean nights running as of yesterday). Both
   are ready-to-apply, low-risk, sitting in
   `plan/PHASE_CANDIDATES.md`, waiting only on a local session
   with `workflows` OAuth scope.
3. **7 `[needs-user-call]` CRITIQUE rows** are genuine
   editorial/product tradeoffs (browse-filter taxonomy decisions,
   a chip-label naming reversal, an ISR/dynamic split, an
   own-profile empty-state reversal) that the loop has correctly
   declined to auto-resolve. None urgent; worth a batch pass next
   `/oversight`.

## Today's intent

Rule 2/3 stay locked/saturated — expect another content-gap
redirect day. The `filming_caption` and `slot_argument` sweeps are
mid-drain (both systemic defect classes, not yet corpus-clean);
picking up where round 8 left off is the highest-value next content
move. Top non-content finding: the two infra candidates (#34, #35)
remain the standing `/oversight` recommendation — nothing new to
add to that ask today.

## Tuning proposals

None. The content-gap redirect mechanism (issue #758) worked
exactly as intended today — same-day critique-pass closure is the
best turnaround this loop has produced in weeks. No new gate
mistuning observed in today's pulse.
