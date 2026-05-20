import { describe, expect, it } from 'vitest'

describe('/themes page module', () => {
  it('exports a default page component', async () => {
    const mod = await import('../page')
    expect(typeof mod.default).toBe('function')
  })

  it('exports generateMetadata', async () => {
    const mod = await import('../page')
    expect(typeof mod.generateMetadata).toBe('function')
  })

  it('document title is "Lists" — matches the user-facing label, not the route slug', async () => {
    const mod = await import('../page')
    const meta = mod.generateMetadata()
    expect(meta.title).toBe('Lists')
  })
})
