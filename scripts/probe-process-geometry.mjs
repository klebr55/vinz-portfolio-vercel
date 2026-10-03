import { readFileSync, writeFileSync } from 'node:fs';
import { Shape, Path, Vector2, LineSegments, LineDashedMaterial } from 'three';
import { createProcessGeometry } from '../components/awwwards/identity/process-geometry.ts';
const svg = readFileSync('public/awwwards/identity/vinz-process-contours.svg', 'utf8');
const contours = svg.match(/M[^Z]+Z/g).map(path => {
  const values = path.match(/-?\d+(?:\.\d+)?/g).map(Number);
  return Array.from({ length: values.length / 2 }, (_, i) => new Vector2(values[2 * i], -values[2 * i + 1]));
});
const shapes = [0, 2, 3, 4].map(i => new Shape(contours[i]));
shapes[0].holes = [new Path(contours[1])];
const resources = createProcessGeometry(shapes);
const material = new LineDashedMaterial();
new LineSegments(resources.edges, material).computeLineDistances();
const distances = resources.edges.getAttribute('lineDistance');
const report = { method: 'Same pure geometry builder as product; normalized SVG contours mapped to four Shapes and the source hole; no renderer', three: '0.177.0', shapes: shapes.length, contours: contours.map(c => c.length), extractedSegments: resources.sourcePositions.length / 6, renderedSegments: resources.edges.getAttribute('position').count / 2, length: distances.getX(distances.count - 1), thresholdDegrees: 20, bevel: false, depth: 58, scale: 4 / 810, paths: resources.paths.map(path => ({ ...path, startLength: distances.getX(path.start * 2), endLength: distances.getX(path.end * 2 - 1) })) };
writeFileSync('docs/awwwards/evidence-narrative/process-draw-worker/geometry.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report));
resources.geometry.dispose(); resources.edges.dispose(); material.dispose();
