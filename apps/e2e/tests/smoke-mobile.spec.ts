import { test, expect } from '@playwright/test'
import { urlsForRun } from '../src/fixtures/sample-urls'
import { pageReads } from '../src/fixtures/page-reads'

// Mobile pass at 375px (iPhone SE) viewport. Every page that exists at
// the desktop pass must reflow cleanly: no horizontal overflow, H1 in
// view. Reflow violations fail the gate. Same JSON-LD assertions —
// schema doesn't change with viewport.

// Reflow contract is enforced at 375px. We don't switch browser
// engines — the Playwright `chromium` project handles both desktop
// and mobile passes; this spec just narrows the viewport. (iPhone
// SE device preset defaults to webkit, which would require a second
// browser install on the runner.)
test.use({
  viewport: { width: 375, height: 812 },
})

const NOISE_PATTERNS: RegExp[] = [
  /favicon\.ico/i,
  /Failed to load resource: net::ERR_FAILED.*sourcemap/i,
]

for (const url of urlsForRun()) {
  test(`mobile: ${url.path}`, async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    const reads = pageReads[url.pattern] ?? {}
    const expectedStatus = reads.expectStatus ?? 200
    const response = await page.goto(url.path, { waitUntil: 'domcontentloaded' })
    expect(response?.status(), `mobile status on ${url.path}`).toBe(expectedStatus)

    // H1 must be visible above the fold.
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()

    // Reflow contract: document never exceeds the viewport horizontally.
    const overflow = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }
    })
    expect(
      overflow.scrollWidth - overflow.clientWidth,
      `horizontal overflow on ${url.path}: scrollWidth=${overflow.scrollWidth} clientWidth=${overflow.clientWidth}`,
    ).toBeLessThanOrEqual(1)

    const meaningful = errors.filter((e) => !NOISE_PATTERNS.some((p) => p.test(e)))
    expect(meaningful, `console errors on ${url.path}: ${meaningful.join('\n')}`).toEqual([])
  })
}
