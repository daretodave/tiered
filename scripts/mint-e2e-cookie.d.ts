// Type declarations for scripts/mint-e2e-cookie.mjs. Only the exports
// the vitest harness imports are declared; the module itself is
// authoritative — these types just keep tsc --noEmit clean.

declare module '*/mint-e2e-cookie.mjs' {
  export function readCache(path?: string): unknown
  export function writeCache(payload: unknown, path?: string): void
  export function upsertEnvLine(envPath: string, name: string, value: string): void
  export function isFresh(cached: unknown, now?: number): boolean
  export function passwordGrant(args: {
    domain?: string
    clientId?: string
    clientSecret?: string
    audience?: string
    username?: string
    password?: string
    fetchFn?: typeof fetch
  }): Promise<{
    accessToken: string
    idToken: string
    refreshToken?: string
    expiresIn: number
    tokenType?: string
    scope?: string
  }>
  export function encryptSessionCookie(
    session: unknown,
    secret: string | undefined,
    expiresAtSec: number,
  ): Promise<string>
  export function buildSessionPayload(args: {
    tokens: {
      accessToken: string
      idToken: string
      refreshToken?: string
      expiresIn: number
      tokenType?: string
      scope?: string
    }
    nowSec: number
  }): {
    user: { sub: string; [k: string]: unknown }
    tokenSet: {
      accessToken: string
      idToken?: string
      refreshToken?: string
      scope?: string
      expiresAt: number
      token_type?: string
    }
    internal: { sid: string; createdAt: number }
  }
  export function mint(args?: {
    envOverride?: Record<string, string | undefined>
    fetchFn?: typeof fetch
    cachePath?: string
    now?: number
  }): Promise<{ status: 'cache-hit' | 'minted'; payload: unknown }>
}
