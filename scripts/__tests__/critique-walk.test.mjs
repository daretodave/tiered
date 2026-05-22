import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  buildSessionCookies,
  analyzeCapture,
  resolveSessionPair,
  COOKIE_CACHE_PATH,
  VIEWPORTS,
  SESSION_COOKIE_NAME,
  SETTLE_TIMEOUT,
  isAuthMeRequest,
  settleForHydration,
} from '../critique-walk.mjs'

const BASE = 'https://tiered.tv'

test('VIEWPORTS covers the 1280 desktop + 375 mobile reflow contract', () => {
  assert.equal(VIEWPORTS.desktop.width, 1280)
  assert.equal(VIEWPORTS.mobile.width, 375)
})

test('buildSessionCookies: anonymous mode attaches no __session cookie', () => {
  const cookies = buildSessionCookies('anonymous', '__session=abc', BASE)
  assert.deepEqual(cookies, [])
})

test('buildSessionCookies: anonymous ignores even a present cookie pair', () => {
  const cookies = buildSessionCookies('anonymous', undefined, BASE)
  assert.deepEqual(cookies, [])
})

test('buildSessionCookies: authenticated + valid pair → one __session cookie scoped to base', () => {
  const cookies = buildSessionCookies('authenticated', '__session=tok123', BASE)
  assert.equal(cookies.length, 1)
  const [c] = cookies
  assert.equal(c.name, SESSION_COOKIE_NAME)
  assert.equal(c.value, 'tok123')
  assert.equal(c.url, BASE)
  assert.equal(c.httpOnly, true)
  assert.equal(c.secure, true)
})

test('buildSessionCookies: http base → cookie not marked secure', () => {
  const cookies = buildSessionCookies(
    'authenticated',
    '__session=tok',
    'http://127.0.0.1:4173',
  )
  assert.equal(cookies[0].secure, false)
})

test('buildSessionCookies: authenticated + missing pair → null (auth-failed signal)', () => {
  assert.equal(buildSessionCookies('authenticated', '', BASE), null)
  assert.equal(buildSessionCookies('authenticated', undefined, BASE), null)
})

test('buildSessionCookies: authenticated + wrong cookie name → null', () => {
  assert.equal(buildSessionCookies('authenticated', 'other=tok', BASE), null)
})

test('buildSessionCookies: authenticated + empty value → null', () => {
  assert.equal(buildSessionCookies('authenticated', '__session=', BASE), null)
})

test('buildSessionCookies: unknown mode throws (programmer error, not silent)', () => {
  assert.throws(() => buildSessionCookies('weird', '__session=x', BASE))
})

const clean = {
  url: '/',
  viewport: 'desktop',
  authState: 'anonymous',
  status: 200,
  title: 'tiered.tv',
  description: 'the seasons, ranked. no spoilers.',
  canonical: 'https://tiered.tv/',
  ogImage: 'https://tiered.tv/og.png',
  hasH1: true,
  bodyTextLength: 4000,
  scrollWidth: 1280,
  innerWidth: 1280,
  consoleErrors: [],
  failedRequests: [],
}

test('analyzeCapture: a clean desktop capture yields no findings', () => {
  assert.deepEqual(analyzeCapture(clean), [])
})

test('analyzeCapture: HTTP 4xx → infra/high', () => {
  const f = analyzeCapture({ ...clean, status: 404 })
  assert.equal(f.length, 1)
  assert.equal(f[0].category, 'infra')
  assert.equal(f[0].severity, 'high')
  assert.equal(f[0].source, 'browser')
})

test('analyzeCapture: blank render → infra/high', () => {
  const f = analyzeCapture({ ...clean, bodyTextLength: 3 })
  assert.ok(f.some((x) => x.category === 'infra' && x.severity === 'high'))
})

test('analyzeCapture: missing H1 → a11y/medium', () => {
  const f = analyzeCapture({ ...clean, hasH1: false })
  assert.ok(f.some((x) => x.category === 'a11y' && x.severity === 'medium'))
})

