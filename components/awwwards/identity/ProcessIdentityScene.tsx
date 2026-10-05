'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Group, LineDashedMaterial, LineSegments, MeshPhysicalMaterial, PMREMGenerator, Shape, Path, Vector2, Mesh, PlaneGeometry, MeshBasicMaterial, Color } from 'three';
import { cancelFrame, frame, transformValue, type MotionValue } from 'motion';
import { threeEffect } from 'motion/three';
import { resolveProcessFrame } from './process-model';
import { createProcessCodeGeometry } from './process-code-geometry';

function Identity({ svg, progress, active, onUnavailable, onReady }: { svg: string; progress: MotionValue<number>; active: boolean; onUnavailable(reason: string): void; onReady(): void }) {
  const group = useRef<Group>(null);
  const delivered = useRef(false);
  const { gl, scene, invalidate } = useThree();
  const resources = useMemo(() => {
    const parsed = new SVGLoader().parse(svg);
    const parts = parsed.paths.map((path, sourcePathIndex) => ({
      sourcePathIndex, color: `#${path.color.getHexString()}`,
      shapes: SVGLoader.createShapes(path).map(source => {
        const reflect = (path: Path) => path.getPoints(24).map(point => new Vector2(point.x, -point.y));
        const shape = new Shape(reflect(source));
        shape.holes = source.holes.map(hole => new Path(reflect(hole)));
        return shape;
      }),
    }));
    const geometry = createProcessCodeGeometry(parts);
    const layered = geometry.parts.map(part => {
      const wireMaterial = new LineDashedMaterial({ color: part.color, transparent: true, dashSize: 0, gapSize: part.wireLength * 10, depthTest: false, toneMapped: false });
      const wire = new LineSegments(part.edges, wireMaterial);
      wire.renderOrder = part.sourcePathIndex * 2 + 1;
      const material = new MeshPhysicalMaterial({ color: part.color, metalness: .08, roughness: .55, clearcoat: 0, envMapIntensity: .6, transparent: true, opacity: 0, depthWrite: false });
      return { ...part, wireMaterial, wire, material };
    });
    return { ...geometry, layered };
  }, [svg]);

  useEffect(() => {
    const lost = () => onUnavailable('context');
    gl.domElement.addEventListener('webglcontextlost', lost);
    const room = new RoomEnvironment();
    for (const [x, y, z, width, height, strength] of [[-4, 2, 5, 3, 6, 5], [2, -2, 4, 7, .7, 3]]) {
      const panel = new Mesh(new PlaneGeometry(width, height), new MeshBasicMaterial({ color: new Color().setRGB(strength, strength, strength) }));
      panel.position.set(x, y, z);
      panel.lookAt(0, 0, 0);
      room.add(panel);
    }
    const pmrem = new PMREMGenerator(gl);
    const target = pmrem.fromScene(room, .04);
    scene.environment = target.texture;
    invalidate();
    return () => { gl.domElement.removeEventListener('webglcontextlost', lost); scene.environment = null; target.dispose(); pmrem.dispose(); room.dispose(); };
  }, [gl, scene, invalidate, onUnavailable]);

  useEffect(() => () => {
    resources.dispose();
    resources.layered.forEach(part => { part.material.dispose(); part.wireMaterial.dispose(); });
  }, [resources]);

  useEffect(() => {
    delivered.current = false;
    if (!active || !group.current) return;
    const values: MotionValue<number>[] = [];
    const cancels: (() => void)[] = [];
    const derived = (read: () => number) => { const value = transformValue(read); values.push(value); return value; };
    for (const part of resources.layered) {
      const localDraw = () => Math.min(1, Math.max(0, (resolveProcessFrame(progress.get()).groups[part.groupId].drawn * resources.groupLengths[part.groupId] - part.startDistance) / part.wireLength));
      const dashSize = derived(() => part.wireLength * localDraw());
      const opacity = derived(() => resolveProcessFrame(progress.get()).groups[part.groupId].wireOpacity);
      const filled = derived(() => resolveProcessFrame(progress.get()).groups[part.groupId].filled * Math.min(1, Math.max(0, (localDraw() - .7) / .3)));
      const metalness = derived(() => .08 + .25 * resolveProcessFrame(progress.get()).finish);
      const roughness = derived(() => .55 - .3 * resolveProcessFrame(progress.get()).finish);
      const clearcoat = derived(() => .65 * resolveProcessFrame(progress.get()).finish);
      cancels.push(threeEffect(part.wireMaterial, { dashSize, opacity }), threeEffect(part.material, { opacity: filled, metalness, roughness, clearcoat }));
    }
    const rotateX = derived(() => resolveProcessFrame(progress.get()).rotateX);
    const rotateY = derived(() => resolveProcessFrame(progress.get()).rotateY);
    cancels.push(threeEffect(group.current, { rotateX, rotateY }));
    const render = () => {
      resources.layered.forEach(part => { threeEffect.flush(part.wireMaterial); threeEffect.flush(part.material); });
      if (group.current) threeEffect.flush(group.current);
      invalidate();
    };
    const changed = () => frame.postRender(render);
    const subscriptions = values.map(value => value.on('change', changed));
    changed();
    return () => { subscriptions.forEach(unsubscribe => unsubscribe()); cancelFrame(render); cancels.forEach(cancel => cancel()); values.forEach(value => value.destroy()); };
  }, [active, progress, resources, invalidate]);

  const rendered = () => {
    if (!active || delivered.current) return;
    const state = resolveProcessFrame(progress.get());
    if (resources.layered.some(part => {
      const local = Math.min(1, Math.max(0, (state.groups[part.groupId].drawn * resources.groupLengths[part.groupId] - part.startDistance) / part.wireLength));
      const filled = state.groups[part.groupId].filled * Math.min(1, Math.max(0, (local - .7) / .3));
      return Math.abs(part.material.opacity - filled) > .00001 || Math.abs(part.wireMaterial.dashSize - part.wireLength * local) > .00001;
    })) return;
    delivered.current = true;
    onReady();
  };
  return <group ref={group} dispose={null}>{resources.layered.map(part => <group key={part.sourcePathIndex} position-z={part.zOffset}>
    <mesh geometry={part.geometry} material={part.material} renderOrder={part.sourcePathIndex * 2} onAfterRender={part.sourcePathIndex === 18 ? rendered : undefined} />
    <primitive object={part.wire} />
  </group>)}</group>;

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
    fetch('/awwwards/process/code.svg', { signal: controller.signal }).then(response => { if (!response.ok) throw Error('Asset unavailable'); return response.text(); }).then(setSvg).catch(error => { if (error.name !== 'AbortError') onUnavailable('asset'); });
    return () => controller.abort();
  }, [onUnavailable]);
  if (!available) return null;
  return <Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ position: [0, 0, 7], fov: 34 }} gl={{ alpha: true, antialias: true }} fallback={<span />}>
    <ambientLight intensity={.8} /><directionalLight position={[2, 3, 5]} intensity={1.4} />
    {svg && <Identity svg={svg} progress={progress} active={active} onUnavailable={onUnavailable} onReady={onReady} />}
  </Canvas>;
}
