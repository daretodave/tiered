import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { VercelSpeedInsights } from '../VercelSpeedInsights'

describe('VercelSpeedInsights gate', () => {
  let originalDisable: string | undefined
  let originalVercel: string | undefined

  beforeEach(() => {
    originalDisable = process.env['DISABLE_ANALYTICS']
    originalVercel = process.env['VERCEL']
  })

  afterEach(() => {
    if (originalDisable === undefined) delete process.env['DISABLE_ANALYTICS']
    else process.env['DISABLE_ANALYTICS'] = originalDisable
    if (originalVercel === undefined) delete process.env['VERCEL']
    else process.env['VERCEL'] = originalVercel
  })

  it('returns null when DISABLE_ANALYTICS=1', () => {
    process.env['DISABLE_ANALYTICS'] = '1'
    process.env['VERCEL'] = '1'
    expect(VercelSpeedInsights()).toBeNull()
  })

  it('returns null when VERCEL unset', () => {
    delete process.env['DISABLE_ANALYTICS']
    delete process.env['VERCEL']
    expect(VercelSpeedInsights()).toBeNull()
  })

  it('renders when VERCEL=1 and DISABLE_ANALYTICS unset', () => {
    delete process.env['DISABLE_ANALYTICS']
    process.env['VERCEL'] = '1'
    expect(VercelSpeedInsights()).not.toBeNull()
  })
})