test('analyzeCapture: mobile horizontal scroll → mobile/high', () => {
  const f = analyzeCapture({
    ...clean,
    viewport: 'mobile',
    scrollWidth: 460,
    innerWidth: 375,
  })
  assert.ok(f.some((x) => x.category === 'mobile' && x.severity === 'high'))
})

test('analyzeCapture: mobile within 1px tolerance → no mobile finding', () => {
  const f = analyzeCapture({
    ...clean,
    viewport: 'mobile',
    scrollWidth: 376,
    innerWidth: 375,
  })
  assert.ok(!f.some((x) => x.category === 'mobile'))
})

test('analyzeCapture: console errors → performance finding citing the first message', () => {
  const f = analyzeCapture({ ...clean, consoleErrors: ['TypeError: x is not a function'] })
  const c = f.find((x) => x.category === 'performance')
  assert.ok(c)
  assert.equal(c.evidence, 'TypeError: x is not a function')
})

test('analyzeCapture: failed first-party request → performance finding', () => {
  const f = analyzeCapture({
    ...clean,
    failedRequests: ['https://tiered.tv/x.css — HTTP 404'],
  })
  assert.ok(f.some((x) => x.category === 'performance'))
})

test('analyzeCapture: missing SEO tags flagged on desktop only', () => {
  const desktop = analyzeCapture({
    ...clean,
    title: null,
    description: null,
    canonical: null,
    ogImage: null,
  })
  const cats = desktop.filter((x) => x.category === 'seo')
  assert.equal(cats.length, 4)

  const mobile = analyzeCapture({
    ...clean,
    viewport: 'mobile',
    title: null,
    description: null,
    canonical: null,
    ogImage: null,
  })
  assert.ok(!mobile.some((x) => x.category === 'seo'))
})

test('analyzeCapture: an errored capture yields a finding, never a throw', () => {
  const f = analyzeCapture({
    url: '/boom',
    viewport: 'desktop',
    authState: 'anonymous',
    error: 'net::ERR_CONNECTION_REFUSED',
  })
  assert.equal(f.length, 1)
  assert.equal(f[0].category, 'infra')
  assert.equal(f[0].severity, 'high')
  assert.equal(f[0].url, '/boom')
})

test('analyzeCapture: a malformed (null) capture yields a finding, not a throw', () => {
  const f = analyzeCapture(null)
  assert.equal(f.length, 1)
  assert.equal(f[0].auth_state, 'auth-failed')
  assert.equal(f[0].category, 'infra')
})

test('analyzeCapture findings always carry the reader shape', () => {
  const f = analyzeCapture({ ...clean, status: 500 })
  for (const x of f) {
    for (const k of [
      'url',
      'viewport',
      'auth_state',
      'category',
      'severity',
      'observation',
      'evidence',
      'suggested_fix',
      'source',
    ]) {
      assert.ok(k in x, `finding missing ${k}`)
    }
  }
})

// --- hydration settle: capture the post-hydration DOM -----------
// The walk used to read innerText at the `load` event, before the
// header auth-state island fetched /api/auth/me — producing
// false-positive auth-state findings. isAuthMeRequest +
// settleForHydration are the fix: wait for that fetch, then for
// the network to fall idle, before capturing.

test('SETTLE_TIMEOUT is a positive millisecond budget under the nav timeout', () => {
  assert.equal(typeof SETTLE_TIMEOUT, 'number')
  assert.ok(SETTLE_TIMEOUT > 0 && SETTLE_TIMEOUT < 20000)
})

test('isAuthMeRequest: matches /api/auth/me regardless of origin or query', () => {
  assert.equal(isAuthMeRequest('https://tiered.tv/api/auth/me'), true)
  assert.equal(isAuthMeRequest('https://tiered.tv/api/auth/me?nocache=1'), true)
  assert.equal(isAuthMeRequest('http://127.0.0.1:4173/api/auth/me'), true)
})

