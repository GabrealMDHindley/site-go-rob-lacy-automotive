import Link from "next/link";
import Reveal from "./Reveal";
import KineticText from "./KineticText";
import Magnetic from "./Magnetic";

export default function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-white/5 py-28 sm:py-36">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 60% at 50% 100%, rgba(214,162,50,0.16) 0%, rgba(47,127,224,0.08) 40%, rgba(2,8,20,0) 72%)",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-2xl px-6 text-center sm:px-8">
        <KineticText
          as="h2"
          text="Ready to turn more online shoppers into showroom visits, test drives & sales?"
          className="text-balance font-display text-3xl font-medium leading-tight sm:text-5xl"
        />
        <Reveal delay={0.3}>
          <p className="mt-5 text-ink-dim">
            Book a call and we&rsquo;ll walk you through exactly what gets installed
            for your dealership.
          </p>
          <Magnetic className="mt-9">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-semibold uppercase tracking-wide text-ground transition hover:bg-white"
            >
              Book Your Call
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
