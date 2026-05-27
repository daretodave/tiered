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

    // Every tier in TIER_ORDER renders a section — populated bands
    // carry a shows-grid, empty bands carry a tier-empty placeholder
    // ("Nothing here yet.") so the legend in <HowTiersMove> always
    // has a band to refer to (critique-pass-14 #202). Order is the
    // canonical S → A → B.
    const tierSections = page.getByTestId('tier-section')
    const tierOrder = await tierSections.evaluateAll((els) =>
      els.map((el) => (el as HTMLElement).dataset['tier']),
    )
    expect(tierOrder).toEqual(['S', 'A', 'B'])

    await expect(page.getByTestId('how-tiers-move')).toBeVisible()
  })

  test('hero lede describes only the tiers whose section actually holds shows', async ({
    page,
  }) => {
    await page.goto('/shows', { waitUntil: 'domcontentloaded' })

    const lede = page.getByTestId('shows-hero-lede')
    await expect(lede).toBeVisible()

    // Every tier renders a section (empty bands carry a tier-empty
    // placeholder), so coverage must match the populated subset —
    // sections whose body is a shows-grid, not a tier-empty. A
    // regression to a hardcoded sentence about a tier with zero
    // shows fails here.
    const coverage = (await lede.getAttribute('data-tier-coverage')) ?? ''
    const populatedTiers = await page
      .locator(
        '[data-testid="tier-section"]:has([data-testid="shows-grid"])',
      )
      .evaluateAll((els) =>
        els.map((el) => (el as HTMLElement).dataset['tier']),
      )
    expect(coverage.split('')).toEqual(populatedTiers)

    const ledeText = (await lede.textContent()) ?? ''
    expect(ledeText.includes('S tier')).toBe(coverage.includes('S'))
    expect(ledeText.includes('A tier')).toBe(coverage.includes('A'))
    expect(ledeText.includes('B tier')).toBe(coverage.includes('B'))
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

    // B may have fully drained (phase 26 promotes shows out of B as
    // their canon matures). The B section always renders now — when
    // empty it carries a tier-empty placeholder (critique-pass-14
    // #202). Only when its body is a shows-grid (i.e. it actually
    // holds tiles) must every tile carry the in-progress status pill.
    // The S-tier no-pill invariant below always holds.
    const bSection = page.getByTestId('tier-section').filter({
      has: page.locator('[data-tier="B"]'),
    })
    const bGrid = bSection.getByTestId('shows-grid')
    if ((await bGrid.count()) > 0) {
      const bPills = bSection.getByTestId('show-tile-status')
      expect(await bPills.count()).toBeGreaterThan(0)
      await expect(bPills.first()).toBeVisible()
    }

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
