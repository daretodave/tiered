import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the byShow helper at the module boundary so we can assert
// the empty + populated rendering paths without spinning up a
// content tree.

vi.mock('@/lib/themes/byShow', () => ({
  themesContainingShow: vi.fn(),
}))

import { themesContainingShow } from '@/lib/themes/byShow'
import { FeaturedThemes } from '../FeaturedThemes'

const mockedThemesContainingShow = themesContainingShow as ReturnType<typeof vi.fn>

describe('<FeaturedThemes>', () => {
  beforeEach(() => {
    mockedThemesContainingShow.mockReset()
  })
  afterEach(() => {
    mockedThemesContainingShow.mockReset()
  })

  it('renders nothing when no themes reference the show', () => {
    mockedThemesContainingShow.mockReturnValue([])
    const { container } = render(<FeaturedThemes show="top-chef" />)
    expect(container.firstChild).toBeNull()
  })

  it('renders one link per theme containing the show', () => {
    mockedThemesContainingShow.mockReturnValue([
      {
        slug: 'survivor-pillars',
        title: 'Survivor: the load-bearing seasons',
        description: 'desc',
        entries: [{ show: 'survivor', season: 1, rank: 1, blurb: 'b' }],
        body_md: '',
      },
      {
        slug: 'firsts',
        title: 'Firsts that hold up',
        description: 'desc',
        entries: [{ show: 'survivor', season: 1, rank: 1, blurb: 'b' }],
        body_md: '',
      },
    ])
    render(<FeaturedThemes show="survivor" />)
    expect(screen.getByTestId('featured-themes')).toBeTruthy()
    const links = screen.getAllByTestId('featured-theme-link')
    expect(links.length).toBe(2)
    expect(links[0]?.getAttribute('href')).toBe('/themes/survivor-pillars')
    expect(links[1]?.getAttribute('href')).toBe('/themes/firsts')
  })
})
