# Phase 37 — Show + season design-fidelity nits

> User-injected polish phase (2026-05-16). Five small, concrete
> design-fidelity gaps on the two highest-traffic page families —
> the consolidated show page (phase 33a/33b) and the season detail
> (phase 30) — measured against their binding design files. None
> are new surface; each is a faithful-port miss the prior
> iterations did not catch. **One cloud tick. Page / CSS /
> component side only — no content, no data, no schema.**
>
> Binding references:
> - `design/tiered.tv · Survivor.html` — the consolidated show
>   page (the `.tabs`, `.toolbar`, `.methodology`, `.he-rank-stack`
>   / `.mid-rank` / `.ce-meta` blocks).
> - `design/tiered.tv · Heroes vs. Villains.html` — the season
>   page (the `.info-card` / `.scale-*` block).
> - Parent briefs: `phase_33_show_consolidation.md`,
>   `phase_33b_era_toolbar_boltons.md`, `phase_30_season_page_rework.md`.
>
> Where a design file disagrees with shipped code, the design file
> wins (CLAUDE.md reading-order rule).

## Gate

None. Everything this phase touches is already shipped (33a/33b
consolidated show page + `ShowRanking`/`Canon*Entries`; phase 30
season page + `SeasonInfoCard`/`RankScale`). Sits **ahead of
phase 26** in the queue by user direction — the next `/march`
must pick this up before resuming the season-backfill drain.

## 1. Sticky tab-bar anchor (`.ranking .cp-tabs` top offset)

**Symptom.** On `/shows/survivor` (the `#canon` ranking), the
Editor's Canon / Community sticky tab bar pins as you scroll
(good) but the site header overlaps its top edge — so the "stick
point" reads as the top-*middle* of the bar and the first rows of
the Editor's Canon list are clipped under the chrome.

**Root cause.** `src/styles/canon.css` `.ranking .cp-tabs`
(~line 1083) sets `position: sticky; top: 60px`. The production
sticky `.site-header` (`src/styles/chrome.css` line 32:
`padding: 18px 32px` + a ~36px content row + 1px border) is
**~72px** tall, not 60px — so the bar pins 12px too high and
slides under the header. The user validated `top: 72px` in the
inspector (the top of Editor's Canon then becomes the stick
point).

**Fix.**
- Set `.ranking .cp-tabs` sticky `top: 72px` (the real desktop
  header height). Add a CSS comment tying the value to
  `.site-header` height so a future header change flags this.
- Add a mobile override: in canon.css's existing
  `@media (max-width: 560px)` block, set `.ranking .cp-tabs { top: <mobile header height> }`
  to match `chrome.css` `@media (max-width:560px) .site-header { padding: 14px 16px }`
  (~64px) — so it also pins flush on phones.
