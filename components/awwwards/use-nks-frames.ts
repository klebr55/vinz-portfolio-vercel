import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

const FRAME_COUNT = 283;
const WINDOW_RADIUS = 5;

type Entry = { image: HTMLImageElement; loaded: boolean };

export function useNksFrames(canvasRef: RefObject<HTMLCanvasElement | null>, invalidateScene: RefObject<(() => void) | null>) {
  const cache = useRef(new Map<number, Entry>());
  const target = useRef(0);
  const painted = useRef(-1);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const paint = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const entry = cache.current.get(index);
    if (!canvas || !entry?.loaded || painted.current === index) return;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;
    context.drawImage(entry.image, 0, 0, canvas.width, canvas.height);
    painted.current = index;
    canvas.dataset.frame = String(index);
    setReady(true);
    invalidateScene.current?.();
  }, [canvasRef, invalidateScene]);

  const load = useCallback((index: number) => {
    if (index < 0 || index >= FRAME_COUNT || cache.current.has(index)) return;
    const image = new window.Image();
    const entry = { image, loaded: false };
    cache.current.set(index, entry);
    image.onload = () => {
      entry.loaded = true;
      if (target.current === index) paint(index);
    };
    image.onerror = () => {
      cache.current.delete(index);
      if (target.current === index && painted.current < 0) setFailed(true);
    };
    image.src = `/awwwards/nks-frames/frame-${String(index + 1).padStart(3, '0')}.webp`;
  }, [paint]);

  const request = useCallback((progress: number) => {
    const index = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(progress * (FRAME_COUNT - 1))));
    target.current = index;
    load(index);
    paint(index);
    for (let distance = 1; distance <= WINDOW_RADIUS; distance++) {
      load(index - distance);
      load(index + distance);
    }
    for (const [key, entry] of cache.current) {
      if (Math.abs(key - index) > WINDOW_RADIUS + 4) {
        entry.image.onload = null;
        entry.image.onerror = null;
        if (!entry.loaded) entry.image.src = '';
        cache.current.delete(key);
      }
    }
  }, [load, paint]);

  useEffect(() => {
    const entries = cache.current;
    request(0);
    return () => {
      for (const entry of entries.values()) {
        entry.image.onload = null;
        entry.image.onerror = null;
      }
      entries.clear();
    };
  }, [request]);

  return { request, ready, failed, painted };
}
