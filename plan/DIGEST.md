# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A clean, high-output 24 hours.** Every `march` tick since yesterday's digest (`f5ede26`, 2026-07-05 11:16 UTC) came back green — 40 for 40 in the visible run window. 29 commits shipped: **wave 6's entire new-show queue drained in one day** (90 Day Fiancé, Vanderpump Rules, Real Housewives of Salt Lake City, Married at First Sight, American Ninja Warrior — 5 shows scaffolded), two Rule 2 season-drain batches (Queer Eye +5, Jersey Shore +5, both fully clearing gaps flagged in yesterday's digest), the Bachelor `format_summary` batch fix finished (all 11 files), one HIGH bug fix (`RankShiftPill` vote-floor gate), a Survivor 50 season-file backfill, three critique passes (73/74/75 — 5/2/5 findings), and two expand passes (43/44 — the new-show refill plus 1 fresh candidate). Catalog grew **43 → 48 shows, 680 → 695 seasons**. Deploy is green at HEAD (`2d6565c`); breadth (`e2e-full`) is green two nights running.

## While you were out

| When (UTC) | Verb | Outcome |
|---|---|---|
| 07-05 11:30–13:38 | march (3 ticks) | critique pass 73 (5 findings — 2 high, 3 medium); Bachelor `format_summary` batch finished (S23–S27, 11/11 files done); expand pass 43 (2 season-drain rows + **wave-6 show-queue refill filed**) |
| 07-05 14:51–17:36 | march (4 ticks) | **90 Day Fiancé** shipped; **Vanderpump Rules** shipped; **Queer Eye season drain S2–S6**; **Real Housewives of Salt Lake City** shipped |
| 07-05 18:36–20:38 | march (3 ticks) | **Jersey Shore season drain S2–S6** (fully drained); **Married at First Sight** shipped; **American Ninja Warrior** shipped |
| 07-05 21:31–23:15 | march (3 ticks) | RankShiftPill vote-count-floor HIGH fix; Survivor 50 near-empty season-file backfill; critique pass 74 (2 findings + 1 severity bump) |
| 07-06 00:31–01:47 | march (2 ticks) | show-page title template shortened below the SEO snippet window; expand pass 44 (1 candidate — canon-rationale/season-body echo gate) |
| 07-06 03:04–04:48 | march (2 ticks) | community-rank banner copy fix; milestone-named season title stutter fix; duplicate canon-peak/tail marks suppressed on single-season shows |
| 07-06 06:38–10:19 | march (2 ticks) | raw internal version token dropped from community live strip; critique pass 75 (5 findings — 1 high, 3 medium, 1 low) |

## The saga

Catalog stands at **48 shows / 695 seasons / 48 canons / 12 themes / 3 legal docs**, up from 43/680 yesterday. The whole day was a Rule-1-then-Rule-2 story: expand pass 43 refilled the new-show queue (the exact gap flagged as a tuning problem in the last two digests), and every one of the 5 wave-6 shows got scaffolded same-day — the queue went from filed to fully drained within ~10 hours. Both season-drain gaps yesterday's digest called out by name (Queer Eye, Jersey Shore) also cleared; Jersey Shore is now fully drained end-to-end.

