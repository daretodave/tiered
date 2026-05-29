import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// /privacy is a public, footer-linked, indexable legal page that
// renders markdown from content/legal/privacy.md. It is a near-exact
// twin of /terms — that twinning is the precise hazard a unit test
// guards: a copy-paste regression between the two siblings (the wrong
// getLegalDoc(...) slug, the wrong fallback string) would silently
// render Terms content at /privacy or vice versa, and a hermetic e2e
// walk that reads the rendered page against real content cannot tell
// the two doc bodies apart, nor does it exercise the missing-doc
// branches (the content file is always present in the walk).
//
// The content boundary (`@/content.getLegalDoc`) + the navigation
// boundary (`next/navigation.notFound`) are mocked via vi.hoisted +
// vi.mock so the doc-present / doc-absent branches are driven
// deterministically. `@/components/prose/Prose` is mocked to a stub
// that surfaces its `source` prop so the test can pin that the page
// hands the doc body (not, say, the description) to the renderer.
// `@/lib/seo.buildMetadata` is left **real** so a regression in the
// canonical slug or in canonicalUrl's trailing-slash discipline
// surfaces here, not just in the helper's own test.

const { getLegalDocMock, notFoundMock } = vi.hoisted(() => ({
  getLegalDocMock: vi.fn(),
  notFoundMock: vi.fn((): never => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

vi.mock('@/content', () => ({
  getLegalDoc: getLegalDocMock,
}))
vi.mock('next/navigation', () => ({
  notFound: notFoundMock,
}))
vi.mock('@/components/prose/Prose', () => ({
  Prose: ({ source }: { source: string }) => (
    <div data-testid="prose" data-source={source} />
  ),
}))

import PrivacyPage, { dynamic, generateMetadata } from '../page'

const DOC = {
  title: 'Privacy Policy',
  description: 'How tiered.tv handles your data.',
  body_md: '# Privacy\n\nWe keep your data to ourselves.',
}

beforeEach(() => {
  getLegalDocMock.mockReset()
  notFoundMock.mockClear()
})

// --------------------------------------------------------------------
// Segment config
// --------------------------------------------------------------------

describe('/privacy segment config', () => {
  it("exports dynamic = 'force-static' — the legal doc is build-time content; SSRing it on every request would be needless work for a never-changing page", () => {
    expect(dynamic).toBe('force-static')
  })
})

// --------------------------------------------------------------------
// generateMetadata — doc present
// --------------------------------------------------------------------

describe('/privacy generateMetadata — doc present', () => {
  it("resolves the doc via getLegalDoc('privacy') — NOT 'terms' or 'about' (guards the sibling copy-paste hazard)", () => {
    getLegalDocMock.mockReturnValue(DOC)
    generateMetadata()
    expect(getLegalDocMock).toHaveBeenCalledWith('privacy')
  })

  it("title comes from doc.title", () => {
    getLegalDocMock.mockReturnValue(DOC)
    expect(generateMetadata().title).toBe('Privacy Policy')
  })

  it('description comes from doc.description when present', () => {
    getLegalDocMock.mockReturnValue(DOC)
    expect(generateMetadata().description).toBe('How tiered.tv handles your data.')
  })

  it("description falls back to 'Privacy policy.' when doc.description is absent", () => {
    getLegalDocMock.mockReturnValue({ title: 'Privacy Policy', body_md: '# x' })
    expect(generateMetadata().description).toBe('Privacy policy.')
  })

  it('canonical URL points at /privacy absolute against siteConfig.baseUrl (real buildMetadata)', () => {
    // Flows through real buildMetadata + canonicalUrl, so a regression
    // in either layer (a trailing slash, a wrong slug) surfaces here.
    getLegalDocMock.mockReturnValue(DOC)
    expect(generateMetadata().alternates?.canonical).toBe('https://tiered.tv/privacy')
  })
})

// --------------------------------------------------------------------
// generateMetadata — doc absent (content/legal/privacy.md missing)
// --------------------------------------------------------------------

describe('/privacy generateMetadata — doc absent fallback', () => {
  it("returns a valid Metadata with title 'Privacy' when getLegalDoc returns null — the build does not crash on a renamed/removed content file", () => {
    getLegalDocMock.mockReturnValue(null)
    expect(generateMetadata().title).toBe('Privacy')
  })

  it("fallback description is 'Privacy policy.'", () => {
    getLegalDocMock.mockReturnValue(null)
    expect(generateMetadata().description).toBe('Privacy policy.')
  })

  it('fallback canonical still points at /privacy', () => {
    getLegalDocMock.mockReturnValue(null)
    expect(generateMetadata().alternates?.canonical).toBe('https://tiered.tv/privacy')
  })
})

// --------------------------------------------------------------------
// PrivacyPage default export — doc present
// --------------------------------------------------------------------

describe('PrivacyPage — doc present', () => {
  it("resolves the doc via getLegalDoc('privacy')", () => {
    getLegalDocMock.mockReturnValue(DOC)
    render(PrivacyPage())
    expect(getLegalDocMock).toHaveBeenCalledWith('privacy')
  })

  it('renders the markdown body through <Prose source={doc.body_md}> — the doc body, not the title or description', () => {
    getLegalDocMock.mockReturnValue(DOC)
    render(PrivacyPage())
    const prose = screen.getByTestId('prose')
    expect(prose.getAttribute('data-source')).toBe(DOC.body_md)
  })

  it('wraps the prose in an <article> shell', () => {
    getLegalDocMock.mockReturnValue(DOC)
    const { container } = render(PrivacyPage())
    const article = container.querySelector('article')
    expect(article).not.toBeNull()
    expect(article?.querySelector('[data-testid="prose"]')).not.toBeNull()
  })

  it('does NOT call notFound on the doc-present path', () => {
    getLegalDocMock.mockReturnValue(DOC)
    render(PrivacyPage())
    expect(notFoundMock).not.toHaveBeenCalled()
  })
})

// --------------------------------------------------------------------
// PrivacyPage default export — doc absent
// --------------------------------------------------------------------

describe('PrivacyPage — doc absent', () => {
  it('calls notFound() when getLegalDoc returns null', () => {
    getLegalDocMock.mockReturnValue(null)
    expect(() => PrivacyPage()).toThrow('NEXT_NOT_FOUND')
    expect(notFoundMock).toHaveBeenCalledTimes(1)
  })

  it('never reaches the Prose render when the doc is absent', () => {
    getLegalDocMock.mockReturnValue(null)
    try {
      render(PrivacyPage())
    } catch {}
    expect(screen.queryByTestId('prose')).toBeNull()
  })
})
