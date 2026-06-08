import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('/themes page module', () => {
  it('exports a default page component', async () => {
    const mod = await import('../page')
    expect(typeof mod.default).toBe('function')
  })

  it('exports generateMetadata', async () => {
    const mod = await import('../page')
    expect(typeof mod.generateMetadata).toBe('function')
  })

  it('document title is "Lists" — matches the user-facing label, not the route slug', async () => {
    const mod = await import('../page')
    const meta = mod.generateMetadata()
    expect(meta.title).toBe('Lists')
  })

  // Critique pass-27 / loop issue #291: the indexable meta description used
  // to read "Themed lists across every tiered.tv canon — best premieres,
  // best finales, …". Two drifts on the SEO surface: an overclaim ("every
  // canon" against a covered-shows count below the total) and generic SEO
  // labels instead of the real editorial list titles. The pair below is the
  // pin — negative guard catches the drift class, positive guard pins the
  // grounded language so future rewrites stay honest.
  it('meta description avoids overclaim + generic SEO labels (drift guard)', async () => {
    const mod = await import('../page')
    const meta = mod.generateMetadata()
    const description = String(meta.description ?? '')
    expect(description).not.toMatch(/best premieres|best finales|every .{0,12}canon/i)
    expect(description).toMatch(/Premieres that earned it|catalog/)
  })

  describe('featured-vs-index disjoint scope (critique pass-40 #353)', () => {
    // The /themes page used to filter `featured: true` slugs out of
    // the chip-filtered grid (`byCategoryRest`) so each list appeared
    // exactly once per page (rail + non-featured grid). The cost: the
    // chip mode-row scoped only 9 of 12 lists; clicking BY CRAFT
    // silently dropped the 2 craft lists in the featured rail. Pass-40
    // #353 dropped the filter so the grid covers the whole catalog;
    // featured tiles appear in both the rail AND the grid. These
    // cases pin the new contract: every catalog theme renders as a
    // grid row, and featured slugs are reachable from the chip filter.
    it('grid renders one row per theme — count matches the catalog total, NOT total-minus-featured', async () => {
      const [{ default: ThemesIndexPage }, content] = await Promise.all([
        import('../page'),
        import('@/content'),
      ])
      const { container } = render(<ThemesIndexPage />)
      const rows = container.querySelectorAll('[data-testid=lists-row]')
      const total = content.getAllThemes().length
      expect(rows.length).toBe(total)
    })

    it('featured slugs are reachable from the grid (BY CRAFT chip recovers featured craft lists)', async () => {
      const [{ default: ThemesIndexPage }, content] = await Promise.all([
        import('../page'),
        import('@/content'),
      ])
      const { container } = render(<ThemesIndexPage />)
      const rowSlugs = Array.from(
        container.querySelectorAll('[data-testid=lists-row]'),
      ).map((el) => el.getAttribute('data-slug'))
      const featured = content.getFeaturedThemes(
        content.LISTS_FEATURED_RAIL_LIMIT,
      )
      expect(featured.length).toBeGreaterThan(0)
      for (const t of featured) {
        expect(rowSlugs).toContain(t.slug)
      }
    })
  })
})
