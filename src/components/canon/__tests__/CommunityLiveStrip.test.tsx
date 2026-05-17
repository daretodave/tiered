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
    expect(strip).toHaveTextContent('votes pending')
    expect(strip).toHaveTextContent('Thursday 9pm ET')
    expect(strip).toHaveTextContent('mirroring the canon')
    expect(strip).toHaveTextContent('pending')
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
    expect(strip).toHaveTextContent('1h ago')
    expect(strip).toHaveTextContent('17,402')
    expect(strip).toHaveTextContent('v1421')
    expect(strip).toHaveTextContent('live votes')
  })
})
