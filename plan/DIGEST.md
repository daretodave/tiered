# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

# DIGEST — 2026-07-13

## Headline

A high-volume, single-mission 26 hours: **23 march ticks, 21
green, 2 red** (both the identical `SDK execution error: Prompt
is too long` crash, both self-healed on the very next tick). The
window sits almost entirely inside the **2026-07-12 mission
pivot** (oversight `dd0f2d0`) — new-show creation is now LOCKED
and every tick's content work went to **season-fill drain**:
**16 seasons landed across 14 shows**, zero new shows, exactly as
directed. Catalog holds steady at **68 shows**; the CADENCE gap
table narrowed from **337 → 325** (summed across 52 remaining
rows), and **rhodubai became the first show to hit gap-zero**
under the new regime. The one real shadow: the nightly
`E2E_FULL=1` breadth run went red again on 2026-07-12 — but this
is a **newly-surfaced bug, not a repeat**. The prior four red
nights (07-06→07-09→07-10→07-11) were all the same 50-minute
duration-ceiling breach, fixed via oversight on 2026-07-12
(timeout 50→75min). 07-12's run was the **first clean run under
the new ceiling**, and it surfaced a genuine, previously-masked
regression: mobile horizontal overflow on
`/shows/the-challenge/season/vets-and-new-threats` — already
triaged to issue #568 and an AUDIT row same day, so it's tracked,
not lost. Deploy is green at HEAD (`62a5ee5`).

## While you were out

| Time (UTC) | Tick | Outcome |
|---|---|---|
| 07-12 09:56 | march → fix | success — broadened bare-restatement check (closes critique pass-91 finding) |
| 07-12 10:27 | march → critique pass 92 | success — 5 findings (0 high, 3 med, 2 low) |
| 07-12 11:02 | march → digest | success — 2026-07-12 morning briefing |
| 07-12 11:36 | march → expand pass 55 | success — 0 new candidates, WAVE 11 show-queue refill (now moot post-pivot) + candidate #24 reinforced |
| 07-12 ~07:47 | oversight (local) | **mission pivot** — new shows LOCKED, season-fill drain to zero becomes the priority, weekly whole-catalog sweep added (Rule 1a) |
| 07-12 12:36 | march → sweep | success — first weekly season sweep: 59 new/renewed seasons found across 28 shows, gap table seeded at 337 across 55 shows |
| 07-12 13:46 | march → content | success — RuPaul's Drag Race Season 18 backfill, gap addressed |
| 07-12 14:55 | march → content | success — Top Chef Season 23 (Carolinas) backfill, gap addressed |
| 07-12 16:40 | march → content | success — Great British Bake Off Series 16 backfill, gap addressed |
| 07-12 17:16 | march → critique pass 93 | success — 6 findings (1 high, 2 med, 3 low) |
| 07-12 18:40 | march → content | success — RHODubai Season 2 backfill, **drained to gap-zero**; 10 shows deferred into CADENCE as `1*` |
| 07-12 19:43 | march → content | success — The Challenge Season 41 ("Vets & New Threats") backfill, drained to 1* — **this is the page the nightly breadth run later flagged for mobile overflow** |
| 07-12 20:42 | march → content | success — Big Brother Season 27 backfill, drained to 1* |
| 07-12 21:35 | march → content | success — The Bachelor Season 29 backfill, drained to 1* |
| 07-12 22:47 | march → content | success — Project Runway Season 21 backfill, drained to 1* |
| 07-12 23:19 | (nightly, separate workflow) e2e-full | **red** — mobile overflow on the-challenge S41 page, 7,315 passed / 2 failed |
| 07-12 23:41 | march → content | success — Love Island US Season 7 backfill, drained to 1* |
| 07-13 00:40 | march → content | success — American Idol Season 24 backfill, drained to 1* |
| 07-13 01:16 | march → triage | success — filed nightly e2e-full failure as issue #568, routed to AUDIT.md |
| 07-13 02:34 | march | **red** — `SDK execution error: Prompt is too long`, no commit; self-healed next tick |
| 07-13 04:41 | march → content | success — RHOC Season 19 backfill, drained to 1* |
| 07-13 07:22 | march → content | success — MasterChef Australia Season 17 backfill, drained to 1 |
| 07-13 08:31 | march → content | success — Below Deck Mediterranean Season 10 backfill, drained to 1* |
| 07-13 09:47 | march → content | success — The Masked Singer Season 14 backfill, drained to 1* |
| 07-13 10:42 | march → content | success — Below Deck Down Under Seasons 3–4 (two-season batch) backfill, drained to 1* |

