"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type * as THREE from "three";

/** A small faceted seal + orbiting ring — the speed-to-lead promise as a physical badge. */
function Badge({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (reducedMotion || !group.current) return;
    group.current.rotation.y += delta * 0.35;
    group.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.15;
    if (ring.current) ring.current.rotation.z -= delta * 0.5;
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#1a1406"
          roughness={0.22}
          metalness={0.9}
          emissive="#b8861f"
          emissiveIntensity={0.55}
          flatShading
        />
      </mesh>
      <mesh ref={ring} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1.5, 0.015, 8, 96]} />
        <meshBasicMaterial color="#4f93e6" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

export default function GuaranteeScene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 4.2], fov: 38 }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 4]} color="#f3c65a" intensity={36} />
      <pointLight position={[-3, -2, -2]} color="#2f7fe0" intensity={14} />
      <Badge reducedMotion={reducedMotion} />
    </Canvas>
  );
}
