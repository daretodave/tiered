import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ShowsStatusPill } from '../ShowsStatusPill'

describe('<ShowsStatusPill>', () => {
  it('formats as "in progress · N / T"', () => {
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
})
