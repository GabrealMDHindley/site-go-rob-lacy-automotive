"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import Depth from "./Depth";
import KineticText from "./KineticText";
import Eyebrow from "./Eyebrow";
import { hasWebGL, prefersReducedMotion } from "@/lib/webgl";
import { speedToLead } from "@/data/site";

const GuaranteeScene = dynamic(() => import("./three/GuaranteeScene"), { ssr: false });

export default function Guarantee() {
  const badgeRef = useRef<HTMLDivElement>(null);
  const inView = useInView(badgeRef, { once: true, margin: "0px 0px -20% 0px" });
  const [env, setEnv] = useState<{ webgl: boolean; reducedMotion: boolean } | null>(null);

  useEffect(() => {
    // Same post-mount environment read as Hero.tsx — browser-only APIs can't
    // run during SSR, so the first client render intentionally matches the
    // server (no badge) and swaps in the real scene right after.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnv({ webgl: hasWebGL(), reducedMotion: prefersReducedMotion() });
  }, []);

  const showBadge = inView && env?.webgl;

  return (
    <section className="relative overflow-hidden border-t border-white/5 py-24 sm:py-32">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 60% at 50% 50%, rgba(214,162,50,0.12) 0%, rgba(2,8,20,0) 70%)",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-3xl px-6 sm:px-8">
        <Depth>
          <div className="glass-card px-8 py-14 text-center sm:px-16 sm:py-20">
            <div ref={badgeRef} className="relative mx-auto mb-6 h-24 w-24 sm:h-28 sm:w-28">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(214,162,50,0.32), transparent 70%)",
                }}
                aria-hidden="true"
              />
              {showBadge && <GuaranteeScene reducedMotion={env?.reducedMotion ?? false} />}
            </div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.28em] text-accent-deep">
              <Eyebrow text={speedToLead.eyebrow} />
            </p>
            <KineticText
              as="h2"
              text={speedToLead.headline}
              className="glow-text text-balance font-display text-3xl font-medium leading-tight sm:text-5xl"
            />
            <p className="mt-5 text-balance text-ink-dim">{speedToLead.sub}</p>
          </div>
        </Depth>
      </div>
    </section>
  );
}
