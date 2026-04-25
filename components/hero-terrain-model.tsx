"use client"

import { useMemo, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  MathUtils,
  PCFShadowMap,
  PlaneGeometry,
  SRGBColorSpace,
} from "three"

type HeroTerrainModelProps = {
  className?: string
}

const SEGS = 100
const SIZE = 7.2

// Layered noise: multi-octave sin/cos for organic terrain shape
function terrainHeight(nx: number, nz: number): number {
  let h = 0
  h += Math.sin(nx * Math.PI * 2.1 + 0.7) * Math.cos(nz * Math.PI * 1.6 + 0.4) * 1.0
  h += Math.sin(nx * Math.PI * 3.8 + 1.3) * Math.sin(nz * Math.PI * 3.2 + 0.9) * 0.48
  h += Math.cos(nx * Math.PI * 6.4 + 0.5) * Math.cos(nz * Math.PI * 5.7 + 1.2) * 0.18
  h += Math.sin((nx + nz) * Math.PI * 4.1 + 0.3) * 0.14
  // Diagonal ridge (SW to NE)
  const ridgeX = nx * 1.8 - 0.6
  const ridgeZ = nz * 1.4 - 0.1
  h += Math.exp(-(ridgeX * ridgeX + ridgeZ * ridgeZ * 0.4) * 2.2) * 1.1
  // Broad valley
  const dx = nx * 2 - 0.2
  const dz = nz * 2 - 1.1
  h -= Math.exp(-(dx * dx + dz * dz) * 0.7) * 0.38
  return h
}

function ProceduralTerrain() {
  const groupRef = useRef<Group>(null)

  const { solidGeo, wireGeo } = useMemo(() => {
    const geo = new PlaneGeometry(SIZE, SIZE, SEGS, SEGS)
    geo.rotateX(-Math.PI / 2)

    const pos = geo.attributes.position
    const count = pos.count
    const heights = new Float32Array(count)
    let minH = Infinity
    let maxH = -Infinity

    // First pass: compute heights
    for (let i = 0; i < count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const nx = x / SIZE
      const nz = z / SIZE
      const h = terrainHeight(nx, nz)
      heights[i] = h
      if (h < minH) minH = h
      if (h > maxH) maxH = h
    }

    const range = maxH - minH

    // Australian outback palette: deep valley → bright green slope → ochre/rust ridge
    const colValley = new Color("#1e4a32")
    const colSlope  = new Color("#2e6e48")
    const colHill   = new Color("#5a9e6e")
    const colPeak   = new Color("#c07038")

    const colors = new Float32Array(count * 3)

    // Second pass: apply displacement + vertex colors
    for (let i = 0; i < count; i++) {
      const rawH = heights[i]
      const h = (rawH - minH) / range        // 0..1 normalised
      const scaledH = rawH * 0.68            // world-space height (increased for drama)

      pos.setY(i, scaledH)

      // Colour ramp
      let c: Color
      if (h < 0.28) {
        c = colValley.clone().lerp(colSlope, h / 0.28)
      } else if (h < 0.62) {
        c = colSlope.clone().lerp(colHill, (h - 0.28) / 0.34)
      } else {
        c = colHill.clone().lerp(colPeak, (h - 0.62) / 0.38)
      }

      colors[i * 3]     = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }

    geo.setAttribute("color", new Float32BufferAttribute(colors, 3))
    geo.computeVertexNormals()

    // Wireframe copy for contour overlay
    const wireGeo: BufferGeometry = geo.clone()

    return { solidGeo: geo, wireGeo }
  }, [])

  const timeRef = useRef(0)
  useFrame((state, delta) => {
    if (!groupRef.current) return
    timeRef.current += delta
    const { pointer } = state

    const targetX = 0.35 + pointer.y * 0.10
    const targetY = -0.52 + pointer.x * 0.20
    groupRef.current.rotation.x = MathUtils.damp(groupRef.current.rotation.x, targetX, 3.8, delta)
    groupRef.current.rotation.y = MathUtils.damp(groupRef.current.rotation.y, targetY, 3.8, delta)
    groupRef.current.position.y = Math.sin(timeRef.current * 0.72) * 0.055
  })

  return (
    <group ref={groupRef} position={[0, -0.55, 0]}>
      {/* Solid terrain */}
      <mesh geometry={solidGeo} castShadow receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.78} metalness={0.02} />
      </mesh>
      {/* Contour wireframe overlay */}
      <mesh geometry={wireGeo}>
        <meshBasicMaterial color="#7ac89e" wireframe transparent opacity={0.15} />
      </mesh>
    </group>
  )
}

export function HeroTerrainModel({ className }: HeroTerrainModelProps) {
  return (
    <div className={className}>
      <div className="terrain-shell">
        <Canvas
          dpr={[1, 1.8]}
          shadows
          gl={{ antialias: true }}
          camera={{ position: [0, 2.8, 5.2], fov: 34 }}
          onCreated={({ gl }) => {
            gl.outputColorSpace = SRGBColorSpace
            gl.shadowMap.type = PCFShadowMap
          }}
        >
          <color attach="background" args={["#1d4333"]} />

          {/* Soft ambient fill */}
          <ambientLight intensity={0.72} color="#d0ead8" />
          {/* Primary warm sun from upper right */}
          <directionalLight
            castShadow
            position={[5.2, 9.0, 4.6]}
            intensity={1.8}
            color="#f4ead2"
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          {/* Rust sidelight to warm the ridge peaks */}
          <pointLight position={[-4.5, 3.5, 1.0]} intensity={0.9} color="#c07038" />
          {/* Cool fill from behind */}
          <pointLight position={[0.5, 1.2, -4.5]} intensity={0.35} color="#3a7a5a" />

          {/* Ground plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.05, 0]} receiveShadow>
            <circleGeometry args={[3.6, 72]} />
            <meshStandardMaterial color="#142b1e" roughness={0.95} metalness={0} />
          </mesh>

          <ProceduralTerrain />
        </Canvas>
      </div>
    </div>
  )
}
