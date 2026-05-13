import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Show } from '@/content'
import { ShowTile } from '../ShowTile'

function show(overrides: Partial<Show> = {}): Show {
  return {
    slug: 'survivor',
    name: 'Survivor',
    network: 'CBS',
    format: 'outwit-outplay-outlast',
    hero_motifs: [],
    palette: { primary: '#D55E36', ink: '#EFE2BD', paper: '#0E2A2A' },
    status: 'airing',
    tagline: 'The mother format.',
    body_md: '',
    ...overrides,
  }
}

describe('<ShowTile>', () => {
  it('links to /shows/<slug>', () => {
    render(<ShowTile show={show()} seasonCount={4} artSrc="/shows/survivor/sigil.svg" />)
    const link = screen.getByTestId('home-show-tile')
    expect(link.getAttribute('href')).toBe('/shows/survivor')
    expect(link.dataset['show']).toBe('survivor')
  })

  it('uses tagline as blurb when present', () => {
    render(<ShowTile show={show()} seasonCount={4} artSrc="/x" />)
    expect(screen.getByTestId('home-show-tile').textContent).toContain('The mother format.')
  })

  it('falls back to format when tagline missing', () => {
    render(
      <ShowTile
        show={show({ tagline: undefined })}
        seasonCount={2}
        artSrc="/x"
      />,
    )
    expect(screen.getByTestId('home-show-tile').textContent).toContain('outwit-outplay-outlast')
  })

  it('singular season count noun', () => {
    render(<ShowTile show={show()} seasonCount={1} artSrc="/x" />)
    expect(screen.getByTestId('home-show-tile-meta').textContent).toMatch(/^1 season · ranked/)
  })

  it('plural season count noun', () => {
    render(<ShowTile show={show()} seasonCount={4} artSrc="/x" />)
    expect(screen.getByTestId('home-show-tile-meta').textContent).toMatch(/^4 seasons · ranked/)
  })

  it('zero seasons renders the loading placeholder', () => {
    render(<ShowTile show={show()} seasonCount={0} artSrc="/x" />)
    expect(screen.getByTestId('home-show-tile-meta').textContent).toBe('season count loading')
  })
})
