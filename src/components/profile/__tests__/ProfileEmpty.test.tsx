import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProfileEmpty } from '../ProfileEmpty'

// `<ProfileEmpty>` is the empty-state for /u/[handle] — shown when a
// real (handle-resolved) member has no published comments and no
// live votes. The page renders the empty state but stays
// `noIndex:true` (a thin profile must not enter the index), so the
// component's *exact* contract — a single <p> with the empty
// testid and the canonical copy — is load-bearing.

describe('<ProfileEmpty>', () => {
  it('renders a <p> carrying the empty testid', () => {
    render(<ProfileEmpty />)
    const empty = screen.getByTestId('profile-empty')
    expect(empty.tagName).toBe('P')
  })

  // CRITIQUE pass 22 MED (#262): the stranger view (no `selfView`)
  // reads the third-person status — no second-person prose
  // addressed at the wrong viewer. Owner branch keeps the
  // second-person prompt below.
  it('renders the canonical stranger-view empty-state copy verbatim', () => {
    render(<ProfileEmpty />)
    expect(screen.getByTestId('profile-empty').textContent).toBe(
      'No votes on the public record yet.',
    )
  })

  // CRITIQUE pass 22 MED (#262) negative pin: the stranger branch
  // must never address the viewer in the second person, since the
  // record being viewed isn't theirs.
  it('does not address the viewer with "your record" in the stranger view (regression guard for #262)', () => {
    render(<ProfileEmpty />)
    const text = screen.getByTestId('profile-empty').textContent ?? ''
    expect(text).not.toMatch(/your record/i)
  })

  // CRITIQUE pass 18 MED (#238): the empty-state prose advertises
  // only the surface the single CTA opens. The "weigh in on a thread"
  // verb was naming a second door the CTA can't open — narrowed away
  // so the promise matches the action.
  it('does not name a thread/weigh-in verb in the prose (no second-door advertising)', () => {
    render(<ProfileEmpty />)
    const text = screen.getByTestId('profile-empty').textContent ?? ''
    expect(text.toLowerCase()).not.toContain('thread')
    expect(text.toLowerCase()).not.toContain('weigh in')
  })

  // CRITIQUE pass 20 MED (#247): the live vote mechanic is single-binary
  // ("Does this belong in the community top 10?"), not pairwise. Pass-19
  // #240 scrubbed the pairwise framing from the home explainer; this
  // surface — the only place that explicitly tells a member how to
  // populate their profile — must not regress back to "season pair".
  it('does not promise a pairwise vote in the prose (regression guard for #247)', () => {
    render(<ProfileEmpty />)
    const text = screen.getByTestId('profile-empty').textContent ?? ''
    expect(text).not.toMatch(/pair/i)
  })

  it('carries the muted ink-2 class so the empty state reads as secondary chrome', () => {
    render(<ProfileEmpty />)
    expect(
      screen.getByTestId('profile-empty').classList.contains('text-ink-2'),
    ).toBe(true)
  })

  // CRITIQUE pass 10 LOW: the rhetorical "Vote on a season" prompt
  // becomes a concrete one on self-view. The CTA is opt-in (the
  // stranger-viewing-an-empty-profile path renders no CTA).

  it('renders no CTA when no selfView prop is passed (stranger view)', () => {
    render(<ProfileEmpty />)
    expect(screen.queryByTestId('profile-empty-cta')).toBeNull()
  })

  it('renders the self-view CTA linking to the featured show', () => {
    render(
      <ProfileEmpty selfView={{ showName: 'Survivor', showHref: '/shows/survivor' }} />,
    )
    const cta = screen.getByTestId('profile-empty-cta')
    expect(cta.tagName).toBe('A')
    expect(cta.getAttribute('href')).toBe('/shows/survivor')
    expect(cta.textContent).toBe('Start with Survivor →')
  })

  it('quotes the show name verbatim in the CTA copy (no hardcoded "Survivor")', () => {
    render(
      <ProfileEmpty selfView={{ showName: 'Top Chef', showHref: '/shows/top-chef' }} />,
    )
    expect(screen.getByTestId('profile-empty-cta').textContent).toBe(
      'Start with Top Chef →',
    )
    expect(screen.getByTestId('profile-empty-cta').getAttribute('href')).toBe(
      '/shows/top-chef',
    )
  })

  // CRITIQUE pass 22 MED (#262) + pass 28 MED (#293): the self-view
  // prose stays second-person ("your record") so the next-action
  // prompt and the CTA address the actual owner of the page; pass 28
  // swapped the prior two-sentence admin-style framing ("Nothing on
  // your record yet. Vote on a season and it will land here.") for a
  // single warm editorial lede that restores the bearings voice on
  // the only surface previously missing it.
  it('renders the self-view editorial lede alongside the CTA (#262 + #293)', () => {
    render(
      <ProfileEmpty selfView={{ showName: 'Survivor', showHref: '/shows/survivor' }} />,
    )
    expect(screen.getByTestId('profile-empty').textContent).toBe(
      'New here. Cast one vote and your record starts writing itself.',
    )
    expect(screen.getByTestId('profile-empty-cta')).toBeTruthy()
  })

  // CRITIQUE pass 28 MED (#293) negative pin: the prior admin-style
  // two-sentence framing must not regress. A future edit that
  // reaches back for "Nothing on your record yet" or "Vote on a
  // season and it will land here" trips the unit gate.
  it('does not regress to the prior two-sentence admin-style framing (#293)', () => {
    render(
      <ProfileEmpty selfView={{ showName: 'Survivor', showHref: '/shows/survivor' }} />,
    )
    const text = screen.getByTestId('profile-empty').textContent ?? ''
    expect(text).not.toMatch(/nothing on your record yet/i)
    expect(text).not.toMatch(/it will land here/i)
  })

  // CRITIQUE pass 22 MED (#262) negative pin: the self branch must
  // never reach for the third-person "public record" framing — that
  // belongs to the stranger view above.
  it('does not address the owner with "the public record" in the self view (regression guard for #262)', () => {
    render(
      <ProfileEmpty selfView={{ showName: 'Survivor', showHref: '/shows/survivor' }} />,
    )
    const text = screen.getByTestId('profile-empty').textContent ?? ''
    expect(text).not.toMatch(/the public record/i)
  })

  // CRITIQUE pass 28 MED (#293): the prior pass-16 #217 zeroed
  // stat-tile skeleton on self-view was reverted — stacking
  // `0 SEASONS VOTED / 0 COMMENTS / 0 SHOWS VOTED ON` above the
  // empty-state copy surfaced six pieces of zero/absence before the
  // CTAs, reading as an admin screen rather than an editorial
  // product. The stat tile row is now reserved for accounts with at
  // least one vote (the populated branch in
  // `src/app/(default)/u/[handle]/page.tsx`); the empty branch
  // leads with a single warm editorial lede + CTAs only. The
  // stranger branch (no `selfView`) stays sparse for the same
  // reason.

  it('renders no stat skeleton on self-view (#293 — pass-16 #217 reverted)', () => {
    render(
      <ProfileEmpty selfView={{ showName: 'Survivor', showHref: '/shows/survivor' }} />,
    )
    expect(screen.queryByTestId('profile-stats')).toBeNull()
  })

  it('renders no stat skeleton on the stranger (non-self) empty view', () => {
    render(<ProfileEmpty />)
    expect(screen.queryByTestId('profile-stats')).toBeNull()
  })

  // CRITIQUE pass 26 LOW (#285): the self-view empty state used to
  // render only the featured-show CTA, leaving a signed-in reader
  // with zero activity no path to the rest of the 13-show catalog.
  // The secondary `Browse all shows →` link points at `/shows` so
  // the empty state offers the catalog without turning into a menu.
  // The stranger branch stays sparse (no CTA leakage on someone
  // else's record).
  it('renders the secondary catalog CTA linking to /shows on self-view', () => {
    render(
      <ProfileEmpty selfView={{ showName: 'Survivor', showHref: '/shows/survivor' }} />,
    )
    const catalogCta = screen.getByTestId('profile-empty-cta-catalog')
    expect(catalogCta.tagName).toBe('A')
    expect(catalogCta.getAttribute('href')).toBe('/shows')
    expect(catalogCta.textContent).toBe('Browse all shows →')
  })

  it('renders BOTH the featured-show CTA and the catalog CTA in the self-view branch (#285)', () => {
    render(
      <ProfileEmpty selfView={{ showName: 'Survivor', showHref: '/shows/survivor' }} />,
    )
    expect(screen.getByTestId('profile-empty-cta').textContent).toMatch(
      /Start with Survivor/i,
    )
    expect(screen.getByTestId('profile-empty-cta-catalog').textContent).toMatch(
      /Browse all shows/i,
    )
  })

  it('renders no catalog CTA on the stranger (non-self) empty view (#285 regression guard)', () => {
    render(<ProfileEmpty />)
    expect(screen.queryByTestId('profile-empty-cta-catalog')).toBeNull()
  })
})
