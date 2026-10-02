'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export const identityIds = ['vinz', 'react', 'typescript', 'tailwind', 'motion', 'gsap'] as const;
export type IdentityId = typeof identityIds[number];

export function useIdentityCycle({ active, paused }: { active: boolean; paused: boolean }) {
  const [targetId, setTargetId] = useState<IdentityId>('vinz');
  const [displayedId, setDisplayedId] = useState<IdentityId>('vinz');
  const [settled, setSettled] = useState(false);
  const [visible, setVisible] = useState(true);
  const target = useRef(targetId);
  target.current = targetId;
  const remaining = useRef(4000);

  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    update(); document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  useEffect(() => {
    if (!paused) return;
    remaining.current = 4000;
    setTargetId('vinz'); setDisplayedId('vinz'); setSettled(true);
  }, [paused]);

  useEffect(() => {
    if (!active || paused || !visible || !settled) return;
    const started = performance.now();
    let fired = false;
    const timer = window.setTimeout(() => {
      fired = true;
      setSettled(false);
      const next = identityIds[(identityIds.indexOf(target.current) + 1) % identityIds.length];
      remaining.current = next === 'vinz' ? 4000 : 2800;
      setTargetId(next);
    }, remaining.current);
    return () => { window.clearTimeout(timer); if (!fired) remaining.current = Math.max(0, remaining.current - (performance.now() - started)); };
  }, [active, paused, visible, settled, targetId]);

  const onShapeReady = useCallback((id: IdentityId) => { if (id !== target.current) return; }, []);
  const onMorphComplete = useCallback((id: IdentityId) => {
    if (id !== target.current) return;
    remaining.current = id === 'vinz' ? 4000 : 2800;
    setDisplayedId(id); setSettled(true);
  }, []);
  return { targetId, displayedId, onShapeReady, onMorphComplete };
}
