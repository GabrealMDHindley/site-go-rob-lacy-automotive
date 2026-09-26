"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { makeGlowTexture } from "./glow";

// Three ascending peaks, left → right, rhyming with the Go Rob Lacy summit
// mark — the roofline climbing to its peak, with gold light at the top.
function ridgeHeight(x: number, z: number): number {
  const base = Math.sin(x * 0.9) * 0.05 + Math.sin(x * 2.3 + 1) * 0.02;
  const zFalloff = 1 - Math.min(Math.abs(z) * 0.16, 0.9);
  const peakA = Math.exp(-((x + 2.3) ** 2) / 2.4) * 0.55 * zFalloff;
  const peakB = Math.exp(-(x ** 2) / 2.2) * 0.85 * zFalloff;
  const peakC = Math.exp(-((x - 2.1) ** 2) / 2.0) * 1.2 * zFalloff;
  return Math.max(0, base + peakA + peakB + peakC);
}

const SCENE_OFFSET = new THREE.Vector3(0.3, -0.55, 0);

function WireframePeaks() {
  const geometry = useMemo(() => {
    const width = 9;
    const depth = 4.5;
    const segX = 46;
    const segZ = 18;
    const geo = new THREE.PlaneGeometry(width, depth, segX, segZ);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setY(i, ridgeHeight(x, z));
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} position={SCENE_OFFSET}>
      <meshBasicMaterial color="#2f7fe0" wireframe transparent opacity={0.42} />
    </mesh>
  );
}

/** Gyroscopic wireframe rings orbiting the whole scene — thin, sparse, mechanical. */
function GyroRings() {
  const ringA = useRef<THREE.LineLoop>(null);
  const ringB = useRef<THREE.LineLoop>(null);

  const { geoA, geoB } = useMemo(() => {
    const build = (radius: number) => {
      const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, false, 0);
      const pts = curve.getPoints(96).map((p) => new THREE.Vector3(p.x, 0, p.y));
      return new THREE.BufferGeometry().setFromPoints(pts);
    };
    return { geoA: build(3.1), geoB: build(3.7) };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ringA.current) ringA.current.rotation.z = t * 0.12;
    if (ringB.current) ringB.current.rotation.z = -t * 0.08;
  });

  return (
    <group position={SCENE_OFFSET.toArray()}>
      <lineLoop ref={ringA} geometry={geoA} rotation={[Math.PI / 2.3, 0.3, 0]}>
        <lineBasicMaterial color="#4f93e6" transparent opacity={0.16} />
      </lineLoop>
      <lineLoop ref={ringB} geometry={geoB} rotation={[Math.PI / 2.7, -0.9, 0]}>
        <lineBasicMaterial color="#f3c65a" transparent opacity={0.1} />
      </lineLoop>
    </group>
  );
}

/** The summit marker — a small faceted crystal + bright nucleus glow at the highest peak. */
function Summit() {
  const meshRef = useRef<THREE.Mesh>(null);
  const summit = useMemo(() => {
    const x = 2.1; // peakC center, the tallest
    const y = ridgeHeight(x, 0);
    return new THREE.Vector3(x, y, 0).add(SCENE_OFFSET);
  }, []);

  const glowTex = useMemo(() => makeGlowTexture("#fff4d6", true), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.4;
      meshRef.current.rotation.x = t * 0.25;
    }
  });

  return (
    <group position={summit}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.1, 0]} />
        <meshStandardMaterial
          color="#0d1b33"
          roughness={0.25}
          metalness={0.8}
          emissive="#2f7fe0"
          emissiveIntensity={1.1}
          flatShading
        />
      </mesh>
      <sprite scale={[0.42, 0.42, 1]}>
        <spriteMaterial
          map={glowTex}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.75}
        />
      </sprite>
    </group>
  );
}

const NODE_COUNT = 22;
const PULSE_COUNT = 6;

/**
 * Data nodes climb the ridge crest left → right, linked in sequence, with
 * light pulses continuously traveling along those links — "growth in
 * motion," never idle, independent of scroll.
 */
