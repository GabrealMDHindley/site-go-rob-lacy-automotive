"use client";

import { motion, useReducedMotion } from "framer-motion";

const hidden = { opacity: 0, scaleX: 1.12, filter: "blur(6px)" };
const shown = { opacity: 1, scaleX: 1, filter: "blur(0px)" };

// Mono eyebrow labels track in — letters start spread and blurred, then
// tighten into place. A transform, not letter-spacing, so nothing reflows.
export default function Eyebrow({
  text,
  className = "",
  immediate = false,
  origin = "center",
}: {
  text: string;
  className?: string;
  immediate?: boolean;
  origin?: "left" | "center";
}) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className}>{text}</span>;

  return (
    <motion.span
      className={`inline-block ${className}`}
      style={{ transformOrigin: origin === "left" ? "0% 50%" : "50% 50%" }}
      initial={hidden}
      {...(immediate
        ? { animate: shown }
        : { whileInView: shown, viewport: { once: true, margin: "-10% 0px -10% 0px" } })}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      {text}
    </motion.span>
  );
}
