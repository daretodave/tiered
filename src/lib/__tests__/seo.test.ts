import { describe, expect, it } from 'vitest'
import {
  buildJsonLd,
  buildMetadata,
  canonicalUrl,
  clipToSeoBudget,
  jsonLdScriptProps,
  siteConfig,
} from '../seo'

const BASE = 'https://tiered.tv'

describe('clipToSeoBudget', () => {
  it('returns short text verbatim', () => {
    expect(clipToSeoBudget('A short line.')).toBe('A short line.')
  })

  it('cuts at a full sentence boundary when one falls late enough in the budget', () => {
    // critique pass 62/67: masterchef-australia's real lede — the raw
    // word-boundary cut used to land mid-clause ("…appears as a…").
    // An em dash sits closer to the budget edge than the first
    // sentence's period, so the clause-boundary path wins here.
    const lede =
      'Season four is the founding era at its highest point. The home cook bench is the deepest the format has assembled — and Heston Blumenthal appears as a judge for the finale.'
    expect(clipToSeoBudget(lede)).toBe(
      'Season four is the founding era at its highest point. The home cook bench is the deepest the format has assembled…',
    )
  })

  it('cuts at the nearest clause boundary (comma/semicolon/colon/em dash) over a raw word cut', () => {
    // critique pass 67: the-apprentice's real lede — old algorithm
    // produced "…and a cast still competing…"; the comma before that
    // clause reads as a complete thought instead.
    const lede =
      "The show moved production to Los Angeles and kept its business-task format intact. A different coast, a different visual register, and a cast still competing on the merits — the founding era's closing chapter."
    const result = clipToSeoBudget(lede)
    expect(result.endsWith('…')).toBe(true)
    expect(result).not.toMatch(/still competing…$/)
    expect(lede.startsWith(result.slice(0, -1))).toBe(true)
  })

  it('falls back to the last word boundary when no sentence/clause mark falls late enough', () => {
    const lede =
      'The all-star return the whole format had been building toward, twenty veterans split into two tribes purely by the way the audience already saw them coming into this particular beach season'
    const result = clipToSeoBudget(lede)
    expect(result.endsWith('…')).toBe(true)
    expect(result.length).toBeLessThanOrEqual(160)
    expect(lede.startsWith(result.slice(0, -1))).toBe(true)
  })

  it('strips trailing punctuation before the ellipsis', () => {
    const head = 'a'.repeat(140)
    const lede = `${head}, ${'b'.repeat(60)}`
    expect(clipToSeoBudget(lede)).toBe(`${head}…`)
    expect(clipToSeoBudget(lede)).not.toContain(',…')
  })
})

describe('canonicalUrl', () => {
  it('maps empty and root to base + trailing slash', () => {
    expect(canonicalUrl('')).toBe(`${BASE}/`)
    expect(canonicalUrl('/')).toBe(`${BASE}/`)
  })

  it('strips trailing slashes from non-root paths', () => {
    expect(canonicalUrl('/shows/')).toBe(`${BASE}/shows`)
    expect(canonicalUrl('/shows///')).toBe(`${BASE}/shows`)
    expect(canonicalUrl('/shows/survivor')).toBe(`${BASE}/shows/survivor`)
  })

  it('leaves an already-clean path untouched and does not duplicate the base', () => {
    expect(canonicalUrl('/shows')).toBe(`${BASE}/shows`)
  })

  it('preserves deeply nested paths', () => {
    expect(canonicalUrl('/shows/survivor/canon')).toBe(
      `${BASE}/shows/survivor/canon`,
    )
  })

  it('preserves a query string on a path that has no trailing slash', () => {
    expect(canonicalUrl('/shows?sort=alpha')).toBe(`${BASE}/shows?sort=alpha`)
  })

  it('inserts a leading slash when the path lacks one', () => {
    expect(canonicalUrl('about')).toBe(`${BASE}/about`)
  })

  it('preserves the query string and strips the path trailing slash before it', () => {
    expect(canonicalUrl('/shows/survivor/?view=community')).toBe(
      `${BASE}/shows/survivor?view=community`,
    )
  })

  it('preserves the hash fragment', () => {
    expect(canonicalUrl('/about/#faq')).toBe(`${BASE}/about#faq`)
  })

  it('preserves query and hash together with the trailing slash stripped from the path only', () => {
    expect(canonicalUrl('/shows/survivor/?view=community#top')).toBe(
      `${BASE}/shows/survivor?view=community#top`,
    )
  })

  it('does not strip a trailing slash that lives inside the query', () => {
    expect(canonicalUrl('/search?q=a/')).toBe(`${BASE}/search?q=a/`)
  })
})

