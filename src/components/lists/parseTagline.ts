// Tagline emphasis parser — taglines may contain at most one well-formed
// `<b>…</b>` span (per the schema regex in src/content/schemas.ts). The
// parser returns either a plain-text segment list or three segments
// surrounding the emphasis span. Anything richer than that is rejected
// at validation time; this helper is for the render path.

export type TaglineSegment =
  | { kind: 'text'; text: string }
  | { kind: 'emph'; text: string }

const EMPH_RE = /^([^<]*)<b>([^<]*)<\/b>([^<]*)$/

export function parseTagline(tagline: string): TaglineSegment[] {
  const m = tagline.match(EMPH_RE)
  if (!m) return [{ kind: 'text', text: tagline }]
  const [, before, emph, after] = m
  const out: TaglineSegment[] = []
  if (before) out.push({ kind: 'text', text: before })
  if (emph) out.push({ kind: 'emph', text: emph })
  if (after) out.push({ kind: 'text', text: after })
  return out
}
