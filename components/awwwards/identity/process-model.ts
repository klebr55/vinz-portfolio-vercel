const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function resolveProcessFrame(progress: number) {
  const p = clamp(Number.isFinite(progress) ? progress : 0);
  const orientation = p >= .78 ? 0 : 1 - clamp((p - .1) / .68);
  return {
    drawn: p >= .42 ? 1 : clamp((p - .1) / .32),
    filled: p >= .62 ? 1 : clamp((p - .38) / .24),
    rotateX: 8 + 12 * orientation,
    rotateY: -16 - 19 * orientation,
  };
}
