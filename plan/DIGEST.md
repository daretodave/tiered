# DIGEST — 2026-10-30

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

**A quiet content night with one loose thread worth an owner's
eye: the loop's own "landed" accounting doesn't match git.** Five
`march` ticks completed since last night's digest. Two shipped
real content — the themed lists `the-verdict-never-settled` (7
entries/5 shows, tone) and `just-split-the-room-in-half` (10
entries/6 shows, structure) — and one logged an honest zero-ship
(Rule 3 research: two thin craft lists, a single-show sweep, six
cross-show angles, every lead already claimed or sub-floor). The
other two (01:22–02:47 and 07:44–08:52 UTC) are the odd part:
GitHub Actions shows both completed successfully and the
workflow's own idle-tracking step logged `Idle record: landed`
for each, but `git log --all --grep` finds no commit on `main`
carrying either run's `Cloud-Run:` trailer — by the git history
this agent can see, nothing landed from either tick. Rule 2
(season-fill) stays locked out (CADENCE gap table fully starred,
36 shows / 38 gap-slots, next sweep due 2026-11-03). Breadth is
green (latest `e2e-full` passed), deploy is green, and the
candidate queue silting is unchanged and still needs an owner
turn. One correction to last night's notes: CRITIQUE.md currently
carries **two** open HIGH findings, not one — last night's "sole
pending HIGH" (rhoc's Homecoming eyebrow/body number mismatch)
is still open, but a second HIGH (below-deck-down-under/canouan's
four-times-repeated headline facts, filed pass 192) was also open
and wasn't named last night.

## While you were out

| when (UTC) | verb | outcome |
|---|---|---|
| 10-29 16:53–17:48 | march | success — themed list `the-verdict-never-settled` shipped (7 entries/5 shows, tone category); concluded after last night's digest was written |
| 10-29 21:45–22:43 | march | success — themed list `just-split-the-room-in-half` shipped (10 entries/6 shows, structure category) |
| 10-30 01:22–02:47 | march | CI reports success, idle-tracker logged "landed" — **no matching commit found on `main`** (`git log --all --grep="Cloud-Run: .../41021973341\|.../40985500864"` returns nothing for either this run or the next); see Needs you |
| 10-30 07:44–08:52 | march | same anomaly as above — CI success + "landed" logged, no corresponding commit on `main` |
| 10-30 14:35–15:03 | march | success — Rule 3 research, honest zero-ship (two thin craft lists, single-show sweep, six cross-show angles, all dead ends; trail logged to `plan/LISTS.md` Ideas) |

## Shipped

- **Content (2 themed lists):** `the-verdict-never-settled`
  (survivor x3 at the informal per-show cap, project-runway,
  america's-next-top-model, bake-off, love-is-blind — shipped
  lean at 7 of the usual 10-24 after excluding two near-duplicate
  candidates) and `just-split-the-room-in-half` (survivor x3,
  the-challenge x2, the-apprentice x2, bachelor-in-paradise,
  so-you-think-you-can-dance, america's-next-top-model — gender
  as sole casting rule, no franchise-shared angle rejected from
  prior-art mining logged in the ledger row).
- **No Rule 2 (season-fill) work shipped** — CADENCE gap table
  stays fully starred; nothing eligible until a real premiere
  date lands.
- **Two ticks of unclear provenance** (01:22–02:47, 07:44–08:52)
  — see Headline and Needs you. Treating these as no-ops for
  queue-math purposes since no content/code change is visible on
  `main`.

## Queues now

- **plan:** 0 specs, 0 chunks left, 0 held — unchanged; building
  is idle, AUDIT/CRITIQUE/CADENCE maintenance and the content
  mission carry the loop.
- **plan/AUDIT.md:** 0 pending — unchanged.
- **plan/CRITIQUE.md:** 71 pending, last pass 4d ago (pass 193,
  commit `72f85b9b`, 2026-10-27) — unchanged in count; no new
  pass ran this window (both open HIGHs keep the gate closed).
  2 HIGH / 41 MED / 28 LOW. Correction from last night: no
  `[needs-user-call]`-tagged row is currently findable in the
  Pending list by text search (last night's "4 of 71" figure
  didn't reproduce — flagging rather than silently carrying it
  forward).
