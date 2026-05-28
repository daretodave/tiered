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
})
