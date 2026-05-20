// Pure logic for the phase-18 raw-<img> discipline gate. No
// filesystem, no process — every function here is a deterministic
// transform so scripts/__tests__ can exercise it without temp dirs.
// The thin CLI wrapper that walks src/ and exits is
// scripts/check-no-raw-img.mjs.

// `<img(\s|>|\/)` matches the JSX/HTML opening of an <img> tag in
// any of its three legal-in-React forms — `<img ` (attribute follows),
// `<img>` (no attributes), `<img/>` (self-closing). The lookahead-shaped
// character class is what keeps `<image>` (an SVG element) and
// identifier-prefixed forms (`<imgur>`, `<imageio>`) from matching.
export const IMG_RE = /<img(\s|>|\/)/g

// Per-source scan. Returns one entry per match — line number is the
// 1-indexed line containing the match's start byte; snippet is the
// remainder of that line, trimmed (or the next 80 chars if the match
// is on the file's terminal unterminated line, mirroring the original
// CLI's UX). Pure: same input always yields the same output.
export function findImgTagsInSource(src) {
  const matches = [...src.matchAll(IMG_RE)]
  return matches.map((m) => {
    const idx = m.index ?? 0
    const lineNumber = src.slice(0, idx).split(/\r?\n/).length
    const lineEnd = src.indexOf('\n', idx)
    const snippet = src
      .slice(idx, lineEnd === -1 ? idx + 80 : lineEnd)
      .trim()
    return { index: idx, lineNumber, snippet }
  })
}

// Allowlist membership check. The CLI normalizes paths to POSIX form
// before consulting the ALLOWLIST, so allowlist entries are matched
// verbatim against the relative POSIX path.
export function isAllowed(relPath, allowlist) {
  return allowlist.has(relPath)
}

// Render the same multi-line error output the CLI prints when one or
// more violations are found. Pure stringbuilder — the CLI writes it
// to stderr and exits 1; tests can compare it byte-for-byte.
export function formatViolations(violations) {
  const header = `check-no-raw-img: found ${violations.length} raw <img> usage(s):\n`
  const rows = violations
    .map((v) => `  ${v.file}:${v.line} — ${v.snippet}`)
    .join('\n')
  const footer =
    '\nUse next/image instead. If the case is intentional, add the file to the ALLOWLIST in scripts/check-no-raw-img.mjs.'
  return `${header}\n${rows}${footer}`
}

// Bundle the per-file work the CLI does in its inner loop. Pure: the
// caller injects `readFile(absPath) => contents` so tests can stub
// the filesystem out entirely.
export function collectViolationsForFiles({
  files,
  readFile,
  toRelative,
  allowlist,
}) {
  const out = []
  for (const file of files) {
    const rel = toRelative(file)
    if (isAllowed(rel, allowlist)) continue
    const src = readFile(file)
    const hits = findImgTagsInSource(src)
    for (const hit of hits) {
      out.push({ file: rel, line: hit.lineNumber, snippet: hit.snippet })
    }
  }
  return out
}
