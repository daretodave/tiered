import { describe, expect, it } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { EraBand } from '@/content'
import { CanonEraToolbar } from '../CanonEraToolbar'

const BANDS: EraBand[] = [
  { key: 'pioneer', label: 'Pioneer', range: [2000, 2003] },
  { key: 'new-era', label: 'New era', range: [2021, 2026] },
]

// Bands where one chip ('future-era') matches no entries in the harness DOM
const BANDS_WITH_EMPTY: EraBand[] = [
  ...BANDS,
  { key: 'future-era', label: 'Future era', range: [2027, 2030] },
]

function Harness({ bands, total }: { bands: EraBand[]; total: number }) {
  return (
    <div data-canon-page-root data-testid="root">
      <div data-view-pane="canon">
        <CanonEraToolbar bands={bands} total={total} />
        <a className="cp-hero-entry" data-testid="e-pioneer" data-era="pioneer">
          a
        </a>
        <a className="cp-mid-entry" data-testid="e-new" data-era="new-era">
          b
        </a>
      </div>
    </div>
  )
}

describe('<CanonEraToolbar>', () => {
  it('preselects the All chip and renders one chip per era band', () => {
    render(<Harness bands={BANDS} total={47} />)
    const all = screen.getByTestId('era-chip-all')
    expect(all).toHaveTextContent('All 47')
    expect(all).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByTestId('era-chip-pioneer')).toHaveTextContent('Pioneer')
    expect(screen.getByTestId('era-chip-new-era')).toHaveTextContent('New era')
  })

  it('renders only the All chip when no era bands are authored', () => {
    render(<Harness bands={[]} total={3} />)
    expect(screen.getByTestId('era-chip-all')).toHaveTextContent('All 3')
    expect(screen.queryByTestId('era-chip-pioneer')).toBeNull()
  })

  it('filters non-matching entries via data-era-off and updates the mode label', () => {
    render(<Harness bands={BANDS} total={47} />)
    const pioneerEntry = screen.getByTestId('e-pioneer')
    const newEntry = screen.getByTestId('e-new')

    fireEvent.click(screen.getByTestId('era-chip-pioneer'))
    expect(pioneerEntry).not.toHaveAttribute('data-era-off')
    expect(newEntry).toHaveAttribute('data-era-off', 'true')
    expect(screen.getByTestId('root')).toHaveAttribute(
      'data-era-filter',
      'pioneer',
    )
    expect(screen.getByTestId('era-mode')).toHaveTextContent('pioneer only')

    fireEvent.click(screen.getByTestId('era-chip-all'))
    expect(pioneerEntry).not.toHaveAttribute('data-era-off')
    expect(newEntry).not.toHaveAttribute('data-era-off')
    expect(screen.getByTestId('era-mode')).toHaveTextContent('canon order')
  })

  it('shows empty-state when the active era chip matches no entries', () => {
    render(<Harness bands={BANDS_WITH_EMPTY} total={2} />)
    expect(screen.queryByTestId('era-empty-state')).toBeNull()

    fireEvent.click(screen.getByTestId('era-chip-future-era'))
    expect(screen.getByTestId('era-empty-state')).toHaveTextContent(
      'No ranked seasons in this era yet.',
    )
  })

  it('clears the empty-state when switching back to All', () => {
    render(<Harness bands={BANDS_WITH_EMPTY} total={2} />)
    fireEvent.click(screen.getByTestId('era-chip-future-era'))
    expect(screen.getByTestId('era-empty-state')).toBeDefined()

    fireEvent.click(screen.getByTestId('era-chip-all'))
    expect(screen.queryByTestId('era-empty-state')).toBeNull()
  })

  it('does not show empty-state when the active era chip has matching entries', () => {
    render(<Harness bands={BANDS_WITH_EMPTY} total={2} />)
    fireEvent.click(screen.getByTestId('era-chip-pioneer'))
    expect(screen.queryByTestId('era-empty-state')).toBeNull()
  })
})
