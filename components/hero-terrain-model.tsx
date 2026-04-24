"use client"

import { Suspense, useMemo, useRef } from "react"
import { ContactShadows, Environment, useGLTF } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import {
  Group,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  SRGBColorSpace,
} from "three"

type HeroTerrainModelProps = {
  className?: string
}

function TerrainAsset() {
  const meshGroupRef = useRef<Group>(null)
  const loadedObject = useGLTF("/models/pastoral-terrain.glb", true, true)

  const terrainObject = useMemo(() => {
    const clone = loadedObject.scene.clone(true)

    clone.traverse((child) => {
      const maybeMesh = child as Mesh
      if (!maybeMesh.isMesh) {
        return
      }

      maybeMesh.geometry.computeVertexNormals()

      maybeMesh.material = new MeshPhysicalMaterial({
        color: "#bcc5b7",
        roughness: 0.48,
        metalness: 0.06,
        clearcoat: 0.38,
        clearcoatRoughness: 0.46,
        reflectivity: 0.38,
        envMapIntensity: 1.8,
        emissive: "#1d4333",
        emissiveIntensity: 0.05,
      })
      maybeMesh.castShadow = true
      maybeMesh.receiveShadow = true
    })

    return clone
  }, [loadedObject.scene])

  useFrame((state, delta) => {
    if (!meshGroupRef.current) {
      return
    }

    const pointerTargetX = 0.22 + state.pointer.y * 0.16
    const pointerTargetY = -0.58 + state.pointer.x * 0.26
    meshGroupRef.current.rotation.x = MathUtils.damp(meshGroupRef.current.rotation.x, pointerTargetX, 4.2, delta)
    meshGroupRef.current.rotation.y = MathUtils.damp(meshGroupRef.current.rotation.y, pointerTargetY, 4.2, delta)
    meshGroupRef.current.rotation.z = MathUtils.damp(meshGroupRef.current.rotation.z, -0.18, 4.2, delta)

    meshGroupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.85) * 0.06
  })

  return <primitive ref={meshGroupRef} object={terrainObject} scale={0.66} position={[0, -0.88, 0]} />
}

function TerrainFallback() {
  return (
    <mesh rotation={[0.8, 0.3, -0.3]}>
      <boxGeometry args={[2.2, 0.9, 2.2]} />
      <meshStandardMaterial color="#3f6a58" />
    </mesh>
  )
}

export function HeroTerrainModel({ className }: HeroTerrainModelProps) {
  return (
    <div className={className}>
      <div className="terrain-shell">
        <Canvas
          dpr={[1, 1.6]}
          shadows
          gl={{ antialias: true }}
          camera={{ position: [0, 2.9, 5.4], fov: 29 }}
          onCreated={({ gl }) => {
            gl.outputColorSpace = SRGBColorSpace
          }}
        >
          <color attach="background" args={["#1d4333"]} />
          <Environment preset="city" background={false} blur={0.55} />

          <ambientLight intensity={0.4} />
          <directionalLight
            castShadow
            position={[4.8, 8.2, 4.2]}
            intensity={1.24}
            color="#f8f3e8"
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight position={[-4.2, 3.2, -3.3]} intensity={0.34} color="#7a4c2e" />
          <spotLight position={[0, 6.4, 8]} intensity={0.36} angle={0.42} penumbra={0.7} color="#fdfdfb" />

          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.12, 0]} receiveShadow>
            <circleGeometry args={[3.3, 64]} />
            <meshStandardMaterial color="#17372a" roughness={0.22} metalness={0.1} envMapIntensity={1.25} />
          </mesh>
          <ContactShadows
            position={[0, -1.09, 0]}
            opacity={0.3}
            scale={4.6}
            blur={2.2}
            far={2.7}
          />

          <Suspense fallback={<TerrainFallback />}>
            <TerrainAsset />
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}

useGLTF.preload("/models/pastoral-terrain.glb", true, true)
