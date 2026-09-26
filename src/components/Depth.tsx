"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Scroll-linked 3D parallax: the section tilts in from a slight rotateX +
 * translateZ as it enters/leaves the viewport center, like a card floating
 * in 3D space rather than a flat page scrolling past.
 */
export default function Depth({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [7, 0, -7]);
  const translateZ = useTransform(scrollYProgress, [0, 0.5, 1], [-40, 0, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0.5, 1, 1, 0.5]);

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={className} style={{ perspective: 1200 }}>
      <motion.div style={{ rotateX, translateZ, opacity, transformStyle: "preserve-3d" }}>
        {children}
      </motion.div>
    </div>
  );
}