Net: 38 commits since the last digest window opened. 23 march
ticks tallied above, 21 green / 2 red — both reds the same known,
self-healing SDK crash class (see Tuning proposals).

## The saga

**Shows scaffolded:** 0 this window, by design — the mission
pivot locks new-show creation until the gap table reads zero.
Catalog holds steady at **68 shows**.

**Seasons drained:** **16 seasons across 14 shows** this window —
RuPaul's Drag Race S18, Top Chef S23, Bake Off Series 16, RHODubai
S2 (gap-zero), The Challenge S41, Big Brother S27, The Bachelor
S29, Project Runway S21, Love Island US S7, American Idol S24,
RHOC S19, MasterChef Australia S17, Below Deck Mediterranean S10,
The Masked Singer S14, Below Deck Down Under S3+S4. The CADENCE
gap table (regenerated by the first weekly sweep, 07-12) opened at
**337 across 55 shows**; today's table sums to **325 across 52
shows** — rhodubai is the first show fully drained to zero and
dropped off the table under the new regime. Pattern worth naming:
almost every drain this window moved a show from gap-2 to
gap-1-with-asterisk, not to zero — the asterisk means the *next*
season hasn't aired yet in the real world, so these rows are now
**blocked on air dates, not on writing capacity**. 25 of the 52
remaining rows already carry that asterisk.

**Velocity vs. bearings:** Rule 1 (show coverage) — LOCKED per
the pivot, correctly idle. Rule 1a (weekly sweep) — first run
complete 07-12, next due 07-19, on schedule. Rule 2 (season
completeness) — the whole window's engine; 16 seasons in ~25
hours is the fastest drain rate logged yet, and the smallest-gap-
first ordering is working exactly as specified. Rule 3 (themed
lists) — untouched this window (12 lists, quota ≥10 satisfied),
correctly deferred until gap-zero per the pivot's stated
sequencing.

**Critique backlog:** 2 passes landed (92: 5 findings, 0 high;
93: 6 findings, 1 high). Pass 93's 1 HIGH finding is still open
and hasn't shown up in a digest before — worth a look (see Needs
you).

## Queues now

- **AUDIT.md open:** 2 content-gaps rows (the standing
  season-fill-drain row, which stays pending by design until the
  gap table reads zero; the Love Island US S8 post-finale
  shift-note row, held pending a reunion airing 2026-08-31) plus
  4 non-content rows: the-challenge mobile-overflow bug (MED,
  score 5.4, issue #568, filed today), a themed-list category-
  enum docs drift (LOW), the `YEAR_TENURE_RE` teen-number gap
  (LOW, below iterate threshold), and one unfilled template line.
- **CRITIQUE.md:** last pass **93** (2026-07-12T17:16Z), 6
  findings (1 high, 2 med, 3 low), all still pending for the next
  `/iterate` tick. File now **3,463 lines / 1.6MB** (up from
  3,201 two days ago) — still growing, tracked by candidate #29.
- **PHASE_CANDIDATES.md:** file now **4,588 lines / 285KB** (up
  from 4,106 two days ago). Top unpromoted scores unchanged: **#15
  (9.4)** show canon completeness gate, **#28 (8.3)** stat-tile
  literal-duplicate invariant, **#25 (8.0)** canon-rationale/
  season-body echo gate. Last real promotion is still
  **2026-06-11 — now 32 days stale**. Candidates #26 (e2e-full
  timeout) and #32 (issue-dedupe staleness) both resolved via
  oversight 2026-07-12 and are off the board.
