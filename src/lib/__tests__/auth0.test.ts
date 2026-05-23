import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// auth0.ts is the singleton `Auth0Client` constructed once at module
// load time — every server component and route handler that reaches
// for `auth0.getSession()` resolves to *this* instance. The contract
// the rest of the product depends on:
//
//   1. It is a singleton — repeated imports return the same object.
//   2. The constructor is called exactly once per module load.
//   3. `scope: 'openid profile email'` is locked.
//   4. `audience` is added only when `process.env.AUTH0_AUDIENCE` is
//      a non-empty string (the magic-link / refresh flows depend on
//      audience being absent unless explicitly configured per the
//      setup/04_auth0.md Section K env contract).
//
// We mock `@auth0/nextjs-auth0/server`'s `Auth0Client` to capture
// constructor arguments without standing up the real SDK (which
// otherwise reads AUTH0_DOMAIN / AUTH0_SECRET / AUTH0_BASE_URL from
// process.env on construction).

const H = vi.hoisted(() => {
  const ctorArgs: unknown[] = []
  class FakeAuth0Client {
    constructor(opts: unknown) {
      ctorArgs.push(opts)
    }
  }
  return { ctorArgs, FakeAuth0Client }
})

vi.mock('@auth0/nextjs-auth0/server', () => ({
  Auth0Client: H.FakeAuth0Client,
}))

const ORIGINAL_AUDIENCE = process.env['AUTH0_AUDIENCE']

beforeEach(() => {
  vi.resetModules()
  H.ctorArgs.length = 0
})

afterEach(() => {
  if (ORIGINAL_AUDIENCE === undefined) delete process.env['AUTH0_AUDIENCE']
  else process.env['AUTH0_AUDIENCE'] = ORIGINAL_AUDIENCE
})

describe('auth0 singleton client', () => {
  it('exports a non-null `auth0` constructed from Auth0Client exactly once', async () => {
    delete process.env['AUTH0_AUDIENCE']
    const mod = await import('../auth0')
    expect(mod.auth0).toBeInstanceOf(H.FakeAuth0Client)
    expect(H.ctorArgs).toHaveLength(1)
  })

  it('returns the same instance on repeat imports (true singleton, not a factory)', async () => {
    delete process.env['AUTH0_AUDIENCE']
    const a = await import('../auth0')
    const b = await import('../auth0')
    expect(a.auth0).toBe(b.auth0)
    // The constructor still fires only once across both imports —
    // a regression to `export function auth0() { return new ... }`
    // would slip past `.toBe` if both calls hit a memoised getter,
    // but never past this count.
    expect(H.ctorArgs).toHaveLength(1)
  })
})

describe('Auth0Client constructor options', () => {
  it('always passes scope: "openid profile email"', async () => {
    delete process.env['AUTH0_AUDIENCE']
    await import('../auth0')
    const opts = H.ctorArgs[0] as {
      authorizationParameters: { scope: string }
    }
    expect(opts.authorizationParameters.scope).toBe('openid profile email')
  })

  it('omits `audience` when AUTH0_AUDIENCE is unset (the default magic-link path)', async () => {
    delete process.env['AUTH0_AUDIENCE']
    await import('../auth0')
    const opts = H.ctorArgs[0] as {
      authorizationParameters: Record<string, unknown>
    }
    expect('audience' in opts.authorizationParameters).toBe(false)
  })

  it('omits `audience` when AUTH0_AUDIENCE is the empty string (the falsy guard)', async () => {
    process.env['AUTH0_AUDIENCE'] = ''
    await import('../auth0')
    const opts = H.ctorArgs[0] as {
      authorizationParameters: Record<string, unknown>
    }
    expect('audience' in opts.authorizationParameters).toBe(false)
  })

  it('forwards `audience` verbatim when AUTH0_AUDIENCE is a non-empty string', async () => {
    process.env['AUTH0_AUDIENCE'] = 'https://api.tiered.tv'
    await import('../auth0')
    const opts = H.ctorArgs[0] as {
      authorizationParameters: { audience?: string }
    }
    expect(opts.authorizationParameters.audience).toBe('https://api.tiered.tv')
  })
})
