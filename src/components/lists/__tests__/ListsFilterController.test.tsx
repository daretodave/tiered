import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ListsFilterController } from '../ListsFilterController'

const counts = { all: 12, tone: 4, craft: 3, era: 2, single: 3 }

describe('<ListsFilterController>', () => {
  it('renders 5 chips with the right data-filter attrs', () => {
    render(
      <ListsFilterController counts={counts}>
        <div>children</div>
      </ListsFilterController>,
    )
    const chips = screen
      .getByTestId('lists-filter-bar')
      .querySelectorAll('button.chip')
    expect(chips).toHaveLength(5)
    const filters = Array.from(chips).map((c) => c.getAttribute('data-filter'))
    expect(filters).toEqual(['all', 'tone', 'craft', 'era', 'single'])
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

  it('shows "all 12 lists" mode text by default', () => {
    render(
      <ListsFilterController counts={counts}>
        <div>children</div>
      </ListsFilterController>,
    )
    expect(screen.getByTestId('lists-filter-mode').textContent).toContain(
      'all 12 lists',
    )
  })

  describe('empty-category chip suppression', () => {
    it('hides the era chip when counts.era === 0', () => {
      const emptyEra = { all: 12, tone: 7, craft: 4, era: 0, single: 1 }
      render(
        <ListsFilterController counts={emptyEra}>
          <div>children</div>
        </ListsFilterController>,
      )
      expect(screen.queryByTestId('lists-chip-era')).toBeNull()
      const chips = screen
        .getByTestId('lists-filter-bar')
        .querySelectorAll('button.chip')
      expect(chips).toHaveLength(4)
      const filters = Array.from(chips).map((c) =>
        c.getAttribute('data-filter'),
      )
      expect(filters).toEqual(['all', 'tone', 'craft', 'single'])
    })

    it('hides every zero-count chip independently', () => {
      const onlyTone = { all: 7, tone: 7, craft: 0, era: 0, single: 0 }
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

    it('always renders the all chip even when counts.all === 0', () => {
      const empty = { all: 0, tone: 0, craft: 0, era: 0, single: 0 }
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