- **Triage:** 0 unlabeled open issues (clean, actively worked —
  #568 filed and routed same window). `triage:needs-user`: 3 open
  — **#565** (fresh, 2026-07-12, the "Prompt is too long" crash
  issue), and **#398/#399**, now **32–33 days stale**, no visible
  owner action since filed 2026-06-11. `triage:loop-queued`: 1 —
  **#568** (the mobile-overflow finding, same day).
- Other open issues worth a look: **#521** (severity:high,
  signed-in vote/comment CTAs flash anon on non-cached season
  pages — open since 2026-07-09, **4 days**, no digest mention
  until now), #535 (Summer House filming_caption restates
  location), #405/#400 (loop-opened phase issues, no urgency
  signal attached), #373 (mobile HvV pip-label duplicate, LOW).

## Needs you

1. **The recurring `SDK execution error: Prompt is too long`
   crash is now a confirmed pattern, not a one-off.** Two more
   occurrences this window (2026-07-12T14:12:48Z run 29195822244,
   filed as issue #565; 2026-07-13T02:34:36Z run 29219800641,
   unfiled) bring the running total to **4 occurrences since
   2026-07-08**, each self-healing on the next tick but each
   costing a full crashed cycle. Candidate #29 (archive closed
   CRITIQUE.md/AUDIT.md rows) has named this exact root cause for
   5 days — `plan/CRITIQUE.md` and `plan/PHASE_CANDIDATES.md` have
   both kept growing unpruned (now 1.6MB and 285KB respectively)
   and are the most plausible driver of the prompt-length ceiling.
   Recommend promoting #29 at the next `/oversight` session before
   a fifth occurrence lands.
2. **Issue #521 (severity:high)** — signed-in vote/comment CTAs
   flash anon state on non-cached season pages — has been open 4
   days with no digest visibility until this pass. Worth checking
   whether `/triage` or `/iterate` has actually looked at it.
3. **Two `triage:needs-user` issues (#398, #399) are now 32-33
   days stale** with no apparent progress since filing on
   2026-06-11. Worth a decision at the next `/oversight`: action,
   re-scope, or close.
4. **Phase-candidate backlog hasn't been promoted in 32 days**
   and both the file and the backlog keep growing. #15 (score
   9.4, show canon completeness gate) is still the standout
   unpromoted candidate.
5. **Critique pass 93's 1 HIGH finding** is unaddressed and
   appearing in a digest for the first time — confirm the next
   `/iterate` tick picks it up.

## Today's intent

**Saga:** keep draining the CADENCE gap table smallest-gap-first.
Most of the small-gap rows are now asterisked (blocked on
real-world air dates), so the genuinely actionable next targets
are the **non-asterisked** rows: `the-ultimatum` (1/4, gap 3) and
`perfect-match` (1/4, gap 3) — both fully writable now, unlike the
25 deferred `1*`/`2*` rows sitting above them in sort order.

**Top non-content finding:** the mobile-overflow bug on
`/shows/the-challenge/season/vets-and-new-threats` (issue #568,
AUDIT MED, score 5.4) — already scoped with a trace path, ready
for `/iterate` to pick up directly; no further research needed.

**Second-priority finding:** the SDK "Prompt is too long" crash
pattern (see Needs You #1) — a tuning proposal already exists
(#29), it just needs promotion.

## Tuning proposals

None new this tick. Reinforcing **candidate #29** (archive closed
CRITIQUE.md/AUDIT.md rows) with fresh numbers: `plan/CRITIQUE.md`
grew 3,201 → 3,463 lines and `plan/PHASE_CANDIDATES.md` grew
4,106 → 4,588 lines in the two days since it was last reinforced,
while the "Prompt is too long" crash it was filed to explain
recurred twice more in this window alone (4 occurrences total
since 2026-07-08). The correlation is now strong enough that this
should be treated as the standing top candidate for the next
`/oversight` promotion round, alongside #15/#28/#25 on pure score.
