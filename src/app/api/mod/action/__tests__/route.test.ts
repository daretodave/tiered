import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ANON_COOKIE_NAME } from '@/lib/anonSession'
import { PERMISSIONS_CLAIM } from '@/lib/auth0/permissions'

// /api/mod/action is the RBAC-gated moderation entry point a mod
// hits from /mod to approve / hide / remove / unhide / dismiss-flag
// a comment. apps/e2e/tests/mod-gate.spec.ts walks two cases of the
// route (anon → 401, authed-but-not-mod → 403), but the route's
// full branch tree is dark to a hermetic walk: (1) **body validation
// (Zod)** — `commentId` UUID, `action` enum (5 values), optional
// `note` (≤ 500 chars); malformed shapes each return `400
// invalid_body`; the parse gate runs *before* session resolution;
// (2) **happy-path RBAC pass + RPC invocation** — e2e cannot drive
// it because the hermetic mint-cookie user is not a mod (no
// `mod:read` in the permissions claim), so the success branch and
// every action enum value are untested; (3) **defense-in-depth RPC
// error mapping** — the `mod_action()` RPC also checks
// `users.is_mod`, so `42501` from the RPC maps to **403 not_a_mod**
// (the Auth0 claim said yes, but the DB said no — distinct from
// `/api/flag` where `42501` maps to 401), `22023` → `400
// invalid_input`, else → `500 rpc_failed`; (4) **handle derivation**
// — `handleFromSession` falls through nickname → email-localpart →
// sub-sanitized → "user", same multi-source fallback `/api/flag`
// and `/api/comment` use; (5) **anon-cookie pass-through** — the
// resolved anon id is passed to `claimAnonSession` so prior anon
// activity is re-attributed; an invalid / absent cookie still
// resolves; (6) **camelCase success shape** — the response echoes
// `{ok, status, actionId}` where `status` is `result.newStatus`
// (renamed) and `actionId` is `Number(result.actionId)`. The Auth0
// + Supabase boundaries are mocked; `anonSession` stays real so
// the cookie regex + UUID validation run for genuine —
// `auth0/permissions` stays real too so the live `isMod` derives
// from the actual permissions claim shape (not a mock-returned
// boolean), which pins the route against a regression that drops
// the `isMod` import altogether.
const {
  getSessionMock,
  modActionMock,
  claimAnonSessionMock,
  upsertUserMock,
} = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
  modActionMock: vi.fn(),
  claimAnonSessionMock: vi.fn(),
  upsertUserMock: vi.fn(),
}))

vi.mock('@/lib/auth0', () => ({
  auth0: { getSession: getSessionMock },
}))

vi.mock('@/lib/supabase/server', () => ({
  claimAnonSession: claimAnonSessionMock,
  upsertUser: upsertUserMock,
}))

vi.mock('@/lib/supabase/mod', () => ({
  modAction: modActionMock,
}))

import { POST, dynamic, runtime } from '../route'

const VALID_ANON_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d'
const VALID_COMMENT_ID = 'cccccccc-dddd-4eee-8fff-000000000001'
const AUTHED_SUB = 'auth0|mod123'
const VALID_BODY = {
  commentId: VALID_COMMENT_ID,
  action: 'approve' as const,
}

function postRequest(
  opts: { body?: unknown; raw?: string; cookie?: string } = {},
): Request {
  const headers = new Headers()
  if (opts.cookie !== undefined) headers.set('cookie', opts.cookie)
  const body =
    opts.raw !== undefined ? opts.raw : JSON.stringify(opts.body ?? VALID_BODY)
  return new Request('http://localhost/api/mod/action', {
    method: 'POST',
    headers,
    body,
  })
}

const anonCookie = `${ANON_COOKIE_NAME}=${VALID_ANON_ID}`

