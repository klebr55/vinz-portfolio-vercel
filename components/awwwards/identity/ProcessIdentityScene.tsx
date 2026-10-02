'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { BufferGeometry, Float32BufferAttribute, ExtrudeGeometry, Group, LineDashedMaterial, LineSegments, MeshPhysicalMaterial, PMREMGenerator } from 'three';
import { cancelFrame, frame, transformValue, type MotionValue } from 'motion';
import { threeEffect } from 'motion/three';
import { resolveProcessFrame } from './process-model';

function Identity({ svg, progress, active, onUnavailable, onReady }: { svg: string; progress: MotionValue<number>; active: boolean; onUnavailable(reason: string): void; onReady(): void }) {
  const group = useRef<Group>(null);
  const delivered = useRef(false);
  const { gl, scene, invalidate } = useThree();
  const resources = useMemo(() => {
    const parsed = new SVGLoader().parse(svg);
    const shapes = parsed.paths.flatMap(path => SVGLoader.createShapes(path));
    const geometry = new ExtrudeGeometry(shapes, { depth: 32, bevelEnabled: false, curveSegments: 8 });
    geometry.scale(4 / 810, -4 / 810, 4 / 810);
    geometry.center();
    const vertices: number[] = [];
    geometry.computeBoundingBox();
    const centerX = (geometry.boundingBox!.max.x + geometry.boundingBox!.min.x) / 2;
    const centerY = (geometry.boundingBox!.max.y + geometry.boundingBox!.min.y) / 2;
    const raw = new ExtrudeGeometry(shapes, { depth: 32, bevelEnabled: false });
    raw.computeBoundingBox();
    const cx = (raw.boundingBox!.min.x + raw.boundingBox!.max.x) / 2;
    const cy = (raw.boundingBox!.min.y + raw.boundingBox!.max.y) / 2;
    raw.dispose();
    for (const shape of shapes) {
      for (const path of [shape, ...shape.holes]) {
        const points = path.getPoints();
        for (const z of [-16, 16]) {
          for (let i = 0; i < points.length - 1; i++) {
            for (const p of [points[i], points[i + 1]]) vertices.push((p.x - cx) * 4 / 810 + centerX, -(p.y - cy) * 4 / 810 + centerY, z * 4 / 810);
          }
        }
        for (let i = 0; i < points.length; i += Math.max(1, Math.floor(points.length / 4))) {
          const p = points[i];
          for (const z of [-16, 16]) vertices.push((p.x - cx) * 4 / 810, -(p.y - cy) * 4 / 810, z * 4 / 810);
        }
      }
    }
    const edges = new BufferGeometry();
    edges.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    const wireMaterial = new LineDashedMaterial({ color: '#c2fff1', transparent: true, dashSize: 0, gapSize: 10000 });
    const wire = new LineSegments(edges, wireMaterial);
    wire.computeLineDistances();
    const distances = edges.getAttribute('lineDistance');
    const length = distances.getX(distances.count - 1);
    const material = new MeshPhysicalMaterial({ color: '#5692f0', emissive: '#1e5bc1', emissiveIntensity: .2, metalness: 1, roughness: .15, transparent: true, opacity: 0, depthWrite: false });
    return { geometry, edges, material, wireMaterial, wire, length };
  }, [svg]);

  useEffect(() => {
    const lost = () => onUnavailable('context');
    gl.domElement.addEventListener('webglcontextlost', lost);
    const room = new RoomEnvironment();
    const pmrem = new PMREMGenerator(gl);
    const target = pmrem.fromScene(room, .04);
    scene.environment = target.texture;
    invalidate();
    return () => { gl.domElement.removeEventListener('webglcontextlost', lost); scene.environment = null; target.dispose(); pmrem.dispose(); room.dispose(); };
  }, [gl, scene, invalidate, onUnavailable]);

  useEffect(() => () => {
    resources.geometry.dispose(); resources.edges.dispose(); resources.material.dispose(); resources.wireMaterial.dispose();
  }, [resources]);

  useEffect(() => {
    delivered.current = false;
    if (!active || !group.current) return;
    const drawn = transformValue(() => resources.length * resolveProcessFrame(progress.get()).drawn);
    const filled = transformValue(() => resolveProcessFrame(progress.get()).filled);
    const opacity = transformValue(() => 1 - filled.get() * .92);
    const rotateX = transformValue(() => resolveProcessFrame(progress.get()).rotateX);
    const rotateY = transformValue(() => resolveProcessFrame(progress.get()).rotateY);
    const cancels = [threeEffect(resources.wireMaterial, { dashSize: drawn, opacity }), threeEffect(resources.material, { opacity: filled }), threeEffect(group.current, { rotateX, rotateY })];
    const render = () => invalidate();
    const changed = () => frame.render(render);
    const unsubscribe = progress.on('change', changed);
    changed();
    return () => { unsubscribe(); cancelFrame(render); cancels.forEach(cancel => cancel()); [drawn, filled, opacity, rotateX, rotateY].forEach(value => value.destroy()); };
  }, [active, progress, resources, invalidate]);

  const rendered = () => {
    if (!active || delivered.current) return;
    const state = resolveProcessFrame(progress.get());
    if (Math.abs(resources.material.opacity - state.filled) > .00001 || Math.abs(resources.wireMaterial.dashSize - resources.length * state.drawn) > .00001) return;
    delivered.current = true;
    onReady();
  };
  return <group ref={group} dispose={null}><mesh geometry={resources.geometry} material={resources.material} onAfterRender={rendered} /><primitive object={resources.wire} /></group>;
}

export default function ProcessIdentityScene({ progress, active, onUnavailable, onReady }: { progress: MotionValue<number>; active: boolean; onUnavailable(reason: string): void; onReady(): void }) {
  const [svg, setSvg] = useState('');
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    const probe = document.createElement('canvas');
    try {
      const context = probe.getContext('webgl2');
      if (!context) { onUnavailable('webgl'); return; }
      context.getExtension('WEBGL_lose_context')?.loseContext();
    } catch { onUnavailable('webgl'); return; }
    setAvailable(true);
    const controller = new AbortController();
    fetch('/awwwards/identity/vinz-contours.svg', { signal: controller.signal }).then(response => { if (!response.ok) throw Error('Asset unavailable'); return response.text(); }).then(setSvg).catch(error => { if (error.name !== 'AbortError') onUnavailable('asset'); });
    return () => controller.abort();
  }, [onUnavailable]);
  if (!available) return null;
  return <Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ position: [0, 0, 7], fov: 38 }} gl={{ alpha: true, antialias: true }} fallback={<span />}>
    {svg && <Identity svg={svg} progress={progress} active={active} onUnavailable={onUnavailable} onReady={onReady} />}
  </Canvas>;
}
