import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ListsHero } from '../ListsHero'

describe('<ListsHero>', () => {
  it('renders the three stats from fixture data (no featured)', () => {
    render(
      <ListsHero
        stats={{
          total: 23,
          featuredCount: 0,
          totalEntries: 100,
          showsCovered: 3,
          crossCanonCount: 23,
          singleShowCount: 0,
          lastIndexRevision: '2026-05-01',
        }}
      />,
    )
    expect(screen.getByTestId('lists-stat-total').textContent).toContain('23')
    expect(screen.getByTestId('lists-stat-total').textContent).toContain('Lists')
    expect(screen.queryByTestId('lists-stat-featured')).toBeNull()
    expect(screen.queryByTestId('lists-stat-index')).toBeNull()
    expect(screen.getByTestId('lists-stat-shows').textContent).toContain('3')
    expect(screen.getByTestId('lists-stat-shows').textContent).toContain(
      'Shows covered',
    )
    expect(screen.getByTestId('lists-stat-revised').textContent).toContain(
      'May 2026',
    )
    expect(screen.getByTestId('lists-stat-revised').textContent).toContain(
      'Index last revised',
    )
  })

  it('splits the hero stat into FEATURED + IN THE INDEX when featuredCount > 0 (critique-pass-22 #261 — closes "12 LISTS vs 9 LISTS" mismatch)', () => {
    // The page's filter chip shows the catalog minus the featured rail
    // (`byCategoryRest`, post-#253 dedupe), so a single "12 LISTS" hero
    // stat reads as a contradiction when the chip below says "9 LISTS".
    // The split makes both numbers narratively continuous with the
    // page's structure (rail + index = catalog).
    render(
      <ListsHero
        stats={{
          total: 12,
          featuredCount: 3,
          totalEntries: 50,
          showsCovered: 6,
          crossCanonCount: 11,
          singleShowCount: 1,
          lastIndexRevision: '2026-05-01',
        }}
      />,
    )
    const featured = screen.getByTestId('lists-stat-featured')
    const index = screen.getByTestId('lists-stat-index')
    expect(featured.textContent).toContain('3')
    expect(featured.textContent).toContain('Featured')
    expect(index.textContent).toContain('9')
    expect(index.textContent).toContain('In the index')
    // The single-stat form must NOT also render — the split replaces it.
    expect(screen.queryByTestId('lists-stat-total')).toBeNull()
  })

  it('featured + index sums to the catalog total (split invariant)', () => {
    // Pin the math: critique pass-22's finding hinges on the user being
    // able to add the two visible numbers and recover the catalog size.
    const stats = {
      total: 12,
      featuredCount: 3,
      totalEntries: 50,
      showsCovered: 6,
      crossCanonCount: 11,
      singleShowCount: 1,
      lastIndexRevision: '2026-05-01',
    } as const
    render(<ListsHero stats={stats} />)
    const featuredVal = Number(
      screen
        .getByTestId('lists-stat-featured')
        .querySelector('.lists-stat-val')?.textContent,
    )
    const indexVal = Number(
      screen
        .getByTestId('lists-stat-index')
        .querySelector('.lists-stat-val')?.textContent,
    )
    expect(featuredVal + indexVal).toBe(stats.total)
  })

  it('lede shows the math inline when featured + index split — names both component counts and the total (critique-pass-23 #263 + pass-28 split-reveal)', () => {
    // Critique pass-23 pinned that lede === stats.total (the math
    // reconciles: 12 = 3 + 9). Pass-28 extended the same row: the
    // relationship between the lede total and the split tiles was
    // implied rather than shown, so a reader had to add to reconcile.
    // The lede now spells the math directly — `<indexCount> in the
    // index, <featuredCount> featured this month — <total> we'd defend
    // in a group chat.` — and this test pins (a) the total still
    // tracks stats.total (lede ↔ stats lockstep), (b) the lede prose
    // names BOTH component counts so a regression that drops either
    // half of the split-reveal fails at unit time.
    const stats = {
      total: 12,
      featuredCount: 3,
      totalEntries: 50,
      showsCovered: 6,
      crossCanonCount: 11,
      singleShowCount: 1,
      lastIndexRevision: '2026-05-01',
    } as const
    render(<ListsHero stats={stats} />)
    const featuredVal = Number(
      screen
        .getByTestId('lists-stat-featured')
        .querySelector('.lists-stat-val')?.textContent,
    )
    const indexVal = Number(
      screen
        .getByTestId('lists-stat-index')
        .querySelector('.lists-stat-val')?.textContent,
    )
    expect(featuredVal + indexVal).toBe(stats.total)
    const ledeText =
      screen.getByText(/we'd defend in a group chat/i).textContent ?? ''
    // Total still tracks stats.total — the math is shown, not removed.
    const totalMatch = ledeText.match(/(\d+)\s+we'd defend in a group chat/i)
    expect(totalMatch).not.toBeNull()
    expect(Number(totalMatch?.[1])).toBe(stats.total)
    // Split-reveal: both component counts named in prose alongside
    // their on-stat labels ("in the index" / "featured this month").
    expect(ledeText).toMatch(
      new RegExp(`\\b${indexVal}\\s+in\\s+the\\s+index\\b`, 'i'),
    )
    expect(ledeText).toMatch(
      new RegExp(`\\b${featuredVal}\\s+featured\\s+this\\s+month\\b`, 'i'),
    )
  })

  it('lede number tracks stats.total — never hardcoded to a stale literal (critique-pass-23 #263 negative pin)', () => {
    // Negative pin paired with the lockstep test above: when stats.total
    // changes (here, 7 instead of 12), the lede opener must read the new
    // total, not a stale literal. A regression that re-introduces a
    // hardcoded number ("12 lists" while the catalog ships 7) fails here.
    render(
      <ListsHero
        stats={{
          total: 7,
          featuredCount: 0,
          totalEntries: 30,
          showsCovered: 4,
          crossCanonCount: 7,
          singleShowCount: 0,
          lastIndexRevision: '2026-05-01',
        }}
      />,
    )
    const ledeText =
      screen.getByText(/we'd defend in a group chat/i).textContent ?? ''
    expect(ledeText).toMatch(/^7 lists\b/i)
    expect(ledeText).not.toMatch(/\b12\s+lists?\b/i)
  })

  it('falls back to a single "N LISTS" stat when featuredCount is 0', () => {
    // The split only earns its keep when the page has a featured rail. If
    // no theme carries `featured: true`, the chip below reads the full
    // catalog and the single-stat form matches; the split would invent a
    // zero ("0 FEATURED") with no on-page referent.
    render(
      <ListsHero
        stats={{
          total: 7,
          featuredCount: 0,
          totalEntries: 30,
          showsCovered: 4,
          crossCanonCount: 7,
          singleShowCount: 0,
          lastIndexRevision: '2026-05-01',
        }}
      />,
    )
    expect(screen.getByTestId('lists-stat-total').textContent).toContain('7')
    expect(screen.getByTestId('lists-stat-total').textContent).toContain('Lists')
    expect(screen.queryByTestId('lists-stat-featured')).toBeNull()
    expect(screen.queryByTestId('lists-stat-index')).toBeNull()
  })

  it('stamps the index-revised value as calendar "Month YYYY" — matches the /shows hero shape, never a bare year', () => {
    // Critique pass-19: /themes rendered "2026" while /shows rendered
    // "May 2026" — density mismatch across the two IA hubs. Pin the
    // month-year shape so a regression back to the year-only formatter
    // fails verify, not the next reader pass.
    render(
      <ListsHero
        stats={{
          total: 12,
          featuredCount: 0,
          totalEntries: 50,
          showsCovered: 6,
          crossCanonCount: 11,
          singleShowCount: 1,
          lastIndexRevision: '2026-05-01',
        }}
      />,
    )
    const val = screen
      .getByTestId('lists-stat-revised')
      .querySelector('.lists-stat-val')
    expect(val?.textContent?.trim()).toMatch(/^[A-Z][a-z]+ \d{4}$/)
    expect(val?.textContent?.trim()).not.toMatch(/^\d{4}$/)
  })

  it('puts the primary em accent on "Cross-canon" when every list is cross-canon', () => {
    const { container } = render(
      <ListsHero
        stats={{
          total: 12,
          featuredCount: 0,
          totalEntries: 50,
          showsCovered: 4,
          crossCanonCount: 12,
          singleShowCount: 0,
          lastIndexRevision: '2025-01-01',
        }}
      />,
    )
    const em = container.querySelector('h1.lists-hero-title em')
    expect(em?.textContent).toContain('Cross-canon')
    expect(em?.textContent).not.toMatch(/single-show/i)
    expect(screen.getByTestId('lists-hero')).toHaveAttribute(
      'data-coverage',
      'cross-canon',
    )
    expect(screen.getByText(/Some span the catalog/)).toBeTruthy()
    expect(screen.queryByText(/span every show/i)).toBeNull()
    expect(screen.queryByText(/pieces of editorial opinion/i)).toBeNull()
    expect(screen.getByText(/lists we'd defend in a group chat/i)).toBeTruthy()
  })

  it('reads "Cross-canon and single-show." when the catalog mixes both shapes', () => {
    const { container } = render(
      <ListsHero
        stats={{
          total: 12,
          featuredCount: 0,
          totalEntries: 50,
          showsCovered: 6,
          crossCanonCount: 11,
          singleShowCount: 1,
          lastIndexRevision: '2026-05-01',
        }}
      />,
    )
    const em = container.querySelector('h1.lists-hero-title em')
    expect(em?.textContent).toBe('Cross-canon and single-show.')
    expect(screen.getByTestId('lists-hero')).toHaveAttribute(
      'data-coverage',
      'mixed',
    )
    expect(screen.getByText(/Some span the catalog/)).toBeTruthy()
  })

  it('singularizes "one lives inside one show" when singleShowCount is exactly 1', () => {
    // Pin the critique-pass-20 finding: the mixed-mode lede previously
    // hardcoded "some live inside one show" regardless of count. With
    // exactly one single-show list (today's 11/1 catalog), "some" reads
    // as ≥2 and contradicts the page's own SINGLE-SHOW · 1 header.
    render(
      <ListsHero
        stats={{
          total: 12,
          featuredCount: 0,
          totalEntries: 50,
          showsCovered: 6,
          crossCanonCount: 11,
          singleShowCount: 1,
          lastIndexRevision: '2026-05-01',
        }}
      />,
    )
    expect(
      screen.getByText(/one lives inside one show/i),
    ).toBeTruthy()
    expect(screen.queryByText(/some live inside one show/i)).toBeNull()
  })

  it('keeps "some live inside one show" plural when singleShowCount > 1', () => {
    // Pin the plural-branch so a future catalog growth (2+ single-show
    // lists) keeps the same lede shape #133 / pass-20 fixed for the
    // count=1 case.
    render(
      <ListsHero
        stats={{
          total: 12,
          featuredCount: 0,
          totalEntries: 50,
          showsCovered: 6,
          crossCanonCount: 10,
          singleShowCount: 2,
          lastIndexRevision: '2026-05-01',
        }}
      />,
    )
    expect(screen.getByText(/some live inside one show/i)).toBeTruthy()
    expect(screen.queryByText(/one lives inside one show/i)).toBeNull()
  })

  it('singularizes "One spans the catalog" when crossCanonCount is exactly 1 in mixed mode', () => {
    // Symmetric to the singleShowCount=1 fix — if the catalog ever has
    // exactly one cross-canon list alongside multiple single-show ones,
    // the cross clause must singularize too.
    render(
      <ListsHero
        stats={{
          total: 12,
          featuredCount: 0,
          totalEntries: 50,
          showsCovered: 6,
          crossCanonCount: 1,
          singleShowCount: 11,
          lastIndexRevision: '2026-05-01',
        }}
      />,
    )
    expect(screen.getByText(/One spans the catalog/)).toBeTruthy()
    expect(screen.queryByText(/Some span the catalog/)).toBeNull()
  })

  it('never claims "Cross-canon." alone when any single-show list is present', () => {
    // Pin the critique-pass-12 finding: H1 coverage shape must not
    // disagree with the per-list mix.
    const { container } = render(
      <ListsHero
        stats={{
          total: 12,
          featuredCount: 0,
          totalEntries: 50,
          showsCovered: 6,
          crossCanonCount: 11,
          singleShowCount: 1,
          lastIndexRevision: '2026-05-01',
        }}
      />,
    )
    const em = container.querySelector('h1.lists-hero-title em')
    expect(em?.textContent).not.toBe('Cross-canon.')
    expect(em?.textContent).toContain('single-show')
  })

  it('swaps the accent and lede to single-canon-honest copy when every list is single-show', () => {
    const { container } = render(
      <ListsHero
        stats={{
          total: 12,
          featuredCount: 0,
          totalEntries: 50,
          showsCovered: 1,
          crossCanonCount: 0,
          singleShowCount: 12,
          lastIndexRevision: '2025-01-01',
        }}
      />,
    )
    const em = container.querySelector('h1.lists-hero-title em')
    expect(em?.textContent).not.toMatch(/cross-canon/i)
    expect(em?.textContent).toContain('Inside one canon')
    expect(screen.getByTestId('lists-hero')).toHaveAttribute(
      'data-coverage',
      'single-canon',
    )
    expect(screen.queryByText(/Some span the catalog/)).toBeNull()
    expect(
      screen.getByText(/Every list lives inside one canon today/),
    ).toBeTruthy()
    expect(screen.queryByText(/pieces of editorial opinion/i)).toBeNull()
    expect(screen.getByText(/lists we'd defend in a group chat/i)).toBeTruthy()
  })

  it('renders the "tiered.tv / Lists" eyebrow', () => {
    render(
      <ListsHero
        stats={{
          total: 1,
          featuredCount: 0,
          totalEntries: 1,
          showsCovered: 1,
          crossCanonCount: 0,
          singleShowCount: 1,
          lastIndexRevision: '2026-01-01',
        }}
      />,
    )
    expect(screen.getByText('tiered.tv / Lists')).toBeTruthy()
  })

  it('uses singular "List" key when total is 1', () => {
    render(
      <ListsHero
        stats={{
          total: 1,
          featuredCount: 0,
          totalEntries: 1,
          showsCovered: 1,
          crossCanonCount: 0,
          singleShowCount: 1,
          lastIndexRevision: '2026-01-01',
        }}
      />,
    )
    expect(screen.getByTestId('lists-stat-total').textContent).toContain('List')
  })
})
