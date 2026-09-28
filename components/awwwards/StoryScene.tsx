'use client';

import { Component, Suspense, useEffect, useMemo, useRef, type MutableRefObject, type ReactNode } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Box3, DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry, SRGBColorSpace, Vector3, VideoTexture, type Group, type MeshStandardMaterial } from 'three';
import type { PrototypeStyle } from './prototype-copy';

const MODEL_PATH = '/awwwards/laptop-aullwen-original.glb';
const NKS_PATH = '/awwwards/nks-editorial-poster.jpg';
const SCREEN_WIDTH = 0.2936;
const SCREEN_HEIGHT = 0.1696;
const SCREEN_CROP = (SCREEN_WIDTH / SCREEN_HEIGHT) / (16 / 9);

type SceneProps = {
  style: PrototypeStyle;
  progress: MutableRefObject<number>;
  invalidateScene: MutableRefObject<(() => void) | null>;
  onUnavailable: () => void;
  video: HTMLVideoElement | null;
  mediaReady: boolean;
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

function Laptop({ style, progress, invalidateScene, onUnavailable, video, mediaReady }: SceneProps) {
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

    const screenTexture = source.clone();
    screenTexture.colorSpace = SRGBColorSpace;
    screenTexture.repeat.set(SCREEN_CROP, 1);
    screenTexture.offset.set((1 - SCREEN_CROP) / 2, 0);
    screenTexture.needsUpdate = true;
    const screenMaterial = new MeshBasicMaterial({ map: screenTexture, side: DoubleSide, toneMapped: false, transparent: true, depthWrite: false });
    const screenGeometry = new PlaneGeometry(SCREEN_WIDTH, SCREEN_HEIGHT);
    const screenMedia = new Mesh(screenGeometry, screenMaterial);
    screenMedia.name = 'NKS_screen_media';
    screenMedia.position.set(0, 0.100355, 0.0032);
    screenMedia.rotation.y = Math.PI;
    screenMedia.renderOrder = 3;
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
    if (!video || !mediaReady) return;
    const texture = new VideoTexture(video);
    texture.colorSpace = SRGBColorSpace;
    texture.repeat.set(SCREEN_CROP, 1);
    texture.offset.set((1 - SCREEN_CROP) / 2, 0);
    asset.screenMaterial.map = texture;
    asset.screenMaterial.needsUpdate = true;
    invalidate();
    return () => {
      asset.screenMaterial.map = asset.screenTexture;
      asset.screenMaterial.needsUpdate = true;
      texture.dispose();
    };
  }, [asset, video, mediaReady, invalidate]);

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
    const align = Math.min(1, value / 0.18);
    const aligned = align * align * (3 - 2 * align);
    const zoom = Math.max(0, Math.min(1, (value - 0.72) / 0.22));
    const zoomed = zoom * zoom * (3 - 2 * zoom);
    const screenY = 0.0641576;
    camera.position.set(mobile ? 0.1 * (1 - aligned) : 1.1 * (1 - aligned), (mobile ? 0.3 : 0.7) * (1 - aligned) + screenY * aligned, (mobile ? 9.2 : 8.2) * (1 - aligned) + (mobile ? 9.3 : 5.8) * aligned + (1.9 - (mobile ? 9.3 : 5.8)) * zoomed);
    camera.lookAt(0, screenY * aligned, -1.5687628 * zoomed);

    if (assembly.current) {
      assembly.current.position.x = mobile ? 0 : 1.22 * (1 - aligned);
      assembly.current.position.y = mobile ? -2.05 * (1 - aligned) : -0.28 * (1 - aligned);
      assembly.current.rotation.y = -0.28 * (1 - aligned);
      assembly.current.rotation.x = -0.07 * (1 - aligned);
      assembly.current.scale.setScalar(mobile ? 0.54 + 0.18 * aligned + 0.28 * zoomed : 1);
    }

    asset.frameMaterial.opacity = 1 - Math.max(0, Math.min(1, (value - 0.86) / 0.06));
    asset.screenShellMaterial.opacity = asset.frameMaterial.opacity;
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
