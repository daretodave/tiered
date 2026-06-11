import { readFileSync } from 'node:fs'
import path from 'node:path'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FeaturedCard } from '../FeaturedCard'
import { show, theme } from './fixtures'

const today = new Date('2026-05-13T00:00:00Z')

describe('<FeaturedCard>', () => {
  // Critique pass-40 #355 closure: the tag previously rendered
  // `Cross-canon · 7 entries` / `Single-show · N entries`, conflating
  // *coverage scope* (cross-canon vs single-show) with the entry
  // count. Coverage scope is already declared by the bullet-cluster
  // above the line + the `/u/[handle]`-scoped `data-coverage`
  // attribute on `<HomeListsStack>`; the tag now adopts the canonical
  // `{N} shows · {M} entries` shape shared by home `<HomeListRow>`,
  // /themes index `<ListRow>`, and /themes/[theme] `<ListDetailHero>`.
  // The prior `Cross-canon` / `Single-show` literal is negatively
  // pinned below.
  it('renders `{N} shows · {M} entries` for a multi-show theme (pass-40 #355)', () => {
    render(
      <FeaturedCard
        theme={theme()}
        shows={[show(), show({ slug: 'top-chef', name: 'Top Chef' })]}
        today={today}
      />,
    )
    const meta = screen.getByTestId('lists-featured-meta').textContent ?? ''
    expect(meta).toMatch(/^\d+ shows? · \d+ entr(?:y|ies)$/i)
    expect(meta).toBe('2 shows · 2 entries')
  })

  it('renders `1 show · …` for a single-show theme (pass-40 #355)', () => {
    render(
      <FeaturedCard theme={theme()} shows={[show()]} today={today} />,
    )
    const meta = screen.getByTestId('lists-featured-meta').textContent ?? ''
    expect(meta).toBe('1 show · 2 entries')
  })

  it('never re-introduces the `Cross-canon · …` / `Single-show · …` conflation (pass-40 #355 negative pin)', () => {
    const multi = render(
      <FeaturedCard
        theme={theme()}
        shows={[show(), show({ slug: 'top-chef', name: 'Top Chef' })]}
        today={today}
      />,
    )
    const multiMeta =
      multi.getByTestId('lists-featured-meta').textContent ?? ''
    expect(multiMeta).not.toMatch(/cross-canon/i)
    expect(multiMeta).not.toMatch(/single-show/i)
    multi.unmount()
    const single = render(
      <FeaturedCard theme={theme()} shows={[show()]} today={today} />,
    )
    const singleMeta =
      single.getByTestId('lists-featured-meta').textContent ?? ''
    // The single-show variant must not echo the show *name* either —
    // the prior literal `Survivor · 2 entries` was the single-show
    // form of the same conflation.
    expect(singleMeta).not.toMatch(/Survivor/i)
  })

  it('renders one bullet per show', () => {
    render(
      <FeaturedCard
        theme={theme()}
        shows={[show(), show({ slug: 'top-chef', name: 'Top Chef' })]}
        today={today}
      />,
    )
    const bullets = screen
      .getByTestId('lists-featured-bullets')
      .querySelectorAll('.bullet')
    expect(bullets).toHaveLength(2)
  })

  it('applies .big class when big', () => {
    const { container } = render(
      <FeaturedCard theme={theme()} shows={[show()]} big today={today} />,
    )
    expect(container.querySelector('.feat-card.big')).toBeTruthy()
  })

  // Critique pass-35 #348 closure: the three featured-this-month
  // sibling cards previously rendered with two different CTAs (`read
  // the list →` on the first/big card, bare `read →` on the other
  // two), which read as accident rather than editorial intent across
  // visually-identical siblings. Unified on `read the list →` for
  // both variants. Bidirectional drift guard mirrors the #242 closure
  // pattern: positive assertion on the unified form + negative
  // assertion on the prior bare-verb form, so a future edit that
  // splits the CTA again fails at unit time.
  it('renders "read the list →" CTA on both big and small variants (pass-35 #348)', () => {
    const big = render(
      <FeaturedCard theme={theme()} shows={[show()]} big today={today} />,
    )
    const bigCta = big
      .getByTestId('lists-featured-card')
      .querySelector('.feat-foot b')
    expect(bigCta?.textContent).toBe('read the list →')
    big.unmount()
    const small = render(
      <FeaturedCard theme={theme()} shows={[show()]} today={today} />,
    )
    const smallCta = small
      .getByTestId('lists-featured-card')
      .querySelector('.feat-foot b')
    expect(smallCta?.textContent).toBe('read the list →')
  })

  it('never renders the bare "read →" CTA on either variant (pass-35 #348 negative pin)', () => {
    const big = render(
      <FeaturedCard theme={theme()} shows={[show()]} big today={today} />,
    )
    const bigCta = big
      .getByTestId('lists-featured-card')
      .querySelector('.feat-foot b')
    expect(bigCta?.textContent).not.toBe('read →')
    big.unmount()
    const small = render(
      <FeaturedCard theme={theme()} shows={[show()]} today={today} />,
    )
    const smallCta = small
      .getByTestId('lists-featured-card')
      .querySelector('.feat-foot b')
    expect(smallCta?.textContent).not.toBe('read →')
  })

  it('formats status from theme.status', () => {
    render(
      <FeaturedCard
        theme={theme({ status: 'updated', last_revised: '2026-05-10' })}
        shows={[show()]}
        today={today}
      />,
    )
    expect(screen.getByTestId('lists-featured-status').textContent).toBe(
      'updated this week',
    )
  })

  it('links to /themes/<slug>', () => {
    render(
      <FeaturedCard theme={theme()} shows={[show()]} today={today} />,
    )
    expect(
      screen.getByTestId('lists-featured-card').getAttribute('href'),
    ).toBe('/themes/firsts')
  })

  // Critique pass-46 #397 closure: the featured rail previously rendered
  // `theme.description` verbatim, the same ~35-word paragraph the index
  // `<ListRow>` renders below — a reader scanning /themes top-to-bottom
  // read three duplicate paragraphs in one viewport. The rail now
  // renders a short pull — the curator-authored `featured_pull` when
  // present, else `firstSentence(theme.description)` — so the long form
  // stays canonical at the index card (pinned at `ListRow.test.tsx`).
  // Bidirectional drift guard mirrors the #242 closure pattern.
  describe('blurb pull (critique pass-46 #397)', () => {
    const twoSentence =
      'Closing runs that pay off the season they spent a dozen episodes building. The stakes feel earned, the last hour sits at the right altitude.'
    const firstOnly =
      'Closing runs that pay off the season they spent a dozen episodes building.'

    it('renders `featured_pull` when present and does NOT render the full `description`', () => {
      render(
        <FeaturedCard
          theme={theme({
            featured_pull: 'Curator-authored short pull.',
            description: twoSentence,
          })}
          shows={[show()]}
          today={today}
        />,
      )
      const card = screen.getByTestId('lists-featured-card')
      const blurb = card.querySelector('.feat-blurb')
      expect(blurb?.textContent).toBe('Curator-authored short pull.')
      expect(card.textContent).not.toContain('the last hour sits at the right altitude')
    })

    it('falls back to the first sentence of `description` when `featured_pull` is absent and does NOT render the full body', () => {
      render(
        <FeaturedCard
          theme={theme({ description: twoSentence })}
          shows={[show()]}
          today={today}
        />,
      )
      const card = screen.getByTestId('lists-featured-card')
      const blurb = card.querySelector('.feat-blurb')
      expect(blurb?.textContent).toBe(firstOnly)
      expect(card.textContent).not.toContain('The stakes feel earned')
    })
  })
})

