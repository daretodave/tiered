import { expect, test } from '@playwright/test'

// Phase 14 + 19g — coverage for the themed-list family.
// /themes is the cross-canon index; /themes/[theme] is the detail.

test.describe('/themes index (phase 19g shape)', () => {
  test('renders the lists hero with three stats', async ({ page }) => {
    const res = await page.goto('/themes', { waitUntil: 'domcontentloaded' })
    expect(res?.status()).toBe(200)
    await expect(page.locator('h1')).toContainText(/Themed lists/i)
    const stats = page.getByTestId('lists-hero-stats')
    await expect(stats).toBeVisible()
    // Critique pass-40 #353: the hero shows a single LISTS cell with
    // the catalog total. The prior FEATURED + IN THE INDEX split only
    // existed as a workaround for the chip mode-row scoping the
    // non-featured grid; now that chips operate on the whole catalog,
    // featured is an overlay descriptor surfaced in the lede only.
    await expect(page.getByTestId('lists-stat-total')).toContainText(/\d+/)
    await expect(page.getByTestId('lists-stat-total')).toContainText(/Lists/i)
    await expect(page.getByTestId('lists-stat-featured')).toHaveCount(0)
    await expect(page.getByTestId('lists-stat-index')).toHaveCount(0)
    await expect(page.getByTestId('lists-stat-shows')).toContainText(/\d+/)
    await expect(page.getByTestId('lists-stat-revised')).toContainText(
      /\d{4}/,
    )
    // The hero lede must not overclaim coverage: no themed list spans
    // every tracked show, so "span every show" is a false claim.
    await expect(page.locator('.lists-hero-lede')).not.toContainText(
      /every show/i,
    )
  })

  test('filter bar chips mirror populated categories (always includes all)', async ({
    page,
  }) => {
    await page.goto('/themes', { waitUntil: 'domcontentloaded' })

    // Always-on contract: the "all" chip renders unconditionally.
    await expect(page.getByTestId('lists-chip-all')).toBeVisible()

    // Per-category contract: a chip renders iff that category has a group
    // rendered below — mirrors the precedent in ListsAllSection.tsx, where
    // groups are filtered by `byCategory[cat].length > 0`. A "By era" chip
    // with zero era lists confuses readers (clicking it shows nothing); the
    // chip is suppressed instead.
    const groupCategories = await page
      .getByTestId('lists-group')
      .evaluateAll((els) =>
        els.map((el) => el.getAttribute('data-category') ?? ''),
      )
    const populated = new Set(groupCategories.filter(Boolean))

    for (const filter of ['tone', 'structure', 'craft', 'era', 'single']) {
      const chip = page.getByTestId(`lists-chip-${filter}`)
      if (populated.has(filter)) {
        await expect(chip).toBeVisible()
      } else {
        await expect(chip).toHaveCount(0)
      }
    }

    // Total chip count = 1 ("all") + one per populated category.
    const chips = page.locator('[data-testid=lists-filter-bar] .chip')
    await expect(chips).toHaveCount(1 + populated.size)
  })

  test('All-Lists section renders at least one group, each row has data-slug', async ({
    page,
  }) => {
    await page.goto('/themes', { waitUntil: 'domcontentloaded' })
    const groups = page.getByTestId('lists-group')
    expect(await groups.count()).toBeGreaterThanOrEqual(1)
    const rows = page.getByTestId('lists-row')
    const rowCount = await rows.count()
    expect(rowCount).toBeGreaterThanOrEqual(2)
    for (let i = 0; i < rowCount; i++) {
      await expect(rows.nth(i)).toHaveAttribute('data-slug', /.+/)
    }
  })

  test('featured row renders 0–3 cards (does not pad)', async ({ page }) => {
    await page.goto('/themes', { waitUntil: 'domcontentloaded' })
    const cards = page.getByTestId('lists-featured-card')
    const count = await cards.count()
    expect(count).toBeLessThanOrEqual(3)
  })

  test('hero LISTS stat matches the total renderable row count = featured rail + grid (post pass-40 #353)', async ({
    page,
  }) => {
    // Critique pass-40 #353: pre-fix, the page filtered featured slugs
    // out of the chip-filtered grid so chips silently dropped them —
    // a reader clicking BY CRAFT lost the 3 spotlighted craft lists.
    // The fix lets the grid render every theme; featured tiles now
    // appear in the rail AND in the grid. The hero `LISTS` stat names
    // the catalog total; the rail caps at the editorial limit while
    // the grid covers everything chip-filterable.
    await page.goto('/themes', { waitUntil: 'domcontentloaded' })
    const totalVal = Number(
      (
        await page
          .getByTestId('lists-stat-total')
          .locator('.lists-stat-val')
          .textContent()
      )?.trim() ?? 'NaN',
    )
    const rowCount = await page.getByTestId('lists-row').count()
    // Every catalog list renders as a grid row; the hero total matches.
    expect(rowCount).toBe(totalVal)
  })

  test('featured rail slugs are also present in the all-lists grid (chip scope covers the whole catalog, pass-40 #353)', async ({
    page,
  }) => {
    // Critique pass-40 #353 inverts the prior pass-20 invariant: the
    // featured-out filter used to dedupe so each list appeared once
    // per page, but it also dropped the 3 featured lists from the
    // chip-filtered grid (BY CRAFT silently lost 2 craft lists). The
    // new model accepts the duplication — the rail is the editorial
    // spotlight, the grid is the navigable index — so a reader who
    // filters BY CRAFT sees every craft list, including spotlighted
    // ones. This test pins that every featured slug also appears as
    // a grid row.
    await page.goto('/themes', { waitUntil: 'domcontentloaded' })
    const featuredSlugs = await page
      .getByTestId('lists-featured-card')
      .evaluateAll((els) =>
        els.map((el) => el.getAttribute('data-slug') ?? ''),
      )
    const rowSlugs = await page
      .getByTestId('lists-row')
      .evaluateAll((els) =>
        els.map((el) => el.getAttribute('data-slug') ?? ''),
      )
    for (const slug of featuredSlugs) {
      expect(rowSlugs).toContain(slug)
    }
  })

  test('clicking a category chip flips data-active-filter and hides off-filter groups', async ({
    page,
  }) => {
    await page.goto('/themes', { waitUntil: 'domcontentloaded' })
    const scope = page.getByTestId('lists-filter-scope')
    await expect(scope).toHaveAttribute('data-active-filter', 'all')

    // Pick a category that has at least one group on the page.
    const groups = page.getByTestId('lists-group')
    const first = groups.first()
    const category = await first.getAttribute('data-category')
    expect(category).toBeTruthy()

    if (category) {
      await page.getByTestId(`lists-chip-${category}`).click()
      await expect(scope).toHaveAttribute('data-active-filter', category)

      // Off-filter groups should be hidden.
      const otherGroups = page.locator(
        `[data-testid=lists-group]:not([data-category="${category}"])`,
      )
      const otherCount = await otherGroups.count()
      for (let i = 0; i < otherCount; i++) {
        await expect(otherGroups.nth(i)).toBeHidden()
      }
    }
  })

  test('emits CollectionPage JSON-LD with numberOfItems', async ({ page }) => {
    await page.goto('/themes', { waitUntil: 'domcontentloaded' })
    const ld = await page.locator('script#ld-themes-index').textContent()
    expect(ld).toBeTruthy()
    const parsed = JSON.parse(ld ?? '{}')
    expect(parsed['@type']).toBe('CollectionPage')
    expect(typeof parsed.numberOfItems).toBe('number')
    expect(parsed.numberOfItems).toBeGreaterThanOrEqual(1)
  })

  test('mobile @ 375px viewport: no horizontal scroll, H1 visible', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/themes', { waitUntil: 'domcontentloaded' })
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('mobile @ 375px: every list-row preserves the N entries + status meta (closes #320)', async ({
    page,
  }) => {
    // Critique pass-33 [MED]: pre-fix, the mobile breakpoint dropped
    // `.list-row-meta` with `display: none` in both screens.css and
    // lists.css, leaving readers without the per-list scale or freshness
    // signal. Bidirectional drift guard — asserts the entry-count AND
    // status string render visibly on every row at 375px. A regression to
    // `display: none` (or hiding either signal) trips this case.
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/themes', { waitUntil: 'domcontentloaded' })
    const rows = page.getByTestId('lists-row')
    const rowCount = await rows.count()
    expect(rowCount).toBeGreaterThanOrEqual(1)
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i)
      const meta = row.locator('.list-row-meta')
      await expect(meta).toBeVisible()
      const text = (await meta.textContent())?.toLowerCase() ?? ''
      expect(text).toMatch(/\d+\s+entr(y|ies)/)
      expect(text).toMatch(/stable list|growing|updated|started/)
    }
  })
})

