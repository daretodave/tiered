import { Analytics } from '@vercel/analytics/next'

// Gate: render the beacon only when explicitly enabled by the Vercel
// runtime (VERCEL=1 is set on the build image AND at request time on
// Vercel). Local dev, local prod (`next start`), and Playwright all
// have VERCEL unset, so the beacon never embeds and the production
// dataset stays clean. DISABLE_ANALYTICS=1 forces off even on Vercel
// (e.g. preview deploys we don't want polluting analytics).
export function VercelAnalytics() {
  if (process.env['DISABLE_ANALYTICS'] === '1') return null
  if (process.env['VERCEL'] !== '1') return null
  return <Analytics />
}

export const __test_only__ = {
  isAnalyticsDisabled: () =>
    process.env['DISABLE_ANALYTICS'] === '1' || process.env['VERCEL'] !== '1',
}
