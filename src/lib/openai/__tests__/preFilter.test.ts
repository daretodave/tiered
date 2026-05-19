import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Consolidated from the former sibling `src/lib/openai/preFilter.test.ts`
// (§5a — the rest of `src/lib` colocates tests under `__tests__/`; this
// module read as "untested" to the next tick's §5a discovery even though
// fake-stub + missing-key + schema coverage existed). preFilter.ts is the
// OpenAI moderation pre-filter — the P0 first-line spoiler gate behind
// `POST /api/comment`, so every comment submitted on every season page
// across the product flows through it (standing rule §7: spoilers are
// P0). Its tests must sit where the loop looks.
//
// Every prior case is retained verbatim in the first three describe
// blocks (fake stub ×4, fallback-missing-key ×1, verdictSchema ×3)
// against the exact prior assertions. New edge coverage is appended:
// the pinned VERDICTS/CATEGORIES export contract, exact full-shape
// fakeVerdict locks + WINNER-over-SPOILER precedence + substring (not
// word-boundary) matching + empty input, the previously-untested live
// network path (valid verdict round-trip, every fallback branch —
// empty/no-choices/throw-Error/throw-non-Error/non-JSON/schema-invalid,
// the lazy-singleton client cache, constructor args, and the
// request-shape contract), and the verdictSchema numeric/length/null
// bounds. The network path uses a hoisted `vi.mock('openai')` — the
// correct and only strategy for a module that lazily constructs the
// SDK client (no purer prior strategy this replaces; the prior sibling
// could not exercise the network path at all). No source change.

const H = vi.hoisted(() => {
  const createMock = vi.fn()
  const ctorArgs: unknown[] = []
  let ctorCalls = 0
  return {
    createMock,
    ctorArgs,
    get ctorCalls() {
      return ctorCalls
    },
    bumpCtor(arg: unknown) {
      ctorCalls += 1
      ctorArgs.push(arg)
    },
    resetCtor() {
      ctorCalls = 0
      ctorArgs.length = 0
    },
  }
})

vi.mock('openai', () => {
  class FakeOpenAI {
    chat = { completions: { create: H.createMock } }
    constructor(arg: unknown) {
      H.bumpCtor(arg)
    }
  }
  return { default: FakeOpenAI }
})

const savedFake = process.env['OPENAI_FAKE']
const savedKey = process.env['OPENAI_API_KEY']

function restore() {
  if (savedFake !== undefined) process.env['OPENAI_FAKE'] = savedFake
  else delete process.env['OPENAI_FAKE']
  if (savedKey !== undefined) process.env['OPENAI_API_KEY'] = savedKey
  else delete process.env['OPENAI_API_KEY']
  vi.resetModules()
}

// ---------------------------------------------------------------------------
// Retained verbatim — fake stub (OPENAI_FAKE=1)
// ---------------------------------------------------------------------------

