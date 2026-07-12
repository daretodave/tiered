# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

# DIGEST — 2026-07-12

## Headline

A strong 26 hours: **24 march ticks, 24 green**, no crashes this
window. The catalog grew by **5 new shows** (WAVE 10 fully
drained: The Traitors UK, Married at First Sight Australia, The
Real World, Ink Master, So You Think You Can Dance) plus 4
critique passes (89–92, 15 findings total, all 0-high), several
paired content/fix ticks, and an expand pass (54, 0 new
candidates, WAVE 10 refill). The one real shadow, now the loudest
signal in the backlog: the nightly **e2e-full breadth run went
red a fourth consecutive night** (07-06 → 07-09 → 07-10 → 07-11),
the identical 50-minute duration-ceiling breach every time, zero
actual test regressions. The fix has sat unpromoted for 5 days
(candidate #26) because it needs a `workflows`-scoped token the
cloud loop doesn't carry. Deploy is green at HEAD (`71fe7de`).

## While you were out

| Time (UTC) | Tick | Outcome |
|---|---|---|
| 09:40–10:38 (07-11) | march → content fix ×2 | success — Below Deck Down Under S2 fragment fix, America's Next Top Model `card_tagline` overlap fix |
| 11:13 | march → expand pass 53 | success — 0 new candidates, 2 existing updated |
| 12:24 | march → critique pass 89 | success — 6 findings (5 med, 1 low) |
| 13:34 | march → fix | success — anon vote-row eyebrow copy corrected to match 0.1x vote policy |
| 14:34 | march → fix | success — RankScale now peaks a sole #1-of-1 canon entry instead of tailing it |
| 15:32 | march → fix | success — missing `tier_s_blurb` added on freshly-seeded shows, regression test generalized |
| 16:32 | march → content fix | success — filming_caption adds real texture instead of restating location |
| 17:31 | march → content fix | success — masterchef `card_tagline` diverged from `tagline` |
| 18:31 | march → content fix | success — Bachelor in Paradise Tulum lede trimmed to SEO clip budget |
| 19:12 | march → critique pass 90 | success — 1 finding (0 high, 0 med, 1 low) |
| 20:32 | march → content fix | success — stale `last_revised` timestamps refreshed across 9 canon files |
| 21:30 | march → content fix | success — word-tic repetition fixed in best-villain-editing entry #01 |
| 22:26 | march → content fix | success — best-newbie-casts `card_tagline` echo of H1 title fixed |
| 23:10 | march → expand pass 54 | success — 0 new candidates, **WAVE 10 show-queue refill** filed, candidate #24 (stall pattern) reinforced |
| 00:39–01:45 (07-12) | march → new show | success — The Traitors UK added |
| 01:45–04:30 | march → new show | success — Married at First Sight Australia added |
| 04:30–05:47 | march → new show | success — The Real World added |
| 05:47–07:10 | march → new show | success — Ink Master added |
| 07:09–08:06 | march → new show | success — So You Think You Can Dance added, **WAVE 10 fully drained** |
| 08:06–09:56 | march → content fix ×3 | success — canon `community_rank_hint` self-contradiction fixed, MAFS Australia cast-size caption repetition cut, traitors-uk FILMED-caption bare restatement broadened+fixed |
| 10:27 | march → critique pass 92 | success — 5 findings (0 high, 3 med, 2 low), all on the 3 freshly-shipped WAVE 10 shows |

Net: 33 commits since the last digest window opened. 24 march
ticks, **24 green, 0 red** — cleanest run in recent memory, no
crashes, no no-ops.

## The saga

**Shows scaffolded:** 5 this window — The Traitors UK, Married
at First Sight Australia, The Real World, Ink Master, So You
Think You Can Dance. Catalog holds **68 shows**, up from 63.
WAVE 10 (filed expand pass 54 same window) is now fully drained
— the new-show queue is back to **0 Pending "Add show" rows**,
the same recurring empty-queue-after-full-drain pattern
candidate #24 already names, for the second digest running.
Expect a WAVE 11 refill from a future `/expand` pass per Rule 1's
"keep the queue fed" mandate.

**Seasons drained:** each of the 5 fresh shows landed with its
S1 only, no incremental Rule 2 drain batch shipped this window
(the tick budget went entirely to the WAVE 10 scaffold-and-close
cycle plus critique/fix pairs). Catalog holds **742 seasons**, up
from 737. Largest remaining gaps now: **Chopped (56)**, The Real
World (32), So You Think You Can Dance (17), Ink Master (15),
Married at First Sight (13), Married at First Sight Australia
(12), American Ninja Warrior (12), Vanderpump Rules (11), 90 Day
Fiancé (11), Southern Charm (10), RuPaul's Drag Race All Stars
(10). Sawtooth continues as expected — five new S1-only shows
just re-widened the queue exactly as Rule 1/Rule 2 predict.

**Velocity vs. bearings:** Rule 1 (show coverage) — very active,
5 shows landed and the queue redrained same window as it was
refilled. Rule 2 (canon completeness) — quiet this window (no
drain batch shipped on an existing show); Chopped's 56-season gap
is now by far the largest in the catalog and the natural next
drain target. Rule 3 (themed list) — quota (≥10 lists) remains
satisfied at 12, unchanged, no action needed.

**Critique backlog:** 4 passes landed (89/90/91/92, 15 findings
total), consistently 0-high across every pass. Pass 92's 5
findings are notable as a cluster — all five sit on the three
just-shipped WAVE 10 singles (ink-master, so-you-think-you-can-dance,
the-real-world), the predictable "fresh content invites fresh
scrutiny" pattern: a season-title stutter, a wrong elapsed-year
tagline (`{yearsWord}` misapplied to an `ended` show with no
end-year field), templated canon-rationale phrasing shared across
all three debuts, a watch_list marker gap, and a thin season
eyebrow. None HIGH; all queued for the next `/iterate` tick.

## Queues now

- **AUDIT.md Pending:** 3 real rows (plus template-placeholder
  lines that aren't findings). The `[HIGH]` e2e-full timeout row
  was updated this tick with a **fourth** consecutive-night
  recurrence: run 29171935246 hit the identical 50-minute
  ceiling, test count now 7,138 (up from 7,098 one day ago,
  slowing growth but the completion percentage keeps drifting
  down — 91.4%, vs. 92.4% two nights ago). Still blocked from
  cloud (missing `workflows` OAuth scope), candidate #26 now **5
  days** stale, unpromoted across four red nights. The Supabase
  CLI pin (issue #416/#480) is now **28 days** stale, same
  blocker. The low-score `YEAR_TENURE_RE` gap (score 2.7) is
  unchanged, below the iterate threshold.
- **AUDIT.md needs-user-call:** unchanged, 2 — Naked and Afraid
  S12/13/15/16 premiere-date numbering ambiguity; The Apprentice
  S5 "LA Season" framing check.
- **CRITIQUE.md:** last pass **92** (2026-07-12T10:27Z, commit
  71fe7de), 5 findings (0 high, 3 med, 2 low), all still pending
  for the next `/iterate` tick. File continues to grow, tracked
  by candidate #29.
- **PHASE_CANDIDATES.md:** 23 pending awaiting promotion (was
  20), up 3 this window despite pass 54 filing "0 new
  candidates" — the net change reflects prior in-flight updates
  settling. Last promotion still **2026-06-11** — now **31 days**
  stale. Top scores unpromoted: **#15 (9.4)** show canon
  completeness lax→strict gate, **#28 (8.3)** stat-tile
  literal-duplicate invariant, **#25 (8.0)** canon-rationale/
  season-body echo gate — all three unchanged from yesterday's
  ranking.
- **Triage:** 0 unlabeled open issues (clean). `triage:needs-
  user`: 3 open, unchanged — #480, #398, #399 (the latter two now
  **31 days** stale). `triage:loop-queued`: 1 — #416, now
  absorbing a **fourth** distinct e2e-full incident under one
  title-dedupe thread.
- Other open issues worth a look: **#521** (severity:high —
  signed-in vote/comment CTAs flash anon on non-cached season
  pages), #535 (Summer House filming_caption restates location),
  #373 (mobile HvV canon-meter pip label duplicate).

## Needs you

1. **e2e-full has now failed four nights running**
   (07-06/07-09/07-10/07-11), always the identical 50-minute
   duration-ceiling breach, never an actual test regression. The
   fix (bump `timeout-minutes` in `.github/workflows/e2e-full.yml`)
   has sat unpromoted 5 days because the cloud loop's token lacks
   the `workflows` OAuth scope needed to push workflow-file
   edits. This is now the single most-recurring unresolved item
   in `plan/AUDIT.md`. Recommend an `/oversight` session to
   promote candidate #26, bundled with candidate #32 (dedupe
   staleness bound — issue #416 is now silently absorbing a
   fourth unrelated incident under one 28-day-old thread) and the
   Supabase CLI version pin (issue #416/#480) — all three are
   edits to the same workflow-file family blocked by the same
   permission gap.
2. **Two `needs-user-call` AUDIT rows still need an editorial
   decision, not more research:** Naked and Afraid's S12/13/15/16
   numbering offset against real-world sources, and whether The
   Apprentice S5's "Los Angeles Season" framing is accurate or
   overstated.
3. **Phase-candidate backlog (23 pending) hasn't been promoted in
   31 days** and keeps growing. #15 (score 9.4, show canon
   completeness gate) remains the standout — highest-scored open
   candidate on the board, unpromoted longest of the top three.
4. **#521** (severity:high, anon-CTA flash on signed-in season
   pages) is open and hasn't surfaced in a recent digest before —
   worth a look if `/triage` hasn't routed it yet.

## Today's intent

**Saga:** expect `/expand` to file WAVE 11 on the next
empty-queue tick — candidate #24's stall pattern has now recurred
twice running, worth deciding at the next `/oversight` whether
the queue should carry a standing buffer instead of draining to
zero every time. Meanwhile Rule 2 drains should resume on
Chopped (56 remaining, the single largest gap in the catalog by a
wide margin) and the five freshly-seeded WAVE 10 shows, each
sitting at 12–32 remaining.

**Top non-content finding:** the e2e-full breadth ceiling's
fourth consecutive red night. Already has a scoped, unpromoted
fix (candidate #26) plus two related proposals (#32, the
Supabase CLI pin) — no new proposal needed, all three need
promotion in the same local session.

## Tuning proposals

None new this tick. Candidates #26 and #32 (detailed above, both
e2e-full/workflow-permission related) remain the standing
proposals — no newly mistuned gate observed this window beyond
what's already filed.
