'use client';

import { useEffect, useRef, useState } from 'react';
import { useLiquidGlass } from './use-liquid-glass';
import { localeChapterHref, type ChapterId } from './story-model';
import type { PrototypeLocale } from './prototype-copy';
import styles from './story-prototype.module.css';

export function StoryNavigation({ locale, activeChapter, navigate }: { locale: PrototypeLocale; activeChapter: ChapterId; navigate: (id: ChapterId) => void }) {
  const { surfaceRef, backdropFilter } = useLiquidGlass<HTMLSpanElement>();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); menuButton.current?.focus(); }
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [open]);
  const navItems: { id: ChapterId; label: string; hash: string }[] = locale === 'pt-br'
    ? [{ id: 'sdimt', label: 'Projetos', hash: 'projects' }, { id: 'about', label: 'Sobre', hash: 'about' }, { id: 'process', label: 'Processo', hash: 'process' }, { id: 'contact', label: 'Contato', hash: 'contact' }]
    : [{ id: 'sdimt', label: 'Projects', hash: 'projects' }, { id: 'about', label: 'About', hash: 'about' }, { id: 'process', label: 'Process', hash: 'process' }, { id: 'contact', label: 'Contact', hash: 'contact' }];
  const onNavigate = (event: React.MouseEvent<HTMLAnchorElement>, id: ChapterId, hash: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    history.pushState(null, '', `#${hash}`);
    navigate(id);
    setOpen(false);
  };
  return (
    <header className={styles.navShell}>
      <nav className={styles.nav} aria-label={locale === 'pt-br' ? 'Navegação principal' : 'Main navigation'}>
        <span ref={surfaceRef} className={styles.glassSurface} style={{ backdropFilter, WebkitBackdropFilter: backdropFilter }} aria-hidden="true" />
        <a className={styles.brand} href="#intro" onClick={(event) => onNavigate(event, 'intro', 'intro')} aria-label={locale === 'pt-br' ? 'KV, início' : 'KV, start'}>KV<span>.</span></a>
        <button ref={menuButton} className={styles.menuButton} type="button" aria-expanded={open} aria-controls="story-nav-links" onClick={() => setOpen((value) => !value)}>Menu</button>
        <div id="story-nav-links" className={styles.navLinks} data-open={open}>
          {navItems.map(({ id, label, hash }) => <a key={id} href={`#${hash}`} onClick={(event) => onNavigate(event, id, hash)}>{label}</a>)}
        </div>
        <div className={styles.languageLinks} aria-label={locale === 'pt-br' ? 'Idioma' : 'Language'}>
          <a href={localeChapterHref('pt-br', activeChapter)} lang="pt-BR" aria-current={locale === 'pt-br' ? 'page' : undefined}>PT</a>
          <span aria-hidden="true">/</span>
          <a href={localeChapterHref('en', activeChapter)} lang="en" aria-current={locale === 'en' ? 'page' : undefined}>EN</a>
        </div>
      </nav>
    </header>
  );
}
