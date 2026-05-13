import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Pediment } from '../Pediment'

function wrap(node: React.ReactNode) {
  return (
    <svg viewBox="0 0 1200 800" data-testid="wrap">
      {node}
    </svg>
  )
}

describe('<Pediment>', () => {
  it('renders a <g> with the pediment testid', () => {
    render(wrap(<Pediment />))
    const g = screen.getByTestId('pediment')
    expect(g.tagName.toLowerCase()).toBe('g')
    expect(g.getAttribute('data-slot')).toBe('pediment')
  })

  it('renders the default triangle when no children are passed', () => {
    render(wrap(<Pediment />))
    expect(screen.getByTestId('pediment-default')).toBeInTheDocument()
  })

  it('renders motif children instead of the default when provided', () => {
    render(
      wrap(
        <Pediment>
          <circle data-testid="motif" cx={600} cy={140} r={20} />
        </Pediment>,
      ),
    )
    expect(screen.getByTestId('motif')).toBeInTheDocument()
    expect(screen.queryByTestId('pediment-default')).not.toBeInTheDocument()
  })
})
