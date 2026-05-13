import { describe, expect, it } from 'vitest'

// next/og's ImageResponse is a Response subclass; the runtime
// for satori isn't available under vitest's jsdom env, so we
// just smoke-test the route-export shape + assert the factory
// is importable without crash.

describe('og template module', () => {
  it('exports the route-shape constants', async () => {
    const mod = await import('./template')
    expect(mod.OG_SIZE.width).toBe(1200)
    expect(mod.OG_SIZE.height).toBe(630)
    expect(mod.OG_CONTENT_TYPE).toBe('image/png')
  })

  it('buildOgImage is a function', async () => {
    const mod = await import('./template')
    expect(typeof mod.buildOgImage).toBe('function')
  })
})
