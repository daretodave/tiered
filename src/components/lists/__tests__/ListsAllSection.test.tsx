import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Theme, ThemeCategory } from '@/content'
import { ListsAllSection } from '../ListsAllSection'
import { show, theme } from './fixtures'

const today = new Date('2026-05-13T00:00:00Z')

function build(byCategory: Partial<Record<ThemeCategory, Theme[]>>) {
  return {
    tone: [],
    structure: [],
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

  it('keeps editorial group order: tone → structure → craft → era → single', () => {
    // `structure` was split out of `tone` at critique pass-31 — see
    // the matching rationale on `themeCategorySchema` in
    // src/content/schemas.ts. The order pin here is lockstep with
    // FILTER_KEYS in themes-format.ts; a future hoist or reorder
    // must touch both files together (and this test will fail until
    // they agree).
    render(
      <ListsAllSection
        byCategory={build({
          tone: [theme({ slug: 'a', category: 'tone' })],
          structure: [theme({ slug: 's', category: 'structure' })],
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
          s: [show()],
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
    expect(cats).toEqual(['tone', 'structure', 'craft', 'era', 'single'])
  })

  it('renders a "By structure" head when structure themes exist (critique pass-31 split from tone)', () => {
    // Bidirectional pin: when the byCategory map carries `structure`
    // entries, the rendered head reads `By structure` (not `By tone`).
    // Regression guard against a future label-merge that would re-tag
    // structural cuts as tonal — which is what pass-31 flagged in the
    // first place.
    render(
      <ListsAllSection
        byCategory={build({
          structure: [theme({ slug: 'reunion', category: 'structure' })],
        })}
        showsByTheme={{ reunion: [show()] }}
        today={today}
      />,
    )
    const head = screen.getByText(/By structure/i)
    expect(head).toBeTruthy()
    expect(head.textContent ?? '').not.toMatch(/By tone/i)
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
