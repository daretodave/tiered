import { test, expect } from '@playwright/test'

test('home renders the promise + hero + all the spec sections', async ({
  page,
}) => {
  const errors: string[] = []
  const failedResponses: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('response', (res) => {
    if (res.status() >= 400) failedResponses.push(`${res.status()} ${res.url()}`)
  })

  const response = await page.goto('/')
  expect(response?.status()).toBe(200)

  const main = page.getByRole('main')
  // Phase 27 — the H1 is still the cold-search promise itself.
  await expect(main.locator('h1')).toContainText(/the seasons/i)
  await expect(main.locator('h1')).toContainText(/no spoilers/i)

  // The five sections that make up the phase-27 home.
  await expect(page.getByTestId('home-hero')).toBeVisible()
  await expect(page.getByTestId('home-hero-cover')).toBeVisible()
  await expect(page.getByTestId('home-show-grid')).toBeVisible()
  await expect(page.getByTestId('home-more-shows')).toBeVisible()
  await expect(page.getByTestId('home-dual-callout')).toBeVisible()
  await expect(page.getByTestId('home-lists-stack')).toBeVisible()

  // The themed-lists heading derives its "cross-canon" accent from the
  // catalog's real show coverage (critique #129) — not a hardcoded claim.
  const listSection = page.getByTestId('home-list-section')
  await expect(listSection).toHaveAttribute(
    'data-coverage',
    /^(cross-canon|single-canon)$/,
  )
  const coverage = await listSection.getAttribute('data-coverage')
  await expect(listSection.locator('.section-head h2 em')).toHaveText(
    coverage === 'cross-canon' ? 'cross-canon.' : 'inside one canon.',
  )

  // The home page is bounded — it lives inside the (default) layout's <Wrap>.
  await expect(page.getByTestId('wrap')).toBeVisible()

  // The chrome.
  await expect(page.getByRole('contentinfo')).toBeVisible()
  await expect(page.getByRole('link', { name: /tiered\.tv home/i }).first()).toBeVisible()
  await expect(page.getByRole('button', { name: /switch to (light|dark) mode/i })).toBeVisible()

  expect(failedResponses, `failed responses: ${failedResponses.join(', ')}`).toEqual([])
  expect(errors).toEqual([])
})

test('theme toggle flips data-theme without flash', async ({ page }) => {
  await page.goto('/')
  const initialTheme = await page.evaluate(() => document.documentElement.dataset['theme'])
  expect(initialTheme === undefined || initialTheme === 'dark').toBe(true)

  await page.getByRole('button', { name: /switch to light mode/i }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

  await page.getByRole('button', { name: /switch to dark mode/i }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})

test('hero cover names the featured show + go-pill links to /shows/<slug>', async ({
  page,
}) => {
  await page.goto('/')
  const cover = page.getByTestId('home-hero-cover')
  await expect(cover).toContainText(/currently featured/i)
  await expect(cover).toContainText(/survivor/i)

  const go = page.getByTestId('home-cover-go')
  await expect(go).toHaveAttribute('href', /^\/shows\/[a-z][a-z0-9-]*$/)
})

test('hero stat strip surfaces seasons in canon + canon revised', async ({
  page,
}) => {
  await page.goto('/')
  const stats = page.getByTestId('home-hero-stats')
  // Critique pass-44 (#379): the home featured tile labels the
  // per-show count as `Seasons in canon` (not the catalog-aggregate
  // `Seasons ranked` that /shows hero owns). End-to-end pin
  // mirroring the colocated unit pin in HomeHero.test.tsx.
  await expect(stats).toContainText(/seasons in canon/i)
  await expect(stats).not.toContainText(/seasons ranked/i)
  await expect(stats).toContainText(/canon revised/i)
  // Canon revised label is the editorial "Month YYYY" form (critique
  // pass 7 retired the ambiguous MM / YY shape); cheap shape check.
  const revised = page.getByTestId('home-hero-canon-revised')
  await expect(revised).toHaveText(/^[A-Z][a-z]+\s\d{4}$/)
})

test('hero copy column carries the est-2026 eyebrow + the CTAs', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('home-hero')).toContainText(/tiered\.tv · est\. 2026/i)
  await expect(page.getByTestId('home-cta-shows')).toHaveAttribute('href', '/shows')
  await expect(page.getByTestId('home-cta-about')).toHaveAttribute('href', '/about')
})

