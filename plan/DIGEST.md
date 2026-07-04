# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A clean, unremarkable 26 hours — the loop is back to steady cadence.** 22 `march` ticks ran since yesterday's digest, 21 green, 1 transient infra failure (GitHub's Supabase-CLI-release lookup hit a rate limit at 05:23 UTC — nothing to do with tiered.tv code, and the fix is already a known pending row). Content work this window was all quality fixes, not new drains: two fabricated `Jan 1` premiere-date placeholders on Naked and Afraid, an ANTM host-caption contradiction, and — the highlight — the dead-code OpenGraph wiring finding from critique pass 69 got fixed same-day (`218622f`), so every show/season/theme page now serves its own tinted social card instead of the site-wide default. Deploy is green at HEAD, breadth (`e2e-full`) is green two nights running.

## While you were out

| When | Verb | Outcome |
|---|---|---|
| 2026-07-03 13:19 – 2026-07-04 05:23 UTC | march (5 ticks) | all success — expand pass 40 (Jersey Shore filed), 3 new-show scaffolds (Queer Eye, Selling Sunset, Jersey Shore), audit closeout on each |
| 2026-07-04 05:23 UTC | march | **failure** — `supabase/setup-cli@v1` hit "rate limit exceeded" resolving the latest CLI release before any content/code step ran; pure GitHub Actions infra hiccup, self-resolved next tick |
| 2026-07-04 06:37 – 10:43 UTC | march (5 ticks) | all success — `tier_s_blurb` gap closed across 20 shows, critique pass 67/68 fixes (methodology contradiction, ANTM host_caption, season-title stutter, ordinal-skip TOC fix, VotePair accessible name), critique pass 68→69, the OG-image wiring fix, expand pass 41 (0 new candidates, #14/#15 reinforced) |

No content-gap drains shipped this window (season-drain and new-show queues are both empty right now — see "The saga"); every commit was a bug/content-correctness fix surfaced by critique or audit.

## The saga

Catalog stands at **43 shows / 670 seasons / 43 canons / 12 themes** (per the last verify run's `content:check`), up from 40 shows on 2026-07-03 morning's brief — Queer Eye, Selling Sunset, and Jersey Shore all scaffolded and their audit rows closed out.

**Queue depth right now:** empty. `plan/AUDIT.md`'s Pending section carries only two rows, neither a content-gap drain:
- `[LOW]` engineering: `check-test-colocation` fails wholesale on Windows/node 22.22.3 (green on ubuntu CI, doesn't gate anything)
- `[needs-user-call]` `[LOW]` Naked and Afraid S12/13/15/16 still carry the Jan-1 placeholder pattern, but fixing them needs an editorial call first — external sources put the real-world season numbering one off from ours for S13/S16, and blindly applying dates risks silently reassigning canonical_position slots. Flagged for `/oversight`, not something the loop should guess at.

This is the first time in recent memory both the new-show and season-drain queues have hit zero at once — bearings Rule 1 ("keep the queue fed") should have `/expand` propose a new wave soon; pass 41 filed 0 new candidates, which is worth watching if it repeats next pass.

## Queues now

- **`plan/AUDIT.md`**: 2 pending rows (both above), no content-gaps open.
- **`plan/CRITIQUE.md`**: 43 pending rows (37 LOW, 5 MED, 1 mixed-severity multi-row), spanning passes back through the low-60s — last pass is **69** (2026-07-04, 1 finding, already resolved same-tick). Recent clean sweep: passes 67 and 68 fully closed out this window (methodology contradiction, host_caption fix, season-title stutter, ordinal-skip, VotePair a11y, OG wiring). Remaining open rows are mostly small content-polish items (missing `episodes_caption` on Jersey Shore S1, a meta-description clipper edge case, cosmetic "Also appears in" circularity, cast-size caption phrasing, an apprentice tagline euphemism).
- **`plan/PHASE_CANDIDATES.md`**: 14 candidates awaiting promotion (unchanged this pulse — expand pass 41 filed 0 new, reinforced #14 Era filter tab polish and #15 Show canon completeness lax→strict gate), 1 below threshold. Nothing promoted this window; `/oversight` is the only path to promotion.
- **Deploy**: ready at HEAD (`d3d3733`).
- **Breadth (`e2e-full`)**: green, 2-run streak (07-02, 07-03 UTC).
- **Night workflow**: last run 2026-07-03 succeeded; this tick in progress.

## Needs you

- **Three stale GitHub issues, now 23 (#398, #399) and 20 (#416) days old, still open** — carried over unchanged from yesterday's brief, still nobody's picked them up:
  - #398 "Cloud march tick crashed" (`triage:needs-user`, opened 2026-06-11)
  - #399 "13 authed e2e specs red on main" (`triage:needs-user`, opened 2026-06-11)
  - #416 "Nightly e2e-full failed" (`triage:loop-queued`, opened 2026-06-14) — this is the same root cause as this morning's 05:23 transient failure (Supabase CLI resolution); `plan/AUDIT.md` already carries a corresponding LOW row to pin the CLI version, still unshipped
- **Two `loop:phase` mirror issues remain open despite their phases shipping**: #400 (Phase 44, shipped) and #405 (Phase 46, shipped) — the close-on-ship step still hasn't fired for either, unchanged from yesterday's note.
- Nothing new blocked this window; deploy and breadth are both clean.

## Today's intent

Saga: both content queues are empty — the next `/expand` pass should propose a new show-expansion wave (new-show + season-drain rows) rather than filing 0 candidates again, per bearings Rule 1's "keep the queue fed" mandate. Non-content: clear the three aging stale issues (#398, #399, #416) via `/triage`, close the two stranded `loop:phase` mirror issues (#400, #405), and consider promoting the Supabase-CLI-pin fix (issue #416 / AUDIT row) since it would have prevented this morning's transient failure.

## Tuning proposals

None this pulse. The 05:23 failure was pure GitHub Actions infra (a transient rate limit on the Supabase CLI release lookup), not a gate or cadence problem — it self-resolved on the very next tick 74 minutes later, so no watchdog or threshold change is warranted. The recurring theme worth flagging to `/oversight` rather than proposing outright: `/expand` filing 0 new candidates in the same pass both queues (content and phase) hit empty/steady state feels coincidental rather than causal, but is worth a second data point before treating it as a tuning signal.
