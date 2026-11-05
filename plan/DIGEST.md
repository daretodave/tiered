# DIGEST — 2026-11-05

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

**Today's commits were all direct/local — none of the day's four
landed commits came from an autonomous `march` tick; the loop's own
ticks rode along as no-ops, confirming a HEAD a human had already
moved.** All four commits since last digest (`c0d6d584`, `32718757`,
`bb6217f4`, `2051a05b`) carry David Rehmat's authorship, not
`claude[bot]`. The sequence: a perf change landed (show/season pages
forced static, middleware narrowed) → the nightly `E2E_FULL=1` crawl
caught two real regressions in it a few hours later (a duplicated
`Location` header on season alias/digit redirects, and the
community-view 308 landing on the wrong tab) and auto-filed issue
#837 → the perf commit was reverted outright before this digest ran,
so HEAD is clean and no fix is owed, only housekeeping (closing
#837). Separately, a quota-gate bug got fixed (a reading whose
7-day window had reset was being dropped instead of refreshed on a
skipped tick), and spec 49's veto window closed, releasing it to
Ready. Quota is healthy (`0.03` utilization, resets 2026-11-09).
Candidate queue silting is unchanged and worsening in relative terms:
still all 16 pending over 21 days old, oldest now 176 days, and the
pending cap (15) is now exceeded by one — the next `/expand` pass's
cap valve will cut the lowest-scored row (Newsletter subscribe,
score 3.0) automatically. Deploy state wasn't checked this tick — the
cloud carve-out for digest explicitly waives the deploy gate, and
`deploy:check` hung with no output (likely no network egress to the
Vercel API from this sandbox), so it was killed rather than run to
its 10-minute timeout. See Needs you for the open items.

## While you were out

| when (UTC) | verb | outcome |
|---|---|---|
| 11-04 19:37 | commit (local) | `c0d6d584` — perf: show/season pages forced static, middleware narrowed |
| 11-04 21:50, 11-05 02:21, 11-05 09:53 | march | success, no-op — HEAD already at `c0d6d584`, nothing new to ship |
| 11-05 03:10–03:48 | e2e-full (nightly) | **red** against `c0d6d584` — season alias/digit redirects intermittently double the `Location` header once ISR's fallback cache warms a non-pregenerated param; community-page 308 lands but `CanonTabSwitch` races `?view=` and shows the wrong tab. Auto-filed issue #837 |
| 11-05 10:16 | commit (local) | `32718757` — reverts `c0d6d584` outright; both regressions are races not worth patching around on this perf shape |
| 11-05 13:53 | commit (local) | `bb6217f4` — fix: quota gate dropped a reading whose 7-day window had reset; skipped ticks weren't refreshing it |
| 11-05 17:58 | march | success, no-op — HEAD already at `bb6217f4` |
| 11-05 18:07 | commit (local) | `2051a05b` — plan: veto sweep released spec 49 to Ready (veto window closed clean) |
| 11-05 18:12 | march (chain) | in progress as of this writing; HEAD still `2051a05b` |

## Shipped

Nothing shipped by the loop itself today — every landed commit above
was local/direct. The loop's contribution was entirely no-ops riding
along on a HEAD it didn't move, plus the nightly breadth check doing
its job (catching the perf regression before any `march` tick had to
deal with it — it was already gone by revert before this digest ran).

## Queues now

- **plan:** 2 specs, both Ready — 48 (5 chunks left) and 49 (just
  released from its veto window). 0 chunks held.
- **plan/AUDIT.md:** 6 pending (unchanged) + 1 new resolved-on-filing
  row for the e2e-full breadth failure (filed `[x]`, already fixed by
  the revert — see Needs you for the one housekeeping item it left
  open). Pending breakdown unchanged from last digest: 1 standing MED
  (season-fill drain, always-open by design), 5 LOW.
- **plan/CRITIQUE.md:** 72 pending (unchanged), last pass 2026-11-04
  (pass 195, ~42h ago — no new pass since). 0 HIGH, 41 MED, 31 LOW.
- **candidates:** 16 pending (16 >21d), oldest 176d — **1 over the
  15-item pending cap** (`promote.mjs cap` confirms: would cut
  "Newsletter subscribe (Buttondown embed)," score 3.0, age 175d, on
  the next `--write` run). `promote.mjs sweep` is clean (nothing
  due for aged auto-promotion this tick) and `cuts --since 2026-11-04`
  returned none (no cut has actually executed yet). Support:
  1 open user issue · first response none (1 opened in 7d) · close
  none in 7d.

## Needs you

- **oversight needed: candidate queue silting (16 pending >21d,
  oldest 176d).** Unchanged from last digest — nothing has moved
  since the v1→v2 migration folded them into Pending on 2026-10-27.
  New wrinkle tonight: the queue is now 1 over its 15-item pending
  cap, so the next `/expand` pass will auto-cut the lowest-scored row
  (Newsletter subscribe, score 3.0) rather than a human choosing what
  goes. The highest-scored pending candidate (8.3, "Canon-rationale/
  season-body verbatim-argument echo gate," filed 2026-07-06) still
  directly addresses CRITIQUE's dominant MED pattern (restatement
  across a page's own sections) and is the strongest promotion
  candidate if `/oversight` wants to act on one thing tonight.
- **Housekeeping: issue #837 ("Nightly e2e-full failed") is still
  open and unlabeled**, even though its underlying regression was
  already reverted (`32718757`) hours before this digest ran. No
  comment links the two. Next `/triage` tick (or a direct close)
  should close #837 citing `32718757` — filed as an `[x]`-resolved
  row in `plan/AUDIT.md` for the record, but the GitHub issue itself
  still needs closing.
- Promote: aged — `sweep` reads clean, 0 awaiting (spec 49 already
  released today per the veto-sweep commit above, not awaiting
  anymore).
- No `cut` lines — `promote.mjs cuts --since 2026-11-04` returned
  none (the 1-over-cap state above hasn't been written yet).
- No motion-stalled line — `pulse.mjs --motion` reads `ok` (36
  shipped last full week vs. 19.5 baseline, well above the 9.75
  floor; 1 so far in 2026-W45).
- No `rotate` lines — `secrets.mjs audit` read 0 events.
- No blocked rows, no open `[needs-user-call]` rows, no
  `triage:needs-user` / `loop:do` issues, nothing else to escalate.

## Today's intent

Next ready work: spec 48's first chunk (A1, stat-tile value/caption
literal-duplicate guard) or spec 49's first chunk, both Ready with no
chunks held. Top standing finding: the season-fill drain row (MED,
score 4.5) — shark-tank, rhoslc, and dragrace-uk remain immediately
actionable from the last drain tick's own flag. Top non-standing
finding: either of the two housekeeping items above (closing #837,
or letting `/expand` run its cap valve) — both are quick and
unblock a cleaner queue state before the silted-candidate oversight
conversation happens.

## Tuning proposals

None filed this tick. The candidate-queue silting is the same
unresolved signal as last digest (and the one before it) — still no
new tuning to propose beyond what's already sitting in Pending
(candidate #25, score 8.3, already covers the CRITIQUE pattern) and
still `/oversight`'s call to promote, not this skill's to re-flag
with a fresh candidate.
