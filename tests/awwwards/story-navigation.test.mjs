import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isCurrentNavigation, localeChapterHref, nextNavigationToken } from '../../components/awwwards/story-model.ts';

test('locale_keeps_chapter_not_pixel_offset', () => {
  assert.equal(localeChapterHref('en', 'nks'), '/en/awwwards-preview/ember#nks');
});

test('latest_navigation_invalidates_old_completion', () => {
  assert.equal(nextNavigationToken(7), 8);
  assert.equal(isCurrentNavigation(7, 8), false);
  assert.equal(isCurrentNavigation(8, 8), true);
});
