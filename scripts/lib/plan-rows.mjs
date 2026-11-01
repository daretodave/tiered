// Plan-file row counting for scripts/pulse.mjs (the digest's queue line).

// The `## Pending` section; a file that keeps its open rows under
// another heading is read whole (countRows skips addressed rows).
export function pendingSection(text) {
  const lines = text.split(/\r?\n/)
  const start = lines.findIndex((l) => /^## Pending\s*$/.test(l))
  if (start === -1) return lines
  const rest = lines.slice(start + 1)
  const end = rest.findIndex((l) => /^## /.test(l))
  return end === -1 ? rest : rest.slice(0, end)
}

// A finding row is `### [...]` (plan/CRITIQUE.md) or a top-level
// `- [...]` bullet (plan/AUDIT.md's template): a `[x]` one is
// addressed (some files leave those under Pending), and a heading
// with no bracket (a pass summary) is no finding. Rows inside an
// HTML comment (a format template) don't count. Before the bullet
// shape was read, every digest's AUDIT line said 0 pending.
export function countRows(section) {
  let inComment = false
  let n = 0
  for (const l of section) {
    const opens = l.includes('<!--')
    const closes = l.includes('-->')
    if (inComment || (opens && !closes)) {
      if (closes) inComment = false
      else inComment = true
      continue
    }
    if (opens && closes) continue
    if (/^(?:###|-) \[(?!x\])/i.test(l)) n++
  }
  return n
}
