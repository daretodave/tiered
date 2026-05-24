import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ShowsHero } from '../ShowsHero'

describe('<ShowsHero>', () => {
  it('renders the eyebrow + the All shows / Tiered title pair', () => {
    render(
      <ShowsHero
        stats={{ showCount: 13, totalSeasons: 290, lastRevision: 'May 2026' }}
        tiers={['S', 'A']}
      />,
    )
    const hero = screen.getByTestId('shows-hero')
    expect(hero.textContent).toContain('tiered.tv / Shows')
    expect(hero.textContent).toContain('All shows.')
    expect(hero.textContent).toContain('Tiered.')
  })

  it('renders the three stats with values + keys', () => {
    render(
      <ShowsHero
        stats={{ showCount: 13, totalSeasons: 290, lastRevision: 'May 2026' }}
        tiers={['S', 'A']}
      />,
    )
    expect(screen.getByTestId('shows-stat-shows').textContent).toContain('13')
    expect(screen.getByTestId('shows-stat-shows').textContent).toContain(
      'Shows tracked',
    )
    expect(screen.getByTestId('shows-stat-seasons').textContent).toContain(
      '290',
    )
    expect(screen.getByTestId('shows-stat-seasons').textContent).toContain(
      'Seasons ranked',
    )
    expect(screen.getByTestId('shows-stat-revised').textContent).toContain(
      'May 2026',
    )
    expect(screen.getByTestId('shows-stat-revised').textContent).toContain(
      'Last revision',
    )
  })

  it('puts the primary em accent on "Tiered."', () => {
    const { container } = render(
      <ShowsHero
        stats={{ showCount: 1, totalSeasons: 1, lastRevision: 'January 2026' }}
        tiers={['S']}
      />,
    )
    const em = container.querySelector('h1.shows-hero-title em')
    expect(em).not.toBeNull()
    expect(em?.textContent).toBe('Tiered.')
  })

  it('omits the B-tier sentence when no show sits in B', () => {
    render(
      <ShowsHero
        stats={{ showCount: 13, totalSeasons: 290, lastRevision: 'May 2026' }}
        tiers={['S', 'A']}
      />,
    )
    const lede = screen.getByTestId('shows-hero-lede')
    expect(lede.textContent).toContain('S tier')
    expect(lede.textContent).toContain('A tier')
    expect(lede.textContent).not.toContain('B tier')
    expect(lede.getAttribute('data-tier-coverage')).toBe('SA')
  })

  it('includes the B-tier sentence once a show lands in B', () => {
    render(
      <ShowsHero
        stats={{ showCount: 14, totalSeasons: 300, lastRevision: 'May 2026' }}
        tiers={['S', 'A', 'B']}
      />,
    )
    const lede = screen.getByTestId('shows-hero-lede')
    expect(lede.textContent).toContain('B tier')
    expect(lede.textContent).toContain('still working through')
    expect(lede.getAttribute('data-tier-coverage')).toBe('SAB')
  })
})
