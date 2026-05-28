import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the content-loader boundary so FooterTiersCol is driven off
// hand-built show lists rather than the on-disk content tree
// (cf. the vi.mock pattern in
// src/components/shows/__tests__/canonProgress.test.ts).
vi.mock('@/content/loaders', () => ({
  getAllShows: vi.fn(),
}))

import type { Show } from '@/content'
import { getAllShows } from '@/content/loaders'
import { FooterTiersCol } from '../FooterTiersCol'

const mockedGetAllShows = getAllShows as ReturnType<typeof vi.fn>

function makeShow(slug: string, name: string, primary = '#d55e36'): Show {
  return {
    slug,
    name,
    palette: { primary, ink: '#efe2bd', paper: '#0e2a2a' },
    seasons: 1,
    status: 'airing',
    blurb: 'blurb',
    tagline: 'tagline',
    tier: 'S',
    network: 'CBS',
    est_year: 2000,
    genre_tag: 'Reality competition',
    featured: false,
  }
}

// Per-show links resolve to /shows/<slug>; the trailing meta link is
// /shows exactly. Filtering by the href prefix separates the two.
function showLinks(): HTMLAnchorElement[] {
  return screen
    .getAllByRole('link')
    .filter((a): a is HTMLAnchorElement =>
      (a.getAttribute('href') ?? '').startsWith('/shows/'),
    )
}

beforeEach(() => {
  mockedGetAllShows.mockReset()
})

describe('<FooterTiersCol> container', () => {
  it('renders a <nav> carrying the tiers-col testid, class, and aria-label', () => {
    mockedGetAllShows.mockReturnValue([])
    render(<FooterTiersCol />)
    const nav = screen.getByTestId('site-footer-tiers-col')
    expect(nav.tagName).toBe('NAV')
    expect(nav.classList.contains('site-footer-col')).toBe(true)
    expect(nav.getAttribute('aria-label')).toBe('Shows')
  })

  it('renders the "Shows" column head as an <h2> with the head class', () => {
    mockedGetAllShows.mockReturnValue([])
    render(<FooterTiersCol />)
    const head = screen.getByRole('heading', { level: 2 })
    expect(head.classList.contains('site-footer-col-head')).toBe(true)
    expect(head.textContent).toBe('Shows')
  })

  it('reads the show list from getAllShows()', () => {
    mockedGetAllShows.mockReturnValue([makeShow('a', 'A')])
    render(<FooterTiersCol />)
    expect(mockedGetAllShows).toHaveBeenCalled()
  })
})

describe('<FooterTiersCol> show links', () => {
  // prefetch={false} is set on every Link but is not surfaced as a DOM
  // attribute under jsdom — the contract is noted here, the tests pin
  // what is DOM-observable (href, label, bullet, ordering).

  it('caps the show list at the first 3 from getAllShows()', () => {
    mockedGetAllShows.mockReturnValue([
      makeShow('a', 'A'),
      makeShow('b', 'B'),
      makeShow('c', 'C'),
      makeShow('d', 'D'),
      makeShow('e', 'E'),
    ])
    render(<FooterTiersCol />)
    const links = showLinks()
    expect(links).toHaveLength(3)
    expect(links.map((l) => l.getAttribute('href'))).toEqual([
      '/shows/a',
      '/shows/b',
      '/shows/c',
    ])
  })

  it('preserves getAllShows() order — does not sort the first 3', () => {
    mockedGetAllShows.mockReturnValue([
      makeShow('zulu', 'Zulu'),
      makeShow('alpha', 'Alpha'),
      makeShow('mike', 'Mike'),
    ])
    render(<FooterTiersCol />)
    expect(showLinks().map((l) => l.textContent)).toEqual([
      'Zulu',
      'Alpha',
      'Mike',
    ])
  })

  it('links each show to /shows/<slug> and labels it with the show name', () => {
    mockedGetAllShows.mockReturnValue([
      makeShow('survivor', 'Survivor'),
      makeShow('top-chef', 'Top Chef'),
      makeShow('drag-race', 'Drag Race'),
    ])
    render(<FooterTiersCol />)
    const links = showLinks()
    expect(links[0]?.getAttribute('href')).toBe('/shows/survivor')
    expect(links[0]).toHaveTextContent('Survivor')
    expect(links[1]?.getAttribute('href')).toBe('/shows/top-chef')
    expect(links[1]).toHaveTextContent('Top Chef')
    expect(links[2]?.getAttribute('href')).toBe('/shows/drag-race')
    expect(links[2]).toHaveTextContent('Drag Race')
  })

  it('renders an 8px bullet inside each show link tinted from palette.primary', () => {
    mockedGetAllShows.mockReturnValue([
      makeShow('a', 'A', '#aa0000'),
      makeShow('b', 'B', '#00bb00'),
      makeShow('c', 'C', '#0000cc'),
    ])
    render(<FooterTiersCol />)
    const bullets = showLinks().map(
      (l) => l.querySelector('[data-testid=bullet]') as HTMLSpanElement | null,
    )
    expect(bullets.every(Boolean)).toBe(true)
    // size={8} — Bullet renders width/height from the size prop.
    expect(bullets[0]?.style.width).toBe('8px')
    expect(bullets[0]?.style.height).toBe('8px')
    // Each bullet carries its own show's primary; the channels chosen
    // here are distinct so a swap or hardcode fails loudly.
    expect(bullets[0]?.style.background).toContain('170') // #aa0000
    expect(bullets[1]?.style.background).toContain('187') // #00bb00
    expect(bullets[2]?.style.background).toContain('204') // #0000cc
  })
})

