import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// getProfileActivity composes the profile_activity RPC (identity +
// spoiler-safe aggregate counts) with a published-only recent
// comments query. The mock supplies both: a single rpc() and a
// chainable from().select().eq().eq().order().limit() that resolves
// to a thenable result.

const { rpcMock, limitResultMock } = vi.hoisted(() => ({
  rpcMock: vi.fn(),
  limitResultMock: vi.fn(),
}))

vi.mock('@supabase/supabase-js', () => {
  const builder = () => {
    const chain: Record<string, unknown> = {}
    for (const m of ['select', 'eq', 'order']) {
      chain[m] = vi.fn(() => chain)
    }
    chain['limit'] = vi.fn(() => limitResultMock())
    return chain
  }
  return {
    createClient: () => ({
      rpc: rpcMock,
      from: vi.fn(() => builder()),
    }),
  }
})

const savedUrl = process.env['NEXT_PUBLIC_SUPABASE_URL']
const savedKey = process.env['SUPABASE_SERVICE_ROLE_KEY']

describe('getProfileActivity', () => {
  beforeEach(() => {
    rpcMock.mockReset()
    limitResultMock.mockReset()
    process.env['NEXT_PUBLIC_SUPABASE_URL'] = 'https://example.supabase.co'
    process.env['SUPABASE_SERVICE_ROLE_KEY'] = 'test-key'
    vi.resetModules()
  })
  afterEach(() => {
    if (savedUrl !== undefined) process.env['NEXT_PUBLIC_SUPABASE_URL'] = savedUrl
    else delete process.env['NEXT_PUBLIC_SUPABASE_URL']
    if (savedKey !== undefined) process.env['SUPABASE_SERVICE_ROLE_KEY'] = savedKey
    else delete process.env['SUPABASE_SERVICE_ROLE_KEY']
  })

  it('returns null for a genuinely-unknown handle (no RPC row)', async () => {
    rpcMock.mockResolvedValueOnce({ data: [], error: null })
    const { getProfileActivity } = await import('./server')
    expect(await getProfileActivity({ handle: 'nobody' })).toBeNull()
    expect(rpcMock).toHaveBeenCalledWith('profile_activity', {
      p_handle: 'nobody',
    })
  })

  it('returns null for an empty handle without hitting the RPC', async () => {
    const { getProfileActivity } = await import('./server')
    expect(await getProfileActivity({ handle: '  ' })).toBeNull()
    expect(rpcMock).not.toHaveBeenCalled()
  })

  it('maps identity + counts and the recent published comments', async () => {
    rpcMock.mockResolvedValueOnce({
      data: [
        {
          auth0_sub: 'auth0|dave',
          handle: 'dave',
          display_name: 'Dave',
          created_at: '2026-01-01T00:00:00Z',
          published_comment_count: '4',
          voted_season_count: 7,
          voted_show_count: 3,
        },
      ],
      error: null,
    })
    limitResultMock.mockResolvedValueOnce({
      data: [
        {
          id: 'c1',
          body: 'A line.',
          created_at: '2026-05-01T00:00:00Z',
          target_type: 'season',
          target_id: 'survivor:20',
          sessions: { auth0_sub: 'auth0|dave' },
        },
      ],
      error: null,
    })
    const { getProfileActivity } = await import('./server')
    const out = await getProfileActivity({ handle: 'Dave' })
    expect(out).toEqual({
      handle: 'dave',
      displayName: 'Dave',
      createdAt: '2026-01-01T00:00:00Z',
      publishedCommentCount: 4,
      votedSeasonCount: 7,
      votedShowCount: 3,
      recentComments: [
        {
          id: 'c1',
          body: 'A line.',
          created_at: '2026-05-01T00:00:00Z',
          target_type: 'season',
          target_id: 'survivor:20',
        },
      ],
    })
  })

  it('degrades to an empty recent list when the comments query errors', async () => {
    rpcMock.mockResolvedValueOnce({
      data: {
        auth0_sub: 'auth0|dave',
        handle: 'dave',
        display_name: null,
        created_at: '2026-01-01T00:00:00Z',
        published_comment_count: 0,
        voted_season_count: 0,
        voted_show_count: 0,
      },
      error: null,
    })
    limitResultMock.mockResolvedValueOnce({
      data: null,
      error: { message: 'boom' },
    })
    const { getProfileActivity } = await import('./server')
    const out = await getProfileActivity({ handle: 'dave' })
    expect(out?.recentComments).toEqual([])
    expect(out?.publishedCommentCount).toBe(0)
  })

  it('throws when the RPC itself errors', async () => {
    rpcMock.mockResolvedValueOnce({
      data: null,
      error: { message: 'rpc down', code: 'XX000' },
    })
    const { getProfileActivity } = await import('./server')
    await expect(getProfileActivity({ handle: 'dave' })).rejects.toThrow(
      /rpc down/,
    )
  })
})
