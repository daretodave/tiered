# Phase 41 — Cross-canon themed-list drain (deliver the "cross-canon" promise)

> A multi-tick **auto-draining** content phase, same mechanic
> as phase 26 / 31b / 34: each tick picks one themed list and
> authors genuine cross-show entries into it. The consuming UI
> already exists — `/themes` and `/themes/[theme]` render
> entries generically. The only page work is wiring two display
> surfaces (the "N SHOWS COVERED" stat + the `CROSS-CANON LIST`
> tag) to derive honestly from the data.
>
> Promoted from `PHASE_CANDIDATES.md` #08 (score 5.4) via
> `/oversight` 2026-05-21, after the build plan re-exhausted
> and the loop spent ~24h on §5a test-colocation polish.

## Why this is its own phase

The `/themes` hero copy reads "Cross-canon. Some span every
show." Every `/themes/[theme]` page is tagged `CROSS-CANON
LIST`. The lists stat strip claims a show count. **The data
contradicts all three:** all 12 themed lists carry entries from
exactly one show — Survivor. `CRITIQUE` pass 1 (2026-05-19)
flagged this MED, not LOW: the contradiction is immediate and
brand-level — a first-time reader sees "1 SHOWS COVERED" beside
"spans every show."

The catalog became mono-show honestly: phases 23+24 drained the
themed-list quota (bearings Rule 3, `count >= 10`) most-canon'd
show first, and Survivor was the only deeply-canon'd show at
the time. Rule 3 never required cross-show coverage, so nothing
noticed. No `/ship-content` quota row demands cross-show
entries — so the loop will **never** pick this up on its own.
This is the same structural-gap argument that promoted #04→38,
#06→39, #07→40: a contracted/branded promise that needs a
phase to own it.

The minimal fix — soften the copy to "single-show lists" — is
a retreat from the spec. The honest fix is to **make the
promise true**.

## What ships

### 1. The invariant (bearings + content-check)

New `plan/bearings.md` Rule 3 sub-rule: every themed list with
`category in {tone, craft, era}` must carry entries from **≥3
distinct shows**. `category: single` is the legal carve-out for
deliberately mono-show lists — `survivor-pillars` re-tags to
`single` (it is genuinely a one-show list and should stay one).

`scripts/content-check.ts` learns the invariant in **lax mode**
(warns, does not fail, tolerant of absence) for the duration of
the drain. The **final tick flips it strict** — fails on any
`{tone,craft,era}` list with `<3` distinct shows. This matches
the 31b / 34 lax→strict pattern exactly.

### 2. The agent guidance

- `.claude/agents/content-curator.md` — new lists in
  `{tone,craft,era}` are **born cross-show** (≥3 shows from the
  first authoring pass).
- `skills/ship-content.md` Rule 3 — same, plus: existing
  `{tone,craft,era}` lists are eligible for a content-tick that
  authors 3–5 cross-show entries.
- Both briefs gain the **entry-title discipline** rule: a
  themed-list entry's `title` / `season_label` must match the
  season's canonical frontmatter, not be authored free-hand.
  This closes the sibling CRITIQUE finding "Survivor 41 named
  'New Era I' in canon, 'S41 · REBOOT' on the list" — the same
  free-hand-title-drift class. Extend the canon-heading
  invariant to themed-list entry titles.

### 3. The content drain (multi-tick, the bulk of the work)

Each tick picks **one** themed list and authors 3–5 cross-show
entries into it — full editorial blurbs in the `content-curator`
voice, canonical `title` + `season_label` sourced from the
season's own frontmatter. Entry cap is already 30 (phase 19f),
so headroom is not a concern.

**Spoiler discipline is P0** (agents.md §7) — cross-show entry
blurbs frame the *editorial argument*, never the
winner/elimination/outcome of any season.

Priority order:

1. `best-premieres` — already MED-flagged by CRITIQUE; do first.
2. `best-finales`.
3. The rest of the `craft` / `tone` / `era` lists.
4. Re-tag `survivor-pillars` → `category: single` (if a
   genuinely one-show list exists; otherwise skip).

Each tick: author the entries → run `content-check` (lax) →
verify gate → commit + push. The drain is complete when every
`{tone,craft,era}` list clears ≥3 shows.

### 4. The honest display wiring (one tick, page-side)

- `/themes` + `/themes/[theme]` stat strip "N SHOWS COVERED"
  derives from `getShowsForTheme()` distinct-show count — no
  hardcoded "1".
- The `CROSS-CANON LIST` tag renders only when the list's
  distinct-show count is ≥3; it **drops** on `category: single`
  lists.
- **No `/themes` hero copy change** — once the data is
  cross-show, the existing "Cross-canon" copy is simply true.

This wiring can ship in the first tick (so the stat is honest
as soon as the first list goes cross-show) or the last — the
loop's call. It is bounded UI work; no URL change, no rebuild.

## Per-tick mechanic (mirrors phase 26 / 31b / 34)

- One list per tick (or `/ship-content`'s natural batch size).
- Lax `content-check` for the drain; **final tick flips
  strict** + ships the `survivor-pillars` re-tag if applicable.
- Every tick contributes unit tests for any helper touched and
  keeps the e2e themed-list specs green (the URL set does not
  change, so no new `canonical-urls.ts` / `page-reads.ts` rows
  — but assert the cross-show stat where a spec already visits
  `/themes/[theme]`).

## Exit criteria

- Every themed list with `category in {tone,craft,era}` carries
  entries from ≥3 distinct shows.
- `scripts/content-check.ts` enforces the invariant **strict**.
- `bearings.md` Rule 3, `content-curator.md`, and
  `ship-content.md` Rule 3 all document the cross-show
  requirement + entry-title discipline.
- `/themes` + `/themes/[theme]` show counts and the
  `CROSS-CANON LIST` tag are data-derived, not hardcoded.
- The `/themes` hero's "Cross-canon" promise is true.
- `pnpm verify` green; deploy green.

## Out of scope

- No new URL, no page rebuild beyond the stat-strip + tag
  wiring.
- No hero copy change — the data is brought up to the copy, not
  the reverse.
- New lists beyond the existing 12: not required; a future
  `/ship-content` quota tick may add more, born cross-show per
  the updated Rule 3.
