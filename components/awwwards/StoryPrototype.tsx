'use client';

import Image from 'next/image';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CaseEditorial } from './CaseEditorial';
import { ChapterCheckpoints } from './ChapterCheckpoints';
import { StoryNavigation } from './StoryNavigation';
import Plasma from './StoryPlasma';
import { SdimtChapter } from './chapters/SdimtChapter';
import { NksChapter } from './chapters/NksChapter';
import { editorialCases, type EditorialCase } from './case-content';
import type { prototypeCopy, PrototypeLocale, PrototypeStyle } from './prototype-copy';
import { useStoryRuntime } from './use-story-runtime';
import type { ChapterId } from './story-model';
import styles from './story-prototype.module.css';
import 'lenis/dist/lenis.css';

type Copy = (typeof prototypeCopy)[PrototypeLocale];
type Props = { locale: PrototypeLocale; style: PrototypeStyle; copy: Copy };

const closingCopy = {
  'pt-br': {
    about: 'Kleber Vinícius é desenvolvedor web full-stack. Sua trajetória reúne projetos comerciais, institucionais e experiências digitais.',
    process: 'Descoberta, desenvolvimento com feedback e entrega: uma prática construída em diálogo com cada projeto.',
    testimonials: 'Palavras de pessoas com quem trabalhei.',
    contact: 'Vamos construir a próxima experiência?',
  },
  en: {
    about: 'Kleber Vinícius is a full-stack web developer. His work spans commercial and institutional projects and digital experiences.',
    process: 'Discovery, development with feedback, and delivery: a practice shaped through each project.',
    testimonials: 'Words from people I have worked with.',
    contact: 'Shall we build the next experience?',
  },
};

function FutureCase({ caseData, locale, index }: { caseData: EditorialCase; locale: PrototypeLocale; index: number }) {
  return (
    <section id={caseData.slug} data-story-chapter={caseData.slug} data-case={caseData.slug} className={styles.futureCase} aria-labelledby={`${caseData.slug}-title`}>
      <div className={styles.futureMedia}><Image src={caseData.media.poster} alt={caseData.media.alt} fill sizes="(max-width: 760px) 100vw, 54vw" unoptimized /></div>
      <div className={styles.futureContent}>
        <p className={styles.caseEyebrow}>{String(index).padStart(2, '0')} / 05</p>
        <h2 id={`${caseData.slug}-title`} data-story-read tabIndex={-1}>{caseData.title}</h2>
        <CaseEditorial caseData={caseData} locale={locale} />
      </div>
    </section>
  );
}