describe('buildMetadata', () => {
  const base = {
    title: 'Survivor — tiered.tv',
    description: 'Every season, ranked.',
    path: '/shows/survivor',
  }

  it('sets canonical from the path and mirrors it into openGraph.url', () => {
    const m = buildMetadata(base)
    expect(m.alternates?.canonical).toBe(`${BASE}/shows/survivor`)
    expect(m.openGraph?.url).toBe(`${BASE}/shows/survivor`)
    expect(m.title).toBe(base.title)
    expect(m.description).toBe(base.description)
  })

  it('defaults the OG/Twitter image to the canonicalized default OG image', () => {
    const m = buildMetadata(base)
    const expected = `${BASE}${siteConfig.defaultOgImage}`
    expect(m.openGraph?.images).toEqual([{ url: expected }])
    expect(m.twitter?.images).toEqual([expected])
  })

  it('canonicalizes a custom image when provided', () => {
    const m = buildMetadata({ ...base, image: '/og/survivor.png' })
    expect(m.openGraph?.images).toEqual([{ url: `${BASE}/og/survivor.png` }])
    expect(m.twitter?.images).toEqual([`${BASE}/og/survivor.png`])
  })

  it('carries the static openGraph and twitter shape', () => {
    const m = buildMetadata(base)
    const og = m.openGraph as Record<string, unknown>
    const tw = m.twitter as Record<string, unknown>
    expect(og.siteName).toBe(siteConfig.name)
    expect(og.locale).toBe(siteConfig.locale)
    expect(og.type).toBe('website')
    expect(tw.card).toBe('summary_large_image')
  })

  it('omits robots unless noIndex is set', () => {
    expect(buildMetadata(base).robots).toBeUndefined()
    expect(buildMetadata({ ...base, noIndex: true }).robots).toEqual({
      index: false,
      follow: false,
    })
  })

  it('always attaches the global RSS feed even with no per-page feeds', () => {
    const m = buildMetadata(base)
    expect(m.alternates?.types?.['application/rss+xml']).toEqual([
      { url: '/feed.xml', title: 'tiered.tv — all updates' },
    ])
  })

  it('appends per-page feeds after the global feed, preserving order', () => {
    const m = buildMetadata({
      ...base,
      feeds: [{ url: '/feed/survivor.xml', title: 'Survivor updates' }],
    })
    expect(m.alternates?.types?.['application/rss+xml']).toEqual([
      { url: '/feed.xml', title: 'tiered.tv — all updates' },
      { url: '/feed/survivor.xml', title: 'Survivor updates' },
    ])
  })
})

