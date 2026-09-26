import Image from "next/image";
import Link from "next/link";
import { addressLine, site } from "@/data/site";

export default function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Image
              src="/brand/logo-lockup.svg"
              alt="Go Rob Lacy"
              width={1573}
              height={210}
              unoptimized
              className="mb-4 h-7 w-auto"
            />
            <p className="max-w-xs text-sm text-ink-dim">{site.mission}</p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.24em] text-accent-deep">
              {site.tagline}
            </p>
          </div>

          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-ink-dim">
              Navigate
            </p>
            <ul className="space-y-3 text-sm">
              <li><Link href="/#how-it-works" className="text-ink-dim transition hover:text-ink">How It Works</Link></li>
              <li><Link href="/#installs" className="text-ink-dim transition hover:text-ink">What We Install</Link></li>
              <li><Link href="/#results" className="text-ink-dim transition hover:text-ink">Results</Link></li>
              <li><Link href="/about" className="text-ink-dim transition hover:text-ink">About</Link></li>
              <li><Link href="/book" className="text-ink-dim transition hover:text-ink">Book a Call</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-ink-dim">
              Get In Touch
            </p>
            <ul className="space-y-3 text-sm text-ink-dim">
              <li>
                <a href={site.phoneHref} className="transition hover:text-ink">
                  {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="transition hover:text-ink">
                  {site.email}
                </a>
              </li>
              <li className="max-w-[16rem] leading-relaxed">{addressLine}</li>
              <li>
                <Link
                  href="/book"
                  className="inline-flex items-center gap-1.5 pt-1 text-accent transition hover:text-white"
                >
                  Book Your Call &rarr;
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-white/5 pt-6 text-xs text-ink-dim/80 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {site.legalName} All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
