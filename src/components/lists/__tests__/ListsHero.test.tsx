import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ListsHero } from '../ListsHero'

describe('<ListsHero>', () => {
  it('renders the three stats from fixture data', () => {
    render(
      <ListsHero
        stats={{
          total: 23,
          totalEntries: 100,
          showsCovered: 3,
          lastIndexRevision: '2026-05-01',
        }}
      />,
    )
    expect(screen.getByTestId('lists-stat-total').textContent).toContain('23')
    expect(screen.getByTestId('lists-stat-total').textContent).toContain('Lists')
    expect(screen.getByTestId('lists-stat-shows').textContent).toContain('3')
    expect(screen.getByTestId('lists-stat-shows').textContent).toContain(
      'Shows covered',
    )
    expect(screen.getByTestId('lists-stat-revised').textContent).toContain('2026')
    expect(screen.getByTestId('lists-stat-revised').textContent).toContain(
      'Index last revised',
    )
  })

  it('puts the primary em accent on "Cross-canon" when more than one show is covered', () => {
    const { container } = render(
      <ListsHero
        stats={{
          total: 12,
          totalEntries: 50,
          showsCovered: 2,
          lastIndexRevision: '2025-01-01',
        }}
      />,
    )
    const em = container.querySelector('h1.lists-hero-title em')
    expect(em?.textContent).toContain('Cross-canon')
    expect(screen.getByTestId('lists-hero')).toHaveAttribute(
      'data-coverage',
      'cross-canon',
    )
    expect(screen.getByText(/Some span the catalog/)).toBeTruthy()
    expect(screen.queryByText(/span every show/i)).toBeNull()
  })

  it('swaps the accent and lede to single-canon-honest copy when only one show is covered', () => {
    const { container } = render(
      <ListsHero
        stats={{
          total: 12,
          totalEntries: 50,
          showsCovered: 1,
          lastIndexRevision: '2025-01-01',
        }}
      />,
    )
    const em = container.querySelector('h1.lists-hero-title em')
    expect(em?.textContent).not.toMatch(/cross-canon/i)
    expect(em?.textContent).toContain('Inside one canon')
    expect(screen.getByTestId('lists-hero')).toHaveAttribute(
      'data-coverage',
      'single-canon',
    )
    expect(screen.queryByText(/Some span the catalog/)).toBeNull()
    expect(
      screen.getByText(/Every list lives inside one canon today/),
    ).toBeTruthy()
  })

  it('renders the "tiered.tv / Lists" eyebrow', () => {
    render(
      <ListsHero
        stats={{
          total: 1,
          totalEntries: 1,
          showsCovered: 1,
          lastIndexRevision: '2026-01-01',
        }}
      />,
    )
    expect(screen.getByText('tiered.tv / Lists')).toBeTruthy()
  })

  it('uses singular "List" key when total is 1', () => {
    render(
      <ListsHero
        stats={{
          total: 1,
          totalEntries: 1,
          showsCovered: 1,
          lastIndexRevision: '2026-01-01',
        }}
      />,
    )
    expect(screen.getByTestId('lists-stat-total').textContent).toContain('List')
  })
})
