import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// /mod is the RBAC-gated moderation queue (phase 13). It composes a
// three-branch auth gate and — the P0 — a leak guard: getModQueue()
// drains the pending + hidden comment BODIES (including potential
// spoilers), so it must fire ONLY on the verified-mod branch. A
// hermetic e2e walk cannot pin any of this from the outside: it needs
// a `mod`-role session to reach the queue and only ever exercises the
// gate at the network level, so the never-call-for-non-mod guard, the
// noIndex directive (the queue renders unreviewed content — indexing
// /mod would surface it in SERP snippets), the mod:read-specific gate,
// and the queue pass-through are all dark to it.
//
// The auth boundary (`auth0.getSession`), the Supabase boundary
// (`getModQueue`), and the `ModQueue` view are mocked so each branch
// is driven deterministically and the leak guard is observable by
// call count. `isMod` is left **real** so the gate runs through the
// actual permissions claim-reader (both Auth0 encodings — JSON array
// and comma-separated string). `buildMetadata` is left **real** so a
// regression in canonicalUrl's trailing-slash discipline or in
// siteConfig.baseUrl surfaces here, not just in the helper's own test.

const PERMISSIONS_CLAIM = 'https://tiered.app/permissions'

const { getSessionMock, getModQueueMock, ModQueueMock } = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
  getModQueueMock: vi.fn(),
  ModQueueMock: vi.fn((_props: { items: unknown[] }) => (
    <div data-testid="mod-queue-stub" />
  )),
}))

vi.mock('@/lib/auth0', () => ({
  auth0: { getSession: getSessionMock },
}))
vi.mock('@/lib/supabase/mod', () => ({
  getModQueue: getModQueueMock,
}))
vi.mock('@/components/mod/ModQueue', () => ({
  ModQueue: ModQueueMock,
}))

import ModPage, { dynamic, generateMetadata, runtime } from '../page'

type StubItem = { id: string }
const makeItems = (n: number): StubItem[] =>
  Array.from({ length: n }, (_, i) => ({ id: `c${i}` }))

const modUser = (permissions: string[] | string) => ({
  user: { [PERMISSIONS_CLAIM]: permissions },
})

beforeEach(() => {
  getSessionMock.mockReset()
  getModQueueMock.mockReset()
  getModQueueMock.mockResolvedValue([])
  ModQueueMock.mockClear()
})

// --------------------------------------------------------------------
// Segment-config exports
// --------------------------------------------------------------------

describe('/mod segment config', () => {
  it("exports runtime = 'nodejs' — getModQueue uses the service-role client", () => {
    expect(runtime).toBe('nodejs')
  })

  it("exports dynamic = 'force-dynamic' — the queue ordering changes on every action; static/ISR would serve a stale or cross-viewer queue", () => {
    expect(dynamic).toBe('force-dynamic')
  })
})

// --------------------------------------------------------------------
// generateMetadata — title + canonical + noIndex
// --------------------------------------------------------------------

describe('/mod generateMetadata', () => {
  it("title is exactly 'Moderation'", () => {
    expect(generateMetadata().title).toBe('Moderation')
  })

  it('description scopes the page to the mod role', () => {
    expect(String(generateMetadata().description)).toMatch(/mod/i)
  })

  it('canonical URL points at /mod absolute against siteConfig.baseUrl', () => {
    expect(generateMetadata().alternates?.canonical).toBe('https://tiered.tv/mod')
  })

  it('emits robots: { index: false, follow: false } — the P0 noIndex: the queue renders unreviewed comment bodies; indexing /mod would surface them in SERP snippets', () => {
    expect(generateMetadata().robots).toEqual({ index: false, follow: false })
  })
})

// --------------------------------------------------------------------
// The P0 leak guard — getModQueue must never fire for a non-mod viewer
// --------------------------------------------------------------------

