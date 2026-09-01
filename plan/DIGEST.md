# tiered.tv — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

# DIGEST — 2026-09-01

## Headline

**A 26-hour window of near-continuous content-gap drain (43 commits, one march tick failed and self-recovered) that closed an entire defect class catalog-wide and opened a new one.** The `watch_list` cross-callout phrase-repetition drain (issue #325) ran rounds 2 through 13 and finished — chopped's round 13 was the last show in the queue, closing the class end-to-end. With that queue empty, the loop picked up `plan/CADENCE.md`'s stalled Rule 2 (all 44 gap-table rows are starred confirmed-but-unaired) and fell through to two fallback objectives: the **season-eyebrow calendar-drift** drain (issue #317, critique pass-33 — an eyebrow naming one calendar season that contradicts its own `premiere_date` month) drained 33 of 72 catalog-wide instances across five ticks, leaving americas-got-talent (10), bachelorette (11), and survivor (18) — 39 seasons — queued; and a brand-new **`filming_caption` bare-restatement** drain (round 1, 7 of ~101 found instances) started mid-window. A pass-149 critique HIGH (systemic meta-description duplicate content) and a separate CRITIQUE HIGH (vote-pair pre-vote triple-stack) both got fixed same-day. Catalog held flat at 68 shows / 1048 seasons / 68 canons / 181 themes; content-check warnings dropped from 175 to 169. Deploy is green at HEAD (`c24ddf3`). Two things need eyes: `e2e-full` breached its 75-minute duration ceiling again both nights (08-31, 09-01 — 42 days unresolved, cloud-blocked), and the night shift itself was starved out for **three straight nights** (08-29 through 08-31) by the same march-concurrency-eviction race documented since 07-21 — the longest unbroken loss streak since the original week-long gap.

## While you were out

| Time (UTC) | Verb | Outcome |
|---|---|---|
| 10:25 (08-31) | content-gap | shipped — `watch_list` cross-callout drain, round 1 continuation — 8 smallest-scope shows |
| 11:00–17:14 | content-gap | shipped — `watch_list` drain rounds 2–9 (5-tied-smallest, 4-tied-smallest, bachelor-in-paradise, top-chef, survivor-australia, bake-off, married-at-first-sight-australia, survivor) |
| 13:57 | voice fix | shipped — dropped duplicate zero-state CTA from a signed-in vote-pair; resolved CRITIQUE pre-vote triple-stack HIGH |
| 14:57 | critique | pass 148 — 6 findings (0 high, 4 med, 2 low) |
| 18:03–21:27 | content-gap | shipped — `watch_list` drain rounds 10–13 — the-challenge, americas-got-talent, the-real-world, chopped (round 13 = **queue closed catalog-wide**) |
| 19:44 | march tick | **failed** — SDK error "Prompt is too long" (the stale #565 signature, not the org-access one); self-recovered next tick, no gap |
| 21:52 | critique | pass 149 — 4 findings (1 bumped to high, 2 med, 1 low) |
| 23:16 | seo fix | shipped — systemic meta-description duplicate-content defect (pass-149 HIGH) resolved same-day |
| 00:06–08:36 (09-01) | content-gap | shipped — season-eyebrow calendar-drift drain, 6 ticks: 13 seasons/10 shows, amazing-race (4), americas-next-top-model (4), american-idol (6), masterchef (6) |
| 02:44 | content-gap | shipped — `filming_caption` bare-restatement drain, round 1 (7 seasons, new defect class) |

No true no-ops this window — every completed `march` tick landed a ship; the one failure self-healed on the next scheduled trigger with no lost work.

## The saga

**Rule 2 (season-fill):** still fully stalled — the CADENCE gap table holds at 42 gap-slots / 42 shows (2026-08-30 sweep), every slot starred confirmed-but-unaired. No literal season-fill shipped this window; the standing AUDIT row (line 31, score 4.5) continues to ride two fallback side-drains instead.

**Fallback drain #1 — `watch_list` cross-callout repetition (issue #325): CLOSED.** Rounds 2–13 this window finished the queue catalog-wide (chopped was the last show, round 13). A full defect class drained end-to-end in one 26-hour window — the queue that opened it isn't named in this window's log, so it's unclear exactly how many rounds preceded round 2, but the closure itself is unambiguous per round-13's own commit message and round-1 of the next drain citing it as "closed catalog-wide."

**Fallback drain #2 — season-eyebrow calendar drift (issue #317, critique pass-33): 33/72 done.** Started this window (previous side-drains, `take_h2` and the older watch_list rounds, had already completed). Five ticks cleared the long tail (every show carrying 1–3 instances, 13 seasons/10 shows in one batch) plus amazing-race, americas-next-top-model, american-idol, and masterchef in full. Remaining, smallest-scope-first: americas-got-talent (10), bachelorette (11), survivor (18) — 39 seasons across 3 shows.

**Fallback drain #3 — `filming_caption` bare-restatement: 7/~101 found, round 1 only.** New this window — the location-field frontmatter bare-restates itself with no added information (e.g. "Antigua, Caribbean" when `location` is already "Antigua"), the same defect shape `episodes_caption` and `cast_size_caption` already have dedicated linters for for but this one doesn't yet. No new `content-check.ts` collector added — the tick chose hand-fixing smallest-scope-first over new enforcement machinery. ~94 instances remain, no collector to track exact progress mechanically yet.

**Rule 3 (themed lists):** silent this window, 181 held flat — saturated per `plan/LISTS.md`'s 2026-08-31 notes and issue #758's dispatch-ordering pattern; the content-gap side-drains keep winning Step 3b.5.

## Queues now

- `plan/AUDIT.md` Pending: the standing season-fill/side-drain combined row (`category: content-gaps`, updated 6 times this window), plus 6 non-content rows — 2 HIGH (the-voice S22-29 corruption, `triage:needs-user`, untouched this window; night.yml starvation — **new 3-night-gap update filed this tick**), 2 MED (e2e-full duration-ceiling, updated both nights this window; a resolved-then-reopened item not present — none), 2 LOW (themed-list description SERP-budget overrun; `YEAR_TENURE_RE` teen-number gap).
- `plan/CRITIQUE.md` Pending: 8 open rows as of pass 149 (2026-08-31) — down from the pass-147 backlog the last digest flagged; both HIGH findings from that backlog (meta-description echo, vote-pair pre-vote stack) got fixed same-day this window, and pass-148/149 each landed findings that mostly cleared inline too.
- `plan/PHASE_CANDIDATES.md`: last pass 67 (2026-08-30, commit 6a26f261) plus this tick's reinforcement update to candidate #35. Candidate #33 (content-gaps gate needs a bug-priority carve-out), #34 (shard e2e-full, 42 days unpromoted), #35 (decouple night.yml concurrency, 42 days unpromoted, worst loss streak yet), #36 (the-voice remediation), #37 (org-access fallback) all remain `/oversight`-only promotions.
- Open `triage:needs-user`: 5 issues (#777, #763, #762, #758, #565), unchanged this window.
- Open `triage:loop-queued`: 4 issues (#787, #785, #754, #636) — #636 (e2e-full tracker) freshly commented both nights this window, 40th+ recurrence comment.
- Unlabeled/needs-triage queue: 0 — clean.

## Needs you

- **Night shift lost three straight nights (08-29, 08-30, 08-31) to the same march-concurrency-eviction race first diagnosed 07-21 (candidate #35).** This is the longest unbroken loss streak since the original week-long gap that prompted the finding, 42 days ago. The fix (`night.yml` gets its own concurrency group, or a lighter re-pull-before-commit substitute for the race it currently guards against) is a workflow-file edit the cloud loop's token structurally cannot push — needs a local/`/oversight` session.
- **`e2e-full` is now 42 days into the same unresolved cloud-blocked timeout** (candidate #34, shard the crawl). Both nights this window bred the identical 75-minute-wall breach, flat test count (~10,565), all completed checks passing — zero test-quality regression, purely a duration ceiling the catalog has outgrown.
- **the-voice S22-29 factual corruption** (issue #762, `triage:needs-user`) remains an 8-file renumbering cascade needing a human-reviewed `/oversight` session — untouched this window, no new violations spotted either.

## Today's intent

The saga's next drain targets: season-eyebrow calendar drift continues on americas-got-talent (10), bachelorette (11), survivor (18) — 39 seasons, smallest-scope-first; `filming_caption` bare-restatement continues from round 1's 7/~101. Rule 2 stays dormant until a CADENCE sweep unstars a slot (next sweep window ~09-06). Top non-content finding: the night.yml starvation race just posted its worst streak yet — worth weighing whether candidate #35's mechanical fix (own concurrency group + re-pull-before-commit) finally clears the `/oversight` bar this cycle.

## Tuning proposals

Reinforced, not new: appended a fresh 3-night-loss update to `plan/AUDIT.md`'s standing night-starvation row and to `plan/PHASE_CANDIDATES.md` candidate #35, citing the 08-29/08-30/08-31 cancelled runs (33248067249, 33306737061, 33383044473) — the worst unbroken streak since the original filing. No new candidate shape identified this window; #33/#34/#35/#36/#37 already cover every gate-tuning signal visible in this pulse.
