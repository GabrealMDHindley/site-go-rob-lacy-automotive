export default function VimeoEmbed({
  vimeoId,
  title,
  className = "",
}: {
  vimeoId: string;
  title: string;
  className?: string;
}) {
  return (
    <div
      className={`relative aspect-video overflow-hidden rounded-2xl border border-white/10 backdrop-blur-sm ${className}`}
    >
      <iframe
        src={`https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0&color=d09a2a`}
        title={title}
        className="absolute inset-0 h-full w-full"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
        loading="lazy"
      />
    </div>
  );
}
