import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { ThemeToggle } from '../ThemeToggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme')
    window.localStorage.clear()
  })

  it('mounts reflecting the document data-theme attribute (defaults to dark)', () => {
    render(<ThemeToggle />)
    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('aria-label', 'Switch to light mode')
  })

  it('reflects an existing light data-theme', () => {
    document.documentElement.dataset['theme'] = 'light'
    render(<ThemeToggle />)
    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('aria-label', 'Switch to dark mode')
  })

  it('toggles document data-theme and writes localStorage on click', () => {
    render(<ThemeToggle />)
    const btn = screen.getByRole('button')

    act(() => btn.click())
    expect(document.documentElement.dataset['theme']).toBe('light')
    expect(window.localStorage.getItem('pantheon_theme')).toBe('light')

    act(() => btn.click())
    expect(document.documentElement.dataset['theme']).toBe('dark')
    expect(window.localStorage.getItem('pantheon_theme')).toBe('dark')
  })

  it('survives localStorage failure (private mode)', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })
    render(<ThemeToggle />)
    const btn = screen.getByRole('button')
    expect(() => act(() => btn.click())).not.toThrow()
    expect(document.documentElement.dataset['theme']).toBe('light')
    setItem.mockRestore()
  })
})
