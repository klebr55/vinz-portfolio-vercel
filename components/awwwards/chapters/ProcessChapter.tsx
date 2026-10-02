'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { motionValue, scroll } from 'motion';
import type { PrototypeLocale } from '../prototype-copy';
import styles from '../story-prototype.module.css';

const Scene = dynamic(() => import('../identity/ProcessIdentityScene'), { ssr: false });

class SceneBoundary extends Component<{ children: ReactNode; onUnavailable(): void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onUnavailable(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function ProcessChapter({ locale, paused, reducedMotion, text }: { locale: PrototypeLocale; paused: boolean; reducedMotion: boolean; text: string }) {
  const root = useRef<HTMLElement>(null);
  const [progress] = useState(() => motionValue(0));
  const [exposed, setExposed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const checkpoint = useRef(false);
  const fail = useCallback(() => setUnavailable(true), []);
  const ready = useCallback(() => setSceneReady(true), []);
  const active = exposed && !hidden && !paused && !reducedMotion && !unavailable;
  useEffect(() => { if (!active) setSceneReady(false); }, [active]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setExposed(entry.isIntersecting);
      if (entry.isIntersecting) {
        checkpoint.current = location.hash === '#process';
        if (checkpoint.current) progress.set(1);
        setInitialized(true);
      }
    });
    if (root.current) observer.observe(root.current);
    const visibility = () => setHidden(document.hidden);
    visibility();
    const checkpointEntry = () => { if (location.hash === '#process') { checkpoint.current = true; progress.set(1); } };
    const checkpointClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      const anchor = event.target instanceof Element ? event.target.closest('a[href="#process"]') : null;
      if (anchor) { checkpoint.current = true; progress.set(1); }
    };
    document.addEventListener('click', checkpointClick, true);
    window.addEventListener('hashchange', checkpointEntry);
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); document.removeEventListener('click', checkpointClick, true); window.removeEventListener('hashchange', checkpointEntry); document.removeEventListener('visibilitychange', visibility); };
  }, [progress]);

  useEffect(() => {
    if (!root.current || !active) return;
    let current = progress.get();
    const release = () => { checkpoint.current = false; progress.set(current); };
    const key = (event: KeyboardEvent) => { if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) release(); };
    window.addEventListener('wheel', release, { passive: true, capture: true });
    window.addEventListener('touchstart', release, { passive: true, capture: true });
    window.addEventListener('keydown', key);
    const cancel = scroll(value => { current = value; if (!checkpoint.current) progress.set(value); }, { target: root.current, offset: ['start start', 'end end'] });
    return () => { cancel(); window.removeEventListener('wheel', release, true); window.removeEventListener('touchstart', release, true); window.removeEventListener('keydown', key); };
  }, [active, progress]);

  const staticIdentity = !active || !sceneReady;
  return <section ref={root} id="process" data-story-chapter="process" className={styles.processChapter} aria-labelledby="process-title">
    <div className={styles.processStage}>
      <div className={styles.processText}><p className={styles.caseEyebrow}>KV / {locale === 'pt-br' ? 'Método' : 'Method'}</p><h2 id="process-title" data-story-read tabIndex={-1}>{locale === 'pt-br' ? 'Processo' : 'Process'}</h2><p>{text}</p></div>
      <div className={styles.processVisual} data-preparing={active && !sceneReady && !checkpoint.current} aria-hidden="true">
        <Image className={styles.processFallback} src="/awwwards/identity/vinz-process-contours.svg" alt="" fill unoptimized hidden={!staticIdentity} />
        {initialized && !reducedMotion && !unavailable && <div className={styles.processCanvas} style={{ opacity: staticIdentity ? 0 : 1 }}><SceneBoundary onUnavailable={fail}><Scene progress={progress} active={active} onUnavailable={fail} onReady={ready} /></SceneBoundary></div>}
      </div>
    </div>
  </section>;
}