export default function StoryPrototype({ locale, copy }: Props) {
  const root = useRef<HTMLElement>(null);
  const opening = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const phrase = useRef<HTMLDivElement>(null);
  const openingVisual = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [plasmaPaused, setPlasmaPaused] = useState(false);
  const [plasmaUnavailable, setPlasmaUnavailable] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const [motionReady, setMotionReady] = useState(false);
  const [plasmaExposed, setPlasmaExposed] = useState(true);
  const [viewportRevision, setViewportRevision] = useState(0);
  const onPlasmaUnavailable = useCallback(() => setPlasmaUnavailable(true), []);
  const runtime = useStoryRuntime(root, reducedMotion);
  const refreshRuntime = runtime.refresh;
  const cases = editorialCases[locale];
  const sdimt = cases.find((item) => item.slug === 'sdimt')!;
  const nks = cases.find((item) => item.slug === 'nks')!;

  useLayoutEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    setMotionReady(true);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    let timer = 0;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setViewportRevision((value) => value + 1), 120);
    };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); window.clearTimeout(timer); };
  }, []);

  useEffect(() => {
    if (!contactRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setContactVisible(entry.isIntersecting), { threshold: 0 });
    observer.observe(contactRef.current);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (!motionReady || reducedMotion || !opening.current || !openingVisual.current || !intro.current || !phrase.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const visual = openingVisual.current!;
      const plane = visual.querySelector<HTMLElement>(`.${styles.sdimtPlane}`)!;
      const detail = visual.querySelector<HTMLElement>(`.${styles.sdimtDetail}`)!;
      const plasma = visual.querySelector<HTMLElement>(`.${styles.plasmaCanvas}`)!;
      const shade = visual.querySelector<HTMLElement>(`.${styles.openingShade}`)!;
      const orbit = visual.querySelector<HTMLElement>(`.${styles.sdimtOrbit}`)!;
      const reading = root.current!.querySelector<HTMLElement>(`.${styles.sdimtReading}`)!;
      const mobile = window.innerWidth <= 760;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const openingY = opening.current!.getBoundingClientRect().top + window.scrollY;
      const readY = reading.getBoundingClientRect().top + window.scrollY - openingY;
      const total = opening.current!.offsetHeight - vh;
      const arrive = intro.current!.offsetHeight - vh * .35;
      const settle = readY - vh * .35;
      const exit = Math.min(total - vh * .45, readY + reading.offsetHeight - vh * .9);
      gsap.set(plane, { x: mobile ? vw * .04 : vw * .18, y: vh * .36, z: -700, scale: .48, rotationY: mobile ? -16 : -28, rotationX: 9, rotationZ: -6, opacity: 0, force3D: true });
      gsap.set(detail, { x: vw * .16, y: vh * .22, z: -180, scale: .68, rotationY: 18, rotationZ: 9, opacity: 0, force3D: true });
      gsap.set(orbit, { y: 22, opacity: 0 });
      const clock = { progress: 0 };
      const timeline = gsap.timeline({ scrollTrigger: { trigger: opening.current, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true, onUpdate: (self) => setPlasmaExposed(self.progress * total < vh * 1.55) } });
      timeline.to(clock, { progress: 1, duration: total, ease: 'none' }, 0)
        .to(phrase.current!.querySelectorAll(`.${styles.heroLineInner}`), { yPercent: -45, z: -180, rotationX: 10, opacity: 0, stagger: vh * .065, duration: vh * .7, ease: 'power2.inOut' }, vh * .3)
        .to(phrase.current!.querySelectorAll('[data-hero-support]'), { y: -24, opacity: 0, duration: vh * .3, ease: 'power2.in' }, vh * .18)
        .to(intro.current!.querySelector(`.${styles.heroFolio}`), { opacity: 0, duration: vh * .25 }, vh * .2)
        .to(plane, { opacity: 1, duration: vh * .45, ease: 'power1.inOut' }, vh * .35)
        .to(plane, { x: 0, y: 0, z: 0, scale: 1, rotationX: 0, rotationY: 0, rotationZ: 0, duration: arrive - vh * .4, ease: 'power2.inOut' }, vh * .4)
        .to(plasma, { opacity: 0, duration: vh * .85, ease: 'power1.inOut' }, vh * .65)
        .to(shade, { opacity: 1, duration: vh * .9, ease: 'none' }, vh * .65)
        .to(detail, { x: 0, y: 0, z: 40, scale: 1, rotationY: 0, rotationZ: -4, opacity: 1, duration: vh * .55, ease: 'power2.out' }, arrive - vh * .12)
        .to(orbit, { y: 0, opacity: 1, duration: vh * .3, ease: 'power1.out' }, arrive)
        .to(plane, { x: mobile ? 0 : -vw * .225, y: mobile ? -vh * .1 : -vh * .015, scale: mobile ? .9 : .55, rotationY: mobile ? 0 : 8, rotationZ: mobile ? 0 : -2, duration: vh * .7, ease: 'power2.inOut' }, settle - vh * .7)
        .to(detail, { x: mobile ? 0 : -vw * .43, y: mobile ? vh * .06 : vh * .04, scale: mobile ? .7 : .57, opacity: mobile ? 0 : .85, rotationZ: 3, duration: vh * .7, ease: 'power2.inOut' }, settle - vh * .7)
        .to([plane, detail], { x: -vw * .6, z: -350, rotationY: -25, opacity: 0, duration: Math.max(vh * .35, total - exit), ease: 'power2.in' }, exit)
        .to(orbit, { opacity: 0, duration: vh * .3 }, exit);
      refreshRuntime();
    }, opening);
    return () => context.revert();
  }, [motionReady, reducedMotion, locale, refreshRuntime, viewportRevision]);

  const navigate = useCallback((id: ChapterId) => runtime.jumpTo(id, reducedMotion ? 'immediate' : 'animated', true), [runtime, reducedMotion]);
  const onPrimaryClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    history.pushState(null, '', '#sdimt');
    navigate('sdimt');
  };
  const c = closingCopy[locale];

  return (
    <main ref={root} className={styles.root} data-reduced={reducedMotion} data-client-ready={motionReady} data-motion-ready={motionReady && !reducedMotion} data-plasma-unavailable={plasmaUnavailable}>
      <a className={styles.skipLink} href="#projects">{locale === 'pt-br' ? 'Pular para projetos' : 'Skip to projects'}</a>
      <StoryNavigation locale={locale} activeChapter={runtime.activeChapter} navigate={navigate} />
      <ChapterCheckpoints locale={locale} activeChapter={runtime.activeChapter} navigate={navigate} />

      <div ref={opening} className={styles.opening}>
        <div className={styles.openingBackdrop} aria-hidden="true">
        <div ref={openingVisual} className={styles.openingVisual} aria-hidden="true">
          <div className={styles.plasmaPoster} />
          <div className={styles.plasmaCanvas}><Plasma active={plasmaExposed && !plasmaPaused && !plasmaUnavailable} reducedMotion={reducedMotion} onUnavailable={onPlasmaUnavailable} /></div>
          <div className={styles.openingShade} />
          <div className={styles.sdimtOrbit}>01 / 05 <span>SDIMT</span></div>
          <div className={styles.sdimtPlane}><Image src={sdimt.media.poster} alt="" fill sizes="(max-width: 760px) 94vw, 80vw" unoptimized priority /></div>
          <div className={styles.sdimtDetail}><Image src="/awwwards/sdimt/landing-resources.webp" alt="" fill sizes="(max-width: 760px) 62vw, 35vw" unoptimized /></div>
        </div>
        </div>
        <section id="intro" ref={intro} data-story-chapter="intro" className={styles.intro} aria-labelledby="intro-title">
        <div className={styles.introStage}>
          <div ref={phrase} className={styles.heroCopy}>
            <p className={styles.heroRole} data-hero-support>{copy.role}</p>
            <h1 id="intro-title" data-story-read tabIndex={-1} aria-label={copy.heroStatement}>{(locale === 'pt-br' ? ['Ousadia também', 'é uma forma', 'de rebeldia', 'e criatividade'] : ['Daring is also', 'a form of rebellion', 'and creativity']).map((line) => <span key={line} className={styles.heroLine} aria-hidden="true"><span className={styles.heroLineInner}>{line}</span></span>)}</h1>
            <p className={styles.signature} data-hero-support>{copy.signature}</p>
            <div data-hero-support><a className={styles.primaryLink} href="#sdimt" onClick={onPrimaryClick}>{locale === 'pt-br' ? 'Explorar SDIMT' : 'Explore SDIMT'} <span aria-hidden="true">↗</span></a>
            {!reducedMotion && !plasmaUnavailable && <button className={styles.motionToggle} type="button" onClick={() => setPlasmaPaused((value) => !value)}>{plasmaPaused ? (locale === 'pt-br' ? 'Retomar movimento' : 'Resume motion') : (locale === 'pt-br' ? 'Pausar movimento' : 'Pause motion')}</button>}</div>
          </div>
          <div className={styles.heroFolio} aria-hidden="true"><span>KV / 2026</span><span>01 — 05</span></div>
        </div>
      </section>

      <SdimtChapter locale={locale} sample={runtime.sample} reducedMotion={reducedMotion} caseData={sdimt} />
      </div>
      <NksChapter locale={locale} sample={runtime.sample} reducedMotion={reducedMotion} caseData={nks} />
      {cases.filter((item) => !['sdimt', 'nks'].includes(item.slug)).map((item, index) => <FutureCase key={item.slug} caseData={item} locale={locale} index={index + 3} />)}

      <section id="about" data-story-chapter="about" className={styles.closingSection}><p className={styles.caseEyebrow}>KV / {locale === 'pt-br' ? 'Pessoa' : 'Person'}</p><h2 data-story-read tabIndex={-1}>{locale === 'pt-br' ? 'Sobre' : 'About'}</h2><p>{c.about}</p></section>
      <section id="process" data-story-chapter="process" className={styles.closingSection}><p className={styles.caseEyebrow}>KV / {locale === 'pt-br' ? 'Método' : 'Method'}</p><h2 data-story-read tabIndex={-1}>{locale === 'pt-br' ? 'Processo' : 'Process'}</h2><p>{c.process}</p></section>
      <section id="testimonials" data-story-chapter="testimonials" className={styles.closingSection}><p className={styles.caseEyebrow}>KV / {locale === 'pt-br' ? 'Vozes' : 'Voices'}</p><h2 data-story-read tabIndex={-1}>{locale === 'pt-br' ? 'Depoimentos' : 'Testimonials'}</h2><p>{c.testimonials}</p><ul className={styles.testimonialNames}><li>Éder Lemes</li><li>João Paulo da Silva</li><li>Jéssika Lorena</li></ul></section>
      <section id="contact" ref={contactRef} data-story-chapter="contact" className={styles.closingSection} data-contact><div className={styles.contactPlasma} aria-hidden="true"><Plasma active={contactVisible && !plasmaPaused && !plasmaUnavailable} reducedMotion={reducedMotion} onUnavailable={onPlasmaUnavailable} /></div><p className={styles.caseEyebrow}>KV / {locale === 'pt-br' ? 'Contato' : 'Contact'}</p><h2 data-story-read tabIndex={-1}>{c.contact}</h2><a href="mailto:klebervinicius.dev@gmail.com">klebervinicius.dev@gmail.com</a><a href="https://www.linkedin.com/in/klebervinicius08/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="#intro" onClick={(event) => { if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); history.pushState(null, '', '#intro'); navigate('intro'); }}>{locale === 'pt-br' ? 'Voltar ao início' : 'Back to start'} ↑</a>{!reducedMotion && !plasmaUnavailable && <button className={styles.motionToggle} type="button" onClick={() => setPlasmaPaused((value) => !value)}>{plasmaPaused ? (locale === 'pt-br' ? 'Retomar movimento' : 'Resume motion') : (locale === 'pt-br' ? 'Pausar movimento' : 'Pause motion')}</button>}</section>
    </main>
  );
}