describe('ModPage — leak guard (getModQueue gated to verified mods only)', () => {
  it('null session → signed-out branch and getModQueue is NEVER called', async () => {
    getSessionMock.mockResolvedValue(null)
    render(await ModPage())
    expect(screen.getByTestId('mod-signed-out')).toBeInTheDocument()
    expect(getModQueueMock).not.toHaveBeenCalled()
  })

  it('session with no user → signed-out branch and getModQueue is NEVER called (the gate is session?.user, not session)', async () => {
    getSessionMock.mockResolvedValue({})
    render(await ModPage())
    expect(screen.getByTestId('mod-signed-out')).toBeInTheDocument()
    expect(getModQueueMock).not.toHaveBeenCalled()
  })

  it('signed-in but no mod:read → not-authorized branch and getModQueue is NEVER called', async () => {
    getSessionMock.mockResolvedValue(modUser(['mod:hide']))
    render(await ModPage())
    expect(screen.getByTestId('mod-not-authorized')).toBeInTheDocument()
    expect(getModQueueMock).not.toHaveBeenCalled()
  })

  it('verified mod → queue branch and getModQueue IS called', async () => {
    getSessionMock.mockResolvedValue(modUser(['mod:read']))
    render(await ModPage())
    expect(screen.getByTestId('mod-queue-page')).toBeInTheDocument()
    expect(getModQueueMock).toHaveBeenCalled()
  })

  it('resolves getSession exactly once per request — no auth fan-out', async () => {
    getSessionMock.mockResolvedValue(null)
    await ModPage()
    expect(getSessionMock).toHaveBeenCalledTimes(1)
  })
})

// --------------------------------------------------------------------
// The gate runs through the REAL claim-reader (both Auth0 encodings)
// --------------------------------------------------------------------

describe('ModPage — isMod via the real permissions claim-reader', () => {
  it("authorizes when mod:read arrives as a JSON array — ['mod:read']", async () => {
    getSessionMock.mockResolvedValue(modUser(['mod:read']))
    render(await ModPage())
    expect(screen.getByTestId('mod-queue-page')).toBeInTheDocument()
  })

  it("authorizes when mod:read arrives comma-separated — 'mod:read,mod:hide'", async () => {
    getSessionMock.mockResolvedValue(modUser('mod:read,mod:hide'))
    render(await ModPage())
    expect(screen.getByTestId('mod-queue-page')).toBeInTheDocument()
  })

  it('denies a signed-in user carrying other mod perms but NOT mod:read — the gate is mod:read-specific', async () => {
    getSessionMock.mockResolvedValue(modUser(['mod:approve', 'mod:hide']))
    render(await ModPage())
    expect(screen.getByTestId('mod-not-authorized')).toBeInTheDocument()
  })

  it('denies a signed-in user with an empty permissions claim', async () => {
    getSessionMock.mockResolvedValue({ user: { nickname: 'plain' } })
    render(await ModPage())
    expect(screen.getByTestId('mod-not-authorized')).toBeInTheDocument()
  })
})

// --------------------------------------------------------------------
// Queue render — pass-through by reference + single drain
// --------------------------------------------------------------------

describe('ModPage — queue render', () => {
  it('passes the getModQueue() result to ModQueue by reference — no copy, no re-shape', async () => {
    const items = makeItems(3)
    getSessionMock.mockResolvedValue(modUser(['mod:read']))
    getModQueueMock.mockResolvedValue(items)
    render(await ModPage())
    expect(ModQueueMock).toHaveBeenCalledTimes(1)
    expect(ModQueueMock.mock.calls[0]?.[0]?.items).toBe(items)
  })

  it('drains the queue exactly once on the verified-mod path — no double-fetch', async () => {
    getSessionMock.mockResolvedValue(modUser(['mod:read']))
    getModQueueMock.mockResolvedValue(makeItems(2))
    await ModPage()
    expect(getModQueueMock).toHaveBeenCalledTimes(1)
  })
})

// --------------------------------------------------------------------
// Item-count pluralization
// --------------------------------------------------------------------

describe('ModPage — item-count pluralization', () => {
  it("renders the singular 'item' for a queue of one", async () => {
    getSessionMock.mockResolvedValue(modUser(['mod:read']))
    getModQueueMock.mockResolvedValue(makeItems(1))
    render(await ModPage())
    expect(screen.getByTestId('mod-queue-page').textContent).toMatch(
      /1 item in the queue/,
    )
  })

  it("renders the plural 'items' for a queue of two", async () => {
    getSessionMock.mockResolvedValue(modUser(['mod:read']))
    getModQueueMock.mockResolvedValue(makeItems(2))
    render(await ModPage())
    expect(screen.getByTestId('mod-queue-page').textContent).toMatch(
      /2 items in the queue/,
    )
  })

  it("renders the plural 'items' for an empty queue (0 items)", async () => {
    getSessionMock.mockResolvedValue(modUser(['mod:read']))
    getModQueueMock.mockResolvedValue([])
    render(await ModPage())
    expect(screen.getByTestId('mod-queue-page').textContent).toMatch(
      /0 items in the queue/,
    )
  })
})
