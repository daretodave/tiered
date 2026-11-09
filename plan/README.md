# plan/

The plan tree is the loop's working memory across context loss.

```
plan/
├── README.md                       this file
├── bearings.md                     stack, voice, standing decisions, hard rules
├── steps/
│   └── plan/README.md            at-a-glance status + per-phase scope
├── phases/
│   ├── phase_1_bootstrap.md        first-shipped phase, detailed
│   ├── phase_6_show_home.md        canonical sibling for show families
│   ├── phase_9_season_page.md      canonical sibling for season pages
│   └── phase_<N>_<topic>.md        per-phase brief
├── AUDIT.md                        open audit findings — /iterate's queue
├── CRITIQUE.md                     external-observer findings — /iterate's second queue
└── CANDIDATES.md             /expand outputs awaiting /oversight promotion
```

Read order on session start:
1. `spec.md` (repo root) — what tiered.tv is
2. `agents.md` (repo root) — standing rules
3. `plan/bearings.md` — stack + decisions
4. `plan/README.md` — what's pending
5. The relevant phase brief in `plan/README.md`
6. The relevant skill file in `skills/`

## Lanes

**Asap** (built before the table, in this order, once their
needs are done):

- (none yet)

**Held** (waits on a person's word; never picked until the
line goes; each line is a lock that times out:
`- **<NN.k>** · <reason> · since: <date> · until: <date or
condition> · max_age: 14d`, an optional `· fallback: release`):

- 51 · auto-promoted, veto until 2026-11-10 (#843) · max_age: 1d · fallback: release

## Specs

| # | Initiative | Spec | Status | Progress |
|---|---|---|---|---|
| 50 | Canon-rationale / season-body verbatim-argument echo gate | [50-canon-rationale-season-body-echo-gate.md](50-canon-rationale-season-body-echo-gate.md) | Ready | Not chunked yet. |
| 51 | Spoiler-language heuristic gate | [51-spoiler-language-heuristic-gate.md](51-spoiler-language-heuristic-gate.md) | Held (veto window) | Not chunked yet. |
