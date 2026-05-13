import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Facade } from '../Facade'

describe('<Facade>', () => {
  it('renders an <svg> with the canonical 0 0 1200 800 viewBox', () => {
    render(<Facade />)
    const svg = screen.getByTestId('facade')
    expect(svg.tagName.toLowerCase()).toBe('svg')
    expect(svg.getAttribute('viewBox')).toBe('0 0 1200 800')
  })

  it('passes through children', () => {
    render(
      <Facade>
        <g data-testid="motif-slot" />
      </Facade>,
    )
    expect(screen.getByTestId('motif-slot')).toBeInTheDocument()
  })

  it('emits an accessible title when one is provided', () => {
    render(<Facade title="Survivor facade" />)
    const svg = screen.getByTestId('facade')
    expect(svg.getAttribute('aria-label')).toBe('Survivor facade')
  })
})