**Season-drain queue (Rule 2), current known gaps** (frontmatter `seasons:` vs. files on disk — recomputed fresh this tick, not carried from any filed row):
- The Apprentice: 10/15 → 5 remaining (carried over, untouched this window)
- Selling Sunset: 6/9 → 3 remaining (carried over, untouched this window)
- Queer Eye: 6/10 → 4 remaining (S7–S10; the show's real total corrected from 8 to 10 mid-drain, so the gap grew even as 5 seasons shipped)
- 90 Day Fiancé: 1/12 → 11 remaining (fresh, from today's scaffold)
- Vanderpump Rules: 1/12 → 11 remaining (fresh)
- Real Housewives of Salt Lake City: 1/6 → 5 remaining (fresh)
- Married at First Sight: 1/19 → 18 remaining (fresh)
- American Ninja Warrior: 1/18 → 17 remaining (fresh)

74 seasons remaining across 8 shows. None currently carry a fresh Pending row in `plan/AUDIT.md` — that's expected, not a gap: this catalog's pattern all day has been file-and-resolve within the same tick (`/iterate` files the content-gap, `/ship-content` closes it, the audit commit lands right after), so the queue depth above is the real signal, not the AUDIT.md Pending count.

**New-show queue (Rule 1 "keep the queue fed"): back to 0 Pending rows** after wave 6 fully drained today. This is the same steady state that triggered two consecutive empty expand passes before pass 43's refill — worth watching whether pass 45 refills promptly or repeats the stall pattern from two digests ago.

## Queues now

- **`plan/AUDIT.md`**: Pending section is otherwise clear of actionable rows. One `[LOW]` row reformatted this tick (see "Needs you" — the Supabase CLI pin, issue #416, was sitting as a non-standard `### heading` `/iterate` couldn't see; now a proper `- [ ]` bullet). 2 `[needs-user-call]` rows unchanged: Naked and Afraid S12/13/15/16 premiere-date numbering convention, and The Apprentice S5 LA-framing question.
- **`plan/CRITIQUE.md`**: last pass **75** (2026-07-06, commit `2d6565c`, 5 findings — 1 high, 3 medium, 1 low). 37 pending rows (up from 31 two digests ago) — passes 73/74/75 fired reliably and fixed most same-tick, but findings on the two freshest single-season scaffolds (RHOSLC, Married at First Sight) outpaced the fix rate this window.
- **`plan/PHASE_CANDIDATES.md`**: last pass **44** (2026-07-06, commit `1067802`). 12 candidates genuinely awaiting promotion (of 17 listed — 5 are already-promoted/superseded/absorbed markers kept for the audit trail). Newest, **#25 canon-rationale/season-body verbatim-argument echo gate**, is a direct answer to pass-75's HIGH finding below — it proposes a `content:check` gate for the exact defect class that finding names on two shows at once.
- **Deploy**: ready at HEAD (`2d6565c`).
- **Breadth (`e2e-full`)**: green, 2-run streak (2026-07-04, 2026-07-05 both success).
- **Night workflow**: last completed run (2026-07-05) succeeded; this tick in progress.

## Needs you

- **The Supabase-CLI-pin row (issue #416) was likely invisible to `/iterate` for 3+ weeks, not just deprioritized.** Found and reformatted this tick: `plan/AUDIT.md` filed it 2026-06-14 as a `### [user-issue #416]` heading instead of the section's own documented `- [ ] [SEV] ...` bullet shape. Expand passes 41 through 44 each independently noted it "unchanged" — pass 44 called it out explicitly as "not a clustering signal" — but none reformatted it, and it never shipped despite scoring 4.8 while plenty of lower-scored bullet rows shipped same-tick around it. Reformatted in place this tick (no score/content change) so the next `/iterate` pass can actually pick it up — worth confirming it ships within the next few ticks to validate the hypothesis.
- **Three stale GitHub issues, flagged in the last two digests running, still with zero forward motion:**
  - #398 "Cloud march tick crashed" (`triage:needs-user`, opened 2026-06-11, now 25 days)
  - #399 "13 authed e2e specs red on main" (`triage:needs-user`, opened 2026-06-11, now 25 days)
  - #416 itself is still open even after the reformat above — closing it is a `/ship-a-phase` or `/iterate` action, not this tick's
  - #400 "Phase 44 — Brand-spelling discipline" and #405 "Phase 46 — Colocated-test coverage gate" — both phases shipped weeks ago; the close-on-ship step never fired, unchanged for the third digest running
- Nothing new blocked this window; deploy and breadth are both clean.

## Today's intent

Saga: keep draining the 8-show, 74-season Rule 2 backlog — Apprentice (5) and Selling Sunset (3) are the oldest carryovers and cheapest next batches; the 5 freshly-scaffolded wave-6 shows (54 seasons combined) are the bulk of the remaining work. Watch whether expand pass 45 refills the new-show queue promptly now that it's back to 0, or repeats the two-pass stall from before pass 43. Non-content: promote candidate #25 (canon-rationale echo gate) via `/oversight` — it's now evidenced on 3 independent shows (Bachelor S28, Love Island UK, and pass-75's MAFS+RHOSLC pair) and the fix (a `content:check` extension) is small. Ship the now-visible Supabase-CLI-pin fix (#416) and confirm it closes the issue. Clear or re-triage the three aging stale issues (#398, #399, #400/#405 mirrors).

## Tuning proposals

None filed as new `plan/PHASE_CANDIDATES.md` rows this tick — the one concrete mistuning found (the malformed #416 AUDIT row) was a direct plan-prose fix within this tick's own carve-out, not a gate that needs `/oversight` to retune, so it was corrected in place rather than proposed (see "Needs you" and the `plan/AUDIT.md` diff this commit). The new-show-queue stall pattern flagged in the prior two digests self-corrected today (expand pass 43 refilled it without an oversight nudge) — no action needed there, just worth re-flagging if pass 45 stalls again.