- Design intent: `tiered.tv · Survivor.html` line 190
  `.tabs { position:sticky; top:64px }` (its prototype header
  geometry differs; production's measured 72px is binding).

**Test.** e2e on `/shows/survivor` (desktop + 375px): scroll into
the canon, then assert the sticky `[data-testid="canon-tab-switch"]`
/ `.cp-tabs` `boundingBox().y` sits flush at the `.site-header`
bottom edge (no overlap, no gap) — a tolerance of ≤2px.

## 2. Season number under the rank numeral (canon entries)

The updated `design/tiered.tv · Survivor.html` stacks a season
tag under the rank in the S and A bands and surfaces it in B/C.
The consolidated page (`src/components/canon/Canon*Entries.tsx` +
`src/styles/canon.css`) never picked this up. Port it faithfully.

- **S band — `CanonHeroEntries.tsx` + `.cp-he-*`.** Wrap the rank
  in a new `.cp-he-rank-stack` (design `.he-rank-stack`, line 285:
  `flex; column; gap:10px; padding-top:8px`) holding the existing
  `.cp-he-rank` **and** a new `.cp-he-season-tag` (design
  `.he-season-tag`, lines 287–292: `inline-flex; font:500 26px/1
  var(--mono); color:var(--show-ink); padding-top:8px;
  border-top:1px solid var(--rule-soft)` with a `.pre` "S" prefix
  span at `font-size:11px; color:var(--ink-55)`). Markup mirrors
  design 606–608: `S` + zero-padded season number. **Keep** the
  existing `.cp-he-season` body line ("Season N · Year ·
  Location", design 612). Update the 1100px / 640px media queries
  per design lines 282–283, 293 so the stack stays readable.
- **A band — `CanonMidEntries.tsx` + `.cp-mid-rank`.** Make
  `.cp-mid-rank` a flex column (design `.mid-rank`, line 320: add
  `display:flex; flex-direction:column; gap:8px;
  align-items:flex-start`) with the rank text + a new
  `.cp-mid-season-tag` (design 321–324: `font:500 14px/1
  var(--mono); color:var(--show-ink); padding-top:8px;
  border-top:1px solid var(--rule-soft); min-width:32px`). Markup
  per design 735: `06` then `S06`. **Keep** the existing
  `.cp-mid-meta` body line.
- **B band — `CanonCompactEntries.tsx` + `.cp-ce-meta`.** "Bring
  it forward": the meta gains the community rank beside the
  season per design 839 — `S32 · Community #16`. Render
  `S{season} · Community #{hint.rank}` when
  `entry.community_rank_hint` is present, else just `S{season}`
  (graceful — Survivor's canon carries hints; other shows may
  not).
- **C band — `CanonTailEntries.tsx` + `.cp-tr-num`.** The
  Survivor authored canon stops at rank 30 (B/compact), so the
  tail table is unexercised there but still ships for longer
  canons. Keep `.cp-tr-num` as `S{season}`; append
  `· Community #NN` only when a hint exists, mirroring B. **No**
  rank-stack for C — the tail is a dense table; the design does
  not stack it.

**Tests.** Update `__tests__/Canon{Hero,Mid,Compact}Entries.test.tsx`:
season tag renders under the rank for S/A; B (and C) meta includes
the community hint when present and degrades to bare `S##` when
absent. The existing canon e2e on `/shows/survivor` continues to
pass (testids unchanged).

## 3. Noisy double border between methodology and toolbar

**Symptom.** In the canon pane, `CanonMethodology`
(`.cp-methodology` `border-bottom`, canon.css ~258) sits directly
above `CanonEraToolbar` (`.cp-toolbar` `margin-top:12px` +
`border-top` + `border-bottom`, canon.css ~194–198). The
methodology's bottom rule, a 12px empty band, then the toolbar's
top rule reads as a noisy hollow seam.

**Design does it cleanly.** `tiered.tv · Survivor.html` `.toolbar`
(lines 217–221) has **only** `border-bottom` — no `margin-top`,
no `border-top`. `.methodology` (243–246) has `border-bottom`.
Stack: methodology rule → toolbar (flush, no top rule) → toolbar
rule. One line per junction.

**Fix.** In `src/styles/canon.css` `.cp-toolbar`, delete
`margin-top: 12px` **and** `border-top: 1px solid var(--rule)`.
Keep `.cp-toolbar`'s own `border-bottom`. Sanity-check the order
in `ShowRanking`: methodology → toolbar → tiers; with `era_bands`
absent the toolbar still renders ("All" only, per 33b) so the
seam math holds either way. Visual-only.

**Test.** Existing canon e2e covers render; add an assertion that
`.cp-methodology` bottom and `.cp-toolbar` top share a single
seam (no ~12px gap between their bounding boxes).

## 4. Hide `.show-shifts` when nothing changed

**Symptom.** `/shows/[show]` always renders "What changed this
week." with the dashed "No shifts this week." box (`ShiftsRow`
with no `cards`) plus `.show-shifts`'s `border-bottom`
(screens.css line 416). The 72-hour shift signal is not wired
until phase 35, so this empty section + its rule is permanent
dead space between the hero and the ranking.

**Fix.** `src/components/composition/ShiftsRow.tsx` returns `null`
when `empty` (no `cards`) instead of the heading + dashed empty
state. The whole section and its `border-bottom` vanish. Verify
no missing/double rule appears between `ShowHero` and
`ShowRanking` once it's gone — `.ranking`'s `padding-top:80px` +
its own border keep the rhythm; only adjust `.ranking` top
padding if a visible gap regresses at desktop + 375px. Caller
`src/app/shows/[show]/page.tsx:161` `<ShiftsRow />` stays as-is —
it simply yields nothing while empty, and the section returns
automatically once phase 35 passes real `cards`.

**Tests.**
- Rewrite `__tests__/ShiftsRow.test.tsx`: empty → renders nothing
  (`container` empty / `queryByTestId('shifts-row')` null); with
  `cards` → heading + cards (drop the empty-state assertion).
- e2e `apps/e2e/tests/show-home.spec.ts:31–32` currently asserts
  `shifts-row` / `shifts-empty` visible — flip to asserting the
  shifts section is **absent** on `/shows/survivor`.
- `apps/e2e/src/fixtures/page-reads.ts:66` lists
  `[data-testid=shifts-row]` as a required show-page selector —
  remove it (the section is no longer present while empty).

**Spec-drift note.** `phase_33_show_consolidation.md` (§3,
§"Out of scope") and `phase_19c` (§"Shifts this week") describe
`ShiftsRow` as an honest *empty state*. Phase 37 supersedes that:
empty = absent, not an empty box. The build-plan row + this brief
are the change of record; do not rewrite the shipped briefs.

## 5. Season `#info-row` scale block to the new HvV design

**Symptom.** `/shows/[show]/season/[slug]`'s info-card scale block
predates the updated `design/tiered.tv · Heroes vs. Villains.html`.
`RankScale.tsx` renders a flat fill bar + a three-span marks row
(`#01` / `↑ here`–`↓ here` / `#NN`). The new design renders a
**dot marker on the track** with a label, and a **two-endpoint
descriptive** marks row.

**Design (HvV lines 143–174; markup 539–550).**
- `.scale-track` (148–152) + `.scale-fill` (153–156) — width is
  `rank/total` %; keep `rankFillPercent`.
- **New `.scale-here`** (157–162): a 14px `var(--show-primary)`
  dot, `position:absolute; top:50%; transform:translate(-50%,-50%);
  left:<pct>%; box-shadow:0 0 0 4px var(--show-paper)`.
- **New `.scale-here-label`** (163–167): `position:absolute;
  top:18px; left:50%; transform:translateX(-50%); font:500 11px/1
  var(--mono); color:var(--show-primary)` — the rank, e.g. `#07`,
  nested in `.scale-here` (markup 545).
- `.scale-marks` (168–174): `margin-top:28px; font:500 10px/1.3
  var(--mono); letter-spacing:.08em; color:var(--ink-40);
  text-transform:uppercase`; **two** children — `#01 · canon
  peak` and `<span class="end-r">#NN · the tail</span>` (markup
  547–550). Add `.scale-marks .end-r { text-align:right }`.

**Fix.**
- `src/styles/screens.css` `.scale-*`: add `.scale-here`,
  `.scale-here-label`, `.scale-marks .end-r`; change
  `.scale-marks` `margin-top: 8px → 28px` and line-height to
  `1.3`; drop the now-unused `.scale-marks .here` rule.
- `src/components/composition/RankScale.tsx`: inside
  `.scale-track`, render `.scale-here` at `left:<pct>%` wrapping
  `.scale-here-label` (`#<pad2(rank)>`, testid
  `rank-scale-here`). Replace the three marks with two:
  `#01 · canon peak` and `#<pad2(total)> · the tail` (`.end-r`).
  Remove the `lowerThird` "↑/↓ here" logic. Keep
  `rankFillPercent`, `headLabel`, `meta`, and the
  `SeasonInfoCard` "not yet ranked" fallback unchanged.
- `SeasonInfoCard.tsx` markup is otherwise already to spec
  (info-row / community / vote / shield rows match HvV) — no
  change beyond what `RankScale` emits.

**Tests.** Update `RankScale` test + `SeasonInfoCard.test.tsx`:
assert the dot at the rank percentage, the `#NN` label, and the
two endpoint marks (`canon peak` / `the tail`); drop the
"↑ here" assertions. `apps/e2e/tests/season-page.spec.ts:25–26`
(`info-row-canon` / `info-row-vote` visible) still passes — only
add coverage for the new `rank-scale-here` element. Existing
testids (`rank-scale`, `rank-scale-rank`, `rank-scale-fill`)
unchanged.

## Tests (summary)

Unit + e2e ship with the code (no "tests later"). Net:
`Canon{Hero,Mid,Compact}Entries` unit updates; `ShiftsRow` test
rewrite; `RankScale` + `SeasonInfoCard` unit updates; e2e —
sticky-offset assertion (nit 1), methodology/toolbar seam (nit
3), shifts-absent (nit 4), `rank-scale-here` (nit 5); fixture
edits in `show-home.spec.ts` + `page-reads.ts`. No new URL, so
no `canonical-urls.ts` change.

## Acceptance

- `/shows/survivor`: scrolling the canon pins the tab bar flush
  under the header (top of Editor's Canon is the stick point),
  desktop + 375px.
- Canon S/A entries show the season tag stacked under the rank
  numeral; B/C surface `S## · Community #NN` (bare `S##` where no
  hint) — matches `Survivor.html`.
- No hollow double-border between methodology and the era
  toolbar — single seam, matches `Survivor.html` `.toolbar`.
- The "What changed this week." section is absent on every show
  page while the shift signal is unwired (no dashed empty box, no
  stray rule); returns automatically when phase 35 feeds `cards`.
- Season info-card scale block matches `Heroes vs. Villains.html`:
  dot + label on the track, two descriptive endpoint marks.
- `pnpm verify` green; `pnpm deploy:check` green post-push.
- Build-plan row `[x] Phase 37` with commit hash. Plain message,
  `Cloud-Run:` trailer, no emoji, no `Co-Authored-By:`.

## Out of scope

Live community-vote aggregates and the real 72-hour shift signal
(phase 35 — nit 4 only hides the empty surface; it does not wire
data). `era_bands` for non-Survivor shows (phase 34). Any content
/ canon / schema change. No new routes.
