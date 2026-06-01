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
  test('signed-in header swaps the Sign in pill for a user handle + Sign out', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const header = page.getByTestId('site-header')
    await expect(header).toHaveAttribute('data-signed-in', 'true')
    await expect(page.getByTestId('site-header-user-link')).toBeVisible()
    const signOut = page.getByTestId('site-header-signout-link')
    await expect(signOut).toBeVisible()
    await expect(signOut).toHaveAttribute('href', /\/auth\/logout/)
    await expect(page.getByTestId('site-header-signin-link')).toHaveCount(0)
  })

  // Critique pass-23 #MED: at 375px the inline `Sign out` text link
  // collapses behind a tap-to-reveal account menu — the handle becomes
  // the trigger; `Your record` and `Sign out` are the menu items. The
  // desktop pair stays in the DOM (CSS swaps display:none), so the
  // assertion pin is "Sign out is not user-visible as a top-bar link
  // until the trigger is tapped." Regression pin against a mis-tap
  // signing the user out from the top bar on every authed page.
  test('mobile chrome at 375px hides Sign out behind the account menu trigger', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const header = page.getByTestId('site-header')
    await expect(header).toHaveAttribute('data-signed-in', 'true')

    const trigger = page.getByTestId('site-header-user-trigger')
    await expect(trigger).toBeVisible()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    // Desktop pair exists in the DOM but is not user-visible.
    await expect(page.getByTestId('site-header-user-link')).toBeHidden()
    await expect(page.getByTestId('site-header-signout-link')).toBeHidden()
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
