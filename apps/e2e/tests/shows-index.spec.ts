import { expect, test } from '@playwright/test'

// Phase 28 — `/shows` is now the tier-list landing page.
// Hero strip + S/A/B sections + tile variants + footnote.

test.describe('/shows tier-list', () => {
  test('renders hero, populated tier sections in canonical order, and footnote', async ({ page }) => {
    const response = await page.goto('/shows', { waitUntil: 'domcontentloaded' })
    expect(response?.status()).toBe(200)

    await expect(page.getByTestId('shows-tiered')).toBeVisible()
    await expect(page.getByTestId('shows-hero')).toBeVisible()
    await expect(page.getByTestId('shows-stat-shows')).toBeVisible()
    await expect(page.getByTestId('shows-stat-seasons')).toBeVisible()
    await expect(page.getByTestId('shows-stat-revised')).toBeVisible()

    // Only tiers that carry shows render a section (critique-pass-50
    // #412 — empty bands are hidden so the hero, meta description,
    // and page body all enumerate the same set; the <HowTiersMove>
    // legend explains the tier system on its own and does not need a
    // band to refer to). This reverses critique-pass-14 #202's
    // empty-placeholder behavior. Order is the canonical S → A → B
    // subset of populated tiers.
    const tierSections = page.getByTestId('tier-section')
    const tierOrder = await tierSections.evaluateAll((els) =>
      els.map((el) => (el as HTMLElement).dataset['tier']),
    )
    expect(tierOrder.length).toBeGreaterThan(0)
    // Order is monotonically increasing within ['S','A','B'].
    const rank: Record<string, number> = { S: 0, A: 1, B: 2 }
    for (let i = 1; i < tierOrder.length; i++) {
      const prev = rank[tierOrder[i - 1] as string] ?? -1
      const curr = rank[tierOrder[i] as string] ?? -1
      expect(curr).toBeGreaterThan(prev)
    }
    // Every rendered band carries a shows-grid; no tier-empty band is
    // surfaced after the pass-50 closure.
    for (const tier of tierOrder) {
      const section = page.getByTestId('tier-section').filter({
        has: page.locator(`[data-tier="${tier}"]`),
      })
      await expect(section.getByTestId('shows-grid')).toBeVisible()
      expect(await section.getByTestId('tier-empty').count()).toBe(0)
    }

    await expect(page.getByTestId('how-tiers-move')).toBeVisible()
  })

  test('hero lede describes only the tiers whose section actually holds shows', async ({
    page,
  }) => {
    await page.goto('/shows', { waitUntil: 'domcontentloaded' })

    const lede = page.getByTestId('shows-hero-lede')
    await expect(lede).toBeVisible()

    // Only populated tiers render a section (critique-pass-50 #412 —
    // empty bands are hidden so hero, meta, and body enumerate the
    // same set), so coverage must match every rendered tier-section.
    // A regression to a hardcoded sentence about a tier with zero
    // shows fails here.
    const coverage = (await lede.getAttribute('data-tier-coverage')) ?? ''
    const populatedTiers = await page
      .getByTestId('tier-section')
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
    // their canon matures). After critique-pass-50 #412 the empty
    // B-band is hidden entirely — when no show carries `tier === 'B'`
    // the section is absent from the DOM. When present, every tile
    // must carry the in-progress status pill. The S-tier no-pill
    // invariant below always holds.
    const bSection = page.getByTestId('tier-section').filter({
      has: page.locator('[data-tier="B"]'),
    })
    if ((await bSection.count()) > 0) {
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
