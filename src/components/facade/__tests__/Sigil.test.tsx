import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Sigil } from '../Sigil'

describe('<Sigil>', () => {
  it('renders an <svg> with the cropped 440 0 320 320 viewBox', () => {
    render(<Sigil />)
    const svg = screen.getByTestId('sigil')
    expect(svg.tagName.toLowerCase()).toBe('svg')
    expect(svg.getAttribute('viewBox')).toBe('440 0 320 320')
  })

  it('renders at a configurable display size', () => {
    render(<Sigil size={80} />)
    const svg = screen.getByTestId('sigil')
    expect(svg.getAttribute('width')).toBe('80')
    expect(svg.getAttribute('height')).toBe('80')
  })

  it('passes through children for the cropped motif content', () => {
    render(
      <Sigil>
        <g data-testid="motif-pediment-and-column" />
      </Sigil>,
    )
    expect(screen.getByTestId('motif-pediment-and-column')).toBeInTheDocument()
  })

  it('emits an accessible title when provided', () => {
    render(<Sigil title="Survivor sigil" />)
    expect(screen.getByTestId('sigil').getAttribute('aria-label')).toBe('Survivor sigil')
  })
})
