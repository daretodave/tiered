import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Cookie, BrowserContextOptions } from '@playwright/test'

// Reads the cookie cache minted by `scripts/mint-e2e-cookie.mjs` and
// builds a Playwright storageState that authed specs can attach via
// `test.use({ storageState: ... })`. Returns `null` if the cache is
// missing, malformed, or expired — caller is expected to gate with
// `test.skip(!state, ...)`.

const __dirname = dirname(fileURLToPath(import.meta.url))
// auth.ts lives at apps/e2e/src/auth.ts → up 3 = repo root.
const REPO_ROOT = resolve(__dirname, '../../..')

const CACHE_PATH =
  process.env['E2E_COOKIE_CACHE_PATH'] ?? resolve(REPO_ROOT, '.cache/e2e-cookie.json')

const AUTH0_BASE = process.env['AUTH0_BASE_URL'] ?? 'http://127.0.0.1:4173'
const BASE = process.env['PLAYWRIGHT_BASE_URL'] ?? 'http://127.0.0.1:4173'

type CachePayload = {
  expiresAt: string
  cookieName: string
  cookieValue: string
}

function readCache(path = CACHE_PATH): CachePayload | null {
  if (!existsSync(path)) return null
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as CachePayload
  } catch {
    return null
  }
}

function isFresh(cached: CachePayload, now = Date.now()): boolean {
  const exp = Date.parse(cached.expiresAt)
  if (Number.isNaN(exp)) return false
  return exp - now > 60_000
}

function cookieDomain(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return '127.0.0.1'
  }
}

export function loadAuthedStorageState(
  options: { now?: number } = {},
): BrowserContextOptions['storageState'] | null {
  const cached = readCache()
  if (!cached) return null
  if (!isFresh(cached, options.now)) return null

  const expiresUnix = Math.floor(Date.parse(cached.expiresAt) / 1000)
  const domains = new Set<string>([cookieDomain(BASE), cookieDomain(AUTH0_BASE)])

  const cookies: Cookie[] = []
  for (const domain of domains) {
    cookies.push({
      name: cached.cookieName,
      value: cached.cookieValue,
      domain,
      path: '/',
      expires: expiresUnix,
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    })
  }

  return { cookies, origins: [] }
}

export function cookieCacheStatus(): 'missing' | 'expired' | 'fresh' {
  const cached = readCache()
  if (!cached) return 'missing'
  return isFresh(cached) ? 'fresh' : 'expired'
}
