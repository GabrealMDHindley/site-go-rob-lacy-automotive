"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { makeGlowTexture } from "./glow";

// Sitewide 3D field that sits behind every section: a drifting particle
// cloud plus a few far-back wireframe solids. Parallaxes against scroll,
// tilts toward the mouse, and the particles swell briefly with scroll
// velocity — so the whole page reads as one continuous 3D space, not just
// the hero.
function Particles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const mat = useRef<THREE.PointsMaterial>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const scroll = useRef({ y: 0, v: 0 });
  const tex = useMemo(() => makeGlowTexture("#f3c65a", false), []);

  const { base, colors, seeds } = useMemo(() => {
    const base = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const accent = new THREE.Color("#f3c65a");
    const deep = new THREE.Color("#2f7fe0");
    for (let i = 0; i < count; i++) {
      base[i * 3] = (Math.random() - 0.5) * 18;
      base[i * 3 + 1] = (Math.random() - 0.5) * 12;
      base[i * 3 + 2] = -Math.random() * 9;
      const c = i % 4 === 0 ? accent : deep;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      seeds[i] = Math.random() * Math.PI * 2;
    }
    return { base, colors, seeds };
  }, [count]);

  useEffect(() => {
    let last = window.scrollY;
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onScroll = () => {
      const y = window.scrollY;
      scroll.current.v += (y - last) * 0.002;
      last = y;
      scroll.current.y = y;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useFrame((state) => {
    const pts = ref.current;
    if (!pts) return;
    const t = state.clock.getElapsedTime();
    const arr = pts.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const s = seeds[i];
      arr[i * 3] = base[i * 3] + Math.cos(t * 0.2 + s) * 0.2;
      arr[i * 3 + 1] = base[i * 3 + 1] + Math.sin(t * 0.25 + s) * 0.25;
      arr[i * 3 + 2] = base[i * 3 + 2];
    }
    pts.geometry.attributes.position.needsUpdate = true;

    pts.position.y = scroll.current.y * 0.0015;
    pts.rotation.y += (mouse.current.x * 0.08 - pts.rotation.y) * 0.04;
    pts.rotation.x += (mouse.current.y * 0.05 - pts.rotation.x) * 0.04;

    scroll.current.v *= 0.9;
    if (mat.current) {
      mat.current.size = 0.07 + Math.min(Math.abs(scroll.current.v), 1) * 0.09;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[base.slice(), 3]} count={count} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        map={tex}
        size={0.07}
        sizeAttenuation
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.8}
      />
    </points>
  );
}

/** A slowly undulating wireframe floor — the hero's ridge motif carried under every section. */
function Terrain() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(30, 16, 48, 24);
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setY(i, Math.sin(x * 0.45 + t * 0.25) * 0.25 + Math.cos(z * 0.6 - t * 0.2) * 0.2);
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh geometry={geo} position={[0, -3.4, -6]}>
      <meshBasicMaterial color="#2f7fe0" wireframe transparent opacity={0.12} />
    </mesh>
  );
}

const SHAPES = [
  { pos: [-6, 2.5, -4] as const, r: 1.1, detail: 1 },
  { pos: [6.5, -2, -5] as const, r: 1.4, detail: 0 },
  { pos: [-4.5, -3.5, -6] as const, r: 0.8, detail: 0 },
  { pos: [5, 3.5, -7] as const, r: 0.9, detail: 1 },
];

function Shapes() {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    g.children.forEach((m, i) => {
      m.rotation.x += delta * (0.08 + i * 0.03);
      m.rotation.y += delta * (0.12 - i * 0.02);
    });
    g.position.y = window.scrollY * 0.0009;
  });

  return (
    <group ref={group}>
      {SHAPES.map((s, i) => (
        <mesh key={i} position={[s.pos[0], s.pos[1], s.pos[2]]}>
          <icosahedronGeometry args={[s.r, s.detail]} />
          <meshBasicMaterial color="#2f7fe0" wireframe transparent opacity={0.24} />
        </mesh>
      ))}
    </group>
  );
}

export default function FieldScene({ count }: { count: number }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 6], fov: 50 }}
      style={{ pointerEvents: "none" }}
    >
      <fog attach="fog" args={["#020814", 6, 16]} />
      <Particles count={count} />
      <Shapes />
      <Terrain />
    </Canvas>
  );
}
