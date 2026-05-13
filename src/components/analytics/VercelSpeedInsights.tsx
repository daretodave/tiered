import { SpeedInsights } from '@vercel/speed-insights/next'

// Mirrors VercelAnalytics — beacon is Vercel-runtime-only.
export function VercelSpeedInsights() {
  if (process.env['DISABLE_ANALYTICS'] === '1') return null
  if (process.env['VERCEL'] !== '1') return null
  return <SpeedInsights />
}
