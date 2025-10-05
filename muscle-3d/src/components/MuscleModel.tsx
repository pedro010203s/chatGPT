import { useEffect, useMemo, useRef, useState } from 'react'
import { Group, Mesh, Vector3 } from 'three'
import { useFrame } from '@react-three/fiber'
import { Html, useGLTF, useAnimations } from '@react-three/drei'
import { useAppStore } from '../state/store'

type MuscleModelProps = {
  sex: 'male' | 'female'
  playing: boolean
  speed: number
}

function FallbackMuscleModel({ playing, speed }: { playing: boolean; speed: number }) {
  const groupRef = useRef<Group>(null)
  const chestRef = useRef<Mesh>(null)
  const abdomenRef = useRef<Mesh>(null)
  const leftArmRef = useRef<Mesh>(null)
  const rightArmRef = useRef<Mesh>(null)
  const leftLegRef = useRef<Mesh>(null)
  const rightLegRef = useRef<Mesh>(null)
  const headRef = useRef<Mesh>(null)

  const setHovered = useAppStore((s) => s.setHoveredPartName)
  const hoveredName = useAppStore((s) => s.hoveredPartName)

  useFrame((state) => {
    if (!playing) return
    const t = state.clock.getElapsedTime() * speed
    const breath = 0.02 * Math.sin(t * 1.2)
    if (chestRef.current) chestRef.current.scale.setScalar(1 + breath)
    if (abdomenRef.current) abdomenRef.current.position.y = -0.35 + breath * 0.5
    const swing = 0.05 * Math.sin(t * 2)
    if (leftArmRef.current) leftArmRef.current.rotation.z = swing
    if (rightArmRef.current) rightArmRef.current.rotation.z = -swing
    if (leftLegRef.current) leftLegRef.current.rotation.z = -swing * 0.6
    if (rightLegRef.current) rightLegRef.current.rotation.z = swing * 0.6
    if (groupRef.current) groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.2
  })

  const baseColor = '#d75b5b'
  const highlightColor = '#ffcc66'

  const onOver = (name: string) => setHovered(name)
  const onOut = () => setHovered(null)

  const labelAnchor = useMemo(() => new Vector3(0, 1.8, 0), [])

  return (
    <group ref={groupRef} position={[0, -1.0, 0]} onPointerMissed={onOut}>
      <mesh
        ref={chestRef}
        name="Pectoralis major"
        position={[0, 0.8, 0]}
        onPointerOver={() => onOver('Pectoralis major')}
        onPointerOut={onOut}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.9, 0.5, 0.4]} />
        <meshStandardMaterial color={hoveredName === 'Pectoralis major' ? highlightColor : baseColor} metalness={0.1} roughness={0.8} />
      </mesh>

      <mesh
        ref={abdomenRef}
        name="Rectus abdominis"
        position={[0, 0.4, 0]}
        onPointerOver={() => onOver('Rectus abdominis')}
        onPointerOut={onOut}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.6, 0.6, 0.35]} />
        <meshStandardMaterial color={hoveredName === 'Rectus abdominis' ? highlightColor : baseColor} />
      </mesh>

      <mesh
        ref={headRef}
        name="Head"
        position={[0, 1.4, 0]}
        onPointerOver={() => onOver('Head')}
        onPointerOut={onOut}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[0.23, 32, 16]} />
        <meshStandardMaterial color={hoveredName === 'Head' ? highlightColor : baseColor} />
      </mesh>

      <mesh
        ref={leftArmRef}
        name="Deltoid (L)"
        position={[-0.7, 0.9, 0]}
        rotation={[0, 0, 0]}
        onPointerOver={() => onOver('Deltoid (L)')}
        onPointerOut={onOut}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.12, 0.12, 0.8, 16]} />
        <meshStandardMaterial color={hoveredName === 'Deltoid (L)' ? highlightColor : baseColor} />
      </mesh>
      <mesh
        ref={rightArmRef}
        name="Deltoid (R)"
        position={[0.7, 0.9, 0]}
        onPointerOver={() => onOver('Deltoid (R)')}
        onPointerOut={onOut}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.12, 0.12, 0.8, 16]} />
        <meshStandardMaterial color={hoveredName === 'Deltoid (R)' ? highlightColor : baseColor} />
      </mesh>

      <mesh
        ref={leftLegRef}
        name="Quadriceps (L)"
        position={[-0.25, -0.2, 0]}
        onPointerOver={() => onOver('Quadriceps (L)')}
        onPointerOut={onOut}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.15, 0.15, 1.0, 16]} />
        <meshStandardMaterial color={hoveredName === 'Quadriceps (L)' ? highlightColor : baseColor} />
      </mesh>
      <mesh
        ref={rightLegRef}
        name="Quadriceps (R)"
        position={[0.25, -0.2, 0]}
        onPointerOver={() => onOver('Quadriceps (R)')}
        onPointerOut={onOut}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.15, 0.15, 1.0, 16]} />
        <meshStandardMaterial color={hoveredName === 'Quadriceps (R)' ? highlightColor : baseColor} />
      </mesh>

      <Html position={labelAnchor.toArray()} center wrapperClass="label3d">
        <div style={{
          padding: '4px 8px',
          background: 'rgba(0,0,0,0.5)',
          borderRadius: 6,
          fontSize: 12,
          whiteSpace: 'nowrap',
        }}>
          {hoveredName ? hoveredName : 'Passe o mouse para destacar'}
        </div>
      </Html>
    </group>
  )
}