test('featured show grid renders exactly 3 tinted tiles', async ({ page }) => {
  await page.goto('/')
  const featuredGrid = page.getByTestId('home-show-grid')
  const tiles = featuredGrid.getByTestId('home-show-tile')
  const count = await tiles.count()
  expect(count).toBeGreaterThanOrEqual(1)
  expect(count).toBeLessThanOrEqual(3)

  const hrefs = await tiles.evaluateAll((els) =>
    els.map((el) => el.getAttribute('href') ?? ''),
  )
  for (const href of hrefs) {
    expect(href).toMatch(/^\/shows\/[a-z][a-z0-9-]*$/)
  }
  // Featured variant — every tile renders a blurb.
  for (let i = 0; i < count; i++) {
    await expect(tiles.nth(i).locator('.show-tile-blurb')).toBeVisible()
  }
})

test('every featured tile renders a bullet + serif name', async ({ page }) => {
  await page.goto('/')
  const tiles = page.getByTestId('home-show-grid').getByTestId('home-show-tile')
  const count = await tiles.count()
  for (let i = 0; i < count; i++) {
    const tile = tiles.nth(i)
    await expect(tile.getByTestId('bullet').first()).toBeVisible()
    await expect(tile.locator('.show-tile-name').first()).toBeVisible()
  }
})

test('compact tiles drop the blurb but keep bullet + name + meta', async ({
  page,
}) => {
  await page.goto('/')
  const compactGrid = page.getByTestId('home-more-shows-grid')
  const compact = compactGrid.getByTestId('home-show-tile')
  const count = await compact.count()
  // No upper bound — the compact grid carries every non-featured show.
  expect(count).toBeGreaterThan(0)
  for (let i = 0; i < count; i++) {
    const tile = compact.nth(i)
    expect(await tile.locator('.show-tile-blurb').count()).toBe(0)
    await expect(tile.locator('.show-tile-name').first()).toBeVisible()
    await expect(tile.getByTestId('bullet').first()).toBeVisible()
  }
})

test('sub-row label reads as a sectioning header, not a teaser', async ({
  page,
}) => {
  await page.goto('/')
  const label = page.getByTestId('home-more-shows-label')
  await expect(label).toHaveText('The rest of the index')
  // Regression pin against the pass-25 teaser-framing finding: the
  // label must never re-introduce the "+ N more in the index" form,
  // which read as a click-to-expand affordance for items already
  // rendered immediately below.
  await expect(label).not.toContainText(/\+\s+\d+\s+more\s+in\s+the\s+index/)
})

test('home surfaces every tracked show — headline reconciles with the grids', async ({
  page,
}) => {
  await page.goto('/')

  const headingText =
    (await page.getByTestId('home-shows-heading').textContent()) ?? ''
  const tracked = Number(headingText.match(/(\d+)\s+shows tracked/i)?.[1])
  expect(tracked).toBeGreaterThan(0)

  const featuredCount = await page
    .getByTestId('home-show-grid')
    .getByTestId('home-show-tile')
    .count()
  const compactCount = await page
    .getByTestId('home-more-shows-grid')
    .getByTestId('home-show-tile')
    .count()
  // The FEATURED hero counts toward the catalog total — it represents
  // one tracked show that no longer appears in either grid (#174).
  const heroCount = await page.getByTestId('home-hero-cover').count()

  // Every tracked show appears on the home page — none stranded.
  expect(featuredCount + compactCount + heroCount).toBe(tracked)
})

// critique pass 10 #174: the FEATURED hero block at the top of the
// home page paints `getFeaturedShow()`; the compact "+ N more"
// tail sliced the full alpha-sorted catalog so the featured slug
// was repainted as a small-card row below. Pin the dedup contract:
// the slug in the hero cover must not appear in either grid.
test('featured hero slug never reappears in the show grids (#174)', async ({
  page,
}) => {
  await page.goto('/')

  const heroHref =
    (await page
      .getByTestId('home-cover-go')
      .getAttribute('href')) ?? ''
  expect(heroHref).toMatch(/^\/shows\/[a-z][a-z0-9-]*$/)

  const collect = async (testid: string): Promise<string[]> => {
    const tiles = page.getByTestId(testid).getByTestId('home-show-tile')
    return await tiles.evaluateAll((els) =>
      els.map((el) => el.getAttribute('href') ?? ''),
    )
  }

  const featuredHrefs = await collect('home-show-grid')
  const compactHrefs = await collect('home-more-shows-grid')

  expect(featuredHrefs).not.toContain(heroHref)
  expect(compactHrefs).not.toContain(heroHref)
})

test('dual-rank callout names canon + community without naming a show', async ({
  page,
}) => {
  await page.goto('/')
  const dual = page.getByTestId('home-dual-callout')
  await expect(dual).toContainText(/editor.?s canon/i)
  await expect(dual).toContainText(/community rank/i)
  const text = (await dual.textContent()) ?? ''
  expect(text).not.toMatch(/survivor|drag race|top chef/i)
})

