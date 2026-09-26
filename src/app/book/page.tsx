import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import BookingEmbed from "@/components/BookingEmbed";
import { addressLine, site } from "@/data/site";

export const metadata: Metadata = {
  title: "Book a Call",
  description: "Pick a day and time to talk with Go Rob Lacy about the systems for your dealership.",
};

export default function BookPage() {
  return (
    <section className="border-b border-white/5 px-6 pb-24 pt-40 sm:px-8 md:pb-32">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Book Your Call"
          title="Pick a day and time"
          description="Choose a time that works for you on the calendar below — we'll walk you through exactly what gets installed for your dealership."
        />
        <Reveal className="glass-card mt-12 p-3 sm:p-4" delay={0.1}>
          <BookingEmbed />
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-10 grid gap-3 text-center text-sm text-ink-dim sm:grid-cols-3">
            <a href={site.phoneHref} className="glass-card px-4 py-4 transition hover:text-ink">
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="glass-card px-4 py-4 transition hover:text-ink">
              {site.email}
            </a>
            <p className="glass-card px-4 py-4">{addressLine}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
