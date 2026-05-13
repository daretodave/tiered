// @vitest-environment node
// jsdom breaks Uint8Array realm checks that @panva/hkdf + jose enforce.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { tmpdir } from 'node:os'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import * as jose from 'jose'
import { hkdf } from '@panva/hkdf'
import {
  buildSessionPayload,
  encryptSessionCookie,
  isFresh,
  passwordGrant,
  readCache,
  upsertEnvLine,
  writeCache,
} from '../../../scripts/mint-e2e-cookie.mjs'

const SDK_DIGEST = 'sha256'
const SDK_INFO = 'JWE CEK'

function tempPath(name: string): string {
  return path.join(tmpdir(), `pantheon-mint-${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${name}`)
}

describe('isFresh', () => {
  it('returns false for null / undefined input', () => {
    expect(isFresh(null)).toBe(false)
    expect(isFresh(undefined)).toBe(false)
  })

  it('returns false when expiresAt is missing', () => {
    expect(isFresh({ cookieName: '__session', cookieValue: 'x' })).toBe(false)
  })

  it('returns false when cookieValue is missing', () => {
    expect(
      isFresh({
        expiresAt: new Date(Date.now() + 60 * 60_000).toISOString(),
        cookieName: '__session',
      }),
    ).toBe(false)
  })

  it('returns false when expiresAt is in the past', () => {
    expect(
      isFresh({
        expiresAt: new Date(Date.now() - 60_000).toISOString(),
        cookieName: '__session',
        cookieValue: 'x',
      }),
    ).toBe(false)
  })

  it('returns false when within 5 min of expiry', () => {
    const exp = new Date(Date.now() + 4 * 60_000).toISOString()
    expect(isFresh({ expiresAt: exp, cookieName: '__session', cookieValue: 'x' })).toBe(false)
  })

  it('returns true when more than 5 min from expiry', () => {
    const exp = new Date(Date.now() + 60 * 60_000).toISOString()
    expect(isFresh({ expiresAt: exp, cookieName: '__session', cookieValue: 'x' })).toBe(true)
  })

  it('returns false on malformed expiresAt', () => {
    expect(
      isFresh({ expiresAt: 'not-a-date', cookieName: '__session', cookieValue: 'x' }),
    ).toBe(false)
  })
})

describe('upsertEnvLine', () => {
  let envPath: string

  beforeEach(() => {
    envPath = tempPath('env')
  })

  afterEach(() => {
    try {
      rmSync(envPath)
    } catch {
      /* ignore */
    }
  })

  it('inserts a new key when the file is missing', () => {
    upsertEnvLine(envPath, 'FOO', 'bar')
    expect(readFileSync(envPath, 'utf8')).toMatch(/^FOO=bar$/m)
  })

  it('appends a marker block when key is new', () => {
    writeFileSync(envPath, 'EXISTING=1\n', 'utf8')
    upsertEnvLine(envPath, 'NEW', 'v')
    const out = readFileSync(envPath, 'utf8')
    expect(out).toMatch(/EXISTING=1/)
    expect(out).toMatch(/NEW=v/)
    expect(out).toMatch(/managed by scripts\/mint-e2e-cookie\.mjs/)
  })

  it('updates an existing line in place (idempotent on rerun)', () => {
    writeFileSync(envPath, 'FOO=old\nKEEP=1\n', 'utf8')
    upsertEnvLine(envPath, 'FOO', 'new')
    upsertEnvLine(envPath, 'FOO', 'newer')
    const out = readFileSync(envPath, 'utf8')
    expect(out).toMatch(/FOO=newer/)
    expect(out).not.toMatch(/FOO=old/)
    expect(out).toMatch(/KEEP=1/)
    // Only one FOO= line.
    expect(out.match(/^FOO=/gm)).toHaveLength(1)
  })
})

