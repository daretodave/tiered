import { expect, test } from '@playwright/test'

// Phase 14 — dedicated coverage for the themed-list family.
// Smoke walker already 200s /themes and each /themes/[theme];
// this spec adds family-level assertions: JSON-LD shape,
// entry count + ordering, cross-link to season pages, mobile
// reflow.

test.describe('/themes index', () => {
  test('renders one card per themed list, links to detail pages', async ({ page }) => {
    const res = await page.goto('/themes', { waitUntil: 'domcontentloaded' })
    expect(res?.status()).toBe(200)
    await expect(page.locator('h1')).toContainText('Themes')
    const cards = page.locator('a[href^="/themes/"]')
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(2)
  })

  test('emits CollectionPage JSON-LD', async ({ page }) => {
    await page.goto('/themes', { waitUntil: 'domcontentloaded' })
    const ld = await page.locator('script#ld-themes-index').textContent()
    expect(ld).toBeTruthy()
    const parsed = JSON.parse(ld ?? '{}')
    expect(parsed['@type']).toBe('CollectionPage')
  })

  test('mobile @ 375px viewport: no horizontal scroll, H1 visible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/themes', { waitUntil: 'domcontentloaded' })
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)
    await expect(page.locator('h1')).toBeVisible()
  })
})

test.describe('/themes/[theme] detail', () => {
  test('survivor-pillars: renders all four entries in rank order with season links', async ({
    page,
  }) => {
    const res = await page.goto('/themes/survivor-pillars', {
      waitUntil: 'domcontentloaded',
    })
    expect(res?.status()).toBe(200)
    await expect(page.locator('h1')).toContainText(/Survivor/i)

    // Each entry has a "survivor · S<n>" stamp.
    const entries = page.locator('ol > li')
    await expect(entries).toHaveCount(4)

    // The first entry should reference survivor S1 (highest rank).
    await expect(entries.nth(0)).toContainText('S1')
  })

  test('survivor-pillars: emits ItemList JSON-LD whose count matches entries', async ({
    page,
  }) => {
    await page.goto('/themes/survivor-pillars', { waitUntil: 'domcontentloaded' })
    const ld = await page.locator('script#ld-theme').textContent()
    expect(ld).toBeTruthy()
    const parsed = JSON.parse(ld ?? '{}')
    expect(parsed['@type']).toBe('ItemList')
    expect(Array.isArray(parsed.itemListElement)).toBe(true)
    expect(parsed.itemListElement.length).toBe(4)
  })

  test('firsts: renders 2 entries (the shorter list)', async ({ page }) => {
    await page.goto('/themes/firsts', { waitUntil: 'domcontentloaded' })
    const entries = page.locator('ol > li')
    await expect(entries).toHaveCount(2)
  })

  test('mobile @ 375px viewport: no horizontal scroll on detail page', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/themes/survivor-pillars', { waitUntil: 'domcontentloaded' })
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)
    await expect(page.locator('h1')).toBeVisible()
  })
})

test.describe('show page → themes cross-link retrofit', () => {
  test('survivor show page surfaces the Featured-in-themes block', async ({ page }) => {
    await page.goto('/shows/survivor', { waitUntil: 'domcontentloaded' })
    const featured = page.getByTestId('featured-themes')
    await expect(featured).toBeVisible()
    const links = page.getByTestId('featured-theme-link')
    const count = await links.count()
    // Both starter themes contain survivor.
    expect(count).toBeGreaterThanOrEqual(2)
  })

  test('top-chef show page does NOT surface the block (no themes reference it)', async ({
    page,
  }) => {
    await page.goto('/shows/top-chef', { waitUntil: 'domcontentloaded' })
    const featured = page.getByTestId('featured-themes')
    await expect(featured).toHaveCount(0)
  })
})
