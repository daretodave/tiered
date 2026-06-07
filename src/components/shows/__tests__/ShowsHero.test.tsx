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
      'Shows revised',
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

  // Critique pass-27 HIGH (#288): when no canon in the catalog carries
  // `last_revised` (or the showsStats helper returns null for any
  // reason), the stat cell must hide entirely — mirrors the home
  // pass-24 #269 hide path so /shows never stamps a fabricated date.
  it('hides the Shows revised cell when stats.lastRevision is null', () => {
    render(
      <ShowsHero
        stats={{ showCount: 13, totalSeasons: 290, lastRevision: null }}
        tiers={['S', 'A']}
      />,
    )
    expect(screen.queryByTestId('shows-stat-revised')).toBeNull()
    expect(screen.queryByTestId('shows-hero-canon-revised')).toBeNull()
    const stats = screen.getByTestId('shows-hero-stats')
    expect(stats.textContent).not.toContain('Shows revised')
    expect(stats.textContent).not.toContain('Index revised')
  })

  it('renders the canon-revised cell verbatim from the supplied label', () => {
    // Regression pin: the cell text comes from `stats.lastRevision`
    // as supplied — no clock dependency, no reformatting. Lock the
    // ShowsHero contract so a future refactor that re-introduces a
    // build-time fallback in the component itself trips at unit time.
    render(
      <ShowsHero
        stats={{
          showCount: 13,
          totalSeasons: 290,
          lastRevision: 'February 2027',
        }}
        tiers={['S', 'A']}
      />,
    )
    expect(screen.getByTestId('shows-hero-canon-revised').textContent).toBe(
      'February 2027',
    )
  })

  // Critique pass-35 (#336) → pass-39 (#347): chrome label discipline —
  // the third stat tile labels as `Shows revised` (verb-past, named
  // referent — the shows corpus) to match the verb-past grammar the home
  // featured tile and the show-page hero stat already use (`Canon
  // revised`). Pass-39 #347 renamed from `Index revised` → `Shows
  // revised` (sibling on /themes renamed to `Lists revised`) so the two
  // top-level catalogs surface their own corpus's freshness rather than
  // appearing to disagree on a single global timestamp.
  // Bidirectional pin: assert the canonical `Shows revised` form is
  // present AND the rejected forms (`Last revision` from pass-35, the
  // ambiguous `Index revised` from pass-38/-39) are gone, so a future
  // refactor that swings the label back trips at unit time.
  it('labels the third stat cell as `Shows revised` (not `Index revised` or `Last revision`)', () => {
    render(
      <ShowsHero
        stats={{ showCount: 13, totalSeasons: 290, lastRevision: 'May 2026' }}
        tiers={['S', 'A']}
      />,
    )
    const cell = screen.getByTestId('shows-stat-revised')
    const label = cell.querySelector('.shows-stat-key')
    expect(label?.textContent).toBe('Shows revised')
    // CSS uppercases the rendered label — `text-transform: uppercase`
    // on `.shows-stat-key`. Regex pin at the DOM source so the
    // assertion isn't fooled by case-folding.
    expect(label?.textContent).toMatch(/^Shows revised$/)
    expect(cell.textContent).not.toContain('Last revision')
    expect(cell.textContent).not.toContain('Index revised')
  })
})
