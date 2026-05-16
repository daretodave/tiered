# Phase 34 — Era-band drain (tag 'em all)

> A multi-tick **auto-draining** content phase, same mechanic
> as phase 26 / 31b: each cloud tick picks one show and authors
> its era taxonomy in the data layer. The consuming UI already
> exists — phase 33's era toolbar reads `canon.era_bands`
> generically. So this phase ships **zero page code**; every
> drained show's filter chips light up automatically.
>
> Sits **after phase 26** in the queue (the user holds phase
> 26's season-backfill priority). Resumes the
> `/iterate` + `/ship-content` cadence afterward.

## Why this is its own phase

Phase 33 builds the era toolbar and ships it functional for
Survivor, whose `canon.md` already carries 5 authored
`era_bands`. The other 11 launch shows have **no `era_bands`**,
so their toolbar shows "All" only. Phase 34 is the content
drain that authors per-show era bands so every show's toolbar
becomes useful. Era structure is **per-show editorial**, not a
generic year bucket — Survivor's pioneer/classic/high-strategy/
twist-heavy/new-era is nothing like Drag Race's or Top Chef's
era story. This needs the `content-curator` voice, one show at
a time, which is exactly the phase-26 drain shape.

## Data home (already in the schema)

`src/content/schemas.ts` already defines (added phase 31a):

```
era_bands: z.array(eraBandSchema).max(6).optional()   // canon.md frontmatter
```

`eraBandSchema` = `{ key, label, range: [startYear, endYear] }`.
**No schema change needed.** Phase 34 authors data into the
existing optional field. The per-season → band mapping is
derived at render time from `season.premiere_date` (phase 33's
toolbar already does this) — seasons need **no** new field.

## Per-tick work (the drain loop)

Each tick, pick the highest-priority show that has an authored
`canon.md` but no `era_bands` (or stale bands), and via
`content-curator`:

1. Author **3–6 era bands** for that show — `key` (kebab),
   `label` (≤ ~14 chars, the toolbar chip text), `range`
   `[startYear, endYear]` covering the show's aired span with
   no gaps and no overlaps, boundaries on real editorial era
   shifts (format reboots, host changes, the show's own
   periodisation), not round decades.
2. Sanity-check coverage: every aired season's
   `premiere_date` year falls in exactly one band.
3. Commit per show (atomic; `Cloud-Run:` trailer).

**Priority order** (most seasons / highest traffic first;
skip any already done):
Survivor (already authored — gold standard, skip) → The
Amazing Race → The Challenge → Top Chef → RuPaul's Drag Race →
then the remaining launch shows as their canons exist. A show
with no authored canon yet is **skipped** (per the
always-working rule — it gets `era_bands` when phase 26 / a
future `/ship-content` tick first authors its canon).

## Invariant (lax → strict, like 31b)

Add a `content-check` invariant: a show with an authored
`canon.md` and ≥ 8 aired seasons should carry `era_bands`.
Ship it **lax** (warns, tolerant of absence) so the drain can
run incrementally without blocking commits. The **final tick**
(all priority shows drained) flips it strict — every qualifying
show must have gap-free, overlap-free bands whose union covers
the aired span.

## Agent-guidance update (ship once, early in the drain)

Update `.claude/agents/content-curator.md` + `skills/
ship-content.md` so **future** shows author `era_bands`
alongside the canon block from the first canon (same way
phase 31a folded the canon frontmatter into the standing
brief). After phase 34, new shows arrive era-banded by
default and the strict invariant stays green.

## Tests

- Unit: an `era_bands`-coverage helper (every aired season
  maps to exactly one band; union spans first→last aired
  year) with table tests across the drained shows.
- `content-check` invariant test (lax tolerates absence;
  strict rejects gaps/overlaps/missing).
- No new e2e URL (no new pages). The existing
  `/shows/[show]` smoke read gains an assertion, on shows
  with bands, that the era toolbar renders > 1 chip — added
  as those shows drain.

## Acceptance (final tick)

- Every priority show with an authored canon carries
  gap-free `era_bands`; its phase-33 toolbar shows real era
  chips that filter the tier list.
- Strict `content-check` invariant live and green.
- `content-curator` + `ship-content` briefs updated so new
  shows are born era-banded.
- `pnpm verify` green each tick; `deploy:check` green.
- Build-plan row `[x] Phase 34` ticked on the final tick
  (interim ticks leave it `[ ]` / `[WIP]`, like phase 26).

## Out of scope

- The toolbar UI and the season→band derivation (phase 33).
- Any per-season free-form tag vocabulary beyond era. If a
  broader tagging system is ever wanted, it is a separate
  `/expand` candidate, not this phase.
- Backfilling `era_bands` for shows with no canon yet — they
  get bands when their canon is first authored.