describe('<FooterTiersCol> "All shows" meta link', () => {
  it('renders the "All shows" link to /shows with the meta link class', () => {
    mockedGetAllShows.mockReturnValue([makeShow('a', 'A')])
    render(<FooterTiersCol />)
    const meta = screen.getByRole('link', { name: /all shows/i })
    expect(meta.getAttribute('href')).toBe('/shows')
    expect(meta.classList.contains('site-footer-col-link-meta')).toBe(true)
    expect(meta).toHaveTextContent('All shows →')
  })

  it('does not apply the meta link class to per-show links', () => {
    mockedGetAllShows.mockReturnValue([makeShow('a', 'A'), makeShow('b', 'B')])
    render(<FooterTiersCol />)
    for (const link of showLinks()) {
      expect(link.classList.contains('site-footer-col-link-meta')).toBe(false)
    }
  })
})

describe('<FooterTiersCol> graceful counts', () => {
  it('renders every show plus the meta link when fewer than 3 exist', () => {
    mockedGetAllShows.mockReturnValue([makeShow('a', 'A'), makeShow('b', 'B')])
    render(<FooterTiersCol />)
    expect(showLinks()).toHaveLength(2)
    expect(screen.getAllByRole('link')).toHaveLength(3) // 2 shows + meta
  })

  it('renders only the meta link when getAllShows() is empty', () => {
    mockedGetAllShows.mockReturnValue([])
    render(<FooterTiersCol />)
    expect(showLinks()).toHaveLength(0)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(1)
    expect(links[0]?.getAttribute('href')).toBe('/shows')
    // The column head still renders so the footer never collapses.
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Shows')
  })
})

describe('<FooterTiersCol> list structure', () => {
  it('renders one <li> per show (capped at 3) plus one for the meta link', () => {
    mockedGetAllShows.mockReturnValue([
      makeShow('a', 'A'),
      makeShow('b', 'B'),
      makeShow('c', 'C'),
      makeShow('d', 'D'),
    ])
    render(<FooterTiersCol />)
    const list = screen
      .getByTestId('site-footer-tiers-col')
      .querySelector('ul')
    expect(list).not.toBeNull()
    expect(list?.querySelectorAll('li')).toHaveLength(4) // 3 shows + meta
  })

  it('places the meta link in the final list item', () => {
    mockedGetAllShows.mockReturnValue([makeShow('a', 'A'), makeShow('b', 'B')])
    render(<FooterTiersCol />)
    const items = screen
      .getByTestId('site-footer-tiers-col')
      .querySelectorAll('li')
    const lastLink = items[items.length - 1]?.querySelector('a')
    expect(lastLink?.getAttribute('href')).toBe('/shows')
  })
})
