# DIGEST — 2026-09-14

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

Quieter window: 7 tracked `march` ticks since yesterday's digest
(16:38 09-13 through 14:24 09-14 UTC), one of them a crash. Four
ticks shipped genuine themed-list extends (Rule 3); two more were
audit-only zero-ship notes — Rule 2 stayed locked the entire window
(CADENCE gap table fully starred, 39 rows) while Rule 3 chased 11
fresh angles across those two ticks and rejected every one on
evidence. The 07:08 tick crashed outright — `error: Prompt is too
long`, the same self-healing SDK-context-growth failure mode as
issue #565 (open since 2026-06-11) — no code shipped, the workflow's
own safety net filed the recurrence comment, nothing for this digest
to fix. The story that still needs a human: `e2e-full` breached the
75-minute wall a **fifth consecutive night** (10,602 tests, ~84.1%
complete at cutoff — worse than last night's 85.4%) — candidate #34
(shard the crawl) is now **55 days unpromoted**. Deploy is ready at
HEAD (0d8f5d4e).

## While you were out

| time (UTC) | commit | verb | outcome |
|---|---|---|---|
| 16:38–17:36 | 35439a9d / 3969047a | content / plan | themed-list extend — too-few-to-call-it-all-stars (5 new entries) |
| 18:58–19:42 | 682db125 / d0bba9fc | content / audit | themed-list extend — best-location-reveals (alone-australia S4 staked, rank 11) |
| 21:23–22:06 | e89c5fcb / 1bf35a92 | content / audit | themed-list extend — the-cast-outgrew-the-format |
| 23:30–00:14 | 42b6352a | audit | Rule 2 re-confirmed stalled; Rule 3 zero-ship — 5 candidate angles chased, all dead-ended |
| 01:39–02:37 | 852dcbb6 | audit | Rule 2 re-confirmed stalled; Rule 3 zero-ship — 6 more angles chased, all rejected on evidence |
| 07:08–07:32 | (no commit) | march | **crashed** — SDK `Prompt is too long`, self-healed via issue #565's recurrence comment |
| 14:24–15:12 | 0d8f5d4e | content | themed-list extend — the season the audience showed up all at once |

6 of 7 tracked runs completed (5 shipped, 1 audit-only zero-ship
folds into that count — see above), 1 crashed and self-healed with
no code change.

## The saga

**Rule 2 (season-fill drain):** locked the entire window. The
CADENCE gap table held at 39 confirmed-but-unaired rows — both
zero-ship audit ticks independently re-read it and found nothing
newly actionable. Next weekly sweep due 2026-09-20.

**Rule 3 (themed lists):** four genuine extends shipped
(too-few-to-call-it-all-stars +5 entries, best-location-reveals +1,
the-cast-outgrew-the-format, the-season-the-audience-showed-up-all-
at-once), plus two zero-ship ticks that chased 11 total candidate
angles (seeded-returnee re-derivation, Big Brother S18 Battle-Back,
MAFS Australia S05, RHOM S04 revival-cast, streaming-migration,
cross-franchise cameo, physical-endurance, judging-panel-size,
military-service casting, auction/sealed-vote mechanics, era-category
headroom) and rejected every one — sub-floor, off-thesis, or facts
already staked. Zero-ship is a valid outcome per the standing rule,
logged in `plan/LISTS.md` so future ticks don't re-walk the same
ground. Catalog holds flat at **68 shows / 1,052 seasons / 68 canons
/ 182 themes** — no new season, no new theme this window; all
movement was extends to existing lists.

The 11-dead-end density across two consecutive Rule-3 ticks (while
Rule 2 stayed locked) is the same dispatch-starvation shape issue
#758 already names — not a new signal, but worth noting the angle
supply is visibly thinning on nights Rule 2 doesn't open.

## Queues now

- **`plan/CRITIQUE.md`**: still at pass 159 (2026-09-13) — no
  critique gate fire this window (posture: last pass same-day as
  recent ticks, threshold not yet cleared). Pending section holds
  flat at **67 findings**, unchanged from yesterday. Candidate #29's
  archival pass is still unshipped.
- **`plan/AUDIT.md`**: 7 open rows, same mix as yesterday: 2 HIGH
  (the-voice factual corruption #762; night.yml starvation, mirrors
  candidate #35 — quiet this window, no contention observed on
  tonight's run), 2 MED (season-fill STANDING ROW, continuously
  reconfirmed; e2e-full duration-ceiling — fifth breach night
  logged), 3 LOW (SERP description budget; `YEAR_TENURE_RE` regex
  gap; heartbeat false-positive #806).
- **`plan/PHASE_CANDIDATES.md`**: ~34-35 candidates genuinely
  awaiting promotion, unchanged in count — no new candidate filed
  this window. Candidate #34 (shard e2e-full) got tonight's
  reinforcement: 84.1% completion at cutoff, worse than last night,
  now **55 days unpromoted**. Candidate #35 (decouple night.yml) sits
  at **49 days unpromoted**, no new occurrence this window (tonight's
  run started clean at 16:25 UTC, no march contention).
- **Open `triage:needs-user`**: 8 issues, unchanged — #762
  (the-voice) and the night-starvation thread remain the two live
  ones needing an actual decision, still untouched since 2026-08-08
  (37 days now).
- **Open `triage:loop-queued`**: 5 issues (#636, #754, #785, #787,
  #806), unchanged — #636 (e2e-full tracking issue) picked up
  tonight's fifth "Recurred" comment.

## Needs you

1. **Candidate #34 (shard e2e-full) is now 55 days unpromoted, fifth
   consecutive red night, and the completion trend is getting worse
   (84.1% tonight vs. 85.4% last night) as the catalog keeps
   growing.** This is a `.github/workflows/e2e-full.yml` edit the
   cloud loop structurally cannot push (no `workflows` OAuth scope)
   — a local/`/oversight` session is the only path to promotion.
2. **the-voice factual corruption (issue #762) — S30 premieres in 7
   days (2026-09-21, NBC).** S22-29 stays frozen pending a
   human-reviewed 8-file renumbering fix. The show's live frontmatter
   still reads `status: hiatus` with a "the show has ended" framing
   that scout-verified research says is false.
3. **The 07:08 cloud tick crashed with `Prompt is too long`** — the
   same self-healing failure mode tracked since 2026-06-11 (issue
   #565, 9+ recurrences). Not urgent on its own (no code shipped, no
   state corrupted) but it's been recurring for over two months
   without a structural fix (turn/time caps on the SDK call, or
   splitting long ticks) — still parked for `/oversight` per the
   existing triage note.
4. **`plan/CRITIQUE.md`'s Pending section is holding at 67
   headings**, unchanged tonight but still without the archival pass
   candidate #29 calls for. Not urgent, worth a glance next
   `/oversight` session.

## Today's intent

Rule 2 stays locked until the 2026-09-20 sweep. Rule 3 keeps
extending on whatever fresh angle survives the search — tonight's
11 rejected angles suggest the easy headroom is thinning, so expect
more zero-ship audit ticks like today's two before the next sweep
reopens Rule 2. Top non-content finding, unchanged in kind and now
sharper: candidate #34 (shard e2e-full) at 55 days unpromoted, five
consecutive red nights with a worsening completion trend — this has
been well past the point of needing an `/oversight` decision for
weeks; another reinforcement pass adds streak data, not new
information.

## Tuning proposals

No new candidates filed tonight. The 11-dead-end density across
today's two Rule-3 zero-ship ticks is reinforcing evidence for the
already-open issue #758 (content-gap dispatch starving `/iterate`
on nights Rule 2 stays locked) — not a new proposal, since #758
already names this exact shape. No gate mistuning observed
otherwise: the loop correctly recognized Rule 2 as locked, searched
Rule 3 honestly, shipped when it found real material, and logged
zero-ship reasoning instead of forcing a bad extend when it didn't.
Worth a future `/oversight` glance (not urgent): `plan/CRITIQUE.md`'s
Pending section has sat at 67 for two digest cycles now without the
candidate #29 archival pass landing.
