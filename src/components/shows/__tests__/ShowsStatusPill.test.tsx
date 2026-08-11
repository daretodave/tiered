import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ShowsStatusPill } from '../ShowsStatusPill'

describe('<ShowsStatusPill>', () => {
  it('formats as "N of T canon entries" when shipped < target — self-explanatory without a hover title', () => {
    render(<ShowsStatusPill shipped={2} target={3} />)
    const pill = screen.getByTestId('show-tile-status')
    expect(pill.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      '2 of 3 canon entries',
    )
  })

  it('renders "0 of N canon entries" for an unstarted canon', () => {
    render(<ShowsStatusPill shipped={0} target={3} />)
    expect(screen.getByTestId('show-tile-status').textContent).toContain(
      '0 of 3 canon entries',
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

  it('carries a title explaining what the ratio counts when shipped < target', () => {
    render(<ShowsStatusPill shipped={1} target={3} />)
    const pill = screen.getByTestId('show-tile-status')
    expect(pill.getAttribute('title')).toBe(
      '1 of 3 canon entries published toward the review floor',
    )
  })

  it('carries a title describing the review state once shipped meets target', () => {
    render(<ShowsStatusPill shipped={3} target={3} />)
    const pill = screen.getByTestId('show-tile-status')
    expect(pill.getAttribute('title')).toBe(
      'Canon entries published, under editorial review',
    )
  })
})
