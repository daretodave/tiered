import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { SearchIndexItem } from '@/lib/searchIndex'
import { dispatchSearchOpen } from '../events'
import { SearchHost } from '../SearchHost'

// Mock SearchOverlay so the test observes only SearchHost's contract:
// the `open` state it owns and the `onClose` it hands down.
vi.mock('../SearchOverlay', () => ({
  SearchOverlay: ({
    open,
    onClose,
  }: {
    open: boolean
    onClose: () => void
  }) => (
    <div data-testid="overlay" data-open={open ? 'true' : 'false'}>
      <button type="button" data-testid="overlay-close" onClick={onClose}>
        close
      </button>
    </div>
  ),
}))

const ITEMS: SearchIndexItem[] = [
  { type: 'show', name: 'Survivor', meta: '', color: '#000', href: '/shows/survivor' },
]

function isOpen(): boolean {
  return screen.getByTestId('overlay').getAttribute('data-open') === 'true'
}

function pressKey(key: string, mods: { metaKey?: boolean; ctrlKey?: boolean }) {
  const ev = new KeyboardEvent('keydown', { key, cancelable: true, ...mods })
  act(() => {
    document.dispatchEvent(ev)
  })
  return ev
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('<SearchHost>', () => {
  it('renders the overlay closed by default', () => {
    render(<SearchHost items={ITEMS} />)
    expect(isOpen()).toBe(false)
  })

  it('cmd+K toggles open and prevents the browser default', () => {
    render(<SearchHost items={ITEMS} />)
    const open = pressKey('k', { metaKey: true })
    expect(open.defaultPrevented).toBe(true)
    expect(isOpen()).toBe(true)
    pressKey('k', { metaKey: true })
    expect(isOpen()).toBe(false)
  })

  it('ctrl+K also toggles open (non-mac binding)', () => {
    render(<SearchHost items={ITEMS} />)
    pressKey('k', { ctrlKey: true })
    expect(isOpen()).toBe(true)
  })

  it('ignores a bare k with no modifier', () => {
    render(<SearchHost items={ITEMS} />)
    const ev = pressKey('k', {})
    expect(ev.defaultPrevented).toBe(false)
    expect(isOpen()).toBe(false)
  })

  it('opens on the SEARCH_OPEN_EVENT and stays open if re-fired', () => {
    render(<SearchHost items={ITEMS} />)
    act(() => {
      dispatchSearchOpen()
    })
    expect(isOpen()).toBe(true)
    act(() => {
      dispatchSearchOpen()
    })
    expect(isOpen()).toBe(true)
  })

  it('closes when the overlay invokes onClose', () => {
    render(<SearchHost items={ITEMS} />)
    act(() => {
      dispatchSearchOpen()
    })
    expect(isOpen()).toBe(true)
    act(() => {
      screen.getByTestId('overlay-close').click()
    })
    expect(isOpen()).toBe(false)
  })

  it('removes both listeners on unmount (no leak, no post-unmount toggle)', () => {
    const docRemove = vi.spyOn(document, 'removeEventListener')
    const winRemove = vi.spyOn(window, 'removeEventListener')
    const { unmount } = render(<SearchHost items={ITEMS} />)
    unmount()
    expect(docRemove).toHaveBeenCalledWith('keydown', expect.any(Function))
    expect(winRemove).toHaveBeenCalledWith(
      'tiered:search-open',
      expect.any(Function),
    )
  })
})
