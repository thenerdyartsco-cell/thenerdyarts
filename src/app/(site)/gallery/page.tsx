import type { Metadata } from "next";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse our collection of handcrafted art pieces. Find available artworks to purchase or request sold out pieces.",
};

export default function GalleryPage() {
  return (
    <section className="py-16 lg:py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-accent mb-3">
              Our Collection
            </p>
            <h1 className="font-serif text-3xl lg:text-5xl text-foreground mb-4">
              Art Gallery
            </h1>
            <p className="text-muted max-w-xl mx-auto leading-relaxed">
              Each piece is handcrafted with care and passion. Browse available artworks
              or request a sold out piece.
            </p>
          </div>
        </AnimatedSection>

        <GalleryGrid />
      </div>
    </section>
  );
}
