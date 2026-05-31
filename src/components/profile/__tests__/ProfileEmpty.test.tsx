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

  // CRITIQUE pass 22 MED (#262): the self-view prose flips to
  // second-person framing ("your record") so the next-action prompt
  // and the CTA address the actual owner of the page.
  it('renders the second-person self-view empty-state sentence alongside the CTA', () => {
    render(
      <ProfileEmpty selfView={{ showName: 'Survivor', showHref: '/shows/survivor' }} />,
    )
    expect(screen.getByTestId('profile-empty').textContent).toBe(
      'Nothing on your record yet. Vote on a season and it will land here.',
    )
    expect(screen.getByTestId('profile-empty-cta')).toBeTruthy()
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

  // CRITIQUE pass 16 LOW (#217): the owner's own empty profile gets a
  // zeroed stat skeleton above the empty-state copy so a new authed
  // reader sees the *shape* of what will populate — in the same
  // treatment the populated profile uses. A stranger viewing an empty
  // profile must stay sparse (no owner scaffold).

  it('renders a zeroed stat skeleton on self-view', () => {
    render(
      <ProfileEmpty selfView={{ showName: 'Survivor', showHref: '/shows/survivor' }} />,
    )
    const stats = screen.getByTestId('profile-stats')
    expect(stats).toBeTruthy()
    // All three cells read zero — the shape of what will populate.
    expect(screen.getByTestId('profile-stat-comments').textContent).toContain('0')
    expect(screen.getByTestId('profile-stat-seasons').textContent).toContain('0')
    expect(screen.getByTestId('profile-stat-shows').textContent).toContain('0')
  })

  it('places the zeroed stat skeleton above the empty-state copy', () => {
    render(
      <ProfileEmpty selfView={{ showName: 'Survivor', showHref: '/shows/survivor' }} />,
    )
    const stats = screen.getByTestId('profile-stats')
    const empty = screen.getByTestId('profile-empty')
    // DOCUMENT_POSITION_FOLLOWING (4) → stats precedes empty in the DOM.
    expect(stats.compareDocumentPosition(empty) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    )
  })

  it('renders no stat skeleton on the stranger (non-self) empty view', () => {
    render(<ProfileEmpty />)
    expect(screen.queryByTestId('profile-stats')).toBeNull()
  })
})
