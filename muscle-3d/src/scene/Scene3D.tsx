import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { useAppStore } from '../state/store'
import { MuscleModel } from '../components/MuscleModel'

export function Scene3D() {
  const sex = useAppStore((s) => s.sex)
  const playing = useAppStore((s) => s.playing)
  const speed = useAppStore((s) => s.speed)

  return (
    <Canvas shadows camera={{ position: [2.5, 1.8, 3.2], fov: 45 }} style={{ background: '#0f1115' }}>
      <color attach="background" args={["#0f1115"]} />
      <ambientLight intensity={0.6} />
      <directionalLight
        castShadow
        position={[4, 6, 4]}
        intensity={1.0}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Suspense fallback={null}>
        <MuscleModel sex={sex} playing={playing} speed={speed} />
        <Environment preset="city" />
      </Suspense>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <OrbitControls makeDefault enableDamping dampingFactor={0.08} />
    </Canvas>
  )
}
