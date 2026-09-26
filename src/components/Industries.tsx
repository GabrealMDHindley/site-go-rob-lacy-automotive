import SectionHeading from "./SectionHeading";
import { Stagger, StaggerItem } from "./Stagger";
import Tilt from "./Tilt";
import { industries } from "@/data/site";

export default function Industries() {
  return (
    <section className="border-t border-white/5 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <SectionHeading eyebrow="Who We Work With" title="Where do you fit?" />

        <Stagger className="mt-14 grid gap-4 sm:grid-cols-2" stagger={0.07}>
          {industries.map((audience) => (
            <StaggerItem key={audience.title} className="h-full">
              <Tilt className="glass-card flex h-full flex-col gap-2 p-7">
                <h3 className="font-display text-lg font-medium text-ink">
                  {audience.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink-dim">
                  {audience.description}
                </p>
              </Tilt>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
