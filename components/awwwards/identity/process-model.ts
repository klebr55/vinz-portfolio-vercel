const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function resolveProcessFrame(progress: number) {
  const p = clamp(Number.isFinite(progress) ? progress : 0);
  const orientation = 1 - clamp(p / .9);
  return {
    drawn: clamp((p - .1) / .45),
    filled: clamp((p - .5) / .4),
    rotateX: 20 * orientation,
    rotateY: orientation === 0 ? 0 : -35 * orientation,
  };
}
