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
        <p className={styles.caseLead}>{locale === 'pt-br' ? 'Dados interestaduais em uma experiência pública de entrada.' : 'Interstate data through a public entry experience.'}</p>
        <p className={styles.mediaCaption}>{locale === 'pt-br' ? 'Capturas da landing pública. O painel autenticado não é mostrado aqui.' : 'Captures of the public landing. The authenticated dashboard is not shown here.'}</p>
        <CaseEditorial caseData={caseData} locale={locale} />
      </div>
    </section>
  );
}