test('isAuthMeRequest: rejects sibling and unrelated endpoints', () => {
  assert.equal(isAuthMeRequest('https://tiered.tv/api/auth/login'), false)
  assert.equal(isAuthMeRequest('https://tiered.tv/api/comment'), false)
  assert.equal(isAuthMeRequest('https://tiered.tv/api/auth/me/extra'), false)
})

test('isAuthMeRequest: a non-URL string returns false, never throws', () => {
  assert.equal(isAuthMeRequest('not a url'), false)
  assert.equal(isAuthMeRequest(''), false)
})

test('settleForHydration: awaits the auth response, then waits for network idle', async () => {
  const order = []
  const authResponse = Promise.resolve('ok').then((v) => {
    order.push('auth')
    return v
  })
  const page = {
    waitForLoadState(state, opts) {
      order.push('networkidle')
      assert.equal(state, 'networkidle')
      assert.deepEqual(opts, { timeout: 1234 })
      return Promise.resolve()
    },
  }
  await settleForHydration(page, authResponse, 1234)
  assert.deepEqual(order, ['auth', 'networkidle'])
})

test('settleForHydration: a networkidle timeout is swallowed — the walk still proceeds', async () => {
  const page = {
    waitForLoadState() {
      return Promise.reject(new Error('Timeout 8000ms exceeded'))
    },
  }
  await assert.doesNotReject(
    settleForHydration(page, Promise.resolve(null), 8000),
  )
})

test('settleForHydration: an auth-response rejection is swallowed and still triggers the idle wait', async () => {
  let idleWaited = false
  const page = {
    waitForLoadState() {
      idleWaited = true
      return Promise.resolve()
    },
  }
  await assert.doesNotReject(
    settleForHydration(page, Promise.reject(new Error('no /api/auth/me')), 8000),
  )
  assert.equal(idleWaited, true)
})

test('settleForHydration: a null auth response (the pre-caught shape) settles cleanly', async () => {
  let idleWaited = false
  const page = {
    waitForLoadState() {
      idleWaited = true
      return Promise.resolve()
    },
  }
  await settleForHydration(page, Promise.resolve(null), 8000)
  assert.equal(idleWaited, true)
})

// --- resolveSessionPair: the cookie-resolution chain -------------
// This is the seam that lets the cloud authed pass work — mint
// writes .cache/e2e-cookie.json, the walk reads it here without
// relying on .env being sourced into the runner shell.

// Write a throwaway cookie cache and hand back its path + cleanup.
function withCache(contents) {
  const dir = mkdtempSync(join(tmpdir(), 'critique-walk-'))
  const path = join(dir, 'e2e-cookie.json')
  writeFileSync(
    path,
    typeof contents === 'string' ? contents : JSON.stringify(contents),
  )
  return { path, cleanup: () => rmSync(dir, { recursive: true, force: true }) }
}

const FIXED_NOW = Date.UTC(2026, 4, 21, 12, 0, 0)
const freshCacheValue = {
  cookieName: '__session',
  cookieValue: 'jwe-fresh-token',
  expiresAt: new Date(FIXED_NOW + 60 * 60 * 1000).toISOString(),
}

test('COOKIE_CACHE_PATH points at the mint artifact .cache/e2e-cookie.json', () => {
  assert.ok(COOKIE_CACHE_PATH.replace(/\\/g, '/').endsWith('.cache/e2e-cookie.json'))
})

test('resolveSessionPair: explicit --cookie wins over env and cache', () => {
  const { path, cleanup } = withCache(freshCacheValue)
  try {
    const pair = resolveSessionPair({
      cliCookie: '__session=from-cli',
      envCookie: '__session=from-env',
      cachePath: path,
      now: FIXED_NOW,
    })
    assert.equal(pair, '__session=from-cli')
  } finally {
    cleanup()
  }
})

