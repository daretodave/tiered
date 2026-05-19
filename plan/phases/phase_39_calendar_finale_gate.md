# Phase 39 — `content/calendar.yml` + finale-event detection hook

> The mechanical + autonomous-editorial half of `spec.md:294`,
> the only spec-promised self-sustaining mechanism never built.
> Promoted from `PHASE_CANDIDATES.md` #06 (score 5.5) via
> `/oversight` 2026-05-19. Editorial boundary resolved at
> promotion: **full autonomy** — the content drain that picks
> up a gate-filed AUDIT row may autonomously write the
> spoiler-safe post-finale ranking-shift note AND adjust that
> season's `canonical_position` when the editorial rationale
> warrants it.

## Outcome

A finale air date in `content/calendar.yml` now mechanically
prompts the loop. On every `/march` (and `/iterate`) tick, an
idempotent Step 0 gate reads the calendar, finds finales whose
`finale_date` is in the past and that have **no corresponding
shift note yet**, and files a single `category: content-gaps,
source: self` row into `plan/AUDIT.md`. The next content drain
picks that row up and — with full autonomy, spoiler discipline
P0 — writes the post-finale ranking-shift note and adjusts
`canonical_position` if warranted. No new URL, no UI, no e2e
route. Data + script + unit tests only. One cloud tick.

## Routes / API endpoints / CLI surface

- **No new URL, no new route.** This phase is data + a loop
  Step 0 hook.
- **New CLI/script surface:** `node scripts/finale-gate.mjs`
  (idempotent; no-op when nothing is due). Invoked by the loop
  in `/march` and `/iterate` Step 0.

## Content / data reads

| Helper | Call | Use |
|---|---|---|
| `getCalendar()` | `src/content/calendar.ts` | parsed + validated calendar entries |
| `partitionFinales(entries, today)` | `src/content/calendar.ts` | split past (`finale_date < today`) vs future |
| `getAllShows()` | `src/content/loaders.ts` | content-check referential integrity (show slug must exist) |
| `auditMarker(show, season)` | `scripts/lib/finale-gate.mjs` | stable idempotency token grepped in AUDIT.md |

## Components / handlers

New:
- `src/content/calendar.ts` — Zod `calendarEntrySchema` +
  `calendarSchema` + `getCalendar()` + `partitionFinales()`.
  Parses `content/calendar.yml` via `gray-matter` (already a
  prod dep) by wrapping the raw YAML in `---` fences and reading
  `.data` — the same js-yaml engine the rest of the content
  layer already uses, no new dependency.
- `scripts/lib/finale-gate.mjs` — pure logic:
  `auditMarker(show, season)`, `dueFinales(entries, today,
  auditText)` (past finale AND marker absent from AUDIT.md),
  `renderAuditRow(entry)`.
- `scripts/finale-gate.mjs` — thin CLI wrapper: read
  `content/calendar.yml` (gray-matter wrap, same as the loader),
  read `plan/AUDIT.md`, compute due finales, append rows under
  `## Pending`, write back. Idempotent: a finale already
  represented by its marker anywhere in AUDIT.md is skipped.

Reused: `gray-matter`, `src/content/loaders.ts` (`getAllShows`),
`scripts/content-check.ts` (gains calendar validation).

## Cross-links

- **In (verify):** `content:check` validates the calendar
  shape + show-slug referential integrity. `test:run` covers
  `src/content/__tests__/calendar.test.ts`. `test:scripts`
  covers `scripts/__tests__/finale-gate.test.mjs`.
- **Out (ship):** none — no UI surface.
- **Retro-fit:** `skills/march.md` + `skills/iterate.md` gain a
  Step 0.5 documenting the gate invocation so future loop ticks
  run it. `.claude/agents/content-curator.md` +
  `skills/ship-content.md` gain a short note: a
  `source: self` finale-shift AUDIT row is editorially
  autonomous (spoiler-safe note + optional `canonical_position`
  adjust).

## SEO / metadata / output schema

`calendarEntrySchema`:

```
show:        slug (lowercase kebab; must resolve to a known show — enforced by content-check, not the schema, so an unseeded future show can still be calendared)
season:      positive int
finale_date: ISO YYYY-MM-DD
status:      enum 'scheduled' | 'aired'
```

`calendarSchema`: `{ finales: calendarEntrySchema[] }`. No
duplicate `(show, season)` pair (enforced by content-check).
`status` is informational/human-facing partition; the gate
keys off `finale_date < today` per the brief wording. JSON-LD:
none (no rendered surface).

## Hero / body / sub-section composition

No rendered surface. `content/calendar.yml` is seeded from
`scout`-cited public finale dates (2026-05-19): Survivor 50
(2026-05-20, scheduled), Survivor 48 (2025-05-21, aired),
Amazing Race 38 (2025-12-10, aired), Top Chef 22 (2025-06-12,
aired), Drag Race 17 (2025-04-18, aired).

## Empty / loading / error states — copy locked

- **Calendar file absent:** `getCalendar()` returns `{ finales:
  [] }`; gate is a clean no-op; content-check passes (calendar
  is optional infrastructure, like a show with no canon yet).
- **Malformed row:** Zod parse throws `ContentValidationError`
  → content-check fails with the file + path, same as every
  other content file.
- **Nothing due:** gate prints `finale-gate: ok — N calendar
  entries, 0 due` and exits 0 without touching AUDIT.md.
- **AUDIT row copy (locked):**
  `- [ ] [MED] post-finale ranking-shift note owed for <Show
  Name> season <N> (finale aired <ISO>) — write the spoiler-safe
  shift note and adjust canonical_position if the editorial
  rationale warrants it (category: content-gaps, source: self,
  score: 4.5) <!-- finale-shift:<show>:<season> -->`
  The HTML comment is the idempotency marker.

