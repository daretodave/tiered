# 49 — Graduated spoiler-risk hold for the flagged-comment queue

> The mod queue's `flag` tier (ambiguous spoiler language, held
> for human review) ages out by time-since-the-season-ended
> instead of sitting pending forever; the `block` tier (explicit
> winners/eliminations/deaths/twists) stays a permanent, binary
> gate, unchanged.

## Why

Candidate source: field research (2026-10-27) — some entertainment
coverage grades a piece's spoiler risk on a scale tied to how far
behind a reader might be, rather than a single binary spoiler/
no-spoiler toggle.

tiered.tv's moderation pre-filter
(`src/lib/openai/preFilter.ts`) is already a three-way verdict —
`allow` / `flag` / `block` — not strictly binary. `block` is
reserved for clear, named outcome language (winners, eliminations,
deaths, twists, finale/relationship outcomes — agents.md §7's
exact P0 definition) and should stay permanent: the brand promise
is "no spoilers," not "no spoilers for a while." `flag` is the
system's existing uncertain-case tier — "if unsure between flag
and block: flag (human will review)" — and today a flagged comment
sits in `pending` in `getModQueue()`
(`src/lib/supabase/mod.ts`) indefinitely until a human acts. For a
show with a large back catalog (Survivor, Big Brother), ambiguous
language about a season that ended years ago (format commentary,
contestant-name chatter with no outcome stated) can still read as
"maybe a spoiler" to the model and wait in the queue the same as a
flag on a season that aired last week — the queue doesn't
distinguish "this could still spoil someone mid-season" from
"this show finished airing a long time ago."

A graduated hold on the `flag` tier alone — read against how long
ago the target season finished airing — closes that gap without
touching the P0 `block` gate.

## Design

**Season "ended" signal.** No season-level air-status field exists
today (`seasonFrontmatterSchema`,
`src/content/schemas.ts:107-135`, has `premiere_date` and
`ep_count` but nothing marking a season as finished airing). Add
an optional `ended_date: isoDate` to season frontmatter — the date
the finale aired. Absent (an airing or future season) means "not
ended"; the field is never required retroactively for the whole
catalog in one chunk — only populated where a hold decision
actually needs it (current + recently-ended seasons), per Decisions
below.

**Hold window.** A `flag`-verdict comment (or an existing `pending`
row surfaced by `getModQueue`) whose `targetId` resolves to a
season with `ended_date` more than `flag_hold_days` (default 30)
in the past auto-resolves to `published` the next time the queue
is read or drained, instead of waiting for a mod click. A season
with no `ended_date`, or one inside the window, behaves exactly as
today — no change for anything currently airing or recently
finished.

**`block` is untouched.** No code path in this spec reads
`ended_date` for a `block` verdict. Explicit outcome language
stays rejected regardless of how old the season is — re-litigating
that is explicitly out of scope (Decisions, below).

## Contracts

- `src/content/schemas.ts`: add optional `ended_date: isoDate` to
  `seasonFrontmatterSchema`. No migration — optional field, no
  existing content touched unless a curator backfills it.
- `src/lib/supabase/mod.ts`: `getModQueue()` (or a sibling helper)
  resolves each `pending` row's season `ended_date` and excludes
  rows past the hold window from the returned queue, flipping
  their `status` to `published` via the same RPC path
  `postComment`'s moderation already uses (reuse, don't duplicate,
  the status-transition code).
- New config constant `flag_hold_days` (default 30), colocated
  with the hold logic, not a DB-backed setting in this spec.

## Decisions made upfront (do not ask)

- Scope is the `flag` tier only. `block` never reads `ended_date`
  and never auto-resolves — agents.md §7 stays binary for named
  outcomes, full stop.
- `ended_date` backfill is NOT a one-time catalog-wide migration in
  this spec. Ship the field and the hold logic; backfilling
  existing seasons' `ended_date` is ordinary content work
  (`content-curator`), done opportunistically, not a blocking
  acceptance criterion.
- `allow` verdicts are unaffected — they already publish
  immediately and never enter the queue.
- This spec does NOT touch editorial content gating (season
  blurbs, canon rationale, themed-list entries) — only the
  comment-moderation `flag` queue. The candidate's framing
  ("safe even mid-season" vs. "safe once a season has aired a few
  episodes") raised the idea in an editorial-publishing context
  too; that's a separate, larger question (it would need
  per-episode air data this repo doesn't track, not just a
  season-level finale date) and is explicitly deferred — see Open
  questions.

## Acceptance

- **A1** `seasonFrontmatterSchema` accepts an optional
  `ended_date: isoDate`; a colocated schema test asserts a season
  without it still validates.
- **A2** A `flag`-verdict comment whose season has no `ended_date`
  (or one inside `flag_hold_days`) stays `pending` exactly as
  today — no behavior change for current content.
- **A3** A `flag`-verdict comment whose season's `ended_date` is
  more than `flag_hold_days` in the past is surfaced as resolvable
  and transitions to `published` without a mod click, the next
  time the queue path runs.
- **A4** A `block`-verdict comment never auto-resolves, regardless
  of `ended_date` — a colocated test asserts this explicitly (the
  P0 regression guard).
- **A5** `getModQueue()`'s existing pending/hidden/flagged
  ordering and 50-item cap are unchanged for everything this spec
  doesn't touch.
- **A6** Colocated tests cover: no `ended_date` (no change),
  `ended_date` inside window (no change), `ended_date` past window
  on a `flag` row (auto-resolves), `ended_date` past window on a
  `block` row (does not auto-resolve).

## Open questions

- Whether the same graduation should ever reach editorial content
  (season blurbs / canon / themed lists) rather than only the
  comment mod queue — deferred; it's a different, larger problem
  (needs per-episode air-progress data the catalog doesn't carry)
  and risks softening the "no spoilers" brand promise for the
  surfaces readers trust most. `/oversight` should weigh this
  explicitly before any follow-up spec touches content, not just
  comments.
- `flag_hold_days` default (30) is a starting guess, not evidenced
  by a support/moderation-volume signal — revisit once the mod
  queue has real flagged-volume data to tune against.

## Chunks

Measure: 6 open · 0 closed · next A7

- [ ] **49.1** `ended_date` season-frontmatter field · S · closes A1 · needs —
- [ ] **49.2** `flag_hold_days` config + `getModQueue()` hold-resolution (joins `ai_decisions.verdict`, resolves the target season's `ended_date` via `getSeason()`, flips expired `flag`-tier `pending` rows to `published`) · M · closes A2, A3, A4, A5, A6 · needs 49.1
