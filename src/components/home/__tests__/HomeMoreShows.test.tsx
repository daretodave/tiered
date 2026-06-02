import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HomeMoreShows } from '../HomeMoreShows'

describe('<HomeMoreShows>', () => {
  it('reads as a flat sectioning header, not a "+ N more" teaser', () => {
    render(
      <HomeMoreShows>
        <div data-testid="dummy-tile">tile</div>
      </HomeMoreShows>,
    )
    const label = screen.getByTestId('home-more-shows-label')
    expect(label.textContent).toBe('The rest of the index')
    // Regression pin against the pass-25 teaser-framing finding: the
    // label must never re-introduce the "+ N more in the index" form,
    // which read as a click-to-expand affordance for items already
    // rendered immediately below.
    expect(label.textContent).not.toMatch(/\+\s+\d+\s+more\s+in\s+the\s+index/)
  })

  it('renders the "Browse all" link', () => {
    render(<HomeMoreShows>tiles</HomeMoreShows>)
    const link = screen.getByRole('link', { name: /browse all/i })
    expect(link.getAttribute('href')).toBe('/shows')
  })

  it('renders children inside the compact grid', () => {
    render(
      <HomeMoreShows>
        <span data-testid="kid">x</span>
      </HomeMoreShows>,
    )
    const grid = screen.getByTestId('home-more-shows-grid')
    expect(grid.classList.contains('rest')).toBe(true)
    expect(grid.querySelector('[data-testid="kid"]')).not.toBeNull()
  })
})
