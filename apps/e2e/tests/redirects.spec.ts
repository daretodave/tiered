import { expect, test } from '@playwright/test'
import { seasonRedirects } from '../src/fixtures/redirect-fixtures'

// Phase 31a: every digit-form season URL 308s to its canonical
// slug form. The page-level resolver in src/app/shows/[show]/season/[slug]
// looks up the season by number, then permanentRedirects to the
// slug — so external links (and search-engine indexes) keep
// landing on the canonical URL.
//
// The status MUST be a permanent 308 (not a temporary 302/307) and
// the landed slug page MUST emit a matching rel=canonical, so search
// engines consolidate ranking signal on the one canonical URL rather
// than treating the two forms as duplicate content. These two facts
// are SEO-load-bearing across every season URL on the site, so they
// are asserted explicitly here rather than left true-by-inspection
// (CRITIQUE 2026-05-16; closes the digit-form duplicate-URL finding).

for (const r of seasonRedirects) {
  test(`season redirect: ${r.fromPath} → ${r.toPath}`, async ({
    page,
    request,
  }) => {
    // 1. The digit form must be a *permanent* (308) redirect whose
    // Location targets the canonical slug. A non-following request
    // isolates the intermediate hop — a regression to 302/307 would
    // otherwise pass the follow-the-chain assertion below.
    const head = await request.get(r.fromPath, { maxRedirects: 0 })
    expect(
      head.status(),
      `${r.fromPath} must 308 (permanent) — got ${head.status()}`,
    ).toBe(308)
    expect(new URL(head.headers().location, 'http://x').pathname).toBe(
      r.toPath,
    )

    // 2. Following the chain still lands on the slug form with a 200.
    const response = await page.goto(r.fromPath, {
      waitUntil: 'domcontentloaded',
    })
    expect(response?.status()).toBe(200)
    expect(new URL(page.url()).pathname).toBe(r.toPath)

    const chain: string[] = []
    let req = response?.request()
    while (req) {
      chain.unshift(req.url())
      const prev = req.redirectedFrom()
      if (!prev) break
      req = prev
    }
    expect(
      chain[0],
      `redirect chain start for ${r.fromPath}: ${chain.join(' → ')}`,
    ).toContain(r.fromPath)

    // 3. The landed slug page must emit a rel=canonical pointing at
    // the canonical slug URL — the other half of the de-dup contract.
    const canonical = page.locator('link[rel="canonical"]')
    await expect(canonical).toHaveCount(1)
    const href = await canonical.getAttribute('href')
    expect(
      new URL(href ?? '').pathname,
      `rel=canonical on ${r.toPath} must target the slug form (got ${href})`,
    ).toBe(r.toPath)
  })
}
