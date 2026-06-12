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
    // Critique pass-44 (#379): /shows hero owns the catalog-aggregate
    // `Seasons ranked` slot. The home featured tile rotated to
    // `Seasons in canon` to carry the per-show scope; this surface
    // keeps the original label so the two read as distinct facts
    // on the home → /shows click path. Bidirectional pin — positive:
    // the catalog claim is present; negative: the per-show rotation
    // never leaks here.
    expect(screen.getByTestId('shows-stat-seasons').textContent).toContain(
      'Seasons ranked',
    )
    expect(screen.getByTestId('shows-stat-seasons').textContent).not.toContain(
      'Seasons in canon',
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

  // Critique pass-40 LOW (#352): the lede previously declared the sort axis
  // as `sorted not by personal taste but by how settled the ranking is`,
  // overclaiming taste-free objectivity while the S/A band sentences the
  // page then publishes (`The S tier invented or perfected its format.` /
  // `The A tier has the deep canon and the years to defend it.`) are
  // themselves editorial judgments. A reader hopping /shows → /shows/survivor
  // read two contradictory voices on the same editorial honesty question —
  // /shows said "not personal taste"; /shows/survivor says "one editor's
  // read … not claiming objective." Same defect class as the resolved
  // pass-22 page-lede-contradicts-its-own-follow-on closure. Bidirectional
  // pin: positive case names the editorial judgment (the rewrite says the
  // sort favors `defensible canon`); negative case forbids the regression
  // to the `not by personal taste` overclaim.
  describe('lede voice (critique pass-40)', () => {
    it('names the editorial judgment instead of denying taste', () => {
      render(
        <ShowsHero
          stats={{ showCount: 13, totalSeasons: 290, lastRevision: 'May 2026' }}
          tiers={['S', 'A']}
        />,
      )
      const lede = screen.getByTestId('shows-hero-lede')
      expect(lede.textContent).toMatch(/defensible canon/i)
    })

    it('never regresses to the `not by personal taste` overclaim', () => {
      render(
        <ShowsHero
          stats={{ showCount: 13, totalSeasons: 290, lastRevision: 'May 2026' }}
          tiers={['S', 'A']}
        />,
      )
      const lede = screen.getByTestId('shows-hero-lede')
      expect(lede.textContent).not.toMatch(/not by personal taste/i)
    })
  })

  // Critique pass-49 MED (#408): cross-surface editor-voice drift on the
  // natural anon nav path /shows → /themes → /about. /shows hero used the
  // institutional plural `we love most`; /themes + /about + the rest of the
  // editorial chrome speak in the first-person singular `I`. The /about
  // editorial constitution is explicitly singular (`one person, one position
  // per season` — content/legal/about.md), so the plural `we` on /shows
  // contradicted the same line that anchors editor-canon legitimacy. Same
  // defect class as the resolved pass-47 #406 (plural-byline axis). Fix
  // flipped the hero to `not which shows I love most.` Bidirectional pin:
  // positive case names the first-person singular form; negative case
  // forbids the editorial-`we` regression.
  describe('editor narrator pronoun (critique pass-49)', () => {
    it('uses the first-person singular `I love most` form', () => {
      render(
        <ShowsHero
          stats={{ showCount: 13, totalSeasons: 290, lastRevision: 'May 2026' }}
          tiers={['S', 'A']}
        />,
      )
      const lede = screen.getByTestId('shows-hero-lede')
      expect(lede.textContent).toMatch(/which shows I love most/)
    })

    it('never regresses to the editorial `we love most` plural', () => {
      render(
        <ShowsHero
          stats={{ showCount: 13, totalSeasons: 290, lastRevision: 'May 2026' }}
          tiers={['S', 'A']}
        />,
      )
      const lede = screen.getByTestId('shows-hero-lede')
      expect(lede.textContent).not.toMatch(/which shows we love most/)
    })
  })
})
