import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Ornament } from '../Ornament'

function wrap(node: React.ReactNode) {
  return <svg viewBox="0 0 200 200">{node}</svg>
}

describe('<Ornament>', () => {
  it('renders a <g> with the ornament testid and default size 80', () => {
    render(wrap(<Ornament cx={100} cy={100} />))
    const g = screen.getByTestId('ornament')
    expect(g.getAttribute('data-slot')).toBe('ornament')
    expect(g.getAttribute('data-size')).toBe('80')
    expect(g.getAttribute('transform')).toBe('translate(100 100)')
  })

  it('honors a custom size prop', () => {
    render(wrap(<Ornament size={120} />))
    expect(screen.getByTestId('ornament').getAttribute('data-size')).toBe('120')
  })

  it('renders the default six-ray sunburst when no children', () => {
    render(wrap(<Ornament />))
    expect(screen.getByTestId('ornament-default')).toBeInTheDocument()
  })

  it('renders motif children instead of the default when provided', () => {
    render(
      wrap(
        <Ornament>
          <circle data-testid="motif-orb" r={10} />
        </Ornament>,
      ),
    )
    expect(screen.getByTestId('motif-orb')).toBeInTheDocument()
    expect(screen.queryByTestId('ornament-default')).not.toBeInTheDocument()
  })
})
