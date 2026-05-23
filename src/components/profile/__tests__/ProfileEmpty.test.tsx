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
      'No public activity yet. Votes and published comments will show up here.',
    )
  })

  it('carries the muted ink-2 class so the empty state reads as secondary chrome', () => {
    render(<ProfileEmpty />)
    expect(
      screen.getByTestId('profile-empty').classList.contains('text-ink-2'),
    ).toBe(true)
  })
})
