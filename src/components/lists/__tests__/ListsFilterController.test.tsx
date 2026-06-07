import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ListsFilterController } from '../ListsFilterController'

const counts = { all: 14, tone: 4, structure: 2, craft: 3, era: 2, single: 3 }

describe('<ListsFilterController>', () => {
  it('renders 6 chips with the right data-filter attrs', () => {
    // `structure` was split out of `tone` at critique pass-31 — see
    // FILTER_KEYS in src/lib/themes-format.ts. The chip order is
    // editorial reading order across the lists overview and must
    // match GROUP_HEAD_LABELS in lockstep.
    render(
      <ListsFilterController
        counts={counts}
        allLists={<div>children</div>}
      />,
    )
    const chips = screen
      .getByTestId('lists-filter-bar')
      .querySelectorAll('button.chip')
    expect(chips).toHaveLength(6)
    const filters = Array.from(chips).map((c) => c.getAttribute('data-filter'))
    expect(filters).toEqual([
      'all',
      'tone',
      'structure',
      'craft',
      'era',
      'single',
    ])
  })

  it('defaults to "all" filter on the scope wrapper', () => {
    render(
      <ListsFilterController
        counts={counts}
        allLists={<div>children</div>}
      />,
    )
    const scope = screen.getByTestId('lists-filter-scope')
    expect(scope.getAttribute('data-active-filter')).toBe('all')
  })

  it('flips data-active-filter when a chip is clicked', () => {
    render(
      <ListsFilterController
        counts={counts}
        allLists={<div>children</div>}
      />,
    )
    fireEvent.click(screen.getByTestId('lists-chip-craft'))
    expect(
      screen.getByTestId('lists-filter-scope').getAttribute('data-active-filter'),
    ).toBe('craft')
    expect(screen.getByTestId('lists-filter-mode').textContent).toContain(
      '3 craft lists',
    )
  })

  it('shows "all 14 in the index" mode text by default', () => {
    render(
      <ListsFilterController
        counts={counts}
        allLists={<div>children</div>}
      />,
    )
    expect(screen.getByTestId('lists-filter-mode').textContent).toContain(
      'all 14 in the index',
    )
  })

  it('never renders the bare "all N lists" shape (critique pass-25 pin)', () => {
    // The hero lede above renders the catalog total; the chip is the
    // index-grid scope. The qualifier `in the index` is what keeps `ALL`
    // from silently shadowing the lede. Regression guard.
    render(
      <ListsFilterController
        counts={counts}
        allLists={<div>children</div>}
      />,
    )
    const text = screen.getByTestId('lists-filter-mode').textContent ?? ''
    expect(text).not.toMatch(/^showing · all \d+ lists$/)
  })

  describe('filter-mode position (critique pass-38, issue #340)', () => {
    // The `Showing · all N in the index` filter-state subhead must sit
    // immediately above the All-lists block it describes — NOT inside
    // the filter-bar at the top of the page (where it previously
    // visually preceded the 3-tile Featured rail, mismatching by 6
    // tiles against a 9-count claim). Pin both DOM-position invariants:
    // (1) mode-row is NOT a descendant of the filter-bar; (2) mode-row
    // is the immediate previous sibling of the All-lists slot in the
    // scope wrapper's child order.
    it('mode-row is NOT a descendant of the filter-bar', () => {
      render(
        <ListsFilterController
          counts={counts}
          featuredRail={<div data-testid="featured-stub">featured</div>}
          allLists={<div data-testid="all-stub">all</div>}
        />,
      )
      const bar = screen.getByTestId('lists-filter-bar')
      const modeRow = screen.getByTestId('lists-filter-mode-row')
      expect(bar.contains(modeRow)).toBe(false)
    })

    it('mode-row sits between featuredRail and allLists in scope child order', () => {
      render(
        <ListsFilterController
          counts={counts}
          featuredRail={<div data-testid="featured-stub">featured</div>}
          allLists={<div data-testid="all-stub">all</div>}
        />,
      )
      const scope = screen.getByTestId('lists-filter-scope')
      const children = Array.from(scope.children)
      const barIdx = children.findIndex(
        (c) => c.getAttribute('data-testid') === 'lists-filter-bar',
      )
      const featuredIdx = children.findIndex((c) => c.contains(screen.getByTestId('featured-stub')))
      const modeRowIdx = children.findIndex(
        (c) => c.getAttribute('data-testid') === 'lists-filter-mode-row',
      )
      const allIdx = children.findIndex((c) => c.contains(screen.getByTestId('all-stub')))
      // Exact reading order: bar → featured → mode-row → all-lists.
      expect(barIdx).toBe(0)
      expect(featuredIdx).toBe(1)
      expect(modeRowIdx).toBe(2)
      expect(allIdx).toBe(3)
    })

    it('mode-row is the immediate previous sibling of the allLists slot', () => {
      render(
        <ListsFilterController
          counts={counts}
          featuredRail={<div data-testid="featured-stub">featured</div>}
          allLists={<div data-testid="all-stub">all</div>}
        />,
      )
      const modeRow = screen.getByTestId('lists-filter-mode-row')
      const allStub = screen.getByTestId('all-stub')
      expect(modeRow.nextElementSibling).toBe(allStub)
    })
  })

  describe('empty-category chip suppression', () => {
    it('hides the era chip when counts.era === 0', () => {
      const emptyEra = {
        all: 12,
        tone: 5,
        structure: 2,
        craft: 4,
        era: 0,
        single: 1,
      }
      render(
        <ListsFilterController
          counts={emptyEra}
          allLists={<div>children</div>}
        />,
      )
      expect(screen.queryByTestId('lists-chip-era')).toBeNull()
      const chips = screen
        .getByTestId('lists-filter-bar')
        .querySelectorAll('button.chip')
      expect(chips).toHaveLength(5)
      const filters = Array.from(chips).map((c) =>
        c.getAttribute('data-filter'),
      )
      expect(filters).toEqual(['all', 'tone', 'structure', 'craft', 'single'])
    })

    it('hides every zero-count chip independently', () => {
      const onlyTone = {
        all: 7,
        tone: 7,
        structure: 0,
        craft: 0,
        era: 0,
        single: 0,
      }
      render(
        <ListsFilterController
          counts={onlyTone}
          allLists={<div>children</div>}
        />,
      )
      const filters = Array.from(
        screen
          .getByTestId('lists-filter-bar')
          .querySelectorAll('button.chip'),
      ).map((c) => c.getAttribute('data-filter'))
      expect(filters).toEqual(['all', 'tone'])
    })

    it('hides the structure chip when counts.structure === 0', () => {
      // Symmetric guard to the era zero-count case above: when no
      // structure-categoried theme is published, the chip is suppressed
      // so a reader doesn't click a chip that filters to an empty grid.
      const noStructure = {
        all: 10,
        tone: 4,
        structure: 0,
        craft: 4,
        era: 1,
        single: 1,
      }
      render(
        <ListsFilterController
          counts={noStructure}
          allLists={<div>children</div>}
        />,
      )
      expect(screen.queryByTestId('lists-chip-structure')).toBeNull()
      const filters = Array.from(
        screen
          .getByTestId('lists-filter-bar')
          .querySelectorAll('button.chip'),
      ).map((c) => c.getAttribute('data-filter'))
      expect(filters).toEqual(['all', 'tone', 'craft', 'era', 'single'])
    })

    it('always renders the all chip even when counts.all === 0', () => {
      const empty = {
        all: 0,
        tone: 0,
        structure: 0,
        craft: 0,
        era: 0,
        single: 0,
      }
      render(
        <ListsFilterController
          counts={empty}
          allLists={<div>children</div>}
        />,
      )
      expect(screen.queryByTestId('lists-chip-all')).not.toBeNull()
      const chips = screen
        .getByTestId('lists-filter-bar')
        .querySelectorAll('button.chip')
      expect(chips).toHaveLength(1)
    })
  })
})
