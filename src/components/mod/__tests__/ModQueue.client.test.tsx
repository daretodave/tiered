import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ModQueueItem } from '@/lib/supabase/mod'
import { ActionsBar } from '../ModQueue.client'

const baseItem: ModQueueItem = {
  id: '00000000-0000-0000-0000-000000000001',
  parentId: null,
  targetType: 'season',
  targetId: 'survivor:1',
  body: 'Sample body.',
  status: 'pending',
  createdAt: '2026-05-13T00:00:00.000Z',
  flagCount: 0,
}

function makeItem(overrides: Partial<ModQueueItem> = {}): ModQueueItem {
  return { ...baseItem, ...overrides }
}

function stubFetchOk(payload: unknown = { ok: true }) {
  const spy = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    text: async () => JSON.stringify(payload),
  })
  vi.stubGlobal('fetch', spy)
  return spy
}

function stubReload() {
  const reload = vi.fn()
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { ...window.location, reload },
  })
  return reload
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('<ActionsBar>', () => {
  it('renders the five moderation buttons in order: approve, hide, remove, unhide, dismiss_flag', () => {
    render(<ActionsBar comment={makeItem()} />)
    const bar = screen.getByTestId('mod-actions')
    const actions = Array.from(bar.querySelectorAll('button')).map((b) =>
      b.getAttribute('data-action'),
    )
    expect(actions).toEqual([
      'approve',
      'hide',
      'remove',
      'unhide',
      'dismiss_flag',
    ])
  })

  it('disables Approve and Unhide when the comment is already published', () => {
    render(<ActionsBar comment={makeItem({ status: 'published' })} />)
    expect(screen.getByRole('button', { name: 'Approve' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Unhide' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Hide' })).not.toBeDisabled()
    expect(screen.getByRole('button', { name: 'Remove' })).not.toBeDisabled()
  })

  it('disables Hide when the comment is already hidden', () => {
    render(<ActionsBar comment={makeItem({ status: 'hidden' })} />)
    expect(screen.getByRole('button', { name: 'Hide' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Approve' })).not.toBeDisabled()
    expect(screen.getByRole('button', { name: 'Unhide' })).not.toBeDisabled()
    expect(screen.getByRole('button', { name: 'Remove' })).not.toBeDisabled()
  })

  it('disables Remove when the comment is already removed', () => {
    render(<ActionsBar comment={makeItem({ status: 'removed' })} />)
    expect(screen.getByRole('button', { name: 'Remove' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Approve' })).not.toBeDisabled()
    expect(screen.getByRole('button', { name: 'Hide' })).not.toBeDisabled()
  })

  it('disables Dismiss flag when flagCount is zero', () => {
    render(<ActionsBar comment={makeItem({ flagCount: 0 })} />)
    expect(screen.getByRole('button', { name: /Dismiss flag/i })).toBeDisabled()
  })

  it('enables Dismiss flag when flagCount is positive', () => {
    render(<ActionsBar comment={makeItem({ flagCount: 3 })} />)
    expect(
      screen.getByRole('button', { name: /Dismiss flag/i }),
    ).not.toBeDisabled()
  })

  it('POSTs to /api/mod/action with { commentId, action } and credentials: include on click', async () => {
    const fetchSpy = stubFetchOk()
    stubReload()
    render(<ActionsBar comment={makeItem({ id: 'abc-123' })} />)
    fireEvent.click(screen.getByRole('button', { name: 'Approve' }))
    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledTimes(1)
    })
    const [url, init] = fetchSpy.mock.calls[0] ?? []
    expect(url).toBe('/api/mod/action')
    expect(init).toMatchObject({
      method: 'POST',
      credentials: 'include',
    })
    expect(init.headers).toMatchObject({ 'content-type': 'application/json' })
    expect(JSON.parse(init.body)).toEqual({
      commentId: 'abc-123',
      action: 'approve',
    })
  })

  it('reloads the page on a successful action (audit honesty)', async () => {
    stubFetchOk()
    const reload = stubReload()
    render(<ActionsBar comment={makeItem()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Hide' }))
    await waitFor(() => {
      expect(reload).toHaveBeenCalledTimes(1)
    })
  })

  it('does NOT reload on a failed action', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => JSON.stringify({ error: 'boom' }),
    })
    vi.stubGlobal('fetch', fetchSpy)
    const reload = stubReload()
    render(<ActionsBar comment={makeItem()} />)
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Remove' }))
    })
    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledTimes(1)
    })
    expect(reload).not.toHaveBeenCalled()
  })

  it('sends the action name verbatim for each button', async () => {
    const fetchSpy = stubFetchOk()
    stubReload()
    render(<ActionsBar comment={makeItem({ flagCount: 1 })} />)
    const buttons: Array<[string, string]> = [
      ['Approve', 'approve'],
      ['Hide', 'hide'],
      ['Remove', 'remove'],
      ['Unhide', 'unhide'],
      ['Dismiss flag', 'dismiss_flag'],
    ]
    for (const [label, expected] of buttons) {
      fetchSpy.mockClear()
      fireEvent.click(screen.getByRole('button', { name: label }))
      await waitFor(() => {
        expect(fetchSpy).toHaveBeenCalledTimes(1)
      })
      const init = fetchSpy.mock.calls[0]?.[1]
      expect(JSON.parse(init.body).action).toBe(expected)
    }
  })
})