function GLTFMuscleModel({ sex, playing, speed }: { sex: 'male' | 'female'; playing: boolean; speed: number }) {
  const groupRef = useRef<Group>(null)
  const setHovered = useAppStore((s) => s.setHoveredPartName)
  const hoveredName = useAppStore((s) => s.hoveredPartName)
  const gltf = useGLTF(`/models/muscle-${sex}.glb`)
  const { actions, mixer } = useAnimations((gltf as any).animations, (gltf as any).scene)

  useEffect(() => {
    if (!actions) return
    Object.values(actions).forEach((action: any) => {
      action.reset()
      if (playing) action.play()
      action.paused = !playing
    })
  }, [actions, playing, sex])

  useEffect(() => {
    if (mixer) (mixer as any).timeScale = speed || 1
  }, [mixer, speed])

  useFrame((state) => {
    if (!playing || !groupRef.current) return
    const t = state.clock.getElapsedTime() * speed
    groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.3
  })

  return (
    <group
      ref={groupRef}
      position={[0, -1.2, 0]}
      onPointerOver={(e) => {
        e.stopPropagation()
        if (e.object && (e.object as any).name) setHovered((e.object as any).name as string)
      }}
      onPointerOut={() => setHovered(null)}
      dispose={null}
    >
      <primitive object={(gltf as any).scene} />
      {hoveredName && (
        <Html position={[0, 2, 0]} center wrapperClass="label3d">
          <div style={{ padding: '4px 8px', background: 'rgba(0,0,0,0.5)', borderRadius: 6, fontSize: 12 }}>
            {hoveredName}
          </div>
        </Html>
      )}
    </group>
  )
}

export function MuscleModel({ sex, playing, speed }: MuscleModelProps) {
  const [hasGlb, setHasGlb] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false
    const url = `/models/muscle-${sex}.glb`
    fetch(url, { method: 'HEAD' })
      .then((res) => {
        if (!cancelled) setHasGlb(res.ok)
      })
      .catch(() => !cancelled && setHasGlb(false))
    return () => {
      cancelled = true
    }
  }, [sex])

  if (hasGlb) {
    return <GLTFMuscleModel sex={sex} playing={playing} speed={speed} />
  }
  return <FallbackMuscleModel playing={playing} speed={speed} />
}

// Optional preloads if models exist in /public/models
// useGLTF.preload('/models/muscle-male.glb')
// useGLTF.preload('/models/muscle-female.glb')
