import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WatchList } from '../WatchList'

const items = [
  { episode_label: 'Ep 1 · cold open', body: 'A clean staging.' },
  { episode_label: 'Ep 7 · long take', body: 'Watch the patience.' },
  { episode_label: 'Ep 9 · merge', body: 'The cleanest staging.' },
  { episode_label: 'Ep 11 · third act', body: 'Don\'t blink.' },
]

describe('<WatchList>', () => {
  it('returns null when items is undefined', () => {
    const { container } = render(<WatchList items={undefined} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when items is an empty array', () => {
    const { container } = render(<WatchList items={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders 4 cards for the gold-standard fixture', () => {
    render(<WatchList items={items} />)
    expect(screen.getAllByTestId('watch-list-item')).toHaveLength(4)
    expect(screen.getByText('Ep 1 · cold open')).toBeInTheDocument()
    expect(screen.getByText('Watch the patience.')).toBeInTheDocument()
  })

  it('renders 3 cards when only 3 items are provided', () => {
    render(<WatchList items={items.slice(0, 3)} />)
    expect(screen.getAllByTestId('watch-list-item')).toHaveLength(3)
  })
})
