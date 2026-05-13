import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CanonList } from '../CanonList'

describe('<CanonList>', () => {
  it('renders an ordered list with the canon-list class + testid', () => {
    render(
      <CanonList>
        <li data-testid="row-1" />
        <li data-testid="row-2" />
      </CanonList>,
    )
    const list = screen.getByTestId('canon-list')
    expect(list.tagName.toLowerCase()).toBe('ol')
    expect(list).toHaveClass('canon-list')
    expect(screen.getByTestId('row-1')).toBeInTheDocument()
    expect(screen.getByTestId('row-2')).toBeInTheDocument()
  })

  it('merges a custom className', () => {
    render(
      <CanonList className="extra">
        <li />
      </CanonList>,
    )
    expect(screen.getByTestId('canon-list')).toHaveClass('extra')
  })
})
