# AUDIT

> Open audit findings. `/iterate` reads the Pending section
> and ships the highest-scoring item per tick. Score formula:
> `impact × ease / 10`, then apply the bias multiplier from
> the header (if present) for the matching category.
>
> Categories: `bug`, `perf`, `a11y`, `seo`, `content-gaps`,
> `data`, `docs`, `mod`, `spoiler`, `other`.

<!-- Bias mechanism — set via /oversight to direct iterate's focus.
     Format:
       > Bias: <category> (set 2026-MM-DD via oversight, valid for N ticks)
     Multiplies findings of <category> by 1.5x for ranking. -->

## Pending

<!-- Format:
- [ ] [SEV] <one-line description> (category: <c>, source: <jot|critique|triage|expand|self>, score: N.N) — <commit hash where filed>
-->

- [ ] [MED] Survivor missing seasons 48 & 49 — write season blurbs + canon placement, bump `seasons` 47→49 (#65) (category: content-gaps, source: triage, score: 4.8) — filed this commit

## Done

<!-- Same format with [x] and the commit-hash that addressed it -->

- [x] [HIGH] season-page vote UX leaks Bayesian-prior internals — optimistic update shows `0.2`/`-0.55` blips before settling, "0.2 votes" on first visit, no voted/unvoting affordance, no graceful load-in, negative-direction phrasing is confusing (#64) (category: bug, source: triage, score: 3.2) — RESOLVED this commit: root cause was VotePair displaying the weighted aggregate `SUM(value*weight)` (a fractional ranking signal) as "net votes". Migration `20260518000001_vote_raw_count.sql` adds `raw_count = SUM(value)` to `cast_vote`/`read_vote`; the `/api/vote` route now sends the clean integer net to the client (weighted value stays internal). VotePair gains `aria-pressed` + persistent `.voted` tint + "click to undo" labels (clear voted/unvoting state), and a `data-hydrated` opacity fade so the number doesn't pop `0 → <X>`. Optimistic ±1 now reconciles exactly against the integer server delta — no more blips. Unit + e2e green. GitHub #64 closed by this commit.
- [x] [MED] season-page comment thread renders empty state — read path not wired to Supabase (#24) (category: bug, source: triage, score: 4.2) — RESOLVED by Phase 36 (e95b019): server-side comment read path (`src/lib/comments/thread.ts` + `CommentThreadLive`) wired into `src/app/shows/[show]/season/[slug]/page.tsx`; published rows visible to all, the author's own `pending` row pinned as "held for review", `hidden`/`removed` never public (spoiler/mod P0 intact). e2e `apps/e2e/tests/comment-read.spec.ts` covers authed-sees-own-held + anon-sees-empty. GitHub #24 closed by this commit.
- [x] [HIGH] auth-chrome gap — Header resolves auth server-side but `/` is SSG so it rendered permanently signed-out (#54) (category: bug, source: triage, score: 5.4) — RESOLVED by Phase 36 (e95b019): auth-state island hydrates from `GET /api/auth/me` so chrome reflects sign-in on every route incl. SSG `/`. `authed-example.spec.ts:30` un-fixme'd in the same commit (now a real signed-in-header assertion). GitHub #54 already closed.
- [x] [HIGH] sign-out broken — `/auth/logout?returnTo=/` sent a relative `returnTo`; Auth0 forwards it verbatim as `post_logout_redirect_uri=%2F` and always rejects a non-absolute URL. Fixed: `HeaderView` builds the logout href from `canonicalUrl('/')` (→ `https://tiered.tv/`), URL-encoded, with a unit test asserting `returnTo` decodes to an absolute https URL. Full resolution still needs the absolute URL added to Auth0 → Allowed Logout URLs (dashboard task noted on #56); the code fix is correct and shippable alone. (#56) (category: bug, source: triage, score: 5.6) — this commit
- [x] [HIGH] show-home season grid sorts by season number, not canon rank (category: bug, source: user-jot, score: 5.6) — STALE: resolved by phase 33a (3ac0b42). The standalone `/shows/[show]` season grid and its `page.tsx:72` `[...seasons].sort((a,b)=>a.number-b.number)` no longer exist; the page was rebuilt canon-first around `<ShowRanking>`, which renders `canon.entries` (ranked by `canonical_position`) and `community.entries`. The raw `seasons` array is now only a season-number→slug lookup map, never the displayed order. No code change needed; closing for AUDIT accuracy.

- [x] [HIGH] header "sign in" link still shows "sign in" after auth — render user name + log-out when session is present (#31) (category: bug, source: triage, score: 5.6) — 0685538
- [x] [HIGH] show page "on the air" reads "2000–2023" for airing shows — render "<min>–present" when status=airing (#26) (category: bug, source: triage, score: 4.8) — 12f953a
- [x] [HIGH] /api/vote returns rpc_failed — `public.cast_vote` missing in Supabase schema cache (#23) (category: data, source: triage, score: 5.4) — applied all 14 phase 11–13 migrations to prod Supabase + reloaded schema cache; live API returns `{ok:true}`. See `supabase/OPS_LOG.md`.
- [x] [MED] launch-quota gap — content/shows/love-island-us.md missing (Rule 1) (category: content-gaps, source: self, score: 4.2) — phase-22
- [x] [MED] launch-quota gap — content/shows/love-island-uk.md missing (Rule 1) (category: content-gaps, source: self, score: 4.2) — phase-22
- [x] [MED] launch-quota gap — content/shows/bake-off.md missing (Rule 1) (category: content-gaps, source: self, score: 4.2) — phase-22
- [x] [MED] launch-quota gap — content/shows/project-runway.md missing (Rule 1) (category: content-gaps, source: self, score: 4.2) — phase-22
- [x] [MED] launch-quota gap — content/shows/the-challenge.md missing (Rule 1) (category: content-gaps, source: self, score: 4.2) — phase-22
- [x] [MED] launch-quota gap — content/shows/bachelor.md missing (Rule 1) (category: content-gaps, source: self, score: 4.2) — phase-21
- [x] [MED] launch-quota gap — content/shows/bachelorette.md missing (Rule 1) (category: content-gaps, source: self, score: 4.2) — phase-21
- [x] [MED] launch-quota gap — content/shows/traitors.md missing (Rule 1) (category: content-gaps, source: self, score: 4.2) — phase-21
