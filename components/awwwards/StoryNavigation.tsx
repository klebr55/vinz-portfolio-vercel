'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useTransform, useMotionValueEvent, type MotionValue } from 'motion/react';
import { PanelsTopLeft, UserRound, Workflow, Send, Pause, Play } from 'lucide-react';
import { useLiquidGlass } from './use-liquid-glass';
import { localeChapterHref, type ChapterId } from './story-model';
import type { PrototypeLocale } from './prototype-copy';
import styles from './story-prototype.module.css';

export function StoryNavigation({ locale, activeChapter, navigate, progress, reducedMotion, paused, togglePause }: { locale: PrototypeLocale; activeChapter: ChapterId; navigate: (id: ChapterId) => void; progress: MotionValue<number>; reducedMotion: boolean; paused: boolean; togglePause(): void }) {
  const { surfaceRef, backdropFilter } = useLiquidGlass<HTMLSpanElement>();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const amount = useTransform(progress, value => reducedMotion ? 0 : Math.max(0, Math.min(1, value)));
  const width = useTransform(amount, value => `min(100%, ${970 - 506 * value}px)`);
  const padding = useTransform(amount, [0, 1], [24, 12]);
  const gap = useTransform(amount, value => `${36 - 26 * value}px`);
  const linkGap = useTransform(amount, [0, 1], [20, 0]);
  const labelWidth = useTransform(amount, [0, 1], [86, 0]);
  const labelOpacity = useTransform(amount, [.15, .7], [1, 0]);
  const iconOpacity = useTransform(amount, [.2, .8], [0, 1]);
  useMotionValueEvent(amount, 'change', value => setCompact(value > .8));
  const icons = { sdimt: PanelsTopLeft, about: UserRound, process: Workflow, contact: Send };
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
      <motion.nav className={styles.nav} style={{ width, paddingLeft: padding, paddingRight: padding, columnGap: gap }} data-compact={compact} aria-label={locale === 'pt-br' ? 'Navegação principal' : 'Main navigation'}>
        <span ref={surfaceRef} className={styles.glassSurface} style={{ backdropFilter, WebkitBackdropFilter: backdropFilter }} aria-hidden="true" />
        <a className={styles.brand} href="#intro" onClick={(event) => onNavigate(event, 'intro', 'intro')} aria-label={locale === 'pt-br' ? 'KV, início' : 'KV, start'}>KV<span>.</span></a>
        <button ref={menuButton} className={styles.menuButton} type="button" aria-expanded={open} aria-controls="story-nav-links" onClick={() => setOpen((value) => !value)}>Menu</button>
        <motion.div id="story-nav-links" className={styles.navLinks} data-open={open} style={{ gap: linkGap }}>
          {navItems.map(({ id, label, hash }) => {
            const Icon = icons[id as keyof typeof icons];
            return <a key={id} href={`#${hash}`} aria-label={label} aria-current={activeChapter === id || (id === 'sdimt' && ['nks', 'milan', 'sincad', 'criactive'].includes(activeChapter)) ? 'location' : undefined} onClick={(event) => onNavigate(event, id, hash)}><motion.span className={styles.navIcon} style={{ opacity: iconOpacity }} aria-hidden="true"><Icon size={20} /></motion.span><motion.span className={styles.navLabel} style={{ width: labelWidth, opacity: labelOpacity }} aria-hidden="true">{label}</motion.span><span className={styles.navTooltip} aria-hidden="true">{label}</span></a>;
          })}
        </motion.div>
        {!reducedMotion && <button className={styles.navMotionButton} type="button" aria-pressed={paused} aria-label={paused ? (locale === 'pt-br' ? 'Retomar movimento' : 'Resume motion') : (locale === 'pt-br' ? 'Pausar movimento' : 'Pause motion')} onClick={togglePause}>{paused ? <Play size={18} aria-hidden="true" /> : <Pause size={18} aria-hidden="true" />}<span className={styles.navTooltip} aria-hidden="true">{paused ? (locale === 'pt-br' ? 'Retomar' : 'Resume') : (locale === 'pt-br' ? 'Pausar' : 'Pause')}</span></button>}
        <div className={styles.languageLinks} aria-label={locale === 'pt-br' ? 'Idioma' : 'Language'}>
          <a href={localeChapterHref('pt-br', activeChapter)} lang="pt-BR" aria-current={locale === 'pt-br' ? 'page' : undefined}>PT</a>
          <span aria-hidden="true">/</span>
          <a href={localeChapterHref('en', activeChapter)} lang="en" aria-current={locale === 'en' ? 'page' : undefined}>EN</a>
        </div>
      </motion.nav>
    </header>
  );
}
