import { test } from '@playwright/test'
import { runA11yScan } from '../src/fixtures/a11y'

// Phase 18 — 15-surface a11y matrix at WCAG 2.1 AA critical+serious.
// Desktop: 9 canonical-path pages. Mobile (375x800): 6 high-interaction
// pages (home + show home + season page + themed list-detail + shows
// IA hub + themes IA hub). /themes mobile is the highest-traffic
// uncovered surface after the /shows mobile row (#232) drained — it's
// the parallel landing surface to /shows, the destination of every
// "Lists" link in the header chrome on every route, and the only page
// in the product that renders the ListsFilterController interactive
// chip bar (role="group" with five aria-pressed chips for all / tone /
// craft / era / single) paired with the ListsFeaturedRow 3-up featured
// card row that reflows to a stacked column at 375px and the
// ListsAllSection category-grouped grid of every themed list.
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
