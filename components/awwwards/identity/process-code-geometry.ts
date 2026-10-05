import { LineSegments, LineDashedMaterial, type Shape } from 'three';
import { createProcessGeometry } from './process-geometry';
import type { ProcessGroupId } from './process-model';

export type ProcessVectorPart = { sourcePathIndex: number; color: string; shapes: Shape[] };
export type ProcessCodePart = ReturnType<typeof createProcessGeometry> & {
  sourcePathIndex: number; groupId: ProcessGroupId; color: string;
  wireLength: number; startDistance: number; endDistance: number; zOffset: number;
};

export function createProcessCodeGeometry(input: ProcessVectorPart[]) {
  const groupLengths: Record<ProcessGroupId, number> = { foundation: 0, windows: 0, content: 0, code: 0 };
  const parts: ProcessCodePart[] = [];
  try {
    for (const part of input) {
      const index = part.sourcePathIndex;
      const groupId: ProcessGroupId = index <= 10 ? 'foundation' : [11, 12, 17].includes(index) ? 'windows' : index === 18 ? 'content' : 'code';
      const resources = createProcessGeometry(part.shapes, { depth: 8, scale: 4 / 1024, origin: [512, -512, 0] });
      const material = new LineDashedMaterial();
      new LineSegments(resources.edges, material).computeLineDistances();
      material.dispose();
      const distances = resources.edges.getAttribute('lineDistance');
      const wireLength = distances.getX(distances.count - 1);
      const startDistance = groupLengths[groupId];
      groupLengths[groupId] += wireLength;
      parts.push({ ...resources, sourcePathIndex: index, groupId, color: part.color, wireLength, startDistance, endDistance: groupLengths[groupId], zOffset: index * .001 });
    }
  } catch (error) {
    parts.forEach(part => { part.geometry.dispose(); part.edges.dispose(); });
    throw error;
  }
  return { parts, groupLengths, dispose() { parts.forEach(part => { part.geometry.dispose(); part.edges.dispose(); }); } };
}
