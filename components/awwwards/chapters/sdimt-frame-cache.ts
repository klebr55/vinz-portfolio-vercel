import { clampSdimtFrame, SDIMT_FINAL_FRAME, type FrameCacheLimits } from './sdimt-sequence-model';

type Options<T> = {
  limits: FrameCacheLimits;
  bytesPerFrame: number;
  load(index: number, signal: AbortSignal): Promise<T>;
  dispose(frame: T): void;
  paint(frame: T, index: number): void;
};

export function createSdimtFrameCache<T>({ limits, bytesPerFrame, load, dispose, paint }: Options<T>) {
  let capacity = Math.max(0, Math.min(Math.floor(limits.maxEntries), Math.floor(limits.maxDecodedBytes / bytesPerFrame)));
  let concurrency = Math.max(0, Math.min(capacity, Math.floor(limits.concurrency)));
  const ready = new Map<number, T>();
  const pending = new Map<number, { controller: AbortController; obsolete: boolean }>();
  const failures = new Set<number>();
  let target: number | null = null, displayed: number | null = null;
  let active = true, closed = false, direction = 1;
  let peakEntries = 0, peakPending = 0, requests = 0, discarded = 0;

  const window = () => {
    if (target === null) return [];
    const indices = [target];
    for (let distance = 1; indices.length < capacity && distance < SDIMT_FINAL_FRAME; distance++) {
      for (const side of [direction, -direction]) {
        const index = target + distance * side;
        if (index >= 1 && index <= SDIMT_FINAL_FRAME && indices.length < capacity) indices.push(index);
      }
    }
    return indices;
  };
  const measure = () => {
    peakEntries = Math.max(peakEntries, ready.size + pending.size);
    peakPending = Math.max(peakPending, pending.size);
  };
  const show = (index: number, bitmap: T) => {
    if (active && !closed && target === index && displayed !== index) {
      paint(bitmap, index); displayed = index;
    }
  };
  const trim = () => {
    const desired = new Set(window());
    for (const [index, bitmap] of ready) if (!desired.has(index)) {
      ready.delete(index); dispose(bitmap);
    }
    while (ready.size + pending.size > capacity && ready.size) {
      const index = [...ready.keys()].find(index => index !== target) ?? ready.keys().next().value!;
      const bitmap = ready.get(index)!; ready.delete(index); dispose(bitmap);
    }
    for (const [index, job] of pending) if (!desired.has(index)) {
      job.obsolete = true; job.controller.abort();
    }
  };
  const pump = () => {
    if (!active || closed || !concurrency) return;
    for (const index of window()) {
      if (pending.size >= concurrency || ready.size + pending.size >= capacity) break;
      if (ready.has(index) || pending.has(index) || failures.has(index)) continue;
      const job = { controller: new AbortController(), obsolete: false };
      pending.set(index, job); requests++; measure();
      Promise.resolve().then(() => load(index, job.controller.signal)).then(bitmap => {
        if (closed || job.obsolete || !active || !window().includes(index)) {
          discarded++; dispose(bitmap);
        } else {
          pending.delete(index); ready.set(index, bitmap); show(index, bitmap); measure();
        }
      }, () => {
        if (!job.obsolete && !closed) failures.add(index);
      }).finally(() => { pending.delete(index); pump(); });
    }
  };

  return {
    request(index: number) {
      if (closed) return;
      const next = clampSdimtFrame(index);
      if (target !== null && next !== target) direction = next > target ? 1 : -1;
      target = next; trim();
      const cached = ready.get(next);
      if (cached !== undefined) show(next, cached);
      pump();
    },
    setActive(value: boolean) {
      if (closed || active === value) return;
      active = value;
      if (!active) for (const job of pending.values()) { job.obsolete = true; job.controller.abort(); }
      else {
        const cached = target === null ? undefined : ready.get(target);
        if (cached !== undefined) show(target!, cached);
        pump();
      }
    },
    setLimits(next: FrameCacheLimits) {
      if (closed) return;
      capacity = Math.max(0, Math.min(Math.floor(next.maxEntries), Math.floor(next.maxDecodedBytes / bytesPerFrame)));
      concurrency = Math.max(0, Math.min(capacity, Math.floor(next.concurrency)));
      trim(); pump();
    },
    clear() {
      if (closed) return;
      closed = true; active = false;
      for (const job of pending.values()) { job.obsolete = true; job.controller.abort(); }
      for (const bitmap of ready.values()) dispose(bitmap);
      ready.clear(); failures.clear();
    },
    stats() {
      return { entries: ready.size, estimatedDecodedBytes: (ready.size + pending.size) * bytesPerFrame,
        pending: pending.size, displayed, target, peakEntries, peakPending, requests, discarded, failures: failures.size, maxEntries: capacity };
    },
  };
}
