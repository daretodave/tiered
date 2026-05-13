import { defineConfig, devices } from '@playwright/test'

const PORT = 4173
const BASE_URL = `http://127.0.0.1:${PORT}`

// Chain: supabase start → supabase db reset → mint cookie → next start.
// All steps run from the repo root (cwd '../..'). Each step is
// tolerant of absent prerequisites — authed-example self-skips when
// the cookie cache is empty; supabase-using specs land in phase 11
// so today a Supabase failure just delays its DB readiness but
// doesn't block the smoke pass. Real migrations land phase 11; today
// seed.sql is a sanity probe only.
//
// supabase start is idempotent (no-op if already running). On a fresh
// box it can take 60–90s to pull images; the 300s overall timeout
// covers that.
const chain = [
  'supabase start',
  'supabase db reset --no-seed',
  'node scripts/mint-e2e-cookie.mjs',
  'pnpm start',
]

const startCommand =
  process.platform === 'win32'
    ? `cmd /c "${chain.map((c) => `(${c} || echo step failed)`).join(' & ')}"`
    : `sh -c "${chain.map((c) => `(${c} || echo step failed)`).join('; ')}"`

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  workers: 1,
  reporter: 'list',
  timeout: 30_000,
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: startCommand,
    cwd: '../..',
    port: PORT,
    reuseExistingServer: !process.env['CI'],
    timeout: 300_000,
    env: {
      DISABLE_ANALYTICS: '1',
      PLAYWRIGHT_BASE_URL: BASE_URL,
      INTERNAL_DEMOS: '1',
    },
  },
})
