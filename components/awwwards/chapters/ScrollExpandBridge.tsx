'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import type { MotionValue } from 'motion';
import type { PrototypeLocale } from '../prototype-copy';
import styles from '../story-prototype.module.css';

type BridgeMedia = { poster: string; video: string; alt: string; source: string };
const smooth = (a: number, b: number, p: number) => {
  const t = Math.max(0, Math.min(1, (p - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export function ScrollExpandBridge({ locale, paused, reducedMotion, progress, active, media, togglePause }: { locale: PrototypeLocale; paused: boolean; reducedMotion: boolean; progress: MotionValue<number>; active: boolean; media: BridgeMedia; togglePause(): void }) {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const visual = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const title = useRef<HTMLParagraphElement>(null);
  const scrim = useRef<HTMLDivElement>(null);
  const controls = useRef<HTMLElement>(null);
  const delivered = useRef(false);
  const session = useRef(false);

  useEffect(() => {
    const element = root.current;
    const player = video.current;
    if (!element || !player) return;
    let token = 0;
    let requested = false;
    let failed = false;
    let previous = progress.get();
    let reversing = false;
    let callback = 0;
    let pendingFrame = 0;
    let disposed = false;
    const state = (value: string) => { element.dataset.bridgePhase = value; };
    const suspend = () => {
      token++;
      requested = false;
      player.pause();
      if (callback && player.cancelVideoFrameCallback) player.cancelVideoFrameCallback(callback);
      callback = 0;
      if (pendingFrame) cancelAnimationFrame(pendingFrame);
      pendingFrame = 0;
    };
    const wanted = () => active && !paused && !reducedMotion && !document.hidden && progress.get() >= .999 && !reversing && !failed && !player.ended;
    const present = (intent: number) => {
      if (disposed || intent !== token || !wanted()) return;
      delivered.current = true;
      session.current = true;
      element.dataset.presentedFrame = 'true';
      element.dataset.presentedAt = String(performance.now());
      state('playing');
      if (visual.current) visual.current.dataset.videoPresented = 'true';
    };
    const sync = () => {
      const p = progress.get();
      element.dataset.bridgeProgress = String(p);
      if (!active && p <= .001) {
        suspend();
        delivered.current = false;
        session.current = false;
        if (visual.current) visual.current.dataset.videoPresented = 'false';
        element.dataset.presentedFrame = 'false';
        if (player.readyState) player.currentTime = 0;
        state('still');
        return;
      }
      if (!wanted()) {
        if (requested || !player.paused) suspend();
        state(failed ? 'fallback' : delivered.current ? (active ? 'frozen' : 'handoff') : p > 0 ? 'expanding' : 'still');
        return;
      }
      if (requested) return;
      requested = true;
      const intent = ++token;
      if (player.requestVideoFrameCallback) callback = player.requestVideoFrameCallback(() => { callback = 0; present(intent); });
      player.play().then(() => {
        if (disposed || intent !== token || !wanted()) {
          if (disposed || !wanted()) player.pause();
          return;
        }
        if (!player.requestVideoFrameCallback) pendingFrame = requestAnimationFrame(() => {
          pendingFrame = requestAnimationFrame(() => { pendingFrame = 0; if (player.readyState >= 2 && player.currentTime > 0) present(intent); });
        });
      }).catch(() => {
        if (disposed || intent !== token) return;
        failed = true;
        suspend();
        state('fallback');
      });
    };
    const apply = (p: number) => {
      reversing = p < previous - .0001 ? true : p > previous + .0001 ? false : reversing;
      previous = p;
      const e = smooth(0, 1, p);
      const mobile = matchMedia('(max-width: 760px)').matches;
      const width = (mobile ? 78 : 42) + (mobile ? 22 : 58) * e;
      const height = 58 + 42 * e;
      if (frame.current) frame.current.style.clipPath = `inset(${(100 - height) / 2}% ${(100 - width) / 2}% round ${24 * (1 - e)}px)`;
      if (visual.current) visual.current.style.transform = `scale(${1.35 - .35 * e})`;
      if (title.current) {
        const out = smooth(.4, .88, p);
        title.current.style.opacity = String(1 - out);
        title.current.style.transform = `translate3d(0,${-28 * out}px,0)`;
      }
      if (controls.current) controls.current.hidden = !active || p > 1.5;
      if (scrim.current) scrim.current.style.opacity = String(1 - smooth(.4, .95, p));
      sync();
    };
    const error = () => { failed = true; suspend(); state('fallback'); };
    const ended = () => { requested = false; state('frozen'); };
    document.addEventListener('visibilitychange', sync);
    player.addEventListener('error', error);
    player.addEventListener('ended', ended);
    player.addEventListener('loadeddata', sync);
    apply(progress.get());
    const cancel = progress.on('change', apply);
    return () => { disposed = true; suspend(); cancel(); document.removeEventListener('visibilitychange', sync); player.removeEventListener('error', error); player.removeEventListener('ended', ended); player.removeEventListener('loadeddata', sync); };
  }, [active, paused, reducedMotion, progress, media.video]);

  return <figure ref={root} className={styles.bridge} data-bridge-phase="still" data-presented-frame="false" aria-label={media.alt}>
    <div ref={frame} className={styles.bridgeFrame}>
      <div ref={visual} className={styles.bridgeMedia} data-video-presented="false">
        <Image src={media.poster} alt={media.alt} fill sizes="100vw" unoptimized />
        <video ref={video} src={reducedMotion ? undefined : media.video} poster={media.poster} muted playsInline preload="auto" aria-hidden="true" />
      </div>
      <div ref={scrim} className={styles.bridgeScrim} />
    </div>
    <p ref={title} className={styles.bridgeTitle}>{locale === 'pt-br' ? 'É nos problemas reais que essa ousadia ganha forma.' : 'Real problems give this daring its form.'}</p>
    <figcaption ref={controls} className={styles.bridgeControls}><a href={media.source} target="_blank" rel="noopener noreferrer">SDIMT ↗</a>{!reducedMotion && <button type="button" onClick={togglePause}>{paused ? (locale === 'pt-br' ? 'Retomar movimento' : 'Resume motion') : (locale === 'pt-br' ? 'Pausar movimento' : 'Pause motion')}</button>}</figcaption>
  </figure>;
}
