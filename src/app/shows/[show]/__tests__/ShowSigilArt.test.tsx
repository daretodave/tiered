import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ShowSigilArt } from '../ShowSigilArt'

describe('<ShowSigilArt>', () => {
  it('inlines the sigil.svg for a seeded show', () => {
    render(<ShowSigilArt slug="survivor" name="Survivor" />)
    const wrapper = screen.getByTestId('show-sigil')
    expect(wrapper.getAttribute('data-show-sigil')).toBe('survivor')
    expect(wrapper.getAttribute('aria-label')).toBe('Survivor sigil')
    const svg = wrapper.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg?.getAttribute('viewBox')).toMatch(/0 0 320 320|320 320/)
  })

  it('falls back when the sigil file is missing', () => {
    render(<ShowSigilArt slug="not-a-real-show" name="Bogus" />)
    const wrapper = screen.getByTestId('show-sigil')
    expect(wrapper.getAttribute('data-show-sigil-fallback')).toBe('not-a-real-show')
    expect(wrapper.querySelector('svg')).toBeNull()
  })
})
