import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TierHead } from '../TierHead'

describe('<TierHead>', () => {
  it('renders the letter, tag, name, and count', () => {
    render(<TierHead tier="S" count={2} />)
    const head = screen.getByTestId('tier-head')
    expect(head.dataset['tier']).toBe('S')
    expect(head.textContent).toContain('S')
    expect(head.textContent).toContain('Format-defining')
    expect(head.textContent).toContain('invented or perfected')
    expect(screen.getByTestId('tier-count').textContent).toContain('2')
    expect(screen.getByTestId('tier-count').textContent).toContain('Shows')
  })

  it('singularizes the count noun for one show', () => {
    render(<TierHead tier="A" count={1} />)
    expect(screen.getByTestId('tier-count').textContent).toContain('Show')
    expect(screen.getByTestId('tier-count').textContent).not.toMatch(/\bShows\b/)
  })

  it('uses the deep-canon copy for A tier', () => {
    render(<TierHead tier="A" count={4} />)
    expect(screen.getByTestId('tier-head').textContent).toContain('Deep canon')
  })

  it('uses the under-review copy for B tier', () => {
    render(<TierHead tier="B" count={3} />)
    expect(screen.getByTestId('tier-head').textContent).toContain(
      'Recent additions',
    )
  })
})
