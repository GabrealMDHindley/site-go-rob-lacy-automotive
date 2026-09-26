import Reveal from "./Reveal";
import KineticText from "./KineticText";
import Eyebrow from "./Eyebrow";

export default function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.28em] text-accent-deep">
        <Eyebrow text={eyebrow} />
      </p>
      <KineticText
        as="h2"
        text={title}
        className="text-balance font-display text-3xl font-medium leading-tight sm:text-4xl md:text-5xl"
      />
      {description && (
        <Reveal delay={0.25}>
          <p className="mt-4 text-balance text-ink-dim">{description}</p>
        </Reveal>
      )}
    </div>
  );
}
