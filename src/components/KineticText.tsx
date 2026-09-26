"use client";

import { motion, useReducedMotion } from "framer-motion";

const hidden = { opacity: 0, y: "0.6em", rotateX: 55, filter: "blur(8px)" };
const shown = { opacity: 1, y: "0em", rotateX: 0, filter: "blur(0px)" };

type Tag = "span" | "p" | "h1" | "h2" | "h3";

// Per-word 3D reveal — each word rotates up out of a blur into place. Used
// for every heading sitewide; `immediate` plays on mount (hero), otherwise
// it waits until scrolled into view.
export default function KineticText({
  text,
  as = "span",
  className = "",
  immediate = false,
  delay = 0,
  stagger = 0.045,
}: {
  text: string;
  as?: Tag;
  className?: string;
  immediate?: boolean;
  delay?: number;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  const Tag = as;
  if (reduce) return <Tag className={className}>{text}</Tag>;

  const words = text.split(" ");
  return (
    <Tag className={className} style={{ perspective: 800 }}>
      {words.map((word, i) => (
        <span key={i}>
          <motion.span
            className="inline-block"
            style={{ transformOrigin: "50% 100%", willChange: "transform, opacity, filter" }}
            initial={hidden}
            {...(immediate
              ? { animate: shown }
              : { whileInView: shown, viewport: { once: true, margin: "-10% 0px -10% 0px" } })}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: delay + i * stagger }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
