import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Header is the async server wrapper: it resolves the Auth0 session,
// maps it to a HeaderUser via the (real, separately-tested) headerUser
// helper, and forwards { tinted, user } to <HeaderView>. The two
// boundaries — Auth0 and the view — are mocked; the session→user
// mapping is exercised for real so the wrapper's actual contract is
// what gets pinned.
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

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('<Header> session → user mapping', () => {
  it('maps a nickname session to a HeaderView user', async () => {
    getSessionMock.mockResolvedValue({ user: { nickname: 'tester' } })
    render(await Header({}))
    expect(lastHeaderViewProps().user).toEqual({
      handle: 'tester',
      displayLabel: '@tester',
      profileHref: '/u/tester',
    })
  })

  it('falls back to the email local-part when no nickname is present', async () => {
    getSessionMock.mockResolvedValue({ user: { email: 'Asha@example.com' } })
    render(await Header({}))
    expect(lastHeaderViewProps().user).toEqual({
      handle: 'asha',
      displayLabel: '@asha',
      profileHref: '/u/asha',
    })
  })

  it('passes user:null when the session is null', async () => {
    getSessionMock.mockResolvedValue(null)
    render(await Header({}))
    expect(lastHeaderViewProps().user).toBeNull()
  })

  it('passes user:null when the session carries no user', async () => {
    getSessionMock.mockResolvedValue({})
    render(await Header({}))
    expect(lastHeaderViewProps().user).toBeNull()
  })
})

describe('<Header> auth resilience', () => {
  it('swallows a getSession rejection and renders signed-out chrome', async () => {
    getSessionMock.mockRejectedValue(new Error('auth0 unreachable'))
    // The .catch(() => null) in Header is load-bearing: an Auth0
    // outage must not throw out of the header on every page.
    await expect(Header({})).resolves.toBeDefined()
    render(await Header({}))
    expect(lastHeaderViewProps().user).toBeNull()
    expect(screen.getByTestId('header-view-probe')).toBeInTheDocument()
  })
})

describe('<Header> tinted forwarding', () => {
  it('defaults tinted to false when the prop is omitted', async () => {
    getSessionMock.mockResolvedValue(null)
    render(await Header({}))
    expect(lastHeaderViewProps().tinted).toBe(false)
  })

  it('forwards tinted={true}', async () => {
    getSessionMock.mockResolvedValue(null)
    render(await Header({ tinted: true }))
    expect(lastHeaderViewProps().tinted).toBe(true)
  })

  it('forwards an explicit tinted={false}', async () => {
    getSessionMock.mockResolvedValue(null)
    render(await Header({ tinted: false }))
    expect(lastHeaderViewProps().tinted).toBe(false)
  })
})

describe('<Header> render contract', () => {
  it('resolves the session exactly once per render', async () => {
    getSessionMock.mockResolvedValue({ user: { nickname: 'tester' } })
    render(await Header({}))
    expect(getSessionMock).toHaveBeenCalledTimes(1)
  })

  it('mounts exactly one HeaderView', async () => {
    getSessionMock.mockResolvedValue(null)
    render(await Header({}))
    expect(headerViewSpy).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('header-view-probe')).toBeInTheDocument()
  })

  it('forwards only { tinted, user } to HeaderView', async () => {
    getSessionMock.mockResolvedValue(null)
    render(await Header({}))
    expect(Object.keys(lastHeaderViewProps()).sort()).toEqual(['tinted', 'user'])
  })
})
