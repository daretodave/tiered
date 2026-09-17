# DIGEST — 2026-09-17

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

A stalled-content window that still shipped real work. 6 tracked
`march` ticks since yesterday's digest (15:16 09-16 through 13:22
09-17, ~22h), all green, zero no-ops. Rule 2 stayed fully locked
(CADENCE gap table flat at 40 shows / 41 gap-slots, every row
starred confirmed-but-unaired, next sweep due 2026-09-20) and Rule 3
went **zero-ship three ticks running today** — the first genuine
three-in-a-row same-day Rule-3 dry spell logged, each pass
independently chasing and rejecting a fresh angle rather than
repeating a stale search. The loop redirected twice: one round of
the standing `pnpm content:check` echo-drain fallback (round 7,
the-city-already-had-a-show) and pass 162's critique/expand cycle,
which filed 2 new CRITIQUE findings and 2 new phase candidates
(#39, #40). The one deteriorating story: `e2e-full` breached its
75-minute wall for an **eighth consecutive night**, catalog now flat
at 10,602 tests for four straight nights — confirms the wall is a
pure single-worker throughput ceiling, not a growth chase. Candidate
#34 (shard the crawl) is now 58 days unpromoted, the single
longest-unpromoted candidate on file. Countertrend: candidate #35
(night.yml starvation) has now run **11 consecutive clean nights**,
its best streak on record. Deploy is ready at HEAD (f168625b).

## While you were out

| time (UTC) | commit | verb | outcome |
|---|---|---|---|
| 17:16–18:08 | 17d830ee | audit | content-gap re-verified — Rule 2 stalled, Rule 3 zero-ship (1st) |
| 20:25–20:37 | b0af7a0d | expand | pass 71 — 2 candidates filed (#39 heartbeat false-positive, #40 `YEAR_TENURE_RE` teen-number gap) |
| 23:14–23:33 | 36beacd0 | critique | pass 162 — 2 new findings (0 high, 1 med, 1 low); both passes mechanically clean, no spoiler leaks |
| 01:41–01:56 | 99f09b32 | audit | content-gap re-verified — Rule 2 stalled, Rule 3 zero-ship (2nd) |
| 07:29–08:22 | dd3704e6 | content | `pnpm content:check` echo-drain fallback, round 7 — 11 headline/body-echo entries reworded on the-city-already-had-a-show |
| 12:46–13:25 | f168625b | audit | content-gap re-verified — Rule 2 stalled, Rule 3 zero-ship (3rd, independent angles chased and rejected) |

6 of 6 tracked runs completed cleanly; all shipped something (content,
audit ledger, critique, or candidate filing). No crashes this window.

## The saga

**Rule 2 (season-fill drain):** locked the entire window. CADENCE gap
table held flat at **40 shows carrying a gap / 41 gap-slots**, every
row starred confirmed-but-unaired as of the 2026-09-13 tenth full
weekly sweep — next sweep due **2026-09-20**, three days out. One
near-term trigger already on the board: `masterchef` (US) S16's
finale Part 2 was confirmed for **2026-09-17 — today** — worth
checking on the next tick whether the finale aired and the gate
should fire.

**Rule 3 (themed lists):** zero-ship for the first time on three
independent same-day passes (17d830ee, 99f09b32, f168625b) — each
tick chased at least one fresh angle to a full draft before rejecting
it on duplicate-stake or already-shipped grounds, rather than
repeating a stale search. `f168625b` also confirmed `CROSS_SHOW_STRICT`
is already strict in `scripts/content-check.ts`, so the
under-floor-extend fallback that has rescued prior dry spells is
foreclosed by construction right now, not just by search — a
structurally tighter dry spell than prior Rule-3 stalls. Catalog
holds exactly flat at **68 shows / 1,052 seasons / 68 canons / 182
themes** — unchanged from yesterday's digest, zero new season or
theme content this window.

**Fallback paths carried the window.** With both rules locked, the
loop used two of its standing redirects: the `pnpm content:check`
echo-drain (issue #758's workaround, round 7 today) reworded 11
headline-to-body echo instances on one themed list, and the
critique/expand cycle (pass 162 + expand pass 71) filed 2 fresh
findings and 2 fresh candidates. Net: for the fourth straight window,
genuine work is landing even when both content rules are dry — but
today is the first time all three of a single day's dispatch ticks
were pure audit re-verification with no content or code shipped
alongside them, worth watching if it becomes a pattern rather than a
one-day dry spell.

## Queues now

- **`plan/CRITIQUE.md`**: pass 162 (2026-09-16 23:30, commit
  36beacd0). Pending section: **48 headings** (0 HIGH / 28 MED / 20
  LOW), up from 46 last digest (+2 from tonight's pass, none
  resolved same-tick). File still too large for a direct `Read`;
  `grep`/`awk` remain the only safe access path.
- **`plan/AUDIT.md`**: 7 Pending rows: 2 HIGH (the-voice factual
  corruption #762, unchanged; night.yml starvation #763/candidate
  #35 — no new occurrence, now 11 clean nights), 2 MED (season-fill
  drain, continuously reconfirmed; e2e-full duration-ceiling —
  eighth breach night logged tonight), 3 LOW (SERP description
  budget; `YEAR_TENURE_RE` regex gap, now also candidate #40;
  heartbeat false-positive #806, now also candidate #39).
- **`plan/PHASE_CANDIDATES.md`**: 21 candidates awaiting promotion
  (2 new this window: #39, #40). Candidate #34 (shard e2e-full) — 58
  days unpromoted, eighth consecutive red night, now the single
  longest-unpromoted candidate in the file. Candidate #35 (decouple
  night.yml) — 52 days unpromoted, but 11 consecutive clean nights,
  softening urgency relative to #34.
- **Open `triage:needs-user`**: 8 issues, unchanged — #762
  (the-voice) and #763 (night-starvation) remain the two live ones
  needing an actual decision, now 40 days untouched since
  2026-08-08.
- **Open `triage:loop-queued`**: 5 issues (#636, #754, #785, #787,
  #806), unchanged — #636 (e2e-full tracking issue) picked up one
  more "Recurred" comment tonight (now 49 total).

## Needs you

1. **Candidate #34 (shard e2e-full) is now 58 days unpromoted, eight
   consecutive red nights — the longest unbroken streak yet, and the
   catalog has held perfectly flat at 10,602 tests for four straight
   nights.** This is no longer a "ceiling erodes as catalog grows"
   story — it's a pure single-worker throughput problem at the
   current, stable catalog size, which makes sharding a durable fix
   rather than a stopgap. Still a `.github/workflows/e2e-full.yml`
   edit the cloud loop structurally cannot push (no `workflows` OAuth
   scope) — only a local/`/oversight` session can promote it. This is
   now the single longest-unpromoted item in `plan/PHASE_CANDIDATES.md`.
2. **the-voice factual corruption (issue #762) — S30 premieres in 4
   days (2026-09-21, NBC).** S22-29 stays frozen pending a
   human-reviewed 8-file renumbering fix; live frontmatter still
   reads `status: hiatus` with a "the show has ended" framing that
   scout-verified research says is false.
3. **Rule 3 hit a structurally tighter dry spell today** — not just
   "no idea found" but `CROSS_SHOW_STRICT` confirmed strict, so even
   the under-floor-extend fallback is unavailable right now. Worth
   watching whether tomorrow's ticks find fresh ground or whether this
   needs an `/expand` pass dedicated to the themed-list catalog.
4. **Night.yml (candidate #35) has now run clean 11 nights running**
   — its best streak on record, the opposite of urgent. If this
   holds, #35 can keep deferring in favor of #34.

## Today's intent

Rule 2 stays locked until either the 2026-09-20 sweep or a confirmed
`masterchef` S16 finale landing — the finale's confirmed air date is
**today**, so the next tick or two should check whether it aired and
whether the phase-39 finale gate should fire. Rule 3 is in its
tightest dry spell yet (three independent same-day rejections plus a
foreclosed fallback); expect another fallback-path tick (echo-drain,
critique-redirect, or ledger hygiene) unless fresh themed-list ground
turns up. Top non-content finding, sharpened tonight: candidate #34
at 58 days unpromoted, eight consecutive red nights, now the file's
single longest-unpromoted item — still needing an `/oversight`
decision.

## Tuning proposals

No new meta-loop tuning candidates filed tonight (expand pass 71's
#39/#40 are standard findings-driven filings, not gate-tuning
proposals). Reinforcing evidence added to two already-open
candidates (both edits landed in this digest commit):

- **Candidate #34** (shard e2e-full): appended 09-17 detail to both
  `plan/AUDIT.md` and `plan/PHASE_CANDIDATES.md` — eighth consecutive
  breach night, catalog flat at 10,602 for a fourth straight night,
  now the file's single longest-unpromoted candidate at 58 days.
- **Candidate #35** (decouple night.yml): appended 09-17 detail
  noting the clean streak has extended to 11 consecutive nights
  (09-06 through 09-16, tonight's run in flight at digest time) —
  recommend #34 lead the next `/oversight` session ahead of #35 given
  the diverging trends (one worsening, one dormant).

No gate mistuning observed otherwise — Rule 2/3 correctly recognized
their own stall on all three ticks today rather than forcing a
mediocre list, and the fallback paths (content:check echo-drain,
critique/expand cycle) kept real work landing.
