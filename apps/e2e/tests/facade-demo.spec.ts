import { expect, test } from '@playwright/test'

// /internal/facade-demo is gated by INTERNAL_DEMOS=1 (set on the
// e2e webServer env). In prod the route 404s. Not part of the
// public canonical-urls fixture — internal harness only.

const PATH = '/internal/facade-demo'

async function expectDemoLoads(page: import('@playwright/test').Page) {
  const response = await page.goto(PATH, { waitUntil: 'domcontentloaded' })
  expect(response?.status(), `status on ${PATH}`).toBe(200)
  await expect(page.locator('h1').first()).toContainText(/facade primitives/i)
}

test.describe('desktop @ default viewport', () => {
  test(`facade-demo: ${PATH} renders all four slot primitives + assembled facade + sigil`, async ({
    page,
  }) => {
    await expectDemoLoads(page)

    await expect(page.getByTestId('palette-scope').first()).toBeVisible()
    await expect(page.getByTestId('pediment').first()).toBeVisible()
    await expect(page.getByTestId('column-left').first()).toBeVisible()
    await expect(page.getByTestId('column-center').first()).toBeVisible()
    await expect(page.getByTestId('column-right').first()).toBeVisible()
    await expect(page.getByTestId('frieze').first()).toBeVisible()
    await expect(page.getByTestId('ornament').first()).toBeVisible()

    const facade = page.getByTestId('facade').first()
    await expect(facade).toBeVisible()
    expect(await facade.getAttribute('viewBox')).toBe('0 0 1200 800')

    const sigil = page.getByTestId('sigil').first()
    await expect(sigil).toBeVisible()
    expect(await sigil.getAttribute('viewBox')).toBe('440 0 320 320')
  })
})

test.describe('mobile @ 375px viewport', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test(`facade-demo: ${PATH} reflows cleanly at 375px`, async ({ page }) => {
    await expectDemoLoads(page)
    await expect(page.getByTestId('facade').first()).toBeVisible()
    await expect(page.getByTestId('sigil').first()).toBeVisible()

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }))
    expect(
      overflow.scrollWidth - overflow.clientWidth,
      `horizontal overflow on ${PATH}: scrollWidth=${overflow.scrollWidth} clientWidth=${overflow.clientWidth}`,
    ).toBeLessThanOrEqual(1)
  })
})
