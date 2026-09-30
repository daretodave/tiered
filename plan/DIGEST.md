# DIGEST — 2026-09-30

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

Four clean `march` ticks since last night's briefing, zero
dispatcher crashes, catalog flat. Rule 2 stayed fully stalled all
window (37/37 gap-slots, every row starred confirmed-but-unaired
except `the-voice`, blocked behind #762), so the loop worked its
fallback lanes instead: a Rule 3 themed-list extend (`moving-day`
gained a rank-12 Traitors S05 entry), a logged zero-ship Rule 3
research pass (fresh census across all 67 shows found no clearable
candidate), a content-gap redirect fix on Big Brother's
`a-summer-of-mystery` `take_h2` (self-containment repair, closing
critique pass-153), and critique pass 176 (1 finding, 0 HIGH).
`e2e-full` posted its **third consecutive red night** — same
standing duration-ceiling breach (candidate #34, now **71 days
unpromoted**) — but tonight's run got unusually close before the
wall: 10,688/10,711 tests complete (99.8%, vs. 82.7% two nights
ago), all completed checks passing. Critique pass 176 surfaced a
fresh instance of the fact-owner-drift voice pattern on the
freshly-premiered Survivor 51 page — the fourth such instance across
the last four content drains, crossing pass-174's own "promote to a
`content-check` invariant if a fourth lands" threshold. Catalog
holds at **68 shows / 1,057 seasons / 68 canons / 182 themes**.
Deploy ready at HEAD `fb1288bd`.

## While you were out

| time (UTC) | commit | verb | outcome |
|---|---|---|---|
| 21:02–21:54 (09-29) | d614ffe2 | content (Rule 3) | themed-list extend — `moving-day` gains rank-12 Traitors S05 entry |
| — 01:50–03:09 | — | e2e-full (nightly) | **red** — third consecutive breach; standard duration-ceiling wall, 10,688/10,711 complete (99.8%), all completed checks passing |
| 00:45–01:33 | b6e0106d | content (Rule 3, zero-ship) | fresh research pass across all 67 shows + two cross-canon angles; no candidate cleared the excellence gate — logged, not silent |
| 06:32–07:21 | b1d1958c, 1517c887 | content (redirect fix) | Big Brother `a-summer-of-mystery` `take_h2` self-containment fix, closing critique pass-153; audit row logged |
| 12:59–13:13 | fb1288bd | critique | pass 176 — 1 finding (0 high, 1 med, 0 low) |

All 4 ticks shipped real work (one a deliberately logged zero-ship,
not a silent no-op); no dispatcher crashes this window.

## The saga

**Rule 2 (season-fill drain):** fully non-actionable the entire
window. Gap table unchanged at **37 shows / 37 gap-slots**; every
row is starred confirmed-but-unaired except `the-voice`, still
blocked behind issue #762's unresolved factual-corruption fix. Next
sweep due 2026-10-04 — the only near-term lever that could reopen
Rule 2 before then is a real air date crossing on an already-starred
row.

**Rule 3 (themed lists):** one genuine extend (`moving-day`, rank-12
Traitors S05 entry, grounded in the season's platform-exclusivity
reversal) plus one honestly logged zero-ship — a fresh per-show
coverage census across all 67 shows and two chased cross-canon
angles (viral pre-fame casting, 3-to-4 judge panel expansion) both
came back already-claimed catalog-wide. The zero-ship is worth
naming explicitly: it's the right outcome when the backlog is
genuinely dry, not a stall to flag.

**Content-gap redirect:** a targeted fix closing critique pass-153 —
Big Brother's `a-summer-of-mystery` `take_h2` line compared itself to
a season the reader hadn't been introduced to yet three sections
later; rewritten to state its own quality without the forward
reference.

**Voice debt watch:** critique pass 176 found the fact-owner-drift
repetition pattern fresh on Survivor 51 (two facts each restated
3-5 times). That's four instances across the last four content
drains (Shark Tank S17 → DWTS S35 + Traitors New Blood → 90 Day
Fiancé S12 → now Survivor 51) — pass-174 explicitly floated
promoting this to a `content-check` invariant "if a fourth lands."
It landed. See Needs you #1.

Catalog: **68 shows / 1,057 seasons / 68 canons / 182 themes** —
flat overnight (both content ticks extended/fixed existing entries,
no new season or list filed; Rule 2 stayed dry).

## Queues now

- **`plan/CRITIQUE.md`**: last pass 176 (2026-09-30, commit
  1517c887), 1 new finding (0 HIGH, 1 MED, 0 LOW) — the Survivor 51
  repetition instance above. Pending queue: 83 open findings (0 HIGH,
  53 MED, 30 LOW), 8 explicitly parked `needs-user-call`; most of the
  rest are single-surface content/voice fixes or a11y/SEO items
  already well-scoped for `/iterate` or a future `/ship-content`
  pass. File too large for a direct `Read`; grep is the safe path.
- **`plan/AUDIT.md`**: 7 open rows, same shape as yesterday plus one
  update appended tonight (the recurring e2e-full row, now **71
  days** unpromoted as candidate #34) — 2 HIGH (`the-voice` factual
  corruption #762, frozen since 2026-08-08; the historical night.yml
  starvation row), 1 standing MED (season-fill drain, 37/37, all
  starred), 1 MED (e2e-full duration-ceiling, red three nights
  running), 2 LOW (SERP description budget; `YEAR_TENURE_RE`
  teen-number gap), 1 LOW (heartbeat false-positive #806, no
  recurrence since filing).
- **`plan/PHASE_CANDIDATES.md`**: last `/expand` pass still 73
  (2026-09-26, commit c66d6e53) — no new pass this window, 4 days
  since last. Candidate #34 (shard e2e-full) crossed **71 days
  unpromoted**, still the file's longest-lived open item; a third
  straight breach — this time nearly clearing the wall at 99.8%
  complete — is the strongest single-night signal yet that the
  ceiling is now marginal rather than comfortably cleared.
- **Open `triage:needs-user`**: 9 issues, unchanged from yesterday —
  #762 (the-voice) remains the oldest live urgency; several stale
  from June–August (#398, #399, #565, #586, #758, #763, #777) plus
  #817 (self-resolved digest crash from 09-25).
- **Open `triage:loop-queued`**: 5 issues, unchanged (#636, #754,
  #785, #787, #806); #636 picked up tonight's recurrence (its
  28th-plus "Recurred" comment).

## Needs you

1. **The fact-owner-drift repetition pattern just crossed its own
   promotion threshold.** Pass-174 named the plan explicitly:
   "promote to a `content-check` invariant if a fourth lands." A
   fourth (Survivor 51, pass 176) has now landed, following Shark
   Tank S17, DWTS S35 + Traitors New Blood, and 90 Day Fiancé S12.
   Worth a dedicated pass to add the lint rule rather than continuing
   to catch each instance by hand in critique.
2. **Candidate #34 (shard e2e-full) crossed 71 unpromoted days**,
   still blocked on a `.github/workflows/e2e-full.yml` edit the cloud
   loop cannot push (lacks the `workflows` OAuth scope). Tonight's
   run completed 99.8% of the catalog before the wall — the ceiling
   is no longer comfortably clearing even on a flat-catalog night.
   Worth promoting the shard fix now rather than waiting for an
   outright majority-incomplete run to force the issue.
3. **the-voice factual corruption (issue #762) is still going
   stale.** No comment since 2026-08-08. Still needs a
   human-reviewed fix — can't ship from the loop given the blast
   radius (8-file renumbering cascade + canon rebase) — and it's the
   sole blocker keeping Rule 2 from fully draining the gap table.
4. **9 open `triage:needs-user` issues**, several stale (oldest:
   #398/#399 from 2026-06-11). Worth an `/oversight` sweep to close
   what's since been superseded.
5. **83-row CRITIQUE.md pending queue** (53 MED, 30 LOW) is large
   enough that a few high-leverage single-file fixes (the `/themes`
   heading-navigation a11y gap, the SEO-clip-budget overrun on
   168/182 theme pages) are sitting open behind lower-value rows
   purely by queue order, not impact. A scored sweep could surface
   the best `/iterate` picks faster than sequential reading.

## Today's intent

With Rule 2 fully starred and Rule 3 freshly mined dry, expect the
next tick to pick up a well-scoped CRITIQUE MED finding — the
`/themes` heading-navigation a11y fix or the SEO-clip-budget overrun
are the highest-leverage single-file changes sitting open. Top
non-content signal: the fact-owner-drift repetition pattern crossing
its own four-instance promotion threshold (Needs you #1) is now the
single clearest case for a same-day `/iterate` or `/oversight` pickup
— it's cheap, well-scoped, and has already been called out twice by
critique itself.

## Tuning proposals

None filed tonight. No fresh gate-mistuning or starvation pattern
surfaced this window beyond what's already tracked — Rule 2/Rule 3
handed off cleanly (including one honestly logged zero-ship), and
`/expand`'s cadence gates correctly stayed closed (no new pass due).
The e2e-full pattern is unchanged in shape from prior nights'
assessment — already fully diagnosed as candidate #34 — but tonight's
99.8%-complete near-miss is a data point worth an explicit flag (see
Needs you #2) rather than a new proposal: the fix is already filed,
it just needs promotion.
