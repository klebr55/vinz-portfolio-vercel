'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import type { MotionValue } from 'motion';
import type { PrototypeLocale } from '../prototype-copy';
import { createSdimtFrameCache } from './sdimt-frame-cache';
import { resolveSdimtFrame, sdimtFramePath, SDIMT_CACHE_LIMITS, SDIMT_FRAME_BYTES } from './sdimt-sequence-model';
import styles from '../story-prototype.module.css';

type Bitmap = ImageBitmap | HTMLImageElement;
type Props = { progress: MotionValue<number>; active: boolean; paused: boolean; reducedMotion: boolean; locale: PrototypeLocale };

async function decode(index: number, signal: AbortSignal): Promise<Bitmap> {
  const response = await fetch(sdimtFramePath(index), { signal });
  if (!response.ok) throw new Error(`SDIMT frame ${response.status}`);
  const blob = await response.blob();
  if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
  if (typeof createImageBitmap === 'function') return createImageBitmap(blob);
  const url = URL.createObjectURL(blob);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new window.Image();
      const abort = () => { image.src = ''; reject(new DOMException('Aborted', 'AbortError')); };
      const cleanup = () => signal.removeEventListener('abort', abort);
      image.onload = () => { cleanup(); resolve(image); };
      image.onerror = () => { cleanup(); reject(new Error('SDIMT image decode failed')); };
      signal.addEventListener('abort', abort, { once: true }); image.src = url;
    });
  } finally { URL.revokeObjectURL(url); }
}

export function SdimtRotatoMedia({ progress, active, paused, reducedMotion }: Props) {
  const root = useRef<HTMLDivElement>(null), canvas = useRef<HTMLCanvasElement>(null);
  const cache = useRef<ReturnType<typeof createSdimtFrameCache<Bitmap>> | null>(null);
  const allowed = useRef(false); allowed.current = active && !paused && !reducedMotion;
  useEffect(() => {
    const surface = canvas.current, element = root.current;
    if (reducedMotion || !surface || !element) return;
    const context = surface.getContext('2d'); if (!context) return;
    const resize = () => {
      const width = Math.max(1, Math.round(element.clientWidth * Math.min(devicePixelRatio, 1.5))), height = Math.round(width * 1620 / 1600);
      if (surface.width === width && surface.height === height) return;
      const previous = document.createElement('canvas'); previous.width = surface.width; previous.height = surface.height;
      previous.getContext('2d')?.drawImage(surface, 0, 0);
      surface.width = width; surface.height = height; context.drawImage(previous, 0, 0, width, height);
      previous.width = previous.height = 0;
    };
    resize();
    const scheduler = createSdimtFrameCache<Bitmap>({ limits: innerWidth <= 760 ? SDIMT_CACHE_LIMITS.mobile : SDIMT_CACHE_LIMITS.desktop,
      bytesPerFrame: SDIMT_FRAME_BYTES, load: decode,
      dispose: bitmap => { if ('close' in bitmap) bitmap.close(); else bitmap.src = ''; },
      paint: bitmap => {
        context.clearRect(0, 0, surface.width, surface.height);
        context.drawImage(bitmap, 1000, 0, 1600, 1620, 0, 0, surface.width, surface.height); element.dataset.presented = 'true';
      },
    });
    cache.current = scheduler; scheduler.setActive(allowed.current && !document.hidden);
    scheduler.request(resolveSdimtFrame(progress.get()));
    const unsubscribe = progress.on('change', value => scheduler.request(resolveSdimtFrame(value)));
    const visibility = () => scheduler.setActive(allowed.current && !document.hidden);
    const observer = new ResizeObserver(() => { resize(); scheduler.setLimits(innerWidth <= 760 ? SDIMT_CACHE_LIMITS.mobile : SDIMT_CACHE_LIMITS.desktop); }); observer.observe(element); document.addEventListener('visibilitychange', visibility);
    return () => { unsubscribe(); observer.disconnect(); document.removeEventListener('visibilitychange', visibility); scheduler.clear(); cache.current = null; };
  }, [progress, reducedMotion]);
  useEffect(() => { cache.current?.setActive(active && !paused && !reducedMotion && !document.hidden); }, [active, paused, reducedMotion]);
  return <div ref={root} className={styles.sdimtRotatoMedia} aria-hidden="true">
    <Image className={styles.sdimtRotatoPoster} src="/awwwards/sdimt/rotato-poster.webp" alt="" width={2880} height={1620} sizes="(max-width: 760px) 180vw, 100vw" unoptimized />
    {!reducedMotion && <canvas ref={canvas} className={styles.sdimtRotatoCanvas} />}
  </div>;
}
