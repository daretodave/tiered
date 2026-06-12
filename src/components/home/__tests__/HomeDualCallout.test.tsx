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

  // Pins the curated-pane cadence to the per-event mechanic the
  // show pages actually carry ("after every season finale and
  // after any returnee season that recasts a prior run.",
  // content/shows/*/canon.md meth_when_p). Critique pass 26
  // flagged the home's "Revised quarterly" claim as a calendar-
  // time cadence that contradicts the per-finale cadence every
  // show page promises. A future authoring pass that re-introduces
  // a wall-clock noun trips this gate at unit time.
  it('describes the per-finale canon cadence, not a wall-clock one', () => {
    render(<HomeDualCallout />)
    const curated = screen.getByTestId('home-dual-curated').textContent ?? ''
    expect(curated).not.toMatch(/quarterly/i)
    expect(curated).toMatch(/finale|after every/i)
  })

  // Pins the live-pane trust line to the weighting mechanic
  // /about details, not a flat "every voter has watched..."
  // overpromise. Critique pass 26 flagged the prior literal as
  // falsifiable against the 0.1x/0.25x/1.0x ladder at
  // content/legal/about.md:37-38 (anonymous guests can vote
  // without any watched-it gate). The fix swaps the flat claim
  // for self-attestation + the actual weighting mechanic; a
  // regression back to the unqualified claim trips at unit time.
  it('names the weighting mechanic, not a flat watched-every-voter claim', () => {
    render(<HomeDualCallout />)
    const live = screen.getByTestId('home-dual-live').textContent ?? ''
    expect(live).not.toMatch(/Every voter has watched/i)
    expect(live).toMatch(/(weight|0\.1|signed-in|self-attest|attest)/i)
  })

  // Pins the live-pane to the full three-tier ladder /about
  // details (anon 0.1× / new-account 0.25× / long-account 1.0×).
  // Critique pass 27 flagged the prior two-tier framing
  // (signed-in vs anon only) as understating the system — a
  // first-time reader following the home → about path sees a
  // new-account tier the home never mentioned. A future
  // authoring pass that simplifies back to two tiers trips this
  // gate.
  it('names all three voting weights, not just signed-in vs anon', () => {
    render(<HomeDualCallout />)
    const live = screen.getByTestId('home-dual-live').textContent ?? ''
    expect(live).toMatch(/0\.25|new account|under 7/i)
    expect(live).toMatch(/0\.1/)
  })

  // Critique pass-37 MED (issue #335): the prior live-pane
  // blurb named the three weights in the wrong order (highest-to-
  // lowest, signed-in→anon, omitting the 1.0× ceiling). /about
  // lists them lowest-to-highest with the 7-day cliff named. A
  // reader who lands on home and forms a tier mental model finds
  // the front-door framing inverted from the canonical disclosure.
  // The fix aligns home to /about's three-tier lowest-to-highest
  // ordering. The regex below pins all three tiers in that order
  // — a future authoring pass that inverts back to highest-to-
  // lowest or drops the 1.0× ceiling trips at unit time.
  it('renders the three weights lowest-to-highest, matching /about', () => {
    render(<HomeDualCallout />)
    const live = screen.getByTestId('home-dual-live').textContent ?? ''
    expect(live).toMatch(
      /anonymous[^]*0\.1[^]*under 7 days[^]*0\.25[^]*tenured[^]*1\.0/i,
    )
  })

  // Critique pass-49 MED (#411): the curated cell speaks in the same
  // first-person editor voice the interior pages (show-page body,
  // themed-list lede, /about lede) already use. The live cell speaks
  // in second-person ("you", "your") to match the lede's "you vote"
  // framing. Bidirectional pin — positive: the curated cell contains
  // "I write" (or comparable first-person marker); negative: the
  // prior third-person institutional markers ("an editor", "one
  // reader") are gone.
  it('curated cell renders in first-person editor voice (no "an editor")', () => {
    render(<HomeDualCallout />)
    const curated = screen.getByTestId('home-dual-curated').textContent ?? ''
    expect(curated).toMatch(/\bI write\b/)
    expect(curated).not.toMatch(/\ban editor\b/i)
  })

  it('live cell speaks to the reader in second-person (no "one reader")', () => {
    render(<HomeDualCallout />)
    const live = screen.getByTestId('home-dual-live').textContent ?? ''
    expect(live).toMatch(/\byour\b/i)
    expect(live).not.toMatch(/\bone reader\b/i)
  })
})
