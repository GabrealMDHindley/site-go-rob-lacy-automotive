"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import LogoDrawIn from "./LogoDrawIn";
import Eyebrow from "./Eyebrow";
import { hasWebGL } from "@/lib/webgl";
import { serviceTags } from "@/data/site";

const FieldScene = dynamic(() => import("./three/FieldScene"), { ssr: false });

const SESSION_KEY = "grl-intro-seen";
// Each of the seven service names gets long enough on screen to actually be
// read; the intro runs until the last one has shown (the clip holds on its
// clean final logo frame after it ends).
const TAG_INTERVAL = 850;
const INTRO_DURATION = serviceTags.length * TAG_INTERVAL + 600;

// Full-screen intro, once per session: the site's own 3D field runs as the
// backdrop, the OpenArt logo-reveal clip is screen-blended and edge-masked
// into it (so its black frame vanishes — no box), the client's seven
// services cycle underneath the logo, and the whole scene zooms through into
// the hero. Falls back to the code-only summit draw-in without the clip,
// skippable, and skipped entirely under prefers-reduced-motion.
export default function Preloader({ hasVideo }: { hasVideo: boolean }) {
  const [closing, setClosing] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [field, setField] = useState<{ count: number } | null>(null);
  const [tag, setTag] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const duration = INTRO_DURATION;

  const finish = useCallback(() => {
    // Stop playback immediately rather than letting it keep running through
    // the fade-out: on iOS Safari a muted/inline video that's still marked
    // "playing" while it visually shrinks/fades away can trigger automatic
    // Picture-in-Picture, popping a floating mini-player over the page.
    videoRef.current?.pause();
    setClosing(true);
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}
    window.setTimeout(() => setHidden(true), 750);
  }, []);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (seen || reduce) {
      // Intentional: the preloader must render on the server/first paint
      // (hidden starts false) so it's never a blank/mismatched hero; this
      // effect immediately corrects it once we can read
      // sessionStorage/matchMedia (browser-only, unknown during SSR).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHidden(true);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {}
      return;
    }

    if (hasWebGL()) {
      setField({ count: window.matchMedia("(max-width: 640px)").matches ? 220 : 420 });
    }

    const timer = window.setTimeout(finish, duration);
    const cycle = window.setInterval(
      () => setTag((t) => Math.min(t + 1, serviceTags.length - 1)),
      TAG_INTERVAL
    );
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(cycle);
    };
  }, [finish, duration]);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden bg-ground transition-[opacity,transform] duration-700 ease-out ${
        closing ? "pointer-events-none scale-[1.06] opacity-0" : "scale-100 opacity-100"
      }`}
      role="status"
      aria-label="Loading Go Rob Lacy"
    >
      {field && (
        <div className="absolute inset-0" aria-hidden="true">
          <FieldScene count={field.count} />
        </div>
      )}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 40% at 50% 48%, rgba(47,127,224,0.2) 0%, rgba(214,162,50,0.06) 45%, rgba(2,8,20,0) 72%)",
        }}
        aria-hidden="true"
      />

      <div className="absolute inset-0 flex items-center justify-center">
        {hasVideo ? (
          <video
            ref={videoRef}
            className="preloader-video"
            src="/videos/brand/logo-reveal.mp4"
            poster="/videos/brand/poster.jpg"
            autoPlay
            muted
            playsInline
            disablePictureInPicture
            disableRemotePlayback
          />
        ) : (
          <LogoDrawIn />
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[30%] flex justify-center px-6 sm:bottom-[20%]">
        <p className="max-w-3xl text-balance text-center font-mono text-xs uppercase leading-relaxed tracking-[0.26em] text-accent sm:text-sm">
          <Eyebrow key={tag} text={serviceTags[tag]} immediate />
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/5" aria-hidden="true">
        <div className="preloader-rail h-full bg-accent-deep" style={{ animationDuration: `${duration}ms` }} />
      </div>

      <button
        type="button"
        onClick={finish}
        className="absolute bottom-8 right-6 font-mono text-xs uppercase tracking-widest text-ink-dim transition hover:text-ink sm:right-8"
      >
        Skip
      </button>
    </div>
  );
}
