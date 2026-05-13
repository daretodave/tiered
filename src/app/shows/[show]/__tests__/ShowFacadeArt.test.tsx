import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ShowFacadeArt } from '../ShowFacadeArt'

describe('<ShowFacadeArt>', () => {
  it('inlines the facade.svg for a seeded show', () => {
    render(<ShowFacadeArt slug="survivor" name="Survivor" />)
    const wrapper = screen.getByTestId('facade')
    expect(wrapper.getAttribute('data-show-facade')).toBe('survivor')
    expect(wrapper.getAttribute('aria-label')).toBe('Survivor facade')
    const svg = wrapper.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg?.getAttribute('viewBox')).toMatch(/0 0 1200 800/)
  })

  it('resolves the per-show facade by slug', () => {
    render(<ShowFacadeArt slug="top-chef" name="Top Chef" />)
    const wrapper = screen.getByTestId('facade')
    expect(wrapper.getAttribute('data-show-facade')).toBe('top-chef')
    expect(wrapper.querySelector('svg')).not.toBeNull()
  })

  it('falls back gracefully when the facade file is missing', () => {
    render(<ShowFacadeArt slug="not-a-real-show" name="Bogus" />)
    const wrapper = screen.getByTestId('facade')
    expect(wrapper.getAttribute('data-show-facade-fallback')).toBe('not-a-real-show')
    expect(wrapper.getAttribute('aria-label')).toContain('not yet shipped')
    expect(wrapper.querySelector('svg')).toBeNull()
  })
})
