import { existsSync, readFileSync } from 'node:fs'
import matter from 'gray-matter'
import { z, ZodError } from 'zod'
import { ContentValidationError } from './errors'
import { calendarFile } from './paths'

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'must be ISO date YYYY-MM-DD' })

const slug = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, {
    message: 'must be lowercase kebab-case',
  })

export const calendarStatusEnum = z.enum(['scheduled', 'aired'])

// A calendar row references a show by slug + a season number +
// the finale's air date. The schema deliberately does NOT assert
// the show or season *exists* in content/ — content-check owns
// that referential check, because a calendared future finale
// legitimately precedes its seeded season file (surfacing that
// gap is the whole point of the gate). The schema only fails a
// row that is structurally wrong.
export const calendarEntrySchema = z
  .object({
    show: slug,
    season: z.number().int().positive(),
    finale_date: isoDate,
    status: calendarStatusEnum,
  })
  .strict()

export type CalendarEntry = z.infer<typeof calendarEntrySchema>

export const calendarSchema = z
  .object({
    finales: z.array(calendarEntrySchema).default([]),
  })
  .strict()

export type Calendar = z.infer<typeof calendarSchema>

function toIsoDate(d: Date): string {
  const yyyy = d.getUTCFullYear()
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(d.getUTCDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

// js-yaml (gray-matter's engine) parses an unquoted YYYY-MM-DD
// scalar into a JS Date. Normalize every Date back to an ISO
// string before Zod sees it — identical to the content layer's
// existing frontmatter coercion in parse.ts.
function coerceDates(value: unknown): unknown {
  if (value instanceof Date) return toIsoDate(value)
  if (Array.isArray(value)) return value.map(coerceDates)
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = coerceDates(v)
    }
    return out
  }
  return value
}

function flattenZod(err: ZodError): Array<{ path: string; message: string }> {
  return err.issues.map((i) => ({
    path: i.path.join('.') || '(root)',
    message: i.message,
  }))
}

// gray-matter has no standalone YAML parse, so wrap the raw file
// in frontmatter fences and read `.data`. This reuses the exact
// js-yaml engine the rest of the content layer already depends
// on — no new dependency (phase 39 decision 1).
export function parseCalendar(raw: string, file: string): Calendar {
  let data: unknown
  try {
    const parsed = matter(`---\n${raw}\n---\n`)
    data = coerceDates(parsed.data)
  } catch (err) {
    throw new ContentValidationError(
      `calendar parse failed at ${file}: ${
        err instanceof Error ? err.message : String(err)
      }`,
      file,
    )
  }
  const result = calendarSchema.safeParse(data ?? {})
  if (!result.success) {
    const issues = flattenZod(result.error)
    const summary = issues.map((i) => `  ${i.path}: ${i.message}`).join('\n')
    throw new ContentValidationError(
      `calendar validation failed at ${file}:\n${summary}`,
      file,
      issues,
    )
  }
  return result.data
}

// The calendar is optional infrastructure — an absent file is a
// clean empty calendar, the same tolerance a show with no canon
// yet gets.
export function getCalendar(): Calendar {
  const file = calendarFile()
  if (!existsSync(file)) return { finales: [] }
  return parseCalendar(readFileSync(file, 'utf8'), file)
}

export type PartitionedFinales = {
  past: CalendarEntry[]
  future: CalendarEntry[]
}

// A finale whose air date is strictly before `today` is past;
// `finale_date === today` counts as not-yet (the gate should not
// fire on finale day). `today` is an ISO YYYY-MM-DD string so the
// comparison is a pure lexicographic string compare — no
// timezone ambiguity.
export function partitionFinales(
  entries: CalendarEntry[],
  today: string,
): PartitionedFinales {
  const past: CalendarEntry[] = []
  const future: CalendarEntry[] = []
  for (const entry of entries) {
    if (entry.finale_date < today) past.push(entry)
    else future.push(entry)
  }
  return { past, future }
}