- **plan/CANDIDATES.md:** 21 pending (20 >21d), oldest 170d.
  Support (fix-all): 0 open user issues · first response none (0
  opened in 7d) · close 2191.2h mean (6 closed in 7d).
- **Candidate cap:** 15 (current count 21, 6 over) — no cuts
  since the last digest (`promote.mjs cuts --since 2026-10-29` →
  none).
- **Open `triage:needs-user` / `loop:do`:** 0 across both labels.
- **data/BACKLOG.md:** no data-layer backlog file exists.
- **Deploy:** ready at HEAD `f37bb7ec`.
- **CADENCE gap table:** unchanged, 36 shows / 38 gap-slots, every
  row starred confirmed-but-unaired; next sweep due 2026-11-03.
- **Breadth (`e2e-full`):** green — latest run (2026-10-30T02:24–
  02:52Z) passed; read via `gh run list`, not re-run, per the
  standing rule for this tick.
- **seven_day utilization:** unknown (no cached reading).
- **Motion:** 26 shipped last full week (W43) vs. floor 9.5 —
  `ok`; 25 shipped so far in the current week (W44), already past
  the floor.

## Needs you

- **The idle-tracker/git-history mismatch on the 01:22–02:47 and
  07:44–08:52 ticks.** Both runs' own "Idle record" step logged
  `landed: true` (it checks `git log --all --grep` for a commit
  carrying that run's `Cloud-Run:` trailer), but this digest's own
  identical check against today's `main` finds no such commit for
  either run URL. Either a race between that check and a later
  rewrite of history, a transient git-state read, or a bug in the
  landed-detection path — not root-caused this tick (notes-only,
  no code changes permitted). Worth a look before trusting the
  idle/no-op counters blindly; no content or queue-state harm is
  visible (nothing is missing from the catalog), so this is a
  instrumentation-trust finding, not a content-loss one.
- **oversight needed: candidate queue silting (20 pending >21d,
  oldest 170d).**
- **`Promote: aged` is live (`Improve: bold`) but the valve still
  can't turn itself from the cloud.** 8 Pending candidates clear
  both the floor (6.0) and the age bar (21d) — unchanged from last
  night: top of the stack is `[score 9.4] Show canon completeness
  lax→strict gate` (proposed 2026-06-15, 137d old). Every cloud
  checkout lacks the `.owner` marker, so `promote.mjs pick` returns
  `ask`, not `pick` — the intended trust boundary, not a bug; the
  dial only actually turns from a local, owner-mode `/oversight`
  session. **auto-promoted none, 8 awaiting.**
- **Two open HIGH critique findings**, both content-only, one-field
  fixes: (1) rhoc's Homecoming season eyebrow says "after 13
  seasons away" while the body says "since season thirteen" — two
  different numbers for the same gap
  (`content/shows/rhoc/seasons/20-the-homecoming.md`'s `eyebrow`);
  (2) below-deck-down-under's Canouan season restates its two
  headline facts (Caribbean move, charter crossover) near-verbatim
  four times across meta description, lede, "the take," and the
  body's section-02 opener
  (`content/shows/below-deck-down-under/seasons/04-canouan.md`).
  Either is a same-shape, single-tick fix.
- No `escalate #N` rows (0 open user issues), no blocked specs
  (`Held` lane empty), no open needs-user issues, no `motion
  stalled` (this week already clears the floor), no `rotate` rows
  (0 secret-audit events; this is a cloud run, so the check is
  skipped anyway).

## Today's intent

1. The plan table is empty — the next ready work is either open
   HIGH: rhoc's eyebrow/body number mismatch (still open since
   last night) or below-deck-down-under's four-times-repeated
   facts (open since pass 192, missed in last night's note).
   Both are one-field content fixes and either clears the
   critique gate for its next pass.
2. At the next local `/oversight` session: turn the `Promote:
   aged` valve (8 candidates waiting, top-scored 9.4), weigh the
   candidate-queue silting (20 of 21 pending over 21 days old,
   oldest 170d), and take a look at the idle-tracker/git-history
   mismatch flagged above.

## Tuning proposals

None filed as candidates this tick. The idle-tracker discrepancy
above is a real anomaly but this pass couldn't isolate a root
cause without re-running or modifying code (out of scope for a
notes-only digest) — flagged in Needs you instead of guessed into
a candidate that might misdiagnose it.
