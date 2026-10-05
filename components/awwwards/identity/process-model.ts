export type ProcessStageId = 1 | 2 | 3;
export type ProcessGroupId = 'foundation' | 'windows' | 'content' | 'code';
export type ProcessAnchors = readonly [number, number, number, number];
export type ProcessFrame = {
  stage: ProcessStageId;
  localProgress: number;
  groups: Record<ProcessGroupId, { drawn: number; filled: number; wireOpacity: number }>;
  finish: number;
  sceneComplete: boolean;
  rotateX: number;
  rotateY: number;
};
const clamp = (value: number) => Math.min(1, Math.max(0, value));
const phase = (value: number, start: number, end: number) => value >= end - 1e-10 ? 1 : clamp((value - start) / (end - start));

export function resolveProcessProgress(scrollY: number, anchors: ProcessAnchors): number {
  if (!Number.isFinite(scrollY) || anchors.some((value, i) => !Number.isFinite(value) || i > 0 && value <= anchors[i - 1])) return 0;
  if (scrollY <= anchors[0]) return 0;
  for (let i = 0; i < 3; i++) {
    if (scrollY < anchors[i + 1]) return (i + (scrollY - anchors[i]) / (anchors[i + 1] - anchors[i])) / 3;
  }
  return 1;
}

export function resolveProcessFrame(progress: number): ProcessFrame {
  const p = clamp(Number.isFinite(progress) ? progress : 0);
  const stage = Math.min(3, Math.floor(p * 3) + 1) as ProcessStageId;
  const localProgress = p * 3 - (stage - 1);
  const first = clamp(p * 3), second = clamp(p * 3 - 1), third = clamp(p * 3 - 2);
  const group = (local: number, drawEnd: number, fillStart: number, fillEnd: number, drawStart = 0) => {
    const drawn = phase(local, drawStart, drawEnd), filled = phase(local, fillStart, fillEnd);
    return { drawn, filled, wireOpacity: 1 - .92 * filled };
  };
  const groups = {
    foundation: group(first, .9, .5, 1),
    windows: group(second, .7, .35, .85),
    content: group(second, .95, .55, 1, .35),
    code: group(third, .65, .35, .8),
  };
  const finish = phase(third, .25, .8);
  return { stage, localProgress, groups, finish, sceneComplete: finish === 1 && Object.values(groups).every(value => value.drawn === 1 && value.filled === 1), rotateX: 4 * (1 - finish), rotateY: finish === 1 ? 0 : -6 * (1 - finish) };
}
