'use client'

import { Canvas } from '@react-three/fiber'
import { Float, OrbitControls, Stage } from '@react-three/drei'
import { Suspense } from 'react'

function Bubbles() {
  return (
    <Float speed={1.2} rotationIntensity={0.6} floatIntensity={0.8}>
      {/* Khối 1: Icosahedron tím pastel */}
      <mesh>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#a78bfa" roughness={0.2} metalness={0.25} />
      </mesh>

      {/* Khối 2: Sphere hồng pastel */}
      <mesh position={[2, 0.6, -1]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#f472b6" roughness={0.25} metalness={0.2} />
      </mesh>

      {/* Khối 3: Dodecahedron xanh baby */}
      <mesh position={[-1.6, -0.3, 0.4]}>
        <dodecahedronGeometry args={[0.7]} />
        <meshStandardMaterial color="#60a5fa" roughness={0.25} metalness={0.25} />
      </mesh>
    </Float>
  )
}

export default function Cute3DScene() {
  return (
    <div className="h-[340px] w-full overflow-hidden rounded-3xl border bg-white shadow-sm">
      <Canvas camera={{ position: [3, 2, 5], fov: 50 }}>
        {/* Nền trắng thuần để hợp phong cách Mẹ & Bé */}
        <color attach="background" args={['#ffffff']} />
        <ambientLight intensity={0.7} />

        <Suspense fallback={null}>
          {/* Stage cân sáng và bố cục tự động, môi trường “city” ánh sáng đẹp */}
          <Stage intensity={0.8} environment="city" adjustCamera={1.2}>
            <Bubbles />
          </Stage>
        </Suspense>

        {/* Điều khiển: chỉ autoRotate, tắt zoom để nhẹ */}
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.2} />
      </Canvas>
    </div>
  )
}