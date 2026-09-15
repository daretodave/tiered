# DIGEST — 2026-09-15

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

Quiet content window, clean operations: 5 tracked `march` ticks since
yesterday's digest (16:30 09-14 through 12:46 09-15, ~20h), all green
— no crashes this time, an improvement on yesterday's one. Rule 2
stayed fully locked (CADENCE gap table unchanged at 39 shows / 40
gap-slots, every row confirmed-but-unaired) and Rule 3 ran a second
exhaustive fresh-angle search and again found nothing that cleared
the bar — zero new seasons, zero new themes this window. But the
issue-#758 redirect mechanic did real work instead of idling: it
fixed the oldest actionable HIGH critique finding (`CommunityRankList`
mobile header dropping its "(canon order)" qualifier — reproduced on
5 shows across 4 passes since 2026-09-11) and, separately, shipped a
spoiler-safe post-finale canon reorder for Below Deck Mediterranean
S11. Critique pass 160 ran clean (0 console errors, 0 spoiler leaks
across 9 URLs) with 2 new MED findings, 0 HIGH. The one open story:
`e2e-full` breached its 75-minute wall for a **sixth consecutive
night** (9,247/10,602 tests complete at cutoff, 87.2% — better than
last night's 84.1% but still a full breach); candidate #34 (shard the
crawl) is now 55 days unpromoted. Deploy is ready at HEAD (db2228f5).

## While you were out

| time (UTC) | commit | verb | outcome |
|---|---|---|---|
| 19:35–20:17 | 950e4e8d / 7eeb9379 | fix / audit | content-gap redirect — `CommunityRankList` mobile now keeps the "(canon order)" qualifier; resolves the oldest Pending HIGH critique finding |
| 22:44–22:56 | 890d1de4 | critique | pass 160 — 2 new findings (0 high, 2 med, 0 low), site reads clean on spoilers/console/mobile-overflow |
| 01:19–02:13 | 16d538f2 / ef3ad300 | content / audit | finale-shift — Below Deck Mediterranean S11 moves up one canon slot (ratings/renewal only, no outcome disclosed) |
| 06:41–07:27 | 6d576700 | audit | Rule 2 re-confirmed stalled; Rule 3 zero-ship (no fresh search — same-day exhaustion already logged) |
| 12:35–12:48 | db2228f5 | audit | Rule 2 re-verified stalled; Rule 3 zero-ship (fresh 5-angle search this time, all rejected) |

5 of 5 tracked runs completed and shipped something (2 zero-ship
audit notes counted in that, per the standing rule that a logged
zero-ship is a valid outcome, not a failure). No crashes this window.

## The saga

**Rule 2 (season-fill drain):** locked the entire window. CADENCE
gap table held flat at **39 shows carrying a gap / 40 gap-slots**,
every row starred confirmed-but-unaired — the 2026-09-13 tenth full
weekly sweep is still the freshest read (next sweep due 2026-09-20).
One thing worth watching: `masterchef` (US) S16's finale is now dated
**2026-09-17**, two days out — the first genuinely near-term
actionable event since the sweep, and the next Rule 2 pick once it
lands.

**Rule 3 (themed lists):** zero-ship both ticks this window — one
skipped the search as low-value (same-day exhaustion already logged
hours earlier), the other ran a genuine fresh 5-angle search (real-
family casting, confessional-as-craft-device, tiebreaker mechanics,
production-halt disruption, casting-diversity firsts) and rejected
every angle on the cross-canon floor or prior-collision grounds.
Rejection reasoning logged to `plan/LISTS.md` Ideas so no future tick
re-walks this ground. Catalog holds flat at **68 shows / 1,052
seasons / 68 canons / 182 themes** — no new season or theme this
window; the only content motion was the Below Deck Mediterranean
canon reorder (no new files) and the mobile-UI fix.

