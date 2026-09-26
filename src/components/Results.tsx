"use client";

import { useState } from "react";
import SectionHeading from "./SectionHeading";
import { Stagger, StaggerItem } from "./Stagger";
import Tilt from "./Tilt";
import { testimonials } from "@/data/site";

const INITIAL = 9;

// Every car-dealership testimonial from the source page, verbatim — name and
// service label exactly as published. First nine up front, the rest on tap.
export default function Results() {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? testimonials : testimonials.slice(0, INITIAL);

  return (
    <section id="results" className="border-t border-white/5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="Results"
          title="Our clients speak for us"
          description="What car dealerships say about the systems we install."
        />

        <Stagger className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {shown.map((t) => (
            <StaggerItem key={t.name + t.service} className="h-full">
              <Tilt className="glass-card flex h-full flex-col overflow-hidden p-6 sm:p-7">
                <span
                  className="font-display text-4xl leading-none text-accent-deep"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-dim">{t.quote}</p>
                <div className="mt-6 border-t border-white/5 pt-4">
                  <p className="font-display text-sm font-medium text-ink">{t.name}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-accent-deep">
                    {t.service}
                  </p>
                </div>
              </Tilt>
            </StaggerItem>
          ))}
        </Stagger>

        {testimonials.length > INITIAL && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3 text-sm font-medium text-ink transition hover:border-accent/60 hover:text-accent"
              aria-expanded={expanded}
            >
              {expanded ? "Show fewer" : `Read all ${testimonials.length} testimonials`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
