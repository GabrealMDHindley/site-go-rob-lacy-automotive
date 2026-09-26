"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import HeroFallback from "./HeroFallback";
import KineticText from "./KineticText";
import Eyebrow from "./Eyebrow";
import Magnetic from "./Magnetic";
import { hasWebGL, prefersReducedMotion } from "@/lib/webgl";
import { site } from "@/data/site";

const HeroScene = dynamic(() => import("./three/HeroScene"), {
  ssr: false,
  loading: () => <HeroFallback />,
});

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const [env, setEnv] = useState<{ webgl: boolean; reducedMotion: boolean } | null>(
    null
  );

  useEffect(() => {
    // Intentional one-time environment read after mount: the first client
    // render must match the server (webgl unknown → HeroFallback) to avoid
    // a hydration mismatch; only after mount can we safely check
    // browser-only WebGL/matchMedia support and swap in the real scene.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnv({ webgl: hasWebGL(), reducedMotion: prefersReducedMotion() });
  }, []);

  const webgl = env?.webgl ?? null;
  const reducedMotion = env?.reducedMotion ?? false;

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      raf = requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const total = rect.height;
        const scrolled = Math.min(Math.max(-rect.top, 0), total);
        progressRef.current = total > 0 ? scrolled / total : 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const canRender3D = webgl === true;

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden border-b border-white/5"
    >
      <div className="absolute inset-0">
        {webgl === null ? (
          <HeroFallback />
        ) : canRender3D ? (
          <HeroScene progressRef={progressRef} reducedMotion={reducedMotion} />
        ) : (
          <HeroFallback />
        )}
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(2,8,20,0.15) 0%, rgba(2,8,20,0.35) 55%, rgba(2,8,20,0.94) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-20 pt-40 sm:px-8 md:pb-28">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-5 font-mono text-xs uppercase tracking-[0.28em] text-accent-deep"
        >
          <Eyebrow text={site.tagline} immediate origin="left" />
        </motion.p>

        <KineticText
          as="h1"
          text={site.headline}
          immediate
          delay={0.1}
          className="text-balance max-w-4xl font-display text-[2.5rem] font-medium uppercase leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
        />

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.22 }}
          className="mt-6 max-w-xl text-balance text-lg text-ink-dim"
        >
          {site.subhead}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.34 }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <Magnetic>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-ground transition hover:bg-white"
            >
              Book Your Call
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </Magnetic>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-medium text-ink transition hover:border-accent/60 hover:text-accent"
          >
            See how it works
          </a>
        </motion.div>
      </div>
    </section>
  );
}
