import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Theme, ThemeCategory } from '@/content'
import { ListsAllSection } from '../ListsAllSection'
import { show, theme } from './fixtures'

const today = new Date('2026-05-13T00:00:00Z')

function build(byCategory: Partial<Record<ThemeCategory, Theme[]>>) {
  return {
    tone: [],
    craft: [],
    era: [],
    single: [],
    ...byCategory,
  } as Record<ThemeCategory, Theme[]>
}

describe('<ListsAllSection>', () => {
  it('renders one group per non-empty category', () => {
    render(
      <ListsAllSection
        byCategory={build({
          tone: [theme()],
          single: [theme({ slug: 'survivor-pillars', category: 'single' })],
        })}
        showsByTheme={{
          firsts: [show()],
          'survivor-pillars': [show()],
        }}
        today={today}
      />,
    )
    const groups = screen.getAllByTestId('lists-group')
    expect(groups).toHaveLength(2)
  })

  it('keeps editorial group order: tone → craft → era → single', () => {
    render(
      <ListsAllSection
        byCategory={build({
          tone: [theme({ slug: 'a', category: 'tone' })],
          craft: [theme({ slug: 'b', category: 'craft' })],
          era: [
            theme({
              slug: 'c',
              category: 'era',
            }),
          ],
          single: [theme({ slug: 'd', category: 'single' })],
        })}
        showsByTheme={{
          a: [show()],
          b: [show()],
          c: [show()],
          d: [show()],
        }}
        today={today}
      />,
    )
    const cats = screen
      .getAllByTestId('lists-group')
      .map((g) => g.getAttribute('data-category'))
    expect(cats).toEqual(['tone', 'craft', 'era', 'single'])
  })

  it('uses "Single-show tiers" head text — not "By single"', () => {
    render(
      <ListsAllSection
        byCategory={build({
          single: [theme({ slug: 'd', category: 'single' })],
        })}
        showsByTheme={{ d: [show()] }}
        today={today}
      />,
    )
    expect(screen.getByText(/Single-show tiers/i)).toBeTruthy()
  })

  it('returns null when every category is empty', () => {
    const { container } = render(
      <ListsAllSection
        byCategory={build({})}
        showsByTheme={{}}
        today={today}
      />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders one row per theme with data-slug', () => {
    render(
      <ListsAllSection
        byCategory={build({
          tone: [
            theme({ slug: 'a', category: 'tone' }),
            theme({ slug: 'b', category: 'tone' }),
          ],
        })}
        showsByTheme={{ a: [show()], b: [show()] }}
        today={today}
      />,
    )
    const rows = screen.getAllByTestId('lists-row')
    expect(rows.map((r) => r.getAttribute('data-slug'))).toEqual(['a', 'b'])
  })

  it('lists-section-meta renders the subhead with a straight ASCII apostrophe (critique pass-24 #275)', () => {
    // Bidirectional pin: the .lists-section-meta surface uppercases
    // via CSS `text-transform`, where a curly U+2019 reads as a
    // typographic inconsistency against every other apostrophe in
    // the lists family. Guard against regression back to the curly
    // form (the prior `&rsquo;` literal).
    const { container } = render(
      <ListsAllSection
        byCategory={build({
          tone: [theme({ slug: 'a', category: 'tone' })],
        })}
        showsByTheme={{ a: [show()] }}
        today={today}
      />,
    )
    const meta = container.querySelector('.lists-section-meta')
    expect(meta?.textContent).toBe("Organized by what they're admiring")
    expect(meta?.textContent).not.toMatch(/’/)
  })
})
