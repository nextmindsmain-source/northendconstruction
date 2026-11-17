import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const scroll = { p: 0, end: 0 }
const SHOW_STICK_HOUSE = false // replaced by the scroll-scrubbed film (HeroVideo)

type Beam = { a: THREE.Vector3; b: THREE.Vector3; t: number; delay: number }

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)

function frame(x0: number, x1: number, h: number, ridge: number, z0: number, z1: number, out: Beam[]) {
  const mx = (x0 + x1) / 2
  const push = (a: THREE.Vector3, b: THREE.Vector3, t = 0.09) => out.push({ a, b, t, delay: Math.random() })
  // base + top plates
  for (const y of [0, h]) {
    push(v(x0, y, z0), v(x1, y, z0))
    push(v(x0, y, z1), v(x1, y, z1))
    push(v(x0, y, z0), v(x0, y, z1))
    push(v(x1, y, z0), v(x1, y, z1))
  }
  // corner posts + studs
  const studs = 5
  for (let i = 0; i <= studs; i++) {
    const x = x0 + ((x1 - x0) * i) / studs
    push(v(x, 0, z0), v(x, h, z0), 0.06)
    push(v(x, 0, z1), v(x, h, z1), 0.06)
  }
  push(v(x0, 0, z0), v(x0, h, z0))
  push(v(x1, 0, z1), v(x1, h, z1))
  // rafters + ridge
  for (const z of [z0, z1]) {
    push(v(x0 - 0.3, h - 0.25, z), v(mx, ridge, z), 0.1)
    push(v(x1 + 0.3, h - 0.25, z), v(mx, ridge, z), 0.1)
    push(v(mx, 0, z), v(mx, ridge, z), 0.05)
  }
  push(v(mx, ridge, z0), v(mx, ridge, z1), 0.12)
  for (let i = 1; i < 5; i++) {
    const z = z0 + ((z1 - z0) * i) / 5
    push(v(x0 - 0.3, h - 0.25, z), v(mx, ridge, z), 0.05)
    push(v(x1 + 0.3, h - 0.25, z), v(mx, ridge, z), 0.05)
  }
}

function House({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const mesh = useRef<THREE.InstancedMesh>(null!)
  const group = useRef<THREE.Group>(null!)
  const glow = useRef<THREE.PointLight>(null!)

  const { beams, starts, spins } = useMemo(() => {
    const beams: Beam[] = []
    frame(-3.6, 0.6, 2.4, 4.6, -1.6, 1.6, beams)
    frame(-0.6, 3.6, 2.4, 4.6, -1.6, 1.6, beams)
    // chimney
    beams.push({ a: v(2.2, 3.2, -0.6), b: v(2.2, 5.4, -0.6), t: 0.16, delay: Math.random() })
    beams.push({ a: v(2.8, 3.2, -0.6), b: v(2.8, 5.4, -0.6), t: 0.16, delay: Math.random() })
    const starts = beams.map(() => new THREE.Vector3((Math.random() - 0.5) * 26, (Math.random() - 0.2) * 18, (Math.random() - 0.5) * 22))
    const spins = beams.map(() => new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6))
    return { beams, starts, spins }
  }, [])

  const tmp = useMemo(
    () => ({ m: new THREE.Matrix4(), q: new THREE.Quaternion(), qs: new THREE.Quaternion(), s: new THREE.Vector3(), pos: new THREE.Vector3(), c: new THREE.Color() }),
    [],
  )

  useFrame((state) => {
    const build = THREE.MathUtils.clamp(scroll.p / 0.16, 0, 1) // assembled by 16% scroll
    const time = state.clock.elapsedTime
    beams.forEach((b, i) => {
      const local = THREE.MathUtils.clamp((build - b.delay * 0.55) / 0.45, 0, 1)
      const e = 1 - Math.pow(1 - local, 3)
      const dir = tmp.s.copy(b.b).sub(b.a)
      const len = dir.length()
      const mid = tmp.pos.copy(b.a).add(b.b).multiplyScalar(0.5)
      tmp.q.setFromUnitVectors(v(0, 1, 0), dir.normalize())
      tmp.qs.setFromEuler(spins[i])
      const q = tmp.qs.slerp(tmp.q, e)
      const p = starts[i].clone().lerp(mid, e)
      p.y += Math.sin(time * 0.8 + i) * 0.04 * (1 - e)
      tmp.m.compose(p, q, v(b.t, len, b.t))
      mesh.current.setMatrixAt(i, tmp.m)
      mesh.current.setColorAt(i, tmp.c.set(e > 0.98 ? '#2a9be0' : '#3d6fa8'))
    })
    mesh.current.instanceMatrix.needsUpdate = true
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true

    const p = scroll.p
    // slow cinematic orbit + dolly keyed to scroll
    const ang = THREE.MathUtils.lerp(0.35, -0.2, Math.min(p * 1.6, 1)) + p * Math.PI * 1.4
    const dist = THREE.MathUtils.lerp(15, 9.5, Math.min(p * 2, 1)) + Math.sin(p * Math.PI) * 3
    const camY = THREE.MathUtils.lerp(3.2, 6.5, Math.sin(Math.min(p * 1.3, 1) * Math.PI * 0.5)) - p * 2.8
    const cam = state.camera
    cam.position.x += (Math.sin(ang) * dist + mouse.current.x * 1.2 - cam.position.x) * 0.06
    cam.position.y += (camY + mouse.current.y * 0.8 - cam.position.y) * 0.06
    cam.position.z += (Math.cos(ang) * dist - cam.position.z) * 0.06
    cam.lookAt(0, 2.3, 0)
    group.current.rotation.y = Math.sin(time * 0.15) * 0.05
    glow.current.intensity = 40 + build * 120
  })

  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[undefined, undefined, beams.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial metalness={0.5} roughness={0.35} emissive="#0a5aa0" emissiveIntensity={0.9} />
      </instancedMesh>
      <pointLight ref={glow} position={[0, 3, 0]} color="#1aa0ee" distance={20} />
      <gridHelper args={[60, 60, '#0e3a5c', '#0a2236']} position={[0, -0.02, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <circleGeometry args={[7, 64]} />
        <meshBasicMaterial color="#0686c7" transparent opacity={0.07} />
      </mesh>
    </group>
  )
}

function Dust() {
  const ref = useRef<THREE.Points>(null!)
  const geo = useMemo(() => {
    const n = 900
    const arr = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 40
      arr[i * 3 + 1] = Math.random() * 18 - 1
      arr[i * 3 + 2] = (Math.random() - 0.5) * 40
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    return g
  }, [])
  useFrame((s) => {
    ref.current.rotation.y = s.clock.elapsedTime * 0.012 + scroll.p * 1.5
    ref.current.position.y = -scroll.p * 6
  })
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.05} color="#6cc6f5" transparent opacity={0.6} sizeAttenuation depthWrite={false} />
    </points>
  )
}

export default function Scene() {
  const mouse = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const fn = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', fn)
    return () => window.removeEventListener('pointermove', fn)
  }, [])
  return (
    <div className="fixed inset-0 z-[1] pointer-events-none">
      <Canvas camera={{ fov: 42, position: [0, 3, 15] }} dpr={[1, 1.75]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
        <Dust />
        {SHOW_STICK_HOUSE && (
          <>
            <fog attach="fog" args={['#07111c', 14, 38]} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[6, 10, 6]} intensity={1.4} color="#9fd8ff" />
            <House mouse={mouse} />
          </>
        )}
      </Canvas>
    </div>
  )
}