## Decisions made upfront — DO NOT ASK

1. **Calendar parse uses `gray-matter`, no new dependency.**
   Wrap raw YAML in `---` fences, read `.data`. js-yaml (its
   engine) already parses every frontmatter file in the repo.
   Order of authority: bearings "locked stack" — no new deps
   without cause.
2. **content-check enforces show-slug existence; it does NOT
   require the referenced season file to pre-exist.** A
   calendared future finale legitimately precedes its seeded
   season file — surfacing that gap is the whole point. (Show
   slug must exist so a typo can't silently disable the gate.)
3. **The gate keys off `finale_date < today`, not `status`.**
   `status` is the human/curator partition (`scheduled` vs
   `aired`) and a content-check sanity signal (a past date with
   `status: scheduled` is allowed but a future date is the norm
   for `scheduled`). Brief wording is "finales with finale_date
   < today" — the date is authoritative.
4. **Idempotency marker is an HTML comment
   `<!-- finale-shift:<show>:<season> -->` on the AUDIT row.**
   The gate greps the entire AUDIT.md (Pending + Done) for the
   marker; present → skip. This survives the row moving from
   Pending to Done, so a shipped shift note is never re-filed.
5. **Score 4.5, severity MED.** A post-finale shift is real
   content freshness (impact ~6) and bounded (ease ~7.5):
   `6 × 7.5 / 10 = 4.5`. Above the `/march` Step 3b.5 / iterate
   ≥3.0 dispatch floor so the drain actually picks it up; below
   a P0/bug so it never jumps a spoiler patch.
6. **The gate is wired into the loop via `skills/march.md` +
   `skills/iterate.md` Step 0.5 (repo source of truth).** The
   cloud `march.yml` prompt is NOT edited (workflows scope is
   denied to the cloud token by design — same constraint that
   blocked the phase-40 `march.yml` flip). The skill files are
   what the loop reads each tick; documenting the invocation
   there is the cloud-shippable wiring. A standalone
   `node scripts/finale-gate.mjs` is also runnable by hand.
7. **Editorial autonomy contract (oversight 2026-05-19):** the
   content drain that picks up a `source: self` finale-shift
   row MAY autonomously write the spoiler-safe shift note AND
   adjust `canonical_position`. Spoiler discipline is P0 — the
   note frames the *ranking shift*, never the
   winner/elimination/outcome; any `canonical_position` cascade
   obeys the always-working + content-check invariants. This is
   documented in `content-curator.md` + `ship-content.md`, not
   coded — the gate only files the row.
8. **Seed data is `scout`-cited public air dates only.** A
   finale air date is explicitly NOT a spoiler (standing rule
   §7: air dates / format are fair game). No outcome data in
   the calendar.

## Mobile reflow / responsive / paginate / output limits

N/A — no rendered surface.

## Pages × tests matrix

| Surface | Test | Assertion |
|---|---|---|
| `calendarEntrySchema` | `calendar.test.ts` | valid row parses; bad date / bad status / negative season / missing field reject |
| `getCalendar()` | `calendar.test.ts` | parses a temp fixture; absent file → `{finales:[]}`; malformed YAML → throws |
| `partitionFinales()` | `calendar.test.ts` | past/future split is correct at the `today` boundary (finale_date === today → not past) |
| `auditMarker()` | `finale-gate.test.mjs` | stable `finale-shift:<show>:<season>` token |
| `dueFinales()` | `finale-gate.test.mjs` | past + marker-absent → due; past + marker-present (Pending OR Done) → skipped; future → skipped; double-run is idempotent |
| `renderAuditRow()` | `finale-gate.test.mjs` | row carries category/source/score + the marker comment |
| content-check | `content-check.test.ts` | unknown show slug → failure; duplicate (show,season) → failure; valid calendar → ok; absent calendar → ok |

## Verify gate

`pnpm tokens && pnpm typecheck && pnpm check:no-raw-img &&
pnpm test:run && pnpm test:scripts && pnpm content:check`
→ `pnpm build` → e2e. All hard.

## Commit body template

```
feat: content/calendar.yml + finale-detection gate — phase 39

- content/calendar.yml seeded from scout-cited public dates
- src/content/calendar.ts loader + Zod schema + partitionFinales
- scripts/finale-gate.mjs idempotent AUDIT-row gate + lib + tests
- content-check learns the calendar shape (show-slug integrity)
- skills/march.md + iterate.md Step 0.5 wire the gate into the loop
- content-curator + ship-content document the editorial autonomy

Decisions:
- gray-matter wrap, no new dep (decision 1)
- show-slug enforced, season file not required (decision 2)
- gate keys off finale_date<today; idempotent via HTML marker (3,4)

Closes #<phase-issue>
```

## DoD

- [ ] `content/calendar.yml` seeded, scout-cited dates.
- [ ] `src/content/calendar.ts` + colocated vitest tests.
- [ ] `scripts/finale-gate.mjs` + `scripts/lib/finale-gate.mjs`
      + `scripts/__tests__/finale-gate.test.mjs`.
- [ ] `content-check.ts` validates the calendar.
- [ ] `skills/march.md` + `skills/iterate.md` Step 0.5 added.
- [ ] `content-curator.md` + `ship-content.md` editorial note.
- [ ] Verify gate green; pushed; deploy green.
- [ ] Build-plan row `[x]` with commit hash.

## Follow-ups (out of scope)

- The content drain actually writing a shift note for a
  gate-filed row is a *future* `/ship-content` / `/iterate`
  tick, not this phase. This phase ships the mechanism only.
- A rendered "upcoming finales" surface, if ever wanted, is a
  separate phase with its own URL + e2e.
