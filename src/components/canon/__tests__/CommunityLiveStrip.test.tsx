import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CommunityLiveStrip } from '../CommunityLiveStrip'

describe('<CommunityLiveStrip>', () => {
  it('renders pending counters + canon status below the threshold', () => {
    render(
      <CommunityLiveStrip
        source="canon"
        lastRecomputeAt={null}
        votersThisWeek={0}
        version={null}
      />,
    )
    const strip = screen.getByTestId('community-live-strip')
    expect(strip).toHaveAttribute('data-source', 'canon')
    expect(strip).not.toHaveAttribute('data-version')
    expect(strip).toHaveTextContent('votes pending')
    expect(strip).toHaveTextContent('Thursday 9pm ET')
    expect(strip).toHaveTextContent('mirroring the canon')
    expect(strip).toHaveTextContent('open to anyone')
    expect(strip).toHaveTextContent('voters, last 7 days')
  })

  it('renders Supabase-derived recompute, voters and version when live', () => {
    render(
      <CommunityLiveStrip
        source="votes"
        lastRecomputeAt={new Date(Date.now() - 60 * 60 * 1000).toISOString()}
        votersThisWeek={17402}
        version={1421}
      />,
    )
    const strip = screen.getByTestId('community-live-strip')
    expect(strip).toHaveAttribute('data-source', 'votes')
    expect(strip).toHaveAttribute('data-version', '1421')
    expect(strip).toHaveTextContent('1h ago')
    expect(strip).toHaveTextContent('17,402')
    expect(strip).not.toHaveTextContent('v1421')
    expect(strip).toHaveTextContent('live votes')
  })

  it('reads the cadence captions in editorial voice (last/next update), not engineering (regression guard for #256)', () => {
    render(
      <CommunityLiveStrip
        source="votes"
        lastRecomputeAt={new Date(Date.now() - 60 * 60 * 1000).toISOString()}
        votersThisWeek={17402}
        version={1421}
      />,
    )
    const strip = screen.getByTestId('community-live-strip')
    expect(strip).toHaveTextContent(/last update/)
    expect(strip).toHaveTextContent(/next update/)
    expect(strip).not.toHaveTextContent(/recompute/i)
  })

  it('does not repeat a standalone "live" label next to the dot — the tab cap already says it (critique pass-137)', () => {
    render(
      <CommunityLiveStrip
        source="canon"
        lastRecomputeAt={null}
        votersThisWeek={0}
        version={null}
      />,
    )
    const strip = screen.getByTestId('community-live-strip')
    const firstItem = strip.querySelector('.cp-live-left > span:first-child')
    expect(firstItem?.textContent?.trim().startsWith('last update')).toBe(true)
  })

  it('clarifies a zero weekly count on a live-votes page so it does not read as contradicting nonzero table totals (critique pass-139)', () => {
    render(
      <CommunityLiveStrip
        source="votes"
        lastRecomputeAt={new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()}
        votersThisWeek={0}
        version={1421}
      />,
    )
    const strip = screen.getByTestId('community-live-strip')
    expect(strip).toHaveTextContent('voters, last 7 days · 0 (no new votes since last update)')
  })

  it('does not add the zero-clause below the vote threshold — "votes pending" already reads honestly there', () => {
    render(
      <CommunityLiveStrip
        source="canon"
        lastRecomputeAt={null}
        votersThisWeek={0}
        version={null}
      />,
    )
    const strip = screen.getByTestId('community-live-strip')
    expect(strip).not.toHaveTextContent('no new votes since last update')
  })

  it('clarifies a zero weekly count on a canon-mirroring page too, once a real recompute timestamp exists (critique pass-142)', () => {
    render(
      <CommunityLiveStrip
        source="canon"
        lastRecomputeAt={new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()}
        votersThisWeek={0}
        version={1421}
      />,
    )
    const strip = screen.getByTestId('community-live-strip')
    expect(strip).toHaveTextContent('voters, last 7 days · 0 (no new votes since last update)')
  })
})
