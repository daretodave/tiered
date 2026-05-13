import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RankShiftPill, type RankSentiment } from '../RankShiftPill'

const SENTIMENTS: RankSentiment[] = [
  'warm-up',
  'warm-down',
  'neutral',
  'hold',
  'verdict',
  'consensus',
]

describe('<RankShiftPill>', () => {
  it('renders an up arrow + abs delta when delta > 0', () => {
    render(<RankShiftPill delta={3} sentiment="warm-up" />)
    const pill = screen.getByTestId('rank-shift-pill')
    expect(pill).toHaveClass('rank-pill')
    expect(pill.textContent).toContain('↑')
    expect(pill.textContent).toContain('3')
    expect(pill.getAttribute('aria-label')).toBe('rank up 3')
    expect(pill.getAttribute('data-delta')).toBe('3')
    expect(pill.getAttribute('data-sentiment')).toBe('warm-up')
  })

  it('renders a down arrow + abs delta when delta < 0', () => {
    render(<RankShiftPill delta={-2} sentiment="warm-down" />)
    const pill = screen.getByTestId('rank-shift-pill')
    expect(pill.textContent).toContain('↓')
    expect(pill.textContent).toContain('2')
    expect(pill.getAttribute('aria-label')).toBe('rank down 2')
  })

  it('renders only the em-dash and omits the number when delta is 0', () => {
    render(<RankShiftPill delta={0} sentiment="neutral" />)
    const pill = screen.getByTestId('rank-shift-pill')
    expect(pill.textContent).toContain('—')
    expect(pill.textContent?.replace('—', '').trim()).toBe('')
    expect(pill.getAttribute('aria-label')).toBe('no rank change')
  })

  it('uses the --s-<sentiment> token in the inline style', () => {
    render(<RankShiftPill delta={1} sentiment="hold" />)
    const pill = screen.getByTestId('rank-shift-pill')
    expect(pill.style.color).toContain('--s-hold')
    expect(pill.style.background).toContain('--s-hold')
  })

  it.each(SENTIMENTS)('renders for sentiment=%s', (sentiment) => {
    render(<RankShiftPill delta={1} sentiment={sentiment} />)
    const pill = screen.getByTestId('rank-shift-pill')
    expect(pill.getAttribute('data-sentiment')).toBe(sentiment)
    expect(pill.style.color).toContain(`--s-${sentiment}`)
  })
})
