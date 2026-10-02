'use client';

import { chapterIds, type ChapterId } from './story-model';
import type { PrototypeLocale } from './prototype-copy';
import styles from './story-prototype.module.css';

const labels: Record<PrototypeLocale, Record<ChapterId, string>> = {
  'pt-br': { intro: 'Início', sdimt: 'SDIMT', nks: 'NKS', milan: 'Milan', sincad: 'Sincad', criactive: 'Criactive', about: 'Sobre', process: 'Processo', testimonials: 'Depoimentos', contact: 'Contato' },
  en: { intro: 'Start', sdimt: 'SDIMT', nks: 'NKS', milan: 'Milan', sincad: 'Sincad', criactive: 'Criactive', about: 'About', process: 'Process', testimonials: 'Testimonials', contact: 'Contact' },
};

export function ChapterCheckpoints({ locale, activeChapter, navigate }: { locale: PrototypeLocale; activeChapter: ChapterId; navigate: (id: ChapterId) => void }) {
  const link = (id: ChapterId, index: number) => (
    <a key={id} href={`#${id}`} aria-current={activeChapter === id ? 'location' : undefined} onClick={(event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      event.currentTarget.closest('details')?.removeAttribute('open');
      history.pushState(null, '', `#${id}`);
      navigate(id);
    }}>
      <span className={styles.checkpointNumber}>{String(index + 1).padStart(2, '0')}</span>
      <span className={styles.checkpointLabel}>{labels[locale][id]}</span>
    </a>
  );
  return (
    <>
      <nav className={styles.checkpointRail} aria-label={locale === 'pt-br' ? 'Capítulos' : 'Chapters'}>
        {chapterIds.map(link)}
      </nav>
      <details className={styles.checkpointMobile}>
        <summary>{labels[locale][activeChapter]} <span aria-hidden="true">⌄</span></summary>
        <nav aria-label={locale === 'pt-br' ? 'Capítulos' : 'Chapters'}>{chapterIds.map(link)}</nav>
      </details>
    </>
  );
}
