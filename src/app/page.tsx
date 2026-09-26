import type { Metadata } from "next";
import Preloader from "@/components/Preloader";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Stats from "@/components/Stats";
import Mission from "@/components/Mission";
import Industries from "@/components/Industries";
import Timeline from "@/components/Timeline";
import InstallGrid from "@/components/InstallGrid";
import Vsl from "@/components/Vsl";
import Results from "@/components/Results";
import Guarantee from "@/components/Guarantee";
import BuyerPipeline from "@/components/BuyerPipeline";
import FinalCta from "@/components/FinalCta";
import { hasLogoRevealVideo } from "@/lib/media";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Go Rob Lacy — Growth Systems For Car Dealerships",
  description: `${site.headline} ${site.mission}`,
};

export default function Home() {
  const hasVideo = hasLogoRevealVideo();

  return (
    <>
      <Preloader hasVideo={hasVideo} />
      <Hero />
      <Marquee />
      <Stats />
      <Mission />
      <Industries />
      <Timeline />
      <InstallGrid />
      <Vsl />
      <Results />
      <Guarantee />
      <BuyerPipeline />
      <FinalCta />
    </>
  );
}
