'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import ElectricLogo from './ElectricLogo';
import { identityIds, useIdentityCycle, type IdentityId } from './use-identity-cycle';
import type { PrototypeLocale } from '../prototype-copy';
import styles from '../story-prototype.module.css';

const labels = { vinz: 'VINZ', react: 'React', typescript: 'TypeScript', tailwind: 'Tailwind CSS', motion: 'Motion', gsap: 'GSAP' };
const source = (id: IdentityId) => `/awwwards/identity/${id}.png`;
const identify = (src: string) => identityIds.find(id => source(id) === src);

export function HeroIdentity({ locale, exposed, paused, reducedMotion }: { locale: PrototypeLocale; exposed: boolean; paused: boolean; reducedMotion: boolean }) {
  const region = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);
  const [ready, setReady] = useState(false);
  const [clientReady, setClientReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const { targetId, displayedId, onShapeReady, onMorphComplete } = useIdentityCycle({ active: exposed && inView && !unavailable, paused: paused || reducedMotion });
  useEffect(() => {
    setClientReady(true);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    if (region.current) observer.observe(region.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => { if (paused || reducedMotion) setReady(false); }, [paused, reducedMotion]);
  const complete = useCallback((src: string) => {
    const id = identify(src);
    if (id && id === targetId) { onMorphComplete(id); if (!paused) setReady(true); }
  }, [onMorphComplete, targetId, paused]);
  const shapeReady = useCallback((src: string) => { const id = identify(src); if (id) onShapeReady(id); }, [onShapeReady]);
  const fail = useCallback((reason: string) => { if (['webgl', 'webgl2', 'context'].includes(reason)) setUnavailable(true); }, []);
  const staticIdentity = paused || reducedMotion || unavailable || !ready;

  return <figure ref={region} className={styles.heroIdentity} data-hero-identity data-hero-support data-displayed-identity={staticIdentity ? 'vinz' : displayedId}>
    <div className={styles.identityVisual} aria-hidden="true">
      <Image unoptimized className={styles.identityFallback} src="/awwwards/identity/vinz-contours.svg" alt="" width={810} height={810} priority hidden={!staticIdentity} />
      {clientReady && !reducedMotion && !unavailable && <ElectricLogo src={source(targetId)} active={exposed && inView} paused={paused} onShapeReady={shapeReady} onMorphComplete={complete} onUnavailable={fail} className={styles.electricCanvas} style={{ opacity: staticIdentity ? 0 : 1 }} />}
    </div>
    <figcaption><span translate="no">{staticIdentity ? 'VINZ' : labels[displayedId]}</span><span>{locale === 'pt-br' ? 'Identidade em movimento' : 'Identity in motion'}</span></figcaption>
  </figure>;
}
