import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProfileHeader } from '../ProfileHeader'

describe('<ProfileHeader>', () => {
  it('renders the handle and member-since', () => {
    render(
      <ProfileHeader
        handle="dave"
        displayName="Dave"
        memberSince="May 2026"
      />,
    )
    expect(screen.getByTestId('profile-handle').textContent).toBe('@dave')
    expect(screen.getByTestId('profile-display-name').textContent).toBe('Dave')
    expect(screen.getByTestId('profile-member-since').textContent).toContain(
      'May 2026',
    )
  })

  it('omits the display name when absent', () => {
    render(
      <ProfileHeader handle="dave" displayName={null} memberSince="May 2026" />,
    )
    expect(screen.queryByTestId('profile-display-name')).toBeNull()
  })

  it('omits the self-view eyebrow by default', () => {
    render(
      <ProfileHeader handle="dave" displayName={null} memberSince="May 2026" />,
    )
    expect(screen.queryByTestId('profile-self-eyebrow')).toBeNull()
  })

  it('omits the self-view eyebrow when isSelfView=false', () => {
    render(
      <ProfileHeader
        handle="dave"
        displayName={null}
        memberSince="May 2026"
        isSelfView={false}
      />,
    )
    expect(screen.queryByTestId('profile-self-eyebrow')).toBeNull()
  })

  // CRITIQUE pass 22 MED (#262): the stranger view used to ship no
  // eyebrow at all, leaving the page bare while the empty state
  // below addressed the wrong viewer. The stranger branch now
  // surfaces `@{handle}'s record` so the visitor knows whose record
  // they are reading, distinct from the owner's `Your record` cue.

  it('renders the stranger-view eyebrow naming the handle by default', () => {
    render(
      <ProfileHeader handle="dave" displayName={null} memberSince="May 2026" />,
    )
    const eyebrow = screen.getByTestId('profile-stranger-eyebrow')
    expect(eyebrow.textContent).toBe('@dave’s record')
    // Eyebrow precedes the H1 in document order so screen readers
    // announce the ownership cue before the handle.
    expect(
      eyebrow.compareDocumentPosition(screen.getByTestId('profile-handle')),
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })

  it('renders the stranger-view eyebrow when isSelfView=false', () => {
    render(
      <ProfileHeader
        handle="dave"
        displayName={null}
        memberSince="May 2026"
        isSelfView={false}
      />,
    )
    expect(screen.getByTestId('profile-stranger-eyebrow').textContent).toBe(
      '@dave’s record',
    )
  })

  it('omits the stranger-view eyebrow when isSelfView=true', () => {
    render(
      <ProfileHeader
        handle="dave"
        displayName={null}
        memberSince="May 2026"
        isSelfView
      />,
    )
    expect(screen.queryByTestId('profile-stranger-eyebrow')).toBeNull()
  })

  it('quotes the handle verbatim in the stranger-view eyebrow (no hardcoded handle)', () => {
    render(
      <ProfileHeader
        handle="someone-else"
        displayName={null}
        memberSince="May 2026"
      />,
    )
    expect(screen.getByTestId('profile-stranger-eyebrow').textContent).toBe(
      '@someone-else’s record',
    )
  })

  it('renders the self-view eyebrow when isSelfView=true', () => {
    render(
      <ProfileHeader
        handle="dave"
        displayName={null}
        memberSince="May 2026"
        isSelfView
      />,
    )
    const eyebrow = screen.getByTestId('profile-self-eyebrow')
    // CRITIQUE pass 13 fix: the owner-view needs an ownership cue
    // distinct from the stranger-view, sitting above the @handle H1.
    expect(eyebrow.textContent).toBe('Your record')
    // Eyebrow precedes the H1 in document order so screen readers
    // announce the ownership cue before the handle.
    expect(
      eyebrow.compareDocumentPosition(screen.getByTestId('profile-handle')),
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    // CRITIQUE pass 15 fix: the cue stays, but its register softens
    // from an all-caps mono stamp to a quiet sentence-case label so
    // it reads as peer voice, not a CMS section-header.
    expect(eyebrow.className).not.toContain('uppercase')
  })

  // CRITIQUE pass 22 MED (#262): exactly one ownership eyebrow at a
  // time — the self and stranger branches are mutually exclusive so
  // a regression that double-renders both fails at unit time.
  it('renders exactly one ownership eyebrow (self xor stranger) in either view', () => {
    const { rerender } = render(
      <ProfileHeader
        handle="dave"
        displayName={null}
        memberSince="May 2026"
        isSelfView
      />,
    )
    expect(screen.queryAllByTestId('profile-self-eyebrow')).toHaveLength(1)
    expect(screen.queryAllByTestId('profile-stranger-eyebrow')).toHaveLength(0)
    rerender(
      <ProfileHeader
        handle="dave"
        displayName={null}
        memberSince="May 2026"
        isSelfView={false}
      />,
    )
    expect(screen.queryAllByTestId('profile-self-eyebrow')).toHaveLength(0)
    expect(screen.queryAllByTestId('profile-stranger-eyebrow')).toHaveLength(1)
  })
})
