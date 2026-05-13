import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CanonEntry } from '../CanonEntry'

describe('<CanonEntry>', () => {
  it('renders rank + title + season + rationale with the season-page href', () => {
    render(
      <CanonEntry
        rank={1}
        title="Heroes vs. Villains"
        seasonNumber={20}
        rationale="A returnees season that finally let the format show what it could really do."
        href="/shows/survivor/season/20"
      />,
    )
    const entry = screen.getByTestId('canon-entry')
    expect(entry.tagName.toLowerCase()).toBe('li')
    expect(entry.getAttribute('data-rank')).toBe('1')
    expect(entry.textContent).toContain('#01')
    expect(entry.textContent).toContain('Heroes vs. Villains')
    expect(entry.textContent).toContain('Season 20')
    expect(entry.textContent).toContain('A returnees season')
    expect(screen.getByRole('link')).toHaveAttribute('href', '/shows/survivor/season/20')
  })

  it('pads rank and season numbers to two digits', () => {
    render(
      <CanonEntry rank={7} title="Pearl Islands" seasonNumber={7} rationale="rationale" href="/x" />,
    )
    const entry = screen.getByTestId('canon-entry')
    expect(entry.textContent).toContain('#07')
    expect(entry.textContent).toContain('Season 07')
  })

  it('keeps rationale outside the anchor so it stays text-selectable', () => {
    render(
      <CanonEntry rank={1} title="t" seasonNumber={1} rationale="rationale text" href="/x" />,
    )
    const anchor = screen.getByRole('link')
    expect(anchor.textContent).not.toContain('rationale text')
    expect(screen.getByTestId('canon-entry').textContent).toContain('rationale text')
  })
})
