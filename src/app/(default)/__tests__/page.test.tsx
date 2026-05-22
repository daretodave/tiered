import { describe, expect, it } from 'vitest'

describe('/ (home) page module', () => {
  it('exports a default page component', async () => {
    const mod = await import('../page')
    expect(typeof mod.default).toBe('function')
  })

  it('exports generateMetadata', async () => {
    const mod = await import('../page')
    expect(typeof mod.generateMetadata).toBe('function')
  })

  it('emits a self-referential canonical for the home page', async () => {
    const mod = await import('../page')
    const meta = mod.generateMetadata()
    expect(meta.alternates?.canonical).toBe('https://tiered.tv/')
  })

  it('pins the title absolute so the root template does not double-suffix', async () => {
    const mod = await import('../page')
    const meta = mod.generateMetadata()
    expect(meta.title).toEqual({
      absolute: 'tiered.tv — the seasons, ranked. no spoilers.',
    })
  })

  it('keeps the RSS feed discovery link when overriding alternates', async () => {
    const mod = await import('../page')
    const meta = mod.generateMetadata()
    const rss = meta.alternates?.types?.['application/rss+xml']
    expect(Array.isArray(rss)).toBe(true)
    expect(rss).toContainEqual({
      url: '/feed.xml',
      title: 'tiered.tv — all updates',
    })
  })
})
