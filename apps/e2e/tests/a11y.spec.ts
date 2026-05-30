import { test } from '@playwright/test'
import { runA11yScan } from '../src/fixtures/a11y'

// Phase 18 — 14-surface a11y matrix at WCAG 2.1 AA critical+serious.
// Desktop: 9 canonical-path pages. Mobile (375x800): 5 high-interaction
// pages (home + show home + season page + themed list-detail + the
// shows IA hub). /shows mobile is the highest-traffic uncovered surface
// after the list-detail row (#231) drained — it's the destination of
// every header "Shows" link on every route, and the only page in the
// product that renders the tier-grouped layout (S/A/B/C TierSection
// bands × tile variants tall/regular/small) which reflows uniquely at
// 375px and isn't exercised anywhere else.
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
