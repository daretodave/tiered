import { expect, test } from '@playwright/test'

// CRITIQUE pass-120: a URL with no matching route segment anywhere
// (unlike a route matched-but-missing inside a group, e.g. a stale
// show slug) fell through past every route group's own not-found.tsx
// to Next's bare, chrome-less built-in 404. src/app/not-found.tsx is
// the root-level boundary that catches this case and renders the
// same shared header/footer shell as the rest of the site.

test('unmatched top-level URL renders the branded 404 with full chrome, not the bare Next fallback', async ({
  page,
}) => {
  const response = await page.goto('/this-route-does-not-exist-e2e', {
    waitUntil: 'domcontentloaded',
  })
  expect(response?.status()).toBe(404)

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Not found.',
  )
  await expect(page.getByRole('link', { name: 'Back to tiered.tv' })).toHaveAttribute(
    'href',
    '/',
  )

  // The site chrome — header + footer — must still be present, not
  // just the bare page content.
  await expect(page.locator('header')).toBeVisible()
  await expect(page.locator('footer[data-testid="site-footer"]')).toBeVisible()
})
