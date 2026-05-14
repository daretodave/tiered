# Phase 29 — Inline search overlay; retire /search

> **Goal.** Replace the standalone `/search` page with the
> command-K modal overlay shown in
> `design/tiered.tv · Home.html` (the `<div class="search-overlay">`
> block + the script powering it). The search button in the
> header opens the overlay on every page; the `/search` route
> goes away.
>
> **Why now.** Two reasons. First, the new home design
> implies the search affordance is the overlay — keeping a
> separate page would be visual drift. Second, the overlay is
> faster (no navigation), supports keyboard nav natively, and
> filters results without a round-trip.

## Reference

- `design/tiered.tv · Home.html` lines ~317 to ~445 (the
  `.search-overlay` CSS + the JS at the bottom of the file).
- The existing `src/lib/search.ts` — the matching/scoring engine
  stays. Only the surface changes.

## What changes

1. **New `SearchOverlay` client component** — a portal-mounted
   modal with:
   - Header: ⌕ icon + serif-styled search input + esc-pill close.
   - Filter chips: All / Shows / Seasons / Lists / Tiers.
   - Results region: grouped by type, with keyboard nav
     (↑/↓ move, Enter activates focused row, esc closes).
   - Footer: keyboard hints + the brand promise.
2. **Header integration** — `src/components/chrome/HeaderView.tsx`
   replaces the `<Link href="/search">` with a `<button>` that
   dispatches an overlay-open event. The kbd-hint `⌘K` shows
   on desktop (hidden via `@media (max-width:720px)`).
3. **Global mount** — `SearchOverlay` mounts once in the
   `(default)` layout (or root layout — whichever sees both
   /shows tinted chrome AND default chrome) so it works on
   every page including show-tinted routes.
4. **Cmd+K / Ctrl+K** binding mounted at document level —
   only when the overlay is closed and focus isn't already
   in an input.
5. **Retire `/search`** — delete `src/app/(default)/search/`
   route. Replace with a permanent redirect to `/` in
   `src/middleware.ts` so external links still land
   somewhere sensible. Remove the page from
   `apps/e2e/src/fixtures/canonical-urls.ts` +
   `page-reads.ts`.
6. **Search results in overlay** — same `search()` function
   from `src/lib/search.ts` powers the matches. Optionally
   add "tier" as a filterable type (matching the design's
   5 chip filters) by surfacing tier-letter pseudo-results
   that link to `/shows?tier=S` (or whatever the /shows page
   surface ends up being after phase 28).

## Components to add

- `src/components/search/SearchOverlay.tsx` — the modal,
  state-managed via React (open/closed, current filter,
  current query, focused row index).
- `src/components/search/SearchTrigger.tsx` — the button that
  goes in the header. Dispatches a custom event or uses a
  context to open the overlay.
- `src/components/search/SearchProvider.tsx` (optional) — if
  going the context route, this wraps the layout and exposes
  `useSearchOverlay()`.

The existing `SearchForm` + `SearchResults` components can be
deleted when `/search` goes away; they're not reused.

## CSS port

Copy the overlay + modal + chips + row + footer selectors
from `design/tiered.tv · Home.html` into
`src/styles/search.css` (new file). Class names match the
design (`.search-overlay`, `.search-modal`, `.search-head`,
`.search-input`, `.search-chip`, `.search-results`,
`.search-row`, `.search-foot`). The kbd badge style for the
header trigger goes in `src/styles/chrome.css`.

## Accessibility

- `<dialog>` element or role="dialog" + aria-modal="true" with
  focus trap. Focus moves to the input on open; focus restores
  to the trigger on close.
- Esc closes. Tab cycles within the modal.
- Results are role="listbox" + `aria-activedescendant`.
- Reduced motion: replace the transform + opacity transition
  with a plain opacity fade (already a project-wide convention).

## Tests

- `apps/e2e/tests/search.spec.ts` — full overlay journey:
  - Trigger button is reachable in the header.
  - Cmd+K opens the overlay.
  - Typing "survivor" surfaces the show + at least one season.
  - Filter chips constrain results.
  - Enter on a focused row navigates.
  - Esc closes and returns focus.
- Drop the existing `/search` e2e — replace with a redirect
  spec asserting `/search` returns 308 to `/`.
- Unit tests for `SearchOverlay`: open/close, filter
  selection, keyboard nav (jsdom).

## Acceptance

- The header search trigger opens the overlay on every page
  including tinted show pages.
- Cmd+K opens / closes the overlay globally.
- `/search` returns a 308 to `/`.
- `pnpm verify` green.
- Build plan check-mark: `[x] Phase 29` with commit hash.
