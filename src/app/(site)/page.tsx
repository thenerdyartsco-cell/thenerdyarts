import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import AboutArtist from "@/components/sections/AboutArtist";
import ArtListingPreview from "@/components/sections/ArtListingPreview";
import QuoteBand from "@/components/sections/QuoteBand";
import ContactCTA from "@/components/sections/ContactCTA";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <AboutArtist />
      <ArtListingPreview />
      <QuoteBand />
      <ContactCTA />
    </>
  );
}
