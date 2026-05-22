#!/usr/bin/env node
// Playwright-driven critique walk (reader.md Path A2 — CI).
//
// Drives the headless chromium already installed + cached in
// `apps/e2e` to walk a URL set in a *fresh isolated browser
// context*. Because the context is created clean
// (`browser.newContext()`), there is no shared operator profile
// to inherit — the contamination class that produced the
// 2026-05-19 critique pass-1 false HIGH cannot occur here. The
// session is whatever `--mode` deterministically sets, nothing
// else.
//
// Emits the `reader` finding shape (see .claude/agents/reader.md
// "Finding format") plus the raw `captures[]` the reader agent
// assesses qualitatively:
//
//   { meta, captures: [...], findings: [...] }
//
// Usage:
//   node scripts/critique-walk.mjs \
//     --mode anonymous|authenticated \
//     --base https://tiered.tv \
//     --urls /,/shows,/shows/survivor \
//     [--cookie '__session=...'] \
//     [--out path.json] [--timeout 20000] [--settle-timeout 8000]
//
// In authenticated mode the `__session` pair is resolved in
// precedence order: --cookie  →  $CRITIQUE_SESSION_COOKIE  →
// `.cache/e2e-cookie.json` (the artifact `scripts/mint-e2e-cookie.mjs`
// writes; `/critique` Step 0 runs the mint right before the walk).
// The cache fallback is the seam that lets the cloud authed pass
// work without `.env` being sourced into the runner shell. A
// missing, garbage, or stale pair emits a single `auth-failed`
// finding and walks NOTHING — no silent fallback to anonymous
// (reader.md Step 0 hard rule 1).

import { createRequire } from 'node:module'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')

export const VIEWPORTS = {
  desktop: { width: 1280, height: 800 },
  mobile: { width: 375, height: 800 },
}

export const SESSION_COOKIE_NAME = '__session'

// After the `load` event the page's client islands are still
// hydrating. The header auth-state island (HeaderView) fetches
// /api/auth/me on mount and only then re-renders the chrome
// between signed-out and signed-in; the season comment composer
// hydrates the same way. Capturing innerText at `load` (the
// pre-2026-05-22 behavior) read the SSR DOM and produced
// false-positive auth-state findings — see settleForHydration.
// SETTLE_TIMEOUT caps how long each post-load settle wait blocks
// before the walk proceeds with whatever has rendered.
export const SETTLE_TIMEOUT = 8000

// Build the cookie array handed to `context.addCookies()`.
//   anonymous           → []                       (no session)
//   authenticated + ok  → [ one __session cookie ]
//   authenticated + bad → null                     (signals auth-failed)
// `sessionPair` is the full `__session=<value>` string, exactly
// the shape of $CRITIQUE_SESSION_COOKIE.
export function buildSessionCookies(mode, sessionPair, baseUrl) {
  if (mode === 'anonymous') return []
  if (mode !== 'authenticated') {
    throw new Error(`unknown mode: ${mode}`)
  }
  if (typeof sessionPair !== 'string' || !sessionPair.includes('=')) {
    return null
  }
  const eq = sessionPair.indexOf('=')
  const name = sessionPair.slice(0, eq).trim()
  const value = sessionPair.slice(eq + 1).trim()
  if (name !== SESSION_COOKIE_NAME || value.length === 0) {
    return null
  }
  let secure = false
  try {
    secure = new URL(baseUrl).protocol === 'https:'
  } catch {
    return null
  }
  return [
    {
      name,
      value,
      url: baseUrl,
      httpOnly: true,
      secure,
      sameSite: 'Lax',
    },
  ]
}

// The artifact `scripts/mint-e2e-cookie.mjs` writes. Reading it
// here is the seam that lets the cloud authed critique pass work:
// `/critique` Step 0 runs the mint (writing this file), and the
// walk picks the cookie up without depending on `.env` being
// sourced into the runner shell.
export const COOKIE_CACHE_PATH = resolve(REPO_ROOT, '.cache/e2e-cookie.json')

// Mirror of mint-e2e-cookie.mjs's REFRESH_WINDOW_MS — a cache
// within 5 min of expiry is treated as absent so a stale cookie
// never produces a silently-signed-out (and false-finding) walk.
const COOKIE_REFRESH_WINDOW_MS = 5 * 60_000