// A session for a user with mod:read (and the rest of the mod
// permission set). The route uses live `isMod`, which reads the
// `https://tiered.app/permissions` claim — keep the claim real
// so a regression dropping the import surfaces.
function modSession(extras: Record<string, unknown> = {}) {
  return {
    user: {
      sub: AUTHED_SUB,
      nickname: 'Moderator',
      [PERMISSIONS_CLAIM]: ['mod:read', 'mod:approve', 'mod:hide'],
      ...extras,
    },
  }
}

// An authed session that carries no mod permission — the Auth0
// claim is present-but-empty (or missing).
function authedNonModSession(extras: Record<string, unknown> = {}) {
  return {
    user: { sub: AUTHED_SUB, nickname: 'Regular', ...extras },
  }
}

beforeEach(() => {
  getSessionMock.mockReset()
  getSessionMock.mockResolvedValue(modSession())
  modActionMock.mockReset()
  modActionMock.mockResolvedValue({ newStatus: 'hidden', actionId: 42 })
  claimAnonSessionMock.mockReset()
  claimAnonSessionMock.mockResolvedValue({ sessionId: 'claimed-session-id' })
  upsertUserMock.mockReset()
  upsertUserMock.mockResolvedValue(undefined)
})

describe('POST /api/mod/action — body validation', () => {
  it('runs a mod action for a well-formed body and returns the success shape', async () => {
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({
      ok: true,
      status: 'hidden',
      actionId: 42,
    })
    expect(modActionMock).toHaveBeenCalledWith({
      sessionId: 'claimed-session-id',
      commentId: VALID_COMMENT_ID,
      action: 'approve',
      note: null,
    })
  })

  it('passes an explicit note through unchanged', async () => {
    await POST(
      postRequest({
        body: { ...VALID_BODY, note: 'spoilers, hiding for 48h' },
        cookie: anonCookie,
      }),
    )
    expect(modActionMock).toHaveBeenCalledWith(
      expect.objectContaining({ note: 'spoilers, hiding for 48h' }),
    )
  })

  it('coerces an omitted note to null (modAction always receives a string|null)', async () => {
    await POST(postRequest({ cookie: anonCookie }))
    expect(modActionMock).toHaveBeenCalledWith(
      expect.objectContaining({ note: null }),
    )
  })

  it('rejects a non-UUID commentId with 400 invalid_body', async () => {
    const res = await POST(
      postRequest({ body: { ...VALID_BODY, commentId: 'not-a-uuid' } }),
    )
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({
      ok: false,
      error: 'invalid_body',
    })
    expect(modActionMock).not.toHaveBeenCalled()
  })

  it('rejects a missing commentId with 400 invalid_body', async () => {
    const res = await POST(postRequest({ body: { action: 'approve' } }))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ error: 'invalid_body' })
  })

  it('rejects a missing action with 400 invalid_body', async () => {
    const res = await POST(postRequest({ body: { commentId: VALID_COMMENT_ID } }))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ error: 'invalid_body' })
  })

  it('rejects an out-of-enum action with 400 invalid_body', async () => {
    const res = await POST(
      postRequest({ body: { ...VALID_BODY, action: 'delete' } }),
    )
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ error: 'invalid_body' })
  })

  it('rejects a note longer than 500 chars with 400 invalid_body', async () => {
    const res = await POST(
      postRequest({ body: { ...VALID_BODY, note: 'x'.repeat(501) } }),
    )
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ error: 'invalid_body' })
  })

  it('accepts a note at the 500-char boundary', async () => {
    const res = await POST(
      postRequest({ body: { ...VALID_BODY, note: 'x'.repeat(500) } }),
    )
    expect(res.status).toBe(200)
    expect(modActionMock).toHaveBeenCalledWith(
      expect.objectContaining({ note: 'x'.repeat(500) }),
    )
  })

  it('rejects a non-JSON body with 400 invalid_body', async () => {
    const res = await POST(
      postRequest({ raw: 'not json at all', cookie: anonCookie }),
    )
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ error: 'invalid_body' })
    expect(modActionMock).not.toHaveBeenCalled()
  })

  it('validates the body before resolving a session (parse gate runs first)', async () => {
    getSessionMock.mockResolvedValue(null)
    const res = await POST(postRequest({ body: { action: 'approve' } }))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({ error: 'invalid_body' })
    expect(getSessionMock).not.toHaveBeenCalled()
  })
})

