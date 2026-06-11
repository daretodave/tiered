import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ListRow } from '../ListRow'
import { show, theme } from './fixtures'

const today = new Date('2026-05-13T00:00:00Z')

describe('<ListRow>', () => {
  it('links to /themes/<slug> with data-slug', () => {
    render(
      <ListRow theme={theme()} shows={[show()]} today={today} />,
    )
    const row = screen.getByTestId('lists-row')
    expect(row.getAttribute('href')).toBe('/themes/firsts')
    expect(row.getAttribute('data-slug')).toBe('firsts')
  })

  it('renders the show-count + entry-count + status meta', () => {
    render(
      <ListRow
        theme={theme({ status: 'growing' })}
        shows={[show()]}
        today={today}
      />,
    )
    const row = screen.getByTestId('lists-row')
    // pass-40 #355: index card adopts the canonical `{N} shows · {M}
    // entries` shape — the show-count was missing from this surface
    // alone before the helper extraction.
    expect(row.textContent).toContain('1 show · 2 entries')
    expect(row.textContent).toContain('growing')
  })

  // Critique pass-40 #355 closure: shared invariant regex for the
  // canonical catalogue list-meta shape — sibling pins exist on
  // `<HomeListRow>`, `<FeaturedCard>`, `<ListDetailHero>`.
  it('meta line matches the canonical `{N} shows · {M} entries` shape (pass-40 #355)', () => {
    render(<ListRow theme={theme()} shows={[show()]} today={today} />)
    const meta = screen.getByTestId('lists-row-meta').textContent ?? ''
    // textContent collapses the `<br />` into adjacent strings; isolate
    // the first line (meta) before the status (second line).
    const firstLine = meta.split(/\s*(?:growing|stable list|updated|started)/i)[0]?.trim() ?? ''
    expect(firstLine).toMatch(/^\d+ shows? · \d+ entr(?:y|ies)$/i)
  })

  it('renders one bullet per unique show', () => {
    render(
      <ListRow
        theme={theme()}
        shows={[show(), show({ slug: 'top-chef', name: 'Top Chef' })]}
        today={today}
      />,
    )
    const bullets = screen
      .getByTestId('lists-row')
      .querySelectorAll('.bullet')
    expect(bullets).toHaveLength(2)
  })

  // Critique pass-40 #350: /themes affordance grammar — the 9 index
  // cards close with `read the list →` matching the 3 featured-card
  // close (#348 unified the rail; this row closes the index half).
  // Bidirectional drift guard: the verb-form CTA renders AND no bare
  // arrow orphan remains. A future refactor that drops the verb or
  // re-introduces a standalone `→` fails at unit time.
  describe('affordance grammar (critique pass-40 #350)', () => {
    it('renders the verb-form CTA `read the list →`', () => {
      render(<ListRow theme={theme()} shows={[show()]} today={today} />)
      const row = screen.getByTestId('lists-row')
      expect(row.textContent).toContain('read the list →')
    })

    it('renders no bare `→` orphan outside the CTA', () => {
      render(<ListRow theme={theme()} shows={[show()]} today={today} />)
      const row = screen.getByTestId('lists-row')
      const arrows = row.textContent?.match(/→/g) ?? []
      expect(arrows).toHaveLength(1)
      const arrowSpan = row.querySelector('.list-row-arrow')
      expect(arrowSpan?.textContent?.trim()).toBe('read the list →')
    })
  })

  // Critique pass-46 #397 sibling pin: the featured rail dropped the
  // duplicate paragraph by rendering a short pull; the index card
  // remains the canonical home for the long `theme.description`. A
  // future refactor that flips the index to also render the pull would
  // collapse the editorial split this closure introduced. The full body
  // is asserted here; the short-pull behaviour is pinned at
  // `FeaturedCard.test.tsx` → "blurb pull (critique pass-46 #397)".
  it('renders the full `theme.description` regardless of `featured_pull` (pass-46 #397)', () => {
    const fullDescription =
      'Closing runs that pay off the season they spent a dozen episodes building. The stakes feel earned, the last hour sits at the right altitude.'
    render(
      <ListRow
        theme={theme({
          description: fullDescription,
          featured_pull: 'A short pull that must not surface on the index.',
        })}
        shows={[show()]}
        today={today}
      />,
    )
    const row = screen.getByTestId('lists-row')
    const blurb = row.querySelector('.list-row-blurb')
    expect(blurb?.textContent).toBe(fullDescription)
    expect(row.textContent).not.toContain('A short pull that must not surface on the index.')
  })
})
