import { Stagger, StaggerItem } from "./Stagger";
import Tilt from "./Tilt";
import CountUp from "./CountUp";
import { stats } from "@/data/site";

export default function Stats() {
  return (
    <section className="border-t border-white/5 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          {stats.map((s) => (
            <StaggerItem key={s.label}>
              <Tilt className="glass-card overflow-hidden px-6 py-9 text-center">
                <CountUp
                  target={s.target}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  className="glow-text font-display text-4xl font-semibold text-ink sm:text-5xl"
                />
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-dim">
                  {s.label}
                </p>
              </Tilt>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
