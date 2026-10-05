'use client';

import { useEffect, useLayoutEffect, useRef, useState, type MutableRefObject } from 'react';
import { motionValue } from 'motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CaseEditorial } from '../CaseEditorial';
import type { EditorialCase } from '../case-content';
import type { PrototypeLocale } from '../prototype-copy';
import type { StorySample } from '../story-model';
import { SdimtRotatoMedia } from './SdimtRotatoMedia';
import styles from '../story-prototype.module.css';

type Props = { locale: PrototypeLocale; sample: MutableRefObject<StorySample>; reducedMotion: boolean; paused: boolean; caseData: EditorialCase; refreshRuntime(): void };

export function SdimtChapter({ locale, caseData, reducedMotion, paused, refreshRuntime }: Props) {
  const root = useRef<HTMLElement>(null), stage = useRef<HTMLDivElement>(null), presentation = useRef<HTMLDivElement>(null), marker = useRef<HTMLSpanElement>(null);
  const [progress] = useState(() => motionValue(0));
  const [exposed, setExposed] = useState(false), [compact, setCompact] = useState(false);
  const target = useRef(0), applying = useRef(false);
  const staticMedia = reducedMotion || compact;
  const previousStatic = useRef(staticMedia);
  applying.current = !paused && !staticMedia;
  useEffect(() => {
    const query = matchMedia('(max-height: 599px)');
    const update = () => setCompact(query.matches); update(); query.addEventListener('change', update);
    const observer = new IntersectionObserver(([entry]) => setExposed(entry.isIntersecting));
    if (presentation.current) observer.observe(presentation.current);
    return () => { query.removeEventListener('change', update); observer.disconnect(); };
  }, []);
  useEffect(() => { if (!paused && !staticMedia) progress.set(target.current); }, [paused, staticMedia, progress]);
  useLayoutEffect(() => {
    const section = root.current, rail = stage.current, visual = presentation.current, reading = marker.current;
    if (!section || !rail || !visual || !reading || staticMedia) { refreshRuntime(); return; }
    gsap.registerPlugin(ScrollTrigger);
    let pin: ScrollTrigger | undefined, queued = 0, disposed = false, signature = '';
    let start = 0, distance = 1;
    const apply = () => {
      target.current = Math.max(0, Math.min(1, (window.scrollY - start) / distance));
      if (applying.current) progress.set(target.current);
    };
    const measure = () => {
      const top = Math.max(100, (document.querySelector('header')?.getBoundingClientRect().bottom ?? 80) + 20);
      distance = innerHeight * 1.5;
      rail.style.height = `${visual.offsetHeight + innerHeight * 2}px`;
      reading.style.top = `${distance}px`;
      start = rail.getBoundingClientRect().top + scrollY - top;
      const next = [innerWidth, innerHeight, top, start, visual.offsetHeight].join(':');
      apply(); if (signature === next) return; signature = next; pin?.kill();
      pin = ScrollTrigger.create({ id: 'sdimt-rotato', trigger: rail, pin: visual, pinSpacing: false, start: () => start, end: () => start + innerHeight * 2 });
    };
    const schedule = () => {
      cancelAnimationFrame(queued);
      queued = requestAnimationFrame(() => { if (!disposed) { measure(); refreshRuntime(); } });
    };
    const tracker = ScrollTrigger.create({ id: 'sdimt-rotato-progress', trigger: section, start: 0, end: 'max', onUpdate: apply, onRefresh: measure });
    const observer = new ResizeObserver(schedule); observer.observe(visual);
    window.addEventListener('resize', schedule); document.fonts.ready.then(() => { if (!disposed) schedule(); });
    measure(); refreshRuntime();
    return () => {
      disposed = true; cancelAnimationFrame(queued); observer.disconnect(); window.removeEventListener('resize', schedule);
      tracker.kill(); pin?.kill(); rail.style.removeProperty('height'); reading.style.removeProperty('top');
    };
  }, [locale, staticMedia, progress, refreshRuntime]);
  useLayoutEffect(() => {
    const changed = previousStatic.current !== staticMedia;
    previousStatic.current = staticMedia;
    if (!changed || !exposed) return;
    const queued = requestAnimationFrame(() => {
      refreshRuntime();
      const top = Math.max(100, (document.querySelector('header')?.getBoundingClientRect().bottom ?? 80) + 20);
      const position = marker.current!.getBoundingClientRect().top + scrollY - top;
      const engine = (window as typeof window & { __lenis?: { scrollTo(target: number, options: { immediate: boolean; force: boolean }): void } }).__lenis;
      engine?.scrollTo(position, { immediate: true, force: true }); window.scrollTo(0, position);
    });
    return () => cancelAnimationFrame(queued);
  }, [staticMedia, exposed, refreshRuntime]);
  return <section ref={root} id="sdimt" data-story-chapter="sdimt" data-rotato-static={staticMedia} className={styles.sdimtChapter} aria-labelledby="sdimt-title">
    <span id="projects" className={styles.anchorAlias} aria-hidden="true" />
    <div className={styles.sdimtArrival} aria-hidden="true" />
    <div className={styles.sdimtReading}>
      <div ref={stage} className={styles.sdimtRotatoStage}>
        <span ref={marker} id="sdimt-rotato-read" className={styles.sdimtReadMarker} aria-hidden="true" />
        <div ref={presentation} className={styles.sdimtRotatoPresentation}>
          <div className={styles.sdimtRotatoCopy}>
            <p className={styles.caseEyebrow}>{locale === 'pt-br' ? '01 / Ambição' : '01 / Ambition'}</p>
            <h2 id="sdimt-title" data-story-read data-story-read-anchor="sdimt-rotato-read" data-story-read-offset="navigation" tabIndex={-1}>SDIMT<span className={styles.titlePeriod}>.</span></h2>
            <p className={styles.caseLead}>{locale === 'pt-br' ? 'No SDIMT, ela começa com uma pergunta: como tornar a comparação remuneratória mais clara?' : 'In SDIMT, it starts with a question: how can remuneration comparisons become clearer?'}</p>
            <p className={styles.mediaCaption}>{locale === 'pt-br' ? 'Capturas da landing pública. O painel autenticado não é mostrado aqui.' : 'Captures of the public landing. The authenticated dashboard is not shown here.'}</p>
          </div>
          <SdimtRotatoMedia progress={progress} active={exposed} paused={paused} reducedMotion={staticMedia} locale={locale} />
        </div>
      </div>
      <div className={styles.sdimtEditorial}><CaseEditorial caseData={caseData} locale={locale} /></div>
    </div>
  </section>;
}
