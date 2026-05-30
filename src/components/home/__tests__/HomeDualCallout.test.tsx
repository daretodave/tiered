import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HomeDualCallout } from '../HomeDualCallout'

describe('<HomeDualCallout>', () => {
  it('renders both cells with the canon + community framing', () => {
    render(<HomeDualCallout />)
    expect(screen.getByTestId('home-dual-curated').textContent).toMatch(
      /editor.?s canon/i,
    )
    expect(screen.getByTestId('home-dual-live').textContent).toMatch(
      /community rank/i,
    )
  })

  it('mentions no show by name — copy is editorial framing only', () => {
    render(<HomeDualCallout />)
    const text = screen.getByTestId('home-dual-callout').textContent ?? ''
    expect(text).not.toMatch(/survivor|drag race|top chef/i)
  })

  it('renders the curated + live eyebrow tags in order', () => {
    render(<HomeDualCallout />)
    const tags = screen.getAllByText(
      /^0[12] · (Curated|Live)$/,
    )
    expect(tags.map((el) => el.textContent)).toEqual([
      '01 · Curated',
      '02 · Live',
    ])
  })

  // Pins the home explainer to the live single-binary mechanic
  // (one vote per season, "belong in the community top 10?"). The
  // earlier copy described pairwise A/B voting — promise/delivery
  // mismatch flagged by critique pass 19. Pairwise voting is a
  // future phase, not a silent contract on the home page.
  it('describes the single-binary community vote mechanic, not pairwise', () => {
    render(<HomeDualCallout />)
    const live = screen.getByTestId('home-dual-live').textContent ?? ''
    expect(live).toMatch(/one vote per season/i)
    expect(live).toMatch(/community top 10/i)
    expect(live).not.toMatch(/pairwise/i)
    expect(live).not.toMatch(/two seasons at a time/i)
    expect(live).not.toMatch(/both seasons/i)
  })
})
