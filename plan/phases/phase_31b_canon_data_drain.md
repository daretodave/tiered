# Phase 31b — Canon data drain (multi-tick)

> Second of three sub-phases replacing the original phase 31
> monolith. **31b's job is to make the always-working rule
> true across every seeded season** — every show with one or
> more seeded seasons ends 31b with a real `canon.md` that
> ranks every one of those seasons, and every season file
> ends with a `canonical_position` synced to its canon-entry
> rank. The final tick flips `scripts/content-check.ts` from
> lax to strict, locking the invariant for every future
> commit.
>
> See `plan/phases/phase_31_canon_rank_unification.md` for
> the original brief, the headline rule, and the reference
> design. See `plan/phases/phase_31a_schema_invariants_slugs.md`
> for the schema + invariants + slug rename that 31b consumes.

## Drain pattern — one show per tick

Like phase 26, this phase is a **multi-tick drain**. Each
cloud tick picks one show, ships its canon end-to-end, and
commits. Several ticks complete the phase.

**Per-tick scope:**

1. Pick the next show in the priority order below that
   doesn't yet have a complete canon.
2. If the show has no `canon.md` yet → author one with the
   full new frontmatter block (editor, last_revised, three
   methodology cells, four tier blurbs, weekly_question,
   era_bands when meaningful for the show).
3. If the show has an existing `canon.md` → upgrade its
   frontmatter to the new shape (add the missing fields)
   AND extend its entries to cover every seeded season for
   that show.
4. For every seeded season of the show, write the canon
   entry: `rank`, `season`, `title`, `rationale` (80–120
   words, spoiler-safe), `tag` (≤ 120 chars, italic
   editorial line). For the **top 5** entries on each show,
   also write `slot_argument` (≤ 240 chars) +
   `community_rank_hint` (`{ rank, delta, sentiment }`,
   curator's judgment of where the community would land
   relative to canon).
5. Walk every seeded season file for that show and set
   `canonical_position` to match the canon entry's `rank`.
   Files that already had a `canonical_position` get
   updated if the new ranking shifted them.
6. Walk every seeded season file and update `vote_question:`
   anywhere it mentions "canon top 10" to "community top 10"
   (the few that already author the question). Schema
   default already flipped in 31a — this is the content sweep.
7. `pnpm content:check` must pass in lax mode on every
   commit. (Strict mode flips on the LAST tick — see below.)
8. `pnpm verify` green. Commit + push with the Cloud-Run
   trailer per the cloud-march rules.

**Priority order** (ship in this sequence — earlier shows
are the ones the user is most likely to land on first):

1. **Survivor** — has 18 seeded seasons (S1–6, S7, S8–12,
   S20, S28, S31, S40, S41, S45). Existing canon has 4
   entries; needs 14 more rationales authored + every
   season's `canonical_position` set + top-5 hero fields
   (`tag` / `slot_argument` / `community_rank_hint`)
   completed. **This is the gold-standard tick** —
   landing it first means Survivor demonstrates the entire
   31c page rebuild in its final form.
2. **Amazing Race** — 13 seeded seasons, no canon yet.
   Author from scratch with the full frontmatter +
   13 ranked entries.
3. **The Challenge** — 10 seeded seasons, no canon yet.
   Author from scratch.
4. **Drag Race** — 3 seeded seasons, existing canon.
   Extend frontmatter + extend entries to cover all 3 +
   sync `canonical_position`.
5. **Top Chef** — 3 seeded seasons, existing canon.
   Extend frontmatter + extend entries + sync.
6. **Final tick — strict-mode flip.** After all of the
   above shows have shipped, the final tick:
   - Audits every show: every show with one or more seeded
     seasons has a `canon.md`; every season file has
     `canonical_position` matching the canon rank.
   - Flips the one-line `const STRICT = false` to `true`
     at the bottom of `scripts/content-check.ts`. This
     enables the stricter assertions (every show with
     seasons must have a canon; every season must have
     canonical_position; no canon entry orphan; no season
     orphan).
   - Verify passes because every data invariant the strict
     mode demands is now true.

**Shows without seeded seasons stay alone.** Bachelor,
Bachelorette, Bake Off, Big Brother, Love Island UK, Love
Island US, Project Runway, Traitors — these have zero
seeded seasons today; the always-working rule says **shows
with seeded seasons get a canon**, not "every show". They
remain canonless until phase 26 seeds their first season,
at which point the rebase rules in `ship-content` Rule 1
require the curator to author a canon alongside the first
seeded season in the same tick.

## Per-show acceptance (per tick)

Each cloud tick ends with:

- `content/shows/<slug>/canon.md` exists with the full new
  frontmatter (editor, last_revised, methodology x3,
  tier_blurbs x4, weekly_question, era_bands when present).
- Canon entries cover every seeded season of the show. Each
  entry has `rank`, `season`, `title`, `rationale` (80–120
  words, spoiler-safe), `tag`. Top-5 entries additionally
  have `slot_argument` + `community_rank_hint`.
- Every seeded season file in
  `content/shows/<slug>/seasons/` has `canonical_position`
  set, matching the canon entry's rank.
- Every seeded season file whose `vote_question:` mentions
  "canon" reads "community" instead.
- `pnpm content:check` passes (lax mode for non-final
  ticks; strict mode for the final tick).
- `pnpm verify` green.
- Commit message: `content(<slug>): canon authored — N
  seasons ranked (phase 31b, tick K/M)`.
- Plain commit message, Cloud-Run trailer, no emoji, no
  Co-Authored-By.

## Final-tick acceptance (strict-mode flip)

After every priority-order show has shipped:

- `STRICT = true` at the bottom of `scripts/content-check.ts`.
- `pnpm content:check` runs strict assertions:
  - Every show with one or more files in `seasons/` has a
    `canon.md`.
  - Every season file has `canonical_position` set.
  - Every season file's `canonical_position` matches its
    canon-entry rank.
  - No canon entry references a missing season.
  - Every season has a unique slug within its show.
- `pnpm verify` green.
- Build-plan check-mark: `[x] Phase 31b` with commit hash.
- Plain commit message.

## Tests

No new test surfaces in 31b — the lax-mode assertions
landed in 31a; the strict-mode flip just enables stricter
versions of the same assertions on existing data. The
final tick's commit message is the audit-trail.

`apps/e2e/tests/canon-page.spec.ts` (the existing one)
keeps passing — the canon page rebuild waits for 31c, so
this phase only changes data, not UI.

## Out of scope

- **No page rebuild.** `/shows/[show]/canon` still renders
  with the current shell (which has been around since phase
  7); it just shows much richer data now that the canon
  entries are populated. The visual rebuild lives in 31c.
- **No show-home chip wiring.** Stays inert until 31c.
- **No vote-question rewrite in default-text.** That
  already happened in 31a (schema default + agent template).
  31b only touches existing season files where the value is
  explicitly authored with "canon" wording.
- **No new canon for unseeded shows.** Per always-working
  rule, only shows with seeded seasons get a canon.
