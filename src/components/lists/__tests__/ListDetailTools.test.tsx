import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ListDetailTools } from '../ListDetailTools'

describe('<ListDetailTools>', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('save toggles localStorage and aria-pressed', () => {
    render(<ListDetailTools themeSlug="firsts" themeTitle="Firsts that hold up" />)
    const btn = screen.getByTestId('list-save')
    expect(btn.getAttribute('aria-pressed')).toBe('false')

    fireEvent.click(btn)

    expect(btn.getAttribute('aria-pressed')).toBe('true')
    expect(
      JSON.parse(window.localStorage.getItem('pantheon_saved_lists') ?? '[]'),
    ).toEqual(['firsts'])

    fireEvent.click(btn)
    expect(btn.getAttribute('aria-pressed')).toBe('false')
    expect(
      JSON.parse(window.localStorage.getItem('pantheon_saved_lists') ?? '[]'),
    ).toEqual([])
  })

  it('initialises from existing localStorage state on mount', () => {
    window.localStorage.setItem(
      'pantheon_saved_lists',
      JSON.stringify(['firsts', 'other']),
    )
    render(<ListDetailTools themeSlug="firsts" themeTitle="Firsts" />)
    const btn = screen.getByTestId('list-save')
    expect(btn.getAttribute('aria-pressed')).toBe('true')
  })

  it('share calls navigator.clipboard.writeText with the page URL', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })

    render(<ListDetailTools themeSlug="firsts" themeTitle="Firsts" />)
    fireEvent.click(screen.getByTestId('list-share'))
    expect(writeText).toHaveBeenCalledTimes(1)
    expect(writeText).toHaveBeenCalledWith(window.location.href)
  })

  it('suggest is a mailto link with subject including the theme title', () => {
    render(<ListDetailTools themeSlug="firsts" themeTitle="Firsts that hold up" />)
    const a = screen.getByTestId('list-suggest')
    expect(a.getAttribute('href')).toMatch(/^mailto:editors@pantheon\.app/)
    expect(a.getAttribute('href')).toContain(
      encodeURIComponent('Suggest entry: Firsts that hold up'),
    )
  })
})
