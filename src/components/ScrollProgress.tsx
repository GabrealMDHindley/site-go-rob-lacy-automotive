"use client";

import { motion, useScroll, useSpring } from "framer-motion";

// Thin glowing progress rail at the very top of the viewport — a cheap,
// constant "engineered product" signal as you scroll the page.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 30, mass: 0.2 });

  return (
    <motion.div
      className="fixed left-0 top-0 z-[70] h-[2px] w-full origin-left bg-accent-deep"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
