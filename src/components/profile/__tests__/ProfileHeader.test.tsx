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
})
