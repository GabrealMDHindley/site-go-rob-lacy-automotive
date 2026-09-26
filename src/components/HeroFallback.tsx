// Styled static fallback for the 3D hero — used while the canvas lazy-loads,
// and as the permanent scene when WebGL is unavailable. Never a blank hero.
export default function HeroFallback() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 65%, rgba(47,127,224,0.18) 0%, rgba(2,8,20,0) 70%)",
        }}
      />
      <svg
        viewBox="0 0 600 300"
        className="w-[140%] max-w-none opacity-70 md:w-full"
        fill="none"
      >
        <polyline
          points="0,260 90,140 150,200 230,60 300,190 370,100 460,220 520,150 600,240"
          stroke="var(--color-accent-deep)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity="0.55"
        />
        <polyline
          points="0,280 110,190 190,230 260,120 330,225 420,160 500,250 600,200"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity="0.35"
        />
      </svg>
    </div>
  );
}
