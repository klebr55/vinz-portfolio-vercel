import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { Shape, Path, Vector2, LineSegments, LineDashedMaterial } from 'three';
import { createProcessGeometry } from '../../components/awwwards/identity/process-geometry.ts';
import { resolveProcessFrame, resolveProcessProgress } from '../../components/awwwards/identity/process-model.ts';

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

test('semantic stages reserve code and completion for the end of finalization', () => {
  for (const p of [0, .2, .5, 2/3]) {
    const f = resolveProcessFrame(p);
    assert.equal(f.groups.code.drawn, 0);
    assert.equal(f.sceneComplete, false);
  }
  assert.equal(resolveProcessFrame(2/3 + .8/3).sceneComplete, true);
  assert.deepEqual(resolveProcessFrame(-1), resolveProcessFrame(0));
  assert.deepEqual(resolveProcessFrame(NaN), resolveProcessFrame(0));
  assert.deepEqual(resolveProcessFrame(2), resolveProcessFrame(1));
  assert.equal(resolveProcessFrame(1).rotateX, 0);
  assert.equal(resolveProcessFrame(1).rotateY, 0);
  for (let i=1; i<=300; i++) {
    const previous=resolveProcessFrame((i-1)/300), current=resolveProcessFrame(i/300);
    for (const group of ['foundation','windows','content','code']) {
      assert.ok(current.groups[group].drawn >= previous.groups[group].drawn);
      assert.ok(current.groups[group].filled >= previous.groups[group].filled);
    }
  }
  const middle=resolveProcessFrame(.51);
  resolveProcessFrame(1);
  assert.deepEqual(resolveProcessFrame(.51),middle);
});

test('measured nonuniform anchors interpolate semantic thirds and reject invalid ranges', () => {
  const anchors=[0,900,2100,3300];
  assert.equal(resolveProcessProgress(900,anchors),1/3);
  assert.equal(resolveProcessProgress(2100,anchors),2/3);
  assert.equal(resolveProcessProgress(1500,anchors),.5);
  assert.equal(resolveProcessProgress(3300,anchors),1);
  assert.equal(resolveProcessProgress(-500,anchors),0);
  for (const a of [[0,0,2,3],[0,2,1,3],[0,1,2,NaN]]) assert.equal(resolveProcessProgress(1,a),0);
  assert.equal(resolveProcessProgress(NaN,anchors),0);
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
