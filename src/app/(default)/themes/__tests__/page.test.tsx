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

  // Critique pass-27 / loop issue #291: the indexable meta description used
  // to read "Themed lists across every tiered.tv canon — best premieres,
  // best finales, …". Two drifts on the SEO surface: an overclaim ("every
  // canon" against a covered-shows count below the total) and generic SEO
  // labels instead of the real editorial list titles. The pair below is the
  // pin — negative guard catches the drift class, positive guard pins the
  // grounded language so future rewrites stay honest.
  it('meta description avoids overclaim + generic SEO labels (drift guard)', async () => {
    const mod = await import('../page')
    const meta = mod.generateMetadata()
    const description = String(meta.description ?? '')
    expect(description).not.toMatch(/best premieres|best finales|every .{0,12}canon/i)
    expect(description).toMatch(/Premieres that earned it|catalog/)
  })
})