// Critique pass-38 #342 closure: the lifecycle status label on a
// featured tile previously rendered lowercase (`stable list`) because
// `.feat-foot` had no `text-transform`, while the sibling All-lists
// tile `.list-row-meta` rule applied uppercase. Same source string
// (`formatThemeStatus` literal), two casings on the same /themes page.
// The fix uppercases the status label by adding `text-transform:
// uppercase` to `.feat-foot`, and preserves the CTA's authored
// lowercase via `text-transform: none` on `.feat-foot b`. The CSS
// rules are pinned at source so a future refactor that drops either
// directive fails at unit time. Bidirectional drift guard mirrors
// the #242 closure pattern.
describe('lists.css `.feat-foot` casing pins (pass-38 #342)', () => {
  const css = readFileSync(
    path.resolve(process.cwd(), 'src/styles/lists.css'),
    'utf-8',
  )

  function extractRule(selector: string): string {
    const re = new RegExp(`${selector.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\s*\\{([^}]*)\\}`)
    const m = css.match(re)
    return m?.[1] ?? ''
  }

  it('`.feat-foot` declares `text-transform: uppercase` so the lifecycle status matches the All-lists `.list-row-meta` casing', () => {
    const body = extractRule('.feat-foot')
    expect(body).toMatch(/text-transform:\s*uppercase/)
  })

  it('`.feat-foot b` overrides with `text-transform: none` so the CTA copy ("read the list →") keeps its lowercase register', () => {
    const body = extractRule('.feat-foot b')
    expect(body).toMatch(/text-transform:\s*none/)
  })
})
