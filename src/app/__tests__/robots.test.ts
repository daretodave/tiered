import { describe, expect, it } from 'vitest'

// app/robots.ts is the Next.js MetadataRoute.Robots producer that
// every search engine reads at /robots.txt. It is the single
// declarative surface that tells crawlers what they may and may not
// index across tiered.tv — the disallow list is the only guard
// against indexing the mod queue (`/mod`), the Auth0 sign-in flow
// (`/sign-in`), and the API surface (`/api/`). It also declares the
// sitemap URL (canonicalized to absolute) and the canonical host
// (bare baseUrl — NOT canonicalized; the two have different shapes).
//
// `@/lib/seo` is left real so a regression in `canonicalUrl`'s
// trailing-slash discipline or `siteConfig.baseUrl` surfaces here,
// not just in the helper's own test.
import { canonicalUrl, siteConfig } from '@/lib/seo'
import robots from '../robots'

describe('app/robots — top-level shape', () => {
  it('returns an object with exactly { rules, sitemap, host }', () => {
    expect(Object.keys(robots()).sort()).toEqual(['host', 'rules', 'sitemap'])
  })

  it('emits exactly one rule entry — a single-rule config so every crawler reads the same allow/disallow set', () => {
    expect(robots().rules).toHaveLength(1)
  })

  it('is pure — repeated calls return the same shape (no per-call mutation)', () => {
    expect(robots()).toEqual(robots())
  })
})

describe('app/robots — rule entry', () => {
  it('targets all user agents with userAgent: "*"', () => {
    const [rule] = robots().rules as Array<{ userAgent: string }>
    expect(rule?.userAgent).toBe('*')
  })

  it('allows the root path with allow: "/"', () => {
    const [rule] = robots().rules as Array<{ allow: string }>
    expect(rule?.allow).toBe('/')
  })

  it('exposes exactly { userAgent, allow, disallow } on the rule — no extra keys, none missing', () => {
    const [rule] = robots().rules as Array<Record<string, unknown>>
    expect(rule ? Object.keys(rule).sort() : []).toEqual([
      'allow',
      'disallow',
      'userAgent',
    ])
  })
})

describe('app/robots — disallow list', () => {
  it('blocks crawlers from /api/, /mod, and /sign-in in that exact order', () => {
    const [rule] = robots().rules as Array<{ disallow: string[] }>
    expect(rule?.disallow).toEqual(['/api/', '/mod', '/sign-in'])
  })

  it('keeps the trailing slash on /api/ — load-bearing: "/api" alone would block /apiary, /api-docs, and any future /api-prefixed page', () => {
    const [rule] = robots().rules as Array<{ disallow: string[] }>
    expect(rule?.disallow).toContain('/api/')
    expect(rule?.disallow).not.toContain('/api')
  })

  it('blocks /mod — the moderator queue must never be indexed (PII risk: pending comments expose author handles + flagged content)', () => {
    const [rule] = robots().rules as Array<{ disallow: string[] }>
    expect(rule?.disallow).toContain('/mod')
  })

  it('blocks /sign-in — the Auth0 sign-in flow is a no-content redirect surface; indexing it has zero value and creates duplicate-content noise', () => {
    const [rule] = robots().rules as Array<{ disallow: string[] }>
    expect(rule?.disallow).toContain('/sign-in')
  })

  it('does not over-block — neither /shows nor /themes nor / appears in the disallow list', () => {
    const [rule] = robots().rules as Array<{ disallow: string[] }>
    for (const path of ['/shows', '/themes', '/', '/about']) {
      expect(rule?.disallow).not.toContain(path)
    }
  })
})

describe('app/robots — sitemap pointer', () => {
  it('declares the sitemap at the canonical absolute URL', () => {
    expect(robots().sitemap).toBe('https://tiered.tv/sitemap.xml')
  })

  it('wraps the sitemap path through canonicalUrl — a regression that returned the raw path would emit a relative URL crawlers cannot follow', () => {
    // The route writes `canonicalUrl('/sitemap.xml')`; assert the
    // output matches the helper's actual production wrapping rather
    // than a hardcoded string, so a regression in canonicalUrl
    // surfaces here too.
    expect(robots().sitemap).toBe(canonicalUrl('/sitemap.xml'))
  })

  it('emits the sitemap URL as a string (Next.js MetadataRoute.Robots schema rejects arrays / objects here)', () => {
    expect(typeof robots().sitemap).toBe('string')
  })
})

describe('app/robots — host directive', () => {
  it('declares the canonical host as the bare baseUrl', () => {
    expect(robots().host).toBe('https://tiered.tv')
  })

  it('sources host from siteConfig.baseUrl directly — pins the constant against drift in a single place', () => {
    expect(robots().host).toBe(siteConfig.baseUrl)
  })

  it('does NOT canonicalize host — canonicalUrl("") would append a trailing slash, breaking Yandex\'s strict Host: directive parser', () => {
    // host and sitemap have different shapes on purpose: sitemap is
    // a URL (canonicalUrl-wrapped, ends with the path), host is the
    // origin (no trailing slash). A regression that ran canonicalUrl
    // on the host would emit "https://tiered.tv/" — visually
    // similar but spec-different.
    expect(robots().host).not.toMatch(/\/$/)
    expect(robots().host).not.toBe(canonicalUrl('/'))
  })
})
