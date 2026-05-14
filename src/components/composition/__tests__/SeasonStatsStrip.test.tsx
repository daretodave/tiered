import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SeasonStatsStrip } from '../SeasonStatsStrip'

const fullStats = [
  { key: 'Filmed', value: 'Samoa', caption: 'same beach as S19' },
  { key: 'Premiered', value: 'Feb 11, 2010', caption: 'CBS · Thu 8/7c' },
  { key: 'Episodes', value: '14', caption: '39 days in country' },
  { key: 'Format', value: 'Returnees · 2 tribes', caption: 'all-veteran' },
  { key: 'Cast size', value: '20 players', caption: '10 heroes, 10 villains' },
  { key: 'Host', value: 'Jeff Probst', caption: 'tenth season' },
]

describe('<SeasonStatsStrip>', () => {
  it('renders all six tiles when populated', () => {
    render(<SeasonStatsStrip stats={fullStats} />)
    expect(screen.getByTestId('stats-strip')).toBeInTheDocument()
    expect(screen.getAllByTestId('stat-tile')).toHaveLength(6)
  })

  it('drops a tile when both value and caption are empty', () => {
    const stats = [
      ...fullStats.slice(0, 4),
      { key: 'Cast size' }, // no value or caption
      { key: 'Host', value: 'Jeff Probst' },
    ]
    render(<SeasonStatsStrip stats={stats} />)
    expect(screen.getAllByTestId('stat-tile')).toHaveLength(5)
  })

  it('hides the entire strip when fewer than three tiles are populated', () => {
    const stats = [
      { key: 'Host', value: 'Jeff Probst' },
      { key: 'Filmed', value: 'Samoa' },
      { key: 'Episodes' },
      { key: 'Cast size' },
    ]
    render(<SeasonStatsStrip stats={stats} />)
    expect(screen.queryByTestId('stats-strip')).toBeNull()
  })

  it('renders captions when only the caption is populated', () => {
    const stats = [
      ...fullStats.slice(0, 2),
      { key: 'Filming note', caption: 'shot before format existed' },
    ]
    render(<SeasonStatsStrip stats={stats} />)
    expect(screen.getAllByTestId('stat-tile')).toHaveLength(3)
    expect(screen.getByText('shot before format existed')).toBeInTheDocument()
  })
})
