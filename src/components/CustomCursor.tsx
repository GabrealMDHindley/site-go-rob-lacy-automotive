"use client";

import { useEffect, useRef, useState } from "react";

// Magnetic dot+ring cursor — desktop (pointer: fine) and motion-allowed
// only. Native cursor stays untouched on touch devices, under
// prefers-reduced-motion, and over text inputs (so typing still shows a
// caret).
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActive(true);
    document.documentElement.classList.add("custom-cursor-active");

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      dotRef.current?.style.setProperty(
        "transform",
        `translate3d(${targetX}px, ${targetY}px, 0)`
      );
      const el = e.target as HTMLElement | null;
      const isField = !!el?.closest("input, textarea, select");
      setHovering(!isField && !!el?.closest("a, button, [role='button']"));
      if (dotRef.current) dotRef.current.style.opacity = isField ? "0" : "1";
      if (ringRef.current) ringRef.current.style.opacity = isField ? "0" : "1";
    };

    const tick = () => {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      ringRef.current?.style.setProperty(
        "transform",
        `translate3d(${ringX}px, ${ringY}px, 0)`
      );
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  if (!active) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div
        ref={ringRef}
        className={`cursor-ring ${hovering ? "cursor-ring-hover" : ""}`}
        aria-hidden="true"
      />
    </>
  );
}
