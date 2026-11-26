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

// The whole-file counterpart to countRows: every row (open or
// closed) as a contiguous, verbatim text block, for a caller that
// needs to move or diff a row rather than just tally it (spec 53,
// scripts/plan/ledger-archive.mjs). Scans the full text, not just
// pendingSection's slice — a closed row can live under `## Done`
// too (plan/CRITIQUE.md splits Pending/Done; plan/AUDIT.md keeps
// both under one `## Pending`).
//
// A row starts at a `### [...]` heading (plan/CRITIQUE.md) or a
// top-level `- [...]` bullet (plan/AUDIT.md) and runs to, but not
// including, the next row start, the next `##`/`###` heading of
// any kind (even a bracket-less one, e.g. "### Pass 12 summary" —
// it still ends whatever row came before it, same as countRows
// treats it as no finding), or end of file. A row's trailing blank
// line(s) before that boundary are dropped from its `text` (pure
// separator, not content) but still belong to its line range, so a
// caller removing the row by `[startLine, endLine)` never leaves a
// gap behind.
//
// Comment handling deliberately differs from countRows: a line
// that opens a *multi*-line HTML comment (no matching `-->` on the
// same line — the AUDIT.md template block) still suppresses row
// detection until the line that closes it, same as countRows. But
// a line carrying a *self-contained* single-line comment (both
// `<!--` and `-->` on that one line — e.g. a row's own
// `<!-- finale-shift:<show>:<season> -->` idempotency marker,
// which sits inline on the row's own bullet line) is read
// normally instead of being skipped whole: countRows' "opens &&
// closes → skip the line" rule silently drops that row from the
// open count too (confirmed live today — plan/AUDIT.md carries
// open `- [ ]` finale-shift rows countRows never sees), which is
// harmless for a count but would make sliceRows miss the row
// outright, so it is not reused here.
export function sliceRows(text) {
  const lines = text.split(/\r?\n/)
  const rows = []
  let current = null
  let inComment = false

  const close = (endLine) => {
    if (!current) return
    const raw = lines.slice(current.startLine, endLine)
    while (raw.length && raw[raw.length - 1] === '') raw.pop()
    rows.push({
      startLine: current.startLine,
      endLine,
      text: raw.join('\n'),
      closed: current.closed,
    })
    current = null
  }

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i]

    if (inComment) {
      if (l.includes('-->')) inComment = false
      continue
    }
    if (l.includes('<!--') && !l.includes('-->')) {
      inComment = true
      continue
    }

    if (/^#{2,3} /.test(l)) {
      close(i)
      if (/^### \[/.test(l)) current = { startLine: i, closed: /^### \[x\]/i.test(l) }
      continue
    }
    if (/^- \[/.test(l)) {
      close(i)
      current = { startLine: i, closed: /^- \[x\]/i.test(l) }
    }
  }
  close(lines.length)
  return rows
}
