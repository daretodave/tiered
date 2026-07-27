# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

# DIGEST — 2026-07-27

## Headline

**The night shift is back after a silent 7-day outage — and it
found its own outage as the top story.** `plan/DIGEST.md` sat
frozen on its 2026-07-20 snapshot all week because `night.yml`
shares a concurrency group with `march`, and march's hourly
triggers kept evicting the once-daily night run from its queue
slot before it could start — six cancellations, one timeout,
zero alarms anywhere. Meanwhile the content saga kept moving
without interruption: 22 commits in the last 26h, all Rule 3
(themed-list) work, zero yield to anything else. e2e-full's
duration-ceiling breach is now on its **7th consecutive red
night**, unpromoted 6 days after filing. And `the-voice`'s deep
content corruption (filed last night) is still an open HIGH row
nobody has started fixing.

## While you were out

Pulse window: last 26h (2026-07-26T09:38Z → 2026-07-27T11:38Z).

| Tick | Verb | Outcome |
|---|---|---|
| 22 commits | content (18) / audit progress-notes (4) | All Rule 3 (themed-list) drain — extend-first pattern on `milestones-spent-not-marked` and `when-the-cast-was-already-related`, plus several zero-ship passes recorded as audit notes. Zero commits from `/iterate`, `/triage`, `/ship-a-phase`, or `/ship-data` this window — the content gate held 100% purity. |
| march runs (22 in window) | dispatcher ticks | 19 success, 3 failure — all 3 failures match the self-healing `issue #565` crash pattern (now 32 recurrences total, zero content lost each time; next tick always recovers). |
| e2e-full (nightly breadth) | duration-ceiling breach | **Red again**, 7th consecutive night (07-21→07-27). All completed checks passed; the crawl just runs out of its 75-minute wall before finishing (9,098/~10,200+ tests, ~89% complete tonight). Not a regression — a scaling problem. See "Needs you." |
| night (this tick) | digest | **First successful run in a week.** See Headline — the gap itself is tonight's top finding. |
| deploy:check | HEAD `32c7475` | `ready` on Vercel. No red deploy. |

## The saga

**Rule 2 (season-fill drain) stays fully stalled.** Every row in
`plan/CADENCE.md`'s gap table (36 shows) is starred
(confirmed-but-unaired) — there is no unstarred gap for the
dispatcher to act on, so Rule 3 has correctly owned every content
tick since the last sweep (2026-07-26, next due 2026-08-02).

**Rule 3 (themed lists) is deep into diminishing returns.** The
catalog now carries **172 live themed lists** (craft 63, single
70, era 10, structure 13, tone 16). `plan/LISTS.md`'s Ideas log
shows the extend-first strategy dominating: last night alone ran
at least 15 numbered passes on a single tick, most zero-shipping
before landing two genuinely fresh entries by extending
`milestones-spent-not-marked` (Shark Tank S10, Project Runway
S10) rather than finding a new concept. The log's own assessment:
"extend-first now stands at 4-for-5" against "a blind new-concept
search's historical ~1-in-13 rate" — the well of fresh angles is
real but shallow, and getting shallower. Worth watching whether
`/expand` needs to widen Rule 3's search space before the
zero-ship streaks start costing more ticks than they yield.

**New content-integrity risk surfaced and contained:** `the-voice`
has a confirmed, deep factual corruption (8 of 29 season files —
wrong dates, conflated casts, a fabricated "series finale" that
never happened, a currently-live false "the show has ended" claim
in its own frontmatter). Filed HIGH last night with a full fix
scope; the loop has correctly locked new `the-voice` content
until it's resolved, but nothing has started the fix pass itself
yet — see "Needs you."

## Queues now

- `plan/AUDIT.md` Pending: 7 rows. 1 standing content-gaps row
  (Rule 2 drain, stalled per above — not actionable). 6
  non-content: e2e-full duration-ceiling breach (MED 5.4, 7th
  recurrence), the-voice corruption (HIGH 4.8), night-workflow
  starvation (HIGH 6.4, filed this tick), plus 3 LOW single-tick
  fixes (`ship-content` mirror idempotency, `/ship-a-phase` close-
  trailer reliability, `YEAR_TENURE_RE` teen-number blind spot,
  themed-list category enum drift).
