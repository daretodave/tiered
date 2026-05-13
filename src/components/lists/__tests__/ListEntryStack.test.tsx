import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Show } from '@/content'
import { ListEntryStack } from '../ListEntryStack'
import { show, theme } from './fixtures'

function showsMap(shows: Show[]): Map<string, Show> {
  return new Map(shows.map((s) => [s.slug, s]))
}

describe('<ListEntryStack>', () => {
  it('renders one row per entry, ordered by rank ascending', () => {
    render(
      <ListEntryStack
        theme={theme({
          entries: [
            { show: 'survivor', season: 41, rank: 2, title: 'Second.', blurb: 'b' },
            { show: 'survivor', season: 1, rank: 1, title: 'First.', blurb: 'a' },
          ],
        })}
        showsBySlug={showsMap([show()])}
      />,
    )
    const rows = screen.getAllByTestId('list-entry')
    expect(rows).toHaveLength(2)
    expect(rows[0]?.getAttribute('data-rank')).toBe('1')
    expect(rows[1]?.getAttribute('data-rank')).toBe('2')
    expect(rows[0]?.textContent).toContain('First.')
  })

  it('zero-pads the rank to two digits', () => {
    render(
      <ListEntryStack
        theme={theme({
          entries: [
            { show: 'survivor', season: 1, rank: 1, title: 'A.', blurb: 'a' },
            { show: 'survivor', season: 9, rank: 9, title: 'B.', blurb: 'b' },
            { show: 'survivor', season: 12, rank: 12, title: 'C.', blurb: 'c' },
          ],
        })}
        showsBySlug={showsMap([show()])}
      />,
    )
    const ranks = screen
      .getAllByTestId('list-entry')
      .map((row) => row.querySelector('.entry-rank')?.textContent)
    expect(ranks).toEqual(['#01', '#09', '#12'])
  })

  it('uses the show palette primary on the bullet', () => {
    const survivor = show({ slug: 'survivor', name: 'Survivor' })
    render(
      <ListEntryStack
        theme={theme()}
        showsBySlug={showsMap([survivor])}
      />,
    )
    const bullets = screen
      .getAllByTestId('list-entry')
      .map((row) => row.querySelector('.bullet') as HTMLElement | null)
    expect(bullets[0]?.style.background).toBeTruthy()
  })

  it('links each row to /shows/{show}/season/{n}', () => {
    render(
      <ListEntryStack
        theme={theme({
          entries: [
            { show: 'survivor', season: 41, rank: 1, title: 'T', blurb: 'b' },
          ],
        })}
        showsBySlug={showsMap([show()])}
      />,
    )
    const link = screen.getByTestId('list-entry').querySelector('a')
    expect(link?.getAttribute('href')).toBe('/shows/survivor/season/41')
  })

  it('falls back to a derived "SNN" season label when none is provided', () => {
    render(
      <ListEntryStack
        theme={theme({
          entries: [
            { show: 'survivor', season: 3, rank: 1, title: 'T', blurb: 'b' },
          ],
        })}
        showsBySlug={showsMap([show()])}
      />,
    )
    expect(screen.getByTestId('list-entry').textContent).toContain('S03')
  })

  it('honors season_label when present', () => {
    render(
      <ListEntryStack
        theme={theme({
          entries: [
            {
              show: 'survivor',
              season: 7,
              rank: 1,
              title: 'T',
              blurb: 'b',
              season_label: 'S07 · Pearl Islands',
            },
          ],
        })}
        showsBySlug={showsMap([show()])}
      />,
    )
    expect(screen.getByTestId('list-entry').textContent).toContain(
      'Pearl Islands',
    )
  })

  it('uses the show slug fallback when the loader does not know the show', () => {
    render(
      <ListEntryStack
        theme={theme({
          entries: [
            {
              show: 'unknown-show',
              season: 1,
              rank: 1,
              title: 'T',
              blurb: 'b',
            },
          ],
        })}
        showsBySlug={showsMap([])}
      />,
    )
    expect(screen.getByTestId('list-entry').textContent).toContain('Unknown Show')
  })

  it('section heading reads "The {N}, in order."', () => {
    render(
      <ListEntryStack
        theme={theme()}
        showsBySlug={showsMap([show()])}
      />,
    )
    expect(
      screen.getByRole('heading', { level: 2 }).textContent,
    ).toMatch(/The 2, in order\./)
  })
})
