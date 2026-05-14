# Phase 26a — Season data shape evolution + existing-content backfill

> **Local-only phase.** Done in the human's session before the
> cloud loop picks up the new (10-seasons-per-tick) phase 26.
> Carries the schema, prompt, and existing-content updates the
> rewritten phase 26 depends on.
>
> **Why now.** The new season-page reference at
> `design/tiered.tv · Heroes vs. Villains.html` introduces a
> stats strip, an episode-heat bar, a "what to watch for" card,
> and a colored accent inside the title (the "vs." in `Heroes
> vs. Villains` rendered in `var(--show-primary)`). The season
> frontmatter contract didn't carry the fields the design
> consumes — agents would invent ad-hoc shapes per tick if we
> let the cloud loop go without the spec.

## Outcome

After this phase ships:

1. `seasonFrontmatterSchema` in `src/content/schemas.ts` gains
   the editorial block — all OPTIONAL, so existing files stay
   valid. New fields:
   - `display_title` — limited-HTML rich variant of `title`.
     Allows `<em>...</em>` (renders show-primary italic accent
     via `.amp` class) + `<br/>` (editorial linebreak). Used
     for the season hero h1. When absent, plain `title` is
     rendered.
   - `filming_caption`, `premiere_caption`, `episodes_caption` —
     subtext lines under the corresponding stat tiles.
   - `format_summary` (60c) + `format_caption` (80c) — the
     "Format" stat pair.
   - `cast_size` (int) + `cast_size_caption` — the "Cast size"
     stat pair.
   - `host_caption` — host subtext (e.g., "tenth season at the
     helm").
   - `episode_heat` — array of `cold`/`med`/`hot` marks, one per
     aired ep. Drives the "Episode rhythm" bar.
   - `episode_heat_caption` — short caption right of the bar
     (e.g., "peak run · eps 7–9, 11").
   - `watch_list` — array of 3-8 `{ episode_label, body }`
     entries. The "What to watch for" card. Spoiler-safe
     pointers, not outcomes.

2. All 17 existing season files have these fields populated
   where editorially defensible. `survivor/20-heroes-villains.md`
   is the gold-standard reference — every field filled to match
   the design 1:1. The other 16 carry every public-record stat
   + a `format_summary` line; the deeper editorial fields
   (`watch_list`, `episode_heat`, `pull`) stay empty so phase
   26 fills them with proper research.

3. `.claude/agents/content-curator.md` ships an updated season
   frontmatter template — every new field documented with
   length caps + a worked example. The `<em>` accent rule is
   called out so new seasons get the colored-accent treatment
   when the title has a natural beat (`vs.`, `&`, `:`, etc.).

4. `skills/ship-content.md` Rule 2 ("canon completion — batch")
   gets renamed to "season backfill — high-volume drain" and
   rewritten to enumerate the new fields, with the **10-per-
   tick** ceiling matching the rewritten phase 26.

5. `pnpm verify` stays green. The schema's optional fields
   accept the existing 17 backfilled files; no test churn
   beyond the schema-test fixtures (covered in the same
   commit).

## What this phase deliberately does NOT do

- It does not rebuild the season page UI against the
  Heroes-vs-Villains reference. The page wiring is a follow-up
  phase. Today's `/shows/[show]/season/[n]` reads as much of
  the new data as it natively supports; new fields render
  later when the surface is rebuilt.
- It does not seed `episode_heat` or `watch_list` for the 16
  non-showcase seasons. Those need real editorial research and
  belong on the cloud phase 26 drain.

## Acceptance

- Schema accepts all 17 existing season files.
- `pnpm content:check` reports `17 seasons` green.
- `pnpm verify` passes.
- `survivor/20-heroes-villains.md` renders `Heroes <em>vs.</em>
  <br/>Villains` in the `display_title` field.
- Build-plan check-mark: `[x] Phase 26a` with commit hash.
- Plain commit message + push.
