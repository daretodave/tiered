import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from '@playwright/test'
import { canonicalUrls } from '../src/fixtures/canonical-urls'

// Phase 33: /shows/[show] is the consolidated ranking surface — hero
// + shifts + the ranking (sticky Editor's Canon / Community tabs,
// both panes SSR'd) + themed lists. The standalone /canon +
// /community routes 308 here (see redirects.spec.ts).

const showHomeUrls = canonicalUrls.filter((u) => u.pattern === '/shows/[show]')

const EXPECTED_PALETTES: Record<string, { primary: string; ink: string; paper: string }> = {
  survivor: { primary: '#D55E36', ink: '#EFE2BD', paper: '#0E2A2A' },
  'top-chef': { primary: '#B86A2E', ink: '#ECDFC6', paper: '#1B2418' },
  dragrace: { primary: '#E64B86', ink: '#F2E1D2', paper: '#2D0B2A' },
}

for (const url of showHomeUrls) {
  const slug = url.show ?? ''
  test.describe(`show page: ${slug}`, () => {
    test(`renders hero + shifts + ranking (both panes SSR'd) + palette`, async ({
      page,
    }) => {
      const response = await page.goto(url.path, { waitUntil: 'domcontentloaded' })
      expect(response?.status(), `status for ${url.path}`).toBe(200)

      await expect(page.getByTestId('show-home-screen')).toBeVisible()
      await expect(page.getByTestId('show-hero')).toBeVisible()
      await expect(page.getByTestId('show-hero-cover')).toBeVisible()
      const heroStats = page.getByTestId('show-hero-stats')
      await expect(heroStats).toBeVisible()
      // Issue #104 / critique pass 7: canon-revised stat is the shared
      // formatter — the same "Month YYYY" editorial shape + same "Canon
      // revised" key the home renders, so a reader navigating home → show
      // sees one consistent label. The label and value live in adjacent
      // spans inside the same .stat block; isolate the value span so the
      // regex pins format exactly (`toContainText` on the parent
      // container concatenates sibling text with no separator, defeating
      // `\b` word boundaries).
      await expect(heroStats).toContainText(/canon revised/i)
      const revisedValue = heroStats
        .locator('.stat', { hasText: /canon revised/i })
        .locator('.stat-val')
      await expect(revisedValue).toHaveText(/^[A-Z][a-z]+\s\d{4}$/)
      // Critique pass 15: the seasons stat label is derived from canon
      // coverage (src/lib/canon/seasons-stat-label.ts). Survivor is the
      // gold-standard fully-drained show — every aired season has a canon
      // slot — so its hero must read "seasons ranked", matching the home
      // featured stamp + /shows index total rather than under-claiming
      // "seasons aired". Pins the page.tsx wiring end-to-end (the unit
      // test pins the helper; this pins that the page feeds it the canon
      // entry count, not the aired count).
      if (slug === 'survivor') {
        const seasonsStat = heroStats
          .locator('.stat')
          .filter({ hasText: /seasons (ranked|aired)/i })
          .first()
        await expect(seasonsStat.locator('.stat-key')).toHaveText(/seasons ranked/i)
      }
      await expect(page.getByTestId('bullet').first()).toBeVisible()
      // Phase 37 nit 4: the 72-hour shift signal is unwired (phase 35),
      // so the "What changed this week." section is absent entirely —
      // no empty box, no stray rule.
      expect(await page.getByTestId('shifts-row').count()).toBe(0)
      expect(await page.getByTestId('shifts-empty').count()).toBe(0)
      await expect(page.getByTestId('shield-badge').first()).toBeVisible()

      // The consolidated ranking: root seeded canon (default view),
      // intro lede, sticky tabs, and BOTH panes present in the DOM
      // (community is CSS-hidden until the tab flips — SEO-safe).
      const ranking = page.getByTestId('show-ranking')
      await expect(ranking).toBeVisible()
      expect(await ranking.getAttribute('data-view')).toBe('canon')
      await expect(page.getByTestId('ranking-intro')).toBeVisible()
      await expect(page.getByTestId('canon-tabs')).toBeVisible()
      await expect(page.getByTestId('canon-view-pane')).toBeVisible()
      expect(await page.getByTestId('community-view-pane').count()).toBe(1)

      // The split is gone; the facade was never here.
      expect(await page.getByTestId('show-split').count()).toBe(0)
      expect(await page.getByTestId('show-facade-art').count()).toBe(0)
      expect(await page.getByTestId('facade').count()).toBe(0)

      const wordmark = page.locator('.wordmark').first()
      await expect(wordmark).toBeVisible()

      const wrapper = page.locator(`[data-show="${slug}"]`).first()
      await expect(wrapper).toBeVisible()

      const expected = EXPECTED_PALETTES[slug]
      if (expected) {
        const cssVars = await wrapper.evaluate((el) => {
          const cs = getComputedStyle(el as HTMLElement)
          return {
            primary: cs.getPropertyValue('--show-primary').trim(),
            ink: cs.getPropertyValue('--show-ink').trim(),
            paper: cs.getPropertyValue('--show-paper').trim(),
          }
        })
        expect(cssVars.primary.toLowerCase()).toBe(expected.primary.toLowerCase())
        expect(cssVars.ink.toLowerCase()).toBe(expected.ink.toLowerCase())
        expect(cssVars.paper.toLowerCase()).toBe(expected.paper.toLowerCase())
      }
    })

    test('meta description fits Google\'s 155-char clip and drops the legacy SEO prefix', async ({
      page,
    }) => {
      // CRITIQUE pass 10 MED (#176): the show page meta description
      // previously bolted "every season ranked: the Editor's Canon
      // and the live community vote on one page." in front of the
      // full tagline, pushing total length past 270 chars on Survivor
      // and overshooting Google's ~155-char clip on every show. Fix
      // shape mirrors the season page's `descriptionFor` (cc58f17):
      // prefer `card_tagline` when authored (schema caps it at 160),
      // else `tagline`, else a word-boundary truncation. Pin the
      // contract here so a regression to the prefix or to an
      // over-clip tagline trips the gate.
      await page.goto(url.path, { waitUntil: 'domcontentloaded' })
      const description = await page
        .locator('meta[name="description"]')
        .getAttribute('content')
      expect(description, `meta description on ${url.path}`).toBeTruthy()
      expect(description!.length, `meta description length on ${url.path}`).toBeLessThanOrEqual(160)
      expect(description).not.toMatch(/every season ranked: the Editor's Canon/)
    })
  })
}

test.describe('survivor meta description — gold-standard reference', () => {
  test('Survivor description equals the curator\'s card_tagline verbatim', async ({
    page,
  }) => {
    // Survivor is the only show in the seeded set authoring a
    // `card_tagline`. The fix prefers `card_tagline` over `tagline`
    // when present, so the meta description reads as the curator's
    // 104-char card-form sentence — well under the 160-char clip,
    // and the editorial line a search reader actually sees.
    await page.goto('/shows/survivor', { waitUntil: 'domcontentloaded' })
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute('content')
    expect(description).toBe(
      'The format that invented itself in episode one, and is still finding new ways to ask who you really are.',
    )
  })
})

// Phase 43 final tick — Survivor's `est_year` is 2000 with a
// May 31 anniversary anchor (see SHOW_ANNIVERSARIES in
// `src/lib/show-tenure.ts`). The helper reads "twenty-five" until
// May 30 of any given year, then "twenty-six" / "twenty-seven" /
// ... from May 31 onward. Mirrored inline because `apps/e2e` is
// an isolated package without a path mapping back to `src/lib/`;
// the four-entry fallback map covers the realistic lifetime of
// this fixture (drop or extend when Survivor S30 hits the air).
const SURVIVOR_TENURE_WORDS: Readonly<Record<number, string>> = {
  25: 'twenty-five',
  26: 'twenty-six',
  27: 'twenty-seven',
  28: 'twenty-eight',
}

function derivedSurvivorTenureWord(asOfDate: Date = new Date()): string {
  const refYear = asOfDate.getUTCFullYear()
  const refMonth = asOfDate.getUTCMonth() + 1
  const refDay = asOfDate.getUTCDate()
  const beforeAnniversary = refMonth < 5 || (refMonth === 5 && refDay < 31)
  const years = refYear - 2000 - (beforeAnniversary ? 1 : 0)
  const word = SURVIVOR_TENURE_WORDS[years]
  if (!word) {
    throw new Error(
      `Survivor tenure ${years} outside this fixture's window (${Object.keys(SURVIVOR_TENURE_WORDS).join(', ')}); update SURVIVOR_TENURE_WORDS in show-home.spec.ts`,
    )
  }
  return word
}

test.describe('phase 43 — tagline token substitution (Survivor)', () => {
  test('show-hero-tagline renders the substituted years word, never the raw token', async ({
    page,
  }) => {
    await page.goto('/shows/survivor', { waitUntil: 'domcontentloaded' })
    const tagline = page.getByTestId('show-hero-tagline')
    await expect(tagline).toBeVisible()
    const text = (await tagline.textContent()) ?? ''
    // The loader must substitute the token end-to-end — never let the
    // raw template syntax leak to a reader.
    expect(text).not.toContain('{yearsWord}')
    expect(text).not.toContain('{years}')
    // Final-tick smoke assertion: the rendered word equals exactly
    // what `numberToWords(yearsSinceEst(2000))` reads today. A
    // hardcoded "twenty-five" that survives past May 31 is the rot
    // class Phase 43 closed — this expectation flips red the moment
    // the production substitution drifts from the helper.
    const expectedWord = derivedSurvivorTenureWord()
    expect(text).toContain(`${expectedWord} years`)
  })
})

test.describe('same-page tab toggle persists URL state (no navigation)', () => {
  test('Community tab flips data-view + writes ?view=community in place', async ({
    page,
  }) => {
    await page.goto('/shows/survivor', { waitUntil: 'domcontentloaded' })
    const ranking = page.getByTestId('show-ranking')
    expect(await ranking.getAttribute('data-view')).toBe('canon')

    await page.getByTestId('canon-tab-community').click()
    expect(await ranking.getAttribute('data-view')).toBe('community')
    await expect(page).toHaveURL(/\/shows\/survivor\?view=community#community$/)
    await expect(page.getByTestId('community-view-pane')).toBeVisible()

    await page.getByTestId('canon-tab-canon').click()
    expect(await ranking.getAttribute('data-view')).toBe('canon')
    await expect(page).toHaveURL(/\/shows\/survivor(#canon)?$/)
    await expect(page.getByTestId('canon-view-pane')).toBeVisible()
  })

  test('?view=community deep-link seeds the community pane server-side', async ({
    page,
  }) => {
    await page.goto('/shows/survivor?view=community', {
      waitUntil: 'domcontentloaded',
    })
    const ranking = page.getByTestId('show-ranking')
    expect(await ranking.getAttribute('data-view')).toBe('community')
    await expect(page.getByTestId('community-view-pane')).toBeVisible()
  })
})

test.describe('era toolbar (33b)', () => {
  test('Survivor canon pane: All preselected + era chips filter entries', async ({
    page,
  }) => {
    await page.goto('/shows/survivor', { waitUntil: 'domcontentloaded' })

    const toolbar = page.getByTestId('canon-era-toolbar')
    await expect(toolbar).toBeVisible()

    const all = page.getByTestId('era-chip-all')
    await expect(all).toHaveAttribute('aria-selected', 'true')
    await expect(all).toHaveText(/All \d+/)

    // Survivor authors 5 era_bands → ≥1 era chip beyond All.
    const eraChips = toolbar.locator('.cp-chip:not([data-filter=all])')
    expect(await eraChips.count()).toBeGreaterThanOrEqual(1)

    const firstEra = eraChips.first()
    const eraKey = await firstEra.getAttribute('data-filter')
    await firstEra.click()
    await expect(firstEra).toHaveAttribute('aria-selected', 'true')
    await expect(all).toHaveAttribute('aria-selected', 'false')

    // CSS-toggle discipline: non-matching entries carry data-era-off,
    // none are removed from the DOM (SEO-safe).
    const offCount = await page
      .locator('[data-view-pane=canon] [data-era-off=true]')
      .count()
    expect(offCount).toBeGreaterThan(0)
    const matching = page.locator(
      `[data-view-pane=canon] [data-era="${eraKey}"]`,
    )
    expect(await matching.count()).toBeGreaterThan(0)
    for (const el of await matching.all()) {
      expect(await el.getAttribute('data-era-off')).toBeNull()
    }

    // Keyboard-reachable, role=tab, visible focus ring (a11y — chip
    // sizing stays locked to Survivor.html per the visual law).
    await firstEra.focus()
    await expect(firstEra).toBeFocused()
    await expect(firstEra).toHaveAttribute('role', 'tab')

    await all.click()
    await expect(all).toHaveAttribute('aria-selected', 'true')
    expect(
      await page.locator('[data-view-pane=canon] [data-era-off=true]').count(),
    ).toBe(0)
  })

  test('toolbar consumes era_bands generically on a second show', async ({
    page,
  }) => {
    // The toolbar reads canon.era_bands generically — no per-show page
    // code. dragrace authors its own bands; All stays preselected.
    await page.goto('/shows/dragrace', { waitUntil: 'domcontentloaded' })
    const toolbar = page.getByTestId('canon-era-toolbar')
    await expect(toolbar).toBeVisible()
    await expect(page.getByTestId('era-chip-all')).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(
      await toolbar.locator('.cp-chip:not([data-filter=all])').count(),
    ).toBeGreaterThanOrEqual(1)
  })
})

// Phase 34 (final tick): the era-band drain is complete — every
// canon'd launch show carries authored `era_bands`. Derive the set
// from the content tree (no src/ dependency, mirrors canonical-urls)
// and assert each show's toolbar renders real era chips beyond All.
// Future small shows without bands are naturally excluded — they
// have no `era_bands:` block to match.
const SHOWS_DIR = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../../content/shows',
)
const showsWithEraBands = canonicalUrls
  .filter((u) => u.pattern === '/shows/[show]' && u.show)
  .map((u) => u.show as string)
  .filter((slug) => {
    const canon = resolve(SHOWS_DIR, slug, 'canon.md')
    return existsSync(canon) && /^era_bands:/m.test(readFileSync(canon, 'utf8'))
  })

test.describe('era-band drain complete (phase 34)', () => {
  for (const slug of showsWithEraBands) {
    test(`${slug}: era toolbar renders > 1 chip`, async ({ page }) => {
      await page.goto(`/shows/${slug}`, { waitUntil: 'domcontentloaded' })
      const toolbar = page.getByTestId('canon-era-toolbar')
      await expect(toolbar).toBeVisible()
      await expect(page.getByTestId('era-chip-all')).toHaveAttribute(
        'aria-selected',
        'true',
      )
      expect(
        await toolbar.locator('.cp-chip:not([data-filter=all])').count(),
        `${slug} should expose authored era chips`,
      ).toBeGreaterThanOrEqual(1)
    })
  }
})

test.describe('phase 37 design-fidelity nits', () => {
  test('nit 1: sticky canon tab bar pins flush under the site header (desktop)', async ({
    page,
  }) => {
    await page.goto('/shows/survivor', { waitUntil: 'domcontentloaded' })
    const tabs = page.getByTestId('canon-tabs')
    const header = page.locator('.site-header').first()
    await expect(tabs).toBeVisible()
    await expect(header).toBeVisible()

    // Scroll far enough that the tab bar is pinned (sticky engaged).
    await page.evaluate(() => window.scrollTo(0, 1400))
    await page.waitForTimeout(120)

    const tabsBox = await tabs.boundingBox()
    const headerBox = await header.boundingBox()
    expect(tabsBox, 'tab bar bounding box').not.toBeNull()
    expect(headerBox, 'header bounding box').not.toBeNull()
    const gap = tabsBox!.y - (headerBox!.y + headerBox!.height)
    expect(
      Math.abs(gap),
      `tab bar should sit flush under the header — gap=${gap}px`,
    ).toBeLessThanOrEqual(2)
  })

  test('nit 1 (mobile @375): sticky canon tab bar pins flush under the header', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/shows/survivor', { waitUntil: 'domcontentloaded' })
    const tabs = page.getByTestId('canon-tabs')
    const header = page.locator('.site-header').first()
    await expect(tabs).toBeVisible()

    await page.evaluate(() => window.scrollTo(0, 1600))
    await page.waitForTimeout(120)

    const tabsBox = await tabs.boundingBox()
    const headerBox = await header.boundingBox()
    const gap = tabsBox!.y - (headerBox!.y + headerBox!.height)
    expect(
      Math.abs(gap),
      `mobile tab bar flush under header — gap=${gap}px`,
    ).toBeLessThanOrEqual(2)
  })

  test('nit 3: methodology bottom and era toolbar top share a single seam', async ({
    page,
  }) => {
    await page.goto('/shows/survivor', { waitUntil: 'domcontentloaded' })
    const methodology = page.getByTestId('canon-methodology')
    const toolbar = page.getByTestId('canon-era-toolbar')
    await expect(methodology).toBeVisible()
    await expect(toolbar).toBeVisible()

    const mBox = await methodology.boundingBox()
    const tBox = await toolbar.boundingBox()
    expect(mBox, 'methodology box').not.toBeNull()
    expect(tBox, 'toolbar box').not.toBeNull()
    const seamGap = tBox!.y - (mBox!.y + mBox!.height)
    expect(
      Math.abs(seamGap),
      `no hollow double border — methodology→toolbar gap=${seamGap}px`,
    ).toBeLessThanOrEqual(2)
  })
})

test.describe('mobile @ 375px viewport', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  for (const url of showHomeUrls) {
    const slug = url.show ?? ''
    test(`show page mobile reflow: ${slug}`, async ({ page }) => {
      const response = await page.goto(url.path, { waitUntil: 'domcontentloaded' })
      expect(response?.status()).toBe(200)
      await expect(page.getByTestId('show-hero')).toBeVisible()
      await expect(page.getByTestId('show-ranking')).toBeVisible()

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }))
      expect(
        overflow.scrollWidth - overflow.clientWidth,
        `horizontal overflow on ${url.path}: scrollWidth=${overflow.scrollWidth} clientWidth=${overflow.clientWidth}`,
      ).toBeLessThanOrEqual(1)
    })
  }

  // Critique pass 8 (#158): CURATED / LIVE captions must stay visible on
  // mobile — they are the only on-page differentiator between the
  // editor-curated and live-community ranking systems.
  test('ranking tabs keep CURATED / LIVE chips visible at 375px', async ({
    page,
  }) => {
    await page.goto('/shows/survivor', { waitUntil: 'domcontentloaded' })
    const tabs = page.getByTestId('canon-tabs')
    await expect(tabs).toBeVisible()
    const caps = tabs.locator('.cp-tab-cap')
    await expect(caps).toHaveCount(2)
    await expect(caps.nth(0)).toBeVisible()
    await expect(caps.nth(1)).toBeVisible()
    await expect(caps.nth(0)).toHaveText(/curated/i)
    await expect(caps.nth(1)).toHaveText(/live/i)
  })
})