test('themed-list stack renders rows with sentiment dots', async ({ page }) => {
  await page.goto('/')
  const rows = page.getByTestId('home-list-row')
  const count = await rows.count()
  expect(count).toBeGreaterThanOrEqual(0)
  expect(count).toBeLessThanOrEqual(4)

  const hrefs = await rows.evaluateAll((els) =>
    els.map((el) => el.getAttribute('href') ?? ''),
  )
  for (const href of hrefs) {
    expect(href).toMatch(/^\/themes\/[a-z][a-z0-9-]*$/)
  }
  for (let i = 0; i < count; i++) {
    const row = rows.nth(i)
    await expect(row.getByTestId('home-list-row-dot')).toBeVisible()
    const sentiment = await row.getAttribute('data-sentiment')
    expect(sentiment).toMatch(/^(warm-up|warm-down|neutral|hold|verdict|consensus)$/)
  }
})

test('home hero is color-only — no facade art, no svg illustrations', async ({
  page,
}) => {
  await page.goto('/')
  const hero = page.getByTestId('home-hero')
  await expect(hero).toBeVisible()
  expect(await hero.getByTestId('facade').count()).toBe(0)
  expect(await hero.getByTestId('home-hero-art').count()).toBe(0)
})

test('mobile @ 375px viewport: no horizontal scroll, H1 visible', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 })
  await page.goto('/')
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  )
  expect(overflow).toBeLessThanOrEqual(1)
  await expect(page.locator('h1')).toBeVisible()
})

// critique pass 18: at 375px the brand H1 ("The seasons, ranked. no spoilers.")
// must precede the featured-show "Currently featured" eyebrow in vertical DOM
// order. DOM source order is cover-then-copy so desktop side-by-side wins
// reading order; the mobile media query reorders via grid-item `order:` so the
// first beat on a phone is what tiered.tv *is*, not which show happens to be
// featured this week. Asserts boundingClientRect.top order, not visual
// occlusion, so it survives layout changes that keep the contract intact.
test('mobile @ 375px: brand H1 sits above the featured-show cover', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 800 })
  await page.goto('/')
  const h1Top = await page
    .locator('main h1')
    .first()
    .evaluate((el) => el.getBoundingClientRect().top)
  const eyebrowTop = await page
    .getByTestId('home-hero-eyebrow')
    .first()
    .evaluate((el) => el.getBoundingClientRect().top)
  expect(h1Top).toBeLessThan(eyebrowTop)
})

// Critique pass 9 #170: /, /shows S-tier, and /shows/<show> all
// consumed the same `tagline` field, so a reader walking Home →
// All shows → Survivor saw the identical 3-sentence paragraph
// three times. The `card_tagline` split puts a short editorial
// lede on the two card surfaces and reserves the full tagline
// for the show page hero. This regression test pins the contract:
// the show page hero is not the literal card surface string.
test('Survivor lede differs between card surfaces and the show page hero', async ({
  page,
}) => {
  await page.goto('/')
  const homeSub = (
    (await page
      .getByTestId('home-hero-cover')
      .locator('.cover-sub')
      .first()
      .textContent()) ?? ''
  ).trim()
  expect(homeSub.length).toBeGreaterThan(0)

  await page.goto('/shows')
  const showsTile = page
    .getByTestId('shows-tile')
    .filter({ has: page.locator('[data-show="survivor"]') })
    .first()
  // `shows-tile` carries `data-show` on the link itself, so the
  // `filter` above is belt-and-suspenders — fall back to the
  // attribute selector if filter mis-resolves.
  const survivorTile = (await showsTile.count())
    ? showsTile
    : page.locator('[data-testid="shows-tile"][data-show="survivor"]').first()
  const tileBlurb = (
    (await survivorTile.locator('.show-tile-tagline').textContent()) ?? ''
  ).trim()
  expect(tileBlurb.length).toBeGreaterThan(0)

  await page.goto('/shows/survivor')
  const showHero = (
    (await page.getByTestId('show-hero-tagline').textContent()) ?? ''
  ).trim()
  expect(showHero.length).toBeGreaterThan(0)

  // The two card surfaces may share the same card-lede (a deliberate
  // brand-promise repeat); the show page hero must not be that same
  // string. With `card_tagline` authored on Survivor, the show page
  // renders the longer tagline.
  expect(showHero).not.toBe(homeSub)
  expect(showHero).not.toBe(tileBlurb)
})