function RidgeNetwork({ reducedMotion }: { reducedMotion: boolean }) {
  const pulseRefs = useRef<THREE.Sprite[]>([]);
  const pulseState = useRef(
    Array.from({ length: PULSE_COUNT }, (_, i) => ({
      edge: i % (NODE_COUNT - 1),
      t: Math.random(),
      speed: 0.12 + Math.random() * 0.1,
    }))
  );

  const glowTex = useMemo(() => makeGlowTexture("#2f7fe0", true), []);
  const glowTexBright = useMemo(() => makeGlowTexture("#f3c65a", true), []);

  const nodePositions = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const x = -4.2 + (8.4 * i) / (NODE_COUNT - 1);
      const y = ridgeHeight(x, 0) + 0.04;
      pts.push(new THREE.Vector3(x, y, 0).add(SCENE_OFFSET));
    }
    return pts;
  }, []);

  const edgePairs = useMemo(
    () => nodePositions.slice(0, -1).map((p, i) => [p, nodePositions[i + 1]] as const),
    [nodePositions]
  );

  useFrame((state, delta) => {
    if (reducedMotion) return;
    pulseState.current.forEach((p, i) => {
      p.t += delta * p.speed;
      if (p.t >= 1) {
        p.t = 0;
        p.edge = Math.floor(Math.random() * (NODE_COUNT - 1));
      }
      const a = nodePositions[p.edge];
      const b = nodePositions[p.edge + 1];
      const sprite = pulseRefs.current[i];
      if (sprite && a && b) {
        sprite.position.lerpVectors(a, b, p.t);
        const mat = sprite.material as THREE.SpriteMaterial;
        mat.opacity = Math.sin(p.t * Math.PI) * 0.9;
      }
    });
  });

  return (
    <group>
      {nodePositions.map((p, i) => (
        <sprite key={i} position={p} scale={[0.08 + (i % 3) * 0.015, 0.08 + (i % 3) * 0.015, 1]}>
          <spriteMaterial
            map={glowTex}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            opacity={0.55}
          />
        </sprite>
      ))}
      {edgePairs.map((pair, i) => (
        <Line key={i} points={pair} color="#2a6fc9" transparent opacity={0.16} />
      ))}
      {Array.from({ length: PULSE_COUNT }).map((_, i) => (
        <sprite
          key={i}
          ref={(el) => {
            if (el) pulseRefs.current[i] = el;
          }}
          scale={[0.1, 0.1, 1]}
        >
          <spriteMaterial
            map={glowTexBright}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            opacity={0}
          />
        </sprite>
      ))}
    </group>
  );
}

const PARTICLE_COUNT = 420;

