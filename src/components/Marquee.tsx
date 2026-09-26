import { serviceTags } from "@/data/site";

export default function Marquee() {
  const track = [...serviceTags, ...serviceTags];
  return (
    <div
      className="relative overflow-hidden border-y border-white/5 py-5"
      style={{
        maskImage:
          "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
      }}
      aria-hidden="true"
    >
      <div className="marquee-track flex w-max gap-14">
        {track.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-ink-dim"
          >
            <i className="h-1 w-1 rounded-full bg-accent-deep not-italic" />
            {item}
          </span>
        ))}
      </div>
      <style>{`
        .marquee-track {
          animation: marquee-scroll 32s linear infinite;
        }
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
    </div>
  );
}
