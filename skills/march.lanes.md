# March lanes

> This project's own `/march` steps. The kit re-syncs
> `skills/march.md` and never touches this file, so a step
> that keeps your loop moving lives here, not there.

---

`skills/march.md` reads this file at two hooks, through
`node scripts/plan/lanes.mjs march <hook>`:

| Hook | Where in the tick | Yields to |
|---|---|---|
| `pre` | after Step 0 (sync, veto sweep), before triage | the Asap lane (and support rows): runs only when neither has a ready item |
| `queue` | after 3a (no ready chunk), before the next queue step | nothing: 3a already found no ready chunk |

One block per lane. `when` is prose (the agent judges it) or
`script <path>` (exit 0 runs the lane); absent, the lane
always runs. `return: end-tick` makes the lane the tick's
work; `continue` (the default) lets the tick go on.
`Lanes off: <name>, <name>` in `plan/bearings.md` turns a
lane off by name. No lane blocks here means stock dispatch.

The example below sits inside a comment, so it is no lane.
Copy it out of the comment to make it one.

<!--
## lane: weekly-snapshot
- hook: pre
- when: script scripts/lanes/snapshot-due.mjs
- run: node scripts/snapshot.mjs --write, then commit the snapshot
- return: end-tick
-->

<!-- Moved from the v1 skills/march.md by nexus upgrade (2026-10-27): the text the kit never shipped, verbatim. Check each lane's hook and when. -->

## lane: finale-detection-gate-phase-39
- hook: pre
- when: as the section below says (moved verbatim from the v1 skills/march.md)
- run: the section below
- return: section

### Step 0.5 — Finale-detection gate (phase 39)

Run the idempotent finale gate before triage. It reads
`content/calendar.yml`, finds finales whose `finale_date` is in
the past with no shift note filed yet, and appends one
`category: content-gaps, source: self` row per finale into
`plan/AUDIT.md`'s `## Pending` block:

```bash
node scripts/finale-gate.mjs
```

This is a fast, side-effect-light no-op when nothing is due (and
when the calendar file is absent). It is **not** a gate that can
fail the march — exit non-zero only on an unexpected I/O error;
log it and continue. If it filed rows, they flow into the normal
content-gap dispatch (Step 3b.5) on this or a later tick. The
content drain that picks up a `source: self` finale-shift row
**may autonomously write the spoiler-safe post-finale
ranking-shift note AND adjust that season's `canonical_position`**
if the editorial rationale warrants it (oversight 2026-05-19;
spoiler discipline is P0 — the note frames the *ranking shift*,
never the winner/elimination/outcome).

## lane: cadence-gates-oversight-2026-07-12
- hook: pre
- when: as the section below says (moved verbatim from the v1 skills/march.md)
- run: the section below
- return: section

### Step 1.5 — Cadence gates (oversight 2026-07-12)

Read `plan/CADENCE.md`.

**Season sweep due?** (last run ≥ 7 days ago, or never): this
tick IS the sweep. Execute bearings Rule 1a end-to-end — scout
the whole catalog (batch ≤ 12 shows per agent, every status),
cross-grep frontmatter `seasons:` vs. season files, regenerate
the gap table, stamp the clock, file findings + `review-due`
flags in `plan/LISTS.md`. Commit as `sweep: weekly season sweep
— <N> new seasons found, gap <M>`, push, `pnpm deploy:check`,
and **return**.

**Show-add due?** (LOCKED until the gap table reads zero; then
≥ 14 days since the last add completed its drain): file ONE
add-show `category: content-gaps` row into `plan/AUDIT.md` per
bearings Rule 1, stamp the CADENCE show-add log, and **fall
through** — Step 3b.5 dispatches it this tick or the next.

Neither due → fall through.

**Step 2.0 — Shipping-mode gate (hard precondition, checked
first).** Open `plan/README.md` "Status
(at-a-glance)". If the **Phase 36** row is not `[x]` (i.e. any
of the shipping-queue phases 26 / 32 / 34 / 35 / 36 is still
`[ ]`), the project is in **shipping mode**: **skip the entire
critique gate and fall straight through to Step 3.** Do not
read the metadata header, do not run `deploy:check`, do not
spawn `reader`. This precondition overrides the "never + a
phase shipped" clause below — that clause must not fire during
shipping mode. Rationale + ownership: `plan/bearings.md`
"Critique cadence" (set by the user 2026-05-16); the gate line
also appears in `plan/CRITIQUE.md`'s header. Once Phase 36 is
`[x]`, this gate lifts and the rate-limited logic below applies
normally.

