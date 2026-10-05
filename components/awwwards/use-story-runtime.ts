'use client';

import { useCallback, useLayoutEffect, useRef, useState, type MutableRefObject, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { chapterFromHash, chapterIds, checkpointY, isCurrentNavigation, nextNavigationToken, resolveStoryState, type ChapterId, type ChapterRange, type StorySample } from './story-model';

export type StoryRuntime = {
  sample: MutableRefObject<StorySample>;
  activeChapter: ChapterId;
  jumpTo(id: ChapterId, mode: 'animated' | 'immediate', focus: boolean): void;
  refresh(): void;
};

export function useStoryRuntime(root: RefObject<HTMLElement | null>, reducedMotion: boolean): StoryRuntime {
  const sample = useRef<StorySample>({ chapterId: 'intro', localProgress: 0, reading: true });
  const ranges = useRef<ChapterRange[]>([]);
  const lenis = useRef<Lenis | null>(null);
  const token = useRef(0);
  const navigating = useRef(false);
  const anchoredChapter = useRef<ChapterId | null>(null);
  const [activeChapter, setActiveChapter] = useState<ChapterId>('intro');

  const refresh = useCallback(() => {
    ScrollTrigger.refresh();
    lenis.current?.resize();
    const elements = chapterIds.map((id) => root.current?.querySelector<HTMLElement>(`[data-story-chapter="${id}"]`)).filter((item): item is HTMLElement => Boolean(item));
    const starts = elements.map((element) => Math.round(element.getBoundingClientRect().top + window.scrollY));
    ranges.current = elements.map((element, index) => {
      const id = element.dataset.storyChapter as ChapterId;
      const startY = starts[index];
      const endY = starts[index + 1] ?? Math.round(element.getBoundingClientRect().bottom + window.scrollY);
      const readingElement = element.querySelector<HTMLElement>('[data-story-read]');
      const anchorId = readingElement?.dataset.storyReadAnchor;
      const readingPosition = anchorId ? element.querySelector<HTMLElement>(`#${CSS.escape(anchorId)}`) ?? readingElement : readingElement;
      const readingOffset = readingElement?.dataset.storyReadOffset === 'navigation' ? Math.max(100, (document.querySelector('header')?.getBoundingClientRect().bottom ?? 80) + 20) : Math.min(170, window.innerHeight * 0.17);
      const preferred = id === 'intro' ? startY : readingPosition ? Math.round(readingPosition.getBoundingClientRect().top + window.scrollY - readingOffset) : startY;
      return { id, startY, readY: Math.min(Math.max(startY, preferred), Math.max(startY, endY - 1)), endY };
    });
    if (anchoredChapter.current && !navigating.current) {
      const target = checkpointY(anchoredChapter.current, ranges.current);
      lenis.current?.scrollTo(target, { immediate: true, force: true });
      window.scrollTo(0, target);
    }
    sample.current = resolveStoryState(window.scrollY, ranges.current);
    setActiveChapter(sample.current.chapterId);
  }, [root]);

  const jumpTo = useCallback((id: ChapterId, mode: 'animated' | 'immediate', focus: boolean) => {
    const currentToken = token.current = nextNavigationToken(token.current);
    anchoredChapter.current = null;
    navigating.current = true;
    const target = checkpointY(id, ranges.current);
    const finish = () => {
      if (!isCurrentNavigation(currentToken, token.current)) return;
      navigating.current = false;
      anchoredChapter.current = id;
      if (!focus) return;
      const heading = root.current?.querySelector<HTMLElement>(`[data-story-chapter="${id}"] [data-story-read]`);
      heading?.focus({ preventScroll: true });
    };
    if (mode === 'immediate' || reducedMotion || !lenis.current) {
      lenis.current?.scrollTo(target, { immediate: true, force: true });
      window.scrollTo(0, target);
      requestAnimationFrame(finish);
    } else {
      lenis.current.scrollTo(target, { duration: 1.05, force: true, onComplete: finish });
    }
  }, [reducedMotion, root]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    let measureFrame = 0;
    let disposed = false;
    const measure = () => {
      if (disposed) return;
      cancelAnimationFrame(measureFrame);
      measureFrame = requestAnimationFrame(refresh);
    };
    const observer = new ResizeObserver(measure);
    if (root.current) observer.observe(root.current);
    root.current?.querySelectorAll<HTMLElement>('[data-story-chapter]').forEach((element) => observer.observe(element));
    const onScroll = () => {
      const next = resolveStoryState(lenis.current?.scroll ?? window.scrollY, ranges.current);
      sample.current = next;
      setActiveChapter((previous) => previous === next.chapterId ? previous : next.chapterId);
      root.current?.style.setProperty('--chapter-progress', String(next.localProgress));
    };
    const cancelTravel = () => {
      anchoredChapter.current = null;
      if (!navigating.current) return;
      {
        const current = resolveStoryState(lenis.current?.scroll ?? window.scrollY, ranges.current).chapterId;
        history.replaceState(null, '', `#${current}`);
      }
      navigating.current = false;
      token.current = nextNavigationToken(token.current);
      if (lenis.current) lenis.current.scrollTo(lenis.current.scroll, { immediate: true, force: true });
    };
    const onScrollKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return;
      if (event.key === ' ' && target?.closest('button, a, [role="button"]')) return;
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) cancelTravel();
    };
    const onHistory = () => {
      if (disposed) return;
      const id = window.location.hash ? chapterFromHash(window.location.hash) : 'intro';
      if (id) {
        anchoredChapter.current = id;
        refresh();
        requestAnimationFrame(() => { if (!disposed) jumpTo(id, 'immediate', false); });
      }
    };

    if (!reducedMotion) {
      const instance = new Lenis({ autoRaf: false, anchors: false, duration: 1.15, smoothWheel: true, syncTouch: false });
      lenis.current = instance;
      const ticker = (time: number) => instance.raf(time * 1000);
      const syncTrigger = () => ScrollTrigger.update();
      instance.on('scroll', syncTrigger);
      gsap.ticker.add(ticker);
      const onVisibility = () => {
        if (document.hidden) instance.stop();
        else { instance.start(); measure(); }
      };
      document.addEventListener('visibilitychange', onVisibility);
      (window as typeof window & { __lenis?: Lenis }).__lenis = instance;
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('wheel', cancelTravel, { passive: true, capture: true });
      window.addEventListener('touchstart', cancelTravel, { passive: true, capture: true });
      window.addEventListener('keydown', onScrollKey, true);
      window.addEventListener('popstate', onHistory);
      window.addEventListener('hashchange', onHistory);
      document.fonts?.ready.then(measure).catch(() => undefined);
      anchoredChapter.current = chapterFromHash(window.location.hash);
      measure();
      if (window.location.hash) requestAnimationFrame(onHistory);
      return () => {
        disposed = true;
        token.current = nextNavigationToken(token.current);
        navigating.current = false;
        cancelAnimationFrame(measureFrame);
        observer.disconnect();
        document.removeEventListener('visibilitychange', onVisibility);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('wheel', cancelTravel, true);
        window.removeEventListener('touchstart', cancelTravel, true);
        window.removeEventListener('keydown', onScrollKey, true);
        window.removeEventListener('popstate', onHistory);
        window.removeEventListener('hashchange', onHistory);
        instance.off('scroll', syncTrigger);
        gsap.ticker.remove(ticker);
        instance.destroy();
        lenis.current = null;
        delete (window as typeof window & { __lenis?: Lenis }).__lenis;
      };
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', cancelTravel, { passive: true, capture: true });
    window.addEventListener('touchstart', cancelTravel, { passive: true, capture: true });
    window.addEventListener('keydown', onScrollKey, true);
    window.addEventListener('popstate', onHistory);
    window.addEventListener('hashchange', onHistory);
    document.fonts?.ready.then(measure).catch(() => undefined);
    anchoredChapter.current = chapterFromHash(window.location.hash);
    measure();
    if (window.location.hash) requestAnimationFrame(onHistory);
    return () => {
      disposed = true;
      token.current = nextNavigationToken(token.current);
      navigating.current = false;
      cancelAnimationFrame(measureFrame);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', cancelTravel, true);
      window.removeEventListener('touchstart', cancelTravel, true);
      window.removeEventListener('keydown', onScrollKey, true);
      window.removeEventListener('popstate', onHistory);
      window.removeEventListener('hashchange', onHistory);
    };
  }, [jumpTo, reducedMotion, refresh, root]);

  return { sample, activeChapter, jumpTo, refresh };
}
