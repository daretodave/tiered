import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Column } from '../Column'

function wrap(node: React.ReactNode) {
  return <svg viewBox="0 0 1200 800">{node}</svg>
}

describe('<Column>', () => {
  it.each(['left', 'center', 'right'] as const)('renders position=%s with its testid', (pos) => {
    render(wrap(<Column position={pos} />))
    const g = screen.getByTestId(`column-${pos}`)
    expect(g.getAttribute('data-position')).toBe(pos)
    expect(g.getAttribute('data-slot')).toBe('column')
  })

  it('emits the default column body, capital and base when no children', () => {
    render(wrap(<Column position="center" />))
    expect(screen.getByTestId('column-center-default-body')).toBeInTheDocument()
  })

  it('renders motif children instead of the default when provided', () => {
    render(
      wrap(
        <Column position="center">
          <path data-testid="motif-path" d="M 0 0 L 10 10" />
        </Column>,
      ),
    )
    expect(screen.getByTestId('motif-path')).toBeInTheDocument()
    expect(screen.queryByTestId('column-center-default-body')).not.toBeInTheDocument()
  })
})
