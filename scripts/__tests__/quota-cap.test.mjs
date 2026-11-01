// The plain-text usage-cap reader in scripts/cloud/quota.mjs (plan/AUDIT.md
// HIGH row, 2026-10-19): a run that ends "You're out of extra usage · resets
// 8am (UTC)" carries no rate_limit_info, so without capFromText the gate
// failed open and every tick until the reset burned a CI run.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { capFromText, capResetAt, decide, main, CAP_FALLBACK_MS } from '../cloud/quota.mjs';

const NOW = new Date('2026-10-18T19:42:51Z');

test('time-only reset resolves to the next occurrence (later today or tomorrow)', () => {
  assert.equal(capResetAt('8am', NOW), '2026-10-19T08:00:00Z');
  assert.equal(capResetAt('9:30pm', NOW), '2026-10-18T21:30:00Z');
  assert.equal(capResetAt('12am', NOW), '2026-10-19T00:00:00Z');
  assert.equal(capResetAt('12pm', NOW), '2026-10-19T12:00:00Z');
});

test('dated reset uses the named day, rolling the year forward when needed', () => {
  assert.equal(capResetAt('Oct 19, 8am', NOW), '2026-10-19T08:00:00Z');
  assert.equal(capResetAt('Nov 2 at 8:30pm', NOW), '2026-11-02T20:30:00Z');
  assert.equal(capResetAt('Jan 2, 8am', new Date('2026-12-31T10:00:00Z')), '2027-01-02T08:00:00Z');
});

test('unreadable reset phrases return null', () => {
  assert.equal(capResetAt('soon', NOW), null);
  assert.equal(capResetAt('Foo 3, 8am', NOW), null);
  assert.equal(capResetAt('25:00', NOW), null);
});

test('capFromText reads the exact October outage strings', () => {
  assert.deepEqual(capFromText("Claude Code returned an error result: You're out of extra usage · resets 8am (UTC)", NOW), {
    utilization: 1,
    status: 'rejected',
    resetsAt: '2026-10-19T08:00:00Z',
  });
  assert.equal(capFromText("You're out of extra usage · resets Oct 19, 8am (UTC)", NOW).resetsAt, '2026-10-19T08:00:00Z');
});

test('capFromText falls back to a short hold when the reset is unreadable, and ignores unrelated text', () => {
  const q = capFromText("You're out of extra usage · resets whenever (UTC)", NOW);
  assert.equal(q.status, 'rejected');
  assert.equal(Date.parse(q.resetsAt), NOW.getTime() + CAP_FALLBACK_MS - (NOW.getTime() % 1000));
  assert.equal(capFromText('All tests passed. resets 8am (UTC) mentioned in prose', NOW), null);
  assert.equal(capFromText('', NOW), null);
});

test('read caches a rejected reading from a cap-only execution file, and the gate then skips until the reset', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'quota-cap-'));
  const exec = path.join(dir, 'exec.json');
  const cache = path.join(dir, 'quota.json');
  fs.writeFileSync(
    exec,
    JSON.stringify([{ type: 'result', is_error: true, result: "You're out of extra usage · resets 8am (UTC)" }]),
  );
  const code = await main(['read', exec, '--cache', cache, '--run', '1'], { env: {}, now: NOW });
  assert.equal(code, 0);
  const saved = JSON.parse(fs.readFileSync(cache, 'utf8'));
  assert.equal(saved.status, 'rejected');
  assert.equal(saved.resetsAt, '2026-10-19T08:00:00Z');

  const before = decide({ cache: saved, pause: null, kind: 'scheduled', max: 0.9, now: new Date('2026-10-19T03:00:00Z') });
  assert.equal(before.skip, true);
  const after = decide({ cache: saved, pause: null, kind: 'scheduled', max: 0.9, now: new Date('2026-10-19T08:05:00Z') });
  assert.equal(after.skip, false);
});

test('a structured rejected reading wins over the text fallback', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'quota-cap-'));
  const exec = path.join(dir, 'exec.json');
  const cache = path.join(dir, 'quota.json');
  fs.writeFileSync(
    exec,
    JSON.stringify([
      { type: 'rate_limit_event', rate_limit_info: { rateLimitType: 'seven_day', status: 'rejected', resetsAt: '2026-10-20T00:00:00Z' } },
      { type: 'result', is_error: true, result: "You're out of extra usage · resets 8am (UTC)" },
    ]),
  );
  await main(['read', exec, '--cache', cache], { env: {}, now: NOW });
  assert.equal(JSON.parse(fs.readFileSync(cache, 'utf8')).resetsAt, '2026-10-20T00:00:00Z');
});
