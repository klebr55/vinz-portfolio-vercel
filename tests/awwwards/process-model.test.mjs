import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveProcessFrame } from '../../components/awwwards/identity/process-model.ts';

test('process drawing, filling and orientation clamp at their reading endpoints', () => {
  assert.equal(resolveProcessFrame(-1).drawn, 0);
  assert.equal(resolveProcessFrame(.10).drawn, 0);
  assert.equal(resolveProcessFrame(.42).drawn, 1);
  assert.equal(resolveProcessFrame(.38).filled, 0);
  assert.equal(resolveProcessFrame(.62).filled, 1);
  assert.deepEqual(resolveProcessFrame(1.2), resolveProcessFrame(1));
  assert.equal(resolveProcessFrame(.78).rotateX, 8);
  assert.equal(resolveProcessFrame(.78).rotateY, -16);
  assert.ok(resolveProcessFrame(.7).drawn > resolveProcessFrame(.3).drawn);
  assert.ok(resolveProcessFrame(.7).filled > resolveProcessFrame(.3).filled);
});
