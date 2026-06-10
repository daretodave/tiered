import { test, expect } from '@playwright/test'
import { cookieCacheStatus, loadAuthedStorageState } from '../src/auth'

// Demonstrates the authed-spec pattern. Once phase 10 ships /sign-in
// with real Auth0 wiring, this spec will navigate to a member-only
// surface (e.g. /u/[handle]) and assert chrome reflects the signed-in
// state. Until then it just confirms the cookie travels with the
// request — the smoke pass already covers the (unauthed) public
// surfaces.

const state = loadAuthedStorageState()
const status = cookieCacheStatus()

test.describe('authed-example', () => {
  test.skip(
    !state,
    `e2e cookie cache ${status}; run \`node scripts/mint-e2e-cookie.mjs\` to refresh`,
  )

  test.use({ storageState: state ?? undefined })

  test('authed visit to home includes the e2e session cookie', async ({ page, context }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const cookies = await context.cookies()
    const session = cookies.find((c) => c.name === '__session')
    expect(session, 'expected __session cookie attached to authed context').toBeTruthy()
    expect(session!.value.length).toBeGreaterThan(50)
  })

  // Phase 36: the header auth-state island hydrates from
  // GET /api/auth/me, so a statically generated page (`/` is SSG
  // per phase 27) flips from build-time signed-out chrome to the
  // account chrome client-side. Un-fixme'd now that the island
  // ships. See issue #54.
  //
  // Critique pass-45 #MED: at every viewport the chrome resolves to
  // the chevron trigger (no flat `@handle / Sign out` pair); the
  // disclosed menu carries the `Sign out` action.
  test('signed-in header surfaces the chevron trigger, menu carries Sign out', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const header = page.getByTestId('site-header')
    await expect(header).toHaveAttribute('data-signed-in', 'true')
    const trigger = page.getByTestId('site-header-user-trigger')
    await expect(trigger).toBeVisible()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger).toHaveAttribute('data-profile-href', /^\/u\/.+/)
    await trigger.click()
    await expect(page.getByTestId('site-header-user-menu')).toBeVisible()
    await expect(
      page.getByTestId('site-header-user-menu-signout'),
    ).toHaveAttribute('href', /\/auth\/logout/)
    await expect(page.getByTestId('site-header-signin-link')).toHaveCount(0)
  })

  // Critique pass-45 #MED regression: at 375px the chrome resolves to
  // the SAME chevron pattern as desktop — no breakpoint-specific
  // disclosure. Pinned to guard the cross-breakpoint parity (the
  // pass-44 closure shipped the mobile-only chevron; pass-45 extended
  // it to desktop). Also confirms the menu remains the only path to
  // `Sign out` at this viewport.
  test('mobile chrome at 375px renders the same chevron disclosure pattern', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const header = page.getByTestId('site-header')
    await expect(header).toHaveAttribute('data-signed-in', 'true')

    const trigger = page.getByTestId('site-header-user-trigger')
    await expect(trigger).toBeVisible()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    // The menu itself isn't rendered until the trigger fires.
    await expect(page.getByTestId('site-header-user-menu')).toHaveCount(0)

    await trigger.click()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const menu = page.getByTestId('site-header-user-menu')
    await expect(menu).toBeVisible()
    await expect(page.getByTestId('site-header-user-menu-record')).toHaveAttribute(
      'href',
      /^\/u\/.+/,
    )
    await expect(page.getByTestId('site-header-user-menu-signout')).toHaveAttribute(
      'href',
      /\/auth\/logout/,
    )
  })
})