function readCookieCache(path) {
  try {
    if (!existsSync(path)) return null
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return null
  }
}

// Mirrors mint-e2e-cookie.mjs#isFresh. Kept local rather than
// imported so critique-walk pulls neither that module's jose/hkdf
// deps nor its top-level loadDotenv() side effect.
function cookieCacheFresh(cached, now) {
  if (
    !cached ||
    typeof cached.cookieName !== 'string' ||
    typeof cached.cookieValue !== 'string' ||
    cached.cookieName.length === 0 ||
    cached.cookieValue.length === 0 ||
    !cached.expiresAt
  ) {
    return false
  }
  const exp = Date.parse(cached.expiresAt)
  if (Number.isNaN(exp)) return false
  return exp - now > COOKIE_REFRESH_WINDOW_MS
}

// Resolve the authenticated-pass `__session` pair, in precedence:
//   1. cliCookie  — an explicit `--cookie '__session=...'`
//   2. envCookie  — $CRITIQUE_SESSION_COOKIE, when exported
//   3. cache      — `.cache/e2e-cookie.json`, the mint artifact
// A non-empty cliCookie or envCookie is used verbatim (even if
// malformed — buildSessionCookies then rejects it, so a caller
// who passed one gets a clear `auth-failed` rather than a
// surprising cache fallback). Returns '' when nothing usable
// exists; a stale cache counts as absent.
export function resolveSessionPair({
  cliCookie,
  envCookie,
  cachePath = COOKIE_CACHE_PATH,
  now = Date.now(),
} = {}) {
  if (typeof cliCookie === 'string' && cliCookie.length > 0) return cliCookie
  if (typeof envCookie === 'string' && envCookie.length > 0) return envCookie
  const cached = readCookieCache(cachePath)
  if (cached && cookieCacheFresh(cached, now)) {
    return `${cached.cookieName}=${cached.cookieValue}`
  }
  return ''
}

function finding(capture, category, severity, observation, evidence, suggestedFix) {
  return {
    url: capture.url,
    viewport: capture.viewport,
    auth_state: capture.authState,
    category,
    severity,
    observation,
    evidence,
    suggested_fix: suggestedFix,
    source: 'browser',
  }
}

// Derive the mechanically-detectable findings from one capture.
// Qualitative findings (comprehension / voice / navigation) are
// the reader agent's job from `capture.text`; this only flags
// hard, citable defects. A malformed/errored capture yields a
// finding, never a throw.
export function analyzeCapture(capture) {
  if (!capture || typeof capture !== 'object') {
    return [
      {
        url: '(unknown)',
        viewport: '(unknown)',
        auth_state: 'auth-failed',
        category: 'infra',
        severity: 'high',
        observation: 'walk produced no capture for a URL',
        evidence: String(capture),
        suggested_fix: 'inspect critique-walk.mjs navigation for this URL',
        source: 'browser',
      },
    ]
  }

  const out = []

  if (capture.error) {
    out.push(
      finding(
        capture,
        'infra',
        'high',
        'page failed to load',
        String(capture.error),
        'investigate the route — navigation threw or timed out',
      ),
    )
    return out
  }

  if (typeof capture.status === 'number' && capture.status >= 400) {
    out.push(
      finding(
        capture,
        'infra',
        'high',
        `page returned HTTP ${capture.status}`,
        `status ${capture.status} at ${capture.url}`,
        'fix the route or remove it from the critique set',
      ),
    )
  }

  if (typeof capture.bodyTextLength === 'number' && capture.bodyTextLength < 50) {
    out.push(
      finding(
        capture,
        'infra',
        'high',
        'page rendered blank or near-empty',
        `body text length ${capture.bodyTextLength}`,
        'check SSR/hydration — the page has no readable content',
      ),
    )
  }

  if (capture.hasH1 === false) {
    out.push(
      finding(
        capture,
        'a11y',
        'medium',
        'page has no <h1>',
        'no level-1 heading found in the rendered DOM',
        'add a single descriptive <h1> to the page',
      ),
    )
  }

  if (
    capture.viewport === 'mobile' &&
    typeof capture.scrollWidth === 'number' &&
    typeof capture.innerWidth === 'number' &&
    capture.scrollWidth - capture.innerWidth > 1
  ) {
    out.push(
      finding(
        capture,
        'mobile',
        'high',
        'horizontal scroll at 375px',
        `scrollWidth ${capture.scrollWidth} > innerWidth ${capture.innerWidth}`,
        'find the overflowing element and constrain it to the viewport',
      ),
    )
  }

  if (Array.isArray(capture.consoleErrors) && capture.consoleErrors.length > 0) {
    out.push(
      finding(
        capture,
        'performance',
        'medium',
        `${capture.consoleErrors.length} console error(s)`,
        capture.consoleErrors[0],
        'resolve the JS console error',
      ),
    )
  }

  if (Array.isArray(capture.failedRequests) && capture.failedRequests.length > 0) {
    out.push(
      finding(
        capture,
        'performance',
        'medium',
        `${capture.failedRequests.length} failed first-party request(s)`,
        capture.failedRequests[0],
        'fix the broken asset/endpoint or stop requesting it',
      ),
    )
  }

  if (capture.viewport === 'desktop') {
    if (!capture.title) {
      out.push(
        finding(
          capture,
          'seo',
          'medium',
          'missing <title>',
          'no document title in <head>',
          'add a descriptive <title> via generateMetadata',
        ),
      )
    }
    if (!capture.description) {
      out.push(
        finding(
          capture,
          'seo',
          'medium',
          'missing meta description',
          'no <meta name="description"> in <head>',
          'add a meta description via generateMetadata',
        ),
      )
    }
    if (!capture.canonical) {
      out.push(
        finding(
          capture,
          'seo',
          'medium',
          'missing canonical link',
          'no <link rel="canonical"> in <head>',
          'emit a canonical URL via the seo helper',
        ),
      )
    }
    if (!capture.ogImage) {
      out.push(
        finding(
          capture,
          'seo',
          'low',
          'missing og:image',
          'no <meta property="og:image"> in <head>',
          'wire the per-route opengraph-image',
        ),
      )
    }
  }

  return out
}

