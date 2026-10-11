'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type MutableRefObject } from 'react';
import { CaseEditorial } from '../CaseEditorial';
import type { EditorialCase } from '../case-content';
import type { PrototypeLocale } from '../prototype-copy';
import type { StorySample } from '../story-model';
import { useNksFrames } from '../use-nks-frames';
import styles from '../story-prototype.module.css';

const StoryScene = dynamic(() => import('../StoryScene'), { ssr: false });

export function NksChapter({ locale, sample, reducedMotion, paused, caseData }: { locale: PrototypeLocale; sample: MutableRefObject<StorySample>; reducedMotion: boolean; paused: boolean; caseData: EditorialCase }) {
  const frameCanvas = useRef<HTMLCanvasElement>(null);
  const invalidateScene = useRef<(() => void) | null>(null);
  const progress = useRef(0);
  const [available, setAvailable] = useState(false);
  const [visible, setVisible] = useState(false);
  const [prepared, setPrepared] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [hidden, setHidden] = useState(false);
  const onReady = useCallback(() => setSceneReady(true), []);
  const onUnavailable = useCallback(() => setAvailable(false), []);
  const frames = useNksFrames(frameCanvas, invalidateScene);
  const requestFrame = frames.request;

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = document.createElement('canvas');
    try {
      const context = canvas.getContext('webgl2');
      setAvailable(Boolean(context));
      context?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch { setAvailable(false); }
  }, [reducedMotion]);

  useEffect(() => {
    const section = document.getElementById('nks');
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    const prepare = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setPrepared(true); }, { rootMargin: '30% 0px' });
    observer.observe(section.querySelector('[class*=nksSticky]')!); prepare.observe(section);
    const visibility = () => setHidden(document.hidden);
    visibility(); document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); prepare.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, []);

  useEffect(() => {
    if (!prepared || !available || sceneReady || reducedMotion || hidden) return;
    const timer = window.setTimeout(onUnavailable, 15000);
    return () => clearTimeout(timer);
  }, [prepared, available, sceneReady, reducedMotion, hidden, onUnavailable]);

  useEffect(() => {
    if (!visible || reducedMotion || hidden || paused) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (sample.current.chapterId !== 'nks') return;
        progress.current = sample.current.localProgress;
        requestFrame(Math.max(0, Math.min(1, progress.current)));
        invalidateScene.current?.();
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); };
  }, [requestFrame, reducedMotion, sample, visible, hidden, paused]);

  return (
    <section id="nks" data-story-chapter="nks" data-scene-ready={available && sceneReady} className={styles.nksChapter} aria-labelledby="nks-title">
      <div className={styles.nksSticky} aria-hidden="true">
        <div className={styles.nksBackdrop} />
        {(!available || reducedMotion || !sceneReady) && <Image src={caseData.media.poster} alt="" fill sizes="100vw" unoptimized />}
        {available && !reducedMotion && prepared && <StoryScene style="ember" progress={progress} invalidateScene={invalidateScene} onUnavailable={onUnavailable} onReady={onReady} active={(visible || !sceneReady) && !hidden && !paused} frameCanvas={frameCanvas.current} paintedFrame={frames.painted} mediaReady={frames.ready && !frames.failed} />}
        <canvas ref={frameCanvas} width={1600} height={900} className={styles.frameBuffer} />
      </div>
      <div className={styles.nksReading}>
        <div className={styles.caseEyebrow}>{locale === 'pt-br' ? '02 / Produto' : '02 / Product'}</div>
        <h2 id="nks-title" data-story-read tabIndex={-1}>NKS Connect<span className={styles.titlePeriod}>.</span></h2>
        <CaseEditorial caseData={caseData} locale={locale} />
        <div className={styles.nksMockup}>
          <Image className={styles.mockupDesktop} src={caseData.media.mockup!} alt={caseData.media.alt} fill sizes="85vw" unoptimized />
          <Image className={styles.mockupMobile} src={caseData.media.mobileMockup!} alt={caseData.media.alt} fill sizes="100vw" unoptimized />
        </div>
        <p className={styles.assetCredit}>Laptop 3D: <a href="https://sketchfab.com/3d-models/laptop-7d870e900889481395b4a575b9fa8c3e" target="_blank" rel="noopener noreferrer">Aullwen</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a></p>
      </div>
    </section>
  );
}
