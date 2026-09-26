import { existsSync } from "node:fs";
import path from "node:path";

// Video-slot contract (studio-wide): a media file is only referenced by a page
// once it actually exists in public/, checked at build time. No file → no
// section, no placeholder — the section appears automatically on the next
// deploy once the file is pushed, with no code change.
export function publicFileExists(relativePath: string): boolean {
  return existsSync(path.join(process.cwd(), "public", relativePath));
}

export const LOGO_REVEAL_VIDEO = "videos/brand/logo-reveal.mp4";
export const LOGO_REVEAL_POSTER = "videos/brand/poster.jpg";

export function hasLogoRevealVideo(): boolean {
  return publicFileExists(LOGO_REVEAL_VIDEO);
}
