import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import VimeoEmbed from "./VimeoEmbed";
import { vsl } from "@/data/site";

// Video-slot pattern: renders only when a real Vimeo ID is set in
// src/data/site.ts — no ID, no section, no placeholder.
export default function Vsl() {
  if (!vsl.vimeoId) return null;

  return (
    <section className="border-t border-white/5 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <SectionHeading eyebrow="See It In Action" title={vsl.title} />
        <Reveal className="mt-12" delay={0.1}>
          <VimeoEmbed vimeoId={vsl.vimeoId} title={vsl.title} />
        </Reveal>
      </div>
    </section>
  );
}
