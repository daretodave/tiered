# Phase 31c — Canon + Community page rebuild, show-home chips

> Third and final sub-phase of the original phase 31. By the
> time 31c runs, the data layer (31a) and content drain (31b)
> are complete — every seeded season has a `canonical_position`,
> every show with seasons has a populated `canon.md`, every
> URL uses the slug form, and the strict-mode invariant is
> live. 31c is the UI rebuild that consumes that data and
> ships the wonderful state.
>
> See `plan/phases/phase_31_canon_rank_unification.md` for
> the original brief and the headline rule. 31a + 31b cover
> the schema, data, and content-curator updates this phase
> renders.

## Reference

- `design/tiered.tv · Survivor Canon.html` — binding
  reference. Body `data-view="canon"` vs `data-view="community"`
  flips between tabs; the title swaps; the section panes
  swap. Every section below maps to a labeled block in this
  file.
- `design/tiered.tv · Survivor.html` — show home. The SPLIT
  block's two buttons link to `Survivor Canon.html#canon`
  and `Survivor Canon.html#community` — both point to the
  same unified page, just different default tabs.
- `design/tiered.tv · Heroes vs. Villains.html` — the
  season-detail design (phase 30, shipped). Its info-card
  community-rank pill is the same shift-pill vocabulary 31c
  wires across canon entries.
- `design/CLAUDE.md` — visual law.

## What changes

### A. Show home page (`/shows/[show]`) — chip wiring + sort

1. **Drop the "By era" chip** from
   `src/components/composition/FilterBar.tsx`. The design's
   Survivor.html only carries Canon + Community. Update
   unit tests + e2e fixtures.
2. **Make chips functional.** Convert FilterBar to a client
   component (`'use client'`). The page renders both
   orderings inline (canon-ordered DOM is the SSR default
   for SEO); the chip click swaps the visible ordering via
   `data-active-filter` + a CSS toggle. URL state persists
   as `?view=canon|community`; `history.replaceState` on
   click; reading the URL on mount restores chip state.
3. **Sort math.**
   - Canon order — `canonical_position` ascending; ties
     break by season number. Every seeded season now has a
     position (31b guarantee), so the fallback path is dead
     code.
   - Community order — call `computeCommunityRank(show,
     seasons, canon)` and use the returned order. Today this
     mirrors canon; future live-vote phase will diverge it.
4. **Shift pills on `<SeasonCard>`.** When the active filter
   is `community`, populate `<SeasonCard>.shift` with `delta
   = canonRank - communityRank`, sentiment `up | down | hold`
   based on sign. Pill hides when active filter is `canon`
   or when both ranks match. Pill data comes from the canon
   entry's `community_rank_hint` until live votes wire in.

### B. Season detail page — vote question default

In `src/app/shows/[show]/season/[n]/page.tsx`
(wait — this is `[slug]/` after 31a):

```diff
- season.vote_question ?? 'Does this belong in the canon top 10?'
+ season.vote_question ?? 'Does this belong in the community top 10?'
```

Schema default flipped in 31a; existing content rewritten in
31b. This is the page-side fallback for any future season
that omits `vote_question`.

### C. Canon + Community unified page

Rebuild `/shows/[show]/canon` + `/shows/[show]/community` to
share a single page shell that flips between the canon view
and the community view based on the route + an in-page tab
control.

**Routes:**

- `/shows/[show]/canon` → SSR with `data-view="canon"`.
- `/shows/[show]/community` → SSR with `data-view="community"`.
- Tab clicks: client-side flip via `<body data-view>` mutation
  + `history.replaceState` to the sibling route. Both routes
  share the same React tree under
  `src/app/shows/[show]/(canon-pair)/` — a new route group
  hosting a single page component that reads which route it's
  on from a server prop and seeds the initial `data-view`.

**Page layout** (per `design/tiered.tv · Survivor Canon.html`):

1. **`.crumb`** — `Shows / {show.name} / The ranking`.
2. **`.head`** — split. Left: eyebrow + h1 + lede that swap
   between canon and community framings. Right: 3-row stats
   stack (Entries / Last revised (canon) or Last recompute
   (community) / Editor (canon) or Voters this week
   (community)). Values come from canon frontmatter +
   future vote pipeline.
3. **`.tabs`** — `Editor's Canon · curated` /
   `Community · live`. Tab click swaps route + view.
4. **Canon view body** — methodology row (three cells from
   canon `meth_*` fields), era toolbar (chips from
   `era_bands` or four-band default), four tier bands:
   - **Tier S** `.hero-entries` (ranks 1–5): big rank,
     title, season meta, italic `tag`, rationale, hero-aside
     with community mini-pill (`community_rank_hint`) + "Why
     this slot" (`slot_argument`).
   - **Tier A** `.mid-entries` (6–15): 2-col compact grid
     with tag + rationale.
   - **Tier B** `.compact-entries` (16–30): single-col dense
     rows.
   - **Tier C** `.tail-table` (31+): smallest density.
   - Tier banding derived from `canon.entries[].rank` — no
     authoring.
5. **Community view body** — live-strip (reads "votes
   pending · community rank mirrors the canon" while
   `computeCommunityRank.source === 'canon'`), movers grid
   (empty-state until vote history), weekly-question card
   (renders `canon.weekly_question`), full ranking table
   (`.cl-cols` + `.cl-rows`). When no votes exist, approval
   bar / % / 7d trend / vote count cells render with hidden
   modifiers — the table reads cleanly as a ranked list.

### D. Components

**New (under `src/components/canon/`):**

- `CanonPageShell.tsx` — server component owning route +
  initial view.
- `CanonTabSwitch.tsx` — client tab control; mutates
  `<body data-view>` + `history.replaceState`.
