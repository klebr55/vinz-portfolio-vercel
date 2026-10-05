'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Component, useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { motionValue } from 'motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { PrototypeLocale } from '../prototype-copy';
import { processContent } from './process-content';
import { resolveProcessFrame, resolveProcessProgress, type ProcessAnchors } from '../identity/process-model';
import styles from '../story-prototype.module.css';

const Scene = dynamic(() => import('../identity/ProcessIdentityScene'), { ssr: false });
class SceneBoundary extends Component<{ children: ReactNode; onUnavailable(): void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onUnavailable(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function ProcessChapter({ locale, paused, reducedMotion, refreshRuntime }: { locale: PrototypeLocale; paused: boolean; reducedMotion: boolean; refreshRuntime(): void }) {
  const root = useRef<HTMLElement>(null);
  const visual = useRef<HTMLDivElement>(null);
  const [progress] = useState(() => motionValue(0));
  const target = useRef(0);
  const applying = useRef(false);
  const [exposed, setExposed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const fail = useCallback(() => setUnavailable(true), []);
  const ready = useCallback(() => setSceneReady(true), []);
  const active = exposed && !hidden && !paused && !reducedMotion && !unavailable;
  const copy = processContent[locale];
  applying.current = active;

  useEffect(() => {
    if (active) progress.set(target.current);
  }, [active, progress]);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setExposed(entry.isIntersecting));
    const prepare = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setInitialized(true); }, { rootMargin: '100% 0px' });
    observer.observe(section); prepare.observe(section);
    const visibility = () => setHidden(document.hidden);
    visibility(); document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); prepare.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, []);

  useLayoutEffect(() => {
    const section = root.current, presentation = visual.current;
    if (!section || !presentation || reducedMotion || unavailable) { refreshRuntime(); return; }
    gsap.registerPlugin(ScrollTrigger);
    const articles = Array.from(section.querySelectorAll<HTMLElement>('article'));
    let anchors: ProcessAnchors = [0, 1, 2, 3];
    let pin: ScrollTrigger | undefined;
    let disposed = false, queued = 0, signature = '';
    const apply = () => {
      target.current = resolveProcessProgress(window.scrollY, anchors);
      const frame = resolveProcessFrame(target.current);
      articles.forEach(article => { article.dataset.active = String(Number(article.dataset.processStage) === frame.stage); });
      if (applying.current) progress.set(target.current);
    };
    const measure = () => {
      const nav = document.querySelector('header')?.getBoundingClientRect();
      const top = Math.max(100, (nav?.bottom ?? 80) + 20);
      const mobile = window.innerWidth <= 760;
      const height = presentation.offsetHeight;
      const canPin = window.innerHeight >= 600 && window.innerHeight - top - (mobile ? height : 0) >= (mobile ? 300 : 240);
      const readingPoint = top + (mobile && canPin ? height + 24 : 0);
      const starts = articles.map(article => article.getBoundingClientRect().top + window.scrollY - readingPoint);
      anchors = [starts[0], starts[1], starts[2], starts[2] + articles[2].offsetHeight];
      section.dataset.processPin = String(canPin);
      const next = [window.innerWidth, window.innerHeight, top, height, canPin, ...anchors].join(':');
      apply();
      if (next === signature) return;
      signature = next;
      pin?.kill();
      if (canPin) pin = ScrollTrigger.create({ id: 'process-visual', trigger: section, pin: presentation, pinSpacing: false, start: () => anchors[0], end: () => anchors[3], anticipatePin: 0 });
    };
    const schedule = () => {
      cancelAnimationFrame(queued);
      queued = requestAnimationFrame(() => { if (disposed) return; measure(); refreshRuntime(); });
    };
    const tracker = ScrollTrigger.create({ id: 'process-progress', trigger: section, start: 0, end: 'max', onUpdate: apply, onRefresh: () => { measure(); apply(); } });
    const observer = new ResizeObserver(schedule);
    articles.forEach(article => observer.observe(article)); observer.observe(presentation);
    window.addEventListener('resize', schedule);
    document.fonts.ready.then(() => { if (!disposed) schedule(); });
    measure(); refreshRuntime();
    return () => { disposed = true; cancelAnimationFrame(queued); observer.disconnect(); window.removeEventListener('resize', schedule); tracker.kill(); pin?.kill(); };
  }, [locale, reducedMotion, unavailable, progress, refreshRuntime]);

  const fallback = reducedMotion || unavailable;
  return <section ref={root} id="process" data-story-chapter="process" data-static={fallback} className={styles.processChapter} aria-labelledby="process-title">
    <header className={styles.processHeading}><p className={styles.caseEyebrow}>{locale === 'pt-br' ? 'Método' : 'Method'}</p><h2 id="process-title" data-story-read tabIndex={-1}>{copy.title}</h2><p>{copy.opening}</p></header>
    <div className={styles.processStage}>
      <div className={styles.processText}>{copy.stages.map(stage => <article key={stage.id} data-process-stage={stage.id} className={styles.processArticle} aria-labelledby={`process-stage-${stage.id}`}>
        <span className={styles.processNumber} aria-hidden="true">0{stage.id}</span><h3 id={`process-stage-${stage.id}`}>{stage.title}</h3><p className={styles.processExplanation}>{stage.explanation}</p>
        <dl><div><dt>{locale === 'pt-br' ? 'Sua participação' : 'Your participation'}</dt><dd>{stage.participation}</dd></div><div><dt>{locale === 'pt-br' ? 'O que preparamos' : 'What we prepare'}</dt><dd>{stage.outcome}</dd></div></dl>
      </article>)}</div>
      <div className={styles.processRail}><div ref={visual} className={styles.processVisual} aria-hidden="true">
        <Image className={styles.processFallback} src="/awwwards/process/code-static.png" alt="" fill unoptimized hidden={!fallback} />
        <noscript><Image className={styles.processFallback} src="/awwwards/process/code-static.png" alt="" fill unoptimized /></noscript>
        {!fallback && !sceneReady && <span className={styles.processWaiting}>{locale === 'pt-br' ? 'Preparando o desenho…' : 'Preparing the drawing…'}</span>}
        {initialized && !fallback && <div className={styles.processCanvas} style={{ opacity: sceneReady ? 1 : 0 }}><SceneBoundary onUnavailable={fail}><Scene progress={progress} active={active} onUnavailable={fail} onReady={ready} /></SceneBoundary></div>}
      </div></div>
    </div>
  </section>;
}
