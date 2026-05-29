import { test } from '@playwright/test'
import { runA11yScan } from '../src/fixtures/a11y'

// Phase 18 — 11-surface a11y matrix at WCAG 2.1 AA critical+serious.
// Desktop: 8 canonical-path pages. Mobile (375x800): the 3 most
// load-bearing pages (home + show home + season page).
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
] as const

const MOBILE_PAGES = [
  '/',
  '/shows/survivor',
  '/shows/survivor/season/borneo',
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
