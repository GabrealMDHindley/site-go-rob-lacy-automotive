import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import VimeoEmbed from "@/components/VimeoEmbed";
import { confirmationVideo, site } from "@/data/site";

export const metadata: Metadata = {
  title: "You're Booked",
  robots: { index: false, follow: false },
};

// Reachable only right after /api/book sets the grl_booked cookie (a real
// booking on the GoHighLevel calendar) — never linked to, never in the
// sitemap, and bounced back to /book without it.
export default async function ConfirmationPage() {
  const cookieStore = await cookies();
  if (!cookieStore.get("grl_booked")?.value) {
    redirect("/book");
  }

  return (
    <section className="border-b border-white/5 px-6 pb-24 pt-40 sm:px-8 md:pb-32">
      <div className="mx-auto max-w-2xl text-center">
        <SectionHeading
          eyebrow="You're Confirmed"
          title="Your call is booked."
          description={
            confirmationVideo.vimeoId
              ? "Watch this before we talk — it'll save us both time."
              : "It's on the calendar — we're looking forward to talking about your dealership."
          }
        />
        {confirmationVideo.vimeoId && (
          <Reveal className="mt-12" delay={0.1}>
            <VimeoEmbed vimeoId={confirmationVideo.vimeoId} title={confirmationVideo.title} />
          </Reveal>
        )}
        <p className="mt-10 text-sm text-ink-dim">
          Questions before then? Call{" "}
          <a href={site.phoneHref} className="text-accent underline">
            {site.phone}
          </a>{" "}
          or email{" "}
          <a href={`mailto:${site.email}`} className="text-accent underline">
            {site.email}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
