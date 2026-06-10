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
      JSON.parse(window.localStorage.getItem('tiered_saved_lists') ?? '[]'),
    ).toEqual(['firsts'])

    fireEvent.click(btn)
    expect(btn.getAttribute('aria-pressed')).toBe('false')
    expect(
      JSON.parse(window.localStorage.getItem('tiered_saved_lists') ?? '[]'),
    ).toEqual([])
  })

  it('unsaved label scopes storage up-front via "Save (this device)" and renders no caption', () => {
    render(<ListDetailTools themeSlug="firsts" themeTitle="Firsts that hold up" />)
    const btn = screen.getByTestId('list-save')
    expect(btn.textContent).toMatch(/Save \(this device\)/)
    expect(btn.textContent).not.toMatch(/^Save list$/)
    expect(screen.queryByTestId('list-save-caption')).toBeNull()
  })

  it('post-click label reads "Saved" and surface includes a "this device" caption', () => {
    render(<ListDetailTools themeSlug="firsts" themeTitle="Firsts that hold up" />)
    const btn = screen.getByTestId('list-save')
    fireEvent.click(btn)
    expect(btn.textContent).toBe('Saved')
    const caption = screen.getByTestId('list-save-caption')
    expect(caption.textContent ?? '').toMatch(/this device/i)
  })

  it('initialises from existing localStorage state on mount', () => {
    window.localStorage.setItem(
      'tiered_saved_lists',
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

  // Critique pass-45 #384 bidirectional drift guard half (a): the
  // primary action row contains exactly Save + Share (no Suggest in
  // the row). The Suggest action now lives in <SuggestEntryCTA>; its
  // own test pins the editorial-footer slot. A regression that
  // re-introduces the Suggest button here trips this assertion at
  // unit time, before any e2e walks the page.
  it('primary action row contains only reader-scope Save + Share — no Suggest in the row (pass-45 #384)', () => {
    const { container } = render(
      <ListDetailTools themeSlug="firsts" themeTitle="Firsts that hold up" />,
    )
    const tools = screen.getByTestId('list-tools')
    expect(tools.querySelector('[data-testid="list-save"]')).not.toBeNull()
    expect(tools.querySelector('[data-testid="list-share"]')).not.toBeNull()
    expect(tools.querySelector('[data-testid="list-suggest"]')).toBeNull()
    expect(container.textContent ?? '').not.toMatch(/suggest an entry/i)
  })
})