- `plan/PHASE_CANDIDATES.md`: 43 total candidates filed, 16
  pending promotion (35 total after tonight's addition). Top
  three by score: #15 (9.4, show-canon completeness gate), #28
  (8.7, stat-tile duplicate-value invariant), #25 (8.3, canon-
  rationale echo gate) — none promoted in 39+ days.
- `plan/CRITIQUE.md`: pass 104, 2026-07-25 — 2 days stale, current
  by this file's own cadence.
- GitHub issues: 11 open. `triage:needs-user` — 4 (#398, #399
  both 46+ days stale; #565 self-healing crash tracker, 32
  recurrences; #586 night-crash tracker, now superseded by
  tonight's fuller root-cause row). `triage:loop-queued` — 1
  (#636, the e2e-full mirror). 0 unlabeled.

## Needs you

1. **Night-shift starvation (new, HIGH, score 6.4).** `night.yml`
   shares a concurrency group with `march`; march's hourly cadence
   keeps evicting night's queued daily run before it starts.
   Tonight's success was luck, not a fix — expect this to recur
   most nights until the workflow is decoupled. Candidate #35 has
   the scope sketch (own concurrency group + a lighter race guard
   for the digest's plan/-only commit). Likely blocked from cloud
   (same `workflows` OAuth-scope gap as candidates #26/#34) —
   needs local/`/oversight`.
2. **e2e-full duration ceiling, 7th straight red night.** Candidate
   #34 (shard the crawl) has sat unpromoted 6 days. Every
   completed check still passes — this is pure scaling debt, not a
   quality regression, but the crawl's effective coverage keeps
   eroding as the catalog grows.
3. **`the-voice` content corruption (HIGH, filed 07-26).** 8
   season files need a source-by-source Wikipedia/NBC re-verify,
   a possible file-count insertion, a frontmatter status fix
   (`hiatus`→`airing`), and two new seasons authored. Scoped as too
   large and too fabrication-risky for a same-tick autonomous
   patch — recommends a dedicated `/expand`-tracked phase or an
   oversight-reviewed tick.
4. **`triage:needs-user` issues #398/#399** — 46+ days stale, no
   apparent movement since filing 2026-06-11.
5. **Phase-candidate backlog unpromoted 39+ days** — #15 (9.4) is
   the standout; #28 and #25 close behind.

## Today's intent

**Saga:** Rule 2 stays stalled until the next sweep (2026-08-02)
or a starred row's air date passes. Expect Rule 3 to keep
absorbing every content tick, with zero-ship passes becoming more
common as the 172-list well gets harder to mine — watch whether
extend-first keeps outperforming blind new-concept search, or
whether it's time to widen the search space.

**Top non-content finding:** the night-shift starvation bug
(candidate #35) — a full week of the loop's only human-facing
instrument going dark with zero alarm anywhere, root-caused and
scoped tonight. Fixing it doesn't just restore the digest; it
restores the meta-loop's ability to notice things like this at
all going forward.

**Second-priority finding:** `the-voice` corruption — live,
reader-facing, false editorial claim ("the show has ended") that
needs a dedicated verification pass before any more `the-voice`
content ships.

## Tuning proposals

1. **New candidate #35** (decouple `night.yml`'s concurrency group
   from `march`) — filed this tick with full run-history evidence:
   6 cancelled runs, 1 timeout, and the `if: failure()` blind spot
   that let all of it go unnoticed for a week. Scope sketch
   proposes a dedicated `group: night` plus a lighter pre-commit
   `git pull --ff-only` + retry-once guard in place of the shared
   queue, since the digest's commit only ever touches `plan/`
   prose. `/oversight` decides.
2. **Reinforced candidate #34** (shard the e2e-full crawl) with
   this tick's evidence: 7th consecutive red night, still
   unpromoted 6 days after filing. No change to score or scope —
   evidence only.
3. **No new candidate filed for the-voice.** It's a content-fix
   scope, not a rails change — tracked as the HIGH AUDIT row with
   a recommendation for a dedicated `/expand`-tracked phase or an
   oversight-reviewed tick, not a `/digest`-level tuning proposal.
