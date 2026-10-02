'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { caseMedia } from './case-media';
import { editorialCases } from './case-content';
import { useNksFrames } from './use-nks-frames';
import Beams from './StoryBeams';
import type { prototypeCopy, PrototypeLocale, PrototypeStyle } from './prototype-copy';
import styles from './historical-story.module.css';

const StoryScene = dynamic(() => import('./StoryScene'), { ssr: false });

type Copy = (typeof prototypeCopy)[PrototypeLocale];

type Props = {
  locale: PrototypeLocale;
  style: PrototypeStyle;
  copy: Copy;
};

export default function StoryPrototype({ locale, style, copy }: Props) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webglAvailable, setWebglAvailable] = useState(false);
  const [caseActive, setCaseActive] = useState(false);
  const [screenFocus, setScreenFocus] = useState(false);
  const [beamsActive, setBeamsActive] = useState(true);
  const [ctaPressed, setCtaPressed] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const sequenceRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const sceneLayerRef = useRef<HTMLDivElement>(null);
  const beamsLayerRef = useRef<HTMLDivElement>(null);
  const caseMediaRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const frameCanvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const invalidateScene = useRef<(() => void) | null>(null);
  const activeRef = useRef(false);
  const screenFocusRef = useRef(false);
  const beamsActiveRef = useRef(true);
  const lensRaf = useRef<number | null>(null);
  const lensPoint = useRef({ x: 50, y: 50 });
  const onUnavailable = useCallback(() => setWebglAvailable(false), []);
  const frames = useNksFrames(frameCanvasRef, invalidateScene);
  const requestNksFrame = frames.request;
  const nks = editorialCases[locale].find((item) => item.slug === 'nks')!;

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const probe = document.createElement('canvas');
    const context = probe.getContext('webgl2') || probe.getContext('webgl');
    setWebglAvailable(Boolean(context));
    const extension = context?.getExtension('WEBGL_lose_context');
    extension?.loseContext();
  }, [reducedMotion]);

  useLayoutEffect(() => {
    if (reducedMotion || !rootRef.current || !sequenceRef.current || !stageRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ autoRaf: false, anchors: true, duration: 1.15, smoothWheel: true, syncTouch: false });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    const updateTrigger = () => ScrollTrigger.update();
    const tick = (time: number) => lenis.raf(time * 1000);
    const handleVisibility = () => {
      if (document.hidden) {
        lenis.stop();
        gsap.ticker.remove(tick);
      } else {
        lenis.start();
        gsap.ticker.add(tick);
        ScrollTrigger.refresh();
      }
    };

    lenis.on('scroll', updateTrigger);
    gsap.ticker.add(tick);
    document.addEventListener('visibilitychange', handleVisibility);

    const context = gsap.context(() => {
      const hero = heroRef.current;
      const media = caseMediaRef.current;
      const mockup = mockupRef.current;
      const scene = sceneLayerRef.current;
      const beams = beamsLayerRef.current;
      const stage = stageRef.current;
      const sequence = sequenceRef.current;
      if (!hero || !media || !mockup || !scene || !beams || !stage || !sequence) return;

      gsap.set(media, { autoAlpha: 0 });
      gsap.set(mockup, { autoAlpha: 0, scale: 1.08 });

      const timeline = gsap.timeline({
        scrollTrigger: { trigger: sequence, start: 'top top', end: 'bottom bottom', scrub: 0.5, invalidateOnRefresh: true },
        onUpdate: () => {
          const value = timeline.progress();
          progressRef.current = value;
          rootRef.current?.style.setProperty('--story-progress', value.toFixed(4));
          invalidateScene.current?.();
          const lightsActive = value < 0.22;
          if (lightsActive !== beamsActiveRef.current) {
            beamsActiveRef.current = lightsActive;
            setBeamsActive(lightsActive);
          }
          requestNksFrame(Math.max(0, Math.min(1, (value - 0.14) / 0.64)));
          const focused = value >= 0.14 && value < 0.995;
          if (focused !== screenFocusRef.current) {
            screenFocusRef.current = focused;
            setScreenFocus(focused);
          }
          const next = value >= 0.975;
          if (next !== activeRef.current) {
            activeRef.current = next;
            setCaseActive(next);
          }
        },
      });

      timeline
        .to(hero, { autoAlpha: 0, yPercent: -16, duration: 0.16, ease: 'none' }, 0.04)
        .to(beams, { opacity: 0, duration: 0.16, ease: 'none' }, 0.04)
        .to(scene, { opacity: 0, duration: 0.016, ease: 'none' }, 0.94)
        .to(media, { autoAlpha: 1, duration: 0.016, ease: 'none' }, 0.94)
        .to(mockup, { autoAlpha: 1, scale: 1, duration: 0.026, ease: 'power2.inOut' }, 0.968)
        .to(stage, { backgroundColor: style === 'ember' ? '#e8e3f2' : '#d9e8ed', duration: 0.026, ease: 'none' }, 0.974);

      const heading = hero.querySelector('h1');
      if (heading) gsap.from(heading, { opacity: 0.72, y: 18, duration: 0.75, ease: 'power3.out', clearProps: 'transform,opacity' });
    }, rootRef);

    const refresh = () => ScrollTrigger.refresh();
    const image = caseMediaRef.current?.querySelector('img');
    image?.decode?.().then(refresh).catch(() => undefined);
    document.fonts?.ready.then(refresh).catch(() => undefined);

    return () => {
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      document.removeEventListener('visibilitychange', handleVisibility);
      lenis.off('scroll', updateTrigger);
      gsap.ticker.remove(tick);
      lenis.destroy();
      context.revert();
    };
  }, [reducedMotion, style, requestNksFrame]);

  useEffect(() => () => {
    if (lensRaf.current !== null) cancelAnimationFrame(lensRaf.current);
  }, []);

  const updateLens = (event: React.PointerEvent<HTMLElement>) => {
    if (reducedMotion) return;
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    const rect = event.currentTarget.getBoundingClientRect();
    lensPoint.current = {
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    };
    if (lensRaf.current !== null) return;
    lensRaf.current = requestAnimationFrame(() => {
      navRef.current?.style.setProperty('--lens-x', `${lensPoint.current.x}%`);
      navRef.current?.style.setProperty('--lens-y', `${lensPoint.current.y}%`);
      lensRaf.current = null;
    });
  };

  const base = `/${locale}`;

  return (
    <main ref={rootRef} className={styles.root} data-style={style} data-reduced={reducedMotion ? 'true' : 'false'} data-webgl={webglAvailable ? 'true' : 'false'} data-case-active={caseActive ? 'true' : 'false'} data-screen-focus={screenFocus ? 'true' : 'false'}>
      <a className={styles.skipLink} href="#case-01">{locale === 'pt-br' ? 'Pular para o projeto' : 'Skip to project'}</a>
      <nav ref={navRef} className={styles.nav} aria-label={locale === 'pt-br' ? 'Navegação da prévia' : 'Preview navigation'} onPointerMove={updateLens}>
        <svg className={styles.filterDefs} aria-hidden="true" focusable="false">
          <defs>
            <filter id="kv-nav-refract" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="1" seed="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="11" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>
        <span className={styles.lens} aria-hidden="true" />
        <a className={styles.brand} href={`${base}`} aria-label={copy.portfolio}>KV<span className={styles.brandPoint}>.</span></a>
        <div className={styles.navLinks}>
          <a href="#case-01">01 / NKS</a>
          <a href={`${base}#projects`}>{copy.portfolio}</a>
          <a href={`${base}#contact`}>{copy.contact}</a>
        </div>
        <div className={styles.languageLinks}>
          <a href={`/pt-br/awwwards-preview/${style}`} lang="pt-BR" aria-current={locale === 'pt-br' ? 'page' : undefined}>PT</a>
          <span aria-hidden="true">/</span>
          <a href={`/en/awwwards-preview/${style}`} lang="en" aria-current={locale === 'en' ? 'page' : undefined}>EN</a>
        </div>
      </nav>

      <section ref={sequenceRef} className={styles.sequence} aria-label={copy.role}>
        <div ref={stageRef} className={styles.stage}>
          <div className={styles.atmosphere} aria-hidden="true" />
          <div ref={beamsLayerRef} className={styles.beamsLayer} aria-hidden="true">
            {webglAvailable && !reducedMotion && style === 'ember' && (
              <Beams beamWidth={3} beamHeight={30} beamNumber={20} lightColor="#ffffff" speed={2} noiseIntensity={1.75} scale={0.2} rotation={30} beamColor="#06010e" backgroundColor="#000000" active={beamsActive} />
            )}
          </div>
          <div ref={sceneLayerRef} className={styles.sceneLayer} aria-hidden="true">
            <div className={styles.poster} />
            {(!webglAvailable || reducedMotion) && <Image className={styles.fallbackScene} src={caseMedia.nks.source} alt="" fill sizes="100vw" unoptimized />}
            {webglAvailable && !reducedMotion && (
              <StoryScene style={style} progress={progressRef} invalidateScene={invalidateScene} onUnavailable={onUnavailable} frameCanvas={frameCanvasRef.current} paintedFrame={frames.painted} mediaReady={frames.ready && !frames.failed} />
            )}
          </div>

          <div ref={heroRef} className={styles.heroCopy}>
            <p className={styles.role}>{copy.role}</p>
            <h1 className={styles.heroTitle}><span>{copy.heroLead}</span>{' '}<em>{copy.heroEnd}</em></h1>
            <div className={styles.heroBottom}>
              <p>{copy.heroAside}</p>
              <motion.a
                className={styles.primaryLink}
                href="#case-01"
                animate={{ transform: ctaPressed && !reducedMotion ? 'scale(0.97)' : 'scale(1)' }}
                transition={{ duration: 0.14, ease: [0.23, 1, 0.32, 1] }}
                onPointerDown={() => setCtaPressed(true)}
                onPointerUp={() => setCtaPressed(false)}
                onPointerCancel={() => setCtaPressed(false)}
                onPointerLeave={() => setCtaPressed(false)}
              >
                {copy.explore}<span aria-hidden="true">↗</span>
              </motion.a>
            </div>
          </div>

          <div ref={caseMediaRef} className={styles.caseMedia} aria-hidden="true">
            <div className={styles.caseMediaInner}>
              <span className={styles.caseMediaIndex}>01 / 04</span>
              <div className={styles.screenCapture}>
                <Image src={caseMedia.nks.source} alt="" fill sizes="100vw" unoptimized />
                <canvas ref={frameCanvasRef} width={1600} height={900} data-ready={frames.ready ? 'true' : 'false'} />
              </div>
              <div ref={mockupRef} className={styles.mockupArrival}>
                <div className={styles.mockupImage}>
                  <Image className={styles.mockupDesktop} src={nks.media.mockup!} alt="" fill sizes="100vw" unoptimized />
                  <Image className={styles.mockupMobile} src={nks.media.mobileMockup!} alt="" fill sizes="100vw" unoptimized />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.stageIndex} aria-hidden="true"><span>KV / 01</span><span>01 — 04</span></div>
        </div>
      </section>

      <section id="case-01" className={styles.caseDetails}>
        <div className={styles.caseDetailsHead}>
          <p>{copy.caseLabel}</p>
          <h2>{copy.caseName}</h2>
        </div>
        <div className={styles.caseDetailsBody}>
          <p>{nks.purpose.text}</p>
          <motion.a
            href={caseMedia.nks.link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={reducedMotion ? undefined : { transform: 'translateY(-3px)' }}
            transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
          >{copy.caseLink}<span aria-hidden="true">↗</span></motion.a>
        </div>
        <dl className={styles.caseFacts}>
          {[nks.need, nks.contribution, nks.technologies].map((field) => (
            <div key={field.label}>
              <dt>{field.label}</dt>
              <dd>{field.text}</dd>
            </div>
          ))}
        </dl>
        <div className={styles.caseStill} role="img" aria-label={copy.caseName}>
          <div className={styles.screenCapture}>
            <Image className={styles.mockupDesktop} src={nks.media.mockup!} alt="" fill sizes="(max-width: 760px) 100vw, 88vw" unoptimized />
            <Image className={styles.mockupMobile} src={nks.media.mobileMockup!} alt="" fill sizes="100vw" unoptimized />
          </div>
        </div>
        <a className={styles.nextLink} href={`${base}#projects`}>{copy.next}<span aria-hidden="true">↗</span></a>
        <p className={styles.assetCredit}>
          {locale === 'pt-br' ? 'Modelo 3D Laptop por ' : 'Laptop 3D model by '}
          <a href="https://sketchfab.com/3d-models/laptop-7d870e900889481395b4a575b9fa8c3e" target="_blank" rel="noopener noreferrer">Aullwen</a>
          {' · '}<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>
          {locale === 'pt-br' ? ' · tela com gravação original fornecida para NKS Connect' : ' · screen with an original NKS Connect recording'}
        </p>
      </section>

      <aside className={styles.reviewSwitcher} aria-label={copy.reviewLabel}>
        <a href={`${base}/awwwards-preview/ember`} aria-current={style === 'ember' ? 'page' : undefined}>{copy.firstStyle}</a>
        <a href={`${base}/awwwards-preview/spectral`} aria-current={style === 'spectral' ? 'page' : undefined}>{copy.secondStyle}</a>
      </aside>
    </main>
  );
}