- `CanonHead.tsx` — eyebrow / h1 / lede dual-render.
- `CanonStats.tsx` — 3-row stats stack.
- `CanonMethodology.tsx` — three methodology cells.
- `CanonEraToolbar.tsx` — client; filters tier bands via
  CSS class on page root.
- `CanonTierBand.tsx` — generic tier shell.
- `CanonHeroEntries.tsx` — S band, ranks 1–5.
- `CanonMidEntries.tsx` — A band, 6–15.
- `CanonCompactEntries.tsx` — B band, 16–30.
- `CanonTailEntries.tsx` — C band, 31+.
- `CommunityLiveStrip.tsx`
- `CommunityMovers.tsx`
- `CommunityWeeklyQuestionCard.tsx`
- `CommunityRankList.tsx` — header columns + rows; cells
  hide gracefully when no vote data is present.

**Reused unchanged:** `<Bullet>`, `<ShieldBadge>`,
`<RankShiftPill>`.

**Deprecated, delete in this commit:** the current
`src/components/composition/CanonList.tsx` +
`CanonEntry.tsx`. The community page's current
`<SeasonGrid>`-based layout (replaced by
`<CommunityRankList>`).

### E. CSS

Port the binding rules verbatim from
`design/tiered.tv · Survivor Canon.html` into a new
`src/styles/canon.css`. Import in `src/app/globals.css`
**before** `search.css` (the current last import) so the
`@layer base` block stays the last thing parsed.

**Reminder — never write `*/` literal inside a CSS comment
body** (phase-29 postmortem `0a757ff`). Run after the port:
`grep -n "\*/.*[^/]" src/styles/canon.css` must return no
surprising hits inside `/* … */` blocks.

Drop the old `.canon-list / .canon-entry` selectors. Keep
the `.canon-page` page wrapper class.

### F. Wiring

1. `src/components/composition/FilterBar.tsx` — drop `era`,
   add client-side toggle + URL state.
2. `src/app/shows/[show]/page.tsx` — render both sorted
   orderings inline; FilterBar's `data-active-filter` drives
   visibility via CSS. Wire `<SeasonCard>.shift` on community
   ordering.
3. `src/app/shows/[show]/canon/page.tsx` +
   `src/app/shows/[show]/community/page.tsx` — both render
   `<CanonPageShell initialView={…} …/>`.
4. `src/app/shows/[show]/season/[slug]/page.tsx` — flip the
   vote-question fallback wording.
5. `src/components/composition/ShowSplit.tsx` — both buttons
   still point at `/canon` and `/community` respectively;
   no structural change. The pages they go to are the new
   unified shell.

## Tests

**Unit (vitest):**

- `FilterBar.test.tsx` — renders two chips (no era);
  clicking community flips `data-active-filter`; URL state
  syncs.
- `CanonPageShell.test.tsx` — initial view = canon when
  route is `/canon`; initial view = community when route is
  `/community`; tab switch mutates `data-view` + URL.
- `CanonHeroEntries.test.tsx` — five rows; missing optional
  fields collapse (tag absent → italic line hidden;
  slot_argument absent → mini-card hidden;
  community_rank_hint absent → pill hidden).
- `CanonMid/Compact/TailEntries.test.tsx` — basic render
  per tier band.
- `CommunityRankList.test.tsx` — header + rows; approval
  bar / % / trend / votes cells hide when no vote data.

**Playwright:**

- `apps/e2e/tests/show-home.spec.ts` — chip switch on
  `/shows/survivor` re-orders the season grid; URL
  updates to `?view=community`.
- New `apps/e2e/tests/canon-page.spec.ts` — `/shows/survivor/canon`
  renders methodology cells, four tier bands, top-5 hero
  entries with community mini-pills; mobile (375px) no
  horizontal scroll.
- New `apps/e2e/tests/community-page.spec.ts` —
  `/shows/survivor/community` renders the same shell with
  community view active; community-list shows every ranked
  season; vote-pending state renders cleanly.
- Tab toggle — clicking the Community tab on `/canon`
  lands on `/community` and the inverse.
- `/shows/amazing-race/canon` is no longer empty — renders
  the newly-authored canon (13 seeded seasons in defended
  order with rationale + methodology + tier bands).

## Acceptance

- `/shows/survivor` chip switch is functional; "By era" is
  gone; Canon is default; Community re-orders the grid with
  visible shift pills where canon and community ranks differ.
- `/shows/survivor/canon` renders the design 1:1 against
  `design/tiered.tv · Survivor Canon.html#canon` for desktop
  + mobile.
- `/shows/survivor/community` renders the same shell with
  community view active; full ranking list reads cleanly
  even with no live votes.
- `/shows/amazing-race/canon` is populated — 13-season
  ranking with rationales, methodology cells, tier blurbs.
  Same for the other 4 shows with seeded seasons +
  authored canons (the-challenge, dragrace, top-chef,
  survivor).
- Season detail page vote question default reads "community
  top 10".
- `pnpm verify` green.
- Build-plan check-mark: `[x] Phase 31c` with commit hash.
- Plain commit message, Cloud-Run trailer, no emoji, no
  Co-Authored-By.

## Out of scope

- **Live vote wiring.** Community page renders movers /
  approval bars / % / trend / vote counts only when data
  is present; until votes flow, the page reads "community
  rank mirrors the canon — votes pending". Future phase
  connects `votes` rows to the community-rank computation.
- **Backfilling canons for shows without seeded seasons.**
  Per always-working rule, they don't need one yet. Phase
  26 + future ship-content ticks will author them as seeds
  land.
- **A11y polish** beyond the existing phase-18 axe gate.
  Iteration findings can refine focus rings on tab switch
  etc. post-ship.
