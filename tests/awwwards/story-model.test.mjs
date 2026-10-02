import assert from 'node:assert/strict';
import { test } from 'node:test';
import { chapterFromHash, checkpointY, resolveStoryState } from '../../components/awwwards/story-model.ts';
import { editorialCases, publicCaseFields } from '../../components/awwwards/case-content.ts';

const ranges = [
  { id: 'intro', startY: 0, readY: 0, endY: 100 },
  { id: 'sdimt', startY: 100, readY: 140, endY: 300 },
  { id: 'nks', startY: 300, readY: 360, endY: 600 },
];

test('direct_entry_selects_nks_without_intro', () => {
  assert.deepEqual(resolveStoryState(450, ranges), { chapterId: 'nks', localProgress: 0.5, reading: true });
  assert.equal(checkpointY('nks', ranges), 360);
});

test('boundaries_clamp_and_choose_next', () => {
  assert.equal(resolveStoryState(300, ranges).chapterId, 'nks');
  assert.equal(resolveStoryState(-20, ranges).localProgress, 0);
  assert.equal(resolveStoryState(900, ranges).localProgress, 1);
});

test('aliases_are_locale_independent', () => {
  assert.equal(chapterFromHash('#projects'), 'sdimt');
  assert.equal(chapterFromHash('#nks'), 'nks');
  assert.equal(chapterFromHash('#unknown'), null);
});

test('unverified_fields_are_not_public', () => {
  const fields = publicCaseFields(editorialCases['pt-br'][0]);
  assert.ok(fields.length > 0);
  assert.ok(fields.every((field) => field.verified));
  assert.ok(fields.every((field) => !field.text.includes('não comprovado')));
});