function parseArgs(argv) {
  const args = {}
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i]
    if (a.startsWith('--')) {
      const key = a.slice(2)
      const next = argv[i + 1]
      if (next === undefined || next.startsWith('--')) {
        args[key] = true
      } else {
        args[key] = next
        i += 1
      }
    }
  }
  return args
}

function sameOrigin(reqUrl, baseUrl) {
  try {
    return new URL(reqUrl).origin === new URL(baseUrl).origin
  } catch {
    return false
  }
}

// The header auth-state island fetches exactly this endpoint on
// mount; its response is what flips the captured chrome between
// signed-out and signed-in. settleForHydration waits on it.
export function isAuthMeRequest(url) {
  try {
    return new URL(url).pathname === '/api/auth/me'
  } catch {
    return false
  }
}

// Block until the page's client islands have settled, so the
// capture reflects the hydrated DOM rather than the SSR output.
// `authResponse` is the (pre-armed, pre-caught) /api/auth/me
// response promise; awaiting it pins the one request whose result
// changes the chrome. The networkidle wait then gives the island
// re-render — and any other island — a bounded window to flush.
// Both waits are best-effort: a slow page or a chatty third-party
// beacon must delay the capture, never fail it.
export async function settleForHydration(page, authResponse, settleTimeout) {
  try {
    await authResponse
  } catch {
    /* auth fetch never fired or errored — proceed with what loaded */
  }
  try {
    await page.waitForLoadState('networkidle', { timeout: settleTimeout })
  } catch {
    /* network never fell idle within the budget — proceed anyway */
  }
}

