import SectionHeading from "./SectionHeading";
import { Stagger, StaggerItem } from "./Stagger";
import Tilt from "./Tilt";
import { buyerInterests } from "@/data/site";

// The CRM's buyer-interest pipeline — the five categories straight from the
// Website + CRM service copy, one tile each.
export default function BuyerPipeline() {
  return (
    <section className="border-t border-white/5 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <SectionHeading
          eyebrow="Your CRM"
          title="Every buyer, organized by what they want"
          description="Your CRM tracks potential buyers by interest — instead of scattered messages, spreadsheets, or memory."
        />

        <Stagger className="mt-14 grid gap-4 sm:grid-cols-3 lg:grid-cols-5" stagger={0.07}>
          {buyerInterests.map((interest, i) => (
            <StaggerItem key={interest} className="h-full">
              <Tilt className="glass-card flex h-full flex-col gap-3 p-5">
                <span className="mono-num text-xs text-accent-deep">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-base font-medium text-ink">{interest}</span>
                <span
                  className="mt-auto h-px w-10"
                  style={{ background: "linear-gradient(90deg, var(--color-accent-deep), transparent)" }}
                />
              </Tilt>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
