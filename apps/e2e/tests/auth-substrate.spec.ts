import { expect, test } from '@playwright/test'

// Phase 10 ships:
//   - middleware that issues tiered_anon_id cookie on first request
//   - /sign-in page with a real "Continue with email" link to /auth/login
//   - /auth/* routes mounted by the Auth0 SDK
// This spec exercises the public-facing surfaces. The full magic-link
// flow against the live Auth0 tenant is out of scope for e2e (the
// authed paths use the minted __session cookie via auth.ts).

test('anonymous first visit to / sets a tiered_anon_id cookie', async ({ page, context }) => {
  // Wipe cookies so this is a true first visit.
  await context.clearCookies()
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  const cookies = await context.cookies()
  const anon = cookies.find((c) => c.name === 'tiered_anon_id')
  expect(anon, 'expected tiered_anon_id cookie to be issued by middleware').toBeDefined()
  // RFC 4122 v4 shape
  expect(anon?.value).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  )
  expect(anon?.httpOnly).toBe(true)
})

test('the same anon id persists across subsequent requests', async ({ page, context }) => {
  await context.clearCookies()
  await page.goto('/')
  const after1 = (await context.cookies()).find((c) => c.name === 'tiered_anon_id')?.value
  await page.goto('/shows')
  const after2 = (await context.cookies()).find((c) => c.name === 'tiered_anon_id')?.value
  expect(after2).toBe(after1)
})

test('/sign-in renders the Continue link pointing at /auth/login', async ({ page }) => {
  await page.goto('/sign-in', { waitUntil: 'domcontentloaded' })
  await expect(page.getByTestId('sign-in-page')).toBeVisible()
  const cta = page.getByTestId('sign-in-continue')
  await expect(cta).toBeVisible()
  const href = await cta.getAttribute('href')
  expect(href).toMatch(/^\/auth\/login(\?|$)/)
})

test('/auth/login redirects to the Auth0 tenant authorize endpoint', async ({ page, context }) => {
  await context.clearCookies()
  // Hit /auth/login directly. Auth0 SDK middleware returns a 302 to
  // the tenant; we just confirm the Location header points at the
  // configured AUTH0_DOMAIN.
  const response = await page.request.get('/auth/login', {
    maxRedirects: 0,
    failOnStatusCode: false,
  })
  expect([302, 307].includes(response.status())).toBe(true)
  const location = response.headers()['location'] ?? ''
  expect(location, 'expected Auth0 tenant authorize URL').toMatch(/auth0\.com\/authorize/i)
})
