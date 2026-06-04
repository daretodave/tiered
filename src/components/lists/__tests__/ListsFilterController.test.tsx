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
      <ListsFilterController counts={counts}>
        <div>children</div>
      </ListsFilterController>,
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
      <ListsFilterController counts={counts}>
        <div>children</div>
      </ListsFilterController>,
    )
    const scope = screen.getByTestId('lists-filter-scope')
    expect(scope.getAttribute('data-active-filter')).toBe('all')
  })

  it('flips data-active-filter when a chip is clicked', () => {
    render(
      <ListsFilterController counts={counts}>
        <div>children</div>
      </ListsFilterController>,
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
      <ListsFilterController counts={counts}>
        <div>children</div>
      </ListsFilterController>,
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
      <ListsFilterController counts={counts}>
        <div>children</div>
      </ListsFilterController>,
    )
    const text = screen.getByTestId('lists-filter-mode').textContent ?? ''
    expect(text).not.toMatch(/^showing · all \d+ lists$/)
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
        <ListsFilterController counts={emptyEra}>
          <div>children</div>
        </ListsFilterController>,
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
        <ListsFilterController counts={onlyTone}>
          <div>children</div>
        </ListsFilterController>,
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
        <ListsFilterController counts={noStructure}>
          <div>children</div>
        </ListsFilterController>,
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
        <ListsFilterController counts={empty}>
          <div>children</div>
        </ListsFilterController>,
      )
      expect(screen.queryByTestId('lists-chip-all')).not.toBeNull()
      const chips = screen
        .getByTestId('lists-filter-bar')
        .querySelectorAll('button.chip')
      expect(chips).toHaveLength(1)
    })
  })
})