test.describe('/themes/[theme] detail (phase 19h shape)', () => {
  test('survivor-pillars: hero renders crumb, title, tagline, meta strip, tools', async ({
    page,
  }) => {
    const res = await page.goto('/themes/survivor-pillars', {
      waitUntil: 'domcontentloaded',
    })
    expect(res?.status()).toBe(200)
    await expect(page.getByTestId('list-hero')).toBeVisible()
    await expect(page.getByTestId('list-title')).toContainText(/Survivor/i)
    await expect(page.getByTestId('list-tagline')).toBeVisible()
    await expect(page.getByTestId('list-meta-entries')).toContainText(
      /Entries\s*\d+/,
    )
    await expect(page.getByTestId('list-meta-shows')).toContainText(/\d+/)
    await expect(page.getByTestId('list-shield')).toBeVisible()
  })

  test('crumb bullet-stack has one bullet per show in the theme', async ({
    page,
  }) => {
    await page.goto('/themes/survivor-pillars', {
      waitUntil: 'domcontentloaded',
    })
    const bullets = page.locator('[data-testid=list-hero] .bullet-stack .bullet')
    await expect(bullets).toHaveCount(1)
  })

  test('uses the narrow 1100px wrap', async ({ page }) => {
    await page.goto('/themes/survivor-pillars', {
      waitUntil: 'domcontentloaded',
    })
    await expect(
      page.locator('#main [data-testid=wrap]'),
    ).toHaveAttribute('data-width', 'narrow')
  })

  test('renders all four entries in rank order, linking to season pages', async ({
    page,
  }) => {
    await page.goto('/themes/survivor-pillars', {
      waitUntil: 'domcontentloaded',
    })
    const entries = page.getByTestId('list-entry')
    await expect(entries).toHaveCount(4)
    await expect(entries.nth(0)).toHaveAttribute('data-rank', '1')
    await expect(entries.nth(3)).toHaveAttribute('data-rank', '4')
    const firstHref = await entries.nth(0).locator('a').getAttribute('href')
    expect(firstHref).toMatch(/^\/shows\/survivor\/season\/[a-z0-9-]+$/)
  })

  test('Save list toggles aria-pressed + data-saved on click', async ({
    page,
  }) => {
    await page.goto('/themes/firsts', { waitUntil: 'domcontentloaded' })
    const save = page.getByTestId('list-save')
    await expect(save).toHaveAttribute('aria-pressed', 'false')
    await save.click()
    await expect(save).toHaveAttribute('aria-pressed', 'true')
    await expect(save).toHaveAttribute('data-saved', 'true')
  })

  test('emits ItemList JSON-LD with author + dateModified + correct count', async ({
    page,
  }) => {
    await page.goto('/themes/survivor-pillars', {
      waitUntil: 'domcontentloaded',
    })
    const ld = await page.locator('script#ld-theme').textContent()
    expect(ld).toBeTruthy()
    const parsed = JSON.parse(ld ?? '{}')
    expect(parsed['@type']).toBe('ItemList')
    expect(Array.isArray(parsed.itemListElement)).toBe(true)
    expect(parsed.itemListElement.length).toBe(4)
    expect(parsed.author?.name).toBeTruthy()
    expect(parsed.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  test('firsts: renders cross-canon entries spanning multiple shows', async ({
    page,
  }) => {
    await page.goto('/themes/firsts', { waitUntil: 'domcontentloaded' })
    const entries = page.getByTestId('list-entry')
    await expect(entries).toHaveCount(7)
    // pass-40 #355: meta-cell now reads `SHOWS / 6` (bare integer), not
    // `SPANS / 6 shows`. The dl renders both `dt` and `dd` text — assert
    // on the bare `dd` value via the `.meta-val` selector so we pin the
    // canonical accounting voice, not the historical `SPANS` label.
    await expect(
      page.getByTestId('list-meta-shows').locator('.meta-val'),
    ).toHaveText('6')
  })

  test('adjacent-lists section either shows links or is absent', async ({
    page,
  }) => {
    await page.goto('/themes/firsts', { waitUntil: 'domcontentloaded' })
    const sections = page.getByTestId('list-adjacent')
    const count = await sections.count()
    if (count > 0) {
      const links = page.getByTestId('list-adjacent-link')
      const linkCount = await links.count()
      expect(linkCount).toBeGreaterThanOrEqual(1)
      expect(linkCount).toBeLessThanOrEqual(2)
    }
  })

  test('mobile @ 375px viewport: no horizontal scroll on detail page', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/themes/survivor-pillars', {
      waitUntil: 'domcontentloaded',
    })
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('LAST REVISED stamp renders calendar "Month YYYY" — no relative-time tokens', async ({
    page,
  }) => {
    // Critique pass-12: the stamp used to render "this week" / "this month"
    // — site-wide chrome stamps everything else as "Month YYYY". Pin the
    // calendar shape on the list /critique flagged (best-finales) so a
    // future regression to a relative-time formatter fails verify, not the
    // next reader pass three weeks later when "this week" has rotted to a
    // lie no one notices.
    await page.goto('/themes/best-finales', {
      waitUntil: 'domcontentloaded',
    })
    const revised = await page.getByTestId('list-meta-revised').textContent()
    expect(revised).toBeTruthy()
    const stamp = (revised ?? '').replace(/^Last revised\s*/i, '').trim()
    expect(stamp).toMatch(/^[A-Z][a-z]+ \d{4}$/)
    expect(stamp).not.toMatch(/this week|this month|this year|today|yesterday/i)
  })
})

test.describe('show page → themes cross-link retrofit', () => {
  test('survivor show page surfaces the Featured-in-themes block', async ({ page }) => {
    await page.goto('/shows/survivor', { waitUntil: 'domcontentloaded' })
    const featured = page.getByTestId('featured-themes')
    await expect(featured).toBeVisible()
    const links = page.getByTestId('featured-theme-link')
    const count = await links.count()
    expect(count).toBeGreaterThanOrEqual(2)
  })

  test('alone-the-skills-challenge show page does NOT surface the block (no themes reference it)', async ({
    page,
  }) => {
    await page.goto('/shows/alone-the-skills-challenge', {
      waitUntil: 'domcontentloaded',
    })
    const featured = page.getByTestId('featured-themes')
    await expect(featured).toHaveCount(0)
  })
})
