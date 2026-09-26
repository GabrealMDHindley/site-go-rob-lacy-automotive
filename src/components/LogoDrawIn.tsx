"use client";

import Image from "next/image";

// Code-only fallback for the logo-reveal preloader (no OpenArt video yet):
// the summit mark's gold roofline and three converging stripes draw in, then
// the real logo lockup fades up beneath. Pure CSS/SVG, no video dependency.
export default function LogoDrawIn() {
  const strokes = [
    { d: "M8 86 L70 10 L112 80", color: "var(--color-accent)", width: 4 },
    { d: "M30 86 L68 28", color: "var(--color-royal)", width: 5 },
    { d: "M50 86 L70 28", color: "var(--color-ink)", width: 5 },
    { d: "M72 86 L72 28", color: "var(--color-royal)", width: 5 },
  ];

  return (
    <div className="flex flex-col items-center gap-7">
      <svg width="120" height="92" viewBox="0 0 120 92" fill="none" aria-hidden="true">
        {strokes.map((s, i) => (
          <path
            key={s.d}
            d={s.d}
            stroke={s.color}
            strokeWidth={s.width}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            style={{
              strokeDasharray: 1,
              strokeDashoffset: 1,
              animation: `draw-summit 0.6s ease-out ${0.15 + i * 0.16}s forwards`,
            }}
          />
        ))}
      </svg>
      <Image
        src="/brand/logo-lockup.png"
        alt="Go Rob Lacy"
        width={873}
        height={120}
        priority
        className="h-7 w-auto opacity-0 sm:h-8"
        style={{ animation: "fade-up 0.5s ease-out 0.9s forwards" }}
      />
      <style>{`
        @keyframes draw-summit {
          to { stroke-dashoffset: 0; }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
