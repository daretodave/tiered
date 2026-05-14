import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Show } from '@/content'
import { ShowsTile } from '../ShowsTile'

function show(overrides: Partial<Show> = {}): Show {
  return {
    slug: 'survivor',
    name: 'Survivor',
    palette: { primary: '#D55E36', ink: '#EFE2BD', paper: '#0E2A2A' },
    seasons: 47,
    status: 'airing',
    blurb: 'b',
    tagline: '47 seasons of strangers on a beach.',
    tier: 'S',
    network: 'CBS',
    est_year: 2000,
    genre_tag: 'Reality competition',
    featured: true,
    ...overrides,
  }
}

describe('<ShowsTile>', () => {
  it('links to /shows/<slug> with the data attributes for palette swap', () => {
    render(<ShowsTile show={show()} variant="tall" />)
    const tile = screen.getByTestId('shows-tile')
    expect(tile.getAttribute('href')).toBe('/shows/survivor')
    expect(tile.dataset['show']).toBe('survivor')
    expect(tile.dataset['variant']).toBe('tall')
  })

  it('renders the tagline + meta with seasons + est year', () => {
    render(<ShowsTile show={show()} variant="tall" />)
    const tile = screen.getByTestId('shows-tile')
    expect(tile.textContent).toContain('47 seasons of strangers on a beach.')
    expect(tile.textContent).toContain('47 seasons')
    expect(tile.textContent).toContain('canon + community')
    expect(tile.textContent).toContain('est. 2000')
  })

  it('renders the network in the head tag', () => {
    render(<ShowsTile show={show()} variant="regular" />)
    expect(screen.getByTestId('shows-tile').textContent).toContain(
      'Reality competition · CBS',
    )
  })

  it('passes the palette through CSS custom properties', () => {
    render(<ShowsTile show={show()} variant="regular" />)
    const tile = screen.getByTestId('shows-tile') as HTMLElement
    expect(tile.style.getPropertyValue('--tile-paper')).toBe('#0E2A2A')
    expect(tile.style.getPropertyValue('--tile-ink')).toBe('#EFE2BD')
    expect(tile.style.getPropertyValue('--tile-primary')).toBe('#D55E36')
  })

  it('small variant with status renders the in-progress pill + canon-in-review meta', () => {
    render(
      <ShowsTile
        show={show({ slug: 'traitors', name: 'Traitors', seasons: 3 })}
        variant="small"
        status={{ shipped: 2, target: 3 }}
      />,
    )
    const tile = screen.getByTestId('shows-tile')
    expect(tile.dataset['variant']).toBe('small')
    const pill = screen.getByTestId('show-tile-status')
    expect(pill.textContent).toContain('in progress')
    expect(pill.textContent).toContain('2 / 3')
    expect(tile.textContent).toContain('canon in review')
    expect(tile.textContent).not.toContain('canon + community')
  })

  it('singularizes "season" when a show has exactly one', () => {
    render(<ShowsTile show={show({ seasons: 1 })} variant="regular" />)
    const meta = screen.getByTestId('shows-tile').textContent ?? ''
    expect(meta).toContain('1 season ·')
    expect(meta).not.toContain('1 seasons')
  })
})
