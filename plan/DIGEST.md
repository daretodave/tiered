# DIGEST — 2026-09-13

> Overwritten whole each night by `/digest`. History lives in git,
> not in this file.

## Headline

Seven for seven again (one no-op, six shipping) since yesterday's
digest — zero crashes. The saga's headline move: this week's sweep
found `alone-australia` Season 4 had fully aired and lost its star,
and the very next tick drained it clean (3/4 → 4/4, canon rebased,
Season 4 ranked 1 on the arctic-terrain leap) — the gap table is
back to **all-starred** (every remaining row confirmed-but-unaired).
With Rule 2 locked again and Rule 3 quiet after one duplicate-fact
fix, the loop spent the rest of the window on the headline-to-body
echo-drain fallback: two more rounds took the catalog-wide warning
count from 27 to **11**, all of it now concentrated in one file
(`the-city-already-had-a-show.md`). Critique pass 159 fired clean
(0 HIGH, 2 MED — RHOBH repetition, an a11y heading-skip). The story
that still needs a human: **`e2e-full` breached the 75-minute wall a
fourth consecutive night** (10,594 tests, 85.4% complete at cutoff,
worse than last night) — candidate #34 (shard the crawl) is now
**54 days unpromoted**. Deploy is ready at HEAD (0a792117).

## While you were out

| time (UTC) | commit | verb | outcome |
|---|---|---|---|
| 16:28–17:36 | (no commit) | march | no-op tick — nothing actionable found |
| 19:31–19:32 | 8e6e83fc / 91bb824c | content / audit | echo drain round 5 — tied 5-warning pair (`a-way-back-in`, `the-finale-broke-its-own-rulebook`), 27→17 |
| 22:22 | 7de453d1 | content | Rule 3 bug fix — SYTYCD vote-channel fact deduped across two themed lists |
| 00:06 | c7887118 | content | echo drain round 6 — `not-the-usual-order` (6 entries), 17→11 |
| 02:07 | aeec2a31 | sweep | tenth weekly season sweep — 0 new gap-slots, but `alone-australia` S4 confirmed fully aired (loses star), 2 calendar hygiene fixes |
| 06:59 | 2dbb1ea4 | critique | pass 159 — 2 findings (0 HIGH, 2 MED); one systemic community-header finding bumped MED→HIGH on a 5th confirming instance |
| 12:39–13:32 | 659dc023 / 0a792117 | content / audit | `alone-australia` fully drained (3/4→4/4), Season 4 canon-ranked 1, CADENCE gap row removed |

7 of 7 tracked `march` runs since yesterday's digest (16:28 09-12
through 12:39 09-13 UTC) succeeded — no crashes, no self-heals. One
of the seven was a genuine no-op; the other six each shipped a real
change.

## The saga

**Rule 2 (season-fill drain):** briefly unlocked mid-window when the
weekly sweep found `alone-australia` S4 had aired and lost its star,
then closed again same-tick — 4/4 seasons filed, canon rebased
(Season 4's Sápmi/Finland leap ranked 1, edging out the earlier
Fiordland international leap), gap row removed. The CADENCE table is
back to **fully starred** — every remaining row confirmed-but-unaired.
Next weekly sweep due 2026-09-20.

**Rule 3 (themed lists):** one genuine bug fix, not an extend — SYTYCD
Season 8's vote-channel fact (text/online voting arriving alongside
phone) was staked verbatim in two separate themed lists
(`the-vote-left-the-phone-line` and `rulebook-rewritten-every-season`);
now stated once. Catalog holds flat at **182/182** themes.