test('resolveSessionPair: env used when no --cookie, wins over cache', () => {
  const { path, cleanup } = withCache(freshCacheValue)
  try {
    const pair = resolveSessionPair({
      envCookie: '__session=from-env',
      cachePath: path,
      now: FIXED_NOW,
    })
    assert.equal(pair, '__session=from-env')
  } finally {
    cleanup()
  }
})

test('resolveSessionPair: empty --cookie / env fall through to the cache', () => {
  const { path, cleanup } = withCache(freshCacheValue)
  try {
    const pair = resolveSessionPair({
      cliCookie: '',
      envCookie: '',
      cachePath: path,
      now: FIXED_NOW,
    })
    assert.equal(pair, '__session=jwe-fresh-token')
  } finally {
    cleanup()
  }
})

test('resolveSessionPair: cache fallback when no --cookie and no env', () => {
  const { path, cleanup } = withCache(freshCacheValue)
  try {
    const pair = resolveSessionPair({ cachePath: path, now: FIXED_NOW })
    assert.equal(pair, '__session=jwe-fresh-token')
  } finally {
    cleanup()
  }
})

test('resolveSessionPair: a stale cache (past refresh window) is treated as absent', () => {
  const { path, cleanup } = withCache({
    ...freshCacheValue,
    expiresAt: new Date(FIXED_NOW - 1000).toISOString(),
  })
  try {
    assert.equal(resolveSessionPair({ cachePath: path, now: FIXED_NOW }), '')
  } finally {
    cleanup()
  }
})

test('resolveSessionPair: a cache inside the 5-min refresh window counts as stale', () => {
  const { path, cleanup } = withCache({
    ...freshCacheValue,
    expiresAt: new Date(FIXED_NOW + 60 * 1000).toISOString(),
  })
  try {
    assert.equal(resolveSessionPair({ cachePath: path, now: FIXED_NOW }), '')
  } finally {
    cleanup()
  }
})

test('resolveSessionPair: missing cache file → empty string', () => {
  const dir = mkdtempSync(join(tmpdir(), 'critique-walk-'))
  try {
    const pair = resolveSessionPair({
      cachePath: join(dir, 'does-not-exist.json'),
      now: FIXED_NOW,
    })
    assert.equal(pair, '')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('resolveSessionPair: malformed cache JSON → empty string, no throw', () => {
  const { path, cleanup } = withCache('{ not valid json')
  try {
    assert.equal(resolveSessionPair({ cachePath: path, now: FIXED_NOW }), '')
  } finally {
    cleanup()
  }
})

test('resolveSessionPair: cache missing cookieValue → empty string', () => {
  const { path, cleanup } = withCache({
    cookieName: '__session',
    expiresAt: new Date(FIXED_NOW + 60 * 60 * 1000).toISOString(),
  })
  try {
    assert.equal(resolveSessionPair({ cachePath: path, now: FIXED_NOW }), '')
  } finally {
    cleanup()
  }
})

test('resolveSessionPair: cache with a non-parseable expiresAt → empty string', () => {
  const { path, cleanup } = withCache({ ...freshCacheValue, expiresAt: 'whenever' })
  try {
    assert.equal(resolveSessionPair({ cachePath: path, now: FIXED_NOW }), '')
  } finally {
    cleanup()
  }
})

test('resolveSessionPair: a resolved cache pair flows through buildSessionCookies', () => {
  const { path, cleanup } = withCache(freshCacheValue)
  try {
    const pair = resolveSessionPair({ cachePath: path, now: FIXED_NOW })
    const cookies = buildSessionCookies('authenticated', pair, BASE)
    assert.equal(cookies.length, 1)
    assert.equal(cookies[0].name, SESSION_COOKIE_NAME)
    assert.equal(cookies[0].value, 'jwe-fresh-token')
  } finally {
    cleanup()
  }
})
