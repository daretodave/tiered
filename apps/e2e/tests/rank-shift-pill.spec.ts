import { expect, test } from '@playwright/test'

// Phase 19d — RankShiftPill is built but not yet rendered in
// production. The e2e webServer sets INTERNAL_DEMOS=1, which
// unlocks the /internal/rank-shift-demo page. This spec walks
// one row per sentiment and asserts the pill renders with the
// expected testid + arrow + delta.

const ROUTE = '/internal/rank-shift-demo'

const SENTIMENTS = [
  { sentiment: 'warm-up', delta: 3, arrow: '↑' },
  { sentiment: 'warm-down', delta: -2, arrow: '↓' },
  { sentiment: 'neutral', delta: 0, arrow: '—' },
  { sentiment: 'hold', delta: 1, arrow: '↑' },
  { sentiment: 'verdict', delta: -1, arrow: '↓' },
  { sentiment: 'consensus', delta: 4, arrow: '↑' },
] as const

test.describe('RankShiftPill — internal demo', () => {
  test('renders every sentiment with the right testid + arrow + delta', async ({
    page,
  }) => {
    const response = await page.goto(ROUTE, { waitUntil: 'domcontentloaded' })
    expect(response?.status()).toBe(200)
    await expect(page.getByTestId('rank-shift-demo')).toBeVisible()

    for (const row of SENTIMENTS) {
      const li = page.getByTestId(`rank-shift-row-${row.sentiment}`)
      await expect(li).toBeVisible()
      const pill = li.getByTestId('rank-shift-pill')
      await expect(pill).toBeVisible()
      await expect(pill).toHaveAttribute('data-sentiment', row.sentiment)
      await expect(pill).toHaveAttribute('data-delta', String(row.delta))
      await expect(pill).toContainText(row.arrow)
      if (row.delta !== 0) {
        await expect(pill).toContainText(String(Math.abs(row.delta)))
      }
    }
  })
})
