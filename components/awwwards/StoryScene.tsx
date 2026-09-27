'use client';

import { Component, Suspense, useEffect, useMemo, useRef, type MutableRefObject, type ReactNode } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Box3, CanvasTexture, DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry, SRGBColorSpace, Vector3, type Group, type MeshStandardMaterial } from 'three';
import type { PrototypeStyle } from './prototype-copy';

const MODEL_PATH = '/awwwards/laptop-aullwen-original.glb';
const NKS_PATH = '/awwwards/nks-source-from-existing-mockup.png';

type SceneProps = {
  style: PrototypeStyle;
  progress: MutableRefObject<number>;
  invalidateScene: MutableRefObject<(() => void) | null>;
  onUnavailable: () => void;
};

class SceneBoundary extends Component<{ children: ReactNode; onUnavailable: () => void }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onUnavailable();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function Laptop({ style, progress, invalidateScene, onUnavailable }: SceneProps) {
  const { scene } = useGLTF(MODEL_PATH);
  const source = useTexture(NKS_PATH);
  const assembly = useRef<Group>(null);
  const { camera, gl, invalidate, size } = useThree();

  const asset = useMemo(() => {
    const model = scene.clone(true);
    const frame = model.getObjectByName('Frame_ComputerFrame_0') as Mesh;
    const screen = model.getObjectByName('Screen_ComputerScreen_0') as Mesh;
    if (!frame || !screen) throw new Error('Frame or Screen mesh missing in laptop GLB');

    const frameMaterial = (frame.material as MeshStandardMaterial).clone();
    frameMaterial.transparent = true;
    frameMaterial.depthWrite = false;
    frame.material = frameMaterial;
    const screenShellMaterial = (screen.material as MeshStandardMaterial).clone();
    screenShellMaterial.map = null;
    screenShellMaterial.color.set('#111116');
    screenShellMaterial.roughness = 0.45;
    screenShellMaterial.transparent = true;
    screenShellMaterial.depthWrite = false;
    screen.material = screenShellMaterial;

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 608;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('2D canvas unavailable for NKS screen');
    context.drawImage(source.image, 320, 250, 525, 300, 0, 0, canvas.width, canvas.height);
    const screenTexture = new CanvasTexture(canvas);
    screenTexture.colorSpace = SRGBColorSpace;
    screenTexture.anisotropy = 4;
    const screenMaterial = new MeshBasicMaterial({ map: screenTexture, side: DoubleSide, toneMapped: false, transparent: true, depthWrite: false });
    const screenGeometry = new PlaneGeometry(0.294, 0.179);
    const screenMedia = new Mesh(screenGeometry, screenMaterial);
    screenMedia.name = 'NKS_screen_media';
    screenMedia.position.set(-0.003, 0.101, -0.006);
    screenMedia.rotation.y = Math.PI;
    screenMedia.renderOrder = 2;
    screen.add(screenMedia);

    const bounds = new Box3().setFromObject(model);
    const center = bounds.getCenter(new Vector3());
    const extent = bounds.getSize(new Vector3());
    const scale = 4.8 / Math.max(extent.x, extent.y, extent.z);
    model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    model.scale.setScalar(scale);

    return { model, frameMaterial, screenShellMaterial, screenMaterial, screenTexture, screenGeometry };
  }, [scene, source]);

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
      asset.frameMaterial.dispose();
      asset.screenShellMaterial.dispose();
      asset.screenMaterial.dispose();
      asset.screenTexture.dispose();
      asset.screenGeometry.dispose();
    };
  }, [asset, gl, invalidate, invalidateScene, onUnavailable]);

  useFrame(() => {
    const value = Math.max(0, Math.min(1, progress.current));
    const mobile = size.width < 760;
    const approach = Math.min(1, value / 0.73);
    const eased = approach * approach * (3 - 2 * approach);
    camera.position.set(mobile ? 0.1 - eased * 0.1 : 1.1 - eased * 1.1, mobile ? 0.3 - eased * 0.2 : 0.7 - eased * 0.55, (mobile ? 9.2 : 8.2) - eased * (mobile ? 2.1 : 5.6));
    camera.lookAt(0, 0, 0);

    if (assembly.current) {
      assembly.current.position.x = mobile ? 0 : 1.22 - eased * 1.22;
      assembly.current.position.y = mobile ? -2.05 + eased * 2.05 : -0.28 + eased * 0.28;
      assembly.current.rotation.y = -0.28 + eased * 0.28;
      assembly.current.rotation.x = -0.07 + eased * 0.07;
      assembly.current.scale.setScalar(mobile ? 0.54 + eased * 0.24 : 1);
    }

    asset.frameMaterial.opacity = 1 - Math.max(0, Math.min(1, (value - 0.43) / 0.38));
    asset.screenShellMaterial.opacity = asset.frameMaterial.opacity;
    asset.screenMaterial.opacity = 1 - Math.max(0, Math.min(1, (value - 0.79) / 0.16));
  });

  return (
    <>
      <ambientLight intensity={style === 'ember' ? 1.8 : 1.35} />
      <directionalLight color={style === 'ember' ? '#ffe2b7' : '#c6e5ff'} intensity={3.2} position={[2.8, 4.2, 5]} />
      <directionalLight color={style === 'ember' ? '#f89069' : '#7899ff'} intensity={1.7} position={[-3, 1, -2]} />
      <group ref={assembly}>
        <primitive object={asset.model} dispose={null} />
      </group>
    </>
  );
}

export default function StoryScene(props: SceneProps) {
  return (
    <SceneBoundary onUnavailable={props.onUnavailable}>
      <Canvas
        camera={{ position: [1.1, 0.7, 8.2], fov: 42, near: 0.1, far: 40 }}
        dpr={[1, 1.5]}
        frameloop="demand"
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        fallback={null}
      >
        <Suspense fallback={null}>
          <Laptop {...props} />
        </Suspense>
      </Canvas>
    </SceneBoundary>
  );
}

useGLTF.preload(MODEL_PATH);
