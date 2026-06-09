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
      'Lists revised',
    )
  })

  // Critique pass-38 → pass-39 (#347): chrome label discipline at the
  // /themes top-level index landing — the freshness slot labels as
  // `Lists revised` (verb-past, named referent — the lists corpus). The
  // sibling /shows hero labels its own slot as `Shows revised`
  // (post-#347). The two top-level index landings carry distinct
  // corpora; naming each by its own corpus stops the readers from
  // reading the two stat values (which can differ by a month) as the
  // same global timestamp drifting. Pass-38 #338 first aligned the
  // grammar (verb-past); pass-39 #347 differentiates the referent.
  // Bidirectional pin: assert the canonical `Lists revised` form is
  // present AND the rejected forms (`Last revised`, the ambiguous
  // `Index revised`) are gone, so a future refactor that swings the
  // label back fails at unit time.
  it('labels the freshness stat cell as `Lists revised` (not `Index revised` or `Last revised`) — pairs with /shows pass-39 #347', () => {
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
    const cell = screen.getByTestId('lists-stat-revised')
    const label = cell.querySelector('.lists-stat-key')
    expect(label?.textContent).toBe('Lists revised')
    // CSS uppercases the rendered label via `text-transform: uppercase`
    // on `.lists-stat-key`. Regex pin at the DOM source so the
    // assertion isn't fooled by case-folding.
    expect(label?.textContent).toMatch(/^Lists revised$/)
    expect(cell.textContent).not.toMatch(/last revised/i)
    expect(cell.textContent).not.toMatch(/index revised/i)
  })

  it('hero stat strip renders a single LISTS cell with the catalog total when featuredCount > 0 — featured is an overlay, not a partition (critique pass-40 #353)', () => {
    // Pass-40 #353 dropped the prior FEATURED + IN THE INDEX split:
    // it only existed as a workaround for the chip mode-row scoping
    // the non-featured grid. With the chips now operating on the
    // whole 12-list catalogue, "the index" === the whole catalog and
    // featured is a spotlight subset. The hero shows the total once
    // (named "Lists") and treats featured as an overlay descriptor
    // surfaced only in the lede.
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
    const total = screen.getByTestId('lists-stat-total')
    expect(total.textContent).toContain('12')
    expect(total.textContent).toContain('Lists')
    // Bidirectional drift guard: the disjoint-partition split must
    // never re-emerge — those test ids belong to the prior model.
    expect(screen.queryByTestId('lists-stat-featured')).toBeNull()
    expect(screen.queryByTestId('lists-stat-index')).toBeNull()
  })

  it('hero stat strip total matches stats.total (catalog-total invariant, no partition math)', () => {
    // Pass-40 #353 removed the additive partition (`featured + index
    // = total`); the new invariant is simpler — the lists-stat-total
    // cell shows stats.total verbatim, no arithmetic on the page.
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
    const totalVal = Number(
      screen
        .getByTestId('lists-stat-total')
        .querySelector('.lists-stat-val')?.textContent,
    )
    expect(totalVal).toBe(stats.total)
  })

  it('lede opener names the catalog total once and mentions featured as a spotlight overlay (critique pass-40 #353)', () => {
    // Pass-40 #353: the prior lede opener `<index> in the index,
    // <featured> featured this month — <total> I'd defend in a
    // group chat` framed featured and index as disjoint partitions
    // summing to total — but the chip grid now covers the whole
    // catalog, so "in the index" no longer means "minus featured".
    // The opener now names the total once and trails featured as an
    // overlay descriptor: `<total> lists I'd defend in a group
    // chat — <featured> featured this month.` Both component counts
    // named in prose; total tracks stats.total; the disjoint
    // `<n> in the index` clause is gone.
    // Pass-44 #375: the opener literal rotated from plural-we
    // (`we'd defend`) → singular (`I'd defend`) to match the
    // post-#306 singular-admission discipline across the rest of
    // the catalog. Test text below was updated in lockstep.
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
    const ledeText =
      screen.getByText(/I'd defend in a group chat/i).textContent ?? ''
    // Total tracks stats.total at the head of the opener.
    expect(ledeText).toMatch(
      new RegExp(`^${stats.total}\\s+lists\\s+I'd\\s+defend\\s+in\\s+a\\s+group\\s+chat\\b`, 'i'),
    )
    // Featured count surfaced as an overlay descriptor trailing the total.
    expect(ledeText).toMatch(
      new RegExp(`—\\s*${stats.featuredCount}\\s+featured\\s+this\\s+month\\b`, 'i'),
    )
    // Bidirectional drift guard: the disjoint-partition opener form
    // (`<n> in the index, <m> featured`) must never re-emerge.
    expect(ledeText).not.toMatch(/\d+\s+in\s+the\s+index,\s+\d+\s+featured/i)
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
      screen.getByText(/I'd defend in a group chat/i).textContent ?? ''
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
    expect(screen.getByText(/lists I'd defend in a group chat/i)).toBeTruthy()
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

  it('singularizes "one stays inside a single show" when singleShowCount is exactly 1', () => {
    // Pin the critique-pass-20 finding: the mixed-mode lede previously
    // hardcoded "some live inside one show" regardless of count. With
    // exactly one single-show list (today's 11/1 catalog), "some" reads
    // as ≥2 and contradicts the page's own SINGLE-SHOW · 1 header.
    // Pass-34 #324 follow-up: the singular-branch closer rotated from
    // `one lives inside one show` → `one stays inside a single show`
    // to drop the doubled bare-`one` parse-stumble; this case now pins
    // the new wording.
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
      screen.getByText(/one stays inside a single show/i),
    ).toBeTruthy()
    expect(screen.queryByText(/some live inside one show/i)).toBeNull()
  })

  it('keeps "some live inside one show" plural when singleShowCount > 1', () => {
    // Pin the plural-branch so a future catalog growth (2+ single-show
    // lists) keeps the same lede shape #133 / pass-20 fixed for the
    // count=1 case. The plural branch carries `some` + `one show`
    // (different lexical roots), so the pass-34 #324 doubled-bare-`one`
    // parse-stumble does not apply here — this branch retains its
    // existing wording.
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
    expect(screen.queryByText(/one stays inside a single show/i)).toBeNull()
  })

  it('singular-branch lede drops the doubled bare-"one" parse-stumble (critique-pass-34 #324)', () => {
    // Bidirectional drift guard for the pass-34 #324 rotation. The
    // prior wording `one lives inside one show` rendered two adjacent
    // bare `one` tokens with no syntactic disambiguator between the
    // two distinct referents (one LIST lives inside one SHOW), forcing
    // a re-parse on the lede of the most-trafficked themed-list catalog
    // page. Negative: the doubled bare-`one` clause must never re-emerge.
    // Positive: the lede must carry a disambiguating phrase — the
    // recommended rotation uses `single show`, and the regex also admits
    // `one-show` / `inside a show` so a future curator pass can land on
    // any of the disambiguated forms without tripping the pin.
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
    const ledeText =
      screen.getByText(/I'd defend in a group chat/i).textContent ?? ''
    expect(ledeText).not.toMatch(/\bone\b\s+lives\s+inside\s+\bone\b/i)
    expect(ledeText).toMatch(
      /\bsingle[- ]show\b|\bone[- ]show\b|\binside\s+a\s+show\b/i,
    )
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
    expect(screen.getByText(/lists I'd defend in a group chat/i)).toBeTruthy()
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

  // Critique pass-42 #355: the `STABLE LIST` eyebrow stamped on every
  // featured + index card was shipping without a first-paint definition
  // (twelve+ cards on /themes, no glossary, no tooltip, no hero-band
  // explainer). The closure adds a one-line hero-band gloss defining the
  // lifecycle once — the analog of the home page's `01 · CURATED
  // Editor's Canon` band. This pin asserts the gloss is rendered near
  // the lede AND carries one of the canonical defining phrases so a
  // future curator rewrite that drops the definition (regressing back to
  // an undefined `STABLE` label) fails verify, not the next reader pass.
  it('defines the STABLE eyebrow once at the hero level (critique pass-42 #355)', () => {
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
    const gloss = screen.getByTestId('lists-hero-stable-gloss')
    expect(gloss.textContent ?? '').toMatch(
      /stable.*editor|editor.*stable|editor-signed|not vote-driven/i,
    )
  })

  // Critique pass-44 #375: the /themes hero shipped two first-person
  // plural literals (`we'd defend in a group chat` opener + `when we
  // change our mind` gloss) while the rest of the catalog had
  // committed to singular admission via the pass-31 #306 cross-surface
  // byline drain (`tiered.tv editor` singular across every theme +
  // canon) and the `/about` `Built and operated by one person`
  // anchor. The closure rotates both literals to singular (`I'd
  // defend`, `when I change my mind`). Bidirectional pin: positive on
  // both new singular forms, negative on both retired plural forms,
  // so a future authoring pass that silently regresses either side
  // trips at unit time. Drop the pin only if the brand voice itself
  // pivots back to plural-we (a deliberate editorial decision, not a
  // refactor accident).
  it('renders /themes hero copy in singular admission voice (critique pass-44 #375)', () => {
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
    const ledeText =
      screen.getByText(/I'd defend in a group chat/i).textContent ?? ''
    expect(ledeText).toMatch(/I'd defend in a group chat/i)
    expect(ledeText).not.toMatch(/we'd defend in a group chat/i)
    const gloss = screen.getByTestId('lists-hero-stable-gloss')
    const glossText = gloss.textContent ?? ''
    expect(glossText).toMatch(/when I change my mind/i)
    expect(glossText).not.toMatch(/when we change our mind/i)
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
