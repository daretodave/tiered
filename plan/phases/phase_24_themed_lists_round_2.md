# Phase 24 — Themed lists round 2 (5 lists)

> **Outcome.** Five themed lists land — best villain editing,
> best comeback seasons, best location reveals, best reunion
> specials, best non-winning runs — drawing from the curated
> Survivor corpus (eight seasons after phase 23). After this
> phase, `content/themes/*.md` count goes from 7 → 12, draining
> bearings Rule 3 past the launch quota (≥10). No new season
> files seed in this phase — the eight Survivor seasons already
> on file substantiate every angle below.
>
> **Why this phase exists.** Phase 23 took Rule 3 from 2/10 to
> 7/10. This phase finishes the drain at 12/10. The five angles
> below were named on `01_build_plan.md` row Phase 24 in the
> original substrate plan and are picked here without
> re-litigation. They span `craft` and `tone` — the two
> categories Round 1 already shipped against — to keep the
> overview's category-grouped layout balanced rather than
> tipping into a single bucket.
>
> **No new season files. No facade work.** Per
> `design/CLAUDE.md` Hard Rule 1, visual identity is color +
> typography + the shared brand mark. Per phase 23's precedent,
> Round 2 themed lists draw from Survivor only; the `firsts.md`
> shape (cross-show angle, single-show roster) holds.
> Cross-show themed lists wait for season-blurb backfill in
> later phases.

## 1. The five themed lists

Mirror the schema + voice pattern from
`content/themes/best-finales.md` and
`content/themes/best-returnees.md`. Required frontmatter per
phase 19f schema: `slug`, `title`, `description`, `tagline` (≤
360 chars, at most one `<b>…</b>` span), `category` (one of
`tone | craft | era | single`), `sentiment`, `status`,
`curator`, `last_revised` (ISO), `featured` (bool), `related`
(0–4 slugs), `entries` (1–30). Each entry: `show`, `season`,
`rank`, `title` (≤140 chars), `blurb` (≤280 chars), optional
`season_label`.

| Slug                   | Title                                | Category | Sentiment | Featured | Anchor entries     |
|------------------------|--------------------------------------|----------|-----------|----------|--------------------|
| `best-villain-editing` | Villain edits that ran the season    | craft    | consensus | true     | S20, S7, S28       |
| `best-comeback-seasons`| Comeback seasons that landed         | tone     | warm-up   | true     | S41, S20, S31, S40 |
| `best-location-reveals`| Location reveals that announced themselves | craft | warm-up | false    | S7, S1, S31        |
| `best-reunion-specials`| Reunion specials that closed the loop | tone   | verdict   | false    | S20, S1, S40       |
| `best-non-winning-runs`| Non-winning runs that defined the season | tone | hold      | false    | S7, S31, S20, S28  |

Per-entry size: 3–5 entries per list. Voice: knowledgeable
peer, plain-spoken, no exclamation points. **Spoilers are
P0** — taglines + entry titles + blurbs describe what the
season *is* or *what shape its narratives took*, never who
wins, who gets voted out, or which players survive the merge.
The `best-non-winning-runs` list in particular is written at
the **season-texture level** — it talks about seasons whose
most-discussed arcs belonged to players who didn't take the
title, without naming positions or final outcomes.

The `related` cross-link spread:

- `best-villain-editing` → related: `[best-returnees, survivor-pillars]`
- `best-comeback-seasons` → related: `[best-returnees, best-finales]`
- `best-location-reveals` → related: `[firsts, best-premieres]`
- `best-reunion-specials` → related: `[best-finales, survivor-pillars]`
- `best-non-winning-runs` → related: `[best-post-merge, best-comeback-seasons]`

## 2. No new season files

The eight Survivor seasons currently in
`content/shows/survivor/seasons/` (S1, S7, S20, S28, S31, S40,
S41, S45) substantiate every angle. If a contributor wants to
extend a list with a ninth Survivor season, that's a follow-up
content-velocity tick, not part of this phase.

## 3. Bearings Rule 3 progress

Rule 3 quota is ≥10 themed lists at launch. After this phase,
the count is 12. The bearings copy does not need editing — the
count is implicit from `content/themes/*.md`. Updating the
bearings copy is unnecessary churn (same call as phase 23).

## 4. AUDIT updates

`plan/AUDIT.md` has no Pending content-gap rows for themed
lists today. Rule 3 rows haven't been filed because
`pnpm content:quota` is currently Rule-1-only. No AUDIT ticks
needed in this commit.

## 5. Tests

No new unit tests required. `pnpm content:check` validates the
new theme files against `themeFrontmatterSchema`. The smoke
walker covers `/themes/<slug>` automatically because
`apps/e2e/src/fixtures/canonical-urls.ts` derives from the
content loaders.

If any related-slug reference is broken or a referenced season
is missing, that surfaces in `pnpm content:check`. Fix the
reference, do not relax the validator.

## 6. Verify + commit + push

```
pnpm verify
git add content/themes/best-villain-editing.md \
        content/themes/best-comeback-seasons.md \
        content/themes/best-location-reveals.md \
        content/themes/best-reunion-specials.md \
        content/themes/best-non-winning-runs.md
git commit -m "feat: phase 24 — themed lists round 2 (5 lists, Rule 3 quota cleared)"
git push origin main
pnpm deploy:check
```

Tick `[x]` for Phase 24 in `plan/steps/01_build_plan.md` in a
separate follow-up commit per `skills/ship-a-phase.md` Step 11.

## 7. Decisions

- **Five Survivor-only themed lists** matches the corpus depth
  today (Survivor is still the only show with curated season
  files). The *angle* of each list is cross-show in spirit —
  `firsts.md`'s precedent again — and a future content tick
  can extend any of them with cross-show entries once more
  shows have season files.
- **No new season files** — Round 1 seeded four. The angles in
  Round 2 don't require additional seeding: villain editing,
  comebacks, locations, reunions, and non-winning runs all
  substantiate from the eight Survivor seasons already on
  file. Conflating more season seeding into a Rule 3 phase
  drifts back into Rule 2 (canon completeness) territory.
- **`featured: true` on `best-villain-editing` and
  `best-comeback-seasons`** — these two are the most
  reader-recognizable angles in Round 2, joining
  `best-premieres` and `best-finales` from Round 1 in the
  `/themes` Featured row (four featured total — fits the
  3-card Featured row plus a strong fourth as the overflow).
- **`category: craft`** for villain-editing and
  location-reveals — both are production-decision angles.
  **`category: tone`** for comeback-seasons, reunion-specials,
  and non-winning-runs — these read by feel, not by
  craft-decision. Round 2 stays in the same two categories as
  Round 1, leaving `era` and `single` for future cross-show
  lists.
- **`status: stable`** for all five — Pantheon's editorial
  voice marks lists `growing` only when entries are explicitly
  planned to be added. These five ship complete.
- **`best-non-winning-runs` at season-texture level, never
  player-name level** — the list is structurally close to a
  spoiler trap. Writing it as "seasons whose narratives lived
  in arcs that didn't reach the title" keeps the spoiler
  promise intact and matches the existing voice (the curated
  themes never name winners).
