"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { hasWebGL, prefersReducedMotion } from "@/lib/webgl";

const FieldScene = dynamic(() => import("./three/FieldScene"), { ssr: false });

// Fixed, pointer-transparent 3D layer behind the whole page. Off without
// WebGL or under prefers-reduced-motion (the CSS aurora still shows), and
// lighter on phones.
export default function FieldBackdrop() {
  const [env, setEnv] = useState<{ ok: boolean; count: number } | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnv({
      ok: hasWebGL() && !prefersReducedMotion(),
      count: window.matchMedia("(max-width: 640px)").matches ? 260 : 650,
    });
  }, []);

  if (!env?.ok) return null;

  return (
    <div className="field-backdrop" aria-hidden="true">
      <FieldScene count={env.count} />
    </div>
  );
}