Read metadata header at top of `plan/CRITIQUE.md`:

```
> Last pass: <ISO-date> at commit <sha>
> Pass count: <N>
```

Dispatch to `/critique` if **all three** hold:

1. Current commit is at least **12 commits after** `Last pass`,
   OR `Last pass` > **24 hours ago**, OR `Last pass` is "never"
   and at least one substantive phase (e.g., the canonical
   sibling) has shipped.
2. `pnpm deploy:check` shows a green deploy.
3. No pending HIGH critique already queued for iterate.

If all three hold:

- Read `skills/critique.md`.
- Execute its procedure end-to-end.
- Return.

Otherwise fall through to Step 3.

## lane: pending-data-notes
- hook: queue
- when: as the paragraphs below says (moved verbatim from the v1 skills/march.md)
- run: the paragraphs below, which amended the kit's step "3b. pending data?"
- return: continue

#### 3b. Pending data?

For tiered.tv: data work means Supabase migrations / RLS
changes / data ops. There's no `data/BACKLOG.md` (tiered.tv
is hybrid-with-managed-postgres, not gh-as-db). Instead,
check `plan/AUDIT.md` for `category: data` rows.

If any Pending `category: data` row scores ≥ 3.0:

## lane: content-gap-rows
- hook: queue
- when: as the section below says (moved verbatim from the v1 skills/march.md)
- run: the section below
- return: section

#### 3b.5. Content-gap rows?

Open `plan/AUDIT.md`. Score all Pending rows with
`category: content-gaps` per the standard formula
(`impact × ease / 10`, then 1.5x bias multiplier if the
header reads `> Bias: content-gaps`).

If any row scores ≥ 3.0:

- Read `skills/ship-content.md`.
- Execute its procedure end-to-end.
- Return.

(tiered.tv's live content-velocity rules live in
`plan/bearings.md` "Content velocity & editorial cadence".
Per the 2026-07-12 oversight pivot: **new-show creation is
LOCKED** — Rule 1 fires only via the Step 1.5 show-add clock
(biweekly, armed at gap-zero, and the added show drains fully
before the next add). **Season fill + ranking (Rule 2) owns
every content tick until the `plan/CADENCE.md` gap table reads
zero** — smallest-gap-first, up to 10 seasons/tick, canon
reranked in the same commit, standing drain row in
`plan/AUDIT.md`. **Themed lists (Rule 3) are the main perpetual
objective afterward** — one excellent list per tick, review
nags per `plan/LISTS.md`, reviews outrank new lists when ≥ 5
are due. Rule 4 (facade) stays retired. `/expand` no longer
refills any show queue. This dispatch still fires on most
content-eligible ticks indefinitely — the fountain changed from
new shows to seasons-then-lists.)

## Notes from the v1 skills/march.md (reference, not lanes)

The v1 skill's own words outside its procedure: what its loop did
and why. No lane runs them; read them when a lane above needs the
context.

## 1. Purpose

```
unlabeled issues exist          →  /triage
ELSE season sweep due (7d)      →  sweep tick (bearings Rule 1a)
ELSE critique due (rate-lim)    →  /critique
ELSE pending phase              →  /ship-a-chunk
ELSE pending data (category:data)  →  /ship-data
ELSE content-gap row scoring ≥3 →  /ship-content
ELSE expand due + bold posture  →  /expand
ELSE                            →  /iterate
```

(The show-add clock — biweekly, armed only at gap-zero — is
checked alongside the sweep in Step 1.5; when due it files one
add-show row and falls through to normal dispatch.)

## 6. Quick reference

```bash
# State files
plan/README.md          # pending phases
plan/CADENCE.md                      # season-sweep + show-add clocks, gap table (Step 1.5)
plan/LISTS.md                        # themed-list ledger + review flags
data/BACKLOG.md                      # pending data work
plan/CRITIQUE.md                     # critique queue + last-pass metadata

# External signals
gh issue list ...                    # unlabeled count
pnpm deploy:check                    # green-deploy condition

# Skills it dispatches into
skills/triage.md                     # Step 1 (cheapest)
skills/critique.md                   # Step 2 (rate-limited)
skills/ship-a-chunk.md               # Step 3a
skills/ship-data.md                  # Step 3b
skills/ship-content.md               # Step 3b.5
skills/expand.md                     # Step 3c (posture-gated)
skills/iterate.md                    # Step 3d
```