Net: for the second straight window, the fallback the loop leans on
when both Rule 2 and Rule 3 are genuinely dry is the critique-redirect
path (issue #758's pattern) — and this window it actually paid off
with a real HIGH-severity fix instead of just another zero-ship note.
That's the mechanism working as intended, not starvation.

## Queues now

- **`plan/CRITIQUE.md`**: pass 160 (2026-09-14 22:53). The Pending
  section carries **69 headings total, but only 44 are genuinely
  still open** (0 HIGH / 27 MED / 17 LOW) — the other 25 already
  carry inline `RESOLVED (...)` notes and were never moved to `##
  Done`. That gap is exactly what candidate #29's archival pass would
  fix. File itself is now **2.1MB** (was 1.5MB when #29 was filed
  2026-07-09) — this digest tick hit the same 25K-token `Read` ceiling
  candidate #29 describes when trying to read `AUDIT.md` and
  `PHASE_CANDIDATES.md` directly, confirming the defect firsthand.
- **`plan/AUDIT.md`**: 1.2MB, 7 Pending rows: 2 HIGH (the-voice
  factual corruption #762; night.yml starvation, mirrors candidate
  #35), 1 MED standing (season-fill drain, continuously reconfirmed),
  1 MED (e2e-full duration-ceiling — sixth breach night logged), 3 LOW
  (SERP description budget; `YEAR_TENURE_RE` regex gap; heartbeat
  false-positive #806).
- **`plan/PHASE_CANDIDATES.md`**: 424KB, ~29-30 candidates awaiting
  promotion in the "Considered" section, no new candidate filed this
  window. Candidate #34 (shard e2e-full) — 55 days unpromoted, sixth
  consecutive red night. Candidate #35 (decouple night.yml) — 50 days
  unpromoted, no new occurrence this window (both this and yesterday's
  night runs completed cleanly). Candidate #29 (archive closed rows)
  — 68 days unpromoted, reinforced by this tick's own read-ceiling hit.
- **Open `triage:needs-user`**: 8 issues, unchanged — #762 (the-voice)
  and the night-starvation thread (#763) remain the two live ones
  needing an actual decision, untouched since 2026-08-08 (38 days).
- **Open `triage:loop-queued`**: 5 issues (#636, #754, #785, #787,
  #806), unchanged — #636 (e2e-full tracking issue) picked up
  tonight's sixth "Recurred" comment instead of a new filing.

## Needs you

1. **Candidate #34 (shard e2e-full) is now 55 days unpromoted, sixth
   consecutive red night.** This is a `.github/workflows/e2e-full.yml`
   edit the cloud loop structurally cannot push (no `workflows` OAuth
   scope) — a local/`/oversight` session is the only path to
   promotion. Tonight's completion (87.2%) ticked up from last
   night's 84.1%, so it isn't monotonically worsening, but six straight
   breach nights with zero new information each time is the same
   standing ask.
2. **the-voice factual corruption (issue #762) — S30 premieres in 6
   days (2026-09-21, NBC).** S22-29 stays frozen pending a
   human-reviewed 8-file renumbering fix; live frontmatter still
   reads `status: hiatus` with a "the show has ended" framing that
   scout-verified research says is false.
3. **Candidate #29 (archive closed CRITIQUE.md/AUDIT.md rows) — 68
   days unpromoted, and the underlying problem is now directly
   confirmed twice over**: `CRITIQUE.md` has grown from 1.5MB to
   2.1MB since filing, and this very digest tick hit the file's
   25K-token `Read` ceiling reading `AUDIT.md`/`PHASE_CANDIDATES.md`
   directly, exactly as candidate #29 predicted. The Pending section's
   real open-finding count (44) is now meaningfully smaller than its
   heading count (69) — the ledger is actively getting harder to read
   correctly without the archive mechanism.
4. **Night.yml (candidate #35) has now run clean two nights running**
   — no contention observed either night. Worth noting as the
   opposite of urgent: if this holds for a few more nights, #35 may
   be safe to defer further in favor of #34/#29.

## Today's intent

Rule 2 stays locked until either the 2026-09-20 sweep or the
`masterchef` S16 finale lands 2026-09-17 (two days out) — that's the
next concrete Rule 2 trigger to watch for. Rule 3 will likely keep
returning zero-ship on nights it's tried, per the same thinning-
headroom pattern issue #758 already names; expect the critique-redirect
path to keep absorbing ticks when both rules are dry, which is fine as
long as there's a real Pending HIGH finding to redirect to (there
currently isn't one — pass 160 confirms zero open HIGH findings, so
the next dry Rule 2/3 tick has nothing obvious to redirect to and may
produce a genuine zero-ship). Top non-content finding, unchanged in
kind: candidate #34 at 55 days unpromoted, six consecutive red
nights — still needing an `/oversight` decision.

## Tuning proposals

No new candidates filed tonight. Reinforcing evidence only, for two
already-open candidates:

- **Candidate #29** (archive closed ledger rows): this tick
  independently confirmed the problem by hitting the same 25K-token
  `Read` ceiling on `AUDIT.md` and `PHASE_CANDIDATES.md` that
  candidate #29's filing describes, and found `CRITIQUE.md`'s Pending
  section carries 25 already-resolved headings mixed in with 44
  genuinely open ones (69 total) — the exact bookkeeping drift #29
  was filed to fix, now demonstrably worse (1.5MB → 2.1MB since
  filing).
- **Candidate #34** (shard e2e-full): sixth consecutive breach night,
  87.2% complete at cutoff.

No gate mistuning observed otherwise — Rule 2/3 correctly recognized
their own stall and the content-gap dispatch correctly redirected to
a real HIGH fix instead of forcing a zero-ship no-op or a mediocre
list.
