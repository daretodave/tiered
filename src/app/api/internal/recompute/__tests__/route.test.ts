import { beforeEach, describe, expect, it, vi } from 'vitest'

// /api/internal/recompute is the scheduled-recompute entry point a
// Vercel Cron hits weekly; it calls the recompute_rankings()
// service-role RPC. Its authorized() guard is env-conditional: with
// CRON_SECRET set (production) the Authorization header must equal
// `Bearer <CRON_SECRET>` exactly, and with CRON_SECRET unset (local
// dev + hermetic e2e) the route is open. The e2e harness runs with
// CRON_SECRET unset, so it only ever walks the open branch — the
// production security branch is invisible to it. The Supabase
// boundary is mocked; CRON_SECRET is driven with vi.stubEnv, so the
// guard, the ?show -> p_show mapping, the RPC-error -> 500 shape,
// and GET/POST parity all get pinned where e2e cannot reach.
const { rpcMock, serviceRoleClientMock } = vi.hoisted(() => ({
  rpcMock: vi.fn(),
  serviceRoleClientMock: vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({
  serviceRoleClient: serviceRoleClientMock,
}))

import { GET, POST, dynamic, runtime } from '../route'

function recomputeRequest(
  opts: { method?: 'GET' | 'POST'; auth?: string; show?: string } = {},
): Request {
  const base = 'http://localhost/api/internal/recompute'
  const url = opts.show !== undefined ? `${base}?show=${opts.show}` : base
  const headers = new Headers()
  if (opts.auth !== undefined) headers.set('authorization', opts.auth)
  return new Request(url, { method: opts.method ?? 'POST', headers })
}

beforeEach(() => {
  vi.unstubAllEnvs()
  rpcMock.mockReset()
  rpcMock.mockResolvedValue({ data: 1, error: null })
  serviceRoleClientMock.mockReset()
  serviceRoleClientMock.mockReturnValue({ rpc: rpcMock })
})

describe('POST /api/internal/recompute — CRON_SECRET guard (production branch)', () => {
  it('authorizes a request whose bearer token matches CRON_SECRET', async () => {
    vi.stubEnv('CRON_SECRET', 'topsecret')
    const res = await POST(recomputeRequest({ auth: 'Bearer topsecret' }))
    expect(res.status).toBe(200)
    expect(rpcMock).toHaveBeenCalledTimes(1)
  })

  it('rejects with 401 when the Authorization header is absent', async () => {
    vi.stubEnv('CRON_SECRET', 'topsecret')
    const res = await POST(recomputeRequest())
    expect(res.status).toBe(401)
    await expect(res.json()).resolves.toEqual({ ok: false, error: 'unauthorized' })
    // The guard short-circuits before the RPC — no recompute runs.
    expect(rpcMock).not.toHaveBeenCalled()
  })

  it('rejects with 401 when the bearer token does not match CRON_SECRET', async () => {
    vi.stubEnv('CRON_SECRET', 'topsecret')
    const res = await POST(recomputeRequest({ auth: 'Bearer wrong-secret' }))
    expect(res.status).toBe(401)
    expect(rpcMock).not.toHaveBeenCalled()
  })

  it('rejects with 401 when the secret is sent without the Bearer prefix', async () => {
    // The compare is exact: `header === \`Bearer ${secret}\``.
    vi.stubEnv('CRON_SECRET', 'topsecret')
    const res = await POST(recomputeRequest({ auth: 'topsecret' }))
    expect(res.status).toBe(401)
    expect(rpcMock).not.toHaveBeenCalled()
  })

  it('rejects with 401 when the Bearer scheme casing differs', async () => {
    // Exact string compare — a lowercase scheme must not pass.
    vi.stubEnv('CRON_SECRET', 'topsecret')
    const res = await POST(recomputeRequest({ auth: 'bearer topsecret' }))
    expect(res.status).toBe(401)
    expect(rpcMock).not.toHaveBeenCalled()
  })
})

describe('POST /api/internal/recompute — open when CRON_SECRET is unset (local + hermetic e2e)', () => {
  it('runs the recompute with no auth header when CRON_SECRET is unset', async () => {
    vi.stubEnv('CRON_SECRET', undefined)
    const res = await POST(recomputeRequest())
    expect(res.status).toBe(200)
    expect(rpcMock).toHaveBeenCalledTimes(1)
  })

  it('ignores a non-matching Authorization header when CRON_SECRET is unset', async () => {
    // !secret short-circuits before the header is ever read.
    vi.stubEnv('CRON_SECRET', undefined)
    const res = await POST(recomputeRequest({ auth: 'Bearer anything-at-all' }))
    expect(res.status).toBe(200)
    expect(rpcMock).toHaveBeenCalledTimes(1)
  })
})

describe('POST /api/internal/recompute — RPC invocation', () => {
  it('passes the ?show slug through as p_show', async () => {
    vi.stubEnv('CRON_SECRET', undefined)
    await POST(recomputeRequest({ show: 'the-challenge' }))
    expect(rpcMock).toHaveBeenCalledWith('recompute_rankings', {
      p_show: 'the-challenge',
    })
  })

  it('passes p_show: null when no ?show param is present', async () => {
    vi.stubEnv('CRON_SECRET', undefined)
    await POST(recomputeRequest())
    expect(rpcMock).toHaveBeenCalledWith('recompute_rankings', { p_show: null })
  })

  it('passes p_show: null when ?show is empty', async () => {
    vi.stubEnv('CRON_SECRET', undefined)
    await POST(recomputeRequest({ show: '' }))
    expect(rpcMock).toHaveBeenCalledWith('recompute_rankings', { p_show: null })
  })

  it('reports rowsWritten from the RPC return value', async () => {
    vi.stubEnv('CRON_SECRET', undefined)
    rpcMock.mockResolvedValue({ data: 42, error: null })
    const res = await POST(recomputeRequest())
    const body = await res.json()
    expect(body.ok).toBe(true)
    expect(body.rowsWritten).toBe(42)
  })

  it('coerces a null RPC return to rowsWritten: 0', async () => {
    vi.stubEnv('CRON_SECRET', undefined)
    rpcMock.mockResolvedValue({ data: null, error: null })
    const res = await POST(recomputeRequest())
    const body = await res.json()
    expect(body.rowsWritten).toBe(0)
  })

  it('echoes the show slug and a valid ISO recomputedAt in the success body', async () => {
    vi.stubEnv('CRON_SECRET', undefined)
    const withShow = await (await POST(recomputeRequest({ show: 'top-chef' }))).json()
    expect(withShow.show).toBe('top-chef')
    expect(typeof withShow.recomputedAt).toBe('string')
    expect(new Date(withShow.recomputedAt).toISOString()).toBe(withShow.recomputedAt)

    const noShow = await (await POST(recomputeRequest())).json()
    expect(noShow.show).toBeNull()
  })
})

describe('POST /api/internal/recompute — error mapping', () => {
  it('maps an RPC error to a 500 recompute_failed response', async () => {
    vi.stubEnv('CRON_SECRET', undefined)
    rpcMock.mockResolvedValue({ data: null, error: { message: 'snapshot deadlock' } })
    const res = await POST(recomputeRequest())
    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toEqual({
      ok: false,
      error: 'recompute_failed',
      detail: 'snapshot deadlock',
    })
  })

  it('maps a thrown service-role client failure to a 500', async () => {
    vi.stubEnv('CRON_SECRET', undefined)
    serviceRoleClientMock.mockImplementationOnce(() => {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY missing')
    })
    const res = await POST(recomputeRequest())
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toBe('recompute_failed')
    expect(body.detail).toBe('SUPABASE_SERVICE_ROLE_KEY missing')
  })
})

describe('GET /api/internal/recompute — parity + route contract', () => {
  it('GET routes through the same recompute path as POST', async () => {
    vi.stubEnv('CRON_SECRET', undefined)
    const res = await GET(recomputeRequest({ method: 'GET', show: 'survivor' }))
    expect(res.status).toBe(200)
    expect(rpcMock).toHaveBeenCalledWith('recompute_rankings', { p_show: 'survivor' })
  })

  it('GET enforces the CRON_SECRET guard too', async () => {
    vi.stubEnv('CRON_SECRET', 'topsecret')
    const res = await GET(recomputeRequest({ method: 'GET' }))
    expect(res.status).toBe(401)
    expect(rpcMock).not.toHaveBeenCalled()
  })

  it('declares the nodejs runtime', () => {
    expect(runtime).toBe('nodejs')
  })

  it('declares force-dynamic so the cron route never bakes at build', () => {
    expect(dynamic).toBe('force-dynamic')
  })
})
