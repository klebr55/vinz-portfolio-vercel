import Image from 'next/image';
import type { MutableRefObject } from 'react';
import { CaseEditorial } from '../CaseEditorial';
import { caseMedia } from '../case-media';
import type { EditorialCase } from '../case-content';
import type { PrototypeLocale } from '../prototype-copy';
import type { StorySample } from '../story-model';
import styles from '../story-prototype.module.css';

export function SdimtChapter({ locale, caseData }: { locale: PrototypeLocale; sample: MutableRefObject<StorySample>; reducedMotion: boolean; caseData: EditorialCase }) {
  return (
    <section id="sdimt" data-story-chapter="sdimt" className={styles.sdimtChapter} aria-labelledby="sdimt-title">
      <span id="projects" className={styles.anchorAlias} aria-hidden="true" />
      <figure className={styles.sdimtFallback}>
        <Image src={caseMedia.sdimt.source} alt={caseData.media.alt} width={1440} height={900} sizes="100vw" unoptimized />
      </figure>
      <div className={styles.sdimtArrival} aria-hidden="true" />
      <div className={styles.sdimtReading}>
        <div className={styles.caseEyebrow}>{locale === 'pt-br' ? '01 / Ambição' : '01 / Ambition'}</div>
        <h2 id="sdimt-title" data-story-read tabIndex={-1}>SDIMT<span className={styles.titlePeriod}>.</span></h2>
        <p className={styles.caseLead}>{locale === 'pt-br' ? 'No SDIMT, ela começa com uma pergunta: como tornar a comparação remuneratória mais clara?' : 'In SDIMT, it starts with a question: how can remuneration comparisons become clearer?'}</p>
        <p className={styles.mediaCaption}>{locale === 'pt-br' ? 'Capturas da landing pública. O painel autenticado não é mostrado aqui.' : 'Captures of the public landing. The authenticated dashboard is not shown here.'}</p>
        <figure className={styles.sdimtMobileMedia}><Image src="/awwwards/sdimt/landing-mobile.webp" alt={locale === 'pt-br' ? 'Landing pública SDIMT em viewport mobile, sem recorte lateral' : 'Public SDIMT landing in a mobile viewport, without lateral cropping'} width={390} height={844} sizes="100vw" unoptimized /></figure>
        <CaseEditorial caseData={caseData} locale={locale} />
      </div>
    </section>
  );
}
