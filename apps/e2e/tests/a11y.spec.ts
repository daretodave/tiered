import { test } from '@playwright/test'
import { runA11yScan } from '../src/fixtures/a11y'

// Phase 18 — 16-surface a11y matrix at WCAG 2.1 AA critical+serious.
// Desktop: 9 canonical-path pages. Mobile (375x800): 7 high-interaction
// pages (home + show home canon pane + season page + themed list-detail
// + shows IA hub + themes IA hub + show-home community pane).
// `/shows/survivor?view=community` mobile is the highest-traffic
// uncovered surface after the /themes mobile row (#233) drained — the
// `?view=community` query swaps the canon tier-bands for an entirely
// different component cluster (`CommunityLiveStrip` + `CommunityMovers`
// + `CommunityWeeklyQuestionCard` + `CommunityRankList`,
// src/components/canon/ShowRanking.tsx:140-170) which the canon-pane
// scan at /shows/survivor never reaches (data-view="canon" CSS-hides
// them). The desktop scan at `?view=community` (DESKTOP_PAGES line 28)
// catches these at 1280px; mobile reflow is the actual risk surface
// (live-strip eyebrow stack, movers row, WeeklyQuestion CTA touch
// target, ranking-list rank+title+meta wrap at 375px).
//
// The phase-38 public profile family (/u/[handle]) is NOT in this
// flat anon matrix: its handle is discovered at runtime and the
// users row only exists after the e2e user acts, so it needs the
// authed populate + handle-discovery the matrix loop can't express.
// Its axe scan lives in `user-profile.spec.ts` (the spec that
// already loads the populated profile anonymously).

const DESKTOP_PAGES = [
  '/',
  '/shows',
  '/shows/survivor',
  '/shows/survivor?view=community',
  '/shows/survivor/season/borneo',
  '/themes',
  // The list-detail family (12 lists, one template) is the most
  // interactive surface the matrix previously skipped — Save/Share/
  // Suggest tools, a meta strip, a shield badge, a ranked entry
  // stack. best-premieres is the design gold-standard + cross-canon.
  '/themes/best-premieres',
  '/about',
  // The auth-funnel entry — the only path into magic-link sign-in,
  // reached from every header on every route. Anon-renderable (the
  // page only redirects when session?.user is present), so it slots
  // into the flat matrix without an authed setup. Pins the h1 +
  // <form aria-label> + primary CTA contrast on bg-primary-base.
  '/sign-in',
] as const

const MOBILE_PAGES = [
  '/',
  '/shows/survivor',
  '/shows/survivor/season/borneo',
  // The list-detail family at 375px. Tools-row buttons (Save / Share /
  // Suggest) and the shield role=status carry aria contracts the
  // desktop scan already pins (#228); the mobile pass adds touch-target
  // size + 375px reflow over the stats strip, tools row, and ranked
  // entry stack. best-premieres mirrors the desktop pick for parity.
  '/themes/best-premieres',
  // The show IA hub at 375px. Pins tier-band heading order (TierHead /
  // glyph / count per S/A/B/C), tile-variant reflow over the cols-2
  // (S/A) and cols-3 (B) grids, the status pill (tier B only), and
  // the ShowsHero stats strip + HowTiersMove landmark structure —
  // all axe-detectable mobile contracts the desktop scan can't observe.
  '/shows',
  // The themes IA hub at 375px — parallel to /shows. Pins the
  // ListsFilterController chip bar (role="group" with five aria-pressed
  // chips: all / tone / craft / era / single) touch-target sizes,
  // the ListsFeaturedRow 3-up → stacked reflow, the ListsAllSection
  // per-category heading order, and the ListsHero stats strip — all
  // axe-detectable mobile contracts the desktop scan can't observe.
  '/themes',
  // The community ranking pane at 375px. The `?view=community` query
  // swaps the canon tier-bands for the four community-only components
  // (CommunityLiveStrip recompute strip, CommunityMovers row,
  // CommunityWeeklyQuestionCard with its CTA, CommunityRankList
  // live-vote table) which the canon-pane mobile scan above never
  // reaches. Pins the live-strip eyebrow + recompute-caption heading
  // order, the movers row reflow, the WeeklyQuestion CTA touch target,
  // and the rank+title+meta wrap on the ranking list — all
  // axe-detectable mobile contracts the desktop community-pane scan
  // can't observe.
  '/shows/survivor?view=community',
] as const

const MOBILE_VIEWPORT = { width: 375, height: 800 } as const

for (const url of DESKTOP_PAGES) {
  test(`a11y desktop: ${url}`, async ({ page }) => {
    await runA11yScan({ page, url })
  })
}

for (const url of MOBILE_PAGES) {
  test(`a11y mobile 375px: ${url}`, async ({ page }) => {
    await runA11yScan({ page, url, viewport: MOBILE_VIEWPORT })
  })
}