describe('readCache / writeCache', () => {
  let cachePath: string

  beforeEach(() => {
    cachePath = tempPath('cache.json')
  })

  afterEach(() => {
    try {
      rmSync(cachePath)
    } catch {
      /* ignore */
    }
  })

  it('returns null when the cache file does not exist', () => {
    expect(readCache(cachePath)).toBe(null)
  })

  it('returns null when the cache file is malformed', () => {
    mkdirSync(path.dirname(cachePath), { recursive: true })
    writeFileSync(cachePath, '{not valid json', 'utf8')
    expect(readCache(cachePath)).toBe(null)
  })

  it('round-trips a payload through write + read', () => {
    const payload = { foo: 'bar', n: 42 }
    writeCache(payload, cachePath)
    expect(readCache(cachePath)).toEqual(payload)
  })
})

describe('passwordGrant', () => {
  function makeFetch(status: number, body: unknown): typeof fetch {
    return (async () =>
      new Response(typeof body === 'string' ? body : JSON.stringify(body), {
        status,
      })) as unknown as typeof fetch
  }

  it('throws when a required field is missing', async () => {
    await expect(passwordGrant({})).rejects.toThrow(/missing/)
  })

  it('returns parsed tokens on 200 OK', async () => {
    const fakeBody = {
      access_token: 'a',
      id_token: 'i',
      refresh_token: 'r',
      expires_in: 3600,
      token_type: 'Bearer',
      scope: 'openid profile email',
    }
    const tokens = await passwordGrant({
      domain: 'x.auth0.com',
      clientId: 'c',
      clientSecret: 's',
      audience: 'a',
      username: 'u',
      password: 'p',
      fetchFn: makeFetch(200, fakeBody),
    })
    expect(tokens.accessToken).toBe('a')
    expect(tokens.idToken).toBe('i')
    expect(tokens.refreshToken).toBe('r')
    expect(tokens.expiresIn).toBe(3600)
  })

  it('throws with status + body on 403 (password grant disabled)', async () => {
    const fetchFn = makeFetch(403, { error: 'unauthorized_client' })
    await expect(
      passwordGrant({
        domain: 'x',
        clientId: 'c',
        clientSecret: 's',
        audience: 'a',
        username: 'u',
        password: 'p',
        fetchFn,
      }),
    ).rejects.toThrow(/403/)
  })

  it('throws on 401 (bad creds)', async () => {
    const fetchFn = makeFetch(401, { error: 'invalid_grant' })
    await expect(
      passwordGrant({
        domain: 'x',
        clientId: 'c',
        clientSecret: 's',
        audience: 'a',
        username: 'u',
        password: 'p',
        fetchFn,
      }),
    ).rejects.toThrow(/401/)
  })
})

describe('encryptSessionCookie / buildSessionPayload', () => {
  it('round-trips via jose.jwtDecrypt with the same secret + algorithm', async () => {
    const secret = 'a'.repeat(64)
    const nowSec = Math.floor(Date.now() / 1000)
    const idTokenPayload = { sub: 'auth0|abc', email: 'e2e@pantheon.app', sid: 's' }
    // buildSessionPayload only base64url-decodes the JWT payload section;
    // it never verifies. Construct a JWT directly so the test doesn't
    // depend on jose's SignJWT secret-key type narrowing.
    const headerB64 = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
    const payloadB64 = Buffer.from(JSON.stringify(idTokenPayload)).toString('base64url')
    const idToken = `${headerB64}.${payloadB64}.sig`
    const tokens = {
      accessToken: 'a',
      idToken,
      refreshToken: 'r',
      expiresIn: 3600,
      tokenType: 'Bearer',
      scope: 'openid profile email',
    }
    const session = buildSessionPayload({ tokens, nowSec })
    expect(session.user.sub).toBe('auth0|abc')
    expect(session.tokenSet.expiresAt).toBe(nowSec + 3600)

    const cookieValue = await encryptSessionCookie(session, secret, nowSec + 3600)
    expect(typeof cookieValue).toBe('string')

    // Decrypt with the SDK's exact key-derivation. Must match.
    const key = await hkdf(SDK_DIGEST, secret, '', SDK_INFO, 32)
    const { payload: decrypted } = await jose.jwtDecrypt(cookieValue, key)
    expect((decrypted as { user: { sub: string } }).user.sub).toBe('auth0|abc')
  })

  it('encryptSessionCookie throws when AUTH0_SECRET is missing', async () => {
    await expect(encryptSessionCookie({ user: {} }, undefined, 0)).rejects.toThrow(/AUTH0_SECRET/)
  })
})
