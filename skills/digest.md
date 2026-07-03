# Skill: digest

> **The night shift.** One tick a day: take the loop's pulse,
> write the morning briefing to `plan/DIGEST.md`, read the
> nightly breadth run's verdict, propose gate tunings as
> candidates — never apply them. The instrument panel,
> delivered instead of fetched.

## 1. Purpose

The dispatcher's ticks are visible one at a time; nobody reads
thirty run logs. This verb compresses a day of loop activity —
content drained, shows scaffolded, no-ops, crashes — into one
committed, phone-readable file. On tiered.tv the loop's primary
mission is the content saga (see the standing directive in
`plan/steps/01_build_plan.md` and the content-velocity rules in
`plan/bearings.md`), so the digest is first and foremost the
saga's progress report.

## 2. Invocation

```
/digest                      # the full nightly pass
```

Runs from `.github/workflows/night.yml` (daily, ~06:30 ET) or
by hand. Never dispatched by `/march` — it is its own loop
shape with its own cadence.

## 3. The procedure

1. **Sync:** `git pull --ff-only`.
2. **Gather the pulse:**

   ```bash
   git log --since="26 hours ago" --oneline
   gh run list --workflow march -L 40 \
     --json displayTitle,conclusion,createdAt,updatedAt
   gh run list --workflow e2e-full -L 2 \
     --json conclusion,createdAt          # the breadth verdict
   gh run list --workflow night -L 2 --json conclusion
   pnpm deploy:check                      # deploy state at HEAD
   ```

   Plus queue states: `plan/AUDIT.md` — open `content-gaps`
   rows per wave (seasons remaining per show, new-show queue
   depth) and non-content Pending rows; `plan/CRITIQUE.md`
   last pass number + age; `plan/PHASE_CANDIDATES.md` pending;
   open `triage:needs-user` / `triage:loop-queued` issues.
3. **The breadth verdict — read, don't run.** The nightly
   breadth e2e already runs as `e2e-full.yml` (~23:25 UTC).
   The digest reads its latest conclusion; a red run becomes a
   HIGH `plan/AUDIT.md` row — the digest files it, the next
   dispatcher tick fixes it. Never re-run the breadth suite
   from this skill.
4. **Write `plan/DIGEST.md`** — overwrite entirely; it is a
   snapshot, not a ledger. Sections, in order: `Headline`,
   `While you were out` (pulse table: tick, verb, outcome —
   no-ops included), `The saga` (shows scaffolded + seasons
   drained in the last 26h; queue depth remaining per wave;
   velocity vs the three bearings rules), `Queues now`,
   `Needs you` (blocked rows, `triage:needs-user` issues),
   `Today's intent` (the saga's next drain targets + top
   non-content finding), `Tuning proposals` (step 5, or
   "none").
5. **Meta-loop, within rails:** if the pulse shows a mistuned
   gate (critique never firing, the ceiling hibernating
   productive days, a starved content queue that `/expand`
   hasn't refilled), file the tuning as a
   `plan/PHASE_CANDIDATES.md` candidate citing the pulse
   numbers. **Never edit gates, cadences, ceilings, or rules
   directly** — proposals only; `/oversight` promotes. The
   loop does not vote on its own constraints.
6. **Commit + push:** one commit `digest: <YYYY-MM-DD>`, push.

## 4. Hard rules

1. Overwrite `plan/DIGEST.md` whole; history lives in git.
2. Ship nothing else — breadth failures become findings, not
   fixes. The night shift briefs; the dispatcher ships.
3. Proposals, never actions (the meta-loop rail).
4. A quiet day still gets a digest — "quiet" is information.
5. **Notes-only commit — the `/jot` carve-out applies.** The
   digest writes `plan/` prose only: no verify gate, no deploy
   gate (same rationale as `skills/jot.md` — no code change,
   nothing to verify). If a digest tick ever touches anything
   outside `plan/`, it has gone wrong — stop and file an issue
   instead.
6. One commit; cloud ticks carry the `Cloud-Run:` trailer.
7. No `Co-Authored-By`, no emojis, no `--no-verify` — the
   standing rules apply at 3am too.

## 5. Failure modes

1. **`gh` unavailable** — degrade to a git-only pulse; note
   the degradation in the digest itself.
2. **e2e-full red** — that's a finding (HIGH AUDIT row), not a
   stop; the digest ships with the finding filed.
3. **`git pull` divergence** — stop, per the standing rules.
4. **Deploy red at HEAD** — report it in `Needs you`; the
   digest still ships (it is how the red deploy gets seen).

## 6. Quick reference

```bash
plan/DIGEST.md                          # the deliverable (overwrite)
plan/AUDIT.md                           # breadth failures + saga queue
plan/PHASE_CANDIDATES.md                # tuning proposals land here
gh run list --workflow march -L 40      # the invisible no-ops
gh run list --workflow e2e-full -L 2    # the breadth verdict (read-only)
git commit -m "digest: <YYYY-MM-DD>" && git push origin main
```