**Headline-to-body echo drain (fallback lane, issue #758 workaround):**
two more rounds this window — round 5 cleared the tied 5-warning pair
(`a-way-back-in`, `the-finale-broke-its-own-rulebook`), round 6
cleared all 6 warnings in `not-the-usual-order`. Catalog-wide count:
**27 → 11**, and every remaining warning now lives in one file
(`the-city-already-had-a-show.md`) — that's tomorrow's obvious next
target. The-voice's separate 37 `take_h2`/`shape_h2` warnings stay
frozen behind issue #762's factual-corruption block.

Catalog holds at **68 shows / 1,052 seasons / 68 canons / 182
themes** — one season added this window (`alone-australia` S4);
everything else was content-quality rewording.

## Queues now

- **`plan/CRITIQUE.md`**: pass 159 fired at 06:59 — 2 new MED (RHOBH
  `the-renewal`'s three headline facts echoed across five surfaces
  including an un-overridden meta description; a template-level a11y
  heading-skip on the show-home season-card/theme-card grids,
  confirmed on two shows). A fifth confirming instance of the
  standing chopped/american-idol/rhoc community-header finding also
  bumped MED→HIGH. Pending section reads **67 findings** by direct
  heading count — a chunk of that (roughly 24-26, per candidate #29's
  still-unshipped archival housekeeping) are resolved-in-place but
  never pruned from the live ledger, so the true open count is lower
  than 67 but hasn't been re-tallied since that gap was first flagged.
- **`plan/AUDIT.md`**: 7 open rows, unchanged in mix: 2 HIGH
  (the-voice factual corruption #762; night.yml starvation #763, quiet
  this window — no contention observed on tonight's or last night's
  night run), 2 MED (season-fill STANDING ROW, continuously progressed
  via the alone-australia drain; e2e-full duration-ceiling — fourth
  breach night logged), 3 LOW (SERP description budget; `YEAR_TENURE_RE`
  regex gap; heartbeat false-positive #806).
- **`plan/PHASE_CANDIDATES.md`**: 40 candidate headers total, roughly
  34-35 genuinely awaiting promotion once resolved/retired-inline rows
  (#24, #26, #31, #32, and a couple others marked inline) are excluded
  — unchanged in true count, no new candidate filed this window.
  Candidate #34 (shard e2e-full) got tonight's reinforcement: 85.4%
  completion at cutoff, now **54 days unpromoted**.
- **Open `triage:needs-user`**: 8 issues, unchanged — #762 (the-voice)
  and #763 (night starvation) remain the two live ones needing an
  actual decision, both untouched since 2026-08-08 (36 days now).
- **Open `triage:loop-queued`**: 5 issues (#636, #754, #785, #787,
  #806), unchanged — #636 (e2e-full tracking issue) picked up
  tonight's "Recurred" comment too.

## Needs you

1. **Candidate #34 (shard e2e-full) is now 54 days unpromoted, and the
   pattern has hardened into an unbroken streak.** Four consecutive
   nights red now (09-10 through 09-13), tonight's completion (85.4%)
   worse than last night's. This is a `.github/workflows/e2e-full.yml`
   edit the cloud loop structurally cannot push (no `workflows` OAuth
   scope) — a local/`/oversight` session is the only path to
   promotion.
2. **the-voice factual corruption (issue #762) — S30 premieres in 8
   days (2026-09-21, NBC).** S22-29 stays frozen pending a
   human-reviewed 8-file renumbering fix. The show's live frontmatter
   still reads `status: hiatus` with a "the show has ended" framing
   that scout-verified research says is false.
3. **`plan/CRITIQUE.md`'s Pending section is at 67 headings and
   climbing** without the archival pass candidate #29 calls for. Not
   urgent on its own (no HIGH sitting unaddressed), but worth a glance
   next `/oversight` session so the live ledger doesn't keep growing
   on stale resolved-in-place rows.

## Today's intent

Content-gap ticks should finish the headline-to-body echo class —
11 warnings remain, all in `the-city-already-had-a-show.md` — while
Rule 2 stays locked until the 2026-09-20 sweep and Rule 3 sits quiet
after this window's one bug fix. Once the echo-drain lane clears,
worth a redirect back to `plan/CRITIQUE.md`'s pass-159 findings (both
MED, neither spoiler-adjacent) before it grows further. Top
non-content finding, unchanged in kind and now sharper on duration:
candidate #34 (shard e2e-full) at 54 days unpromoted, four consecutive
nights red — this has been well past the point of needing an
`/oversight` decision for weeks; another reinforcement pass adds
streak data, not new information.

## Tuning proposals

No new candidates filed tonight. One reinforcement update: candidate
#34 got tonight's breach data (10,594 tests, 85.4% completion at the
75-minute cutoff, fourth consecutive red night) appended to its
existing write-up in `plan/AUDIT.md`. This is evidence-gathering on an
already-filed, already-unpromoted candidate, not a new proposal. No
gate mistuning observed otherwise — the loop correctly found and
finished the one real season-fill gap the sweep surfaced, then fell
back to the echo-drain lane cleanly. Worth flagging for a future
`/oversight` glance, not a fresh candidate: `plan/CRITIQUE.md`'s
Pending section has grown past the point where candidate #29's
archival gap is cosmetic — 67 headings makes the live ledger
genuinely harder to scan for the next `/iterate` tick.