describe('buildJsonLd', () => {
  it('builds a CollectionPage', () => {
    expect(
      buildJsonLd({
        type: 'CollectionPage',
        name: 'Shows',
        description: 'Every show, tiered.',
        path: '/shows',
      }),
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Shows',
      description: 'Every show, tiered.',
      url: `${BASE}/shows`,
    })
  })

  it('builds an ItemList with conditional description/author/dateModified and url precedence', () => {
    const jsonLd = buildJsonLd({
      type: 'ItemList',
      name: 'Best premieres',
      path: '/themes/best-premieres',
      author: 'The tiered.tv desk',
      dateModified: '2026-05-01',
      items: [
        { position: 1, name: 'Borneo', path: '/shows/survivor/season/borneo' },
        {
          position: 2,
          name: 'Heroes vs. Villains',
          url: 'https://example.com/hvv',
          description: 'A direct url wins over path.',
        },
        { position: 3, name: 'No link entry' },
      ],
    })
    expect(jsonLd).toMatchObject({
      '@type': 'ItemList',
      name: 'Best premieres',
      url: `${BASE}/themes/best-premieres`,
      author: { '@type': 'Person', name: 'The tiered.tv desk' },
      dateModified: '2026-05-01',
    })
    const els = jsonLd.itemListElement as Array<Record<string, unknown>>
    expect(els[0]).toEqual({
      '@type': 'ListItem',
      position: 1,
      name: 'Borneo',
      url: `${BASE}/shows/survivor/season/borneo`,
    })
    expect(els[1]).toEqual({
      '@type': 'ListItem',
      position: 2,
      name: 'Heroes vs. Villains',
      url: 'https://example.com/hvv',
      description: 'A direct url wins over path.',
    })
    expect(els[2]).toEqual({
      '@type': 'ListItem',
      position: 3,
      name: 'No link entry',
    })
  })

  it('omits ItemList description/author/dateModified when absent', () => {
    const jsonLd = buildJsonLd({
      type: 'ItemList',
      name: 'Minimal',
      path: '/themes/minimal',
      items: [],
    })
    expect(jsonLd).not.toHaveProperty('description')
    expect(jsonLd).not.toHaveProperty('author')
    expect(jsonLd).not.toHaveProperty('dateModified')
    expect(jsonLd.itemListElement).toEqual([])
  })

  it('builds an Article with conditional dates/author/image', () => {
    expect(
      buildJsonLd({
        type: 'Article',
        headline: 'The take',
        description: 'A spoiler-safe read.',
        path: '/shows/survivor/season/borneo',
        datePublished: '2026-01-01',
        author: 'Desk',
        image: '/og/borneo.png',
      }),
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'The take',
      description: 'A spoiler-safe read.',
      url: `${BASE}/shows/survivor/season/borneo`,
      datePublished: '2026-01-01',
      author: { '@type': 'Person', name: 'Desk' },
      image: `${BASE}/og/borneo.png`,
    })
  })

  it('omits Article optionals when absent', () => {
    const jsonLd = buildJsonLd({
      type: 'Article',
      headline: 'Bare',
      description: 'Nothing optional.',
      path: '/x',
    })
    expect(jsonLd).not.toHaveProperty('datePublished')
    expect(jsonLd).not.toHaveProperty('dateModified')
    expect(jsonLd).not.toHaveProperty('author')
    expect(jsonLd).not.toHaveProperty('image')
  })

  it('builds a BreadcrumbList with 1-based positions and canonicalized items', () => {
    const jsonLd = buildJsonLd({
      type: 'BreadcrumbList',
      trail: [
        { name: 'Home', path: '/' },
        { name: 'Shows', path: '/shows' },
        { name: 'Survivor', path: '/shows/survivor' },
      ],
    })
    expect(jsonLd.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
      { '@type': 'ListItem', position: 2, name: 'Shows', item: `${BASE}/shows` },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Survivor',
        item: `${BASE}/shows/survivor`,
      },
    ])
  })

  it('builds a FAQPage with Question/Answer nodes', () => {
    expect(
      buildJsonLd({
        type: 'FAQPage',
        path: '/about',
        faqs: [{ question: 'Spoilers?', answer: 'Never.' }],
      }),
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      url: `${BASE}/about`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Spoilers?',
          acceptedAnswer: { '@type': 'Answer', text: 'Never.' },
        },
      ],
    })
  })

  // Root-surface handshake. The home page is the only place this
  // type ships; the negative pin against `potentialAction` guards
  // the documented decision to NOT declare a SearchAction (no
  // `/search` route exists in the product).
  it('builds a WebSite with name/description/canonical url', () => {
    const jsonLd = buildJsonLd({
      type: 'WebSite',
      name: 'tiered.tv',
      description: 'the seasons, ranked. no spoilers.',
      path: '/',
    })
    expect(jsonLd).toEqual({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'tiered.tv',
      description: 'the seasons, ranked. no spoilers.',
      url: `${BASE}/`,
    })
    expect(jsonLd).not.toHaveProperty('potentialAction')
  })
})

describe('jsonLdScriptProps', () => {
  it('serializes data into a typed ld+json script payload', () => {
    const data = { '@type': 'Thing', name: 'x' }
    const props = jsonLdScriptProps({ id: 'ld-thing', data })
    expect(props.id).toBe('ld-thing')
    expect(props.type).toBe('application/ld+json')
    expect(props.dangerouslySetInnerHTML.__html).toBe(JSON.stringify(data))
  })
})
