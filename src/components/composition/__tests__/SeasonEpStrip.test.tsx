import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SeasonEpStrip } from '../SeasonEpStrip'

describe('<SeasonEpStrip>', () => {
  it('returns null when heat is undefined', () => {
    const { container } = render(<SeasonEpStrip heat={undefined} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when heat is an empty array', () => {
    const { container } = render(<SeasonEpStrip heat={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders one .ep-bar per heat entry', () => {
    render(<SeasonEpStrip heat={['med', 'hot', 'cold']} />)
    expect(screen.getAllByTestId('ep-bar')).toHaveLength(3)
  })

  it('maps hot/med/cold to data-heat attribute and class', () => {
    render(<SeasonEpStrip heat={['med', 'hot', 'cold']} />)
    const bars = screen.getAllByTestId('ep-bar') as HTMLElement[]
    const [a, b, c] = bars
    if (!a || !b || !c) throw new Error('expected three bars')
    expect(a.dataset.heat).toBe('med')
    expect(a.className).toContain('med')
    expect(b.dataset.heat).toBe('hot')
    expect(b.className).toContain('hot')
    expect(c.dataset.heat).toBe('cold')
    expect(c.className).toContain('cold')
  })

  it('renders an ep-foot caption when supplied', () => {
    render(
      <SeasonEpStrip
        heat={['hot', 'hot']}
        caption="peak run · eps 7–9, 11"
      />,
    )
    expect(screen.getByTestId('ep-foot')).toHaveTextContent('peak run')
  })

  it('hides the foot when no caption supplied', () => {
    render(<SeasonEpStrip heat={['hot']} />)
    expect(screen.queryByTestId('ep-foot')).toBeNull()
  })
})
