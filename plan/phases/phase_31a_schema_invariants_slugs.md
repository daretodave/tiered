# Phase 31a — Schema, content-check invariants, season URL slugs

> First of three sub-phases that together replace the original
> phase 31 monolith (which the cloud loop correctly diagnosed
> as too large for a single tick — see closed issue #44). The
> three sub-phases ship the same end product as the original
> brief; they just split delivery across cloud-tickable units.
> The full original brief lives at
> `plan/phases/phase_31_canon_rank_unification.md` for context —
> the headline rule (**canon rank is ALWAYS working**), the
> reference design (`design/tiered.tv · Survivor Canon.html`),
> the why-now narrative, and the out-of-scope notes all carry
> over.

## Sub-phase sequence

- **31a (this phase)** — schema fields + invariant code (lax
  mode) + content-curator / ship-content rewrites + season
  URL slug rename. Pure code. One cloud tick. Verify stays
  green because the new invariant lands in tolerant mode
  (only fails on mismatch between canon entries that DO exist
  and season frontmatter that disagrees — does not yet
  require every show to have a canon).
- **31b** — canon data drain. Author the missing `canon.md`
  files + extend existing ones + backfill `canonical_position`
  across every seeded season. Multi-tick drain like phase 26.
  The final tick flips the invariant from lax to strict.
- **31c** — page rebuild. New unified canon/community shell +
  show-home chip wiring + vote-question reword. Consumes the
  data 31b produced. One cloud tick.

Phase 26 stays parked behind 31c. Every cloud tick from 31a
onward produces canon-conforming + slug-canonical content; by
the time 31c lands, the site is in the wonderful state we're
chasing.

## Scope — 31a only

### 1. Schema additions

In `src/content/schemas.ts`:

**`canonFileSchema`** gains a frontmatter block (currently
only carries `show` + `entries`). Add — all OPTIONAL on the
schema; the renderer collapses missing pieces; 31b populates
them as it drains:

- `editor` — string ≤ 80 chars. Defaults to
  `"tiered.tv Editors"` when absent.
- `last_revised` — ISO date.
- `meth_who_h` / `meth_who_p` — methodology cell 1 heading
  (≤ 80 chars) + paragraph (40–60 words).
- `meth_how_h` / `meth_how_p` — methodology cell 2.
- `meth_when_h` / `meth_when_p` — methodology cell 3.
- `tier_s_blurb`, `tier_a_blurb`, `tier_b_blurb`,
  `tier_c_blurb` — 10–40 words each. Renderer collapses tier
  header when absent.
- `weekly_question` — string ≤ 140 chars.
- `era_bands` — array of `{ key, label, range: [year, year] }`,
  0–6 entries. Defaults to the four-band hard-coded fallback
  when absent.

**`canonEntrySchema`** extension:

- `tag` — string ≤ 120 chars. Italic single-line editorial
  tag rendered above the rationale.
- `slot_argument` — string ≤ 240 chars. The "Why this slot"
  mini-card text on hero entries.
- `community_rank_hint` — `{ rank: int, delta: int, sentiment:
  'up'|'down'|'hold' }`. Optional authored hint used until
  live vote data wires in.

**`seasonFrontmatterSchema`** — no new fields here. The
`canonical_position` field is already in the schema (optional);
31b makes it required-in-practice via the content-check
invariant. 31a documents the convention.

### 2. `scripts/content-check.ts` — lax invariant

Today the script validates frontmatter + word counts. Add two
new assertions in **lax mode** — they fail the build only on
**conflict**, not on **absence**:

- For each season with a `canonical_position`: if the season's
  show has a `canon.md`, the matching canon entry's `rank` must
  equal the season's `canonical_position`. Mismatch = fail.
  No canon = no check (passes).
- For each canon entry: the referenced season number must
  exist as a file in `content/shows/<slug>/seasons/`. Dangling
  reference = fail.
- Slug uniqueness (see §3): within a show, every season's
  resolved slug must be unique. Duplicate = fail.

Comment in the script explicitly notes these assertions are
**lax mode for 31a → strict mode at the end of 31b**. Strict
mode adds: every show with one or more seasons must have a
`canon.md`; every season must have `canonical_position` set;
every season in a show's `seasons/` directory must appear as
a canon entry. The flip is a one-line change at the bottom
of the script (a `const STRICT = false` constant) — 31b's
final tick toggles it.

`pnpm content:check` already runs inside `pnpm verify`. No
script-wiring change needed.

### 3. Season URL slugs — `/season/4` → `/season/marquesas`

Numeric season URLs are weak for SEO and unfriendly to share.
Switch the canonical form to a slug derived from the season
filename (already half-shipped — every season file is named
`NN-<slug>.md`, e.g. `04-marquesas.md`,
`20-heroes-villains.md`, `41-new-era-i.md`).

1. **Loader.** `src/content/loaders.ts` parses `^(\d+)-(.+)\.md$`
   on each season filename and stores the captured suffix as
   `season.slug`. The 47 existing files all match this pattern
   — no frontmatter authoring required. Files that don't match
   fail content-check.
2. **Schema.** `seasonFrontmatterSchema` gains an OPTIONAL
   `slug` override (kebab-case, ≤ 64 chars). Curators only
   reach for the override when a filename rename would be
   awkward; default is the filename-derived slug.
3. **Route rename.**
   `src/app/shows/[show]/season/[n]/`
   → `src/app/shows/[show]/season/[slug]/`. New helper
   `getSeasonBySlug(show, slug)` resolves the slug; falls
   back to numeric parse for back-compat (so old links work
   while the middleware redirects).
4. **Middleware redirect.** `src/middleware.ts` adds a 308
   from `/shows/<show>/season/<digits>` to
   `/shows/<show>/season/<slug>` whenever the digit form
   resolves to a known season. External links / search-engine
   indexes / shared URLs keep working but land on the
   canonical form.
5. **Sitemap.** `src/app/sitemap.ts` emits slug-form URLs
   only.
6. **Internal-link sweep.** Replace `season.number` with
   `season.slug` in the href for every link emitter that
   currently exists in the codebase:
   - `<SeasonCard>` on `/shows/<show>` (`src/app/shows/[show]/page.tsx`)
   - `<AdjacentSeasons>` prev / next
   - `<AppearsInList>` rows
   - Season-detail JSON-LD self-link + breadcrumb trail
   - The current `<CanonList>` / `<CanonEntry>` (existing canon
     page — will be replaced in 31c, but for one cycle these
     links need slug form too)
   - The community page's `<SeasonGrid>` / `<SeasonCard>`
   - **Cross-reference keys stay numeric:** `theme.entries[].season`
     is still the curator-authored cross-show join key (a
     number); only the rendered `href` flips to slug. `votes`
     target_ids stay `<show>:<season-number>` for DB-stability
     across future slug renames.
7. **E2E fixtures.**
   - `apps/e2e/src/fixtures/canonical-urls.ts` regenerates
     from the slug form.
   - `apps/e2e/src/fixtures/page-reads.ts` updates to the
     slug form.
   - Add one digit-form URL per show to a new
     `apps/e2e/src/fixtures/redirect-fixtures.ts`; smoke
     walker also hits each and asserts 308 → slug-form
     Location header.

### 4. Generation paths — content-curator + ship-content

**`.claude/agents/content-curator.md`:**

- Season frontmatter template gains a **required** field:
  `canonical_position: <int>`. When the show's canon exists,
  derive from the canon entry; when authoring a brand-new
  show, co-author the canon in the same tick and pull the rank.
  No "leave blank and fill later" mode.
- Default `vote_question: "Does this belong in the community
  top 10?"` in every season template. The agent only swaps to
  a show-specific phrasing when editorially warranted; even
  then, "community", never "canon".
- Canon template carries the new frontmatter block — every
  field documented with length caps + a worked Survivor
  example.
- Canon entry template carries `tag` + `slot_argument` +
  optional `community_rank_hint` with worked examples.
- **Insertion semantics** spelled out: when adding a season
  to an existing canon, the curator slots it at the position
  it deserves and shifts every entry below by +1; when
  promoting a season up, the curator shifts the in-between
  entries by ±1. Worked rebase example.
- **Filename convention** documented: every season file is
  named `NN-<slug>.md`. Slug is kebab-case ASCII (transliterate
  accents: `kaoh-rong`, not `kaôh-rōng`). The filename is the
  slug; no override needed unless renaming would be awkward.

**`skills/ship-content.md`:**

- New "Canon discipline" section at the top of the rules block
  stating the always-working rule in one paragraph + the
  rebase semantics + the slug filename convention + the
  pre-flight check command.
- Rule 1 (new show): the curator brief now lists a populated
  `canon.md` as part of the ship payload — full frontmatter
  + one ranked entry per seeded season. A new show ships
  with at least one season AND a canon ranking that season
  at #1, rationale authored in the same tick.
- Rule 2 (season backfill): every season the curator produces
  in a batch ships with `canonical_position` filled. Before
  committing, the curator opens the show's `canon.md`,
  inserts each new season at the editorially-correct
  position with an 80–120-word rationale, shifts surrounding
  ranks, and re-writes any `canonical_position` values on
  previously-seeded seasons whose rank moved. Pre-flight
  checklist gains: `[ ] canon.md updated; every seeded
  season's canonical_position matches its canon rank;
  content:check passes (slug uniqueness + canon-rank sync)`.

## Components

No new React components in 31a. The route rename touches the
existing `[n]/` directory only; the canon page rebuild +
component creation happens in 31c.

## Tests

**Unit (vitest):**

- `loaders.test.ts` — slug parsed from filename for every
  existing season; override beats derivation; non-conforming
  filename fails parse.
- `content-check.test.ts` — lax-mode assertions: a canon
  entry pointing at a missing season fails; a season with a
  `canonical_position` that disagrees with its canon entry
  fails; a season without `canonical_position` but with no
  canon for the show passes (lax tolerance); duplicate slug
  within a show fails.
- `middleware.test.ts` — `/season/4` → 308 → `/season/marquesas`;
  unknown digit returns 404; the slug form passes through
  untouched.

**Playwright:**

- Update `apps/e2e/tests/season-page.spec.ts` to assert the
  page loads via the slug URL.
- New `apps/e2e/tests/redirects.spec.ts` — visits one
  digit-form URL per show and asserts the 308.
- Smoke walker hits the regenerated slug-form URLs cleanly.

## Acceptance

- Schema gains the canon frontmatter block + the new entry
  fields. Existing canons (survivor / dragrace / top-chef)
  validate cleanly because every new field is optional.
- `content/shows/survivor/seasons/marquesas` (i.e. the slug
  route) resolves; `/shows/survivor/season/4` 308s to it.
  Sitemap emits slug form only.
- `pnpm content:check` runs lax-mode assertions on every
  commit; fails on mismatch or dangling reference; passes
  on absence-of-canon.
- `.claude/agents/content-curator.md` + `skills/ship-content.md`
  rewritten — Canon discipline section, Rule 1 stub-canon,
  Rule 2 rebase semantics, filename convention.
- `pnpm verify` green.
- Build-plan check-mark: `[x] Phase 31a` with commit hash.
- Plain commit message, no Co-Authored-By, no emoji.

## Out of scope (deferred to 31b / 31c)

- **No canon data backfill.** No new `canon.md` files
  authored. No `canonical_position` written. No entry
  rationales. → 31b.
- **No page rebuild.** `/shows/[show]/canon` and `/community`
  keep their current implementations until 31c. The Survivor
  Canon.html design is referenced by 31c only.
- **No "By era" chip removal.** The show home FilterBar
  stays as-is until 31c.
- **No vote-question reword in existing content.** The
  schema default flips in 31a; the actual `vote_question:`
  values authored in existing season files get rewritten
  in 31b (alongside the canonical_position backfill —
  same commits).
- **Strict-mode content-check.** Stays as a one-line flip
  at the bottom of the script, awaiting 31b's final tick.
