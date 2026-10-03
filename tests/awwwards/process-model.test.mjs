import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { Shape, Path, Vector2, LineSegments, LineDashedMaterial } from 'three';
import { createProcessGeometry } from '../../components/awwwards/identity/process-geometry.ts';
import { resolveProcessFrame } from '../../components/awwwards/identity/process-model.ts';

const fixture = () => {
  const svg = readFileSync(new URL('../../public/awwwards/identity/vinz-process-contours.svg', import.meta.url), 'utf8');
  const contours = svg.match(/M[^Z]+Z/g).map(path => {
    const coordinates = path.match(/-?\d+(?:\.\d+)?/g).map(Number);
    return Array.from({ length: coordinates.length / 2 }, (_, i) => new Vector2(coordinates[2 * i], -coordinates[2 * i + 1]));
  });
  assert.equal(contours.length, 5);
  const shapes = [0, 2, 3, 4].map(index => new Shape(contours[index]));
  shapes[0].holes = [new Path(contours[1])];
  return shapes;
};

test('short scroll leaves observable drawing and gradual material before the reading interval', () => {
  assert.equal(resolveProcessFrame(-1).drawn, 0);
  assert.ok(resolveProcessFrame(80 / 2700).drawn > 0);
  assert.ok(resolveProcessFrame(120 / 2700).drawn < .1);
  assert.equal(resolveProcessFrame(.6).drawn, 1);
  assert.equal(resolveProcessFrame(.5).filled, 0);
  assert.equal(resolveProcessFrame(.7).filled.toFixed(3), '0.500');
  assert.equal(resolveProcessFrame(.9).filled, 1);
  assert.equal(resolveProcessFrame(.9).wireOpacity.toFixed(3), '0.100');
  assert.deepEqual(resolveProcessFrame(1.2), resolveProcessFrame(1));
  assert.deepEqual(resolveProcessFrame(NaN), resolveProcessFrame(0));
  assert.equal(resolveProcessFrame(.9).rotateX, 8);
  assert.equal(resolveProcessFrame(.9).rotateY, -16);
  for (let i = 1; i <= 100; i++) {
    assert.ok(resolveProcessFrame(i / 100).drawn >= resolveProcessFrame((i - 1) / 100).drawn);
    assert.ok(resolveProcessFrame(i / 100).filled >= resolveProcessFrame((i - 1) / 100).filled);
  }
});

test('ordered wire contains every extracted physical edge exactly once, including the hole', () => {
  const resources = createProcessGeometry(fixture());
  const position = resources.edges.getAttribute('position');
  const segmentKey = array => {
    const points = [array.slice(0, 3), array.slice(3, 6)].map(point => point.map(value => Math.round(value * 100000)).join(':'));
    return points.sort().join('|');
  };
  const keys = array => Array.from({ length: array.length / 6 }, (_, i) => segmentKey(array.slice(i * 6, i * 6 + 6))).sort();
  assert.deepEqual(keys(Array.from(position.array)), keys(resources.sourcePositions));
  assert.equal(resources.paths.length, 5);
  assert.ok(position.count / 2 < 180, 'raster steps must not create a web of internal lines');
  for (const path of resources.paths) {
    assert.ok(path.segments >= 3);
    assert.ok(path.connectors >= 3, 'depth must use actual corners');
    for (const start of [path.start, path.start + path.segments + 1]) {
      for (let i = start; i < start + path.segments - 1; i++) {
        assert.deepEqual(Array.from(position.array.slice(i * 6 + 3, i * 6 + 6)), Array.from(position.array.slice((i + 1) * 6, (i + 1) * 6 + 3)));
      }
    }
  }
  for (let i = 0; i < position.count; i += 2) {
    if (position.getZ(i) !== position.getZ(i + 1)) {
      assert.equal(position.getX(i), position.getX(i + 1));
      assert.equal(position.getY(i), position.getY(i + 1));
    }
  }
  const material = new LineDashedMaterial();
  const wire = new LineSegments(resources.edges, material);
  wire.computeLineDistances();
  const distance = resources.edges.getAttribute('lineDistance');
  let length = 0;
  for (let i = 0; i < position.count; i += 2) {
    length += Math.hypot(position.getX(i + 1) - position.getX(i), position.getY(i + 1) - position.getY(i), position.getZ(i + 1) - position.getZ(i));
    assert.ok(Math.abs(distance.getX(i + 1) - length) < .0001);
    assert.ok(Number.isFinite(distance.getX(i + 1)));
  }
  assert.ok(length > 35 && length < 100);
  resources.geometry.dispose(); resources.edges.dispose(); material.dispose();
});
