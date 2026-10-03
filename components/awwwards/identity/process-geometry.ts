import { BufferGeometry, EdgesGeometry, ExtrudeGeometry, Float32BufferAttribute, type Shape } from 'three';

type Point = [number, number, number];
type Edge = { a: Point; b: Point; id: number };
const key = (p: Point) => p.map(value => Math.round(value * 100000)).join(':');

export function createProcessGeometry(shapes: Shape[]) {
  const geometry = new ExtrudeGeometry(shapes, { depth: 58, bevelEnabled: false, curveSegments: 8 });
  geometry.scale(4 / 810, 4 / 810, 4 / 810);
  geometry.center();
  geometry.computeBoundingBox();
  const extracted = new EdgesGeometry(geometry, 20);
  const position = extracted.getAttribute('position');
  const source: Edge[] = [];
  for (let i = 0; i < position.count; i += 2) {
    source.push({ a: [position.getX(i), position.getY(i), position.getZ(i)], b: [position.getX(i + 1), position.getY(i + 1), position.getZ(i + 1)], id: i / 2 });
  }
  const front = geometry.boundingBox!.max.z;
  const back = geometry.boundingBox!.min.z;
  const planar = (edge: Edge, z: number) => Math.abs(edge.a[2] - z) < .00001 && Math.abs(edge.b[2] - z) < .00001;
  const adjacency = new Map<string, Edge[]>();
  for (const edge of source.filter(edge => planar(edge, front))) {
    for (const point of [edge.a, edge.b]) adjacency.set(key(point), [...(adjacency.get(key(point)) ?? []), edge]);
  }
  const loops: { edges: Edge[]; points: Point[]; left: number }[] = [];
  const visited = new Set<number>();
  for (const initial of source.filter(edge => planar(edge, front))) {
    if (visited.has(initial.id)) continue;
    const edges: Edge[] = [];
    const points: Point[] = [];
    let edge = initial;
    let point = initial.a;
    const start = key(point);
    do {
      visited.add(edge.id);
      edges.push(edge);
      points.push(point);
      point = key(edge.a) === key(point) ? edge.b : edge.a;
      if (key(point) === start) break;
      const neighbours = adjacency.get(key(point)) ?? [];
      if (neighbours.length !== 2) throw Error('Process outline is not a closed contour');
      const next = neighbours.find(candidate => !visited.has(candidate.id));
      if (!next) throw Error('Process contour revisits an edge');
      edge = next;
    } while (edges.length <= source.length);
    loops.push({ edges, points, left: Math.min(...points.map(p => p[0])) });
  }
  loops.sort((a, b) => a.left - b.left);
  const ordered: number[] = [];
  const used = new Set<number>();
  const edgeMap = new Map(source.map(edge => [[key(edge.a), key(edge.b)].sort().join('|'), edge]));
  const append = (edge: Edge, a = edge.a, b = edge.b) => {
    if (used.has(edge.id)) throw Error('Process edge drawn twice');
    used.add(edge.id);
    ordered.push(...a, ...b);
  };
  const paths: { start: number; end: number; segments: number; connectors: number }[] = [];
  for (const loop of loops) {
    let first = 0;
    loop.points.forEach((point, i) => {
      const previous = loop.points[first];
      if (point[1] > previous[1] + .00001 || Math.abs(point[1] - previous[1]) < .00001 && point[0] < previous[0]) first = i;
    });
    const points = [...loop.points.slice(first), ...loop.points.slice(0, first)];
    const start = ordered.length / 6;
    const ring = (ringPoints: Point[]) => ringPoints.forEach((a, i) => {
      const b = ringPoints[(i + 1) % ringPoints.length];
      const edge = edgeMap.get([key(a), key(b)].sort().join('|'));
      if (!edge) throw Error('Process cap does not match extracted edges');
      append(edge, a, b);
    });
    ring(points);
    const corners = new Set(points.map(key));
    const connectors = source.filter(edge => !used.has(edge.id) && !planar(edge, front) && !planar(edge, back) && (corners.has(key(edge.a)) || corners.has(key(edge.b))));
    connectors.sort((a, b) => {
      const index = (edge: Edge) => points.findIndex(point => key(point) === key(edge.a) || key(point) === key(edge.b));
      return index(a) - index(b);
    });
    const bridge = connectors[0];
    if (bridge) append(bridge, bridge.a[2] > bridge.b[2] ? bridge.a : bridge.b, bridge.a[2] > bridge.b[2] ? bridge.b : bridge.a);
    const rear = points.map(point => [point[0], point[1], back] as Point);
    if (bridge) {
      const rearPoint = bridge.a[2] < bridge.b[2] ? bridge.a : bridge.b;
      const index = rear.findIndex(point => key(point) === key(rearPoint));
      rear.push(...rear.splice(0, index));
    }
    ring(rear);
    for (const connector of connectors.slice(1)) append(connector);
    paths.push({ start, end: ordered.length / 6, segments: points.length, connectors: connectors.length });
  }
  if (used.size !== source.length) throw Error('Process extraction contains unassigned edges');
  const edges = new BufferGeometry();
  edges.setAttribute('position', new Float32BufferAttribute(ordered, 3));
  const sourcePositions = Array.from(position.array);
  extracted.dispose();
  return { geometry, edges, paths, sourcePositions };
}