function AmbientParticles({ reducedMotion }: { reducedMotion: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const startedAt = useRef<number | null>(null);
  const dataRef = useRef<{
    targets: Float32Array;
    starts: Float32Array;
    driftPhase: Float32Array;
  } | null>(null);

  const colors = useMemo(() => {
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const accent = new THREE.Color("#f3c65a");
    const accentDeep = new THREE.Color("#2f7fe0");
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const c = i % 3 !== 0 ? accentDeep : accent;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return colors;
  }, []);

  useEffect(() => {
    const targets = new Float32Array(PARTICLE_COUNT * 3);
    const starts = new Float32Array(PARTICLE_COUNT * 3);
    const driftPhase = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const onRidge = i % 3 !== 0;
      let x: number, z: number, y: number;
      if (onRidge) {
        x = (Math.random() - 0.5) * 9;
        z = (Math.random() - 0.5) * 4.5;
        y = ridgeHeight(x, z) + Math.random() * 0.05;
      } else {
        x = (Math.random() - 0.5) * 10;
        z = (Math.random() - 0.5) * 6;
        y = 0.6 + Math.random() * 2.4;
      }
      targets[i * 3] = x + 0.3;
      targets[i * 3 + 1] = y - 0.55;
      targets[i * 3 + 2] = z;

      const dir = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize();
      const dist = 4 + Math.random() * 3;
      starts[i * 3] = targets[i * 3] + dir.x * dist;
      starts[i * 3 + 1] = targets[i * 3 + 1] + dir.y * dist;
      starts[i * 3 + 2] = targets[i * 3 + 2] + dir.z * dist;

      driftPhase[i] = Math.random() * Math.PI * 2;
    }

    dataRef.current = { targets, starts, driftPhase };
    const posAttr = pointsRef.current?.geometry.attributes.position as
      | THREE.BufferAttribute
      | undefined;
    if (posAttr) {
      (posAttr.array as Float32Array).set(starts);
      posAttr.needsUpdate = true;
    }
  }, []);

  useFrame((state) => {
    const geom = pointsRef.current?.geometry;
    const data = dataRef.current;
    if (!geom || !data) return;
    const posAttr = geom.attributes.position as THREE.BufferAttribute;
    const { targets, starts, driftPhase } = data;
    const t = state.clock.getElapsedTime();

    if (reducedMotion) {
      posAttr.array.set(targets);
      posAttr.needsUpdate = true;
      return;
    }

    if (startedAt.current === null) startedAt.current = t;
    const assembleT = Math.min((t - startedAt.current) / 2.2, 1);
    const eased = 1 - Math.pow(1 - assembleT, 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const drift = eased >= 1 ? Math.sin(t * 0.3 + driftPhase[i]) * 0.05 : 0;
      const idx = i * 3;
      posAttr.array[idx] = starts[idx] + (targets[idx] - starts[idx]) * eased + drift;
      posAttr.array[idx + 1] =
        starts[idx + 1] + (targets[idx + 1] - starts[idx + 1]) * eased + Math.abs(drift) * 0.6;
      posAttr.array[idx + 2] =
        starts[idx + 2] + (targets[idx + 2] - starts[idx + 2]) * eased + drift * 0.7;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(PARTICLE_COUNT * 3), 3]}
          count={PARTICLE_COUNT}
        />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} count={PARTICLE_COUNT} />
      </bufferGeometry>
      <pointsMaterial size={0.035} vertexColors transparent opacity={0.85} sizeAttenuation />
    </points>
  );
}

/** Idle clock-driven rotation + mouse parallax + scroll tilt — always alive. */
function Rig({
  progressRef,
  reducedMotion,
}: {
  progressRef: React.MutableRefObject<number>;
  reducedMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion) return;
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reducedMotion]);

  useFrame((state) => {
    if (!group.current) return;
    const p = progressRef.current;
    const t = state.clock.getElapsedTime();

    if (!reducedMotion) {
      group.current.rotation.y = t * 0.05 + p * 0.5;
      group.current.rotation.x = Math.sin(t * 0.12) * 0.02;
      state.camera.position.x += (mouse.current.x * 0.4 - state.camera.position.x) * 0.03;
      state.camera.position.y +=
        (1.1 - mouse.current.y * 0.25 + p * 0.9 - state.camera.position.y) * 0.05;
    } else {
      state.camera.position.y = 1.1 + p * 0.9;
    }
    state.camera.lookAt(0.3, 0.1, 0);
  });
  return null;
}

export default function HeroScene({
  progressRef,
  reducedMotion,
}: {
  progressRef: React.MutableRefObject<number>;
  reducedMotion: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 1.1, 6.2], fov: 40 }}
    >
      <color attach="background" args={["#020814"]} />
      <fog attach="fog" args={["#020814", 6, 12]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[3, 4, 5]} color="#2f7fe0" intensity={60} />
      <pointLight position={[-4, 2, -3]} color="#f3c65a" intensity={20} />
      <group>
        <WireframePeaks />
        <RidgeNetwork reducedMotion={reducedMotion} />
        <Summit />
        <GyroRings />
        <AmbientParticles reducedMotion={reducedMotion} />
      </group>
      <Rig progressRef={progressRef} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
