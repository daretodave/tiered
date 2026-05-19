import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildSessionCookies,
  analyzeCapture,
  VIEWPORTS,
  SESSION_COOKIE_NAME,
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
