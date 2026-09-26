"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "./SectionHeading";
import { services } from "@/data/site";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// The client's seven services as seven steps, in the client's order — the
// same scroll-scrubbed rail and 3D phase reveals as before, one track.
export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set("[data-phase], [data-phase-item]", { opacity: 1, x: 0 });
        if (railRef.current) gsap.set(railRef.current, { scaleY: 1 });
        return;
      }

      if (railRef.current) {
        gsap.fromTo(
          railRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 75%",
              end: "bottom 60%",
              scrub: 0.6,
            },
          }
        );
      }

      gsap.utils.toArray<HTMLElement>("[data-phase]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, x: -24, rotateY: -16, z: -60, transformPerspective: 1000, filter: "blur(6px)" },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            z: 0,
            filter: "blur(0px)",
            duration: 0.7,
            ease: "power3.out",
            delay: (i % 7) * 0.03,
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
        gsap.fromTo(
          el.querySelectorAll("[data-phase-item]"),
          { opacity: 0, x: 14 },
          {
            opacity: 1,
            x: 0,
            duration: 0.45,
            stagger: 0.05,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" className="border-t border-white/5 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="How It Works"
          title="Seven systems, one showroom pipeline"
          description="Everything we install for car dealerships and car salesmen — step by step, from the first website visit to the closed deal and the content that brings the next buyer in."
        />

        <div ref={containerRef} className="relative mt-16">
          <div className="absolute left-[13px] top-2 bottom-2 w-px bg-white/10 sm:left-[17px]" aria-hidden="true">
            <div
              ref={railRef}
              className="h-full w-full origin-top bg-accent-deep"
              style={{ transform: "scaleY(0)" }}
            />
          </div>

          <ol className="space-y-12">
            {services.map((svc, i) => (
              <li key={svc.id} data-phase className="relative pl-10 sm:pl-14">
                <span
                  className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border border-accent-deep/60 bg-ground sm:h-9 sm:w-9"
                  aria-hidden="true"
                >
                  <span className="h-2 w-2 rounded-full bg-accent" />
                </span>
                <p className="mono-num text-xs uppercase tracking-[0.2em] text-accent-deep">
                  Step {String(i + 1).padStart(2, "0")} · {svc.category}
                </p>
                <h3 className="mt-1 font-display text-xl font-medium sm:text-2xl">
                  {svc.name}
                </h3>
                <ul className="mt-3 grid gap-x-8 gap-y-1.5 text-sm text-ink-dim sm:grid-cols-2">
                  {svc.highlights.map((item) => (
                    <li key={item} data-phase-item className="flex gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-deep/70" />
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