describe('POST /api/mod/action — auth gate', () => {
  it('rejects an anon caller with 401 auth_required', async () => {
    getSessionMock.mockResolvedValue(null)
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(401)
    await expect(res.json()).resolves.toMatchObject({
      ok: false,
      error: 'auth_required',
    })
    expect(modActionMock).not.toHaveBeenCalled()
    expect(upsertUserMock).not.toHaveBeenCalled()
    expect(claimAnonSessionMock).not.toHaveBeenCalled()
  })

  it('rejects a session that carries no sub with 401 auth_required', async () => {
    // Half-baked Auth0 session — user but no sub.
    getSessionMock.mockResolvedValue({ user: { nickname: 'Moderator' } })
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(401)
    await expect(res.json()).resolves.toMatchObject({ error: 'auth_required' })
    expect(modActionMock).not.toHaveBeenCalled()
  })
})

describe('POST /api/mod/action — RBAC gate (isMod)', () => {
  it('rejects an authed caller without mod permissions with 403 not_a_mod', async () => {
    getSessionMock.mockResolvedValue(authedNonModSession())
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(403)
    await expect(res.json()).resolves.toMatchObject({
      ok: false,
      error: 'not_a_mod',
    })
    expect(modActionMock).not.toHaveBeenCalled()
    expect(upsertUserMock).not.toHaveBeenCalled()
    expect(claimAnonSessionMock).not.toHaveBeenCalled()
  })

  it('rejects an authed caller whose permissions claim is present but empty with 403', async () => {
    getSessionMock.mockResolvedValue(
      authedNonModSession({ [PERMISSIONS_CLAIM]: [] }),
    )
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(403)
    await expect(res.json()).resolves.toMatchObject({ error: 'not_a_mod' })
  })

  it('rejects an authed caller carrying only non-mod permissions with 403', async () => {
    // The permissions claim normalizes both array and CSV-string
    // shapes; pin both with a non-mod CSV here.
    getSessionMock.mockResolvedValue(
      authedNonModSession({ [PERMISSIONS_CLAIM]: 'read:home' }),
    )
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(403)
    await expect(res.json()).resolves.toMatchObject({ error: 'not_a_mod' })
  })

  it('passes a CSV permissions claim that contains mod:read', async () => {
    // Defense-in-depth on the claim-shape normalization — the
    // route must accept the CSV-string variant Auth0 sometimes
    // emits, not just the array form.
    getSessionMock.mockResolvedValue(
      authedNonModSession({ [PERMISSIONS_CLAIM]: 'mod:read, mod:approve' }),
    )
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(200)
    expect(modActionMock).toHaveBeenCalled()
  })

  it('does not call upsertUser or claimAnonSession when the RBAC gate fails', async () => {
    // Important: the not-a-mod branch returns *before* we touch
    // Supabase, so we never leak a half-claimed session for a
    // user who failed the gate.
    getSessionMock.mockResolvedValue(authedNonModSession())
    await POST(postRequest({ cookie: anonCookie }))
    expect(upsertUserMock).not.toHaveBeenCalled()
    expect(claimAnonSessionMock).not.toHaveBeenCalled()
  })
})