describe('moderateComment — fake stub (OPENAI_FAKE=1)', () => {
  beforeEach(() => {
    process.env['OPENAI_FAKE'] = '1'
    vi.resetModules()
  })
  afterEach(restore)

  it('blocks anything containing WINNER', async () => {
    const { moderateComment } = await import('../preFilter')
    const v = await moderateComment('the WINNER was obvious')
    expect(v.verdict).toBe('block')
    expect(v.categories).toEqual(['spoiler_winner'])
    expect(v.confidence).toBe(1)
  })

  it('blocks lowercase winner too (case-insensitive)', async () => {
    const { moderateComment } = await import('../preFilter')
    const v = await moderateComment('this season had a clear winner')
    expect(v.verdict).toBe('block')
  })

  it('flags anything containing SPOILER', async () => {
    const { moderateComment } = await import('../preFilter')
    const v = await moderateComment('SPOILER alert: it was a great season')
    expect(v.verdict).toBe('flag')
    expect(v.categories).toEqual(['spoiler_plot'])
  })

  it('allows anything else', async () => {
    const { moderateComment } = await import('../preFilter')
    const v = await moderateComment('this season was filmed in Fiji and the cast was great')
    expect(v.verdict).toBe('allow')
    expect(v.categories).toEqual([])
    expect(v.redacted_phrase).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// Retained verbatim — fallback path when API key missing
// ---------------------------------------------------------------------------

describe('moderateComment — fallback path when API key missing', () => {
  beforeEach(() => {
    delete process.env['OPENAI_FAKE']
    delete process.env['OPENAI_API_KEY']
    vi.resetModules()
  })
  afterEach(restore)

  it('returns verdict=flag with reason starting "fallback:" on missing key', async () => {
    const { moderateComment } = await import('../preFilter')
    const v = await moderateComment('any body')
    expect(v.verdict).toBe('flag')
    expect(v.reason).toMatch(/^fallback:/)
    expect(v.confidence).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// Retained verbatim — verdictSchema zod shape
// ---------------------------------------------------------------------------

describe('verdictSchema — zod shape', () => {
  it('rejects extra fields', async () => {
    const { verdictSchema } = await import('../preFilter')
    const ok = verdictSchema.safeParse({
      verdict: 'allow',
      categories: [],
      confidence: 0.8,
      reason: 'looks fine',
      redacted_phrase: null,
    })
    expect(ok.success).toBe(true)
  })

  it('rejects bad verdict', async () => {
    const { verdictSchema } = await import('../preFilter')
    const bad = verdictSchema.safeParse({
      verdict: 'maybe',
      categories: [],
      confidence: 0.8,
      reason: 'x',
      redacted_phrase: null,
    })
    expect(bad.success).toBe(false)
  })

  it('rejects bad category enum', async () => {
    const { verdictSchema } = await import('../preFilter')
    const bad = verdictSchema.safeParse({
      verdict: 'flag',
      categories: ['something_random'],
      confidence: 0.8,
      reason: 'x',
      redacted_phrase: null,
    })
    expect(bad.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// New edge coverage
// ---------------------------------------------------------------------------

describe('exported moderation contract (setup/06_openai.md §E pin)', () => {
  afterEach(restore)

  it('VERDICTS is exactly the three-verdict ladder, in order', async () => {
    const { VERDICTS } = await import('../preFilter')
    expect(VERDICTS).toEqual(['allow', 'flag', 'block'])
  })

  it('CATEGORIES is the exact pinned enum the mod page groups by', async () => {
    const { CATEGORIES } = await import('../preFilter')
    expect(CATEGORIES).toEqual([
      'spoiler_winner',
      'spoiler_elimination',
      'spoiler_plot',
      'spoiler_death',
      'spoiler_twist',
      'spoiler_finale',
      'abuse_slur',
      'abuse_harassment',
      'abuse_threat',
      'spam',
      'off_topic',
    ])
  })

  it('moderateComment is a function', async () => {
    const mod = await import('../preFilter')
    expect(typeof mod.moderateComment).toBe('function')
  })
})

describe('fakeVerdict — exact shapes, precedence, matching rules', () => {
  beforeEach(() => {
    process.env['OPENAI_FAKE'] = '1'
    vi.resetModules()
  })
  afterEach(restore)

  it('block branch is the exact pinned object', async () => {
    const { moderateComment } = await import('../preFilter')
    expect(await moderateComment('the WINNER')).toEqual({
      verdict: 'block',
      categories: ['spoiler_winner'],
      confidence: 1,
      reason: 'fake stub',
      redacted_phrase: null,
    })
  })

  it('flag branch is the exact pinned object', async () => {
    const { moderateComment } = await import('../preFilter')
    expect(await moderateComment('SPOILER')).toEqual({
      verdict: 'flag',
      categories: ['spoiler_plot'],
      confidence: 1,
      reason: 'fake stub',
      redacted_phrase: null,
    })
  })

  it('allow branch is the exact pinned object', async () => {
    const { moderateComment } = await import('../preFilter')
    expect(await moderateComment('great cast, filmed in Fiji')).toEqual({
      verdict: 'allow',
      categories: [],
      confidence: 1,
      reason: 'fake stub',
      redacted_phrase: null,
    })
  })

  it('WINNER takes precedence over SPOILER when both are present', async () => {
    const { moderateComment } = await import('../preFilter')
    const v = await moderateComment('SPOILER: the WINNER is revealed')
    expect(v.verdict).toBe('block')
    expect(v.categories).toEqual(['spoiler_winner'])
  })

  it('matches as a substring, not a word boundary (winners → block)', async () => {
    const { moderateComment } = await import('../preFilter')
    expect((await moderateComment('the winners circle')).verdict).toBe('block')
    expect((await moderateComment('prewinner talk')).verdict).toBe('block')
  })

  it('substring match also flags "spoilers" (plural)', async () => {
    const { moderateComment } = await import('../preFilter')
    expect((await moderateComment('no spoilers please')).verdict).toBe('flag')
  })

  it('empty body → allow', async () => {
    const { moderateComment } = await import('../preFilter')
    expect((await moderateComment('')).verdict).toBe('allow')
  })

  it('mixed-case SPoIlEr still flags (full case-insensitive)', async () => {
    const { moderateComment } = await import('../preFilter')
    expect((await moderateComment('SPoIlEr ahead')).verdict).toBe('flag')
  })
})

describe('moderateComment — live network path (openai mocked)', () => {
  beforeEach(() => {
    delete process.env['OPENAI_FAKE']
    process.env['OPENAI_API_KEY'] = 'sk-test-key'
    H.createMock.mockReset()
    H.resetCtor()
    vi.resetModules()
  })
  afterEach(restore)

  function completion(content: string | null, opts?: { noChoices?: boolean }) {
    if (opts?.noChoices) return { choices: [] }
    return { choices: [{ message: { content } }] }
  }

  const validVerdict = {
    verdict: 'flag',
    categories: ['spoiler_plot'],
    confidence: 0.7,
    reason: 'possible plot beat',
    redacted_phrase: null,
  }

  it('returns the parsed verdict on a schema-valid JSON response', async () => {
    H.createMock.mockResolvedValue(completion(JSON.stringify(validVerdict)))
    const { moderateComment } = await import('../preFilter')
    const v = await moderateComment('was it the one who left early?')
    expect(v).toEqual(validVerdict)
  })

  it('sends the pinned model + system/user messages + json_schema format', async () => {
    H.createMock.mockResolvedValue(completion(JSON.stringify(validVerdict)))
    const { moderateComment } = await import('../preFilter')
    await moderateComment('a user comment body')
    const arg = H.createMock.mock.calls[0]?.[0] as {
      model: string
      messages: { role: string; content: string }[]
      response_format: {
        type: string
        json_schema: { name: string; strict: boolean }
      }
    }
    expect(arg.model).toBe('gpt-5-mini-2025-08-07')
    expect(arg.messages).toHaveLength(2)
    expect(arg.messages[0]?.role).toBe('system')
    expect(arg.messages[1]).toEqual({ role: 'user', content: 'a user comment body' })
    expect(arg.response_format.type).toBe('json_schema')
    expect(arg.response_format.json_schema.name).toBe('moderation_verdict')
    expect(arg.response_format.json_schema.strict).toBe(true)
  })

  it('constructs the SDK client once (lazy singleton) with timeout + maxRetries', async () => {
    H.createMock.mockResolvedValue(completion(JSON.stringify(validVerdict)))
    const { moderateComment } = await import('../preFilter')
    await moderateComment('first')
    await moderateComment('second')
    expect(H.ctorCalls).toBe(1)
    expect(H.ctorArgs[0]).toEqual({
      apiKey: 'sk-test-key',
      timeout: 5_000,
      maxRetries: 1,
    })
  })

  it('null content → fallback("empty response")', async () => {
    H.createMock.mockResolvedValue(completion(null))
    const { moderateComment } = await import('../preFilter')
    const v = await moderateComment('x')
    expect(v.verdict).toBe('flag')
    expect(v.reason).toBe('fallback: empty response')
    expect(v.confidence).toBe(0)
    expect(v.categories).toEqual([])
    expect(v.redacted_phrase).toBeNull()
  })

  it('no choices → fallback("empty response")', async () => {
    H.createMock.mockResolvedValue(completion(null, { noChoices: true }))
    const { moderateComment } = await import('../preFilter')
    expect((await moderateComment('x')).reason).toBe('fallback: empty response')
  })

  it('create throws an Error → fallback carries err.message', async () => {
    H.createMock.mockRejectedValue(new Error('rate limited'))
    const { moderateComment } = await import('../preFilter')
    const v = await moderateComment('x')
    expect(v.verdict).toBe('flag')
    expect(v.reason).toBe('fallback: rate limited')
  })

  it('create throws a non-Error → fallback("api error")', async () => {
    H.createMock.mockRejectedValue('boom')
    const { moderateComment } = await import('../preFilter')
    expect((await moderateComment('x')).reason).toBe('fallback: api error')
  })

  it('non-JSON raw content → fallback (JSON.parse throws)', async () => {
    H.createMock.mockResolvedValue(completion('not json at all'))
    const { moderateComment } = await import('../preFilter')
    const v = await moderateComment('x')
    expect(v.verdict).toBe('flag')
    expect(v.reason).toMatch(/^fallback:/)
    expect(v.confidence).toBe(0)
  })

  it('schema-invalid JSON → fallback (zod parse rejects bad verdict)', async () => {
    H.createMock.mockResolvedValue(
      completion(JSON.stringify({ ...validVerdict, verdict: 'nope' })),
    )
    const { moderateComment } = await import('../preFilter')
    const v = await moderateComment('x')
    expect(v.verdict).toBe('flag')
    expect(v.reason).toMatch(/^fallback:/)
    expect(v.categories).toEqual([])
  })

  it('missing-key fallback reason is the exact "OPENAI_API_KEY missing" string', async () => {
    delete process.env['OPENAI_API_KEY']
    const { moderateComment } = await import('../preFilter')
    const v = await moderateComment('x')
    expect(v.reason).toBe('fallback: OPENAI_API_KEY missing')
    expect(v.categories).toEqual([])
    expect(v.redacted_phrase).toBeNull()
  })
})

describe('verdictSchema — numeric / length / null bounds', () => {
  it('accepts confidence at the 0 and 1 boundaries', async () => {
    const { verdictSchema } = await import('../preFilter')
    for (const confidence of [0, 1]) {
      expect(
        verdictSchema.safeParse({
          verdict: 'allow',
          categories: [],
          confidence,
          reason: 'ok',
          redacted_phrase: null,
        }).success,
      ).toBe(true)
    }
  })

  it('rejects confidence outside [0, 1]', async () => {
    const { verdictSchema } = await import('../preFilter')
    for (const confidence of [-0.01, 1.01]) {
      expect(
        verdictSchema.safeParse({
          verdict: 'allow',
          categories: [],
          confidence,
          reason: 'ok',
          redacted_phrase: null,
        }).success,
      ).toBe(false)
    }
  })

  it('rejects an empty reason (min 1) and a 501-char reason (max 500)', async () => {
    const { verdictSchema } = await import('../preFilter')
    const base = { verdict: 'allow' as const, categories: [], confidence: 0.5, redacted_phrase: null }
    expect(verdictSchema.safeParse({ ...base, reason: '' }).success).toBe(false)
    expect(verdictSchema.safeParse({ ...base, reason: 'a'.repeat(501) }).success).toBe(false)
    expect(verdictSchema.safeParse({ ...base, reason: 'a'.repeat(500) }).success).toBe(true)
  })

  it('redacted_phrase accepts a string or null but rejects a number', async () => {
    const { verdictSchema } = await import('../preFilter')
    const base = { verdict: 'block' as const, categories: ['spoiler_winner'], confidence: 1, reason: 'r' }
    expect(verdictSchema.safeParse({ ...base, redacted_phrase: 'X won' }).success).toBe(true)
    expect(verdictSchema.safeParse({ ...base, redacted_phrase: null }).success).toBe(true)
    expect(verdictSchema.safeParse({ ...base, redacted_phrase: 42 }).success).toBe(false)
  })

  it('accepts multiple valid categories but rejects a mixed valid+invalid array', async () => {
    const { verdictSchema } = await import('../preFilter')
    const base = { verdict: 'block' as const, confidence: 1, reason: 'r', redacted_phrase: null }
    expect(
      verdictSchema.safeParse({ ...base, categories: ['spoiler_winner', 'spoiler_finale'] }).success,
    ).toBe(true)
    expect(
      verdictSchema.safeParse({ ...base, categories: ['spoiler_winner', 'bogus'] }).success,
    ).toBe(false)
  })

  it('rejects a missing required field (no verdict)', async () => {
    const { verdictSchema } = await import('../preFilter')
    expect(
      verdictSchema.safeParse({
        categories: [],
        confidence: 0.5,
        reason: 'r',
        redacted_phrase: null,
      }).success,
    ).toBe(false)
  })

  it('strips (does not reject) an unknown key — the schema is not .strict()', async () => {
    const { verdictSchema } = await import('../preFilter')
    const parsed = verdictSchema.parse({
      verdict: 'allow',
      categories: [],
      confidence: 0.5,
      reason: 'r',
      redacted_phrase: null,
      extra_unknown_key: 'dropped',
    })
    expect(parsed).not.toHaveProperty('extra_unknown_key')
  })
})
