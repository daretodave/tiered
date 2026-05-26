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
          crossCanonCount: 23,
          singleShowCount: 0,
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

  it('puts the primary em accent on "Cross-canon" when every list is cross-canon', () => {
    const { container } = render(
      <ListsHero
        stats={{
          total: 12,
          totalEntries: 50,
          showsCovered: 4,
          crossCanonCount: 12,
          singleShowCount: 0,
          lastIndexRevision: '2025-01-01',
        }}
      />,
    )
    const em = container.querySelector('h1.lists-hero-title em')
    expect(em?.textContent).toContain('Cross-canon')
    expect(em?.textContent).not.toMatch(/single-show/i)
    expect(screen.getByTestId('lists-hero')).toHaveAttribute(
      'data-coverage',
      'cross-canon',
    )
    expect(screen.getByText(/Some span the catalog/)).toBeTruthy()
    expect(screen.queryByText(/span every show/i)).toBeNull()
    expect(screen.queryByText(/pieces of editorial opinion/i)).toBeNull()
    expect(screen.getByText(/lists we'd defend in a group chat/i)).toBeTruthy()
  })

  it('reads "Cross-canon and single-show." when the catalog mixes both shapes', () => {
    const { container } = render(
      <ListsHero
        stats={{
          total: 12,
          totalEntries: 50,
          showsCovered: 6,
          crossCanonCount: 11,
          singleShowCount: 1,
          lastIndexRevision: '2026-05-01',
        }}
      />,
    )
    const em = container.querySelector('h1.lists-hero-title em')
    expect(em?.textContent).toBe('Cross-canon and single-show.')
    expect(screen.getByTestId('lists-hero')).toHaveAttribute(
      'data-coverage',
      'mixed',
    )
    expect(screen.getByText(/Some span the catalog/)).toBeTruthy()
  })

  it('never claims "Cross-canon." alone when any single-show list is present', () => {
    // Pin the critique-pass-12 finding: H1 coverage shape must not
    // disagree with the per-list mix.
    const { container } = render(
      <ListsHero
        stats={{
          total: 12,
          totalEntries: 50,
          showsCovered: 6,
          crossCanonCount: 11,
          singleShowCount: 1,
          lastIndexRevision: '2026-05-01',
        }}
      />,
    )
    const em = container.querySelector('h1.lists-hero-title em')
    expect(em?.textContent).not.toBe('Cross-canon.')
    expect(em?.textContent).toContain('single-show')
  })

  it('swaps the accent and lede to single-canon-honest copy when every list is single-show', () => {
    const { container } = render(
      <ListsHero
        stats={{
          total: 12,
          totalEntries: 50,
          showsCovered: 1,
          crossCanonCount: 0,
          singleShowCount: 12,
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
    expect(screen.queryByText(/pieces of editorial opinion/i)).toBeNull()
    expect(screen.getByText(/lists we'd defend in a group chat/i)).toBeTruthy()
  })

  it('renders the "tiered.tv / Lists" eyebrow', () => {
    render(
      <ListsHero
        stats={{
          total: 1,
          totalEntries: 1,
          showsCovered: 1,
          crossCanonCount: 0,
          singleShowCount: 1,
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
          crossCanonCount: 0,
          singleShowCount: 1,
          lastIndexRevision: '2026-01-01',
        }}
      />,
    )
    expect(screen.getByTestId('lists-stat-total').textContent).toContain('List')
  })
})
