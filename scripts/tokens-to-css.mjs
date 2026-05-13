#!/usr/bin/env node
// scripts/tokens-to-css.mjs
//
// Reads design/tokens.json (canonical) and writes src/styles/tokens.css.
//
// Output structure:
//   1. @theme {} block (Tailwind 4 directive) — DARK mode tokens as
//      defaults. Tailwind generates utilities (bg-paper-0, text-ink-0,
//      font-serif, etc.) from these AND declares them at :root.
//      Result: SSR + first paint = dark, no flash, regardless of JS.
//   2. html[data-theme='light'] {} — LIGHT mode opt-in overrides.
//      Only takes effect when the inline head script sets the
//      data-theme attribute pre-paint.
//
// FOUC discipline: dark is the floor at :root via @theme. Light is
// the explicit opt-in. Do NOT invert this.
//
// Runs on every `pnpm build` (via the "build" script).

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const REPO_ROOT = resolve(__dirname, '..')

const TOKENS_PATH = resolve(REPO_ROOT, 'design/tokens.json')
const OUT_PATH = resolve(REPO_ROOT, 'src/styles/tokens.css')

const tokens = JSON.parse(await readFile(TOKENS_PATH, 'utf8'))

function emitModeBlock(modeTokens) {
  const lines = []
  for (const [group, values] of Object.entries(modeTokens)) {
    for (const [step, hex] of Object.entries(values)) {
      lines.push(`  --color-${group}-${step}: ${hex};`)
    }
  }
  return lines.join('\n')
}

function emitSentiment(sentiment, mode) {
  const lines = []
  for (const [key, entry] of Object.entries(sentiment)) {
    lines.push(`  --color-sentiment-${key}: ${entry[mode]};`)
  }
  return lines.join('\n')
}

function emitType(type) {
  const lines = []
  for (const [key, value] of Object.entries(type.family)) {
    lines.push(`  --font-family-${key}: ${value};`)
  }
  for (const [key, value] of Object.entries(type.weight)) {
    lines.push(`  --font-weight-${key}: ${value};`)
  }
  for (const [key, entry] of Object.entries(type.scale)) {
    lines.push(`  --text-${key}: ${entry.size};`)
    lines.push(`  --text-${key}--line-height: ${entry.lh};`)
  }
  return lines.join('\n')
}

function emitSpace(space) {
  return Object.entries(space)
    .map(([key, value]) => `  --spacing-${key}: ${value};`)
    .join('\n')
}

function emitRadii(radii) {
  return Object.entries(radii)
    .map(([key, value]) => `  --radius-${key}: ${value};`)
    .join('\n')
}

function emitShadow(shadow) {
  return Object.entries(shadow)
    .filter(([key]) => !key.startsWith('_'))
    .map(([key, value]) => `  --shadow-${key}: ${value};`)
    .join('\n')
}

function emitMotion(motion) {
  const lines = []
  for (const [key, value] of Object.entries(motion.duration)) {
    lines.push(`  --duration-${key}: ${value};`)
  }
  for (const [key, value] of Object.entries(motion.ease)) {
    lines.push(`  --ease-${key}: ${value};`)
  }
  return lines.join('\n')
}

const dark = tokens.mode.dark
const light = tokens.mode.light

const css = `/* AUTO-GENERATED — do not hand-edit.
 * Source: design/tokens.json
 * Regenerate: pnpm tokens
 *
 * @theme = Tailwind 4 directive. Declarations land at :root AND
 *          register theme tokens that drive utility classes.
 * Dark-mode tokens are the default at :root. Light-mode overrides
 * apply only when the inline head script sets html[data-theme='light']
 * pre-paint. See plan/phases/phase_1_bootstrap.md Section 5c.
 */

@theme {
  /* === Dark mode (default) === */
${emitModeBlock(dark)}

  /* === Sentiment (dark variants) === */
${emitSentiment(tokens.sentiment, 'dark')}

  /* === Type === */
${emitType(tokens.type)}

  /* === Spacing === */
${emitSpace(tokens.space)}

  /* === Radii === */
${emitRadii(tokens.radii)}

  /* === Shadow (single 1px contract) === */
${emitShadow(tokens.shadow)}

  /* === Motion === */
${emitMotion(tokens.motion)}
}

/* === Light mode opt-in === */
html[data-theme='light'] {
${emitModeBlock(light)}

${emitSentiment(tokens.sentiment, 'light')}
}
`

await mkdir(dirname(OUT_PATH), { recursive: true })
await writeFile(OUT_PATH, css, 'utf8')
console.log(`tokens-to-css: wrote ${OUT_PATH}`)
