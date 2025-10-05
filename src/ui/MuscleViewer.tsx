import React, { Suspense, useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { AccumulativeShadows, CameraControls, Center, Environment, GizmoHelper, GizmoViewport, Grid, Html, Loader, RandomizedLight, useAnimations, useGLTF } from '@react-three/drei';
import { Group, Mesh, MeshStandardMaterial, Object3D } from 'three';

useGLTF.preload('/models/muscle_male.glb');
useGLTF.preload('/models/muscle_female.glb');

export type Sex = 'male' | 'female';

type ModelProps = { sex: Sex; play: boolean; autoplay: boolean; wireframe: boolean };

function MuscularModel({ sex, play, autoplay, wireframe }: ModelProps) {
  const gltf = useGLTF(`/models/muscle_${sex}.glb`) as any;
  const group = useRef<Group>(null!);

  // Optional: set wireframe for all MeshStandardMaterial
  useMemo(() => {
    gltf.scene.traverse((node: Object3D) => {
      const mesh = node as Mesh;
      const material = mesh.material as MeshStandardMaterial | undefined;
      if (material && 'wireframe' in material) {
        material.wireframe = wireframe;
      }
    });
  }, [gltf, wireframe]);

  // If animations exist, play the first clip
  // We'll use the built-in animations array from GLTF
  const animations = gltf.animations ?? [];
  const hasClips = (animations?.length ?? 0) > 0;
  const { actions, names } = useAnimations(animations, group);

  // Fallback simple breathing animation if no clips in GLB (scale pulsation)
  const tRef = useRef(0);
  useFrame((_, delta) => {
    if (!play || hasClips) return;
    tRef.current = (tRef.current + delta) % 10000;
    const pulse = 1 + Math.sin(tRef.current * 1.2) * 0.01;
    if (group.current) group.current.scale.setScalar(pulse);
  });

  useEffect(() => {
    if (!hasClips || !actions || !names || names.length === 0) return;
    const first = names[0];
    const act = actions[first];
    if (!act) return;
    act.reset();
    if (play || autoplay) act.play(); else act.stop();
    return () => {
      act.stop();
    };
  }, [actions, names, play, autoplay, hasClips]);

  return <primitive ref={group} object={gltf.scene} dispose={null} />;
}

function OverlayInstructions() {
  return (
    <div className="overlay">
      <strong>Onde colocar os modelos GLB:</strong>
      <ol>
        <li>Crie a pasta <code>public/models</code>.</li>
        <li>Adicione <code>muscle_male.glb</code> e <code>muscle_female.glb</code>.</li>
      </ol>
      <div className="small">Dica: GLB com animações (ex. respiração) serão reproduzidas.</div>
    </div>
  );
}

export function MuscleViewer() {
  const [sex, setSex] = useState<Sex>('male');
  const [wireframe, setWireframe] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [play, setPlay] = useState(true);

  return (
    <div className="canvas-wrap">
      <div className="panel">
        <h2>Controles</h2>
        <div className="row">
          <label>Sexo</label>
          <select value={sex} onChange={(e) => setSex(e.target.value as Sex)}>
            <option value="male">Masculino</option>
            <option value="female">Feminino</option>
          </select>
        </div>
        <div className="row">
          <label>Wireframe</label>
          <button onClick={() => setWireframe(w => !w)}>{wireframe ? 'On' : 'Off'}</button>
        </div>
        <div className="row">
          <label>Animação</label>
          <button className="primary" onClick={() => setPlay(p => !p)}>{play ? 'Pausar' : 'Reproduzir'}</button>
          <label className="small"><input type="checkbox" checked={autoplay} onChange={(e) => setAutoplay(e.target.checked)} /> Autoplay</label>
        </div>
      </div>

      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 1.6, 2.8], fov: 45 }}>
        <color attach="background" args={[0x0b1020]} />
        <fog attach="fog" args={[0x0b1020, 8, 16]} />

        <Suspense fallback={<Html center>Carregando modelo…</Html>}>
          <Center>
            <MuscularModel sex={sex} play={play} autoplay={autoplay} wireframe={wireframe} />
          </Center>
        </Suspense>

        <hemisphereLight intensity={0.5} color={0xffffff} groundColor={0x334} />
        <spotLight position={[4, 6, 3]} angle={0.35} penumbra={0.5} intensity={50} castShadow />
        <spotLight position={[-4, 6, -3]} angle={0.45} penumbra={0.5} intensity={20} color={0x77aaff} />

        <AccumulativeShadows temporal frames={60} scale={12} position={[0, -1.05, 0]}>
          <RandomizedLight amount={8} radius={4} ambient={0.5} intensity={2} position={[5, 5, 0]} />
        </AccumulativeShadows>

        <Grid infiniteGrid position={[0, -1, 0]} sectionColor="#1a2a55" cellColor="#0f1c3d" fadeDistance={18} />
        <Environment preset="studio" />
        <CameraControls makeDefault dollyToCursor minDistance={1.2} maxDistance={6} />
        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport labelColor="white" axisHeadScale={1} />
        </GizmoHelper>
      </Canvas>

      <div className="legend">
        Arraste com o mouse para orbitar • Shift para pan • Scroll para zoom
      </div>

      <OverlayInstructions />
      <Loader />
    </div>
  );
}
