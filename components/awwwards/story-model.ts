import type { PrototypeLocale } from './prototype-copy';

export const chapterIds = ['intro', 'sdimt', 'nks', 'milan', 'sincad', 'criactive', 'about', 'process', 'testimonials', 'contact'] as const;
export type ChapterId = (typeof chapterIds)[number];
export type ChapterRange = { id: ChapterId; startY: number; readY: number; endY: number };
export type StorySample = { chapterId: ChapterId; localProgress: number; reading: boolean };

const hashAliases: Record<string, ChapterId> = {
  intro: 'intro', projects: 'sdimt', sdimt: 'sdimt', nks: 'nks', milan: 'milan',
  sincad: 'sincad', criactive: 'criactive', about: 'about', process: 'process',
  testimonials: 'testimonials', contact: 'contact',
};

export function resolveStoryState(y: number, ranges: readonly ChapterRange[]): StorySample {
  if (ranges.length === 0) return { chapterId: 'intro', localProgress: 0, reading: false };
  const position = Number.isFinite(y) ? y : 0;
  const range = ranges.find((item, index) => position < item.endY || index === ranges.length - 1)!;
  const length = Math.max(1, range.endY - range.startY);
  const localProgress = Math.min(1, Math.max(0, (position - range.startY) / length));
  return { chapterId: range.id, localProgress, reading: position >= range.readY && position < range.endY };
}

export function checkpointY(id: ChapterId, ranges: readonly ChapterRange[]): number {
  return ranges.find((range) => range.id === id)?.readY ?? 0;
}

export function chapterFromHash(hash: string): ChapterId | null {
  return hashAliases[decodeURIComponent(hash.replace(/^#/, '').toLowerCase())] ?? null;
}

export function localeChapterHref(locale: PrototypeLocale, id: ChapterId): string {
  return `/${locale}/awwwards-preview/ember#${id}`;
}

export function nextNavigationToken(current: number): number {
  return current + 1;
}

export function isCurrentNavigation(candidate: number, current: number): boolean {
  return candidate === current;
}
