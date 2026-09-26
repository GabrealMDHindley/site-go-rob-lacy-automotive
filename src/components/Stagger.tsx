"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Tag = "div" | "ul" | "ol" | "li" | "section";

const tags = {
  div: motion.div,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  section: motion.section,
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28, rotateX: 22, z: -40, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    z: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};

// Staggered 3D cascade for grids and lists — children tilt in from depth
// one after another as the container scrolls into view.
export function Stagger({
  children,
  className = "",
  as = "div",
  stagger = 0.08,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
  stagger?: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    const T = as;
    return <T className={className}>{children}</T>;
  }
  const M = tags[as] as typeof motion.div;
  return (
    <M
      className={className}
      style={{ perspective: 1000 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
    >
      {children}
    </M>
  );
}

export function StaggerItem({
  children,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    const T = as;
    return <T className={className}>{children}</T>;
  }
  const M = tags[as] as typeof motion.div;
  return (
    <M
      className={className}
      variants={itemVariants}
      style={{ transformStyle: "preserve-3d", willChange: "transform, opacity, filter" }}
    >
      {children}
    </M>
  );
}
