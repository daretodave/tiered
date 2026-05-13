import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Frieze } from '../Frieze'

function wrap(node: React.ReactNode) {
  return <svg viewBox="0 0 1200 800">{node}</svg>
}

describe('<Frieze>', () => {
  it('renders a <g> with the frieze testid', () => {
    render(wrap(<Frieze />))
    expect(screen.getByTestId('frieze').getAttribute('data-slot')).toBe('frieze')
  })

  it('renders default twin lines when no children', () => {
    render(wrap(<Frieze />))
    expect(screen.getByTestId('frieze-default')).toBeInTheDocument()
  })

  it('renders motif children instead of the default when provided', () => {
    render(
      wrap(
        <Frieze>
          <rect data-testid="motif-band" x={0} y={0} width={100} height={20} />
        </Frieze>,
      ),
    )
    expect(screen.getByTestId('motif-band')).toBeInTheDocument()
    expect(screen.queryByTestId('frieze-default')).not.toBeInTheDocument()
  })
})
