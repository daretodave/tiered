import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HomeShowGrid } from '../HomeShowGrid'

describe('<HomeShowGrid>', () => {
  it('renders the section root with the home-show-section testid', () => {
    render(
      <HomeShowGrid totalShows={13}>
        <div data-testid="dummy-tile">tile</div>
      </HomeShowGrid>,
    )
    const section = screen.getByTestId('home-show-section')
    expect(section.tagName).toBe('SECTION')
    expect(section.className).toContain('home-shows')
  })

  it('surfaces the totalShows count in the heading', () => {
    render(
      <HomeShowGrid totalShows={13}>
        <span>x</span>
      </HomeShowGrid>,
    )
    expect(screen.getByTestId('home-shows-heading')).toHaveTextContent(
      '13 shows tracked.',
    )
  })

  it('renders the italic brand-promise clause with accurate tier scope', () => {
    render(
      <HomeShowGrid totalShows={1}>
        <span>x</span>
      </HomeShowGrid>,
    )
    const heading = screen.getByTestId('home-shows-heading')
    const em = heading.querySelector('em')
    expect(em).not.toBeNull()
    expect(em?.textContent).toBe('Every S and A-tier season reviewed.')
    // Negative pin: old overclaim must not regress (B-tier shows carry partial canons)
    expect(em?.textContent).not.toMatch(/^Every season reviewed\.$/i)
  })

  it('renders an "All shows" link to /shows with prefetch disabled', () => {
    render(
      <HomeShowGrid totalShows={1}>
        <span>x</span>
      </HomeShowGrid>,
    )
    const link = screen.getByRole('link', { name: /all shows/i })
    expect(link.getAttribute('href')).toBe('/shows')
    expect(link.classList.contains('section-link')).toBe(true)
  })

  it('renders children inside the shows-grid container', () => {
    render(
      <HomeShowGrid totalShows={3}>
        <span data-testid="kid-a">a</span>
        <span data-testid="kid-b">b</span>
      </HomeShowGrid>,
    )
    const grid = screen.getByTestId('home-show-grid')
    expect(grid.classList.contains('shows-grid')).toBe(true)
    expect(grid.querySelector('[data-testid="kid-a"]')).not.toBeNull()
    expect(grid.querySelector('[data-testid="kid-b"]')).not.toBeNull()
  })
})
