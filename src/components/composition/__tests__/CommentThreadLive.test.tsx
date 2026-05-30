import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CommentThreadLive } from '../CommentThreadLive'

afterEach(() => {
  vi.unstubAllGlobals()
})

function stubFetch(payload: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok: true, json: async () => payload }),
  )
}

describe('<CommentThreadLive>', () => {
  it('renders published comments and the real input when signed in', async () => {
    stubFetch({
      ok: true,
      signedIn: true,
      count: 1,
      comments: [
        {
          id: 'p1',
          body: 'The structure of this season rewards a rewatch.',
          author: 'asha',
          createdAt: '2026-05-10T00:00:00Z',
          score: 0,
          held: false,
          collapsed: false,
        },
      ],
    })
    render(
      <CommentThreadLive
        targetType="season"
        targetId="survivor:20"
        signInHref="/sign-in"
      />,
    )
    await waitFor(() => {
      expect(screen.getByTestId('comment-list')).toBeInTheDocument()
    })
    expect(screen.getByTestId('comment-count')).toHaveTextContent('1 comment')
    expect(screen.getByTestId('comment-body')).toHaveTextContent('rewatch')
    // Signed-in → the real comment input (stub button), not the
    // sign-in link.
    expect(screen.getByTestId('comment-stub')).toBeInTheDocument()
    expect(screen.queryByTestId('comment-stub-link')).toBeNull()
  })

  it('threads the response handle into the CommentInput stub as "as @handle"', async () => {
    // Closes CRITIQUE pass-18 MED: the route's signed-in payload now
    // carries the viewer handle; the live wrapper must pass it through
    // so the un-acted authed surface names the publishing identity.
    stubFetch({
      ok: true,
      signedIn: true,
      handle: 'e2e',
      count: 0,
      comments: [],
    })
    render(
      <CommentThreadLive
        targetType="season"
        targetId="survivor:20"
        signInHref="/sign-in"
      />,
    )
    await waitFor(() => {
      expect(screen.getByTestId('comment-stub-as')).toHaveTextContent('as @e2e')
    })
  })

  it('omits the attribution when the response signs the viewer in but reports no handle', async () => {
    stubFetch({
      ok: true,
      signedIn: true,
      handle: null,
      count: 0,
      comments: [],
    })
    render(
      <CommentThreadLive
        targetType="season"
        targetId="survivor:20"
        signInHref="/sign-in"
      />,
    )
    await waitFor(() => {
      expect(screen.getByTestId('comment-stub')).toBeInTheDocument()
    })
    expect(screen.queryByTestId('comment-stub-as')).toBeNull()
  })

  it('shows the sign-in stub for an anon viewer and the empty state', async () => {
    stubFetch({ ok: true, signedIn: false, count: 0, comments: [] })
    render(
      <CommentThreadLive
        targetType="season"
        targetId="survivor:20"
        signInHref="/sign-in?return=/x"
      />,
    )
    await waitFor(() => {
      expect(screen.getByTestId('comment-stub-link')).toHaveAttribute(
        'href',
        '/sign-in?return=/x',
      )
    })
    expect(screen.getByTestId('comment-thread-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('comment-list')).toBeNull()
  })

  it('renders a held-only thread (meta eyebrow stays absent, row shows)', async () => {
    stubFetch({
      ok: true,
      signedIn: true,
      count: 0,
      comments: [
        {
          id: 'h1',
          body: 'My freshly posted take, pending review.',
          author: 'asha',
          createdAt: '2026-05-17T00:00:00Z',
          score: 0,
          held: true,
          collapsed: false,
        },
      ],
    })
    render(
      <CommentThreadLive
        targetType="season"
        targetId="survivor:20"
        signInHref="/sign-in"
      />,
    )
    await waitFor(() => {
      expect(screen.getByTestId('comment-held-badge')).toBeInTheDocument()
    })
    expect(screen.queryByTestId('comment-count')).toBeNull()
    expect(screen.queryByTestId('comment-thread-empty')).toBeNull()
  })

  it('keeps the empty-state when signed in with zero comments — composer is a prompt, not a state confirmation', async () => {
    // Closes CRITIQUE pass-19 MED: authed visitors used to see only
    // the composer with no signal whether the thread was empty,
    // suppressed, or failed to load. The empty-state line confirms
    // the surface state; the composer placeholder confirms the
    // policy. They do different jobs and should both render.
    stubFetch({ ok: true, signedIn: true, count: 0, comments: [] })
    render(
      <CommentThreadLive
        targetType="season"
        targetId="survivor:20"
        signInHref="/sign-in"
      />,
    )
    await waitFor(() => {
      expect(screen.getByTestId('comment-stub')).toBeInTheDocument()
    })
    expect(screen.getByTestId('comment-thread-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('comment-count')).toBeNull()
    expect(screen.queryByTestId('comment-list')).toBeNull()
  })

  it('keeps the empty state when the fetch fails (always-working)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    render(
      <CommentThreadLive
        targetType="season"
        targetId="survivor:20"
        signInHref="/sign-in"
      />,
    )
    await new Promise((r) => setTimeout(r, 0))
    expect(screen.getByTestId('comment-thread-empty')).toBeInTheDocument()
    expect(screen.getByTestId('comment-stub-link')).toBeInTheDocument()
  })
})
