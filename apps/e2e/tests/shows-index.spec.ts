import { expect, test } from '@playwright/test'

// Phase 28 — `/shows` is now the tier-list landing page.
// Hero strip + S/A/B sections + tile variants + footnote.

test.describe('/shows tier-list', () => {
  test('renders hero, three tier sections in S/A/B order, and footnote', async ({ page }) => {
    const response = await page.goto('/shows', { waitUntil: 'domcontentloaded' })
    expect(response?.status()).toBe(200)

    await expect(page.getByTestId('shows-tiered')).toBeVisible()
    await expect(page.getByTestId('shows-hero')).toBeVisible()
    await expect(page.getByTestId('shows-stat-shows')).toBeVisible()
    await expect(page.getByTestId('shows-stat-seasons')).toBeVisible()
    await expect(page.getByTestId('shows-stat-revised')).toBeVisible()

    const tierSections = page.getByTestId('tier-section')
    await expect(tierSections).toHaveCount(3)
    const tierOrder = await tierSections.evaluateAll((els) =>
      els.map((el) => (el as HTMLElement).dataset['tier']),
    )
    expect(tierOrder).toEqual(['S', 'A', 'B'])

    await expect(page.getByTestId('how-tiers-move')).toBeVisible()
  })

  test('every show appears in exactly one tier tile', async ({ page }) => {
    await page.goto('/shows', { waitUntil: 'domcontentloaded' })

    const tiles = page.getByTestId('shows-tile')
    const slugs = await tiles.evaluateAll((els) =>
      els.map((el) => (el as HTMLElement).dataset['show'] ?? ''),
    )
    expect(slugs.length).toBeGreaterThan(0)
    const unique = new Set(slugs)
    expect(unique.size).toBe(slugs.length)
  })

  test('B-tier tiles render the in-progress status pill; S-tier do not', async ({
    page,
  }) => {
    await page.goto('/shows', { waitUntil: 'domcontentloaded' })

    const bSection = page.getByTestId('tier-section').filter({
      has: page.locator('[data-tier="B"]'),
    })
    const bPills = bSection.getByTestId('show-tile-status')
    const bCount = await bPills.count()
    expect(bCount).toBeGreaterThan(0)
    await expect(bPills.first()).toBeVisible()

    const sSection = page.getByTestId('tier-section').filter({
      has: page.locator('[data-tier="S"]'),
    })
    const sPills = sSection.getByTestId('show-tile-status')
    expect(await sPills.count()).toBe(0)
  })

  test('each tile carries the show palette as inline CSS custom properties', async ({
    page,
  }) => {
    await page.goto('/shows', { waitUntil: 'domcontentloaded' })

    const firstTile = page.getByTestId('shows-tile').first()
    const vars = await firstTile.evaluate((el) => {
      const e = el as HTMLElement
      return {
        paper: e.style.getPropertyValue('--tile-paper'),
        ink: e.style.getPropertyValue('--tile-ink'),
        primary: e.style.getPropertyValue('--tile-primary'),
      }
    })
    expect(vars.paper).toMatch(/^#[0-9A-Fa-f]{6}$/)
    expect(vars.ink).toMatch(/^#[0-9A-Fa-f]{6}$/)
    expect(vars.primary).toMatch(/^#[0-9A-Fa-f]{6}$/)
  })
})

test.describe('mobile @ 375px viewport', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('/shows reflows without horizontal overflow', async ({ page }) => {
    const response = await page.goto('/shows', { waitUntil: 'domcontentloaded' })
    expect(response?.status()).toBe(200)
    await expect(page.getByTestId('shows-hero')).toBeVisible()
    await expect(page.getByTestId('tier-section').first()).toBeVisible()

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }))
    expect(
      overflow.scrollWidth - overflow.clientWidth,
      `horizontal overflow on /shows: scrollWidth=${overflow.scrollWidth} clientWidth=${overflow.clientWidth}`,
    ).toBeLessThanOrEqual(1)
  })
})
