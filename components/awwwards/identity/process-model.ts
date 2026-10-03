const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function resolveProcessFrame(progress: number) {
  const p = clamp(Number.isFinite(progress) ? progress : 0);
  const filled = p >= .9 ? 1 : clamp((p - .5) / .4);
  const orientation = 1 - clamp(p / .9);
  return {
    drawn: p >= .6 ? 1 : clamp(p / .6),
    filled,
    wireOpacity: 1 - .9 * filled,
    rotateX: 8 + 12 * orientation,
    rotateY: -16 - 19 * orientation,
  };
}
