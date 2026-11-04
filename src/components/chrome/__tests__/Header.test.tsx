import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Header is a static server wrapper: it never reads the Auth0 session
// (that would force every page mounting it to render per request) and
// always forwards user:null — HeaderView's auth island resolves the
// viewer via /api/auth/me on mount.
const { getSessionMock, headerViewSpy } = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
  headerViewSpy: vi.fn(),
}))

vi.mock('@/lib/auth0', () => ({
  auth0: { getSession: getSessionMock },
}))

vi.mock('../HeaderView', () => ({
  HeaderView: (props: Record<string, unknown>) => {
    headerViewSpy(props)
    return <div data-testid="header-view-probe" />
  },
}))

import { Header } from '../Header'

function lastHeaderViewProps(): Record<string, unknown> {
  const call = headerViewSpy.mock.calls.at(-1)
  if (!call) throw new Error('HeaderView was never rendered')
  return call[0] as Record<string, unknown>
}

beforeEach(() => {
  getSessionMock.mockReset()
  headerViewSpy.mockClear()
})

describe('<Header> static contract', () => {
  it('never reads the Auth0 session', () => {
    render(Header({}))
    expect(getSessionMock).not.toHaveBeenCalled()
  })

  it('forwards user:null for the client auth island to correct', () => {
    render(Header({}))
    expect(lastHeaderViewProps().user).toBeNull()
  })

  it('defaults tinted to false when the prop is omitted', () => {
    render(Header({}))
    expect(lastHeaderViewProps().tinted).toBe(false)
  })

  it('forwards tinted={true}', () => {
    render(Header({ tinted: true }))
    expect(lastHeaderViewProps().tinted).toBe(true)
  })

  it('mounts exactly one HeaderView with only { tinted, user }', () => {
    render(Header({}))
    expect(headerViewSpy).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('header-view-probe')).toBeInTheDocument()
    expect(Object.keys(lastHeaderViewProps()).sort()).toEqual(['tinted', 'user'])
  })
})
