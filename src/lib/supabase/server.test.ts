import { afterEach, describe, expect, it, vi } from 'vitest'

const savedUrl = process.env['NEXT_PUBLIC_SUPABASE_URL']
const savedKey = process.env['SUPABASE_SERVICE_ROLE_KEY']

describe('serviceRoleClient', () => {
  afterEach(() => {
    if (savedUrl !== undefined) process.env['NEXT_PUBLIC_SUPABASE_URL'] = savedUrl
    else delete process.env['NEXT_PUBLIC_SUPABASE_URL']
    if (savedKey !== undefined) process.env['SUPABASE_SERVICE_ROLE_KEY'] = savedKey
    else delete process.env['SUPABASE_SERVICE_ROLE_KEY']
    vi.resetModules()
  })

  it('returns a client when env is populated', async () => {
    if (!savedUrl || !savedKey) return
    vi.resetModules()
    const mod = await import('./server')
    const c = mod.serviceRoleClient()
    expect(c).toBeDefined()
    expect(mod.serviceRoleClient()).toBe(c)
  })

  it('throws on missing URL', async () => {
    delete process.env['NEXT_PUBLIC_SUPABASE_URL']
    vi.resetModules()
    const mod = await import('./server')
    expect(() => mod.serviceRoleClient()).toThrow(/NEXT_PUBLIC_SUPABASE_URL/i)
  })

  it('throws on missing service role key', async () => {
    process.env['NEXT_PUBLIC_SUPABASE_URL'] = 'https://example.supabase.co'
    delete process.env['SUPABASE_SERVICE_ROLE_KEY']
    vi.resetModules()
    const mod = await import('./server')
    expect(() => mod.serviceRoleClient()).toThrow(/SUPABASE_SERVICE_ROLE_KEY/i)
  })
})