describe('POST /api/mod/action — session resolution', () => {
  it('upserts the users row and claims the anon session for an authed mod', async () => {
    getSessionMock.mockResolvedValue(
      modSession({
        nickname: 'Moderator',
        email: 'mod@example.com',
        name: 'M. Oderator',
      }),
    )
    await POST(postRequest({ cookie: anonCookie }))
    expect(upsertUserMock).toHaveBeenCalledWith({
      sub: AUTHED_SUB,
      handle: 'moderator',
      email: 'mod@example.com',
      displayName: 'M. Oderator',
    })
    expect(claimAnonSessionMock).toHaveBeenCalledWith({
      anonId: VALID_ANON_ID,
      sub: AUTHED_SUB,
    })
  })

  it('claims with anonId=null when the cookie is absent', async () => {
    await POST(postRequest())
    expect(claimAnonSessionMock).toHaveBeenCalledWith({
      anonId: null,
      sub: AUTHED_SUB,
    })
  })

  it('claims with anonId=null when the cookie is not a valid UUID', async () => {
    await POST(postRequest({ cookie: `${ANON_COOKIE_NAME}=not-a-uuid` }))
    expect(claimAnonSessionMock).toHaveBeenCalledWith({
      anonId: null,
      sub: AUTHED_SUB,
    })
  })

  it('runs the action as the claimed session id, not the raw anon id', async () => {
    claimAnonSessionMock.mockResolvedValue({ sessionId: 'claimed-xyz' })
    await POST(postRequest({ cookie: anonCookie }))
    expect(modActionMock).toHaveBeenCalledWith(
      expect.objectContaining({ sessionId: 'claimed-xyz' }),
    )
  })

  it('lets a getSession() rejection propagate (no try/catch wraps the auth0 call)', async () => {
    // getSession runs after the parse gate but before isMod /
    // upsertUser / claimAnonSession — the route does NOT wrap
    // it in a try/catch (unlike /api/flag, which puts the whole
    // session-resolution block in one try/catch and maps any
    // throw to 500 auth_resolve_failed). Pin the current
    // contract: a rejection bubbles to the Next handler, which
    // will surface it as a framework-level 500 — distinct from
    // the route's own structured 500 errors.
    getSessionMock.mockRejectedValue(new Error('auth0 unreachable'))
    await expect(POST(postRequest({ cookie: anonCookie }))).rejects.toThrow(
      'auth0 unreachable',
    )
    expect(modActionMock).not.toHaveBeenCalled()
  })

  it('maps an upsertUser failure to 500 auth_resolve_failed', async () => {
    upsertUserMock.mockRejectedValue(new Error('users upsert wedged'))
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toMatchObject({
      ok: false,
      error: 'auth_resolve_failed',
    })
    expect(modActionMock).not.toHaveBeenCalled()
  })

  it('maps a claimAnonSession failure to 500 auth_resolve_failed', async () => {
    claimAnonSessionMock.mockRejectedValue(new Error('claim wedged'))
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toMatchObject({
      error: 'auth_resolve_failed',
    })
    expect(modActionMock).not.toHaveBeenCalled()
  })
})

describe('POST /api/mod/action — handle derivation', () => {
  it('derives handle from a nickname (lowercased, leading @ stripped)', async () => {
    getSessionMock.mockResolvedValue(modSession({ nickname: '@Moderator' }))
    await POST(postRequest({ cookie: anonCookie }))
    expect(upsertUserMock).toHaveBeenCalledWith(
      expect.objectContaining({ handle: 'moderator' }),
    )
  })

  it('falls back to email-localpart (lowercased) when nickname is absent', async () => {
    getSessionMock.mockResolvedValue(
      modSession({ nickname: undefined, email: 'Mod@example.com' }),
    )
    await POST(postRequest({ cookie: anonCookie }))
    expect(upsertUserMock).toHaveBeenCalledWith(
      expect.objectContaining({ handle: 'mod', email: 'Mod@example.com' }),
    )
  })

  it('falls back to a sanitized sub when nickname and email are absent', async () => {
    getSessionMock.mockResolvedValue(
      modSession({ nickname: undefined, email: undefined }),
    )
    await POST(postRequest({ cookie: anonCookie }))
    // sub 'auth0|mod123' → sanitized 'auth0-mod123' lowercased
    expect(upsertUserMock).toHaveBeenCalledWith(
      expect.objectContaining({ handle: 'auth0-mod123' }),
    )
  })
})

