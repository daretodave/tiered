# Phase 26 — Season backfill, full drain (10/tick) + canon

> **Goal.** Drain every missing season for every tracked show
> until coverage is complete, then promote each show's
> Editor's Canon to a full ranking. The redesigned season page
> (per `design/tiered.tv · Heroes vs. Villains.html`) consumes
> a richer data shape than we used to ship; phase 26a put that
> shape in place, and this phase fills it in across the catalog.
>
> **Posture.** This is the long truck. The cloud loop runs it
> at a steady cadence with one show per tick (10 seasons per
> tick maximum, drain until done), then transitions into the
> canon-ranking pass. Expect this phase to run over many
> march ticks — the goal is completeness, not a single-tick
> finish.
>
> **Ordering note.** This phase sits BEHIND the redesign phases
> (27 / 28 / 29). The redesign work changes the surfaces that
> consume this data; running it after the rebuilds lets the
> cloud loop see the new pages as it ships content.

## Pre-flight

Phase 26a must be shipped first. This phase assumes:

- `seasonFrontmatterSchema` carries the editorial block
  (`display_title`, stats captions, `episode_heat`,
  `watch_list`, etc.).
- `.claude/agents/content-curator.md` and
  `skills/ship-content.md` document the twelve-field show
  contract + the season editorial-metadata block with examples.
- The 17 existing season files validate against the new
  schema.

If any of the above is false, ship phase 26a in the same
commit as the first 26 tick rather than red-out the verify
gate.

## Outcome (per show)

For every show under `content/shows/*.md`, a full season set
exists at `content/shows/<slug>/seasons/NN-<title>.md` covering
every aired season. Each file carries:

- Required: `show`, `number`, `title`, body (50-80 words,
  spoiler-safe).
- `display_title` when the title has a natural accent
  (`vs.`, `&`, a colon, etc.) — render via `<em>...</em>` +
  optional `<br/>`.
- Stats — `premiere_date`, `ep_count`, `location`, `host` from
  public record. Captions where editorially confident:
  `filming_caption`, `premiere_caption`, `episodes_caption`,
  `host_caption`.
- `format_summary` (60c) + `format_caption` (80c).
- `cast_size` (int) + `cast_size_caption`.
- `eyebrow`, `lede`, `pull` for the hero.
- `episode_heat` array (length = `ep_count`) when a confident
  read on episode intensity is possible. Skip otherwise.
- `watch_list` of 3-6 `{ episode_label, body }` entries — the
  single highest-value editorial element. Pointers at moments,
  never outcomes. Spoiler discipline P0.

Once a show's seasons clear the floor, the canon pass runs:

- If `content/shows/<slug>/canon.md` doesn't exist yet, write
  it with at least the show's three strongest entries (3 ranked
  rationales, 80-120 words each).
- If a canon exists with fewer entries than seasons, extend it
  one batch at a time toward full coverage. `canonical_position`
  on each season file is the cross-link.
- After each canon batch, check the show's `tier` in
  `content/shows/<slug>.md` frontmatter. Shows clearing **3+
  canon entries AND ≥75% season coverage** promote from B to
  A. Shows with full coverage + a 10+ entry canon are eligible
  for S, but tier-S is reserved for format-defining work —
  promote conservatively.

## Per-tick budget

- **Up to 10 season files per tick.** Lower the count if the
  show only has fewer ungenerated; never split editorial
  judgment across ticks to hit a quota.
- **One show per tick.** Don't chain shows in the same commit
  — the editorial context for one show is dense enough.
- **Canon updates ride alongside.** If a tick ships seasons
  for show X and X's canon needs a corresponding rerank, the
  canon edit goes in the same commit.
- **Tier promotion is inline.** If the tick brings show X over
  the A-tier floor, flip the `tier` field in `<slug>.md` in
  the same commit.

The 60/24h cloud commit ceiling (per
`.github/workflows/march.yml`) holds. Expect the phase to span
several days at the every-40-min cadence.

## Dispatch order

When a tick lands on this phase, pick the **show with the
largest gap** (= `show.seasons` − count of files under
`seasons/`). Tie-break on the order in
`scripts/launch-shows.mjs` (the launch-quota canonical list).

Within a show, dispatch the **earliest unfilled season number
first**, then walk forward. This keeps the canon's "S1 →
canonical references" pattern intact and gives the editorial
agent the show's chronology as it builds.

## Workflow

1. Read the show's frontmatter + any existing canon + any
   already-shipped seasons.
2. Identify the 10-or-fewer next seasons to ship.
3. Invoke `content-curator` with:
   - Show slug + the season numbers to draft.
   - Twelve-field show frontmatter as context.
   - The full editorial-metadata block to fill per season.
   - The watch-list rubric: 3-6 entries, episode label leading
     with `Ep N`, 1-2 sentence body, spoiler-safe pointers.
4. `pnpm content:check` validates.
5. `pnpm verify` is the gate.
6. Commit with `Cloud-Run:` trailer + push.

## Canon pass — long truck

Separate from the season drain. Once a show clears the
season-coverage floor, the next tick on this phase enters
"canon mode" for that show:

- Read all `seasons/*.md` for the show.
- Decide a ranked order. The seasons themselves carry the
  signals — `tier_signal`-ish reads in `format_summary`,
  `format_caption`, `pull`, the editorial slant of the body,
  the `episode_heat` density.
- Write `content/shows/<slug>/canon.md` with the full ranking,
  80-120 word rationales per entry.
- Apply `canonical_position` to each season's frontmatter.
- Update the show's `tier`.

A single canon-mode tick can ship one show's full canon (12-30
ranked entries). The `60/24h` ceiling absorbs it.

## Acceptance — overall phase

- Every show has at least one season file per aired season,
  validated by `pnpm content:check`.
- Every show has a `canon.md` with at least one ranked entry.
- The B tier (in show frontmatter) has drained — no show
  remains in B once its canon + ≥75% season coverage is
  shipped.
- Build plan check-mark: `[x] Phase 26` with commit hash on
  the final tick. (Earlier ticks add WIP commits but don't
  mark the phase done.)
