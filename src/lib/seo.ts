import type { Metadata } from 'next'

export const siteConfig = {
  name: 'tiered.tv',
  promise: 'the seasons, ranked. no spoilers.',
  baseUrl: 'https://tiered.tv',
  defaultOgImage: '/opengraph-image',
  locale: 'en',
  twitterHandle: undefined as string | undefined,
} as const

// Google's SERP snippet clips around 155–160 chars. When source copy
// runs long, prefer cutting at a full sentence end, then a clause
// boundary (comma/semicolon/colon/em dash), before falling back to
// the last word boundary — so a truncated snippet reads as a
// complete thought instead of stopping mid-clause (critique pass 62/67:
// "…and Heston Blumenthal appears as a…" read as an arbitrary word-cut).
// A candidate cut only qualifies if it retains at least 60% of the
// budget — otherwise an early period/comma would produce a snippet
// too short to be useful, and the word-boundary fallback (whole words,
// no premature stop) takes over instead.
export function clipToSeoBudget(text: string, budget = 159): string {
  if (text.length <= budget + 1) return text
  const window = text.slice(0, budget)
  const minCut = Math.floor(budget * 0.6)

  const sentenceEnd = Math.max(
    window.lastIndexOf('. '),
    window.lastIndexOf('! '),
    window.lastIndexOf('? '),
  )
  if (sentenceEnd >= minCut) return text.slice(0, sentenceEnd + 1)

  let clauseEnd = -1
  for (const mark of [',', ';', ':', '—']) {
    clauseEnd = Math.max(clauseEnd, window.lastIndexOf(mark))
  }
  if (clauseEnd >= minCut) {
    return `${window.slice(0, clauseEnd).replace(/[\s,;:—-]+$/, '')}…`
  }

  const lastSpace = window.lastIndexOf(' ')
  const cut = lastSpace > 0 ? lastSpace : budget
  return `${window.slice(0, cut).replace(/[\s,;:—-]+$/, '')}…`
}

export function canonicalUrl(path: string): string {
  const base = siteConfig.baseUrl.replace(/\/+$/, '')
  if (!path || path === '/') return `${base}/`

  let p = path
  const hashIx = p.indexOf('#')
  const hash = hashIx >= 0 ? p.slice(hashIx) : ''
  if (hashIx >= 0) p = p.slice(0, hashIx)

  const queryIx = p.indexOf('?')
  const query = queryIx >= 0 ? p.slice(queryIx) : ''
  if (queryIx >= 0) p = p.slice(0, queryIx)

  if (!p.startsWith('/')) p = `/${p}`
  if (p.length > 1) p = p.replace(/\/+$/, '')

  return `${base}${p}${query}${hash}`
}

type BuildMetadataArgs = {
  title: string
  description: string
  path: string
  image?: string
  noIndex?: boolean
  // Phase 32: RSS auto-discovery. Each entry becomes a
  // <link rel="alternate" type="application/rss+xml">. The global
  // feed is always attached (see GLOBAL_FEED below — a page's
  // metadata replaces, not merges, the root layout's `alternates`,
  // so the global feed has to be re-emitted here); per-show pages
  // pass their own feed in addition.
  feeds?: { url: string; title: string }[]
}

const GLOBAL_FEED = {
  url: '/feed.xml',
  title: 'tiered.tv — all updates',
} as const

export function buildMetadata({
  title,
  description,
  path,
  image,
  noIndex,
  feeds,
}: BuildMetadataArgs): Metadata {
  const canonical = canonicalUrl(path)
  const ogImage = image
    ? canonicalUrl(image)
    : canonicalUrl(siteConfig.defaultOgImage)

  return {
    title,
    description,
    alternates: {
      canonical,
      types: {
        'application/rss+xml': [GLOBAL_FEED, ...(feeds ?? [])].map((f) => ({
          url: f.url,
          title: f.title,
        })),
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: 'website',
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  }
}

type BreadcrumbItem = { name: string; path: string }

type ItemListEntry = {
  position: number
  name: string
  path?: string
  url?: string
  description?: string
}

type CollectionPageArgs = {
  name: string
  description: string
  path: string
}

type ItemListArgs = {
  name: string
  description?: string
  path: string
  items: ItemListEntry[]
  author?: string
  dateModified?: string
}

type ArticleArgs = {
  headline: string
  description: string
  path: string
  datePublished?: string
  dateModified?: string
  author?: string
  image?: string
}

type BreadcrumbListArgs = {
  trail: BreadcrumbItem[]
}

type FAQItem = {
  question: string
  answer: string
}

type FAQPageArgs = {
  path: string
  faqs: FAQItem[]
}

// WebSite is the root-surface handshake — declared once on `/` so
// crawlers can attach brand metadata to the domain (name, alternate
// names, description) rather than inferring it from OG tags. No
// `potentialAction` SearchAction: tiered.tv has no `/search` route
// (the header's SearchTrigger replaced a legacy `/search` link); a
// SearchAction whose urlTemplate 404s would mislead crawlers.
type WebSiteArgs = {
  name: string
  description: string
  path: string
}

export function buildJsonLd(
  args:
    | ({ type: 'CollectionPage' } & CollectionPageArgs)
    | ({ type: 'ItemList' } & ItemListArgs)
    | ({ type: 'Article' } & ArticleArgs)
    | ({ type: 'BreadcrumbList' } & BreadcrumbListArgs)
    | ({ type: 'FAQPage' } & FAQPageArgs)
    | ({ type: 'WebSite' } & WebSiteArgs),
): Record<string, unknown> {
  if (args.type === 'CollectionPage') {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: args.name,
      description: args.description,
      url: canonicalUrl(args.path),
    }
  }
  if (args.type === 'ItemList') {
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: args.name,
      ...(args.description ? { description: args.description } : {}),
      url: canonicalUrl(args.path),
      ...(args.author
        ? { author: { '@type': 'Person', name: args.author } }
        : {}),
      ...(args.dateModified ? { dateModified: args.dateModified } : {}),
      itemListElement: args.items.map((entry) => ({
        '@type': 'ListItem',
        position: entry.position,
        name: entry.name,
        ...(entry.url
          ? { url: entry.url }
          : entry.path
            ? { url: canonicalUrl(entry.path) }
            : {}),
        ...(entry.description ? { description: entry.description } : {}),
      })),
    }
  }
  if (args.type === 'Article') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: args.headline,
      description: args.description,
      url: canonicalUrl(args.path),
      ...(args.datePublished ? { datePublished: args.datePublished } : {}),
      ...(args.dateModified ? { dateModified: args.dateModified } : {}),
      ...(args.author
        ? { author: { '@type': 'Person', name: args.author } }
        : {}),
      ...(args.image ? { image: canonicalUrl(args.image) } : {}),
    }
  }
  if (args.type === 'BreadcrumbList') {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: args.trail.map((item, ix) => ({
        '@type': 'ListItem',
        position: ix + 1,
        name: item.name,
        item: canonicalUrl(item.path),
      })),
    }
  }
  if (args.type === 'WebSite') {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: args.name,
      description: args.description,
      url: canonicalUrl(args.path),
    }
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    url: canonicalUrl(args.path),
    mainEntity: args.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

type JsonLdScriptProps = {
  id: string
  data: Record<string, unknown>
}

export function jsonLdScriptProps({ id, data }: JsonLdScriptProps): {
  id: string
  type: 'application/ld+json'
  dangerouslySetInnerHTML: { __html: string }
} {
  return {
    id,
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  }
}
