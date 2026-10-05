import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveSdimtFrame, sdimtFramePath, SDIMT_FRAME_BYTES, SDIMT_CACHE_LIMITS } from '../../components/awwwards/chapters/sdimt-sequence-model.ts';
import { createSdimtFrameCache } from '../../components/awwwards/chapters/sdimt-frame-cache.ts';

const settle = () => new Promise(resolve => setImmediate(resolve));
function fixture(limits = SDIMT_CACHE_LIMITS.mobile) {
  const jobs = [], painted = [], disposed = [];
  const cache = createSdimtFrameCache({ limits, bytesPerFrame: SDIMT_FRAME_BYTES,
    load: (index, signal) => new Promise((resolve, reject) => jobs.push({ index, signal, resolve, reject })),
    dispose: frame => disposed.push(frame), paint: (frame, index) => painted.push(index),
  });
  const done = async (index, fail = false) => {
    await settle();
    const job = jobs.find(job => job.index === index && !job.finished);
    assert.ok(job, `missing job ${index}`); job.finished = true;
    if (fail) job.reject(new Error('404')); else job.resolve({ index });
    await settle();
  };
  return { cache, jobs, painted, disposed, done };
}

test('source endpoints and six-digit paths exclude the empty tail', () => {
  assert.equal(resolveSdimtFrame(0), 1); assert.equal(resolveSdimtFrame(1), 241);
  assert.equal(resolveSdimtFrame(NaN), 1); assert.equal(resolveSdimtFrame(-3), 1);
  assert.equal(resolveSdimtFrame(4), 241);
  assert.equal(sdimtFramePath(0), '/awwwards/sdimt/motion-sdimt/frame_000001.webp');
  assert.equal(sdimtFramePath(999), '/awwwards/sdimt/motion-sdimt/frame_000241.webp');
  assert.equal(SDIMT_FRAME_BYTES, 18662400);
});

test('a late decode never paints over a reversed target; failures retain the last valid frame', async () => {
  const f = fixture(); f.cache.request(181); f.cache.request(120);
  await f.done(181); assert.deepEqual(f.painted, []);
  assert.ok(f.disposed.some(frame => frame.index === 181));
  await f.done(120); assert.deepEqual(f.painted, [120]);
  f.cache.request(200);
  for (const job of f.jobs.filter(job => !job.finished && job.index !== 200)) await f.done(job.index);
  await f.done(200, true);
  assert.equal(f.cache.stats().displayed, 120);
  assert.deepEqual(f.painted, [120]); f.cache.clear();
});

test('reservations count toward both limits even when aborted decoders ignore their signal', async () => {
  const f = fixture({ maxEntries: 3, maxDecodedBytes: SDIMT_FRAME_BYTES * 2, concurrency: 2 });
  f.cache.request(20); await settle();
  for (const target of [70, 100, 180, 241]) {
    f.cache.request(target); const s = f.cache.stats();
    assert.ok(s.entries + s.pending <= 2); assert.ok(s.estimatedDecodedBytes <= SDIMT_FRAME_BYTES * 2);
  }
  for (const job of [...f.jobs]) if (!job.finished) await f.done(job.index);
  await f.done(241);
  assert.equal(f.painted.at(-1), 241);
  assert.ok(f.cache.stats().peakPending <= 2);
  assert.ok(f.cache.stats().peakEntries <= 2);
  assert.ok(f.disposed.length > 0); f.cache.clear();
});

test('inactive loading stops; resume requests only the latest target and clear disposes late results', async () => {
  const f = fixture(); f.cache.setActive(false); f.cache.request(90);
  assert.equal(f.jobs.length, 0); f.cache.request(130); f.cache.setActive(true); await settle();
  assert.equal(f.jobs[0].index, 130);
  f.cache.setActive(false); const count = f.jobs.length;
  for (const job of [...f.jobs]) await f.done(job.index);
  assert.equal(f.jobs.length, count); assert.deepEqual(f.painted, []);
  f.cache.request(160); f.cache.setActive(true); await settle(); assert.ok(f.jobs.some(job => job.index === 160));
  f.cache.clear(); f.cache.clear();
  for (const job of [...f.jobs]) if (!job.finished) { assert.equal(job.signal.aborted, true); await f.done(job.index); }
  assert.equal(f.cache.stats().estimatedDecodedBytes, 0);
  assert.deepEqual(f.painted, []); assert.equal(f.disposed.length, f.jobs.length);
});

test('eviction releases bitmaps; decoded neighbors can serve a target without another fetch', async () => {
  const f = fixture(); f.cache.request(10); await f.done(10); await f.done(11);
  const count = f.jobs.length; f.cache.request(11);
  assert.equal(f.painted.at(-1), 11); assert.ok(f.jobs.length <= count + 1);
  f.cache.request(200);
  assert.ok(f.disposed.some(frame => frame.index === 10));
  f.cache.clear(); for (const job of [...f.jobs]) if (!job.finished) await f.done(job.index);
  assert.equal(f.cache.stats().entries, 0);
});

test('desktop to mobile resize releases excess entries while retaining decode reservations', async () => {
  const f = fixture(SDIMT_CACHE_LIMITS.desktop); f.cache.request(100); await settle();
  for (const index of [100,101,99]) await f.done(index);
  f.cache.setLimits(SDIMT_CACHE_LIMITS.mobile);
  const s = f.cache.stats();
  assert.ok(s.entries + s.pending <= 3); assert.ok(s.estimatedDecodedBytes <= 64 * 1024 * 1024);
  f.cache.clear(); for (const job of [...f.jobs]) if (!job.finished) await f.done(job.index);
});
