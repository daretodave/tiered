import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Show } from '@/content'
import { HomeHero } from '../HomeHero'

function survivor(overrides: Partial<Show> = {}): Show {
  return {
    slug: 'survivor',
    name: 'Survivor',
    palette: { primary: '#D55E36', ink: '#EFE2BD', paper: '#0E2A2A' },
    seasons: 47,
    status: 'airing',
    blurb: '47 seasons. One torch at a time.',
    tagline:
      "47 seasons of strangers on a beach. We've ranked every one.",
    tier: 'S',
    network: 'CBS',
    est_year: 2000,
    genre_tag: 'Reality competition',
    featured: true,
    ...overrides,
  }
}

const CANON_LABEL = 'April 2026'

describe('<HomeHero>', () => {
  it('renders the cover wordmark with the featured show name', () => {
    render(<HomeHero featured={survivor()} canonRevisedLabel={CANON_LABEL} />)
    const cover = screen.getByTestId('home-hero-cover')
    expect(cover.textContent).toContain('Survivor')
  })

  it('renders the cover tag "Currently featured"', () => {
    render(<HomeHero featured={survivor()} canonRevisedLabel={CANON_LABEL} />)
    expect(screen.getByTestId('home-hero-eyebrow').textContent).toMatch(
      /currently featured/i,
    )
  })

  it('cover bleeds the show palette via inline styles', () => {
    render(<HomeHero featured={survivor()} canonRevisedLabel={CANON_LABEL} />)
    const cover = screen.getByTestId('home-hero-cover') as HTMLDivElement
    expect(cover.style.background).toBe('rgb(14, 42, 42)')
    expect(cover.style.color).toBe('rgb(239, 226, 189)')
  })

  it('cover-sub prefers the longer tagline over the short blurb', () => {
    render(<HomeHero featured={survivor()} canonRevisedLabel={CANON_LABEL} />)
    const cover = screen.getByTestId('home-hero-cover')
    expect(cover.textContent).toContain('strangers on a beach')
  })

  it('cover-sub prefers card_tagline over tagline when present', () => {
    render(
      <HomeHero
        featured={survivor({
          card_tagline: 'The format that invented itself in episode one.',
        })}
        canonRevisedLabel={CANON_LABEL}
      />,
    )
    const cover = screen.getByTestId('home-hero-cover')
    expect(cover.textContent).toContain(
      'The format that invented itself in episode one.',
    )
    expect(cover.textContent).not.toContain('strangers on a beach')
  })

  it('go-pill links to /shows/<slug>', () => {
    render(<HomeHero featured={survivor()} canonRevisedLabel={CANON_LABEL} />)
    const go = screen.getByTestId('home-cover-go')
    expect(go.getAttribute('href')).toBe('/shows/survivor')
    expect(go.textContent).toContain('Survivor')
  })

  it('renders the stat strip with seasons + canon revised', () => {
    render(<HomeHero featured={survivor()} canonRevisedLabel={CANON_LABEL} />)
    const stats = screen.getByTestId('home-hero-stats')
    expect(stats.textContent).toContain('47')
    // Critique pass-44 (#379): the home featured tile labels the
    // per-show count as `Seasons in canon` (scope: the featured
    // show's canon length) to disambiguate from /shows hero's
    // catalog-aggregate `Seasons ranked` slot. Bidirectional pin
    // — positive: present; negative: the rejected `Seasons ranked`
    // is gone (so a future refactor that reverts it trips here).
    expect(stats.textContent).toContain('Seasons in canon')
    expect(stats.textContent).not.toContain('Seasons ranked')
    expect(stats.textContent).toContain('Canon revised')
    expect(screen.getByTestId('home-hero-canon-revised').textContent).toBe(
      CANON_LABEL,
    )
  })

  it('respects seasonsRanked override when supplied', () => {
    render(
      <HomeHero
        featured={survivor()}
        seasonsRanked={12}
        canonRevisedLabel={CANON_LABEL}
      />,
    )
    expect(screen.getByTestId('home-hero-stats').textContent).toContain('12')
  })

  it('renders blurb line breaks where the tagline contains a newline', () => {
    render(
      <HomeHero
        featured={survivor({ tagline: 'line one\nline two' })}
        canonRevisedLabel={CANON_LABEL}
      />,
    )
    const cover = screen.getByTestId('home-hero-cover')
    const subs = cover.querySelectorAll('.cover-sub br')
    expect(subs.length).toBe(1)
  })

  it('renders the locked headline + ranked-promise', () => {
    render(<HomeHero featured={survivor()} canonRevisedLabel={CANON_LABEL} />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1.textContent).toMatch(/The seasons,.*ranked\..*no spoilers\./)
  })

  it('CTAs link to /shows and /about', () => {
    render(<HomeHero featured={survivor()} canonRevisedLabel={CANON_LABEL} />)
    expect(screen.getByTestId('home-cta-shows').getAttribute('href')).toBe('/shows')
    expect(screen.getByTestId('home-cta-about').getAttribute('href')).toBe('/about')
  })

  // Critique pass-85 MED: the promotional cover card's show name is
  // a secondary label, not part of the page's content outline — the
  // hero title is the page's only heading. Bidirectional pin against
  // the h2-before-h1 heading-order break: positive — the h1 exists;
  // negative — the cover card contributes no heading role at all.
  it('renders a single h1 with no other heading roles (cover-name is not a heading)', () => {
    render(<HomeHero featured={survivor()} canonRevisedLabel={CANON_LABEL} />)
    const headings = screen.getAllByRole('heading')
    expect(headings).toHaveLength(1)
    expect(headings[0]?.tagName).toBe('H1')
  })

  it('renders the est-2026 eyebrow on the copy column', () => {
    render(<HomeHero featured={survivor()} canonRevisedLabel={CANON_LABEL} />)
    const hero = screen.getByTestId('home-hero')
    expect(hero.textContent).toContain('tiered.tv · est. 2026')
  })

  // critique pass-24 #269: the canonRevisedLabel is sourced from the
  // featured show's canon `last_revised`. When that field is absent
  // (canon without last_revised, or no canon at all) the stat cell
  // is hidden — mirrors the show-page hero behavior so the home
  // never invents a date the canon didn't claim.
  it('hides the Canon revised stat cell when label is null', () => {
    render(<HomeHero featured={survivor()} canonRevisedLabel={null} />)
    expect(screen.queryByTestId('home-hero-canon-revised')).toBeNull()
    expect(screen.getByTestId('home-hero-stats').textContent).not.toContain(
      'Canon revised',
    )
    // Seasons-in-canon cell still renders alongside the empty slot
    // (post-pass-44 #379 rotation; see the chrome-label test above).
    expect(screen.getByTestId('home-hero-stats').textContent).toContain(
      'Seasons in canon',
    )
  })

  it('renders the canon-revised cell verbatim from the supplied label', () => {
    // Regression pin against the prior derive-from-build-time path: the
    // rendered label must match the caller's input character-for-character
    // (no clock dependency, no month-name reformatting).
    render(
      <HomeHero featured={survivor()} canonRevisedLabel="May 2026" />,
    )
    expect(screen.getByTestId('home-hero-canon-revised').textContent).toBe(
      'May 2026',
    )
  })

  // Critique pass-49 MED (#411): the home lede must speak in the same
  // first-person editor voice the interior pages (show-page body,
  // themed-list lede, /about lede) already use. A stranger clicking
  // home → any interior surface in one click should meet one
  // narrator, not two. Bidirectional pin — positive: the lede reads
  // first-person ("I cover" / "I write") + second-person community
  // ("you vote"); negative: the prior third-person institutional
  // markers ("an editor", "the readers") are gone.
  it('renders the home lede in first-person editor voice (no institutional 3rd-person)', () => {
    render(<HomeHero featured={survivor()} canonRevisedLabel={CANON_LABEL} />)
    const blurb = screen.getByTestId('home-hero').textContent ?? ''
    expect(blurb).toMatch(/I cover/)
    expect(blurb).toMatch(/I write/)
    expect(blurb).toMatch(/you vote/i)
    expect(blurb).not.toMatch(/\ban editor\b/i)
    expect(blurb).not.toMatch(/\bthe readers\b/i)
  })
})
