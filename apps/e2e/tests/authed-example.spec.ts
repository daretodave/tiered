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
})
