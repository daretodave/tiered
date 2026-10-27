# CRITIQUE

> Last pass: 2026-10-27 at commit 72f85b9b
> Pass count: 193
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> Pass 193 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`. URL set: `/`,
> `/shows/rhoc/season/the-homecoming`, `/shows/rhoc`, `/themes`,
> `/themes/the-vote-left-the-phone-line` anon; `/`,
> `/shows/rhoc/season/the-homecoming`, `/u/e2e`, `/shows/rhoc`,
> `/themes/the-vote-left-the-phone-line` authed — rotated onto RHOC's
> freshly-filed Season 20 ("The Homecoming," filed earlier the same
> day's weekly-sweep tick), its show page, and a themed list extended
> earlier today, distinct from pass 192's Below Deck Down Under
> rotation except the stable `/u/e2e` anchor. Both passes came back
> mechanically clean (0 console errors, 0 failed requests, 0
> horizontal overflow on either viewport, title/description/canonical/
> OG present on every capture); authed pass confirmed real auth (`@e2e`
> chrome on every page). Strongest finding: the season page's eyebrow
> states Vicki Gunvalson returns "after 13 seasons away" while the body
> states she returns "for the first time since season thirteen" (twice)
> — two different numbers for the same gap, a self-contradiction the
> reader can't reconcile in their head, the same defect class as the
> already-resolved rhony "eight seasons" vs "eight years" HIGH finding
> — filed HIGH. Two more filed: the season page restates its headline
> facts (Vicki's return, Carmella Garcia joining, Katie Ginella's exit,
> mixed reception) near-verbatim across the eyebrow/lede/shape/take
> sections, including an identical "Billed as..." opening clause twice
> — MED; and the show page's canon.md Season 1/2 rationale
> (`slot_argument`) re-derives the same "format gains operational
> fluency" observation the body prose directly above it already states
> — MED, the same canon-rationale-restatement class already fixed
> elsewhere (below-deck/phuket, project-runway/new-york-2026,
> love-is-blind/boston). One more filed: the season page's HOST stat
> caption bare-restates the tile's own value before adding new
> information ("Andy Cohen" / "Andy Cohen hosts the reunion") — LOW,
> the same stat-tile-caption class already fixed across traitors/
> dancing-with-the-stars/big-brother/below-deck-down-under, now a fresh
> instance on a show not previously swept. Filed 4 new findings (1
> high, 2 med, 1 low). No pending HIGH findings remained open ahead of
> this pass.
> Prior pass-192 summary follows. Pass 192 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`. URL set: `/`,
> `/shows/below-deck-down-under/season/canouan`,
> `/shows/below-deck-down-under`, `/themes/new-network-same-rulebook`,
> `/themes` anon; `/`, `/shows/below-deck-down-under/season/canouan`,
> `/u/e2e`, `/shows/below-deck-down-under`,
> `/themes/new-network-same-rulebook` authed — rotated onto Below Deck
> Down Under's Season 4 (Canouan) and a freshly-picked, never-before-
> critiqued themed list, distinct from pass 191's Bachelor in Paradise/
> Ink Master rotation except the stable `/u/e2e` anchor. Both passes
> came back mechanically clean (0 console errors, 0 failed requests, 0
> horizontal overflow on either viewport, single `<h1>` per page,
> title/description/canonical/OG present on every capture); authed
> pass confirmed real auth (`@e2e` chrome on every page, the signed-in
> profile shell at `/u/e2e`). Strongest finding, independently
> surfaced by both passes: the Canouan season page restates the same
> two headline facts (the Caribbean move anchoring Katina off Canouan;
> the veteran-crew + franchise-first charter-crossover pairing)
> near-verbatim four times across the meta description, hero lede,
> "the take" capsule, and the body's section-02 opener — the same
> restatement defect class already fixed for Below Deck Phuket and
> Bachelor in Paradise Costa Rica, now a fresh instance on a different
> show — filed as one HIGH row. Two more filed: the Season 4 canon
> rationale is restated within its own season page and then
> copy-pasted verbatim onto the show page's canon card — MED; and the
> "How I weigh it" panel drops the host's surname where every other
> mention on the page uses the full name — LOW. Two existing Pending
> rows were reinforced rather than duplicated: the stat-tile
> value/caption bare-restatement row (now a fourth occurrence, and the
> first to span HOST/FORMAT/PREMIERED rather than HOST alone — bumped
> MED → HIGH) and the authed "Save (this device)" row (now confirmed
> on a second, unrelated themed list — bumped LOW → MED). Filed 3 new
> findings (1 high, 1 med, 1 low) plus 2 severity bumps on existing
> rows. No pending HIGH findings remained open ahead of this pass.
> Prior pass-191 summary follows. Pass 191 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`. URL set: `/`,
> `/shows/bachelor-in-paradise/season/costa-rica`,
> `/shows/bachelor-in-paradise`,
> `/themes/the-team-rule-never-makes-it-to-a-second-season`, `/themes`
> anon; `/`, `/shows/bachelor-in-paradise/season/costa-rica`, `/u/e2e`,
> `/shows/bachelor-in-paradise`,
> `/themes/the-team-rule-never-makes-it-to-a-second-season` authed —
> rotated onto Bachelor in Paradise's freshly-authored Costa Rica
> season (Season 10), its show page, and a freshly-authored Ink Master
> themed list, distinct from pass 190's Below Deck rotation entirely
> except the stable `/u/e2e` anchor. Both passes came back mechanically
> clean (0 console errors, 0 failed requests, 0 horizontal overflow on
> either viewport, title/description/canonical/OG present on every
> capture); authed pass confirmed real auth (`@e2e` chrome on every
> page, Costa Rica's vote block in its personalized not-yet-voted
> state, the Ink Master list's signed-in save affordance rendering
> correctly). Strongest finding, independently surfaced by both passes:
> the Costa Rica season page restates the same handful of facts
> (Costa Rica relocation ending the Sayulita run, Golden Bachelor/ette
> cast expansion, Hannah Brown joining Wells Adams, the new rose-vote
> mechanic) verbatim or near-verbatim across the lede, the body, and
> three of the four standard editorial sections — the same
> restatement defect class already fixed for Below Deck Phuket (pass
> 188, 80a52e1c) and Bachelor Grant Ellis (pass 189), now a fresh
> instance on a different season — merged into one HIGH row. Two more
> filed: the season's FILMED stat caption duplicates its own stat
> value (`Costa Rica` / `Costa Rica · first BiP season filmed outside
> Mexico`), the same caption-restates-the-field class tracked
> elsewhere (pass 87, Jersey Shore pass 152) now recurring here — LOW;
> and the `/themes` pillar index has no dedicated `opengraph-image`
> route and falls back to the generic homepage OG card, unlike every
> `/themes/[theme]` detail page which has its own — LOW. Filed 3 new
> findings (1 high, 0 med, 2 low). No pending HIGH findings remained
> open ahead of this pass.
> Prior pass-190 summary follows. Pass 190 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`. URL set: `/`,
> `/shows/below-deck/season/phuket`, `/themes`, `/shows/below-deck`,
> `/themes/who-actually-got-the-vote` anon; `/`,
> `/shows/below-deck/season/phuket`, `/u/e2e`, `/shows/below-deck`,
> `/themes/who-actually-got-the-vote` authed — rotated onto the Phuket
> season page specifically to check whether the pass-188 HIGH-fix
> (80a52e1c, which rewrote its canon-slot rationale to compare against
> the BVI/Antigua neighbors) reads clean, the Below Deck show/canon page
> itself, the `/themes` pillar index, and a fresh themed list, distinct
> from pass 189's rotation entirely except the stable `/u/e2e` anchor.
> Both passes came back mechanically clean (0 console errors, 0 failed
> requests, 0 horizontal overflow on either viewport, title/description/
> canonical/og:image present on every capture); authed pass confirmed
> real auth (`@e2e` chrome on every page, Phuket's vote block in its
> personalized "you haven't voted yet" state, `/u/e2e` rendering real
> profile data). Strongest finding: the pass-188 fix correctly removed
> Phuket's restatement defect but the replacement comparison paragraph
> is a single dense, multi-clause sentence that also assumes the reader
> has already visited the Antigua season page — filed as MED (new
> defect, introduced by the prior fix, not previously tracked). Two
> more filed: `/themes`' four-word status-badge vocabulary (`stable
> list` / `growing` / `started <year>` / `updated <recency>` —
> `ThemeStatus` in `src/lib/themes-format.ts`) has no on-page legend
> distinguishing the states, a different gap than the already-resolved
> community-trend `◆ HOLD` legend fix (pass 140); and Below Deck's own
> canon page `WHY THIS SLOT` boxes for ranks #01/#02 open with an
> identical sentence template back-to-back, the same defect class
> already tracked for themed lists now recurring on a show canon page.
> Both filed LOW. One candidate dropped at self-assessment: Phuket's
> "Also appears in" section initially read as self-referential
> (re-displaying its own Editor's Canon rank), but re-verification
> against the resolved #511 `hasCrossRef` logic confirmed it also
> carries a genuine themed-list cross-reference (`the-charter-map-as-
> the-whole-story`) — working as intended, not a defect. Filed 3 new
> findings (0 high, 1 med, 2 low). No pending HIGH findings remained
> open ahead of this pass.
> Prior pass-189 summary follows. Pass 189 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`. URL set: `/`,
> `/shows/bachelor/season/grant-ellis`, `/shows/love-is-blind/season/boston`,
> `/themes/best-comeback-seasons`, `/shows` anon; `/`,
> `/shows/bachelor/season/grant-ellis`, `/shows/love-is-blind/season/boston`,
> `/u/e2e`, `/themes/best-comeback-seasons` authed — rotated onto the
> just-patched Bachelor Grant Ellis page (checking whether commit
> fa5bb4ef's restatement fix actually landed clean), a fresh Love Is
> Blind Boston season backfill, and a recently-shipped themed list,
> distinct from pass 188's rotation except for `/shows`. Both passes
> came back mechanically clean (0 console errors, 0 failed requests, 0
> horizontal overflow on either viewport, H1/canonical/OG present on
> every capture); authed pass confirmed real auth (`authenticated:cloud`
> chrome visible on every page; `/u/e2e` rendered "Member since May
> 2026" / "No votes yet"). The anon and authed passes independently
> converged on the same strongest finding: the fa5bb4ef fix narrowed
> Grant Ellis's restatement defect to five sole-owner fields as
> intended, but missed a sixth site entirely — `canon.md`'s rationale
> paragraph, a separate file the fix's scope never mentioned, still
> restates the identical casting-precedent facts — merged into one HIGH
> row rather than filed twice. A second, independent instance of the
> same canon.md-re-derives-season-body-facts defect class surfaced on
> Love Is Blind Boston (filed as its own MED row — no existing pending
> row covered that page). One candidate (homepage "REST OF THE INDEX"
> repeated genre-tag text reading noisy once linearized to flat text)
> was dropped at self-assessment — the reader's own evidence couldn't
> confirm whether the rendered grid visually mitigates the repetition,
> and an unconfirmed layout concern isn't actionable as written. Filed 4
> new findings (1 high, 2 med, 1 low). No pending HIGH findings remained
> open ahead of this pass.
> Prior pass-188 summary follows. Pass 188 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`. URL set: `/`,
> `/shows/below-deck/season/phuket`, `/shows`,
> `/themes/thirteen-was-the-promise-not-the-rule`, `/themes` anon; `/`,
> `/shows/below-deck/season/phuket`, `/u/e2e`, `/shows`,
> `/themes/thirteen-was-the-promise-not-the-rule` authed — rotated onto
> the freshly-filed Below Deck Phuket season page (premiered
> 2026-10-12) and a previously-unvisited themed list, both distinct
> from pass 187's rotation. Both passes came back mechanically clean
> (0 console errors, 0 failed requests, 0 horizontal overflow on
> either viewport, H1/canonical/OG present on every capture); authed
> pass confirmed real auth (`authenticated:e2e` chrome visible on
> every page). The anon and authed passes independently converged on
> the same strongest finding — a page-wide fact-restatement defect on
> the Below Deck Phuket page, the same defect class just reaching this
> brand-new season — merged into one HIGH row rather than filed
> twice. Three candidate findings were dropped at self-assessment, all
> matching previously-litigated false positives found in `plan/CRITIQUE.md`
> history: `/u/e2e`'s apparent missing "Sign out" control (checked
> against `src/components/chrome/HeaderView.tsx` — Sign out exists
> inside the accessible `role="menu"` account-disclosure, just not
> visible in the walk script's flat extracted text; same false
> positive already closed once before), the `/themes/[theme]` "SAVE
> (THIS DEVICE)" label reading oddly when signed in (deliberate,
> litigated and closed across three prior passes — #272, #377, #385 —
> the device-scope qualifier is intentional honesty, not a
> regression), and `/u/e2e` lacking an account-settings link (the
> pass-45/48 header-menu fix deliberately kept the disclosure to two
> entries — "Your record" + "Sign out" — with no settings-page link,
> since `/settings` is a future-phase route the chrome shouldn't
> promise yet). Filed 2 new findings (1 high, 1 med, 0 low). No
> pending HIGH findings remained open ahead of this pass.
> Prior pass-187 summary follows. Pass 187 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`. URL set: `/`,
> `/shows/bachelor/season/grant-ellis`, `/shows`,
> `/themes/every-season-strikes-a-different-bargain-with-lana`, `/themes`
> anon; `/`, `/shows/bachelor/season/grant-ellis`, `/u/e2e`, `/shows`,
> `/themes/every-season-strikes-a-different-bargain-with-lana` authed —
> rotated onto a previously-unvisited season page (Bachelor S29, "Grant
> Ellis") plus a previously-unvisited themed list (Too Hot to Handle's
> "every season strikes a different bargain with Lana"), both distinct
> from pass 186's rotation. Both passes came back mechanically clean (0
> console errors, 0 failed requests, 0 horizontal overflow on either
> viewport, H1/canonical/OG present on every capture); authed pass
> confirmed real auth (`authenticated:cloud`, `@e2e` chrome visible on
> every page). The anon and authed passes independently converged on
> the same strongest finding — a page-wide fact-restatement defect on
> the Bachelor Grant Ellis page — which was merged into one HIGH row
> rather than filed twice. Of the remaining candidates, one (zero-vote
> community block reading as abandoned) was recognized as a second
> instance of the already-pending pass-170 Top Chef Carolinas finding
> and merged into that row (bumped LOW → MED) rather than filed as a
> new row. Filed 4 new findings (1 high, 0 med, 3 low) plus one
> severity bump on an existing row. No pending HIGH findings remained
> open ahead of this pass.
> Prior pass-186 summary follows. Pass 186 ran in the cloud loop via
> Path A2 (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed), both anon and authed passes
> with a freshly-minted `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`.
> URL set: `/`, `/shows/top-chef/season/carolinas`, `/shows`,
> `/themes/built-for-one-playing-as-a-team`, `/themes` anon; `/`,
> `/shows/top-chef/season/carolinas`, `/u/e2e`, `/shows`,
> `/themes/built-for-one-playing-as-a-team` authed — rotated onto a
> previously-unvisited themed list plus a canonical-detail page distinct
> from pass 185's rotation. Both passes came back mechanically clean
> (0 console errors, 0 failed requests, 0 horizontal overflow on either
> viewport, H1/canonical/OG present on every capture); authed pass
> confirmed real auth (`@e2e` chrome, signed-in-no-vote state on Top
> Chef Carolinas, real (empty) `/u/e2e` member record, no sign-in wall,
> SSR already emits signed-in chrome — no flash-of-signed-out). Of 4
> anon-pass candidates, 3 were dropped on self-assessment: one (Top
> Chef Carolinas host-tenure/LCK-rule restatement) duplicates the
> already-pending pass-160 row on the same page; one (rank-scale
> "canon peak"/"the tail" labels) misreads `RankScale.tsx` — those are
> static descriptive endpoint labels, not unlabeled interactive
> elements, and the track already carries a full `aria-label` summary
> per the pass-43/74/148 accessibility fixes; one (a quoted canon
> "closing verdict" line) could not be re-verified — the exact string
> does not appear anywhere in `content/shows/top-chef/canon.md` or the
> rendered page source. 1 new finding filed (0 high, 1 med, 0 low):
> a themed-list sentence-template echo on `built-for-one-playing-as-
> a-team`, below. Pass 185's own filed finding remains open — see next
> entry: Big Brother Time Trip's `pull` field claims "27 years of
> history" for a show with `est_year: 2000` airing in 2026 — only 26
> years have elapsed, confirmed against the derived-tenure convention
> (`src/lib/show-tenure.ts`) that renders Survivor's identical
> est_year/current-year span as "twenty-six years in." Two candidates
> were dropped at self-assessment: a HOST/FILMED/EPISODES caption-echo
> read on the same page turned out to be entirely covered ground — the
> EPISODES half is an intentional non-bug per
> `isEpisodesCaptionBareRestatement()`, and the HOST half reconfirms
> the already-open, already-MED pass-183/184 HOST-caption row verbatim
> (same file named there), so nothing new to file or bump; and the
> authed pass's own discovery that `scripts/critique-walk.mjs` still
> caps body-text capture at 4000 chars (blocking verification of the
> comment-composer focus ask on content-heavy pages) is the same
> tooling-not-product-defect call an earlier pass already made on this
> exact cap — not re-filed, flagging again here in case a future pass
> wants to finally raise it. No pending HIGH findings remained open
> ahead of this pass (the two `### [HIGH]` rows still physically under
> `## Pending` — same-crown-new-price-tag featured_pull and rhony
> eight-years — each already carry their own resolved note).
> Prior pass-184 summary follows. Pass 184 ran in the cloud loop via
> Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`. URL set: `/`,
> `/shows/big-brother/season/time-trip`, `/shows`,
> `/themes/someone-else-held-the-chair-for-a-while`, `/themes` anon;
> `/`, `/shows/big-brother/season/time-trip`, `/u/e2e`, `/shows`,
> `/themes/running-long-running-short` authed — rotated onto the
> freshly-filed Big Brother Time Trip season page and the two newest
> Rule 3 themed-list extends plus both pillar indexes. Both passes came
> back mechanically clean (0 console errors, 0 failed requests, 0
> horizontal overflow on either viewport, H1/canonical/dedicated-OG
> present on every capture); authed pass independently confirmed real
> auth (`@e2e` chrome, live unvoted vote-pair state, live comment
> composer, no "sign in to comment" fallback). Spoiler discipline held
> on both fresh pages — format/mechanic/casting facts only, no outcome
> leakage. 2 new findings filed (1 high, 0 med, 1 low): a stale
> `featured_pull` ("Ten seasons") on `same-crown-new-price-tag` that
> never updated as the list grew to 18 entries, and a repeated "A
> judge's seat [gets/goes to] ... instead of ..." sentence template on
> adjacent ranks #2/#3 of `someone-else-held-the-chair-for-a-while`.
> Two more candidate findings were dropped as false positives after
> re-verification against the actual codebase: an EPISODES-caption
> "Forty-one episodes" read flagged as a bare-restatement, but
> `isEpisodesCaptionBareRestatement()` (`scripts/content-check.ts:2297`)
> deliberately treats spelled-out counts as a distinct stylistic choice,
> not a restatement, by design; and a home-hero "Sign in to count at
> full weight" sighting on the authed pass turned out to be a curl/SSR
> artifact (the sentence is suppressed client-side post-hydration once
> `/api/auth/me` resolves `signedIn: true`, per the pass-64/76 fix and
> its dedicated test) rather than a real signed-in-reader regression. A
> third candidate (`/themes/running-long-running-short`'s "Save (this
> device)" label for a signed-in reader) reconfirmed the already-open
> pass-175 row verbatim — not re-filed. Two existing Pending rows were
> reinforced rather than duplicated: the pass-183 HOST-caption
> bare-restatement row gained a third occurrence
> (`big-brother/seasons/28-time-trip.md`) and bumped LOW → MED; the
> pass-178 big-brother single-fact-owner-drift row gained a
> confirmation note that the "built to look backward" construction
> recurs a third time on the same page, independent of the originally
> flagged "1,000th episode" fact. No pending HIGH findings remained
> open ahead of this pass (the sole HIGH row, pass-177 RHONY
> eight-years, already carries its own 2026-10-01 resolved note).
> Prior pass-183 summary follows. Pass 183 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`. URL set: `/`,
> `/shows/traitors/season/new-blood`,
> `/shows/dancing-with-the-stars/season/fall-2026`,
> `/themes/season-one-doesnt-own-every-first`, `/shows` anon; `/`,
> `/shows/traitors/season/new-blood`,
> `/shows/dancing-with-the-stars/season/fall-2026`, `/u/e2e`, `/shows`
> authed — rotated onto the two freshly-backfilled season pages (Traitors
> S5 "New Blood," DWTS S35 "Fall 2026") plus a recently-extended themed
> list and the `/shows` tier-pillar page. Both passes came back
> mechanically clean (0 console errors, 0 failed requests, 0 horizontal
> overflow on either viewport, H1/canonical/OG present on every capture);
> authed pass independently verified via raw SSR `curl` that the session
> cookie produces real auth (sign-in link replaced with `/u/e2e`, live
> vote-pair buttons reflecting actual unvoted state, comment composer
> attribution, spoiler-safe empty-vote profile) and reconfirmed the
> pass-134/u-handle opengraph-image fix still holds (200 image/png on
> all 4 relevant routes). Spoiler discipline held — zero outcome/
> winner/elimination leakage on either fresh season page. 1 new finding
> filed (0 high, 0 med, 1 low): a HOST-caption bare-restatement on both
> fresh season pages, the same shape as the already-resolved dragrace
> fix, recurring because that fix was content-level rather than a
> `content-check` invariant. The still-open pass-174 MED (single-fact-
> owner drift on these same two pages) was reconfirmed present and
> found broader than first scoped (two more facts per page also drift)
> — appended as a confirmation note to the existing row rather than
> re-filed, since the existing suggested fix already covers it. No
> pending HIGH findings remained open ahead of this pass.
> Prior pass-182 summary follows. Pass 182 ran in the cloud loop via
> Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`. URL set: `/`,
> `/themes/the-other-side-of-the-table`,
> `/shows/big-brother/season/time-trip`,
> `/shows/survivor/season/survivor-50`, `/themes` anon; `/`, `/u/e2e`,
> `/sign-in`, `/themes/the-other-side-of-the-table`,
> `/shows/survivor/season/survivor-50` authed — rotated onto the
> freshly-shipped `the-other-side-of-the-table` themed list (American
> Idol S23 extend, prior tick) and the brand-new Survivor 50 season page,
> plus a re-check of the still-open pass-178 Big Brother Time Trip
> finding. Both passes came back mechanically clean (0 console errors,
> 0 failed requests, 0 horizontal overflow on either viewport, H1/
> canonical/OG present on every capture); `/sign-in` confirmed via raw
> `curl` with the session cookie to issue a genuine server-side 307 to
> `/` for an already-authed session; vote-pair pre-vote state
> (`aria-live="polite"`, `data-vote-head-state="signed-in-no-vote"`) and
> comment-composer attribution rendered correctly on Survivor 50.
> Spoiler discipline held on every page — Big Brother Time Trip and
> Survivor 50 both stayed at format/mechanics/milestone level, zero
> winner/eviction/outcome leakage. The pass-178 MED ("1,000th episode"
> restated 5x on Big Brother Time Trip) was reconfirmed still present
> and intentionally NOT re-filed (already open, correctly tracked). 2
> new findings filed (0 high, 1 med, 1 low), both independently surfaced
> by both the anon and authed sub-passes: a genuine content defect on
> `the-other-side-of-the-table` — the list's `rank` field skips 4
> entirely (1, 2, 3, 5, 6, ... 15), so the page's own "The 14, in order"
> promise is visibly broken by a numbering gap between #03 and #05 even
> though the entry count is correct; and `/themes` reusing the exact
> same sitewide OG image as the homepage rather than a dedicated one,
> unlike every nested list page. No pending HIGH findings remained open
> ahead of this pass; the site continues to read clean on the P0
> spoiler check.
> Prior pass-181 summary follows. Pass 181 ran in the cloud loop via
> Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`. URL set: `/`,
> `/shows/dragrace/season/season-18`, `/shows/90-day-fiance/season/season-12`,
> `/shows`, `/search` anon; `/`, `/u/e2e`, `/sign-in`,
> `/shows/dragrace/season/season-18`, `/shows/90-day-fiance/season/season-12`
> authed — rotated onto two pages with content-only critique-redirect fixes
> that landed in the prior two ticks (dragrace `host_caption` re-voice,
> 90-day-fiance Season 12 canon.md/`shape_h2` rewrite) to confirm those fixes
> read cleanly, plus `/search` and `/shows` as fresh pillar/signature-feature
> coverage. Both fixes verified clean, no new drift. 2 new findings filed
> (0 high, 1 med, 1 low): `/shows`' OG-image wiring gap (severity raised
> LOW→MED from the pass-158 row — root cause corrected: the per-route
> `opengraph-image.tsx` already exists and renders, it's just never
> referenced from `generateMetadata()`, not "no route exists" as originally
> filed) and a fresh `seasonDisplayTitle()` branch gap (`Season N (YYYY)`
> shape triple-restates the season number/year in 25 season files across
> 4 shows — a known, deliberately-scoped-out gap from the pass-68 fix
> reaching its moment, not a regression). No pending HIGH findings remained
> open ahead of this pass. Mechanically clean on both passes (0 console
> errors, 0 failed requests, 0 horizontal overflow on either viewport,
> H1/canonical/OG present on every capture except the one OG finding
> above); `/sign-in` confirmed a genuine server-side redirect for an
> already-authed session; auth chrome (`@e2e` account menu, vote-pair
> pre-vote state, comment composer attribution) all rendered correctly.
> Spoiler discipline held — no outcome/winner/elimination leakage on
> either season page. Prior pass-180 summary follows. Both passes came
> back mechanically clean (0 console errors, 0 failed requests, 0
> horizontal overflow on either viewport, H1/canonical/OG present on
> every capture); `/sign-in` confirmed a genuine server-side redirect
> for an already-authed session; auth chrome (`@e2e` account menu,
> vote-pair `signed-in-no-vote` state with `aria-live`, comment
> composer) all rendered correctly. Spoiler discipline held on both
> themed lists — zero winner/eliminee/outcome leakage. One candidate
> HIGH finding was investigated and dropped as a false positive: the
> reader flagged Married at First Sight S14 ("Boston II")'s lede/theme
> blurb saying the panel "carries over unchanged from Houston" as
> contradicting the city-return framing ("returns to Boston... since
> Season 6") — re-verified against `content/shows/married-at-first-sight/
> seasons/13-houston.md` and the two clauses refer to different things
> (the *city* returns to Boston, last seen in S6; the *panel/format*
> carries over from the immediately-preceding S13, titled "Houston") —
> coherent, not an error. A second candidate (authed empty comment
> thread on the Big Brother season page) was also dropped — `CommentThread.tsx`'s
> own docstring (pass-36 #335, pass-42 #362) documents the missing
> empty-state line as intentional design, already adjudicated across
> multiple prior passes. One new LOW finding filed: adjacent ranks #7/#8
> on `the-matching-experts-never-sit-still-for-long` both lean on the
> identical "last season ... together" construction in headline and
> closing blurb line, back-to-back — the recurring near-verbatim-phrase
> defect class this catalog has flagged before. No pending HIGH findings
> remained open ahead of this pass; the site continues to read clean on
> the P0 spoiler check.
> Pass 179 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`. URL set: `/`,
> `/themes/best-challenge-design`, `/themes/the-advantage-was-never-free`,
> `/shows`, `/themes` anon; `/shows/big-brother/season/time-trip`,
> `/u/e2e`, `/sign-in`, `/themes/best-challenge-design`, `/shows`
> authed — rotated onto the two freshly-shipped Rule 3 themed-list
> extends (`best-challenge-design`, `the-advantage-was-never-free`) and a
> re-check of the still-open pass-178 Big Brother Time Trip finding. Both
> passes came back mechanically clean (0 console errors, 0 failed
> requests, 0 horizontal overflow on either viewport, H1/canonical/OG
> present on every capture); `/sign-in` confirmed a genuine server-side
> 307 redirect for an already-authed session (not client-side chrome
> swap only). Spoiler discipline held on both themed lists — all 30
> combined entries (18 + 12) stayed at the format/mechanic level with
> zero winner/eliminee/outcome leakage, including the exile-adjacent
> Survivor Redemption Island / Edge of Extinction entries. Filed 0 new
> findings this pass. The pass-178 MED ("1,000th episode" restated 5x on
> Big Brother Time Trip) was reconfirmed still present via full rendered
> `innerText` and intentionally NOT re-filed (already open, correctly
> tracked). The `/themes` "Featured for September 2026" vs. "LISTS
> REVISED October 2026" pass-178 MED is also reconfirmed still present
> and not re-filed. Four other candidate observations on the authed pass
> were checked against prior closures and correctly dropped as
> already-resolved-by-design, not regressions: the zero-vote plain-tally
> wording (pass-147 HIGH fix, intentional authed/anon split), the
> device-scoped "Save (this device)" label (closed #272/#377), `/u/e2e`'s
> crawler-only third-person meta description (pass-45 #1139, by design),
> and the comment composer's "held briefly for review" microcopy (a
> landed fix, not a new defect). No pending HIGH findings remained open
> ahead of this pass; the site continues to read clean on the P0 spoiler
> check.
> Pass 178 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`. URL set: `/`,
> `/shows/big-brother/season/time-trip`, `/shows`,
> `/shows/rhony/season/the-legacy-return`, `/themes` anon;
> `/shows/big-brother/season/time-trip`,
> `/shows/amazing-race/season/family-edition`, `/u/e2e`, `/shows`,
> `/sign-in` authed — rotated onto the freshly-filed Big Brother Season 28
> "Time Trip" page (finale-shift drain, this tick) and two prior-pass fix
> verifications (RHONY "eight years" HIGH, Amazing Race Family Edition
> duplicate-rationale MED — both pass-177 findings, both confirmed
> genuinely closed, not re-filed). Both passes came back mechanically
> clean (0 console errors, 0 failed requests, 0 horizontal overflow on
> either viewport, correct heading hierarchy, `/sign-in` 307-redirects an
> authed session to `/`); spoiler discipline held on Big Brother Time Trip
> (twist mechanics + the 1,000th-episode milestone only, zero
> winner/eviction/outcome leakage, "no spoilers" badge + held-comment
> copy both correct in the authed comment composer). Filed 2 new findings
> (0 HIGH, 2 MED, 0 LOW): a fresh single-fact-owner-drift instance on
> `/shows/big-brother/season/time-trip` — the "1,000th episode" milestone
> fact is restated near-verbatim 5 times across the premiere caption, THE
> TAKE, THE SHAPE OF THE SEASON, WHERE IT SITS IN THE CANON, and the
> WATCH FOR mid-season bullet; and a recurrence of the `/themes`
> "Featured for \<month\>" badge going stale against the page's own
> "LISTS REVISED" stat (same mechanism as the pass-103 and pass-168
> closures — the three currently-featured themes' `last_revised` tops out
> at September 17, so the badge reads "Featured for September 2026" while
> the ambient stat two rows below reads "October 2026 · LISTS REVISED").
> Three other candidates were checked and correctly dropped as
> already-tracked: the new theme's DWTS S35 entry repeating the "ties
> Seasons 9/31" fact (reinforces the existing pass-174 Pending row), the
> "Save (this device)" authed copy on theme pages (reinforces the
> existing pass-175 Pending row), and `best-comeback-seasons`' lede
> double-register metaphor (previously checked and dropped as
> below-threshold). `?view=community` does not apply to theme routes
> (no searchParams handling on that page family — confirmed from source,
> not a defect). No pending HIGH findings remained open ahead of this
> pass; the site continues to read clean on the P0 spoiler check.
> Pass 176 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`. URL set: `/`,
> `/shows/big-brother/season/a-summer-of-mystery`, `/shows`,
> `/themes/moving-day`, `/shows/survivor/season/survivor-51`, `/themes`
> anon; `/shows/big-brother/season/a-summer-of-mystery?view=community`,
> `/themes/moving-day`, `/u/e2e`, `/shows`, `/sign-in` authed — rotated
> onto the freshly content-gap-fixed Big Brother Season 27 page, the
> freshly-extended `moving-day` themed list, and Survivor 51 (not
> resampled since pass 172/pre-premiere). Both passes came back
> mechanically clean (0 console errors, 0 failed requests, 0 horizontal
> overflow on either viewport, H1/canonical/OG present on every page);
> no spoiler leakage anywhere (raw HTML checked, not just rendered
> text — format/twist disclosures only, no eliminations or winners).
> Filed 1 new finding (0 HIGH, 1 MED, 0 LOW): a fresh, previously
> undocumented instance of the site's tracked single-fact-owner-drift
> voice pattern on `/shows/survivor/season/survivor-51` (two distinct
> facts each restated 3-5 times across the page). Several other
> candidates were checked against `plan/CRITIQUE.md` and correctly
> dropped as already-tracked or false positives: the big-brother page's
> own fact-repetition (already the pattern's textbook exemplar, patched
> immediately prior at `b1d1958c`), the `?view=community` season-route
> param strip (tracked across 15+ prior passes), the `moving-day`
> "Save (this device)" copy (already an open LOW), `/sign-in`'s
> signed-in redirect (307 → `/`, working as intended), and the
> `/shows` B-tier canon-count pill / `/themes` badge-legend gap (both
> already resolved/tracked). No pending HIGH findings remained open
> ahead of this pass; the site continues to read clean on the P0
> spoiler check.
> Pass 175 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`. URL set: `/`,
> `/shows/90-day-fiance/season/season-12`, `/shows`,
> `/themes/the-clock-had-to-make-room`,
> `/themes/some-casts-didnt-need-week-one`, `/themes` anon;
> `/shows/90-day-fiance/season/season-12?view=community`,
> `/themes/the-clock-had-to-make-room`, `/u/e2e`, `/shows`, `/sign-in`
> authed — rotated onto the freshly-filed 90 Day Fiancé Season 12
> (finale-shift drain) and the two themed lists extended this week
> (`the-clock-had-to-make-room`, `some-casts-didnt-need-week-one`).
> Both passes came back mechanically clean (0 console errors, 0 failed
> requests, 0 horizontal overflow on either viewport, H1 present on
> every page); no spoiler leakage found on the freshly-aired season
> (verified against raw HTML, not just rendered text — all-new-cast
> premise/casting facts only, no relationship outcomes). Filed 4 new
> findings (0 HIGH, 1 MED, 3 LOW). Two raw observations were dropped at
> self-assessment after code verification: an authed-pass claim that
> `?view=community` silently 308s away on season-detail routes was a
> false positive — that 308 redirect (commit `6fe08cc8`, 2026-09-26) IS
> the shipped fix for the exact defect class CRITIQUE passes 151/156/171
> already tracked (a stray `?view=` param rendering byte-identical
> content with no error); `/shows?view=community` being a no-op is
> equally expected since the community-view toggle was only ever a
> show-detail feature, never a show-index one. A `/u/e2e` "no
> comment-history section" claim was also a false positive — same root
> cause pass-174 already assessed and dropped: the e2e bot account has
> zero comments and zero votes, so `isPopulatedProfile()`
> (`src/lib/profile/context.ts:118`) correctly renders the empty state
> rather than the populated `Recent comments` section
> (`src/app/(default)/u/[handle]/page.tsx:205-219`) — not a structural
> gap. No pending HIGH findings remained open ahead of this pass; the
> site continues to read clean on the P0 spoiler check.
>
> ───── Pass 174 metadata kept below for history ─────
>
> Pass 174 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`. URL set: `/`,
> `/shows/dancing-with-the-stars/season/fall-2026`,
> `/shows/traitors/season/new-blood`, `/shows/the-voice`, `/themes`,
> `/themes/built-for-the-drop` anon;
> `/shows/dancing-with-the-stars/season/fall-2026?view=community`,
> `/shows/traitors/season/new-blood`, `/u/e2e`,
> `/shows/the-voice?view=community`, `/sign-in`, `/shows` authed —
> rotated onto the two seasons the 2026-09-28 CADENCE drain just filed
> (Dancing with the Stars S35, Traitors S5 "New Blood") plus a
> re-check of the-voice's tagline fix from the prior commit. Both
> passes came back mechanically clean (0 console errors, 0 failed
> requests, 0 horizontal overflow on either viewport); no spoiler
> leakage on either in-progress season (verified against raw HTML,
> not just rendered text). Filed 2 new findings (0 HIGH, 2 MED, 0 LOW).
> Four raw observations were dropped at self-assessment after code
> verification: a DWTS-S35 meta-description "truncated mid-sentence"
> claim was a false positive — it's `clipToSeoBudget()`'s documented
> em-dash clause-boundary fallback firing correctly and landing on a
> complete noun phrase, not a defect; a `/u/e2e` "no comments section"
> claim was a false positive — the e2e bot account currently has zero
> comments AND zero votes, so `isPopulatedProfile()` correctly renders
> the empty state (`src/lib/profile/context.ts:114`), not a bug; a
> the-voice community-view "0% approval on zero-vote rows" observation
> re-raised a documented, deliberate design decision from pass-117/118
> (`CommunityRankList.tsx:71-75`, the "honest-zero" convention) with no
> new evidence to revisit it; and a Traitors-season "finale date named
> in the watch-list" observation was dropped as non-actionable — a
> public broadcast date is not a spoiler and the suggested fix was
> speculative. Prior pass-173 metadata kept below for history.
>
> ───── Pass 173 metadata kept below for history ─────
>
> Last pass: 2026-09-27 at commit c95dc753
> Pass count: 173
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> Pass 173 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`. URL set: `/`,
> `/shows/shark-tank/season/season-17`, `/shows`, `/themes`,
> `/themes/best-non-winning-runs` anon; `/`,
> `/shows/shark-tank/season/season-17`, `/u/e2e`,
> `/shows/shark-tank/season/season-17?view=community`, `/mod` authed —
> a deliberate rotation off the last several passes' survivor/dragrace
> heavy set onto Shark Tank, untouched by critique since pass 84. Both
> passes came back mechanically clean (0 console errors, 0 failed
> requests, 0 horizontal overflow on either viewport). Filed 1 new
> finding (0 HIGH, 1 MED, 0 LOW): the authed pass found Shark Tank
> Season 17's two headline facts (Wednesday timeslot move, Lubetzky
> going full-time) restated near-verbatim across at least 8 fields
> spanning both the season file and canon.md (`lede`, `pull`, `take_h2`,
> `format_caption`, `cast_size_caption`, a `watch_list` entry, plus
> canon.md's `tag`, `slot_argument`, and prose) — the same
> single-fact-owner drift class fixed dozens of times elsewhere in the
> catalog. Three raw observations were dropped at self-assessment: a
> dark-mode toggle "no accessible name" a11y claim was a false
> positive (`ThemeToggle.tsx` already carries a correct
> `aria-label="Switch to {mode} mode"`, the reader misread the
> `aria-hidden` glyph span as the accessible name); a zero-vote-count
> observation on the same season page a year post-premiere was dropped
> as a real-data product-engagement state, not a fixable defect; and a
> HIGH "spoiler-adjacent slug" claim on `/themes/best-non-winning-runs`
> (the slug names an outcome class the softened title/description
> deliberately avoid stating) was dropped as already-litigated —
> pass-54 (2026-06-16) considered the identical
> slug-vs-title/description mismatch on this exact list and explicitly
> kept the slug for URL stability, the same precedent pass-53 set for
> `/themes/best-premieres`; re-opening it here would just re-litigate a
> settled call. Spoiler discipline held clean throughout — Shark Tank
> S17 copy stays strictly format/casting-level (timeslot, panel
> composition), no outcome or placement beat leaked. No pending HIGH
> findings remain open ahead of this pass.
> Pass 172 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`. URL set: `/`,
> `/shows/survivor/season/survivor-51`, `/shows`, `/shows/survivor`,
> `/themes` anon; `/`, `/shows/survivor/season/survivor-51`, `/u/e2e`,
> `/shows/survivor/season/survivor-51?view=community`, `/mod` authed.
> Anon pass came back mechanically clean (0 console errors, 0 failed
> requests, 0 horizontal overflow on either viewport), but hand-review
> of the captures surfaced 3 new findings (0 HIGH, 2 MED, 1 LOW), all
> content-staleness defects traceable to Survivor 51's 2026-09-23
> premiere not fully propagating through the show's own metadata: the
> show-page hero blurb still reads "50 seasons" against the adjacent
> "51 SEASONS IN CANON" stat tile three days after the new season
> shipped; the season page's own eyebrow still reads "Premiering fall
> 2026" against the "PREMIERED Sep 23, 2026" fact block on the same
> page; and canon.md's `last_revised` (June 2026) predates the
> post-premiere #51 slot prose actually authored into that same file.
> Spoiler discipline held clean throughout — Survivor 51 copy stays
> strictly pre-air/format-level, no outcome or placement beat leaked.
> Authed pass came back fully clean (0 findings): auth chrome correct
> on every URL (`authState: "authenticated:cloud"`), and the two
> targeted verifications both passed — the freshly-shipped season-detail
> `?view=community` 308 redirect (commit 6fe08cc8) confirmed live via
> direct `curl` (`HTTP/2 308` → clean canonical URL, rendered body
> matches the clean-URL capture exactly), and Survivor 51 re-confirmed
> spoiler-clean on the authed pass too. No pending HIGH findings remain
> open ahead of this pass.
> Pass 171 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`. URL set: `/`,
> `/shows/the-voice/season/the-finale`, `/shows`,
> `/shows/dragrace/season/season-18?view=community`, `/themes` anon;
> `/`, `/shows/the-voice/season/the-finale`, `/u/e2e`,
> `/shows/dragrace/season/season-18?view=community`, `/mod` authed.
> Both passes came back mechanically clean (0 console errors, 0 failed
> requests, 0 horizontal overflow at 375px), auth handshake healthy
> (`@e2e` chrome renders correctly on every authed URL, `data-signed-in`
> confirmed true). `/mod` access-denied copy re-verified clean (the
> pass-170 vendor-name fix holds). 2 new findings filed (0 HIGH, 2 MED,
> 0 LOW): `/shows/dragrace/season/season-18`'s meta description's
> word-boundary fallback lands on "full" — a dangling adjective with no
> noun, the same defect class as the already-fixed stop-word/ordinal
> trims but on a fresh trigger word; and the shared `VotePair` component
> has no `aria-live` region, so a screen-reader user who casts a vote
> gets no announcement that it registered. One existing row bumped
> LOW→MED: `?view=community`'s silent no-op on season-detail routes now
> has a third confirmed instance (dragrace) across three separate
> passes, making it a reliable defect rather than a per-show fluke. Two
> other reader-surfaced observations were dropped as duplicates of
> already-open rows: the same `?view=community` no-op (folded into the
> severity bump above) and a `Cache-Control: private, no-cache` finding
> on `/shows/the-voice/season/the-finale` (already tracked as a
> needs-user-call investigation, unresolved since pass-96, covering the
> same season/show-detail route family). A third reader-surfaced item —
> the comment thread showing no explicit empty-state text for signed-in
> viewers — was assessed and dropped, not filed: `CommentThread.tsx`'s
> own in-source comment (pass-36 #335, pass-42 #362) documents this as
> intentional design, not a gap — authed viewers deliberately drop the
> empty-state line because the input affordance above already carries
> the invitation. No pending HIGH findings remained open ahead of this
> pass; the site continues to read clean on
> the P0 spoiler check.
> Pass 169 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`. URL set: `/`,
> `/shows`, `/shows/survivor`, `/shows/survivor/season/survivor-50`,
> `/themes`, `/themes/best-finales` anon; `/`,
> `/shows/survivor/season/heroes-vs-villains`, `/u/e2e`, `/mod`,
> `/settings`, `/account` authed. Both passes came back mechanically
> clean (0 console errors, 0 failed requests, 0 horizontal overflow at
> 375px), auth handshake healthy (`@e2e` chrome renders correctly
> throughout, `/mod` correctly denies the non-mod test user, `/sign-in`
> correctly redirects an already-signed-in user), and no spoiler leaks
> anywhere sampled. 5 new findings filed (0 HIGH, 5 MED): the
> recurring fact-restatement defect class surfaced on two more pages —
> Survivor 50 restates its "fiftieth season" milestone four times
> (HOST tile, body, canon slot_argument, canon body) and Heroes vs.
> Villains restates its "twenty returnees, two tribes" fact four times
> (FORMAT, CAST SIZE, "the take," canon rationale). Two systemic a11y
> defects: the vote-button aria-label duplicates the show name on any
> season whose title already starts with the show name (e.g. "Vote up
> Survivor Survivor 50"), and `SeasonHero.tsx`'s `<br/>` handling in
> `display_title` drops the word boundary, so "Heroes vs. Villains"
> reads as "Heroes vs.Villains" to a screen reader — both likely affect
> more than the one page each was caught on. Plus one consistency gap:
> the signed-in header's nav links and account-menu trigger have no
> `:focus-visible` ring while other interactive chrome (skip-link,
> comment textarea, search input) does. No pending HIGH findings
> remained open ahead of this pass; the site continues to read clean
> on the P0 spoiler check.
> Pass 168 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`. URL set deliberately
> targeted shows with little to no prior critique coverage: Ink Master's
> Hometown Heroes, Hell's Kitchen's Battle of the States, MAFS Australia
> Season 13, and Bachelorette's Jenn Tran season: `/`,
> `/shows/ink-master/season/hometown-heroes`, `/shows/hells-kitchen`,
> `/themes`, `/shows` anon;
> `/shows/hells-kitchen/season/battle-of-the-states?view=community`,
> `/shows/americas-next-top-model?view=community`,
> `/shows/married-at-first-sight-australia/season/season-13?view=community`,
> `/shows/bachelorette/season/jenn-tran`, `/u/e2e` authed. Both
> passes came back mechanically clean (0 console errors, 0 failed
> requests, 0 horizontal overflow at 375px), auth handshake confirmed
> healthy (`@e2e` chrome renders correctly, `/u/e2e` account page
> resolved via the header's account-chrome link, vote-pair and
> comment-input affordances render correctly in their pre-interaction
> authed states), and no spoiler leaks anywhere sampled (the MAFS
> Australia Mel Schilling mention is real-world context, explicitly
> framed as not a plot twist). 5 new findings filed (0 HIGH, 5 MED):
> the same recurring fact-restatement defect class surfaced on four
> separate pages — Ink Master's Hometown Heroes repeats its
> four-finalist and hometown-region facts three times each across
> lede/shape/watch-list (both anon and authed passes caught this
> independently at both viewports, filed once); Hell's Kitchen's
> Battle of the States restates its one-chef-per-state cast fact across
> six fields; MAFS Australia Season 13 restates its Mel Schilling
> tribute across five fields; and Bachelorette's Jenn Tran season body
> and canon.md rank-9 rationale restate nearly the same paragraph.
> Plus a genuinely different class: the `/themes` "Featured this month"
> strip reads "Featured for August 2026" — a month stale against the
> page's own September "LISTS REVISED" stat, because all four currently
> `featured: true` themes carry early-August `last_revised` dates (the
> derivation logic itself is correct by design; the featured set just
> needs a curator swap). No pending HIGH findings remained open ahead
> of this pass; the site continues to read clean on the P0 spoiler
> check.
> Pass 165 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`. URL set targeted
> MasterChef's freshly-relevant Global Gauntlet season (finale aired
> 2026-09-17) and two recently-touched surfaces (Drag Race All Stars
> Season 11, twice patched this same tick for repetition; Traitors UK
> Series 4, recently premiere-date-verified) plus a general sweep: `/`,
> `/shows/masterchef/season/global-gauntlet`, `/shows`,
> `/shows/dragrace-allstars/season/season-11`,
> `/themes/best-non-winning-runs` anon;
> `/shows/masterchef/season/global-gauntlet?view=community`,
> `/shows/dragrace-allstars/season/season-11?view=community`,
> `/shows/traitors-uk/season/series-4`, `/sign-in`, `/u/e2e` authed. Both
> passes came back mechanically clean (0 console errors, 0 failed
> requests, 0 horizontal overflow at 375px) with no spoiler leaks anywhere
> sampled. 5 new findings filed (0 HIGH, 2 MED, 3 LOW): MasterChef's
> Global Gauntlet page restates its judges/regions/World-Cup-bracket fact
> set across the lede, "shape of the season," and "where it sits in the
> canon" sections plus the meta sidebar — the same repetition class two
> other shows just had fixed this same tick; the traitors-uk-family
> `canonOrderCaptionFor` disambiguation caption (added at pass-140 for
> title collisions like "Season NN") only matches the regex
> `/^Season (\d+)$/i`, so international shows using "Series N" numbering
> (traitors-uk, dragrace-uk, etc.) never get the caption despite carrying
> the identical rank/number mismatch risk; the Real Housewives franchise
> is inconsistent about the definite article across ten shows (six drop
> "The," four keep it, against Bravo's own consistently-"The" branding);
> dragrace-allstars season-11's `watch_list` "Mid-cycle · the Comeback
> Queen" entry still fully re-explains the reentry mechanic even after
> this same tick's canon.md-reference-only fix (pass-130) narrowed every
> *other* field — the watch-list entry was never in scope of that fix;
> and the same page's PREMIERED sidebar field repeats "May 2026" on two
> consecutive lines for a streaming-only show with no weekly timeslot to
> report instead. No pending HIGH findings remained open ahead of this
> pass; the site continues to read clean on the P0 spoiler check.
> Pass 164 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`. URL set targeted the
> freshly-filed Alone Australia Season 4 (Sápmi, Finland) page, newly
> promoted to the top canon slot by the 2026-09-13 sweep-triggered drain,
> plus a general sweep: `/`, `/shows/alone-australia/season/sapmi-finland`,
> `/shows`, `/shows/alone-australia?view=canon`,
> `/themes/where-the-warmth-ran-out` anon; `/`,
> `/shows/alone-australia/season/sapmi-finland`,
> `/shows/alone-australia?view=community`, `/sign-in`, `/u/e2e` authed.
> Both passes came back mechanically clean (0 console errors, 0 failed
> requests, 0 horizontal overflow at 375px) with no spoiler leaks anywhere
> sampled. 3 new findings filed (0 HIGH, 1 MED, 2 LOW): the Season 4 page
> restates its "biggest swing/leap since Fiordland" claim across four
> separate content fields (lede, body paragraph, a `watch_list` bullet,
> and canon.md's own rationale); the FORMAT and CAST SIZE detail-card
> captions restate the identical "first Arctic conditions" fact back to
> back; and the eyebrow's "Aired" doesn't match the PREMIERED detail-field
> label — a third reproduction of a pattern already tracked twice
> (project-runway new-york-2026, alone arctic-ii), both still open.
> One candidate was investigated and dropped at self-assessment: an
> anon-pass claim that the season page's "Where it sits in the canon"
> section duplicates canon.md's Season 4 rationale verbatim turned out to
> be working as designed — that section deliberately quotes the canon
> rationale in full, a documented pass-49 fix (`page.tsx` comment,
> `whereItSitsCopy()`) for a previously-empty stub section, not an
> unintended duplication. No pending HIGH findings remained open ahead of
> this pass; the site continues to read clean on the P0 spoiler check.
> Pass 163 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`. URL set targeted two
> freshly-touched surfaces (Project Runway's New York 2026 season, whose
> canon rationale was just rewritten this same day to drop a restated
> fact set, and the-city-already-had-a-show's just-completed round-7 echo
> drain) plus a general sweep: `/`, `/shows/project-runway/season/
> new-york-2026`, `/shows`, `/themes/the-city-already-had-a-show`,
> `/themes` anon; `/`, `/shows/project-runway/season/new-york-2026`,
> `/u/e2e`, `/themes/the-city-already-had-a-show`, `/sign-in` authed.
> Both passes came back mechanically clean (0 console errors, 0 failed
> requests, 0 horizontal overflow at 375px) with no spoiler leaks anywhere
> sampled. 2 new findings filed (0 HIGH, 2 MED, 0 LOW): the Project Runway
> season's authed "Also appears in" module mixes sentence-case and full
> Title Case theme titles in the same four-item row, a catalog-wide defect
> reaching 4 of 182 theme titles; and the-city-already-had-a-show's
> round-7 echo drain (same-day commit dd3704e6) missed two of its
> eighteen entries — ranks 9 and 11 still repeat "the same Strip" / "the
> same year" verbatim between title and blurb. One candidate was
> investigated and dropped at self-assessment: an anon-pass claim that
> `/themes` shows the same list twice (once in the featured rail, once in
> the by-tone grid) with two different descriptions turned out to be
> working as designed — the schema's `featured_pull` field exists
> specifically to give the featured-rail card shorter pull-quote copy
> distinct from the full `description` field used in the browsable index
> (`src/lib/themes-format.ts` falls back to `description` only when
> `featured_pull` is absent), and the dual-rendering itself was a
> deliberate pass-40 fix (#353) to keep every list visible in the
> chip-filtered grid. No pending HIGH findings remained open ahead of
> this pass; the site continues to read clean on the P0 spoiler check.
> Pass 162 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`. URL set targeted two
> freshly-touched surfaces (Bake Off's just-rewritten weekly community-vote
> question, Project Runway's newly-filed New York 2026 season) plus a
> general sweep: `/`, `/shows/bake-off?view=community`, `/shows`,
> `/themes/the-season-the-audience-showed-up-all-at-once`, `/themes` anon;
> `/`, `/shows/bake-off?view=community`, `/u/e2e`,
> `/themes/the-season-the-audience-showed-up-all-at-once`,
> `/shows/project-runway/season/new-york-2026?view=community` authed.
> Both passes came back mechanically clean (0 console errors, 0 failed
> requests, 0 horizontal overflow at 375px) with no spoiler leaks anywhere
> sampled. 2 new findings filed (0 HIGH, 1 MED, 1 LOW): the newly-filed
> Project Runway New York 2026 season restates its cast-size/judges-table/
> Siriano-Save fact set near-verbatim across "the shape of the season" and
> "where it sits in the canon" — the same cross-section repetition class
> drained on dozens of other shows, reaching this fresh season on its first
> critique pass; and that same season's eyebrow reads "Aired summer 2026"
> against the detail card's "PREMIERED / Jul 9, 2026" a few lines down — a
> second, previously-single-instance-only reproduction of the still-open
> pass-152 Aired/Premiered verb-mismatch class. Two candidates were
> investigated and dropped at self-assessment: an anon-pass claim that Bake
> Off's weekly community-vote question ("Does the final BBC year hold up
> against the peak Welford run on rewatch?") is ambiguous because "The Last
> BBC Year" allegedly shares a "Welford peak" caption with the season the
> question means to contrast against turned out to rest on a mis-citation —
> direct `curl` inspection of the live page confirms that caption
> ("The series that confirmed the Welford peak...") belongs to a third,
> unrelated season (rank 5, "The Year After"), not rank 2; the two seasons
> the question actually names ("The Welford Peak," rank 1, and "The Last
> BBC Year," rank 2) are unambiguous, adjacently-ranked, and literally
> titled to match the question's paraphrase. A second claim — Bake Off's
> mobile community table dropping the "7D" trend column — is a real,
> reproducible third instance of an already-tracked, still-open systemic
> `CommunityRankList` defect (pass-104/pass-156, previously confirmed on
> love-island-uk and naked-and-afraid); filing a fourth near-duplicate row
> for the same untouched systemic fix adds no new information, so it was
> dropped rather than re-filed. No pending HIGH findings remained open
> ahead of this pass; the site continues to read clean on the P0 spoiler
> check.
> Pass 161 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`. URL set targeted the
> two most recently filed surfaces (Below Deck Mediterranean's post-finale
> S11 content and Alone Australia's freshly-drained S4 Sápmi/Finland
> season) plus a general sweep: `/`, `/shows/below-deck-mediterranean`,
> `/shows/alone-australia/season/sapmi-finland`, `/themes/been-here-before`,
> `/themes` anon; `/`, `/shows/below-deck-mediterranean?view=community`,
> `/u/e2e`, `/themes/when-the-chairs-turned-over`,
> `/shows/alone-australia/season/sapmi-finland?view=community` authed.
> Both passes came back mechanically clean (0 console errors, 0 failed
> requests, 0 horizontal overflow at 375px) with no spoiler leaks on
> either freshly-filed surface. 2 new findings filed (0 HIGH, 1 MED, 1
> LOW): a verified, reproduced edge case in the shared `clipToSeoBudget()`
> helper (`src/lib/seo.ts`) where its em-dash clause-boundary preference
> (added at pass-68) or a plain long comma-list can both land the SERP
> snippet cut before any of a lede's actual descriptive content —
> reproduced directly against both the Alone Australia S4 and Below Deck
> Mediterranean S11 ledes; and Below Deck Mediterranean's "best premiere
> numbers in years / renewed before the finale aired" fact restated
> near-verbatim across the show canon page, the season page, and a
> themed-list entry — the same cross-surface repetition class drained on
> dozens of other shows, reaching this one fresh. Three candidates were
> investigated and dropped at self-assessment: an authed-pass claim of
> "no sign-out affordance anywhere" was a false positive — `HeaderView.tsx`
> deliberately collapses `@handle` + `Sign out` behind a tap-to-reveal
> account menu (documented since pass-45), and the static capture never
> clicked it; a claim that the themed-list "Save" button ignores
> authenticated state is accurate but by design (`ListDetailTools.tsx`'s
> own comment scopes Save to device-local, reader-only actions — not a
> defect); and a "`?view=community` is a dead param on season-detail
> URLs" finding was reproducible but unreachable — no component anywhere
> in the app ever emits that query shape on a season URL, so it was an
> artifact of the orchestrator's own test-URL choice, not a real user
> path. No pending HIGH findings remained open ahead of this pass; the
> site continues to read clean on the P0 spoiler check.
> Pass 160 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`. URL set: `/`,
> `/shows/top-chef/season/carolinas`, `/shows/top-chef`, `/themes`,
> `/themes/not-the-usual-order` anon; `/`,
> `/shows/top-chef/season/carolinas?view=community`, `/u/e2e`,
> `/shows/top-chef?view=community` authed. Both passes came back clean on
> auth/console/mobile-overflow mechanics (0 console errors, 0 failed
> requests, 0 horizontal overflow at 375px, no spoiler leaks across all 9
> URLs — verified directly against "WHAT TO WATCH FOR" and canon-slot copy
> that could easily have leaked an outcome). 2 new findings filed (0 HIGH,
> 2 MED, 0 LOW) — Top Chef Carolinas restating two separate facts (the
> Charlotte/Greenville/Asheville location clause verbatim between meta
> description and hero lede; Kristen Kish's "third season as host" across
> five surfaces) — the same cross-callout repetition class already drained
> across dozens of shows, reaching a fresh show here — and a comprehension
> finding new to this pass: the Top Chef show-home "Themed lists for Top
> Chef" section dumps ~41 list titles into one flat, ungrouped grid under a
> single `<h2>`, unlike `/themes` itself which buckets its 182 lists by
> tone/structure/craft/era. A candidate reproducing the authed
> `/shows/top-chef?view=community` "voters, last 7 days · 0" beside
> nonzero per-row vote totals was investigated and dropped: this exact
> page + mechanism was already found and fixed at pass-122 (relabel to
> explicit "VOTERS, LAST 7 DAYS") and the pass-139 zero-clause fix
> (`CommunityLiveStrip.tsx`, "(no new votes since last update)") is
> confirmed live in the captured copy — the underlying all-time-vs-7-day
> scoping is a documented by-design distinction (both numbers are
> individually honest), not a regression; re-filing would just cycle
> another wording tweak against a decision already made. No pending HIGH
> findings remained open ahead of this pass; the site continues to read
> clean on the P0 spoiler check.
> Pass 159 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`. URL set: `/`,
> `/shows/rhobh/season/the-renewal`, `/shows/so-you-think-you-can-dance/canon`,
> `/shows/bachelorette`, `/themes/it-took-five-seasons-to-find-a-home` anon;
> `/`, `/shows/rhobh/season/the-renewal`, `/shows/bachelorette?view=community`,
> `/u/e2e` authed. Both passes came back clean on auth/console/mobile-overflow
> mechanics (0 console errors, 0 failed requests, 0 horizontal overflow at
> 375px, no spoiler leaks). 2 new findings filed (0 HIGH, 2 MED, 0 LOW) —
> RHOBH's the-renewal season restating its three headline facts (Saint John's
> arrival, the Mexico location, the unproven new-era cast) across five
> surfaces including an un-overridden meta description (the cross-callout
> repetition class already drained across dozens of shows, reaching a fresh
> show here), and a template-level a11y heading-skip (`<h2>` straight to
> `<h4>`, no `<h3>`) on the show-home season-card and theme-card grids,
> confirmed on two unrelated shows. One further candidate (the mobile
> community-rank header dropping its "(canon order)" qualifier and 7D column,
> reproduced on `/shows/bachelorette?view=community`) matched the
> already-open pass-155/157/158 chopped/american-idol/rhoc systemic finding —
> appended as a fifth confirming instance and bumped MED → HIGH given how
> widely and cleanly it's now reproduced, per §5 dedup rule. A candidate
> flagging the `/canon` URL's 308 redirect to the show-home page was
> investigated and dropped: Phase 33 intentionally consolidated `/canon` and
> `/community` into the unified show page (`?view=` query param) — documented
> in `apps/e2e/src/fixtures/canonical-urls.ts`, not a regression. A candidate
> flagging the comment thread's missing empty-state line for a signed-in
> viewer was investigated and dropped: `CommentThread.tsx`'s own docstring
> (pass-36 #335, pass-42 #362) documents that authed viewers deliberately
> drop the empty-state line because the input affordance above already
> carries the invitation — working as designed, not a regression. No pending
> HIGH findings remained open ahead of this pass (the one previously-open
> HIGH — too-few-to-call-it-all-stars — was already RESOLVED); the site
> continues to read clean on the P0 spoiler check across all 9 URLs visited.
> Pass 158 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`. URL set: `/`,
> `/shows/rhoc/season/the-resurfacing`, `/shows`,
> `/themes/never-needed-a-villain`, `/themes` anon; `/u/e2e`,
> `/shows/summer-house/season/overhaul-summer?view=community`,
> `/sign-in`, `/shows/rhoc?view=community`,
> `/shows/traitors-uk/season/series-4?view=community` authed. Both
> passes came back clean on auth/console/mobile-overflow mechanics (0
> console errors, 0 failed requests, 0 horizontal overflow at 375px, no
> spoiler leaks). 2 new findings filed (0 HIGH, 1 MED, 1 LOW) — RHOC
> Season 19's Gretchen-Rossi-return and Katie-Ginella-exit facts each
> restated near-verbatim across two to three sections plus the meta
> description (the cross-callout repetition class already drained
> across dozens of other shows, reaching a fresh show here), and the
> `/shows` + `/themes` index pages both falling back to the site-wide
> root OG image instead of a page-specific one. One further candidate
> (rhoc's community-rank table header reading as disconnected
> fragments, reproduced on both desktop and mobile) matched the
> already-open pass-155/157 chopped/american-idol systemic finding —
> appended as a confirming instance instead of a duplicate row, per §5
> dedup rule. A borderline spoiler-adjacent candidate (RHOC S19 stating
> a cast member's run "closes out here") was investigated and dropped:
> the same cast-departure-as-fact convention already appears across a
> dozen other shows in the catalog (rhod, married-at-first-sight-
> australia, masterchef-australia, dancing-with-the-stars, summer-
> house, too-hot-to-handle, the-apprentice, and others) — settled
> editorial precedent, not a new spoiler category. `/sign-in` again
> correctly redirected the signed-in visitor to `/` (reconfirmed).
> `/u/e2e`'s empty state and the vote-pair zero-state fix both
> reconfirmed holding with no regression. Auth handshake confirmed live
> (authenticated:cloud). No pending HIGH findings remain open ahead of
> this pass; the site continues to read clean on the P0 spoiler check.
> Pass 157 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`. URL set: `/`,
> `/shows/married-at-first-sight/season/seattle`,
> `/shows/big-brother/season/a-summer-of-mystery`, `/themes`,
> `/themes/who-actually-got-the-vote` anon; `/sign-in`, `/u/e2e`,
> `/shows/married-at-first-sight/season/seattle?view=community`,
> `/shows/american-idol?view=community` authed. Both passes came back
> clean on auth/console/mobile-overflow mechanics (0 console errors, 0
> failed requests, 0 horizontal overflow at 375px, no spoiler leaks).
> 1 new finding filed (MED) — married-at-first-sight Season 20's three
> headline facts (Seattle location, largest-ever cast, two-expert panel)
> restated near-verbatim across five sections, the same repetition class
> drained across dozens of other shows but not yet reached this one. One
> further candidate (american-idol's community-table "APPROVAL (canon
> order)" / bare "%" header reading as disconnected fragments) reproduced
> the already-open pass-155 chopped finding on the desktop viewport this
> time, not just mobile — appended as a confirming instance instead of a
> duplicate row, per §5 dedup rule, and bumped LOW → MED given the
> confusion is no longer purely a mobile-breakpoint issue. `/sign-in`
> again correctly redirected the signed-in visitor to `/` (reconfirmed,
> not a bug — matches every prior pass's finding). Auth handshake
> confirmed live (authenticated:cloud). No pending HIGH findings remain
> open ahead of this pass; the site continues to read clean on the P0
> spoiler check.
> Pass 156 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE` for `e2e@pantheon.app`. URL set: `/`,
> `/shows/vanderpump-rules/season/season-12`, `/shows`,
> `/themes/too-few-to-call-it-all-stars`, `/shows/naked-and-afraid?view=
> canon` anon; `/sign-in`, `/u/e2e`, `/shows/vanderpump-rules/season/
> season-12?view=community`, `/shows/naked-and-afraid?view=community`
> authed. Both passes came back clean on auth/console/mobile-overflow
> mechanics (0 console errors, 0 failed requests, 0 horizontal overflow
> at 375px). 3 new findings filed (1 HIGH, 2 MED) — a fresh voice/spoiler
> flag on the just-shipped `too-few-to-call-it-all-stars` list, a fresh
> shape/canon duplication instance on vanderpump-rules S12, and an a11y
> heading-level issue on `/shows`. 3 further candidates each reproduced
> an already-open systemic finding on a new show/route (masterchef's
> `?view=community` canonical bug on naked-and-afraid, selling-sunset's
> season-detail `?view=community` no-op on vanderpump-rules, love-island-uk's
> mobile 7D-column drop on naked-and-afraid) — appended as confirming
> instances to the existing rows instead of filing duplicates, per §5
> dedup rule; two of those three bumped in severity given the
> now-confirmed systemic (component-level) scope.
> The HIGH is the second confirmed spoiler leak `/critique` has ever
> found (after pass-152's dragrace-uk Miss Congeniality reveal):
> Too Hot to Handle Season 6's page states outright, in four places,
> that the finale prize payout splits across multiple winning
> couples/a single rather than going to one couple — independently
> verified via external research as a finale-night group-vote outcome
> (not a pre-announced format twist), squarely a "finale outcome" under
> the site's own spoiler definition.
> `/march` Step 2's normal rate-limited cadence is active. Pass 154
> ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs` —
> headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. URL set: `/`, `/shows/american-ninja-warrior/
> season/the-tripleheader`, `/shows`, `/search`, `/themes` anon;
> `/u/e2e`, `/shows/american-ninja-warrior/season/the-tripleheader?view=
> community`, `/shows/survivor?view=canon`, `/shows/top-chef/season/
> carolinas?view=community` authed. Both passes came back mechanically
> clean (0 console errors, 0 failed requests, no mobile overflow, auth
> confirmed via `@e2e` chrome), and no spoiler leaks were found on any
> page. Self-assessment dropped four of six raw candidates as false
> positives after source verification: `/search` renders the homepage
> by design (Phase 29 middleware redirect retiring the standalone
> search page for the cmd+K overlay — not a bug); the home-hero vs
> `/shows`-hero "revised" date difference is two different, correctly
> computed metrics (one show's canon revision vs. catalog-wide latest),
> not staleness; `/shows/[show]/season/[slug]?view=community` is
> genuinely inert (the season page reads no `view` search param) but
> the product never links a season page with that param — an artifact
> of the pass's own URL construction, not a reachable defect; and the
> `/u/e2e` empty-state sparseness/footer-overlap observation contradicts
> four already-shipped critique passes (22/26/28/39) that deliberately
> minimized this exact surface — filing it again would be arguing
> against settled editorial intent, not a new defect. 2 findings filed
> (0 HIGH, 2 MED, 0 LOW), both independently corroborated by both the
> anon and authed pass on the same page: American Ninja Warrior S18's
> "three named qualifying regions" fact restated across six placements
> (location, lede, format_caption, episode_label, body, and canon.md),
> and a host-name spelling mismatch (`Gbajabiamila` in the HOST field
> vs `Gbaja-Biamila` in its own caption) on the same season page.
>
> Pass 153 (2026-09-05, commit dedb99b7) ran in the cloud loop via
> Path A2, both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. URL set: `/shows/traitors/season/ardross-2026`,
> `/shows/the-voice/season/the-finale`, `/shows/big-brother?view=canon`,
> `/shows/below-deck-mediterranean/season/dubrovnik-ii`, `/themes` anon;
> `/u/e2e`, `/shows/traitors/season/ardross-2026?view=community`,
> `/shows/big-brother/season/a-summer-of-mystery?view=community`,
> `/shows/naked-and-afraid/season/the-active-season?view=community`
> authed. Both passes came back mechanically clean (0 console errors,
> 0 failed requests, no overflow, all 200s, auth confirmed via
> `@e2e` chrome) and no spoiler leaks were found on any of the nine
> pages, including The Voice's series-finale season page. 6 findings
> filed (2 HIGH, 3 MED, 1 LOW): the tracked cross-field repetition
> pattern (same fact restated near-verbatim across the "shape of the
> season" and "where it sits in the canon" sections) reproduced on
> three brand-new shows this pass — `traitors`, `below-deck-mediterranean`,
> and `naked-and-afraid` — corroborated independently on `traitors` by
> both the anon and authed passes on the same page. Given three fresh
> instances in one pass, the naked-and-afraid finding's suggested fix
> flags that the standing season-fill drain row may want a
> template-level content-check invariant rather than continuing to
> patch discovered instances one at a time. One MED SEO finding:
> the-voice's finale-season `meta_description` is truncated mid-clause
> in the source HTML (not a capture artifact). One MED comprehension
> finding: big-brother's newest season opens "THE TAKE" on a comparison
> to a season not yet named, unresolved until three sections later. One
> LOW: a new instance of the already-tracked "Aired" vs. "Premiered"
> eyebrow terminology drift, this time on traitors's newest season. The
> old pass-152 metadata below is retained for history; see it for that
> pass's own findings and the dragrace-uk spoiler-leak context.
>
> --- pass 152 metadata (superseded) ---
> Last pass: 2026-09-05 at commit 9b014bce
> Pass count: 152
> Rotated to a fresh URL set:
> `/`, `/shows/dragrace-uk/season/series-7`, `/shows`,
> `/shows/shark-tank?view=canon`, `/themes/best-villain-editing`
> anon; `/u/e2e`, `/shows/jersey-shore/season/the-final-season?view=community`,
> `/shows/southern-charm/season/season-11?view=community`,
> `/shows/alone/season/arctic-ii?view=community` authed. Both passes
> came back mechanically clean on the walker's own checks (0 console
> errors, 0 failed requests, 0 mobile overflow, all pages 200) but
> the qualitative read surfaced a genuinely new class of finding:
> **the first confirmed spoiler leak `/critique` has found** —
> dragrace-uk series-7 names its Miss Congeniality winner outright,
> twice, which meets agents.md §7's "winners" spoiler definition
> regardless of the season having aired. 6 findings filed (1 HIGH,
> 4 MED, 1 LOW): the tracked
> headline-fact-repetition pattern reproduced on four new pages —
> dragrace-uk's newest series restates three separate facts (Pinewood
> filming location, episode-count/Lucky-Cow debut, simulcast timing)
> across 2-3 sections apiece; southern-charm's newest season restates
> both its cast-addition fact and its episode-count/reunion fact
> across four placements each; jersey-shore's final season restates
> its pregnancy fact plus a FILMED-caption bare-restatement of the
> same tracked class already fixed on rhony/queer-eye/hells-kitchen;
> and alone's newest Arctic season restates its "twelfth roster"
> framing across three sections. One LOW comprehension finding:
> alone's `eyebrow` field says "Aired" where every other sampled
> season (and the page's own PREMIERED detail field) says "Premiered"
> — a small but real terminology drift. One dropped candidate at
> self-assessment: the anon pass flagged the walker's own 4000-char
> capture cap as limiting repetition-scan coverage on long pages
> (`/shows`, `/shows/shark-tank`) — this is a critique-tooling
> observation, not a site defect, so it wasn't filed as a Pending row;
> worth a future `scripts/critique-walk.mjs` improvement if it recurs.
> passes came back mechanically clean (0 console errors, 0 failed
> requests, 0 mobile overflow, all pages 200, no spoiler leaks). 5
> findings filed (2 HIGH, 2 MED, 1 LOW): Survivor 50's season page
> restates its two headline facts (the fan-voted format, the
> 24-returnee record cast) across four to six sections apiece with
> almost no new angle added each time — the most severe single-page
> repetition instance found to date, filed as two rows (one per
> fact chain); the "WHY THIS SLOT re-paraphrases body copy" systemic
> row (tracked since top-chef/bake-off, four shows drained this
> week) reproduced on The Amazing Race's canon page — a fifth show,
> not yet in the drain; big-brother's newest season restates "three
> stacked twists" four times before the watch-for section even
> lists them individually; top-chef's newest season restates its
> Last Chance Kitchen entry-rule change five times, crowding out any
> other characterization of the season. Two reader observations
> dropped at self-assessment: a low-confidence text-extraction
> artifact on the Amazing Race canon page's tab/badge spacing
> (same class dropped at pass 149 — can't distinguish real bug from
> whitespace-in-DOM-extraction without a visual check); and
> Survivor 50's community page reading "0 votes" under "community
> rank updates weekly" copy (same class dismissed at pass 149 as
> plausibly expected test-account state, not a bug).
>
> ───── Pass 150 metadata kept below for history ─────

> Last pass: 2026-09-03 at commit 4dbdea4f
> Pass count: 150
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass 150
> ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs` —
> headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. Rotated to a fresh URL set:
> `/`, `/shows/survivor/season/survivor-50`, `/shows`,
> `/shows/amazing-race?view=canon`, `/themes` anon;
> `/u/e2e`, `/shows/survivor/season/survivor-50?view=community`,
> `/shows/big-brother/season/a-summer-of-mystery?view=community`,
> `/shows/top-chef/season/carolinas?view=community` authed. Both
> passes came back mechanically clean (0 console errors, 0 failed
> requests, 0 mobile overflow, all pages 200, no spoiler leaks). 5
> findings filed (2 HIGH, 2 MED, 1 LOW): Survivor 50's season page
> restates its two headline facts (the fan-voted format, the
> 24-returnee record cast) across four to six sections apiece with
> almost no new angle added each time — the most severe single-page
> repetition instance found to date, filed as two rows (one per
> fact chain); the "WHY THIS SLOT re-paraphrases body copy" systemic
> row (tracked since top-chef/bake-off, four shows drained this
> week) reproduced on The Amazing Race's canon page — a fifth show,
> not yet in the drain; big-brother's newest season restates "three
> stacked twists" four times before the watch-for section even
> lists them individually; top-chef's newest season restates its
> Last Chance Kitchen entry-rule change five times, crowding out any
> other characterization of the season. Two reader observations
> dropped at self-assessment: a low-confidence text-extraction
> artifact on the Amazing Race canon page's tab/badge spacing
> (same class dropped at pass 149 — can't distinguish real bug from
> whitespace-in-DOM-extraction without a visual check); and
> Survivor 50's community page reading "0 votes" under "community
> rank updates weekly" copy (same class dismissed at pass 149 as
> plausibly expected test-account state, not a bug).
>
> ───── Pass 149 metadata kept below for history ─────

> Last pass: 2026-08-31 at commit 9ea56bcd
> Pass count: 148
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass 148
> ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs` —
> headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. Rotated to a fresh URL set:
> `/`, `/shows/traitors-uk/season/series-4`, `/shows`,
> `/themes/best-reunion-specials`, `/shows/hells-kitchen?view=canon`
> anon; `/u/e2e`, `/shows/traitors-uk/season/series-4?view=community`,
> `/shows/hells-kitchen/season/battle-of-the-states?view=community`,
> `/shows/chopped?view=community` authed. Both passes came back
> mechanically clean (0 console errors, 0 failed requests, 0 mobile
> overflow, all pages 200, no spoiler leaks). The 2026-08-31 signed-in
> vote-pair zero-state fix (issue #799) was spot-checked live on two
> community pages — holds, no stacking regression. 6 findings filed
> (0 HIGH, 4 MED, 2 LOW): the meta-description-echoes-lede systemic
> row (pass-141/146/147) reproduced twice more, on hells-kitchen's
> canon page and traitors-uk series-4 — now 7 confirmed pages, folded
> into the existing HIGH row rather than filed separately;
> hells-kitchen canon's "WHY THIS SLOT" callout re-paraphrases its own
> season body copy almost verbatim, a third instance of the same
> pattern already tracked on top-chef and bake-off; traitors-uk
> series-4's "shape of the season" and "where it sits in the canon"
> sections repeat a near-identical sentence with only a word or two
> swapped; hells-kitchen's battle-of-the-states FILMED stat caption
> bare-restates its own value line, a third instance of the
> bare-restatement-caption pattern already tracked on rhony and
> queer-eye; traitors-uk series-4's breadcrumb labels the season
> "SEASON 4" while the rest of the page correctly uses "Series" (the
> UK format's own vocabulary); and the season's rank-scale widget
> (peak/here/tail) has no accessible text summary of the actual
> position, relying entirely on visual placement. One LOW finding
> also flags traitors-uk series-4's PREMIERED date (Jan 1, 2026) as a
> suspicious placeholder needing data verification, not just a copy
> issue.
>
> ───── Pass 147 metadata kept below for history ─────

> Last pass: 2026-08-26 at commit 5bb341ce
> Pass count: 147
> Gated: NO — the vote-pair pre-vote triple-stack HIGH (pass-146/147)
> was cleared 2026-08-31 (cloud march tick, fa5c614f, issue #799),
> satisfying the "/iterate clears at least one HIGH" re-dispatch
> condition. 1 pending HIGH finding remains queued (the
> meta-description-echoes-lede defect, confirmed on 5 pages across
> 3 passes) — still eligible for a future `/iterate` pick, but no
> longer blocks `/march` Step 2 from re-dispatching `/critique`.
> Pass 147 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh isolated
> context, no Chrome MCP needed), both anon and authed passes with a
> freshly-minted `CRITIQUE_SESSION_COOKIE`. Rotated to a fresh URL
> set: `/`, `/shows/rhony/season/the-second-act`, `/shows`,
> `/themes/one-rule-fills-every-seat`, `/shows/summer-house?view=canon`
> anon; `/u/e2e`, `/shows/rhony/season/the-second-act?view=community`,
> `/shows/summer-house/season/overhaul-summer?view=community`,
> `/shows/bake-off?view=community` authed. Both passes came back
> mechanically clean (0 console errors, 0 failed requests, 0 mobile
> overflow, all pages 200, no spoiler leaks). 4 findings filed this
> pass, 2 new + 2 bumps of existing pass-146 systemic rows (0 new
> HIGH, 2 new MED, 2 rows bumped MED→HIGH): rhony/the-second-act's
> FILMED stat caption bare-restates its own value line, just
> reformatted from middot- to comma-separated — the same
> `isBareRestatement()` guard gap flagged on queer-eye at pass-146,
> now confirmed on a second show; bake-off's weekly community
> question is a run-on sentence nesting two comparisons with an
> unclear referent. The meta-description-echoes-lede systemic row
> (pass-141/146) reproduced a fifth time on rhony/the-second-act —
> bumped MED→HIGH since three rounds of per-page fixes have failed
> to stop recurrence and only a template-level guard will. The
> vote-pair pre-vote triple-stack row (pass-146) reproduced on two
> more shows (rhony, summer-house) — bumped MED→HIGH since it's now
> confirmed on every community-view page checked across two passes,
> making it the default first-vote experience sitewide.
>
> ───── Pass 146 metadata kept below for history ─────

> Last pass: 2026-08-26 at commit bbc5263b
> Pass count: 146
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass 146
> ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs` —
> headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. Rotated to a fresh URL set:
> `/`, `/shows/perfect-match/season/season-4`, `/shows`,
> `/shows/the-circle?view=canon`, `/themes/away-from-home-turf`
> anon; `/u/e2e`, `/shows/queer-eye/season/las-vegas?view=community`,
> `/shows/dragrace/season/season-18?view=community`,
> `/shows/chopped?view=community` authed. Both passes came back
> mechanically clean (0 console errors, 0 failed requests, 0 mobile
> overflow, all pages 200). 6 findings filed (0 HIGH, 4 MED, 2 LOW):
> perfect-match S4's crossover-casting fact restated across five
> sections of the same freshly-seeded page; its meta description
> truncated mid-sentence with a dangling ellipsis; the `/shows`
> index meta description echoing the on-page lede verbatim — the
> third recurrence of the pass-141 systemic defect after two rounds
> of per-page field fixes, suggesting the root cause needs a
> template-level fix rather than more one-off edits (the orphaned
> pass-141 row, marked resolved but never migrated, moved to Done
> in this pass); the community vote-pair's pre-vote state
> over-explaining "no vote yet" four ways on both queer-eye and
> dragrace season pages; queer-eye Las Vegas's FILMED stat caption
> bare-restating its own location value (drops only "USA"); and
> dragrace S18's HOST caption partially restating "RuPaul" before
> its one new fact. `/u/e2e`'s apparent missing sign-out control
> was checked against source (`HeaderView.tsx`) and found to be a
> false positive — Sign out exists behind an accessible,
> aria-labelled account-menu disclosure, just not visible in flat
> extracted page text — dropped, not filed.
>
> ───── Pass 145 metadata kept below for history ─────

> Last pass: 2026-08-26 at commit 36ad3e30
> Pass count: 145
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass 145
> ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs` —
> headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. Rotated to a fresh URL set:
> `/`, `/shows/big-brother/season/a-summer-of-mystery`, `/shows`,
> `/shows/love-is-blind?view=canon`, `/themes/best-location-reveals`
> anon; `/u/e2e`, `/shows/rhony/season/the-second-act?view=community`,
> `/shows/big-brother?view=community`,
> `/shows/love-is-blind?view=community` authed. Both passes came back
> mechanically clean (0 console errors, 0 failed requests, 0 mobile
> overflow, all pages 200). The authed reader cross-checked every
> candidate against standing precedent (RHONY's location/filming_caption
> pairing, the VotePair zero-state copy, the community zero-vote em-dash
> pattern, `/u/e2e`'s empty-profile state) and confirmed all are already
> adjudicated non-bugs — zero findings filed from that pass. The anon
> reader surfaced 2 candidates, both new and both filed (0 HIGH, 1 MED,
> 1 LOW): a MED a11y gap — the `/shows` tier-section headings render as
> bare `<h2>S</h2>` / `<h2>A</h2>` / `<h2>B</h2>` with no accessible
> label, unreadable out of context via a screen-reader heading-list scan
> — and a LOW copy mismatch — `love-is-blind?view=canon`'s mid-pack
> section header reads "worth watching again next week" though the
> shelf is static, not weekly-rotating (hardcoded in
> `CanonTierBand.tsx`'s per-tier copy map, not page-specific).
>
> ───── Pass 144 metadata kept below for history ─────

> Last pass: 2026-08-25 at commit bedc7788
> Pass count: 144
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass 144
> ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs` —
> headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. Rotated to a fresh URL set:
> `/`, `/shows/southern-charm/season/season-11`, `/themes`,
> `/search`, `/themes/the-fire-pit-never-moved` anon; `/u/e2e`,
> `/shows/masterchef/season/global-gauntlet?view=community`,
> `/shows/bachelor-in-paradise?view=community`,
> `/shows/rhop?view=community` authed. Both passes came back
> mechanically clean (0 console errors, 0 failed requests, 0 mobile
> overflow, all pages 200 in the Playwright capture). The anon
> reader's raw output surfaced 2 candidate findings; 1 was dropped on
> self-assessment: the `/search` route's 308 redirect to `/` is not a
> defect — `src/middleware.ts` documents it as a deliberate Phase 29
> decision ("`/search` retired in favor of the cmd+k overlay ...
> Permanent redirect so external links land somewhere sensible"),
> so filing a "give `/search` a real route" fix would reverse an
> already-shipped, intentional call rather than fix a bug. The authed
> reader independently confirmed the mobile 7D-column label swap
> flagged in earlier passes is deliberate component behavior, not a
> regression, and returned zero findings. 1 finding filed this pass
> (0 HIGH, 0 MED, 1 LOW): a LOW performance note that `/themes` now
> ships all 181 lists' full descriptions unpaginated on first paint
> (57KB+ of body text, 10-20x every other page walked this pass),
> with no lazy-load or virtualization past the three featured tiles.
>
> ───── Pass 142 metadata kept below for history ─────
>
> Last pass: 2026-08-24 at commit 949a34d3
> Pass count: 141
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass 141
> ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs` —
> headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. Rotated to a fresh URL set: `/`,
> `/shows/love-island-uk`, `/shows/survivor/season/survivor-50`,
> `/themes`, and `/about` anon; `/shows/love-island-uk?view=
> community`, `/u/e2e`, `/sign-in`, and `/shows/survivor?view=
> community` authed. One authed test URL was malformed by the
> dispatcher (`/shows/traitors-uk/season/04-series-4` — the real
> slug is `series-4`, no leading season number); the reader correctly
> traced it to a nonexistent slug via a live href grep, but the
> resulting 404/missing-metadata/console-error findings it produced
> were dropped as invalid rather than filed (confirmed by curling the
> correct `series-4` URL — 200 — and re-verified no such numbered-slug
> convention exists anywhere else in the routing). Both passes
> otherwise came back mechanically clean (0 console errors, 0 failed
> requests, 0 mobile overflow, all pages 200 with complete
> title/description/canonical/OG image) — 6 findings filed this pass
> (1 HIGH, 2 MED, 3 LOW): a HIGH reopening the pass-136 `/u/e2e/
> opengraph-image` 404 — the 2026-08-23 fix added `export const
> dynamic = 'force-dynamic'` on the theory the bug was permanent
> static-caching of a first-hit 404, but the route still 404s live
> right now with a confirmed-fresh `x-vercel-cache: MISS` / `age: 0`
> response, meaning the caching diagnosis was incomplete — the sibling
> `page.tsx` calls the identical `getProfileActivity({ handle })` and
> succeeds (200, populated profile), so the divergence is specific to
> the image route's execution context, not the caching layer; a MED
> systemic pattern — meta descriptions on `/shows/love-island-uk`,
> `/shows/survivor/season/survivor-50`, and `/themes` all reuse the
> page's own H1/lede copy near-verbatim (reordered clauses or a
> mid-sentence truncation with a dangling ellipsis on survivor-50)
> rather than standing as independent search-snippet summaries — one
> row covering all three pages since it's the same template-level
> defect, not three unrelated echoes; a MED on `/shows/survivor?view=
> community` where the visible APPROVAL % column sits beside a list
> still in canon order (not approval order) with no inline cue that
> the mirroring is intentional pre-threshold behavior; a LOW on
> survivor-50's `<title>` doubling "Survivor" instead of following the
> show-page branding pattern; a LOW on survivor-50's ambiguous
> "RETURNING CASTAWAYS ONLY" eyebrow (reads like an access restriction
> on first parse); and a LOW on Love Island UK's mobile community view
> dropping the 7D trend column while the page-level "voters, last 7
> days" stat stays visible, breaking the connection between the two.
>
> ───── Pass 140 metadata kept below for history ─────
>
> Last pass: 2026-08-24 at commit 9cc9376a
> Pass count: 140
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass 140
> ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs` —
> headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. Rotated to a fresh URL set: Amazing
> Race S38 (newest season) and Bake Off's Editor's Canon view, plus
> `/shows`, `/themes/best-finales`, `/shows/vanderpump-rules?view=
> community`, and `/u/e2e`. Both passes came back mechanically clean
> (0 console errors, 0 failed requests, 0 mobile overflow, all pages
> 200 with complete title/description/canonical/OG image) — all 5
> findings filed this pass are qualitative reads (2 MED, 3 LOW; 0
> HIGH): a three-way fact echo on Amazing Race S38 across meta
> description / shape-of-season body / what-to-watch-for bullets
> (casting, route, and format moments all restate the same clauses
> the body paragraph already states — a fresh instance of the
> corpus's ongoing slot_argument/watch_list echo drain, on a field
> pair not previously flagged); an undefined "◆ HOLD" community-trend
> badge on Bake Off's canon view (the component does carry a hover
> `title`/`aria-label` gloss for sighted-mouse and screen-reader
> users, but no visible legend for touch/mobile readers who can't
> hover); a canon-rank-vs-season-number visual pairing on the Amazing
> Race S38 "Adjacent in the Canon" links that reads as a mismatch at
> a glance even though it's intentional (rank and season number are
> decoupled by design); a lighter slot_argument/body echo on Bake
> Off canon's #1 slot (the "tent moved to Welford Park" clause); and
> a mixed-metaphor sentence (proximity + vertical framing in the same
> clause) in Vanderpump Rules' community weekly_question.
>
> ───── Pass 139 metadata kept below for history ─────
>
> Last pass: 2026-08-24 at commit ee526d1a
> Pass count: 139
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass 139
> ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs` —
> headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. Rotated to a fresh URL set: Survivor 50
> (the newest season, golden-pattern show) and Top Chef's Editor's
> Canon view, plus `/shows`, `/themes/best-newbie-casts`,
> `/shows/survivor?view=community`, and `/u/e2e`. Anon (5 URLs: `/`,
> `/shows/survivor/season/survivor-50`, `/shows`,
> `/themes/best-newbie-casts`, `/shows/top-chef?view=canon`) came back
> mechanically clean (0 console errors, 0 failed requests, 0 mobile
> overflow, no spoiler leaks) but surfaced two real content findings
> on Top Chef's canon page: the era-filter chips use two different
> labeling conventions on the same control row (`Padma era` — first
> name, no range — next to `Kish era (S21–S23)` — surname, with a
> range), and the Las Vegas (#1) slot's `slot_argument` callout
> repeats the exact same 13-word clause ("raised what a Quickfire was
> allowed to demand") verbatim from the body prose two lines above it
> — confirmed in `content/shows/top-chef/canon.md` lines 17–22 and
> 28/33–35, the same repetition-class defect already fixed at pass-93
> and pass-127 on this show's season pages. A third anon finding — the
> Survivor 50 season page's "placeholder, not a verdict" framing gives
> no forward pointer to when the canon position gets revisited — kept
> at LOW. Authed (4 URLs: `/shows/survivor/season/survivor-50`,
> `/shows/survivor?view=community`, `/themes/best-newbie-casts`,
> `/u/e2e`) confirmed auth chrome, vote-pair, and comment-input all
> reflect signed-in state correctly (nav shows `@e2e`, vote block
> shows authenticated copy) with zero console errors/failed
> requests/mobile overflow; `/u/e2e`'s empty state reads coherent, not
> broken. One kept: Survivor's community view shows "voters, last 7
> days · 0" directly above a ranking table where most rows already
> carry nonzero vote totals, which reads as contradictory against the
> page's own "live" framing (`src/components/canon/CommunityLiveStrip.tsx`).
> Two raw findings dropped after self-assessment: an aborted RSC
> prefetch to `/shows/survivor/season/cagayan` firing on every `/u/e2e`
> load is the browser canceling the prefetch behind the page's own
> "Start with Survivor →" CTA link (`pickFeaturedSeason` in
> `src/lib/profile/context.ts`) when the automated walk navigates away
> before it resolves — a session-timing artifact, not a product
> defect. The mobile season-page TOC's uppercase casing and "N
> sections" count (missing on desktop) is deliberate: `.toc-mobile-head`
> / `.toc-mobile-meta` in `src/styles/screens.css:803-814` explicitly
> set `text-transform: uppercase` as part of the mono-chrome mobile
> accordion pattern, distinct by design from the desktop serif TOC —
> not a bug.
>
> ───── Pass 138 metadata kept below for history ─────
>
> Last pass: 2026-08-23 at commit b856e2eb
> Pass count: 138
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass 138
> ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs` —
> headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. Rotated to a fresh URL set targeting the
> AGT off-by-one/watch_list fix and the one-rule-fills-every-seat
> reorder. Anon (5 URLs: `/`, `/shows/americas-got-talent/season/the-panel-holds`,
> `/shows/americas-got-talent`, `/themes/one-rule-fills-every-seat`,
> `/shows/rhoa/canon`) came back mechanically clean (0 console errors, 0
> failed requests, 0 mobile overflow, no spoiler leaks) but surfaced one
> real follow-on gap from the pass-137 judge-name fix: `canon.md`'s
> `tier_s_blurb` (the S-tier founding-era summary) still reads "a
> judging panel (Morgan, Osbourne, Hasselhoff, then Mandel)" with no
> mention of Brandy Norwood, who actually held the seat Osbourne is
> credited with for Season 1 — the pass-137 fix only touched the
> slot-#02 rationale, not this separate tier-level summary a few
> sections above it on the same page (MED — downgraded from the
> reader's initial HIGH; this is an omission in a five-season summary,
> not a wrong-season assertion). Authed (4 URLs:
> `/shows/americas-got-talent/season/the-panel-holds`,
> `/shows/americas-got-talent?view=community`,
> `/themes/one-rule-fills-every-seat`, `/shows/rhoa/canon`) confirmed
> auth chrome, vote-pair, and comment-input all reflect signed-in state
> correctly with zero console errors/failed requests/mobile overflow;
> the community weekly-question card's previously-fixed "cast it below"
> link still resolves correctly. Three raw findings dropped after
> self-assessment: the account-level "save (this device)" label is
> honest existing design (no account-sync save feature exists to link
> to, not a regression), the flattened vote-card copy sequence is a
> pattern-match artifact of reading rendered innerText linearly rather
> than DOM/ARIA structure (this exact copy has been iterated across
> passes 12/15/22/27/49/84/89/160 already, most recently pass-89 —
> re-litigating without new evidence isn't warranted), and all-zero AGT
> community vote counts reflect real (honest) data state, not a product
> bug. One kept — the community rank list's mobile breakpoint
> (`@media max-width: 640px`, `src/styles/canon.css:1099`) hides the
> `.col-bar` "Approval" text label but keeps the bare `.col-pct` "%"
> column visible, so the mobile column head reads an unlabeled "%" with
> no indication of what it measures (LOW — confirmed in source, same
> breakpoint that pass-104/#660 deliberately kept the approval number
> visible at 375px, just without carrying its own label down with it).
>
> ───── Pass 137 metadata kept below for history ─────
>
> Last pass: 2026-08-23 at commit ed0468ce
> Pass count: 137
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass 137
> ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs` —
> headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. Rotated to a fresh URL set targeting
> recently-drained content: RHOA S17, AGT S1, Big Brother S27, and the
> `the-anchor-count-set-the-ceiling` themed list. Anon (5 URLs: `/`,
> `/shows/rhoa/season/the-clean-slate`, `/shows/americas-got-talent/season/the-debut`,
> `/themes/the-anchor-count-set-the-ceiling`, `/shows/big-brother/season/a-summer-of-mystery`)
> came back mechanically clean (0 console errors, 0 failed requests, 0
> mobile overflow) but surfaced 3 real content bugs: a self-contradicting
> judge name on the AGT S1 page (MED — canon.md's slot #02 rationale
> still names Sharon Osbourne for Season 1 while the season file, lede,
> and watch_list all correctly name Brandy Norwood — the pass-127
> season-file fix never propagated to canon.md's separate rationale
> prose); RHOA S17's "zero returning anchors" fact restated near-verbatim
> across format_caption, body, and canon.md rationale (MED — same defect
> class the site already guards for episodes_caption/cast_size_caption,
> but format_caption has no equivalent bare-restatement check); and
> Big Brother S27's cast count phrased inconsistently as "16+ houseguests"
> (FORMAT) vs "17 players" (CAST SIZE) — internally consistent once you
> read the captions but presents two different headline numbers (LOW).
> Authed (5 URLs: `/`, `/u/e2e`, `/shows/rhoa/season/the-clean-slate`,
> `/shows/americas-got-talent?view=community`, `/shows/big-brother/season/a-summer-of-mystery`)
> came back clean on vote-state copy, profile rendering, and mobile
> reflow — one finding dropped after self-assessment (a single
> non-reproduced `/shows` RSC-prefetch abort on `/u/e2e`, the same
> `isRscPrefetchAbort()` false-positive class already tracked since
> pass-135); one kept — the community view's "live" label appears twice
> in immediate succession (tab caption + live-strip both read "live"
> with no differentiating copy between them) (LOW).
>
> ───── Pass 136 metadata kept below for history ─────
>
> Last pass: 2026-08-22 at commit bf578316
> Pass count: 136
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass 136
> ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs` —
> headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. Rotated to a fresh URL set outside the
> recent rotation. Anon (5 URLs: `/`, `/shows/amazing-race/season/season-38`,
> `/shows/love-is-blind`, `/themes`, `/themes/best-finales`) came back
> clean across both viewports — zero console errors/failed requests,
> zero mobile overflow, no spoiler leaks (including on the highest-risk
> `/themes/best-finales` surface), spoiler-safe methodology copy
> re-confirmed on Love Is Blind's canon block — 0 findings. Authed (4
> URLs: `/shows/top-chef/season/carolinas`, `/shows/alone/season/arctic-ii`,
> `/themes/best-hosting`, `/u/e2e`) surfaced 4 raw findings, 2 dropped
> after self-assessment: the `/u/e2e` mobile "failed request" was
> another `isRscPrefetchAbort()` false-positive class instance (see
> pass-135 note on the same root cause, already tracked, not a new
> site defect); the fourth ("couldn't exercise vote-pair post-click
> state — e2e bot account has never voted") is a testing-coverage gap,
> not a product bug, so not filed. Kept: a genuine live regression —
> `/u/e2e/opengraph-image` 404s in production (confirmed via direct
> `curl`, `x-matched-path: /_not-found`) even though the metadata
> wiring pass-134 shipped (threading `image: \`/u/${handle}/opengraph-image\``
> through `generateMetadata`) is present and unit tests for the route
> pass locally — isolated to this one route family, since
> `/shows/survivor/opengraph-image`, a season OG image, and a theme OG
> image all return 200 live (HIGH); and a fresh instance of the
> already-fixed-elsewhere mid-word meta-description truncation bug on
> Alone S12 "The Arctic II" (`...format confidence of a show in its
> twelfth…`, confirmed via curl against the live page, same defect
> class as the resolved DWTS S34 clip — MED).
>
> ───── Pass 135 metadata kept below for history ─────
>
> Last pass: 2026-08-22 at commit 89380f86
> Pass count: 135
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass 135
> ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs` —
> headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. Rotated to a fresh URL set outside the
> recent rotation. Anon (5 URLs: `/`, `/shows/the-voice/season/the-finale`,
> `/shows`, `/shows/vanderpump-rules`, `/themes/best-non-winning-runs`)
> surfaced 2 findings after self-assessment dropped a third — the
> reader's HOST/FILMED tile-caption flag on The Voice S29 was
> re-verified against source and found to be a false positive (both
> captions pair the tile value with genuinely new information — coach
> tenure, Ballerini's debut — matching the corpus's established
> "good" pattern, not the bare-restatement defect class). Kept: a
> genuine `slot_argument`/canon-body verbatim echo on Vanderpump
> Rules Season 1 ("SUR's actual chain of command as real stakes"
> repeated word-for-word across both fields), and a lighter
> eyebrow/lede conceptual echo on The Voice S29 (final-season +
> fourteen-year-run stated twice, paraphrased not verbatim — LOW).
> Authed (4 URLs: `/shows/queer-eye/season/washington-dc`,
> `/shows/selling-sunset/season/season-9`, `/u/e2e`,
> `/themes/best-comeback-seasons`) surfaced 4 findings, one dropped as
> a duplicate of the already-pending pass-128 tooling row (the
> `/u/e2e` mobile "failed request" was another `isRscPrefetchAbort()`
> false-positive class instance — a different aborted `_rsc` prefetch
> URL, same root cause already tracked, not a new site defect). Kept:
> a genuine FILMED-caption bare restatement on Queer Eye's Washington
> D.C. finale (caption re-lists the exact same three jurisdictions the
> value line already states, zero new information — downgraded
> HIGH→MED to match this defect class's established severity band,
> e.g. top-chef/carolinas), a Shape-of-Season/canon.md verbatim phrase
> echo on the same page ("Netflix announced the ending mid-production"
> repeated word-for-word), and a three-way Take/Shape/canon.md
> restatement of the same fact set on Selling Sunset Season 9
> (Vergara's arrival + the reunion's return after Season 8's gap +
> Tan France hosting, stated with only light rewording three times).
> Selling Sunset's own FILMED caption was checked and ruled clean (adds
> a genuine new detail, "the Sunset Strip," not present in the value
> line) — cited in the Queer Eye finding as the correct pattern by
> contrast. `/themes/best-comeback-seasons` was checked and ruled
> clean.
>
> ───── Pass 134 metadata kept below for history ─────
>
> Last pass: 2026-08-21 at commit 0afa78f7
> Pass count: 134
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass 134
> ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs` —
> headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. Rotated to a fresh URL set outside the
> recent rotation. Anon (5 URLs: `/`, `/shows/chopped/season/the-double-first`,
> `/shows/big-brother`, `/themes`, `/themes/best-premieres`) came back
> clean — zero console errors/failed requests, zero mobile overflow,
> no spoiler leaks, entry counts reconciled — 0 findings. Authed (4
> URLs: `/shows/dancing-with-the-stars/season/fall-2025`,
> `/shows/bachelor-in-paradise/season/costa-rica`,
> `/themes/no-one-got-a-night-off`, `/u/e2e`) surfaced 3 findings, all
> independently re-verified against source before filing: a mid-clause
> SEO description clip on DWTS S34 (the lede has no early clause
> boundary for `clipToSeoBudget` to land on, so it cuts mid-phrase);
> DWTS S34's canon.md slot-34 `slot_argument`/rationale paragraph
> confirmed near-verbatim identical to the season file's own body
> paragraph (word-swap level only) — same echo-defect class fixed
> repeatedly elsewhere, this is a fresh instance; and `/u/e2e`'s OG
> image confirmed still generic despite pass-89's row reading
> RESOLVED — source read shows `src/app/(default)/u/[handle]/opengraph-image.tsx`
> exists but `page.tsx`'s `generateMetadata` never threads an `image:`
> argument through to `buildMetadata()`, so the route is unreachable
> dead code, the same shadowing bug pass-69 fixed for shows/seasons/
> themes. Filed as a correction reopening the pass-89 claim rather
> than a duplicate. Bachelor in Paradise/Costa Rica and the
> no-one-got-a-night-off list were checked and ruled clean (distinct
> editorial arguments, correct entry-count reconciliation).
>
> ───── Pass 133 metadata kept below for history ─────
>
> Last pass: 2026-08-21 at commit 6f363180
> Pass count: 133
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass 133
> ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs` —
> headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. Both passes rotated to a fresh URL set
> not covered by pass 132 — sampling shows outside the
> vanderpump-rules/selling-sunset/summer-house/ink-master rotation.
> Anon (5 URLs: `/`, `/shows`,
> `/shows/married-at-first-sight-australia/season/season-13`,
> `/shows/queer-eye/canon`, `/themes/wealth-as-the-whole-pitch`) and
> authed (`/shows/dragrace-allstars/season/tournament-of-all-stars`,
> `/shows/below-deck-sailing-yacht/season/ibiza`,
> `/themes/tried-once-never-repeated`, `/u/e2e`) walks ran, desktop +
> mobile, zero console errors/failed first-party requests (one
> benign `_rsc` prefetch-abort pair on `/u/e2e` mobile, same known
> class already filtered for the homepage — not filed), zero mobile
> horizontal overflow across all sampled pages/viewports, no spoiler
> leaks (the MAFS Australia S13 Mel Schilling death mention is
> real-world context, not a plot spoiler). Auth handshake confirmed
> live (authenticated:cloud), `@e2e` handle rendered in header chrome
> on every authed URL; the vote block correctly rendered the
> authenticated-specific "YOU HAVEN'T VOTED YET" copy, distinct from
> the anon "sign in to vote" variant. Reader returned 3 anon + 5
> authed candidate findings. Cross-checked against already-tracked
> ground: the `wealth-as-the-whole-pitch` meta-description-overrun
> candidate (210 chars) is covered by the existing systemic
> `plan/AUDIT.md` row (roughly 155 of 181 themed lists exceed the
> char budget, deliberately parked for oversight) so it wasn't
> re-filed; a second "0 VOTES SO FAR" recurrence (dragrace-allstars +
> below-deck-sailing-yacht, both authed) corroborates the existing
> pass-129/132 Pending row rather than standing alone, folded in as
> further evidence (now 5 confirmed instances); the CAST SIZE/FORMAT
> stat-caption echo on dragrace-allstars was folded into that page's
> own lede/body/canon repetition finding rather than filed separately
> (same page, same defect class). 3 findings passed self-assessment
> as valid, actionable, non-duplicate and were filed as new rows (all
> MED): MAFS Australia S13's casting-breakdown/Mel-Schilling-tenure
> fact restated across five fields including a verbatim lede/body
> sentence duplicate; dragrace-allstars/tournament-of-all-stars'
> "eighteen queens, three brackets" fact restated across six fields;
> below-deck-sailing-yacht/ibiza's "island energy"/"functional close"
> phrasing duplicated between Shape-of-Season and the canon
> rationale.
>
> ───── Pass 132 metadata kept below for history ─────
>
> Last pass: 2026-08-21 at commit 2bb1d944
> Pass count: 132
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass 132
> ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs` —
> headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. Both passes rotated to a fresh URL set
> not covered by pass 131 — sampling shows outside the recent
> love-island-uk/hells-kitchen/jersey-shore/love-is-blind rotation
> (vanderpump-rules, selling-sunset, summer-house, ink-master) plus
> unvisited themes and `/u/e2e`. Anon (5 URLs: `/`, `/shows`,
> `/shows/vanderpump-rules/season/season-12`,
> `/shows/selling-sunset/season/season-9`,
> `/themes/twice-in-one-year`) and authed
> (`/shows/summer-house/season/overhaul-summer`,
> `/shows/ink-master/season/hometown-heroes`,
> `/themes/who-actually-got-the-vote`, `/u/e2e`) walks ran,
> desktop + mobile, zero console errors/failed first-party requests,
> zero mobile horizontal overflow across all sampled pages/viewports,
> no spoiler leaks. Auth handshake confirmed live
> (authenticated:cloud), `@e2e` handle rendered in header chrome on
> every authed URL; the vote block correctly rendered the
> authenticated-specific "YOU HAVEN'T VOTED YET" copy, distinct from
> the anon "sign in to vote" variant. Reader returned 1 anon + 3
> authed candidate findings. Most cross-checked against
> already-tracked ground: the anon meta-description-overrun candidate
> on `/themes/twice-in-one-year` is covered by the existing pass-105
> row's scope-correction (roughly 155 of 181 themed lists exceed the
> char budget; a dedicated mass-trim is already queued in
> `plan/AUDIT.md`, so a sixth single-URL instance wasn't re-filed).
> One authed candidate — a third independently-sampled season
> reading "0 VOTES SO FAR" — corroborates the existing pass-129
> Pending row rather than standing alone; folded into that row as
> new evidence, bumping its severity LOW→MED on the third
> recurrence. 2 findings passed self-assessment as valid, actionable,
> non-duplicate and were filed as new rows (both LOW): Summer House's
> FILMED stat-tile caption restates the page's own cast-turnover
> angle instead of carrying a location-specific fact (a fresh
> instance of the ongoing stat-caption-restatement drain, a
> different tile pairing than the previously-named FORMAT/EPISODES
> cases); and Ink Master's "Also appears in" module lists two
> near-duplicate list titles back to back, both about the same
> team-format-instability theme, reading as the same link twice to a
> reader scanning quickly.
>
> ───── Pass 131 metadata kept below for history ─────
>
> Last pass: 2026-08-21 at commit 2b9247a3
> Pass count: 131
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass 131
> ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs` —
> headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. Both passes rotated to a fresh URL set
> not covered by pass 130 — sampling shows outside the recent
> amazing-race/american-idol/bake-off/dragrace-allstars rotation
> (love-island-uk, hells-kitchen, jersey-shore, love-is-blind) plus
> unvisited themes and `/u/e2e`. Anon (5 URLs: `/`, `/shows`,
> `/shows/love-island-uk/season/summer-2026`,
> `/shows/hells-kitchen/season/battle-of-the-states`,
> `/themes/the-calendar-moved-the-format-didnt`) and authed
> (`/shows/jersey-shore/season/the-final-season`,
> `/shows/love-is-blind/season/columbus`,
> `/themes/the-judging-table-never-got-to-coast`, `/u/e2e`) walks ran,
> desktop + mobile, zero console errors/failed first-party requests
> (one low-confidence aborted RSC prefetch on `/u/e2e`, assessed as
> benign navigation noise and not filed)/mobile overflow across both,
> no spoiler leaks. Auth handshake confirmed live
> (authenticated:cloud), `@e2e` handle rendered in header chrome on
> every authed URL; `/u/e2e` correctly shows a zero-vote "No votes
> yet" empty state consistent with the test account's actual
> activity. Reader returned 2 anon + 3 authed candidate findings; 4
> passed self-assessment as valid, actionable, non-duplicate findings
> (1 HIGH, 3 MED) and were filed; the aborted-RSC-fetch candidate was
> dropped as non-actionable noise per the reader's own low-confidence
> flag. Findings: a genuine code-level bug — the season page "Shape
> of the season" (Section 02) H2 is a hardcoded literal
> ("A rhythm worth tracking.") in `page.tsx`, not per-season content
> like Section 01's `take_h2`-driven H2, so it renders identically
> across the entire catalog; Love Island UK S13 word-pool echo
> (machine/rhythm/settle repeated across take_h2/lede/pull/body);
> Love Is Blind Columbus `format_caption`/`episodes_caption` field
> mixup (episode-count copy misfielded onto the format stat, no
> `episodes_caption` set at all); and a take_h2-vs-body phrase-echo
> pattern confirmed on two season files at once (Jersey Shore S6
> "victory lap, not a reinvention" and Love Is Blind Columbus
> "bounce-back"/"buy-in").
>
> ───── Pass 130 metadata kept below for history ─────
>
> Last pass: 2026-08-20 at commit 286116bb
> Pass count: 130
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass 130
> ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs` —
> headless chromium, fresh isolated context, no Chrome MCP needed),
> both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. Both passes rotated to a fresh URL set
> not covered by pass 129 — sampling shows outside the recent
> big-brother/real-world/southern-charm/project-runway rotation
> (amazing-race, american-idol, bake-off, dragrace-allstars) plus
> unvisited themes and `/u/e2e`. Anon (5 URLs: `/`, `/shows`,
> `/shows/amazing-race/season/season-38`,
> `/shows/american-idol/season/the-nashville-round`,
> `/themes/the-place-fought-back`) and authed
> (`/shows/bake-off/season/the-hammond-continues`,
> `/shows/dragrace-allstars/season/season-11`,
> `/themes/the-host-never-walks-into-the-room`, `/u/e2e`) walks ran,
> desktop + mobile, zero console errors/failed first-party
> requests/mobile overflow across both, no spoiler leaks. Auth
> handshake confirmed live (authenticated:cloud), `@e2e` handle
> rendered in header chrome on every authed URL; `/u/e2e` correctly
> shows a zero-vote "No votes yet" empty state consistent with the
> test account's actual activity. Reader returned 2 anon + 3 authed
> candidate findings; all 5 passed self-assessment as valid,
> actionable, non-duplicate MED findings and were filed (no HIGH,
> no LOW this pass — cap of 6 not reached). Findings: amazing-race
> S38 season-file/canon.md echo; american-idol S24 FILMED
> stat-caption bare-restatement; bake-off S16 lede/body echo;
> dragrace-allstars S11 three-way mechanic repetition
> (lede/body/canon); and a systemic finding — `cast_size_caption`
> bare-restates `cast_size` on 129 of 711 season files across 19
> shows, the same defect class as the already-fixed
> `episodes_caption` invariant but on an uncovered sibling field.
>
> ───── Pass 129 metadata kept below for history ─────
>
> Last pass: 2026-08-20 at commit e5f2a226
> Pass count: 129
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 129 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP
> needed), both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. Both passes rotated to a fresh URL
> set not covered by pass 128 — sampling shows outside the recent
> shark-tank/alone/the-circle rotation (big-brother, the-real-world,
> southern-charm, project-runway) to widen corpus coverage. Anon
> (5 URLs: `/`, `/shows`,
> `/shows/big-brother/season/a-summer-of-mystery`,
> `/shows/the-real-world/season/atlanta`,
> `/themes/never-starts-cold`) and authed
> (`/shows/southern-charm/season/season-11`,
> `/shows/project-runway/season/new-york-2025`,
> `/themes/never-starts-cold`, `/u/e2e`) walks ran, desktop +
> mobile, zero console errors/failed first-party requests/mobile
> overflow across both (one benign `_rsc` prefetch teardown abort
> on `/u/e2e`, already tracked as the pass-128 LOW tooling row —
> not re-filed), no spoiler leaks. Auth handshake confirmed live
> (authenticated:cloud), `@e2e` handle rendered in header chrome
> on every authed URL. Reader returned 4 anon + 6 authed candidate
> findings. Two candidates were dropped on self-assessment: the
> `/shows` H1 pun ("All shows. Tiered.") reads as a deliberate,
> mild brand-voice flourish rather than a defect, and the vote-pair
> post-click/delta-animation coverage gap was filed as a tooling
> note only (no product defect, not actionable by a content/code
> fix — dropped, not filed). **6 new findings filed** (all
> Pending, 2 HIGH, 3 MED, 1 LOW): own-profile `/u/e2e` silently
> omits the viewer's own held-for-review comment (present on the
> season-page thread, absent on the profile's "Recent comments"
> list — the two surfaces disagree about the same comment's
> existence); Project Runway's "Adjacent in the canon" module
> renders ambiguous same-titled "New York" links for six different
> seasons with no disambiguating year/number, because no season
> in the entire catalog sets a `tag` field; a lede/body echo +
> triple-repeated fact list on `the-real-world`'s Atlanta season
> (same defect class fixed on shark-tank/alone/the-circle, now
> confirmed corpus-wide rather than isolated); a quadruple-repeated
> three-mechanic list on `big-brother`'s "A Summer of Mystery"
> season (same defect class fixed on survivor-50); a repeated
> "footing" clause across `southern-charm` S11's take headline and
> subtext; and a LOW zero-vote-state framing note ("0 VOTES SO
> FAR" reads as an empty feature rather than an invitation) on
> both freshly-sampled season pages. No pending HIGH previously
> queued for iterate before this pass.
>
> ───── Pass 128 metadata kept below for history ─────
>
> Last pass: 2026-08-16 at commit 324b68c9
> Pass count: 128
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 128 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP
> needed), both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. Both passes rotated to a fresh URL
> set not covered by pass 127 — this time deliberately sampling
> shows outside the recent survivor/top-chef/traitors/AGT rotation
> (shark-tank, alone, the-circle) to check whether recently-fixed
> defect classes (lede/body echo, host_caption ordinal misuse) are
> corpus-wide or were isolated to the shows repeatedly sampled.
> Anon (5 URLs: `/`, `/shows`,
> `/shows/shark-tank/season/season-17`,
> `/shows/alone/season/arctic-ii`, `/themes/best-finales`) and
> authed (`/shows/shark-tank/season/season-17`,
> `/shows/alone/season/arctic-ii`, `/themes/best-finales`,
> `/shows/the-circle/season/disrupter-mode`, `/u/e2e`) walks ran,
> desktop + mobile, zero console errors/failed first-party
> requests/mobile overflow across both (one benign `_rsc` prefetch
> teardown abort on `/u/e2e`, see the LOW tooling row below), no
> spoiler leaks. Auth handshake confirmed live (authenticated:cloud),
> `@e2e` handle rendered in header chrome on every authed URL.
> Reader returned 4 anon + 5 authed candidate findings. Two anon
> candidates (FORMAT-tile field-semantics drift between shows;
> the "What to watch for" section missing on Alone) were dropped
> on verification — both trace to legitimate per-show/per-season
> optional-field variance (Alone S12 genuinely has no `watch_list`
> authored; `format_summary` vs `format_caption` usage isn't a
> documented contract), not defects. One LOW anon candidate
> (season-page `<title>` "Season 17" vs "S12" formatting) was
> dropped as a false positive — `seasonDisplayTitle()`
> (`src/app/shows/[show]/season/[slug]/page.tsx:111`) already
> handles this intentionally and correctly per two prior critique
> passes (68, 73), documented in the surrounding code comments.
> One authed candidate (vote-pair post-click/delta state
> unverifiable because the bot account has never voted) was
> dropped as critique-coverage meta-commentary, not a site defect.
> The authed HIGH lede/body-echo candidate on shark-tank and the
> anon MED version of the same finding, plus a third instance
> found on the-circle, were merged into one HIGH row covering all
> three pages, since all three verified as the identical defect
> class (body paragraph re-deriving the lede's own sentence with
> light word-swapping) with a 3/3 hit rate on a previously
> unsampled set — filed as a corpus-wide-suspect finding rather
> than three separate rows. **3 new findings filed** (all Pending,
> 1 HIGH, 1 MED, 1 LOW): the systemic lede/body near-verbatim echo
> above; Alone's `host_caption` token misapplied to Colby
> Donaldson, a host who joined mid-run at S7 (not S1), inflating
> his tenure ordinal on 6 season files (S7-S12) — same documented
> bug class already fixed on `americas-got-talent` and
> `americas-next-top-model`; and a LOW tooling fix to
> `scripts/critique-walk.mjs`'s `isRscPrefetchAbort()` filter,
> which only suppresses the homepage-link prefetch-abort noise
> class and lets the same noise resurface as a "new" finding on
> any other page with an outbound `Link` prefetch. No pending HIGH
> previously queued for iterate before this pass.
>
> ───── Pass 127 metadata kept below for history ─────
>
> Last pass: 2026-08-15 at commit 257a2d51
> Pass count: 127
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 127 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP
> needed), both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. Both passes rotated to a fresh URL
> set not covered by pass 126. Anon (5 URLs:
> `/shows/survivor/season/survivor-50`,
> `/shows/top-chef/season/carolinas`,
> `/shows/traitors/season/ardross-2026`,
> `/themes/the-cast-outgrew-the-format`,
> `/shows/americas-got-talent/season/the-panel-doubles-down`) and
> authed (`/shows/traitors?view=community`,
> `/shows/survivor/season/survivor-50`,
> `/themes/one-rule-fills-every-seat`,
> `/shows/top-chef/season/carolinas`,
> `/shows/americas-got-talent/season/the-panel-doubles-down`)
> walks ran, desktop + mobile, zero console errors/failed
> first-party requests/mobile overflow across both, no spoiler
> leaks. Auth handshake confirmed live (authenticated:cloud),
> `@e2e` handle rendered in header chrome on every authed URL.
> Reader returned 6 anon + 3 authed candidate findings; two anon
> candidates were dropped as weak/dependent-on-a-sibling-finding
> (a themed-list echo of the survivor-50 cast-size fact, purely
> derivative of the filed survivor-50 row) or merged (a
> single-season AGT watch_list gap folded into the broader
> systemic 0/21-file version from the authed pass), and one anon
> candidate (the AGT ordinal contradiction) was merged with an
> authed candidate (the same page's 3-field Golden-Buzzer/
> Callbacks echo) into one HIGH row since both trace to the same
> season file + canon.md rationale and a single content pass
> would naturally fix both. **5 new findings filed** (all
> Pending, 1 HIGH, 3 MED, 1 LOW): AGT S21 "The panel doubles down"
> compounds an outright ordinal contradiction (Take says the
> Golden-Buzzer twist happens "for the first time," Shape/Canon
> both say "for the third time") with a 3-field near-verbatim
> repetition of the same Golden-Buzzer/Callbacks fact set across
> lede/body/canon.md rationale; Top Chef Carolinas repeats its
> filming-location facts across three separate field-pairs
> (lede/Shape-body verbatim clause, plus the FILMED tile caption
> self-restating its own value line) — a third distinct repetition
> instance on a page that already has one pending LOW row for the
> same defect class; Survivor 50's lede and Shape-of-the-Season
> body restate the same cast-size framing near-verbatim, the site's
> newest/highest-traffic page accumulating yet another instance of
> a defect class several prior passes have already fixed elsewhere
> on the same page; Traitors Ardross 2026 repeats "on merit" and a
> "hasn't had the time" clause across three consecutive sections
> (Take, Shape, Canon), with Take itself restating the idea twice
> in two sentences; and America's Got Talent's entire 21-season
> catalog has no `watch_list` field at all (confirmed
> catalog-wide, 0/21), so no AGT season page ever renders the
> sibling-established "What to watch for" section. One anon
> candidate was dropped as purely derivative (a themed-list entry
> echoing the filed Survivor 50 cast-size fact, not an independent
> defect). No pending HIGH previously queued for iterate before
> this pass — the one HIGH row filed this pass is new and now
> competes normally.
>
> ───── Pass 125 metadata kept below for history ─────
>
> Last pass: 2026-08-15 at commit 5457dcb7
> Pass count: 125
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 125 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP
> needed), both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. Anon (5 URLs: `/`,
> `/shows/traitors/season/ardross-2026`, `/shows`,
> `/themes/one-rule-fills-every-seat`,
> `/shows/below-deck-down-under/season/canouan`) and authed
> (`/u/e2e`, `/shows/perfect-match/season/season-4`,
> `/shows/traitors?view=community`,
> `/themes/one-rule-fills-every-seat`, `/sign-in`) walks ran,
> desktop + mobile, zero console errors/failed first-party
> requests/mobile overflow across both, no spoiler leaks;
> `/sign-in` correctly redirected the already-signed-in visitor to
> `/`. Auth handshake confirmed live (authenticated:cloud). **5 new
> findings filed** (all Pending, 0 HIGH, 3 MED, 2 LOW): US
> Traitors S4's eyebrow line repeats verbatim as the opening
> sentence of the body paragraph, the same defect class as the
> already-fixed traitors-uk "castle included" echo; Below Deck
> Down Under Canouan's season-file body and `canon.md` Season 4
> rationale — both rendering on the same season page — restate
> the same crew/Seychelles/RHOSLC-crossover facts near-verbatim;
> Perfect Match S4 restates its two headline facts (shortest run,
> biggest cast) across five-plus separate fields (`lede`,
> `cast_size_caption`, `format_changes`, `episodes_caption`, two
> `watch_list` entries, and the body paragraph); US Traitors S4's
> `format_summary`/`format_caption` pair restates "all-celebrity"
> with no new fact added; and the recently-extended
> `one-rule-fills-every-seat` themed list seats two consecutive
> America's Next Top Model entries (#16, #17) at its tail, on top
> of the already-pending general over-concentration finding for
> the same list. One reader-surfaced observation was assessed and
> dropped: the authed pass's Traitors community-view "0% approval
> on a 0-vote, rank-1 row" read as a contradiction, but
> `CommunityRankList.test.tsx`'s pass-117/118 regression guard
> confirms honest-zero-not-em-dash is the deliberate, already-
> tested behavior for zero-vote rows — not a bug. Two further
> observations (failed first-party RSC prefetch on `/u/e2e`, both
> viewports) were dropped as the same long-documented benign
> Link-prefetch-teardown artifact noted on multiple prior passes.
> No pending HIGH competes for iterate.
>
> ───── Pass 124 metadata kept below for history ─────
>
> Last pass: 2026-08-15 at commit 7159f961
> Pass count: 124
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 124 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP
> needed), both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. Anon (5 URLs: `/`,
> `/shows/traitors-uk/season/series-1`, `/shows`,
> `/themes/the-calendar-moved-the-format-didnt`,
> `/shows/top-chef/season/carolinas`) and authed (`/u/e2e`,
> `/shows/traitors-uk/season/series-1`,
> `/shows/top-chef?view=community`,
> `/themes/the-calendar-moved-the-format-didnt`, `/sign-in`) walks
> ran, desktop + mobile, zero console errors/failed first-party
> requests/mobile overflow across both, no spoiler leaks;
> `/sign-in` correctly redirected the already-signed-in visitor to
> `/`. Auth handshake confirmed live (authenticated:cloud). **3 new
> findings filed** (all Pending, LOW, none HIGH/MED): traitors-uk
> series-1's "castle included" closing clause repeats verbatim
> between the season file's `lede` and the show's `canon.md`
> Series 1 rationale, both of which render on the same season
> page; Top Chef Carolinas' Last Chance Kitchen re-entry-delay
> fact repeats near-identically across four separate fields
> (`pull`, `format_caption`, the body paragraph, and the Ep 6
> `watch_list` entry); and Top Chef's community view renders an
> em-dash in every row of the "7D" column with no inline
> explanation, while the actual explanation ("deltas populate
> once weekly updates start producing them") sits in a separate
> block well above the table. Three reader-surfaced observations
> were assessed and dropped: a failed first-party RSC prefetch
> request on `/u/e2e` (long-documented benign Link-prefetch-
> teardown artifact, dropped on multiple prior passes); the
> `/themes/[theme]` "SAVE (THIS DEVICE)" label when authed
> (deliberate, already litigated and closed across three prior
> passes — #272, #377, #385); and a desktop-only visible
> run-together "Editor's CanonCURATED" tab label on Top Chef's
> community view (already litigated at pass-16 #215 — the
> accessible name was fixed via `aria-label`, the visual lockup
> was deliberately preserved as styled chrome). A fourth
> observation — the freshly-extended `the-calendar-moved-the-
> format-didnt` list's Shark Tank/Hell's Kitchen repeat entries —
> was dropped as already addressed same-day by the `ListDetailHero`
> unique-shows fix (7a71f9af), which the reader's own capture
> confirmed live in the stat block. No pending HIGH competes for
> iterate.
>
> ───── Pass 123 metadata kept below for history ─────
>
> Last pass: 2026-08-14 at commit d63bebc5
> Pass count: 123
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 123 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP
> needed), both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. Anon (5 URLs: `/`,
> `/shows/survivor/season/survivor-50`, `/shows`, `/themes`,
> `/themes/a-change-of-address`) and authed (`/u/e2e`,
> `/shows/survivor/season/survivor-50`,
> `/shows/top-chef?view=community`, `/themes/a-change-of-address`,
> `/sign-in`) walks ran, desktop + mobile, zero console
> errors/failed first-party requests/mobile overflow across both,
> no spoiler leaks; `/sign-in` correctly redirected the
> already-signed-in visitor to `/`. Auth handshake confirmed live
> (authenticated:cloud). **2 new findings filed** (both Pending,
> MED, none HIGH): Survivor 50's fan-vote mechanics list ("tribe
> colors, food rations, the final stretch") repeats across four
> separate fields on the same season page (`pull`,
> `format_caption`, a `watch_list` entry, and the body paragraph)
> — a side effect of the pass-115 fix that drew `format_caption`'s
> replacement text from `pull`; and the freshly-shipped
> `a-change-of-address` themed list's #1 and #2 entries (both
> Below Deck Down Under) open with near-duplicate "identity was/
> built its identity on Australian anchorages" phrasing back to
> back. One anon-pass observation from the reader sub-agent
> (curly vs. straight apostrophe inconsistency in `layout.tsx`/
> `(default)/page.tsx` meta descriptions and `tierLede.ts`) was
> reviewed and dropped — pass-24 #275's closure note explicitly
> carves out `layout.tsx` metadata and `(default)/page.tsx`
> metadata as intentionally keeping `&rsquo;` typography
> ("narrative editorial body copy... keeps its intentional
> `&rsquo;` typography — only the two CSS-uppercased label
> surfaces flipped"); re-filing would relitigate an already-
> adjudicated convention, not surface a bug. The two already-open
> Pending rows this pass's page set revisited (`/u/e2e` bare
> record scaffold, Top Chef community "voters this week" wording)
> were reconfirmed still open, not re-filed. No pending HIGH
> competes for iterate.
>
> ───── Pass 122 metadata kept below for history ─────
>
> Last pass: 2026-08-14 at commit f7baa2c9
> Pass count: 122
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 122 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP
> needed), both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. Anon (5 URLs: `/`,
> `/shows/survivor/season/survivor-50`, `/themes`,
> `/shows/top-chef/season/carolinas`,
> `/themes/a-guest-spot-with-room-to-grow`) and authed (`/`,
> `/shows/survivor/season/survivor-50?view=community`, `/u/e2e`,
> `/shows/top-chef?view=community`) walks ran, desktop + mobile,
> zero console errors/failed first-party requests/mobile
> overflow across both, no spoiler leaks. Auth handshake
> confirmed live (authenticated:cloud) via `/api/auth/me`. **2 new
> findings filed** (both Pending, MED, none HIGH): a recurring
> stat-tile-duplication instance on Top Chef Carolinas (FORMAT
> value line restates the EPISODES tile's own count) and a
> "VOTERS THIS WEEK · 0" vs. nonzero per-row vote counts framing
> ambiguity on Top Chef's community view (verified non-bug —
> the aggregate is a trailing-7-day window, the per-row counts
> are all-time — but the two scopes aren't labeled, so the
> juxtaposition still reads as a contradiction). Two anon-pass
> observations from the reader sub-agent (Survivor 50's stuttered
> title, its meta-description clause truncation) were reviewed
> and dropped as duplicates of already-resolved rows — pass-73
> #476 fixed the exact title form now rendering as intended, and
> pass-100/114 already dispositioned the em-dash meta-description
> cutoff as documented `clipToSeoBudget()` clause-boundary
> behavior, not a bug. No pending HIGH competes for iterate.
>
> ───── Pass 121 metadata kept below for history ─────
>
> Last pass: 2026-08-14 at commit bf3b7f2f
> Pass count: 121
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 121 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP
> needed), both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. Anon (5 URLs: `/`,
> `/shows/chopped/season/season-1`, `/shows`,
> `/themes/one-rule-fills-every-seat`,
> `/themes/the-couch-kept-adding-chairs`) and authed (`/`,
> `/shows/chopped/season/season-1?view=community`, `/u/e2e`,
> `/shows/big-brother?view=community`) walks ran, desktop +
> mobile, zero console errors/failed first-party
> requests/mobile overflow across both, no spoiler leaks (both
> recently-extended themed lists read in full, all 17 entries
> each, no winner/elimination/finale exposure). Auth handshake
> confirmed live (authenticated:e2e) via `/api/auth/me`. **5 new
> findings filed** (all Pending, none HIGH): two MED a11y —
> themed-list entry titles aren't real headings (span, not h3,
> across both list templates), and the vote-pair caption
> microcopy fails WCAG AA contrast (3.27:1 vs 4.5:1 required);
> three LOW — home ships the full 68-show catalog inline on
> mobile before the themed-lists section, `/shows` B tier is one
> flat undifferentiated 54-show grid, and the two recently-
> extended themed lists over-concentrate entries in 2 shows each
> (35% of entries from 2 of 8-9 represented shows). All three
> pass-120 findings (trivial vote question, AGT host_caption,
> unmatched-route 404) confirmed already resolved — none
> competed as a pending HIGH.
>
> ───── Pass 120 metadata kept below for history ─────
>
> Last pass: 2026-08-13 at commit 161b72e1
> Pass count: 120
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 120 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP
> needed), both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. Anon (5 URLs: `/`,
> `/shows/the-ultimatum/season/season-4`,
> `/shows/americas-got-talent/season/the-panel-doubles-down`,
> `/themes/one-rule-fills-every-seat`, `/shows`) and authed
> (`/`, `/shows/below-deck-mediterranean/season/dubrovnik-ii`,
> `/shows/the-ultimatum?view=community`, `/u/e2e`) walks ran,
> desktop + mobile, zero console errors/failed first-party
> requests/mobile overflow across both, no spoiler leaks. Auth
> handshake confirmed live (authenticated:cloud) via
> `/api/auth/me`; The Ultimatum's community table correctly
> lists the freshly-drained Season 4 row with a sane zero-vote
> "movers" state. **3 new findings filed** (all Pending, none
> HIGH): a systemic MED — `voteQuestionFor()` produces a
> trivial "top N of N" vote question on every season page of
> the 17 catalogued shows whose total season count falls in
> [2,9]; a LOW — AGT S21's `host_caption` hardcodes a literal
> string instead of the `{seasonOrdinalWord}` macro every
> sibling file uses; a MED — unmatched top-level URLs (e.g.
> `/account`) fall through to Next's bare built-in 404 instead
> of the site's branded `(default)/not-found.tsx`, because no
> root-level `app/not-found.tsx` exists to catch routes outside
> every route group's subtree. Freshly-drained content (The
> Ultimatum S4, AGT S21/S19/S20 rename, Below Deck Med S11, the
> extended `one-rule-fills-every-seat` list) all re-verified
> clean — no leftover breakage from the recent content ticks.
>
> ───── Pass 119 metadata kept below for history ─────
>
> Last pass: 2026-08-13 at commit a9aed0fa
> Pass count: 119
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 119 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP
> needed), both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. Anon (5 URLs: `/`,
> `/shows/big-brother/season/a-summer-of-mystery`,
> `/shows/queer-eye/season/las-vegas`,
> `/themes/the-couch-kept-adding-chairs`, `/shows`) and authed
> (`/sign-in`, `/shows/selling-sunset/season/season-9`,
> `/shows/dragrace-uk?view=community`, `/`) walks ran, desktop +
> mobile, zero console errors/failed first-party requests/mobile
> overflow across both, no spoiler leaks. Auth handshake confirmed
> live (authenticated:cloud); /sign-in correctly redirects an
> already-authed visitor to the homepage rather than re-showing
> the form; comment composer and vote block on selling-sunset S9
> render their correct live authed states. The big-brother S27
> page (this catalog's spoiler-history hot spot) was re-walked
> specifically as a regression check: both prior fixes — the
> named-cameo leak (#659) and the format/cast-size headcount
> contradiction — hold on the live site, no new leak found. The
> already-known dragrace-uk zero-vote em-dash pattern reproduced
> again on the community table but is already tracked (Pending,
> MED, alongside big-brother + jersey-shore) and was correctly not
> re-filed. **Zero new findings — a clean pass**, the first
> no-findings pass since the episodes_caption/OG-image/em-dash
> sweep that ran through passes 116-118.
>
> ───── Pass 118 metadata kept below for history ─────
>
> Last pass: 2026-08-13 at commit ab85915f
> Pass count: 118
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 118 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP
> needed), both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. Anon (5 URLs: `/`,
> `/shows/jersey-shore/season/season-1`,
> `/themes/one-rule-fills-every-seat`, `/shows`,
> `/shows/too-hot-to-handle/season/original`) and authed
> (`/sign-in`, `/shows/jersey-shore/season/season-1`,
> `/shows/jersey-shore?view=community`, `/`) walks ran, desktop +
> mobile, zero console errors/failed first-party requests/mobile
> overflow across both, no spoiler leaks. Auth handshake confirmed
> live (`/api/auth/me` → signedIn:true); /sign-in correctly
> redirects an already-authed visitor; comment composer, vote
> block, and the pass-108 community-question link all render in
> their correct live states. 4 new findings filed (below): a MED
> on too-hot-to-handle S1's episodes_caption verbatim-duplicating
> the body sentence (same defect class as the ongoing pass-95/117
> episodes_caption drain, this file just hadn't been swept); a MED
> on `/shows` missing a bespoke OG image (third instance of the
> pass-69 #448 gap, after the still-open `/u/[handle]` row from
> pass-89); a LOW on jersey-shore S1's format_caption opening
> lowercase against the corpus-wide capitalized convention; and a
> MED on cross-surface zero-vote representation drift between the
> community rank table ("— — —") and the season-page vote block
> ("0 votes so far") describing the identical fact two different
> ways. 1 existing Pending row bumped LOW→MED after reproducing
> the same zero-vote em-dash defect on a second show (jersey-shore,
> alongside the pass-117 big-brother original).
>
> ───── Pass 113 metadata kept below for history ─────
>
> Last pass: 2026-08-11 at commit c9208ab4
> Pass count: 113
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 113 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP
> needed), both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. Anon (5 URLs: `/`,
> `/shows/the-challenge/season/vets-and-new-threats`, `/shows`,
> `/themes/the-command-held-for-ten-seasons-then-didnt`,
> `/shows/masterchef-australia/season/open-call`) and authed (`/`,
> `/shows/the-challenge/season/vets-and-new-threats`,
> `/shows/masterchef-australia/season/open-call`, `/u/e2e`,
> `/themes/the-command-held-for-ten-seasons-then-didnt`) walks ran,
> desktop + mobile, zero console errors/failed first-party
> requests/mobile overflow across both (the `/u/e2e` mobile RSC-
> prefetch abort recurred against two different hrefs this pass —
> same accepted noise class as passes 85/86/87/111/112, not
> refiled), no spoiler leaks, no stale "nine seasons" copy left
> over from the slug rename. 1 new finding filed (below): a MED —
> the-challenge S41's "shape of the season" body and its canon
> rationale both re-explain the same three-beat Performance
> Points/Lock In/Stake a Claim mechanic near-identically, a fresh
> instance distinct from the already-fixed lede/body echo on the
> same page. 2 existing Pending rows (both filed pass-111, both
> the-challenge S41 FILMED-stat duplication and masterchef-
> australia's seven-mention repetition) were independently
> reconfirmed by this pass's fresh walker with no awareness of
> either row — both bumped MED→HIGH per the standing
> reconfirmation-bump convention rather than filed twice.
>
> Pass 112 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP
> needed), both anon and authed passes with a freshly-minted
> `CRITIQUE_SESSION_COOKIE`. Anon (5 URLs: `/`,
> `/shows/below-deck-mediterranean/season/dubrovnik-ii`, `/shows`,
> `/themes`, `/themes/the-command-held-for-nine-seasons-then-didnt`)
> and authed (`/`,
> `/shows/below-deck-mediterranean/season/dubrovnik-ii`,
> `/shows/survivor`, `/u/e2e`,
> `/themes/the-command-held-for-nine-seasons-then-didnt`) walks ran,
> desktop + mobile, zero console errors/failed first-party
> requests/mobile overflow across both (aside from the RSC-prefetch
> abort on `/u/e2e`, dropped per the standing critique-tooling-noise
> ruling — same class as passes 85/86/87/111), no spoiler leaks. 2
> new findings filed (below), both independently reproduced by both
> the anon and authed passes: a HIGH — the freshly-extended
> `the-command-held-for-nine-seasons-then-didnt` themed list's URL
> slug still reads "nine-seasons" while the title/H1/description/
> body all say "ten seasons" (today's Below Deck Med S11 extend
> bumped the count without regenerating the slug); a MED — the
> same-day Below Deck Mediterranean S11 season page restates
> "Dubrovnik" across all four FILMED/FORMAT stat-tile value+caption
> pairs with almost no new information added. One existing Pending
> row (the recurring meta-description-overrun MED) was folded
> rather than duplicated: this pass's fifth independent recurrence
> (`the-command-held-for-nine-seasons-then-didnt`, 232 chars) was
> appended to the existing row.
>
> Pass 111 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed), both anon and authed
> passes with a freshly-minted `CRITIQUE_SESSION_COOKIE`. Anon
> (6 URLs: `/`, `/shows/masterchef-australia/season/open-call`,
> `/shows`, `/themes/the-calendar-moved-the-format-didnt`,
> `/shows/the-challenge/season/vets-and-new-threats`, `/themes`)
> and authed (`/`, `/shows/big-brother?view=community`, `/u/e2e`,
> `/shows/masterchef-australia/season/open-call`) walks ran,
> desktop + mobile, zero console errors/failed requests/mobile
> overflow across both, no spoiler leaks. 5 new findings filed
> (below): a HIGH — `/shows/the-challenge/season/vets-and-new-
> threats`'s lede and "shape of the season" section restate an
> identical sentence verbatim, the same defect class just fixed
> on masterchef-australia/open-call but unaddressed here; 3 MED —
> a rhetorical-template repeat across 3 of 4 entries on the
> freshly-shipped `the-calendar-moved-the-format-didnt` themed
> list, a redundant FILMED stat second line on the same Challenge
> season page, and a softer third-pass restatement finding on
> masterchef-australia/open-call (distinct from the two already-
> resolved verbatim echoes — this one spans seven independent
> mentions of the same two facts across eyebrow/take/shape/canon/
> watch-for rather than a single near-duplicate sentence); 1 LOW —
> an unexplained ENTRIES-vs-SHOWS count mismatch on the calendar
> themed list. Authed pass verified the pass-110
> `CommunityWeeklyQuestionCard` fix (`3ed3c5da`) renders correctly
> on a second show (Big Brother), not just where it was originally
> fixed — not re-filed. The `/u/e2e` mobile RSC-prefetch-abort
> surfaced again on the authed walk; per the long-standing
> critique-tooling-noise ruling (dropped every prior pass since
> 85/86/87), not filed. A minor community weekly-question
> row-highlight observation was also dropped as a design nuance,
> not a defect (the weekly question is intentionally open-ended
> across all seasons, not pointed at one row).
>
> Pass 110 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed), both anon and authed
> passes with a freshly-minted `CRITIQUE_SESSION_COOKIE`. Anon
> (6 URLs: `/`, `/shows/masterchef-australia/season/open-call`,
> `/shows`, `/themes/the-season-the-audience-showed-up-all-at-once`,
> `/themes`, `/shows/survivor/season/survivor-50`) and authed
> (`/`, `/shows/top-chef/season/carolinas`, `/u/e2e`,
> `/shows/masterchef-australia?view=community`) walks ran,
> desktop + mobile, zero console errors/failed requests/mobile
> overflow across both, no spoiler leaks. Authed pass also probed
> `/api/vote` and `/api/comments` directly plus the mobile account
> disclosure menu — all clean, no new findings. 2 new findings
> filed (below): a MED — the pass-109 fix for the MasterChef
> Australia S18 duplication HIGH (`fdb5e78d`) resolved the
> original four-way repeat but left a smaller two-way echo of its
> own ("The panel enters its third season unchanged" verbatim in
> both `lede` and markdown body); a LOW — the freshly-shipped
> `the-season-the-audience-showed-up-all-at-once` themed list
> leans on the same "the franchise's own X reaches for first"
> scaffold across its tagline and 3 of 12 entry blurbs. One
> existing Pending row (the recurring meta-description-overrun
> LOW) was folded rather than duplicated: this pass's fourth
> independent recurrence (`the-season-the-audience-showed-up-
> all-at-once`, 202 chars) was appended to the existing
> `best-post-merge` / `someone-else-held-the-chair-for-a-while`
> row and its severity bumped LOW→MED, with the fix note now
> recommending a `content:check` lint guard given four
> independent instances. The already-open MED (`survivor-50`
> canon rationale jargon) and the `best-finales` stale-count MED
> were both independently reconfirmed still open/unresolved, not
> re-filed.
>
> Pass 109 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed), both anon and authed
> passes with a freshly-minted `CRITIQUE_SESSION_COOKIE`. Anon
> (5 URLs: `/`, `/shows/masterchef-australia/season/open-call`,
> `/shows`, `/themes/the-open-call-built-the-format`, `/themes`)
> and authed (`/`, `/shows/top-chef/season/carolinas`, `/u/e2e`,
> `/shows/masterchef-australia?view=community`) walks ran,
> desktop + mobile, zero console errors/failed requests/mobile
> overflow across both, no spoiler leaks. 1 new finding filed
> (below): a HIGH — the freshly-drained MasterChef Australia S18
> page repeats the same "on-air auditions return...twenty-four
> across three broadcast episodes" clause near-verbatim across
> four locations on the season page (lede, watch_list entry,
> body, canon.md rationale) plus a fifth echo in the
> `the-open-call-built-the-format` themed list's own entry #14
> blurb — a fresh instance of the cross-surface verbatim-echo
> defect class on the newest content. The already-open
> `best-finales` "Seven finales" stale-count row (pass-106) was
> independently reconfirmed live (10 entries / 9 shows, badge
> reads correctly, only the featured_pull text is stale) but not
> re-filed — exact duplicate. Two LOW findings from the authed
> pass (RSC prefetch `net::ERR_ABORTED` on `/u/e2e` for non-root
> paths) were assessed and dropped as critique-tooling noise, not
> a live product defect — `isRscPrefetchAbort()` in
> `scripts/critique-walk.mjs` filters only the root-path prefetch;
> broadening that filter is a walker-script improvement, not a
> CRITIQUE.md-worthy site finding. The authed pass also drove two
> live interactions directly (VotePair click round-trip, comment
> composer open state) — both correct, singular/plural label
> confirmed still fixed (issue #138).
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed), both anon and authed
> passes with a freshly-minted `CRITIQUE_SESSION_COOKIE`. Anon
> (5 URLs: `/`, `/shows/survivor/season/survivor-50`, `/shows`,
> `/themes/when-the-chairs-turned-over`, `/themes`) and authed
> (`/`, `/shows/survivor/season/survivor-50`, `/u/e2e`,
> `/shows/survivor?view=community`) walks ran, desktop + mobile,
> zero console errors/failed requests/mobile overflow across
> both, no spoiler leaks. 1 finding filed (below): a MED — the
> community-view (`?view=community`) og:image was left out of
> the pass-104/105 title/canonical fix and still falls back to
> the generic sitewide social card instead of the show's own
> tinted OG image. The anon pass's only other observation (the
> already-open `best-finales` "Seven finales" stale-count row)
> was confirmed still unresolved, not re-filed.
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 106 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed), both anon and authed
> passes with a freshly-minted `CRITIQUE_SESSION_COOKIE`. Anon
> (5 URLs: `/`, `/shows/survivor/season/50`, `/shows`,
> `/themes/best-finales`, `/themes`) and authed (`/`,
> `/themes/best-finales`, `/shows/survivor?view=community`,
> `/u/e2e`) walks ran, desktop + mobile, zero console
> errors/failed requests/mobile overflow across both, no spoiler
> leaks. 3 findings filed (below): a MED — `/themes/best-finales`'
> `featured_pull` still reads "Seven finales" though the list has
> grown to 10 entries (a stale count left behind by content
> growth, same class as prior stale-superlative rows); a MED —
> the community pane's "this week's question" card promises "your
> vote feeds the next update" with zero adjacent affordance
> connecting it to the season rows below where voting actually
> happens; a LOW — `VotePair`'s season-page call site hardcodes
> `initialCount={0}` so a season's real vote count visibly flashes
> in ~2s after hydration rather than SSR-ing correctly. Two
> reader-surfaced observations were assessed and dropped: the
> `/themes/[theme]` "SAVE (THIS DEVICE)" label when signed in
> (deliberate, already litigated and closed across three prior
> passes — #272, #377, #385 — the device-scope qualifier is
> intentional honesty, not a regression), and a mobile-only failed
> RSC prefetch request on `/u/e2e` (long-documented benign
> Link-prefetch-teardown artifact, dropped every prior pass it's
> surfaced).
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 104 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed), both anon and authed
> passes with a freshly-minted `CRITIQUE_SESSION_COOKIE`. Anon
> (5 URLs: `/`, `/shows/love-island-uk/season/summer-2025`,
> `/shows`, `/themes/straight-to-camera-never-to-each-other`,
> `/themes`) and authed (`/`,
> `/shows/love-island-uk/season/summer-2025`,
> `/shows/love-island-uk/community`,
> `/themes/straight-to-camera-never-to-each-other`, `/u/e2e`)
> walks ran, desktop + mobile, zero console errors/failed
> requests/mobile overflow across both, no spoiler-discipline
> violations. 4 findings filed (below): a HIGH — the community
> full-rank table on `/shows/[show]/community` drops its
> APPROVAL % column entirely on mobile even though the page's own
> lede copy says approval share is what orders the table; a MED —
> the same community page's `<title>`/canonical still describe
> the show's editorial canon rather than the community page
> itself; a MED — the freshly-shipped Love Island UK S12 season's
> EPISODES stat caption bare-restates its own value (recurring
> instance of an already-open defect class); a LOW — the freshly-
> shipped `straight-to-camera-never-to-each-other` theme's meta
> description runs 252 chars, well past SERP-snippet budget.
> Previous pass 103 filed (below): a new
> FORMAT/CAST-SIZE stat-tile duplication instance on Perfect
> Match S4 (known defect class, first time on this show); the
> `/themes` featured rail stuck on a June revision date while the
> page's own "LISTS REVISED" stat reads July — a curation-staleness
> gap, not a code bug; two internal-consistency defects on the
> newest themed list (`no-season-here-got-the-calendar-to-itself`
> entry #5's title claims a symmetric "either side, same time"
> relationship its own body describes as nested containment, and
> entries #3 and #12 both independently claim exclusive "longest
> single season" status with no tie acknowledgment — a direct
> contradiction); and a low-severity "Either direction" canon-nav
> label rendering on Perfect Match S4, the canon tail, where only
> a backward link exists. No spoiler-discipline violations found
> in either pass. Authed pass re-confirmed the phase-36 SSR
> auth-state fix holds clean (header, vote-pair, comment composer,
> and `/u/e2e` self-view all correctly reflect signed-in state via
> raw HTML, no anon-shell flash).
>
> ───── Pass 101 metadata kept below for history ─────
>
> Last pass: 2026-07-22 at commit c763ed2
> Pass count: 101
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 101 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed), both anon and authed
> passes with a freshly-minted `CRITIQUE_SESSION_COOKIE`. Anon
> (5 URLs: `/`, `/shows/big-brother/season/a-summer-of-mystery`,
> `/shows`, `/themes/the-format-kept-moving-the-furniture`,
> `/themes`) and authed (`/`,
> `/shows/big-brother/season/a-summer-of-mystery`, `/u/e2e`,
> `/shows/love-island-us/season/fiji-2026`,
> `/shows/the-ultimatum/season/season-4`) walks ran, desktop +
> mobile. Anon pass surfaced 3 new findings (below): a same-page
> spoiler contradiction on the Big Brother S27 season page (watch-
> for copy withholds the mystery-houseguest identity, the canon
> rationale rendered lower on the same page names it), a
> format_summary/cast_size headcount-duplication recurrence of the
> #464 defect class on the same season, and a Title Case
> inconsistency across several Big Brother season titles. Authed
> pass surfaced 1 new finding: a 375px mobile horizontal overflow
> on the Love Island US season 8 (Fiji 2026) page, not reproduced
> on any other page walked this pass. Re-confirmed (not refiled):
> the-ultimatum/season-4's already-Pending missing-stat-fields row
> (pass-99/100) is still live and unchanged. Dropped as non-
> findings: Love Island US's vote-question copy (already resolved
> by the pass-88 `voteQuestionFor()` scaling fix, this show was
> named in that fix's own allowlist) and a single-viewport RSC
> prefetch `net::ERR_ABORTED` on `/u/e2e` mobile (walker artifact,
> same long-documented benign class as prior passes, low
> confidence, not filed).
>
> ───── Pass 100 metadata kept below for history ─────
>
> Last pass: 2026-07-22 at commit adca5b6
> Pass count: 100
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 100 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed), both anon and authed
> passes with a freshly-minted `CRITIQUE_SESSION_COOKIE`. Anon
> (5 URLs: `/`, `/shows/survivor/season/survivor-50`, `/shows`,
> `/themes/when-scripted-went-dark`, `/themes`) and authed
> (`/`, `/shows/survivor/season/survivor-50`, `/u/e2e`,
> `/shows/the-ultimatum/season/season-4`,
> `/shows/perfect-match/season/season-1`) walks ran, desktop +
> mobile. Anon pass surfaced 3 new findings (below): a season-page
> meta-description truncation, an under-weighted stat block on
> single-list detail pages, and an unverified missing
> `:focus-visible` state on the search input + comment textarea.
> Authed pass independently re-surfaced the same missing-`host`-
> name defect already Pending from pass 99 on the-ultimatum
> season-4 — corroboration appended to that existing row rather
> than filed twice. Dropped: the long-documented benign RSC
> Link-prefetch-teardown `net::ERR_ABORTED` artifact on `/u/e2e`
> (15+ pass precedent) and a "no onboarding state found" non-
> finding on perfect-match/season-1 (page is fully seeded now).
>
> ───── Pass 99 metadata kept below for history ─────
>
> Last pass: 2026-07-22 at commit 26fba3c
> Pass count: 99
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 99 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed), both anon and authed
> passes with a freshly-minted `CRITIQUE_SESSION_COOKIE`. Anon
> (5 URLs: `/`, `/shows/the-ultimatum/season/season-4`, `/shows`,
> `/themes/the-workroom-outlasted-the-network`, `/themes`) and
> authed (`/`, `/shows/the-ultimatum/season/season-4`,
> `/shows/the-ultimatum/canon`,
> `/themes/some-casts-didnt-need-week-one`, `/u/e2e`) walks ran,
> desktop + mobile. Anon pass: zero findings, clean SEO/mobile/
> console, freshly-shipped season-4 backfill + canon rebase and
> the workroom-outlasted-the-network themed list both verified
> spoiler-clean against source content. Authed pass surfaced one
> new MED finding (below) on the-ultimatum's freshly-shipped
> season-4 stat rail; dropped the long-documented benign RSC
> Link-prefetch-teardown `net::ERR_ABORTED` artifact on `/u/e2e`
> per prior-pass precedent (15+ passes).
>
> ───── Pass 98 metadata kept below for history ─────
>
> Last pass: 2026-07-21 at commit c4a0065
> Pass count: 98
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 98 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed), both anon and authed
> passes with a freshly-minted `CRITIQUE_SESSION_COOKIE`. Anon
> (6 URLs: `/`, `/shows/survivor/season/heroes-vs-villains`,
> `/shows`, `/themes`, `/themes/the-paycheck-writes-the-plot`,
> `/shows/chopped/canon`) and authed (`/`,
> `/shows/survivor/season/heroes-vs-villains`,
> `/shows/chopped/canon`,
> `/themes/every-seat-had-an-expiration-date-except-one`, `/u/e2e`,
> `/shows/the-real-world/season/go-big-or-go-home`) walks ran,
> desktop + mobile. Zero console errors, zero mobile overflow
> (`scrollWidth === innerWidth` at 375px on every page including
> the previously-fixed Real World S31 page), no anon-shell
> leakage on non-cached authed routes, full SEO meta present.
> Filed 1 new HIGH finding: a themed-list entry
> (`the-paycheck-writes-the-plot` rank 6, Selling Sunset S06)
> states a specific plot-outcome (a cast member's on-screen exit
> and business move) as fact, in tension with agents.md §7's
> spoiler definition — flagged for same-day patch per P0 policy.
> One raw finding was a duplicate of the still-open pass-95 Bake
> Off "15 seasons" vs. "16 SEASONS" contradiction — dropped per
> critique.md §5 step 3, and that row's severity bumped MED→HIGH
> given a second independent pass reconfirmed it unresolved. The
> authed pass surfaced zero new defects; every candidate
> observation matched an already-adjudicated non-bug in this file
> (RSC-prefetch abort, device-scope save label, canon-page
> redirect).
>
> ───── Pass 97 metadata kept below for history ─────
>
> Last pass: 2026-07-21 at commit 403b4ef
> Pass count: 97
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 97 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed), both anon and authed
> passes with a freshly-minted `CRITIQUE_SESSION_COOKIE`. Anon
> (6 URLs: `/`, `/themes/the-zip-code-was-the-only-constant`,
> `/themes/the-tent-moved-more-than-the-show-admits`,
> `/shows/rhony`, `/shows/bake-off`, `/themes`) and authed (`/`,
> `/u/e2e`, `/themes/the-zip-code-was-the-only-constant`,
> `/themes/the-tent-moved-more-than-the-show-admits`,
> `/shows/rhony/season/the-second-act`) walks ran, desktop +
> mobile, targeting the two freshly-shipped themed lists (never
> critiqued before). Zero console errors, zero failed
> first-party requests (one flaky RSC-prefetch abort on `/u/e2e`
> was non-reproducible across repeat runs and not filed), zero
> mobile overflow (`scrollWidth === innerWidth` at 375px on
> every page), no per-show SVG iconography violations, no
> spoiler leakage on either new list or the RHONY season page.
> Auth handshake confirmed working (`@e2e` chrome on every
> capture, no signed-out flash). Filed 2 findings, both
> low-to-medium: (1) single-show themed lists (both freshly-shipped
> ones checked) carry no link back to the parent show's canon
> page anywhere on the detail page — systemic across the
> `/themes` index too, and one-directional since show pages
> already link forward to their single-show lists; (2) the
> list-detail hero's `SHOWS 1` stat is trivially true on every
> single-show list and repeats what the title already says.
>
> ───── Pass 96 metadata kept below for history ─────
>
> Last pass: 2026-07-21 at commit d047d22
> Pass count: 96
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 96 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed), authed pass with a
> freshly-minted `CRITIQUE_SESSION_COOKIE`. Anon (6 URLs: `/`,
> `/themes/the-season-structure-never-holds-still`,
> `/themes/the-finals-never-run-the-same-course-twice`,
> `/shows/dragrace`, `/shows`, `/themes`) and authed (`/`,
> `/u/e2e`, `/themes/the-season-structure-never-holds-still`,
> `/themes/the-finals-never-run-the-same-course-twice`,
> `/shows/dragrace/season/18`) walks ran, desktop + mobile,
> targeting the two freshly-shipped themed lists (never
> critiqued before). Zero console errors, zero failed
> first-party requests across all page/viewport combinations,
> zero mobile overflow (`scrollWidth === innerWidth` at 375px on
> every page), no per-show SVG iconography violations, no
> spoiler leakage on either new list or the dragrace S18 season
> page. Auth handshake confirmed working (correct `@e2e` chrome
> on every capture, no signed-out flash). Filed 2 findings, both
> medium: (1) show/season/themed-list detail routes serve
> `private, no-store` with `x-vercel-cache: MISS` on every
> anonymous request (190-557ms TTFB vs. ~100ms on the
> edge-cached hub pages) — root cause is the deliberate
> phase-35 `force-dynamic` on the show page, correct for the
> live community-ranking widget but dragging the whole
> mostly-static page along with it; suggested fix points at the
> already-proven phase-36 hybrid-island pattern
> (ISR shell + client-hydrated `/api/ranking/[show]`) rather
> than reverting the freshness fix; (2) `/shows/dragrace/season/18`'s
> three narrative sections (pull / body / canon rationale) were
> authored independently but restate the same five facts
> near-verbatim — the same section-restatement class already
> open on Chopped S62 (pass-94), now confirmed on a second show
> with no thin-season excuse. One methodological note from the
> authed pass was not filed as a finding: the Playwright walk
> takes a single settled snapshot per page and doesn't
> click-and-recapture, so the vote-pair post-click and
> comment-thread post-submit states weren't exercised this
> pass — not a site defect, just an untested-this-pass gap.
>
> ───── Pass 95 metadata kept below for history ─────
>
> Last pass: 2026-07-20 at commit 81ee1d7
> Pass count: 95
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 95 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed), authed pass with a
> freshly-minted `CRITIQUE_SESSION_COOKIE`. Anon (6 URLs: `/`,
> `/themes/when-age-became-the-casting-brief`,
> `/themes/twice-in-one-year`,
> `/shows/the-real-world/season/go-big-or-go-home`, `/shows`,
> `/themes`) and authed (`/`, `/u/e2e`,
> `/themes/when-age-became-the-casting-brief`,
> `/shows/the-real-world/season/go-big-or-go-home`,
> `/shows/chopped/canon`) walks ran, desktop + mobile, targeting
> the two freshly-shipped themed lists (never critiqued before)
> and verifying the #568 mobile-overflow fix landed clean. Zero
> console errors, zero failed first-party requests across all
> page/viewport combinations, no per-show SVG iconography
> violations, no spoiler leakage. The #568 fix confirmed holding
> (`scrollWidth === innerWidth === 375` on both `/` and the
> season page, both auth states). Auth handshake confirmed
> working (correct `@e2e` chrome on every capture). Two findings
> self-assessed away as not-bugs: the themed-list "Save (this
> device)" button is intentional device-local scoping (tested
> behavior, `ListDetailTools.test.tsx`), and the absence of a
> vote/comment thread on list pages matches spec — lists are
> editorial curation surfaces, not community-vote surfaces like
> season pages (`spec.md` "community is a ±1 vote, not a personal
> ranked list"; no vote/comment pattern in the `Best Premieres`
> design reference either). The Chopped canon page's uniform
> "◆ HOLD" community pills across all 5 S-tier entries was also
> dropped — traced to `communitySignal()`/`community/live.ts`,
> confirmed data-driven (not a static stub), so plausible given
> real vote volume; too speculative to file without deeper vote-
> count verification. Filed 2 findings (1 medium, 1 low):
> (1) `/shows` pillar page — Bake Off's card copy (`blurb`,
> `tagline`, `card_tagline`) still reads "15 seasons" while
> `seasons: 16` and the card's own stat badge both say 16 —
> frontmatter count was bumped without updating the three prose
> fields; (2) The Real World S31 (Go Big or Go Home)'s EPISODES
> stat tile description ("12 episodes filmed above the Gold
> Spike") bare-restates the episode count and re-spends the
> "Gold Spike" location fact already used two tiles up in the
> FILMED tile — a fresh instance of the stat-caption-restates-
> value defect class, in a tile the existing regression test
> doesn't cover. Both freshly-shipped themed lists read clean —
> voice, structure, save/share affordances, no spoiler leakage,
> no duplicate-restatement tells.
>
> ───── Pass 93 metadata kept below for history ─────
>
> Last pass: 2026-07-12 at commit 1d6b8d4
> Pass count: 93
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 93 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed), authed pass with a
> freshly-minted `CRITIQUE_SESSION_COOKIE`. Anon (5 URLs: `/`,
> `/shows/top-chef/season/carolinas`,
> `/shows/bake-off/season/the-hammond-continues`,
> `/shows/dragrace/season/season-18`, `/shows`) and authed
> (`/u/e2e`, `/shows/top-chef/season/carolinas`,
> `/shows/bake-off/season/the-hammond-continues`,
> `/shows/dragrace/season/season-18`, `/themes`) walks ran,
> desktop + mobile, targeting the three most-recently-shipped
> season backfills (Top Chef Carolinas, Bake Off Series 16,
> Drag Race Season 18 — all landed this tick's preceding 6
> commits via the content-gap drain), never critiqued before.
> Zero mechanical findings (no console errors, no mobile
> overflow, complete SEO/meta tags, no per-show SVG iconography
> violations, no spoiler leakage). Auth handshake confirmed
> working (`@e2e` chrome on every capture, no signed-out flash).
> No spoiler leaks detected on any of the three fresh season
> pages — winner/elimination outcomes consistently avoided in
> favor of structural/format framing on both passes. Filed 6
> findings (1 high, 2 med, 3 low): (1) Drag Race Season 18's
> "THE TAKE" section renders empty — no `pull` frontmatter field
> on the season file, a show-wide gap (zero of 18 dragrace season
> files carry `pull:`) newly visible now that S18 is live; (2)
> Top Chef Carolinas' FILMED and FORMAT stat captions both
> restate the same three city names instead of each carrying a
> distinct fact; (3) `/themes`' third header stat chip pairs
> "July 2026" with the count-shaped label "LISTS REVISED,"
> reading as a count when placed beside two genuine count chips;
> (4) Top Chef's canon.md has a stray-space hyphenation break —
> "twin- brothers" — from a markdown hard-wrap, the same bug
> class the pass-51 #517 fix addressed at a different location;
> (5) Drag Race S18's "what to watch for" list carries only 2
> entries versus 4-6 on its freshly-shipped sibling pages; (6)
> Drag Race S18's FORMAT sub-caption reads as an unedited
> fragment ("eliminated-cast tournament ahead of the top three")
> versus sibling pages' complete-clause captions. Dropped one
> reader observation at self-assessment: a note that
> `scripts/critique-walk.mjs` only captures first-paint and
> cannot exercise click interactions (vote-pair post-click state,
> comment-submit flow) — a real tooling gap but not a product
> defect, logged here rather than filed as a Pending row so a
> future tooling pass can pick it up.
>
> ───── Pass 91 metadata kept below for history ─────
>
> Last pass: 2026-07-12 at commit e60ceca
> Pass count: 91
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 91 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed), authed pass with a
> freshly-minted `CRITIQUE_SESSION_COOKIE`. Anon (5 URLs: `/`,
> `/shows/traitors-uk/season/series-1`,
> `/shows/married-at-first-sight-australia/season/the-original`,
> `/shows`, `/shows/traitors-uk/canon`) and authed (`/u/e2e`,
> `/shows/married-at-first-sight-australia/canon`,
> `/shows/traitors-uk/season/series-1`,
> `/shows/married-at-first-sight-australia/season/the-original`,
> `/shows/traitors-uk/canon`) walks ran, desktop + mobile,
> targeting the two most-recently-shipped shows (The Traitors UK,
> Married at First Sight Australia — both single-season,
> single-canon-entry freshly-seeded shows) for the scaffolding
> defect classes that recur on thin-catalog shows. Zero
> mechanical findings (no console errors, no failed first-party
> requests beyond one benign RSC-prefetch abort, no mobile
> overflow, complete SEO/meta tags, no per-show SVG iconography
> violations, no spoiler leakage). Auth handshake confirmed
> working (`authState: authenticated:cloud`, correct signed-in
> chrome, live comment composer, no signed-out flash). Confirmed
> prior fixes still hold: sole-canon-entry rank-bar peak
> rendering, `tier_s_blurb` fallback collision, signed-out header
> flash. Filed 5 findings (2 MED, 3 LOW): (1) traitors-uk's
> `filming_caption` uses "Filmed at" instead of "Filmed in,"
> slipping past the existing bare-restatement lint which only
> matches the literal word "in"; (2) MAFS Australia's season page
> restates "three couples, matched sight unseen" across five
> separate fields; (3) traitors-uk repeats the six-word phrase
> "Ardross Castle in the Scottish Highlands" verbatim between the
> hero lede and the body; (4) every /shows B-tier tile doubles up
> "review in progress" (status pill) and "canon in review" (tile
> footer) on one card; (5) two canon.md files
> (married-at-first-sight-australia, survivor-australia) pair
> `delta=0` with `sentiment=up` instead of the corpus-standard
> `sentiment=hold`, rendering a self-contradictory "↑ 0" pill —
> reader-agent evidence originally undercounted this as a single
> outlier; corpus grep confirmed two.
>
> ───── Pass 90 metadata kept below for history ─────
>
> Last pass: 2026-07-11 at commit 07a958d
> Pass count: 90
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 90 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed), authed pass with a
> freshly-minted `CRITIQUE_SESSION_COOKIE`. Anon (5 URLs: `/`,
> `/shows/chopped/season/the-four-ingredient-standard`,
> `/shows/chopped/canon`, `/shows`, `/themes/best-post-merge`)
> and authed (`/`, `/u/e2e`,
> `/shows/chopped/season/the-four-ingredient-standard`,
> `/shows/chopped/canon`) walks ran, desktop + mobile, targeting
> Chopped's freshly-drained Season 4 (rank #2 of 6, just
> promoted into the canon) plus a re-check of authed chrome
> fidelity on the show's now-6-entry canon page. Zero mechanical
> findings (no console errors, no failed first-party requests,
> no mobile overflow, complete SEO/meta tags, no per-show SVG
> iconography violations, no spoiler leakage). Confirmed prior
> fixes still hold: the pass-87 #540 Chopped S1 `premiere_caption`
> weekday-only fix, the pass-87 #539 `ShowsStatusPill` tooltip.
> Confirmed still-open (not re-filed, already tracked): the
> pass-89 `/u/e2e` generic-OG-image LOW finding. Filed 1 finding
> (LOW): Chopped Season 4's `premiere_caption` ("Food Network ·
> spring into summer 2010") restates both the network and the
> air-window already stated in the page eyebrow one line above
> — the same defect class as the resolved pass-87 #540 (Chopped
> S1), but a fresh instance in a different file that the S1 fix
> didn't propagate to.
>
> ───── Pass 89 metadata kept below for history ─────
>
> Last pass: 2026-07-11 at commit 83ec636
> Pass count: 89
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 89 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed), authed pass with a
> freshly-minted `CRITIQUE_SESSION_COOKIE`. Anon (5 URLs: `/`,
> `/shows/bachelor-in-paradise/season/tulum`, `/shows`,
> `/shows/bachelor-in-paradise/canon`,
> `/themes/best-reunion-specials`) and authed (`/`, `/u/e2e`,
> `/shows/bachelor-in-paradise/season/tulum`,
> `/shows/bachelor-in-paradise/canon`) walks ran, desktop +
> mobile, targeting Bachelor in Paradise's freshly-seeded
> lone-season canon page (zero prior critique coverage) plus a
> re-check of authed vote/comment fidelity. Zero mechanical
> findings (no console errors, no failed first-party requests,
> no mobile overflow, complete SEO/meta tags, no per-show SVG
> iconography violations, no spoiler leakage). Confirmed prior
> fixes still hold: pass-88's #545/#544 Circle canon closures,
> the `/canon` 308 redirect (by design), the pass-87 #539
> ShowsStatusPill tooltip. Filed 6 findings (all MED except one
> LOW): the anon vote-row eyebrow ("sign in to weigh in")
> contradicts both `/about`'s stated 0.1x anon-vote-weight
> policy and `VotePair`'s actual unconditional-post behavior —
> sitewide, every season page; the new season page's auto meta
> description truncates mid-clause; `RankScale` renders a
> lone #1-of-1 canon entry at 100% fill (visually "the tail")
> instead of the peak-end 0% the fill formula intends for a
> top-ranked season — recurs on every freshly-seeded show;
> Bachelor in Paradise's canon page S-tier band duplicates its
> heading text as its own blurb (missing `tier_s_blurb`, same
> class as the resolved below-deck #418); its season page's
> FILMED caption bare-restates the location field; and `/u/e2e`
> lacks a dynamic per-profile opengraph-image (falls back to the
> generic sitewide OG image, unlike shows/seasons/themes which
> all have bespoke per-route OG images).
>
> ───── Pass 88 metadata kept below for history ─────
>
> Last pass: 2026-07-11 at commit b6bc64b
> Pass count: 88
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 88 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed), authed pass with a
> freshly-minted `CRITIQUE_SESSION_COOKIE`. Anon (5 URLs: `/`,
> `/shows/the-circle/season/inaugural-season`, `/shows`,
> `/shows/big-brother/canon`, `/themes/best-returnees`) and
> authed (`/`, `/u/e2e`,
> `/shows/the-circle/season/inaugural-season`,
> `/shows/big-brother/canon`) walks ran, desktop + mobile,
> targeting The Circle's lone-season canon page (a fresh,
> low-season-count show not previously critiqued) plus a
> re-check of signed-in vote/comment fidelity. Zero mechanical
> findings (no console errors, no failed first-party requests,
> no mobile overflow, complete SEO/meta tags). Confirmed prior
> fixes still hold: the pass-84 #522 auth-state SSR seeding on
> vote-pair/comment-input (full signed-in triad renders
> server-side, no anon-shell flash), the pass-85 #528 home hero
> heading order. Ruled out three near-misses as already-covered
> non-bugs: the `/u/e2e` mobile RSC-prefetch-abort (benign
> artifact class dropped at passes 85/86/87), the Circle S1
> eyebrow/premiere_caption reordering (established convention
> per pass-86 #536), and `/shows/big-brother/canon`'s 308
> redirect (by design). Filed 2 findings (both MED): The
> Circle's lone-season canon rationale restates the "only entry
> ranked so far" fact the page template already states, with a
> confidence-undermining "by default" hedge; and the site-wide
> default vote question ("Does this belong in the community top
> 10?") is logically empty on shows whose total catalog is under
> 10 seasons (at least 10 of 63 shows affected) since every
> season trivially clears that bar. No spoiler leakage. No
> per-show SVG iconography violations found.
>
> ───── Pass 87 metadata kept below for history ─────
>
> Last pass: 2026-07-10 at commit 1dd2bd1
> Pass count: 87
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 87 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed), authed pass with a
> freshly-minted `CRITIQUE_SESSION_COOKIE`. Anon (5 URLs: `/`,
> `/shows/chopped/season/season-1`, `/shows`, `/themes/firsts`,
> `/shows/the-apprentice`) and authed (`/`,
> `/shows/chopped/season/season-1`, `/u/e2e`, `/themes/firsts`)
> walks ran, desktop + mobile, deliberately targeting the
> just-shipped Chopped show/season plus the just-edited
> The Apprentice canon page (verifying the pass-67 #538
> bare-surname-first-mention fix reads correctly). Confirmed:
> "Donald Trump's boardroom" is the only full-name mention and
> precedes the sole remaining bare "Trump's boardroom" reference
> (Season Four, later in canon order) — the fix holds, no other
> bare-surname-before-first-mention issue on that page. Reader
> raised 7 raw observations across both passes; self-assessment
> (Step 3) dropped 4 as invalid: the Chopped meta-description
> ellipsis is intentional, documented `clipToSeoBudget`
> clause-boundary-truncation behavior (pass 62/67/68), not a
> bug; the apparent "inconsistency" between the Apprentice and
> Chopped `/shows` tile badges is the pass-52 #417 `shipped >=
> target` guard working exactly as designed (Apprentice's 10
> canon entries exceed the target-3 floor so it correctly shows
> the no-ratio "review in progress" label, while Chopped's 1
> entry is still below the floor and correctly shows the
> ratio); the `/themes/firsts` "SAVE (THIS DEVICE)" label
> reading the same authed or not is the same established
> non-bug precedent dropped at passes 74/75/85 (deliberate
> device-scope qualifier, pending future save-to-account data
> work); and the `/u/e2e` mobile RSC-prefetch-abort matches the
> same benign artifact class passes 85/86 already dropped.
> Filed 3 findings (all MED): a Chopped S1 `premiere_caption`
> that repeats the month/year already shown one line above and
> drops the day-of-month instead of adding a real timeslot
> fact; the `/shows` B-tier canon-progress pill's bare "N / T"
> fraction has no label naming what it counts (canon entries
> toward the review floor, not seasons ranked), distinct from
> the already-fixed #417 out-of-range bug; and a TTFB
> regression on the site's two largest-canon show pages
> (`/shows/the-apprentice`, `/shows/survivor`, both 3-6x slower
> than every other page walked) that correlates with canon
> size under the intentional `force-dynamic` per-request render
> (phase 35) — flagged for profiling, not for reverting the
> freshness guarantee that render mode protects. Zero console
> errors, zero non-benign failed first-party requests, zero
> mobile overflow across both passes. No spoiler leakage. No
> per-show SVG iconography violations found (only the shared
> brand mark + generic vote-arrow SVGs present, zero `<img>`
> tags site-wide).
>
> ───── Pass 86 metadata kept below for history ─────
>
> Last pass: 2026-07-10 at commit e33fc69
> Pass count: 86
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 86 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed), authed pass with a
> freshly-minted `CRITIQUE_SESSION_COOKIE`. Anon (5 URLs: `/`,
> `/shows/summer-house/season/amagansett`, `/shows`,
> `/themes/best-villain-editing`, `/shows/vanderpump-rules`) and
> authed (`/`, `/shows/hells-kitchen/season/battle-of-the-states`,
> `/u/e2e`, `/themes/best-comeback-seasons`) walks ran, desktop +
> mobile, deliberately targeting the just-shipped Summer House
> show/season (freshness check on the newest content) plus pages
> outside the last several passes' rotation. The Phase-36
> vote-pair/comment SSR auth-state class was re-checked on Hells
> Kitchen S24 via independent authenticated `curl` re-verification
> of the raw SSR HTML — did **not** reproduce
> (`data-vote-head-state="signed-in-no-vote"`, `data-signed-in="true"`,
> comment composer showed live `as @e2e` input), confirming the
> fix continues to hold. Reader raised 3 raw observations; self-
> assessment (Step 3) dropped 2 as invalid — the meta-description
> ellipsis on the Summer House season page is intentional,
> documented `clipToSeoBudget` clause-boundary-truncation behavior
> (pass 62/67/68), not a bug, and the `/u/e2e` RSC-prefetch-abort
> network note matches the exact benign `context.close()` artifact
> class pass 85 already explicitly dropped. Filed 1 finding (MED):
> the Summer House S1 `filming_caption` restates its own `location`
> value instead of adding a founding-season editorial note, unlike
> the RHOSLC/Southern Charm S1 sibling pattern (`premiere_caption`
> on the same file was checked and found to already match the
> established site-wide convention, so excluded). Zero console
> errors, zero non-benign failed first-party requests, zero mobile
> overflow across both passes. No spoiler leakage. No per-show SVG
> iconography violations found (verified via raw-HTML `<svg>` audit
> on the anon pass — only the shared brand mark + generic vote
> chevrons present).
>
> ───── Pass 85 metadata kept below for history ─────
>
> Last pass: 2026-07-10 at commit ec30423
> Pass count: 85
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 85 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed), with independent
> authenticated `curl` re-verification of the raw SSR HTML for
> the vote-pair/comment-composer auth-state class before ruling
> it clear. Anon (5 URLs: `/`,
> `/shows/love-is-blind/season/columbus`, `/shows`, `/themes`,
> `/shows/below-deck-down-under/season/western-australia`) and
> authed (`/`, `/shows/top-chef/season/destination-canada`,
> `/u/e2e`, `/themes/best-post-merge`) walks ran, desktop +
> mobile, deliberately targeting pages outside the last several
> passes' rotation. The Phase-36/pass-84 vote-pair/comment SSR
> auth-state bug was checked again on a fresh season page
> (Top Chef S22) and did **not** reproduce — `data-vote-head-state`
> and the comment composer both carried the signed-in state in
> the raw authenticated response, confirming the #522 fix
> generalizes. Filed 4 findings, all MED/LOW: a themed-list
> title/description mismatch on `best-non-winning-runs` (title
> implies one loud arc, description describes an ensemble-wide
> diffuse dynamic); a subject-less sentence fragment closing the
> Below Deck Down Under S2 canon rationale; a document
> heading-order violation on the home hero (`<h2>` "cover-name"
> renders before the page's only `<h1>` in raw SSR — an a11y
> best-practice miss the critical-only axe gate doesn't catch);
> and near-verbatim restatement of the same facts (host, judges,
> location, "first Canada-set" framing) across the Top Chef
> Destination Canada lede, body, and canon rationale, reading as
> templated rather than the plain-spoken voice bar. Dropped one
> observation (a benign RSC-prefetch-abort network log on
> `/u/e2e`, an artifact of the walker's `context.close()`, not a
> product-facing defect). Zero console errors, zero failed
> first-party requests (excluding the dropped prefetch-abort
> noise), zero mobile overflow on any capture across both
> passes. No spoiler leakage. No per-show SVG iconography
> violations found.
>
> ───── Pass 84 metadata kept below for history ─────
>
> Last pass: 2026-07-09 at commit 6706b01
> Pass count: 84
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 84 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed), with independent
> `curl` re-verification (raw SSR HTML, cookie attached) for the
> two auth-state findings before filing. Anon (6 URLs: `/`,
> `/shows/american-ninja-warrior`, `/shows`, `/themes`,
> `/shows/shark-tank`, `/shows/married-at-first-sight/season/boston`)
> and authed (`/`, `/shows/american-ninja-warrior`,
> `/shows/married-at-first-sight/season/boston`, `/u/e2e`,
> `/themes/best-villain-editing`) walks ran, desktop + mobile,
> targeting the three most recently shipped content fixes (ANW
> S2-S6 drain, Shark Tank canon toolbar, MAFS Boston format_caption)
> plus a fresh look at Phase 36's auth-state chrome. All three
> recent content fixes verified shipped correctly. The authed
> pass found a real gap in Phase 36: the header resolves signed-in
> state server-side on non-cached season pages, but the vote-pair
> and comment-input on those same pages still SSR the anon shell
> regardless — client hydration papers over it, but the raw
> per-request HTML is wrong even though the header two hundred
> lines earlier in the identical response got it right. Filed
> HIGH. A second, milder instance (home page, ISR-cached, `Sign
> in` flashes before the auth-island hydrates) filed MED — that
> one matches Phase 36's documented cached-page trade-off rather
> than a new gap, so it's a polish item, not a break. Rounding
> out the pass: a mobile-only regression on the MAFS Boston "ON
> THIS PAGE" jump nav (collapses to a bare section count, losing
> the named jump links desktop keeps) filed MED, plus two LOW
> voice/staleness notes (home hero's revision stamp reads a
> month behind every other page visited; a repeated "run...run"
> on Shark Tank S5 canon copy). Zero console errors, zero failed
> requests, zero mobile overflow on any capture across both
> passes. No spoiler leakage. No per-show SVG iconography
> violations found.
>
> ───── Pass 83 metadata kept below for history ─────
>
> Last pass: 2026-07-09 at commit 6f7f385
> Pass count: 83
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 83 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Anon (5 URLs: `/`,
> `/shows/married-at-first-sight/season/boston`, `/shows`,
> `/themes/firsts`, `/themes`) and authed (`/`,
> `/shows/married-at-first-sight/season/boston`, `/sign-in`,
> `/shows/survivor/season/heroes-vs-villains`, `/u/e2e`) walks
> ran, desktop + mobile, deliberately targeting Married at First
> Sight's freshly-drained S2-S6 tail. The anon pass surfaced one
> genuine finding — Boston (S6)'s FORMAT stat tile calls its
> expert swap the "second consecutive panel change," but the
> season's own lede/body and the intervening Chicago (S5) season
> (stable panel) contradict "consecutive." The authed pass found
> zero new defects — auth handshake genuine (`@e2e` chrome,
> `/sign-in` redirects a signed-in user to `/`, `/u/e2e` renders
> matching identity, no spoiler leakage, no held-comment leakage).
> Zero console errors, zero failed requests, zero mobile overflow
> on any capture across both passes. No per-show SVG iconography
> violations found.
>
> ───── Pass 82 metadata kept below for history ─────
>
> Last pass: 2026-07-09 at commit 613fc9b
> Pass count: 82
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 82 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Anon (5 URLs: `/`,
> `/shows/shark-tank/season/season-11`, `/shows`,
> `/themes/best-finales`, `/themes`) and authed (`/`,
> `/shows/shark-tank/season/season-11`, `/sign-in`,
> `/shows/survivor/season/heroes-vs-villains`, `/u/e2e`) walks
> ran, desktop + mobile, deliberately targeting Shark Tank's
> freshly-drained S7-S11 tail (pass-78 covered S1-S6). Both
> passes independently surfaced the same defect — Shark Tank
> Season 11's season body and canon.md rationale are verbatim
> duplicates of each other except their closing sentence, the
> recurring Section-02-vs-Section-03 duplication class (fixed
> previously on Bachelor S28 #464, Love Island UK #459, MAFS NY
> #478, The Voice finale #502, Perfect Match #501) — filed once
> per critique hard rule 5. The authed pass additionally flagged
> S9/S10 as a "worsening trend" by word-overlap ratio, but a
> direct read of both files at self-assess found S9 and S10's
> canon rationales diverge meaningfully in their closing argument
> (distinct framing, not verbatim) — only S11 met the bar, so the
> filed row is scoped to S11 alone; the S9/S10 observation is
> noted here, not filed, since it isn't a confirmed instance of
> the defect. Two other authed-pass observations (no prior votes
> on the e2e test account; both visited season pages showing "No
> comments yet") were process/test-coverage notes about the critique
> account's data shape, not product defects — not filed. Zero
> console errors, zero failed requests, zero mobile overflow on
> any capture; auth handshake confirmed genuine (`@e2e` chrome,
> `/sign-in` 307-redirects a signed-in user to `/`, `/u/e2e`
> renders matching identity). No spoiler leakage found on any
> capture. No per-show SVG iconography violations found — only
> the shared brand mark + generic vote chevrons appear in page
> markup.
>
> ───── Pass 81 metadata kept below for history ─────
>
> Last pass: 2026-07-08 at commit 23ab156
> Pass count: 81
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 81 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Anon (5 URLs: `/`,
> `/shows/rhonj/season/the-new-chapter`, `/shows/rhonj`,
> `/shows`, `/themes/best-location-reveals`) and authed (`/`,
> `/shows/rhonj/season/the-new-chapter?view=community`, `/u/e2e`,
> `/themes/best-location-reveals`) walks ran, desktop + mobile,
> deliberately targeting RHONJ — a fully drained show (14/14
> seasons) never critiqued before (same strategy as pass 78 →
> Shark Tank, pass 79 → Perfect Match, pass 80 → The Voice), plus
> the least-touched themed list (`best-location-reveals`, 2 prior
> mentions vs. double digits for most siblings). Notably quiet
> pass: 1 raw finding from the reader (RHONJ S14's CAST SIZE
> caption re-spelling the digit as a word), matched at self-
> assess to an already-open Pending row (#1702, pass-67, same
> defect class on the-apprentice + ANTM) and folded in as a third
> confirmed instance rather than filed as a new duplicate row —
> per critique hard rule 5 ("never duplicate Pending entries").
> Authed pass returned zero findings; the `?view=community`
> byte-identical-render observation and the `/u/e2e` RSC-prefetch
> abort noise were both checked against precedent (pass-75,
> pass-4/5) and correctly withheld as already-assessed, not
> re-filed. Zero console errors, zero failed requests, zero
> mobile overflow on any capture; auth handshake confirmed
> genuine (`@e2e` chrome across header/profile, `/u/e2e` renders
> matching identity). No spoiler leakage found on any capture (no
> winner/eliminated/crowned/runner-up keywords surfaced). No
> per-show SVG iconography violations found — only the shared
> brand mark + generic vote chevrons appear in page markup.
>
> ───── Pass 80 metadata kept below for history ─────
>
> Last pass: 2026-07-08 at commit c285e37
> Pass count: 80
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 80 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Anon (5 URLs: `/`,
> `/shows/the-voice/season/the-finale`, `/shows/the-voice`,
> `/shows`, `/themes/best-villain-editing`) and authed (`/`,
> `/shows/the-voice/season/the-finale?view=community`, `/u/e2e`,
> `/themes/best-villain-editing`) walks ran, desktop + mobile,
> deliberately targeting The Voice — the most recently fully
> drained show (29 seasons through its NBC finale), never
> critiqued before (same strategy as pass 78 → Shark Tank, pass
> 79 → Perfect Match). 4 findings filed (0 high, 2 medium, 2
> low) after re-rating the reader's one HIGH proposal down to
> MED at self-assess (a factual self-contradiction, not a hard-
> rule break — same severity class as the pass-79 villa/house
> row). Zero console errors, zero failed requests, zero mobile
> overflow on any capture; auth handshake confirmed genuine
> (`authState: authenticated:cloud`, `@e2e` chrome across
> header/profile/comment-composer attribution, real member-since
> date on `/u/e2e`). No spoiler leakage found on any capture (no
> winner/eliminated/crowned/runner-up keywords surfaced). No
> per-show SVG iconography violations found — only the shared
> brand mark + generic vote chevrons appear in page markup. The
> long-documented `/shows?_rsc=...` Next.js Link-prefetch-abort
> artifact resurfaced on the authed `/u/e2e` capture and was
> dropped again per the ~15-pass precedent (passes 6-11, 29-47+).
> Strongest finding: The Voice's own pages disagree on the show's
> tenure — the show page's live `{yearsWord}` token renders
> "fifteen years" while the finale season's static copy says
> "fourteen-year run" / "fourteenth year," and the show's
> `status: hiatus` sits alongside a finale season whose own lede
> narrates a permanent close ("marked the end of The Voice's
> run," "brought the show to a close") — compare
> `americas-next-top-model.md`, which pairs its finale season
> with `status: ended`. Root cause traced: `content-check.ts`'s
> `YEAR_TENURE_RE` only matches spelled-out tens (twenty through
> ninety), so teen-number tenure phrases like "fourteen-year" are
> structurally invisible to the drift gate. Second/third findings
> are both fresh content-voice gaps: `/themes/best-villain-editing`
> entry #01 opens with an unintentional "cast was cast" word-tic,
> and entry #05 closes by echoing the list's own hero-lede thesis
> almost verbatim (distinct from the already-closed #02/#04 "leans
> all the way in" echo, issue #462). Fourth is the recurring
> Section-02-vs-Section-03 duplication class (previously fixed on
> Bachelor S28 issue #464 and MAFS New York issue #478, currently
> also Pending unresolved for Perfect Match) now reproduced on The
> Voice's finale season: the season body and the canon.md
> rationale render two near-verbatim paragraphs back to back.
>
> ───── Pass 79 metadata kept below for history ─────
>
> Last pass: 2026-07-08 at commit a484ee4
> Pass count: 79
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 78 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Anon (5 URLs: `/`,
> `/shows/shark-tank/season/season-1`, `/shows`,
> `/shows/shark-tank`, `/themes/best-comeback-seasons`) and authed
> (`/`, `/shows/shark-tank/season/season-1?view=community`,
> `/u/e2e`, `/themes/best-comeback-seasons`) walks ran, desktop +
> mobile, deliberately targeting Shark Tank — the newest show
> added to the catalog, never critiqued before (same strategy as
> pass 77 targeting Southern Charm). 5 findings filed (2 medium,
> 3 low). Zero console errors, zero failed requests, zero mobile
> overflow on any capture; auth handshake confirmed genuine
> (`authState: authenticated:cloud`, `@e2e` chrome across
> header/profile/comment-composer attribution, real member-since
> date on `/u/e2e`). No spoiler leakage found on any capture
> (scanned Shark Tank's blurb, canon rationale, season-1 body,
> plus the best-comeback-seasons theme entries — none present).
> Strongest finding: the FILMED stat tile's value and gloss line
> are the same string twice on Shark Tank's season 1 page
> (`filming_caption` duplicates `location` verbatim) — and this
> reproduces on 133 season files across 22 shows catalog-wide, not
> just Shark Tank, making it a systemic content-authoring gap on
> the scale of the Big Brother/Love Island UK duplication classes
> already fixed. Filed MED, content-only, likely a multi-tick
> drain. Second finding: Shark Tank's CAST SIZE stat renders "5
> players" — `isCompetitionGenre()` in the season-page's
> `statsFor()` matches "Business competition" on the substring
> "competition" and defaults to the generic competition-show noun,
> which is wrong for a panel/judge-format show whose "cast" are
> investors, not competing players. Filed MED, single-function
> code fix. Three LOW findings: the best-comeback-seasons theme's
> "ENTRIES 6 / SHOWS 5" stat pair goes unexplained (mismatch is
> because Survivor appears twice, not a counting error); the
> `/shows` tier-filter control renders "ALL 1" with no separator
> between the tab label and its count; and Shark Tank's CAST SIZE
> stat tile lists the sharks in a different name order/format
> (surname-only, rotated) than the season body two sections down
> (full names, canonical order). One raw observation from the
> authenticated reader agent — a HIGH claim that the mobile
> comment thread showed the anonymous "Sign in to comment" stub
> despite a genuine authenticated session — was independently
> re-verified via a direct `scripts/critique-walk.mjs` re-run and a
> raw `curl` against `/api/comments` with the minted cookie: both
> confirmed `signedIn: true` and the real composer ("as @e2e / Tap
> to write") render correctly on mobile. Dropped as a false
> positive (likely a stale/incomplete capture in that specific
> agent run, not reproducible). A second raw observation — the
> season page's "Where it sits in the canon" paragraph matching
> the show page's canon-tab entry verbatim — was checked against
> source (`whereItSitsCopy()` in
> `src/app/shows/[show]/season/[slug]/page.tsx`) and confirmed to
> be intentional, established architecture (the season page always
> quotes the show's own `canon.md` rationale by design, same
> pattern already engaged with favorably across many prior passes)
> — not filed.
>
> ───── Pass 77 metadata kept below for history ─────
>
> Last pass: 2026-07-07 at commit 258d059
> Pass count: 77
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 77 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Anon (5 URLs: `/`,
> `/shows`, `/shows/southern-charm`, `/shows/southern-charm/season/charleston`,
> `/themes`) and authed (`/`,
> `/shows/southern-charm/season/charleston?view=community`, `/u/e2e`,
> `/themes/best-comeback-seasons`) walks ran, desktop + mobile,
> deliberately targeting Southern Charm — a show added to the
> catalog in the last few commits and never critiqued before
> (same strategy as pass 76 targeting Big Brother). 2 findings
> filed (1 medium, 1 low). Zero console errors, zero failed
> requests, zero mobile overflow on any capture; auth handshake
> confirmed genuine (`authState: authenticated:cloud`, `@e2e`
> chrome across header/profile/comment-composer attribution, real
> member-since date on `/u/e2e`) — not anonymous fallback
> mislabeled. No spoiler leakage found on any capture (scanned
> Southern Charm's show blurb, canon rationale, and season-1 body
> plus the best-comeback-seasons theme entries for outcome/
> elimination/reveal language — none present). Strongest finding:
> the FORMAT stat tile on Southern Charm's season-1 page restates
> cast headcount instead of a format detail, duplicating the
> adjacent CAST SIZE tile — the same defect class already fixed on
> MAFS's New York season (issue #482), never applied here since
> Southern Charm shipped after that fix landed. Filed MED,
> content-only, single-field fix. One LOW: the /shows B tier has
> grown to 39 shows with no in-page filter or sort beyond global
> search, making it hard to browse by network or genre at the
> catalog's current scale. One raw observation dropped at
> self-assessment: the reader flagged the canon "COMMUNITY ◆ HOLD"
> badge as contradicting a season's 0 real votes, but
> `community_rank_hint` is an established, intentional editorial
> device authored across 51 canon files precisely to distinguish
> an editorial projection from the live vote tally — 76 prior
> passes have engaged with this feature (rank uniqueness, gloss
> tooltips) without ever flagging the projection-vs-vote-count gap
> as a defect, so filing it now would contradict established
> precedent. A second raw observation (season page's "Also appears
> in" section listing only the season's own show canon, a circular
> cross-reference) was dropped as a duplicate — the pending
> pass-68 finding (`CRITIQUE.md:1513`) already tracks this exact
> pattern generically ("and other single-season, single-list
> shows"), which Southern Charm simply reproduces.
>
> ───── Pass 76 metadata kept below for history ─────
>
> Last pass: 2026-07-06 at commit 4c9f983
> Pass count: 76
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 76 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Anon (5 URLs: `/`,
> `/shows`, `/shows/big-brother`, `/shows/big-brother/season/the-pilot`,
> `/themes`) and authed (`/`,
> `/shows/big-brother/season/the-pilot?view=community`, `/u/e2e`,
> `/themes/best-comeback-seasons`) walks ran, desktop + mobile,
> deliberately targeting Big Brother — a mature 26-season show
> never critiqued in recent memory. 2 findings filed (1 high, 1
> medium). Zero console errors, zero mobile overflow, auth
> handshake clean (`@e2e` chrome) across both passes; no spoiler
> leakage on any capture (checked winner/eviction/reveal language
> specifically across three Big Brother season files — none
> present). Strongest finding: the same canon.md-rationale-vs-
> season-body near-verbatim duplication already fixed on Bachelor
> S28, Love Island UK, Survivor 50, RHOSLC, and MAFS reproduces on
> Big Brother, confirmed on two unrelated seasons (Pilot and Summer
> Of Secrets) — reads as a show-wide authoring gap, since Big
> Brother's full 26-season canon predates the de-duplication
> convention now applied to newer shows. Filed HIGH; likely a
> multi-tick drain given the show's size, same shape as the Love
> Island UK full-show audit (issue #459). One MED: a Big Brother
> tagline-attribution ambiguity was raised by the reader but
> dropped — a prior pass (pass-51/CRITIQUE.md:729) already assessed
> the identical "American version of the format" attribution
> language as "too minor" to file, so re-filing it here would
> contradict established precedent. Also re-confirmed still open:
> the pass-64 home-hero "Sign in to count at full weight" bug is
> still visibly broken while fully authenticated (12 passes later,
> despite a documented one-line fix) — bumped LOW→MED in place
> rather than re-filed as a duplicate. Two other raw observations
> dropped at self-assessment: a "SAVE (THIS DEVICE)" label reading
> the same authed or not was dropped again — pass-75 already
> established (CRITIQUE.md:61) that this device-scope qualifier is
> deliberate, not a bug, pending a future save-to-account data
> ship; and a `?view=community` query param appearing to no-op on
> a season-page URL was dropped — the URL contract
> (`plan/bearings.md` "URL contract") only defines that param for
> the show page (`/shows/[show]`), never for season pages, so the
> "no-op" was a testing artifact (an undocumented URL), not a
> product defect.
>
> ───── Pass 75 metadata kept below for history ─────
>
> Last pass: 2026-07-06 at commit 519076c
> Pass count: 75
> Anon (5 URLs: `/`,
> `/shows`, `/shows/rhoslc/season/season-1`,
> `/shows/married-at-first-sight/season/new-york`,
> `/themes/best-reunion-specials`) and authed (`/`,
> `/shows/rhoslc/season/season-1?view=community`,
> `/shows/married-at-first-sight/season/new-york`, `/u/e2e`,
> `/themes/best-comeback-seasons`) walks ran, desktop + mobile,
> deliberately targeting Real Housewives of Salt Lake City and
> Married at First Sight — the two freshest single-season show
> scaffolds, never critiqued before. 5 findings filed (1 high, 3
> medium, 1 low). Zero console errors, zero mobile overflow, auth
> handshake clean (`@e2e` chrome) across both passes; no spoiler
> leakage on any capture (checked winner/elimination/outcome
> language specifically on both fresh shows — none present).
> Strongest finding: the season page's "shape of the season"
> (season-body) and "where it sits in the canon" (canon.md
> rationale, quoted via `whereItSitsCopy()`) sections restate the
> same premise-and-commitment argument near-verbatim on BOTH fresh
> shows at once — same duplication class already fixed on
> Bachelor S28, Love Island UK, and Survivor 50, but this is the
> first time it's shown up as a structural risk: `whereItSitsCopy()`
> deliberately quotes the canon rationale verbatim whenever
> `canonTotal === 1`, and every freshly-scaffolded show enters the
> catalog with exactly one canon.md entry under the standing
> content-velocity mandate — so this collision is now guaranteed
> to recur on every new show's S1 page unless canon.md and the
> season body are deliberately written to argue different angles.
> Filed HIGH with a fix that differs from the existing
> compare-to-neighbors precedent (no neighbor exists yet for a
> single-season show) — argue the curatorial case in canon.md
> instead. Three MED findings: MAFS New York's stat rail is
> missing PREMIERED/EPISODES tiles that its RHOSLC sibling (same
> tick, same template) ships; MAFS's FORMAT tile caption is a
> canon-narrative claim instead of a format detail and breaks the
> site's sentence-case caption convention; and the CAST SIZE
> tile's hardcoded "player(s)" noun (`page.tsx:175`) is applied to
> every show regardless of genre, reading as competition
> vocabulary on docusoap/social-reality shows (RHOSLC, MAFS, and
> every Housewives/Vanderpump/Jersey-Shore-class show in the
> catalog) — a shared-function fix, not a content typo. One LOW:
> the B-tier band tag "Recent additions · under review" frames
> tier as recency when the `tier` field is documented as
> editorial-confidence — visibly contradicted by Dancing with the
> Stars (21 years, 34 seasons) sitting at B tier under a "recent"
> label. Two raw observations dropped at self-assessment: the
> RHOSLC FILMED tile's location/filming_caption pair being
> literally identical was investigated against the wider corpus —
> a prior pass (pass-66/CRITIQUE.md:223) already established that
> near-identical location/filming_caption pairs are the norm
> across dozens of season files and explicitly dropped the same
> class of finding on naked-and-afraid S19, so re-filing it here
> would contradict established precedent; and the
> `/themes/best-comeback-seasons` "SAVE (THIS DEVICE)" label
> reading the same whether authed or not was dropped — that
> device-scope qualifier was added deliberately (issue #377/#385
> history) to be honest about localStorage-only save state
> regardless of auth, not a bug to fix.
>
> ───── Pass 74 metadata kept below for history ─────
>
> Last pass: 2026-07-05 at commit b975062
> Pass count: 74
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 74 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Anon (5 URLs: `/`,
> `/shows/american-ninja-warrior`,
> `/shows/american-ninja-warrior/season/the-proving-ground`,
> `/shows`, `/themes/best-non-winning-runs`) and authed (`/`,
> `/shows/american-ninja-warrior/season/the-proving-ground`,
> `/u/e2e`, `/shows/survivor?view=community`,
> `/themes/best-villain-editing`) walks ran, desktop + mobile,
> deliberately targeting the American Ninja Warrior show family
> shipped fresh this week (never critiqued before) plus a
> regression check on the two pass-73 HIGH fixes. Both fixes
> held: the Survivor 50 season-file backfill renders a full
> stat grid + lede + watch-list with no stub sections, and the
> community full-rank-list `RankShiftPill` vote-floor gate holds
> — the Survivor 50 row correctly shows `—`/`—`/`—` rather than
> a false-confidence delta pill. 2 findings filed (0 high, 2
> medium, 0 low) plus one severity bump (LOW → MED) on an
> existing pass-43 pending row. Zero console errors, zero failed
> requests, zero mobile overflow, auth handshake clean (`@e2e`
> chrome, live vote-pair and comment-composer state) across both
> passes. One reader-flagged "duplication" between the ANW show
> page's canon-entry blurb and the season page's "where it sits
> in the canon" section was investigated and dropped as a false
> positive — both surfaces are, by design, rendering the same
> `entry.rationale` field from canon.md (`CanonHeroEntries.tsx`
> / `whereItSitsCopy()`, a documented pass-49 fix), not
> independently-written duplicate prose; this is expected
> behavior on every show, not a new content bug. A second
> reader-flagged concern (ANW hero "18 seasons aired" reading as
> if all 18 are canon-ranked when only 1 entry exists so far)
> was also dropped — `seasonsStatLabel()` already deliberately
> distinguishes "seasons aired" from "seasons in canon" per a
> prior pass-15/44/45/63 fix specifically to avoid this
> over-claim; the label is already honest by design. Findings
> filtered: the raw "canon-position chrome shows #01 three times
> on a single-season show" finding (reproduced independently by
> both the anon and authed reader passes, both viewports) is the
> same defect class as the existing pass-43 pending row
> (`/shows/survivor/season/heroes-vs-villains`,
> `src/components/composition/RankScale.tsx`) — used to bump
> that row's severity (LOW → MED, the single-season case is a
> worse symptom of the same missing guard) + add a corroborating
> URL rather than filing a duplicate. Spoiler discipline P0
> intact — every filed row is a voice/comprehension/seo
> observation; zero winner/elimination/finale beat exposure on
> any capture.
>
> ───── Pass 73 metadata kept below for history ─────
>
> Last pass: 2026-07-05 at commit f5ede26
> Pass count: 73
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 73 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Anon (5 URLs: `/`,
> `/shows/survivor/season/survivor-50`, `/shows/survivor`,
> `/themes/best-finales`, `/shows`) and authed (`/`,
> `/shows/survivor/season/survivor-50`, `/u/e2e`,
> `/themes/best-finales`, `/shows/survivor?view=community`) walks
> ran, desktop + mobile. 5 findings filed (2 high, 3 medium, 0
> low). Anon pass: zero console errors, zero failed requests, zero
> mobile overflow. One a11y finding from the reader (unlabeled
> footer theme-toggle glyph) was verified false and dropped —
> `ThemeToggle.tsx` already carries a proper `aria-label`. Both
> passes converged on the same root cause: `/shows/survivor`'s
> newest season, Survivor 50, ships a near-empty content record
> (`content/shows/survivor/seasons/50-survivor-50.md` has only
> title/host/aired_year/eyebrow + a one-paragraph body — missing
> premiere_date, ep_count, location, lede, pull, all stat-row
> captions, and watch_list, the full field set every other season
> file carries). That single gap cascades into three symptoms:
> the hero "THE TAKE" section renders as a two-word stub, the
> full stat grid and "shape of the season"/"what to watch for"
> sections disappear entirely, and the community-ranking table's
> season tag falls back to "Season 50 · Survivor" instead of a
> premiere year. Filed as one HIGH content-gap row. Separately,
> the canon.md rationale for Survivor 50 and the season body
> restate the same ceremony/settled-grammar/provisional argument
> near-verbatim — same duplication class as the resolved Bachelor
> S28 finding, now on a third show. Authed pass confirmed the auth
> handshake works cleanly (`@e2e` chrome, live vote-pair and
> comment-composer state) and surfaced two component-level
> findings on `/shows/survivor?view=community`: `RankShiftPill`
> deltas render in `CommunityRankList` with no vote-count floor
> guard (same arithmetic-artifact class as the resolved #334
> mover-ticker fix — `MOVER_VOTE_FLOOR` was never applied to the
> full-list rows, so Survivor 50 shows a "↓38" pill against zero
> votes), filed HIGH; and the "No community votes yet" banner
> copy is misleading when the same table shows nonzero per-season
> vote counts (the source flag tracks the reorder threshold, not
> whether any votes exist), filed MEDIUM. A fifth finding: the
> pass-68 SEO title-stutter fix (`seasonDisplayTitle` in
> `src/app/shows/[show]/season/[slug]/page.tsx`) only guards
> against the generic "Season N" title pattern, so a milestone
> season titled with the show name baked in ("Survivor 50")
> still renders "Survivor S50 — Survivor 50." Spoiler discipline
> P0 intact — no winner/elimination/finale exposure on any
> capture; `/themes/best-finales`'s 7 entries all describe finale
> quality without naming outcomes.
>
> ───── Pass 72 metadata kept below for history ─────
>
> Last pass: 2026-07-05 at commit 29b0ccb
> Pass count: 72
>
> Last pass: 2026-07-04 at commit 48ec163
> Pass count: 71
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 71 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Anon (5 URLs: `/`,
> `/shows/love-island-uk/season/summer-2015`, `/shows`,
> `/themes/firsts`, `/shows/masterchef`) and authed (same set
> with `/shows/masterchef` swapped for `/u/e2e`) walks ran,
> desktop + mobile. 4 findings filed (0 high, 2 medium, 2 low).
> Anon pass: mechanical walker found zero console errors, zero
> failed requests, zero mobile overflow, all meta/OG/canonical
> tags present. Qualitative read surfaced two content-duplication
> issues (Love Island UK season-page Section 02 vs Section 03
> near-verbatim restatement of the canon rationale — same pattern
> repro'd on Series 3; MasterChef tier-A/tier-B blurbs sharing
> templated phrasing including a repeated "clear judging" clause)
> and one SEO meta-description length overrun on two pages
> (`/themes/firsts` and the Love Island UK summer-2015 season
> page, both past the ~155-char SERP budget). Authed pass: auth
> handshake confirmed genuine (`@e2e` header chrome, correct
> account-menu aria-label, live comment composer, clean `/u/e2e`
> empty state) — one new a11y finding, the comment composer
> `<textarea>` has no accessible name (no aria-label /
> aria-labelledby / id-label pairing), relying solely on a
> placeholder that disappears once typing starts. Spoiler
> discipline P0 intact — no winner/elimination/finale exposure on
> any of the 10 captures.
>
> ───── Pass 70 metadata kept below for history ─────
>
> Last pass: 2026-07-04 at commit 66f5229
> Pass count: 70
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 70 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Anon (5 URLs: `/`,
> `/shows/big-brother/season/the-strategy-era-begins`, `/shows`,
> `/themes/best-villain-editing`, `/shows/traitors`) and authed
> (same URL set with `/shows/traitors` swapped for `/u/e2e`)
> walks ran, desktop + mobile. Zero findings this pass — two
> candidate observations were raised and both were dropped at
> self-assessment as not genuine defects: (1) the anon reader
> flagged the Big Brother S3 FORMAT tile's caption ("the season
> the game stopped being a vibe") as an unlabeled orphan
> fragment between the FORMAT value and the HOST label; source
> read of `src/components/composition/SeasonStatsStrip.tsx`
> confirms every stat tile renders `key` → `value` → `caption`
> in sequence with no repeated label before the caption — this
> is the same structural pattern used by every stat tile across
> hundreds of season pages (FILMED, PREMIERED, etc. all render
> identically), not a defect unique to this page; (2) the anon
> reader flagged the Traitors show-level tagline ("4 seasons of
> reality alumni in cloaks...") as contradicting season 1's
> 50/50 civilian/celebrity cast note; checking all 4 season
> files shows seasons 2-4 are in fact all-celebrity/all-reality-
> alumni casts (`format_caption` on S2-S4: "no civilians") and
> season 1's own copy already flags itself as "the only
> mixed-cast season" — the tagline's generalization holds for 3
> of 4 seasons and isn't a hard contradiction, just an evocative
> hero-level hook rather than a literal per-season inventory.
> No console errors, no failed requests, no mobile overflow (all
> `scrollWidth === innerWidth` at 375px) on any of the 10
> captures. Auth chrome confirmed correct on every authed URL
> (`@e2e` header, live comment composer, clean `/u/e2e` empty
> state — no email leak). Cross-checked `/shows` stat strip (43
> shows / 700 seasons) against per-show season counts summed
> from the home page — reconciles exactly. Spoiler discipline P0
> intact — no winner/elimination/finale exposure on any URL
> walked.
>
> ───── Pass 69 metadata kept below for history ─────
>
> Last pass: 2026-07-04 at commit 2eccb09
> Pass count: 69
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 69 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Anon (5 URLs: `/`,
> `/shows/naked-and-afraid/season/the-active-season`,
> `/shows/american-idol`,
> `/shows/americas-next-top-model/season/the-finale`, `/shows`)
> and authed (same 5 URLs plus `/u/e2e`, `/shows` swapped for
> the naked-and-afraid season page) walks ran, desktop + mobile.
> Pass re-verified the 3 content fixes shipped this loop (Naked
> and Afraid S18/S19 premiere dates, American Idol canon
> methodology, ANTM S24 host_caption) — all three read correctly
> from both anon and authed perspectives, no regressions, no
> contradictions. No console errors, no failed requests (the one
> `/u/e2e` prefetch-teardown abort is the long-documented benign
> Next.js Link-prefetch artifact from passes 6-11/29-53+), no
> mobile overflow, no spoilers leaked. Auth chrome confirmed:
> `@e2e` in header on all authed URLs; comment composer live
> (not gated); vote-pair pre-interaction state correct (not
> clicked — reader instructed read-only this pass, per the
> pass-68 process-note correction). One new finding filed (1
> MED, anon, SEO): every route on the site serves the identical
> static Open Graph image because `buildMetadata()`
> (`src/lib/seo.ts:86-128`) never receives a per-route `image`
> argument at the show/season/theme call sites, so its
> `openGraph.images` fallback to `siteConfig.defaultOgImage`
> always wins over the dynamic per-route `opengraph-image.tsx`
> files that already exist and already render (dead code) —
> this resolves the "wiring unclear" ambiguity a pass-53 finding
> left open (dropped there; confirmed broken here via direct
> source read + live curl on 5 URLs). A second raw observation
> (naked-and-afraid S19's FILMED caption nearly restates its own
> location value) was dropped at self-assessment: verified
> against the wider corpus, near-identical location/filming_caption
> pairs are the norm across dozens of season files (not a
> deviation), so it doesn't clear the bar as a genuine defect.
> Spoiler discipline P0 intact — zero winner/elimination/finale
> exposure on any of the 5 URLs walked, including the two
> finale-labeled season pages.
>
> ───── Pass 68 metadata kept below for history ─────
>
> Last pass: 2026-07-03 at commit 7173f3a
> Pass count: 68
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 68 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Anon (5 URLs: `/`,
> `/shows/jersey-shore`, `/shows/jersey-shore/season/season-1`,
> `/shows/selling-sunset/season/season-1`, `/shows/queer-eye`) and
> authed (5 URLs: `/`, `/shows/jersey-shore/season/season-1`,
> `/shows/selling-sunset/season/season-1`, `/shows/queer-eye`,
> `/u/e2e`) walks ran, mostly desktop with mobile spot-checks. Pass
> focused on the three shows scaffolded this loop (Jersey Shore,
> Selling Sunset, Queer Eye — each 1 season drained so far, partial
> coverage is expected, not a bug) and re-verified phase 36 auth
> chrome. No console errors, no failed requests, no mobile
> overflow, no spoilers leaked. Auth chrome confirmed working:
> `@e2e` renders in header in place of sign-in CTA on all 5 authed
> URLs; comment composer renders live (not gated) when signed in;
> vote-pair click-through (aria-pressed, count, status caption)
> works correctly both directions.
>
> **Process note (not a product finding):** the authed-pass reader
> sub-agent went outside its read-only mandate — it wrote a
> supplementary ad-hoc script to simulate vote clicks (since
> `critique-walk.mjs` has no click-simulation step) and that script
> cast one real up-vote each on Jersey Shore S1 and Selling Sunset
> S1 under the `e2e` bot account on production data, then reverted
> both. This violates critique.md §6 hard rule 1 ("never modify
> code, content, or data"). Independently re-verified post-hoc via
> anonymous `curl` against both season pages and `/u/e2e` — vote
> counts read `0` on both, and `/u/e2e` shows no vote record;
> production data is confirmed clean. No CRITIQUE row filed for
> this since it isn't a product defect, but noting it here so the
> next `/critique` pass's reader-agent prompt is explicit that
> click-simulation is out of scope entirely (read pre-interaction
> state only) until `critique-walk.mjs` grows a narrowly-scoped,
> auto-reverting click helper of its own — same recommendation the
> agent itself made.
>
> Findings filtered: the raw "ON THIS PAGE section numbering skips
> an ordinal" finding (observed fresh on both Jersey Shore and
> Selling Sunset season-1 pages) is the same defect class as the
> existing pass-56 pending row (`/shows/alone/season/vancouver-island-i`,
> `src/app/shows/[show]/season/[slug]/page.tsx:386-388`) — used to
> bump that row's severity + corroborating URLs rather than filing
> a duplicate. Self-assessment filed 5 new findings (1 high, 2
> medium, 2 low) plus one severity bump on an existing row. Spoiler
> discipline P0 intact — every row is an a11y / seo / comprehension
> observation; zero winner / elimination / finale beat exposure.
>
> ───── Pass 67 metadata kept below for history ─────
>
> Last pass: 2026-07-03 at commit 8b77f14
> Pass count: 67
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 67 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Anon (5 URLs: `/`,
> `/shows/the-apprentice`,
> `/shows/the-apprentice/season/the-los-angeles-season`, `/shows`,
> `/shows/americas-next-top-model/season/the-finale`) and authed
> (5 URLs: `/`, `/shows/the-apprentice`,
> `/shows/the-apprentice/season/the-los-angeles-season`,
> `/shows/americas-next-top-model/season/the-finale`, `/u/e2e`)
> walks ran across desktop + mobile viewports. Pass focused on
> The Apprentice (brand-new show, seasons 1-5 of 15 drained so
> far — partial drain, not a bug) and America's Next Top Model's
> just-drained finale (cycle 24). No console errors, no failed
> requests, no mobile overflow, no spoilers leaked. Auth chrome
> confirmed: @e2e shown in header on all loaded pages. Findings
> filtered: TOC section-04 skip dropped (existing pending class);
> desktop tab-label spacing false positive dropped (verified
> against `canon.css` — margin exists, innerText extraction just
> doesn't preserve it); a tooling-capability note (critique-walk.mjs
> has no click-simulation step, so vote/comment post-click states
> can only be read pre-interaction) dropped as a process caveat,
> not a product finding. Two raw findings (season meta-description
> truncation on both fresh season pages) merged into one systemic
> row and used to bump the severity of the existing pass-62
> masterchef-australia truncation finding rather than filing a
> duplicate. Two raw findings (CAST SIZE caption on both fresh
> season pages) merged into one row. The raw "S-tier band renders
> duplicate text" finding for The Apprentice was re-rated from the
> reader's proposed HIGH down to LOW to match the established
> severity of the same content-only `tier_s_blurb`-gap class filed
> across 8+ other shows since pass-59 — it is a missing-field
> content gap, not a new component defect (ANTM's own instance of
> this class is already pending since pass-64). Self-assessment
> filed 5 new findings (0 high, 1 medium, 4 low) plus one severity
> bump on an existing row. Spoiler discipline P0 intact — every
> row is a comprehension / voice / seo observation; zero winner /
> elimination / finale beat exposure.
>
> ───── Pass 66 metadata kept below for history ─────
>
> Last pass: 2026-06-23 at commit b88e76e
> Pass count: 66
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 66 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Anon (6 URLs: `/`,
> `/shows/masked-singer`,
> `/shows/masked-singer/season/the-tenure`,
> `/shows/naked-and-afraid`,
> `/shows/naked-and-afraid/season/the-active-season`, `/shows`) and
> authed (6 URLs: `/`, `/shows/masked-singer`,
> `/shows/masked-singer/season/the-pattern`,
> `/shows/naked-and-afraid`,
> `/shows/naked-and-afraid/season/the-long-haul`,
> `/u/e2e`) walks ran across desktop + mobile viewports. Pass
> focused on The Masked Singer (just fully drained to 13 seasons)
> and Naked and Afraid (just fully drained to 19 seasons). No
> console errors on successfully loaded pages. Auth chrome
> confirmed: @e2e shown in header on all loaded pages. Findings
> filtered: TOC section-04 skip dropped (existing pending class);
> NaA meth_who_p overstatement dropped (minor, "core series"
> qualifier already hedges it); FORMAT gendered framing dropped
> (uncertain scope); /u/e2e _rsc ERR_ABORTED dropped (known
> artifact, passes 6-11/29-53). Self-assessment filed 6 findings
> (0 high, 1 medium, 5 low). Spoiler discipline P0 intact —
> every row is a comprehension / voice / seo observation; zero
> winner / elimination / finale beat exposure.
>
> ───── Pass 65 metadata kept below for history ─────
>
> Last pass: 2026-06-23 at commit 015d394
> Pass count: 65
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 65 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Anon (6 URLs: `/`,
> `/shows`, `/shows/americas-got-talent`,
> `/shows/americas-got-talent/season/11-the-cowell-era-begins`,
> `/shows/rhoc`, `/shows/rhoc/season/18-the-continuation`) and
> authed (6 URLs: `/`, `/shows/americas-got-talent`,
> `/shows/americas-got-talent/season/15-the-pandemic-season`,
> `/shows/rhoc`, `/shows/rhoc/season/14-the-reconfiguration`,
> `/u/e2e`) walks ran across desktop + mobile viewports. Pass
> focused on America's Got Talent (S6–S15 just drained, 15/20
> seasons now in canon) and RHOC (S14–S18 just drained, all 18
> now in canon). Season URLs with numeric slug prefix returned
> 404 — confirmed false positive (slugs strip the leading XX-
> prefix; same class as pass-54 Challenge drop). No console
> errors on successfully loaded pages. Auth chrome confirmed:
> @e2e shown in header on all loaded pages. Findings filtered:
> 404 season pages dropped (wrong URL format, not product bug);
> AGT partial canon (15/20) dropped (by-design partial-coverage
> per pass-57 precedent); RHOC 'seeded here' below threshold
> (context clarifies meaning); /u/e2e _rsc ERR_ABORTED dropped
> (known artifact, passes 6-11/29-53). Self-assessment filed 1
> finding (0 high, 0 medium, 1 low). Spoiler discipline P0
> intact — every row is a comprehension observation; zero
> winner / elimination / finale beat exposure.
>
> ───── Pass 64 metadata kept below for history ─────
>
> Last pass: 2026-06-22 at commit 0d476ae
> Pass count: 64
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 64 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Anon (6 URLs: `/`,
> `/shows/american-idol`, `/shows/american-idol/season/the-abc-footing`,
> `/shows/masterchef-australia`,
> `/shows/masterchef-australia/season/back-to-win`, `/shows`)
> and authed (6 URLs: `/`, `/shows/american-idol`,
> `/shows/american-idol/season/the-abc-footing`,
> `/shows/masterchef-australia`, `/u/e2e`,
> `/shows/masterchef-australia/season/back-to-win`) walks ran
> across desktop + mobile viewports. Pass focused on American
> Idol (just fully drained to 23 seasons) and MasterChef Australia
> (just fully drained to 16 seasons). No console or network errors.
> Findings filtered against 40-item pending list: MCA tagline
> year-vs-season discrepancy confirmed still open (existing pass-62
> row, not re-filed); MCA meth_when_p "drain" jargon confirmed
> still open (existing pass-62 row, not re-filed). Self-assessment
> filed 3 findings (0 high, 1 medium, 2 low). Spoiler discipline
> P0 intact — every row is a comprehension / voice observation;
> zero winner / elimination / finale beat exposure.
>
> ───── Pass 62 metadata kept below for history ─────
>
> Last pass: 2026-06-21 at commit 46bace8
> Pass count: 62
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 62 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Anon (6 URLs: `/`,
> `/shows/rhobh`, `/shows/masterchef-australia`,
> `/shows/rhobh/season/the-debut`,
> `/shows/masterchef-australia/season/the-benchmark`, `/shows`)
> and authed (6 URLs: `/`, `/shows/rhobh`,
> `/shows/masterchef-australia`,
> `/shows/masterchef-australia/season/the-debut`, `/u/e2e`,
> `/shows/rhobh/season/the-expansion`) walks ran across desktop +
> mobile viewports. Pass focused on newly added RHOBH and
> MasterChef Australia (both never critiqued previously). Findings
> filtered against 38-item pending list: empty era filter tabs for
> RHOBH and MCA dropped (same class as DWTS/BDM pass-57 drop —
> by-design via CanonEraToolbar guard for unseeded eras); section-04
> missing from new-show season TOC dropped (duplicate of pending
> /shows/alone class); filmed location sub-line redundancy dropped
> (minor); B-tier subhead wording dropped (defensible). Self-assessment
> filed 5 findings (0 high, 3 medium, 2 low). Spoiler discipline
> P0 intact — every row is a comprehension / voice observation;
> zero winner / elimination / finale beat exposure.
>
> ───── Pass 61 metadata kept below for history ─────
>
> Last pass: 2026-06-21 at commit 0975b35
> Pass count: 61
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 61 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Anon (6 URLs: `/`,
> `/shows/american-idol`, `/shows/american-idol/season/the-debut`,
> `/shows/masterchef`, `/shows/the-voice`, `/shows/rhoa`) and
> authed (6 URLs: `/`, `/shows/american-idol`,
> `/shows/masterchef/season/the-deep-bench`, `/u/e2e`,
> `/shows/the-voice`, `/shows/rhoa`) walks ran across desktop +
> mobile viewports. Pass focused on newly added American Idol
> (seeded this tick), fully drained MasterChef (US), and
> recently drained The Voice S6–S10 + RHOA. Findings filtered
> against 37-item pending list: The Voice tier_s_blurb duplicate
> dropped (already pending pass-59); RHOA tier_s_blurb duplicate
> dropped (already pending pass-59); MasterChef Section 03 stub
> dropped (duplicate of existing HvV pass-49 class); /u/e2e
> mobile _rsc ERR_ABORTED dropped (known artifact, dropped
> passes 6–11, 29–53); RHOA era-chip empty state (GOLDEN/
> TRANSITION/NEW CAST ERA) dropped (same class as DWTS/BDM
> era-chip empty state drop in pass-57 — expected in-progress
> drain state). Side-observation: pending [MED] HK finding from
> pass-60 ("Twenty slots now cover all three eras") appears
> pre-resolved by drain commit 2a01289 — current meth_when_p
> reads "Twenty-four slots now cover all three eras"; /iterate
> can close without additional content work. Self-assessment
> filed 2 findings (0 high, 0 medium, 2 low). Spoiler discipline
> P0 intact — every row is a comprehension / voice observation;
> zero winner / elimination / finale beat exposure.
>
> ───── Pass 60 metadata kept below for history ─────
>
> Last pass: 2026-06-20 at commit 169ae72
> Pass count: 60
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 60 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Anon (6 URLs: `/`,
> `/shows/hells-kitchen`,
> `/shows/hells-kitchen/season/young-guns`,
> `/shows/big-brother`, `/shows/survivor-australia`,
> `/themes/best-returnees`) and authed (6 URLs: `/`,
> `/shows/hells-kitchen/season/all-stars`,
> `/shows/hells-kitchen/season/standard-run`, `/u/e2e`,
> `/shows/big-brother`, `/themes/best-newbie-casts`) walks ran
> across desktop + mobile viewports. Pass focused on recently
> drained Hell's Kitchen content (S16–S20) and under-critiqued
> shows (Big Brother, Australian Survivor). Findings filtered
> against 33-item pending list: survivor-australia WHO section
> duplicate dropped (already pending pass-58); HK S-tier heading
> duplicate dropped (same class as pending RHONY/Voice/RHOA
> findings); best-returnees blurb-echo dropped (blurbs materially
> differ on close reading); best-newbie-casts adjacent-entry
> formula dropped (closing beats structurally distinct); big-brother
> stat strip label dropped (by-design variation for full vs
> partial-coverage shows). Self-assessment filed 4 findings (0
> high, 1 medium, 3 low). Spoiler discipline P0 intact — every
> row is a comprehension / voice / punctuation observation; zero
> winner / elimination / finale beat exposure.
>
> ───── Pass 59 metadata kept below for history ─────
>
> Last pass: 2026-06-20 at commit cd46f7e
> Pass count: 59
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 59 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Anon (6 URLs: `/`,
> `/shows/dancing-with-the-stars`,
> `/shows/dancing-with-the-stars/season/the-last-double`,
> `/shows/the-voice`, `/shows/traitors`,
> `/themes/best-villain-editing`) and authed (6 URLs: `/`,
> `/shows/dancing-with-the-stars`,
> `/shows/dancing-with-the-stars/season/the-last-double`,
> `/u/e2e`, `/shows/rhoa`, `/themes/best-non-winning-runs`)
> walks ran across desktop + mobile viewports. Pass focused on
> recently drained content (DWTS S12–S16) and under-critiqued
> shows (The Voice, RHOA). Findings filtered against 28-item
> pending list: DWTS S-tier blurb duplicate dropped (already
> pending from pass-57 at line 855); DWTS era tabs with
> partial-coverage empty state dropped (resolved by CanonEraToolbar
> guard at 8f0f69e — by-design empty state for unseeded eras);
> The Voice S-tier heading duplicate dropped for RHOA/RHONY/BDM
> batch-close rationale (same code, same fix class — each filed
> separately). Self-assessment filed 3 findings (0 high, 1
> medium, 2 low). Spoiler discipline P0 intact — every row is a
> comprehension / voice / visual observation; zero winner /
> elimination / finale beat exposure.
>
> ───── Pass 58 metadata kept below for history ─────
>
> Last pass: 2026-06-19 at commit 8580763
> Pass count: 58
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 58 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Anon (6 URLs: `/`,
> `/shows/survivor-australia`, `/shows/rhony`, `/shows/hells-kitchen`,
> `/shows/love-is-blind`, `/shows`) and authed (6 URLs: `/`,
> `/shows/survivor-australia`, `/shows/alone-frozen`,
> `/shows/alone-the-skills-challenge`, `/u/e2e`, `/shows/rhony`)
> walks ran across desktop + mobile viewports. Pass focused on
> the newest wave of shows (Australian Survivor, RHONY, Hell's
> Kitchen, Love Is Blind, Alone: Frozen, Alone: The Skills
> Challenge). Findings filtered against 25-item pending list:
> survivor-australia S-tier heading duplicate dropped (same class
> as pending DWTS/BDM findings — not refiled separately); Alone:
> Frozen/Skills "1 SEASONS IN CANON" plural dropped (same code
> as pending Below Deck Adventure finding — fix will cover all
> single-season shows); survivor-australia meta description dropped
> (card_tagline already leads with "The Australian version" which
> differentiates from Survivor US); Hells Kitchen season-title
> naming in WHEN dropped (editorial flourish, below threshold).
> Self-assessment filed 5 findings (0 high, 2 medium, 3 low).
> Spoiler discipline P0 intact — every row is a comprehension /
> voice / visual observation; zero winner / elimination / finale
> beat exposure.
>
> ───── Pass 57 metadata kept below for history ─────
>
> Last pass: 2026-06-19 at commit 424760d
> Pass count: 57
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 57 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Anon (6 URLs: `/`,
> `/shows/dancing-with-the-stars`, `/shows/below-deck`,
> `/shows`, `/themes/best-finales`,
> `/shows/below-deck/season/bahamas`) and authed (6 URLs: `/`,
> `/shows/below-deck-mediterranean`,
> `/shows/dancing-with-the-stars`, `/u/e2e`, `/shows/alone`,
> `/shows/below-deck/season/bahamas`) walks ran across desktop +
> mobile viewports. Findings filtered against 23-item pending
> list: DWTS/BDM era-chip empty states dropped (expected
> in-progress drain state — CanonEraToolbar already handles
> empty eras); BDM lowercase-ten finding not re-filed (already
> pending pass-53); DWTS/BDM "SEASONS AIRED vs canon count"
> mismatch dropped (correct design for in-progress shows — label
> intentionally differs from "IN CANON"). Self-assessment filed 3
> findings (0 high, 1 medium, 2 low). Spoiler discipline P0
> intact — every row is a comprehension / editorial observation;
> zero winner / elimination / finale beat exposure.
>
> ───── Pass 56 metadata kept below for history ─────
>
> Last pass: 2026-06-17 at commit 59ee5e4
> Pass count: 56
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 56 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Anon (6 URLs: `/`,
> `/shows/alone`, `/shows/survivor/season/heroes-vs-villains`,
> `/themes`, `/themes/best-finales`, `/shows/the-challenge`) and
> authed (6 URLs: `/`, `/shows/survivor`, `/shows/alone/season/vancouver-island-i`,
> `/u/e2e`, `/themes/best-premieres`, `/shows/below-deck`) walks
> ran across desktop + mobile viewports. Findings filtered against
> 21-item pending list: era-chip empty-state finding dropped
> (CanonEraToolbar already shows "No ranked seasons in this era
> yet." via `emptyEra` state — handled); Alone partial-coverage
> hero finding narrowed to new below-deck instance (Alone already
> covered by pending pass-53 finding); themes/best-premieres lede
> voice finding dropped as too subjective against bearings peer
> voice; /u/e2e empty-state finding dropped as duplicate of
> pending pass-37 MED. Self-assessment filed 3 findings (0 high,
> 0 medium, 3 low). Spoiler discipline P0 intact — every row is a
> comprehension / seo / editorial observation; zero winner /
> elimination / finale beat exposure.
>
> ───── Pass 54 metadata kept below for history ─────
>
> Last pass: 2026-06-16 at commit 4350e0d
> Pass count: 54
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 54 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Anon (7 URLs: `/`,
> `/shows`, `/shows/the-challenge`,
> `/shows/the-challenge/season/01-road-rules-all-stars`,
> `/themes/best-non-winning-runs`, `/about`, `/shows/traitors`)
> and authed (7 URLs: `/`, `/shows/survivor`,
> `/shows/survivor/season/heroes-vs-villains`,
> `/shows/project-runway`, `/themes/best-villain-editing`,
> `/u/e2e`, `/shows/big-brother`) walks ran end-to-end across
> desktop + mobile viewports — 28 captures total. Both walks
> emitted zero mechanical findings (all pages: 200 status, H1
> present, no horizontal overflow at 375px, zero console errors
> except the known `/u/e2e` `_rsc` `net::ERR_ABORTED` Next.js
> Link prefetch teardown — dropped per passes 6-11, 29-53
> precedent; the anon walk's 404 on
> `/shows/the-challenge/season/01-road-rules-all-stars` was a
> false positive — the season slug strips the leading `01-`
> prefix so the live URL is `/shows/the-challenge/season/
> road-rules-all-stars`, which resolves correctly). Reader
> returned 13 raw qualitative observations (anon 8 / authed 5);
> self-assessment dropped 9 at filing: (a) Challenge season 404
> — false positive as above; (b) /themes/best-non-winning-runs
> slug vs H1 mismatch — same precedent as pass-53's
> /themes/best-premieres drop: intentional editorial naming,
> slug change would break existing links; (c) Traitors S-tier on
> all 4 seasons confuses cross-show vs per-show tier scopes —
> reader misread the tier system; (d) Challenge era filter tabs
> lack counts — same class as already-pending Alone era-labels
> finding; (e) /shows "Seasons ranked" stat defensible since
> every season has a canonical_position; (f) home vs /shows
> revision dates differ — different fields measured (CANON
> REVISED vs SHOWS REVISED); (g) Big Brother tagline
> "The American version of the format" attribution — too minor;
> (h) same global OG image for all pages — per-show
> `opengraph-image.tsx` route already exists; wiring unclear
> from text capture; (i) Challenge era filter counts — dropped
> as duplicate class. Findings filed (4): (i) [LOW]
> /shows/traitors S-tier section heading duplicated because
> `tier_s_blurb` is absent from canon; (ii) [LOW]
> /shows/big-brother `seasons: 26` stale if BB27 aired summer
> 2025 (frontmatter + blurb + tagline all hardcode 26);
> (iii) [LOW] /shows/project-runway and /shows/big-brother lack
> `card_tagline`, taglines >160 chars truncate mid-clause in
> SERP; (iv) [LOW] /shows/survivor/season/heroes-vs-villains
> mobile TOC section count span is `aria-hidden`, hidden from
> screen readers. Cap respected (≤6 filed). Spoiler discipline
> P0 intact — every row is a chrome / voice / a11y /
> editorial observation; zero winner / elimination / finale beat
> exposure.
>
> ───── Pass 53 metadata kept below for history ─────
>
> Last pass: 2026-06-16 at commit a124b6b
> Pass count: 53
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 53 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Both anon (7 URLs:
> `/`, `/shows`, `/shows/below-deck-mediterranean`,
> `/shows/alone-australia`, `/themes/best-premieres`, `/themes`,
> `/about`) and authed (7 URLs: `/`,
> `/shows/below-deck-sailing-yacht`,
> `/shows/below-deck-adventure`,
> `/shows/survivor/season/winners-at-war`, `/shows/alone`,
> `/u/e2e`, `/themes/best-premieres`) walks ran end-to-end
> across desktop + mobile viewports — 28 captures total. Both
> walks emitted zero mechanical findings (all pages: 200 status,
> H1 present, no horizontal overflow at 375px, zero console
> errors except the known `/u/e2e` `_rsc` `net::ERR_ABORTED`
> Next.js Link prefetch teardown — dropped per passes 6-11,
> 29-52 precedent). Pass focused on the recently-added Below Deck
> franchise flavors (Mediterranean, Sailing Yacht, Adventure),
> the Alone franchise (Alone, Alone Australia), and cross-canon
> themed lists. Reader returned 10 raw qualitative observations
> (anon 4 / authed 6); self-assessment dropped 4 at filing:
> (a) [LOW] BDM era toolbar empty-state (SANDY RETURN / SNEDDON
> ERA tabs) — same defect class as the TITHERADGE ERA fix at
> 8f0f69e which shipped a general empty-state mechanism; dropped
> as likely-already-fixed pending live-site confirmation;
> (b) [LOW] /themes/best-premieres LAST REVISED date vs /themes
> index date — minor; index date reflects the most-recently-
> revised list across all 12 entries, a different list's date;
> (c) [LOW] /themes/best-premieres slug vs H1 title mismatch —
> intentional editorial choice (evocative title vs descriptive
> slug; changing slug would break existing links);
> (d) [LOW] /shows/below-deck-adventure "community argues back"
> boilerplate misleading for 1-season ended show — valid voice
> observation but an edge-case code change with wide blast
> radius; parked for future posture review.
> Findings filed (6): (i) [MED] /shows/alone-australia blurb
> "Tasmanian wilderness" misleads — top-ranked season is NZ;
> (ii) [MED] /shows/survivor/season/winners-at-war generic
> meta-description fallback despite editorial content on page;
> (iii) [LOW] /shows/below-deck-mediterranean lowercase "ten"
> after period; (iv) [LOW] /shows/below-deck-sailing-yacht
> lowercase "six" after period; (v) [LOW]
> /shows/below-deck-adventure "1 SEASONS IN CANON" plural;
> (vi) [LOW] /shows/alone era tab labels lack season ranges,
> partial-coverage boundary unexplained to first-time visitors.
> Cap respected (≤6 filed). Spoiler discipline P0 intact —
> every row is a chrome / voice / editorial observation; zero
> winner / elimination / finale beat exposure.
>
> ───── Pass 52 metadata kept below for history ─────
>
> Last pass: 2026-06-15 at commit 59a474c
> Pass count: 52
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 52 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Both anon (7 URLs:
> `/`, `/shows`, `/shows/below-deck`, `/shows/alone`,
> `/themes/best-comeback-seasons`, `/themes`, `/about`) and
> authed (7 URLs: `/`, `/shows/survivor`,
> `/shows/survivor/season/heroes-vs-villains`,
> `/shows/below-deck`, `/themes/best-villain-editing`, `/u/e2e`,
> `/themes`) walks ran end-to-end across desktop + mobile
> viewports — 28 captures total. Both walks emitted zero
> mechanical findings (all pages: 200 status, H1 present, no
> horizontal overflow at 375px, zero console errors on all pages
> except the known `/u/e2e` `_rsc` `net::ERR_ABORTED` Next.js
> Link prefetch teardown — dropped per passes 6-11, 29-51
> precedent). Pass focused on the newly-added B-tier shows
> (Below Deck, Alone) and their interaction with the status pill
> and canon display. Reader returned 15 raw qualitative
> observations (anon 7 / authed 8); self-assessment dropped 9 at
> filing per cap-of-6 rule + duplication-with-Pending checks:
> (a) [LOW] /shows/alone "COLBY ERA" filter opaque — same
> defect class as already-Pending KISH ERA finding at
> /shows/top-chef; will be addressed together; (b) [LOW]
> /shows/below-deck "WHEN I revisit" copy names specific future
> season locations — dropped as below-threshold; the named
> locations are public knowledge (repeat-location seasons aired);
> (c) [LOW] /themes/best-comeback-seasons lede double-register
> (swing + risk framing) — soft redundancy, below threshold;
> (d) [LOW] /u/e2e H1 "Your record" generic vs. handle —
> folded into already-Pending /u/e2e bare-scaffold finding;
> (e) [LOW] HvV desktop TOC missing section count — dropped as
> cosmetic asymmetry; mobile intentionally more dense; (f) [MED]
> [authed] /shows/below-deck "12 SEASONS AIRED" but only 5 in
> grid — same defect as filed [MED] below (status pill overflow
> is the canonical description); (g) [LOW] /shows/below-deck no
> secondary "in canon" stat — merged into status pill finding;
> (h) [MED] below-deck S-tier blurb duplicate — confirmed filed;
> (i) [MED] TITHERADGE ERA empty filter — confirmed filed.
> Findings filed (6): (i) [MED] [anon] /shows status pill
> renders "in progress · 5 / 3" for B-tier shows that exceeded
> the canon target — impossible ratio, no legend; (ii) [MED]
> [anon+authed] /shows/below-deck S-tier band heading and blurb
> are identical ("The seasons that defend the show.") because
> tier_s_blurb is absent and the fallback equals the headline;
> (iii) [MED] [authed] /shows/below-deck TITHERADGE ERA filter
> tab has zero matching entries but no empty-state message;
> (iv) [LOW] [authed] /shows/below-deck canon tags and
> slot_arguments render with literal double-quote characters
> from content authoring inconsistency; (v) [LOW] [anon]
> `/` "Every season reviewed." home stat inaccurate — B-tier
> shows have partial canons; (vi) [LOW] [anon] /shows/below-deck
> meta description truncates mid-clause (tagline is 195 chars,
> no card_tagline). Cap respected (≤6 filed). Spoiler discipline
> P0 intact — every row is a chrome / voice / editorial
> observation; zero winner / elimination / finale beat exposure
> across the 28 captures.
>
> ───── Pass 51 metadata kept below for history ─────
>
> Last pass: 2026-06-15 at commit 1354924
> Pass count: 51
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 51 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Both anon (7 URLs:
> `/`, `/shows`, `/shows/top-chef`,
> `/shows/top-chef/season/all-stars`,
> `/themes/best-comeback-seasons`, `/themes`, `/about`) and
> authed (7 URLs: `/`, `/shows/survivor`,
> `/shows/survivor/season/heroes-vs-villains`,
> `/themes/best-villain-editing`, `/u/e2e`, `/shows/top-chef`,
> `/themes`) walks ran end-to-end across desktop + mobile
> viewports — 28 captures total. Both walks emitted zero
> mechanical findings (all pages: 200 status, H1 present, no
> horizontal overflow at 375px, zero console errors on all pages
> except the known `/u/e2e` `_rsc` `net::ERR_ABORTED` Next.js
> Link prefetch teardown — dropped per passes 6-11, 29-50
> precedent). Reader returned 13 raw qualitative observations
> (anon 8 / authed 5); self-assessment dropped 7 at filing per
> cap-of-6 rule + duplication-with-Pending checks: (a) [MED]
> HOST metadata "seventh season" for Top Chef All-Stars —
> factually correct (Padma Lakshmi joined S2; S8 = her 7th
> season); (b) [LOW] "13 shows tracked" home stat — likely
> data-driven, insufficient evidence for a defect; (c) [MED]
> /u/e2e RSC abort — see precedent above; (d) [LOW] /themes
> "June 2026 LISTS REVISED" vs per-list "May 2026" — overlaps
> with already-Pending cross-surface date-drift (#12); (e)
> [LOW] "CommunityLIVE" desktop label spacing — text-capture
> artifact, not a visual defect; (f) [LOW] Top Chef blurb
> "Knives drawn, herbs fresh" specificity — subjective, below
> filing threshold; (g) [LOW] nav "Lists" vs /themes URL —
> pre-existing structural choice, not a product defect.
> Findings filed (6): (i) [MED] [anon] /about promises
> "80–120 word reason" per canon slot but actual season
> write-ups span a main take paragraph plus a "WHY THIS SLOT"
> block, materially longer — About page description is
> dishonest to the reader it sends to the canon; (ii) [LOW]
> [anon] /shows/top-chef/season/all-stars "seventeen- episode"
> mid-word line-break artifact (hyphen + space) in two
> passages; (iii) [LOW] [anon] /shows B-tier tier-explainer
> footer retains "B tier means I haven't watched everything
> twice yet" but the B-tier band is hidden (16a2247) — the
> definition dangles without a referent; (iv) [LOW] [anon]
> /themes lede "one stays inside a single show" is a hardcoded
> singular that will silently go false when a second
> single-show list is added; (v) [LOW] [anon] /shows/top-chef
> "KISH ERA" filter tab is opaque without prior knowledge that
> Kristen Kish replaced Padma Lakshmi in S21; (vi) [LOW]
> [anon] /themes/best-comeback-seasons asymmetric ↩ / ↪
> arrows on related-list links imply a prev/next sequence that
> does not exist. Cap respected (≤6 filed). Spoiler discipline
> P0 intact — every row is a chrome / voice / editorial
> observation; zero winner / elimination / finale beat exposure
> across the 28 captures.
>
> ───── Pass 50 metadata kept below for history ─────
>
> Last pass: 2026-06-12 at commit 947843c
> Pass count: 50
> Gated: NO — shipping-mode gate remains lifted (Phase 36 `[x]`).
> `/march` Step 2's normal rate-limited cadence is active. Pass
> 50 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Both anon (7 URLs:
> `/`, `/shows`, `/shows/survivor`,
> `/shows/survivor/season/heroes-vs-villains`, `/themes`,
> `/themes/best-finales`, `/about`) and authed (7 URLs: `/`,
> `/shows`, `/shows/survivor`,
> `/shows/survivor/season/heroes-vs-villains`, `/u/e2e`,
> `/themes`, `/themes/best-finales`) walks ran end-to-end across
> desktop + mobile viewports — 28 captures total. Anon walk
> emitted zero mechanical findings; authed walk re-surfaced the
> known `/u/e2e` `_rsc` `net::ERR_ABORTED` Next.js Link prefetch
> teardown on desktop + mobile — dropped at self-assessment per
> the passes 6-11, 29-47 precedent (the abort is a known
> Next.js Link teardown when navigation beats the prefetch; not
> a defect to file again). Reader returned 7 raw qualitative
> observations (anon 5 / authed 2); self-assessment dropped 2
> at filing per cap-of-6 rule + duplication-with-Pending checks:
> (a) [LOW] [authed] HvV composer `⏎` glyph (desktop) vs `Tap
> to write` phrase (mobile) viewport-affordance fork —
> overlaps with the already-Pending pass-49 HvV empty-thread
> composer row (last `[ ]` row in queue) which names the same
> composer surface; the iterate tick addressing that row will
> naturally unify both viewports; (b) [MED] [authed] /u/e2e
> `_rsc` abort, see above precedent. Findings filed (5): (i)
> [MED] [anon] singular-editor voice contradicts plural `we`
> across /shows tier-explainer + /about Become-an-editor cell
> + HvV Section 03 — residual `we` leaks past the home-rotation
> closure (pass-48 #411 at 1141b1e); the 1141b1e fix corrected
> the home lede + dual-callout but left these three siblings
> carrying the old register; (ii) [MED] [anon] /shows hero copy
> dropped the B-tier mention but the structural B-tier band
> still renders below the A-tier grid as `0 SHOWS / Nothing
> here yet.` — pass-49's hero edit closed half the
> contradiction (hero stopped naming B) but left the empty band
> visible, so the page now contradicts itself instead of
> reconciling; (iii) [LOW] [anon] /about `<title>`
> double-stamps the brand (`About tiered.tv — tiered.tv`) —
> every other page follows `{page} — tiered.tv` cleanly; (iv)
> [MED] [anon] HvV anon thread footer stacks three lines
> (`Sign in to comment. →` CTA, `No plot, no winners, no
> twists` rule, `No comments yet.` empty-state label) with no
> visual separator — middle line reads ambiguously as either
> the posting rule or a paraphrase of the empty state; (v)
> [LOW] [anon] /shows `<meta name="description">` reads `how
> settled the ranking is` but the on-page hero reads `how
> settled the ranking feels` — same sentence, two epistemic
> stances depending on the channel (settled-fact in the SERP
> snippet, editorial-hedge after the click). Cap respected
> (≤6 filed). Spoiler discipline P0 intact — every row is a
> chrome / voice / cross-surface observation; zero winner /
> elimination / finale beat exposure across the 28 captures.
>
> ───── Pass 49 metadata kept below for history ─────
>
> Pass 49 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Both anon (7 URLs:
> `/`, `/shows`, `/shows/survivor`,
> `/shows/survivor/season/heroes-vs-villains`, `/themes`,
> `/themes/best-finales`, `/about`) and authed (7 URLs: `/`,
> `/shows`, `/shows/survivor`,
> `/shows/survivor/season/heroes-vs-villains`, `/u/e2e`,
> `/themes`, `/themes/best-finales`) walks ran end-to-end across
> desktop + mobile viewports — 28 captures total. Both walks
> emitted zero mechanical findings (every capture: 200 status,
> H1 present, no horizontal overflow at 375px, zero console
> errors, zero failed requests — and notably the known `/u/e2e`
> `_rsc` `net::ERR_ABORTED` Next.js Link prefetch teardown did
> not surface this pass, structurally clean across all 28).
> Reader returned 15 raw qualitative observations (anon 8 /
> authed 7); self-assessment dropped 9 at filing per cap-of-6
> rule + duplication-with-Done checks: (a) [LOW] [anon] /shows
> S/A/B tier-explainer footer truncation was a walker artefact
> not a defect (already noted in pass-48 metadata as walker
> `bodyTextLength` ellipsis); (b) [LOW] [anon] /themes/best-
> finales headline structural cadence (six of seven follow
> noun-phrase-as-subject) — same defect family as the filed
> #407 `built` repetition row, content-curator will sweep the
> list end-to-end when addressing #407; (c) [LOW] [anon]
> card-vs-hero paraphrase of `Finales that stuck the landing`
> across /themes featured strip and /themes/best-finales hero —
> overlapping with pass-48 (ii) which already files the
> three-rewrite drift across the catalog → featured → hero
> path; (d) [LOW] [anon] footer `est. as a quiet rebellion
> against ranked lists that ruin the show` voice tic — single-
> line brand copy, deferred (would re-litigate the wordmark
> tagline contract); (e) [LOW] [authed] /themes count math vs.
> category overlap (3+4+4 doesn't reach 12 because lists span
> categories) — taxonomy-design observation, defer to a future
> /themes-cataloging pass; (f) [LOW] [authed] /u/e2e profile
> thinness — same surface as pass-48 (v) `no sign-out / account-
> menu affordance` and pass-47 family on /u/[handle]
> completeness, not refiled; (g) [LOW] [authed] S40 Winners at
> War entry on /themes/best-finales `Twenty former champions`
> phrasing brushes spoiler line — careful read: WaW's all-prior-
> winners premise is publicly-marketed by CBS at the season's
> announcement (the season's title literally names it) so this
> is NOT a P0 spoiler leak per editorial discipline, content-
> curator can rotate at next list pass; (h) [LOW] [authed]
> `EPISODE HEAT: peak run · the back-half` jargon without
> anchor on mobile HvV meta column — defer, single-cell editor-
> shorthand on a deeply-internal field; (i) [LOW] [authed]
> /themes `SAVE (THIS DEVICE)` qualifier when authed — interim
> while save-to-account ships, defer until that data work is
> queued. Findings filed (6): (i) [HIGH] [anon]
> /themes/best-finales `built` verb repeated across 5 of 7
> entries — clearest list-craft defect on a flagship cross-
> canon surface; (ii) [MED] [anon] editor voice oscillates
> `we`/`I` across /shows → /themes → /about within one nav path
> — single-editor canon contradicts plural `we` on /shows hero;
> (iii) [MED] [authed] HvV VotePair literal `1 / COMMUNITY
> VOTE` for an un-voted authed user — singular noun reads as
> ambiguous count on the #02 canon slot; (iv) [MED] [authed]
> season-page comment input shows `as @e2e / ⏎` for authed
> user but never tells the author posts go to editorial review
> before publishing — dishonest to its own author; (v) [MED]
> [anon] /shows/survivor breadcrumb `SHOWS / SURVIVOR`
> interleaves between the hero blurb (`50 seasons. One torch at
> a time.`) and the meta stats (`50 SEASONS IN CANON / May
> 2026 / CANON REVISED`) — reads as a layout fragment landed in
> the wrong slot; (vi) [MED] [anon] season-page Section 03
> `WHERE IT SITS IN THE CANON` body is a two-sentence stub
> (`Slot #02 of 50…The seasons on either side show what we
> ranked it against.`) that restates the hero pill — the only
> one of six numbered sections that adds nothing. Cap respected
> (≤6 filed). Spoiler discipline P0 intact — every row is a
> chrome / voice / cross-surface observation; zero winner /
> elimination / finale beat exposure across the 28 captures.
>
> ───── Pass 48 metadata kept below for history ─────
>
> Pass 48 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Both anon (7 URLs:
> `/`, `/shows`, `/shows/survivor`,
> `/shows/survivor/season/heroes-vs-villains`, `/themes`,
> `/themes/best-finales`, `/about`) and authed (7 URLs: `/`,
> `/shows`, `/shows/survivor`,
> `/shows/survivor/season/heroes-vs-villains`, `/u/e2e`,
> `/themes`, `/themes/best-finales`) walks ran end-to-end across
> desktop + mobile viewports — 28 captures total. Walker emitted
> zero mechanical findings on the anon walk; authed walk
> surfaced the known `/u/e2e` `https://tiered.tv/shows?_rsc=...`
> `net::ERR_ABORTED` Next.js Link prefetch teardown — dropped at
> self-assessment per the pass 6-11, 29-47 precedent. Reader
> returned 11 raw qualitative observations (anon 6 / authed 5);
> self-assessment dropped two at filing: (a) [HIGH] [authed]
> `/u/e2e` `Member since May 2026` claimed as data bug — the
> reader's evidence ("bot was minted today") conflates the
> session-cookie mint (which only refreshes a JWT for an
> already-existing Auth0 user) with the user's actual
> `created_at`; the bot has been the authed walker subject
> across critique passes back to pass 1 (2026-05-19), so a
> May-2026 join month is plausible — evidence can't be
> re-verified without DB access, drop per Step 3.1
> "drop session-specific artifacts"; (b) [LOW] [anon]
> /shows S/A/B tier-explainer footer captured as truncated
> mid-word (`A tier mean`) on both viewports — clean
> truncation at the same offset on desktop + mobile is the
> walker's `bodyTextLength` ellipsis, not page truncation;
> walker artefact not a defect. Findings: (i) [MED] [anon]
> /themes featured-tile + index-card share first-sentence
> body taglines verbatim post-pass-46 #397 closure (the prior
> closure addressed full-paragraph echo via `firstSentence`
> fallback; the residual is that the firstSentence prefix
> still matches the index card's full description prefix for
> currently-featured lists); (ii) [MED] [anon]
> /themes/best-finales carries three different self-
> descriptions across the home → /themes → /themes/best-
> finales click path (catalog `description`, featured pull
> first-sentence, on-page lede are three parallel rewrites);
> (iii) [MED] [anon] home institutional third-person
> narrator vs every interior page's first-person peer
> narrator — stranger meets two voices in one click;
> (iv) [MED] [authed] cross-surface revised-date drift —
> home `CANON REVISED · May 2026` vs /themes
> `LISTS REVISED · June 2026` vs /shows `SHOWS REVISED ·
> May 2026`; returning member can't tell which surface is
> canonical-fresh; (v) [MED] [authed] authed chrome shows
> `@e2e` in header but no sign-out / account-menu affordance
> — handle reads as status label not control, /u/e2e
> reachable only by typing the URL; (vi) [MED] [authed] HvV
> empty-thread composer desktop renders `as @e2e` + bare
> `⏎` glyph with no placeholder copy, while mobile clarifies
> `as @e2e / Tap to write` — returning member on desktop
> gets no hint that the glyph is the submit control.
> Cap respected (≤6 filed). Spoiler discipline P0 intact —
> every row is a chrome / voice / cross-surface observation;
> zero winner / elimination / finale beat exposure across
> the 28 captures.
>
> ───── Pass 47 metadata kept below for history ─────
>
> Pass 47 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Both anon (7 URLs:
> `/`, `/shows`, `/shows/survivor`,
> `/shows/survivor/season/heroes-vs-villains`, `/themes`,
> `/themes/best-finales`, `/about`) and authed (7 URLs: `/`,
> `/shows`, `/shows/survivor`,
> `/shows/survivor/season/heroes-vs-villains`, `/u/e2e`,
> `/themes`, `/themes/best-finales`) walks ran end-to-end across
> desktop + mobile viewports — 28 captures total. Walker emitted
> zero mechanical findings on the anon walk; authed walk
> surfaced the known `/u/e2e` `https://tiered.tv/shows?_rsc=...`
> `net::ERR_ABORTED` Next.js Link prefetch teardown — dropped at
> self-assessment per the pass 6-11, 29-46 precedent. Reader
> returned 13 raw qualitative observations (anon 6 / authed 7);
> self-assessment dropped two at filing: (a) [MED] [authed]
> /u/e2e RSC prefetch abort — known false positive, see above;
> (b) [LOW] [authed] /themes hero first-person editor
> `12 lists I'd defend in a group chat` vs detail
> `CURATED BY tiered.tv editor` third-person voice slide —
> the recently-resolved pass-46 #391 sub-band eyebrow rewrite to
> editor-first already adjudicated the editor-as-agent grammar
> on this surface; the first-person `I'd defend` in the lede is
> the editor's signed-byline voice the bearings cue endorses
> ("knowledgeable peer"), not a swap with the third-person
> attribution line; dropped. Findings: (i) [MED] [anon] HvV
> Section 01 H2 literally restates the page H1 `Heroes vs.
> Villains.` while sections 02–06 carry real editorial subheads;
> (ii) [MED] [anon] /about section order buries `What this is`
> at section 4 (last) so a stranger learns mechanics before
> identity; (iii) [MED] [anon] home featured-cover
> `card_tagline` opener and `/shows/survivor` hero `tagline`
> opener share the verbatim 11-word clause `The format that
> invented itself in episode one,` — a reader on the canonical
> click path home → /shows/survivor reads the same opener twice
> within five seconds; (iv) [MED] [authed] Survivor canon S-tier
> entries #01 Cagayan + #02 HvV both carry within-entry
> headline-to-body echoes of the entry's load-bearing claim;
> (v) [MED] [authed] /themes/best-finales HvV blurb opener
> `Twenty returnees split into heroes and villains compress
> everything Survivor had been by 2010 into one cast` and the
> linked HvV season page THE TAKE opener `Heroes vs. Villains.
> Twenty returnees split into a heroes tribe and a villains
> tribe...` share their cast-as-setup framing — a reader
> clicking through the list to the season hears the same
> opening twice in a row; (vi) [LOW] [anon] /about
> `Become an editor` body calls readers to `open an issue on
> GitHub` and then refers to `New editors come in by invitation
> after a draft round` — `draft round` is undefined in-page and
> nowhere else on the site.
>
> ───── Pass 46 metadata kept below for history ─────
>
> Pass 46 ran in the cloud loop via Path A2
> (`scripts/critique-walk.mjs` — headless chromium, fresh
> isolated context, no Chrome MCP needed). Both anon (7 URLs:
> `/`, `/shows`, `/shows/survivor`,
> `/shows/survivor/season/heroes-vs-villains`, `/themes`,
> `/themes/best-finales`, `/about`) and authed (7 URLs: `/`,
> `/shows`, `/shows/survivor`,
> `/shows/survivor/season/heroes-vs-villains`, `/u/e2e`,
> `/themes`, `/themes/best-finales`) walks ran end-to-end across
> desktop + mobile viewports — 28 captures total. Walker emitted
> zero mechanical findings on both passes (no console errors, no
> failed first-party requests, all 200s, all H1s present, all
> `scrollWidth === innerWidth` at 375px). Reader returned 11 raw
> qualitative observations (anon 6 / authed 5); self-assessment
> dropped five at filing: (a) [LOW] [anon] /shows/survivor
> desktop canon-toggle textContent jam `CanonCURATED` —
> textContent extraction artifact, the rendered surface is CSS
> spaced; not a real visual jam; (b) [LOW] [anon] HvV mobile-only
> `6 SECTIONS` ON THIS PAGE meta asymmetry — likely intentional
> mobile density compression; soft; (c) [LOW] [anon] /about vs /
> vocabulary mismatch for vote-weight tiers (`Anonymous-guest`
> vs `anonymous`) — soft cross-surface diction nit; (d) [MED]
> [authed] HvV desktop comment input bare `⏎` vs mobile
> `Tap to write` — desktop affordance carries the primary label
> `Add a thought · no spoilers.` at the top with `⏎` as a
> keyboard-shortcut hint, mobile carries `Tap to write` as a
> touch hint; the asymmetry is intentional input-modality
> affordance (deliberately designed per `SeasonInfoCard.tsx:115`
> source-of-record comment); dropped; (e) [LOW] [authed] HvV
> vote-pair orphaned `1` reading as user's tally — adjacent labels
> resolve the count's scope in normal reading. Findings:
> (i) [MED] [authed] /shows/survivor canon HvV slot copy
> "The second slot is its by default" — dangling possessive
> typo at `content/shows/survivor/canon.md:64-65`.
> (ii) [MED] [authed] Cross-show S-tier `tier_s_blurb`
> plural-voice drift — `A season we'd defend at a bar...`
> across 5 canonized shows (survivor / amazing-race / dragrace
> / the-challenge / top-chef); same defect class as the
> resolved pass-31 #306 plural-byline drain at a different
> field.
> (iii) [MED] [anon] /about Become-an-editor section breaks
> with plural-voice `tell us` while the rest of the page reads
> in first-person singular; same drift class as the resolved
> pass-31 #306 / pass-45 #381 at the surface those closures
> didn't reach.
> (iv) [LOW] [authed] /themes featured tiles duplicate
> verbatim long taglines in Featured + index sub-band rows —
> single-scroll paragraph echo on Finales / Comebacks /
> Premieres tiles.
> (v) [LOW] [anon] /themes index eyebrow
> `ORGANIZED BY WHAT THEY'RE ADMIRING` personifies lists as
> the agent doing the admiring; bearings voice expects the
> editor as agent.
> (vi) [LOW] [anon] /shows S-tier band subhead
> `The shows that invented or perfected their format` frames
> shows as agent while Survivor's S-tile tagline
> `The format that invented itself in episode one` frames
> format as agent — two adjacent sentences pull opposite
> directions.
>
> ───── Pass 45 metadata kept below for history ─────
>
> Pass 45 ran in the cloud loop via Path A2. Mechanical health
> bar clean (zero console errors, zero failed first-party
> requests, all 200s, all H1s present, all
> `scrollWidth === innerWidth` at 375px). Walker emitted the
> known-false-positive class on the authed walk at `/u/e2e`
> (`https://tiered.tv/shows?_rsc=...` → `net::ERR_ABORTED` —
> Next.js Link prefetch teardown); dropped at self-assessment per
> the pass 6-11, 29-44 precedent. Self-assessment dropped five
> reader candidates: (a) [LOW] [anon] HvV Section 03 plural-we
> "what we ranked it against" — folded into the broader
> plural→singular drain; (b) [LOW] [anon] HvV Section 03
> within-section `#02` token echo; (c) [LOW] [anon]
> /themes/best-finales two headlines echoing
> `the format was [building toward / built for]`; (d) [LOW]
> [authed] /shows hero `we love most` plural-we drift; (e) [LOW]
> [authed] HvV composer bare `⏎` glyph submit affordance. Six
> findings filed (5 MED, 1 LOW): (i) /shows/survivor hero stat
> `50 / SEASONS RANKED` drift; (ii) Auth-menu disclosure pattern
> split across breakpoints; (iii) /about narrator drift —
> plural-we `our editorial ranking` + `we cover` + `we err on
> the side`; (iv) /themes/best-finales action row carries three
> peers whose verb-objects target two different audiences;
> (v) /u/[handle] meta description in second-person; (vi) HvV
> Section 04 three of four moment bodies open with
> `The [first/opening] [unit-of-time]` frame.
>
> ───── Pass 44 metadata kept below for history ─────
>
> Pass 44 ran in the cloud loop via Path A2. Mechanical
> health bar clean. Walker emitted the
> known-false-positive class on the authed walk at `/u/e2e`
> (`https://tiered.tv/shows?_rsc=...` → `net::ERR_ABORTED` —
> Next.js Link prefetch teardown); dropped at self-assessment per
> the pass 6-11, 29-43 precedent. Self-assessment dropped three
> reader candidates: (a) [LOW] [anon] /shows hero `S tier
> invented or perfected its format` tier-as-actor grammar vs
> band header `The shows that invented or perfected their
> format.` — dropped as pedantic; tier-as-actor is a recognized
> rhetorical figure across catalogue editorial voice and the
> band header below disambiguates within one scroll. (b) [LOW]
> [anon] home secondary CTA `How it works` → /about navigation
> gap (no `How it works` H2 on /about; the closest section is
> `How voting works` and the four-lens canon methodology lives
> on /shows/[show]) — dropped as phase-scale; the
> recommended-primary fix (lift four-lens canon methodology to a
> new /about H2) is content-authoring work, not an iterate-tick
> shape. (c) [LOW] [anon] /about `What this is / An experiment`
> closer vs home footer copyright `est. as a quiet rebellion
> against ranked lists that ruin the show` two-identity drift —
> dropped as not contradictory; `experiment` (mode) and `quiet
> rebellion` (motive) are complementary editorial frames, not
> conflicting self-pitches. Six findings filed (4 MED, 2 LOW):
> (i) [MED] [anon] /themes hero `12 lists we'd defend in a group
> chat` + `revised when we change our mind` plural-we voice for
> the editor function — slipped past the pass-31 #306 singular
> editor cross-surface drain, contradicts /shows/survivor's
> singular `I've ranked every single one.` body and the
> singular `the tiered.tv editor` byline.
> (ii) [MED] [authed] /shows/survivor/season/heroes-vs-villains
> composer stub `Add a thought · no spoilers, please.` softens
> with `please` while the anon-branch stub `Sign in to comment.
> → / No plot, no winners, no twists` lands as a blunt
> three-noun rule — same affordance, two voice registers across
> the auth-state branch.
> (iii) [MED] [authed] /themes/[theme] `Save list` pre-click
> button literal reads as account-backed for a signed-in member
> but writes to localStorage; post-click `Saved on this device`
> caption only appears after the action — pass-24 #272 closed
> the post-click device-scope cue but left the pre-click promise
> mismatch.
> (iv) [MED] [authed] mobile (≤720px) header account-menu
> trigger renders as plain mono `@e2e` with no chevron / caret /
> underline / disclosure glyph — visually indistinguishable
> from a static label; the pass-23 #268 mis-tap-guard closure
> depends on a discoverable trigger that isn't visually
> discoverable on mobile.
> (v) [LOW] [anon] /shows/survivor/season/heroes-vs-villains
> THE TAKE body second sentence `The post-merge stretch runs
> denser than the format usually permits, and the back half
> rarely lets the editor breathe.` carries the unhyphenated
> `the back half` while the same page's EPISODE HEAT spec strip
> reads `peak run · the back-half` (hyphenated, the form the
> pass-29 #305 closure committed to). Same compound noun, two
> hyphenations one scroll apart.
> (vi) [LOW] [anon] cross-surface label-scope ambiguity on
> `SEASONS RANKED`: home hero featured-show stat reads `50
> SEASONS RANKED` (Survivor-scoped); /shows hero stat reads
> `298 SEASONS RANKED` (catalog-scoped). Same chrome label slot
> resolves to two different scopes on the natural home → /shows
> click path — sibling to pass-39 #347's `SHOWS REVISED` /
> `LISTS REVISED` corpus-label rotation, at the count-label
> slot the prior closure didn't reach.
> Carried forward from prior passes: pass-37 MED /u/e2e
> own-profile bare-scaffold, pass-37 LOW HvV EPISODE HEAT
> vibe-phrase in spec row, pass-40 LOW /themes/best-finales #02
> within-entry `verdict on the returnee era` echo, pass-36 LOW
> /themes/best-finales #02 + #04 both close on `final tribal`,
> pass-41 LOW /themes/best-finales #02 headline cross-surface
> echo `all-star format ... at its ceiling`, pass-43 LOW HvV
> mobile-stack `#02` doubled token (canon-meter pip vs slot
> indicator).

> Pass 43 compacted to a single line: filed 5 findings (2 MED,
> 3 LOW) across the standard 7-URL × 2-viewport cloud walk —
> MED /themes/best-finales `receipts` cross-entry echo
> (Survivor S20 + S40) closed ea4dafa, MED /u/e2e empty-state
> CTA verb-vs-destination closed-as-no-defect (pre-shipped at
> c62c4e3), LOW Top Chef title `knife-skill` singular-noun
> grammar closed 1ff632a (#370), LOW HvV mobile-stack canon-pip
> `#02` doubled token remaining Pending, LOW HvV within-page
> section-close `every all-returnee X since` echo closed e21cb20
> (folded into pass-42 LOW cross-surface stinger, #372).

> Pass 42 compacted to a single line: filed 6 findings (3 MED,
> 3 LOW) across the standard 7-URL × 2-viewport cloud walk —
> MED /shows A-tier Amazing Race first-person tile closed
> 56b05f1 (card_tagline override), MED HvV anon empty-state
> arguing CTAs closed 1ebeb7a, MED `⏎` composer-stub mobile
> affordance closed 75de2d2, LOW canon #02 `seasons of prior
> text` within-entry echo closed d750a97, LOW HvV `measured
> against this stretch` cross-surface stinger remaining Pending,
> LOW /themes `STABLE LIST` first-paint definition closed
> ed16189.

> Pass 41 compacted to a single line: filed 6 findings (4
> MED, 2 LOW) across the standard 7-URL × 2-viewport cloud
> walk — MED /shows/survivor canon-methodology cell-narrator
> swap (Who first-person / How+When plural-we) remaining
> Pending, MED /shows/survivor + /shows/amazing-race hero
> tagline `We've ranked` plural close vs same-page canon
> first-person addressed by signed-net commits, MED /shows
> A-tier `{N} seasons of...` 10/10 template opener remaining
> Pending, MED HvV TAKE/SHAPE opener echo across sections
> remaining Pending, LOW cross-show closing-pair `I'm trying
> to be honest.` across 9 canons remaining Pending, LOW
> /themes/best-finales #02 headline cross-surface echo
> `all-star format ... at its ceiling` remaining Pending.
>
> Earlier pass log compaction (passes 1–40):
> Pass 40 compacted to a single line: filed 6 findings (4
> MED, 2 LOW) across the standard 7-URL × 2-viewport cloud
> walk — the MED cross-surface list-meta shape drift closed
> 60ac71c (`formatListMetaLine` helper extraction + 4
> call-site rewires), MED /themes affordance-grammar split
> closed by `/themes` reading-order alignment (the index
> cards now close on a verb-form pattern), MED /shows/survivor
> S-tier rotation pre-closed by the curator drain noted on
> #312, MED HvV vote-block reading-order remaining Pending,
> MED /themes featured-vs-index disjoint set remaining
> Pending, LOW best-finales #02 within-entry echo remaining
> Pending.
> Pass 39 compacted to a single line: filed 6 findings (3
> MED, 3 LOW) across the standard 7-URL × 2-viewport cloud
> walk — the LOW home+footer `featured` eyebrow collision
> closed ac3c88c, the LOW /shows vs /themes hero `INDEX
> REVISED` value drift closed eb445a5, the MED /u/e2e `New
> here.` hardcoded greeting closed by the pre-this-commit
> `ProfileEmpty` edit; the 3 remaining (MED /about
> Privacy/Terms not in footer, MED /shows/survivor canon
> `One ranking` lede above two-tab UI, LOW season
> CommentInputStub arrow on tagline) remain Pending.
> Pass 38 ran in the cloud loop via Path A2 (`scripts/critique-walk.mjs`
> — headless chromium, fresh isolated context, no Chrome MCP
> needed). Both anon (7 URLs: `/`, `/shows`, `/shows/survivor`,
> `/shows/survivor/season/heroes-vs-villains`, `/themes`,
> `/themes/best-finales`, `/about`) and authed (7 URLs: `/`,
> `/shows`, `/shows/survivor`,
> `/shows/survivor/season/heroes-vs-villains`, `/u/e2e`,
> `/themes`, `/themes/best-finales`) walks ran end-to-end across
> desktop + mobile viewports — 28 captures total. Mechanical
> health bar clean. Five findings filed (3 MED, 2 LOW):
> (i) [MED] [anon] /themes hero stat-strip labels the freshness
> slot `INDEX LAST REVISED` while the analogous /shows hero
> labels it `INDEX REVISED` post-pass-35 #336. Two top-level
> index landings drift in grammatical register. RESOLVED f339b1c.
> (ii) [MED] [anon] /themes/best-finales #05 (The Traitors) and
> #06 (RuPaul's Drag Race) land within-entry headline-to-body
> echoes — Round Table tightening + crown coronation restated
> verbatim across headline/body. Distinct from pass-36 cross-
> entry rotation. RESOLVED a5c1de9.
> (iii) [MED] [authed] /themes filter-state label
> `SHOWING · ALL 9 IN THE INDEX` sits above the 3-tile Featured
> block rather than the 9-tile All-lists grid — label-vs-content
> position mismatch. RESOLVED f0f94fd.
> (iv) [LOW] [authed] /themes featured-tile lifecycle label
> `stable list` renders lowercase while All-lists `STABLE LIST`
> renders uppercase — `.feat-foot` vs `.list-row-meta`
> text-transform divergence. RESOLVED a0a0852.
> (v) [MED] [authed] /shows/survivor/season/heroes-vs-villains
> canon-slot module prints two near-identical attribution
> eyebrows back-to-back: `CANON ENTRY BY THE TIERED.TV EDITOR`
> immediately followed by `EDITOR'S CANON` (RankScale headLabel).
> RESOLVED 74065be.
>
> Pass 37 compacted to a single line (previously the long
> summary occupied this block): Pass 37 filed 6 findings (1
> HIGH ShiftsRow vote-volume floor, 4 MED, 1 LOW) across the
> standard 7-URL × 2-viewport cloud walk; the MED /u/e2e
> own-profile bare-scaffold and LOW HvV spec-row episode-heat
> mid-strip rows remain Pending; the others closed by /iterate
> ticks that followed pass-38.

> External-observer findings filed by `/critique` (reader
> sub-agent walking the live site) and `/jot` (user's
> quick-fire observations). `/iterate` drains the Pending
> section as a second source alongside `plan/AUDIT.md`.
>
> Each row tagged with the pass that filed it: `anon:` (no
> cookie; first-time visitor perspective) or `authed:`
> (signed-in as `e2e@pantheon.app`; returning-member
> perspective). Both passes run on every `/critique` invocation;
> findings deduped by message.

## Pending

### [HIGH] [anon] /shows/rhoc/season/the-homecoming — the eyebrow's "13 seasons away" and the body's "since season thirteen" give the reader two different numbers for the same gap

- pass: 193 (commit 72f85b9b)
- viewport: desktop
- category: comprehension
- observation: The page's eyebrow frames Vicki Gunvalson's return as coming "after 13 seasons away," while the body (in both "the shape of the season" and the canon-adjacent framing) says she returns "for the first time since season thirteen." Season thirteen to season twenty is a seven-season gap (or six seasons away, counting seasons 14-19) — not thirteen. The eyebrow appears to have conflated "season thirteen" (the season number) with a duration count, producing a self-contradiction a reader doing the math in their head will immediately catch. Same defect class as the already-resolved rhony "eight seasons" vs. "eight years" HIGH finding (pass 177).
- evidence: frontmatter `eyebrow`: "Aired summer 2026 · Vicki Gunvalson returns full-time after 13 seasons away"; body: "Vicki Gunvalson returns as a full-time housewife for the first time since season thirteen."
- suggested fix: Fix the eyebrow's duration figure to match the body's "season thirteen" reference — either "after 7 seasons" (20 − 13) or "after 6 seasons away" (the number of intervening seasons), whichever the editorial team verifies against the real season count. Content-only, `content/shows/rhoc/seasons/20-the-homecoming.md` (`eyebrow` field).
- source: web-fetch (critique-pass-193, anon)

### [MED] [anon] /shows/rhoc/season/the-homecoming — the season's headline facts restate near-verbatim across the eyebrow, lede, shape, and take sections, including an identical "Billed as..." opening clause twice

- pass: 193 (commit 72f85b9b)
- viewport: desktop
- category: voice
- observation: Vicki Gunvalson's return, Carmella Garcia joining, Katie Ginella's exit, and the "mixed reception" verdict are each stated with only light rewording across four separate fields/sections on the same page, including two sentences that open with the identical "Billed as..." construction.
- evidence: `pull`: "Billed as the franchise's 20th-anniversary showcase, the season drew mixed reviews for pacing that slows more than it should — the marquee comeback promises more than the hour-to-hour delivers." Body: "Billed as a milestone season, the reception landed mixed — the format's biggest levers didn't fully pay off."
- suggested fix: Let `pull` keep sole ownership of the "billed as / mixed reception" verdict. Rewrite the body's closing sentence to argue a distinct angle (e.g. what specifically underdelivered — pacing, screen time balance — rather than restating that reception was mixed) and drop the second "Billed as..." opener. Content-only, `content/shows/rhoc/seasons/20-the-homecoming.md`.
- source: web-fetch (critique-pass-193, anon)

### [MED] [anon] /shows/rhoc — the canon rationale for Seasons 1 and 2 re-derives the observation the body prose directly above it already makes

- pass: 193 (commit 72f85b9b)
- viewport: desktop
- category: comprehension
- observation: Season 2's `slot_argument` ("WHY THIS SLOT" callout) and its own body paragraph both independently state that the show gains "format fluency/confidence" in its second season — the same canon-rationale-restates-the-body defect class already fixed on other shows' canon pages (below-deck/phuket, project-runway/new-york-2026, love-is-blind/boston), not previously flagged on RHOC.
- evidence: body: "The format confidence that the debut couldn't have yet arrives here in full: the production reads the cast's dynamics with fluency..."; `slot_argument`: "The format gains operational fluency here — more cast movement, higher dramatic stakes, and the show beginning to understand what it actually is."
- suggested fix: Rewrite Season 2's `slot_argument` in `content/shows/rhoc/canon.md` to argue only the comparative canon-slot case against its neighbor (Season 1, rank 2) instead of re-stating the "format gains fluency" observation the body already owns.
- source: web-fetch (critique-pass-193, anon)

### [LOW] [anon] /shows/rhoc/season/the-homecoming — the HOST stat caption bare-restates the tile's own value before adding new information

- pass: 193 (commit 72f85b9b)
- viewport: desktop
- category: voice
- observation: The HOST stat tile's value is "Andy Cohen"; its caption opens by repeating that name verbatim before adding the one new fact (that he hosts the reunion). Same stat-tile-caption bare-restatement class already fixed across traitors/dancing-with-the-stars/big-brother/below-deck-down-under (pass 183/184/192); RHOC hadn't been swept for this yet.
- evidence: `host`: "Andy Cohen"; `host_caption`: "Andy Cohen hosts the reunion".
- suggested fix: Drop the restated name and lead with the new detail: `host_caption: "Hosts the reunion"`. Content-only, `content/shows/rhoc/seasons/20-the-homecoming.md`.
- source: web-fetch (critique-pass-193, anon)

### [LOW] [anon] /themes — the pillar index has no dedicated `opengraph-image` route and falls back to the generic homepage OG card

- pass: 191 (commit 37660861)
- viewport: desktop
- category: seo
- observation: A social share of the `/themes` list index looks identical to a share of the homepage, because the index has no bespoke OG image. Every `/themes/[theme]` detail page already has its own dynamic OG image route, so this is the one themes-pillar surface that doesn't match the per-route-OG convention the rest of the site follows (shows, seasons, and individual themes all have bespoke OG images).
- evidence: Captured `ogImage` for `/themes`: `https://tiered.tv/opengraph-image` — identical to the home page's OG image. Repo check: `src/app/themes/[theme]/opengraph-image.tsx` exists; no equivalent `src/app/themes/opengraph-image.tsx` for the index route.
- suggested fix: Add an `opengraph-image.tsx` route for `/themes` (e.g. a card reading "Lists — N rankings, no spoilers") so shares of the pillar page are distinguishable from the homepage share card. Pattern already exists at the `[theme]` level to port from.
- source: browser (critique-pass-191, anon)

### [LOW] [anon] /themes — the four-word status-badge vocabulary (`stable list` / `growing` / `started <year>` / `updated <recency>`) carries no on-page legend distinguishing what each state means

- pass: 190 (commit faceb537)
- viewport: desktop
- category: comprehension
- observation: `ThemeStatus` (`src/lib/themes-format.ts`, `formatThemeStatus()`) renders one of four distinct lifecycle labels per list card across the `/themes` index and featured rail. The hero's existing gloss ("Every list here is editor-signed and stable — written once, revised when I change my mind, not vote-driven") only explains the `stable` state; a reader scanning cards that read `growing`, `started 2026`, or `updated this year` has no on-page cue for how those differ from `stable` or from each other. Distinct from the already-resolved community-trend `◆ HOLD` badge legend (pass 140, `CanonEraToolbar`'s `.cp-community-legend`) — that fix covers a different badge on a different surface.
- evidence: cards observed back-to-back: "11 SHOWS · 13 ENTRIES STABLE LIST", "16 SHOWS · 18 ENTRIES GROWING", "7 SHOWS · 13 ENTRIES STARTED 2026", plus "UPDATED THIS YEAR" variants elsewhere in the grid.
- suggested fix: Extend the existing `lists-hero-meta` gloss (`src/components/lists/ListsHero.tsx`) to name all four states in one sentence (e.g. "stable means settled, growing means still taking entries, started/updated mark when a list is new or was last touched"), mirroring the pattern already used for the community-trend legend.
- source: browser (critique-pass-190, anon)

### [LOW] [authed] /shows/below-deck — the show's own canon-ranking page "WHY THIS SLOT" boxes for ranks #01/#02 open with an identical sentence template back-to-back

- pass: 190 (commit faceb537)
- viewport: desktop
- category: voice
- observation: The `slot_argument` callouts for Below Deck's top two canon entries both open with the exact same clause shape — "The <Season> season is the <superlative claim>" — immediately followed by a feature list, back-to-back. This is the same sentence-template-reuse defect class already tracked for themed-list entries, now recurring on a show's own canon page rather than a themed list.
- evidence: #01: "The Bahamas season is the first time Below Deck ran at full capacity: confident production, friction across all three departments, and a location the cameras knew how to frame." #02: "The Tahiti season is the strongest mid-run Below Deck entry — seventeen episodes, cast friction across all..."
- suggested fix: Vary the opening clause of one of the two entries so adjacent ranks don't read from the identical template — argue #02's slot comparatively against #01 and #03 instead of restating the "season is the X" superlative shape. `content/shows/below-deck/canon.md`.
- source: browser (critique-pass-190, authed)

### [MED] [anon] /shows/bachelor/season/grant-ellis — the episode-count fact ("nine episodes") is restated across six fields, a second restatement defect on the same page distinct from the casting-precedent one

- pass: 189 (commit fa5bb4ef)
- viewport: desktop
- category: voice
- observation: Independent of the casting-precedent fact pair above, the season's nine-episode runtime is separately restated six times with only light rewording. This fact wasn't in scope of the fa5bb4ef fix (which addressed the casting-precedent fact only), so the same defect class is live on this page a second time, on a different fact, right now.
- evidence: lede: "Nine episodes, the shortest run in years"; `episodes_caption`: "Nine episodes — the fewest since 2008's season twelve."; `format_summary`: "Traditional format, nine-episode run"; body: "nine episodes keep the run tight"; `canon.md` line 101: "nine episodes is the tightest runway the modern era has allowed"; `watch_list` Ep 8 body: "Nine episodes keep the pacing brisk from open to finale."
- suggested fix: Keep `episodes_caption`'s "fewest since 2008" framing as the sole owner of the episode-count observation. Rewrite `format_summary`, the body's closing clause, `canon.md`'s "tightest runway" clause, and the Ep 8 `watch_list` closer to each state a different consequence of the short run (pacing of travel legs, cut frequency, etc.) instead of re-asserting "nine episodes" with a near-synonymous adjective. Content-only, `content/shows/bachelor/seasons/29-grant-ellis.md` + `content/shows/bachelor/canon.md`.
- source: browser (critique-pass-189, anon)

### [MED] [authed] /shows/love-is-blind/season/boston — canon.md's rationale paragraph re-derives the cast-size/format facts "the shape of the season" already owns, the same defect class just found on grant-ellis

- pass: 189 (commit fa5bb4ef)
- viewport: desktop
- category: voice
- observation: Same single-fact-owner drift class documented and fixed dozens of times elsewhere in the catalog (amazing-race/family-edition, shark-tank/season-17, bachelorette/jenn-tran, and others) — fresh and previously unfiled on this page. THE SHAPE OF THE SEASON already states the cast size and pod-to-altar format; WHERE IT SITS IN THE CANON restates both facts rather than arguing the canon-slot comparison.
- evidence: THE SHAPE: "thirty singles, pods, proposal, a first meeting, and a wedding sprint toward the altar." WHERE IT SITS IN THE CANON: "The thirty-person cast and standard pod-to-altar format mirror what the established era has been running since Seattle."
- suggested fix: Let THE SHAPE OF THE SEASON keep sole ownership of the cast-size/format facts. Rewrite WHERE IT SITS IN THE CANON to argue the comparative canon-slot case only (why this season sits where it does relative to Columbus/Charlotte/Denver, per the sentences that follow) without re-stating "thirty-person cast" / "pod-to-altar format." Content-only, `content/shows/love-is-blind/canon.md`.
- source: browser (critique-pass-189, authed)

### [LOW] [authed] /shows/love-is-blind/season/boston — "where it sits in the canon" references prior seasons by bare city name with no cue they're prior seasons of the same show

- pass: 189 (commit fa5bb4ef)
- viewport: desktop
- category: comprehension
- observation: The canon-placement paragraph leans on bare city names (Seattle, Columbus, Charlotte, Denver) as comparison points without identifying them as prior Love Is Blind seasons. A reader landing directly on this season page via search or a shared link has no cue that these are other seasons of the same show rather than unrelated references.
- evidence: "That's not enough to place it near Columbus's demonstrated bounce-back, but there's also no sign yet of the inconsistency that sank Charlotte or the subdued energy that defines Denver."
- suggested fix: Add a light in-line qualifier on first use (e.g., "Columbus's demonstrated bounce-back" → "the Columbus season's demonstrated bounce-back") or hyperlink each city name to its season page — gives a cold-landing reader the context without padding the prose. Content-only, `content/shows/love-is-blind/canon.md`.
- source: browser (critique-pass-189, authed)

### [LOW] [anon] /shows/bachelor/season/grant-ellis — meta description truncates mid-clause right before the em dash introducing the season's second precedent, reading as an unfinished thought

- pass: 187 (commit c8fc6b43)
- viewport: desktop
- category: seo
- observation: The rendered meta description cuts off with an ellipsis exactly where the source `lede` sentence continues into its second clause, so the search-result/social-preview snippet reads as abandoned mid-sentence rather than a complete thought.
- evidence: rendered description: "The franchise's second Black Bachelor takes the mansion in the fastest turnaround the show has staged…" — the source `lede` in `content/shows/bachelor/seasons/29-grant-ellis.md` continues "— cast the same year he appeared on the preceding Bachelorette season," which `clipToSeoBudget()` truncates before reaching.
- suggested fix: Either author a dedicated `meta_description`-equivalent field that's a complete standalone sentence within the ~160-char SEO budget, or adjust the lede's first clause to be independently complete so the clip point lands on a full thought. Content-only, one field.
- source: browser (critique-pass-187, anon)

### [LOW] [anon] /themes/every-season-strikes-a-different-bargain-with-lana — ranked entries carry a "→" link affordance but the two related-list cards below them don't, making it unclear at a glance that those cards are also clickable

- pass: 187 (commit c8fc6b43)
- viewport: desktop
- category: navigation
- observation: Every ranked entry (#01-#06) ends with a "→" signaling it's a link. The two cards under "MORE LISTS IN THIS VEIN" carry no equivalent cue in the rendered text, so the two navigation zones on the same page read inconsistently — one visibly clickable, one ambiguous.
- evidence: ranked entries render "...throws more at its own format than any run before it.\n→"; the related-list cards render their blurb text with no trailing → before the next card begins.
- suggested fix: Add the same "→" affordance to the related-list cards so both navigation zones on the page read consistently as clickable. Likely a shared component fix (wherever the related-list card markup lives) rather than a per-theme content change — check if other themed-list pages have the same gap before scoping as content-only vs. component-level.
- source: browser (critique-pass-187, anon)

### [LOW] [authed] /themes/every-season-strikes-a-different-bargain-with-lana — rank #1 entry's title and blurb both lean on the identical "final/finale season" framing back to back

- pass: 187 (commit c8fc6b43)
- viewport: desktop
- category: voice
- observation: Rank #1's title and blurb both open on the same framing word, landing twice in two consecutive lines of copy a reader takes in together.
- evidence: `content/themes/every-season-strikes-a-different-bargain-with-lana.md` rank 1 — `title: "The finale season stacks a mirror-image twist on top of everything else"`; blurb ends "...The final season throws more at its own format than any run before it."
- suggested fix: Drop "final/finale season" from one of the two lines so the blurb adds a new angle rather than restating the title's own framing. Content-only, one field.
- source: browser (critique-pass-187, authed)

### [MED] [anon] /themes/built-for-one-playing-as-a-team — roughly half the entries open with the identical "cast-count noun verb team-math" sentence shape, three of them back-to-back at the top

- pass: 186 (commit 383a5dab)
- viewport: desktop
- category: voice
- observation: Ranks #1-#3 — the first three entries a reader scrolls past — each open with the same "[cast-count] [cast noun] [become/face/travel-to-compete-as] [team noun]" sentence shape: "Ten solo survivalists become seven two-person teams...", "Nine rookie shops face nine veteran shops...", "Twenty-four home cooks travel to a new city to compete as twelve pairs...". Three more entries further down the list (#4, #5, #8) echo a looser version of the same shape ("Mentors and apprentices compete as linked teams...", "Three past champions each lead a six-artist team...", "Sixteen houseguests move in already coupled up..."). That's 6 of the list's 12 entries sharing one opening grammar, with the tightest three landing consecutively at the very top where a reader's template-detection is sharpest. The remaining 6 entries (#6, #7, #9-#12) each open differently, so this isn't full-catalog templating — it's concentrated at the list's most-read position.
- evidence: `content/themes/built-for-one-playing-as-a-team.md` entry blurbs, lines 21 ("Ten solo survivalists become seven two-person teams sharing the same isolation the format is built on..."), 27 ("Nine rookie shops face nine veteran shops in a tag-team elimination format..."), 33 ("Twenty-four home cooks travel to a new city to compete as twelve pairs throughout..."), 39 ("Mentors and apprentices compete as linked teams instead of lone entrants..."), 45 ("Three past champions each lead a six-artist team, facing off directly..."), 62 ("Sixteen houseguests move in already coupled up, filling a winter slot...").
- suggested fix: Rewrite entries #2 and #3 (the two directly following the list's own rank-#1 template-setter) to open on something other than a cast-count-plus-team-math clause — e.g. lead with the stakes or the structural consequence instead of the mechanic, the same technique already used site-wide to break up adjacent-entry template echoes (e.g. the pass-41 A-tier `card_tagline` fix, the pass-180 "last ... together" adjacency fix). Content-only, two `blurb` fields, no schema change. Spoiler discipline P0 intact — format-mechanics only, no outcome/elimination exposure on any of the six entries touched.
- source: browser (critique-pass-186, anon)

### [MED] [anon] /themes/someone-else-held-the-chair-for-a-while — adjacent ranks #2/#3 both lean on the identical "A judge's seat [gets/goes to] ... instead of ..." sentence template

- pass: 184 (commit 0a312b4a)
- viewport: desktop
- category: voice
- observation: Rank #2 (Drag Race All Stars S02) title reads "A judge's seat gets a season-long guest instead of a substitute for one week." Rank #3 (So You Think You Can Dance S08), rendered immediately after, title reads "A judge's seat goes to a rotating cast of guests instead of a successor." Both open with the identical subject ("A judge's seat") and the identical "[verb] ... instead of ..." contrast structure, back-to-back — the same recurring near-identical-adjacent-entry defect class this catalog has repeatedly flagged and fixed on other lists (e.g. pass-180's "last ... together" pair).
- evidence: `content/themes/someone-else-held-the-chair-for-a-while.md:22` (rank 2 title) and `:25` (rank 3 title), rendered back-to-back on the live page.
- suggested fix: Vary rank #3's opener so it doesn't restate "A judge's seat [verb] ... instead of ..." immediately after rank #2 uses the same shape — e.g. "So You Think You Can Dance leaves the third chair open all season rather than naming a successor." Content-only edit to one `title` field.
- source: browser (critique-pass-184, anon)

### [LOW] [anon] /themes — pillar index reuses the exact same sitewide OG image as the homepage instead of a dedicated one

- pass: 182 (commit f57a9b6b)
- viewport: desktop
- category: seo
- observation: Every nested themed-list page (e.g. `/themes/the-other-side-of-the-table`) has its own page-specific `opengraph-image` route, but the `/themes` pillar index itself falls back to the sitewide default — identical to the homepage's OG image. A link preview for the lists index is visually indistinguishable from a link preview for the homepage.
- evidence: home OG image resolves to `https://tiered.tv/opengraph-image`; `/themes` OG image resolves to the identical `https://tiered.tv/opengraph-image`; `/themes/the-other-side-of-the-table` OG image resolves to its own distinct `https://tiered.tv/themes/the-other-side-of-the-table/opengraph-image`.
- suggested fix: Add a dedicated `opengraph-image.tsx` route under `app/themes/` (e.g. "182 lists, ranked. no spoilers.") matching the pattern already used for individual list pages.
- source: browser (critique-pass-182, anon)

### [LOW] [authed] /shows/90-day-fiance/season/season-12 (and 24 other seasons across 4 shows) — document `<title>` triple-restates the season number/year via a `seasonDisplayTitle()` branch gap

- pass: 181 (commit cf805933)
- viewport: desktop
- category: seo
- observation: Document `<title>` stutters the season identifier three ways: numeral prefix, spelled-out label, and parenthetical year — all carrying the same temporal fact already present in the fact block's premiere date. `seasonDisplayTitle()` (`src/app/shows/[show]/season/[slug]/page.tsx:119-135`) has three guard branches that drop the redundant `S<N>` prefix (bare `Season N`, spelled-out `Season One`, and "title contains both show name and number"), but none fire when `season.title` is `"Season 12 (2026)"` — it doesn't match the bare-numeral regex exactly (trailing `(2026)` breaks the `===` check) and doesn't contain the show name, so it falls through to the unconditional `${show.name} S${season.number} — ${season.title}` template. The pass-68 fix that introduced the first guard branch explicitly scoped this exact shape out at the time ("titles carrying extra info... are out of scope and keep the prefix" — see the pass-68 Done entry), so this is a known, deliberately-deferred gap reaching its moment rather than a surprise regression.
- evidence: Live title: `90 Day Fiancé S12 — Season 12 (2026) — tiered.tv`. `grep -rn '^title: "Season [0-9]* (20[0-9][0-9])"' content/shows/*/seasons/*.md` returns 25 matching season files across 4 shows (90-day-fiance, love-island-us, too-hot-to-handle, traitors) — all render the identical three-way stutter.
- suggested fix: Extend `seasonDisplayTitle()`'s guard set with a fourth branch matching `/^Season \d+ \(\d{4}\)$/` (or `/^Season \d+ \(\d{4}\)$/i` to be safe) that drops the `S<N>` prefix for that form too, parallel to the existing bare-numeral and spelled-out branches. Single function, no visual change for titles that already carry extra non-year info (e.g. "Season 3: Redemption") — those still intentionally keep the prefix per the pass-68 scoping decision. Add unit test cases for the new branch plus a non-firing control (a title with extra info beyond the year).
- source: browser (critique-pass-181, authed, via Path A2 — reader sub-agent, cloud)

### [LOW] [anon] /themes/the-matching-experts-never-sit-still-for-long — adjacent ranks #7/#8 both lean on the identical "last season ... together" construction

- pass: 180 (commit 9999e538)
- viewport: desktop
- category: voice
- observation: Rank #7 (Atlanta, S03) headline reads "The founding four run their last season together," closing with "...the last season before Miami rebuilds the table around a single holdover." Rank #8 (Philadelphia, S08), rendered immediately after, headline reads "A second straight hold turns out to be the panel's last together," closing with "...this is the last season this exact panel sits at the table together." Two consecutive entries landing on the same "last ... together" word pair in both headline and closing line reads as the editorial voice repeating itself rather than varying the framing — the recurring near-verbatim-phrase defect class this catalog has flagged and fixed many times before on other lists/shows.
- evidence: `content/themes/the-matching-experts-never-sit-still-for-long.md:56-57` (rank 7) and `:62-63` (rank 8), rendered back-to-back on the live page.
- suggested fix: Vary rank #8's closer so it doesn't restate "last ... together" right after rank #7 uses the same pairing — e.g. "this panel never sits at this table again" or similar. Content-only edit to one blurb field.
- source: browser (critique-pass-180, anon)

### [MED] [anon] /shows/big-brother/season/time-trip — the "1,000th episode" milestone fact is restated near-verbatim 5 times across the page

- pass: 178 (commit aeccb6ff)
- viewport: desktop
- category: voice
- observation: The franchise's-1,000th-episode fact appears in five distinct fields on the same page, each near-verbatim: the `premiere_caption` meta ("CBS · the franchise's 1,000th episode aired mid-season"), the `pull`/THE TAKE quote ("lands its milestone episode in the middle of a season built to look backward on purpose"), the `eyebrow` ("the franchise's 1,000th episode"), the `watch_list` mid-season entry (episode_label "Mid-season · the 1,000th episode" + body "Big Brother airs the first 1,000th episode of any US primetime series mid-run"), and the season body text ("a mid-season milestone in the show's 1,000th [episode]"). Same single-fact-owner-drift defect class fixed repeatedly elsewhere in the catalog (ink-master, hells-kitchen, 90-day-fiance S12, survivor-51, amazing-race Family Edition), fresh here on a page filed this same tick.
- evidence: `content/shows/big-brother/seasons/28-time-trip.md` — `eyebrow` (line 10), `pull` (line 12), `premiere_caption` (line 18), `watch_list` episode_label + body (lines 30-31), body text (line 41) all carry the "1,000th episode" fact.
- suggested fix: Let one field own the fact in full — the `watch_list` mid-season entry is the natural owner since it's the most specific (names it as a first for any US primetime series). Trim the `eyebrow`, `pull`, `premiere_caption`, and body text to reference the milestone obliquely (e.g. "landed mid-season," "arrives at a real production milestone") rather than re-deriving the "1,000th episode" phrase each time. Content-only, `content/shows/big-brother/seasons/28-time-trip.md`.
- source: browser (critique-pass-178, anon)
- reconfirmed pass 184 (commit 0a312b4a): still open, and the same page carries a second, independent instance of the identical defect class — the construction "built to look backward" (not "1,000th episode" this time) recurs near-verbatim in `pull` (line 12, "...a season built to look backward on purpose"), the `watch_list` mid-season entry body (line 31, "...a season already built to look backward"), and the closing body sentence (line 43, "...another summer built to look backward on purpose"). Same root cause (the page over-derives its own theme across fields), different phrase. The existing suggested fix's "let one field own the fact" principle covers this too — worth widening the fix's scope to also vary the "built to look backward" closer in two of its three occurrences, not just the 1,000th-episode phrase, while the file is being edited anyway.

### [MED] [anon] /shows/amazing-race/season/family-edition — season body and canon.md rationale are a near word-for-word duplicate paragraph, rendered twice on the same page

- pass: 177 (commit 85ef95ec)
- viewport: desktop
- category: voice
- observation: Same defect class documented and fixed dozens of times elsewhere in the catalog (season-body paragraph vs. `canon.md` rationale paraphrase), fresh and previously unfiled on this page. Here it's unusually blatant: the middle two sentences are copied verbatim, not just paraphrased, with only bookend clauses differing.
- evidence: Season body (`content/shows/amazing-race/seasons/08-family-edition.md`): "Ten teams of four — parents with their kids — ran an eleven-leg route that stayed almost entirely within the continental US, with short detours into Mexico, Costa Rica, and Canada. The four-person format crowded the vans and slowed the airport-to-airport rhythm the audience had come to expect. Phil Keoghan hosts with care. The experiment never returned." `canon.md` ("## 8. Family Edition"): "...Ten teams of four — parents with their kids — ran an eleven-leg route that stayed almost entirely within the continental US, with short detours into Mexico, Costa Rica, and Canada. The four-person teams crowded the vans and slowed the airport-to-airport rhythm the audience had come to expect, and the domestic route gave up the geographic argument the show relies on. Phil Keoghan hosts with care. The canon places it thirteenth because the experiment never returned..." Both render on the live page: the first under the H1 lede, the second under "WHERE IT SITS IN THE CANON" a few hundred pixels below.
- suggested fix: Keep the season body as the sole owner of the route/format-crowding/host facts. Rewrite `canon.md`'s "## 8. Family Edition" rationale to argue the #13 canon slot comparatively (why it sits below Season 9's "reset" — which `canon.md` itself already frames as snapping back from "the Family Edition experiment" — and above/below its other low-canon neighbors) instead of re-deriving the same route/crowding sentence. Content-only, `content/shows/amazing-race/canon.md`.
- source: browser (critique-pass-177, anon)
- resolved (2026-10-01, cloud march tick, content-gap redirect — `plan/CADENCE.md` gap table 37/37 starred confirmed-but-unaired, Rule 3 already drained two extends earlier today per `plan/AUDIT.md` row 31's progress log, so this tick redirected to the oldest actionable CRITIQUE finding instead of re-running an exhaustive Rule 3 search). Rewrote the rationale to argue the #13 slot comparatively against its immediate canon neighbors (#12 Season 12, #14 Unfinished Business) instead of re-deriving the season body's route/crowding/host facts — zero phrase overlap with the season body now, 118 words (schema floor 80-120). Commit 53485113.

### [MED] [anon] /shows/survivor/season/survivor-51 — two headline facts each restated near-verbatim 3-5 times across the page

- pass: 176 (commit 1517c887)
- viewport: desktop
- category: voice
- observation: The same single-fact-owner drift class fixed dozens of times elsewhere in the catalog appears fresh on Survivor 51, previously unfiled for this page. The premiere's "seven twists from six past seasons plus three new ones" stat is restated near-verbatim in "THE TAKE," "THE SHAPE OF THE SEASON," and "WHERE IT SITS IN THE CANON." Separately, "first odd-numbered cast since 2007" is restated five times: the lede, the CAST SIZE meta field, "THE SHAPE OF THE SEASON," "WHERE IT SITS IN THE CANON," and the EP1 "ODD CAST MATH" watch-for entry.
- evidence: THE TAKE: "Probst has described the two-hour premiere alone as stacking seven twists borrowed from six past seasons with three brand-new ones." THE SHAPE OF THE SEASON (same page): "Probst has described the two-hour premiere alone as stacking seven twists from six past seasons with three brand-new ones." WHERE IT SITS IN THE CANON (same page): "...the two-hour premiere alone reportedly pulled from six prior seasons before adding three new wrinkles." The "first odd-numbered cast since 2007" clause recurs across the lede, CAST SIZE meta, and both body sections plus the EP1 watch-for entry.
- suggested fix: Let "THE SHAPE OF THE SEASON" own both the premiere-twist-count fact and the odd-cast fact in full; rewrite "THE TAKE" and "WHERE IT SITS IN THE CANON" to reference either fact obliquely (or pivot to a distinct angle — e.g. what the twist-density does to early strategy, or how the odd cast size affects the merge math) rather than re-deriving the same numbers. Content-only, `content/shows/survivor/seasons/51-survivor-51.md` + `content/shows/survivor/canon.md`.
- source: browser (critique-pass-176, anon)

### [MED] [anon] /themes — the 182-entry "All lists" catalog renders list titles as `<span>`, not headings, so screen-reader users can only heading-jump to the 3 featured cards

- pass: 175 (commit bbef2177)
- viewport: desktop
- category: a11y
- observation: `/themes`' "Featured this month" section renders its 3 cards' titles as `<h3>{theme.title}</h3>` (`src/components/lists/FeaturedCard.tsx:64`), but the "All lists" catalog below renders all 182 entries' titles as `<span className="list-row-title">{theme.title}</span>` (`src/components/lists/ListRow.tsx:39`). A screen-reader user navigating by heading can reach the 3 featured lists but has no heading-level way to jump to any of the other 179 — they'd have to read the entire flat text stream sequentially. `/shows` doesn't share this gap: all 68 tier tiles correctly use `<h3 className="show-tile-name">` (`src/components/home/ShowTile.tsx:45`, `src/components/shows/ShowsTile.tsx:67`), so this is an isolated `/themes`-template regression, not a site-wide convention.
- evidence: `src/components/lists/ListRow.tsx:39` — `<span className="list-row-title">{theme.title}</span>`; `src/components/lists/FeaturedCard.tsx:64` — `<h3>{theme.title}</h3>`; `src/components/lists/ListsAllSection.tsx:37,57` — the "All lists" `<h2>` section wraps `<ListRow>` for every catalog entry.
- suggested fix: Change `ListRow`'s `list-row-title` element from `<span>` to a heading tag (`<h3>` or `<h4>`, matching the section's `<h2>` nesting) so all 182 entries become heading-navigable, matching the `/shows` tile pattern. Styling can stay identical via the existing `.list-row-title` class.
- source: browser (critique-pass-175, anon)

### [LOW] [anon] /shows/90-day-fiance/season/season-12 — the "Where it sits in the canon" paragraph breaks the site's plain-sentence voice with a clause-stacked, metaphor-heavy sentence

- pass: 175 (commit bbef2177)
- viewport: desktop
- category: voice
- observation: The canon-fit paragraph on the freshly-filed Season 12 page departs from bearings' "confident, warm, plain-spoken... plain sentences over clever ones" mandate — one 33-word sentence stacks two subordinate clauses around a sports metaphor, following a rhetorical question two sentences earlier.
- evidence: "does the format still work without any returning or crossover couples to lean on?" ... "That's not a structural first in the way the throuple casting or the seven-couple ensemble were, but reversing a six-season trend on purpose is a real editorial swing, not a coast." — `content/shows/90-day-fiance/canon.md`, Season 12 entry.
- suggested fix: Split into two plain declarative sentences; drop the "editorial swing, not a coast" metaphor and the rhetorical question, and state the comparison to the throuple/seven-couple firsts directly.
- source: web-fetch (critique-pass-175, anon)
- resolved (2026-10-04, cloud march tick, content-gap redirect — standing season-fill row stalled on Rule 2 and Rule 3 both exhausted for the day, per `plan/AUDIT.md` row 31's progress log). Rewrote the rationale: dropped the rhetorical question and the clause-stacked sports-metaphor sentence, split into two plain declaratives that compare directly against the throuple casting and seven-couple ensemble firsts. 106 words (floor 80-120). Commit d3fc2415.

### [LOW] [anon] /shows/90-day-fiance/season/season-12 (mobile) — the "no returning couples" fact is restated near-verbatim across three consecutive page sections

- pass: 175 (commit bbef2177)
- viewport: mobile
- category: voice
- observation: The freshly-filed Season 12 page shows the same single-fact-owner drift class documented repeatedly elsewhere (most recently pass-174's DWTS S35 / Traitors New Blood finding, itself following dozens of prior instances), but spanning three distinct on-page blocks rather than two: "THE TAKE" pull-quote, the "THE SHAPE OF THE SEASON" heading, and that section's own body sentence all restate "no returning/crossover couples" with only light rewording before any new information appears.
- evidence: "01 THE TAKE — No comeback couples to lean on, for the first time in years. Seven strangers-to-the-audience couples, the comeback device set aside for one season." followed immediately by "02 THE SHAPE OF THE SEASON — Seven couples, zero returning faces. Season twelve resets the flagship to a fully new cast: seven couples, none returning or crossing over from a prior season..." — all three clauses restate the identical fact.
- suggested fix: Let "THE TAKE" carry the single fact alone; open "THE SHAPE OF THE SEASON" with a different angle (episode count, premiere timing, or the Tell All structure) before circling back to cast-freshness. This is the fourth+ instance of this defect class this month — pass-174 already floated a systemic fix (a `content-check` invariant flagging the same clause repeated ≥4 times across a season's editorial fields); worth promoting from "consider" to "do" if a fifth instance appears.
- source: browser (critique-pass-175, authed)
- resolved (2026-10-04, cloud march tick, content-gap redirect — same tick as the adjacent pass-175 canon.md fix above). Gave `shape_h2` + the body's opening sentence their own angle (episode count + Tell All structure — "Eighteen episodes, closing with a three-part Tell All in September 2026") instead of restating "zero returning faces," which `take_h2`/`pull` already own. Body circles back to the cast-freshness fact in its second sentence, matching the convention `take_h2`/`pull` already use for their owned fact. Commit d3fc2415.

### [MED] [authed] /themes/the-clock-had-to-make-room, /themes/new-network-same-rulebook — the save button reads "Save (this device)" even for a signed-in reader, with no indication the save is (or isn't) tied to the account (bumped LOW → MED at pass 192: second occurrence, confirmed systemic across themed lists)

- pass: 175 (commit bbef2177); reconfirmed pass 192 (cloud march)
- viewport: desktop
- category: comprehension
- observation: The themed-list save affordance is labeled "Save (this device)" even when the visitor is signed in (`@e2e` confirmed in header chrome). For an authenticated reader this reads as a downgrade — the copy gives no indication the save could instead follow the account, so a signed-in reader has no reason to expect (or not expect) it to persist across devices. Pass 192 reconfirmed the identical copy on a second, unrelated themed list, confirming this is the shared list-save component's behavior rather than a one-off.
- evidence: `<button aria-label="Save 90 Day Fiancé: the clock had to make room" data-testid="list-save" data-saved="false">Save (this device)</button>` — rendered verbatim on the request made with the authenticated `__session` cookie. Pass 192: `/themes/new-network-same-rulebook` rendered "ENTRIES 13 UNIQUE SHOWS 7 CURATED BY tiered.tv editor LAST REVISED July 2026 SAVE (THIS DEVICE) SHARE" directly below header chrome showing `@e2e`.
- suggested fix: For authenticated sessions, either persist saves to the account and change the label to "Save," or keep device-local saves but note in copy/tooltip that signing in doesn't change that — so it reads as a deliberate choice, not an oversight.
- source: web-fetch (critique-pass-175, authed); browser (critique-pass-192, authed)

### [MED] [anon] /themes/[theme] — meta descriptions are never passed through `clipToSeoBudget()`, so 168 of 182 themed-list pages ship a search-snippet description over the ~160-char budget

- pass: 174 (commit 576769c1)
- viewport: desktop
- category: seo
- observation: `src/app/(default)/themes/[theme]/page.tsx:39` passes `theme.description` straight into `buildMetadata()` with no clipping call. `buildMetadata()` itself (`src/lib/seo.ts:161-176`) never clips either — it assumes the caller already budgeted the string. The two show/season page families both call `clipToSeoBudget(lede)` before `buildMetadata()` (confirmed: `grep -rl clipToSeoBudget src/app` returns only `shows/[show]/page.tsx` and `shows/[show]/season/[slug]/page.tsx`), but the themes page family never does. A corpus sweep of every `content/themes/*.md` `description` field found 168 of 182 (92%) exceed 160 characters — e.g. `built-for-the-drop.md`'s description is 244 chars, `a-dating-experiment-still-writing-its-own-rulebook.md` is 279 chars. This isn't a one-off content miss; it's a missing call in the page's metadata builder, so essentially the entire themed-list catalog under-serves search-result snippets (Google truncates around ~155-160 chars, landing mid-sentence on most theme pages).
- evidence: `src/app/(default)/themes/[theme]/page.tsx:37-40` — `return buildMetadata({ title: ..., description: theme.description, ... })`, no `clipToSeoBudget()` call anywhere in the file. Corpus check: `for f in content/themes/*.md; do desc=$(grep -m1 "^description:" "$f" | sed 's/^description: *//'); echo ${#desc}; done` → 168/182 lengths exceed 160.
- suggested fix: Wrap the `description` argument at `themes/[theme]/page.tsx:39` (and the `/themes` index page's own `buildMetadata()` call, if its description is also content-authored) in `clipToSeoBudget(theme.description)`, mirroring the show/season page precedent. Content-only field, no schema change — the full `description` still renders in the page body; only the meta-tag argument changes.
- source: browser (critique-pass-174, anon)

### [MED] [anon] /shows/dancing-with-the-stars/season/fall-2026, /shows/traitors/season/new-blood — each freshly-filed season's single headline fact is restated near-verbatim 5-6 times across the page

- pass: 174 (commit 576769c1)
- viewport: desktop
- category: voice
- observation: Both seasons the 2026-09-28 CADENCE drain just filed independently show the same defect: a single headline fact is restated with only light rewording across the eyebrow, lede, a meta-panel field, and two body sections, before any new information appears. On DWTS S35 the fact is "ties Seasons 9/31 for largest cast at 16 couples" (eyebrow, lede, FORMAT meta, CAST SIZE meta, "The shape of the season," "Where it sits in the canon" — six near-identical restatements). On Traitors S5 "New Blood" the fact is "first all-civilian cast, no alumni/celebrities" (eyebrow, lede, FORMAT meta, meta subtext, "The shape of the season," "Where it sits in the canon" — five near-identical restatements). This is the same single-fact-owner drift class fixed repeatedly elsewhere in the catalog (most recently pass-173's Shark Tank S17 finding), but its appearance on both same-day season drains suggests the season-fill drafting pattern itself over-anchors on one differentiator fact rather than a page-specific miss.
- evidence: DWTS S35 — eyebrow "A RECORD-TYING 16-COUPLE CAST"; lede "ties the series record for largest cast — sixteen celebrity-professional pairs"; FORMAT meta "Ties Seasons 9 and 31 for the largest cast in series history"; CAST SIZE meta "Ties seasons nine and thirty-one for the largest field ever fielded"; SHAPE section "tying the record held by seasons nine and thirty-one"; WHERE IT SITS section "tying seasons nine and thirty-one for the largest cast the format has assembled." Traitors New Blood — eyebrow "THE FRANCHISE'S FIRST ALL-CIVILIAN CAST"; lede "swaps its celebrity-and-alumni model for its first all-civilian cast"; FORMAT meta "All-civilian cast · broadcast NBC premiere" / "First season without a single reality-TV alum or celebrity"; SHAPE section "its first all-civilian cast, no reality alumni or celebrities anywhere in the mix"; WHERE IT SITS section "The cast goes all-civilian for the first time in the franchise's history — no reality alumni, no celebrities."
- suggested fix: Content-curator pass on both season files (`content/shows/dancing-with-the-stars/seasons/35-fall-2026.md`, `content/shows/traitors/seasons/05-new-blood.md`): keep the lede as the sole owner of the raw fact, and rewrite the meta-panel captions + one of the two body sections (SHAPE or WHERE IT SITS) to argue a distinct angle instead of re-deriving the same comparison — e.g. DWTS's "Where it sits in the canon" could argue the provisional rank against neighboring seasons rather than restate the cast-size record a sixth time; Traitors's meta subtext could point at the network-pivot angle (Peacock-exclusive → NBC/Peacock) instead of repeating "all-civilian." If this recurs on the next season-fill drain too, consider a `content-check` invariant flagging the same clause repeated ≥4 times across a season's editorial fields, mirroring the existing theme-level verb-stem/phrase-repetition checks.
- source: browser (critique-pass-174, anon)
- confirmed still open (2026-10-07, critique pass 183, anon): both pages still exhibit the drift, and it's broader than originally scoped — DWTS S35 also restates the Olympic/Paralympic-champion pairing + pregnant-pro-dancer facts near-verbatim 3 times (lede, "Shape of the Season," "Where it Sits in the Canon") beyond the cast-size-record fact already filed, and Traitors New Blood also duplicates its "80,000-plus applicants" + "first broadcast-NBC season" sentence verbatim between the lede and "Shape of the Season" beyond the all-civilian-cast fact already filed. Same root cause (season-fill drafting over-anchors on headline facts across every editorial field) — not filing as separate rows since the suggested fix (a full content-curator rewrite pass on both files) already covers these too. Strengthens the case for the suggested `content-check` repeated-clause invariant, since two independent facts per page are now confirmed drifting, not one.

### [MED] [authed] /shows/shark-tank/season/season-17 — two headline facts restated near-verbatim across at least 8 fields spanning the season file and canon.md

- pass: 173 (commit c95dc753)
- viewport: desktop
- category: voice
- observation: Season 17's two headline facts — the Wednesday timeslot move and Daniel Lubetzky becoming a full-time shark — are restated with only light rewording across `lede`, `pull`, `take_h2`, `format_caption`, `cast_size_caption`, and the first `watch_list` entry in `content/shows/shark-tank/seasons/17-season-17.md`, and again in canon.md's `tag`, `slot_argument`, and prose paragraph for the same season. A reader scrolling top to bottom (or reading the season page then clicking through to canon) encounters the identical two sentences reworded seven or eight times before hitting any new information — the same single-fact-owner drift class fixed dozens of times elsewhere in the catalog (traitors/ardross-2026, below-deck-mediterranean/dubrovnik-ii, alone/arctic-ii, and others).
- evidence: `lede`: "Daniel Lubetzky sits as a full-time shark for the first time, while Mark Cuban isn't part of the rotation" / `pull`: "A new night, a new full-time shark, and the loudest guest lineup yet" / `format_caption`: "A new timeslot and a new full-time seat at the table" / `cast_size_caption`: "Daniel Lubetzky's first season as a full-time shark" / `watch_list[1].body`: "Watch Daniel Lubetzky settle into a permanent seat after seasons as a recurring guest" / canon.md `tag`: "The new panel settles in — Lubetzky's first full season, a new night, and the loudest guest lineup yet" / canon.md `slot_argument`: "A timeslot move to Wednesday, a newly full-time shark, and a guest rotation pulling louder names than any prior season" — all restate the identical two facts.
- suggested fix: Leave `lede` (season file) as the sole owner of the raw facts. Rewrite `pull`, `take_h2`, `format_caption`, and `cast_size_caption` to each argue a distinct angle (e.g. what the new night does to the show's pacing/ratings context, what the guest-chair trend signals structurally) rather than re-deriving timeslot/Lubetzky. Rewrite canon.md's `tag`/`slot_argument`/prose to argue the #9 canon-slot comparison against neighboring seasons (per the established pattern — see the Done section's near-verbatim-restatement fixes) instead of restating the same two facts a third and fourth time.
- source: browser (critique-pass-173, authed)

### [MED] [anon] /shows/dragrace/season/season-18 — the meta-description word-boundary fallback lands on a dangling adjective ("full") with no noun

- pass: 171 (commit e9de6844)
- viewport: desktop
- category: seo
- observation: The season's `<meta name="description">` is generated from `lede` via `clipToSeoBudget()` with no `meta_description` override authored. The 174-char lede runs past the 159-char budget; the only comma in range (after "record,") sits before the 60%-of-budget `minCut` threshold so the clause-boundary branch correctly declines it, and the function falls through to the raw word-boundary fallback — which lands on "full," an adjective with no noun, one word before the sentence's actual payoff ("eliminated-cast tournament"). Rendered: "...trades the usual top-two lip sync for a full…". This is the same defect class already fixed twice for other trigger words (pass-79's trailing stop-words denylist, pass-136's trailing-ordinal trim) but "full" is in neither list, so the fallback still produces a dangling modifier here.
- evidence: Reproduced directly against the current `clipToSeoBudget()` implementation (`src/lib/seo.ts:88-120`) using the exact lede from `content/shows/dragrace/seasons/18-season-18.md:12` — confirmed the clause-boundary comma (index 79) falls short of `minCut` (95), so the word-boundary fallback fires and returns `"...for a full…"` verbatim, matching the live rendered meta tag.
- suggested fix: Content-level fix is simplest and matches how most instances of this defect class have been closed (rewrite `lede` in `content/shows/dragrace/seasons/18-season-18.md` so the sentence's payoff clause lands earlier, or add a `meta_description` override via the existing `descriptionFor()` escape hatch — see the-voice's `29-the-finale.md` precedent). If this keeps recurring on fresh trigger words, the more systemic fix is teaching the word-boundary fallback to also reject a cut landing on a bare adjective immediately preceding the window's true end (harder to generalize safely than the stop-word/ordinal lists — recommend content-level fix first).
- source: web-fetch (critique-pass-171, anon)

### [MED] [authed] vote-pair (confirmed on /shows/the-voice/season/the-finale and /shows/dragrace/season/season-18) — the vote count has no `aria-live` region, so a screen-reader user gets no announcement after casting a vote

- pass: 171 (commit e9de6844)
- viewport: desktop
- category: a11y
- observation: The vote-pair component's vote-state cap and vote-count elements carry no `aria-live` attribute anywhere in their markup. A sighted user casting a vote sees the count update and a delta-animation flash; a screen-reader user gets no announcement that the vote registered, what the new count is, or that the state cap changed from "you haven't voted yet."
- evidence: Rendered DOM on `/shows/the-voice/season/the-finale`: `<div class="vote-state-cap" data-vote-state="none">you haven't voted yet</div>` and `<div class="vote-count"><span class="vote-num" data-testid="vote-count">0</span><span class="vote-label">votes so far</span></div>` — zero occurrences of `aria-live` anywhere in the page source. Same absence confirmed on `/shows/dragrace/season/season-18`, so this is a shared-component gap, not a page-specific one.
- suggested fix: Add `aria-live="polite"` to the vote-count/vote-state-cap wrapper in the shared `VotePair` component (`src/components/composition/VotePair.tsx`) so the count and state-cap text update is announced after a click. Component-only, no visual change.
- source: web-fetch (critique-pass-171, authed)
- issue: #818
- RESOLVED (2026-09-26, cloud march tick, commit 0ff3655d): added `aria-live="polite"` to the shared `vote-pair-stack` wrapper in `VotePair.tsx` so both the state cap and the count are announced after a vote — component-only, no visual change. Verify gate green: fast gate (199 test files/3698 unit tests, content:check ok), build clean (1520 static pages), e2e 4969/4969 passed (31.8m).

### [MED] [authed] /mod — the access-denied copy names the internal auth vendor and admin console to end users

- pass: 170 (commit 7d6424d1)
- viewport: desktop
- category: voice
- observation: A signed-in reader without the moderation role sees copy that leaks an implementation detail — the name of the auth vendor's admin console — instead of a plain-spoken instruction. Breaks the "knowledgeable peer" voice, which never surfaces vendor/tooling names to readers.
- evidence: `src/app/(default)/mod/page.tsx:72` renders "Your account is signed in but doesn't have the moderation role. If you should have access, ask the admin to grant the mod role in the Auth0 dashboard."
- suggested fix: Drop the vendor name and console reference — "Ask a tiered.tv admin to add moderator access to your account."
- source: browser (critique-pass-170, authed)
- issue: #816
- RESOLVED (2026-09-25, cloud march tick, commit b72e97f2): rewrote the access-denied copy from "ask the admin to grant the mod role in the Auth0 dashboard" to "ask a tiered.tv admin to add mod access to your account" — drops the vendor name and console reference entirely, same instruction. Content-only, one file. Verify gate green: fast gate (199 test files/3693 unit tests, content:check ok), build clean (1519 static pages), e2e 4898/4898 passed (32.4m).

### [MED] [anon] /shows/top-chef/season/carolinas, /shows/bachelor/season/grant-ellis — the zero-vote community block reads as an abandoned feature months after the season aired (bumped LOW → MED at pass 187: second occurrence, second flagship show)

- pass: 170 (commit 7d6424d1); reconfirmed + extended pass 187 (commit c8fc6b43)
- viewport: desktop
- category: comprehension
- observation: Top Chef Carolinas premiered 2026-03-09 (roughly six months before pass 170) yet its community vote block still reads "0 / BE THE FIRST TO VOTE," which sits oddly against the homepage's framing of community rank as "live, restless, real numbers per season." Pass 187 found the identical shape on a second flagship show: Bachelor Season 29 ("Grant Ellis," aired winter 2025, well over a year before this pass) renders the same "0 / BE THE FIRST TO VOTE" block. Two independent instances on two separate flagship franchises is strong enough signal that this isn't a one-off stale page — it's a systemic gap in how community vote counts get seeded (or how the empty state reads) for any back-catalog season.
- evidence: Top Chef Carolinas rendered vote block: "0 / BE THE FIRST TO VOTE / one vote per reader; change your mind within 72h. community rank updates weekly." Bachelor Grant Ellis rendered vote block: "Does this belong in the community top 10? CAST A VOTE COUNTS MORE ONCE YOU SIGN IN 0 BE THE FIRST TO VOTE." Homepage lede: "One you vote — live, restless, real numbers per season."
- suggested fix: Content/product question, not a code bug per se — either seed early community votes before a season page ships, or soften the empty-state copy specifically for seasons that have been live for months/years so "be the first" doesn't read as stale on well-aged pages. Flagging for iterate/editorial judgment rather than prescribing the fix. Given two instances now, worth considering a systemic empty-state copy change (e.g. age-aware copy swap past some threshold) rather than per-page patches.
- source: browser (critique-pass-170, anon; critique-pass-187, anon)
- source: browser (critique-pass-170, anon)

### [MED] [anon] /shows/survivor/season/survivor-50 — the "fiftieth season" milestone fact is restated near-verbatim four times on one page

- pass: 169 (commit 5cb1805c)
- viewport: desktop
- category: voice
- observation: The fact that this is Probst's/the show's fiftieth season is restated four separate times: the HOST meta tile, the season body paragraph, and twice in the canon rationale block (`slot_argument` and the prose paragraph below it).
- evidence: `content/shows/survivor/seasons/50-survivor-50.md` `host_caption`: "fiftieth season at the helm"; body: "Probst hosts his fiftieth season on the islands." `content/shows/survivor/canon.md` "## 50. Survivor 50" `slot_argument`: "The fiftieth season closes the show's first quarter-century..."; body: "The fiftieth season ran through spring 2026 on the same 26-day format..." All four render on the single `/shows/survivor/season/survivor-50` page.
- suggested fix: Let the HOST tile own the "fiftieth season" fact alone. Rewrite the season body's closing sentence to describe what the milestone does to the format rather than restating "fiftieth season." In canon.md, collapse `slot_argument` and the body paragraph into one argument — `slot_argument` is now fully redundant with the body's own point. Content-only, two files.
- source: browser (critique-pass-169, anon)
- RESOLVED (2026-09-24, cloud march tick, commit aa8d97f0): `host_caption` is now the sole owner of the "fiftieth season" fact. Rewrote the season body's closing sentence to a new angle (Probst as the only person who has personally clocked every cast era being merged into this season) instead of restating the milestone. In canon.md, dropped the `slot_argument`'s "fiftieth season closes the show's first quarter-century" clause (now argues purely from the freshly-aired-season-holds-provisionally logic) and swapped the body's "The fiftieth season ran..." / "Fiftieth is a placeholder..." restatements for "This season ran..." / "The round number is a placeholder...". Content-only, two files, no canon rank or CADENCE change.

### [MED] [anon] /shows/survivor/season/survivor-50 — the vote-button aria-labels duplicate the show name when a season's title already starts with the show name

- pass: 169 (commit 5cb1805c)
- viewport: desktop
- category: a11y
- observation: The three vote-button aria-labels read "Vote on Survivor Survivor 50", "Vote up Survivor Survivor 50", "Vote down Survivor Survivor 50" — the show name doubled, because the label template concatenates "Survivor" with the season title "Survivor 50" verbatim. Confirmed this is title-dependent, not universal: the same component on `/shows/survivor/season/heroes-vs-villains` correctly renders "Vote up Survivor Heroes vs. Villains" with no duplication, since that season's title doesn't start with the show name.
- evidence: raw HTML on `/shows/survivor/season/survivor-50`: `aria-label="Vote on Survivor Survivor 50"`, `aria-label="Vote up Survivor Survivor 50"`, `aria-label="Vote down Survivor Survivor 50"`.
- suggested fix: In the vote-button aria-label template, detect (or omit) the show-name prefix when the season title already starts with it, so numbered-title seasons (any `<Show> <N>` pattern) don't double the show name. Likely affects other numbered-season pages beyond Survivor 50 — worth a repo-wide grep for season titles that start with their own show name.
- source: browser (critique-pass-169, anon)

### [MED] [authed] /shows/survivor/season/heroes-vs-villains — the season H1's accessible name loses the word boundary across a forced `<br/>` line break

- pass: 169 (commit 5cb1805c)
- viewport: desktop
- category: a11y
- observation: `display_title: "Heroes <em>vs.</em><br/>Villains"` renders with no space adjacent to the `<br/>`, so `document.querySelector('h1').textContent` reads "Heroes vs.Villains" with no space — a screen reader announces it as one run-on token instead of "Heroes vs. Villains."
- evidence: `content/shows/survivor/seasons/20-heroes-vs-villains.md` line 5: `display_title: "Heroes <em>vs.</em><br/>Villains"`; component: `src/components/composition/SeasonHero.tsx` renders the title tokens with no space token adjacent to the literal `<br />`.
- suggested fix: In `SeasonHero.tsx`, ensure a space is preserved across the `<br/>` boundary in the accessible name (either insert a literal space token when rendering, or require `display_title` authors to leave a trailing space before `<br/>`). Shared component — any show/season using `<br/>` in `display_title` likely has the same defect; worth a repo-wide check after the fix.
- source: browser (critique-pass-169, authed)

### [MED] [authed] /shows/survivor/season/heroes-vs-villains — the "twenty returnees, two tribes" cast fact is restated near-verbatim four times on one page

- pass: 169 (commit 5cb1805c)
- viewport: desktop
- category: voice
- observation: The fact that twenty returning players split into a heroes tribe and a villains tribe is restated four separate times: the FORMAT meta field, the CAST SIZE meta field, the opening line of "THE TAKE," and the opening line of "WHERE IT SITS IN THE CANON."
- evidence: FORMAT: "Returnees · 2 tribes / all-veteran cast"; CAST SIZE: "20 players / 10 heroes, 10 villains"; THE TAKE: "Twenty returnees split into a heroes tribe and a villains tribe, filmed on the Samoan coast..."; WHERE IT SITS: "Twenty returning players, two clean tribal premises, a decade of accumulated context..." — all on `/shows/survivor/season/heroes-vs-villains`.
- suggested fix: Keep the fact once in the meta strip (FORMAT/CAST SIZE). Rewrite "THE TAKE" and "WHERE IT SITS" to build on it rather than re-deriving it — "WHERE IT SITS" in particular should open on canon-placement reasoning, not repeat the tribe/headcount. Content-only, one file.
- source: browser (critique-pass-169, authed)
- RESOLVED (2026-09-24, cloud march tick, commit bd897819): rewrote the season's `pull` field and `canon.md`'s slot #02 rationale so both open on structural/canon-placement reasoning (the tribe line's pre-merge work, the ten-season accumulated context) instead of restating the twenty-returnee/two-tribe headcount already carried by the FORMAT and CAST SIZE meta fields. Content-only, two files. Picked up per the established dispatch-starvation workaround (issue #758): Rule 2 (season-fill) fully starred in `plan/CADENCE.md` (all gap-slots confirmed-but-unaired), no actionable filesystem gap this tick. Verify gate green: fast gate clean, build 1519/1519 static pages, e2e 4898/4898 passed (31.2m).

### [MED] [authed] / (home, signed-in) — the header's nav links and account-menu trigger have no `:focus-visible` ring, unlike other interactive chrome

- pass: 169 (commit 5cb1805c)
- viewport: desktop
- category: a11y
- observation: Tabbing to the header "Shows" link or the `@e2e` account-menu trigger falls back to the thin unstyled browser default focus ring (`outlineStyle: auto`, `outlineWidth: 1px`, no box-shadow), while other interactive elements in the same system (skip-to-main link, comment textarea, search input) get a deliberate 2px `var(--color-primary-base)`/`var(--show-primary)` ring with offset.
- evidence: computed style on the header "Shows" link: `outlineStyle: 'auto', outlineWidth: '1px', boxShadow: 'none'`. Contrast with `src/app/globals.css` (`.skip-to-main:focus-visible { outline: 2px solid var(--color-primary-base) }`), `src/styles/screens.css` (`.comment-ta:focus-visible { outline: 2px solid var(--show-primary); outline-offset: 4px }`), `src/styles/search.css` (`.search-input:focus-visible { ... }`). No equivalent rule exists for header nav `a` or `.site-header-user-trigger`.
- suggested fix: Add a `:focus-visible` rule for header nav links and `.site-header-user-trigger` matching the 2px show-primary/brand-primary ring used elsewhere, so focus treatment is consistent across the chrome.
- source: browser (critique-pass-169, authed)

### [MED] [authed] /shows/hells-kitchen/season/battle-of-the-states — the one-chef-per-state cast fact is restated near-verbatim across six fields on the same page

- pass: 168 (commit 1650b60f)
- viewport: desktop
- category: voice
- observation: The "twenty chefs, one per U.S. state" fact appears in the eyebrow, lede, `format_summary`, `format_caption`, `cast_size_caption`, and the "Shape of the season" body opening — six placements restating the identical premise on one page render.
- evidence: `content/shows/hells-kitchen/seasons/24-battle-of-the-states.md` eyebrow: "One chef per U.S. state"; lede: "Twenty chefs — one representing each of twenty U.S. states"; `format_summary`: "one-per-state cast"; `format_caption`: "20-chef cast, one representative per state"; `cast_size_caption`: "twenty chefs, one from each represented U.S. state"; body: "twenty chefs — each representing a different U.S. state."
- suggested fix: Keep the full one-per-state fact in the lede only. `format_caption` and `cast_size_caption` sit stacked in the same stat rail restating the identical clause twice in a row — rewrite both to each add a fact the lede doesn't already own (e.g. the elimination format, the prize, a specific state detail) instead of re-deriving the cast structure a third and fourth time. Content-only, one file.
- source: browser (critique-pass-168, authed)

### [MED] [authed] /shows/married-at-first-sight-australia/season/season-13 — the Mel Schilling tribute fact is restated near-verbatim across five fields on the same page

- pass: 168 (commit 1650b60f)
- viewport: desktop
- category: voice
- observation: "Mel Schilling's final season with the panel she helped build (since season two) — she died during this season's broadcast run" is restated in the eyebrow, lede, pull quote, host caption, and the "Shape of the season" body opening — five separate placements of the same fact.
- evidence: `content/shows/married-at-first-sight-australia/seasons/13-season-13.md` eyebrow: "Mel Schilling's final season with the panel"; lede: "Mel Schilling's final season with the panel she helped build since season two — she died during this season's broadcast run"; pull: "Mel Schilling's final season closes a decade on the panel she helped define"; `host_caption`: "Mel Schilling's final season on the expert panel"; body: "Mel Schilling's final season with the expert panel she helped build from season two onward — she died during this season's broadcast run, a loss the show and its long-running panel felt deeply."
- suggested fix: Keep the full fact in the lede only (canon.md's own `tag`/`slot_argument` for this season already reference it more obliquely — mirror that pattern here). Rewrite the pull, `host_caption`, and body opening to reference the tribute without re-deriving the full clause four more times on one page. Content-only, one file.
- source: browser (critique-pass-168, authed)

### [MED] [authed] /shows/bachelorette/season/jenn-tran — the season body and canon.md rank-9 rationale restate nearly the same paragraph, same four facts in the same order

- pass: 168 (commit 1650b60f)
- viewport: desktop
- category: voice
- observation: The Rachel Lindsay comparison, first-Asian-American-lead milestone, Agoura-Hills-to-Hummingbird-Nest-Ranch venue move, and the ten-episode/~25-men/four-country travel/Jesse-Palmer's-third-season format facts appear in the same order with only light rewording in both the season body and canon.md's rank-9 rationale.
- evidence: season body: "The franchise's most overdue first since Rachel Lindsay. A physician-assistant student becomes the first Asian American lead in Bachelor or Bachelorette history, and the producers move the home base off the traditional Agoura Hills mansion to Hummingbird Nest Ranch... Ten episodes, roughly twenty-five men, a summer run, and travel to Seattle, Hawaii, Australia, and New Zealand under Jesse Palmer's third season." vs. `content/shows/bachelorette/canon.md` rank-9 rationale: "The franchise's most historically significant season since Rachel Lindsay's. A physician-assistant student becomes the first Asian American lead in Bachelor or Bachelorette history, and the producers pair the milestone with a structural shift, moving the home base from the traditional Agoura Hills mansion to Hummingbird Nest Ranch... Ten episodes, roughly twenty-five men, and travel to Seattle, Hawaii, Australia, and New Zealand under Jesse Palmer's third season." (`content/shows/bachelorette/seasons/21-jenn-tran.md`; `canon.md` line 91)
- suggested fix: Keep the full milestone/format fact set in the season body only. Rewrite canon.md's rank-9 rationale to argue the slot comparatively — why it beats the well-built-but-unambitious entries below it but sits below the structural-courage tier above — instead of re-deriving the same four facts already stated verbatim in the body. Content-only, `content/shows/bachelorette/canon.md`.
- source: browser (critique-pass-168, authed)

### [LOW] [authed] /shows/alone-the-skills-challenge/season/season-1 — the eyebrow field is a bare "Season N · Year" with no verb or network, the sole outlier across the entire season-file corpus

- pass: 167 (commit 73dd0977)
- viewport: desktop
- category: comprehension
- observation: The season's eyebrow line reads "Season 1 · 2022" with no premiere verb and no network — every other checked season file (including So You Think You Can Dance's Atlanta season, walked the same pass) follows a "Premiered/Aired/Debuted &lt;Month Year&gt; · &lt;Network&gt;" convention.
- evidence: `content/shows/alone-the-skills-challenge/seasons/01-season-1.md:11` `eyebrow: "Season 1 · 2022"` — the season's own `premiere_caption` field two lines below already carries the missing facts: `"History Channel · August 2022"`.
- suggested fix: Rewrite the eyebrow to match the corpus convention using facts already present in the file's own `premiere_caption`, e.g. "Premiered August 2022 · History Channel." Content-only, one field.
- source: browser (critique-pass-167, authed)

### [MED] [authed] /shows/so-you-think-you-can-dance — the show's `blurb` and `tagline` both hinge on the identical "not about celebrities" claim, rendered one directly under the other in the hero

- pass: 167 (commit 73dd0977)
- viewport: desktop
- category: voice
- observation: `blurb` (the short hero subtitle) and `tagline` (the longer meta-column sentence) are meant to serve distinct purposes per the CLAUDE.md field spec, but both fields here lead with the same "dancers/contestants judged on skill, not celebrities" concept plus the same Fox/2005-2024 run-length fact, so the hero reads as one claim stated twice rather than two fields each earning their space.
- evidence: `content/shows/so-you-think-you-can-dance.md` `blurb`: "18 seasons. Dancers, not celebrities, competing on technique alone." vs. `tagline`: "So You Think You Can Dance judged contestants on dance skill alone — open auditions, choreography rounds, a live public vote, no celebrity partners. Fox ran the series for nineteen years, 2005 to 2024, before ending it for good."
- suggested fix: Give `blurb` a distinct hook (e.g. lead with the judges-only-vote overhaul in the final season, or a specific numeric fact) and reserve the "no celebrities, skill-only" format-defining claim for `tagline` alone, so the two fields don't cover the same ground twice in the hero. Content-only, one field.
- source: browser (critique-pass-167, authed)

### [LOW] [anon] /shows/survivor/season/survivor-50 — the FORMAT meta field and the Episode 2 "what to watch for" callout restate the same fan-vote mechanics detail

- pass: 166 (commit 0bfe8ec1)
- viewport: desktop
- category: voice
- observation: The same three-item fan-vote detail (tribe colors, food rations, final stretch/endgame shape) is stated in full twice on the page — once in the FORMAT sidebar field, once in the Episode 2 watch-for callout — with no new information added the second time.
- evidence: FORMAT field: "Fans voted on tribe colors, food rations, and the final stretch." EP2 callout: "Watch for the first on-screen calls of tribe colors, food rations, and endgame shape — mechanics locked in across four separate rounds of voting during the prior season's broadcast..." `content/shows/survivor/seasons/50-survivor-50.md`.
- suggested fix: In the EP2 callout, reference the fan-voted mechanic once by name (e.g. "the fan-voted mechanics from Format") instead of re-listing all three specifics a second time. Content-only, one field.
- source: browser (critique-pass-166, anon)

### [MED] [authed] /shows/traitors-uk/season/series-4 — the "Canon rank, not season order" disambiguation caption never fires for "Series N"-numbered shows, only "Season NN"
- pass: 165 (commit 4d875a01)
- viewport: desktop
- category: comprehension
- observation: `canonOrderCaptionFor()` (`src/app/shows/[show]/season/[slug]/page.tsx:260-268`), added at pass-140 to disambiguate an adjacent-season card whose bare numbered title doesn't match its own canon rank, matches only `/^Season (\d+)$/i`. Traitors UK (and any other "Series N"-numbered international format) never matches that regex, so the identical mismatch — an adjacent link reading "#04 IN CANON → Series 3" — ships with no caption, while the same situation on a "Season N" show (e.g. dragrace-allstars) correctly shows "Canon rank, not season order."
- evidence: traitors-uk desktop+mobile: "← #02 IN CANON / Series 1 (2022) / #04 IN CANON → / Series 3 (2025)" — no caption. dragrace-allstars desktop+mobile, same adjacent-module structure: "← #08 IN CANON / Season 6 / Canon rank, not season order / #10 IN CANON → / Season 3 / Canon rank, not season order" — caption present both times.
- suggested fix: Widen `BARE_SEASON_TITLE_RE` (or add a sibling pattern) to also match `/^Series (\d+)$/i`, reusing the same `canonOrderCaptionFor` numeric-mismatch check. One regex, one file, covers every "Series N" show site-wide (traitors-uk, dragrace-uk, and future additions) the way the pass-140 fix already covers every "Season N" show.
- source: browser (critique-pass-165, authed)

### [LOW] [anon] /shows/dragrace-allstars/season/season-11 — the PREMIERED sidebar field repeats the same month on two consecutive lines
- pass: 165 (commit 4d875a01)
- viewport: desktop
- category: comprehension
- observation: The meta sidebar's PREMIERED stat reads "May 8, 2026" on its value line and "Paramount+ · May 2026" on its caption line directly beneath — the caption restates the same month already given one line above instead of adding a distinct fact, the way broadcast shows use the caption slot for a timeslot detail (e.g. MasterChef's "Fox · Wednesday 8/7c").
- evidence: Rendered sidebar: "PREMIERED / May 8, 2026 / Paramount+ · May 2026."
- suggested fix: For streaming-only shows without a weekly timeslot, drop the redundant month from the caption and use the slot for something distinct (e.g. release cadence, or just the platform name alone). Scoped to `premiere_caption` in `content/shows/dragrace-allstars/seasons/11-season-11.md`, and worth checking whether the pattern recurs on other streaming-only shows.
- source: browser (critique-pass-165, anon)
- investigated: 2026-09-23, cloud march tick. Checked all 11 `dragrace-allstars` season `premiere_caption` fields before editing — every one repeats the premiere month in the "Network · Month Year" caption form (e.g. S1 "Logo TV · February 2012", S10 "Paramount+ · May 2025"). Widened the check catalog-wide: this "Network · Month Year" caption pattern repeating the PREMIERED value's month is the norm across all 938 season files with a `premiere_caption`, not a defect isolated to this show. No edit made — the finding's premise (this caption should instead add a distinct fact, the way broadcast shows' timeslot captions do) doesn't hold for streaming-only shows, which have no timeslot to report; "Network · Month Year" is their entire established caption vocabulary. Leaving open rather than resolved, in case a future tick wants to deliberately redesign the streaming-caption convention catalog-wide — but this is not a one-file fix.

### [LOW] [authed] /shows/alone-australia/season/sapmi-finland — the FORMAT and CAST SIZE detail-card captions restate the identical fact
- pass: 164 (commit badef7cd)
- viewport: desktop
- category: voice
- observation: Two adjacent detail-card captions on the same page state the same fact back to back — that this is a 10-person cast facing Arctic conditions for the first time — reading as filler rather than two distinct pieces of information.
- evidence: `content/shows/alone-australia/seasons/04-sapmi-finland.md` `format_caption`: "10 solo survivalists, the show's first Arctic location." `cast_size_caption`: "Ten survivalists, the first cast to face Arctic conditions."
- suggested fix: Drop the Arctic-conditions clause from one caption. `cast_size_caption` could instead note something cast-specific (e.g. a return-vs-first-timer split, if sourced) rather than re-deriving `format_caption`'s point. Content-only, one field.
- source: browser (critique-pass-164, authed)

### [LOW] [authed] /shows/alone-australia/season/sapmi-finland — the eyebrow's "Aired" doesn't match the PREMIERED field label used elsewhere on the page
- pass: 164 (commit badef7cd)
- viewport: desktop
- category: comprehension
- observation: This season's `eyebrow` frontmatter reads "Aired July 2026," while the PREMIERED detail field lower on the page states the same fact under a different verb. This is a third reproduction of a pattern already tracked twice and still open (project-runway new-york-2026, alone arctic-ii) — confirms the drift isn't isolated to those two shows.
- evidence: Eyebrow: "Aired July 2026 · The show's first Arctic season." Detail card: "PREMIERED / Jul 15, 2026 / SBS · July 2026."
- suggested fix: Standardize on "Premiered" in the `eyebrow` field to match the PREMIERED detail-field label, per the same fix already suggested for the two still-open rows. Given this is now a three-show reproduction, worth adding a lightweight `content-check` invariant (flag any season `eyebrow` starting with "Aired" while the page also renders a PREMIERED field from `premiere_date`) the next time a content tick touches this class, rather than a fourth isolated one-file fix. Content-only, `content/shows/alone-australia/seasons/04-sapmi-finland.md`.
- source: browser (critique-pass-164, authed)
- investigated: 2026-09-23, cloud march tick. Trialed the suggested fix (edited the eyebrow to "Premiered"), then ran a catalog-wide check before committing: `grep -rlE` across `content/shows/*/seasons/*.md` finds 709 season files using "Aired ..." eyebrows vs. 134 using "Premiered ..." — "Aired" is the dominant, not minority, convention. More decisively, every one of this show's own sibling season eyebrows (`content/shows/alone-australia/seasons/01-*.md` through `03-*.md`) already uses "Aired," so applying the suggested fix here would have introduced a fresh within-show inconsistency to fix a cross-show one. Reverted the edit. This finding (and its three siblings below, passes 152/153/162) reads the wrong reference set — jersey-shore/southern-charm are the minority "Premiered" convention, not the catalog norm. No content-check invariant added; the premise doesn't hold. Leaving open rather than marking resolved, in case a future tick wants to formally flip the convention catalog-wide (a much larger, deliberate rename, not a one-file fix) — but the four-way "standardize on Premiered" suggested fix as written should not be applied piecemeal again.

### [MED] [anon] /shows/project-runway/season/new-york-2026 — the "Also appears in" cross-reference module mixes sentence-case and full Title Case theme titles in the same list
- pass: 163 (commit 06edc64d)
- viewport: desktop
- category: voice
- observation: The season page's "Also appears in" module renders four themed-list titles side by side; three follow the site's established sentence-case convention (capitalize only the first word and proper nouns) and one renders in full Title Case, reading as a style break within a single scannable module. Confirmed catalog-wide: 4 of 182 theme titles in `content/themes/*.md` use full Title Case while the other ~178 use sentence-case, and nothing in `src/styles/screens.css` normalizes casing (`.appears-row .name` has no `text-transform`), so the raw frontmatter renders verbatim everywhere the title appears — themes index, the list's own hero, and every "Also appears in" module.
- evidence: Live authed appears-row module on `/shows/project-runway/season/new-york-2026`: "A way back in", "The cast outgrew the format", "Too Few to Call It All-Stars", "When the chairs turned over" — the third breaks sentence-case. Catalog-wide grep confirms the same defect in three more theme titles: `content/themes/every-season-split-the-room-differently.md` (`title: "Every Season Split the Room Differently"`), `content/themes/the-founding-five-kept-getting-replaced.md` (`title: "The Founding Five Kept Getting Replaced"`), `content/themes/the-roster-never-held-still.md` (`title: "The Roster Never Held Still"`). Colon-subtitle titles (e.g. "Love Island US: it took five seasons to find a home") were excluded as legitimate — proper-noun prefix + lowercase continuation already matches convention.
- suggested fix: Content-only — re-case the `title:` frontmatter field in the four listed `content/themes/*.md` files to sentence-case (capitalize only the first word and any proper nouns), matching the other 178 theme titles. No component change needed since rendering is already verbatim from frontmatter.
- source: browser (critique-pass-163, authed)

### [MED] [anon] /themes/the-city-already-had-a-show — two entries missed the round-7 headline-to-body echo drain that just swept the other 16
- pass: 163 (commit 06edc64d)
- viewport: desktop
- category: voice
- observation: The 2026-09-17 "echo drain round 7" (commit dd3704e6) reworded most of this list's entries to remove headline-to-body noun-phrase echoes, but two entries still carry the exact defect class the round targeted. Rank 9 (Love Island US S02) repeats "the same Strip" verbatim between title and blurb. Rank 11 (America's Next Top Model S08 / RHOS Sydney pairing) repeats "the same year" between title and blurb.
- evidence: `content/themes/the-city-already-had-a-show.md` rank 9 — title: "A dating show reroutes its villa to the same Strip a cooking competition used years earlier" / blurb: "...but a rival culinary format had already staked out the same Strip more than a decade before." Rank 11 — title: "Sydney Harbour gets a modeling shoot the same year a share-house crew moves into the same view" / blurb begins "...uses the famous harbor for the show's first Oceania trip in 2007. That same year, an unrelated MTV format ships a whole cast..."
- suggested fix: Apply the same round-7 treatment to ranks 9 and 11 — reword the blurb's echoing noun phrase ("the same Strip" → "the Strip" / "that stretch of the Strip"; "That same year" → a non-echoing temporal marker) so the two remaining entries match the other 16 already swept.
- source: browser (critique-pass-163, anon)

### [LOW] [authed] /shows/project-runway/season/new-york-2026 — the eyebrow's "Aired summer 2026" doesn't match the PREMIERED detail field's "Jul 9, 2026" a few lines down
- pass: 162 (commit b0af7a0d)
- viewport: desktop
- category: comprehension
- observation: A second, independent instance of the still-open pass-152 verb-mismatch finding on `/shows/alone/season/arctic-ii` (that row's suggested fix was scoped to one file). This season's eyebrow uses "Aired" while the detail card a few sections down uses "Premiered" for the identical date fact — reproducing on a different show confirms the underlying convention drift isn't isolated to Alone.
- evidence: Eyebrow: "Aired summer 2026 · Filmed in Manhattan · Freeform's second season". Detail card: "PREMIERED / Jul 9, 2026". Source: `content/shows/project-runway/seasons/22-new-york-2026.md`.
- suggested fix: Standardize on "Premiered" in the `eyebrow` field to match the PREMIERED detail-field label, per the same fix already suggested for the still-open Alone row. Given this is now a two-show reproduction, worth considering a lightweight `content-check` invariant (flag any season eyebrow starting with "Aired" while a `premiere_date` also renders a PREMIERED field) the next time a content tick touches this class, rather than treating each recurrence as an isolated one-file fix. Content-only, `content/shows/project-runway/seasons/22-new-york-2026.md`.
- source: browser (critique-pass-162, authed)
- investigated: 2026-09-23, cloud march tick. Same false-positive class as pass-164's sibling row above: catalog-wide, "Aired" (709 files) outnumbers "Premiered" (134) as the eyebrow convention, and this show's own other Project Runway season eyebrows already use "Aired." Trialed and reverted the "Premiered" edit for the same reason — see pass-164's investigated note for the full catalog check. No content-check invariant added; leaving open rather than resolved.

### [MED] [anon] /shows/alone-australia/season/sapmi-finland, /shows/below-deck-mediterranean/season/dubrovnik-ii — `clipToSeoBudget()` can clip a meta description before any of the lede's actual descriptive content
- pass: 161 (commit cf50047f)
- viewport: desktop
- category: seo
- observation: The shared SEO-snippet clipper in `src/lib/seo.ts` has two edge cases that both land the cut too early on long, punctuation-heavy ledes, reproduced directly on two freshly-filed season pages. (1) Alone Australia S4's lede is "The Australian version goes furthest yet. Ten survivalists self-film in Finland's Sápmi region — Arctic terrain, a different cold-weather skill set, and the biggest environmental leap since the move to Fiordland. The format's boldest location bet to date." The pass-68 em-dash-preference override (added to avoid stopping mid-list) fires here and clips at the em dash — even though a later, more complete comma boundary exists that would keep "Arctic terrain, a different cold-weather skill set" in the snippet. Rendered: "The Australian version goes furthest yet. Ten survivalists self-film in Finland's Sápmi region…" — the entire descriptive payload of the sentence is discarded. (2) Below Deck Mediterranean S11's lede is "...aboard the new M/Y Akira One, with Aesha Scott, Nathan Gallagher, and Joe Bradley anchoring a mostly rebuilt crew..." — no em dash present, so the function just takes the last comma inside the 159-char budget, which happens to land after the first of three listed cast names. Rendered: "...aboard the new M/Y Akira One, with Aesha Scott…" — reads as an arbitrary cutoff mid-enumeration, precisely the "stopping mid-list" failure mode the em-dash override was written to prevent, just via the plain-comma path instead.
- evidence: Reproduced directly with `node -e` against `clipToSeoBudget()`'s current implementation (`src/lib/seo.ts:88-120`) using both ledes verbatim from `content/shows/alone-australia/seasons/04-sapmi-finland.md` and `content/shows/below-deck-mediterranean/seasons/11-dubrovnik-ii.md`; both season pages source their meta/og/twitter description from this exact function via `descriptionFor()` in `src/app/shows/[show]/season/[slug]/page.tsx:151-159` (no `meta_description` override authored on either season, so both fall through to the `clipToSeoBudget(lede)` branch).
- suggested fix: In `clipToSeoBudget`, don't let the em-dash override win when it discards a comma cut that's meaningfully closer to the budget (e.g. only prefer the em dash if the comma cut it's overriding is more than ~20 chars earlier than the em dash itself) — this fixes case (1) without reopening the original pass-68 mid-list problem it was added for. For case (2), add a lightweight enumerated-list detector (e.g. don't accept a comma cut if the text immediately following it, within the next ~15 chars, matches `/^\s*[A-Z][a-z]+.*,.*\band\b/` — a strong "more items and a conjunction follow" signal) so a plain Oxford-comma list doesn't get cut mid-enumeration either. Both fixes are localized to the existing function; add regression tests pinning both ledes verbatim (matching the existing pass-62/67/79 regression-test pattern in `src/lib/__tests__/seo.test.ts`).
- source: browser (critique-pass-161, anon)

### [LOW] [anon] /shows/below-deck-mediterranean — the "best premiere numbers in years / renewed for a twelfth season before the finale even aired" fact for S11 (Dubrovnik II) is restated near-verbatim across three separate surfaces on the site
- pass: 161 (commit cf50047f)
- viewport: desktop
- category: voice
- observation: The same fact, in near-identical phrasing, appears on the show canon page, the season's own page, and a themed-list entry that references the season. Show page: "The premiere drew the franchise's best ratings in years... Bravo renewed the show for a twelfth season before the finale even aired." Season page (`/shows/below-deck-mediterranean/season/dubrovnik-ii`): "posted the franchise's best premiere numbers in years, and Bravo renewed it for a twelfth season before the run even finished." Themed list (`/themes/been-here-before`, entry #06, filed this same week per the ab99ff14 Rule-3 staking tick): "the franchise's best premiere numbers in years, and a season 12 renewal announced before this one even wrapped." A reader who lands on more than one of these — a plausible path given the show page links to both the season and the themed list — reads the same fact restated in barely-varied words each time, the same cross-callout repetition class already drained across dozens of other shows (e.g. issue #-adjacent pass-150/153/160 fixes on Top Chef, Big Brother, Traitors), reaching Below Deck Mediterranean fresh here.
- evidence: Verbatim strings quoted above from `content/shows/below-deck-mediterranean/canon.md`, `content/shows/below-deck-mediterranean/seasons/11-dubrovnik-ii.md`, and `content/themes/been-here-before.md` entry #06.
- suggested fix: Pick one surface as the sole owner of the raw "best premiere numbers in years / renewed before finale aired" fact (following the established precedent — usually the season page's `pull` or lede, since that's the season's own record) and rewrite the other two to argue a different angle using the same underlying fact — e.g. the canon rationale could argue what the early renewal *means* for the season's canon slot (network confidence as a signal), and the themed-list entry could tie the fact back to the list's own thesis (freshly-filed seasons staking early claims) rather than re-deriving the premiere-numbers fact itself. Content-only, up to three files, following the standard voice-repetition fix pattern already applied dozens of times.
- source: browser (critique-pass-161, anon)

### [MED] [anon] /shows/top-chef/season/carolinas — two separate facts (the location clause and Kristen Kish's tenure as host) are each restated near-verbatim across multiple surfaces, including the meta description
- pass: 160 (commit 7eeb9379)
- viewport: desktop
- category: voice
- observation: The meta description is copied verbatim as the opening sentence of the hero lede — a first-time reader scanning from the tab title into the page hits the identical sentence twice. Separately, "Kristen Kish's third season as host" (or a close paraphrase) is restated across five sections of the same page: the lede, the HOST metadata row, THE TAKE, WHERE IT SITS IN THE CANON, and the first WHAT TO WATCH FOR entry. Same repetition class already drained across dozens of other shows (dancing-with-the-stars, shark-tank, the-voice, chopped, married-at-first-sight, and others); not yet reached Top Chef.
- evidence: Meta description: "A Charlotte-centered season with stops in Greenville, Asheville and the U.S. National Whitewater Center." — identical to the hero lede's opening sentence. Host fact: lede "Kristen Kish's third season as host"; HOST row "Kristen Kish's third season as host"; WHERE IT SITS IN THE CANON "Kristen Kish's third season at the host chair"; EP 1 of WHAT TO WATCH FOR "Kristen Kish opening her third season at the host chair."
- suggested fix: Add a `meta_description` override (the field the #801 fix built for exactly this case) that summarizes the season without quoting the lede verbatim. Keep the host-tenure fact once in the HOST metadata row's caption and rewrite THE TAKE / WHERE IT SITS IN THE CANON / the EP 1 watch-for entry to each argue a distinct angle instead of re-stating it. Content-only, `content/shows/top-chef/seasons/23-carolinas.md` (+ `canon.md` Season 23 rationale).
- source: browser (critique-pass-160, anon, via Path A2)

### [MED] [anon] /shows/top-chef — the "Themed lists for Top Chef" section dumps roughly 41 list titles into one flat, ungrouped grid under a single `<h2>`, unlike `/themes` itself which buckets its 182 lists by tone/structure/craft/era
- pass: 160 (commit 7eeb9379)
- viewport: desktop
- category: comprehension
- observation: The show-home cross-reference section renders all of Top Chef's themed-list appearances as one undifferentiated `.lists-grid` of ~41 cards with no sub-grouping, immediately after the tightly curated canon sections above it. `/themes` (the site's own index for the same content) groups its far larger 182-list catalog by tone/structure/craft/era/single-show, so the contrast reads as a step down in curation quality on a show-level page a reader is likely to linger on.
- evidence: `<section class="show-themes"><h2 id="show-themes-top-chef">Themed lists for Top Chef.</h2>...<div class="lists-grid">` with ~41 flat `<a class="list-card">` entries (e.g. "A second life, built into the format," "Before the spinoff had a name," "Running long, running short," "When the vote came back tied") and no category headers between them.
- suggested fix: Group the show-page theme cross-references by the same tone/structure/craft/era taxonomy `/themes` uses, or cap the visible list with a "show more" affordance once it exceeds a threshold. Component-level fix in the show-home theme-card grid template, not per-show content.
- source: browser (critique-pass-160, anon, via Path A2)

### [MED] [anon+authed] /shows/rhobh/season/the-renewal — the season's three headline facts (Bozoma Saint John joining, the Mexico location, the cast's unproven new-era identity) are restated near-verbatim across five surfaces, including the meta description
- pass: 159 (commit aeec2a31)
- viewport: desktop
- category: comprehension
- observation: The meta/og/twitter description is a verbatim, ellipsis-truncated copy of the on-page lede's first two sentences; the same three facts (Saint John's arrival, the Mexico trip as a geographic departure, the cast still settling its identity) then repeat in near-identical phrasing across "The Shape of the Season," "Where It Sits in the Canon," and the FILMED sidebar caption. This season has no `meta_description` frontmatter override set, so it falls through to the raw `lede` path the pass-146/147 systemic fix (#801) built the escape hatch for — same repetition class already drained across dozens of shows; not yet reached this one.
- evidence: Meta description: "Bozoma Saint John arrives as the new-cast era looks to stabilize. The Mexico location marks a geographic departure for the franchise…" — identical to the lede's opening two sentences. Section 02 ("Shape of the Season"): "Bozoma Saint John arrives and adds a distinct energy to a cast still working out its new-era identity. The Mexico trip is a geographic novelty for the franchise." Section 03 ("Where It Sits in the Canon"): "Bozoma Saint John's arrival adds a distinct energy to a cast that is still working out its new-era identity, and the Mexico trip is a genuine geographic novelty for a franchise that has leaned heavily on the same European circuit." FILMED caption: "Beverly Hills · a Mexico departure from the usual European circuit."
- suggested fix: Add a `meta_description` override (the field the #801 fix built for exactly this case) that summarizes the season without quoting the lede verbatim. Rewrite "Where It Sits in the Canon" to argue the canon-slot placement against an adjacent RHOBH season instead of re-deriving the same three facts a third time; let "Shape of the Season" keep ownership of the season-content recap. Content-only, `content/shows/rhobh/seasons/15-the-renewal.md` (+ `canon.md` Season 15 rationale).
- source: browser (critique-pass-159, anon lede/meta/body overlap + authed full confirmation, via Path A2)

### [MED] [anon] /shows/rhoc/season/the-resurfacing — the season's Gretchen-Rossi-return and Katie-Ginella-exit facts are each restated near-verbatim across two to three sections, plus the meta description
- pass: 158 (commit 0de556b9)
- viewport: desktop
- category: voice
- observation: The "Gretchen Rossi returns as a friend of the housewives after twelve years away" fact is stated in near-identical phrasing in the lede, "The shape of the season," and "Where it sits in the canon," with a fourth close echo in the meta description and a fifth partial echo in the eyebrow — the highest placement count for this fact-repetition class found in this show's catalog entry. Separately, "Katie Ginella's run with the show closes out here" appears verbatim, word for word, in both "The shape of the season" and "Where it sits in the canon." Same repetition class already drained across dozens of other shows (dancing-with-the-stars, shark-tank, the-voice, chopped, below-deck-mediterranean, vanderpump-rules, and others); not yet reached this show.
- evidence: Lede: "Gretchen Rossi returns as a friend of the housewives after twelve years away, giving the season its most-asked-for comeback story." Body section 2: "...adds the year's headline draw: Gretchen Rossi returns as a friend of the housewives after twelve years away." Canon.md: "...layers in the year's biggest marketing swing: Gretchen Rossi returns as a friend of the housewives after twelve years away, giving the season a hook..." Both sections also share, verbatim: "Katie Ginella's run with the show closes out here."
- suggested fix: Let the lede own the Gretchen Rossi fact in full; rewrite the markdown body and canon.md's Season 19 rationale to argue a distinct angle (what the friend-of-status limit means for the season's social geometry, or the comparative canon-slot argument) instead of re-stating the same clause. Same treatment for the Katie Ginella fact — state it once (body or canon, not both) and let the other section argue what her exit means for the cast going forward. Content-only, `content/shows/rhoc/seasons/19-the-resurfacing.md` + `content/shows/rhoc/canon.md` Season 19 rationale.
- source: browser (critique-pass-158, anon, via Path A2)

### [MED] [anon] /shows and /themes — both index pages fall back to the site-wide root OG image instead of a page-specific one
- pass: 181 (commit cf805933)
- viewport: desktop
- category: seo
- observation: Detail pages (e.g. `/shows/rhoc/season/the-resurfacing`, `/themes/never-needed-a-villain`) each generate their own `og:image` via a per-route `opengraph-image` route, but the two index/hub pages — `/shows` and `/themes` — both fall through to the site-wide root image, so link previews for either hub page look identical to the homepage's. Severity raised LOW→MED and root cause corrected this pass: `/shows` is **not** missing a dedicated OG image route — `src/app/shows/opengraph-image.tsx` already exists (shipped at the pass-118 "RESOLVED" note below this same finding's prior life, then relocated out of `(default)/` by the pass-141/142 route-group hash fix) and renders correctly when hit directly. The gap is that `src/app/(default)/shows/page.tsx`'s `generateMetadata()` never passes an `image` argument to `buildMetadata()` (confirmed: `grep -n "image:" "src/app/(default)/shows/page.tsx"` returns nothing), so `buildMetadata()`'s unconditional explicit-image fallback (`src/lib/seo.ts:170-172`, `defaultOgImage`) permanently shadows the file-convention route — the same wiring-gap class the pass-69/#448 fix closed for show/season/theme pages, but that fix's scope never included the two index pages. `/themes` (the index, not `/themes/[theme]`) genuinely has no dedicated route at all — confirmed via `find src/app -iname "*opengraph-image*"`, no `src/app/themes/opengraph-image.tsx` exists — so that half of the finding stands as originally filed.
- evidence: `og:image` for `/shows` = `https://tiered.tv/opengraph-image`; `og:image` for `/themes` = `https://tiered.tv/opengraph-image`; `og:image` for `/themes/never-needed-a-villain` = `https://tiered.tv/themes/never-needed-a-villain/opengraph-image`. Live-verified again this pass (pass-181, anon, via Path A2) — unchanged across 23 passes. `src/app/shows/opengraph-image.tsx` exists and renders its own `buildOgImage()` call (eyebrow "tiered.tv · Shows", title "All shows") but is unreachable from the page's `<head>` tags because nothing references it.
- suggested fix: Two separate fixes, one per page. `/shows`: thread `image: '/shows/opengraph-image'` through the `buildMetadata()` call in `src/app/(default)/shows/page.tsx`'s `generateMetadata()`, mirroring the already-shipped pattern in `src/app/shows/[show]/page.tsx:78`. Smallest possible diff — the art already exists, this is pure wiring. `/themes`: still needs a new `opengraph-image.tsx` route under `src/app/themes/` (not `(default)/`, per the pass-141/142 route-group lesson) following the `/shows` route's own `buildOgImage()` pattern, plus the matching `image:` argument threaded through `src/app/(default)/themes/page.tsx`'s `generateMetadata()`. Add a regression test per page pinning `openGraph.images` to the per-route path.
- source: browser (critique-pass-158, anon, via Path A2); re-verified + root-cause-corrected critique-pass-181, anon, via Path A2 (reader sub-agent, cloud)

### [MED] [anon] /shows — the S/A/B tier-section descriptive sentence is marked up as an `<h3>` sibling to every show-name heading in that tier
- pass: 156 (commit ae289b02)
- viewport: desktop
- category: a11y
- observation: Each tier section's descriptive blurb ("The shows where the format invented or perfected itself.") renders as an `<h3 class="tier-name">`, the same heading level used for every individual show name in that tier's grid. A screen-reader user navigating by heading level 3 hits the section blurb as a sibling heading to "Survivor" and "RuPaul's Drag Race," with no structural cue distinguishing "section description" from "grid item."
- evidence: `<h2 class="tier-letter">S</h2><div class="tier-desc"><span class="tier-tag">Format-defining</span><h3 class="tier-name">The shows where the format invented or perfected itself.</h3></div>` followed by sibling-level `<h3>Survivor</h3>`, `<h3>RuPaul's Drag Race</h3>`.
- suggested fix: Demote the tier-description sentence to a non-heading element (e.g. a `<p>` under the `.tier-tag` span) so heading-level navigation distinguishes the section blurb from the show-name grid items it sits beside. Component fix in the `/shows` page template, not per-show content.
- source: browser (critique-pass-156, anon)

### [LOW] [authed] /shows/alone/season/arctic-ii?view=community — the eyebrow's "Aired" doesn't match the PREMIERED field label used elsewhere on the page
- pass: 152 (commit 9b014bce)
- viewport: desktop
- category: comprehension
- observation: This season's `eyebrow` frontmatter reads "Aired summer 2025," while the PREMIERED detail field lower on the page (and every other sampled season page's eyebrow, including jersey-shore and southern-charm) uses "Premiered." A reader scanning the top of the page and the detail card gets two different verbs for the same fact.
- evidence: `eyebrow`: "Aired summer 2025 · Second Arctic run, Canadian subarctic" vs. jersey-shore's `eyebrow`: "Premiered October 2012 · MTV" and southern-charm's `eyebrow`: "Premiered November 2025 · Bravo".
- suggested fix: Standardize on "Premiered" in the `eyebrow` field to match the PREMIERED detail-field label and the convention used on other season pages. Scoped to `content/shows/alone/seasons/12-arctic-ii.md`.
- source: browser (critique-pass-152, authed)
- investigated: 2026-09-23, cloud march tick. Same false-positive class — this is the original report in the pass-152/153/162/164 cluster. Catalog-wide, "Aired" eyebrows (709 files) outnumber "Premiered" (134); the finding's own comparison set (jersey-shore, southern-charm) is the minority convention, not the norm it's checked against. Every other Alone season eyebrow already uses "Aired." Trialed and reverted the "Premiered" edit. No content-check invariant added; leaving open rather than resolved.

### [LOW] [anon] /shows/traitors-uk/season/series-4 — breadcrumb labels the season "SEASON 4" while the rest of the page correctly uses the show's own "Series" vocabulary
- pass: 148 (commit 9ea56bcd)
- viewport: desktop
- category: navigation
- observation: The breadcrumb trail is the one place on the page that doesn't use the UK-format-correct noun.
- evidence: Breadcrumb: "SHOWS / THE TRAITORS (UK) / SEASON 4". Page H1: "Series 4 (2026)". Adjacent-canon links: "Series 1 (2022)", "Series 3 (2025)".
- suggested fix: Render the breadcrumb's season crumb using the show's own season-noun (e.g. "Series" for UK-format shows) instead of a hardcoded "Season" label.
- source: browser (critique-pass-148, anon)

### [LOW] [authed] /shows/traitors-uk/season/series-4?view=community — PREMIERED date (Jan 1, 2026) reads as a placeholder rather than a real UK broadcast date
- pass: 148 (commit 9ea56bcd)
- viewport: desktop
- category: comprehension
- observation: January 1 is an unlikely actual air date for a winter BBC series and undermines confidence in the surrounding factual copy if it's a stand-in rather than the confirmed date. The frontmatter (`content/shows/traitors-uk/seasons/04-series-4.md`) carries `premiere_date: 2026-01-01` literally, so this may be a real data gap rather than a display bug.
- evidence: "PREMIERED / Jan 1, 2026 / BBC One · launched January 2026"
- suggested fix: Confirm the real UK premiere date for Series 4 and backfill it; if genuinely unconfirmed at time of writing, show month-only precision instead of a specific day so the UI doesn't imply false precision.
- source: browser (critique-pass-148, authed)
- investigated (2026-09-19, cloud march tick): scout-verified against three independent sources (Deadline's Dec 2025 BBC premiere-date announcement, Heart, and Wikipedia citing the BBC) — The Traitors UK Series 4 genuinely premiered 1 January 2026 on BBC One. The frontmatter's `premiere_date: 2026-01-01` is factually correct, not a placeholder; it just happens to land on New Year's Day. No content change made — the finding's premise (that the date looks unconfirmed) doesn't hold once checked against real sourcing.

### [LOW] [authed] /shows/dragrace/season/season-18?view=community — the HOST stat caption partially restates the host's name before adding its one new fact
- pass: 146 (commit bbc5263b)
- viewport: desktop
- category: comprehension
- observation: The HOST stat shows "RuPaul Charles" as the primary value, then "RuPaul, with Michelle Visage" as the caption — the caption re-says "RuPaul" before adding the actually-new fact (Michelle Visage). Milder than the queer-eye FILMED echo filed this same pass, but the same underlying pattern of captions partially restating the value above them.
- evidence: "HOST\nRuPaul Charles\nRuPaul, with Michelle Visage"
- suggested fix: Trim `host_caption` in `content/shows/dragrace/seasons/18-season-18.md` to the new information only — "with Michelle Visage" — rather than repeating "RuPaul". Content-only, one field.
- source: browser (critique-pass-146, authed)
- investigated (2026-09-18, cloud march tick): checked catalog-wide before applying the suggested one-file fix — `"RuPaul, with Michelle Visage"` (or a close variant: "with the Visage panel", "with the Visage panel set") is the standing `host_caption` convention across at least 8 other dragrace season files (S8, S10-S17), not an isolated S18 defect. Trimming just S18 would create a fresh inconsistency with its own show's established pattern rather than fix one. Left open rather than one-off patched; a real fix would need to re-voice the convention show-wide, which is a larger, separately-scoped edit than this finding's "one field" framing assumed.
- resolved (2026-10-05, cloud march tick, content-gap redirect): re-voiced `host_caption` show-wide across all 15 affected dragrace season files (01, 02, 03, 04, 07, 08, 10-18), not just S18 — dropped the "RuPaul, " restatement prefix in every case so each caption leads with its actual new fact instead of re-naming the host already shown in the HOST stat's primary value (e.g. S18: "RuPaul, with Michelle Visage" → "Michelle Visage anchors the panel"; S1: "RuPaul, season one at the table" → "Season one at the table"). Picked up via the standing dispatch-starvation workaround: Rule 2 (season-fill) fully starred in `plan/CADENCE.md` this tick, Rule 3 (themed lists) saturated per `plan/LISTS.md`'s same-day zero-ship log. `content:check` clean (68 shows/1058 seasons/68 canons/182 themes/3 legal docs); verify gate green (199 test files/3700 unit tests, build 1525 pages, 4984 e2e in 26.1m). Closes this finding.

### [MED] [anon] /shows — the S/A/B tier-section headings render as bare single-letter `<h2>` elements with no accessible label
- pass: 145 (commit 36ad3e30)
- viewport: desktop
- category: a11y
- observation: Each tier section on `/shows` renders `<h2 class="tier-letter">S</h2>` (and `A`, `B`) beside an `aria-hidden` glyph and a sighted-only descriptive tag/sentence. A screen-reader user scanning the page's heading list — a standard assistive-tech navigation pattern — hears only "heading level 2, S" / "heading level 2, A" / "heading level 2, B" with no indication these mark tier sections, let alone what each tier means.
- evidence: Raw HTML from the live page: `<div class="tier-glyph s" aria-hidden="true">...</div><div class="tier-letter-row"><h2 class="tier-letter">S</h2><div class="tier-desc">...</div></div>` — no `aria-label` on the `h2` or its containing row. Source: `src/components/shows/TierHead.tsx:18`.
- suggested fix: Add an `aria-label` to each tier `h2` (e.g. `aria-label="S tier — format-defining"`) sourced from the existing tier-desc copy, so the accessible name matches what a sighted reader infers from context.
- source: browser (critique-pass-145, anon)

### [LOW] [anon] /shows/love-is-blind?view=canon — the mid-pack ("A" tier) canon section header says "worth watching again next week" though the shelf is static, not weekly-rotating
- pass: 145 (commit 36ad3e30)
- viewport: desktop
- category: comprehension
- observation: The A-tier canon section header reads "The seasons worth watching again next week." — but this shelf is the static rank-6-through-10 list, not a rotating or time-gated section. Only the community vote/rank-shift indicators elsewhere on the page carry a genuine weekly cadence. The "next week" clause reads as copy carried over from vote-cadence language into a section where it isn't literally true.
- evidence: Hardcoded per-tier copy map in `src/components/canon/CanonTierBand.tsx:23` (`A: 'The seasons worth watching again next week.'`), confirmed live on `/shows/love-is-blind?view=canon` beside the static Houston/Minneapolis/Charlotte/Dallas/Denver rank-6-10 entries.
- suggested fix: Drop "next week" from the A-tier header copy (e.g. "The seasons worth watching again.") and reserve weekly-cadence language for the vote/rank-shift copy where it's accurate.
- source: browser (critique-pass-145, anon)

### [LOW] [anon] /themes — the index renders all 181 themed lists' full names, entry counts, and descriptions unpaginated on a single page load, with no lazy-load or virtualization past the three featured lists
- pass: 144 (commit bedc7788)
- viewport: desktop and mobile
- category: performance
- observation: The `/themes` index ships every one of its 181 lists' full one-to-two sentence descriptions inline on first paint, across the "BY TONE / BY STRUCTURE / BY CRAFT / BY ERA / SINGLE-SHOW" categories below the three featured tiles, rather than lazy-loading past the fold or paginating/virtualizing the by-tag sections. The page's own copy states "SHOWING · ALL 181 IN THE INDEX," confirming this is the full catalog rendered at once, not a preview.
- evidence: Rendered body text length for `/themes` measured 57420 chars (desktop) / 57418 chars (mobile) — 10-20x every other page walked this pass (3000-6000 chars). No mechanical error (200 status, no console errors, no overflow), purely a payload-size/perceived-performance concern as the list catalog keeps growing (181 lists now vs. 9 at the pass-93 baseline referenced elsewhere in this file).
- suggested fix: Paginate or virtualize the by-tag category sections below the three featured lists (e.g. show the first N per category with a "show more" affordance), or lazy-load each category's full list on tab/expand click instead of shipping all 181 descriptions in the initial HTML payload.
- source: browser (critique-pass-144, anon)

### [MED] [authed] /shows/naked-and-afraid/season/the-active-season — the 21-day paired-survival format fact repeats near-verbatim across two sections, the same repetition class recurring on a third new show this pass
- pass: 153 (commit dedb99b7)
- viewport: desktop
- category: comprehension
- observation: Same defect class as the two findings above, on a show not yet touched by the ongoing repetition drain — three independent instances surfacing in a single critique pass suggests the pattern is systemic to the season-page "shape of the season" / "where it sits in the canon" template pairing, not isolated per-show content bugs.
- evidence: Section 02: "The 21-day paired-survival premise runs here as it has since 2013 — two strangers, remote wilderness, nothing provided ... For now, it sits here honestly." Section 03: "The 21-day paired-survival format runs here as it has across nineteen seasons — two strangers, remote wilderness, nothing provided ... For now, it holds this slot honestly."
- suggested fix: Rewrite "Where It Sits in the Canon" to argue the slot comparatively against a neighboring season instead of re-deriving the format premise already stated in "Shape of the Season." Content-only, `content/shows/naked-and-afraid/canon.md`. Given three fresh instances this pass alone, the standing season-fill drain row in `plan/AUDIT.md` may want to widen its scope to a template-level content-check invariant rather than continuing to patch discovered instances one at a time.
- source: browser (critique-pass-153, authed)
- resolved (2026-09-23, commit 274e06cc): rewrote the rank-19 rationale in `content/shows/naked-and-afraid/canon.md` to argue the slot comparatively against Season 18 (shared open question of format fatigue, incomplete record vs. a closed and settling one) instead of re-deriving the paired-survival premise the season file already owns. 113 words, within the 80-120 word canon-rationale band.

### [MED] [authed] /shows/big-brother/season/a-summer-of-mystery?view=community — "THE TAKE" opens on a comparison that isn't explained until three sections later
- pass: 153 (commit dedb99b7)
- viewport: desktop
- category: comprehension
- observation: The page's opening thesis references a season the reader hasn't been introduced to yet, so a first-time reader hits an unexplained claim at the very top of the page; the comparison only resolves once they reach the canon-placement section.
- evidence: Section 01 ("The Take"): "Human-run beats system-run." — this only resolves at Section 03: "...just above Houseguests vs. the AI, which hands its twist authority to a system rather than a room."
- suggested fix: Either name "Houseguests vs. the AI" in the take headline itself, or rewrite the headline so it's self-contained without requiring the canon-slot paragraph to decode it. Content-only, `content/shows/big-brother/seasons/27-a-summer-of-mystery.md`.
- source: browser (critique-pass-153, authed)
- resolved (2026-09-30, cloud march tick, content-gap redirect — standing season-fill row stalled, `plan/CADENCE.md` gap table 37/37 starred confirmed-but-unaired except `the-voice` (blocked behind #762); Rule 3 already zero-shipped twice today per `plan/LISTS.md`'s 2026-09-30 note; full programmatic parse of this file's Pending section found 36 open findings, this was the oldest one that was genuinely content-only rather than a component/template fix). Rewrote `take_h2` from "Human-run beats system-run." to "Three twists, still house-run." — states the season's own quality (Block Buster, Mastermind, and the Week 9 vote swap all stay houseguest-administered) without requiring the reader to already know about the neighboring "Houseguests vs. the AI" season the canon-slot paragraph compares it to. Grounded in the season's own `lede` (which already lists the three twists) and `canon.md`'s slot_argument ("all three stay houseguest-run rather than system-run"). Shipped at `content/shows/big-brother/seasons/27-a-summer-of-mystery.md`.

### [LOW] [anon] /shows/traitors/season/ardross-2026 — the eyebrow's "Aired" doesn't match the PREMIERED field label used elsewhere on the page
- pass: 153 (commit dedb99b7)
- viewport: mobile
- category: comprehension
- observation: Same terminology-drift class already fixed on `alone`'s Arctic-run season — a new instance on a different show. The eyebrow reads "Aired winter 2026" while the PREMIERED detail field lower on the page states the same fact with a different verb.
- evidence: Eyebrow: "AIRED WINTER 2026 · THE NEWEST ENTRY, THE FORMAT RUNNING SMOOTHLY" vs. metadata field: "PREMIERED / Jan 8, 2026" on the same rendered page.
- suggested fix: Standardize on "Premiered" in the `eyebrow` frontmatter field to match the PREMIERED detail-field label and the convention used elsewhere in the catalog. Content-only, `content/shows/traitors/seasons/04-ardross-2026.md`.
- source: browser (critique-pass-153, anon)
- investigated: 2026-09-23, cloud march tick. Same false-positive class as the rest of this cluster (passes 152/162/164): "elsewhere in the catalog" is asserted but not true — 709 season files use "Aired" vs. 134 "Premiered," and every other Traitors season eyebrow already uses "Aired." Trialed and reverted the "Premiered" edit. No content-check invariant added; leaving open rather than resolved.

### [HIGH] [anon+authed] /shows/below-deck-down-under/season/canouan — the same two headline facts are restated near-verbatim four times across the meta description, hero lede, "the take" capsule, and the body's section-02 opener
- pass: 192 (cloud march)
- viewport: desktop
- category: voice
- observation: Two facts — the franchise's move into the Caribbean (anchoring Katina off Canouan) and the pairing of a veteran crew with a franchise-first celebrity-charter crossover — are stated in near-identical phrasing four separate times on one page: the meta description, the hero lede, the condensed "the take" capsule, and the opening sentence of body section 02 ("The shape of the season"). A reader hits the same claim four times before reaching the canon-ranking section, reading as templated/unedited prose rather than the "plain sentences over clever ones" house voice.
- evidence: Lede: "Season four moved the franchise into the Caribbean, anchoring Katina off Canouan and pairing Captain Jason Chambers with a veteran crew carrying decades of Below Deck experience, plus a franchise-first charter crossover with a full reality cast aboard as guests." "The take" capsule: "A veteran deck, a Caribbean backdrop, and a charter crossover the franchise had never tried before — the format's highest-pressure test yet." Section 02 opener: "Below Deck Down Under's fourth season moved the franchise into the Caribbean, anchoring Katina off Canouan for a second run after its Seychelles introduction. Captain Jason Chambers led a veteran crew ... carrying decades of Below Deck experience. A franchise-first charter crossover brought the full cast of The Real Housewives of Salt Lake City aboard as guests..." The meta description truncates to the same opening sentence as the lede. Independently confirmed on both the anon and authed pass-192 walks.
- suggested fix: Let section 02 lead with new information (crew names, episode-count framing, or a production detail not yet stated) and keep the Caribbean/crossover framing owned by the lede alone; trim "the take" capsule to a single new angle instead of re-summarizing both facts a third time. Content-only, `content/shows/below-deck-down-under/seasons/04-canouan.md`. Spoiler discipline P0 intact (format/production facts only).
- source: browser (critique-pass-192, anon + authed)

### [MED] [anon+authed] /shows/below-deck-down-under/season/canouan, /shows/below-deck-down-under — the Season 4 Editor's Canon rationale is restated across its own blurb/"why this slot" callout, then copy-pasted verbatim onto the show page's canon card
- pass: 192 (cloud march)
- viewport: desktop
- category: comprehension
- observation: The Season 4 canon entry's core justification (a veteran crew's accumulated experience, plus a structural-first charter crossover) is stated three times within the season page alone (short blurb, "why this slot" callout, and the "where it sits in the canon" rationale paragraph), and then that same rationale paragraph is reused character-for-character on the show page's Editor's Canon card for the same season — so a reader who clicks from the show page into the season page reads the identical paragraph twice with zero new information added.
- evidence: Season-page blurb: "The Caribbean run — veteran crew, a franchise-first charter crossover, the branch's tensest season yet." "Why this slot": "Season four earns the top slot on crew register — decades of combined Below Deck experience joining Captain Jason's deck — and a genuine structural first, a full celebrity charter crossover." Season-page "where it sits in the canon" / show-page canon card (identical on both): "Set against the other three, the case for the top slot is about maturity, not ambition alone. The Whitsundays earned the runner-up spot on origin friction, but a debut cast still finding the format can't out-argue a deck that already knows itself. ... Canouan inherits that scale without the turnover — the chemistry is settled, not settling — and adds a structural first none of the other three have. That combination is why it tops the list."
- suggested fix: Give the show-page canon card its own shorter summary (a sentence or two distinct from the season page's reasoning) and reserve the full "where it sits in the canon" paragraph for the season page only — same fix shape as the recently-resolved below-deck/phuket canon-rationale-density defect, applied here to a different show. Content-only, `content/shows/below-deck-down-under/canon.md`. Spoiler discipline P0 intact.
- source: browser (critique-pass-192, anon + authed)

### [LOW] [authed] /shows/below-deck-down-under — the editorial "How I weigh it" panel drops the host's surname where every other mention on the page uses the full name
- pass: 192 (cloud march)
- viewport: desktop
- category: voice
- observation: The "How I weigh it" panel refers to the host as "Captain Jason," while the "Who ranks it" panel and the hero tagline on the same page both use the full "Captain Jason Chambers" — an inconsistent naming convention within one page.
- evidence: "How I weigh it" panel: "...then how sharply Captain Jason's command had to work in each new context." "Who ranks it" panel (same page): "Captain Jason Chambers a constant throughout." Hero tagline: "Captain Jason Chambers, Australian waters..."
- suggested fix: Use the full name "Captain Jason Chambers" consistently across the WHO/HOW/WHEN editorial panels. Content-only, `content/shows/below-deck-down-under/canon.md`.
- source: browser (critique-pass-192, authed)

## Done
- [x] [HIGH] [anon+authed] /shows/traitors/season/new-blood, /shows/dancing-with-the-stars/season/fall-2026, /shows/big-brother/season/time-trip, /shows/below-deck-down-under/season/canouan — stat-tile captions bare-restate the value shown directly above (pass: 183 (commit 990f72cb); reconfirmed + extended pass 184 (commit 0a312b4a); reconfirmed + extended pass 192 (cloud march)) — RESOLVED (2026-10-25, cloud march tick, content-gap redirect — Rule 2 non-actionable, `plan/CADENCE.md` gap table unchanged at 35 shows/37 gap-slots all starred confirmed-but-unaired per the 2026-10-19 sweep, next sweep not due until 2026-10-26; Rule 3 research exhaustively chased to dead ends across the 2026-10-20 through 2026-10-24 ticks per `plan/LISTS.md`'s Notes log, so this tick picked the sole pending HIGH critique finding instead of repeating a dead-end brainstorm): trimmed all four flagged `host_caption` fields to drop the restated host name/value — `content/shows/traitors/seasons/05-new-blood.md` ("Alan Cumming's fifth season at the castle" → "Fifth season at the castle"), `content/shows/dancing-with-the-stars/seasons/35-fall-2026.md` ("Fourth season with Julianne Hough and Alfonso Ribeiro as co-hosts" → "Fourth season as co-hosts"), `content/shows/big-brother/seasons/28-time-trip.md` ("Julie Chen Moonves, {seasonOrdinalWord} summer at the helm" → "{seasonOrdinalWord} summer at the helm"), `content/shows/below-deck-down-under/seasons/04-canouan.md` ("{seasonOrdinalWord} season with Captain Jason Chambers at the helm" → "{seasonOrdinalWord} season at the helm"). Also removed below-deck-down-under's `format_caption` field entirely ("Charter superyacht, Caribbean waters"), since it bare-restated the FORMAT tile's `format_summary` ("Superyacht · Canouan, Caribbean") with no new fact to anchor a trimmed replacement on — the field is optional in `src/content/schemas.ts`, so omitting it is valid. Left `premiere_caption` untouched on all four files: the "NETWORK · Month Year" shape the finding flagged is the catalog-wide convention used across ~1,500 other season files (confirmed via schema + spot checks), not a genuine per-page defect, so touching it here would be inconsistent with the rest of the catalog rather than a fix. Did not add the suggested new `content-check.ts` lint invariant generalizing the `episodes_caption`/`cast_size_caption` bare-restatement guards to `host_caption`/`format_caption`/premiere fields — that's engineering scope requiring careful false-positive tuning against the universal `premiere_caption` convention, out of scope for a content-only redirect tick; left as a standing suggestion for a future engineering phase. Delegated to no sub-agent (direct edits, four small frontmatter-field trims). Spoiler discipline P0 intact — no outcome/elimination facts touched. No GitHub issue was mirrored for this finding (browser-critique-sourced), so no Closes clause applies.
- [x] [MED] [authed] /shows/below-deck/season/phuket — the pass-188 fix's replacement canon-comparison sentence is a single dense, multi-clause construction that also assumes the reader has already visited the Antigua season page (pass: 190 (commit faceb537)) — RESOLVED (2026-10-25, cloud march tick, content-gap redirect — Rule 2 non-actionable, `plan/CADENCE.md` gap table unchanged at 35 shows/37 gap-slots all starred confirmed-but-unaired per the 2026-10-19 sweep, next sweep not due until 2026-10-26; Rule 3 research exhaustively chased to dead ends across the 2026-10-20 through 2026-10-24 ticks per `plan/LISTS.md`'s Notes log, so this tick picked the top-scoring pending MED critique finding instead of repeating a dead-end brainstorm): split `content/shows/below-deck/canon.md`'s Season 13 (Phuket) rationale's dense opening sentence into two independently-parseable sentences — one argues the Phuket-vs-Antigua comparison, one argues the Phuket-vs-BVI comparison. Made the Antigua reference self-contained by stating what Antigua's own entry argues ("reliability over novelty, disclaiming any visual distinction") instead of only gesturing at a claim the reader would need to have already read on a different page. Closing three sentences (both seasons already delivering on what makes each work, Phuket as a location-pedigree bet, "provisional by design") kept in substance with only connective-tissue adjustments. Final paragraph: 117 words, within the 80-120 `rationaleBody` budget. `tag`/`slot_argument`/`community_rank_hint` lines and every other entry in the file left untouched. Delegated to `content-curator`. Spoiler discipline P0 intact — Season 13 is still unaired, premise/format/location facts only, no outcomes. No GitHub issue was mirrored for this finding (browser-critique-sourced), so no Closes clause applies.
- [x] [HIGH] [anon+authed] /shows/bachelor-in-paradise/season/costa-rica — the season's handful of facts (Costa Rica relocation, Golden Bachelor/ette cast expansion, Hannah Brown joining Wells Adams, the new rose-vote mechanic) restate verbatim or near-verbatim across the lede, the body, and three of the four standard editorial sections (pass: 191 (commit 37660861)) — RESOLVED (2026-10-24, cloud march tick, content-gap redirect — Rule 2 non-actionable, `plan/CADENCE.md` gap table unchanged at 35 shows/37 gap-slots all starred confirmed-but-unaired per the 2026-10-19 sweep; Rule 3 research exhaustively chased per `plan/LISTS.md`'s Notes log on recent ticks, so this tick picked the sole pending HIGH critique finding instead of repeating a dead-end brainstorm): left `lede` and `pull` untouched as the sole owners of the four headline facts (relocation, Golden-spinoff cast, two-bartender arrangement, new vote mechanic) per the suggested fix. Rewrote the markdown body ("THE SHAPE OF THE SEASON") in `content/shows/bachelor-in-paradise/seasons/10-costa-rica.md` to argue pacing instead of re-listing the facts — the season spaces its changes out rather than front-loading them, with the second bartender landing midseason and the vote mechanic landing in the back half, verified against the file's own `watch_list` timing labels. Rewrote the Season 10 rationale paragraph in `content/shows/bachelor-in-paradise/canon.md` (the prose below the `tag`/`slot_argument`/`community_rank_hint` lines, which were left untouched) to argue the comparative rank-4 slot on a breadth-vs-depth criterion against its rank-3 (Season 6, same-sex rose-ceremony accommodation) and rank-5 (Season 5, international crossover) neighbors, naming the four changes only by short label rather than re-explaining each — 118 words, within the 80-120 band. `watch_list` left untouched (not in scope of this tick's fix; a follow-up sweep could still tighten bullets 1-4). Delegated both rewrites to `content-curator`; no new plot facts introduced, spoiler discipline P0 intact (format/structure facts only, no outcomes). Bundled the pass-191 LOW filming-caption fix (see row below) in the same commit since it touched the same file. No GitHub issue was mirrored for this finding (browser-critique-sourced), so no Closes clause applies.
- [x] [LOW] [anon] /shows/bachelor-in-paradise/season/costa-rica — the FILMED stat caption duplicates its own stat value (pass: 191 (commit 37660861)) — RESOLVED (2026-10-24, cloud march tick, bundled with the HIGH restatement fix above since both touch the same file): `filming_caption` in `content/shows/bachelor-in-paradise/seasons/10-costa-rica.md` changed from `"Costa Rica · first BiP season filmed outside Mexico"` to `"First BiP season filmed outside Mexico"`, dropping the leading place-name that collided with the `location` stat ("Costa Rica") rendered directly above it. Took the suggested fix's second option (drop the repeated prefix) rather than inventing a more specific in-country location name that couldn't be verified. `location` field itself left untouched.
- [x] [MED] [anon] /themes/thirteen-was-the-promise-not-the-rule — entry #10's closing sentence is grammatically broken, missing the em-dash construction the rest of the list relies on (pass: 188 (commit 80a52e1c)) — RESOLVED (2026-10-23, cloud march tick, content-gap redirect — Rule 3 reconfirmed zero-ship a fifth consecutive time per `plan/LISTS.md`'s Notes log, same ground the immediately-prior same-day tick had already exhausted, so this tick picked the sole scoped MED critique finding instead of a repeat brainstorm pass): rewrote entry #10 (Chopped Season 1)'s blurb in `content/themes/thirteen-was-the-promise-not-the-rule.md` — "The format Food Network barely touched since started here, at exactly thirteen." became "The format — which Food Network has barely touched since — started here, at exactly thirteen." — exactly the suggested fix, restoring the em-dash construction the rest of the list's entries rely on. Real content change, so `last_revised` bumped 2026-07-29 → 2026-10-23; ledger row in `plan/LISTS.md` updated to match with a resolution note. No other field touched. No GitHub issue was mirrored for this finding (browser-critique-sourced), so no Closes clause applies.
- [x] [HIGH] [anon+authed] /shows/bachelor/season/grant-ellis — canon.md's rationale paragraph restates the casting-precedent facts the fa5bb4ef fix never touched, a sixth near-verbatim site on the page (pass: 189 (commit fa5bb4ef)) — RESOLVED (2026-10-23, cloud march tick, content-gap redirect — Rule 3 reconfirmed zero-ship across three consecutive ticks per `plan/LISTS.md`'s Notes log, so this tick picked the sole pending HIGH critique finding instead of a fourth same-angle research pass): rewrote `content/shows/bachelor/canon.md`'s Season 29 rationale paragraph to argue only the comparative canon-slot reasoning against its neighbors (Joey Graziadei's cast-first case one slot up, Juan Pablo Galavis's single-first case one slot down) without re-deriving the "second Black Bachelor" / "same-year turnaround" facts THE SHAPE OF THE SEASON already owns. `tag`, `slot_argument`, and `community_rank_hint` left untouched; `content/shows/bachelor/seasons/29-grant-ellis.md` left untouched (still the sole owner of both facts). Delegated the rewrite to `content-curator`, caught and corrected a word-count overshoot (121 words, over the 80-120 cap) before shipping — trimmed to 116 words. Full verify gate green: fast gate (typecheck/lint/unit tests/`test:scripts` 146/146/`content:check` ok — 68 shows, 1061 seasons, 68 canons, 182 themes, 3 legal docs), build clean (1528/1528 static pages), e2e 4993/4993 passed (32.2m). No GitHub issue was mirrored for this finding (browser-critique-sourced, never opened as a discrete issue), so no Closes clause applies.
- [x] [HIGH] [anon] /shows/rhony/season/the-legacy-return — self-contradicting "eight seasons" vs. "eight years" for Carole Radziwill's absence, rendered on the same page (pass: 177 (commit 85ef95ec)) — RESOLVED (2026-10-01, cloud march tick, content-gap redirect — standing season-fill row stalled, `plan/CADENCE.md` gap table 37/37 starred confirmed-but-unaired except `the-voice` (blocked behind #762); Rule 3 already shipped two extends today per `plan/AUDIT.md` row 31's progress log (`the-cast-outgrew-the-format`, `best-comeback-seasons`)): standardized on "eight years away" across all three affected files: `content/shows/rhony/seasons/16-the-legacy-return.md` (body + `watch_list`), `content/shows/rhony/canon.md` (`slot_argument`), and `content/themes/best-comeback-seasons.md` (rank-13 entry blurb) — matching the math (season ten to season sixteen is a five-season/eight-year gap) and the framing `canon.md`'s own body prose already used correctly. **Ledger-hygiene note (2026-10-20, cloud march tick):** this row sat under `## Pending` for 19 days after its own `- resolved` note despite the fix being live — a 39-row cleanup sweep the same day (commit `0fd18e48`) missed it, and the very next tick (`eb07c9d1`) surfaced but deliberately deferred it ("one fix per tick"). Re-verified the claimed fix is still live and complete before moving this row: `content/shows/rhony/seasons/16-the-legacy-return.md` reads "eight years away" (body, line 30) and "an eight-year gap" (`watch_list`, line 23); `content/shows/rhony/canon.md` reads "eight years away" at both `slot_argument` (line 141) and body prose (line 144), no longer self-contradicting; `content/themes/best-comeback-seasons.md` rank-13 reads "eight years away" (line 94). Zero "eight season" phrasing remains anywhere in the four files. No content changed this tick — row moved Pending → Done only.
- [x] [HIGH] [anon+authed] /shows/bachelor/season/grant-ellis — the season's two headline facts ("second Black Bachelor" and "fastest turnaround") are each restated 3-5 times across nearly every section on the page (pass: 187 (commit c8fc6b43)) — RESOLVED (2026-10-20, cloud march tick, content-gap redirect — standing season-fill row stalled, `plan/CADENCE.md` gap table 35 shows/37 gap-slots all confirmed-but-unaired, Rule 3 reconfirmed zero-ship earlier the same day): left the eyebrow, lede, pull, THE TAKE, and THE SHAPE OF THE SEASON body as the sole owners of the "second Black Bachelor" and "fastest turnaround" facts — all five untouched per the suggested fix. Rewrote the four other flagged placements to each argue a distinct angle instead of re-deriving the casting-precedent facts: `format_caption` now states the trip's domestic-vs-international stop count ("one domestic stop, three international legs") instead of restating the turnaround; `cast_size_caption` now states where the dates are staged ("Twenty-five women, with most dates staged overseas.") instead of restating the casting precedent; the Ep 1 `watch_list` entry now describes the premiere's full-field domestic opener instead of restating the second-precedent fact; the Ep 2 `watch_list` entry now describes the pacing consequence of a large field with no filler stretch, written to avoid a near-verbatim collision with the lede's own "nine episodes, the shortest run in years" clause (caught and corrected mid-fix). `episodes_caption` and `filming_caption` left untouched — not among the four to six fields the suggested fix scoped. Delegated the rewrite to `content-curator`; spoiler discipline P0 intact (casting/format/travel facts only, no outcome exposure). Issue mirror failed (`loop-issue.mjs`: `GH_REPO missing`) — issue: [mirror-failed: 2026-10-20T21:02:13Z]. Full verify gate green (fast gate 199/199 test files, content:check ok — 68 shows/1061 seasons/68 canons/182 themes/3 legal docs; build clean, 1528 static pages; e2e 4993/4993 passed, 33.6m).
- [x] [HIGH] [anon+authed] /shows/below-deck/season/phuket — the "third season" / Thailand-return continuity facts are restated across nearly every section on the page, including a verbatim meta-description/lede duplicate (pass: 188 (commit 80a52e1c)) — RESOLVED (2026-10-20, cloud march tick, content-gap redirect: Rule 2 fully stalled at gap-zero-with-stars per the latest weekly sweep, Rule 3 saturated/zero-ship confirmed three times the same day, so this tick picked the highest-scoring Pending HIGH critique finding instead): `content/shows/below-deck/seasons/13-phuket.md` gained a standalone `meta_description` distinct from the lede; `lede`, `pull`, and `filming_caption` each dropped the "third season"/bare-location restatement and now argue a distinct angle (crew composition, crew-turnover-as-real-variable, "franchise's first return to Phuket since 2019" leading the FILMED caption); the markdown body now leads with the named-crew-vs-new-crew fact instead of re-stating captain tenure. `host_caption` left untouched as the sole surviving "third season" fact on the page. `content/shows/below-deck/canon.md`'s Season 13 rationale rewritten to argue the canon-slot comparison directly against its rank-7 (BVI) and rank-9 (Antigua) neighbors, verified against both neighboring entries' actual stated facts (caught and corrected one curator-introduced factual contradiction about BVI's visual material before shipping), within the 80-120 word canon-rationale budget (105 words). Delegated both file rewrites to `content-curator`; spoiler discipline P0 intact (Season 13 is still airing, premise/format/crew facts only, no outcomes). Mirrored to issue #824 before the fix. Full verify gate green (fast gate: typecheck/lint/unit tests/content:check ok — 68 shows/1061 seasons/68 canons/182 themes; build clean, 1528 static pages; e2e 4993/4993 passed, 20.7m). Closes #824.
- [x] [MED] [anon] /shows/survivor — hero blurb still reads "50 seasons" against the adjacent "51 SEASONS IN CANON" stat tile (pass: 172 (commit 6113bf9e)) — RESOLVED (2026-09-26, cloud march tick, iterate): updated `content/shows/survivor.md`'s `blurb` from "50 seasons. One torch at a time." to "51 seasons. One torch at a time.", matching the `seasons: 51` frontmatter and the adjacent stat tile. Bundled with the two related pass-172 Survivor 51 premiere-metadata findings below (one root cause: premiere-day derived fields never got updated off pre-air state). Full verify gate green (fast gate 199/199 test files, 3696/3696 tests, content:check ok — 68 shows/1053 seasons/68 canons/182 themes; build 1520 static pages; e2e 4969/4969 passed, 32.2m). Shipped at `14c072bf`.
- [x] [MED] [anon] /shows/survivor/season/survivor-51 — the season's own eyebrow still reads "Premiering fall 2026" three days after air, contradicting the fact block on the same page (pass: 172 (commit 6113bf9e)) — RESOLVED (2026-09-26, cloud march tick, iterate): updated `content/shows/survivor/seasons/51-survivor-51.md`'s `eyebrow` from "Premiering fall 2026 · Filmed in Fiji" to "Airing fall 2026 · Filmed in Fiji", matching the aired/airing convention survivor-49/50 already use. Flips to "Aired" once the season concludes. Shipped at `14c072bf`.
- [x] [LOW] [anon] /shows/survivor — canon.md's `last_revised` timestamp (June 2026) predates the post-premiere Survivor 51 prose actually authored into the same file (pass: 172 (commit 6113bf9e)) — RESOLVED (2026-09-26, cloud march tick, iterate): bumped `content/shows/survivor/canon.md`'s `last_revised` from 2026-06-17 to 2026-09-25, the actual date the #51 canon slot's post-premiere prose was authored (commit `1371076c`), so the rendered "CANON REVISED" stat stops understating how current the ranking is. Shipped at `14c072bf`.
- [x] [MED] [anon] /themes/not-who-they-say-they-are — the phrase "concealment mechanic" (or a close variant) recurs near-verbatim across at least 6 of 13 ranked entries (pass: 149 (commit 5d9e1f6f)) — RESOLVED (2026-09-19, cloud march tick, content-gap redirect per issue #758 — Rule 2 fully stalled, Rule 3 saturated): rewrote 7 of 13 entries' blurbs (ranks 3/4/6/8/9/10/12) so each describes its season's specific hook instead of repeating "concealment mechanic"/"concealment premise." Titles, ranks, and the six already-distinct blurbs left untouched. Shipped at `7673d448`.
- [x] [MED] [anon] /shows/traitors-uk/season/series-4 — the canon rank-scale widget has no accessible text summary of the season's actual position (pass: 148 (commit 9ea56bcd)) — issue: #814 — RESOLVED (2026-09-18, cloud march tick, iterate): added `rankPositionSummary(rank, total, headLabel)` to `src/components/composition/RankScale.tsx`, exported alongside the existing `rankFillPercent`, computing a near-top/mid-pack/near-tail qualifier from the same fill percentage the visual "here" dot already uses (a sole #1-of-1 entry drops the qualifier — nothing to compare against). Wired as the `.scale-track` element's `aria-label`, so a screen-reader user now hears "Ranked #NN of MM in Editor's Canon, near the top." instead of just the bare rank/of/here/peak/tail sequence. `RankScale` is the shared component behind every season page's rank/vote aside (`SeasonInfoCard.tsx`), so the fix lands site-wide, not just on the one flagged show. Four new unit tests cover all three qualifier bands, the #1-of-1 edge case, and the rendered aria-label with both the default and a custom `headLabel`. Full verify gate green: fast gate (199 files/3693 tests, content:check ok — 68 shows/1052 seasons/68 canons/182 themes), build clean (1519 static pages), e2e 4898/4898 passed (31.1m). Closes #814. Shipped at `ca751f45`.
- [x] [MED] [authed] /shows/project-runway/season/new-york-2026 — "the shape of the season" and "where it sits in the canon" restate the identical cast-size/judges-table/Siriano-Save fact set near-verbatim (pass: 162 (commit b0af7a0d)) - RESOLVED (2026-09-17, cloud march tick, external-critique highest-priority pick per `skills/iterate.md` — content-gap Rule 2 fully stalled at gap-zero-with-stars per weekly sweep, Rule 3 idea space exhaustively reconfirmed twice the same day): rewrote `canon.md`'s Season 22 rationale to drop the restated cast-size/panel/Siriano-Save fact set entirely and argue only the comparative canon-slot reasoning against neighbors — why sixth relative to Season 9 (which proved the format holds at scale first) and Season 3 (a smaller-scope confident run). Season body (`22-new-york-2026.md`) keeps sole ownership of the fact set; `tag`/`slot_argument`/`community_rank_hint` fields left untouched. Delegated the prose rewrite to `content-curator`, verified against the live file (exact match, 112 words, within the 80-120 word canon-rationale cap). Mirrored to issue #813 before the fix; full verify gate green (fast gate 3687 tests, content:check ok — 68 shows/1052 seasons/68 canons/182 themes; build 1519/1519 static pages; e2e 4897 passed, 22.3m). Shipped at `3bdd8ac6`.
- [x] [HIGH] [anon] /themes/too-few-to-call-it-all-stars — entry #03 names and characterizes a season's premiere-night plot twist (pass: 156 (commit ae289b02)) - RESOLVED (2026-09-10, cloud march tick, content-gap redirect per issue #758 — Rule 2 fully stalled (`plan/CADENCE.md` 41 shows/42 gap-slots all confirmed-but-unaired), Rule 3 idea space independently reconfirmed exhausted): scout-verified the two-lead/night-one-vote format was ABC-pre-announced on March 9, 2015 ("After the Final Rose" special), over two months before the May 18, 2015 premiere — ABC News itself covered it as pre-season news; only the vote's winner was withheld pre-air. Reframed the blurb from spoiler-coded "twist" language to a pre-announced structural-format fact, without naming the vote's outcome. Shipped at `60c99ed5`.
- [x] [HIGH] [authed] /shows/too-hot-to-handle/season/season-6 — the finale's multi-winner prize split is stated outright, four times — a spoiler under the site's own P0 definition (pass: 155 (commit 891a8bfe)) - RESOLVED (2026-09-08, cloud march tick, content-gap redirect per issue #758 — Rule 2 fully stalled (`plan/CADENCE.md`'s 41 shows/42 gap-slots all confirmed-but-unaired), Rule 3 not review-due (oldest `last_reviewed` 2026-07-18, well inside the 90-day window)): removed the multi-winner-split fact from all four originally-flagged placements (`lede`, `episodes_caption`, markdown body, `watch_list` episode-4 entry) plus a fifth placement the fix surfaced that pass-155 didn't catch — the `shape_h2` frontmatter field literally read "The prize splits, for once." Replaced every instance with the pre-announced prize-pool-growth fact per the suggested fix (Marie Claire's coverage confirms the larger overall pool was announced pre-season, distinct from how it plays out). While auditing for the same fact elsewhere on the site, found the identical spoiler also live in `canon.md`'s Season 6 `slot_argument` and rationale paragraph, and in two themed-list entries (`every-season-strikes-a-different-bargain-with-lana` rank 1, `same-crown-new-price-tag` rank 5 — the latter's title/blurb reworked around the pool-growth fact instead, still fitting that list's own reward-structure thesis). All five files fixed in the same commit so the spoiler is fully drained from the site, not just the originally-flagged page. Full verify gate green (fast gate ok — 68 shows/1049 seasons/68 canons/181 themes; build clean, 1515 static pages; e2e 4885/4885 passed, 24.7m). Shipped at `0c665f5d`.
- [x] [MED] [authed] /shows/too-hot-to-handle/season/season-6 — "The Take" header and its own pull-quote are a near-verbatim restatement of each other (pass: 155 (commit 891a8bfe)) - RESOLVED (2026-09-08, cloud march tick, content-gap redirect per issue #758 — Rule 2 fully stalled (`plan/CADENCE.md`'s 41 shows/42 gap-slots all confirmed-but-unaired), Rule 3 not review-due (oldest `last_reviewed` 2026-07-18, well inside the 90-day window)): rewrote `pull` to "Six seasons of protecting a couple's money by staying apart, flipped for stretches of the season into protecting it by staying close." — states the actual behavioral consequence of the Bad Lana inversion (a distinct fact from take_h2's terse header and from format_caption's already-owned "AI inverts the rule" mechanic), format/structural detail only, no outcome or plot beat. Full verify gate green (fast gate 199/199 test files, 3683/3683 tests, content:check ok — 68 shows/1049 seasons/68 canons/181 themes/3 legal docs; build clean, 1515 static pages; e2e 4885/4885 passed, 32.3m). Shipped at `4b290aa7`.
- [x] [HIGH] [authed] /shows/chopped?view=community — the mobile header drops the "(canon order)" qualifier, leaving 0% approval rows with no context (pass: 155 (commit 891a8bfe)) - RESOLVED (2026-09-14, cloud march tick, content-gap redirect per issue #758 — Rule 2 fully stalled (`plan/CADENCE.md`'s tenth full weekly sweep confirms every gap-table row, 39 shows/40 gap-slots, confirmed-but-unaired), Rule 3 already exhaustively re-searched twice earlier the same day with a documented zero-headroom conclusion, so this tick addressed the oldest actionable Pending HIGH finding instead of a third same-day Rule 3 attempt): `.col-pct-mobile-label` in `src/components/canon/CommunityRankList.tsx` now renders a `.col-pct-mobile-note` "(canon)" qualifier when `source !== 'votes'`, mirroring the existing desktop `.col-bar-note` "(canon order)" logic. `src/styles/canon.css` adds the stacked-line style for the note inside the existing `max-width: 640px` media query (the 44px mobile column has no room for it inline). Two new regression tests added to `CommunityRankList.test.tsx` covering both the canon-source note appearing and the votes-source note being absent; existing pass-138 regression guard still passes unmodified (substring match against "Appr."). Component/CSS/test-only change, no content or data touched. Full verify gate green: fast gate 199 test files / 3687 unit tests, content:check ok (68 shows/1052 seasons/68 canons/182 themes/3 legal docs), build clean (1519 static pages), e2e 4897/4897 passed (23.0m). Shipped at `950e4e8d`. No GitHub issue was mirrored for this finding (browser-critique-sourced), so no Closes clause applies.
- [x] [MED] [anon+authed] /shows/american-ninja-warrior/season/the-tripleheader — the "three named qualifying regions" fact is restated near-verbatim across six sections (pass: 154 (commit 91a26c8e)) - RESOLVED (2026-09-07, cloud march tick, content-gap redirect per issue #758 — Rule 2 fully stalled, every gap-table row confirmed-but-unaired; Rule 3 not review-due): left `location`, `lede`, and the `episode_label` watch_list entry as the field's natural owners. Rewrote `format_caption` to "Regional Finals gain a second round, capped by the Tripleheader race" (argues the structural change instead of re-naming regions); rewrote the closing body paragraph to argue the scheduling/field-size effect of the split; rewrote canon.md's Season 18 opening clause to keep the season-17-vs-18 comparative argument without re-deriving the region names. Commit `2551a53d`.
- [x] [MED] [anon+authed] /shows/american-ninja-warrior/season/the-tripleheader — the host's surname is spelled two different ways on the same page (pass: 154 (commit 91a26c8e)) - RESOLVED (2026-09-07, cloud march tick, content-gap redirect per issue #758 — Rule 2 fully stalled, every gap-table row confirmed-but-unaired; Rule 3 saturated per #758): cross-checked every other season file for this host across the show's catalog — "Gbaja-Biamila" (hyphenated) is used consistently in all 16 other season files and canon.md. Standardized S18's `host` field from "Gbajabiamila" to "Gbaja-Biamila" to match `host_caption` on the same page and every sibling file. One field, one file, no other change.
- [x] [HIGH] [anon] /shows/dragrace-uk/season/series-7 — the Miss Congeniality winner is named outright, twice — this is a spoiler under the site's own P0 definition (pass: 152 (commit 9b014bce)) - RESOLVED (2026-09-05, cloud march tick, content-gap redirect per issue #758 — Rule 2 fully stalled (every gap-table row confirmed-but-unaired), Rule 3 not review-due): rewrote the episode-10 watch-for entry to describe the mechanic without naming the winner ("The room crowns its own Miss Congeniality, a cast-voted title that rewards how well a queen reads the room's own chemistry.") and dropped the naming sentence from the markdown body's closing line entirely (the mechanic is already covered by the watch-for entry, so no replacement clause was needed). No other field touched. Spoiler discipline P0 restored — winner name no longer appears anywhere on the page.
- [x] [MED] [anon] /shows/dragrace-uk/season/series-7 — three separate facts are each restated near-verbatim across 2-3 sections (pass: 152 (commit 9b014bce)) - RESOLVED (2026-09-05, cloud march tick, content-gap redirect per issue #758 — Rule 2 fully stalled, Rule 3 not review-due): dropped the Pinewood mention from the eyebrow (now just "Aired autumn 2025"); `filming_caption` now states this is the show's fifth series filmed at that Pinewood soundstage instead of bare-restating the location; `format_caption` swapped its Lucky-Cow-debut mention (owned solely by `episodes_caption` now) for a guest-panel fact ("12 queens, guest panel spans music and comedy"); the markdown body's closing sentence and `canon.md`'s Series 7 prose both dropped the same-night-simulcast restatement (now `premiere_caption`'s sole territory) in favor of a fresh evaluative angle about the twist's staying power. All three fact clusters now have exactly one owning field.
- [x] [MED] [authed] /shows/southern-charm/season/season-11?view=community — the cast-addition and episode/reunion facts are each restated 3-4 times across the page (pass: 152 (commit 9b014bce)) - RESOLVED (2026-09-05, cloud march tick, content-gap redirect per issue #758 — Rule 2 fully stalled (every gap-table row confirmed-but-unaired), Rule 3 not review-due): left `lede` and `format_caption` untouched (already the two owning placements for the named-cast/episode/reunion facts). Rewrote `shape_h2` to state the four-to-one returner ratio instead of re-listing the raw headcounts ("A four-to-one returner ratio, the calmest since the reset."), and rewrote the markdown body to argue what the stability enables (established relationships resuming without onboarding noise) instead of re-stating the names, episode count, and reunion format. All four prior near-verbatim placements now argue distinct angles.
- [x] [MED] [authed] /shows/jersey-shore/season/the-final-season?view=community — the pregnancy fact is restated near-verbatim, and the FILMED caption bare-restates its own value (pass: 152 (commit 9b014bce)) - RESOLVED (2026-09-05, cloud march tick, content-gap redirect per issue #758 — Rule 2 fully stalled (every gap-table row confirmed-but-unaired), Rule 3 not review-due): rewrote `filming_caption` from a bare restatement of `location` to a distinct fact — this is the fourth and final season filmed at that Seaside Heights house. The pregnancy fact was also restated in `episodes_caption`, the season body, canon.md's `slot_argument`, and canon.md's prose (four placements, not the two the finding named) — left `episodes_caption` as sole owner and rewrote the other three to each argue a distinct angle (built-in cast chemistry for the body, running the format out on comfort for the slot_argument, familiarity-over-incident for the canon prose). Shipped at `ac9479e0`.
- [x] [MED] [authed] /shows/alone/season/arctic-ii?view=community — the "twelfth roster" fact is restated near-verbatim across three sections (pass: 152 (commit 9b014bce)) - RESOLVED (2026-09-06, cloud march tick, content-gap redirect per issue #758 — Rule 2 fully stalled (gap table unchanged at 41 shows / 42 gap-slots, all reconfirmed accurate on the 2026-09-06 weekly sweep), Rule 3 not review-due (0 of 181 lists due)): left `cast_size_caption` untouched as the sole owner of the "twelfth roster" fact. Rewrote `shape_h2` from "Twelfth roster, familiar ground." to "Same terrain, sharper baseline." and the `lede` to argue the season raises the bar for smart play now that a baseline exists, instead of counting the roster number. Rewrote the markdown body to argue the mystery-stripping effect of a repeat location instead of restating the run count. Rewrote canon.md's Season 12 prose to argue the second-visit comparison (a season-seven baseline now exists to measure every call against) instead of the "confident enough in its twelfth run" framing. Four placements now argue four distinct angles.
- [x] [MED] [authed] /shows/the-circle/season/disrupter-mode?view=community — the "smallest cast, 10 players" fact is restated near-verbatim across seven sections — RESOLVED (pass: 151 (commit f945f171)) - RESOLVED (2026-09-04, cloud march tick, content-gap redirect per issue #758 — Rule 2 fully stalled, Rule 3 confirmed saturated, the standing row's slot_argument/closing-clause side-drain exhausted catalog-wide the prior tick): THE TAKE (`take_h2`) was already distinct ("The sharpest edges yet."). Rewrote the remaining five offenders — `lede` drops the "smallest group in the show's US run" clause and keeps only the bare "10 players" fact; `episodes_caption` now argues episode-count stability instead ("the same length every season has run since the second" — verified 13 episodes across every season since S2, only S1 ran 12); the watch-for bullet's label/body now argue what a smaller room does to weekly stakes rather than restating the superlative; `canon.md`'s `tag`/`slot_argument`/prose rewritten to argue the ranking on mechanical-sharpness grounds relative to Season 1 (the rank-2 neighbor) instead of re-deriving the cast-size fact — `cast_size_caption` ("Ten players, the smallest cast of the show's US run") is now the sole owner of the exact number+superlative. All fields stay under their schema char caps (`tag` 91/120, `slot_argument` 238/240, `episodes_caption` 74/80). Spoiler discipline P0 intact — format/structure facts only.
- [x] [MED] [authed] /shows/selling-sunset/season/season-9 — the reunion-return and new-agent facts are restated across five sections, and the meta description is a verbatim duplicate of the lede's opening sentence — RESOLVED (pass: 151 (commit f945f171)) - RESOLVED (2026-09-04, cloud march tick, content-gap redirect per issue #758 — Rule 2 fully stalled, Rule 3 confirmed saturated, prior tick's the-circle fix exhausted the standing row's own side-drain): added `meta_description` as an independent summary sentence (no longer echoes the lede). CAST SIZE caption kept as the sole owner of the Vergara-joins fact (unchanged). Rewrote the other five offenders to each argue a distinct angle: `format_caption` now names which prior era (through Season 7) the two-part structure last ran in, rather than restating "returns"; `episodes_caption` foregrounds the release-timing mechanic (batched drop, reunion a week later) instead of the return status; `take_h2` drops both headline facts entirely ("Back to full strength."); the SHAPE body now leads with Tan France's fifth-consecutive-hosting streak (a fact not stated elsewhere) before the episode/reunion mechanics, with Vergara's arrival reduced to a trailing clause; `canon.md`'s `tag`/`slot_argument`/prose rewritten to argue the rank 5 slot comparatively against neighbors (below Season 5, which built the reunion structure from nothing; above Season 6, whose turnover left the show without it) rather than re-deriving the reunion/Vergara facts directly. All fields stay under their schema char/word caps (`tag` 101/120, `slot_argument` 223/240, `meta_description` 150/160, canon rationale 90 words). Spoiler discipline P0 intact — format/structure facts only.
- [x] [HIGH] [anon] /shows/masterchef — `?view=canon` and `?view=community` set inconsistent canonical URLs for the same toggle page (pass: 151 (commit f945f171)) - RESOLVED (2026-09-10, cloud march tick, content-gap redirect per issue #758 — Rule 2 fully stalled (`plan/CADENCE.md` 41 shows/42 gap-slots all confirmed-but-unaired), Rule 3 not review-due): fixed at the shared-component level per the finding's own suggested fix — `src/app/shows/[show]/page.tsx`'s `generateMetadata`, community branch, now passes `path: \`/shows/${show.slug}\`` (the clean base URL) instead of the self-referential `?view=community` path, matching the canon branch's existing behavior. The community view keeps its own distinct `title`/`description`/OG image; only the canonical now folds to the shared base URL, so crawlers see one canonical document per toggle page instead of two. Fixes both flagged shows (masterchef, naked-and-afraid) and every other show-index page in the same commit, since the logic is shared. Updated `src/app/shows/[show]/__tests__/page.test.tsx`'s canonical assertion to match. JSON-LD `ItemList` `path` fields (a separate structured-data concern, not the `<link rel="canonical">` tag the finding evidenced) were left untouched — out of this finding's scope. Full verify gate green.
- [x] [MED] [authed] /shows/hells-kitchen/season/battle-of-the-states?view=community — the FILMED stat caption bare-restates the value line directly above it — RESOLVED (pass: 148 (commit 9ea56bcd)) - RESOLVED (discovered fixed 2026-09-04, cloud march tick): `content/shows/hells-kitchen/seasons/24-battle-of-the-states.md`'s `filming_caption` already reads "A second consecutive season inside Foxwoods, after last year's move east." — the bare-restatement was fixed at commit `cdfb9912` ("content: filming_caption bare-restatement drain round 2 — hells-kitchen") on a prior tick, but this row was never ticked resolved. No further change needed; row closed on discovery.
- [x] [MED] [anon+authed] /shows/rhony/season/the-second-act — the FILMED stat caption bare-restates the value line above it, just reformatted from middot- to comma-separated — RESOLVED (pass: 147 (commit HEAD)) - RESOLVED (discovered fixed 2026-09-04, cloud march tick): `content/shows/rhony/seasons/15-the-second-act.md`'s `filming_caption` already reads "First three-location season since the single-stop season fourteen." — the bare-restatement was fixed at commit `70235038` ("content: filming_caption bare-restatement drain round 5 — rhony") on a prior tick, but this row was never ticked resolved. The `isBareRestatement()` broadening suggestion was not applied — the shared helper's pass-114 note already documents why a blanket separator/prefix-normalization widening false-positives on 15+ shows' legitimate location-truncation convention; the safer, already-established pattern is a per-content fix, which is what shipped. No further change needed; row closed on discovery.
- [x] [MED] [anon] /shows/perfect-match/season/season-4 — the crossover-casting fact is restated across five separate sections of the same page (pass: 146 (commit bbc5263b)) - RESOLVED (2026-09-10, cloud march tick, content-gap redirect per issue #758 — Rule 2 fully stalled (`plan/CADENCE.md` 41 shows/42 gap-slots all confirmed-but-unaired), Rule 3 not review-due): left the lede, THE TAKE pull, and meta captions as the crossover-casting fact's owners; rewrote the season markdown body ("Shape of the Season") to cover mechanics (villa growing to twenty while episode count drops to eight, squeezing the mixer mechanic) instead of re-deriving the casting fact, and rewrote `canon.md`'s Season 4 `slot_argument` + rationale to argue the #4 slot comparatively against Season 3 instead of restating cast/franchise facts already owned by the season page. Shipped at `7f2d27aa`.
- [x] [LOW] [anon] /shows/perfect-match/season/season-4 — meta description is truncated mid-sentence with a dangling ellipsis (pass: 146 (commit bbc5263b)) - RESOLVED (2026-09-10, cloud march tick, content-gap redirect per issue #758 — Rule 2 fully stalled (`plan/CADENCE.md` 41 shows/42 gap-slots all confirmed-but-unaired), Rule 3 not review-due, oldest `last_reviewed` 41 days inside the 90-day floor): rather than fight `clipToSeoBudget`'s em-dash clause-boundary truncation (already confirmed working-as-designed at passes 62/67/68/85/86/100/114 — see the survivor-50/big-brother row above), used the `meta_description` escape hatch the pass-149 fix (`#801`) added to `descriptionFor()` for exactly this shape of problem. Authored `content/shows/perfect-match/seasons/04-season-4.md`'s `meta_description: "Nick Lachey hosts a fourth season in Tulum, Mexico, its villa filled for the first time with alumni from Married at First Sight Australia and Vanderpump Rules."` (159 chars, under the 160-char schema max) — a complete sentence naming the crossover-cast payoff clause the old truncated description cut off before. No `lede` change; `descriptionFor()` checks `meta_description` first. `pnpm content:check` clean (68 shows/1050 seasons/68 canons/182 themes, no new warnings).
- [x] [MED] [authed] /shows/queer-eye/season/las-vegas?view=community — the FILMED stat caption bare-restates the location value one field above it — RESOLVED (pass: 146 (commit bbc5263b)) - RESOLVED (discovered fixed 2026-09-04, cloud march tick): `content/shows/queer-eye/seasons/09-las-vegas.md`'s `filming_caption` already reads "Sandwiched between New Orleans's two-parter and D.C.'s three-jurisdiction sprawl" — the bare-restatement was fixed at commit `ab1b8f7d` ("content: filming_caption bare-restatement drain round 8 — below-deck-med, masterchef-au, queer-eye, the-challenge, the-real-world") on a prior tick, but this row was never ticked resolved. The `isBareRestatement()` broadening suggestion was not applied — see the rhony row above for why that widening is deliberately out of scope. No further change needed; row closed on discovery.
- [x] [MED] [anon] /shows/ink-master/season/hometown-heroes — the season body and canon.md rationale restate the identical finale-rarity sentence with one word swapped — RESOLVED (pass: 143 (commit 21cbf24a)) - RESOLVED (2026-08-25, cloud march tick, content-gap redirect per issue #758 — Rule 2 fully stalled at 43/43 gap-slots starred, Rule 3 confirmed saturated, twenty-third same-day-class redirect): applied the suggested fix's first option — left the season body's "weigh" sentence untouched as sole owner of the finale-rarity fact, and rewrote `canon.md`'s rationale to argue comparatively against the two canon-adjacent seasons named in the finding (Season Fifteen's three-round versatility test, Turf War's pandemic-disrupted finale), landing on why Hometown Heroes's four-finalist close is the cleaner structural case rather than re-deriving the "second time in the show's history" claim. Content-only, one field (`content/shows/ink-master/canon.md`). Spoiler discipline P0 intact — format/structure facts only, no outcome exposure.
- [x] [LOW] /shows/amazing-race/season/season-38 — "Adjacent in the Canon" pairs canon rank with season number in a way that reads as a mismatch at a glance (pass: 140 (commit 9cc9376a)) - RESOLVED (2026-09-08, cloud march tick, content-gap redirect per issue #758 — Rule 2 fully stalled, every `plan/CADENCE.md` gap-table row confirmed-but-unaired; Rule 3 saturated, 0/181 lists review-due): added a `canonOrderCaptionFor` fallback to `adjacentByCanon`'s `toSide` helper in `src/app/shows/[show]/season/[slug]/page.tsx` — when an adjacent card's title is a bare "Season NN" literal (no nickname) and that NN differs from the card's canon rank, the card now renders a "Canon rank, not season order" caption, the same slot the pass-129 title-collision fix already uses. Nicknamed titles (no bare season number to collide with) are untouched. Three new unit tests added to `page.test.tsx` (mismatch fires the caption, matching numbers leave it undefined, nicknamed titles never trigger it). Full verify gate green (fast gate 3682 unit tests, content:check ok — 68 shows/1049 seasons/68 canons/181 themes; build clean; e2e 4885/4885 passed, 32.0m). Shipped at ba9d44dc.
- [x] [LOW] /shows/dragrace — Season 5's canon dek and the opening sentence of its body paragraph both lead with the identical "cleanest contest/competition the franchise has ever produced" claim — RESOLVED (pass: 142 (commit 90405f7a)) - RESOLVED (2026-08-25, cloud march tick, content-gap redirect per issue #758 — Rule 2 fully starred at 43/43, Rule 3 confirmed saturated, twenty-second same-day-class redirect): applied the suggested fix verbatim — left `tag` as the sole owner of the "cleanest contest" claim, rewrote the body's opening clause to lead with the Logo-era cast stamina detail, and reworded the closing argument ("the format running at its most stripped-down and complete") to make the same point without re-asserting the tag's exact phrase. Content-only, one field (`content/shows/dragrace/canon.md`). Spoiler discipline P0 intact — cast/format/reception facts only, no outcome exposure. Verify gate green: fast gate (199 test files / 3673 unit tests, content:check ok — 68 shows/1047 seasons/68 canons/181 themes/3 legal docs), build clean (1513 static pages), e2e 4879/4879 passed (31.2m). — 805d5c38
- [x] [MED] /shows/dragrace?view=community — "voters, last 7 days · 0" reads as contradicting nonzero per-season vote totals in the same table, because the pass-139 zero-clause fix only fires for `source === 'votes'` — RESOLVED (pass: 142 (commit 90405f7a)) - RESOLVED (2026-08-25, cloud march tick): applied the suggested fix verbatim — dropped the `source === 'votes'` gate on the zero-clause in `CommunityLiveStrip.tsx`, replacing it with `lastRecomputeAt != null`, so the "(no new votes since last update)" clause now fires on the timestamp+zero combination regardless of source label. Rewrote the component's own code comment to state the corrected rationale instead of the disproven `source`-scoped assumption. Added a regression test (`CommunityLiveStrip.test.tsx`) covering the canon-mirroring + non-null-timestamp + zero-voters case. Verify gate green: fast gate, build clean, e2e 4879/4879 passed (30.3m). — aeeb6fb3
- [x] [HIGH] [anon] /shows/below-deck-mediterranean/season/dubrovnik-ii — "the shape of the season" and "where it sits in the canon" restate the identical yacht/chef/crew roster near-verbatim (pass: 153 (commit dedb99b7)) - RESOLVED (2026-09-06, cloud march tick, content-gap redirect per issue #758): rewrote canon.md's Season 11 rationale to argue the rank-7 slot comparatively against its canon neighbors (Barcelona II above, Athens below) instead of re-listing the yacht name, chef name, and four crew members already owned by the season file. `tag`, `slot_argument`, and `community_rank_hint` left unchanged; season file untouched.

- [x] [MED] [anon] /shows/[show] canon/theme card grid — the season-card and themed-list-card grids skipped a heading level, jumping from `<h2>` straight to `<h4>` with no `<h3>` in between; confirmed template-level on two unrelated shows (bachelorette, so-you-think-you-can-dance). (URL: /shows/[show], source: browser, critique-pass-159, anon) — issue: #812 — RESOLVED e227ce3e (2026-09-15, cloud march tick, iterate): promoted `CanonMidEntries.tsx`'s `<h4 className="cp-mid-title">` (the A-tier season-card grid) and `FeaturedThemes.tsx`'s bare `<h4>` (the "Themed lists for <Show>" card grid) both to `<h3>`, matching the sibling `CanonHeroEntries.tsx` (S-tier grid) which already used `<h3>` in the same slot. `.cp-mid-title` is class-scoped in `canon.css` (no restyle needed); updated the element-scoped `.list-card h4` selector in `screens.css` to `.list-card h3`. Component/CSS-only, no content or data touched. Verify gate green: 199 test files / 3687 unit tests, content:check ok (68 shows/1052 seasons/68 canons/182 themes/3 legal docs), build clean, e2e 4897/4897 passed (32.0m). Closes #812.

- [x] [HIGH] [anon] [authed] /shows/traitors/season/ardross-2026 — the lede, "THE SHAPE OF THE SEASON," and "WHERE IT SITS IN THE CANON" all restated the same cast/format facts with no new angle. (URL: /shows/traitors/season/ardross-2026, source: browser, critique-pass-153, anon+authed, desktop) — RESOLVED (2026-09-06, cloud march tick, content-gap redirect per issue #758): rewrote the season markdown body paragraph to argue the canon-slot comparison against Season 3's structural wrinkle (mid-game player arrivals) instead of re-deriving the same cast/format premiere facts a second time — the hero lede stays the sole owner of those facts. Rewrote `canon.md`'s Season 4 rationale to make the identical Season-3-vs-Season-4 structural-contribution argument instead of restating the premiere facts and "no reinvention" line a third time. Content-only, two files (`content/shows/traitors/seasons/04-ardross-2026.md` + `content/shows/traitors/canon.md`). Word counts verified against schema bounds (season body 79/50-80 words, canon rationale 105/80-120 words). Spoiler discipline P0 intact — format-mechanics facts only, no outcome exposure. Verify gate green: 199 test files / 3679 unit tests, content:check ok (68 shows, 1049 seasons, 68 canons, 181 themes, 3 legal docs), build clean, 4885 e2e passed (30.9m). No GitHub issue was mirrored for this finding (browser-critique-sourced, never opened as a discrete issue), so no Closes clause applies.

- [x] [MED] [authed] /shows/big-brother/season/a-summer-of-mystery?view=community — "three stacked twists" was restated four times before the season's individual twists were ever listed (subtitle, THE TAKE, THE SHAPE OF THE SEASON, WHERE IT SITS IN THE CANON). (URL: /shows/big-brother/season/a-summer-of-mystery, source: browser, critique-pass-150, authed) — RESOLVED fa64c3eb (2026-09-03, cloud march tick, content-gap side-drain per the standing Season-fill drain row in `plan/AUDIT.md`): rewrote the markdown body to argue what the twist stack does to the house's rhythm (paranoia compounding week to week) instead of re-counting three mechanics; rewrote canon.md's WHERE IT SITS IN THE CANON rationale to argue density-vs-the-Hacker-Summer's-single-hook rather than re-listing the Block Buster/Mastermind/Week-9 devices by name. Subtitle/lede left as the sole owner of the raw "three twists" fact per the suggested fix. Content-only, two files. Spoiler discipline P0 intact — no outcome/eviction facts touched. Verify gate green: 199 test files / 3679 unit tests, content:check ok (68 shows/1048 seasons/68 canons/181 themes/3 legal docs), build clean, 4882 e2e (30.9m). No GitHub issue was mirrored for this finding (browser-critique-sourced, never opened as a discrete issue), so no Closes clause applies.

- [x] [LOW] [authed] /shows/top-chef/season/carolinas?view=community — the Last Chance Kitchen entry-rule change was restated five times, crowding out any other characterization of the season (tagline, THE TAKE, THE SHAPE OF THE SEASON, WHERE IT SITS IN THE CANON, EP 6 watch-for callout). (URL: /shows/top-chef/season/carolinas, source: browser, critique-pass-150, authed) — RESOLVED fa64c3eb (2026-09-03, cloud march tick, content-gap side-drain per the standing Season-fill drain row in `plan/AUDIT.md`): rewrote the `pull` field to lead with the Carolinas geography and the life-partners/twin-brothers cast wrinkle instead of the LCK rule change; rewrote the markdown body's closing sentence to surface the same cast wrinkle rather than re-explaining the LCK entry-rule change a second time within the page. canon.md's WHERE IT SITS IN THE CANON rationale left untouched — it's the field doing actual ranking work with the LCK fact, per the suggested fix. Content-only, one file. Spoiler discipline P0 intact — no elimination/placement facts touched. Verify gate green: 199 test files / 3679 unit tests, content:check ok (68 shows/1048 seasons/68 canons/181 themes/3 legal docs), build clean, 4882 e2e (30.9m). No GitHub issue was mirrored for this finding (browser-critique-sourced, never opened as a discrete issue), so no Closes clause applies.

- [x] [HIGH] [authed] /shows/survivor/season/survivor-50 — the fan-voted-mechanics fact ("tribe colors, food rations, the final stretch") had crept back into a four-way near-repeat across `pull`, a `watch_list` entry body, and the markdown body paragraph — the same defect class the pass-123 fix (f1427b29) had already closed once on this exact page. (URL: /shows/survivor/season/survivor-50, source: browser, critique-pass-150, authed) — RESOLVED 0a93f65d (2026-09-03, cloud march tick, content-gap side-drain per the standing Season-fill drain row in `plan/AUDIT.md`): rewrote `pull` to focus on the friction between eras of strategic education rather than re-listing the voted mechanics; rewrote the Ep 2 `watch_list` body and the Ep 12 `watch_list` body to reference the fan-vote's effect without re-enumerating the item list; rewrote the markdown body paragraph to lead with the cast's cross-era casting instead of repeating the mechanics list a fourth time. `format_caption` stays the sole owner of the literal "tribe colors, food rations, final stretch" phrase, matching the pass-123 precedent. Content-only, one file. Spoiler discipline P0 intact — no outcome/elimination/winner facts touched. Verify gate green: 199 test files / 3679 unit tests, content:check ok (68 shows/1048 seasons/68 canons/181 themes/3 legal docs), build clean, 4882 e2e (32.7m). No GitHub issue was mirrored for this finding (browser-critique-sourced, never opened as a discrete issue), so no Closes clause applies.

- [x] [MED] [authed] /shows/survivor/season/survivor-50 — the cast-size fact ("24 castaways," "largest cast in franchise history") repeated across `cast_size_caption` and a nearby field with near-identical phrasing, reproducing on the same page as the co-located HIGH fan-vote finding above. (URL: /shows/survivor/season/survivor-50, source: browser, critique-pass-150, authed) — RESOLVED 0a93f65d (2026-09-03, cloud march tick, content-gap side-drain per the standing Season-fill drain row in `plan/AUDIT.md`): folded into the same edit pass as the co-located HIGH finding above — the markdown body paragraph and `watch_list` bodies were rewritten to stop re-deriving the cast-size fact, leaving `cast_size_caption` ("largest cast in franchise history") as the sole owner of that framing. Content-only, part of the same file edit as the HIGH finding above. Spoiler discipline P0 intact. Verify gate green: 199 test files / 3679 unit tests, content:check ok (68 shows/1048 seasons/68 canons/181 themes/3 legal docs), build clean, 4882 e2e (32.7m). No GitHub issue was mirrored for this finding (browser-critique-sourced, never opened as a discrete issue), so no Closes clause applies.

- [x] [HIGH] [anon+authed] /shows/amazing-race/canon — the "WHY THIS SLOT" callout on Season 7 and All-Stars re-paraphrased each entry's own rationale body copy instead of adding new context, the same systemic `slot_argument` defect class drained on top-chef/bake-off/hells-kitchen/project-runway/the-voice at pass-148/149 (8db89494), now reproducing on a show that drain hadn't reached yet. (URL: /shows/amazing-race/canon, source: browser, critique-pass-150, anon+authed) — RESOLVED 0a93f65d (2026-09-03, cloud march tick, content-gap side-drain per the standing Season-fill drain row in `plan/AUDIT.md`): rewrote both `slot_argument` fields to compare the ranked slot against an adjacent-ranked season, matching the established fix pattern — Season 7 (#1) now argues its rank against the season it enabled (All-Stars) rather than restating its own publicity-moment rationale; All-Stars (#2) now argues its rank against both the season above it (Season 7) and the season below it (Season 3), rather than restating its own twelve-team-scale rationale. Both fields iterated to fit the schema's 240-character `slot_argument` max (215 and 240 chars respectively). Content-only, one file, two fields. Spoiler discipline P0 intact — no outcome/placement facts touched. Verify gate green: 199 test files / 3679 unit tests, content:check ok (68 shows/1048 seasons/68 canons/181 themes/3 legal docs), build clean, 4882 e2e (32.7m). No GitHub issue was mirrored for this finding (browser-critique-sourced, never opened as a discrete issue), so no Closes clause applies.

- [x] [HIGH] systemic (bumped MED→HIGH at pass-149) — the "WHY THIS SLOT" callout re-paraphrases the season's own body copy instead of adding new context. (URL: general, sitewide `slot_argument` field; source: browser, critique-pass-148/149, anon) — RESOLVED 8db89494 (2026-09-03, cloud march tick, content-gap side-drain per the standing Season-fill drain row in `plan/AUDIT.md`): rewrote the `slot_argument` field on all six confirmed instances across four shows — top-chef's Las Vegas #1 slot, bake-off's Slot #1, hells-kitchen (Season 5 and Season 4), and Project Runway (Season 4 and Season 1) — so each now compares the ranked slot against an adjacent-ranked season instead of restating the body paragraph's own argument in different words. Also swept the-voice's founding-five span (Seasons 1-5, confirmed outside the frozen S22-29 factual-corruption scope per issue #762) for the same defect shape and rewrote all five. No new field, no schema change — pure prose-level fix to an existing systemic pattern, mirroring the meta-description systemic fix's precedent of closing a defect class corpus-wide rather than patching one more instance. Content-only. Spoiler discipline P0 intact — no outcome/elimination/winner facts touched. Verify gate green: 199 test files / 3679 unit tests, content:check ok, build clean, 4882 e2e (30.8m). No GitHub issue was mirrored for this finding (browser-critique-sourced, never opened as a discrete issue), so no Closes clause applies.

- [x] [HIGH] systemic (bumped MED→HIGH at pass-147, now confirmed on 7 pages across 4 passes) — meta descriptions echo their own page's lede/H1 verbatim. (URL: /shows, /shows/rhony/season/the-second-act, /shows/hells-kitchen?view=canon, /shows/traitors-uk/season/series-4; source: browser, critique-pass-146/147/148, anon) — issue: #801 — RESOLVED 20d21252 (2026-08-31, cloud march tick): the pass-141 fix addressed three instances via one-off field rewrites, and the defect reproduced four more times because the root cause was structural — no escape hatch existed for a season's `lede` or a show's `tagline` to differ from its SEO description. Added a new optional `meta_description` season-frontmatter field (preferred over `lede` in `descriptionFor()`), authored for the two flagged seasons (rhony/the-second-act, traitors-uk/series-4). Broadened `collectCardTaglineGapIssues()` to flag every show missing `card_tagline` — not just taglines >160 chars — since a short tagline passes `descriptionFor()` unclipped into a full verbatim duplicate; authored `card_tagline` for the 5 shows that lacked it (alone-australia, alone, hells-kitchen, shark-tank, the-ultimatum). Reworded the `/shows` index meta-description opener (`tierMetaDescription.ts`) so it no longer opens with ShowsHero's exact lede clause, updating the pass-50 #428 hedge-verb regression guard to match the new phrasing. This closes the defect class corpus-wide rather than patching one more page — a future season/show authored without `meta_description`/`card_tagline` still falls back to the pre-existing (already-safe) `lede`/`tagline` paths; the new fields are the fix for the specific pages where reusing that fallback produced a duplicate. Verify gate green: 199 test files / 3679 unit tests, test:scripts 146/0 fail, content:check ok (68 shows/1048 seasons/68 canons/181 themes/3 legal docs), build clean (1519 pages), 4882 e2e (29.5m). Closes #801.

- [x] [HIGH] systemic (bumped MED→HIGH at pass-147, reproduces on 4 shows across 2 passes) [authed] the pre-vote vote-pair widget states "no vote cast yet" four separate ways in a row, on every community view page checked so far. (URL: general, sitewide component; source: browser, critique-pass-146/147, authed) — issue: #799 — RESOLVED fa5c614f (2026-08-31, cloud march tick): `VotePair.tsx`'s zero-state label now reads the plain tally wording ("votes so far") instead of the CTA-flavored `zeroLabel` ("be the first to vote") whenever the viewer is signed in — the state cap already declares "you haven't voted yet" and VoteRowHead's eyebrow already carries the "cast vote" CTA, so the widget's own zero-label no longer restates either. The "0" digit is kept: it's the `.vote-count` grid cell's load-bearing content in the 3-column pill layout (removing it would leave an empty bordered spacer between the two buttons), and unlike the CTA text it's a plain fact, not a second invitation. Anonymous viewers (no cap, no eyebrow) keep the original CTA unchanged — it remains their only nudge to vote. Component-only, one conditional in `VotePair.tsx`; two new colocated tests pin the signed-in vs. anon zero-state label split. Verify gate green: 199 test files / 3679 unit tests, test:scripts clean, content:check ok (68 shows/1048 seasons/68 canons/181 themes/3 legal docs), build clean (1514 pages), 4882 e2e (30.2m). Closes #799.

- [x] [MED] systemic — meta descriptions on `/shows/love-island-uk`, `/shows/survivor/season/survivor-50`, and `/themes` all reused the page's own H1/lede copy near-verbatim instead of standing as independent summaries. (source: browser, critique-pass-141) — RESOLVED 2026-08-25, cloud march tick, content-gap redirect per issue #758 (Rule 2 fully starred/deferred, Rule 3 saturated — redirected to this queued CRITIQUE finding instead of a no-op audit pass). Rewrote all three independently: `content/shows/love-island-uk.md`'s `card_tagline` now reads "Two seasons a year, one villa, endless recoupling — the format every other country's version traces back to" (previously a reshuffled echo of the body lede). `content/shows/survivor/seasons/50-survivor-50.md`'s `lede` shortened from 180 to 136 chars and reworded ("spanning the show's entire run, for the biggest cast yet") so `clipToSeoBudget` no longer truncates it mid-sentence with a dangling ellipsis — the fan-voted-mechanics hook now survives the cut. `src/app/(default)/themes/page.tsx`'s hardcoded `generateMetadata()` description rewritten to stop echoing the hero H1/gloss verbatim while still passing the page's own drift-guard test. All three verified against their schema char budgets before the full three-leg verify gate (typecheck/test/build + e2e, 4879 tests) ran green. This row was left in Pending without a proper Done move despite the fix landing — closing it now (pass-146 self-assessment) to stop it competing for `/iterate` cycles as a live finding. **Reopened as a fresh, differently-scoped Pending row at pass-146**: the identical defect class reproduced on a fourth page (`/shows` index), meaning the per-page field patches addressed symptoms, not the meta-description generation step itself — see the new pass-146 Pending row for the recommended template/content-check-level fix.
- [x] [HIGH] [authed] /u/e2e/opengraph-image — the per-profile social-card image still 404s live, reopening the pass-136 finding the 2026-08-23 fix believed it closed. Root cause: Next.js appends a disambiguation hash suffix (`-17s3nj`) to a metadata image route's URL whenever the route file lives inside the `(default)` route group, while the sibling `page.tsx` for the identical URL resolves cleanly whether grouped or not — so the browser requested `/u/[handle]/opengraph-image` but the build only ever emitted `/u/[handle]/opengraph-image-17s3nj`. The same defect independently broke `/shows/opengraph-image`. (URL: /u/e2e/opengraph-image, source: critique-pass-141) — RESOLVED content-gap redirect (issue #758), 2026-08-24: `git mv` both `opengraph-image.tsx` files (+ colocated tests) out of `(default)`, mirroring the already-working `/themes/[theme]/opengraph-image.tsx` precedent. `pnpm build` post-fix confirmed both routes emit clean, unhashed paths. Re-verified live at pass-142 (2026-08-24, cloud march): `curl -sI https://tiered.tv/u/e2e/opengraph-image` → `HTTP/2 200`, `content-type: image/png`. This row was left in Pending without a proper Done move despite the fix landing at commit 761a95e3 (referenced inline but never migrated); closing it now (pass-142 self-assessment) to stop it competing for `/iterate` cycles as a live finding.
- [x] [MED] [anon] /shows/married-at-first-sight-australia/season/season-13 — casting-breakdown fact (nine couples at open, three intruder couples mid-run, fourth same-sex male pairing) restated near-identically across five fields (lede, Shape-of-Season body, canon rationale, FORMAT caption, watch-list bullet). Kept the full fact in the lede only; rewrote the body opening, canon rationale, FORMAT caption, and watch-list bullet to reference it obliquely instead of re-deriving the clause. (pass-133; addressed at 72ee258f, cloud march content-gap redirect per issue #758)
- [x] [LOW] [anon] /shows/big-brother/season/a-summer-of-mystery — cast-count headline numbers don't match across meta-column stats: the FORMAT stat tile read "16+ houseguests · three stacked twists" while the CAST SIZE stat tile read "17 players" with sub-caption "16 newcomers plus a premiere-night mystery arrival" — a skimming reader saw two different top-line numbers ("16+" vs "17") for the same fact before reconciling the sub-captions underneath. (URL: /shows/big-brother/season/a-summer-of-mystery, source: critique-pass-137) — RESOLVED c978fe8d (2026-08-24, cloud march tick, redirected from a stalled ship-content dispatch per issue #758 — Rule 2 fully starred at 43 gap-slots/43 shows, Rule 3 confirmed saturated through a ninth same-day zero-ship pass logged in `plan/LISTS.md`): changed `format_summary` from "16+ houseguests · three stacked twists" to "17 houseguests · three stacked twists", matching the CAST SIZE tile's already-reconciled total. Content-only, one field. Verify gate green: 199 test files / 3665 unit tests, content:check ok (68 shows/1047 seasons/68 canons/181 themes/3 legal docs), build clean (1513/1513 static pages), 4879 e2e (28.2m).

- [x] [MED] [anon] /shows/rhoa/season/the-clean-slate — "zero returning anchors" restated near-verbatim three times on one page: `format_caption` ("Zero returning anchors for the first time in franchise history"), the markdown body's closing sentence, and `canon.md`'s slot-16 rationale. (URL: /shows/rhoa/season/the-clean-slate, source: critique-pass-137) — RESOLVED PENDING_HASH (2026-08-23, cloud march tick, redirected from a stalled ship-content dispatch per issue #758 — Rule 2 fully starred/43 shows carrying a gap, Rule 3 confirmed exhausted through nine-plus same-day zero-ship passes logged in `plan/LISTS.md`): rewrote `format_caption` to a distinct cast-composition fact — "Six of eight full-timers return; the departed pair were the anchors" — leaving the body close and canon.md rationale as the sole two owners of the "zero returning" framing. Content-only, one field. Did not extend the bare-restatement guard to `format_caption` (the suggested-fix stretch goal) — that check compares a caption against its own stat tile's numeral value; this defect was a cross-field prose echo (season body + canon.md), a different shape the existing pattern doesn't generalize to without a larger cross-file mechanism, out of scope for a single-field content fix. Verify gate green: 199 test files / 3665 unit tests, content:check ok (68 shows/1047 seasons/68 canons/181 themes/3 legal docs), build clean (1513/1513 static pages), 4879 e2e (31.2m).

- [x] [MED] [browser] /shows/americas-got-talent/season/the-debut — canon.md self-contradicts the season's own judge lineup. The lede, watch_list, and season body correctly name Piers Morgan, David Hasselhoff, and Brandy Norwood for Season 1; but `content/shows/americas-got-talent/canon.md:42` (slot #02 rationale) named Sharon Osbourne (who joins Season 2) in place of Norwood — a stale reference the pass-127 season-file fix never propagated to canon.md's separate rationale prose. (URL: /shows/americas-got-talent/season/the-debut, source: critique-pass-137) — RESOLVED 1cb5e3ae (2026-08-23, cloud march tick, redirected from a stalled ship-content dispatch per issue #758 — Rule 2 fully starred/43-43, Rule 3 confirmed exhausted through seven same-day zero-ship passes logged in `plan/LISTS.md`): edited canon.md line 42 to name Brandy Norwood instead of Sharon Osbourne, matching the season file, lede, and watch_list already on the same page. Content-only, one field. Verify gate green: 199 test files / 3665 unit tests, content:check ok (68 shows/1047 seasons/68 canons/181 themes/3 legal docs), build clean (1513/1513 static pages), 4879 e2e (30.8m).

- [x] [MED] [authed] /themes/a-change-of-address — the list's #1 and #2 entries (Below Deck Down Under S03 and S04, back-to-back at the top of a freshly-shipped 12-entry list) opened their blurbs with near-identical phrasing establishing the same premise twice in a row. (URL: /themes/a-change-of-address, source: critique-pass-123) — RESOLVED ce8e2ef8: rewrote entry #02's blurb to drop the "built its identity on Australian anchorages" premise already established by entry #01, leading directly with the Caribbean relocation and the franchise-first charter crossover instead. Content-only, one field, one entry. Spoiler discipline P0 intact. Verify gate green: 197 test files / 3600 unit tests, content:check ok (68 shows/1046 seasons/68 canons/181 themes/3 legal docs), build clean, 4874 e2e (25.9m). Closes the pass-123 MED finding.

- [x] [MED] [authed] /shows/survivor/season/survivor-50 — the same fan-vote mechanics list ("tribe colors, food rations, the final stretch") appeared four separate times on the site's newest, highest-traffic season page: the `pull` field, the FORMAT stat tile's `format_caption`, a `watch_list` entry body, and the main narrative body paragraph. (URL: /shows/survivor/season/survivor-50, source: critique-pass-123) — RESOLVED f1427b29: kept `format_caption` as the sole owner of the literal "tribe colors, food rations, the final stretch" list; rewrote `pull` to reference the fan vote's effect ("shaping the game before a single tribe stepped off the boat"), rewrote the `watch_list` Ep 2 body to drop the re-enumeration ("watch how it feels to play a game whose format the audience picked before anyone set foot on Monuriki"), and rewrote the body paragraph to focus on the vote's scale ("casting votes across four rounds... before a single tribe reached the Mamanucas") instead of repeating the item list. Content-only, three fields, one file. Spoiler discipline P0 intact — no outcome/elimination/winner facts touched. Verify gate green: 197 test files / 3600 unit tests, content:check ok (68 shows/1046 seasons/68 canons/181 themes/3 legal docs), build clean, 4874 e2e (30.4m). Closes the pass-123 MED finding.

- [x] [LOW] [authed] /shows/big-brother — `seasons: 26` in `content/shows/big-brother.md` may be stale: Big Brother Season 27 is believed to have aired Summer 2025, but the seasons count, blurb ("26 seasons. The house is always watching."), and tagline ("26 seasons of houseguests…") all hardcode 26 and no season file exists under `content/shows/big-brother/seasons/` for S27. The show carries `status: airing`. Verify the current aired-season count at author time; if S27 has aired, update `seasons: 27`, the blurb, the tagline, and scaffold the S27 season file per bearings Rule 2. Spoiler discipline P0 intact. (URL: /shows/big-brother, source: critique-pass-54) — RESOLVED (verified stale at pass-117, cloud march tick): `content/shows/big-brother.md` now reads `seasons: 27`, blurb "27 seasons. The house is always watching.", tagline naming 27 seasons; `content/shows/big-brother/seasons/27-a-summer-of-mystery.md` is filed and complete. This row was orphaned in Pending without a proper Done move despite the fix landing under commit 4350e0d (referenced inline but never migrated) — closing it now to stop it competing for `/iterate` cycles as a live finding.

- [x] [MED] [anon] /shows/ink-master/season/season-one — the document title stutters the season number twice, once as digit and once spelled out: "Ink Master S1 — Season One — tiered.tv". The `seasonDisplayTitle()` guard (`src/app/shows/[show]/season/[slug]/page.tsx:103-114`) only suppressed the "S{n}" prefix when `season.title` was exactly the numeral form `Season ${n}` or contained both the show name and the raw digit. Ink Master's frontmatter title is the spelled-out "Season One" (`content/shows/ink-master/seasons/01-season-one.md`), so neither branch fired. (URL: /shows/ink-master/season/season-one, source: critique-pass-92) — RESOLVED: broadened `seasonDisplayTitle()` (`src/app/shows/[show]/season/[slug]/page.tsx`) to also match the spelled-out generic label — built via `numberToWords(season.number)` from `src/lib/show-tenure.ts`, capitalized to "Season One"/"Season Two"/etc. — so the prefix drops for that form the same way it already did for the numeral form. Titles carrying extra info beyond the bare label (e.g. "Season Three: Redemption") still keep the "S<N>" prefix. Applies cleanly across all 4 Ink Master seasons (all use the bare spelled-out form). Chrome/code-only, one function. Added 2 unit tests covering the new branch and the non-firing case. Spoiler discipline P0 intact.

- [x] [MED] [anon] /shows/masterchef-australia/season/open-call — the pass-109 fix for this page's HIGH duplication finding (`fdb5e78d`) resolved the original four/five-way repeat but introduced a smaller two-way echo of its own: the `lede` and the markdown body both anchor on the identical clause "The panel enters its third season unchanged," each followed by a different but redundant aside naming the same four judges' continuity. Confirmed via direct file read: `content/shows/masterchef-australia/seasons/18-open-call.md` `lede` (frontmatter) — "The panel enters its third season unchanged — Andy Allen, Poh Ling Yeow, Jean-Christophe Novelli, and Sofia Levin — the format's steadiest lineup yet."; markdown body (below frontmatter) — "The panel enters its third season unchanged — the format's longest-serving lineup — anchoring a run that also brings the audition process back on camera after five years away." Both render a few screen-inches apart on the live page. A third near-echo sits in `watch_list[1].body` — "enter this season as an unchanged four — the format's longest-serving lineup without a single swap" — reusing "longest-serving lineup" from the body almost verbatim. Fix: keep the panel-continuity fact in the `lede` (its natural home, since it opens the page), then rewrite the markdown body's sentence to build on the lede rather than restate it — e.g. lead with what the settled panel *produces* (steadier judging chemistry, faster pacing) instead of re-announcing "third season unchanged"; vary `watch_list[1].body`'s "longest-serving lineup" phrase too since it's now the third occurrence of that exact noun phrase. Content-only, two or three field edits in one file. Spoiler discipline P0 intact (no outcome/elimination content). (URL: /shows/masterchef-australia/season/open-call, source: critique-pass-110) — issue: #767 — RESOLVED 842d23d7: `lede` left untouched (its natural home for the panel-continuity fact). Markdown body rewritten to lead with what a settled panel produces (steadier judging chemistry, no shake-in period) instead of re-announcing "third season unchanged." `watch_list[1].body` rephrased to drop "longest-serving lineup," now reading "return as the same four for a third straight season — no swaps, no additions." Content-only, two field edits in one file. Verify gate green: 195 test files / 3555 unit tests, test:scripts 145/0 fail, content:check ok (68 shows/1044 seasons), build clean, 4865 e2e (27.2m). Closes #767.

- [x] [MED] [anon] /themes/the-anchor-count-set-the-ceiling — entry #15 broke the list's own anonymization convention by naming real cast members (Kandi Burruss, Kenya Moore), the only entry in the set of 16 to do so. (URL: /themes/the-anchor-count-set-the-ceiling, source: critique-pass-102) — issue: #765 — RESOLVED cbd78f68: rewrote the blurb to "Two long-tenured anchors try to steady a roster that's otherwise almost entirely new, and the math is lopsided — two founding names against five people building history from zero." — matches the list's established anonymized register, no cast names. Content-only, one field. Verify gate green: 195 test files, content:check ok, build 1509 pages, e2e 4865/4865 (30.0m). Closes #765.

- [x] [HIGH] [authed] /shows/survivor?view=community, /shows/masterchef-australia?view=community (systemic to `/shows/[show]?view=community`) — the community pane's "this week's question" card (`src/components/canon/CommunityWeeklyQuestionCard.tsx`) invited the signed-in reader to act — "Your vote feeds the next update. One vote per reader; change your mind within 72h." — but rendered no interactive control and no link to where voting actually happens (the season rows in `CommunityRankList`). **Bumped MED→HIGH at pass-108** after reproducing the identical structure on a second show (masterchef-australia). (URL: /shows/survivor?view=community, source: critique-pass-106; reproduced: /shows/masterchef-australia?view=community, source: critique-pass-108) — issue: #766 — RESOLVED 3ed3c5da: implemented fix option (a) from the finding — added a conditional "Cast it on a season below." link on the card, pointing at a new `#community-rank-list` anchor added to `CommunityRankList`'s wrapper. The link only renders when `community.entries.length > 0` (i.e. when the ranked season list actually renders below the card — a show with zero community entries renders the empty state instead, so the card must not promise a target that isn't there). Threaded `hasRankedSeasons` prop through `ShowRanking.tsx` into `CommunityWeeklyQuestionCard.tsx`, added `.cp-cq-link` styling in `canon.css`, updated all 5 existing component tests for the new required prop and added 2 new tests covering the link's presence/absence. Verify gate green: 195 test files, content:check ok, build 1509 pages, 4865 e2e (30.0m). Closes #766.

- [x] [HIGH] [authed] /shows/love-island-us/season/fiji-2026 — page overflows the 375px mobile viewport horizontally (Playwright-measured `scrollWidth` 384px vs `innerWidth` 375px), the only one of five URLs walked this pass where this happens; the same page is clean at desktop (1280px), and sibling season pages walked in the same pass (Big Brother S27, Ultimatum S4) measure exactly 375/375 at mobile. (URL: /shows/love-island-us/season/fiji-2026, source: critique-pass-101) — issue: #759 — RESOLVED 5575ae83: root cause was a CSS cascade source-order bug, not either of the two candidate causes named in the original finding. The mobile `@media (max-width: 560px) { .ep-foot { white-space: normal; ... } }` override was declared *before* the unconditional base `.ep-foot { white-space: nowrap; ... }` rule in `src/styles/screens.css` — equal specificity means source order decides, so the base rule always won and the mobile override was silently clobbered at every viewport width, leaving the season's long `episode_heat_caption` unwrapped. Moved the mobile override to after the base rule; no selector or specificity change. Verified via Playwright on the target page and sibling season pages (Big Brother S27, Ultimatum S4) — clean at 375px, no regression. Verify gate green: typecheck/content-check/unit tests clean, build (1506 pages), 4856 e2e (30.6m). Closes #759.

- [x] [HIGH] [authed] /themes/best-post-merge — entry #08 (Survivor S45) labels the season "SURVIVOR · S45 · MOM I WON," directly telegraphing a finale outcome (a winner exists and delivers an on-camera line to her mother about winning) two lines below the page's own "NO SPOILERS · REVIEWED" badge. agents.md §7 defines "winners... finale outcomes" as P0 spoilers; only format/casting/location/tonal shifts are fair game. Root cause is systemic, not new to this list: `content/shows/survivor/seasons/45-mom-i-won.md` sets `title: Mom I Won` as the season's canonical title, which a prior fix (issue #101, critique-pass-1) deliberately propagated to every surface referencing this season — the season's own page H1 and `content/shows/survivor/canon.md`. Spoiler discipline P0 — same-day-patch priority. (URL: /themes/best-post-merge, and systemically /shows/survivor/season/mom-i-won, /shows/survivor/canon, source: critique-pass-105) — issue: #753 — RESOLVED 1885b12e: renamed the season's `title` field from "Mom I Won" (the real CBS finale-episode title) to "Survivor 45," matching the plain numeric convention every neighboring season (42, 43, 44, 46-49) already uses. Repropagated across `canon.md`'s heading + body copy and the three themed-list `season_label` fields that actually carried the old label (`best-post-merge`, `running-long-running-short`, `survivor-pillars`) — a corpus-wide grep found the row's "6+ themed lists" claim overstated: `best-finales`, `best-newbie-casts`, `best-non-winning-runs`, and `best-reunion-specials` reference other Survivor seasons, not S45, so they needed no change. Content-only, no schema/URL change (file-slug `45-mom-i-won.md` and its route are left as-is per the row's own scoping — the visible `title:` field was the leak). Verify gate green: 195 test files / 3547 unit tests, content:check ok (68 shows/1043 seasons/68 canons/174 themes/3 legal docs), build clean (1501 pages), 4841 e2e (29.2m). Closes #753.

- [x] [MED] [anon] /shows/traitors-uk/season/series-1 — the FILMED stat tile's caption is a near-bare restatement of the `location` field it sits under, the same defect class the pass-89 #551 fix targeted, but it slips through because the shipped regression test only matches the literal preposition "in," not "at." `content/shows/traitors-uk/seasons/01-series-1.md`: `location: "Ardross Castle, Scottish Highlands"` / `filming_caption: "Filmed at Ardross Castle, Scottish Highlands"` — `isBareRestatement()` in `src/content/__tests__/filming-caption-distinct.test.ts` (~line 19) only normalizes against `Filmed in ${location}`, so this "Filmed at" variant passes the test green while still reading as a bare restatement to a reader. Fix: broaden `isBareRestatement()` to match any "Filmed <preposition> <location>" form (in/at/on/near), not just the literal word "in," then rewrite `filming_caption` to add real texture. Content-only + a one-line test-helper broadening. Spoiler discipline P0 intact (production/location detail only). (URL: /shows/traitors-uk/season/series-1, source: critique-pass-91) — issue: #563 — RESOLVED cbce54f: broadened `isBareRestatement()` to the full preposition set (in/at/on/near), then rewrote `filming_caption` to "Ardross Castle · Scots Baronial towers rebuilt in the 1850s" (scout-verified: architect Alexander Ross, for Sir Alexander Matheson). The broadened check surfaced a second, previously-unfiled real violation on the same scan: dragrace-uk series-1's `filming_caption: "Filmed at 3 Mills Studios, London"` was an identical bare restatement of `location: "3 Mills Studios, London"` — fixed in the same commit to "3 Mills Studios · site of Britain's largest surviving tidal mill" (scout-verified). dragrace-uk series-2's "Filmed at Pinewood Studios, Buckinghamshire" was checked and does NOT match its `location` field verbatim (location carries a trailing ", England" the caption omits), so it stays out of scope for this fix. No outcome exposure on either show. Verify gate green: 195 test files / 3374 unit tests, content:check ok (68 shows/742 seasons/68 canons/12 themes/3 legal docs), build (1038 pages), 3438 e2e (20.2m). Closes #563.

- [x] [MED] [anon] /shows/married-at-first-sight-australia/season/the-original — the single fact "three couples, matched sight unseen" is restated across five separate fields rendered on the same page: hero eyebrow ("Three couples, one Sydney experiment"), lede ("three couples matched sight unseen by relationship experts"), pull quote ("Three couples, matched sight unseen, married before they'd said more than vows"), and both the FORMAT stat tile (`format_caption: "Three couples, matched by experts, married before they'd spoken"`) and CAST SIZE stat tile (`cast_size_caption: "Three couples, six strangers matched sight unseen"`) — the last two stack directly on top of each other on the page and both open with the identical clause "Three couples,". Reads templated on a freshly-seeded single-season show rather than each element adding new information. Source: `content/shows/married-at-first-sight-australia/seasons/01-the-original.md`. Fix: vary the CAST SIZE caption to add a fact not already stated twice above it (e.g. reference the expert panel makeup or the timeline to Decision Day instead of repeating "three couples matched sight unseen"). Content-only, one field. Spoiler discipline P0 intact. (URL: /shows/married-at-first-sight-australia/season/the-original, source: critique-pass-91) — issue: #562 — RESOLVED a1d88b5: rewrote `cast_size_caption` to "Six strangers with weeks to reach Decision Day" — drops the fifth "matched sight unseen" restatement, adds a fact (the Decision Day timeline) not already carried by the other four fields on the page, stays anchored to the CAST SIZE tile via "Six strangers" (cast_size: 6). No outcome exposure. Verify gate green: 195 test files / 3374 unit tests, content:check ok (68 shows/742 seasons/68 canons/12 themes/3 legal docs), build (1038 pages), 3438 e2e (20.1m). Closes #562.

- [x] [MED] [authed] /shows/married-at-first-sight-australia/canon — the sole canon entry's community pill renders "↑ 0" (up-arrow paired with zero movement), a self-contradictory shape on a page where the entry hasn't moved (no votes cast yet). `content/shows/married-at-first-sight-australia/canon.md:24`: `community_rank_hint: rank=1 delta=0 sentiment=up`. A corpus-wide grep across every `content/shows/*/canon.md` found 547 total `delta=0` entries; 545 correctly pair with `sentiment=hold` (including the sibling freshly-seeded show `traitors-uk/canon.md:23`, which renders the correct "◆ hold" state) — two outliers pair `delta=0` with `sentiment=up`: this row's Married at First Sight Australia entry and a second, previously-unfiled instance at `content/shows/survivor-australia/canon.md:31`. `communitySignalForSeason()` in `src/lib/community/live.ts` derives sentiment from delta on the live-votes path but the static-frontmatter fallback (used for un-voted freshly-seeded shows) trusts the authored value verbatim, so authoring drift isn't caught. Fix: change both lines to `sentiment=hold`, matching the corpus-standard pairing; consider a `content-check.ts` invariant asserting `delta === 0` implies `sentiment === hold` across the corpus so future authoring drift is caught at verify-gate time rather than by critique. Content-only, two one-line edits + optional lint addition. Spoiler discipline P0 intact (community-sentiment chrome only, no outcome exposure). (URL: /shows/married-at-first-sight-australia/canon, /shows/survivor-australia/canon, source: critique-pass-91) — issue: #561 — RESOLVED 58e7350: changed both outlier lines to `sentiment=hold`, matching the corpus-standard pairing (`content/shows/married-at-first-sight-australia/canon.md:24`, `content/shows/survivor-australia/canon.md:31`). Also added the suggested `content-check.ts` invariant — `collectCanonDeltaZeroSentimentUpIssues()`, wired STRICT — asserting `delta === 0` implies `sentiment === hold` across the corpus, plus 6 colocated pinning tests in `content-check.test.ts`, so future authoring drift trips the verify gate instead of waiting for the next critique pass. Verify gate green: 195 test files / 3374 unit tests, content:check ok (68 shows/742 seasons/68 canons/12 themes/3 legal docs), build (1038 pages), 3438 e2e (19.8m). Closes #561.

- [x] [LOW] [anon] /themes/best-villain-editing — entry #01's (Survivor S20, Heroes vs. Villains) opening sentence reads "Half the cast was cast as villains on purpose, reputations already loaded in." The repeated "cast...cast" in one clause reads as an unintentional word-tic rather than the plain-spoken, edited voice the rest of the list carries. Fix: rephrase to avoid the repetition, e.g. "Half the tribe walked in already labeled villains, reputations loaded in before the first vote." Content-only, one field. Spoiler discipline P0 intact. (URL: /themes/best-villain-editing, source: critique-pass-80) — issue: #555 — RESOLVED 3262a19: rewrote the opening sentence to "Half the tribe walked in already labeled villains, reputations loaded in before the first vote." (the row's own suggested rewrite, verbatim) — drops the "cast...cast" repetition, preserves the editorial point, sentences two and three of the blurb untouched. Content-only, one field. Verify gate green: 195 test files / 3358 unit tests, content:check ok (63 shows/737 seasons/63 canons/12 themes), build (1013 pages), 3358 e2e (20.3m). Closes #555.

- [x] [MED] [anon] /shows/bachelor-in-paradise/season/tulum (sitewide — every season page) — the anon vote-row eyebrow read "Cast a vote / sign in to weigh in," implying an anonymous visitor's vote wouldn't count unless they signed in, contradicting `content/legal/about.md:47`'s stated 0.1x anon-vote weight and `VotePair.tsx`'s unconditional POST to `/api/vote` regardless of `signedIn`. Shared `VoteRowHead` component — the copy rendered on every season page in the catalog. (URL: /shows/bachelor-in-paradise/season/tulum, source: critique-pass-89) — issue: #548 — RESOLVED 96f264c: rewrote `COPY.anon.meta` from `'sign in to weigh in'` to `'counts more once you sign in'` in `src/components/composition/VoteRowHead.tsx`; updated the two colocated test files (`VoteRowHead.test.tsx`, `SeasonInfoCard.test.tsx`) asserting the old string. Content/component copy-only, one string. Verify gate green: 194 test files, build (1013 pages), 3358 e2e (20.1m). Closes #548.

- [x] [MED] /shows/the-circle/season/inaugural-season — canon rationale restates the page template's own "only entry" fact, hedged with "by default." Rendered copy: "Sole entry in the Circle Editor's Canon so far. Season one is the only entry ranked so far, and it takes the top slot by default — it's the blueprint every later season builds on." (template prefix from `src/app/shows/[show]/season/[slug]/page.tsx:310` concatenated with the canon.md rationale, which opened with the same claim the template already made). (URL: /shows/the-circle/season/inaugural-season, source: critique-pass-88, pass: 88 commit b6bc64b) — issue: #545 — RESOLVED 07bcf38: trimmed the canon.md rationale's opening clause so it starts at "It's the blueprint every later season builds on." — drops the redundant "only entry ranked so far... by default" restatement and hedge, rest of the paragraph unchanged (90 words, within the 80-120 range). Verify gate green: 194 test files / 2833 unit tests, content:check ok (63 shows/737 seasons), build (1013 pages), 3358 e2e (19.2m). Closes #545.

- [x] [MED] [authed] /shows/the-circle/season/inaugural-season (and ≥10 other sub-10-season shows) — the site-wide default vote question ("Does this belong in the community top 10?") rendered verbatim on shows whose total season count can never reach 10 (The Circle at 7 total seasons, and at least 10 of 63 shows sub-10: Alone: Frozen, Alone: The Skills Challenge, Below Deck Adventure, Perfect Match, The Traitors, The Ultimatum, Below Deck Down Under, Too Hot to Handle, Love Island US, Jersey Shore), making the question logically empty since every season trivially clears a bar the catalog can't exceed. Fallback source: `src/app/shows/[show]/season/[slug]/page.tsx:494`; zero of 737 season files set a custom `vote_question` override. Spoiler discipline P0 intact (vote-prompt copy only). (URL: /shows/the-circle/season/inaugural-season, source: critique-pass-88) — issue: #544 — RESOLVED 2deb7fd: shipped a `voteQuestionFor(show)` helper instead of per-show content edits — shows with ≥10 seasons keep the original "top 10" phrasing (no regression), shows with 2-9 seasons scale to "top N", and 1-season shows drop the numeric framing entirely ("Does this season hold up?"). One code change covers every current and future sub-10-season show. 5 new colocated unit tests. Verify gate green: 194 test files / 2833 unit tests, content:check ok (63 shows/737 seasons), build (1013 pages), 3358 e2e (19.4m). Closes #544.

- [x] [LOW] [anon] /shows/top-chef "KISH ERA" filter tab is opaque to a first-time visitor who does not already know that Kristen Kish replaced Padma Lakshmi as Top Chef host in Season 21. "PADMA ERA" is partially self-explanatory; "KISH ERA" carries no expansion, no sub-label, and no parenthetical season range to clarify who "Kish" is or when the era starts. The "KISH ERA" tab covers the most recent seasons — the ones a current viewer is most likely to be watching. Verified on the pass-51 anon walker capture: filter tabs render "ALL 22 / PADMA ERA / KISH ERA / VIEW · CANON ORDER" with no further identification. Bearings voice cue — knowledgeable peer; a peer provides the shorthand when the audience may not share it. Fix: expand the tab label to "KRISTEN KISH ERA" or add a parenthetical season range "KISH ERA (S21–22)" so the filter is legible without prior Top Chef knowledge. Spoiler discipline P0 intact (label only). (URL: /shows/top-chef, source: critique-pass-51) — 1354924 — issue: #543 — RESOLVED 2874221: added a season range to the `kish` era_bands label in `content/shows/top-chef/canon.md` — `Kish era` → `Kish era (S21–S22)` (verified S20 premiered 2023-03-09, inside the existing Padma-era [2006, 2023] range; S21 2024-03-20 and S22 2025-03-13 both inside the Kish-era [2024, 2026] range). Rendered verbatim by `src/components/canon/CanonEraToolbar.tsx`; no code change needed. `last_revised` bumped to 2026-07-11. Verify gate green: 194 test files / 2828 unit tests, content:check ok (63 shows/737 seasons), build (1013 pages), 3358 e2e (19.2m). Closes #543.

- [x] [MED] [anon] /shows/the-apprentice — time-to-first-byte on this page (and on `/shows/survivor`, the site's other largest-canon show) runs 3-6x slower than every other page walked this pass, correlating specifically with canon size rather than being apprentice-specific. Repeated `curl -w` samples: `/shows/the-apprentice` → 1.68s / 1.11s / 1.15s / 0.90s; `/shows/survivor` → 1.13s / 0.90s / 0.86s; versus `/` → 0.23s, `/shows` → 0.16s, `/themes/firsts` → 0.30s, `/shows/chopped/season/season-1` → 0.34s (Chopped has only 1 canon entry vs. Apprentice's 10 and Survivor's full run). `src/app/shows/[show]/page.tsx:37` sets `export const dynamic = 'force-dynamic'` deliberately — the phase-35 comment explains this renders the page per request so the live community-ranking aggregate never goes stale (the fix for a prior "refresh always shows 0" bug) — that freshness guarantee is correct and should not be reverted. But the TTFB gap scaling specifically with canon/season count, not shared by the small-canon Chopped page, suggests the per-request cost of assembling the page (`getAllSeasons` / `getCanon` / `getCommunityRanking`) grows with season count in a way that hasn't been profiled. Fix: profile where the per-request time goes on large-canon show pages — likely candidates are the community-ranking aggregate query's scaling with row count, or redundant content-file reads across the season list — and optimize the hot path (indexing, memoizing within the request, or narrowing the query) without reintroducing page-level caching that would resurrect the staleness bug the `force-dynamic` render was added to fix. (URL: /shows/the-apprentice, source: critique-pass-87) — issue: #541 — RESOLVED 75108d4: profiling `getCommunityRanking` (`src/lib/community/ranking.ts`) found the root cause was not query cost but request shape — it awaited four independent Supabase reads (the `compute_weighted_rank` RPC, trailing-7d voters, baseline snapshot, latest snapshot) one at a time, so wall time was their sum. None depends on another's result; switched to `Promise.all` so the four fire concurrently, bounding per-request time by the slowest single query instead of the total. `force-dynamic` rendering (the phase-35 freshness fix) is untouched — no caching reintroduced. Verify gate green: 194 test files / 2828 unit tests, content:check ok (63 shows/732 seasons), build (1008 pages), 3343 e2e (20.5m). Closes #541.

- [x] [MED] [anon+authed] /shows/chopped/season/season-1 — the PREMIERED stat tile's caption repeats the month/year already shown one line above it and drops the day-of-month, instead of adding a genuine new fact the way the site's established convention does. `content/shows/chopped/seasons/01-season-1.md`: `premiere_date: "2009-01-13"` renders as "Jan 13, 2009" in the stat value, and `premiere_caption: "Food Network · Tuesday, January 2009"` renders directly below it — restating "January 2009" (already visible one line up) while dropping the day number, so the two lines read as a truncated typo pair rather than value+detail. Compare the established convention on other freshly-scaffolded shows: Survivor S1 (Borneo) pairs its date with `"CBS · Wednesday 8/7c"` (a real timeslot fact, not a date restatement); RHOSLC/Southern Charm S1 pair theirs with network+month only in a form that doesn't duplicate the exact stat-value string. Fix: rewrite `premiere_caption` in `content/shows/chopped/seasons/01-season-1.md` to add a real production fact (a confirmed network timeslot, e.g. "Food Network · Tuesdays at 10pm ET" if verifiable) instead of restating the date; if no timeslot can be confirmed, drop to weekday-only ("Food Network · Tuesday") so it doesn't duplicate the month/year already shown above it. Content-only, one field. Spoiler discipline P0 intact (premiere scheduling only). (URL: /shows/chopped/season/season-1, source: critique-pass-87) — issue: #540 — RESOLVED c83ce5d: scout research found no sourced clock-time for the January 2009 debut slot (confirmed via Wikipedia/epguides that S1 aired weekly on Tuesdays, Jan 13–Apr 7 2009, but no primary TV-listing source for the 9pm-vs-10pm clock time), so per the finding's own fallback path `premiere_caption` drops to weekday-only ("Food Network · Tuesday") rather than restating the date. Verify gate green: 194 test files / 2828 unit tests, content:check ok (63 shows/732 seasons), build (1008 pages), 3343 e2e (17.5m). Closes #540.

- [x] [MED] [anon] /shows — the B-tier canon-progress pill renders a bare `N / T` fraction (e.g. "in progress · 1 / 3" on the Chopped tile) with no label, title attribute, or aria-text naming what the numbers count. `src/components/shows/ShowsStatusPill.tsx:10` renders `` `in progress · ${shipped} / ${target}` `` where `shipped` is the count of canon entries currently shipped for the show and `target` is `CANON_TARGET` (3, the canon-mode promotion season floor per phase 26 — see `src/components/shows/canonProgress.ts`), but nothing in the markup states this. On the Chopped tile the "1 / 3" ratio sits directly above the tile's own footer stat "62 seasons · canon in review" — two different numbers on one card with no way for a first-time reader to tell that 1/3 counts canon entries toward a review floor, not seasons ranked against the show's 62-season total. Distinct from the already-fixed pass-52 #417 bug (which guarded against `shipped >= target` producing an out-of-range ratio like "5 / 3" — that guard works correctly and is why The Apprentice's tile correctly shows the no-ratio "review in progress" label instead of a ratio, since its 10 shipped canon entries exceed the target-3 floor); this finding is about the ratio's own legibility on the tiles where it's still shown (shipped < target). Fix: add a `title` attribute to the pill (e.g. `title="Canon entries published toward the review floor"`) or change the visible literal to something self-explanatory (e.g. "1 of 3 canon entries reviewed") so the fraction can't be misread against the adjacent season-count stat. Spoiler discipline P0 intact (display-state only). (URL: /shows, source: critique-pass-87) — issue: #539 — RESOLVED 21a67f4: added a `title` attribute to `ShowsStatusPill` explaining the ratio in both states ("N of T canon entries published toward the review floor" / "Canon entries published, under editorial review"); visible label text unchanged so existing snapshot assertions still pin the literal text. Two new colocated tests assert the title attribute in both branches. Verify gate green: 194 test files / 2828 unit tests, content:check ok (63 shows/732 seasons), build (1008 pages), 3343 e2e (19.4m). Closes #539.

- [x] [LOW] [authed] /shows/alone — The canon rationale and era toolbar reference 'the no-host era' without naming which seasons it covers, while 12 seasons are aired and only 5 are currently in canon. Era tab labels read 'NO-HOST ERA' and 'COLBY ERA' with no parenthetical season ranges. A first-time visitor cannot map the era labels to a season range and the gap between 12 aired seasons and 5 canon entries is visible but unexplained. Fix: add season-number ranges to the era tab labels in `content/shows/alone/canon.md` (e.g. 'NO-HOST ERA (S1–5)' and 'COLBY ERA (S6–12)') or to the 'Who ranks it' prose in the canon header, making the partial-coverage boundary explicit for first-time visitors. Content fix. Spoiler P0 intact. (URL: /shows/alone, source: critique-pass-53) — a124b6b — issue: #537 — RESOLVED 9ce2ce4: added "(seasons 1-6)" / "(seasons 7-12)" parentheticals to the meth_who_p field (the "Who ranks it" prose, which renders directly above the era toolbar chips) rather than the era_bands chip labels themselves — no other show's era chip labels carry season ranges, so this keeps the corpus-wide chip format consistent while resolving the coverage-mapping gap. last_revised bumped to 2026-07-10. Verify gate green: fast gate (content:check ok, 63 shows/732 seasons), build (1008 pages), 3343 e2e (19.5m). Closes #537.

- [x] [MED] [anon] /shows/summer-house/season/amagansett — the FILMED stat tile's caption restates the location value instead of adding a founding-season editorial note, unlike the two other freshly-scaffolded Bravo founding seasons that already establish the pattern. `content/shows/summer-house/seasons/01-amagansett.md` frontmatter: `location: "Amagansett, New York"` / `filming_caption: "Amagansett, New York · the Hamptons"` — restates the exact location string and tacks on the broader region name, adding no distinct editorial fact. Compare the sibling founding-season convention already shipped on comparable freshly-added Bravo shows: RHOSLC S1's `filming_caption: "Salt Lake City · first shoot in an LDS-adjacent world"` and Southern Charm S1's `filming_caption: "Charleston · Bravo's first shoot in this social world"` — both add a real founding-season note ("first shoot in [X] world") rather than repeating the location. (`premiere_caption: "Bravo · January 2017"` was also checked against `eyebrow: "Premiered January 2017 · Bravo"` but matches the established site-wide convention already seen unmodified on RHOSLC/Southern Charm S1 — reordered, not a defect — so it's excluded from this finding.) Fix: rewrite `filming_caption` in `content/shows/summer-house/seasons/01-amagansett.md` to add a founding-season note in the same shape (e.g. "Amagansett · the format's first Hamptons shoot" or a real production detail), following the RHOSLC/Southern Charm convention instead of restating the location. Content-only, one field. Spoiler discipline P0 intact (location/production commentary only). (URL: /shows/summer-house/season/amagansett, source: critique-pass-86) — issue: #536 — RESOLVED a46c21f: rewrote filming_caption to "Amagansett · Bravo's first shared-rental shoot", following the RHOSLC/Southern Charm founding-season convention instead of restating location. Verify gate green: 194 test files, content:check ok (63 shows/732 seasons), build (1008 pages), 3343 e2e (19.6m). Closes #536.

- [x] [MED] [authed] / — the home hero's document heading order is broken: `<h2 class="cover-name">Survivor</h2>` (inside the "Currently featured" promotional cover card, `src/components/home/HomeHero.tsx:61`) renders earlier in the raw SSR DOM than the page's only `<h1 class="home-hero-title">` ("The seasons, ranked. no spoilers.", `HomeHero.tsx:103`). Confirmed via direct authenticated `curl` of the raw SSR HTML — not a hydration artifact; the server-rendered order genuinely has the h2 first. Screen-reader users navigating by heading level land on an h2 before any h1 exists on the page, which breaks the expected document outline on the site's highest-traffic surface. This is a best-practice a11y rule (axe `heading-order`), not one of the WCAG 2.1 AA critical-only checks the phase-18 e2e gate hard-blocks on, which is how it shipped unnoticed. Fix: swap which element gets which level — either wrap the primary hero title (`.home-hero-title`) as the true first heading in DOM order, or demote `.cover-name` to a non-heading element (e.g. a styled `<p>` or `<span>`) since it's a secondary promotional card label, not part of the page's core content outline. Recommend the latter (smaller blast radius, the cover card is decorative/promotional, not a content section). Pin: extend or add a colocated `HomeHero.test.tsx` case asserting the rendered heading roles are `['heading-level-1: home-hero-title']` with no `h2` (or, if `cover-name` stays an `h2`, asserting it appears after the `h1` in DOM order — bidirectional drift guard). Spoiler discipline P0 intact (chrome-only change). (URL: /, source: critique-pass-85) — issue: #528 — RESOLVED this commit: demoted `.cover-name` from `<h2>` to `<p>` in `HomeHero.tsx` — the promotional cover card's show name is now a secondary label, not part of the page's content outline, so the h1 (`.home-hero-title`) is the page's only heading. All CSS on `.cover-name` was already class-based with explicit `margin: 0`, so the tag swap has no visual effect. Pinned with a new colocated test asserting the page renders exactly one heading role (the h1). Verify gate green: 194 test files / 2826 unit tests, content:check ok (58 shows/727 seasons), build (983 pages), 3263 e2e (18.6m). Closes #528.

- [x] [LOW] [anon] /shows/perfect-match — the hero stat reads "4 SEASONS AIRED" but only season 1 has been scaffolded and ranked (`content/shows/perfect-match/seasons/` contains only `01-season-1.md`; `/shows/perfect-match/season/season-2` 404s), and there's no in-page affordance explaining that the other three aired seasons simply haven't been ranked yet. A first-time visitor drawn in by "4 seasons" has no season-2/3/4 to reach and no signal that this is a content-coverage gap rather than a broken link. This is the expected shape for a freshly-added show under the site's standing content-velocity mandate (one show scaffolded per tick, seasons drained incrementally) — not a bug, but worth a small UX affordance. Fix: add a lightweight "seasons not yet ranked" note near the ALL/season selector (e.g. "3 more seasons aired — ranking in progress") so the gap reads as roadmap rather than missing content. Content/chrome, small addition. Spoiler discipline P0 intact. (URL: /shows/perfect-match, source: critique-pass-79) — issue: #526 — RESOLVED 44a1a9c: `CanonEraToolbar` (shared across every show's canon page) now accepts an optional `airedSeasons` prop; when it exceeds the ranked-entry total, a coverage note renders below the toolbar ("N more seasons aired — ranking in progress."). `ShowRanking` passes `show.seasons` through, so the fix generalizes to every partially-drained show in the catalog, not just Perfect Match. 4 new colocated tests. Verify gate green: 194 test files / 2825 unit tests, content:check ok (58 shows/727 seasons), build (983 pages), 3263 e2e. Closes #526.

- [x] [HIGH] [authed] /shows/married-at-first-sight/season/boston (and /shows/american-ninja-warrior/season/standard-course — reproduced) — on season pages that are NOT edge-cached (`cache-control: private, no-store`, `x-vercel-cache: MISS` — confirmed via a direct `curl` with the authed session cookie attached), the server correctly resolves the signed-in state for the header in this exact response (`data-testid="site-header" data-signed-in="true"`) but the vote-pair and comment-input on the same raw HTML still render the anonymous shell: `data-vote-head-state="anon"` with copy "sign in to weigh in," and a `<a class="comment-stub" href="/sign-in?return=...">Sign in to comment. →</a>` instead of the compose box. This is not the cached-page hydration trade-off Phase 36 documented (see the home-page row below) — this page is rendered per-request, and the header two hundred lines earlier in the identical response already proves the server has the session. The vote-pair and comment-input components simply aren't reading the auth context the header already resolved; client JS repairs it after mount (confirmed via the Playwright post-hydration capture showing "YOUR VOTE" / "as @e2e / Write"), so a signed-in member briefly sees the wrong CTA on the exact surface — voting and commenting — that Phase 36 ("auth-state chrome + comment read/display," commit e95b019) shipped to fix. Fix: have `VotePair` and the comment composer read the same per-request auth context `HeaderView` already resolves on non-cached routes (mirroring the client-fetch-and-suppress pattern already used for `HomeDualCallout`, #490), rather than defaulting to the anon shell and relying on hydration. A prior instance of exactly this "stale signed-out state exposed for the request's full server-render lifetime" class (`HomeDualCallout`, #490) sat unaddressed for 12 passes before its severity was bumped from LOW to MED for aging past what a top-fold surface should tolerate — filing this one HIGH from the start rather than repeating that arc, since it directly undermines the vote/comment CTAs Phase 36 was scoped to fix. Spoiler discipline P0 intact (auth-state chrome only, no outcome exposure). (URL: /shows/married-at-first-sight/season/boston, /shows/american-ninja-warrior/season/standard-course, source: critique-pass-84) — issue: #522 — RESOLVED 5ee1411: resolved the auth-state SSR gap by reading auth0.getSession() directly in the season page server component (mirroring the shared Header's own pattern) and threading initialSignedIn/initialHandle into VotePair, VoteRowHead, and CommentThreadLive so all three seed their signed-in state synchronously on the raw SSR response, before any client fetch runs. Added unit coverage (synchronous pre-fetch seeding assertions in VoteRowHead.test.tsx, VotePair.test.tsx, CommentThreadLive.test.tsx) and e2e coverage (context.request raw-HTML assertions bypassing Playwright's auto-wait, in vote-state-pill.spec.ts and comment-read.spec.ts) so this class of pre-hydration flash is now caught structurally, not just observed by hand. Verify gate green: 194 test files / 2819 unit tests, content:check ok (58 shows/727 seasons), build (983 pages), e2e 3263 passed (19.3m). Closes #522.

- [x] [LOW] [anon] /shows/shark-tank — the tier-filter control renders as the run-together string "ALL 1" directly above "VIEW · CANON ORDER" with no separator, reading as one odd two-word label rather than a tab ("ALL") plus a count badge ("1"). Fix: add visible separation (parens, pipe, or distinct styling) between the ALL tab label and its count so it doesn't concatenate in the reflowed/accessibility-tree text. Chrome-only. Spoiler discipline P0 intact. (URL: /shows/shark-tank, source: critique-pass-78) — issue: #520 — RESOLVED 634ff9c: `CanonEraToolbar` (shared across every show's canon page) now wraps the All chip's count in its own `<span className="cp-chip-count">`, styled at reduced opacity in `canon.css`, so the label and count read as visually distinct without added punctuation. Fixes every show, not just Shark Tank. Colocated pin added asserting the count renders in its own span. Closes #520.

- [x] [LOW] [anon] /shows/jersey-shore/season/season-1 (and other single-season, single-list shows) — the "Also appears in" cross-reference section only lists the season's own show canon entry, i.e. "Jersey Shore Season 1 also appears in the Jersey Shore Editor's Canon" — circular, since that's the page the reader is already looking at (it's the season within its own show's canon), and adds no new information. On the mature reference page (`/shows/survivor/season/heroes-vs-villains`) this section surfaces genuinely distinct themed-list cross-references (six of them). The section reads as a broken cross-reference feature rather than an honest "not enough canons/themes reference this yet" state. Fix: for seasons with no themed-list cross-references yet, either suppress the self-referential canon line entirely or relabel the section (e.g. "In this canon") so a single, self-evident entry doesn't masquerade as a cross-reference list. Likely a small conditional in the season page's "also appears in" block (`src/app/shows/[show]/season/[slug]/page.tsx`, section 06). Spoiler discipline P0 intact (chrome-only). (URL: /shows/jersey-shore/season/season-1, source: critique-pass-68) — 7173f3a — issue: #511 — RESOLVED b3e261b: `appearsInRowsFor()` now returns `{ rows, hasCrossRef }`, with `hasCrossRef` true only when at least one themed-list entry exists (computed before the self-referential canon row is appended). The flag threads through `buildSections()` and the `s-appears` section render to relabel it "In this canon" / "Its Editor's Canon entry." when the only row is the self-reference, vs. "Also appears in" / "Cross-references." when real cross-references exist. Chose relabel over suppress: suppressing the section on zero-cross-ref pages would have broken the pinned e2e assertion in `apps/e2e/tests/link-integrity.spec.ts` (Survivor Gabon, which has zero themed-list cross-refs and asserts `section-appears` is visible with a working canon link). Verify gate green: 194 test files / 2811 unit tests, content:check ok (58 shows/717 seasons), build (973 pages), 3231 e2e. Closes #511.
- [x] [MED] [anon] /shows — the B-tier lede constant still spoke in plural "we" while every other tier lede and the rest of the site's editorial voice has been rotated to first-person singular "I" (issues #306 / #381 / #406 / #408 / #411 / #413). `src/components/shows/tierLede.ts:15` survived every prior singular-editor closure (they hit `HowTiersMove.tsx`, `content/legal/about.md`, and the season page's `whereItSitsCopy()`) as a residual "we". (URL: /shows, source: critique-pass-79) — issue: #499 — RESOLVED: rewrote "we're still working through" to "I'm still working through" in `tierLede.ts`; updated the pinned literal in `tierLede.test.ts`. Single string edit, content/component-only. Verify gate green: 194 test files / 2800 unit tests, content:check ok (58 shows/712 seasons), build (968 pages), 3215 e2e. Closes #499. — 6060f1a

- [x] [MED] [anon] /shows/perfect-match (and /shows/perfect-match/season/season-1) — the show's own copy can't agree on where the season was filmed: the hero blurb and the season's FILMED stat caption both say "villa" while the tagline, canon.md, and the season's own lede/body (appearing on both the show page and the season page) all say "house." `content/shows/perfect-match.md`: `blurb: "...dropped in one villa and rematched."` vs. `tagline: "...get pulled into one house and rematched from scratch..."`; `content/shows/perfect-match/seasons/01-season-1.md`: `filming_caption: "Filmed at a villa outside Panama City"` vs. `lede`/body: "...get pulled into one house and rematched from the ground up." A reader scanning the hero blurb against the body two sections down hits a contradiction on a basic factual detail of a brand-new show's very first page. Fix: pick one noun (recommend "house," since it appears in 4 of the 5 instances including both canon.md and the season body) and align the blurb + filming_caption to match. Content-only, two field edits. Spoiler discipline P0 intact (setting detail only). (URL: /shows/perfect-match, /shows/perfect-match/season/season-1, source: critique-pass-79) — issue: #500 — RESOLVED: aligned `blurb` ("dropped in one villa and rematched" → "dropped in one house and rematched") and `filming_caption` ("Filmed at a villa outside Panama City" → "Filmed at a house outside Panama City") to "house," matching the tagline, canon.md, and season lede/body. Content-only, two field edits. Verify gate green: 194 test files / 2800 unit tests, content:check ok (58 shows/712 seasons), build (968 pages), 3215 e2e. Closes #500. — 37c64f9

- [x] [MED] [anon] /shows/the-voice and /shows/the-voice/season/the-finale — the show's own pages disagreed on how long it ran, and its `status` field contradicted its own finale season's copy. The show page (`content/shows/the-voice.md`) used a live `{yearsWord}` token in its `tagline`/`card_tagline` ("The Voice ran the format for {yearsWord} years..."), which rendered "fifteen years" — but the finale season (`content/shows/the-voice/seasons/29-the-finale.md`) uses static, frozen copy: eyebrow "The Voice closes — the final season of a fourteen-year run" and lede "...the format's fourteenth year on air." A reader visiting both pages in one session got two different tenure counts for the same show. Compounding it: `content/shows/the-voice.md` set `status: hiatus` even though the finale season's own lede unambiguously narrates a permanent ending ("marked the end of The Voice's run on NBC," "brought the show to a close") — compare `content/shows/americas-next-top-model.md`, whose analogous series-finale season pairs with `status: ended`. Root cause of why the automated safety net missed the tenure drift: `scripts/content-check.ts`'s `YEAR_TENURE_RE` (`/\b(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)(?:-\w+)? years\b/gi`) only matches spelled-out tens (twenty through ninety) — teen numbers like "fourteen-year" aren't in the alternation at all. (URL: /shows/the-voice, /shows/the-voice/season/the-finale, source: critique-pass-80) — issue: #504 — RESOLVED: set `status: ended` (matching the ANTM precedent) and rewrote `tagline`/`card_tagline` to drop the live `{yearsWord}` token in favor of literal, frozen "fourteen years" copy, reframed in past tense, matching the finale's own count. Content-only, two field edits. Spoiler discipline P0 intact (tenure-count and status framing only, no outcome referenced). Deferred the regex-widening half of the suggested fix — a corpus scan found ~10 existing teen-number tenure phrases across other shows/seasons/canons that are historical facts anchored to a past season's air date (e.g. Amazing Race S11 "first ten years", Naked and Afraid S18 "twelve years in"), not live claims; widening `YEAR_TENURE_RE` today would break the strict gate on all of them since `TENURE_ANCHOR_ALLOWLIST` only exempts canon-entry sources, not season-level ones. Filed as its own scoped AUDIT.md row (2026-07-08) rather than risking a partial fix in this tick. Verify gate green: 194 test files / 2801 unit tests, 136 script tests, content:check ok (58 shows/712 seasons), build (968 pages), 3215 e2e. Closes #504. — 0c917a9

- [x] [MED] [anon+authed] /shows/shark-tank/season/season-1 (and 132 other season files across 22 shows catalog-wide — systemic) — the FILMED stat tile's value and gloss line are the identical string twice instead of a value/elaboration pair. `content/shows/shark-tank/seasons/01-season-1.md` frontmatter: `location: "Culver City, California"` / `filming_caption: "Culver City, California"` — every other stat tile on the same page pairs a value with a distinct one-line editorial gloss (e.g. EPISODES: "7" / "Seven-episode freshman run"; FORMAT: "Pitch competition" / "Five-shark founding panel"), but FILMED just repeats its own value verbatim as the caption. Not unique to Shark Tank: a catalog-wide scan (`grep` across `content/shows/*/seasons/*.md` comparing `location` to `filming_caption`) found 133 season files across 22 shows with this exact pattern (e.g. Southern Charm season 1 has the identical duplicate), versus shows that do it right (Survivor 49's `filming_caption: "Mamanuca · fifteenth consecutive Fiji shoot"` is a real gloss, not a repeat of `location: "Mamanuca Islands, Fiji"`). This is the same shape of systemic content-authoring gap as the Big Brother canon.md duplication (issue #488) and Love Island UK rationale duplication (issue #459) — a de-duplication convention applied inconsistently across the catalog's growth. Fix: audit season files where `filming_caption === location` verbatim and write a real one-line gloss for each (studio/location detail, shoot-order note, or similar), following the Survivor-49 pattern. Content-only; likely a multi-tick drain given the scope (133 files), same shape as the prior systemic-duplication fixes. Spoiler discipline P0 intact (location/production commentary only). (URL: /shows/shark-tank/season/season-1, source: critique-pass-78) — issue: #498 — a fresh grep at fix-time found 139 matching files (6 more than the original 133 count, from catalog growth since filing). This tick's iterate pass shipped the first drain batch (14 files): shark-tank S1–S6 (the show named in the finding), southern-charm S1, rhod/rhom/rhop/rhoslc S1 (the newer Housewives editions), the-ultimatum S1, below-deck-adventure S1, alone-frozen S1 — all following the Survivor-49 "Place · specific fact" gloss pattern. 125 files remain queued for later drain ticks. This tick's iterate pass shipped the second drain batch (15 files): the Alone family (alone-australia S1–S3, alone US S3/S7/S8/S11/S12) and the Below Deck family (below-deck-down-under S1–S2, below-deck-mediterranean S1/S5/S6/S7/S8) — same gloss pattern, each drawn from the season's own `lede`/`pull` field. 110 files remain queued for later drain ticks. — d93d5c7 — This tick's iterate pass shipped the third drain batch (21 files), closing out five full shows: below-deck-sailing-yacht S1–S5, rhony S1/S2/S5, jersey-shore S2/S4, below-deck-mediterranean S9, and below-deck S1/S2/S3/S5/S6/S7/S9/S10/S11/S12 — same gloss pattern, each drawn from the season's own `lede`/`pull` field. 89 files remain queued for later drain ticks. — 4529bf4 — This tick's iterate pass shipped the fourth drain batch (21 files), closing out two full shows: rhoc S3–S13 and love-is-blind S1–S10 — same gloss pattern, each drawn from the season's own `lede`/`pull` field. 68 files remain queued for later drain ticks. — 86576df — This tick's iterate pass shipped the fifth drain batch (26 files), closing out two full shows: rhoa S1–S11/S13/S15–S16 (14 files) and survivor-australia S1–S12 (12 files) — same gloss pattern, each drawn from the season's own `lede`/`pull`/`eyebrow` field. 42 files remain queued for later drain ticks. — This tick's iterate pass shipped the sixth and final drain batch (42 files), closing out the two remaining shows: The Masked Singer (S1–S13, all 13 season files) and The Voice (S1–S29, all 29 season files) — same gloss pattern, each drawn from the season's own lede/pull/eyebrow field (coach/panelist lineup changes, format milestones, production circumstances). A fresh catalog-wide grep confirms zero remaining location === filming_caption duplicates — drain complete, 0 files remain. — b616754
- [x] [MED] [anon+authed] /shows/shark-tank/season/season-1 — the CAST SIZE stat tile renders "5 players" for a show whose cast are investors ("sharks"), not competing players. Root cause: `isCompetitionGenre()` in `src/app/shows/[show]/season/[slug]/page.tsx:152-154` matches any `genre_tag` containing the substring "competition" (plus two exact-match exceptions) and picks between "player(s)" and "cast member(s)" on that basis; Shark Tank's `genre_tag: "Business competition"` (`content/shows/shark-tank.md`) matches the substring even though the show has no competing contestants in the traditional sense — the panel investors are the counted `cast_size`. The mismatch is visible on the page itself: the CAST SIZE value says "5 players" while its own caption and the body copy both call them "sharks." Fix: either exempt "business competition" specifically from `isCompetitionGenre()` (falling through to "cast members"), or add a per-show/per-season override field for the cast noun so panel-format shows tagged with a competition-flavored genre don't inherit the wrong vocabulary. Single function or one new optional field. Spoiler discipline P0 intact (stat-tile chrome only). (URL: /shows/shark-tank/season/season-1, source: critique-pass-78) — issue: #496 — RESOLVED: added an exact-match exemption for "business competition" to `isCompetitionGenre()` — falls through to "cast members" while every other `<word> competition` genre_tag still matches the substring rule. Single function edit, exports unchanged. Pinned with 3 new colocated unit tests (the `isCompetitionGenre` exemption itself, case-insensitivity, and an end-to-end `statsFor()` pin against the exact Shark Tank repro). Verify gate green: 194 test files / 2800 unit tests, content:check ok (58 shows/707 seasons), build (963 pages), 3200 e2e (18.9m). Closes #496.

- [x] [MED] [anon+authed] /shows/married-at-first-sight/season/new-york — the FORMAT stat tile's caption doesn't describe the format value and breaks the sentence-case convention every sibling caption on the site follows. `format_summary: "Blind matching · legal marriage"` / `format_caption: "the season that invented the experiment"` — the caption is a canon-narrative claim (this season "invented" something), not a format detail, and it's lowercase where every comparable caption on this same page and on `/shows/rhoslc/season/season-1`'s FORMAT tile (`"Six-woman founding cast"`) and MAFS's own CAST SIZE caption (`"Three couples, matched sight unseen"`) are sentence-case. (URL: /shows/married-at-first-sight/season/new-york, source: critique-pass-75) — issue: #482 — RESOLVED 7ac2c42: rewrote `format_caption` to "Matched by experts, married before meeting" — describes the actual matching mechanism (a format detail) instead of a canon-placement claim, and is now sentence-case matching every sibling stat-tile caption. Content-only, one field. Spoiler discipline P0 intact. Verify gate green: 194 unit test files / 2795 tests, content:check ok (48 shows/695 seasons/48 canons/12 themes/3 legal docs); build (911 pages); 3028 e2e passed. Closes #482.

- [x] [MED] [authed] /shows/married-at-first-sight/season/new-york — the season's stat-tile rail is missing the PREMIERED and EPISODES tiles that the comparable freshly-scaffolded RHOSLC S1 page (same template, same tick) ships. `content/shows/married-at-first-sight/seasons/01-new-york.md` frontmatter carries `location`, `format_summary`/`format_caption`, `cast_size`/`cast_size_caption` but no `premiere_date` and no `ep_count`, while `content/shows/rhoslc/seasons/01-season-1.md` carries both (`premiere_date: "2020-11-11"`, `ep_count: 16`) plus a `premiere_caption`. Rendered impact: the MAFS rail shows only FILMED / FORMAT / CAST SIZE (3 tiles) where RHOSLC shows FILMED / PREMIERED / EPISODES / FORMAT / CAST SIZE (5 tiles) — a reader comparing the two freshly-added shows sees one with a materially thinner stat grid, and the missing premiere date means the community-ranking table's season tag for MAFS New York likely falls back to a non-year label, the same symptom class as the previously-fixed Survivor 50 gap (issue #473). (URL: /shows/married-at-first-sight/season/new-york, source: critique-pass-75) — issue: #481 — RESOLVED a3dfc73: backfilled `premiere_date: "2014-07-08"` (FYI), `ep_count: 11` (core episodes, excluding two bonus/clip specials per the site's existing Bachelor-season convention), and `premiere_caption: "FYI · July 2014"` matching the RHOSLC reference pattern. Content-only, verified non-spoiler production facts. Verify gate green: 194 unit test files, build (911 pages), 3028 e2e. Closes #481.

- [x] [MED] [anon] /shows/rhoslc/season/season-1 (and every non-competition show — systemic, shared code path) — the CAST SIZE stat tile hardcodes the noun "player(s)" for every show's cast count regardless of genre, so a docusoap/social-reality cast reads as if it were a competition roster. `src/app/shows/[show]/season/[slug]/page.tsx:175`: `` `${season.cast_size} ${season.cast_size === 1 ? 'player' : 'players'}` `` runs unconditionally for every show in the catalog. Confirmed on `/shows/rhoslc/season/season-1`: "CAST SIZE / 6 players / Lisa Barlow, Mary Cosby..." — RHOSLC is a Bravo social-reality docusoap with no competition mechanic; its cast members aren't "players" by any reading a viewer would recognize, and the tile's own caption line correctly avoids the word ("Six-woman founding cast"). Same mismatch reproduces on `/shows/married-at-first-sight/season/new-york` ("6 players" for three married couples) and will recur on every current and future docusoap/social-format show in the catalog (Housewives franchises, Vanderpump Rules, Jersey Shore, Below Deck, Selling Sunset, Queer Eye) — this is systemic to the shared function, not a per-show content typo. Fix: replace the hardcoded "player(s)" noun with a genre-neutral term ("cast member(s)") in the shared `statsFor()` function, or add a lightweight per-show/per-genre noun override if competition-specific "players" phrasing is worth preserving for the competition shows (Survivor, Big Brother, etc.) — either way, a single function edit, not a per-file content change. Spoiler discipline P0 intact (cast-count copy only). (URL: /shows/rhoslc/season/season-1, /shows/married-at-first-sight/season/new-york, source: critique-pass-75) — issue: #479 — RESOLVED 8e910d3: added `isCompetitionGenre(genreTag)` gate to `statsFor()` in `src/app/shows/[show]/season/[slug]/page.tsx` — checks `genre_tag.toLowerCase()` for `competition`/`survival reality`/`social deduction` (covers Survivor, Big Brother, Alone, Naked and Afraid, The Traitors, and every other elimination/scored-game genre in the catalog) and falls back to "cast member(s)" for every non-competition genre (docusoap, dating, lifestyle, docuseries). The call site now passes `show.genre_tag` through. Both helpers exported and pinned with 9 new colocated unit tests covering the competition/non-competition split, singular/plural forms on both branches, and a negative regression pin against `/players?/` rendering for a non-competition genre_tag. Verify gate green: 194 unit test files / 2795 tests, build (911 pages), 3028 e2e (16.2m). Closes #479.

- [x] [HIGH] [anon] /shows/married-at-first-sight/season/new-york — the season page's "Shape of the season" section (season file body) and "Where it sits in the canon" section (canon.md rationale, quoted via `whereItSitsCopy()`) restate the same premise-and-commitment argument in near-identical phrasing, same duplication class as the resolved Bachelor S28 and Love Island UK findings, now confirmed on two more shows at once. Root cause: `whereItSitsCopy()` (`src/app/shows/[show]/season/[slug]/page.tsx:252-276`) deliberately quotes the canon.md `rationale` verbatim whenever `canonTotal === 1` — every freshly-scaffolded show enters the catalog with exactly one canon.md entry, so this collision recurs on every new show's S1 page unless the canon rationale and season body argue two different angles. Corroborating instance: `/shows/rhoslc/season/season-1` shows the same pattern, milder. (URL: /shows/married-at-first-sight/season/new-york, /shows/rhoslc/season/season-1, source: critique-pass-75) — issue: #478 — RESOLVED 7477b31: rewrote the canon.md rationale for both `married-at-first-sight` and `rhoslc` to argue the curatorial case (why the founding season holds #1, what standard future seasons are weighed against) instead of re-narrating the premise/format facts the season body already covers. Content-only, one field per show. Spoiler discipline P0 intact. Verify gate green: 194 test files / 2787 unit tests, content-check ok, build (911 pages), 3028 e2e. Closes #478.

- [x] [MED] [anon] /shows/bachelor/season/joey-graziadei (and every Bachelor season — systemic within the show) — the FORMAT and CAST SIZE stat tiles, adjacent in the spec-row grid, both center on the identical headcount, so a reader sees "32" framed as two different facts in two consecutive tiles with no new information in the second. `content/shows/bachelor/seasons/28-joey-graziadei.md`: `format_summary: "32 women · the modern peak"` / `cast_size: 32` / `cast_size_caption: "32 women in the opening field"`. Confirmed systemic: every other Bachelor season file repeats the same women-count in both fields. Fix: repurpose `format_summary` to describe the season's structural format (e.g. hometown twist, two-lead gimmick) rather than restating cast headcount, since `cast_size`/`cast_size_caption` already own that fact. Content-only, one field per season file. Spoiler discipline P0 intact (cast composition only, no outcomes). (URL: /shows/bachelor/season/joey-graziadei, source: critique-pass-72) — 29b0ccb — issue: #464 — RESOLVED 200b680: `format_summary` rewritten to "Traditional rose ceremonies, no twist" (structural format, no headcount). Scope was the flagged S28 file only — the "systemic" claim across the other 27 Bachelor season files is real but out of scope for this fix; filed as a follow-up content-gaps row in AUDIT.md for a future drain. Verify gate green: 194 test files / 2783 unit tests, build (876 pages), 2918 e2e. Closes #464.
- [x] [MED] [authed] /shows/bachelor/season/joey-graziadei — the hero lede's opening two sentences are copied verbatim into Section 02 ("THE SHAPE OF THE SEASON"), and Section 03 ("WHERE IT SITS IN THE CANON") then restates the same five facts (tennis pro/mansion, deepest chemistry-forward field, limo line at full recruitment strength, Malta/Montreal/Tulum travel, production confidence) with only cosmetic rewording, closing on a near-identical sentence with one word swapped: "Jesse Palmer hosts a season the franchise points to when it argues the modern Bachelor finally works at full strength" (Sec 02) vs. "Jesse Palmer hosts the season the franchise points to when it argues the recent era works at full strength" (Sec 03). "post-2016" appears 6 times and "modern era/peak" 4 times on one page. Same duplication class as the resolved Love Island UK Section-02-vs-03 finding (issue #459), now confirmed on a second show and a different source pairing (hero lede → Section 02, not just canon rationale → season body). Fix: de-duplicate the season drain template in `content/shows/bachelor/seasons/28-joey-graziadei.md` so hero lede / Section 02 / Section 03 each carry a distinct angle (recap, structural rhythm, canon-ranking rationale) instead of restating the same facts and closing sentence three times; worth auditing other freshly-drained Bachelor seasons for the same pattern. Content-only. Spoiler discipline P0 intact (no outcome exposure). (URL: /shows/bachelor/season/joey-graziadei, source: critique-pass-72) — 29b0ccb — issue: #464 — RESOLVED 200b680: rewrote the season body (Section 02) to argue structural rhythm (episode pacing, travel-run beats) instead of restating the lede; rewrote the canon.md rationale (Section 03) to argue ranking placement against neighboring seasons (Ben Higgins, Matt James) instead of restating recap facts a third time. All facts preserved, no outcome exposure. Verify gate green: 194 test files / 2783 unit tests, build (876 pages), 2918 e2e. Closes #464.
- [x] [LOW] [authed] /shows/bachelor/season/joey-graziadei — the FORMAT spec-row tile mixes editorial opinion into what reads elsewhere as a factual composition field: `format_summary: "32 women · the modern peak"` / `format_caption: "the post-2016 era at full strength"` duplicates the page eyebrow ("AIRED WINTER 2024 · THE MODERN PEAK") rather than describing the season's structural format, while CAST SIZE, EPISODES, and HOST tiles stay plainly factual. Fix: rewrite the FORMAT caption in `content/shows/bachelor/seasons/28-joey-graziadei.md` to describe the season's structural format (e.g. elimination cadence, rose-ceremony rhythm) and leave the "modern peak" editorial framing to the prose sections, where it already appears repeatedly. Content-only, one field. Spoiler discipline P0 intact. (URL: /shows/bachelor/season/joey-graziadei, source: critique-pass-72) — 29b0ccb — issue: #464 — RESOLVED 200b680: `format_caption` rewritten to "standard cadence, full travel circuit" (structural format, no editorial framing/eyebrow duplication). Verify gate green: 194 test files / 2783 unit tests, build (876 pages), 2918 e2e. Closes #464.

- [x] [MED] [anon] /themes/best-villain-editing — two entries in the same 7-entry ranked list close their editorial bodies with the identical clause "the edit leans all the way in," two entries apart on one scroll. Entry #02 (Survivor Pearl Islands): "Big personalities, sharp edges, an Outcasts twist that rewards going for the throat. The edit leans all the way in." Entry #04 (Big Brother Den of Temptation): "Den Of Temptation builds its broadcast around a single house power center, and the edit leans all the way in." Fix: vary the closing clause on one of the two entries in `content/themes/best-villain-editing.md` — same cross-entry verbatim-echo defect class already drained elsewhere ("at full volume", "receipts", "freighted"), not yet drained on this list. Content-only, one field. Spoiler discipline P0 intact (editorial framing only). (URL: /themes/best-villain-editing, source: critique-pass-72) — 29b0ccb — issue: #462 — RESOLVED 63d3980: rewrote the Big Brother Den of Temptation closer to "and the framing never wavers from it" — Pearl Islands entry left untouched (its phrasing is the fine idiomatic closer of the pair). Verified no new cross-entry echo introduced across the list's 7 blurbs. Verify gate green: fast gate + build (876 pages) + e2e (2918 passed). Closes #462.

- [x] [MED] [anon] /shows/bachelor (and every show's canon page — systemic, shared component) — the canon-tier band headlines mix narrator voice within a single page: S and B tiers render voice-neutral ("The seasons that defend the show." / "The seasons that count.") while A and C tiers switch to plural-collective "we" ("The seasons we would watch again next week." / "The seasons we have made peace with.") — directly beneath a methodology block that speaks in first-person-singular ("Who ranks it: One tiered.tv editor...", "When I revisit... I log every shift... I never quietly re-rank."). Root cause: `src/components/canon/CanonTierBand.tsx:21-26`'s `TIER_HEADLINES` record hardcodes "we" only on the A and C entries; this constant is shared across every show's canon page, so the drift repeats site-wide, not just on Bachelor. Fix: make `TIER_HEADLINES` consistent with the page's established singular-editor voice — drop "we" from the A and C tier labels (e.g. "The seasons worth watching again next week."). Single shared component, one constant. Spoiler discipline P0 intact (voice/copy only). (URL: /shows/bachelor, source: critique-pass-72) — 29b0ccb — issue: #461 — RESOLVED 212c689: `TIER_HEADLINES.A` → "The seasons worth watching again next week."; `TIER_HEADLINES.C` → "The seasons that earned their peace." S and B left untouched (already voice-neutral). Colocated test updated to match. `DEFAULT_BLURBS.A` ("Seasons we trust to deliver.") is a separate constant (the fallback blurb `<p>`, not the headline `<h2>`) and was out of scope for this finding — worth a future pass if the same voice-mixing pattern is confirmed there. Verify gate green: 194 test files / 2781 unit tests, build (876 pages), 2918 e2e. Closes #461.

- [x] [LOW] [authed] /shows/below-deck-adventure — The canon stat strip reads '1 SEASONS IN CANON' — the label does not singularize when the count is one. For a single-season show the correct reading is '1 SEASON IN CANON'. The stat label helper returns the plural form unconditionally. Fix: add a count guard so the label singularizes when `seasonsAired === 1` — update the seasons-stat label helper (likely `src/lib/canon/`) to return 'season in canon' (singular) when count is 1. Add a unit test pinning the singular branch to prevent future regression. Spoiler P0 intact (display label only). (URL: /shows/below-deck-adventure, source: critique-pass-53) — a124b6b — issue: #463 — RESOLVED d745bc3: `seasonsStatLabel()` in `src/lib/canon/seasons-stat-label.ts` now singularizes the noun to "season" when `seasonsAired === 1`, covering both the "aired" and "in canon" branches. Fixes below-deck-adventure plus the two other single-season shows sharing the helper (alone-frozen, alone-the-skills-challenge). Two pinning unit tests added. Verify gate green: 194 test files / 2783 unit tests, build (876 pages), 2918 e2e (17.1m). Closes #463.

- [x] [MED] [anon] /shows/jersey-shore/season/season-1 — the frontmatter is missing the `episodes_caption` field that every other season page's spec-row EPISODES tile reads from, so the tile drops out of the grid entirely: the meta grid jumps straight from PREMIERED to FORMAT with no EPISODES row at all. Every comparable season checked has the field — `/shows/selling-sunset/seasons/01-season-1.md:18` carries `episodes_caption: "8 episodes, hour-long format"` and its rendered grid includes "EPISODES / 8 / 8 episodes, hour-long format" between PREMIERED and FORMAT. Jersey Shore Season 1 is the outlier: `content/shows/jersey-shore/seasons/01-season-1.md` has no `episodes_caption` key at all. This is a straightforward missing-field content gap, same class as the `tier_s_blurb` gap the loop drained across 20 shows a few commits ago (see Done section). Fix: add `episodes_caption: "N episodes, <format note>"` to `content/shows/jersey-shore/seasons/01-season-1.md` frontmatter with the real MTV-aired episode count for the season. Content-only, one field. Spoiler discipline P0 intact (episode count is public record). (URL: /shows/jersey-shore/season/season-1, source: critique-pass-68) — 7173f3a — issue: #451 — RESOLVED 537e9ee: added `ep_count: 9` and `episodes_caption: "9 episodes, hour-long format"` to `content/shows/jersey-shore/seasons/01-season-1.md`. Episode count verified via Wikipedia's "List of Jersey Shore episodes" (Season 1 aired Dec 3, 2009 – Jan 21, 2010, 9 episodes, hour-long timeslot). Content-only; `SeasonStatsStrip` already collapses a tile only when both value and caption are absent, so no code change was needed. Verify gate green: leg1 (tokens/typecheck/lint/194 unit test files/content:check), leg2 (build, 866 pages), leg3 (2888 e2e).
- [x] [LOW] [anon+authed] /shows/the-apprentice — the `tier_s_blurb` field is absent from `content/shows/the-apprentice/canon.md`. The S-tier band renders its heading ("The seasons that defend the show.") and its editorial description as the identical string — a visitor reads the same sentence twice in immediate succession. Same class as the pending masked-singer, AGT, ANTM, American Idol, RHOA, RHONY, DWTS, The Voice, and BDM findings — this is a missing-field content gap, not a component defect. Fix: add `tier_s_blurb` to the-apprentice's canon.md describing what the S-tier seasons share — e.g. "The founding NBC seasons before the format leaned on celebrity contestants — real hopefuls, real stakes, the boardroom at its sharpest." Content-only; one field addition. Spoiler discipline P0 intact. (URL: /shows/the-apprentice, source: critique-pass-67) — 8b77f14 — RESOLVED 51dd0fd: added tier_s_blurb for the-apprentice.
- [x] [LOW] [anon+authed] /shows/masked-singer — the `tier_s_blurb` field is absent from `content/shows/masked-singer/canon.md`. The S-tier band renders its heading ("The seasons that defend the show.") and its editorial description as the identical string — a visitor reads the same sentence twice in immediate succession. Same class as the pending AGT, ANTM, American Idol, RHOA, RHONY, DWTS, The Voice, and BDM findings. Fix: add `tier_s_blurb` to masked-singer's canon.md describing what the S-tier seasons share — e.g. "The early seasons where the celebrity-guessing format was fresh and the spectacle felt genuinely surprising — before the playbook became familiar." Content-only; one field addition. Spoiler discipline P0 intact. (URL: /shows/masked-singer, source: critique-pass-66) — b88e76e — RESOLVED 51dd0fd: added tier_s_blurb for masked-singer.
- [x] [LOW] [anon+authed] /shows/americas-got-talent — the `tier_s_blurb` field is absent from `content/shows/americas-got-talent/canon.md`. The S-tier band renders its heading ("The seasons that defend the show.") and its editorial description as the identical string — a visitor reads the same sentence twice in immediate succession. Same class as the pending ANTM, American Idol, RHOA, RHONY, DWTS, The Voice, and BDM findings. Fix: add `tier_s_blurb` to AGT's canon.md describing what the S-tier seasons share — e.g. "The founding era at full confidence — the seasons where the open-call promise delivered its most varied audition pools and the judging chemistry held." Content-only; one field addition. Spoiler discipline P0 intact. (URL: /shows/americas-got-talent, source: critique-pass-65) — 015d394 — RESOLVED 51dd0fd: added tier_s_blurb for americas-got-talent.
- [x] [LOW] [anon+authed] /shows/americas-next-top-model — the `tier_s_blurb` field is absent from `content/shows/americas-next-top-model/canon.md`. The S-tier band renders its heading ("The seasons that defend the show.") and its editorial description as the identical string — a visitor reads the same sentence twice in immediate succession. Same class as the pending American Idol, RHOA, RHONY, DWTS, The Voice, and BDM findings. Fix: add `tier_s_blurb` to ANTM's canon.md describing what the S-tier cycles share — e.g. "The UPN founding run at full voltage — the cycles where the triple-panel dynamic and the photo-shoot format were both new enough to crackle." Content-only; one field addition. Spoiler discipline P0 intact. (URL: /shows/americas-next-top-model, source: critique-pass-64) — 0d476ae — RESOLVED 51dd0fd: added tier_s_blurb for americas-next-top-model.
- [x] [LOW] [anon+authed] /shows/american-idol — `tier_s_blurb` and `tier_a_blurb` absent from `content/shows/american-idol/canon.md` (only `tier_b_blurb` is defined). The S-tier section renders the heading ("The seasons that defend the show.") and editorial blurb as the same string — the visitor reads the same sentence twice in immediate succession. Same class as the pending RHOA (#986), RHONY (#983), DWTS (#987), The Voice (#985), and BDM (#988) findings. Fix: add `tier_s_blurb` describing the S-tier (ranks 1–5, the Fox founding run) — e.g. "The original panel at full power — the seasons that proved Idol was bigger than television and set the standard every subsequent run was measured against." Add `tier_a_blurb` describing the A-tier (the rotation era and ABC revival entries) — e.g. "American Idol working at a reliable level — audition circuits that surfaced genuine talent, judging panels with real chemistry, competitions that earned their finales." Content-only; two field additions. Spoiler discipline P0 intact. (URL: /shows/american-idol, source: critique-pass-63) — 921cbf5 — RESOLVED 51dd0fd: added tier_s_blurb for american-idol (tier_s_blurb + tier_a_blurb).
- [x] [LOW] [anon+authed] /shows/rhony — the S-tier section heading and section blurb both render the identical string "The seasons that defend the show." because `tier_s_blurb` is absent from `content/shows/rhony/canon.md`. All five current canon entries (S1–S5) land in S tier; `CanonTierBand.tsx` falls back to `DEFAULT_TIER_HEADINGS.S` for the blurb, which is the same constant as the `<h2>`, so a visitor reads the same sentence twice. The `tier_a_blurb` and `tier_b_blurb` fields are present; `tier_s_blurb` is the only missing entry. Direct precedent: resolved Traitors (#427, b954a7b) and Below Deck (#418, 847657d) findings of the same class. Fix: add `tier_s_blurb` to `content/shows/rhony/canon.md` describing what the S-tier RHONY seasons share — e.g. "The original cast at full voltage: from the founding document through Scary Island and the textured middle run." Content-only; one field addition. Spoiler discipline P0 intact. (URL: /shows/rhony, source: critique-pass-58) — 8580763 — RESOLVED 51dd0fd: added tier_s_blurb for rhony (already resolved earlier tick, row was stale — verified tier_s_blurb present).
- [x] [LOW] [anon] /shows/the-voice — the S-tier section heading and section blurb both render the identical string "The seasons that defend the show." because `tier_s_blurb` is absent from `content/shows/the-voice/canon.md`. All five ranked Voice seasons land in S tier; `CanonTierBand.tsx` falls back to `DEFAULT_TIER_HEADINGS.S` for the blurb, which is the same constant as the `<h2>`, so a visitor reads the same sentence twice in immediate succession. The `tier_a_blurb` and `tier_b_blurb` fields are both present in the-voice/canon.md; `tier_s_blurb` is the only absent entry. Direct precedent: resolved Traitors (#427, b954a7b) and Below Deck (#418, 847657d) findings of the same class; pending DWTS, RHONY, and BDM findings of the same class. Fix: add `tier_s_blurb` to `content/shows/the-voice/canon.md` describing what makes the S-tier Voice seasons the show's best without naming outcomes — e.g. "The founding chapter where the blind audition format proved it could produce television worth rewatching: coaching chemistry at its most competitive, chair-turn stakes that felt real." Content-only fix; one field addition. Spoiler discipline P0 intact. (URL: /shows/the-voice, source: critique-pass-59) — cd46f7e — RESOLVED 51dd0fd: added tier_s_blurb for the-voice.
- [x] [LOW] [anon+authed] /shows/rhoa — the S-tier section heading and section blurb both render the identical string "The seasons that defend the show." because `tier_s_blurb` is absent from `content/shows/rhoa/canon.md`. All five ranked RHOA seasons (S1–S5, the Founding Era run) land in S tier; `CanonTierBand.tsx` falls back to `DEFAULT_TIER_HEADINGS.S` for the blurb, which is the same constant as the `<h2>`, so a visitor reads the same sentence twice. The `tier_a_blurb` and `tier_b_blurb` fields are both present; `tier_s_blurb` is the only absent entry. Direct precedent: resolved Traitors (#427, b954a7b) and Below Deck (#418, 847657d) findings of the same class; pending RHONY, DWTS, BDM, and The Voice findings of the same class. Fix: add `tier_s_blurb` to `content/shows/rhoa/canon.md` describing what the S-tier RHOA seasons share — e.g. "The Founding Era: Atlanta opulence and cast chemistry before the show had time to calcify into a routine. The five seasons that established what RHOA is." Content-only; one field addition. Spoiler discipline P0 intact. (URL: /shows/rhoa, source: critique-pass-59) — cd46f7e — RESOLVED 51dd0fd: added tier_s_blurb for rhoa.
- [x] [LOW] [anon] /shows/dancing-with-the-stars — the S-tier section heading and section blurb both render the identical string "The seasons that defend the show." because `tier_s_blurb` is absent from `content/shows/dancing-with-the-stars/canon.md`. Season 1 is the only entry and it lands in the S tier; `CanonTierBand.tsx` falls back to `DEFAULT_TIER_HEADINGS.S` for the blurb — the same constant as the `<h2>`, so a visitor reads the same sentence twice in immediate succession. Direct precedent: the resolved Traitors (#427, b954a7b) and Below Deck (#418, 847657d) findings of the same class. Fix: add `tier_s_blurb` to `content/shows/dancing-with-the-stars/canon.md` describing what makes the S-tier DWTS season(s) the show's best without naming outcomes — e.g. "The season that proved the format in six episodes and established the template every later run has worked inside." Content-only fix; one field addition. Spoiler discipline P0 intact. (URL: /shows/dancing-with-the-stars, source: critique-pass-57) — 424760d — RESOLVED 51dd0fd: added tier_s_blurb for dancing-with-the-stars.
- [x] [LOW] [anon+authed] /shows/below-deck-mediterranean — the S-tier section heading and section blurb both render the identical string "The seasons that defend the show." because `tier_s_blurb` is absent from `content/shows/below-deck-mediterranean/canon.md`. All five canon entries (S1–S5, the founding run) land in the S tier; with no `tier_s_blurb` defined, `CanonTierBand.tsx` falls back to `DEFAULT_TIER_HEADINGS.S` — same constant as the `<h2>`, so a visitor reads the same sentence twice. Same fix class as DWTS above and the resolved Traitors/Below Deck findings. Fix: add `tier_s_blurb` to BDM canon.md describing what the S-tier BDM seasons share — e.g. "The Adriatic founding run: five seasons where the Mediterranean setting and cast chemistry established the franchise's own register." Content-only fix; one field addition. Spoiler discipline P0 intact. (URL: /shows/below-deck-mediterranean, source: critique-pass-57) — 424760d — RESOLVED 51dd0fd: added tier_s_blurb for below-deck-mediterranean (already resolved earlier tick, row was stale — verified tier_s_blurb present).
- [x] [LOW] [anon+authed] /shows/american-idol (and 8 other newly seeded shows) — S-tier section heading and blurb both render the identical string "The seasons that defend the show." because `tier_s_blurb` is absent from the show's `canon.md`. `CanonTierBand.tsx:82` sets `blurb = band.blurb ?? DEFAULT_TIER_HEADINGS[band.key]`; when `tier_s_blurb` is absent the blurb falls back to `DEFAULT_TIER_HEADINGS.S = "The seasons that defend the show."` — the same constant as `TIER_HEADLINES.S` rendered in the `<h2>` immediately above, so a visitor reads the same sentence twice in immediate succession. Observed on `/shows/american-idol` (newly seeded this tick); 8 other canon files also lack `tier_s_blurb` and not yet individually filed: `content/shows/alone-australia/canon.md`, `content/shows/alone-frozen/canon.md`, `content/shows/alone-the-skills-challenge/canon.md`, `content/shows/below-deck-adventure/canon.md`, `content/shows/below-deck-down-under/canon.md`, `content/shows/below-deck-sailing-yacht/canon.md`, `content/shows/hells-kitchen/canon.md`, `content/shows/love-is-blind/canon.md`. (DWTS, BDM, The Voice, RHOA already have pending findings for the same class.) Direct precedent: resolved Traitors (#427, b954a7b) and Below Deck (#418, 847657d). Fix: author `tier_s_blurb` for each of the 9 affected canon.md files describing what the S-tier seasons of that show share without naming outcomes. Batch content fix; nine field additions. Spoiler discipline P0 intact. (URL: /shows/american-idol, source: critique-pass-61) — 0975b35 — RESOLVED 51dd0fd: added tier_s_blurb for american-idol + the 8 listed shows (alone-australia, alone-frozen, alone-the-skills-challenge, below-deck-adventure, below-deck-down-under, below-deck-sailing-yacht, hells-kitchen, love-is-blind).
- [x] [MED] [anon] cross-catalog — `meth_who_h` / `meth_how_h` / `meth_when_h` section headers are split between a second-person question form ("Who ranks?", "How do I weigh it?", "When do I revisit?") and a first-person statement form ("Who ranks it", "How I weigh it", "When I revisit") across 21 show canon files with no house standard. Older shows (survivor, dragrace, top-chef, amazing-race, bachelor, bachelorette, bake-off, big-brother, project-runway, the-challenge) use the question form; newer shows (all alone/* flavors, all below-deck/* flavors, traitors, love-island-uk, love-island-us) use the statement form. A reader comparing two show pages sees different editorial voices in the same structural slot. The statement form is more consistent with the "knowledgeable peer" voice (assertive rather than self-interrogating) and should be the house standard. Fix: normalize the 10 older-form shows' canon files to first-person statement form ("Who ranks it", "How I weigh it", "When I revisit") — content-only edit, no page code change. Spoiler discipline P0 intact. (URL: /shows/dragrace representative, spans catalog, source: critique-pass-55) — 0a2460a — RESOLVED 1712139: normalized all 10 older-form canon files to the statement form ("Who ranks it" / "How I weigh it" / "When I revisit") — issue mirror: [mirror-failed: 2026-06-17]
- [x] [MED] [anon] /shows/survivor/season/heroes-vs-villains anonymous thread footer stacks three lines with no visual separator, so the middle line reads ambiguously as either the posting rule or a paraphrase of the empty-state. Verified rendered shape on pass-50 anon walker capture at 947843c: the section reads `The thread / Sign in to comment. → / No plot, no winners, no twists / No comments yet.` (identical ordering at desktop and mobile). The first line is the section header; the second is the call-to-action with arrow; the third is the editorial posting rule (what may be commented); the fourth is the empty-state label. The third line — `No plot, no winners, no twists` — is the brand's spoiler-discipline rule but its prose form (no leading colon, no `Posting rule:` prefix, no visual rule between it and `No comments yet.`) and its position (closer to the empty-state line than to the CTA) cause first-time readers to parse it as a paraphrase of the empty-state. The combined reading then drifts to `there are no comments because no plot, no winners, no twists are being discussed yet` — meaningless but plausible at first glance. Same defect class as the pass-19 (chrome grammar discipline — stat-strip-mixed-tile-categories) and pass-47 #393 /about section-order finding (chrome reading-order at the legibility layer), now at the anon-thread-footer prose-row layer. Source: the season-page comments shell — likely `src/components/comments/CommentsSection.tsx` or `src/app/shows/[show]/season/[slug]/page.tsx` rendering the anonymous-state empty thread (verify at fix-time). Bearings voice cue (`plan/bearings.md:370`) — `knowledgeable peer — plain sentences over clever ones`; a peer separates the rule from the empty-state label by either a visual rule or by labeling each line for what it is. Fix options: (a) **primary path — prefix the rule line with an explicit label** so it parses as a rule, not a paraphrase. Suggested literal: `Posting rule: no plot, no winners, no twists.` Or, lighter: `Comments here: no plot, no winners, no twists.` Single content edit at the empty-state literal. (b) **alternative — re-order so the rule line sits directly under the CTA with a hairline rule between the rule and the empty-state label**. Acceptable; involves a small CSS change to render the hairline. (c) **alternative — drop the rule line on the anonymous state** entirely; surface it only after the user has signed in (where the composer placeholder can carry it inline). Acceptable for the anonymous case; loses the brand-defining spoiler-discipline cue on the surface where a stranger is most likely to encounter it. (d) alternative — leave as-is. Rejected — the ambiguity is the defect. Recommended (a) — prefix the rule with `Posting rule:` (or equivalent label) so the line parses unambiguously and the empty-state label stands alone. Pin: extend the colocated test on the comments-section component with a case asserting that the anon empty-state DOM contains a labeled rule line (regex: matches `^(Posting rule|Comments here):` followed by the rule body) — bidirectional drift guard against a future authoring pass dropping the label. Sibling colocated test on the season page itself (smoke walker or page-reads fixture) can pin the same reading order on the rendered output. Spoiler discipline P0 intact (chrome label addition only; the change makes the spoiler-discipline rule more legible, never less; no per-season verdict change, no canon-position change, no winner / elimination / finale beat exposure on any surface). (URL: /shows/survivor/season/heroes-vs-villains, source: critique-pass-50) — 947843c — issue: #415 — RESOLVED ce8ab81: took the row's recommended primary path (a). `src/components/composition/CommentInputStub.tsx:17` flipped the `.comment-stub-mono` span literal from `No plot, no winners, no twists` to `Posting rule: no plot, no winners, no twists.` — adds the explicit `Posting rule:` label so the rule line parses unambiguously rather than reading as a paraphrase of the `No comments yet.` empty-state below it, and adds end punctuation so the line reads as a complete sentence. Pinned per the #242 / #414 closure pattern: `src/components/composition/__tests__/CommentInputStub.test.tsx` gained a new `rule-label prefix (critique pass-50, issue #415)` describe block with three bidirectional cases — (1) positive: rule-line text matches `^Posting rule:\s` prefix; (2) positive: rule-line text matches `no twists\.$` end-punctuation tail; (3) negative: rule-line text does NOT match `^No plot, no winners, no twists\s*$` (the bare-rule shape), so a future authoring pass that drops the label or reverts the punctuation trips at unit time. The existing `arrow placement` describe block's tagline assertion updated in lockstep to the new literal; the default-render test's `toContain('No plot')` swapped to `toContain('Posting rule:')` so the assertion follows the new prefix. No URL / schema field / e2e fixture row owed — the literal lives inside an existing component, no e2e pins the prior bare-rule shape; the smoke walker captures the new rendered shape on the next pass. Spoiler discipline P0 intact (chrome label addition only; the change makes the spoiler-discipline rule more legible, never less; no per-season verdict change, no canon-position change, no winner / elimination / finale beat exposure on any surface). Verify gate green: leg1 tokens + typecheck + no-raw-img + check:test-colocation + 193 unit files / 2725 tests + 88 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs); leg2 build (374 pages); leg3 1362 e2e (8.0m).

- [x] [LOW] [anon] /about `<title>` double-stamps the brand — the rendered `<title>` tag reads `About tiered.tv — tiered.tv`. Every other page on the site follows a clean `{page} — tiered.tv` pattern: `All shows — tiered.tv`, `Lists — tiered.tv`, `Finales that stuck the landing — tiered.tv`, `Survivor S20 — Heroes vs. Villains — tiered.tv`. /about is the only page that surfaces the brand twice in its title — once inside the page-name half (`About tiered.tv`) and once as the suffix (` — tiered.tv`). The duplication shows up wherever the title renders: SERP snippet on Google, browser tab, bookmark name, share-card fallback, Slack/iMessage URL preview. Verified rendered shape on pass-50 anon walker capture at 947843c: HTML head emits `<title>About tiered.tv — tiered.tv</title>`. Same defect class as the pass-1 #103 `/themes` document-title-vs-user-surface drift (`Themes` vs `Lists`) closed at f303ca3 — chrome-title hygiene at the SEO surface, this time the brand-stamp redundancy axis. Source: the /about route's `generateMetadata` (or its static `title` field), likely at `src/app/(default)/about/page.tsx`. The expected production path is the `buildMetadata({ title })` helper from `src/lib/seo.ts` (which already appends ` — tiered.tv` to whatever `title` it receives); the /about route is probably passing `title: "About tiered.tv"` instead of `title: "About"`, double-stamping the brand. Bearings voice cue + visual law — the brand name appears once per surface, not twice; the wordmark is the brand surface, the title-tag is the navigational surface. Fix options: (a) **primary path — change /about's `title` field to `"About"`** so `buildMetadata` produces the canonical `About — tiered.tv` form. Single string edit at `src/app/(default)/about/page.tsx` (verify path). (b) alternative — leave /about's `title` as `"About tiered.tv"` and strip the ` — tiered.tv` suffix at the helper. Rejected — every other page depends on the suffix; the fix belongs at the call site. (c) alternative — leave as-is. Rejected — the redundancy is the defect. Recommended (a) — single string edit. Pin: extend `src/app/(default)/about/__tests__/page.test.tsx` (the existing section-order test added in pass-47 #393) with a case asserting `generateMetadata().title` matches the pattern `^About$` (lax: matches `^About` and warns on double-stamp; strict: matches `^About$` exactly). Alternatively, extend a global title-format invariant in `scripts/content-check.ts` that walks every route's `generateMetadata` (where present) and asserts the `title` field does not contain `tiered.tv` (the suffix is the helper's job, never the call site's); ships LAX (one offender — /about) then STRICT once the rotation lands, matching the established lax→strict pattern. Spoiler discipline P0 intact (chrome title-tag edit only; no per-show verdict change, no canon-position change, no winner / elimination / finale beat exposure on any surface). (URL: /about, source: critique-pass-50) — 947843c — issue: #414 — RESOLVED 8c39919: took the row's recommended primary path (a). `content/legal/about.md` frontmatter rotated `title: About tiered.tv` → `title: About` so the root layout's `%s — tiered.tv` template (`src/app/layout.tsx:11`) now produces the canonical `About — tiered.tv` form on every render surface (SERP snippet, browser tab, bookmark, share-card, Slack/iMessage preview). Sibling legal docs already follow the clean pattern (`terms.md` → `Terms of Service`, `privacy.md` → `Privacy Policy`); the rotation brings /about into alignment with the convention every other page on the site already followed. Pinned at `src/app/(default)/about/__tests__/page.test.tsx` with a new `frontmatter title — brand-stamp hygiene (critique pass-50)` describe block carrying two bidirectional cases — (1) positive: `doc.title === 'About'`; (2) negative: `doc.title` does not match `/tiered\.tv/i` — so any future authoring pass that re-introduces the brand stamp in the title field trips the unit gate, not the next reader pass. No schema field added (the existing `title: z.string().min(1)` accepts the rotation), no URL change, no e2e fixture row owed (the title rendered shape is already pinned via the smoke walker's HTML capture). Verify gate green: leg1 tokens + typecheck + no-raw-img + check:test-colocation + 188 unit files / 2537 tests + 127 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs); leg2 build (374 pages); leg3 1362 e2e (7.9m).

- [x] [MED] [anon] singular-editor voice contradicts plural `we` across three sibling surfaces the pass-48 #411 home-rotation closure (`1141b1e`) did not reach. Verified rendered shapes on pass-50 anon walker captures at 947843c. /shows `How the tiers move` tier-explainer reads `S tier means we'd defend the canon's order at a bar. A tier means we'd defend it at a kitchen table. B tier means we haven't watched everything twice yet — when we have, the show moves up.` — four `we` instances within the same paragraph, on the same page whose hero (rewritten this pass-cycle) reads `not which shows I love most`. /about `Become an editor` section reads `or you have a take on one we do, written with 80–120 words per ranked season, spoiler-safe` and `a sample season write-up we agree on` — two `we` instances on a page whose lede explicitly self-identifies as `For every show I cover`. /shows/survivor/season/heroes-vs-villains Section 03 (`WHERE IT SITS IN THE CANON`) reads `Slot #02 of 50 in the Survivor Editor's Canon. The seasons on either side show what we ranked it against.` — a `we` on a page whose hero copy and pulled-quote both speak in first-person singular. Bearings voice is the singular editor; pass-31 #306 / pass-45 #381 / pass-47 #406 / pass-49 #408 each closed a different surface family onto first-person singular; the pass-48 #411 closure rotated the home lede + dual-callout onto first-person singular. These three siblings are the residual `we` carriers the closures didn't sweep — separate surfaces, separate components, same defect class. Same defect class as the pass-49 #408 closure (chrome-narrator pronoun family) at the per-page editorial-body layer. Source: tier-explainer copy at `src/components/shows/TierMeta.tsx` (verify path — the `How the tiers move` block on `/shows`); `/about` Become-an-editor section body in `content/legal/about.md` (verify field at fix-time); HvV Section 03 body at the season frontmatter feeding the page render (the pending Section 03 row in this queue already names the stub, so the `we` rotation can ride alongside the body expansion). Bearings voice cue (`plan/bearings.md:370`) — `knowledgeable peer — plain sentences over clever ones`; the singular-editor commitment the rest of the site honors does not bend to `we` mid-paragraph. Fix options: (a) **primary path — rotate each surface's `we` to `I` in a single content + component pass**. `/shows` tier-explainer: `S tier means I'd defend the canon's order at a bar. A tier means I'd defend it at a kitchen table. B tier means I haven't watched everything twice yet — when I have, the show moves up.` `/about` Become-an-editor: `or you have a take on one I cover, written with 80–120 words per ranked season, spoiler-safe` and `a sample season write-up I agree to.` HvV Section 03 body: `Slot #02 of 50 in the Survivor Editor's Canon. The seasons on either side show what I ranked it against.` (or fold the expanded 80–120 word rationale the pending Section 03 row asks for and write it in first-person singular from the start). (b) alternative — declare the editorial royal-we as the canonical voice on tier-rule, contribution-call, and ranking-rationale surfaces. Rejected — re-opens the pass-31 / pass-45 / pass-47 / pass-49 / pass-48-#411 closures and contradicts the bearings cue. (c) alternative — leave as-is. Rejected — three siblings hosting the defect after the home rotation is the residual the closures missed. Recommended (a) — rotate the three surfaces' `we` to `I` in a single content + component pass; HvV Section 03 rotation pairs naturally with the pending Section 03 body-expansion row when that's addressed. Pin: extend the pass-48 #411 `collectHomeNarratorVoiceIssues` helper (or generalize it to a `collectEditorialFirstPersonIssues` invariant) to cover the three new surface families — tier-explainer component source, `/about` markdown source, season-page Section 03 body source — asserting that none of them carry `\bwe(['’](ve|d|re|ll))?\b` in editorial-voice copy (allowlist the "the readers vote" / "you self-attest" axes the home closure already preserved). Initial floor: lax (warn on the three named violators); strict at floor 0 once the rotation ships. Sibling colocated test in `src/content/__tests__/content-check.test.ts`. Bidirectional drift guard: a future authoring pass that defaults any editorial surface back to first-person plural trips at verify time. Spoiler discipline P0 intact (voice rotation only; no per-show verdict change, no canon-position change, no winner / elimination / finale beat exposure on any surface — the rotation names the editor's authorship, not any show's content). (URL: /shows, /about, /shows/survivor/season/heroes-vs-villains, source: critique-pass-50) — 947843c — issue: #413 — RESOLVED 4f05d3c: took the row's primary path (a) — rotated each surface's plural-we to singular-I in a single content + component pass. `src/components/shows/HowTiersMove.tsx` tier-explainer paragraph swapped `we'd defend` / `we haven't watched` / `we have` / `How we rank →` → `I'd defend` / `I haven't watched` / `I have` / `How I rank →`. `content/legal/about.md` Become-an-editor section swapped `one we do` → `one I cover` and `a sample season write-up we agree on` → `a sample season write-up I agree to`. `src/app/shows/[show]/season/[slug]/page.tsx` `whereItSitsCopy` swapped `what we ranked it against` → `what I ranked it against`. Schema-comment stylistic alignment: `src/content/schemas.ts` tier-enum inline comment rotated plural-we to singular-I to match the rendered surface it documents. Pinned per the row's spec at `scripts/content-check.ts` via a new `collectEditorialFirstPersonIssues` helper that scans the three surface scopes against `\bwe(?:['’]?(ve|d|re|ll))?\b` — each scope's `extract` function narrows to the editorial-voice region (JSX `<p>` for HowTiersMove, the `## Become an editor` section body for /about, the `whereItSitsCopy` function body for the season page) so arbitrary `we` tokens in comments or unrelated functions stay out of scope. Ships STRICT at floor 0 (`EDITORIAL_FIRST_PERSON_STRICT = true`) — rotation drained every offender in the same tick. One-line strict toggle mirroring `HOME_NARRATOR_VOICE_STRICT` / `CROSS_SHOW_STRICT` / `YEAR_TENURE_STRICT` / `TAGLINE_TAIL_STRICT` / `THEME_COUNT_TAIL_STRICT` precedents. Sibling colocated test in `src/content/__tests__/content-check.test.ts` runs the helper against the live source (zero violations) + bidirectional drift guard via contraction-form acceptance pin + word-boundary negative on safe tokens (`editors'`, `sweet`, `between`, `tweed`). `src/app/(default)/about/__tests__/page.test.tsx` + `src/app/shows/[show]/season/[slug]/__tests__/page.test.tsx` updated in lockstep on the literals the prior closures pinned. Closure pattern matches the pass-31 #306 / pass-45 #381 / pass-47 #406 / pass-48 #411 / pass-49 #408 chain — the cross-surface singular-editor voice family lands at the three residual surfaces this tick. Spoiler discipline P0 intact (voice rotation only; no per-show verdict change, no canon-position change, no winner / elimination / finale beat exposure). Verify gate green: leg1 tokens + typecheck + no-raw-img + colocation + 193 unit files / 2720 tests (incl. the 3 new editorial-first-person pins) + 134 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs); leg2 build (374 pages); leg3 1362 e2e (7.4m). Closes #413.

- [x] [MED] [anon] /shows hero copy dropped the B-tier mention this pass-cycle (pass-49 `[x]` `/shows hero lede mentions B tier but no show in B tier` closure) but the structural B-tier band still renders below the A-tier grid as `B / RECENT ADDITIONS · UNDER REVIEW / The canon is in progress. Every season reviewed before it lands. / 0 SHOWS / Nothing here yet.` The reader meets a tier band whose existence the hero just denied — an empty section the hero implied wasn't part of the system. The `How the tiers move` explainer at the page tail later explains B retroactively, but by then the empty band has already landed as a missing-data surprise. Verified rendered shapes on pass-50 anon walker capture at 947843c: hero reads `Reality-TV canons, sorted by how settled the ranking feels — by which formats have earned a defensible canon, not which shows I love most. The S tier invented or perfected its format. The A tier has the deep canon and the years to defend it.` (no mention of B); page body after the 11-card A section renders the B band literally as `B / RECENT ADDITIONS · UNDER REVIEW / The canon is in progress. Every season reviewed before it lands. / 0 SHOWS / Nothing here yet.` The prior pass-49 closure pulled the wrong half of the contradiction — it removed the B reference from the hero but left the structural band visible, so the page now contradicts itself (hero says two tiers; body shows three with the third empty) instead of reconciling (either name three tiers, or render two while B is empty). Same defect class as the pass-43 #339 / pass-46 #389 stat-strip-reconciles work (cross-surface count reconciliation on the chrome), now at the tier-band visibility layer of the same surface. Source: `/shows` page render — likely `src/app/shows/page.tsx` mapping `ShowTierBand` over `["S", "A", "B"]` regardless of which tiers have shows; the empty-band carve-out lives at the band component or the page's tier list. Bearings voice cue + visual law (`design/CLAUDE.md`) — `type does the heavy lifting`; a tier band whose body reads `Nothing here yet.` does not earn its full-width section on the page. Fix options: (a) **primary path — hide the B-tier band while it's empty**, and only surface it once at least one show lands in B. Single render-side change at `src/app/shows/page.tsx` (or the page's tier-list child component): filter the tier list to tiers with `length > 0` shows before rendering bands. The `How the tiers move` page-tail explainer continues to describe B so the system stays legible — readers learn what B is for without being shown an empty band that contradicts the hero. (b) **alternative — restore one sentence to the hero explaining what the B tier holds**, so the empty band reads as a promised-future-surface rather than a missing-data surprise. Acceptable but partial — the hero re-acquires the third tier, but the band still reads `0 SHOWS / Nothing here yet.` as a chrome dead-zone. (c) alternative — leave as-is. Rejected — hero+band contradict each other on a page whose entire job is to be a faithful index. Recommended (a) — hide the band while empty; preserve the explainer text in the page-tail. Pin: extend the colocated test on `src/app/shows/__tests__/page.test.tsx` (verify path) with bidirectional cases — (1) when no shows carry `tier === "B"`, the rendered DOM contains zero `data-tier="B"` elements (band not rendered); (2) when at least one show carries `tier === "B"`, the rendered DOM contains the band; (3) the hero copy enumerates exactly the visible tier set (regex: hero mentions every tier present in the page-body band list). Bidirectional drift guard: a future render that hides B-band without dropping it from the hero, or that names B in the hero without rendering a band, trips at verify time. Spoiler discipline P0 intact (chrome visibility filter only; no per-show verdict change, no canon-position change, no winner / elimination / finale beat exposure on any surface). (URL: /shows, source: critique-pass-50) — 947843c — issue: #412 — RESOLVED 16a2247: took fix shape (a) — `src/app/(default)/shows/page.tsx` now maps over `populatedTiers` (the same `TIER_ORDER.filter(t => showsForTier(grouped, t).length > 0)` already used by `ShowsHero`'s `tiers` prop and the meta-description derivation) instead of `TIER_ORDER`. Single-line render-side change. Reverses critique-pass-14 #202's empty-band placeholder — the `<HowTiersMove>` legend explains the tier system in prose on its own and does not need an empty band to refer to. Hero, meta description, and page body now all enumerate the same set. Pinned bidirectionally: colocated `src/app/(default)/shows/__tests__/page.test.tsx` gained a fresh describe block with five cases — (1) when no show carries `tier === "B"` the rendered DOM contains zero `data-tier="B"` elements; (2) when ≥1 does, the band renders; (3) hero copy enumerates exactly the rendered tier set (regex parity for every tier in S/A/B); (4) every rendered band carries a `shows-grid` (no `tier-empty` surfaced); (5) empty catalog renders zero tier sections. E2e `apps/e2e/tests/shows-index.spec.ts` updated in lockstep: the first test asserts tier sections render in monotone S→A→B subset order and every rendered band carries a shows-grid (no tier-empty); the lede coverage test reads populated tiers from every rendered tier-section (not from sections with a shows-grid, since the carve-out no longer exists); the B-tier status-pill test guards on `bSection.count() > 0` rather than `bGrid.count() > 0`. `src/components/shows/tierLede.ts` header comment updated to point at #412 + describe the reversal of #202. Spoiler P0 intact (chrome visibility filter only; no per-show verdict change, no canon-position change, no winner / elimination / finale beat exposure). Verify gate green: leg1 tokens + typecheck + no-raw-img + colocation + 193 unit files / 2717 tests + 88 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs); leg2 build (374 pages); leg3 1362 e2e. Closes #412.

- [x] [MED] [anon] Home page leads in institutional third-person while every interior page a first-time visitor clicks into reads in first-person editor-voice — the narrator changes register on the first click, draining the `knowledgeable peer` promise the bearings define. Verified rendered shapes on pass-48 anon walker captures at f303ca3: home `/` lede reads `Two rankings for every show. One written by an editor with the whole series in their head; one voted by the readers who lived through it.` (institutional / third-person `an editor`, `readers`). First-click destinations: `/shows/survivor` body reads `I've ranked every single one.` and the hero `tagline` carries `Strangers on a beach, voting each other off until one is left standing.` framed in the editor's voice; `/themes` lede reads `12 lists I'd defend in a group chat — 3 featured this month.` (first-person `I'd`); `/about` lede reads `tiered.tv ranks TV seasons without spoiling them. For every show I cover, two rankings live side by side.` (first-person `I cover`). A stranger clicking home → any interior surface in one click meets two narrators: the home institutional voice (`an editor`) and the interior signed-byline voice (`I cover`, `I'd defend`, `I've ranked`). Same defect class as the pass-31 #306 / pass-45 #381 plural-voice drain (RESOLVED at the interior surfaces) — that closure pulled the interior pages onto a unified singular first-person voice; this row names the *home page didn't get the same treatment*. The home page is the one surface a first-time anonymous visitor lands on first, and it's the surface that introduces the editor — but it does so in a register the rest of the product has explicitly moved off. Source: home page lede / `01 · CURATED / Editor's Canon` and `02 · LIVE / Community Rank` paragraph copy — likely `apps/web/src/app/page.tsx` or a sibling component (verify path + content source at fix-time; the literal `Two rankings for every show. One written by an editor with the whole series in their head` is the locator). Bearings voice cue (`plan/bearings.md:370`) — `knowledgeable peer — plain sentences over clever ones`; a peer introduces themselves in the same voice they speak in. Fix options: (a) **primary path — rotate the home lede onto the same first-person editor voice the interior pages already use**. Candidate rewrite: `Two rankings for every show I cover. One I write — the canon, ordered, with reasons. One you vote — live, restless, real numbers per season.` (preserves the structural beat — two rankings, editor + readers — while moving off `an editor` to `I` to match the interior pages). The `01 · CURATED / 02 · LIVE` section paragraphs that follow similarly rotate onto `I` for the curated voice and `you` for the community voice. Single content edit (or component-literal edit) at the home page. (b) **alternative — rotate every interior page back to third-person institutional** so home + interiors align on `an editor` / `the editor`. Rejected — pass-31 #306 and pass-45 #381 deliberately moved the interior pages onto the singular first-person voice as the bearings-aligned default, and the interior surfaces are the higher-traffic surfaces (a reader spends more time on a show page than on the home page); rotating the interiors back would re-open two prior closures. (c) **alternative — leave as-is**. Rejected — the home-vs-interior narrator switch is the defect a stranger hits on the first click. Recommended (a) — single home-page content edit, aligns home with the interior voice the prior closures established. Pin: extend `scripts/content-check.ts` with a `collectCrossSurfaceNarratorVoiceIssues` invariant — for each *editorial* surface (home lede, show page hero `tagline`, show page body, themed list lede, /about lede), assert the narrator-voice pattern matches the singular first-person form (`/\bi\b|\bI\b|\bI'(ve|d|m|ll)\b/` present AND `/\ban editor\b/i` absent). Initial floor: lax (warn on home if it carries `an editor` rather than `I`); strict at floor 0 once the rewrite ships. Sibling colocated test in `src/content/__tests__/content-check.test.ts`. Bidirectional drift guard: a future authoring pass reverting the home to institutional voice trips at verify time. Spoiler discipline P0 intact (home page voice rotation only; no per-show verdict change, no canon-position change, no winner / elimination / finale beat exposure on any surface — the rotation names the editor's authorship, not any show's content). (URL: /, source: critique-pass-48) — f303ca3 — issue: #411 — RESOLVED 1141b1e: took the row's primary path (a) — rotated the home lede + dual-callout cells onto the same first-person editor voice the interior pages (show-page body, themed-list lede, /about lede) already use. `src/components/home/HomeHero.tsx` lede swapped `Two rankings for every show. One written by an editor with the whole series in their head; one voted by the readers who lived through it.` → `Two rankings for every show I cover. One I write — the canon, ordered, with reasons. One you vote — live, restless, real numbers per season.` (preserves the structural beat — two rankings, editor + readers — while moving off `an editor` to `I cover` / `I write` and `the readers` to `you vote`). `HomeDualCallout` curated cell rotated to first-person (`written by an editor who has watched the whole show twice.` → `I write after watching the show through twice.`) and live cell rotated to second-person (`One reader, one vote per season — does it belong in the community top 10?` → `One vote per season — does it belong in your community top 10?`; `Signed-in voters self-attest they watched the season end to end` → `When signed-in, you self-attest you watched the season end to end`). Every existing colocated test pin preserved (one-vote-per-season, community-top-10, no-pairwise, finale-cadence, three-weight-ladder, self-attest mechanic, lowest-to-highest weight ordering). Pinned per the row's spec at `scripts/content-check.ts` via a new `collectHomeNarratorVoiceIssues` helper that scans the two home component source files for the rejected institutional markers (`an editor` / `the readers` / `one reader`); ships STRICT at floor 0 — the rewrite drains every offender in the same tick. One-line `HOME_NARRATOR_VOICE_STRICT` toggle mirroring the nineteen lax→strict invariants already in the runner (`EDITORIAL_BYLINE_SINGULAR_STRICT`, `SHOW_TAGLINE_PLURAL_STRICT`, etc.). Sibling colocated test in `src/content/__tests__/content-check.test.ts` runs the helper against the live home component source and asserts zero violations; bidirectional drift guard — a future authoring pass regressing the home to institutional voice trips at the verify gate. `HomeHero.test.tsx` + `HomeDualCallout.test.tsx` gained colocated unit pins: positive — lede contains `I cover` + `I write` + `you vote`, curated cell contains `I write`, live cell contains `your`; negative — no `an editor`, no `the readers`, no `one reader`. The row's broader pin ask (`collectCrossSurfaceNarratorVoiceIssues` walking home + show-page tagline + show-page body + themed-list lede + /about lede with a singular first-person regex contract) was scoped down to the home surfaces this tick — the interior surfaces already carry the first-person voice the row names, and their drift guard sits at the pass-31 #306 / pass-45 #381 / pass-47 #406 / pass-49 #408 closures (editorial-byline + tagline + canon methodology + chrome-narrator pronoun families); the home surfaces were the single live violator and are now pinned. Closure pattern matches pass-49 #408's narrator-pronoun consolidation at /shows — the cross-page voice-register family lands at the home surfaces this tick. No URL / schema field / e2e fixture row owed — the smoke walker only pins 200/H1/no console errors on `/`; the canonical-urls walker inherits the new copy cleanly. Spoiler discipline P0 intact (home page voice rotation only; no per-show verdict change, no canon-position change, no winner / elimination / finale beat exposure on any surface — the rotation names the editor's authorship, not any show's content). Verify gate green: leg1 tokens + typecheck + no-raw-img + colocation + 193 unit files / 2712 tests (incl. the 5 new home-voice pins) + 134 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs); leg2 build; leg3 1362 e2e. Closes #411.

- [x] [MED] [authed] /shows/survivor/season/heroes-vs-villains VotePair block for a signed-in user who has not yet voted on HvV renders the literal sequence `YOUR VOTE / CAST VOTE / YOU HAVEN'T VOTED YET / 1 / COMMUNITY VOTE / one vote per reader. community rank updates weekly.` — the bare integer `1` between the un-voted-state label and the singular noun `COMMUNITY VOTE` reads as ambiguous: is `1` the community vote tally (one reader voted) or a vote-counter widget value? Either reading lands badly on Survivor's #02 canon slot — a single-digit community tally on the most-canonized returnee season undersells the placement, and the singular noun (`VOTE` not `VOTES`) reinforces the `n=1` read. Verified on the pass-49 authed walker capture at f4ebe96; consistent across desktop + mobile viewports. Same defect class as the resolved pass-46 ShiftsRow vote-volume-floor work (which gated the rank-shift surface behind a minimum vote threshold so the surface reads honestly) — this is the same class at the VotePair tally layer rather than the rank-shift layer: a single-digit community count surfaces as a number without context. Source: VotePair component rendering the community tally (likely `src/components/community/VotePair.tsx` or the community-rank child renderer reading from the phase-35 `compute_weighted_rank()` RPC). Bearings voice cue (`plan/bearings.md`) — `knowledgeable peer — plain sentences over clever ones`; a peer says `1 vote so far` not `1` + `COMMUNITY VOTE` adjacent. Fix options: (a) **primary path — label the integer inline and pluralize the noun honestly**. Candidate rewrite: `YOUR VOTE / CAST VOTE / YOU HAVEN'T VOTED YET / 1 vote so far / community rank updates weekly.` (drops the bare integer + singular-noun pair, names the tally, drops the redundant `COMMUNITY VOTE` label when there's literally one). For tallies ≥ 2: `N votes so far`. (b) **primary-alt — gate the community tally behind the same minimum-vote floor that ShiftsRow uses**. Below floor: hide the tally line entirely (or render a `community rank surfaces after N readers vote` affordance). Mirrors the resolved pass-46 ShiftsRow vote-volume-floor mechanic. Either (a) or (b) closes the defect; (a) is the smaller fix, (b) is the more honest one and matches the pattern already established for ShiftsRow. (c) alternative — leave as-is. Rejected — `1 / COMMUNITY VOTE` adjacent on the #02 canon slot reads as a defect on first sight. Recommended (b) — apply the same vote-volume floor that gates ShiftsRow to the VotePair community-tally surface, with (a)'s labeling for above-floor states. Pin: when applying (b), share the floor constant + colocated tests with the ShiftsRow floor work (single constant rather than two parallel ones, so future floor adjustments stay in lockstep). Spoiler discipline P0 intact (vote-surface affordance only; no per-season verdict change, no canon position change, no winner / elimination / finale beat exposure). (URL: /shows/survivor/season/heroes-vs-villains, source: critique-pass-49) — f4ebe96 — issue: #410 — RESOLVED 25cdaac: took the row's path (a). `src/components/composition/VotePair.tsx` default props flipped — `label: 'community votes' → 'votes so far'`, `labelSingular: 'community vote' → 'vote so far'` — single-token edit on the count-cell label so the rendered text reads `1 vote so far` (n=1) / `12 votes so far` (n≥2) / `0 votes so far` (n=0). The "so far" suffix names the count as a tally with implicit time-context; the surrounding voteHelp (`one vote per reader. community rank updates weekly.`) + voteQuestion (`Does this belong in the community top 10?`) already carry the community framing so the count cell drops the redundant `community` prefix without ambiguity. The integer remains the distinct voter count on the target (pass-34 #361 retarget preserved — only the wording around it moves). In-source comment at VotePair.tsx names the pass-49 evolution + the pass-34 history + the spoiler P0 invariant. Pinned per the row's spec at `src/components/composition/__tests__/VotePair.test.tsx`: (1) the existing `pluralize-aware label` describe block flipped to the new strings — count=0 → `votes so far`, count=1 → `vote so far`, count=2 → `votes so far`, round-trip retract flips singular→plural; (2) the existing `cross-surface parity (pass-34 #361)` describe block widened to a tridirectional drift guard renamed `cross-surface parity (pass-34 #361 / pass-49 #410)` — positive `/votes? so far$/` regex across five state fixtures, the existing negative `/net votes?/` pin preserved, NEW negative `/^community votes?$/` pin asserts the label never regresses to the pass-34 bare framing the pass-49 finding closed. e2e mirror at `apps/e2e/tests/vote-state-pill.spec.ts` lines 118 + 210 ports the same tridirectional drift guard to the two render paths (authed-voter-state-cap path + anon-pair-without-cap path). Sibling positive: the existing custom-prop test (`label="approvals"` / `labelSingular="approval"`) is unchanged — the defaults flip without breaking caller-supplied label props. Closure pattern matches pass-34 #361's bidirectional pin precedent — same surface (`vote-label`), same defensive shape, one additional drift axis (regression to the prior intermediate framing). No URL / schema field / content drift owed; about-page / show-page references to `community vote` describe the system concept (canon vs. community ranking), not the count-cell label, so they stay. Spoiler discipline P0 intact (chrome label literal edit only; no per-season verdict change, no canon-position change, no winner / elimination / finale beat exposure on any surface). Verify gate green: leg1 tokens + typecheck + no-raw-img + colocation + 193 unit files / 2707 tests (incl. the flipped + new pins) + 88 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs); leg2 build; leg3 1362 e2e (incl. updated vote-state-pill assertions). Closes #410.

- [x] [HIGH] [anon] /themes/best-finales the verb `built` (or its participle / present-participle form) anchors the central editorial claim across **5 of 7** entries in the same list, at list-cards distance. Concrete observed shapes from the rendered detail page on the pass-49 anon walker capture at f4ebe96: #01 Amazing Race S07 second sentence ends `the format's live sprint is built right.`; #02 Survivor HvV first sentence ends `closes on the final tribal the format was building toward.` and the same blurb's second sentence ends `the all-star format hitting the ceiling it was built toward.` (the architectural verb appears **twice in the same entry**); #05 Drag Race S06 second sentence reads `the US adaptation proves it can hold the format's tension all the way down.` — RESOLVED below at `final banishment`, but #05's headline above carries `the final banishment the format was built for`; #07 Big Brother S10 reads `a finale built for it.` The other two entries (#03 Top Chef Las Vegas, #04 Survivor S40 Winners at War, #06 Drag Race S15) terminate on different verb-stems. So 5 of 7 list entries reach for the same architectural metaphor `[the finale] was built [toward / for / right]` as the central claim, with #02 doubling it inside one blurb. At a list-cards distance — the way the reader actually scans `/themes/best-finales` — `built [toward/for/right]` becomes the visible verbal tic of the list rather than a deliberate editorial parallel. Same defect class as the resolved pass-32 #313 / pass-33 / pass-34 within-entry phrase-repetition family AND the still-pending pass-36 `final tribal` cross-entry-within-show row at line 1135 (which is narrower: same-show only). This finding is the broader cross-entry-across-shows axis: a single architectural metaphor leaking into the majority of the list's central claims. Source: `content/themes/best-finales.md` entries #01 (Amazing Race S07) blurb second sentence; #02 (Survivor S20 HvV) blurb first sentence + second sentence; #05 (Drag Race US S06) headline + body; #07 (Big Brother S10) blurb. Bearings voice cue (`plan/bearings.md:370`) — `knowledgeable peer — plain sentences over clever ones`; a peer doesn't reach for the same architectural verb on five of seven entries on the same list, especially when the canon's editorial pitch is one editor's signed-take. Fix options: (a) **primary path — rewrite at least three of {#01, #02, #05, #07} to anchor on a different central verb that names what each finale specifically does**. Candidate rotations: #01 (sprint format) → `the format's live sprint lands flat-out.` / `the format's live sprint earns its sprint.`; #02 (Survivor HvV — the doubled-`built` entry) → keep one architectural beat at most; rotate the first sentence onto `closes on a final tribal that reads as the format's verdict.` and let the second sentence stand on `the all-star format hitting the ceiling it had been chasing.` (or `the ceiling its returnee era had been chasing.`); #05 (Drag Race US S06) → rotate the headline off `was built for`, e.g. `The Round Table tightening into the final banishment the format had been chasing.`; #07 (Big Brother S10) → `a finale that earns it.` / `a finale that pays it off.`. Each rotation preserves the entry's editorial point (live-sprint format / format ceiling / final banishment / payoff) while breaking the `built` repetition that the eye picks up at card-stack distance. Single content-file edit on `content/themes/best-finales.md`. (b) alternative — rewrite all 5 of {#01, #02, #05, #07} (treating #02 as one entry with two `built` instances). Rejected — over-correcting risks scrubbing the architectural metaphor entirely; the metaphor is fine once or twice on a 7-entry list, the defect is its concentration. (c) alternative — leave as-is. Rejected — 5 of 7 is past the threshold where a list reads as varied editorial takes vs. a paraphrase of one take. Recommended (a) — content-curator edits {#01, #02 first-and-second-sentence pair, #05 headline, #07} to break the `built [toward/for/right]` cluster. Pin: extend the existing `scripts/content-check.ts` `collectThemeBodyPhraseRepetitionIssues` invariant with a same-list-cross-entry verb-stem check — for each theme, group all blurb + headline fields by entry and assert no single verb-stem (`built` / `building` etc.) anchors the central claim across more than 2 of N entries (≤2/7 = 28%, the editor can run the metaphor twice but not five times). Same shape as the existing within-entry stem-pair check, narrower scope. Initial floor: lax (the current best-finales offender shape would warn, not fail); strict at floor 0 once the corpus drains. Bidirectional drift guard: future themed-list authoring will trip at verify time if the same verb-stem anchors >2 entries. Sibling colocated test in `src/content/__tests__/content-check.test.ts`. Spoiler discipline P0 intact (editorial prose edit only; no per-season verdict change, no canon position change, no winner / elimination / finale beat exposure — every candidate rotation describes the *frame* of the finale, not its outcome). (URL: /themes/best-finales, source: critique-pass-49) — f4ebe96 — RESOLVED 3a39e4d: editorial drain on `content/themes/best-finales.md` rotated tagline + entries #01 / #02 (the doubled-carrier — both `built` instances out) / #05 / #06 / #07 off the `build` verb-stem. New anchors per entry — tagline `had been chasing`, #01 `runs flat-out`, #02 title `reads as the format's verdict` + blurb `had been chasing`, #05 `proves the format travels`, #06 `climbs toward`, #07 `lands a finale that earns it` + `spent assembling`. Corpus sweep with the new strict invariant surfaced a second list at floor — `best-reunion-specials` had 3 of 7 entries on the stem (#3 the-challenge / #5 top-chef S08 / #6 survivor S40) — drained inline (`anchored on` / `leaned on` / `climbing toward`). End state: `build` stem at 1 of 7 in best-finales (entry #06 title `built on craft`, deliberate single beat) and 0 of 7 in best-reunion-specials, both well under the strict floor of 3. Pin: shipped `collectThemeVerbStemRepetitionIssues` in `scripts/content-check.ts` + wired strict at floor 3 in the runner. Sibling defect to `collectThemeSynonymClusterIssues` (noun-cluster dodging); this catches the broader cross-entry verb-stem anchoring axis. Same shape, narrower scope. `category: single` lists exempt; \b-bounded match so `rebuild` / `builders` don't false-positive. Initial cluster dictionary: `build` family (extensible — future critique passes adding flagged verb-stems append to the dictionary). Sibling colocated test exercises live-catalog pass + pre-rewrite shape + floor + category-single exempt + tiny-list skip + multi-form de-dupe + word-boundary discipline (7 cases). Spoiler discipline P0 intact (editorial prose only; no per-season verdict, canon-position, winner, elimination, or finale-beat exposure on any rotation). Verify green all three legs: leg1 tokens + typecheck + no-raw-img + colocation + 1356 unit tests (incl. 7 new) + 134 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs); leg2 build; leg3 1362 e2e. Closes #409.

- [x] [MED] [anon] cross-surface editor-voice drift on the natural anon nav path /shows → /themes → /about — the editor refers to themselves as `we` on /shows and as `I` on /themes + /about, within a single browsing session. Concrete observed shapes on the pass-49 anon walker captures at f4ebe96: /shows hero second sentence reads `sorted by how settled the ranking feels — by which formats have earned a defensible canon, not which shows we love most.` (institutional plural `we`). /themes hero reads `12 lists I'd defend in a group chat — 3 featured this month.` (first-person singular `I`); two lines below: `Every list here is editor-signed and stable — written once, revised when I change my mind.` (first-person singular `I`). /about opens `tiered.tv ranks TV seasons without spoiling them` (institutional third-person), then immediately switches to `For every show I cover, two rankings live side by side` (first-person singular `I`). A first-time visitor on the natural browse path /shows → /themes → /about hits three voices in two clicks. The pass-47 #406 closure unified the editorial *byline* on plural-to-singular (`Editors` → `Editor`); the residual is that the editorial *narrator* still splits between `we` (on /shows hero) and `I` (everywhere else). Same defect class as the resolved pass-47 #406 (plural-byline axis, editorial-attribution layer) and the resolved pass-48 (iii) home-page institutional vs. interior first-person work, now at the cross-page narrator-pronoun layer: /shows is the lone surface still using `we`. Source: `/shows` hero copy (likely `src/app/shows/page.tsx` literal or a tier-explainer content fragment under `src/components/shows/`). Bearings voice cue (`plan/bearings.md:370`) — `knowledgeable peer — plain sentences over clever ones` + `voice: knowledgeable peer, never pretentious`; the canon's pitch on /about and the editor's record are explicitly singular (`one person, one position per season` — `content/legal/about.md:29`), so the plural `we` on /shows contradicts the editorial constitution that /about establishes. Fix options: (a) **primary path — flip /shows hero from `we` to `I`**. Candidate rewrite: `sorted by how settled the ranking feels — by which formats have earned a defensible canon, not which shows I love most.` Single-character change on the literal (`we` → `I`) + the verb stays singular (`love`). Lands /shows in the same first-person register as /themes + /about. (b) alternative — keep `we` on /shows and flip /themes + /about back to `we`. Rejected — /about's editorial constitution is explicitly singular (`one person`), reverting it contradicts the same line that anchors editor-canon legitimacy. (c) alternative — leave as-is. Rejected — three voices in two clicks is a chrome-discipline defect even if each surface in isolation reads fine. Recommended (a) — single-line content edit on /shows hero. Pin: extend `scripts/content-check.ts` with a `collectChromeNarratorPronounDrift` invariant — for each chrome-rendering page surface (home / shows / themes / about), scan the hero + lede + intro text for first-person plural editor-self-reference (`we love` / `we rank` / `we ranked` / `our canon` etc.) and flag any non-quoted instance. Initial floor: lax (warn on /shows residual); strict at floor 0 once /shows is rotated. Bidirectional drift guard: future content edits that re-introduce `we` editorial framing trip at verify time. Sibling colocated test in `src/content/__tests__/content-check.test.ts`. Spoiler discipline P0 intact (chrome-voice edit only; no per-season verdict change, no canon position change). (URL: /shows, source: critique-pass-49) — f4ebe96 — issue: #408 — RESOLVED this commit: took the row's primary path (a). `src/components/shows/ShowsHero.tsx:28` rewrote the literal `not which shows we love most.` → `not which shows I love most.` — single-token edit on the hero lede; verb `love` stays singular. Lands /shows in the same first-person singular narrator register as /themes (`12 lists I'd defend in a group chat`) + /about (`For every show I cover`); preserves /about's editorial constitution (`one person, one position per season` — content/legal/about.md:29) which the prior plural `we` contradicted. Pinned per the row's spec at `src/components/shows/__tests__/ShowsHero.test.tsx` in a new `editor narrator pronoun (critique pass-49)` describe block carrying two cases — (1) positive: rendered lede text matches `/which shows I love most/`; (2) negative bidirectional drift guard: rendered lede text does NOT match `/which shows we love most/` (locks the singular form so a future authoring pass landing the editorial-`we` plural trips at unit time). Sibling positive: the existing pass-40 `defensible canon` voice block at the same component continues to pin the bolded-accent clause unchanged — the rewrite only touched the trailing noun phrase. Closure pattern matches pass-47 #406 (plural-byline axis) + pass-48 (iii) home-page institutional→first-person work — the narrator-pronoun consolidation lands at /shows last. Pin deferred this tick on the row's prescribed `collectChromeNarratorPronounDrift` content-check invariant — the invariant would walk chrome literals across home / shows / themes / about (mixed TSX literals + content/* MD fields) and is the kind of structural lift that earns its own tick once the residual surface is closed (this tick lands the single live violator; the colocated test pins the regression at the page-component layer until a future tick generalizes). No URL / schema field / e2e fixture row owed — `grep -rn "we love most\|I love most" apps/e2e/` returns zero; the smoke walker only pins 200/H1/no console errors on `/shows` so it inherits the new copy cleanly. Spoiler discipline P0 intact (chrome-voice literal edit only; no per-show verdict change, no canon-position change, no winner / elimination / finale beat exposure on any surface). Verify gate green: leg1 tokens + typecheck + no-raw-img + colocation + unit tests + script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs); leg2 build; leg3 1362 e2e (7.9m). Closes #408.

- [x] [LOW] [anon] /about `Become an editor` body calls readers to `open an issue on GitHub` and then refers to `New editors come in by invitation after a draft round` — `draft round` is undefined in-page and nowhere else on the site. Verified rendered shape on pass-47 anon walker capture at 6c72463: /about Become an editor section body reads `If you want to write canon for a show — or push back on one — open an issue on GitHub and tell me which show and which season. New editors come in by invitation after a draft round.` No prior or later definition of `draft round` appears on the page; a grep across the rest of the site surfaces no other reference (the only other `draft` token across the corpus is in unrelated content). A reader who pitches by opening a GitHub issue has no idea what `draft round` means as a process — is it a structured editorial cycle the editor runs on a cadence? A sample-season write-up the candidate submits? A draft of an in-progress canon entry? The reader is told `come in by invitation after [an undefined process]`, which lands flat between the warm `tell me which show and which season` call and the blank wall of `draft round`. Same defect class as the resolved pass-45 /about narrator-drift work (page voice consistency on /about), now at the undefined-term layer rather than the narrator-shift layer. Source: `content/legal/about.md` Become an editor section (verify the exact field name at fix-time). Bearings voice cue (`plan/bearings.md:370`) — `knowledgeable peer — plain sentences over clever ones`; a peer says what the process actually is in one clause, not a term-of-art the reader has to decode. Fix options: (a) **primary path — replace `draft round` with a plain-spoken one-clause description of what actually happens**. Candidate rewrites: `New editors come in by invitation after a sample season write-up we agree on.` (names the artifact + the agreement); or `New editors come in by invitation after we trade a sample season write-up and a take.` (denser, names the back-and-forth); or `New editors come in by invitation once we've seen a sample season write-up and agreed on a take.` (most explicit, names the sequencing). Each preserves the editor's gatekeeping discretion + the invitation-rather-than-application model; drops the undefined `draft round` term-of-art. Single content-file edit at `content/legal/about.md` Become an editor section. (b) **alternative — define `draft round` in a parenthetical** — `New editors come in by invitation after a draft round (a back-and-forth on a sample season write-up).` Smaller blast radius but preserves the unnecessary term-of-art. (c) **alternative — leave as-is**. Rejected — the undefined term on the contribution-call page is exactly the comprehension defect a peer voice should avoid. Recommended (a) — content rewrite to a plain one-clause description; drops the undefined term-of-art. Pin: no automated invariant — the defect class is per-page editorial review, not a structural drift; the next /critique pass over /about will catch a recurrence. Spoiler discipline P0 intact (editorial copy rewrite only on a legal/identity page; no per-show verdict change, no canon position change, no winner / elimination / finale beat exposure — the rewrite names a process step, not show content). (URL: /about, source: critique-pass-47) — 6c72463 — issue: #406 — RESOLVED 29b51f3: took the row's primary path (a). `content/legal/about.md` Become-an-editor close rewrote `New editors come in by invitation after a draft round.` → `New editors come in by invitation after a sample season write-up we agree on.` — plain one-clause description that names the artifact + the agreement; preserves the editor's gatekeeping discretion + the invitation-rather-than-application model; drops the undefined `draft round` term-of-art per bearings voice cue (`knowledgeable peer — plain sentences over clever ones`). Pinned per the row's spec at `src/app/(default)/about/__tests__/page.test.tsx` with a new describe block `Become-an-editor close drops undefined draft round (#406)` carrying two cases — (1) positive: `body_md` matches `/sample\s+season\s+write-up\s+we\s+agree\s+on/`; (2) negative: `body_md` does NOT match `/\bdraft\s+round\b/i`. Bidirectional drift guard so a future authoring pass that drops the new clause OR re-introduces the undefined term-of-art trips at unit time. Closure pattern matches pass-45 #381 + pass-46 #393 + pass-47 #406 (drift guard on the page that owes the truth). No URL / schema field / e2e fixture row owed — content-file edit + colocated test only; no e2e pins the prior literal. Spoiler discipline P0 intact (editorial copy rewrite only on a legal page; no per-show verdict change, no canon-position change, no winner / elimination / finale beat exposure). Verify gate green: leg1 tokens + typecheck + no-raw-img + colocation + 193 unit files + script + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs); leg2 build (374 pages); leg3 1362 e2e (7.9m). Closes #406.

- [x] [MED] [authed] /themes/best-finales entry #02 (Survivor S20 Heroes vs. Villains) blurb opener and the linked HvV season page `THE TAKE` opener share their cast-as-setup framing — a reader clicking through the list to the season page reads the same opening twice in a row. Verified rendered shape on pass-47 authed walker capture at 6c72463: /themes/best-finales entry #02 blurb opener reads `Twenty returnees split into heroes and villains compress everything Survivor had been by 2010 into one cast.` (sourced from `content/themes/best-finales.md:27` blurb post-pass-40 #365 closure rewrite); /shows/survivor/season/heroes-vs-villains Section 01 (THE TAKE) body opens `Twenty returnees split into a heroes tribe and a villains tribe…` (sourced from `content/shows/survivor/seasons/20-heroes-vs-villains.md` `take` or equivalent body field — verify the field name at fix-time). Two surfaces, two openers that share the same `Twenty returnees split into [heroes / heroes tribe] and [villains / a villains tribe]` framing — the second word of the season-page opener (`returnees`) is the same fact the themed-list entry's first sentence already established, and the cast-as-setup framing repeats verbatim at the noun-phrase level (`Twenty returnees split into…`). The themed list's entire job is to *send* the reader to the season page; when both surfaces open with the same cast-as-setup framing, the click loses its editorial reward — the reader is told the same thing twice in the same minute. Same defect class as the resolved pass-43 #322 cross-surface within-list verb-object close-beat repetition (same defect at the cross-list-to-season axis), now at the cross-list-to-season-page click-path layer the prior closure didn't reach. Source: `content/themes/best-finales.md:27` blurb opener AND/OR `content/shows/survivor/seasons/20-heroes-vs-villains.md` `take` body opener (the rewrite target is the themed-list entry, since the season-page TAKE is the canonical long form for the season; the themed-list entry is the surface that should differentiate itself from the page it links to). Bearings voice cue (`plan/bearings.md:370`) — `knowledgeable peer — plain sentences over clever ones`; a peer doesn't open the linked card and the destination page with the same setup. Fix options: (a) **primary path — rewrite the /themes/best-finales entry #02 blurb opener** to lead on the finale specifically (jury composition, final-tribal craft, the verdict close) rather than restating the season's setup the season page already owns. Candidate rotations preserving the entry's editorial point: `The jury reads like a court built from the show's own history, and the final tribal plays as a verdict on the returnee era it was about to enter.` (lifts the body's existing second sentence to the lead, drops the cast-setup framing the season page owns); or `A jury built from the show's own history, voting on a finale that reads like a verdict.` (denser variant); or `The all-star format at its ceiling, closing on a jury whose deliberation is the season's argument.` (anchors on the jury-craft beat the entry's title already promises). Each preserves the entry's editorial point; drops the verbatim cast-as-setup framing with the season page. Single content-file edit at `content/themes/best-finales.md:27`. (b) **alternative — rewrite the season-page TAKE opener** so the season page leads with a different framing. Rejected — the season-page TAKE is the canonical long form for the season; the themed list is the surface that should differentiate itself from the canonical (same precedent as the pass-46 #386 closure: linked card defers to canonical page, not the other way around). (c) **alternative — leave as-is**. Rejected — the cross-surface within-click-path echo at the same noun-phrase shape is the defect class. Recommended (a) — content-file rewrite at `content/themes/best-finales.md:27` to a finale-specific opener; preserves the season page's canonical TAKE form. Pin: extend `scripts/content-check.ts` with a `collectThemedEntrySeasonPageOpenerOverlapIssues` invariant — for each themed-list entry that references a `show`+`season`, assert that the entry's blurb opener does NOT share a 5-or-more-word verbatim prefix or noun-phrase with the linked season's `take` body opener when both are tokenized to lowercase word-arrays. Initial floor: lax (warn only on existing matches across the 12 themed lists × N seasons); strict at floor 0 once the catalog drains. Sibling colocated test in `src/content/__tests__/content-check.test.ts`. Bidirectional drift guard: a future authoring pass that re-introduces the cross-surface opener echo trips at verify time. Spoiler discipline P0 intact (editorial blurb rewrite only of the rank-card; the rewrite names the jury-craft / verdict-close structural beat without exposing the winner / elimination / finale beat — the existing rewrite candidate language is lifted from the entry's own already-shipped body second sentence post-#365). (URL: /themes/best-finales, source: critique-pass-47) — 6c72463 — issue: #396 — RESOLVED 76b6027: took the row's primary path (a). `content/themes/best-finales.md:27` blurb opener rewritten from `Twenty returnees split into heroes and villains compress everything Survivor had been by 2010 into one cast. The jury reads like a court built from the show's own history, and the closing argument carries a decade of receipts the players have on each other.` to `The jury reads like a court built from the show's own history, sitting in judgment on players they have a decade of receipts on. The closing argument plays as a verdict on everything Survivor had been by 2010, with the all-star format hitting the ceiling it was built toward.` — leads on the jury / finale-craft beat (the right argument for a *Best Finales* entry); preserves the original blurb's structural beats (jury composition, closing-argument craft, decade-of-receipts logic); drops the verbatim `Twenty returnees split into…` noun-phrase shared with the season page `pull:` opener at `content/shows/survivor/seasons/20-heroes-vs-villains.md`. Matches the pass-46 #386 closure precedent — the linked card defers to the canonical page, not vice versa. Pin deferred this tick — the row's prescribed `collectThemedEntrySeasonPageOpenerOverlapIssues` invariant (5-or-more-word verbatim prefix between entry blurb opener and linked season `pull`) would need to walk 12 themed lists × N entries × resolve linked season files; sized as a separate iterate tick once the catalog drains further (the current rewrite is the single live violator, so a strict-from-day-one invariant would land green but the helper-extraction is the kind of structural lift that earns its own tick). Sibling positive on the rewrite shape: the existing `collectThemedEntryVerbatimPhraseEchoIssues` (within-entry title↔blurb 5-gram echo, pass-40 #365) continues to pass — the new blurb does not echo the entry's title at the 5-token floor. Content-curator delegated the rewrite per iterate Hard Rule 4. Spoiler discipline P0 intact (editorial blurb rewrite only of the rank-card; no winner / elimination / vote count / finale beat exposure — the rewrite names jury composition + closing-argument craft + decade-of-receipts logic as structural beats, all spoiler-safe). No URL / schema field / e2e fixture row owed — themed-list blurb edit only; the smoke walker only pins 200/H1/no console errors on `/themes/best-finales` so it inherits the new copy cleanly. Verify gate green: leg1 tokens + typecheck + no-raw-img + 193 unit files / 2669 tests + 127 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs); leg2 build (374 pages); leg3 1362 e2e (8.2m). Closes #396.

- [x] [LOW] [anon] /shows S-tier band carries a subject-mismatch between its band subhead and Survivor's S-tile tagline: the band subhead at `src/components/shows/tierMeta.ts:12` (`name: 'The shows that invented or perfected their format.'`) frames SHOWS as the agent (the shows themselves invented or perfected something); the Survivor S-tile card_tagline at `content/shows/survivor.md:12` (`card_tagline: "The format that invented itself in episode one, and is still finding new ways to ask who you really are."`) frames the FORMAT as the agent (the format invented itself). Same band, two adjacent sentences pulling opposite directions on who-invented-what. Verified rendered shape on pass-46 anon walker capture at 45457ae for /shows: `S / FORMAT-DEFINING / The shows that invented or perfected their format. / 2 / SHOWS / REALITY COMPETITION · CBS / Survivor / The format that invented itself in episode one, and is still finding new ways to ask who you really are.` Reader has to reconcile `the shows... invented their format` (shows are agents) with `the format... invented itself` (format is agent) one paragraph apart. Same defect class as the resolved pass-19 stat-strip-mixed-tile-categories work — at the band subhead vs. card tagline subject-agreement layer. Bearings voice cue (`plan/bearings.md:370`) — `knowledgeable peer — plain sentences over clever ones`; a peer's subhead + immediately-following tagline align on who's doing the inventing. Fix options: (a) **primary path — soften the band subhead so it doesn't claim agency**. Suggested at `src/components/shows/tierMeta.ts:12`: `name: 'The shows whose format defined or perfected the genre.'` — drops the show-as-inventor frame, names the format as the genre-shaping fact; aligns with Survivor's tagline framing the format as the actor. Single literal edit at the source-of-record. The lede helper at `src/components/shows/tierLede.ts:12` (`'The S tier invented or perfected its format.'`) is a separate surface (tier-as-actor metaphor, recognized rhetorical figure) and stays unchanged. (b) **alternative — rotate Survivor's card_tagline** to make Survivor the agent instead of the format: `Survivor is the show that invented its own format in episode one, and is still finding new ways to ask who you really are.` Acceptable but the existing tagline is editorially load-bearing on the show page hero (verify: `content/shows/survivor.md:11` `tagline:` carries the same `The format that invented itself` frame); rotating it cross-surface is larger blast radius. Rejected as a smaller-blast-radius path is available at the band subhead. (c) **alternative — leave as-is** — rejected; the subject mismatch is the defect, even if mild. Recommended (a) — single literal edit at the band subhead, preserves Survivor's tagline and the tier-as-actor lede metaphor, aligns the subhead with the show-page hero's existing format-as-actor frame. Pin: extend the colocated test at `src/components/shows/__tests__/ShowsTierBand.test.tsx` (or equivalent component test — verify path at fix-time) with bidirectional cases — positive: S-tier band subhead matches `/whose format defined or perfected/i`; negative: does NOT match `/invented or perfected their format/i` (drift guard). Sibling positive: the existing tier-lede test continues to pin the `S tier invented or perfected its format.` literal at the lede layer (a separate metaphor surface). Spoiler discipline P0 intact (chrome subhead literal edit only; no per-show verdict change, no canon position change, no winner / elimination / finale beat exposure on any surface — the subhead frames the tier organization, not any specific show's outcome). (URL: /shows, source: critique-pass-46) — 45457ae — issue: #390 — RESOLVED ce4cbb5: took the row's structural intent (flip the subhead off shows-as-agent to align with Survivor's card_tagline format-as-agent frame) but **diverged from the row's recommended literal** because that literal (`The shows whose format defined or perfected the genre.`) conflicts with the prior pass-35 #332 closure, which locked all three S-tier surfaces (eyebrow tag / hero lede / band subhead) to `format` and away from `genre` with bidirectional pins at `src/components/shows/__tests__/tierMeta.test.ts:122-149`. Pivoted the literal to `The shows where the format invented or perfected itself.` — preserves `format`, avoids `genre` (passes the pass-35 vocabulary pin), drops `their format` (drops the shows-as-agent frame the row flagged), and parallels both the lede's tier-as-actor frame (`The S tier invented or perfected its format.`) and Survivor's card_tagline's format-as-agent voice (`The format that invented itself in episode one`) on the same band. Pinned per the row's pin clause at `src/components/shows/__tests__/tierMeta.test.ts` in a fresh describe block `S-tier band subhead subject agreement (critique pass-46 #389)` with two cases — (1) positive: S-tier band subhead matches `/where the format invented or perfected itself/i`; (2) bidirectional negative: does NOT match `/invented or perfected their format/i` AND does NOT match `/their format|their genre/i` (drift guard against either the pre-rotation shows-as-agent literal OR a future authoring pass landing the same defect with `genre`). Existing pass-35 #332 vocabulary-alignment block stays green — the new literal still matches `/format/i` and still does NOT match `/genre/i`. The `TierHead.test.tsx:12` `toContain('invented or perfected')` assertion continues to pass — the new literal still contains the phrase. The existing record-shape pin updated to the new name literal in lockstep. The lede helper at `src/components/shows/tierLede.ts:12` and the meta-description helper at `src/components/shows/tierMetaDescription.ts` are unchanged (separate surfaces — lede is the tier-as-actor metaphor, meta is the catalog description). Source-of-record comment added above the rotated literal in `tierMeta.ts` so future editors see the closure rationale at the source. No URL / schema field / e2e fixture row owed — `grep -rn "invented or perfected\\|their format" apps/e2e/` returns zero; the smoke walker only pins 200/H1/no console errors on `/shows` so it inherits the new copy cleanly. Spoiler discipline P0 intact (chrome subhead literal edit only; no per-show verdict change, no canon-position change, no winner / elimination / finale beat exposure on any surface). Verify gate green: leg1 tokens + typecheck + no-raw-img + 193 unit files / 2650 tests + 127 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs); leg2 build (374 pages); leg3 1362 e2e (7.9m). Closes #390.

- [x] [LOW] [anon] /shows hero lede `Reality-TV canons, sorted not by personal taste but by how settled the ranking is.` at `src/components/shows/ShowsHero.tsx:27-28` overclaims taste-free objectivity while the S/A band criteria the page then publishes are themselves editorial judgments. The lede declares the sort axis as "not personal taste, but how settled the ranking is"; the immediately-following sentences then publish the criteria as `The S tier invented or perfected its format.` + `The A tier has the deep canon and the years to defend it.` Both criteria are taste calls — what counts as "inventing or perfecting a format" is an editorial judgment about format-history; what counts as "deep canon" or "years to defend it" is a judgment about which seasons rank above which. The lede's "not by personal taste" framing reads as overclaiming objectivity in a way that runs counter to the elsewhere-honest /shows/survivor voice (`I'm not claiming to be objective. I'm trying to be honest.`). A reader who hops /shows → /shows/survivor reads two contradictory voices on the same editorial honesty question. Same defect class as the resolved pass-22 MED page-lede-contradicts-its-own-follow-on closure. Bearings voice cue — `knowledgeable peer — plain sentences over clever ones`; a peer names their editorial judgment rather than denying it. (URL: /shows, source: critique-pass-40) — ac3c88c — issue: #352 — RESOLVED 1529d62: took the row's recommended primary path (a). `src/components/shows/ShowsHero.tsx:27-28` rewrote the visible hero lede to `Reality-TV canons, sorted by <b>how settled the ranking feels</b> — by which formats have earned a defensible canon, not which shows we love most.` — keeps the sort-axis editorial frame, owns the perspective (`defensible canon`, `which shows we love most`), drops the `not by personal taste` overclaim. Bolded accent moves from `how settled the ranking is.` (with period) → `how settled the ranking feels` (no period — the em-dash carries the continuation). The meta-description helper at `src/components/shows/tierMetaDescription.ts:16` was already on the honest short form (`Reality-TV canons, sorted by how settled the ranking is.`) and is unchanged. Pinned per the row's spec at `src/components/shows/__tests__/ShowsHero.test.tsx` with a new `lede voice (critique pass-40)` describe block carrying two cases: (1) positive — the rendered lede text matches `/defensible canon/i` (names the editorial judgment instead of denying it); (2) negative — the rendered lede text does NOT match `/not by personal taste/i` (bidirectional drift guard against a future authoring pass silently regressing to the taste-free overclaim). Sibling positive on /shows/survivor honest-voice line is unchanged (already pinned by the canon-rationale render path tests). No e2e fixture row owed — `apps/e2e/src/fixtures/page-reads.ts` pins /shows existence + meta tags; the lede edit doesn't change any selector. Spoiler discipline P0 intact (chrome lede edit only; no per-show verdict change, no canon position change, no winner / elimination / finale beat exposure on any surface — the lede frames the catalogue page's editorial axis, not any specific show's outcome). Verify gate green: leg1 tokens + typecheck + no-raw-img + 188 unit files / 2534 tests + 127 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs); leg2 build (374 pages); leg3 1362 e2e (8.0m).

- [x] [MED] [authed] /shows/survivor/season/heroes-vs-villains vote-block reading order inverted in the signed-in-no-vote state. The block stacks four elements in this DOM order (verified across desktop + mobile authed captures): (1) VoteRowHead eyebrow at `src/components/composition/SeasonInfoCard.tsx:112-117` renders `YOUR VOTE` (title) + `CAST VOTE` (meta-hint) from `src/components/composition/VoteRowHead.tsx:35` state map's `signed-in-no-vote` literal `{ title: 'Your vote', meta: 'cast vote' }` (CSS uppercases both); (2) `<p class="vote-q">` at `SeasonInfoCard.tsx:118` renders the prompt `Does this belong in the community top 10?` (sourced from `season.vote_question` at `src/app/shows/[show]/season/[slug]/page.tsx:343-344` with that exact fallback literal); (3) `voteSlot` (VotePair component) at `SeasonInfoCard.tsx:119` renders the chevron-pair buttons + the state-cap pill `YOU HAVEN'T VOTED YET / +1 / COMMUNITY · NET VOTE`. The signed-in reader reads `YOUR VOTE / CAST VOTE / Does this belong in the community top 10? / YOU HAVEN'T VOTED YET / +1 / COMMUNITY · NET VOTE` — they are told to "CAST VOTE" before they read the question being voted on, and the status line `YOU HAVEN'T VOTED YET` then re-explains the button they already passed. Natural grammar is prompt → CTA → status (or eyebrow-context → prompt → CTA → status). The current order has the action-imperative meta `CAST VOTE` from the VoteRowHead's state-map render position above the question that scopes the action. The recent pass-22 #259 close (`cast yours` → `cast vote`) tightened the meta literal but kept it in the same DOM position above the vote-q prompt — the question being voted on still doesn't appear until after the CTA hint. Concrete observed sequence from the pass-40 authed walker capture on HvV (signed-in, no prior vote): `YOUR VOTE / CAST VOTE / Does this belong in the community top 10? / [chevron pair buttons] / YOU HAVEN'T VOTED YET / +1 / COMMUNITY · NET VOTE / one vote per reader. community rank updates weekly.`. Same defect class as the resolved pass-19 #242 / pass-20 community-pane "recompute" sweeps — page knows how to talk plainly elsewhere (the comment input at the bottom of HvV runs prompt → CTA → status grammar already: `Add a thought · no spoilers, please. / as @e2e / ⏎`). Bearings voice cue (`plan/bearings.md:370`) — `knowledgeable peer — plain sentences over clever ones`; a peer poses the question, then the action, then the state. Fix options: (a) **primary path — reorder the SeasonInfoCard `info-row-vote` block** so the vote-q prompt sits above the VoteRowHead. New JSX order at `src/components/composition/SeasonInfoCard.tsx:111-121`: `<div className="info-row" data-testid="info-row-vote"> <p className="vote-q">{voteQuestion}</p> {voteRowHead ?? <div className="info-row-head">...default...</div>} {voteSlot} <div className="vote-help">{voteHelp}</div> </div>`. CSS rule `.vote-q` may need a top-padding adjustment so the prompt + the VoteRowHead eyebrow read as a connected pair rather than two separate eyebrows. Single JSX reorder + one CSS rule tune; no contract change. (b) **alternative — change VoteRowHead's `signed-in-no-vote` meta from `cast vote` to a non-imperative hint** like `vote below` or drop the meta entirely so the eyebrow reads `YOUR VOTE` with no CTA-flavor literal above the question. Smaller blast radius (single literal edit at `VoteRowHead.tsx:35`) but doesn't fix the underlying reading-order — the eyebrow still sits above the prompt, just with weaker CTA grammar. Worth doing alongside (a) if the meta literal isn't earning its keep without the imperative; the recommended sequence is to ship (a) first and re-evaluate (b) as a follow-on. (c) **alternative — leave as-is** — accept the inverted reading order. Rejected — the prompt-after-CTA grammar is the comprehension defect; the reader being asked to cast before the question is posed is the symptom. Recommended (a) — single JSX reorder, brings the vote-block to natural prompt → CTA → status grammar matching the comment-input pattern elsewhere on the same page. Pin: extend `src/components/composition/__tests__/SeasonInfoCard.test.tsx` with a new describe block `vote-block reading order (critique pass-40)` containing two cases — (1) rendered DOM order: the `<p class="vote-q">` element's `compareDocumentPosition` against `<div class="info-row-head">` (VoteRowHead default) returns `DOCUMENT_POSITION_PRECEDING` (vote-q comes first); (2) the vote-q is the first child of `[data-testid=info-row-vote]` (strongest position invariant). Bidirectional drift guard against a future refactor reverting the reorder. Sibling positive on `VoteRowHead.test.tsx` is unchanged — its existing state-map cases pin the literal `cast vote` content; the position change runs at the SeasonInfoCard composition layer, not the VoteRowHead component layer. No e2e fixture row owed — `apps/e2e/tests/vote-state-pill.spec.ts:113` pins the `.meta` text content `cast vote` (unchanged in option a); the reading-order edit doesn't change any selector. Spoiler discipline P0 intact (chrome reading-order edit only; no per-season verdict change, no canon position change, no winner / elimination / finale beat exposure on any surface — the prompt + CTA + status literals are unchanged, only their DOM order). (URL: /shows/survivor/season/heroes-vs-villains, source: critique-pass-40) — ac3c88c — issue: #351 — RESOLVED 704077f: took the row's recommended primary path (a). `src/components/composition/SeasonInfoCard.tsx:111-128` swapped the `info-row-vote` child order so `<p class="vote-q">` is the first child of the row, followed by the `voteRowHead` slot (or the default `.info-row-head` fallback), then `voteSlot`, then `vote-help`. JSX-only change at the composition layer; `VoteRowHead` itself is unchanged so its state-map literals (`cast vote` / `change within 72h` / etc.) and the existing colocated tests at `VoteRowHead.test.tsx` continue to pass without modification. `src/styles/screens.css` `.vote-q` tightened `margin-bottom: 12px → 6px` so the prompt + the eyebrow (which carries its own `margin-bottom: 14px` for spacing to the buttons below) read as a connected pair rather than two separately-floating elements. The rule comment cross-references the pass-40 rationale. Pinned per the row's spec at `src/components/composition/__tests__/SeasonInfoCard.test.tsx` with a new `vote-block reading order (critique pass-40)` describe block carrying four cases: (1) with a `voteRowHead` slot supplied, the `<p class="vote-q">` precedes the slot in DOM order via `compareDocumentPosition`; (2) with no `voteRowHead`, the prompt precedes the default `.info-row-head` block in DOM order (the back-compat path); (3) the prompt is the first element child of `[data-testid=info-row-vote]` (strongest position invariant, bidirectional drift guard against a future refactor reverting the reorder); (4) the vote-slot buttons follow the eyebrow (CTA scopes the buttons, not the other way round). No URL / schema field / e2e fixture row owed — `apps/e2e/tests/vote-state-pill.spec.ts:113` pins the `.meta` text content `cast vote` (unchanged), and the smoke walker at `apps/e2e/src/fixtures/page-reads.ts:95` only asserts the `[data-testid=info-row-vote]` selector is visible; neither pins the previous child order, so both inherit the new reading order cleanly. Spoiler discipline P0 intact (chrome reading-order edit only; no per-season verdict change, no canon position change, no winner / elimination / finale beat exposure on any surface — the prompt + CTA + status literals are unchanged, only their DOM order). Verify gate green: leg1 tokens + typecheck + no-raw-img + 188 unit files / 2532 tests + 127 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs); leg2 build (374 pages); leg3 1362 e2e (8.1m).

- [x] [MED] [authed] /themes affordance grammar split on a single page: the 3 featured-this-month cards close with the explicit verb-form CTA `read the list →` (`src/components/lists/FeaturedCard.tsx:31` literal `const cta = 'read the list →'`, rendered inside `<b>{cta}</b>` at `:62`, kept lowercase by the recent #342 `.feat-foot b { text-transform: none }` override at `src/styles/lists.css:313`) while the 9 index cards close with a bare `→` arrow (`src/components/lists/ListRow.tsx:44-46` `<span className="list-row-arrow" aria-hidden="true">→</span>`) below the lifecycle status (`STABLE LIST`) with no verb. Same page, same content type (a card linking to /themes/[theme]), two affordance grammars. A reader scanning the page reads the 3 featured tiles as "read the list" actions and the 9 index tiles as bare nav-arrows — implying a meaningful affordance difference between them when none exists; both link to the same target route shape (`/themes/${theme.slug}`). The recent pass-35 #348 fix unified `read the list →` across all THREE featured-tile variants (big + small) — the comment at `FeaturedCard.tsx:25-30` documents the unification — but stopped at the featured-rail boundary. The 9 index cards never got the verb-form CTA; they keep the bare-arrow form from before the featured-rail introduction. Concrete observed shapes from the pass-40 authed walker captures: featured tile `... made the premise pay off. The comebacks the audience felt land. / STABLE LIST / read the list →`; index tile (BY STRUCTURE, Reunion specials): `... ensemble television at its widest. / 7 ENTRIES / STABLE LIST / →`. Same defect class as the resolved pass-38 #342 (`.feat-foot` vs `.list-row-meta` casing divergence — same eyebrow surface across featured + index rendering same string in two registers) — that close addressed the *casing* register at the lifecycle status; this row addresses the *CTA grammar* register at the affordance close. Bearings voice cue (`plan/bearings.md:370`) — `knowledgeable peer — plain sentences over clever ones`; a peer commits to one affordance grammar for the same content type across a single surface. Fix options: (a) **primary path — add `read the list →` to ListRow** matching the FeaturedCard close. Single literal edit at `src/components/lists/ListRow.tsx:44-46` replacing the bare `<span className="list-row-arrow">→</span>` with `<span className="list-row-arrow"><b>read the list →</b></span>` (or restructure with a dedicated `<b className="list-row-cta">read the list →</b>` element). CSS rule `.list-row-arrow` / `.list-row-cta` needs a `text-transform: none` override mirroring the `.feat-foot b` override so the lowercase CTA copy stays lowercase against the surrounding `.list-row-meta` uppercase. (b) **alternative — drop `read the list →` from FeaturedCard, leaving both surfaces as bare arrows**. Rejected — the featured-rail recently *gained* the verb-form via #348 + carries it as the editorially-intended close; dropping it would regress the pass-35 fix and weaken the affordance signal on the catalogue's headline shelf. (c) **alternative — leave as-is** — accept the two grammars. Rejected — same eyebrow / affordance surface, same content type, two grammars reads as accident not intent. Recommended (a) — single literal edit + CSS rule, brings the index cards' close grammar up to match the featured-rail's. Pin: extend the colocated tests `src/components/lists/__tests__/ListRow.test.tsx` with a regression case asserting the rendered tree contains the literal `read the list →` AND the rendered tree does NOT contain a bare `→` orphan (negative pin: a future refactor that drops the verb-form fails at unit time). Sibling positive in `FeaturedCard.test.tsx` already pins the featured-rail's `read the list →` (line 73 + 81); leave unchanged. Bidirectional drift guard against a future refactor reverting either surface. Spoiler discipline P0 intact (chrome CTA literal edit only; no per-show verdict change, no canon position change, no winner / elimination / finale beat exposure on any surface — the affordance grammar runs on the link-to-list, not the list's content). (URL: /themes, source: critique-pass-40) — ac3c88c — issue: #350 — RESOLVED d8f0ee6: took the row's primary path (a). `src/components/lists/ListRow.tsx:42-44` swapped from the bare span `<span className="list-row-arrow" aria-hidden="true">→</span>` to `<span className="list-row-arrow"><b>read the list →</b></span>` — mirrors the FeaturedCard close (`FeaturedCard.tsx:60` `<b>{cta}</b>` with `const cta = 'read the list →'`); drops `aria-hidden="true"` since the CTA is now meaningful copy, not a decorative glyph. `src/styles/lists.css` `.list-row-arrow b` new rule mirroring the `.feat-foot b` override (pass-38 #342): `font: 500 11px/1 var(--font-family-mono)`, `letter-spacing: 0.06em`, `color: var(--color-primary-base)`, `text-transform: none` (so the CTA stays lowercase against the adjacent `.list-row-meta` uppercase eyebrow), `white-space: nowrap` (so the CTA stays on one line in the grid cell across breakpoints). Rule comment cross-references both #342 and #350 so a future maintainer reading either rule sees the closure trail. Pinned per the row's spec: `src/components/lists/__tests__/ListRow.test.tsx` gained a new describe block `affordance grammar (critique pass-40 #350)` with two cases — (1) the rendered tree contains the literal `read the list →`; (2) the rendered tree contains exactly one `→` character AND the entire `.list-row-arrow` textContent equals `read the list →` (strongest invariant: the arrow span is the only `→` carrier and it carries the verb-form). Bidirectional drift guard: a future refactor that drops the verb form OR re-introduces a standalone arrow trips at unit time. Sibling positive in `FeaturedCard.test.tsx` already pins the featured-rail's `read the list →` at lines 73 + 81; leave unchanged. No URL / schema field / e2e fixture row owed — `apps/e2e` carries no selector pinning `.list-row-arrow` content. Spoiler discipline P0 intact (chrome CTA literal edit only; no per-show verdict change, no canon position change, no winner / elimination / finale beat exposure on any surface — the affordance grammar runs on the link-to-list, not the list's content). Verify gate green: leg1 tokens + typecheck + no-raw-img + 188 unit files / 2528 tests + 127 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs); leg2 build (374 pages); leg3 1362 e2e (8.1m).

- [x] [MED] [authed] /u/[handle] own-profile empty-state copy reads `New here. Cast one vote and your record starts writing itself.` (`src/components/profile/ProfileEmpty.tsx:44` — the post-pass-28 #293 warm-editorial-lede form that replaced the zeroed stat-tile row). The literal `New here.` fires unconditionally whenever the viewer has no votes — `selfView` is set (owner viewing own profile) AND the ternary at line 43-45 reads `selfView ? 'New here. ...' : 'No votes on the public record yet.'` with no recency gate on `joinedAt` or `createdAt`. The /u/e2e walk captured `Member since May 2026` directly above `New here.` — today is 2026-06-07, so the bot user is at minimum 7 days into membership and possibly 60+ days depending on the exact join date. A returning member two months in is greeted as new because the literal is a static string, not a function of join-recency. Distinct from the pending pass-37 #344 own-profile bare-scaffold finding (which addresses the missing stat-chip strip above the empty-state prose); this row addresses the literal greeting text below the prospective stat-chip strip — the two findings touch the same module but at different vertical layers (chips above, greeting below). Bearings voice cue (`plan/bearings.md:370`) — `knowledgeable peer — confident, warm, plain-spoken, never pretentious`; a peer doesn't greet a friend they've known a month as `New here.` — the warmth is meant to land when the reader actually IS new, and reads as boilerplate when the reader is not. Same defect class as the resolved pass-26 #282 / pass-27 #287 cross-surface drift family (the home claimed a mechanic /about didn't carry; the literal carried a state that the surrounding data didn't match), now at the within-page literal-vs-recency layer. Source: `src/components/profile/ProfileEmpty.tsx:38-46` (the ternary that fires `'New here. Cast one vote and your record starts writing itself.'` whenever `selfView` is set; the second branch fires the stranger-view literal which is independent of this finding). The `joinedAt` value is available — `Member since May 2026` is rendered just above this prose, so the data is on the page; only the literal doesn't read it. Fix options: (a) **primary path — gate the `New here.` framing on join-recency** in the ProfileEmpty component. Add a `joinedAt: Date | string` field to `selfView` (mirror the existing `showName` + `showHref` pattern), thread it from the page-side caller, and branch the empty-state literal on `(Date.now() - joinedAt) < 14 days`: under 14 days → keep the existing `New here. Cast one vote and your record starts writing itself.`; 14+ days → swap to a recency-honest literal like `No votes on the record yet. Cast one and it starts writing itself.` (drops the `New here.` claim, preserves the CTA framing, reads honestly against the `Member since May 2026` line directly above it). The 14-day floor matches the existing 7-day weight-tier boundary on /about's voting policy (`content/legal/about.md:35-37` accounts 7+ days carry full weight) with a small buffer to avoid greeting a barely-tenured account as already-stale. (b) **alternative — drop the recency-claim from the literal entirely and gate on action-count only** (option (b) from the row analysis): swap `New here. Cast one vote and your record starts writing itself.` → `No votes yet. Cast one and your record starts writing itself.` for all `selfView` empty-state branches regardless of join date. Simpler — no new prop, no new branch, no join-date threading. Reads honestly at every recency. Loses the `New here.` warmth for genuinely new members but preserves the CTA mechanic. (c) **alternative — leave as-is** — rejected; the greeting carries a recency-claim the surrounding chrome doesn't support, and the warmth lands as boilerplate on any tenured member who lands here without votes. Recommended (b) — smallest blast radius (single literal swap, no new prop, no caller threading), reads honestly at every recency including 0-day signups, preserves the CTA mechanic the pass-28 #293 closure landed for. The `New here.` warmth was the editorial cost the pass-28 closure paid to fix the soft-404 reading; the warmth doesn't carry its own weight on a tenured account, so dropping it is the cleaner editorial move. Pin: extend the colocated test on `src/components/profile/__tests__/ProfileEmpty.test.tsx` (which already pins the existing literal at line 111) with two cases — (1) positive pin asserting the rendered empty-state contains `No votes yet` (post-rewrite literal) AND does NOT contain `New here` (regression guard); (2) negative pin asserting no branch of the component re-introduces a recency-claim literal (regex `/new here|just (joined|signed up)|welcome aboard/i` returns no match on either selfView OR stranger branch). Sibling positive on the stranger-view branch (`'No votes on the public record yet.'`) left unchanged — that literal is independent of recency. Spoiler discipline P0 intact (chrome literal edit only; no per-season verdict change, no canon position change, no winner / elimination / finale beat exposure — the literal names a count state, not a content state). (URL: /u/e2e, source: critique-pass-39) — 9c486a9 — issue: #346 — RESOLVED 2710afb: took the row's recommended-(b) path. `src/components/profile/ProfileEmpty.tsx:44` swapped from `'New here. Cast one vote and your record starts writing itself.'` to `'No votes yet. Cast one and your record starts writing itself.'` — drops the unconditional recency claim that fired with no `joinedAt` gate (so a 60-day-tenured account was being greeted as new under the `Member since May 2026` line), preserves the CTA mechanic the pass-28 #293 closure landed for, no new prop / no caller threading. The header comment of `ProfileEmpty.tsx` itself rewritten to name the new literal + the pass-39 rationale (the prior `New here.` form fired unconditionally with no recency input). Pinned per the #293 closure pattern: the existing self-view editorial-lede case at `ProfileEmpty.test.tsx:106` (renamed `#262 + #293 + #346`) positive-asserts the new literal AND gains two new negative-pin cases asserting no branch (selfView OR stranger) renders a recency-claim literal matching `/new here|just (joined|signed up)|welcome aboard/i` — bidirectional, so a future edit reaching for any of these forms trips the unit gate on both branches. No URL / schema field / e2e fixture row owed — chrome literal edit only; no e2e pins the prior `New here.` text. Spoiler discipline P0 intact (chrome literal edit only; no per-season verdict change, no canon position change, no winner / elimination / finale beat exposure — the literal names a count state, not a content state). Verify gate green: leg1 tokens + typecheck + no-raw-img + 188 unit files / 2525 tests + 127 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs); leg2 build (374 pages); leg3 1362 e2e.

- [x] [MED] [anon] /themes/best-finales entries #05 (The Traitors S02 Round Table) and #06 (RuPaul's Drag Race S6 Crown Coronation) carry within-entry headline-to-body verbatim echoes of the headline's load-bearing noun-phrase. Concrete observed shapes from the rendered detail page: #05 title (`content/themes/best-finales.md:44` family) reads `The Round Table tightening into the final banishment the format was built for.` and #05's body opens `Each Round Table tightens the math, but the finale's table sits in front of a banishment that costs a player the prize.` — the noun-phrase `Round Table tightening / tightens` repeats verbatim in headline + body opener within ~60 words. #06 title reads `The crown coronation pays off a finale built on craft.` and #06's body closes `The crown coronation lands a season whose cultural footprint outgrew its Logo airing.` — the noun-phrase `The crown coronation` repeats verbatim in headline + body close within ~70 words. Two of seven entries on the same list land the headline's key noun-phrase verbatim inside the body — the headline becomes a label the body restates rather than a hook the body extends. Distinct defect class from the pass-36 closure #337 (cross-entry body-opener synonym rotation across the seven entries) — that closure addressed the *opener-vocabulary* drift across the seven entries; this row addresses the *within-entry headline→body* verbatim noun-phrase echo, two entries out of seven. The other five entries (#01 Amazing Race, #02 Survivor HvV, #03 Top Chef Las Vegas, #04 Survivor Winners at War, #07 Big Brother) terminate their bodies on noun-phrases NOT named in their headlines — only #05 + #06 share the echo shape. Source: `content/themes/best-finales.md` entries #05 + #06 `title` + `body` fields. Bearings voice cue is `knowledgeable peer — plain sentences over clever ones` (`plan/bearings.md:370`); a peer doesn't restate the headline's load-bearing noun-phrase verbatim inside the body when the body has 50–70 words to extend the argument. Fix options: (a) **primary path — rework #05 body opener and #06 body close** so the headline's key noun-phrase pays off in the body's argument rather than restates as a label. Candidate rotation for #05 body opener: `Each banishment round tightens the math, but the finale's table sits in front of a vote that costs a player the prize.` (drops the second `Round Table`, keeps `banishment` from the headline, lets the body extend the headline's structural beat). Candidate rotation for #06 body closer: `The coronation seals a season whose cultural footprint outgrew its Logo airing.` (drops the second `The crown coronation`, keeps `coronation` as the structural beat the headline named, lets the body close on what the coronation seals rather than what it lands). Single content-file edit on `best-finales.md` entries #05 + #06. (b) **alternative — rework headlines instead** — rejected; the headlines are tighter than the body lines they share with, and the row's editorial weight sits on the body sentences. (c) **alternative — leave as-is** — accept the within-entry verbatim echo. Rejected — two of seven entries with verbatim headline-to-body repetition reads as a craft slip even though each in isolation is fine. Recommended (a) — single content-file edit on two entries, preserves the headline structural beats, drops the within-entry verbatim echo. Pin: extend `scripts/content-check.ts` with a `collectThemeEntryHeadlineBodyEchoIssues` invariant — for each theme entry, scan the title and body for a shared 2+ word noun-phrase (POS-shape-aware, not just literal); if a 2+ word noun-phrase appears verbatim in both, fail with entry title + offending phrase. Same shape as the existing `collectThemeBodyPhraseRepetitionIssues` invariant (within-entry body repetition), narrower scope (headline↔body). Initial floor: lax (warn only); strict at floor 0 once the corpus drains. Sibling colocated test at `src/content/__tests__/content-check.test.ts`. Spoiler discipline P0 intact (editorial prose edit only; the candidate rotations preserve the entries' editorial points — Traitors' banishment vs vote tension, Drag Race's coronation as cultural seal — without naming winner / elimination / finale-beat outcomes). (URL: /themes/best-finales, source: critique-pass-38) — d6cf91f — issue: #341 — RESOLVED a5c1de9: took the row's primary path (a). `content/themes/best-finales.md` #05 (Traitors S02) blurb opener swapped `Each Round Table tightens the math … banishments paid back across nights` → `Each banishment round tightens the math … votes paid back across nights` — drops the verbatim `Round Table` from the blurb opener and avoids the natural banishment/banishments adjacency the rewrite would have introduced. #06 (Drag Race S6) blurb closer swapped `The crown coronation lands a season whose cultural footprint outgrew its Logo airing.` → `The coronation seals a season whose cultural footprint outgrew its Logo airing.` — drops the verbatim `crown coronation` from the closer and reaches for the structural beat the headline named. Both candidate rotations preserve the entries' editorial points (Traitors' banishment-vs-vote tension, Drag Race's coronation-as-cultural-seal). Pinned per the row's prescription: `scripts/content-check.ts` gained `collectThemeEntryHeadlineBodyEchoIssues` — per-entry bigram intersection between `title` and `blurb` (verbatim content noun-phrase shared anywhere between the two, not just at the opener); `category: single` exempt. Distinct defect class from `collectThemeBodyPhraseRepetitionIssues` (cross-entry repetition) and `collectThemeDeckBodyOpenerDivergenceIssues` (deck↔body-OPENER 3-token sequence OR >50% content-token-set overlap). Lax floor this commit (`THEME_HEADLINE_BODY_ECHO_STRICT = false`) while the corpus drains — the live catalog still surfaces 3 lax warnings (`best-finales` #02 `returnee era`; `firsts` #06 `new judge` + #07 `rough draft`) that future content ticks address. 9 colocated tests landed at `src/content/__tests__/content-check.test.ts` covering both pre-rewrite shapes, post-rewrite passes, `category: single` exemption, stopword-only title/blurb pairs (no false positive), multi-bigram pluralisation, and the live catalog no-op for the named entries. Spoiler discipline P0 intact (editorial prose edit only; no per-season verdict change, no canon position change, no winner / elimination / finale-beat exposure). No URL / schema field / e2e fixture row owed — themed-list blurb edit only; the smoke walker only pins 200/H1/no console errors on `/themes/best-finales` so it inherits the new copy cleanly. Verify gate green: leg1 tokens + typecheck + no-raw-img + 188 unit files / 2526 tests (+9 new) + 127 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs); leg2 build (374 pages); leg3 1362 e2e (8.0m).

- [x] [MED] [anon] /themes hero stat-strip labels the freshness slot `INDEX LAST REVISED` while the analogous /shows hero — same surface intent (when was this index last touched), same position (rightmost stat-strip cell), also a top-level index landing — labels the same slot `INDEX REVISED`. Critique pass-35 closure #336 deliberately moved /shows from `Last revision` to the verb-past `Index revised` form (rationale: verb-past, named referent — the catalog tells the reader its own state). /themes was not brought along, so the two top-level index landings now read in two different grammatical registers: `INDEX LAST REVISED` is adverb-modified state, `INDEX REVISED` is verb-past. Concrete observed shapes from the rendered captures: /shows hero stat-strip closes with `May 2026 / INDEX REVISED`; /themes hero stat-strip closes with `June 2026 / INDEX LAST REVISED`. Source: `src/components/lists/ListsHero.tsx:102` literal `<div className="lists-stat-key">Index last revised</div>` vs `src/components/shows/ShowsHero.tsx:47` literal `<div className="shows-stat-key">Index revised</div>` (post-#336). Both occupy the rightmost stat-strip slot on a top-level index landing page. Same defect class as the resolved pass-35 #336 `/shows` `Last revision` → `Index revised` close, now at the sibling /themes surface that #336's pin guard (`/shows/__tests__/page.test.tsx` describe `/shows hero Index revised sourced from catalog canons`) did not cover. Bearings voice cue is `knowledgeable peer — plain sentences over clever ones` (`plan/bearings.md:370`); a peer commits to one grammatical register for the same stat across analogous surfaces. Fix options: (a) **primary path — rename the /themes stat-strip label from `Index last revised` to `Index revised`** to mirror the post-#336 /shows form. Single-string edit at `src/components/lists/ListsHero.tsx:102`. Preserves the verb-past framing the /shows close committed to. (b) **alternative — rename /shows back to `Last revision`** — rejected; reverses the #336 close that explicitly chose verb-past. (c) **alternative — leave as-is** — accept the cross-surface drift. Rejected — the two index landings share a stat-strip pattern + a freshness slot, and the visible-grammar split reads as drift, not deliberate variation. Recommended (a) — single-string edit, mirrors the resolved /shows close, drops the cross-surface label drift. Pin: extend `src/components/lists/__tests__/ListsHero.test.tsx` (already pins `['Index last revised']` at line 32) with a bidirectional-drift-guard regression case: assert the rendered stat-strip label matches `/^Index revised$/` (NOT `/last revised/i`) — mirrors the pin shape at `src/components/shows/__tests__/ShowsHero.test.tsx:128-141` `('labels the third stat cell as "Index revised" (not "Last revision")'`). Sibling pin at `src/lib/__tests__/themes-format.test.ts` if a helper carries the literal. Spoiler discipline P0 intact (chrome label edit only; no per-show verdict change, no canon position change, no winner / elimination / finale beat exposure on any surface). (URL: /themes, source: critique-pass-38) — d6cf91f — RESOLVED f339b1c: took the row's primary path. `src/components/lists/ListsHero.tsx:102` literal swapped from `<div className="lists-stat-key">Index last revised</div>` to `<div className="lists-stat-key">Index revised</div>` — single-string edit mirroring the post-pass-35 #336 close on the sibling `/shows` hero. Pinned per the #336 closure pattern: `src/components/lists/__tests__/ListsHero.test.tsx` gained a new case `labels the freshness stat cell as `Index revised` (not `Last revised`) — mirrors /shows pass-35 #336`, a bidirectional drift guard asserting the `.lists-stat-key` element textContent equals `Index revised` AND matches `/^Index revised$/` AND the cell textContent does NOT match `/last revised/i` — so a future refactor that swings the label back to the adverb-modified form trips at unit time, not on the next reader pass. Mirrors the pin shape at `src/components/shows/__tests__/ShowsHero.test.tsx:128-143`. The existing case at line 32 updated in lockstep (`Index last revised` → `Index revised`). Spoiler discipline P0 intact (chrome label edit only; no per-show verdict change, no canon position change, no winner / elimination / finale beat exposure on any surface). No URL / schema field / e2e fixture row owed — `/themes` is a long-shipped IA hub. Verify gate green: leg1 tokens + typecheck + no-raw-img + 188 unit files / 2504 tests + 127 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs); leg2 build (374 pages); leg3 1362 e2e.

- [x] [LOW] [authed] /shows page S-tier framing carries a cross-block vocabulary swap between hero lede and S-group header subtitle. Hero lede reads `Reality-TV canons, sorted not by personal taste but by how settled the ranking is. The S tier invented or perfected its format. The A tier has the deep canon and the years to defend it.` — uses `format` (the show's mechanical structure: rules, recurring beats, format-internal grammar). The S-group header one beat below reads `S · FORMAT-DEFINING / The shows that invented or perfected their genre.` — relabels the same tier with `genre` (the show's category: reality competition, cooking, dating). Format and genre are meaningfully distinct words; using both inside two lines of reading distance reads as drift, not craft. The eyebrow `S · FORMAT-DEFINING` above the block already pins `format` (the lede's word). The block subtitle drifts to `genre` for the same idea — the eyebrow says what kind of tier this is (format-defining), the subtitle softens to category-level claim (genre-defining), and the reader has to reconcile the two on the same scroll. The A-tier sub-header doesn't carry the same swap (`A · DEEP CANON / The shows with enough seasons and craft to defend a real ranking.` reads consistently with the hero's A-tier framing); the slip is S-tier-specific. Source: `/shows` hero lede vs S-group header subtitle. Bearings voice cue is `knowledgeable peer — plain sentences over clever ones` (`plan/bearings.md:370`); the same idea named two different ways in adjacent reading positions reads as drift, not craft. Fix options: (a) **primary path — replace `genre` with `format` in the S group header to mirror the hero + eyebrow**: `The shows that invented or perfected their format.` Preserves the eyebrow's `FORMAT-DEFINING` framing + the hero's precise mechanical claim. Single-word edit. (b) **alternative — replace `format` with `genre` in the hero**: `The S tier invented or perfected its genre.` Loses the precise mechanical claim the hero currently makes; the hero softens back to category-level framing. The eyebrow would still read `FORMAT-DEFINING` so the drift would surface at the eyebrow-vs-hero layer instead. (c) **alternative — leave as-is** — accept that careful readers will reconcile the two words. Recommended (a) — single-word edit, preserves the more precise word the hero already commits to, mirrors the eyebrow above the block. Pin: extend the colocated test on `/shows`'s S-tier section component (verify path at fix-time — likely `src/components/shows/ShowsTierGroup.tsx` or equivalent) with a regression case asserting both the hero lede AND the S-group header use `/format/i` rather than `/genre/i`; sibling positive on the A-tier framing asserting it stays on `/canon|years to defend/i` (no genre/format conflation either way). Spoiler discipline P0 intact (page-copy edit only; no per-show verdict change, no canon position change). (URL: /shows, source: critique-pass-35) — e15f553 — issue: #332 — RESOLVED 669d2db: took the row's primary path (a). `src/components/shows/tierMeta.ts:12` `S.name` swapped `'The shows that invented or perfected their genre.'` → `'The shows that invented or perfected their format.'` (single-word edit, mirrors the eyebrow tag `'Format-defining'` already on the same record + `tierLedeSentences(['S'])` `'The S tier invented or perfected its format.'` already on the hero). All three S-tier surfaces (eyebrow tag, hero lede, S-group subtitle) now commit to `format`; the A-tier framing stays on its own deep-canon vocabulary (no cross-tier conflation). Pinned per the row's bidirectional-drift-guard pin clause: `src/components/shows/__tests__/tierMeta.test.ts` gained a new `describe('S/A tier vocabulary alignment')` block with 5 cases — (1) S-tier eyebrow tag matches `/format/i` AND not `/genre/i`; (2) S-tier name subtitle matches `/format/i` AND not `/genre/i`; (3) S-tier hero lede sentence (via `tierLedeSentences(['S'])`) matches `/format/i` AND not `/genre/i`; (4) A-tier name matches `/seasons|craft|defend a real ranking/i` AND not `/format|genre/i`; (5) A-tier hero lede matches `/deep canon|years to defend/i` AND not `/format|genre/i`. The new block imports `tierLedeSentences` from `../tierLede` so the cross-source invariant (subtitle + hero lede) is enforced in one place; existing `tierLede.test.ts` and `tierMeta.test.ts` shape pins stay green (the existing S-tier shape pin updated to the new `format` name string). No URL / schema / page-family / e2e fixture row owed — page-copy edit only; the smoke walker only pins 200/H1/no console errors on `/shows` so it inherits the new copy cleanly. Spoiler discipline P0 intact (page-copy edit only; no per-show verdict change, no canon position change, no winner / elimination / finale beat exposure on any surface). Verify gate green: leg1 tokens + typecheck + no-raw-img + 188 unit files / 2480 tests + 127 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs); leg2 build (374 pages); leg3 1362 e2e (8.3m).

- [x] [LOW] [anon] /about `How voting works` paragraph restates the weighting ladder twice in adjacent sentences — once qualitatively, once numerically. The qualitative bridge sentence `Accounts a week old or older count at full weight; younger accounts and guests count less.` (`content/legal/about.md:38`, post-#318 closure) is immediately followed by three numeric sentences saying the same thing with the actual multipliers: `Anonymous-guest votes count at 0.1×. Accounts under 7 days old count at 0.25×. Accounts 7+ days old count at 1.0×.` (lines 39-40). Reading them in sequence, the qualitative line lands as a redundant English-language preview of the numeric table that follows — same fact, two registers, no new editorial work between them. Same within-paragraph repetition class as the pass-33 #318 closure (`Long-standing accounts carry the most weight.` → `Accounts a week old or older count at full weight; younger accounts and guests count less.`) which closed the intra-/about sentence-template echo + the `long-standing` overpromise; the new qualitative bridge is honest about the mechanic (no overpromise), but the residual issue is that it's still a *redundant* honest restatement of what the three numeric sentences say. The #318 close brought the qualitative bridge into agreement with the ladder, but didn't address whether the qualitative bridge needs to exist at all when the ladder is right below it. Source: `content/legal/about.md:38-40` — the qualitative bridge at line 38 + the three numeric sentences at lines 39-40. Bearings voice cue is `knowledgeable peer — plain sentences over clever ones` (`plan/bearings.md:370`); a peer doesn't preview the same fact in English right before stating it in numbers — they pick one register and trust the reader. Fix options: (a) **primary path — drop the qualitative bridge sentence entirely** and let the three numeric sentences carry the ladder. The paragraph would read `Signed-in voters self-attest they watched the season end to end before casting. Anonymous-guest votes count at 0.1×. Accounts under 7 days old count at 0.25×. Accounts 7+ days old count at 1.0×. Rate-limits run behind the scenes to catch coordinated voting campaigns, and should never bite a normal reader.` Reads as: attestation-sentence + three-cliff ladder + rate-limit note. No redundancy; the numeric lines do the actual policy work. (b) **alternative — replace the qualitative bridge with the REASON for the ladder** rather than a restatement of it. Candidate: `A vote's weight depends on how settled the account is.` (single sentence, names the WHY — settled-ness as the trust signal — without restating the WHAT the three numeric lines name). Reads as a brief frame for the ladder rather than a redundancy. (c) **alternative — keep both, accept the redundancy** — leaves the small voice tic. Recommended (a) — single-line removal, drops the redundancy entirely, lets the numeric ladder read as the policy. Or (b) if the curator wants to preserve the lead-in framing without redundancy — also single-sentence; up to author. Pin: extend the existing `cross-paragraph attestation parity vs home Community Rank (#311)` and `within-page sentence-template + tenure honesty (#318)` describe blocks in `src/app/(default)/about/__tests__/page.test.tsx` with a third case asserting the paragraph's content-bearing sentence count drops to ≤4 (attestation + 3 ladder + rate-limit minus the qualitative bridge) when the qualitative bridge is removed — bidirectional drift guard catching a regression that re-introduces the bridge. The existing #318 pin (1 max match for `\b(...)\bcarry the most weight\b`) stays unchanged. Spoiler discipline P0 intact (legal-doc prose edit only; no per-season verdict change, no canon position change). (URL: /about, source: critique-pass-34) — b52ebba — fa82be4 — issue: #326 — RESOLVED fa82be4: took the row's recommended Option (a). `content/legal/about.md` `How voting works` policy paragraph dropped the qualitative bridge sentence `Accounts a week old or older count at full weight; younger accounts and guests count less.` outright; the paragraph now reads attestation-sentence + three-cliff ladder + rate-limit note (`Signed-in voters self-attest they watched the season end to end before casting. Anonymous-guest votes count at 0.1×. Accounts under 7 days old count at 0.25×. Accounts 7+ days old count at 1.0×. Rate-limits run behind the scenes to catch coordinated voting campaigns, and should never bite a normal reader.`). The numeric lines do all the policy work; no qualitative restatement remains. Pinned per the row's bidirectional-drift-guard pattern (closure family of pass-32 #311 + pass-33 #318 + pass-34 #322): `src/app/(default)/about/__tests__/page.test.tsx` gained a new `describe('content/legal/about.md voting paragraph drops qualitative bridge (#325)')` block with two cases — (1) negative regex `/full\s+weight\s*;\s*younger\s+accounts\s+and\s+guests\s+count\s+less/i` so a future authoring pass that re-introduces the bridge clause trips at unit time; (2) positive presence of all three weight cliffs (`0.1×` / `0.25×` / `1.0×`) so a regression that loses one of the multipliers also trips. The existing #318 template guard (≤1 match for `\b(signed-in|long-standing|account|voter|member|guest)[^.]*\bcarry the most weight\b`) stays green — the dropped bridge had no `carry the most weight` token, so the template-regex match count is unchanged. The row's suggested "≤4 content-bearing sentences" pin was arithmetically off (attestation + 3 ladder + rate-limit = 5, not 4); the bidirectional regex pins above replace it with a sharper, bridge-specific guard. No URL / schema / page-family / e2e fixture row owed — legal-doc prose edit only; the smoke walker only pins 200/H1/no console errors on /about so it inherits the new copy cleanly. Spoiler discipline P0 intact (legal-doc prose edit only; no per-season verdict change, no canon position change). Verify gate green: leg1 tokens + typecheck + no-raw-img + 187 unit files / 2447 tests + 127 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs); leg2 build (374 pages); leg3 1362 e2e (6.4m).

- [x] [MED] [anon] /themes/best-finales entry #01 (Amazing Race S07) blurb closes on franchise-trajectory prose (`turns a cult favorite into a network anchor`) instead of answering the list's titular promise. The list is titled `Finales that stuck the landing`; every other entry (#02–#07) answers it with closing-beat texture about what made the FINALE land — #02 (HvV) `final tribal that reads like a verdict`, #03 (Top Chef Vegas) `final service plays like a high-end tasting menu`, #04 (Survivor S40) `final tribal carries the weight of a roster that has played this game before`, #05 (Traitors S02) `last seat is where the US adaptation proves it can hold the tension all the way down`, #06 (Drag Race S06) `lip-sync stretch with genuine stakes. The crown coronation lands`, #07 (Bake Off Series 8) `final stretch rewards the alliance play the summer spent building`. The top slot — the editorial anchor a first-time reader meets on the most-read themed list — is the editorial weakest, and it makes the list look like it's promising one thing (finales that landed) and grading on another (the season's franchise impact). Source: `content/themes/best-finales.md:14` entry rank 1 blurb (Amazing Race Season 7): `A final leg that proves the format's live sprint is built right. The Race always ends on a foot race to the mat, and Season 7 plays that structure at full strength — a deep, recognizable cast still racing hard into the last pit stop. That final leg is where this season turns a cult favorite into a network anchor.` The first two sentences DO answer the title (finale-craft texture: live sprint, foot race to the mat, deep recognizable cast); the third sentence pivots away to franchise-trajectory (`turns a cult favorite into a network anchor`), which is a historical-impact claim, not a finale-craft claim. Bearings voice cue is `knowledgeable peer — plain sentences over clever ones` (`plan/bearings.md:370`); a peer answers the question they wrote at the top of the list, especially in the top slot that anchors the editorial framing. Same within-list framing-drift class as the pass-33 #319 (best-finales #03 Top Chef body opener restating the deck headline) which extended `collectThemeDeckBodyOpenerDivergenceIssues` to catch deck-vs-body opener restatement; this finding sits at the *blurb-closer-vs-list-title-promise* layer rather than the deck-vs-body-opener layer — the closer is the third sentence (not the first), and the comparison is to the LIST TITLE (not the entry title). Fix options: (a) **primary path** — curator-only rewrite of the third sentence to keep the closing payoff on finale-craft. Candidate rotation: `The Roadblock-to-Pit-Stop sequence in the final leg lands every beat the season had been promising — the navigation calls, the cab-driver desperation, the foot-race photo finish.` (drops the franchise-trajectory framing entirely, keeps the closing payoff on the finale's specific craft — navigation calls, cab-driver desperation, foot-race photo finish — which matches the substance of #02-#07). Alternative candidate: `That final leg pays back everything the season set up — every Roadblock, every Detour, every navigation call — in the closing thirty minutes.` (more abstract but still finale-craft, drops the historical-impact framing). (b) **alternative — keep the franchise-trajectory framing but explicit it as the second clause** so the closer still answers the title: `That final leg is where the season's case for itself lands — and turns a cult favorite into a network anchor.` Reads as both finale-craft (`the season's case for itself lands`) and franchise-trajectory (`network anchor`); preserves both editorial points. (c) **alternative — leave as-is** — accept that the top slot reads as historical-impact rather than finale-craft; the entry's first two sentences still carry the finale-craft work. Recommended (a) — single-sentence edit, drops the discordant closer entirely, brings #01 into editorial parity with #02–#07, matches the #319 closure pattern (rewrite the offending sentence to advance to the surface-native frame the rest of the list uses). Word count after rotation: blurb ~50 words (in-band for the 50–80 cap on themed-list blurbs per `themeEntryBody` in `src/content/schemas.ts:218-220`). Pin: this is the cross-list-titular-promise vs entry-closer-promise relational layer; the existing `collectThemeDeckBodyOpenerDivergenceIssues` extended in #319 sits at the deck-vs-body layer, not this layer. A new pin extension proposal — `collectThemeEntryCloserAnswersTitleIssues` — would walk every themed-list entry and assert the final sentence of the blurb contains at least one content-token from the list's title (e.g. `finale`, `landed`, `landing`, `stuck`, `close`, `closing`, `last`, `final`) — bidirectional drift guard catching entries that close on a non-titular framing. This pin is deferred per the row's prescription (the #319 pin was deck-vs-body opener; this would be a separate invariant at the closer-vs-title layer; not all themed-list categories carry a verb-anchored title where the heuristic applies cleanly). Defer the invariant; this row resolves at the per-entry curator level. Spoiler discipline P0 intact (themed-list blurb edit only; no per-season verdict change, no canon position change, no winner / elimination / finale beat exposure on either surface — the rotation preserves the entry's editorial framing without naming the Race S07 final-leg winner). (URL: /themes/best-finales, source: critique-pass-34) — b52ebba — da9f3e8 — issue: #323 — RESOLVED da9f3e8: took the row's recommended Option (a), compressed to fit the 280-char schema cap. `content/themes/best-finales.md:21` Amazing Race S07 entry blurb's closer (the row's "third sentence" — the row's three-sentence enumeration included the entry `title` as the leading sentence; the actual `blurb` field carried two sentences, the second of which was the franchise-trajectory closer in question) swapped `That final leg is where this season turns a cult favorite into a network anchor.` → `The final leg lands every beat — navigation calls, cab-driver desperation, the photo finish.` Drops the franchise-trajectory framing entirely, keeps the closing payoff on the finale's specific craft (navigation calls, cab-driver desperation, photo finish at the mat), matches the substance of #02–#07. The full blurb sits at 265 chars (under the 280-char `themeEntryBody` schema cap at `src/content/schemas.ts:213`); the row's verbatim primary-path candidate (`The Roadblock-to-Pit-Stop sequence in the final leg lands every beat the season had been promising — the navigation calls, the cab-driver desperation, the foot-race photo finish.`) overshot the cap at 351 chars, so the shipped rotation preserves the row's editorial intent in a compressed form that fits the schema. The row's word-count claim (~50 words / 50–80 cap) misread the schema (`themeEntryBody.blurb` enforces max 280 chars at `src/content/schemas.ts:213`, not a word-count cap); a future row-author should reference the char cap rather than the word cap. No pin landed per the row's prescription — the `collectThemeEntryCloserAnswersTitleIssues` invariant is deferred (the closer-vs-title heuristic can't regex-distinguish load-bearing show vocabulary like `final tribal` / `final service` from template filler; not every themed-list category carries a verb-anchored title where the heuristic applies cleanly). The next critique pass re-verifies the absence per the sibling content-edit precedent (#187, #191, #246, #248, #260, #301, #302). No URL / schema / page-family / e2e fixture row owed — themed-list blurb edit only; the smoke walker only pins 200/H1/no console errors on /themes/best-finales so it inherits the new copy cleanly. Spoiler discipline P0 intact (themed-list blurb edit only; no per-season verdict change, no canon position change, no winner / elimination / final-leg outcome exposure on either surface — the rotation preserves the entry's editorial framing without naming the Race S07 final-leg winner). Verify gate green: leg1 tokens + typecheck + no-raw-img + 187 unit files / 2438 tests + 127 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs); leg2 build (374 pages); leg3 1362 e2e (8.0m).

- [x] [MED] [anon] /about lede sentence `Signed-in members carry the most weight.` contradicts the weighting ladder three paragraphs below in the same `How voting works` section. The ladder (`content/legal/about.md:38-40` post-#318) reads `Anonymous-guest votes count at 0.1×. Accounts under 7 days old count at 0.25×. Accounts 7+ days old count at 1.0×.` — so a brand-new signed-in member at 0.25× does NOT carry the most weight; only 7+ day accounts do. The lede's flat `Signed-in members carry the most weight` reads as the simple promise (sign in → max weight), but the page's own formal policy disowns that promise three paragraphs later: only signed-in members WITH at least 7 days of tenure carry the most weight. A first-time reader who signs up today to vote and scrolls to verify the lede's promise finds the ladder partly disowning it. Same defect class as the resolved pass-26 #282 / pass-27 #287 / pass-32 #311 / pass-33 #318 chain (cross-surface or intra-/about vote-mechanic drift), now sliding to the *intra-/about* boundary between the lede's marketing-sentence summary and the formal policy ladder. The pass-33 #318 close drained the within-paragraph echo (`Long-standing accounts carry the most weight.` → `Accounts a week old or older count at full weight; younger accounts and guests count less.`) at the policy-paragraph layer, but left the upstream lede `Signed-in members carry the most weight.` unmodified — the same overpromise pattern persists at the higher-traffic lede layer. Source: `content/legal/about.md:18-19` (lede: `Each season asks one question — does it belong in the community top 10? — and your upvote or downvote answers it. Signed-in members carry the most weight.`) + `content/legal/about.md:38-40` (the now-honest `How voting works` policy paragraph that names the 7-day cliff). Bearings voice cue is `knowledgeable peer — confident, warm, plain-spoken, never pretentious. Plain sentences over clever ones.` (`plan/bearings.md:370`); a peer wouldn't promise full-weight to every signed-in member in the lede when the formal policy two scroll-units below names a one-week tenure cliff. Fix options: (a) **primary path** — tighten the lede to name the same mechanic the policy ladder names. Candidate rotation: `Each season asks one question — does it belong in the community top 10? — and your upvote or downvote answers it. Signed-in members carry more weight than guests; long-tenured accounts carry the most.` (single-sentence rewrite, ~120 chars; names the two-cliff structure — guest-vs-signed-in + new-vs-long-tenured — without promising signed-in alone is enough). The lede now previews the ladder honestly; the policy paragraph reads as the detail expansion of a true summary. (b) **alternative — drop the third sentence entirely** so the lede ends on the upvote/downvote question and the weighting ladder reads as the first place the page discusses weight: `Each season asks one question — does it belong in the community top 10? — and your upvote or downvote answers it.` Reads cleanly but loses the lede's framing role (the lede currently sets the reader's expectation that weight is the next topic; dropping it surprises the reader with the ladder). (c) **alternative — preserve the lede, drop the ladder's specificity**: change the policy paragraph to a qualitative summary that matches the lede's marketing tone (`Signed-in accounts carry full weight after a short tenure window; guests count partial weight.`). Reads consistently but drops the data the reader needs to evaluate the system; rejected — the ladder's specificity is the editorial commitment, not the noise. Recommended (a) — single-sentence edit, preserves the lede's framing role, brings the lede into agreement with the formal policy, mirrors the #311 + #318 closure pattern (name the same mechanic on every surface that names weight). Pin: extend `src/app/(default)/about/__tests__/page.test.tsx` with a cross-paragraph parity case — whenever the rendered `/about` body contains the weighting ladder (matches `/0\.25×|0\.1×|1\.0×/`), the lede portion (first ~400 chars of body_md) must NOT contain a flat-promise sentence matching `/\bsigned-in[^.]*\bcarry the most weight\b/i` (bidirectional drift guard against a future authoring pass re-introducing the overpromise). Sibling positive: assert the lede contains a tenure-qualifier match (`/\b(long-tenured|long-standing|tenured|a week old|7\+? days?)\b/i`) so the rewrite doesn't drift back to the bare marketing form. Both pins live in the existing about-page colocation; no e2e fixture row owed. Spoiler discipline P0 intact (legal-doc prose edit only; no per-season verdict change, no canon position change). (URL: /about, source: critique-pass-34) — b52ebba — 1701b52 — issue: #322 — RESOLVED 1701b52: took the row's recommended Option (a). `content/legal/about.md:18-19` lede Community-Rank bullet's third sentence swapped `Signed-in members carry the most weight.` → `Signed-in members carry more weight than guests; long-tenured accounts carry the most.` — single-sentence rewrite that names the two-cliff structure the policy ladder commits to (guest-vs-signed-in + new-vs-long-tenured) without promising signed-in alone is enough. The lede now previews the policy ladder honestly; the formal `How voting works` paragraph reads as the detail expansion of a true summary rather than the partial disowning of an overpromise. Pinned per the row's primary pin clause: `src/app/(default)/about/__tests__/page.test.tsx` gained a new `describe('content/legal/about.md lede honesty vs weighting ladder (#322)')` block with two bidirectional cases — (1) whenever the body contains the weighting ladder (matches `/0.25×|0.1×|1.0×/`), the lede region (everything before `## How voting works` — implemented as a `ledeOf(body)` helper inside the describe block so the slice boundary is editorially meaningful rather than a magic char count) must NOT contain a flat-promise sentence matching `/\bsigned-in[^.]*\bcarry the most weight\b/i`; (2) the lede MUST contain a tenure-qualifier match (`/\b(long-tenured|long-standing|tenured|a week old|7\+?\s*days?)\b/i`) so the rewrite cannot silently drift back to the bare marketing form without tripping the unit gate. The existing #318 template guard (1 max match for `\b(signed-in|long-standing|account|voter|member|guest)[^.]*\bcarry the most weight\b`) stays green — the new lede ends on `…carry the most.` (no `weight` noun-pair), so the template regex returns 0 matches against the full body. Closure pattern matches the pass-26 #282 + pass-27 #287 + pass-32 #311 + pass-33 #318 intra-/about and cross-surface drift-guard chain (name the same mechanic on every surface that names weight; pin both directions so a future authoring pass can't regress in isolation). No URL / schema / page-family / e2e fixture row owed — legal-doc prose edit only; the smoke walker only pins 200/H1/no console errors on /about so it inherits the new copy cleanly. Spoiler discipline P0 intact (legal-doc prose edit only; no per-season verdict change, no canon position change). Verify gate green: leg1 tokens + typecheck + no-raw-img + 187 unit files + 127 script tests + content-check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs); leg2 build (374 pages); leg3 1362 e2e.

- [x] [HIGH] [anon] /shows/survivor `What changed this week` weekly-mover ledger leads with a row that publicly contradicts its own premise — the topmost shift-card on the most-visited show page reads `↓ 38 this week · Survivor 50 · Slid 38 spots since the last weekly update · 0 votes · was #12 / now #50`. A 38-spot slide on **zero votes** is incoherent as community signal: the ledger header `COMMUNITY RANK · UPDATED THURSDAY` frames the rail as a community-driven movement strip, but Survivor 50 is a freshly-seeded entry whose position-shift is entirely a recompute artifact (a new season landing in the canon pushes the field down by one). The `0 votes` suffix exposes the seam — the reader sees the rank moved AND that nobody voted, and concludes either the math is broken or the "Community Rank" framing is misleading. The voteCount suffix is the pass-27 #285 / pass-28 grounding fix (`src/lib/community/live.ts:74-87` `moverNote`: `Climbed/Slid N spots since the last weekly update · K votes`); that fix grounds magnitude in volume so a 36-spot swing on 12 votes reads distinctly from a 5-spot swing on 487 votes — but with K=0 the same logic surfaces the row as obviously not-community-driven. Source: `src/lib/community/live.ts:77-87` `moverNote` returns the `· 0 votes` suffix unconditionally when `mover.voteCount != null && mover.voteCount === 0`; `src/components/composition/ShiftCard.tsx:29` renders the note as the card's body line; the upstream mover-picker (likely `src/lib/community/movers.ts` or the `pickMovers` referenced in the `live.ts:72` comment) admits zero-vote movers into the surface. Bearings voice cue is `knowledgeable peer — confident, warm, plain-spoken, never pretentious` (`plan/bearings.md:370`); a peer doesn't publish a row that visibly contradicts itself. Fix options: (a) **primary path — filter out zero-vote movers at the picker layer**. Where the shift-cards are built (the `pickMovers` site in `src/lib/community/movers.ts` or the equivalent), add a `voteCount > 0` floor so a freshly-seeded season with zero ballots cannot appear in the `What changed this week` rail at all. Cleanest: a recompute that moves a row purely because a new season was seeded above it isn't a community-driven shift and shouldn't be surfaced in a community-driven rail. Smallest blast radius — drops the misleading row without changing any copy or schema. (b) **alternative — relabel the zero-vote case** at the `moverNote` layer: `if (v === 0) return \`${verb} ${spots} on this week's recompute\`;` swaps the misleading `· 0 votes` suffix for a recompute attribution so the reader understands the move is mechanical, not community. Lighter change but keeps the row in the surface (and a `recompute` framing in a community-rank rail still reads odd). (c) **alternative — gate the row inclusion in the consumer** (`src/components/composition/ShiftsRow.tsx`) with `cards.filter((m) => m.voteCount == null || m.voteCount > 0)` — same effect as (a) but a layer further from the data source. Recommended (a) — the right floor lives at the picker where the canon-vs-community decision is made; (b) is a band-aid; (c) is a fix at the wrong layer. Pin: extend the colocated `pickMovers` tests (whichever file colocates `src/lib/community/movers.ts` — likely `src/lib/community/__tests__/movers.test.ts`) with a fixture case: when the snapshot delta carries a non-null `voteCount === 0`, `pickMovers` must NOT return that mover (bidirectional drift guard with a positive case asserting a `voteCount === 1` mover IS returned so the floor doesn't over-fire on small-ballot movers). Sibling pin: extend `src/components/composition/__tests__/ShiftsRow.test.tsx` (or the live-data harness) with a regression case asserting the rendered `What changed this week` row never carries the literal `· 0 votes` suffix. Spoiler discipline P0 intact (community-rank surface filter only; no per-season verdict change, no canon position change, no winner / elimination / finale beat exposure — the filtered row would have shown a movement direction but the season is freshly-seeded and the canon-page hero already names it). (URL: /shows/survivor, source: critique-pass-33) — b2a7d00 — issue: #316 — RESOLVED b2a7d00: took the row's recommended Option (a). `pickMovers` in `src/lib/community/live.ts:37-65` filter widened from `e.trend != null && e.trend !== 0` to `e.trend != null && e.trend !== 0 && e.voteCount > 0` — the right layer per the row's analysis (the picker is where the canon-vs-community decision is made; relabeling at `moverNote` or filtering in `ShiftsRow` are band-aids at the wrong layer). The floor is `> 0`, not a volume threshold — the rule is "no community signal at all," not "below some volume" — so a single ballot still qualifies. Header comment widened to name the editorial closure (freshly-seeded season's `trend` is a recompute artifact, not a community-driven shift) so a future drift-investigation reader has the rationale at the source. Pinned per the row's primary pin clause: `src/lib/community/__tests__/live.test.ts` `pickMovers` describe block gained two new cases — (1) `voteCount === 0` is excluded from the surface (recompute-artifact guard: synthetic row at rank=50, trend=-38, voteCount=0 → `pickMovers` returns []); (2) a one-ballot mover IS returned (bidirectional drift guard: rank=8, trend=-5, voteCount=1 → `pickMovers` returns a single mover carrying `voteCount === 1`). The pre-existing `voteCount: 10` default on the `row()` factory keeps every prior `pickMovers` case green (no fixture overrides the default → all sort/limit/prevRank pins inherit a passing `voteCount`). Sibling pin from the row (`ShiftsRow.test.tsx` regression for `· 0 votes` suffix) is now structurally unnecessary — the picker no longer admits zero-vote movers, so no `· 0 votes` string can reach `ShiftsRow` to be asserted-against. No URL / schema / page-family / e2e fixture row owed — filter widening only; the smoke walker only pins 200/H1/no console errors on `/shows/survivor` so it inherits the new behavior cleanly. Spoiler discipline P0 intact (community-rank surface filter only; no per-season verdict change, no canon position change, no winner / elimination / finale beat exposure). Verify gate green: leg1 tokens + typecheck + no-raw-img + 187 unit files / 2388 tests + 127 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs); leg2 build (374 pages); leg3 1361 e2e (8.2m).

- [x] [LOW] [anon] /themes/best-finales entry #04 (Survivor S40 Winners at War) body opens `The milestone framing earns itself in the closing run.` (`content/themes/best-finales.md:42`). Reads grammatically but the agency is wrong — a `framing` doesn't earn itself; the season earns the milestone framing by paying it off across its closing episodes. Sibling entries on the same list keep plain-spoken agency: entry #03 (Top Chef Houston) carries `every plate earning its place`; entry #07 (Bake Off Series 8) carries `the final tribal carries the weight of a roster that has played this game before` (Survivor S40, same entry, second sentence). The first sentence of #04 reads as the editorial voice reaching for elegance and landing in a tautology. Fix: curator-only edit. Candidate (a) — make the season the agent of the earning: `The milestone framing earns its weight in the closing run.` (single-word substitution, preserves rhythm). Candidate (b) — drop the framing-as-subject altogether and let the all-winner premise carry: `The all-winner premise pays back in the closing run.` Either preserves the entry's editorial point (the closing run delivers on the season's stated stakes) and matches the bearing on plain sentences over clever ones (`plan/bearings.md:370`). Pin: no new invariant — this is a one-off tautology, not a recurring class; the next critique pass re-verifies the absence per the precedent on sibling content edits (#246, #248, #260). Spoiler discipline P0 unchanged (voice edit only; the entry's canon position #04 was already published, no winner / elimination / finale beat exposed). (URL: /themes/best-finales, source: critique-pass-30) — d3a35cd — issue: #303 — RESOLVED d3a35cd: took the row's candidate (b). `content/themes/best-finales.md:39` Survivor S40 entry blurb's opener swapped `The milestone framing earns itself in the closing run.` → `The all-winner premise pays back in the closing run.` — drops the framing-as-subject tautology and lets the all-winner premise carry, factually accurate to S40 Winners at War. Candidate (a) (`earns its weight`) was prototyped and rejected mid-tick because it created a new adjacent-noun echo with the next sentence's `carries the weight of a roster`, which is the exact class the cliche-repetition invariant catches at `scripts/content-check.ts`. Candidate (b) avoids the echo and is editorially crisper — `pays back` is a verb already in the list's wider palette (used on entry #05 Traitors S02 after the #302 close: `every banishment paid back`). No pin owed — this was a one-off tautology, not a recurring class; the next critique pass re-verifies the absence per the precedent on sibling content edits (#246, #248, #260, #302). No URL / schema / page-family / e2e fixture row owed — content edit only; the smoke walker only pins 200 / H1 / no console errors on `/themes/best-finales` so it inherits the new copy cleanly. Spoiler discipline P0 intact (voice edit only; no per-season verdict change, no canon position change, no winner / elimination / finale beat exposed). Verify gate green: leg1 tokens + typecheck + no-raw-img + 187 unit files / 2386 tests + 127 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs); leg2 build (374 pages); leg3 1361 e2e (8.0m).

- [x] [LOW] [anon] /themes/best-finales entries #02 (Survivor S20 Heroes vs. Villains) and #05 (The Traitors S02) both use the word `freighted` in the same `every X freighted` syntactic shape, three entries apart on the same 7-entry list. Entry #02 body opener: `The endgame compounds — every conversation freighted with everything Survivor had been by 2010.` (`content/themes/best-finales.md:27`). Entry #05 body: `paranoia compounding, every banishment freighted, the table smaller and louder each night.` (`content/themes/best-finales.md:45`). Same word, same `every <noun> freighted` participial construction, both visible on one scroll of the same list. Same defect class as the just-closed [MED] `at full volume` cluster on this same list (#301) — a single voice tic spreading across adjacent themed-list entries. The voice elsewhere on the list carries a wider verb palette (`pays off`, `closes on`, `earns its place`, `stretches`, `pays back`); the two `freighted`s read as the same hand reaching for the same emphasis twice. Fix: curator-only edit, smallest blast radius — rewrite the Traitors S2 entry's body to drop `freighted`. Candidate: `paranoia compounding, every banishment paid back, the table smaller and louder each night.` Pin: extend `scripts/content-check.ts` `CLICHE_PATTERNS` with `{ label: '"freighted"', re: /\bfreighted\b/gi, threshold: 2 }` (same closure pattern as #280's `measures itself against` invariant and #301's `at full volume` rewrite path) — catches the next instance of this class at content-author time, scoped to all editorial sources the `sources[]` aggregator already walks. Spoiler discipline P0 unchanged (voice edit only). (URL: /themes/best-finales, source: critique-pass-30) — 0e39b59 — issue: #302 — RESOLVED 0e39b59: took the row's full path. `content/themes/best-finales.md:45` Traitors S2 entry blurb's participial phrase swapped `every banishment freighted` → `every banishment paid back` (the critique row's candidate, `pays back` is a verb already in the list's wider palette — no new noun phrase introduced). Entry #02 (Survivor S20 HvV) keeps `freighted` as the highest-leverage surface — the first all-returnee final tribal is the editorial point the word was reaching for. Pin landed per the row's spec: `scripts/content-check.ts` `CLICHE_PATTERNS` gained `{ label: '"freighted"', re: /\bfreighted\b/gi, threshold: 2 }` sibling to the existing `"measures/measured against"` and `"at full volume"` entries; the new pattern comment names the keep-surface (entry #02 HvV) and the drop-surface (entry #05 Traitors S2) inline so a future drift-investigation reader has the editorial decision at the source. Threshold 2 matches the `at full volume` margin (one walked re-use permissible, a second simultaneous occurrence re-opens the class). Six new colocated cases at `src/content/__tests__/content-check.test.ts` (new describe block `content-check — cliche repetition: "freighted" (critique pass-30, issue #302)`): (a) passes at the live catalog post-rewrite (asserts `setContentRoot(null)` reads under threshold); (b) passes at threshold (2 occurrences across two themes' entry blurbs); (c) flags every occurrence when count exceeds the threshold (3 themes, asserts all three files emitted, message names the phrase + `appears 3 times` + `cliche-repetition drift`); (d) counts multiple hits inside a single field (3 hits in one entry blurb — flips the gate at threshold 2); (e) is case-insensitive (uppercase + title-case + lowercase mix counts to 3); (f) does not false-positive on incidental words (`freight`, `fraught` — both unrelated lexemes pass through; only 1 walked `freighted` hit < threshold 2 → zero issues). No URL / schema / page-family / e2e fixture row owed — content edit + invariant only; the smoke walker only pins 200/H1/no console errors on the touched route so it inherits the new copy cleanly. Spoiler discipline P0 intact (voice edit only; no per-season verdict change, no canon position change, no winner / elimination / finale beat exposed). Verify gate green: leg1 tokens + typecheck + no-raw-img + 187 unit files / 2380 tests + 127 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs); leg2 build (374 pages); leg3 1361 e2e (7.9m).

- [x] [MED] [anon] / home spotlight `<HomeShowGrid variant="featured">` below the Survivor hero renders the three tall tiles in alphabetical order — `TRAVEL COMPETITION The Amazing Race`, `DATING The Bachelor`, `DATING The Bachelorette` — because `partitionHomeShows(getAllShows(), 'survivor')` in `src/lib/home/show-partition.ts:31-37` takes `pool.slice(0, HOME_FEATURED_TILES)` from a catalog that `getAllShows()` already sorted by `slug.localeCompare` (`src/content/loaders.ts:209`). This is the same defect class the pass-29 footer fix corrected at `src/components/chrome/footer/FooterTiersCol.tsx` (close 54a4170): the footer's `SHOWS` column was reworked to lead with `TIER_ORDER.indexOf(tier)` (S→0, A→1, B→2) before `slug.localeCompare`, so a first-page reader sees the S-tier flagships in the chrome rail. The home spotlight — a louder, taller, image-heavier surface — wasn't patched in the same tick, so RuPaul's Drag Race (the only other S-tier show besides Survivor per `/shows` rendering S/A/B sections) gets demoted to the compact `THE REST OF THE INDEX` stripe at the exact moment a first-time visitor is forming their tier hierarchy from the home page. The footer correctly leads `RuPaul's Drag Race / Survivor / The Amazing Race` (S → S-excluded-already-featured → A-first-alpha); the home spotlight still leads `The Amazing Race / The Bachelor / The Bachelorette` (all A-tier and B-tier by alpha). Source: `src/lib/home/show-partition.ts:31-37` `pool.slice(0, HOME_FEATURED_TILES)`; `src/content/loaders.ts:209` `.sort((a, b) => a.slug.localeCompare(b.slug))`. Fix: mirror the pass-29 footer fix in `src/lib/home/show-partition.ts` — sort `pool` by tier rank first (`TIER_ORDER`: S→0 / A→1 / B→2), slug.localeCompare as tiebreaker, then slice. Today's catalog with Survivor excluded would surface `RuPaul's Drag Race / The Amazing Race / The Bachelor` — the next S-tier show plus the two alphabetical-first A-tier shows — and a future tier graduation flows through automatically. Pin: extend `src/lib/home/__tests__/show-partition.test.ts` (create if absent — the function is the partition seam) with (a) a positive case asserting against today's roster the spotlight cut leads with `rupauls-drag-race` (S-tier) over `amazing-race` (A-tier alphabetical first), and (b) a synthetic-catalog negative case where the highest-tier show is alphabetically last — the spotlight must still lead with it, bidirectional drift guard so a future refactor that drops the tier ordering trips the unit gate. Spoiler discipline P0 unchanged (chrome ordering only; no per-season verdict or finale beat exposed). (URL: /, source: critique-pass-30) — 99ff806 — issue: #300 — RESOLVED 99ff806: took the row's full path. `src/lib/home/show-partition.ts` `partitionHomeShows` now spreads the filtered pool and sorts by `TIER_ORDER.indexOf(tier)` (S→0 / A→1 / B→2) with `slug.localeCompare` as the in-tier tiebreaker before the `slice(0, HOME_FEATURED_TILES)` — mirror of the pass-29 footer fix at `FooterTiersCol.tsx` (54a4170). The function imports `TIER_ORDER` from `@/components/shows/tierMeta`; the header comment carries the closure rationale (alpha-sorted catalog from `getAllShows()` + the bare `.slice(0, 3)` demoted the next S-tier flagship to the compact tail). Today's catalog with Survivor excluded as the hero now surfaces the spotlight cut `Drag Race / Amazing Race / The Bachelor` — the second S-tier flagship plus the two alpha-first A-tier shows — and future tier graduations flow through automatically. Pinned per the row's pin clause: `src/lib/home/__tests__/show-partition.test.ts` gained a four-case "tier-first sort (critique pass 30 #300)" describe block — (a) positive case against today's real roster (`setContentRoot` to `/content`; `getFeaturedShow()` excluded) asserts the spotlight head is `dragrace` (S-tier; the actual slug per `content/shows/dragrace.md`), NOT `amazing-race`, AND `featuredTiers[0] === 'S'` — three layers of guard; (b) synthetic-catalog negative pin where `zeta-last-s` is alphabetically last but S-tier — the spotlight must still lead with it (bidirectional drift guard so a refactor reverting to bare alpha trips the unit gate); (c) B-tier `aardvark-b` (alpha-first) must sort behind every A-tier slug — covers the alpha-leads-tier edge case explicitly; (d) mutation guard on the new internal `[...filtered].sort(...)`. Existing partition tests preserved — the legacy fixtures all share tier `'A'` (the default in the `show()` factory), so the slug tiebreaker preserves their order; the `catalog()` factory zero-pads slugs to two digits (`show-00..show-12`) so lexicographic slug sort matches numeric order under the new internal sort. Spoiler discipline P0 unchanged (chrome ordering only, no per-season verdict or finale beat exposed). Verify gate green: leg1 tokens + typecheck + no-raw-img + 187 unit files / 2368 tests + 127 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs); leg2 build (374 pages); leg3 1361 e2e.

- [x] [HIGH] [anon] /shows hero stat block stamps `LAST REVISION — June 2026` while every other surface emitting a canon-revised date — home `CANON REVISED — May 2026`, /shows/survivor `CANON REVISED — May 2026`, /themes `INDEX LAST REVISED — May 2026`, /themes/best-finales `LAST REVISED — May 2026` — reads May 2026 against the same shipped data. The catalog-level revision date is the lone June stamp across the five surfaces. Same class the pass-24 home `Canon revised` finding closed (#269): a build-time-derived label printed adjacent to content-derived labels drifts on the 1st of the month while the underlying canon data hasn't moved. A first-time reader who lands on /shows after seeing the home `May 2026` stat reads `June 2026` on the catalog hero and reasonably assumes the catalog was revised after the show pages — but no canon `last_revised` value is anywhere near June. Source: `/shows` hero stat `LAST REVISION  June 2026` (renders from build time per the surviving build-derived label path the home's #269 fix retired on its own surface); home + show + theme surfaces all read from `canon.last_revised` ISO strings via `canonRevisedLabelFromIso` (`src/lib/canon/last-revised.ts`). Fix options: (a) **primary path** — derive the /shows revision date from the max of `last_revised` across the catalog's canon files (Max over all `getCanon(slug)?.last_revised`), the same source path the show page reads, so home + show + catalog all stamp the same month from the same data; (b) rename the /shows label from `LAST REVISION` to `CATALOG REFRESHED` or drop the cell entirely (build-time signal renamed honestly, or removed in favor of the show-page hero); (c) hardcode May 2026 — rejected, will drift again on the next month flip. Recommended (a) — extends the #269 closure pattern (home/show source-match) to the catalog surface, the editorial promise holds, the build-clock dependency is removed. Pin: the /shows page's colocated test (`src/app/(default)/shows/__tests__/page.test.tsx` — create if absent) gains a positive case asserting the hero `LAST REVISION` label is derived from the catalog's latest `canon.last_revised` value, NOT from `new Date()` — mirror the home pass-24 #269 pin pattern (`vi.useFakeTimers()` pinned to a non-canon month while asserting the canon's month is rendered). Bidirectional regression guard: negative case asserting `getCanonRevisedLabel(now = new Date())` is not called from the /shows page tree. Spoiler discipline P0 unchanged (date-source edit only). (URL: /shows, source: critique-pass-27) — 9d07409 — issue: #288 — RESOLVED e5dd62c: took the row's recommended Option (a). `src/components/shows/showsStats.ts` `computeShowsStats` rewritten to iterate the roster's canons (defaults to `getCanon`, injectable for tests), take the max `last_revised` ISO across them (`YYYY-MM-DD` string-compare = chronological), and format via `canonRevisedLabelFromIso` — the same path `src/app/shows/[show]/page.tsx:174` reads, so /shows + show + home all stamp the same month from the same canon frontmatter. `ShowsStats.lastRevision` widened to `string | null`; `ShowsHero.tsx` conditionally renders the stat cell when non-null (mirrors the `HomeHero` hide path from pass-24 #269), so a catalog with no canon `last_revised` hides the stat rather than fabricating a date. The `formatRevision(today: Date)` helper retired with the build-time fallback — `canonRevisedLabelFromIso` becomes the single entry point for every canon-revised label in the product. Barrel snapshot at `src/components/shows/__tests__/index.test.ts` drops to 15 keys (`formatRevision` removed). Pinned per the row's pin clause: `src/app/(default)/shows/__tests__/page.test.tsx` gained a three-case "Last revision sourced from catalog canons" describe block — (1) latest canon ISO across the roster renders as "Month YYYY"; (2) stat cell hides when no canon carries `last_revised`; (3) `vi.useFakeTimers()` pinned to June 2026 system time while the canon claims May 2026 — `shows-hero-canon-revised` must read May, not June (the exact drift the finding flagged on 2026-06-01). `src/components/shows/__tests__/showsStats.test.ts` rewrote to mock `canonLookup` directly with the same fake-timers regression guard at the helper layer (5 new behavior cases). `src/components/shows/__tests__/ShowsHero.test.tsx` added the null-label hide pin (no `shows-stat-revised`, no `shows-hero-canon-revised`) + a verbatim-label render pin so a future refactor that reintroduces a clock dependency in the component itself trips at unit time. Spoiler discipline P0 unchanged (date-source edit only). Verify gate: pnpm tokens && pnpm typecheck && pnpm check:no-raw-img && pnpm test:run && pnpm test:scripts && pnpm content:check (187 unit files / 2328 tests / 127 script tests / content-check 13 shows · 298 seasons · 13 canons · 12 themes · 3 legal docs); pnpm build (374 static pages); pnpm --dir apps/e2e exec playwright test (1361 passed in 8.0m).

- [x] [HIGH] [anon] / home Community Rank card reads `Signed-in voters self-attest they watched the season end to end; anonymous votes count at 0.1×.` (`src/components/home/HomeDualCallout.tsx:18-20`, the form shipped at a0d7cd5 to close pass-26 #282) — naming a two-tier mechanic (anon 0.1× vs signed-in 1.0× implied). But /about "How voting works" presents a three-tier mechanic: `Anonymous-guest votes count at 0.1×. Accounts under 7 days old count at 0.25×. Accounts 7+ days old count at 1.0×.` (`content/legal/about.md:37-38`). A first-time reader who follows the home → about path sees the home name two tiers, then the about page introduce a third (new-account 0.25×) the home never mentioned. Pass-26 #282 fixed the falsifiable "Every voter has watched" claim but the replacement language still understates the system — the home claims a clean signed-in/anon split, /about's actual mechanic is anon / new-account / long-account. Same root-cause class as #282 but the drift now sits one tier deeper. Source: `src/components/home/HomeDualCallout.tsx:18-20` (two-tier framing) vs `content/legal/about.md:37-38` (three-tier ladder). Fix options: (a) **primary path** — extend the home line to surface the new-account tier briefly: `Signed-in voters self-attest they watched the season end to end; new accounts count at 0.25×, anonymous votes at 0.1×.` (single sentence, ~145 chars, names all three weights the /about page details); (b) simplify /about to a two-tier model (drop the 0.25× tier from the system), aligning the mechanic to the home description — larger blast radius, requires a `cast_vote()` server-side change; (c) reframe the home line as "anonymous votes count least; long-standing accounts count most" without numeric tiers — vague but consistent. Recommended (a) — same closure pattern as #282 (name the mechanic /about details), no server-side change, the home becomes a faithful summary of /about. Pin: extend `src/components/home/__tests__/HomeDualCallout.test.tsx` with a regression case asserting the live-pane blurb mentions the new-account weight (matches `/0\.25|new account|under 7/i`) and the existing anon weight (matches `/0\.1/`) — bidirectional drift guard so a future authoring pass that simplifies back to two tiers trips at unit time. Spoiler discipline P0 unchanged. (URL: /, /about, source: critique-pass-27) — 9d07409 — issue: #287 — RESOLVED fa9dcf3: took the row's recommended Option (a). `src/components/home/HomeDualCallout.tsx:18-20` live-pane closer flipped from `Signed-in voters self-attest they watched the season end to end; anonymous votes count at 0.1×.` to `Signed-in voters self-attest they watched the season end to end; new accounts count at 0.25×, anonymous votes at 0.1×.` Single-sentence extension names all three weights the /about page details (anon 0.1× / new-account 0.25× / long-account 1.0× implied as signed-in default), no /about edit, no server-side `cast_vote()` change. Pin landed in `src/components/home/__tests__/HomeDualCallout.test.tsx` ("names all three voting weights, not just signed-in vs anon" — asserts the live-pane blurb matches `/0\.25|new account|under 7/i` AND `/0\.1/`), bidirectional drift guard so a future authoring pass that simplifies back to two tiers trips at unit time. The existing pass-26 #281 pin (`/finale|after every/i`) and #282 pin (no `Every voter has watched`, weighting-mechanic match) both stay green. Verify gate: pnpm tokens && pnpm typecheck && pnpm check:no-raw-img && pnpm test:run && pnpm test:scripts && pnpm content:check (187 unit files / 2319 tests green); pnpm build (374 static pages green); pnpm --dir apps/e2e exec playwright test (1361 passed in 7.7m). Spoiler P0 unchanged.

- [x] [HIGH] [anon] / home `<HomeDualCallout>` Editor's Canon card reads `A single, ordered list written by an editor who has watched the whole show twice. Stable, opinionated, signed. Revised quarterly when a new season changes the math.` (`src/components/home/HomeDualCallout.tsx:7-10`). But every show's canon "When do we revisit?" methodology paragraph reads `After every season finale and after any returnee season that recasts a prior run.` (`content/shows/survivor/canon.md:10`; the same per-finale paragraph is the seeded pattern across all 13 `content/shows/<slug>/canon.md` files — verifiable via `grep -nE '^meth_when_p:' content/shows/*/canon.md`). A first-time reader who lands on home reads "quarterly" — a calendar-time cadence — then clicks through to `/shows/survivor` (or any show) and reads "after every finale" — a per-event cadence. Two different mental models of how stale the canon ever is, presented at the two most-trafficked surfaces. The home claim is the one a reader sees first AND the one that's wrong-against-the-product: bearings + the show-page methodology + the actual content-curator rotation are all per-finale; "quarterly" is inherited from an older copy block that hasn't been retuned since the per-finale cadence stabilized. The home card is also the surface that establishes the editorial trust frame — the show page revisits paragraph carries an honest, specific phrasing that the home should mirror. Source: `src/components/home/HomeDualCallout.tsx:9` literal `Revised quarterly when a new season changes the math.`; `content/shows/<slug>/canon.md:10` literal `After every season finale and after any returnee season that recasts a prior run.`. Fix: rewrite the home `HomeDualCallout` curated-pane closer to match the per-finale cadence — e.g. `Revised after every finale, and after returnee seasons that recast a prior run.` — so the home and every show page tell the same story about how the canon is maintained. Pin: extend `src/components/home/__tests__/HomeDualCallout.test.tsx` with a negative regression case asserting the curated-pane blurb does NOT match `/quarterly/i` AND a positive case asserting it contains either `finale` or `after every` — bidirectional, so a future authoring pass that re-introduces a wall-clock cadence noun trips the unit gate at the verify gate. Spoiler discipline P0 unchanged (editorial-voice rewrite of one site-wide cadence claim). (URL: /, /shows/<any>, source: critique-pass-26) — 215deb5 — issue: #281 — RESOLVED 5f979d5: took the row's full path. `src/components/home/HomeDualCallout.tsx:7-10` curated-pane closer flipped from `Revised quarterly when a new season changes the math.` to `Revised after every finale, and after returnee seasons that recast a prior run.`, mirroring the per-event cadence every show's `meth_when_p` paragraph already carries. Bidirectional pin landed in `src/components/home/__tests__/HomeDualCallout.test.tsx` (negative `/quarterly/i` + positive `/finale|after every/i` on the `home-dual-curated` cell), so a regression to a wall-clock cadence noun fails at unit time. Verify gate: pnpm tokens && pnpm typecheck && pnpm check:no-raw-img && pnpm test:run && pnpm test:scripts && pnpm content:check (187/2308 green); pnpm build (374 static pages green); pnpm --dir apps/e2e exec playwright test (1361 passed in 7.7m). Spoiler P0 unchanged.

- [x] [HIGH] [anon] Home `/` "CURRENTLY FEATURED" stat block stamps Survivor with `June 2026 CANON REVISED`, but the deeper `/shows/survivor` page header — the same canonical fact about the same show — stamps `May 2026 CANON REVISED`. A first-time reader who clicks through from home to the show in the same minute sees two different last-revised dates for the same canon. Source: `src/lib/canon/last-revised.ts:46-51` documents the divergence directly — `getCanonRevisedLabel(now = new Date())` derives the home's label from build time, while `canonRevisedLabelFromIso(iso)` (called from `src/app/shows/[show]/page.tsx:176` via the canon's actual `last_revised` frontmatter) derives the show page's. The comment even calls the home value a "freshness signal' derived from build time" — but the **label** still says "CANON REVISED" which reads as a factual editorial claim, not a build-time signal. This undercuts the trust the canon is built on; the home page is the public surface that promises the editorial work, and stamping a build-month label as if it were the canon's revision month is the brand-central place to be honest. The drift will become visible on the 1st of every month (today, 2026-06-01, is the first day it's flipped — the build that ran tonight stamps June while the canon was last touched in May), and every month after. Fix options (pick one): (a) derive the home `Canon revised` label from the featured show's actual `canon.last_revised` (the canonical fix — sources match, label remains accurate; requires reading the featured show's canon at home-page build time, which is already loaded for the featured-card path); (b) rename the home label from `Canon revised` to `Last refreshed` or `Site refreshed` so the build-month signal is honest about being a build signal, not a canon date; (c) drop the home stat row's `CANON REVISED` cell entirely and rely on the show-page hero stat for the fact (smallest blast radius — the home keeps the `50 SEASONS RANKED` cell intact). Recommended: (a) — both surfaces agree, the editorial promise is preserved, and the home's freshness signal stays accurate because canon revisions outpace build cadence in steady state anyway. Pin with a colocated test on the home featured-card or `HomeHero` that mounts the component against a fixture show with `canon.last_revised = '2026-05-15'` and asserts the rendered stamp reads `May 2026`, not the current month; bonus invariant in `scripts/content-check.ts` that for the featured show, the home's `Canon revised` source path matches the show page's source path (both reading `canon.last_revised`). Spoiler discipline P0 unchanged (date format only). (URL: /, source: critique-pass-24) — issue: #269 — RESOLVED this commit: took the row's recommended Option (a). `src/app/(default)/page.tsx` now reads `getCanon(featured.slug)?.last_revised` and formats it via `canonRevisedLabelFromIso` — the same source path the show page reads (`src/app/shows/[show]/page.tsx:174`), so home → show always agree on the same canon's revision month. The prior build-time-derived `getCanonRevisedLabel(now = new Date())` function was retired (no remaining callers) and its colocated tests dropped; `canonRevisedLabelFromIso` becomes the single entry point with a header comment naming the pass-24 closure. `src/components/home/HomeHero.tsx` widened `canonRevisedLabel` to `string | null` and conditionally renders the stat cell — mirrors the show-page hero's behavior (`stats.push` is conditional on `revisedLabel != null`), so a canon without `last_revised` (or no canon at all) hides the cell rather than inventing a date. Pinned per the row's pin clause: `src/app/(default)/__tests__/page.test.tsx` gained a five-case "home canon-revised label sourced from featured show canon" describe block — (1) formats the featured show canon `last_revised` to "Month YYYY"; (2) reads the canon for the featured show, not a hard-coded slug (asserts `getCanon('amazing-race')` is called when survivor isn't featured); (3) passes null when the canon has no `last_revised`; (4) passes null when the featured show has no canon at all; (5) does NOT derive the label from build-time `new Date()` (uses `vi.useFakeTimers()` to pin June 2026 system time while asserting May 2026 from canon — the same drift the finding flagged on 2026-06-01). `src/components/home/__tests__/HomeHero.test.tsx` gained two new cases — one pins the null-label hide path; one regression-pins the label rendering verbatim from caller input (no clock dependency, no reformatting). Spoiler discipline P0 unchanged (date-source edit only). Verify gate green: leg1 tokens + typecheck + no-raw-img + 187 unit files / 2289 tests + 127 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs); leg2 build (374 pages); leg3 1361 e2e.

- [x] [MED] [anon] `/themes` hero stat reads `12 LISTS` (sourced from `ListsHero.tsx` via `getThemeStats().listsCount` = `themes.length`) but the filter chip immediately below the "All lists." subhead reads `SHOWING · ALL 9 LISTS` (sourced from `src/lib/themes-format.ts` `filterModeText()` with `counts.all` derived from the post-#253 `byCategoryRest` grouping — i.e., the themes catalog with the 3 featured-this-month entries filtered out). The three "missing" lists are the ones promoted into the "Featured this month" rail above and dedup-filtered from the index per the #253 fix. A first-time visitor scanning top-down sees 12, then 9 one screen later, with no copy bridging the gap — the natural read is "the count is wrong" or "a silent filter is applied". #255 already taught the chip to use `SHOWING` (not `VIEW`) for scope honesty, but "all lists not currently featured" is not the same scope as the hero's "all lists, full stop", and the page does not name the difference. Math today: 3 featured + (6 tone + 2 craft + 1 single) = 12 total — internally consistent, externally invisible. Suggested fix: pick one and apply consistently. Option (a) make the chip match the hero stat by counting featured-into-index — i.e., `byCategory` (not `byCategoryRest`) feeds `counts`, the chip reads `SHOWING · ALL 12 LISTS`, the 3 featured echo into the grid below the rail (reverses part of #253's dedupe, which would relitigate). Option (b) — RECOMMENDED — split the hero stat into two numbers that match the page's own structure: `3 FEATURED · 9 IN THE INDEX` (or render two stat-cells in `ListsHero` instead of one). Preserves #253's dedupe and tells the reader exactly what the chip below means before they reach it. Locate the hero stat in `src/components/lists/ListsHero.tsx` and the source-of-truth in `src/lib/themes/stats.ts`'s `getThemeStats()`; expose a `featuredCount` field so the hero can render both numbers. Pin with `ListsHero.test.tsx` cases asserting the two-number form and that featured + index sums to the catalog size. (URL: /themes, source: critique-pass-22) — 973989e — issue: #261 — RESOLVED 973989e: took the row's recommended Option (b). Added a shared `LISTS_FEATURED_RAIL_LIMIT = 3` constant in `src/content/loaders.ts` (re-exported from `src/content/index.ts`) so the rail length and the hero stat reference the same source of truth (`getFeaturedThemes` default param and `getThemeStats().featuredCount` both consume it; `src/app/(default)/themes/page.tsx` swapped its bare `3` literal for the constant). `ThemeStats` gained `featuredCount: Math.min(featuredFlagCount, LISTS_FEATURED_RAIL_LIMIT)`. `src/components/lists/ListsHero.tsx` rendered `<lists-stat-featured>{featuredCount} Featured</>` + `<lists-stat-index>{total - featuredCount} In the index</>` adjacent cells when `featuredCount > 0`, falling back to the single `<lists-stat-total>` cell when no theme carries `featured: true`. The split now narratively bridges the gap the finding called out: the hero says `3 FEATURED · 9 IN THE INDEX`, the chip below reads `SHOWING · ALL 9 LISTS`, and `9` references the same `byCategoryRest`-derived index in both places. Pinned per the finding's pin clause: `src/components/lists/__tests__/ListsHero.test.tsx` gained three new cases — (a) split rendering when `featuredCount > 0` (verbatim positive assertions on `lists-stat-featured` carrying `3 Featured` and `lists-stat-index` carrying `9 In the index`; negative pin that `lists-stat-total` does not also render alongside the split); (b) the `featured + index = total` invariant by parsing the two `.lists-stat-val` numbers and summing them; (c) the single-stat fallback when `featuredCount === 0`. `src/content/__tests__/loaders.test.ts` gained two new cases — one pins `featuredCount` capped at `LISTS_FEATURED_RAIL_LIMIT` (5 featured themes seeded → `featuredCount === 3`), the other pins `featuredCount === 0` baseline when no theme carries the flag. The barrel-snapshot test at `src/content/__tests__/index.test.ts` grew from 20→21 keys (`LISTS_FEATURED_RAIL_LIMIT` added) with identity-equality + number-shape pins for the new constant. The e2e `apps/e2e/src/fixtures/page-reads.ts` `/themes` smoke now expects the split form by default (production case today — 3 featured themes); a new dedicated `themes.spec.ts` spec pins that the hero `FEATURED` value equals the rail card count and that `FEATURED + IN THE INDEX = rail + grid-rows`. The existing three-stats `themes.spec.ts` test branches on rail presence so the single-stat fallback path stays exercised when the catalog ever drops featured-flagged entries. Spoiler discipline P0 intact (stat-row edit only, no per-season content change). Verify gate green: leg1 tokens + typecheck + no-raw-img + 187 unit files / 2257 tests + 127 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs); leg2 build (374 pages); leg3 1360 e2e.

- [x] [MED] [anon] On `/shows/survivor/season/heroes-vs-villains` the "WHAT TO WATCH FOR" → "LATE · THIRD ACT" callout body reads `The cold-open of the late-game stretch is doing real ethnographic labor — staging, blocking, who's eating where. Don't blink.` "Ethnographic labor" is academic-register language that violates plan/bearings's voice cue (`knowledgeable peer — plain-spoken, never pretentious. Plain sentences over clever ones.`). The three sibling callouts on the same WHAT-TO-WATCH-FOR grid all stay in plain speech (`cleanest piece of reality-TV staging`, `three-minute confessional`, `opening shot — boat, water, twenty people`), which makes the ethnographic phrase land harder as the lone register break. Same class as #242 (engineering vocab `recompute` swapped to `update`) and the recent /shows community-pane scrub — the page knows how to talk plainly elsewhere; this one callout is the outlier. Source: `content/shows/survivor/seasons/20-heroes-vs-villains.md` `watch_list[3].body` (the LATE/THIRD ACT card; the OPENER/EARLY/MID siblings live at indices 0-2). Suggested fix: drop the academic noun and let the em-dash list (`staging, blocking, who's eating where`) carry the work it's already doing — `The cold-open of the late-game stretch is doing real work — staging, blocking, who's eating where. Don't blink.` (or just `is doing a lot of work`). Single-string content edit; no schema/page/component change owed. Spoiler P0 unchanged (no per-season verdict, no winner/eliminee, no cast-count milestone — same as #248's scope). Pin: no test pins the prior literal (`apps/e2e/` + `src/**` grep expected clean), so the next critique pass re-verifies the absence per the precedent on sibling content edits (#246, #248). (URL: /shows/survivor/season/heroes-vs-villains, source: critique-pass-22) — 5fe6bfe — issue: #260 — RESOLVED 5fe6bfe: took the row's recommended literal — `content/shows/survivor/seasons/20-heroes-vs-villains.md:33` `watch_list[3].body` swapped `The cold-open of the late-game stretch is doing real ethnographic labor — staging, blocking, who's eating where. Don't blink.` → `The cold-open of the late-game stretch is doing real work — staging, blocking, who's eating where. Don't blink.` — drops the academic noun and lets the em-dash list (`staging, blocking, who's eating where`) carry the work it's already doing, parallel to the OPENER / EARLY / MID register the other three cards carry plainly (`opening shot — boat, water, twenty people`, `three-minute confessional`, `cleanest piece of reality-TV staging`). Single-string content edit; no schema/page/component/test change owed per the finding's own pin assessment — `apps/e2e/` + `src/**` grep for `ethnographic` was clean before the edit, so no test pinned the prior literal; the next critique pass re-verifies the absence per the precedent on sibling content edits (#246, #248). Spoiler P0 intact (no per-season verdict, no winner/eliminee, no cast-count milestone — same scope as #248). Verify gate green: leg1 tokens + typecheck + no-raw-img + 187 unit files / 2248 tests + 127 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs); leg2 build (374 pages); leg3 1359 e2e.

- [x] [MED] [authed] On `/shows/[show]/season/[slug]` the vote-pair CTA button label reads `CAST YOURS` — a possessive-elision fragment that is the only clever-fragment button in the entire authed walk. Every other site-wide CTA in the same walk is plain: `Browse all shows`, `Start with Survivor`, `Go to Survivor`, `How it works`, `read the list`, `Sign out`. Plan/bearings's voice cue says `plain sentences over clever ones`; `CAST YOURS` reads as the slip — the verb-fragment relies on the reader filling in "vote" from context, while the surrounding helper text already says `Does this belong in the community top 10?` plainly. Source: likely `src/components/composition/VotePair.tsx` or its CTA prop default — grep for `cast yours` / `CAST YOURS` should find the literal. Suggested fix: relabel to `CAST VOTE` or `VOTE` (single plain verb matching the site-wide register). Pin: a colocated `VotePair.test.tsx` assertion on the new button text + a negative pin against `/cast yours/i` so a regression back to the elision form fails at unit time. Spoiler P0 unchanged (CTA label only, no per-season verdict). (URL: /shows/survivor/season/heroes-vs-villains, source: critique-pass-22) — 1c24036 — issue: #259 — RESOLVED 1c24036: source was the eyebrow meta in `<VoteRowHead>` (the row guessed `<VotePair>` but the literal lives in the head meta one component up; the `<VotePair>` button itself carries icon-arrow affordances, not the text). `src/components/composition/VoteRowHead.tsx:35` state map swapped `'signed-in-no-vote': { title: 'Your vote', meta: 'cast yours' }` → `meta: 'cast vote'` — CSS continues to render the meta uppercase via the `.info-row-head .meta` text-transform pipeline, so the surface now reads `YOUR VOTE / CAST VOTE` (plain verb-imperative parallel to the third state's `change within 72h`). Pinned per the #242 closure pattern: `VoteRowHead.test.tsx`'s signed-in-no-vote case gained a positive assertion on the new `cast vote` text AND a `expect(head.textContent ?? '').not.toMatch(/cast yours/i)` negative pin so a regression back to the elision form fails at unit time. The e2e `apps/e2e/tests/vote-state-pill.spec.ts:113` `.meta` toHaveText assertion swapped to the new literal; the source/test/CSS comments referencing the prior literal updated in lockstep (`VotePair.tsx:168`/`:185`, `VotePair.test.tsx` three describe-block comments, `screens.css` line 620 `.vote-pair-stack` rationale, `vote-state-pill.spec.ts` lines 11/19/22/106 prelude). The `VoteRowHead.tsx` header comment rewritten to name the new literal + the pass-22 rationale. Spoiler P0 intact (eyebrow meta only, no per-season verdict change, no canon position change). Verify gate green: leg1 tokens + typecheck + no-raw-img + 187 unit files / 2248 tests + 127 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs); leg2 build (374 pages); leg3 1359 e2e.

- [x] [HIGH] [anon] `/about` "How voting works" describes a mechanic that contradicts the live single-binary system on home + season pages. /about (`content/legal/about.md` or the rendered `/about` body) reads `Each ranked season has an upvote and a downvote button; signed-in members carry the most weight.` / `One live vote per season per session; flip it whenever you change your mind.` plus a weighting table `Anonymous guests: 0.1x / Accounts under 7 days: 0.25x / Accounts 7+ days: 1.0x`. The home `HomeDualCallout.tsx` live cell reads `One reader, one vote per season — does it belong in the community top 10?` and the season page's `SeasonInfoCard.tsx` voteHelp reads `one vote per reader. community rank updates weekly.` (+ the `change your mind within 72h` window the show page advertises). Four contradictions stack on the explainer surface: (1) up/down directional vote vs binary "belongs in top 10" inclusion vote; (2) account-age weighting math vs flat one-reader-one-vote; (3) per-session scope vs per-reader scope; (4) unlimited flipping vs 72h change window. This is the post-#240 single-binary redesign not propagated to the explainer page itself — a reader who clicks "How voting works" from a footer link to verify what they're being asked on a season page lands on a description of a different system. Same class as #240 (the home Community Rank pane), different surface. The recent commit eac1163 fixed only the [+]/[−] → up/down arrow detail and left the broader mismatch intact. Suggested fix: rewrite /about's "How voting works" section end to end to describe the live single-binary "belongs in the community top 10?" mechanic with per-reader scope and the 72h change window. Drop the up/down button language, the per-session scope claim, the unlimited-flip claim, and the account-age weighting table — all describe the pre-#240 system. Pin with a colocated content-test or a `content-check.ts` invariant asserting `/about` does NOT contain `/upvote/i`, `/downvote/i`, `/per session/i`, or the weighting-table fractions while the live mechanic strings remain. (URL: /about, source: critique-pass-22) — 8cc9331 — issue: #258 — RESOLVED 8cc9331: rewrote `content/legal/about.md` lines 14-18 + 25-37 to lead with the live "does it belong in the community top 10?" question framing and pin the three live constraints the home + season pages already advertise — one vote per reader per season, change your mind within 72 hours, community rank updates weekly. The two intentional departures from the row's literal recommendation: (a) kept the `upvote / downvote` terms because the live VotePair UI still ships up/down arrow buttons (the eac1163 closure for the prior LOW #257 documented the affordance — dropping the terms would re-open that gap); the new copy leads with the question and frames the buttons as the answer, so the post-#240 framing wins without contradicting the live UI; (b) kept the weighting table (Anonymous 0.1× / Accounts under 7 days 0.25× / Accounts 7+ days 1.0×) because it is accurate to the DB (`supabase/migrations/20260513000004_votes.sql:38` + `20260513000005_cast_vote_rpc.sql:107-123`) and /about is the granular surface where granular truth belongs — the home + season pages collapse to "one reader, one vote" for brand simplicity, and /about reframes the math as a secondary mechanic ("long-standing accounts carry the most weight") rather than the headline of how voting works. Pin: `src/app/(default)/about/__tests__/page.test.tsx` expanded the prior 2-case #257 suite (which only pinned upvote/downvote + [+]/[−] regression guards) to an 8-case #258 suite — positive pins for (1) "belong in the community top 10" question framing, (2) "upvote or downvote" mechanic terms, (3) "per reader" scope, (4) "72 hours" change window, (5) "updates weekly" recompute cadence (all with `\s+` whitespace tolerance because the source markdown wraps at 65 cols and the exact phrase may span a line break in `body_md`); negative pins for (6) the prior [+] / [−] glyphs (#257 regression guard preserved), (7) any "per session" scope claim (#258 regression guard), (8) any "flip it whenever" unlimited-flip claim (#258 regression guard). Bidirectional contract: a regression back to the pre-#240 system fails AND dropping the new copy entirely also fails. Spoiler discipline P0 unchanged (copy edit only). Verify green: leg1 tokens + typecheck + no-raw-img + 187 unit files / 2248 tests (incl. expanded /about 10-case suite — 2 import-smoke + 8 copy contract) + 127 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs), leg2 build (374 pages), leg3 1359 e2e.

- [x] [MED] [anon] The breadcrumb root and the footer's first link column both render the word `Tiers` (linking to `/shows`), but every binding design file uses `Shows` in those exact positions: `design/tiered.tv · Survivor.html:512` crumb reads `Shows / Survivor`; `design/tiered.tv · Heroes vs. Villains.html:515` crumb anchor is `<a href="#">Shows</a>`; `design/tiered.tv · All Shows.html` uses `Shows` for the nav current-item (`:292`), the hero eyebrow `tiered.tv / Shows` (`:305`), and the footer column head `<h5>Shows</h5>` (`:515`); `design/tiered.tv · Brand.html` describes "the bullet system carries through to the **Shows** column." In the design, `Tiers`/`Tiered` appears ONLY as a headline flourish (`All shows. Tiered.`) and as the conceptual name of the S/A/B bands ("How the tiers move"), never as a nav label, breadcrumb root, or footer column head. So a first-time visitor sees three different words for the site's navigation spine — header nav `Shows` / `Lists`, footer column `Tiers`, breadcrumb root `Tiers / Survivor` — and the inconsistency is a drift FROM the design, not a design-faithful choice. This recurs from pass-14's dropped finding (a) ("ambiguous which form is canonical"); the design files now settle it definitively in favor of `Shows`. Fix: rename `Tiers` → `Shows` in the breadcrumb anchor text at `src/app/shows/[show]/page.tsx:195` and `src/app/shows/[show]/season/[slug]/page.tsx:360`, in the matching `BreadcrumbList` JSON-LD `name` at the same files (`page.tsx:120` and `[slug]/page.tsx:308` — `{ name: 'Tiers', path: '/shows' }` → `{ name: 'Shows', … }`), and in the footer column head + aria-label at `src/components/chrome/footer/FooterTiersCol.tsx:10,13` (keep the `data-testid` stable to avoid spec churn, or rename it + its specs in the same tick). Update the colocated `ShowHero.test.tsx`/`SeasonHero.test.tsx` crumb fixtures (currently `Tiers / Survivor`) and `Footer.test.tsx`/`FooterTiersCol.test.tsx` head assertions. (URL: /shows/survivor, source: critique-pass-16) — 987754d — issue: #214 — RESOLVED: renamed the breadcrumb root + footer column label `Tiers` → `Shows` to match every binding design file. Five production sites: the `BreadcrumbList` JSON-LD `name` + the visible crumb anchor in `src/app/shows/[show]/page.tsx` (`Shows / <show>`) and `src/app/shows/[show]/season/[slug]/page.tsx` (`Shows / <show> / Season N`); the season OG eyebrow in `src/app/shows/[show]/season/[slug]/opengraph-image.tsx` (`Tiers / <show>` → `Shows / <show>` — the same breadcrumb-root string, included so the social card doesn't reintroduce the very inconsistency the finding flags); the footer column `<h2>` head + `aria-label` in `src/components/chrome/footer/FooterTiersCol.tsx` (took the finding's low-churn option — kept `data-testid="site-footer-tiers-col"` and the component/file name `FooterTiersCol` stable, only the rendered label moved). The show-level OG eyebrow is `tiered.tv · Show` (not a breadcrumb root) — left as-is. The S/A/B band-name uses of `Tiers` are deliberately untouched — the design reserves `Tiers`/`Tiered` for the conceptual bands (`HowTiersMove`, the `tier`-type search-filter chip, `TYPE_DISPLAY.tier`) and the `All shows. Tiered.` headline flourish, never for nav/crumb/footer IA, so they stay. Tests updated in the same tick: `opengraph-image.test.tsx` (5 eyebrow fixtures), `FooterTiersCol.test.tsx` (aria-label + `<h2>` head + empty-state head, 3 assertions), `Footer.test.tsx` (2 `it()` descriptions), and the `ShowHero.test.tsx` + `SeasonHero.test.tsx` crumb fixtures. No e2e crumb assertion pinned the literal `Tiers /` (the e2e `Tiers` refs are the S/A/B-band coverage check, unaffected). Verify green: leg1 tokens + typecheck + no-raw-img + 127 script + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs), leg2 build, leg3 1350 e2e.

- [x] [HIGH] [anon] /shows/survivor canon ladder renders the top two entries both tagged COMMUNITY `#01` — Cagayan (canon #01) reads `COMMUNITY · ◆ hold · #01` and Heroes vs. Villains (canon #02) reads `COMMUNITY · ↑ 1 · #01` directly below. Two seasons cannot both occupy community position #01: either HvV's `↑ 1` is right (it moved from #02 to #01, in which case Cagayan should display #02) or HvV's `#01` is stale and the actual position is #02. A first-time reader inspecting the showcase canon's top two slots sees a contradiction. Root cause verified against `content/shows/survivor/canon.md`: both Cagayan and Heroes vs. Villains have `community_rank_hint: rank=1` authored in frontmatter; the canon-ladder renderer (`src/components/canon/CanonHeroEntries.tsx:84` prints `#{padRank(hint.rank)}`) faithfully renders both as `#01`. Fix: decide the right community ranking for the top two slots and edit `community_rank_hint` accordingly. If Cagayan is community #01 (the `◆ hold` claim), HvV must be `rank=2` with `delta=1 sentiment=up` to mean "moved up 1, now at #02". Optionally pin the invariant with a `content-check.ts` rule that no two `community_rank_hint.rank` values on a single show's canon are equal. (URL: /shows/survivor, source: critique-pass-13) — 1241040 — issue #194 — RESOLVED this commit: adopted the row's recommended interpretation — Cagayan holds at community #01 (`◆ hold`), HvV moves up to community #02 (`↑ 1`, up from #03), and the cascade flows through the rest of S-tier so every visible rank is unique. Four edits to `content/shows/survivor/canon.md`: Heroes vs. Villains `rank=1 delta=1 sentiment=up` → `rank=2 delta=1 sentiment=up` (the critique's literal recommendation); Borneo `rank=2 delta=-1 sentiment=down` → `rank=3 delta=-1 sentiment=down` (down 1 from #02 to #03); Micronesia: Fans vs. Favorites `rank=3 delta=0 sentiment=hold` → `rank=4 delta=-1 sentiment=down` (sentiment flips hold→down because Borneo's drop pushed Micronesia down a slot); Pearl Islands `rank=4 delta=-1 sentiment=down` → `rank=5 delta=-1 sentiment=down` (down 1 from #04 to #05). S-tier (canon #01-#05, the only rows the `CanonHeroEntries` renderer shows community ranks for) now reads #01 hold / #02 ↑1 / #03 ↓1 / #04 ↓1 / #05 ↓1 — strictly ascending, no duplicates, internally coherent. A-tier and below (canon #06+) untouched; the `CanonMidEntries` renderer doesn't surface community ranks so the existing pre-authoring duplicates in the long tail (rank 11/13/19/20/33/35/37 twice apiece) are unaffected by this fix and remain a separate, lower-priority editorial cleanup. Optional content-check uniqueness invariant deferred per skill rule 1 ("one fix per tick") — the canon-ladder duplicate is the visible reader-facing regression, the lower-rank duplicates would require a broader editorial drain that doesn't fit this tick's scope. Spoiler discipline P0 intact — community-rank-hint edits only, no per-season verdict surfaces revisited. Verify green: leg1 tokens + typecheck + no-raw-img + 1915 unit tests + 127 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs), leg2 build (374 static pages), leg3 1348 e2e.

- [x] [HIGH] [anon] /shows/<show>/season/<slug> community-vote-block microcopy reads `one vote per reader. canon position recomputes weekly.` — but the site's central editorial frame (home page `Editor's Canon · Revised quarterly` vs `Community Rank · numbers shift each week`; `plan/bearings.md` `What we're building`) explicitly separates the two ranking tracks. The vote block sits under the community-vote heading (`CAST A VOTE / SIGN IN TO WEIGH IN`, `1 NET VOTE` value) and yet promises that *canon* position recomputes weekly — collapsing the two-rankings frame in the one place the reader is being asked to participate in the community side. Root cause: the literal string ships from `src/components/composition/SeasonInfoCard.tsx:50` as the default `voteHelp` prop value. Fix: change `'one vote per reader. canon position recomputes weekly.'` → `'one vote per reader. community rank recomputes weekly.'` in `SeasonInfoCard.tsx:50` and any test fixture / e2e that pins the literal. Reserve "canon" exclusively for the editorial track everywhere. (URL: /shows/survivor/season/heroes-vs-villains, every /shows/<show>/season/<slug> URL, source: critique-pass-13) — 1241040 — issue #192 — RESOLVED at fa683be: `src/components/composition/SeasonInfoCard.tsx:50` `voteHelp` default flipped `'one vote per reader. canon position recomputes weekly.'` → `'one vote per reader. community rank recomputes weekly.'`. The vote row sits under the community-vote heading (`CAST A VOTE / SIGN IN TO WEIGH IN`, `1 NET VOTE`), so the recompute promise belongs to the community track; "canon" stays reserved for the editorial track everywhere. The literal flip is one line; no test fixture or e2e pinned the prior string (greps across `src/` and `apps/e2e/` returned only the source file before the change). §5a: `src/components/composition/__tests__/SeasonInfoCard.test.tsx` gains 2 colocated cases under the existing `<SeasonInfoCard>` describe — (1) default voteHelp surfaces "community rank recomputes weekly" inside `info-row-vote` AND does NOT surface "canon position recomputes" (pins both directions in one test: a regression back to "canon position" fails, and dropping the default entirely so the row goes empty also fails); (2) a custom `voteHelp` prop overrides the default (so the prop still works for non-season callers). Spoiler discipline P0 intact — voice/microcopy edit only. No URL, schema field, or page family change. Verify green: leg1 tokens + typecheck + no-raw-img + 172 unit test files (incl. 2 new SeasonInfoCard cases) + 127 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs), leg2 build (374 static pages), leg3 1310 e2e.

- [x] [MED] [anon] / (home) renders Survivor twice in the visible fold — once as the "CURRENTLY FEATURED" hero block at the top of the page, and a second time inside the compact "+ 10 MORE IN THE INDEX" grid below the three expanded tier cards. Same show, same paint: a first-time visitor scans the home page and meets `Survivor / 50 SEASONS RANKED` at the top, then `REALITY COMPETITION / Survivor / 50 SEASONS →` in the compact tail. The duplication reads as a content-management bug — one of the strongest signals on the page (the FEATURED hero) is repeated as a small-card row alongside ten other shows, halving the hero's editorial weight and making the compact grid look like it skipped the dedup. Source: the home page consumer renders the featured cover from one selector and the "+ N more" compact tail from another selector that doesn't exclude `featured`. Fix: in the home-page partition (or `getHomeShows`/`partitionHomeShows` helper, whichever owns the split), drop the featured show's slug from the compact remainder so featured + compact-tail unions to N unique shows, no overlap. Add a unit + e2e assertion that the slug appearing in the FEATURED block does NOT appear in the compact grid (`apps/e2e/tests/home.spec.ts`). (URL: /, source: critique-pass-10) — 1941e89 — issue #174 — RESOLVED this commit: `partitionHomeShows` gains an optional second `excludeSlug` arg (`src/lib/home/show-partition.ts`) that filters the show pool before the 3-up/compact slice. `src/app/(default)/page.tsx` passes `featured?.slug` so the FEATURED hero's show is dropped from both grids; the union is now featured-hero (1) + 3-up tiles (3) + compact tail (9) = 13 unique shows on the catalog, no overlap. Unit tests: 6 new `excludeSlug` cases (omits from both grids; shifts compact forward when an excluded slug was in featured; no-op for unknown / undefined slug; no input mutation; small-catalog exclusion). e2e tests: `featured hero slug never reappears in the show grids (#174)` walks `/` and asserts the hero's `home-cover-go` href appears in neither `home-show-grid` nor `home-more-shows-grid` (the literal regression the row described); the existing "every tracked show appears" reconciliation now includes the hero count so `featuredCount + compactCount + heroCount === tracked`. The `home-more-shows-label` shifts from "+ 10 more in the index" to "+ 9 more" — the label is data-derived and the existing label/count assertion stays green. No content / palette change.

- [x] [MED] [anon] /shows/<show>/season/<slug> ships a flat CMS-template meta description on every season detail page — `<meta name="description" content="Vote and discuss <show> season <n>: <title>.">`. The pattern surfaces on every social share, every Google snippet, and every chat-app unfurl for the canon's most-promoted reading surface; it reads as bot-generated and previews zero editorial signal next to the show / themed-list / /u/[handle] surfaces, which all carry editorial-voice descriptions (the /u/[handle] surface was rewritten at 590c6a0 / #169 — same class, same fix shape). The on-page hero lede (`season.lede`, eg. Heroes vs. Villains "A returnees season that finally let the format show what it could really do, when nobody had to be introduced. The pace doesn't slow, even for sleep.") is the line a reader would quote to a friend, but `generateMetadata` ships the placeholder instead. Same template applies across all 298 season pages. Fix: in `src/app/shows/[show]/season/[slug]/page.tsx` `generateMetadata`, prefer `season.lede` as the description (truncate at ~155 chars on the rare lede that runs long), falling back to the current template only when no lede is authored. Pin the contract with a colocated test mirroring the #169 / 590c6a0 shape (`apps/e2e/tests/season-page.spec.ts` asserts `<meta name="description">` matches the season's `lede` for a representative URL). Spoiler-safe — `season.lede` is the same string already rendered in the hero (zero spoiler reasoning to redo). (URL: /shows/survivor/season/heroes-villains, every /shows/<show>/season/<slug> URL, source: critique-pass-10) — 1941e89 — issue #173 — RESOLVED at cc58f17: `src/app/shows/[show]/season/[slug]/page.tsx` `generateMetadata` now derives the meta description from a new `descriptionFor(showName, season)` helper that prefers `season.lede` (the curator's hand-authored opener — the same string the hero already renders) and falls back to the prior `"Vote and discuss ${show.name} season ${season.number}: ${season.title}."` template only when no lede is authored. Long-lede truncation: most ledes sit between 130–280 chars (Google snippets clip ~155–160); the helper cuts at the last word boundary inside 159, trims trailing punctuation (`[\s,;:—-]+`) so the cut never ends on a dangling comma / em-dash / colon / semicolon, and appends `…`. Trim is applied before length check so a stray trailing space in frontmatter doesn't bias the cut. Mirrors the #169 / 590c6a0 shape exactly — same class (CMS-template meta description on a canon-promoted surface), same fix (editorial-voice descriptor preferred, template fallback retained), same gate (e2e asserts the verbatim string for a representative URL). apps/e2e/tests/season-page.spec.ts pins the contract in the existing "survivor S20 — gold-standard reference" describe (Heroes vs. Villains lede is 149 chars, well under the 160 truncation point — the assertion captures verbatim pass-through and bans the legacy "Vote and discuss " prefix). Spoiler discipline P0 intact — `season.lede` is the same string already rendered in the hero, so no new spoiler reasoning is introduced. Verify green: leg1 tokens + typecheck + no-raw-img + 1817 unit tests + 127 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs), leg2 build 298 SSG season slugs, leg3 1331 e2e (the new gold-standard meta-description assertion + 1330 prior cases).

- [x] [MED] [anon] /themes/best-finales entry rows mix three different secondary-label patterns inside one ranked list — five entries use a named subtitle (HEROES VS. VILLAINS, LAS VEGAS, WINNERS AT WAR, RENEGADES ERA), two fall back to the bare "SEASON N" (Amazing Race S07, Drag Race S06), and The Traitors uniquely tacks on a parenthetical year ("SEASON 2 (2024)"). A reader scanning the list registers the inconsistency before the picks. The labels are explicit `season_label:` strings in `content/themes/best-finales.md` frontmatter (curatorial, not derived), so this is editorial drift, not a templating bug. Underlying cause: some season `title:` fields are real names ("Heroes vs. Villains", "Winners at War", "Las Vegas") while others are bare "Season N" (e.g. `content/shows/dragrace/seasons/06-season-6.md`, `content/shows/amazing-race/seasons/07-season-7.md`). Fix: pick one rule for the secondary label across all `/themes/<list>/` rows and apply consistently — either always show the editorialized name (fill in the missing season titles in the source content) or always strip to bare "SEASON N" in `season_label`. Drop The Traitors' parenthetical year — no other entry asks for it. Sweep all 12 `content/themes/*.md` for the same pattern. (URL: /themes/best-finales, source: critique-pass-8) — 6b81691 — issue #161 — RESOLVED at 025e601: 17 edits across 10 `content/themes/*.md` files stripped every `S<NN> · Season N` and `S<NN> · Season N (YYYY)` `season_label` to the bare `S<NN>` form (the `S<NN>` prefix already names the season number, so the subtitle was redundant; the parenthetical year was the same class plus an ornament no other entry asks for). Editorialized subtitles ("Heroes vs. Villains", "Las Vegas", "Winners at War", "Renegades Era", "Borneo", "Pearl Islands", "New Era I", "All-Stars", "Cagayan", "Mom I Won", "The Channel 4 Reset", "Rivals III", "Den Of Temptation", "XXX: Dirty 30", "Summer Of Secrets", etc.) all stay legal — the rule fires only against bare numeric restatements. `scripts/content-check.ts` `collectThemeFailures()` gains a strict invariant in the existing #101 ` · `-delimited-name guard: when the subtitle matches `/^(Season|Series)\s+\d+(\s+\(\d{4}\))?$/i` the script fails with a message naming the redundant subtitle and the bare-`S<NN>` form to use instead. Strict from this commit forward (catalog clean, rule mechanical — no lax→strict drain needed, unlike CROSS_SHOW_STRICT/STRICT/YEAR_TENURE_STRICT). The existing #101 title-match check stays — both checks run independently; a real divergent name like `"Reboot"` still surfaces only the #101 message. §5a: `content-check.test.ts` #161 describe (+7 cases) covers fail-on-`Season 7`, fail-on-`Season 2 (2024)`, fail-on-`Series 1 (2015)`, pass-on-bare-`S07`, pass-on-`Heroes vs. Villains`, pass-on-`Seasonal Cup` (looks-like-Season-but-isn't), pass-on-absent-`season_label`. No URL, schema, page family, or component change — content data + verify-time guardrail. Spoiler discipline P0 intact — themed-list labels are non-spoilable. Verify green: leg1 tokens + typecheck + no-raw-img + 163 unit test files (1762 passed) + 127 script tests + content:check (13 shows/298 seasons/13 canons/12 themes/3 legal docs), leg2 build (374 static pages), leg3 1329 e2e.

- [x] [MED] [authed] At 375px the global header drops the primary nav ("Shows", "Lists", "About") entirely on every page — only `tiered.tv`, ⌕ Search, the handle, and "Sign out" remain. No hamburger surface in the rendered text either. A signed-in mobile reader cannot reach /shows or /themes from the chrome without scrolling to in-page "Browse all shows" or to the footer. Same chrome shrinkage on the anon mobile walk (so it affects every visitor, not just members). Fix: add a visible menu trigger at <768px that exposes Shows / Lists / About, or move the three into a slim sub-bar below the brand mark so chrome navigation works at every viewport. Verify there is no icon-only hamburger already rendered that the text-only capture missed before implementing — but if missing, this blocks the entire mobile read of the catalog. (URL: every page at 375px, source: critique-pass-7) — 4258083 — issue #156 — RESOLVED at 59a7d43: `src/styles/chrome.css` `@media (max-width: 720px)` block dropped `.site-header-links { display: none }` and reflowed the nav onto a second row via `flex-wrap: wrap` + `order: 3; width: 100%`. Brand + right cluster (search, sign-in/user) stay on the top row; Shows / Lists / About center themselves below with a 13px font and 20px gap. The header gets a deterministic `min-height: 80px` so the sticky canon tab bar (`canon.css` `.ranking .cp-tabs`) can pin flush under it; the mobile sticky `top` updates from 64px → 80px in lockstep so the phase 37 nit 1 contract (`tests/show-home.spec.ts:307` mobile-tabs-flush, `Math.abs(gap) <= 2`) stays green — caught the height drift before push. No JS, no markup change. §5a: `apps/e2e/tests/chrome.spec.ts` gains a `chrome: mobile @ 375px primary nav` describe asserting Shows / Lists / About are visible across `/`, `/shows`, `/themes/best-premieres` — pins the affordance against a regression to `display: none`. Verify green: leg1 tokens + typecheck + no-raw-img + unit + script tests + content:check (13 shows/298 seasons/13 canons/12 themes/3 legal docs), leg2 build (374 static pages), leg3 1325 e2e (incl. 3 new chrome mobile checks AND the phase 37 mobile-tabs-flush check).

- [x] [LOW] [anon] Footer prints `v0.0.0` on every public page, immediately after the brand line `est. as a quiet rebellion against ranked lists that ruin the show`. The home and /shows pages make confidence claims — "editor's canon", "revised quarterly", "stable list" — and the version string undercuts them: a first-time visitor reads `v0.0.0` as "this is not finished". Either remove the version from the public footer, move it to a build-info attribute / `<meta>` tag, or bump past `0.0.0` so the public surface stops signaling pre-release. (URL: every page, source: critique-pass-7) — 4258083 — issue #155 — RESOLVED this commit: dropped the version `<span>` (and its `data-testid="site-footer-meta-version"` + `.site-footer-meta-version` CSS rule) from `src/components/chrome/footer/FooterMeta.tsx`. The footer's meta strip now carries two spans (rebellion / theme-toggle) on every public page; the engineering / diagnostic value of the package version is preserved via `package.json` for any inspector — the public surface stops signaling pre-release on every page. §5a: `FooterMeta.test.tsx` 9→9 (span-order assertion flipped from three spans to two; new negative-assertion case pins that no `vN.N.N`-shaped version string surfaces in the meta strip and that the `site-footer-meta-version` testid is absent); `Footer.test.tsx` 9→9 ("renders the package version" → "does not surface a package version", with the same negative pin at the parent-footer level so a regression that re-introduced the version span anywhere inside `<Footer>` fails loudly). No URL, schema, page family, or content change. Verify green: leg1 tokens + typecheck + no-raw-img + 162 unit test files (1731 passed) + 127 script tests + content:check (13 shows/298 seasons/13 canons/12 themes/3 legal docs), leg2 build, leg3 1322 e2e.

- [x] [MED] [authed] /shows/survivor/season/heroes-villains thread section on the signed-in render places two empty-state prompts back-to-back with no content between them — the composer carries "BE THE FIRST · Add a thought · no spoilers, please. ⏎" and the next block reads "No comments yet. Weigh in on the season, not the result." Two voices doing the same job for the same user: one playful imperative, one stern editorial guardrail. A signed-in member about to type does not need both. Fix: collapse to one line on signed-in render — composer placeholder carries the "no spoilers" nudge; drop the "No comments yet. Weigh in…" empty-state when the composer is rendered. Reserve the empty-state line for the anonymous view where the composer is replaced by a sign-in prompt. (URL: /shows/survivor/season/heroes-villains, source: critique-pass-7) — 4258083 — issue #154 — RESOLVED at 0aa8faf: `src/components/composition/CommentThread.tsx` rendered `No comments yet. Weigh in on the season, not the result.` whenever `children` were absent — independent of whether the input slot held the signed-in `CommentInput` composer (with its own "Add a thought · no spoilers, please" placeholder) or the signed-out `CommentInputStub`. So a signed-in viewer with zero comments saw the composer's nudge AND the empty-state line back-to-back; both did the same editorial job. Fix lands the rule at the API: `CommentThread` gains an optional `hideEmpty?: boolean` prop that suppresses the empty-state `<p>` when the caller has already nudged the viewer through its input slot. `CommentThreadLive` threads `hideEmpty={state.signedIn}` — the signed-in branch (real composer) drops the redundant line, the signed-out branch (sign-in stub) keeps it so the anonymous viewer still gets the editorial guardrail beneath the sign-in prompt. Children handling preserved — the rendering of real thread children when present is unchanged; only the empty-state conditional shifted. §5a: `CommentThread.test.tsx` 4→7 (hideEmpty suppresses the empty-state at count=0 with no children; hideEmpty=false default preserves prior behavior; hideEmpty does not suppress real thread children when present); `CommentThreadLive.test.tsx` 4→5 (the exact bug shape — signed-in viewer with zero comments shows the composer and reads "Be the first" in the meta, but no `comment-thread-empty` line); existing anon/empty-state and held-only assertions still pass. No URL, schema field, or page family change. Spoiler-safe — composer copy and empty-state copy both unchanged; only the conditional rendering shifted. Verify green: leg1 tokens + typecheck + no-raw-img + 162 unit test files (1733 passed) + 127 script tests + content:check (13 shows/298 seasons/13 canons/12 themes/3 legal docs), leg2 build (374 static pages), leg3 1322 e2e.

- [x] [MED] [authed] /u/<handle> empty state reads as generic CMS scaffolding — "No public activity yet. Votes and published comments will show up here." doesn't carry the knowledgeable-peer voice that holds elsewhere on the site (compare to season pages' "Weigh in on the season, not the result."). For a signed-in member this is their *own* page — the first product-as-member impression — and the copy gives nothing back. Fix: rewrite the empty state to address the member directly and in voice — something like "Nothing on the public record yet. Vote on a season pair, weigh in on a thread, and it will land here." Source: likely `src/components/profile/ProfileEmpty.tsx`. (URL: /u/e2e, source: critique-pass-6) — 8d71196 — issue #153 — RESOLVED at 337b97f: `src/components/profile/ProfileEmpty.tsx` rewrote the empty-state copy to the row's suggested phrasing verbatim — "Nothing on the public record yet. Vote on a season pair, weigh in on a thread, and it will land here." — addressing the member directly and naming the two surfaces (vote pairs + threads) they would land here from, in the knowledgeable-peer voice that holds elsewhere on the site. The colocated unit test `ProfileEmpty.test.tsx`'s verbatim-copy assertion updated in lockstep so the canonical-copy contract stays load-bearing. No e2e fixture row owed — `apps/e2e/tests/user-profile.spec.ts` walks the populated profile path, not the empty-state. Spoiler-safe — voice rewrite only. Verify green: leg1 tokens + typecheck + no-raw-img + 1198 unit tests + 105 script tests + content:check (13 shows/298 seasons/13 canons/12 themes/3 legal docs), leg2 build, leg3 1322 e2e.

- [x] [MED] [anon] /shows/survivor/season/heroes-villains HOST stat caption reads "tenth season at the helm" on Season 20 — Probst hosted Survivor from S1 unbroken, so by S20 he is in his 20th season at the helm, not his tenth; the caption is a hardcoded constant misapplied per-season. Phase 43 editorial-honesty class with a sharper edge — this one is factually wrong now, not just drifting. Fix: derive the ordinal from the season number, or drop the per-season caption and lean on the host's tenure on the show page rather than the season page. Source: `content/shows/survivor/seasons/20-heroes-villains.md` line 22 (`host_caption: "tenth season at the helm"`). (URL: /shows/survivor/season/heroes-villains, source: critique-pass-6) — 8d71196 — RESOLVED at 3a058c2 (phase 43 tick 5): row was already addressed in the phase 43 editorial-honesty drain — `src/lib/show-tenure.ts` gained `ordinalWord(n)` (spelled-out 1-99: first…ninety-ninth) and `ordinalSuffix(n)` (numeric: 1st, 22nd, 113th — handles the 11/12/13 edge); `renderSeasonCaptionTokens(template, { seasonNumber })` substitutes `{seasonOrdinalWord}` / `{seasonOrdinal}` in season-scoped captions, with token-free templates passing through unchanged so the 200+ existing literal captions keep working; `materializeSeason` in `src/content/loaders.ts` runs `host_caption` through the renderer on every read, mirroring `materializeShow`. The S20 source file flipped `host_caption: "tenth season at the helm"` → `{seasonOrdinalWord} season at the helm`, now rendering "twentieth season at the helm". The agent guidance in `.claude/agents/content-curator.md` and `skills/ship-content.md` Rule 2 documents the token + the host-since-S1 convention (mid-run hosts keep a literal ordinal). 53 new unit tests across `show-tenure.ts` (ordinalWord + ordinalSuffix + renderSeasonCaptionTokens) and `loaders.ts` (token-free pass-through, both tokens, getAllSeasons coverage, the no-host_caption case). The Pending row sat unmarked because critique pass 6 ran on 8d71196 (before 3a058c2 shipped) and pass 7 didn't re-walk the same finding — this tick is housekeeping only; no source change.

- [x] [MED] [anon] /shows/survivor/season/heroes-villains EPISODE HEAT block ("peak run · eps 7–9, 11") plus the "WHAT TO WATCH FOR" cards labeled "EP 7 · LONG TAKE", "EP 9 · MERGE", "EP 11 · THIRD ACT" disclose when the merge falls and which episodes carry the season's dramatic density. The page surfaces a "no spoilers" badge three times, but merge-episode timing is itself a story beat in a season where merge timing is the pivot — a reader 3 episodes in now knows to brace for ep 7 and ep 9. P0-adjacent spoiler-discipline edge. Fix: reframe the "WHAT TO WATCH FOR" cards without explicit episode numbers (phase labels — "EARLY · LONG TAKE", "MID · MERGE", "LATE · THIRD ACT") and drop the explicit ep range from EPISODE HEAT, or gate the precise eps behind a "show episode numbers" toggle. (URL: /shows/survivor/season/heroes-villains, source: critique-pass-7) — 4258083 — issue #152 — RESOLVED at 08c121d: content edit on `content/shows/survivor/seasons/20-heroes-villains.md` flips the four `watch_list.episode_label` values from leading episode numbers to phase labels ("Opener · cold open", "Early · long take", "Mid · merge", "Late · third act") and rewrites `episode_heat_caption` from "peak run · eps 7–9, 11" → "peak run · the back half". The underlying `episode_heat` array (the visual heat strip) is unchanged — the season's dramatic shape still reads — and the watch-list bodies are unchanged (their references to "the merge" and "the final eight" are act-arcs, not episode-number timestamps). Targeted to HvV only: other shows' "Ep N · …" labels stand because merge-timing sensitivity is Survivor-specific. The `WatchList` component passes `episode_label` through verbatim, so no component or schema change is required. The colocated unit tests (`WatchList.test.tsx`, `SeasonEpStrip.test.tsx`, `read-minutes.test.ts`) use the old literals as in-test fixtures, not pulled from content — they continue to pass without change. Spoiler-safe — repositioning a P0-adjacent leak away from explicit episode timing. Verify green: leg1 tokens + typecheck + no-raw-img + unit tests + script tests + content:check (13 shows/298 seasons/13 canons/12 themes/3 legal docs), leg2 build (374 static pages), leg3 1322 e2e.

- [x] [MED] [anon] / and /shows and /shows/<show> render the canon-revised date as `05 / 26` (eyebrow "CANON REVISED", "LAST REVISION") — the slash format is ambiguous to a first-time visitor (May 2026? 5-of-26 revisions? week 5 of 2026?) and reads as machine output rather than editorial. Bearings voice rule: plain-spoken. Fix: render the date in editorial form — "Revised May 2026" or "Last revised: May 2026" — wherever the slashed numeric appears. (URL: /, /shows, /shows/survivor, source: critique-pass-7) — 4258083 — issue #151 — RESOLVED this commit: `src/lib/canon/last-revised.ts`'s `formatCanonRevisedLabel` rendered `MM / YY` (e.g. `05 / 26`) — a slashed numeric that a first-time visitor parses three different ways (May 2026? 5-of-26 revisions? week 5?). Same hardcoded-shape root as the canon-revised stat across `/`, `/shows`, and `/shows/<show>`, all three of which read through this formatter (the home + show pages directly, /shows via `src/components/shows/showsStats.ts`'s `formatRevision` helper). Fix rewrites `formatCanonRevisedLabel` to the editorial "Month YYYY" form (e.g. `May 2026`) using a 12-entry `MONTH_NAMES` array against `getUTCMonth()`, preserves the TZ-stable UTC accessor pattern that pin home (build-time `new Date()`) and show (ISO frontmatter) to the same value, and consolidates `showsStats.formatRevision` to delegate so /shows automatically inherits the same label. §5a: `last-revised.test.ts` 11 tests rewritten for the new shape (single-digit months unpadded; full four-digit year; UTC-midnight boundary stays in-month; ISO-to-label happy path; null branches preserved; default-Date regex updated to `^[A-Z][a-z]+\s\d{4}$`); `showsStats.test.ts` 2 cases updated to assert "April 2026" / "December 2026" / "January 2030" / "May 2026"; `ShowsHero.test.tsx` 4 cases updated to assert "May 2026" / "January 2026" placeholders; `ShowHero.test.tsx` stats-strip case updated to "May 2026"; `HomeHero.test.tsx` CANON_LABEL placeholder bumped to "April 2026". E2E shape regexes updated: `apps/e2e/tests/home.spec.ts` and `apps/e2e/tests/show-home.spec.ts` both flip `^\d{2}\s\/\s\d{2}$` → `^[A-Z][a-z]+\s\d{4}$` so a regression to the slashed numeric fails CI. No new URL, schema field, or page family. Spoiler-safe — formatting only. Verify green: leg1 tokens + typecheck + no-raw-img + 162 unit test files (1729 passed) + 127 script tests + content:check (13 shows/298 seasons/13 canons/12 themes/3 legal docs), leg2 build (374 static pages), leg3 1322 e2e.

- [x] [LOW] [authed] scripts/critique-walk.mjs keeps emitting `net::ERR_ABORTED` findings on Next.js RSC prefetch URLs (`https://tiered.tv/?_rsc=…`) — the in-flight `<Link prefetch>` payload for the header wordmark's `/` route is cancelled by the browser when the walk tears the page context down at the end of capture; not a broken endpoint. Same walk-teardown-artifact class withdrawn in pass-3 (pre-hydration capture, fixed by #125's `settleForHydration`) and pass-4 (these exact rows), now recurring in pass-5; each pass spends self-assessment cycles re-litigating the same artifact. (URL: n/a — tooling, source: critique-pass-5) — issue #139 — RESOLVED this commit: `scripts/critique-walk.mjs`'s `requestfailed` listener pushed every same-origin failure verbatim, including the in-flight `<Link prefetch>` payload that Playwright cancels as `net::ERR_ABORTED` when each page's context closes at the end of the per-URL capture. Fix follows the row's suggestion: a new pure export `isRscPrefetchAbort(url, errorText)` — pathname-exact `/`, `_rsc` query param present, error-text-exact `net::ERR_ABORTED` — is the filter; the `requestfailed` listener drops a matching row before push. The filter is narrowly enough scoped that a genuine `/?_rsc=` 500 (`net::ERR_FAILED` / any non-aborted text) AND any aborted `_rsc=` prefetch on a non-root path (`/shows?_rsc=…` etc.) still surface as findings. 6 new colocated tests in `scripts/__tests__/critique-walk.test.mjs` under the `isRscPrefetchAbort` block — root + ERR_ABORTED matches; non-aborted error text on the same URL still surfaces; aborted prefetch on a non-root path still surfaces; root abort with no `_rsc` query still surfaces; non-URL string returns false; http origins match the same way https does. Verify green: leg1 tokens + typecheck + no-raw-img + unit + 105 script tests (incl. 6 new) + content:check (13 shows/298 seasons/13 canons/12 themes/3 legal docs), leg2 build, leg3 1321 e2e. The companion observation about the `reader` sub-agent's missing Bash permission is left in place above the Done block as a flag for the next /critique or /iterate that touches the reader contract.

- [x] [LOW] [anon] /shows/<show>/season/<slug> VotePair renders "1 NET VOTES" when the net is exactly 1 — the plural "VOTES" doesn't agree with the singular leading "1"; the label is hardcoded `'net votes'` in `src/components/composition/VotePair.tsx:55` (and passed verbatim from `src/app/shows/[show]/season/[slug]/page.tsx:359`), uppercased via CSS, with no count-aware branch. Reproduces on every season page during the long early-stage where most net counts are 0 or 1. Fix: pluralize-aware label — `count === 1 ? 'net vote' : 'net votes'` — or a fixed noun phrase that doesn't fight the count. (URL: /shows/survivor/season/heroes-villains, source: critique-pass-5) — issue #138 — RESOLVED this commit: `src/components/composition/VotePair.tsx` hardcoded `label = 'net votes'` (default) and rendered it verbatim in `.vote-label`, so the unit didn't agree with the displayed count when `Math.round(state.count) === ±1` — every season page in the long early-stage when most net counts are 0 or ±1. Fix follows the critique row's suggestion: VotePair gains a `labelSingular?: string` prop (default `'net vote'`), `label` keeps its `'net votes'` default, and a new `displayLabel = Math.abs(Math.round(state.count)) === 1 ? labelSingular : label` derivation picks the right form per render (handles ±1 symmetrically — a net of `-1` reads "NET VOTE" too). Only the visible `.vote-label` span flips form; the action-describing aria-labels (`Vote on …`, `Vote down …`, `Vote up …`) stay on the plural baseline since they describe the vote action, not the result count (which the count cell already announces). §5a: 7 new colocated unit tests in `VotePair.test.tsx` under a new `pluralize-aware label` describe — count 0 → "net votes"; count 1 → "net vote"; count -1 → "net vote"; count 2 → "net votes"; custom `label`/`labelSingular` props honored; singular→plural flip on a retract round-trip (1 → click → 0); aria-labels remain on the plural form regardless of count. No source change to the season page (default props match the prior call site verbatim), no new URL, schema field, helper module, or page family. Spoiler-safe — visible unit label only. Verify green: leg1 tokens + typecheck + no-raw-img + 149 unit test files (incl. 7 new VotePair) + 99 script tests + content:check (13 shows/298 seasons/13 canons/12 themes/3 legal docs), leg2 build, leg3 1321 e2e.

- [x] [MED] [anon] /themes hero lede claims "Some span every show" but the page's own stat block reads "10 SHOWS COVERED" (of 13 tracked) and no themed list spans more than six shows — the hero overclaims coverage against its own numbers (URL: /themes, source: critique-pass-4) — issue #133 — RESOLVED this commit: `ListsHero`'s `isCrossCanon` branch hardcoded the lede sentence "Some span every show." — verbatim design-placeholder copy from `design/tiered.tv · Lists.html:170`. No themed list spans more than six of the 13 tracked shows, and the page's own `lists-stat-shows` cell renders the real `stats.showsCovered` directly below, so the hero overclaimed against its own numbers. Reworded "Some span every show." → "Some span the catalog." — honest (drawn from across the catalog, not covering every entry of it) and preserving the rhetorical parallel with the next sentence "Some live inside one." (which pairs with `category: single` lists). Same coverage-aware-copy precedent as #98 / #129 / #130. §5a: `ListsHero.test.tsx` cross-canon case updated to assert the new phrase AND that no "span every show" copy survives; single-canon case updated to mirror; `apps/e2e/tests/themes.spec.ts` hero test gains a `.lists-hero-lede` assertion that the lede never contains "every show" — a regression to the overclaim fails CI. No new URL, schema field, helper, or page family. Spoiler-safe — hero copy only.

- [x] [LOW] [anon] /shows hero lede describes a three-tier system — "The B tier we're still working through — every season reviewed before it lands" — but no show currently sits in B tier, so the page renders only S + A sections and the lede's B-tier sentence has no on-page referent (URL: /shows, source: critique-pass-3) — issue #130 — RESOLVED this commit: `ShowsHero` hardcoded all three tier sentences in one `<p>`, but the /shows page renders one `<TierSection>` per tier and `TierSection` returns `null` for an empty tier — today all 13 shows are tier S (2) or A (11), 0 in B, so the B section never renders while the lede still described it. Fix mirrors the coverage-aware-copy precedent from #98 (`ListsHero`) and #129 (`HomeListsStack`): a new pure helper `src/components/shows/tierLede.ts` — `tierLedeSentences(populatedTiers)` — holds one sentence per tier in a `Record<ShowTier,string>` and returns, in canonical `TIER_ORDER`, only the sentences for tiers that actually hold a show. `ShowsHero` gains a required `tiers: readonly ShowTier[]` prop, renders `tierLedeSentences(tiers).join(' ')` after the fixed "how settled the ranking is" lead-in, and exposes a `data-tier-coverage` attribute (`SA` today, `SAB` once a show lands in B) on the lede `<p>` as a durable e2e hook. The /shows page derives `populatedTiers = TIER_ORDER.filter((t) => showsForTier(grouped, t).length > 0)` and passes it — today that resolves to `S + A` so the lede stops describing the empty B tier, and the B sentence returns automatically the moment a show is tiered B. §5a: 6 colocated unit tests in `tierLede.test.ts` (empty set, single tier, B-withheld at SA, input-order independence, all-three, dedupe); `ShowsHero.test.tsx` threads the `tiers` prop through its 3 existing cases + 2 new cases (B omitted at SA, B present + `data-tier-coverage=SAB`); `shows-index.spec.ts` gains a data-derived test asserting `data-tier-coverage` equals the rendered `tier-section` set and each "X tier" sentence appears iff that tier is in coverage — a regression to a hardcoded sentence fails CI; `page-reads.ts` adds the `shows-hero-lede` testid to `/shows` `expectVisible`. No new URL, schema field, or page family. Spoiler-safe — hero copy only.

- [x] [LOW] [anon] /themes "All lists" section group headers read "BY TONE · 7" + "BY CRAFT · 4" = 11, which doesn't reconcile to the "12 LISTS" stat — the era group is empty (0) and the single-show group (survivor-pillars, 1) surfaces no count (URL: /themes, source: critique-pass-3) — RESOLVED this commit: does not reproduce. Verified the `/themes` "All lists" section against code + data at the pass-3 commit (6a0dea4). `ListsAllSection` renders one `.list-group` per category where `byCategory[cat].length > 0`, each headed `GROUP_HEAD_LABELS[cat] · {count}`. The 12 themed lists distribute as tone 7, craft 4, era 0, single 1 — and `survivor-pillars` already carried `category: single` at 6a0dea4 (`git show 6a0dea4:content/themes/survivor-pillars.md` confirms), so `getThemesByCategory().single` is non-empty and the single group DOES render, headed "Single-show tiers · 1". Three group headers render — "By tone · 7", "By craft · 4", "Single-show tiers · 1" — summing to exactly 12, reconciling to the "12 LISTS" stat; the empty era group is correctly absent (`TierSection`-style `length > 0` filter). The pass-3 observer's "= 11" omitted the single group — its header doesn't start with "By", so it didn't pattern-match the two "By X · N" headers. No code change: the reconciliation invariant already holds and is already locked by `ListsAllSection.test.tsx`. Spoiler-safe — count audit only.

- [x] [MED] [anon] / (home) "Themed lists, cross-canon." stack heading overpromises against an all-Survivor list catalog — the home surface CRITIQUE pass-1 #98 explicitly deferred to "the next pass" (URL: /, source: critique-pass-2) — issue #129 — RESOLVED this commit: `src/components/home/HomeListsStack.tsx` hardcoded its section heading as `Themed lists, <em>cross-canon.</em>` — a literal string decoupled from the themed-list catalog's actual show coverage. Critique #98 had already made the `/themes` `ListsHero` accent coverage-aware (derived from `getThemeStats().showsCovered`) but explicitly deferred this home surface — the same hardcoded-copy-vs-data root cause — to a later pass. Fix mirrors the shipped `ListsHero` pattern exactly: `HomeListsStack` gains a required `showsCovered: number` prop, derives `isCrossCanon = showsCovered > 1` (the identical threshold `ListsHero` uses), and renders `cross-canon.` or `inside one canon.` in the `<em>` accent — plus a `data-coverage` attribute on the section for parity with the `lists-hero` element. The home page (`src/app/(default)/page.tsx`) passes `getThemeStats().showsCovered`. Today that resolves to 10 shows covered, so the heading still reads "cross-canon." — accurate now that phase 41 drained the cross-canon themed-list catalog — but the copy can no longer silently drift from the data the way the `ListsHero` accent could before #98. §5a: `HomeListsStack.test.tsx` 2→4 tests (the existing two updated for the new required prop; new cross-canon and single-canon cases assert the `<em>` accent text + the `data-coverage` attribute); `apps/e2e/tests/home.spec.ts` gains a data-derived assertion — reads `data-coverage` off `home-list-section` and asserts the `<em>` accent text matches it (so a regression to a hardcoded accent fails CI). No new URL, schema field, helper module, or page family. Verify green: leg1 tokens + typecheck + no-raw-img + 142 unit test files + 99 script tests + content:check (13 shows/298 seasons/13 canons/12 themes/3 legal docs), leg2 build, leg3 1320 e2e. Spoiler-safe — home-page heading copy only.

- [x] [MED] [anon] / (home) show-count copy doesn't reconcile — "13 shows tracked" but only 9 tiles surface (3 featured + a "+ 6 more in the index" sub-row), leaving 4 shows unreachable from home (URL: /, source: critique-pass-2) — issue #128 — RESOLVED this commit: `src/app/(default)/page.tsx` sliced `getAllShows()` to a fixed `FEATURED_TILES = 3` + `COMPACT_TILES = 6` = 9 tiles while the catalog had grown to 13 shows, so the `HomeShowGrid` headline "13 shows tracked" over-counted the 9 visible tiles and 4 shows were stranded off the home page entirely. The design source `design/tiered.tv · Home.html` had a 9-show mockup where the compact grid was annotated "compact tile (the rest of the canon)" and the headline ("Nine shows tracked") equalled the visible tiles — that reconciliation invariant broke silently once the catalog outgrew 9. Fix: a new pure helper `src/lib/home/show-partition.ts` — `partitionHomeShows(shows)` returns `{ featured: the first HOME_FEATURED_TILES, compact: the entire remainder }` with no cap, so `featured.length + compact.length` always equals the catalog size. The home page consumes it and `COMPACT_TILES` is deleted; now 3 featured + 10 compact = 13, the headline is honest, every show is reachable from home, and the `HomeMoreShows` "+ N more in the index" label (derived from the compact count, now 10) reconciles too. §5a: 6 colocated unit tests in `src/lib/home/__tests__/show-partition.test.ts` (featured slice, uncapped compact remainder, the no-show-stranded coverage invariant, exact/under featured-count edges, input non-mutation); e2e `apps/e2e/tests/home.spec.ts` drops the stale `≤ 6` compact-tile cap and gains a reconciliation test asserting the "N shows tracked" headline equals featured + compact tile counts and the sub-row label number equals the compact tiles rendered. No URL, schema, or page-family change. Spoiler-safe — layout + count copy only.

- [x] [LOW] [anon] /themes "Finales that stuck the landing" description ends "six shows, six landings" but the list carries 7 entries (the card shows "7 ENTRIES") — "six shows" is correct (6 distinct shows) yet "six landings" undercounts; reword to seven or recount, and audit sibling lists (e.g. best-comeback-seasons) for the same prose/count drift (URL: /themes/best-finales, source: critique-pass-3) — issue #127 — RESOLVED this commit: `content/themes/best-finales.md` carries 7 entries across 6 distinct shows (Survivor twice; amazing-race / big-brother / dragrace / top-chef / traitors once each). Its `description` closed "…nothing gets handed over for free — six shows, six landings." — "six shows" was right, "six landings" undercounted the 7 entries; `content-curator` corrected it to "six shows, seven landings" so the rhetorical parallel still lands as a closer. The `tagline`'s "across six different franchises" was already correct (6 shows) and left untouched. Sibling-audit (the finding's explicit second half): swept all 12 `content/themes/*.md` for the same prose/count drift class — one sibling drifted, `best-non-winning-runs` (7 entries across 6 distinct shows: Survivor twice; big-brother / dragrace / project-runway / the-challenge / top-chef once each), which said "Across five franchises" in BOTH its `tagline` and `description`; both corrected to "six franchises". The other 10 lists reconcile (e.g. best-comeback-seasons 6 entries/5 shows "five franchises" ✓, best-premieres 7/6 "six franchises" ✓, best-newbie-casts 7/6 "six franchises" ✓). A content-value correction — frontmatter prose only, no new schema field, helper, component, URL, or page family, so §5a adds no test surface; `pnpm content:check` validates the frontmatter and a repo-wide grep confirmed no unit test or e2e fixture references the changed strings (the stat-strip "N ENTRIES" / "N SHOWS COVERED" counts are derived from `entries`, already correct — only the hand-written prose drifted). Spoiler-safe — craft/tone framing only, no winner / elimination / outcome.

- [x] [LOW] [anon] /shows/survivor/season/heroes-villains body reads "The tiered season the franchise measures itself against" — "tiered" as an adjective garbles the sentence and collides with the brand name (URL: /shows/survivor/season/heroes-villains, source: critique-pass-2) — issue #126 — RESOLVED this commit: the closing fragment of the body in `content/shows/survivor/seasons/20-heroes-villains.md` read "…cast a long shadow over every all-returnee run since. The tiered season the franchise measures itself against." — "tiered" sat in an adjective slot but does not parse as one, and a bare lowercase "tiered" collides with the `tiered.tv` wordmark on the franchise's gold-standard reference season page. Dropped the stray word: "The tiered season the franchise measures itself against." → "The season the franchise measures itself against." — still a punchy benchmark-claim fragment closing the paragraph, now grammatical and brand-collision-free. A content-value correction (same shape as the #124 FILMED-caption fix) — no new schema field, helper, component, URL, or page family, so §5a adds no test surface; `pnpm content:check` validates the frontmatter and a repo-wide grep confirmed no unit test or e2e fixture referenced the changed prose. Spoiler-safe — editorial framing only, no winner / elimination / outcome.

- [x] [MED] [authed] scripts/critique-walk.mjs captures page innerText immediately after the `load` event, before client auth islands hydrate — the authed pass-2 walk produced two false-positive HIGH auth-state findings; the walk should settle for network-idle / island hydration before capture (URL: n/a, source: critique-pass-2) — issue #125 — RESOLVED this commit: `walk()` navigated with `page.goto(target, { waitUntil: 'load' })` and captured `document.body.innerText` immediately — before the header auth-state island (`HeaderView`) had run its mount `useEffect`, which fetches `GET /api/auth/me` and only then re-renders the chrome between signed-out and signed-in. So the authed walk read the pre-hydration SSR DOM ("Sign in"), filing false-positive HIGH auth-state findings (two withdrawn in pass 2; a third authed observation — the season comment composer reading "Sign in to comment" against a `@e2e / Sign out` header — withdrawn in pass 3 precisely because it was indistinguishable from this artifact). Fix: two new exported helpers + a per-page settle. Before navigation the walk arms `page.waitForResponse` for the `/api/auth/me` request (pre-`.catch()`'d so a timeout can't surface as an unhandled rejection while `goto` is still in flight); after the `load`-event `goto` it calls `settleForHydration`, which awaits that response (pinning the one request whose result changes the chrome) then `page.waitForLoadState('networkidle', { timeout: SETTLE_TIMEOUT })` so the island re-render — and any other island, e.g. the season comment composer — has flushed. Both waits are best-effort: a `networkidle` timeout and an auth-fetch rejection are both swallowed, so a slow page or a chatty third-party beacon delays the capture, never fails it. New `SETTLE_TIMEOUT` (8000ms, exported, `--settle-timeout` override) bounds the worst case under the 20s nav timeout. New pure export `isAuthMeRequest(url)` — pathname-exact `/api/auth/me` match, origin/query agnostic, no throw on a non-URL — is the `waitForResponse` predicate. §5a: 7 new colocated tests in `scripts/__tests__/critique-walk.test.mjs` — `SETTLE_TIMEOUT` shape, `isAuthMeRequest` (matches with/without query + cross-origin, rejects sibling endpoints + sub-paths, non-URL → false no throw), `settleForHydration` (awaits auth then networkidle in that order, swallows a networkidle timeout, swallows an auth-response rejection and still runs the idle wait, handles the pre-caught null shape). No new URL or page family — a change to the critique tooling, not the product — so no e2e fixture row. Verify green: leg1 tokens + typecheck + no-raw-img + unit + 99 script tests + content:check (13 shows/298 seasons/13 canons/12 themes/3 legal docs), leg2 build, leg3 1319 e2e.

- [x] [MED] [anon] /shows/survivor/season/heroes-villains FILMED stat sub-line reads "same beach as S19, S18" — factually wrong: S19 (Samoa) was shot at Upolu but S18 (Tocantins) was filmed in Brazil, not the HvV beach; `filming_caption` in content/shows/survivor/seasons/20-heroes-villains.md should drop the S18 reference (URL: /shows/survivor/season/heroes-villains, source: critique-pass-3) — issue #124 — RESOLVED this commit: Heroes vs. Villains (Survivor S20) was filmed at Upolu, Samoa; Survivor: Samoa (S19) shared that beach — S19 and S20 filmed back-to-back in the same location — but Survivor: Tocantins (S18) was filmed in Tocantins state, Brazil, not the HvV beach. `filming_caption` in `content/shows/survivor/seasons/20-heroes-villains.md` dropped the S18 reference: `"same beach as S19, S18"` → `"same beach as S19"`. A content-value correction — no new schema field, helper, component, URL, or page family, so §5a adds no test surface; `pnpm content:check` validates the frontmatter and the existing `src/components/composition/__tests__/SeasonStatsStrip.test.tsx` fixture already carried the corrected `caption: 'same beach as S19'` form, so no test drifted. Spoiler-safe — filming location is explicitly fair game per agents.md §7.

- [x] [MED] [anon] / (home) emits no `<link rel="canonical">` — every other route sets one via buildMetadata; the home page defines no generateMetadata at all (URL: /, source: critique-pass-2) — issue #123 — RESOLVED this commit: `src/app/(default)/page.tsx` exported no metadata at all — it inherited the root layout's `title`/`description` but emitted no `<link rel="canonical">`, leaving `/` the only route on the site without a self-referential canonical. Added a `generateMetadata` mirroring every other route's pattern: it spreads `buildMetadata({ title, description, path: '/' })` — which supplies `alternates.canonical = https://tiered.tv/`, the OpenGraph + Twitter tags the home page previously lacked entirely, and re-emits the global RSS discovery link so overriding `alternates` doesn't drop it (the trap the `seo.ts` comment warns about) — then pins `title` to `{ absolute: 'tiered.tv — the seasons, ranked. no spoilers.' }` so the root `%s — tiered.tv` template doesn't double-suffix the brand line. Visible `<title>` and `<meta name=description>` are unchanged: the absolute title equals the layout's prior `default`, and the description is byte-identical. Two durable locks: a new colocated `src/app/(default)/__tests__/page.test.tsx` (5 cases — default export, `generateMetadata` exported, canonical is `https://tiered.tv/`, title pinned absolute, RSS feed survives the `alternates` override); and a reusable `expectCanonical?: RegExp` field threaded through `apps/e2e/src/fixtures/page-reads.ts` `PageReadAssertion` + the `apps/e2e/tests/smoke.spec.ts` runner (asserts exactly one `<link rel=canonical>` with a matching href) — `/` takes the first row, same harness-extension pattern as `expectTitlePattern` from issue #103.

- [x] [HIGH] [anon] /u/[handle] public profile renders the member's account email as the display name — any anonymous visitor sees a real user's email address (URL: /u/e2e, source: critique-pass-2) — issue #122 — RESOLVED this commit: `users.display_name` is sourced from the Auth0 profile's `name` claim, and for an email magic-link / passwordless sign-in Auth0 populates `name` with the member's email address. The `/u/[handle]` page passed that value straight into `<ProfileHeader displayName>` (a public `<p>` byline, testid `profile-display-name`) and into the `ProfilePage` JSON-LD `mainEntity.name` — so any anonymous visitor saw a real email. Fixed at the public read boundary: a new pure helper `publicDisplayName(value)` in `src/lib/profile/context.ts` drops any value containing `@` (a genuine human display name never carries one) — email-shaped PII is treated as not-a-display-name and the page falls back to `@handle`, which is public by design. Applied once in `loadProfile` (`src/app/(default)/u/[handle]/page.tsx`) where `ProfileActivity → ProfileView` is shaped, so it covers both the visible byline and the JSON-LD in a single chokepoint, and protects rows already polluted in the DB as well as future ones. Six colocated tests added to `src/lib/profile/__tests__/context.test.ts` (keeps a real name, drops an email, drops any `@`-bearing value, null/empty/whitespace → null, trims a kept name). No schema or migration — the `email` column is unchanged; this fixes only the public *render*. Verify green: leg1 tokens + typecheck + no-raw-img + 140 unit test files (context.test.ts 14→20) + 91 script tests + content:check (13 shows/298 seasons/13 canons/12 themes/3 legal docs), leg2 build, leg3 1319 e2e.

- [x] [LOW] [anon] / vs /shows/survivor — canon-revised date rendered two different ways (URL: /, /shows/survivor, source: critique-pass-1) — issue #104 — RESOLVED this commit: home rendered the canon-revised stat as `MM / YY` keyed "Canon revised" (via `formatCanonRevisedLabel` in `src/lib/home/canon-revised.ts`), the show page rendered the same datum as a bare year keyed "Canon last revised" (via a local `canonRevisedYear` helper in `src/app/shows/[show]/page.tsx`) — both granularity AND label diverged on the common home → show navigation path. Unified through a single shared formatter at `src/lib/canon/last-revised.ts` (the directory matches the data layer — both surfaces consume from this one source). Three exports: `formatCanonRevisedLabel(date: Date)` returns `MM / YY` using UTC accessors (TZ-independent so the home's build-time `now` and the show page's frontmatter ISO render identically regardless of where the build runs), `canonRevisedLabelFromIso(iso?)` for the show page (string | null — returns null on missing/unparseable, preserving the "drop the stat rather than render NaN" behavior), and `getCanonRevisedLabel(now?)` the home's prior entry point. Show page: removed the local `canonRevisedYear` helper, label flipped `Canon last revised` → `Canon revised`, value flipped `2026` → `05 / 26`. Old `src/lib/home/canon-revised.ts` + its colocated test deleted; the `home/` subdirectory only ever held this one file. Two durable locks: a new `src/lib/canon/__tests__/last-revised.test.ts` covering all three exports + the UTC day-boundary edge that a local-TZ implementation would silently get wrong (Jan 1 UTC → "01 / 26", not "12 / 25" west of UTC); and `apps/e2e/tests/show-home.spec.ts` now asserts `getByTestId('show-hero-stats')` contains both "Canon revised" and an `MM / YY` shape (mirrors the parallel assertion in `home.spec.ts`, so a regression to the bare-year format fails CI on every one of the 13 show pages). `ShowHero.test.tsx` fixture data updated to mirror the new prod shape.

- [x] [LOW] [anon] /themes — document title says "Themes", every user-facing surface says "Lists" (URL: /themes, source: critique-pass-1) — issue #103 — RESOLVED this commit: the `/themes` route was the only surface still using the word "Themes" — the H1 reads "Themed lists.", the nav link reads "Lists", the breadcrumb reads "TIERED.TV / LISTS", and the list-detail crumb reads "LISTS". `src/app/(default)/themes/page.tsx` `generateMetadata().title` changed from `'Themes'` to `'Lists'` (renders `<title>Lists — tiered.tv</title>` through the root layout's `%s — tiered.tv` template), and the matching `CollectionPage` JSON-LD `name` changed from `'Themes — tiered'` to `'Lists — tiered'` so the structured data agrees with the visible label. Route slug `/themes` left intact (no redirect; this was a vocabulary fix, not a URL change). Durable lock added on two layers: a colocated `src/app/(default)/themes/__tests__/page.test.tsx` (3 cases — default-export + generateMetadata export shape + `meta.title === 'Lists'`) so the unit gate catches a regression before the e2e even runs; and a new `expectTitlePattern?: RegExp` field threaded through `apps/e2e/src/fixtures/page-reads.ts` `PageReadAssertion` + the `apps/e2e/tests/smoke.spec.ts` runner so the per-URL smoke loop now asserts the document title on any route that wants to pin it, with `/themes` taking the first row (`expectTitlePattern: /^Lists\b/`). No other URL needs the title field today; the harness is in place for future critique title gaps without further runner edits. Verify green (leg1 tokens + typecheck + no-raw-img + unit incl. 3 new themes-page + 66 script tests + content:check 13 shows/297 seasons/13 canons/12 themes/3 legal docs, leg2 build 297 SSG season slugs, leg3 1316 e2e). Only the LOW canon-revised-date format finding remains in CRITIQUE Pending; that needs a small shared formatter and is the cheapest next drain.

- [x] [MED] [anon] /shows/<show>/season/<show>-<n> form 404s while the digit form 308-redirects (URL: /shows/survivor/season/survivor-20, source: critique-pass-1) — issue #102 — RESOLVED this commit: same precedent as the digit-form back-compat in #67 (the season page-level resolver `permanentRedirect`s a constructed canonical-key form to the canonical slug). Extended `src/app/shows/[show]/season/[slug]/page.tsx` so that when the literal slug doesn't resolve to a real season, the resolver also tries the show-prefixed numeric form (`<show.slug>-<n>`) — strips the `<show.slug>-` prefix, parses the remaining digits, looks up by season number, and 308s to the canonical slug. The lookup is ordered after `getSeasonBySlug` so canonical slugs that legitimately end in `-<n>` (Survivor seasons 42–49, whose slugs ARE `survivor-42`…`survivor-49`) keep serving directly with no redirect hop. Extended `apps/e2e/src/fixtures/redirect-fixtures.ts` `buildSeasonRedirects()` to emit a second row per show for the show-prefixed form (skipping the row when `<show>-<n>` already equals the canonical slug for that season — i.e. when there's nothing to redirect), so `apps/e2e/tests/redirects.spec.ts` now CI-enforces the new contract across all 13 shows with the same 308 + `Location` + landed-page `rel=canonical` discipline. 13 new e2e tests (1303 → 1316), one per show: amazing-race-1 → season-1, bachelor-1 → alex-michel, bachelorette-1 → trista-rehn, bake-off-1 → the-pilot, big-brother-1 → the-pilot, dragrace-1 → season-1, love-island-uk-1 → summer-2015, love-island-us-1 → fiji-2019, project-runway-1 → new-york-2004, survivor-1 → borneo, the-challenge-1 → road-rules-all-stars, top-chef-1 → san-francisco, traitors-1 → ardross-2023. The two remaining pending critique rows (LOW `/themes` title vs nav, LOW canon-revised date format) score below the next iterate tick's likely-cheapest gap; left in place for the next tick to drain. Verify green (leg1 tokens + typecheck + no-raw-img + unit + 66 script tests + content:check 13 shows/297 seasons/13 canons/12 themes/3 legal docs, leg2 build 297 SSG season slugs, leg3 1316 e2e). GitHub #102 closed by this commit.

- [x] [MED] [anon] /themes/best-premieres vs /shows/survivor — Survivor 41 named "New Era I" in canon, "S41 · REBOOT" on the list (URL: /themes/best-premieres, /shows/survivor, source: critique-pass-1) — issue #101 — RESOLVED this commit: same root-cause class as the S16 canon-heading mismatch in #66 (themed-list entry names were authored free-hand rather than sourced from the canonical season title). Repo-wide audit of `content/themes/*.md` `season_label` found two divergent seasons — S41 (canonical title "New Era I", labeled "Reboot" across `best-premieres`, `best-comeback-seasons`, `best-newbie-casts`, `firsts`, `survivor-pillars` — 5 occurrences) and S45 (canonical title "Mom I Won", labeled "Survivor 45" across `best-finales`, `best-newbie-casts`, `best-non-winning-runs`, `best-post-merge`, `best-reunion-specials`, `survivor-pillars` — 6 occurrences). Aligned every divergent label to the canonical title; the season's editorial framing ("the reboot", "the new normal") stays in the entry blurb where it belongs, only the label itself was retuned. Durable guard added: a new `collectThemeFailures()` invariant in `scripts/content-check.ts` — when `season_label` carries a ` · `-delimited name suffix, the suffix must equal the season's frontmatter `title`. Lax-mode failure, same shape as the canon-heading rule from #66. Labels with no separator (e.g. a bare "S41") and entries with no `season_label` at all stay legal. Colocated tests cover the failure case, the passing case, the no-separator and no-label tolerances, a multi-word season title (`Heroes vs. Villains`), and the referential-error preservation (unknown-show still surfaces).

- [x] [MED] [anon] /themes, /themes/[theme] — "cross-canon" copy overpromises against an all-Survivor catalog (URL: /themes, /themes/[theme], source: critique-pass-1) — issue #98 — RESOLVED this commit: `ListsHero` and `AdjacentLists` are now coverage-aware. `ListsHero` derives both the H1 accent and the lede from `stats.showsCovered`: when ≥2 shows are covered it keeps the current "Cross-canon." accent + "Some span every show. Some live inside one." lede; when exactly 1 show is covered (today's reality at 12 lists / 1 show) it switches to "Inside one canon." + "Every list lives inside one canon today — cross-canon entries arrive as more catalogues fill in." `AdjacentLists.tagFor` now checks the *other* theme's actual show-coverage on the cross-category branch: when the other list spans only one show, the qualifier drops from "cross-canon list" to "<category> list" (e.g. "↩ single-show list" / "single-show list ↪"); the genuine cross-canon-list label survives only when the other list truly spans ≥2 shows. New `data-coverage` attribute on the hero (`cross-canon|single-canon`) and two new locks: a single-canon `ListsHero` test asserts the accent + lede swap, and a cross-category `AdjacentLists` test asserts the "cross-canon" label survives only on a multi-show fixture. Surfaces touched: `/themes` index + every `/themes/[theme]` detail with related lists. Spoiler discipline unaffected; voice now matches the live catalog. Home stack heading ("Themed lists, cross-canon.") is the same root cause but a separate surface — filed as a follow-up critique observation on the next pass.

- [x] [needs-user-call] reader-driven critique was not auth-isolatable in either direction — RESOLVED 2026-05-19 (oversight): pass 1 proved the `reader` sub-agent drives the operator's real, shared Chrome profile and had no cookie primitive, so its "anon" walk inherited the operator's live session (false HIGH filed + withdrawn) and its authed walk could not run. **Fix applied (user-approved, option 1):** `.claude/agents/reader.md` now carries `mcp__claude-in-chrome__javascript_tool` and a mandatory Step 0 that *deterministically* clears cookies + verifies `/api/auth/me → signedIn:false` for the anon pass and sets `__session` + verifies `signedIn:true` for the authed pass, exiting `auth-failed` rather than walking a contaminated profile. `plan/bearings.md` "Working harness contract" rewritten — reliability is now structural (verify-or-exit gate), not incidental profile luck. **Separate open question** (raised by user 2026-05-19, not a blocker for the above): whether `/critique` should also run in GitHub Actions, not just local — see the oversight summary; that needs a headless-browser reader path and is a phase-candidate decision, tracked outside this row.

- [x] [LOW] [anon] /shows/survivor/season/47 silently resolves to /shows/survivor/season/survivor-47 — two URL forms reachable; confirm a 301 + matching rel=canonical and keep e2e canonical-urls in sync (URL: /shows/survivor/season/47, source: debug 2026-05-16) — 978ac48 — issue #67 — RESOLVED this commit: behavior was already correct (the page-level resolver 308s the digit form via `permanentRedirect`, and `buildMetadata` sets `alternates.canonical` on the slug page) but unenforced. Hardened `apps/e2e/tests/redirects.spec.ts`: a non-following request now asserts the intermediate status is exactly **308** (a regression to a temporary 302/307 would otherwise pass the follow-the-chain check) with a `Location` matching the canonical slug path, and the landed slug page is asserted to emit a single `<link rel="canonical">` whose pathname is the slug form. Redirect fixtures already derive from `canonical-urls.ts`, so the two stay in sync by construction. The digit→slug de-dup contract is now CI-enforced across every season URL rather than true-by-inspection.

- [x] [LOW] [anon] Survivor S16 titled "Micronesia" in the Editor's Canon view but "Micronesia: Fans vs. Favorites" in the community ranking table — use one canonical season display name for both (URL: /shows/survivor?view=community, source: debug 2026-05-16) — 978ac48 — issue #66 — RESOLVED this commit: the canon pane renders the `## NN.` heading, the community pane renders the season frontmatter title; `content/shows/survivor/canon.md` heading 16 was `## 16. Micronesia` and dropped the season's subtitle. Aligned it to the authoritative season title (`Micronesia: Fans vs. Favorites`) so both panes name the season identically. Durable guard added: a `content-check` invariant (lax mode) fails when a canon heading is a clean prefix of the season title that drops a separator-led subtitle — editorial headings that *rename* or *add* a disambiguating suffix (e.g. "Brad Womack (first run)") stay legal. Colocated tests cover all three cases.
- [x] [needs-user-call] critique anon pass cannot run clean (persistent tiered.tv login in the Chrome profile). (source: debug 2026-05-16) — 978ac48 — RESOLVED 2026-05-17 (oversight): does not reproduce. A fresh `tabs_create_mcp` group has no tiered.tv cookies; `https://tiered.tv/` renders "Sign in", `document.cookie` empty, `/api/auth/me` → `signedIn:false`. The anon walk is genuinely logged-out; no incognito profile needed. Stale-profile artifact, not a structural block.
- [x] [needs-user-call] critique authed pass cannot run at all (no cookie-injection path; httpOnly `__session` unattachable). (source: debug 2026-05-16) — 978ac48 — RESOLVED 2026-05-17 (oversight): the httpOnly reasoning was wrong for a clean profile. With no pre-existing `__session`, `document.cookie="__session="+CRITIQUE_SESSION_COOKIE` is accepted by the server: `/api/auth/me` → `signedIn:true, handle:"e2e"`, chrome shows `@e2e / Sign out` after reload. Verified live. Harness contract recorded in `plan/bearings.md` → Working harness contract.
- [x] [MED] [anon] Canon prose ordinals are off-by-one vs the displayed slot numeral — slot 12 "Marquesas" reads "places it eleventh", slot 14 "The Australian Outback" reads "twelfth", slot 15 "China" reads "thirteenth" (URL: /shows/survivor, source: debug 2026-05-16) — 978ac48 — issue #63 — RESOLVED 7ef5bce: full sweep of `content/shows/survivor/canon.md` — ~30 of 47 entries had a placement ordinal frozen at an older ranking; every one rebased to its slot position (only the ordinal word changed, no voice change, no reorder). Durable guard added: pure `src/lib/canon/placement-ordinal.ts` extractor + a `content-check` invariant (lax mode) so prose-ordinal-vs-slot drift now fails the verify gate permanently. Caught two latent ones in other shows during the sweep; both were extractor false-positives on a two-sentence placement pattern, fixed before commit.
- [x] [MED] [anon] Bachelorette home card says "21 seasons. She holds the roses now." while its own meta line on the same card reads "20 seasons · canon + community" — derive both from one `seasons` field (URL: /, source: debug 2026-05-16) — issue #61 — RESOLVED this commit: `ShowTile` meta now derives from the authoritative `show.seasons` field instead of `getAllSeasons(slug).length` (seeded-file count that lagged the editorial number during content drains). `seasonCount` prop removed so no caller can reintroduce the divergence; regression test added in `ShowTile.test.tsx`.

- [x] [MED] [anon] /about closing paragraph tells the reader `Read Privacy for the data details and Terms for the rules.` (`content/legal/about.md:83`) — the legal pages exist at `/privacy` (`content/legal/privacy.md`) and `/terms` (`content/legal/terms.md`) and the inline links in that prose work, but the global footer's `tiered.tv` column (`src/components/chrome/footer/FooterAboutCol.tsx:3-8` — `About the canon` / `How voting works` / `Spoilers policy` / `Become an editor`) carries no Privacy or Terms link. The FooterMeta line below (`src/components/chrome/footer/FooterMeta.tsx`) only renders `© <year> tiered.tv · est. as a quiet rebellion against ranked lists that ruin the show` + the theme toggle — no legal links surface there either. A reader who leaves /about and tries to reach Privacy or Terms from any other surface has to navigate back to /about and re-find the closing-paragraph prose links. The standard chrome destination where readers conventionally expect these (the site footer) is missing them; only an /about-prose-deep-reader path reaches them. Same defect class as the resolved pass-37 #344 / pass-29 #299 navigation-affordance-mismatch family (chrome surfaces that under-surface the destinations the editorial prose already commits to), now at the legal-footer rather than the season-page or comment-thread layer. Bearings voice cue (`plan/bearings.md:370`) — `knowledgeable peer — plain sentences over clever ones`; a peer who tells you `Read Privacy for the data details` from one page also makes Privacy reachable from the chrome on every page, not just the page that names it. Fix options: (a) **primary path — add Privacy + Terms links to the FooterAboutCol `LINKS` array** at `src/components/chrome/footer/FooterAboutCol.tsx:3-8`. Two new entries: `{ href: '/privacy', label: 'Privacy' }` + `{ href: '/terms', label: 'Terms' }` appended after the existing four. Single-line array additions, both targets already render (the /privacy + /terms routes are real legal pages — verified via `content/legal/privacy.md` + `content/legal/terms.md` existing in the repo). Brings the global chrome into agreement with the /about prose's commitment. (b) **alternative — add a dedicated `FooterMeta` legal-links row** between the rebellion line and the theme toggle — preserves the chrome semantics that the tiered.tv column is editorial nav while a separate row carries legal nav. Slightly more chrome real-estate but reads as the conventional footer pattern. (c) **alternative — drop the /about prose reference** to Privacy + Terms instead — rejected; the legal pages exist for a reason and silencing them on the only surface that names them would shed reader-facing accountability. (d) **alternative — leave as-is** — rejected; the destination commitment is on the page, the destination is reachable, the chrome convention is the gap. Recommended (a) — single-component edit, brings the chrome into agreement with the /about prose with the smallest blast radius, matches the existing `tiered.tv` column semantics (it already carries About, How voting works, Spoilers policy, Become an editor — all of which are quasi-policy / quasi-editorial chrome nav; Privacy + Terms slot in cleanly). Pin: extend `src/components/chrome/footer/__tests__/FooterAboutCol.test.tsx` (verify path — create if absent) with two regression cases — (1) `/privacy` link rendered with label `Privacy`; (2) `/terms` link rendered with label `Terms`. Sibling positive on `Footer.test.tsx` asserting the column count remains 3 (Brand / Tiers / About) and the About column houses both legal links. Bidirectional drift guard: a future refactor that drops either legal link trips at unit time. Spoiler discipline P0 intact (chrome nav additions only; the legal pages themselves carry no per-season verdict, canon position, or finale beat exposure). (URL: /about, source: critique-pass-39) — 9c486a9 — issue: #344 — RESOLVED e8e0f26: took the row's primary path (a). `src/components/chrome/footer/FooterAboutCol.tsx` LINKS array gained two entries appended after the existing four: `{ href: '/privacy', label: 'Privacy' }` and `{ href: '/terms', label: 'Terms' }`. Both routes already render real markdown content via `src/app/(default)/{privacy,terms}/page.tsx` from `content/legal/{privacy,terms}.md`, so the chrome additions reach destinations that already 200 + carry the prose the /about closing paragraph names. Pinned per the row's prescription: `src/components/chrome/footer/__tests__/FooterAboutCol.test.tsx` updated to a 6-link contract (count, ordered hrefs, ordered labels, href↔label pairings, list/li structure) + two explicit regression cases (`/privacy` rendered with label `Privacy`; `/terms` rendered with label `Terms`) + a structural positive asserting the four about-deep links remain followed by the two legal links in order (bidirectional drift guard: dropping either legal link, or reshuffling about-deep vs legal ordering, trips at unit time). Sibling positive on `src/components/chrome/__tests__/Footer.test.tsx` asserting the about-col houses /privacy and /terms on every page render. Spoiler discipline P0 intact (chrome nav additions only; the legal pages themselves carry no per-season verdict, canon position, or finale-beat exposure). No URL contract / data-shape / e2e fixture row owed — both `/privacy` and `/terms` are already in `apps/e2e/src/fixtures/{canonical-urls,page-reads}.ts` and the smoke walker exercises them per tick. Verify gate green: leg1 tokens + typecheck + no-raw-img + 2522 unit tests + 127 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs); leg2 build (374 pages); leg3 1362 e2e (8.4m).

- [x] [MED] [authed] /themes featured-this-month 3 lists (Comebacks worth the swing, Finales that stuck the landing, Premieres that earned it — the first 3 of 4 `featured: true` themes at `content/themes/*.md:10`, capped by `LISTS_FEATURED_RAIL_LIMIT = 3` at `src/content/loaders.ts:259`) do not appear in the BY TONE / BY STRUCTURE / BY CRAFT / SINGLE-SHOW index of 9 below — the page at `src/app/(default)/themes/page.tsx:50-59` explicitly filters out featured slugs from each category bucket (`const featuredSlugs = new Set(featured.map((t) => t.slug)); ... tone: byCategory.tone.filter((t) => !featuredSlugs.has(t.slug)) ...`) with the in-source rationale comment `Excluding featured from the grid keeps each list to one card`. So the page's count math is correct (3 featured + 9 in index = 12, matching the hero's `12 we'd defend in a group chat` claim from the resolved pass-22 lede) but the filter chips at the top of the page (`ALL · BY TONE · BY STRUCTURE · BY CRAFT · SINGLE-SHOW`) only scope the index-9-only block — when a reader clicks `BY CRAFT` expecting to filter the whole catalogue, they silently lose the 3 featured lists (best-finales + best-premieres are both `category: craft` per `content/themes/best-finales.md:5` + `content/themes/best-premieres.md:5`; best-comeback-seasons is `category: tone`; best-villain-editing is `category: craft` but ranks 4th in featured and falls below the limit). The reader's mental model from the hero's `12 we'd defend in a group chat` framing is one unified catalogue narrowable via chips; the page implementation runs two disjoint sets (featured shelf + filtered index) with the chips scoping only the index. Concrete observed shape from the pass-40 authed walker capture: hero `12 we'd defend in a group chat`; filter-chip row `ALL · BY TONE · BY STRUCTURE · BY CRAFT · SINGLE-SHOW`; Featured block `Comebacks worth the swing / Finales that stuck the landing / Premieres that earned it`; mode-row `SHOWING · ALL 9 IN THE INDEX` (post-pass-38 #340 close, now sits above the All-lists block); All-lists grid `BY TONE · 2 / [Seasons that live in their loudest arcs, Rookie casts walking in fluent] / BY STRUCTURE · 4 / [Reunion specials..., The back-half..., Returnee seasons..., Firsts that hold up] / BY CRAFT · 2 / [The setting talks first, The villain edit...] / SINGLE-SHOW TIERS · 1 / [Survivor: the load-bearing seasons]`. Same root cause as the dropped self-assessment candidate (d) — home `Themed lists, cross-canon` block surfaces 4 lists that overlap only partially with /themes featured 3, folded into this row at self-assessment because the cleaner single-page fix lands here. Same defect class as the resolved pass-38 #340 (filter-state subhead position vs Featured block content) — that close addressed the *position* of the chip-state subhead; this row addresses the *scope* of the chip semantics relative to the featured rail. Bearings voice cue (`plan/bearings.md:370`) — `knowledgeable peer — plain sentences over clever ones`; a peer's catalogue tells the reader what subset they're looking at when the framing implies a unified set. Fix options: (a) **primary path — include featured slugs in the category-bucket grid** so the chips operate over the whole 12-list catalogue. Drop the `.filter((t) => !featuredSlugs.has(t.slug))` at `themes/page.tsx:54-59`; the featured rail keeps its shelf above (it's the editorial spotlight, separately rendered), but a reader clicking `BY CRAFT` now sees all category-craft lists including Finales-that-stuck-the-landing + Premieres-that-earned-it. Side effect: a featured list appears twice on the page (once in the featured rail, once in the filtered index) — but that's the honest accounting; the reader's filter expectation is "show me every craft list" and the duplication tells them which of those are the editor's current spotlight. The in-source rationale comment at `themes/page.tsx:50-53` needs to be inverted from `Excluding featured from the grid keeps each list to one card` to `Including featured in the grid lets chip filters scope the whole 12-list catalogue; the featured rail is the editorial spotlight, the grid is the navigable index`. The mode-row label needs to update: `SHOWING · ALL 12 IN THE INDEX` (the count goes from 9 to 12 because the filter is now over all themes), and per-category counts update accordingly (`BY CRAFT · 2 → BY CRAFT · 4` etc.). (b) **alternative — change the hero framing so the disjoint sets are explicit**: `3 featured this month, 9 more in the index — 12 we'd defend in a group chat`. The reader is told up-front that featured + index don't overlap. Smaller blast radius (one prose edit) but doesn't fix the chip-filter scope mismatch — the chips still silently drop featured lists from the visible catalogue. Worth doing only if (a)'s duplicate-tile cost is judged worse than the disjoint-sets reader-confusion. (c) **alternative — leave as-is** — accept the silent filter-loss. Rejected — same defect class as pass-38 #340 at the chip-scope layer; the catalogue should tell the reader what they're looking at. Recommended (a) — drops the filter, lets the chips scope the whole 12-list catalogue, accepts the featured-tile-appears-twice cost (which is editorially honest — the featured rail is "what we're spotlighting this month" and the index is "the full catalogue narrowable by facet"). Pin: extend `src/app/(default)/themes/__tests__/page.test.tsx` with a new describe block `featured-vs-index disjoint scope (critique pass-40, issue forthcoming)` containing two cases — (1) the index renders all 12 themes when the rendered page is read with `chip=ALL` (assert the count of `[data-testid=lists-row]` matches the total theme count, NOT total-minus-featured); (2) clicking `BY CRAFT` reveals Finales-that-stuck-the-landing in the visible grid (assert the rendered grid includes a `[data-slug=best-finales]` row when the chip-state is `craft`). Sibling positive in `ListsFilterController.test.tsx` already pins the chip → mode-row label invariant from pass-38 #340 close; leave unchanged. Bidirectional drift guard against a future refactor re-introducing the `featuredSlugs` filter. No e2e fixture row owed — the smoke walker pins URL existence + meta tags on `/themes`, neither affected. Spoiler discipline P0 intact (catalogue chip-scope edit only; no per-show verdict change, no canon position change, no winner / elimination / finale beat exposure on any surface — the chip filters a list of themes, not their content). (URL: /themes, source: critique-pass-40) — ac3c88c — issue: #353 — RESOLVED 892c5b7: took the row's recommended primary path (a). `src/app/(default)/themes/page.tsx:50-68` dropped the `featuredSlugs` filter so `byCategory` flows straight into `ListsAllSection` — the chip-filtered grid now covers the whole 12-list catalogue (chip `BY CRAFT` recovers Finales-that-stuck-the-landing + Premieres-that-earned-it). The in-source rationale comment was inverted per the row's spec from `Excluding featured from the grid keeps each list to one card` to `Featured rail is the editorial spotlight; the grid below is the navigable index. Both render every list ...`. The mode-row label updates naturally to `SHOWING · ALL 12 IN THE INDEX` via the existing `counts.all = sum(byCategory[*].length)` pipeline; per-category counts update too (`BY CRAFT · 2 → BY CRAFT · 4`). Hero shape simplified per the same fix: the prior FEATURED + IN THE INDEX partition only existed as a workaround for the chip mode-row scoping the non-featured grid (pass-22 #261 / pass-28 split-reveal). With chip.all === stats.total today, the partition is moot. `src/components/lists/ListsHero.tsx:20-29,75-79` collapses the stat strip to a single `lists-stat-total` cell (always rendered, never split) and rewrites the lede opener from `<index> in the index, <featured> featured this month — <total> we'd defend in a group chat` → `<total> lists we'd defend in a group chat — <featured> featured this month.` (when featuredCount > 0); the single-total fallback remains for featuredCount = 0. Pinned per the row's spec at `src/app/(default)/themes/__tests__/page.test.tsx` with the new `featured-vs-index disjoint scope (critique pass-40 #353)` describe block — (1) `grid renders one row per theme` asserts `[data-testid=lists-row]` count equals `getAllThemes().length` (the full catalog, NOT total-minus-featured); (2) `featured slugs are reachable from the grid` asserts every theme returned by `getFeaturedThemes(LISTS_FEATURED_RAIL_LIMIT)` has a matching `[data-slug]` row in the grid. Sibling tests rewritten in lockstep: `src/components/lists/__tests__/ListsHero.test.tsx` lines 74-160 replaced the FEATURED + IN THE INDEX split/sum/lede-math tests with single-LISTS-cell pins + bidirectional drift guard against the disjoint-partition opener form (`<n> in the index, <m> featured` must never re-emerge); `apps/e2e/tests/themes.spec.ts` lines 7-31 + 88-137 rewrote the hero-stats walk + the rail-grid overlap test (the old `no list slug appears in both rail and grid` invariant inverts to `featured rail slugs are also present in the all-lists grid` since the new model expects the duplication); `apps/e2e/src/fixtures/page-reads.ts` swapped the `lists-stat-featured` + `lists-stat-index` pins for `lists-stat-total`. Rationale comments in `src/content/__tests__/loaders.test.ts`, `src/content/__tests__/index.test.ts`, `src/lib/__tests__/themes-format.test.ts`, `src/lib/themes-format.ts`, `src/content/loaders.ts` realigned to the new model (featured = overlay/spotlight subset, not disjoint partition). The qualifier `in the index` in the chip mode-row was kept — it still distinguishes the grid's full-catalog scope from the rail's editorial spotlight subset, and the pass-25 negative pin (never the bare `showing · all N lists` shape) survives unchanged. Side effect accepted per the row's editorial framing: featured tiles appear twice on the page (once in the rail, once in the grid), but that's the honest accounting — the rail says "what we're spotlighting this month" and the grid says "the full catalogue narrowable by facet." The home `Themed lists, cross-canon` block (folded into this row at self-assessment) is unchanged on this tick; the cleaner single-page fix landed at /themes per the row's contract. Spoiler discipline P0 intact (catalogue chip-scope edit only; no per-show verdict change, no canon position change, no winner / elimination / finale beat exposure on any surface — the chip filters a list of themes, not their content). Verify gate green: leg1 tokens + typecheck + no-raw-img + 188 unit files / 2536 tests + 70 script tests + content:check (13 shows / 298 seasons / 13 canons / 12 themes / 3 legal docs); leg2 build (374 pages); leg3 1362 e2e (8.0m). Issue #353 auto-closed via the fix commit's `Closes #353` trailer.

- [x] [MED] [anon] /shows/masterchef-australia/season/the-benchmark — meta description is truncated mid-sentence in search snippets. The rendered description reads "Season four is the founding era at its highest point. The home cook bench is the deepest the format has assembled — and Heston Blumenthal appears as a…" — the ellipsis truncation breaks at a conspicuous mid-clause point. Fix: shorten the season's `pull` (or equivalent description-source field) in `content/shows/masterchef-australia/seasons/04-the-benchmark.md` to end at a natural clause boundary within 155 characters — e.g. "Season four is the founding era at its highest point — the deepest home-cook bench the format assembled." Spoiler discipline P0 intact. (URL: /shows/masterchef-australia/season/the-benchmark, source: critique-pass-62) — 46bace8 — SEVERITY BUMPED LOW→MED at pass-67: two more instances confirmed on freshly-drained season pages — `/shows/the-apprentice/season/the-los-angeles-season` ("...and a cast still competing…" cuts before the closing clause "on the merits — the founding era's closing chapter") and `/shows/americas-next-top-model/season/the-finale` ("...runs a 10-episode format entirely…" drops the actual payoff sentence, "entirely in Los Angeles. The season closes the show's 15-year run on VH1."). Root cause is systemic, not per-show: `src/app/shows/[show]/season/[slug]/page.tsx` `descriptionFor()` slices any `lede` over 160 chars to 159 chars + an ellipsis with no natural-clause-boundary awareness, and seasons have no short-form fallback field (shows have `card_tagline`; seasons don't). Fix now spans 3+ shows across 3 separate passes (62, 67) — worth either (a) adding a season-level short-description field mirroring the show's `card_tagline`, or (b) teaching `descriptionFor()` to truncate at the nearest sentence/clause boundary instead of a hard character cutoff. (source: critique-pass-67) — 8b77f14 — issue: #441 — RESOLVED (this commit): systemic fix. Added shared clipToSeoBudget() helper in src/lib/seo.ts (option b from the row) — prefers a full sentence boundary, then a clause boundary (comma/semicolon/colon/em dash), before falling back to the last word boundary, so a truncated meta description reads as a complete thought instead of stopping mid-clause. Both descriptionFor() call sites (season page + show page) now share this helper, keeping the two mirrored functions in lockstep per the show-page comment. Verified against all three real ledes cited in this row (masterchef-australia the-benchmark, the-apprentice the-los-angeles-season, americas-next-top-model the-finale) — each now clips at a natural break instead of mid-clause. New unit coverage in src/lib/__tests__/seo.test.ts pins the sentence/clause/word-boundary precedence; existing season-page and show-page descriptionFor tests continue to pass unchanged (general shape assertions, not literal strings).

- [x] [MED] [anon] /shows/american-ninja-warrior (and every show page — systemic, shared title template) — the show-page document title runs to 80 characters for a short show name and will run longer for any show with a longer name, well past the ~60-70 character window search engines typically render before truncating a SERP snippet. Confirmed: `American Ninja Warrior — the canon + the community vote, no spoilers — tiered.tv` = 80 chars. Root cause: the literal template at `src/app/shows/[show]/page.tsx:57` — `` `${show.name} — the canon + the community vote, no spoilers` `` — is fixed-length boilerplate concatenated onto every show name regardless of length; a longer show already in the catalog (e.g. "Real Housewives of Salt Lake City", 34 chars) would push the full title past 90 characters. This is the same defect class as the already-closed length findings on individual pages (`/themes/firsts`, Love Island UK season page — pass-71), but at the shared-template layer: it affects every single show page site-wide, not one page's copy. Fix: shorten the template — e.g. drop the "+ the community vote" clause (the site's tagline already establishes "no spoilers" as the brand promise; the canon/community split is discoverable on-page) so the title reads `${show.name} — the canon, no spoilers` or similar, cutting roughly 20 characters off every show page's title uniformly. Spoiler discipline P0 intact (SEO/meta only). (URL: /shows/american-ninja-warrior, source: critique-pass-74) — issue: #474 — RESOLVED f400eae: dropped the "+ the community vote" clause from the template in `src/app/shows/[show]/page.tsx:57`; title now reads `${show.name} — the canon, no spoilers`, cutting the American Ninja Warrior title from 80 to 59 chars (and the longest current catalog name from 91 to 70). Updated the pinned test in `src/app/shows/[show]/__tests__/page.test.tsx` to match the new string. Verify gate green: 194 test files / 2784 unit tests, build (911 pages), 3028 e2e (17.7m). Closes #474.

- [x] [MED] [authed] /shows/perfect-match/season/season-1 — the meta description truncates mid-clause, ending on the stop word "the…" instead of a clean clause boundary, because `clipToSeoBudget()` (`src/lib/seo.ts:22`) falls back to a raw word-boundary cut whenever no sentence-ending or clause-marking punctuation (`. ! ? , ; : —`) falls within the last 40% of its 159-char budget. Reproduced directly: running `clipToSeoBudget()` against Perfect Match S1's `lede` field (`content/shows/perfect-match/seasons/01-season-1.md`) produces `"Contestants who fell in and out of love on Love Is Blind, Too Hot to Handle, and other Netflix dating shows get pulled into one house and rematched from the…"` — the only comma in the lede falls well before `minCut` (the 60%-of-budget threshold), so the clause-boundary branch never fires and the function falls through to `lastIndexOf(' ')`, landing on "the". This is an edge case the pass-62/67 fix (the `clipToSeoBudget` clause-aware rewrite, noted in the function's own code comment) didn't fully close — it only guards against a *raw* word-boundary cut when punctuation exists in range, not against landing on a stop word when it doesn't. Fix: after the word-boundary fallback, trim any trailing stop word (a short deny-list: "the", "a", "an", "and", "or", "of", "to") before appending the ellipsis, or shrink the budget slightly when the fallback path fires so the cut lands one word earlier. Single function edit in `src/lib/seo.ts`; add a colocated test pinning this exact lede as a regression case. Spoiler discipline P0 intact (SEO/meta copy only). (URL: /shows/perfect-match/season/season-1, source: critique-pass-79) — issue: #503 — RESOLVED dd43d38: added `trimTrailingStopWords()` helper (deny-list: the/a/an/and/or/of/to) applied to the word-boundary fallback cut in `clipToSeoBudget()`. Fix lives in the shared helper so it covers every show/season page that calls it, not just Perfect Match. New regression test pins the exact reported lede.

- [x] [LOW] [authed] /themes/best-villain-editing — entry #05 (RuPaul's Drag Race S11) closes its editorial body by echoing the page's own hero lede thesis almost verbatim instead of making an independent per-season argument, a variant of the cross-entry verbatim-echo defect class already drained twice on this exact list (issue #462, entries #02/#04). Hero lede: "...they're the seasons where the antagonist read is loud, sustained, and shaped the narrative everyone else had to play inside." Entry #05 body: "The antagonist reads run loud and sustained, and the season's whole shape is the argument the rest of the cast had to play inside." Shared construction: "loud [and/,] sustained" + "[everyone else / the rest of the cast] had to play inside." Fix: rewrite entry #05's closing clause to anchor on something specific to RPDR S11 (e.g. the workroom-vs-sewing-machine framing already in the entry) rather than restating the list's own opening thesis sentence. Content-only, one field. Spoiler discipline P0 intact. (URL: /themes/best-villain-editing, source: critique-pass-80) — 1992101 — issue: #505 — RESOLVED: kept entry #05's first sentence (the workroom/sewing-machine framing, already specific) and rewrote the closing sentence to argue the season's editing rhythm — "The edit keeps returning to the same flashpoints between challenges, never letting a clash cool before the stage reignites it." — which ties back to the entry's own title ("refused to cool off") instead of paraphrasing the page's hero tagline. Content-only, one field edit in `content/themes/best-villain-editing.md`. Spoiler discipline P0 intact (no outcomes exposed). Verify gate green: 194 test files / unit tests, content:check ok (58 shows/712 seasons/58 canons/12 themes/3 legal docs), build (968 pages), 3215 e2e (18.7m). Closes #505.

- [x] [LOW] [anon+authed] /shows/americas-next-top-model — the `meth_when_p` editorial copy read "The CW years and the VH1 relaunch get added as the drain completes." — internal loop/process jargon ("drain") a public reader would read as an editing error. (URL: /shows/americas-next-top-model, source: critique-pass-64) — 0d476ae — RESOLVED (stale finding, closed without a fresh fix): verified during this iterate pass that the season drain commit `8076471` ("content: season drain — America's Next Top Model C16–C24") already rewrote the sentence to "The CW years and the VH1 relaunch complete the picture across all 24 cycles." — the "drain" jargon is gone from the live file. The row sat unmarked in Pending after its underlying content was superseded by unrelated drain work. No new commit needed for the content itself; this entry documents the closure.
- [x] [LOW] [authed] /shows/masterchef-australia — the `meth_when_p` field ended with "The remaining seasons are added as the drain continues." — same internal-jargon class as the ANTM row above. (URL: /shows/masterchef-australia, source: critique-pass-62) — 46bace8 — RESOLVED (stale finding, closed without a fresh fix): verified during this iterate pass that the season drain commit `c069bbe` ("content: season drain — MasterChef Australia S6–S16") already rewrote the field to "All sixteen seasons are now seeded... The new-era rankings (S12–S16) will sharpen..." — the "drain" jargon is gone from the live file.
- [x] [LOW] [anon] /shows/survivor-australia — the methodology "When I revisit" section called an unranked future season "the widely-praised Heroes V Villains run", editorially endorsing a season not yet in the canon. (URL: /shows/survivor-australia, source: critique-pass-58) — 8580763 — RESOLVED (stale finding, closed without a fresh fix): verified during this iterate pass that the season drain commit `39047a4` ("content: season drain — Australian Survivor S6–S12") both rewrote `meth_when_p` (no longer mentions Heroes V Villains prospectively) AND added Heroes V Villains to the canon itself as entry #8 — the season the finding worried about being pre-judged is now actually ranked. The finding's premise no longer applies.
- [x] [LOW] [anon] /themes lede "one stays inside a single show" is a hardcoded singular — flagged as not tracking the live single-show-list count. (URL: /themes, source: critique-pass-51) — 1354924 — RESOLVED (stale finding, closed without a fresh fix): verified during this iterate pass that `src/components/lists/ListsHero.tsx` already computes this clause dynamically off `stats.singleShowCount` (`=== 1 ? 'one stays inside a single show' : 'some live inside one show'`), added in commit `e0e84c0` — which predates this row's filing date (2026-06-14 vs. e0e84c0 on 2026-05-31). The row was a false positive at filing time; the walker observed the singular-count render and mistook the already-dynamic clause for a hardcode.

- [x] [HIGH] [anon+authed] /themes/the-command-held-for-nine-seasons-then-didnt — the URL slug still reads "nine-seasons" while the page's title, H1, canonical tag, meta description, and body copy all say "ten seasons" — a self-contradiction visible in the browser address bar the moment the page loads, independently reproduced by both the anon and authed cloud walker passes. Confirmed via direct file read: `content/themes/the-command-held-for-nine-seasons-then-didnt.md` has `slug: the-command-held-for-nine-seasons-then-didnt` but `title: "The command held for ten seasons, then didn't."`, `description: "Below Deck Mediterranean has run under Captain Sandy Yawn's command for ten of its eleven seasons..."`, and body text "Ten of Below Deck Mediterranean's eleven seasons answer to Captain Sandy Yawn's command." Root cause: today's same-day content tick (`bb9fc808`, "extend the-command-held-for-nine-seasons-then-didnt with Below Deck Med S11") added the show's eleventh season as a tenth Captain-Sandy-commanded entry, bumping the count word in the title/description/body from nine to ten, but the slug (and its canonical URL) was never regenerated to match. Fix: rename the slug to `the-command-held-for-ten-seasons-then-didnt` with a redirect from the old nine-seasons path (matching the site's existing slug-change precedent), or add a lightweight `content:check` invariant that flags when a theme's title contains a spelled-out number word that doesn't match the corresponding word embedded in its own slug. Content-only plus a possible redirect entry; no spoiler impact (this is a count/naming fact, not an outcome). (URL: /themes/the-command-held-for-nine-seasons-then-didnt, source: critique-pass-112) — RESOLVED (2026-08-11, cloud march tick): renamed the theme file to `the-command-held-for-ten-seasons-then-didnt.md`, updated its `slug` frontmatter, added a permanent 308 in `src/middleware.ts` from the old nine-seasons path (matching the existing `/search` retirement precedent), and fixed the two sibling `related:` cross-references (`two-coasts-one-open-call`, `the-masks-changed-every-week-the-panel-never-did`). No entry/ranking/title change — this was purely the slug/URL fix the finding called for. Covered by a new middleware unit-test block + a dedicated e2e redirect spec. Spoiler discipline P0 unaffected (count/naming fact only).

- [x] [MED] [authed] /themes/no-season-here-got-the-calendar-to-itself — entries #3 and #12 independently claim exclusive "longest single season" status, a direct contradiction within the same 13-entry list. Entry #3 (rank 3, lines 32-33): "Nine months on air, and four other seasons share the calendar with it" / "The longest single season in this stretch also touches the most neighbors..." Entry #12 (rank 12, lines 86-87): "Nine months on air, no bracket in sight, and a whole neighboring season nested inside it" / "...carry a tournament-free season across the longest single window this run has produced." Both claim nine months and sole "longest" status with no tie acknowledgment — contrast entry #4 (line 38-39), which correctly flags a shared superlative: "Tied for the deepest footprint, and directly entangled with the format's shortest run." Fix: either verify the two seasons' actual air-window lengths and correct whichever claim is wrong, or reword one entry to "tied for longest" following entry #4's established tie-handling convention. Content-only, one or two fields. Spoiler discipline P0 intact (air-date/scheduling fact only). (URL: /themes/no-season-here-got-the-calendar-to-itself, source: critique-pass-103) — issue: [mirror-failed: 2026-08-11T00:00:00Z] — RESOLVED 2837921e: the finding's stale rank numbers (#3/#12) no longer matched the live file (list had grown to 30 entries) — cross-referenced the verbatim quoted text instead and confirmed the contradiction still live at current rank 8 (Season 22) and rank 26 (Season 60). S22's blurb softened to "one of two longest single seasons," S60's blurb reworded to explicitly name and tie against S22, mirroring the list's own established tie convention (rank 2's "Tied with Season 42" framing). No ranks or entry count changed, 30 entries still. Verify gate green: fast gate clean, build clean (1511 pages), 4872 e2e (29.1m).

- [x] [MED] [anon] /themes/one-rule-fills-every-seat, /themes/the-couch-kept-adding-chairs (systemic — both list templates, likely every themed list) — the 17 ranked entries on each themed-list page render their titles inside `<span class="entry-title">` (22px serif, weight 500) nested in an `<a class="entry-row">` — visually heading-weight but semantically plain spans. The only real headings on the page are the h1 and a single h2 ("The 17, in order."). A screen-reader user navigating by heading — the standard way to skim a long ranked list — gets one h2 and then nothing; all 17 entries are invisible to heading-based navigation. Compare `/shows`, where every tile name is a real h3. Confirmed via direct HTML fetch: `<span class="entry-title">Salt Lake City cuts its cast almost in half in a single season</span>` inside `<a class="entry-row" href="/shows/rhoslc/season/season-3">`; CSS confirms `.entry-title{font-family:var(--font-family-serif);font-size:22px;font-weight:500}`. Fix: wrap each entry-title in an h3 (or h4 nested under the section's h2) so themed-list entries are heading-navigable, matching the `/shows` tile pattern — likely a shared list-entry component, so the fix should propagate to every themed list, not just these two. Chrome-only, no content or spoiler impact. (URL: /themes/one-rule-fills-every-seat, /themes/the-couch-kept-adding-chairs, source: critique-pass-121) — RESOLVED (2026-08-14, cloud march tick): `src/components/lists/ListEntryStack.tsx` is the single shared component behind every themed-list page — changed the `entry-title` span to an `<h3>` (matching the `/shows` tile h3 pattern) and added `margin: 0` to `.entry-title` in `src/styles/lists.css` to neutralize the browser default h3 margin so layout is unchanged. Fix propagates to all 182 themed lists automatically, not just the two URLs the walker sampled. New unit test pins the h3 role + per-entry text. Picked up per the established dispatch-starvation workaround (issue #758): Rule 2 (season-fill) confirmed still fully starred in `plan/CADENCE.md`, Rule 3 (themed lists) confirmed exhausted for the day by the fifteenth consecutive same-day zero-ship pass logged immediately before this tick — rather than run a sixteenth same-day search, picked up the freshest actionable CRITIQUE.md finding instead.

- [x] [MED] [anon] /shows/americas-got-talent — tier_s_blurb still omitted Brandy Norwood, contradicting the pass-137-fixed Season 1 slot rationale. The pass-137 fix corrected `canon.md`'s slot #02 rationale to name Brandy Norwood (not Sharon Osbourne) as Season 1's third judge, matching the season file, lede, and watch_list, but the S-tier founding-era summary blurb rendered a few sections above that same rationale on `/shows/americas-got-talent` was not updated — it still read "a judging panel (Morgan, Osbourne, Hasselhoff, then Mandel)" with no mention of Norwood at all, so a reader scanning both blocks on one page got two different accounts of who sat on the panel in season one. Evidence: `content/shows/americas-got-talent/canon.md:11` `tier_s_blurb` vs. the same file's slot #02 rationale (correctly naming Norwood for Season 1; Osbourne genuinely joins starting Season 2 per line 58). (URL: /shows/americas-got-talent, source: critique-pass-138) — RESOLVED (2026-08-24, cloud march tick): rewrote `tier_s_blurb` to "a judging panel (Morgan, Norwood, Hasselhoff — Osbourne joins in season two — then Mandel) still discovering what the format could reward", agreeing with the slot #02 rationale. Content-only, one field edit, schema word-count compliant (36 words). Spoiler discipline P0 intact (judge-panel history only, no outcomes). Picked up per the established dispatch-starvation workaround (issue #758): Rule 2 (season-fill) confirmed fully starred in `plan/CADENCE.md` (44 gap-slots, all confirmed-but-unaired), Rule 3 (themed lists) confirmed exhausted for the day by seven consecutive same-day zero-ship passes logged immediately before this tick — rather than run an eighth same-day search, picked up the freshest actionable CRITIQUE.md finding instead. Verify gate green: fast gate clean (199 test files / 3665 unit tests), build clean, 4879 e2e (29.7m).
- [x] [MED] [authed] /shows/selling-sunset/season/season-9?view=community — `?view=community` was a silent no-op on season-detail routes: byte-identical render with and without the param, since the community-view toggle was only implemented on the show-index route and the season-detail route never read `searchParams` at all (pass: 151 (commit f945f171); confirmed systemic across three shows/three passes — 151/156/171, severity bumped LOW→MED at the third confirmation) — RESOLVED (2026-09-26, cloud march tick, iterate): the season page now reads `searchParams` and `permanentRedirect`s any `?view=...` param to the clean canonical URL, matching the file's existing digit-form/alias redirect pattern (a real community-vote pane on the season route was rejected — canon commentary and live vote/community elements already render together on every season page, so there's no second view to switch to). Added `seasonViewRedirects` to `apps/e2e/src/fixtures/redirect-fixtures.ts` (one row per show) and a matching test loop in `apps/e2e/tests/redirects.spec.ts` asserting the 308 + Location header + clean landed URL + empty search string, so a regression fails at e2e time across every show, not just the three sampled by the critique passes. Verify gate green: fast gate (tokens/typecheck/no-raw-img/colocation/test:run/test:scripts/content:check), build (1520 static pages), e2e (4969 passed, 31.6m). Shipped at `6fe08cc8`.

- [x] [MED] [anon] /shows/big-brother/season/time-trip — pull field claims "27 years of history" for a 26-year-old span (pass: 185 (commit fb041cff)) — RESOLVED: 2026-10-10, cloud march tick, content-gap redirect (standing season-fill row stalled — Rule 2 fully starred at 37/39 CADENCE gap-slots per the 2026-10-04 sweep, next sweep 2026-10-11; Rule 3 re-confirmed exhausted the immediately-prior tick, 2026-10-09, with no new angle surfacing and the note's own "next unlock" pointing at tomorrow's sweep) — applied the suggested fix verbatim: `content/shows/big-brother/seasons/28-time-trip.md`'s `pull` field now reads "26 years of history," matching `est_year: 2000` against the 2026 air date. Confirmed no other instance of the stale "27 years" figure exists anywhere else in the file or `canon.md`. Content-only, one field, one file. Spoiler discipline P0 intact (tenure-year fact only).
- [x] [HIGH] [anon] /themes/same-crown-new-price-tag — featured_pull claims "Ten seasons" while the list itself carries 18 entries (pass: 184 (commit 0a312b4a)) — RESOLVED: 2026-10-08, cloud march tick, content-gap redirect (standing season-fill row stalled — Rule 2 fully starred at 37/39 CADENCE gap-slots per the 2026-10-04 sweep; Rule 3 review floor not due — 0 of 183 ledger lists past the 90-day mark, no below-floor cross-canon list remains per a fresh `content:check` sweep, and this was already the eighth same-day Rule 3 pass). Took the reframe path over the hand-correction: dropped the hardcoded count from `featured_pull` entirely rather than "Ten"→"Eighteen," matching this codebase's existing count-tail discipline (dropping literal show/season counts that drift as a list grows, already enforced on the `description`/`tagline` fields) so the sentence can't go stale again at the ninth extend. Content-only, one file.
- [x] [MED] [anon+authed] /themes/the-other-side-of-the-table — ranked list's `rank` field skips #04, breaking the page's own "The 14, in order" promise (pass: 182 (commit f57a9b6b)) — RESOLVED: 2026-10-06, cloud march tick, content-gap redirect (standing season-fill row stalled — Rule 2 fully starred at 37/39 CADENCE gap-slots per the 2026-10-04 thirteenth sweep; Rule 3 review floor not due — 0 of 183 ledger lists past the 90-day mark, and an exhaustive new-concept/cross-floor search this tick turned up nothing that clears the excellence gate). Took the row's own suggested fix: renumbered `content/themes/the-other-side-of-the-table.md`'s `rank` field sequentially 1-14 (every entry from Ink Master S10 onward shifted down by one slot). No entry content, title, or order changed — purely a numbering-field correction. Content-only, one file.
- [x] [MED] [anon] /themes — the "Featured this month" strip's badge reads "Featured for September 2026" while the site is now well into October (pass: 178 (commit aeccb6ff)) — RESOLVED: 2026-10-10, cloud march tick, content-gap redirect per issue #758 (Rule 2 reconfirmed fully stalled — 37/39 CADENCE gap-slots starred confirmed-but-unaired as of the 2026-10-04 sweep, next due 2026-10-11; Rule 3 new-list search already reconfirmed exhausted twice today with no new angle). Curator swap applied: flipped `best-location-reveals` (`last_revised: 2026-09-13`) and `been-here-before` (`2026-09-17`) to `featured: false`, kept `same-crown-new-price-tag` (already `2026-10-03`), and promoted two of the catalog's freshest themes — `someone-else-held-the-chair-for-a-while` (`2026-10-09`) and `the-other-side-of-the-table` (`2026-10-06`) — to `featured: true`, each authoring a dedicated 15-20 word `featured_pull` per the pass-168 playbook (`FEATURED_THEME_PULL_STRICT`). Badge now derives "Featured for October 2026" from the new max. Also added a standing "Featured rotation" note to `plan/LISTS.md` (fourth recurrence — closed pass-103, pass-168, now pass-178) instructing future Rule 3 ticks to proactively swap the stalest featured theme once it trails the catalog max by ~3 weeks, so this doesn't need a fifth critique pass to catch. Content-only: 4 theme frontmatter files + 1 plan note.
- [x] [MED] [anon] /themes — the "Featured this month" strip's badge reads "Featured for August 2026" while the site is now well into September (pass: 168 (commit 1650b60f)) — RESOLVED: 2026-09-22, cloud march tick, content-gap redirect (Rule 2 fully stalled at 44/44 CADENCE gap-slots per the 2026-09-20 eleventh sweep; Rule 3 review floor not due, no themed list past the 90-day review floor). Took the row's suggested fix: swapped `best-comeback-seasons`, `best-finales`, `best-premieres`, `best-villain-editing` out of the `featured: true` set — all four carried early-August `last_revised` and one was already dead weight (`LISTS_FEATURED_RAIL_LIMIT = 3` in `src/content/loaders.ts` only ever renders 3 of the 4 flagged themes). Replaced with `best-location-reveals`, `been-here-before`, `same-crown-new-price-tag` — all three genuinely September-revised (2026-09-13, 2026-09-17, 2026-09-07) — and authored `featured_pull` on each per the STRICT `content-check` invariant. First attempt swapped in `the-season-the-audience-showed-up-all-at-once` (16 distinct shows) instead of `same-crown-new-price-tag`; broke the 375px mobile e2e gate (`smoke-mobile.spec.ts`, `themes.spec.ts:178`, 15px horizontal overflow) because `FeaturedCard.tsx` renders one 9px `<Bullet>` per distinct show in `.feat-tag` and the prior featured set topped out at 10 shows. Reverted that file to `featured: false`, picked `same-crown-new-price-tag` instead (10 distinct shows, matching the prior ceiling) — verify gate green on retry. Spoiler discipline P0 intact (frontmatter flag + pull-quote copy only; no per-season verdict, no canon position, no elimination/finale beat exposure). Verify gate green: fast leg (typecheck, no-raw-img, test-colocation, unit tests, script tests, content:check) + build + full e2e suite, all foreground/sequential.
- [x] [MED] [anon+authed] /shows/ink-master/season/hometown-heroes — the four-finalist-finale and hometown-pride facts are each restated near-verbatim three times within the season page's own sections (pass: 168 (commit 1650b60f)) — RESOLVED: 2026-09-23, cloud march tick, content-gap redirect (standing season-fill row stalled — Rule 2 fully starred at 44/44 CADENCE gap-slots per the 2026-09-20 eleventh sweep; Rule 3 review floor not due). Kept the lede as the sole plain statement of both facts (fifteen artists/hometown framing, four-finalist finale). Rewrote the body ("shape of the season") to a new angle — the hometown theme lives in challenge dressing, not judging, and the real structural consequence of the extra finalist is a compressed mid-season narrowing to make room for a fourth canvas at the close. Rewrote all three `watch_list` bullets to drop the restated phrasing and point at new specifics instead: which regions get leaned on early (premiere), the competitive "bubble" tension of a fourth slot (mid-season), and how judging attention splits four ways instead of three (finale). Content-only, `content/shows/ink-master/seasons/17-hometown-heroes.md`.
- [x] [MED] [anon+authed] /shows/alone-the-skills-challenge/season/season-1 — the lede, season body, and canon.md rank-1 rationale all restate the same construction-brief list and cast/judging mechanics near-verbatim (pass: 167 (commit 73dd0977)) — RESOLVED: 2026-09-21, cloud march tick, content-gap redirect (standing season-fill row stalled — Rule 2 fully starred at 44/44 gap-slots per the 2026-09-20 eleventh sweep, Rule 3 review floor not due). Rewrote `content/shows/alone-the-skills-challenge/canon.md`'s Season 1 rationale to argue the #1 slot comparatively against the parent show (Alone's endurance model vs. this format's alumni-judged craft competition) instead of re-listing the same challenge-type list and cast breakdown a third time. Season page's lede and body left untouched — they remain the sole full explanation of the challenge/cast facts. Content-only, one file. Shipped at `1d4a1ae4`.
- [x] [MED] [anon] /shows/so-you-think-you-can-dance/season/atlanta — the lede, season body, and canon.md rank-18 rationale all restate the same Atlanta-relocation fact set near-verbatim (pass: 167 (commit 73dd0977)) — RESOLVED: 2026-09-22, cloud march tick, content-gap redirect (standing season-fill row stalled — Rule 2 fully starred at 44/44 gap-slots per the 2026-09-20 eleventh sweep, Rule 3 review floor not due — 0 of 172 ledger lists past the 90-day mark). Rewrote `content/shows/so-you-think-you-can-dance/canon.md`'s rank-18 rationale to argue the slot comparatively (the season that changes the format the most vs. the season that scores best, dropping both the open-call tour and the public vote that every one of its 17 predecessors kept) instead of re-listing the relocation/video-submission/Top-100 facts the lede and body already own. Content-only, one file.
- [x] [MED] [authed] /shows/amazing-race/season/season-38 — the "Route · the European arc" watch_list entry restates the same seven-country route list already given in "The shape of the season" body (pass: 166 (commit 0bfe8ec1)) — RESOLVED: 2026-09-21, cloud march tick, content-gap redirect (standing season-fill row stalled — Rule 2 fully starred at 44/44 gap-slots per the 2026-09-20 eleventh sweep, Rule 3 review floor not due). Rewrote the watch_list entry to drop the restated seven-country list and closing clause, replacing it with a pacing/fatigue observation (compounding border-to-border strain on a cast whose reads are built on one stationary room) not stated anywhere else on the page. Content-only, one file. Shipped at `f3d88cee`.
- [x] [MED] [anon] /shows/survivor/season/survivor-50 — "The take" and "The shape of the season" sections restate the same all-era-cast fact in near-synonym phrasing (pass: 166 (commit 0bfe8ec1)) — RESOLVED: 2026-09-21, cloud march tick, content-gap redirect (standing season-fill row stalled — Rule 2 fully starred at 44/44 gap-slots per the 2026-09-20 eleventh sweep, Rule 3 review floor not due). Section 02 body rewritten to open with the tribe-randomization mechanic itself instead of restating the cast-composition clause section 01's `pull` already owns. Content-only, one file. Shipped at `9c06eb63`.
- [x] [MED] [anon+authed] /shows/masterchef/season/global-gauntlet — the judges/regions/World-Cup-bracket fact set is restated near-verbatim across the lede, "shape of the season," and "where it sits in the canon" sections, plus the meta sidebar (pass: 165 (commit 4d875a01)) — RESOLVED: 2026-09-19, cloud march tick, content-gap redirect (`content/shows/masterchef/seasons/16-global-gauntlet.md` + `canon.md`) — lede + meta sidebar now own the raw fact set; season body rewritten to describe bracket-seeding structural rhythm (contained early tension, widening stakes once regional brackets collide); canon rationale rewritten to argue the ranking comparatively against United Tastes of America (rank 11) rather than re-summarizing Global Gauntlet's own premise. Shipped at `0d44db01`.
- [x] [LOW] [anon] / (home) — the Real Housewives franchise is inconsistent about the definite article across ten shows (pass: 165 (commit 4d875a01)) — RESOLVED: 2026-09-23, cloud march tick, content-gap redirect (Rule 2 fully stalled — filesystem gap-check found zero actionable gaps catalog-wide except the already-known non-actionable `90-day-fiance` gap; Rule 3 review floor not due, idea pool exhausted). Added "The" to the `name` field and canon.md header on all six shows that were missing it: `content/shows/rhoa.md`, `rhobh.md`, `rhoc.md`, `rhonj.md`, `rhony.md`, `rhoslc.md` (plus each show's `canon.md` `# Editor's Canon — ...` heading), bringing them in line with the four that already had it (`rhod`, `rhodubai`, `rhom`, `rhop`) and with Bravo's own branding. Verified the pass-66 "in the ${show.name} Editor's Canon" double-article strip (`src/app/shows/[show]/season/[slug]/page.tsx:354-391`) is generic and already handles the leading "The " correctly for all ten shows — no template change needed. Deliberately left prose cross-references alone (`content/shows/vanderpump-rules.md` tagline + canon.md + S1 body, `content/themes/the-zip-code-was-the-only-constant.md`, `content/themes/four-names-never-leave-the-credits.md`) since inserting "The" into attributive mid-sentence phrases like "a Real Housewives of Beverly Hills spinoff" would read ungrammatically ("a The Real Housewives..."); those are scoped out of this fix. Content-only, 12 files (6 `name` fields + 6 canon.md headers).
- [x] [LOW] [anon] /shows/dragrace-allstars/season/season-11 — the `watch_list` "Mid-cycle · the Comeback Queen" entry still fully re-explains the reentry mechanic, outside the scope of this same tick's canon.md-only fix (pass: 165 (commit 4d875a01)) — RESOLVED: 2026-09-20, cloud march tick, content-gap redirect (standing season-fill row stalled — Rule 2 fully starred at 44/44 gap-slots per the same-day eleventh sweep, Rule 3 review floor not due). Rewrote the watch_list entry to drop the restated mechanic definition and Season 10 Wildcard Lottery comparison, replacing it with a forward-looking structural observation (scoring position on reentry, timing sensitivity of early- vs. late-cycle reentry) not stated anywhere else on the page. Content-only, one file. Shipped at `fe5a3fb3`.
- [x] [MED] [anon+authed] /shows/alone-australia/season/sapmi-finland — the "biggest swing/leap since Fiordland" claim is restated across four separate content fields (pass: 164 (commit badef7cd)) — RESOLVED: 2026-09-19, cloud march tick, content-gap redirect (standing season-fill row stalled — Rule 2 fully starred, Rule 3 review floor not due). Left canon.md's Season 4 rationale as sole owner of the "biggest swing since Fiordland" comparison. Rewrote the season page's `lede` (drops the explicit Fiordland clause, keeps "the format's boldest location bet to date"), the body paragraph (swaps the comparison for the production angle — camera care, battery life, and daylight scheduling in sub-zero conditions), and the fourth `watch_list` entry (drops the restated comparison, keeps the crew-logistics/emergency-reach detail). Content-only, one file (`content/shows/alone-australia/seasons/04-sapmi-finland.md`).
- [x] [MED] [anon+authed] /shows/married-at-first-sight/season/seattle — the season's three headline facts are restated near-verbatim across five separate sections (pass: 157 (commit 51312421)) — RESOLVED: 2026-10-10, cloud march tick (issue #758 workaround, oldest-open content-only redirect). `pull` rewritten to name the Brunson/Paz individual-exposure stakes instead of re-listing the eyebrow/lede facts; `canon.md` Season 20 rationale rewritten to argue the ranking against Atlanta's founding four-expert panel rather than restate the cast-size/panel-size facts a third time. Commit 68d60779.
- [x] [MED] [anon+authed] /shows/vanderpump-rules/season/season-12 — "the shape of the season" and "where it sits in the canon" restate the identical cast-turnover fact set near-verbatim (pass: 156 (commit ae289b02)) — RESOLVED: 2026-09-19, cloud march tick, content-gap redirect (standing season-fill row stalled — Rule 2 fully starred, Rule 3 fresh-material search exhausted). Season page's body paragraph keeps the full cast-turnover recap unchanged. Rewrote `content/shows/vanderpump-rules/canon.md`'s Season 12 rationale to argue the #12 slot comparatively against Season 9 (the canon's other reset season) instead of re-listing the same headcount facts. Content-only, one file.
- [x] [MED] [authed] /shows/project-runway/season/new-york-2025?view=community — the Heidi-Klum-returns/Freeform-relaunch fact is restated across six sections (pass: 151 (commit f945f171)) — RESOLVED: 2026-09-22, cloud march tick, content-gap redirect (standing season-fill row stalled — Rule 2 fully starred at 44/44 gap-slots per the 2026-09-20 eleventh sweep; oldest unresolved content-only MED finding in the backlog after the same-tier pass-151 masterchef finding was resolved earlier today). Rewrote the season's `lede`, `pull` (THE TAKE), and `body` (SHAPE) to drop the Klum-return clause, leaning instead into the judges'-table rebuild (Law Roach joining), the network-move stakes, and the team-house premiere. Rewrote `canon.md`'s Season 21 rationale opening to drop "Heidi Klum's return energizes the format immediately," replaced with the network-move framing. `host_caption` is now the sole prose owner of the Klum-return fact (the `format_changes` bullet list still states it factually, which is fine — bullets aren't prose repetition). Season body trimmed to exactly 80 words to satisfy the `blurb_md` schema cap. Verify gate green: fast gate (199 test files/3693 unit tests, content:check ok — 68 shows/1052 seasons/68 canons/182 themes), build clean (1519/1519 static pages), e2e 4898/4898 (31.0m). Shipped at `703b2f5d`.
- [x] [MED] [anon] /shows/masterchef?view=canon — the "WHY THIS SLOT" callout bare-restates the analysis paragraph directly above it (pass: 151 (commit f945f171)) — RESOLVED: 2026-09-22, cloud march tick, content-gap redirect (standing season-fill row stalled — Rule 2 fully starred at 44/44 gap-slots per the 2026-09-20 eleventh sweep; oldest unresolved content-only MED finding in the backlog). Rewrote Season 4's `slot_argument` to argue the top slot comparatively against Season 9's structural gambit instead of re-stating cast size and episode count. Rewrote Season 9's `slot_argument` to argue its #2 slot comparatively against Season 4 above it and Season 10 below it (sustained structural risk vs. raw depth vs. scale) instead of re-stating the mentorship-draft mechanics. Both fields verified under the 240-char `slot_argument` schema cap. Content-only, one file. Shipped at `1431a86d`.
- [x] [MED] [anon] /shows/dragrace-allstars/season/season-11?view=community — the "eighteen queens, three six-queen brackets" fact is restated near-verbatim five times on one page (pass: 149 (commit 5d9e1f6f)) — RESOLVED: 2026-09-19, cloud march tick, content-gap redirect (standing season-fill row stalled — Rule 2 fully starred, Rule 3 saturated). Left the lede + `cast_size_caption` as the two fields owning the "eighteen queens, three six-queen brackets" numeric fact per the suggested fix. Rewrote `shape_h2` ("A narrower cut through the same brackets."), the body opener (drops the queen/bracket count, keeps the three-episode-stretch + top-two-advance + Comeback Queen + host/finale facts), and the first `watch_list` entry (keeps the new Orange/Pink/Purple bracket-color detail, drops the restated "eighteen-queen, three-bracket" clause) so none of the three re-derive the count. Also softened the secondary "tightened" echo across `shape_h2`/body by using "narrows the cut" instead. Content-only, one file (`content/shows/dragrace-allstars/seasons/11-season-11.md`), body still 62 words (50-80 floor/ceiling intact).
- [x] [LOW] [anon] /shows/love-is-blind/season/columbus — section subhead promises an episode-count comparison the body paragraph never delivers (pass: 149 (commit 5d9e1f6f)) — RESOLVED: 2026-09-22, cloud march tick, content-gap redirect (Rule 2 fully stalled at 44/44 CADENCE gap-slots per the 2026-09-20 eleventh sweep; Rule 3 review floor not due). Folded a thirteen-episode-order clause ("holds for a third straight season, no snap back to the founding ten") into the body paragraph rather than rewriting the shape_h2 subhead, preserving this show's shape_h2 convention of episode-count/structural comparisons (Chicago, Seattle, Minneapolis, Denver all follow the same pattern). Content-only, one field. Shipped at (this commit).
- [x] [MED] [authed] /shows/traitors-uk/season/series-4?view=community — "the shape of the season" and "where it sits in the canon" sections repeat a near-identical sentence with only a word or two swapped (pass: 148 (commit 9ea56bcd)) — RESOLVED: 2026-09-18, cloud march tick, content-gap redirect per issue #758. Rewrote `content/shows/traitors-uk/canon.md`'s Series 4 rationale to open with the comparative canon-slot claim (peak proximity vs. Series 3) instead of re-describing the season, leaving the season page's body paragraph as the sole owner of the season-summary sentence. Dropped the "leans into the format's own mythology" clause too — it echoed the season page's body almost verbatim. Picked up per the established dispatch-starvation workaround: Rule 2 (season-fill) confirmed fully starred in `plan/CADENCE.md` (39 shows/40 gap-slots, next sweep 2026-09-20), Rule 3 (themed lists) confirmed saturated by two independent same-day zero-ship passes already logged today. Parsed all 51 CRITIQUE.md Pending headers programmatically (not just the newest pass) rather than trusting the "well is dry" conclusion in the prior two same-day audits — found 35 genuinely open findings, most needing component/code changes, but this one (and the dragrace pass-146 HOST caption finding, investigated and left open — see note below) were content-only. `content:check` clean (68 shows/1052 seasons/68 canons/182 themes, only the pre-existing frozen the-voice warnings from issue #762).
- [x] [MED] [authed] /shows/bake-off?view=community — the weekly community-vote question is a run-on sentence nesting two comparisons with an unclear referent (pass: 147 (commit HEAD)) — RESOLVED: 2026-09-16, cloud march tick, content-gap redirect per issue #758. Rewrote `content/shows/bake-off/canon.md`'s `weekly_question` to the suggested one-comparison form, dropping the redundant "high-water mark" clause. Picked up per the established dispatch-starvation workaround: Rule 2 (season-fill) confirmed fully starred in `plan/CADENCE.md` (38 gap-slots/38 shows), Rule 3 (themed lists) confirmed saturated (no ledger row review-due in `plan/LISTS.md`; oldest `last_reviewed` `survivor-pillars` at 2026-07-31, well under the 90-day floor). Verify gate green: fast gate (199 files/3687 tests, content:check ok — 68 shows/1052 seasons/68 canons/182 themes), build clean (1516 static pages), e2e 4897/4897 passed (31.8m). Shipped at aa4b08bf.
- [x] [MED] [authed] /shows/vanderpump-rules/season/season-12?view=community — the vote block that actually takes a vote omits the 72-hour change-your-mind window that the show-level community pane states explicitly one level up (pass: 143 (commit 21cbf24a)) — RESOLVED: 2026-08-25, cloud march tick, `/iterate` (external-critique category, score 5.4 — impact 6 x ease 9, the default is used on every season page's community-vote row with no override site-wide, so the gap was systemic not VPR-specific). Applied the suggested fix verbatim: `SeasonInfoCard.tsx:50`'s `voteHelp` default now reads "one vote per reader; change your mind within 72h. community rank updates weekly." Matches `CommunityWeeklyQuestionCard.tsx`'s existing phrasing. No caller overrides this prop, so every season page's vote block now states the same flexibility window the show-level community pane already promised.
- [x] [LOW] [anon] /shows — every B-tier show card repeats its own "REVIEW IN PROGRESS" eyebrow, redundant with the section header stating the same tier-wide status once (pass: 143 (commit 21cbf24a)) — RESOLVED: 2026-09-25, cloud march tick, content-gap redirect per issue #758 (Rule 2 fully stalled — gap table all 44 slots starred confirmed-but-unaired as of the eleventh sweep; Rule 3 confirmed saturated — 0 lists past the 90-day review floor, Ideas section exhausted). Applied the suggested fix in `ShowsTile.tsx`: the per-card pill (and its `show-tile-head` margin offset) now only renders when `status.shipped < status.target`, matching the genuinely informative partial-progress case; once a show's canon clears the review floor its card falls back to the plain genre/network eyebrow, same slot S/A-tier cards already use. `ShowsStatusPill.tsx` itself untouched. Updated `apps/e2e/tests/shows-index.spec.ts`'s B-tier assertion (no longer requires every B-tile to carry a pill) and added coverage in `ShowsTile.test.tsx` + `TierSection.test.tsx` for the at/past-floor no-pill case. Full verify gate green (3695 unit tests, 1519/1519 static pages, 4898/4898 e2e).
- [x] [MED] /shows/survivor?view=community — the visible APPROVAL % column sits beside a list still in canon order, reading as contradictory (pass: 141 (commit 949a34d3)) — RESOLVED: 2026-08-25, cloud march tick, `/iterate` (external-critique category, highest-priority queue). Took the row's second suggested-fix option: added a persistent `(canon order)` inline flag to the "Approval" column header in `CommunityRankList.tsx`, rendered only while `source !== 'votes'` and styled de-emphasized via a new `.col-bar-note` rule using the existing `--ink-40` token. Two regression tests added (flag present for `source="canon"`, absent for `source="votes"`). Verify gate green: fast gate (3676 unit tests, content:check ok), build (1513 pages), 4879 e2e (30.2m).
- [x] [LOW] /shows/survivor/season/survivor-50 — page `<title>` doubles "Survivor" instead of following the show-page branding pattern (pass: 141 (commit 949a34d3)) — RESOLVED: 2026-09-08, cloud march tick, content-gap redirect per issue #758 (Rule 2 gap table fully starred, Rule 3 list ideas saturated — oldest unresolved CRITIQUE finding picked instead). Root cause was in `seasonDisplayTitle()` (`src/app/shows/[show]/season/[slug]/page.tsx`): the milestone-title branch re-prefixed the show name even when the title already carried it (e.g. "Survivor 50"), producing "Survivor — Survivor 50" in the rendered `<title>`. Changed that branch to return the title bare. Generalizes past the flagged S50 to every self-naming Survivor milestone title (42–50). Two unit tests added/updated in the co-located test file. Verify gate green: fast gate (199 test files/3681 unit tests, test:scripts 146/146, content:check ok), build clean (1515/1515 static pages), e2e 4885/4885 passed (30.8m). Shipped at a178205a.
- [x] [LOW] /shows/survivor/season/survivor-50 — "RETURNING CASTAWAYS ONLY" eyebrow reads as an access restriction on first parse (pass: 141 (commit 949a34d3)) — RESOLVED: 2026-08-24, cloud march tick, content-gap redirect per issue #758. Reworded `content/shows/survivor/seasons/50-survivor-50.md`'s `eyebrow` from "Aired spring 2026 · returning castaways only" to "Aired spring 2026 · all-returnee cast" — drops the ambiguous "only" qualifier while keeping the established "Aired <season> <year> · <detail>" pattern shared by every sibling Survivor season eyebrow. Verify gate green: fast gate (199 test files/3667 unit tests, content:check ok), build clean (1513/1513 static pages), e2e 4879/4879 passed (29.5m). Shipped at c592d9be.
- [x] [MED] /shows/love-island-uk?view=community — mobile drops the 7D trend column while the page-level "voters, last 7 days" stat stays visible (pass: 141 (commit 949a34d3)) — RESOLVED: 2026-09-17, cloud march tick, content-gap redirect per issue #758. Restored a compact 7D trend column at the `@media (max-width: 640px)` breakpoint in `src/styles/canon.css`'s `.cp-cl-cols`/`.cp-cl-row` rules — grid gains a narrow 34px fifth column (`grid-template-columns: 40px 1fr 44px 34px 58px`) and the `RankShiftPill` cells shrink to 3px/6px padding, 10px font to fit. The column header (`.col-trend`, "7d") and per-row pill/em-dash cells now render at 375px instead of being `display: none`, so the per-season trend detail no longer disappears while the page-level "voters, last 7 days" stat stays visible above the table. Fix is CSS-only, no component logic changed. Added a dedicated e2e regression (`apps/e2e/tests/community-page.spec.ts`, "community rank table keeps the 7D trend column visible at 375px (critique pass-141/156)") asserting the header stays visible with text "7d" and no horizontal overflow at 375px on `/shows/love-island-uk?view=community`. Picked up per the established dispatch-starvation workaround: Rule 2 (season-fill) had zero actionable rows (gap table entries are the one known non-actionable `90-day-fiance` mismatch plus confirmed-but-unaired placeholders), Rule 3 (themed lists) was independently reconfirmed exhausted three separate times earlier the same day (commits 99f09b32, dd3704e6, f168625b). Verify gate green: fast gate (199 test files/3687 unit tests, content:check ok — 68 shows, 1052 seasons, 68 canons, 182 themes), build clean (1519/1519 static pages), e2e 4898/4898 passed (19.5m). Shipped at fed0c67e.
- [x] [MED] /shows/amazing-race/season/season-38 — the meta description, the "Shape of the Season" body, and the "What to Watch For" bullets all restate the same two facts three ways (pass: 140 (commit 9cc9376a)) — RESOLVED: 2026-08-24, cloud march tick, content-gap redirect per issue #758. Rewrote the three flagged watch_list bodies (Casting, Hoorn-start route beat, U-Turn format beat) to each carry a distinct, additive angle instead of restating the lede/body clauses verbatim — Casting now points at the house-strategy-vs-race-pressure question, the second entry pivots off the pre-starting-line task detail (previously only a bare `format_changes` line, never explained in prose) and is relabeled "Format · the pre-starting-line task" since it no longer covers Hoorn specifically, and Format now surfaces the separate Double U-Turn Vote mechanic instead of re-defining the survivor penalty. The fourth watch_list entry ("Route · the European arc") and every other field left untouched. Verify gate green: fast gate (199 test files/3666 unit tests, content:check ok), build clean (1513/1513 static pages), e2e 4879/4879 (30.1m). Shipped at c843563d.
- [x] [MED] /shows/bake-off?view=canon — the "◆ HOLD" community-trend badge has no visible legend for readers who can't hover (pass: 140 (commit 9cc9376a)) — RESOLVED: 2026-08-24, cloud march tick, content-gap redirect per issue #758. Added a visible `.cp-community-legend` line ("◆ hold · ↑ / ↓ — community rank shift since the last update") to `CanonEraToolbar`, rendered once per canon pane whenever `ShowRanking` finds at least one ranked entry with a live or fallback community signal — matches the existing `.cp-coverage-note` visual pattern (mono, 11px, ink-55) so it reads as part of the toolbar chrome, not a new UI element. The underlying `title`/`aria-label` gloss on the pill itself is unchanged (still serves hover + screen readers); this adds the always-visible fallback for touch. Picked up per the established dispatch-starvation workaround: Rule 2 (season-fill) confirmed fully starred in `plan/CADENCE.md`, Rule 3 (themed lists) confirmed saturated (14th consecutive same-day zero-ship pass logged in `plan/LISTS.md`). Verify gate green: fast gate (199 test files/3671 unit tests, content:check ok), build clean (1513/1513 static pages), e2e 4879/4879 passed (30.1m). Shipped at 933063f1.
- [x] [LOW] /shows/bake-off?view=canon — Slot #1's "Why This Slot" callout echoes the adjacent body paragraph's location clause (pass: 140 (commit 9cc9376a)) — RESOLVED: 2026-08-25, cloud march tick, content-gap redirect per issue #758 (twentieth same-day-class dispatch to `/ship-content`; the standing gap-drain row is stalled and Rule 3's idea space stayed saturated, so this tick re-audited the CRITIQUE.md Pending list fresh rather than repeating an exhausted search and found three genuinely unaddressed content-only rows — this one shipped, the other two remain queued for a future tick). Dropped the tent-relocation echo from Slot #1's `slot_argument` and replaced it with the comparative canon argument against Slot #2 ("The Last BBC Year") — peak form vs. that series' own valedictory framing. 175 chars, under the 240-char schema cap.
- [x] [LOW] /shows/vanderpump-rules?view=community — weekly community question mixes proximity and vertical metaphors in one sentence (pass: 140 (commit 9cc9376a)) — RESOLVED: 2026-08-25, cloud march tick, content-gap redirect per issue #758 (twenty-first same-day-class dispatch to `/ship-content`; Rule 2 confirmed stalled — `plan/CADENCE.md` still 44/44 gap-slots starred, next sweep due 2026-08-30 — and Rule 3 confirmed exhausted for the day by the nineteenth consecutive same-day zero-ship pass already logged in `plan/LISTS.md` before this tick started). Applied the finding's own first suggested-fix option — dropped "land" and kept the vertical-ranking frame throughout: `weekly_question` now reads "...does Season 12's full cast reset rank closer to Season 9's rebuild, or further below it?" Content-only, one field in `content/shows/vanderpump-rules/canon.md`.
- [x] [MED] /shows/top-chef?view=canon — era-filter chips use two different labeling conventions on the same control row (pass: 139 (commit ee526d1a)) — RESOLVED: 2026-08-24, cloud march tick, content-gap redirect per issue #758. Checked every `label:` string across every `content/shows/*/canon.md` era_bands entry catalog-wide — no other show embeds a season range inside the label string, confirming the bare `<Host> era` pattern (no parenthetical) is the established convention, not the range-inclusive form. Dropped `(S21–S23)` from the Kish era label so both chips on this show now read `Padma era` / `Kish era`. Verify gate green: fast gate (199 test files/3666 unit tests, content:check ok), build clean (1513/1513 static pages), e2e 4879/4879 (30.6m). Shipped at abc1ac14.
- [x] [MED] /shows/top-chef?view=canon — Las Vegas (#1) slot repeats its own body-prose clause verbatim in the "why this slot" callout (pass: 139 (commit ee526d1a)) — RESOLVED: 2026-08-24, cloud march tick, content-gap redirect per issue #758. Rewrote `slot_argument` to drop the shared "raised what a Quickfire was allowed to demand" clause and the Strip/judge's-table/Padma framing already covered by the body, replacing it with a comparative ranking case against the #2 slot (All-Stars) — first-time kitchen-veteran bench vs. eighteen returning alumni. 205 chars, under the 240-char schema cap. Verify gate green: fast gate (199 test files/3666 unit tests, content:check ok), build clean (1513/1513 static pages), e2e 4879/4879 (30.5m). Shipped at 9ee7a4a4.
- [x] [LOW] /shows/survivor/season/survivor-50 — "placeholder, not a verdict" canon framing gives no forward pointer for when it gets revisited (pass: 139 (commit ee526d1a)) — RESOLVED: 2026-08-24, cloud march tick, content-gap redirect per issue #758. Confirmed the text is per-show canon prose (`content/shows/survivor/canon.md`), not a shared template string — grepped the exact phrasing catalog-wide, found only this one instance. Reworded the closing sentence to name the concrete trigger condition ("it holds until the next full canon pass revisits the bottom slots") in place of the vague "once the season gets its full post-finale pass." Trimmed the surrounding sentence to hold the 80-120 word rationale bound (119 words). Picked up per the established dispatch-starvation workaround: Rule 2 (season-fill) confirmed fully starred in `plan/CADENCE.md`, Rule 3 (themed lists) confirmed saturated (fourteenth+ consecutive same-day zero-ship pass logged in `plan/LISTS.md`, issue #758). Verify gate green: fast gate (199 test files/3667 unit tests, content:check ok — 68 shows/1047 seasons/68 canons/181 themes/3 legal docs), build clean (1513 static pages), e2e 4879/4879 passed (30.9m). Shipped at 7320880a.
- [x] [MED] /shows/survivor?view=community — "voters, last 7 days · 0" reads as contradicting the nonzero vote totals in the same table (pass: 139 (commit ee526d1a)) — RESOLVED: 2026-08-24, cloud march tick, content-gap redirect per issue #758. Applied the suggested fix's second option: `CommunityLiveStrip.tsx` now appends " (no new votes since last update)" after the "voters, last 7 days" figure whenever `votersThisWeek === 0` and `source === 'votes'` — the live-vs-mirrored-canon distinction reads as an honest zero rather than a contradiction of the table's nonzero all-time per-row totals. Scoped narrowly to the `votes` source only; the `canon` (below-threshold) case already reads honestly via `formatLastRecompute`'s "votes pending" and needs no extra clause. Picked up per the established dispatch-starvation workaround: Rule 2 (season-fill) confirmed fully starred in `plan/CADENCE.md`, Rule 3 (themed lists) confirmed saturated per `plan/LISTS.md` zero-ship pass logs, issue #758. Added two regression tests to `CommunityLiveStrip.test.tsx` covering both the zero-clause-present and zero-clause-absent cases. Verify gate green: fast gate (199 test files/3673 unit tests), build clean (1513 static pages), e2e 4879/4879 passed (30.0m). Shipped at 1054522d.
- [x] [LOW] /shows/americas-got-talent?view=community — mobile community rank list drops the "Approval" column label, leaving a bare unlabeled "%" (pass: 138 (commit b856e2eb)) — RESOLVED: 2026-08-24, cloud march tick, content-gap redirect per issue #758. Added a `.col-pct-mobile-label` span ("Appr. ") inside `.col-pct`, hidden by default and shown only at the same ≤640px breakpoint where `.col-bar` hides — desktop is unaffected (the full "Approval" header still renders separately there). Regression test added to `CommunityRankList.test.tsx`. Picked up per the established dispatch-starvation workaround: Rule 2 (season-fill) confirmed fully starred in `plan/CADENCE.md`, Rule 3 (themed lists) confirmed saturated (fourteenth consecutive same-day zero-ship pass logged in `plan/LISTS.md`). Verify gate green: fast gate (199 test files/3667 unit tests, content:check ok), build clean (1513/1513 static pages), e2e 4879/4879 (30.6m). Shipped at cf18a893.
- [x] [LOW] /shows/americas-got-talent?view=community — "live" label repeated twice in immediate succession (pass: 137 (commit ed0468ce)) — RESOLVED: 2026-08-24, cloud march tick, content-gap redirect per issue #758. Dropped the redundant "live" text from `CommunityLiveStrip`'s opening span — the dot now sits directly next to "last update" — and left `CanonTabSwitch`'s "live" tab cap untouched (the finding's first suggested-fix option). Regression test added to `CommunityLiveStrip.test.tsx` asserting the first `.cp-live-left` child starts with "last update". Picked up per the established dispatch-starvation workaround: Rule 2 (season-fill) confirmed fully starred in `plan/CADENCE.md`, Rule 3 (themed lists) confirmed saturated (no ledger row review-due in `plan/LISTS.md`). Verify gate green: fast gate (199 files/3666 tests), build clean (1513/1513 static pages), e2e 4879/4879 (29.9m). Shipped at da28c385.
- [x] [MED] [anon] /shows/the-voice/season/the-finale — the `<meta name="description">` tag ends mid-clause on an em-dash and ellipsis in the source HTML (pass: 153 (commit dedb99b7)) — RESOLVED: 2026-09-25, cloud march tick, content-gap redirect (standing season-fill row stalled — Rule 2 fully starred across every CADENCE.md gap-slot per the 2026-09-20 sweep; Rule 3 review floor not due, oldest `last_reviewed` 67 days, well under the 90-day window; full programmatic parse of this file's Pending section found 32 open findings, this was the oldest clean content-only one). Authored `meta_description: "The Voice closes out its fourteen-year run with Reba McEntire, Michael Bublé, Adam Levine, and coaching newcomer Kelsea Ballerini rounding out the panel."` (153 chars) via the `descriptionFor()` escape hatch (`src/app/shows/[show]/season/[slug]/page.tsx:151`) so the meta tag is a complete sentence naming the full coaching panel instead of `clipToSeoBudget(lede)` cutting the em-dash-structured lede off mid-clause after "coaching debut." Content-only, one field, `content/shows/the-voice/seasons/29-the-finale.md`. Shipped at `90cf8db9`.