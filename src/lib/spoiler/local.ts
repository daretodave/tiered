// Local spoiler pre-filter — runs in the browser as a UX hint.
//
// This is **not** a moderation gate. The server's OpenAI pre-filter
// (src/lib/openai/preFilter.ts) is the truth gate; this helper just
// nudges the author before they hit Post so they have a chance to
// reword. The detection is intentionally cheap and conservative:
// substring match against a small phrase list, case-insensitive,
// and returns the original-cased substring at the match position so
// the warning banner can quote what the reader actually typed.

const SPOILER_PHRASES = [
  'wins',
  'winner',
  'wins it',
  'gets eliminated',
  'votes out',
  'final tribal',
  'season finale',
  'eliminated in the final',
]

export type SpoilerMatch = {
  phrase: string
  at: number
}

export function detectSpoiler(text: string): SpoilerMatch | null {
  if (!text) return null
  const lower = text.toLowerCase()
  for (const phrase of SPOILER_PHRASES) {
    const at = lower.indexOf(phrase)
    if (at !== -1) {
      return { phrase: text.substring(at, at + phrase.length), at }
    }
  }
  return null
}