describe('POST /api/mod/action — action enum coverage', () => {
  it.each(['approve', 'hide', 'remove', 'unhide', 'dismiss_flag'] as const)(
    'passes %s through to modAction unchanged',
    async (action) => {
      await POST(
        postRequest({ body: { ...VALID_BODY, action }, cookie: anonCookie }),
      )
      expect(modActionMock).toHaveBeenCalledWith(
        expect.objectContaining({ action }),
      )
    },
  )
})

describe('POST /api/mod/action — response shape (camelCase)', () => {
  it('echoes status (from newStatus) + actionId, NOT new_status / action_id', async () => {
    modActionMock.mockResolvedValue({ newStatus: 'removed', actionId: 99 })
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(200)
    const body = (await res.json()) as Record<string, unknown>
    expect(body).toEqual({ ok: true, status: 'removed', actionId: 99 })
    // Defense-in-depth: the route MUST surface camelCase — the
    // /mod queue client reads `status` and `actionId`, not the
    // RPC's raw new_status / action_id columns.
    expect(body).not.toHaveProperty('newStatus')
    expect(body).not.toHaveProperty('new_status')
    expect(body).not.toHaveProperty('action_id')
  })

  it('passes through arbitrary newStatus values from the RPC', async () => {
    modActionMock.mockResolvedValue({ newStatus: 'published', actionId: 7 })
    const res = await POST(postRequest({ cookie: anonCookie }))
    await expect(res.json()).resolves.toEqual({
      ok: true,
      status: 'published',
      actionId: 7,
    })
  })

  it('calls modAction exactly once per valid request', async () => {
    await POST(postRequest({ cookie: anonCookie }))
    expect(modActionMock).toHaveBeenCalledTimes(1)
  })
})

describe('POST /api/mod/action — RPC error mapping', () => {
  it('maps a 42501 RLS denial to 403 not_a_mod (defense-in-depth — Auth0 said yes, DB said no)', async () => {
    // This is the distinctive contract vs /api/flag: /api/flag
    // maps 42501 to 401 auth_required, but /api/mod/action maps
    // it to 403 not_a_mod because the RPC's RLS check is the
    // server-side mod-role enforcement (`users.is_mod`). A
    // mismatch between Auth0 permissions and the DB mod flag
    // must surface as "not a mod," not "sign in again."
    modActionMock.mockRejectedValue(
      Object.assign(new Error('mod role required'), { code: '42501' }),
    )
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(403)
    await expect(res.json()).resolves.toMatchObject({
      ok: false,
      error: 'not_a_mod',
    })
  })

  it('maps a 22023 invalid-argument to 400 invalid_input', async () => {
    modActionMock.mockRejectedValue(
      Object.assign(new Error('bad action'), { code: '22023' }),
    )
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toMatchObject({
      ok: false,
      error: 'invalid_input',
    })
  })

  it('maps any other RPC throw to 500 rpc_failed', async () => {
    modActionMock.mockRejectedValue(new Error('connection reset'))
    const res = await POST(postRequest({ cookie: anonCookie }))
    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toMatchObject({
      ok: false,
      error: 'rpc_failed',
    })
  })

  it('includes the RPC error message in the detail field', async () => {
    modActionMock.mockRejectedValue(new Error('upstream timeout'))
    const res = await POST(postRequest({ cookie: anonCookie }))
    const body = (await res.json()) as { detail: string }
    expect(body.detail).toBe('upstream timeout')
  })
})

describe('/api/mod/action — route contract', () => {
  it('declares the nodejs runtime', () => {
    expect(runtime).toBe('nodejs')
  })

  it('declares force-dynamic so the mod action route never bakes at build', () => {
    expect(dynamic).toBe('force-dynamic')
  })
})
