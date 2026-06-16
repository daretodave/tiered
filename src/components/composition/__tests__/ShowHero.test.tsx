import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ShowHero } from '../ShowHero'

describe('<ShowHero>', () => {
  it('renders left cover (crumb + wordmark + blurb) and right meta (stats + tagline)', () => {
    render(
      <ShowHero
        title="Survivor"
        blurb="47 seasons. One torch at a time."
        crumb={<span data-testid="crumb-content">Shows / Survivor</span>}
        tagline="47 seasons of strangers on a beach."
      />,
    )
    expect(screen.getByTestId('show-hero')).toBeInTheDocument()
    expect(screen.getByTestId('show-hero-cover')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Survivor')
    expect(screen.getByTestId('crumb-content')).toBeInTheDocument()
    expect(screen.getByTestId('show-hero').textContent).toMatch(/One torch/)
    expect(screen.getByTestId('show-hero').textContent).toMatch(/strangers on a beach/)

    // Critique pass-49, issue #426: breadcrumb must appear in DOM before
    // the H1 so the reading order is crumb → H1 → blurb → stats (not
    // H1 → blurb → crumb as the interleaved right-column design produced).
    const cover = screen.getByTestId('show-hero-cover')
    const crumb = screen.getByTestId('crumb-content')
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(cover.contains(crumb)).toBe(true)
    // compareDocumentPosition: 4 = DOCUMENT_POSITION_FOLLOWING (crumb precedes h1)
    expect(crumb.compareDocumentPosition(h1) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('renders the stats strip when stats are provided', () => {
    render(
      <ShowHero
        title="Survivor"
        blurb="b"
        crumb="x"
        stats={[
          { value: 47, key: 'seasons aired' },
          { value: 'May 2026', key: 'Canon revised' },
        ]}
      />,
    )
    const stats = screen.getByTestId('show-hero-stats')
    expect(stats).toBeInTheDocument()
    expect(stats.textContent).toContain('47')
    expect(stats.textContent).toContain('seasons aired')
    expect(stats.textContent).toContain('May 2026')
    expect(stats.textContent).toContain('Canon revised')
  })

  it('omits the stats strip when no stats given', () => {
    render(<ShowHero title="t" blurb="b" crumb="x" />)
    expect(screen.queryByTestId('show-hero-stats')).not.toBeInTheDocument()
  })

  it('renders the optional shield slot when given', () => {
    render(
      <ShowHero
        title="t"
        blurb="b"
        crumb="x"
        shield={<div data-testid="shield-content">shield</div>}
      />,
    )
    expect(screen.getByTestId('shield-content')).toBeInTheDocument()
  })

  it('does not render the rejected show-hero-art container', () => {
    render(<ShowHero title="t" blurb="b" crumb="x" />)
    expect(screen.queryByTestId('show-hero-art')).not.toBeInTheDocument()
  })

  it('exposes show-hero-tagline testid when tagline is given', () => {
    render(<ShowHero title="t" blurb="b" crumb="x" tagline="hello world" />)
    const tagline = screen.getByTestId('show-hero-tagline')
    expect(tagline).toBeInTheDocument()
    expect(tagline).toHaveTextContent('hello world')
  })

  it('omits show-hero-tagline testid when tagline is absent', () => {
    render(<ShowHero title="t" blurb="b" crumb="x" />)
    expect(screen.queryByTestId('show-hero-tagline')).not.toBeInTheDocument()
  })

  // Critique pass-35 (#336) sibling positive — the show-page hero
  // stat-strip third tile must label as `Canon revised` (verb-past)
  // and never drift to the noun form `Last revision`. Pairs with the
  // /shows hero `Shows revised` pin (post-#347) in `ShowsHero.test.tsx`
  // so the chrome label grammar stays uniform across the home → /shows
  // → /shows/[show] click path.
  it('labels the canon-revised stat as `Canon revised` (not `Last revision`)', () => {
    render(
      <ShowHero
        title="Survivor"
        blurb="b"
        crumb="x"
        stats={[
          { value: 47, key: 'seasons aired' },
          { value: 'May 2026', key: 'Canon revised' },
        ]}
      />,
    )
    const stats = screen.getByTestId('show-hero-stats')
    expect(stats.textContent).toContain('Canon revised')
    expect(stats.textContent).not.toContain('Last revision')
  })

  // Critique pass-45 (#380) sibling positive — the show-page hero
  // seasons-stat label flows from `src/lib/canon/seasons-stat-label.ts`
  // which produces `seasons in canon` on a fully-drained show. Pairs
  // with the home featured tile's `Seasons in canon` (pass-44 #379)
  // so the home → /shows/[show] click path carries one per-show label.
  // Drift guard: must not regress to the legacy `seasons ranked`
  // literal, which now belongs only to /shows hero's catalog-aggregate
  // slot.
  it('labels the seasons stat as `seasons in canon` (not `seasons ranked`)', () => {
    render(
      <ShowHero
        title="Survivor"
        blurb="b"
        crumb="x"
        stats={[
          { value: 50, key: 'seasons in canon' },
          { value: 'May 2026', key: 'Canon revised' },
        ]}
      />,
    )
    const stats = screen.getByTestId('show-hero-stats')
    expect(stats.textContent).toContain('seasons in canon')
    expect(stats.textContent).not.toContain('seasons ranked')
  })
})
