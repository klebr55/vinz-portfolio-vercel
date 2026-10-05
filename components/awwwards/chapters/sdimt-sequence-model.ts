export type FrameCacheLimits = { maxEntries: number; maxDecodedBytes: number; concurrency: number };
export const SDIMT_FINAL_FRAME = 241;
export const SDIMT_FRAME_BYTES = 2880 * 1620 * 4;
export const SDIMT_CACHE_LIMITS = {
  desktop: { maxEntries: 5, maxDecodedBytes: 96 * 1024 * 1024, concurrency: 2 },
  mobile: { maxEntries: 3, maxDecodedBytes: 64 * 1024 * 1024, concurrency: 2 },
} satisfies Record<string, FrameCacheLimits>;

export function resolveSdimtFrame(progress: number): number {
  return 1 + Math.round(Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0)) * (SDIMT_FINAL_FRAME - 1));
}

export function clampSdimtFrame(index: number): number {
  return Math.max(1, Math.min(SDIMT_FINAL_FRAME, Math.round(Number.isFinite(index) ? index : 1)));
}

export function sdimtFramePath(index: number): string {
  return `/awwwards/sdimt/motion-sdimt/frame_${String(clampSdimtFrame(index)).padStart(6, '0')}.webp`;
}
