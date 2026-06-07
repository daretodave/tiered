import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FooterAboutCol } from '../FooterAboutCol'

// The component's static LINKS array, mirrored here as the expected
// contract. The order is load-bearing — the footer renders the
// column top-to-bottom in this sequence on every page. The trailing
// Privacy + Terms pair are the legal-nav entries the /about closing
// paragraph commits to surfacing globally.
const EXPECTED: Array<{ href: string; label: string }> = [
  { href: '/about', label: 'About the canon' },
  { href: '/about#voting', label: 'How voting works' },
  { href: '/about#spoilers', label: 'Spoilers policy' },
  { href: '/about#editors', label: 'Become an editor' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
]

describe('<FooterAboutCol> container', () => {
  it('renders a <nav> carrying the about-col testid, class, and aria-label', () => {
    render(<FooterAboutCol />)
    const nav = screen.getByTestId('site-footer-about-col')
    expect(nav.tagName).toBe('NAV')
    expect(nav.classList.contains('site-footer-col')).toBe(true)
    expect(nav.getAttribute('aria-label')).toBe('tiered.tv')
  })

  it('renders the "tiered.tv" column head as an <h2> with the head class', () => {
    render(<FooterAboutCol />)
    const head = screen.getByRole('heading', { level: 2 })
    expect(head.classList.contains('site-footer-col-head')).toBe(true)
    expect(head.textContent).toBe('tiered.tv')
  })
})

describe('<FooterAboutCol> links', () => {
  // prefetch={false} is set on every Link but is not surfaced as a
  // DOM attribute under jsdom — the contract is noted here, the
  // tests pin what is DOM-observable (href, label, order, count).

  it('renders exactly 6 links', () => {
    render(<FooterAboutCol />)
    expect(screen.getAllByRole('link')).toHaveLength(6)
  })

  it('renders the link hrefs in order', () => {
    render(<FooterAboutCol />)
    expect(
      screen.getAllByRole('link').map((a) => a.getAttribute('href')),
    ).toEqual(EXPECTED.map((l) => l.href))
  })

  it('renders the link labels in order', () => {
    render(<FooterAboutCol />)
    expect(screen.getAllByRole('link').map((a) => a.textContent)).toEqual(
      EXPECTED.map((l) => l.label),
    )
  })

  it('pairs every href with its expected label', () => {
    render(<FooterAboutCol />)
    for (const { href, label } of EXPECTED) {
      const link = screen.getByRole('link', { name: label })
      expect(link.getAttribute('href')).toBe(href)
    }
  })

  it('renders /privacy with the label "Privacy"', () => {
    render(<FooterAboutCol />)
    const link = screen.getByRole('link', { name: 'Privacy' })
    expect(link.getAttribute('href')).toBe('/privacy')
  })

  it('renders /terms with the label "Terms"', () => {
    render(<FooterAboutCol />)
    const link = screen.getByRole('link', { name: 'Terms' })
    expect(link.getAttribute('href')).toBe('/terms')
  })

  it('keeps the about-deep links followed by the two legal links', () => {
    render(<FooterAboutCol />)
    const hrefs = screen
      .getAllByRole('link')
      .map((a) => a.getAttribute('href') ?? '')
    // The first four entries are the about-page navigation (bare
    // + three #anchor fragments); the trailing two are the legal
    // nav — surfaced globally so a reader doesn't have to deep-read
    // /about prose to reach Privacy or Terms.
    expect(hrefs[0]).toBe('/about')
    expect(hrefs.slice(1, 4)).toEqual([
      '/about#voting',
      '/about#spoilers',
      '/about#editors',
    ])
    expect(hrefs.slice(4)).toEqual(['/privacy', '/terms'])
    expect(hrefs.filter((h) => h.startsWith('/about'))).toHaveLength(4)
    expect(hrefs.filter((h) => h.includes('#'))).toHaveLength(3)
  })
})

describe('<FooterAboutCol> list structure', () => {
  it('renders a single <ul> with one <li> per link', () => {
    render(<FooterAboutCol />)
    const lists = screen
      .getByTestId('site-footer-about-col')
      .querySelectorAll('ul')
    expect(lists).toHaveLength(1)
    expect(lists[0]?.querySelectorAll('li')).toHaveLength(6)
  })

  it('places exactly one anchor inside each <li>', () => {
    render(<FooterAboutCol />)
    const items = screen
      .getByTestId('site-footer-about-col')
      .querySelectorAll('li')
    expect(items).toHaveLength(6)
    for (const li of items) {
      expect(li.querySelectorAll('a')).toHaveLength(1)
    }
  })
})
