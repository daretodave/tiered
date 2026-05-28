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

  it('renders the canonical empty-state copy verbatim', () => {
    render(<ProfileEmpty />)
    expect(screen.getByTestId('profile-empty').textContent).toBe(
      'Nothing on the public record yet. Vote on a season pair, weigh in on a thread, and it will land here.',
    )
  })

  it('carries the muted ink-2 class so the empty state reads as secondary chrome', () => {
    render(<ProfileEmpty />)
    expect(
      screen.getByTestId('profile-empty').classList.contains('text-ink-2'),
    ).toBe(true)
  })

  // CRITIQUE pass 10 LOW: the rhetorical "Vote on a season pair"
  // prompt becomes a concrete one on self-view. The CTA is opt-in
  // (the stranger-viewing-an-empty-profile path renders no CTA).

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

  it('keeps the canonical empty-state sentence alongside the CTA on self-view', () => {
    render(
      <ProfileEmpty selfView={{ showName: 'Survivor', showHref: '/shows/survivor' }} />,
    )
    expect(screen.getByTestId('profile-empty').textContent).toBe(
      'Nothing on the public record yet. Vote on a season pair, weigh in on a thread, and it will land here.',
    )
    expect(screen.getByTestId('profile-empty-cta')).toBeTruthy()
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
