import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ShowsStatusPill } from '../ShowsStatusPill'

describe('<ShowsStatusPill>', () => {
  it('formats as "in progress · N / T" when shipped < target', () => {
    render(<ShowsStatusPill shipped={2} target={3} />)
    const pill = screen.getByTestId('show-tile-status')
    expect(pill.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      'in progress · 2 / 3',
    )
  })

  it('renders 0 / N for an unstarted canon', () => {
    render(<ShowsStatusPill shipped={0} target={3} />)
    expect(screen.getByTestId('show-tile-status').textContent).toContain(
      '0 / 3',
    )
  })

  it('renders "review in progress" (no ratio) when shipped equals target', () => {
    render(<ShowsStatusPill shipped={3} target={3} />)
    const pill = screen.getByTestId('show-tile-status')
    expect(pill.textContent?.trim()).toBe('review in progress')
    expect(pill.textContent).not.toContain('/')
  })

  it('renders "review in progress" (no ratio) when shipped exceeds target', () => {
    render(<ShowsStatusPill shipped={5} target={3} />)
    const pill = screen.getByTestId('show-tile-status')
    expect(pill.textContent?.trim()).toBe('review in progress')
    expect(pill.textContent).not.toContain('/')
  })

  it('negative pin — shipped=5/target=3 does not render the impossible "5 / 3" ratio', () => {
    render(<ShowsStatusPill shipped={5} target={3} />)
    const pill = screen.getByTestId('show-tile-status')
    expect(pill.textContent).not.toMatch(/5\s*\/\s*3/)
  })
})
