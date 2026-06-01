import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ShiftsRow } from '../ShiftsRow'

describe('<ShiftsRow>', () => {
  it('renders nothing while empty (no cards) — the surface is absent', () => {
    const { container } = render(<ShiftsRow />)
    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByTestId('shifts-row')).not.toBeInTheDocument()
  })

  it('renders heading + cards when provided', () => {
    render(<ShiftsRow cards={<div data-testid="card">card</div>} />)
    expect(screen.getByTestId('shifts-row')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      /What changed this week/i,
    )
    expect(screen.getByTestId('shifts-cards')).toBeInTheDocument()
    expect(screen.getByTestId('card')).toBeInTheDocument()
  })

  it('eyebrow names the source-of-truth ranking plainly, never promises a sentiment chip the cards do not deliver (regression guard for #265 + #271)', () => {
    const { container } = render(
      <ShiftsRow cards={<div data-testid="card">card</div>} />,
    )
    const eyebrow = container.querySelector('.sec-meta')
    expect(eyebrow).not.toBeNull()
    expect(eyebrow).toHaveTextContent(/^Community rank · Updated Thursday$/)
    expect(eyebrow?.textContent ?? '').toMatch(/community/i)
    expect(eyebrow?.textContent ?? '').not.toMatch(/sentiment/i)
  })
})
