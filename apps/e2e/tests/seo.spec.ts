import { test, expect } from '@playwright/test'
import { canonicalUrls } from '../src/fixtures/canonical-urls'

const SITEMAP_EXCLUDE = new Set<string>(['/sign-in', '/mod', '/u/[handle]'])

test('robots.txt advertises the sitemap and disallows private surfaces', async ({ page }) => {
  const response = await page.goto('/robots.txt', { waitUntil: 'domcontentloaded' })
  expect(response?.status()).toBe(200)
  const body = (await response?.text()) ?? ''
  expect(body).toMatch(/User-Agent:\s*\*/i)
  expect(body).toMatch(/Disallow:\s*\/api\//i)
  expect(body).toMatch(/Disallow:\s*\/mod/i)
  expect(body).toMatch(/Disallow:\s*\/sign-in/i)
  expect(body).toMatch(/Sitemap:\s*https?:\/\/.+\/sitemap\.xml/i)
})

test('sitemap.xml lists every public canonical URL', async ({ page }) => {
  const response = await page.goto('/sitemap.xml', { waitUntil: 'domcontentloaded' })
  expect(response?.status()).toBe(200)
  const body = (await response?.text()) ?? ''
  expect(body).toContain('<urlset')

  const expectedPaths = canonicalUrls
    .filter((u) => !SITEMAP_EXCLUDE.has(u.pattern))
    .map((u) => u.path)
  for (const path of expectedPaths) {
    const tail = path === '/' ? '/' : path
    expect(body, `sitemap missing path ${path}`).toContain(tail)
  }

  // Excluded URLs must NOT appear in the sitemap.
  for (const u of canonicalUrls) {
    if (!SITEMAP_EXCLUDE.has(u.pattern)) continue
    if (u.path === '/') continue
    expect(body, `sitemap unexpectedly includes ${u.path}`).not.toMatch(new RegExp(`${u.path}\\b`))
  }
})

test('opengraph-image renders a PNG', async ({ page }) => {
  const response = await page.goto('/opengraph-image', { waitUntil: 'domcontentloaded' })
  expect(response?.status()).toBe(200)
  const ct = response?.headers()['content-type'] ?? ''
  expect(ct).toMatch(/image\/png/i)
})
