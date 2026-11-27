# DIGEST — 2026-11-27

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

**Eleven straight days of a daily weekly-quota pause-and-reset cycle —
#853 through #864 — silenced the night shift itself: every scheduled
`/digest` run from 2026-11-17 through 2026-11-26 hit the quota gate's
pre-flight skip before Claude Code even started, so this is the first
edition in eleven days and the first time this file's own reporting
mechanism has been taken out by the exact pattern it exists to track.**
Recovery windows between a pause issue closing and the next one opening
stayed mostly in the 11–50 minute band the whole stretch (shortest:
~11min between #862 and #863; longest: ~49min between #863 and #864) —
the 2026-11-16 digest's "healthiest post-reset stretch yet" (10h23m) did
not turn into a trend; no day since has broken meaningfully past
sub-hour. `pulse.mjs --motion` confirms the throughput cost directly:
**stalled** for a third straight week (6 shipped against a 19.5 baseline,
floor 9.75). Despite the throttling, the loop still landed 38 commits in
the gaps: **spec 53** (archive aged `CRITIQUE.md`/`AUDIT.md` rows out of
the live ledger) was chunked, built across three chunks, and fully closed
tonight — **the plan tree now reads 0 specs, 0 chunks, 0 held**, empty
for the first time in this digest's run. Spec 52 also finished the night
right after the last digest. Content kept draining the season-fill gap
table (4 backfills: shark-tank, southern-charm, dragrace-uk, the-circle;
gap now 34) and filed 2 finale-shift notes (survivor S50, dragrace S17).
Three critique passes ran (207: 1 LOW; 208: clean; 209: a MED finding
reconfirmed into a **HIGH** — the near-zero-vote community block, now
three flagship instances). The nightly breadth check (`e2e-full`) stayed
green every run this window; HEAD deploys clean. One housekeeping item:
the candidates queue just tripped its cap (16 pending vs. 15) for the
first time — the next `/march` Step 0 cap sweep should cut the stale
score-3.0 Newsletter-subscribe candidate (proposed 197 days ago).

## While you were out

| when (UTC) | verb | outcome |
|---|---|---|
| 11-16 20:36–21:00 | march | spec 52.2 closed + settled; content-curator documented the sentence-initial-position guardrail — then quota exhausted, issue #853 opened (paused until 11-17 08:00) |
| 11-17 ~08:00–20:46 | — | #853 open; `night` 11-17 run skipped (quota gate) |
| 11-17 12:34–13:12 (~38min window) | march | critique pass 207 (1 LOW); motion refill; 2 field research candidates filed; finale-shift note — survivor S50 — then re-exhausted, #854 opened (paused until 11-18 08:00) |
| 11-18 ~13:12–12:21 | — | #854 open; `night` 11-18 run skipped (quota gate) |
| 11-18 12:21–12:52 (~31min window) | march | weekly season sweep (+1, gap 37); critique pass 208 (clean) — then re-exhausted, #855 opened (paused until 11-19 08:00) |
| 11-19 ~12:52–10:49 | — | #855 open; `night` 11-19 run skipped (quota gate) |
| 11-19 10:49–11:06 (~17min window) | march | season backfill — shark-tank — then re-exhausted, #856 opened (paused until 11-20 08:00) |
| 11-20 ~11:06–09:15 | — | #856 open; `night` 11-20 run skipped (quota gate) |
| 11-20 09:15–09:31 (~16min window) | march | critique pass 209 — 1 finding reconfirmed, bumped MED→HIGH (near-zero-vote block, 3rd flagship instance) — then re-exhausted, #857 opened (paused until 11-21 08:00) |
| 11-21 ~09:31–15:20 | — | #857 open; `night` 11-21 run skipped (quota gate) |
| 11-21 15:20–16:07 (~47min window) | march | 2 field research candidates filed; season backfills — southern-charm, dragrace-uk — then re-exhausted, #859 opened (paused until 11-22 08:00) |
| 11-22 ~16:07–08:55 | — | #859 open; `night` 11-22 run skipped (quota gate) |
| 11-22 08:55–09:11 (~16min window) | march | finale-shift note — RuPaul's Drag Race S17 — then re-exhausted, #860 opened (paused until 11-23 08:00) |
| 11-23 ~09:11–13:45 | — | #860 open; `night` 11-23 run skipped (quota gate) |
| 11-23 13:45–14:07 (~22min window) | march | season backfill — the-circle — then re-exhausted, #861 opened (paused until 11-24 08:00) |
| 11-24 ~14:07–11:42 | — | #861 open; `night` 11-24 run skipped (quota gate) |
| 11-24 11:42–12:05 (~23min window) | march | spec 53 chunked (archive drain); one depth-promotion candidate reality-checked and rejected (no real scope) — then re-exhausted, #862 opened (paused until 11-25 08:00) |
| 11-25 ~12:05–15:03 | — | #862 open; `night` 11-25 run skipped (quota gate) |
| 11-25 15:03–15:14 (~11min window) | march | second depth-promotion candidate rejected (no real scope) — then re-exhausted, #863 opened (paused until 11-26 08:00) |
| 11-26 ~15:14–15:53 | — | #863 open; `night` 11-26 run skipped (quota gate) |
| 11-26 15:53–16:42 (~49min window) | march | weekly season sweep (+1, gap 34); spec 53.1 built end-to-end (`ledger-archive.mjs` + archive files + tests), closed, settled — then re-exhausted, #864 opened (paused until 11-27 08:00) |
| 11-27 09:11–19:24 (10h+, no re-exhaustion) | march | spec 53.2 and 53.3 built, closed, settled (ledger-archive wired into critique close-out; aged rows drained into `CRITIQUE_ARCHIVE.md`/`AUDIT_ARCHIVE.md`) — **spec 53 fully closed, plan tree now empty**; 2 field research candidates filed |
| 11-27 19:33 | night | this digest — first edition in 11 days |

## Shipped

- **Spec 53** (archive closed `CRITIQUE.md`/`AUDIT.md` rows out of the
  live ledger) — chunked 11-24, built across three chunks (53.1
  `ledger-archive.mjs` + archive files + colocated tests; 53.2 wired into
  critique close-out; 53.3 drained the actually-aged rows into
  `CRITIQUE_ARCHIVE.md`/`AUDIT_ARCHIVE.md`), all three closed and settled.
  **The plan tree now reads 0 specs, 0 chunks left, 0 held** — empty for
  the first time since this digest started tracking it.
- **Spec 52** (prose sentence-capitalization invariant) — chunk 52.2
  ("Curator brief guardrail") closed and settled the night of the last
  digest; spec fully done.
- **Season-fill drain** — 4 backfills (shark-tank S18, southern-charm
  S12, dragrace-uk S8, the-circle S8), gap table down to 34 shows / ~36
  gap-slots (was 37→34 across the window, net of 2 sweeps finding new
  aired seasons). 2 finale-shift notes filed (survivor S50, dragrace
  S17) — standing AUDIT content-gaps row stays Pending; see Queues now
  for the remaining count.
- **Critique passes 207–209** — 207: 1 new LOW finding; 208: clean; 209:
  0 new findings but reconfirmed/escalated an existing MED to **HIGH**
  — the near-zero-vote community block on
  `/shows/top-chef/season/carolinas`, `/shows/bachelor/season/grant-ellis`,
  and now `/shows/survivor/season/heroes-vs-villains` (the site's own
  most-promoted season, "1 VOTE SO FAR" sixteen years after air date).
  Third flagship instance, worsening not improving — flagged for
  editorial judgment on the empty-state copy, not a prescribed fix.
- **2 weekly season sweeps** — one new aired season each tick (gap
  37→34 net of backfills).
- **2 depth-promotion candidates reality-checked and rejected** (the
  wagering-markets-as-spoiler-leak-channel candidate, twice flagged) —
  both had no real scope once written out ("not a reason to change any
  gate today"), correctly rejected rather than forced into a spec.
- **2 field-research passes** filed/re-evidenced candidates (vote-spam
  validation layer, spoiler-free competitive positioning) — both still
  below the promotion floor (score 6.0, not yet 7 days old or
  twice-re-evidenced).
- **`plan-rows.mjs`** gained `sliceRows`, the row-slicing counterpart to
  `countRows`, in support of the ledger-archive mechanism.

## Queues now

- **plan:** 0 specs, 0 chunks left, 0 held — empty.
- **plan/AUDIT.md:** 8 pending reported. The known undercount bug
  (candidate score 5.6, still unfixed) means the true count is
  materially higher — a direct hand-count under `## Pending` found 24
  real open rows: 16 finale-shift content-gap notes (dancing-with-the-
  stars:35 freshest, survivor:48 oldest) plus the standing season-fill-
  drain row — all of which route through `/ship-content`'s own lane, not
  `/iterate`'s AUDIT-score path, per the existing undercount candidate's
  note — and 2 open score-4.0 rows tied for the top of `/iterate`'s
  actual dispatch path (see Today's intent).
- **plan/CRITIQUE.md:** 86 pending (1 HIGH, 49 MED, 36 LOW), last pass
  209, 8d ago (2026-11-20). The 1 HIGH is the near-zero-vote block
  finding above.
- **candidates:** 16 pending (12 >21d), oldest 198d. `promote.mjs cap`:
  **16 pending vs. cap 15 — 1 over due** (would cut the score-3.0
  Newsletter-subscribe candidate, proposed 197d ago) — first time this
  window has tripped the cap; no actual cut has run yet (`cuts --since
  2026-11-16`: none). `sweep`: clean, 0 held lines. `pick`/`due`: both
  `none` tonight — no Pending candidate scores 6+ and is 7d old or
  re-evidenced twice (the two freshest score-6.0 research candidates
  were only first re-evidenced today, 11-27).
- **support:** 0 open user issues, no activity to report this tick.

## Needs you

- **oversight needed: candidate queue silting (12 pending >21d, oldest
  198d).** Same 12-over-21d count as the 2026-11-16 digest, but the
  oldest-pending age climbed the full 11 days (187d → 198d) with
  nothing promoted in between (`pick`/`due` both `none` throughout).
  Now also over the Pending cap (16 vs. 15) for the first time — the
  next `/march` Step 0 cap sweep should resolve that mechanically, but
  the age-silting itself still needs a human look.
- **motion stalled: shipped 6 / baseline 19.5 (2026-W47 against
  2026-W43..2026-W46), floor 9.75.** Third straight stalled week, same
  documented cause as the prior two (the quota pause-and-reset cycle —
  see Tuning proposals). `stall_action: promote` (bold posture) should
  have `/march` react on its own next tick.
- Promote: aged — `sweep` reads clean (0 held), `pick`/`due` both `none`
  → **auto-promoted none, 0 awaiting.**
- No `cut` lines this window (`cuts --since 2026-11-16`: none) — but
  the cap is now tripped (see Queues now); expect one next digest once
  `/march` Step 0 runs its cap sweep.
- No `rotate` lines — `secrets.mjs audit` read 0 events.
- No blocked rows, no open `[needs-user-call]` rows, no
  `triage:needs-user` / `loop:do` issues open, nothing else to
  escalate.

## Today's intent

Plan tree is empty — no ready chunk to name. The strongest Pending
candidates (two score-6.0 rows, re-evidenced today) are both still below
the promotion floor's age/re-evidence bar, so the next `/march` tick's
likely path is either a fresh `/expand` pass to refill the plan, or
picking up `/iterate`'s top AUDIT-score row. That top row is a tie at
score 4.0 between two open bugs: the `scripts/plan/settle.mjs`
chunk-removal defect (filed 11-15, still unfixed — ironically the same
class of defect spec 53's own archive mechanism now depends on getting
right) and the `[loop]` motion-stalled-in-2026-W46 row (filed 11-17,
still unfixed, now joined by this week's fresh W47 stall reading above).

## Tuning proposals

One tonight, evidence appended to an existing `plan/CANDIDATES.md` row —
no gate, cadence, or ceiling edited directly:

1. **Cloud workflows need a fallback for org-level Claude access
   outages** (`[score 5.4]`, pending since 2026-08-20, now carrying four
   prior update notes). Appended an `Update (digest 2026-11-27)` citing
   eleven more weekly-quota cycles (#853 through #864) in the eleven
   days since the last digest — essentially one pause-and-reset cycle
   every single day, recovery windows staying in the 11–50 minute band
   throughout, no day breaking past sub-hour the way 2026-11-16's
   10h23m stretch briefly suggested might be starting. Noted the new
   wrinkle: this is the first time the pattern silenced `/digest`
   itself — all 10 scheduled `night` runs between 2026-11-17 and
   2026-11-26 hit the quota gate's pre-flight skip before Claude Code
   started, which is why this edition is 11 days late. `pulse.mjs
   --motion` confirms a third straight `stalled` week. No score
   change — this is the most direct evidence yet that the quota
   governor (which fixed the crash-vs-clean-pause symptom) cannot fix
   the underlying funding-source constraint; the candidate's own fix
   sketch items — a pay-per-token fallback, or a cadence/ceiling
   change — remain the only two levers that would change this pattern,
   and both need a human call at the next `/oversight` session.
