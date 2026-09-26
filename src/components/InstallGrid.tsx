"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import KineticText from "./KineticText";
import Eyebrow from "./Eyebrow";
import { Stagger, StaggerItem } from "./Stagger";
import Tilt from "./Tilt";
import { services } from "@/data/site";

// One tab per service, in the client's order — tabs mirror the Process
// section's toggle pattern. Switching tabs swaps in that service's verbatim
// description, its numbered parts (Website + CRM) or its step-by-step
// buyer system (Paid Commercials), and its lead line.
export default function InstallGrid() {
  const [activeId, setActiveId] = useState(services[0].id);
  const activeIndex = Math.max(
    0,
    services.findIndex((s) => s.id === activeId)
  );
  const active = services[activeIndex];
  const reduce = useReducedMotion();

  return (
    <section id="installs" className="border-t border-white/5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="What We Install"
          title="Pick a system, see exactly what's installed"
          description="Every tab below is one of the seven systems we build for car dealerships and car salesmen."
        />

        <div className="mt-10 flex flex-wrap justify-center gap-2 px-2">
          {services.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveId(s.id)}
              className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wide transition sm:px-5 ${
                activeId === s.id
                  ? "border-accent bg-accent text-ground"
                  : "border-white/10 text-ink-dim hover:border-white/25 hover:text-ink"
              }`}
              aria-pressed={activeId === s.id}
            >
              <span className="mono-num mr-1.5 opacity-60">{String(i + 1).padStart(2, "0")}</span>
              {s.short}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={reduce ? undefined : { opacity: 0, y: 16 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12"
          >
            <p className="text-center font-mono text-xs uppercase tracking-[0.24em] text-ink-dim">
              <Eyebrow
                key={active.id}
                text={`Step ${String(activeIndex + 1).padStart(2, "0")} · ${active.category}`}
                immediate
              />
            </p>

            <Tilt className="glass-card mx-auto mt-6 max-w-2xl overflow-hidden px-8 py-7 text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent-deep">
                {active.name}
              </p>
              <KineticText
                key={active.id}
                as="p"
                immediate
                delay={0.1}
                text={active.lead}
                className="glow-text mt-3 font-display text-2xl font-semibold sm:text-3xl"
              />
            </Tilt>

            <div className="mx-auto mt-8 max-w-3xl space-y-4 text-center">
              {active.intro.map((para) => (
                <p key={para} className="text-balance leading-relaxed text-ink-dim sm:text-lg">
                  {para}
                </p>
              ))}
            </div>

            {active.blocks && (
              <Stagger className="mt-10 grid gap-5 sm:grid-cols-2" stagger={0.09}>
                {active.blocks.map((block, i) => (
                  <StaggerItem key={block.title} className="h-full">
                    <Tilt className="glass-card h-full overflow-hidden p-6 sm:p-7">
                      <p className="mono-num text-xs text-accent-deep">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-2 font-display text-base font-medium text-ink sm:text-lg">
                        {block.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-ink-dim">{block.body}</p>
                    </Tilt>
                  </StaggerItem>
                ))}
              </Stagger>
            )}

            {active.steps && (
              <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
                {active.steps.map((step, i, all) => (
                  <StaggerItem
                    key={step.title}
                    // A lone final step closes out the 3-column grid
                    // full-width instead of sitting alone in the last row.
                    className={`h-full ${
                      i === all.length - 1 && all.length % 3 === 1 ? "lg:col-span-3" : ""
                    }`}
                  >
                    <Tilt className="glass-card h-full overflow-hidden p-6">
                      <p className="mono-num text-xs text-accent-deep">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-2 font-display text-base font-medium text-ink">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-dim">{step.body}</p>
                    </Tilt>
                  </StaggerItem>
                ))}
              </Stagger>
            )}

            {active.result && (
              <p className="mx-auto mt-10 max-w-3xl text-balance text-center text-sm leading-relaxed text-ink">
                {active.result}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
