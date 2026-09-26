import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import KineticText from "@/components/KineticText";
import Eyebrow from "@/components/Eyebrow";
import { Stagger, StaggerItem } from "@/components/Stagger";
import FinalCta from "@/components/FinalCta";
import { services, site } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.mission} Learn how Go Rob Lacy installs the systems behind it.`,
};

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-white/5 px-6 pb-20 pt-40 sm:px-8 md:pb-28">
        <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.28em] text-accent-deep">
              <Eyebrow text="About Go Rob Lacy" immediate origin="left" />
            </p>
            <KineticText
              as="h1"
              immediate
              delay={0.1}
              text={site.mission}
              className="text-balance font-display text-4xl font-medium leading-[1.08] sm:text-5xl"
            />
          </div>
          <Reveal delay={0.3} className="mx-auto w-full max-w-xs">
            <Image
              src="/brand/logo-stacked.svg"
              alt="Go Rob Lacy Inc. — People | Systems | Greater Results"
              width={1188}
              height={1000}
              unoptimized
              priority
              className="h-auto w-full"
            />
          </Reveal>
        </div>
      </section>

      <section className="border-b border-white/5 py-20 sm:py-28">
        <div className="mx-auto grid max-w-5xl gap-12 px-6 sm:px-8 md:grid-cols-2">
          <div>
            <KineticText
              as="h2"
              text="A system, not an inventory feed"
              className="font-display text-2xl font-medium sm:text-3xl"
            />
            <Reveal delay={0.2}>
              <p className="mt-4 text-ink-dim">
                Go Rob Lacy doesn&rsquo;t hand dealerships a generic inventory feed and
                wish them luck. We install the whole system — the website, the CRM, the
                automated SMS and email follow-up, the vehicle video walkthroughs, the paid
                commercials, the AI chat and voice agents, and the content — so every
                online shopper has a clear path to your showroom.
              </p>
            </Reveal>
          </div>
          <div>
            <KineticText
              as="h2"
              text="People | Systems | Greater Results"
              delay={0.08}
              className="font-display text-2xl font-medium sm:text-3xl"
            />
            <Reveal delay={0.28}>
              <p className="mt-4 text-ink-dim">
                It&rsquo;s on our logo for a reason. Your people sell cars; our systems
                answer the calls, reply to the chats, follow up with every inquiry, and
                keep your dealership in front of buyers — so your sales team spends its
                time with the people who are ready to buy.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-b border-white/5 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <SectionHeading
            eyebrow="What's Installed"
            title="Seven systems, built for dealerships"
            description="The exact mix is scoped to your dealership on your first call."
          />
          <Stagger as="ul" className="mx-auto mt-12 grid max-w-3xl gap-3" stagger={0.06}>
            {services.map((s, i) => (
              <StaggerItem
                as="li"
                key={s.id}
                className="flex items-baseline justify-between gap-4 rounded-xl border border-white/10 bg-ground/50 px-5 py-4 text-sm"
              >
                <span className="text-ink">
                  <span className="mono-num mr-3 text-xs text-accent-deep">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.name}
                </span>
                <span className="hidden shrink-0 font-mono text-xs text-ink-dim sm:inline">
                  {s.category}
                </span>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal delay={0.3}>
            <p className="mt-8 text-center">
              <Link
                href="/#installs"
                className="text-sm text-accent underline underline-offset-4 transition hover:text-white"
              >
                See the full breakdown for each system →
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
