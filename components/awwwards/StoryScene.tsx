'use client';

import { useEffect, useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import type { Group, Mesh } from 'three';
import type { PrototypeStyle } from './prototype-copy';

type SceneProps = {
  style: PrototypeStyle;
  progress: MutableRefObject<number>;
  invalidateScene: MutableRefObject<(() => void) | null>;
  onUnavailable: () => void;
};

function Frame({ depth, color, opacity }: { depth: number; color: string; opacity: number }) {
  return (
    <group position={[0, 0, depth]}>
      <mesh position={[0, 1.66, 0]}>
        <boxGeometry args={[4.8, 0.055, 0.08]} />
        <meshPhysicalMaterial color={color} metalness={0.78} roughness={0.18} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, -1.66, 0]}>
        <boxGeometry args={[4.8, 0.055, 0.08]} />
        <meshPhysicalMaterial color={color} metalness={0.78} roughness={0.18} transparent opacity={opacity} />
      </mesh>
      <mesh position={[-2.4, 0, 0]}>
        <boxGeometry args={[0.055, 3.32, 0.08]} />
        <meshPhysicalMaterial color={color} metalness={0.78} roughness={0.18} transparent opacity={opacity} />
      </mesh>
      <mesh position={[2.4, 0, 0]}>
        <boxGeometry args={[0.055, 3.32, 0.08]} />
        <meshPhysicalMaterial color={color} metalness={0.78} roughness={0.18} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

function Apparatus({ style, progress, invalidateScene, onUnavailable }: SceneProps) {
  const assembly = useRef<Group>(null);
  const frontPlane = useRef<Mesh>(null);
  const rearPlane = useRef<Mesh>(null);
  const { camera, gl, invalidate } = useThree();
  const accent = style === 'ember' ? '#f48853' : '#8bc9ff';
  const secondary = style === 'ember' ? '#ffe7c8' : '#d7d7ff';

  useEffect(() => {
    invalidateScene.current = invalidate;
    const canvas = gl.domElement;
    const handleLost = (event: Event) => {
      event.preventDefault();
      onUnavailable();
    };
    canvas.addEventListener('webglcontextlost', handleLost);
    invalidate();
    return () => {
      if (invalidateScene.current === invalidate) invalidateScene.current = null;
      canvas.removeEventListener('webglcontextlost', handleLost);
    };
  }, [gl, invalidate, invalidateScene, onUnavailable]);

  useFrame(() => {
    const value = Math.max(0, Math.min(1, progress.current));
    camera.position.set(0.9 - value * 1.05, 0.42 - value * 0.42, 9 - value * 2.2);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    if (assembly.current) {
      assembly.current.rotation.y = -0.37 + value * 0.37;
      assembly.current.rotation.x = 0.12 - value * 0.12;
      assembly.current.rotation.z = -0.1 + value * 0.1;
      assembly.current.scale.setScalar(0.92 + value * 0.28);
      assembly.current.position.x = 1.3 - value * 1.3;
    }
    if (frontPlane.current) {
      frontPlane.current.position.x = 0.85 + value * 1.95;
      frontPlane.current.rotation.z = 0.22 - value * 0.22;
    }
    if (rearPlane.current) {
      rearPlane.current.position.x = -0.85 - value * 1.95;
      rearPlane.current.rotation.z = -0.22 + value * 0.22;
    }
  });

  return (
    <>
      <ambientLight intensity={1.3} />
      <pointLight color={accent} intensity={30} position={[3, 3, 4]} />
      <pointLight color={secondary} intensity={18} position={[-4, -2, 2]} />
      <group ref={assembly}>
        <Frame depth={0.05} color={accent} opacity={0.9} />
        <mesh position={[0, 0, -0.52]}>
          <boxGeometry args={[4.55, 3.08, 0.025]} />
          <meshPhysicalMaterial color={secondary} metalness={0.18} roughness={0.12} transparent opacity={0.055} side={2} />
        </mesh>
        <mesh ref={rearPlane} position={[-0.85, 0, -0.24]} rotation={[0, 0, -0.22]}>
          <boxGeometry args={[1.5, 4.25, 0.04]} />
          <meshPhysicalMaterial color={secondary} metalness={0.3} roughness={0.1} transparent opacity={0.23} side={2} />
        </mesh>
        <mesh ref={frontPlane} position={[0.85, 0, 0.32]} rotation={[0, 0, 0.22]}>
          <boxGeometry args={[1.5, 4.25, 0.04]} />
          <meshPhysicalMaterial color={accent} metalness={0.24} roughness={0.11} transparent opacity={0.31} side={2} />
        </mesh>
      </group>
    </>
  );
}

export default function StoryScene(props: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0.9, 0.42, 9], fov: 42, near: 0.1, far: 40 }}
      dpr={[1, 1.5]}
      frameloop="demand"
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      fallback={null}
    >
      <Apparatus {...props} />
    </Canvas>
  );
}