async function walk({
  chromium,
  base,
  mode,
  authState,
  cookies,
  urls,
  timeout,
  settleTimeout,
}) {
  const captures = []
  const browser = await chromium.launch({ headless: true })
  try {
    for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
      const context = await browser.newContext({ viewport: vp })
      if (cookies.length > 0) {
        await context.addCookies(cookies)
      }
      for (const path of urls) {
        const page = await context.newPage()
        const consoleErrors = []
        const failedRequests = []
        page.on('console', (msg) => {
          if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 300))
        })
        page.on('requestfailed', (req) => {
          if (sameOrigin(req.url(), base)) {
            failedRequests.push(`${req.url()} — ${req.failure()?.errorText ?? 'failed'}`)
          }
        })
        page.on('response', (res) => {
          if (res.status() >= 400 && sameOrigin(res.url(), base)) {
            failedRequests.push(`${res.url()} — HTTP ${res.status()}`)
          }
        })
        const target = new URL(path, base).href
        const capture = { url: path, viewport: vpName, authState }
        try {
          // Arm the auth-island wait BEFORE navigating so the
          // response can't resolve in the gap between goto
          // returning and the listener attaching. Pre-catch it so
          // a timeout can't surface as an unhandled rejection
          // while goto is still in flight.
          const authResponse = page
            .waitForResponse((res) => isAuthMeRequest(res.url()), {
              timeout: settleTimeout,
            })
            .catch(() => null)
          const resp = await page.goto(target, { waitUntil: 'load', timeout })
          capture.status = resp ? resp.status() : null
          await settleForHydration(page, authResponse, settleTimeout)
          const meta = await page.evaluate(() => {
            const m = (sel) =>
              document.querySelector(sel)?.getAttribute('content') ?? null
            return {
              title: document.title || null,
              description: m('meta[name="description"]'),
              canonical:
                document.querySelector('link[rel="canonical"]')?.getAttribute('href') ??
                null,
              ogImage: m('meta[property="og:image"]'),
              hasH1: !!document.querySelector('h1'),
              bodyTextLength: (document.body?.innerText ?? '').trim().length,
              text: (document.body?.innerText ?? '').trim().slice(0, 4000),
              scrollWidth: document.documentElement.scrollWidth,
              innerWidth: window.innerWidth,
            }
          })
          Object.assign(capture, meta)
        } catch (err) {
          capture.error = err instanceof Error ? err.message : String(err)
        }
        capture.consoleErrors = consoleErrors
        capture.failedRequests = failedRequests
        captures.push(capture)
        await page.close()
      }
      await context.close()
    }
  } finally {
    await browser.close()
  }
  return captures
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const mode = args.mode === 'authenticated' ? 'authenticated' : 'anonymous'
  const base = (args.base || 'https://tiered.tv').replace(/\/$/, '')
  const urls = String(args.urls || '/')
    .split(',')
    .map((u) => u.trim())
    .filter(Boolean)
  const timeout = Number(args.timeout || 20000)
  const settleTimeout = Number(args['settle-timeout'] || SETTLE_TIMEOUT)
  const sessionPair = resolveSessionPair({
    cliCookie: args.cookie,
    envCookie: process.env.CRITIQUE_SESSION_COOKIE,
  })
  const authState = mode === 'anonymous' ? 'anonymous' : 'authenticated:cloud'

  const cookies = buildSessionCookies(mode, sessionPair, base)

  const emit = (payload) => {
    const json = JSON.stringify(payload, null, 2)
    if (args.out) {
      writeFileSync(resolve(REPO_ROOT, String(args.out)), json)
    } else {
      process.stdout.write(`${json}\n`)
    }
  }

  if (cookies === null) {
    // Authed handshake unusable. One auth-failed finding, no walk.
    emit({
      meta: { base, mode, authState: 'auth-failed', generatedAt: new Date().toISOString(), urlCount: 0 },
      captures: [],
      findings: [
        {
          url: '(pass)',
          viewport: 'n/a',
          auth_state: 'auth-failed',
          category: 'infra',
          severity: 'high',
          observation:
            'authenticated critique pass requested but no valid __session cookie was provided',
          evidence:
            '--cookie, $CRITIQUE_SESSION_COOKIE, and the .cache/e2e-cookie.json mint artifact are all missing, stale, or not a __session pair',
          suggested_fix: 'refresh the cookie via scripts/mint-e2e-cookie.mjs and retry',
          source: 'browser',
        },
      ],
    })
    return
  }

  const require = createRequire(resolve(REPO_ROOT, 'apps/e2e/package.json'))
  const { chromium } = require('@playwright/test')

  const captures = await walk({
    chromium,
    base,
    mode,
    authState,
    cookies,
    urls,
    timeout,
    settleTimeout,
  })
  const findings = captures.flatMap(analyzeCapture)

  emit({
    meta: {
      base,
      mode,
      authState,
      generatedAt: new Date().toISOString(),
      urlCount: urls.length,
    },
    captures,
    findings,
  })
}

const invokedDirectly =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href

if (invokedDirectly) {
  main().catch((err) => {
    process.stderr.write(`critique-walk: ${err?.stack || err}\n`)
    process.exitCode = 1
  })
}
