"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import Glow from "@/components/ui/Glow";
import PurchaseModal from "@/components/gallery/PurchaseModal";
import SoldOutRequestModal from "@/components/gallery/SoldOutRequestModal";
import type { Artwork } from "@/types";

export default function ArtListingPreview() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [purchaseArtwork, setPurchaseArtwork] = useState<Artwork | null>(null);
  const [soldOutArtwork, setSoldOutArtwork] = useState<Artwork | null>(null);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch("/api/artworks?limit=6&filter=all");
        if (res.ok) {
          const data = await res.json();
          setArtworks(data.items);
        }
      } catch {
        // Leave empty on error
      } finally {
        setLoaded(true);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <section className="relative py-20 lg:py-32 px-6 bg-surface/70 overflow-hidden">
      <Glow className="-top-20 right-0 w-[30rem] h-[30rem]" intensity={0.12} />
      <div className="max-w-7xl mx-auto relative">
        <AnimatedSection>
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-accent mb-3">
              Collection
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl text-foreground">
              Featured <span className="gradient-text">Artworks</span>
            </h2>
            <div className="divider-gold w-24 mx-auto mt-5" />
          </div>
        </AnimatedSection>

        {loaded && artworks.length === 0 ? (
          <AnimatedSection>
            <p className="text-center text-muted">
              New pieces are on the way. Check back soon, or request a custom commission.
            </p>
          </AnimatedSection>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {artworks.map((artwork, i) => (
            <AnimatedSection key={artwork.id} delay={i * 0.1}>
              <div className="group bg-surface rounded-2xl overflow-hidden ring-1 ring-border shadow-sm hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1 transition-all duration-500">
                <Link
                  href={`/gallery/${artwork.id}`}
                  className="aspect-[4/5] bg-gradient-to-br from-background to-border/40 overflow-hidden relative block"
                  aria-label={`View ${artwork.title}`}
                >
                  {artwork.images.length > 0 ? (
                    <Image
                      src={artwork.images[0]}
                      alt={artwork.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-accent/25">
                      <span className="text-5xl font-serif">{artwork.title[0]}</span>
                    </div>
                  )}

                  {artwork.status === "sold" && (
                    <div className="absolute top-3 right-3 bg-foreground/90 backdrop-blur text-background text-[10px] tracking-wider uppercase px-3 py-1 rounded-full">
                      Sold
                    </div>
                  )}
                </Link>

                <div className="p-5">
                  <Link href={`/gallery/${artwork.id}`}>
                    <h3 className="font-serif text-lg text-foreground group-hover:text-accent transition-colors">
                      {artwork.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted">{artwork.category}</p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="font-medium">
                      {artwork.status === "sold" ? (
                        <span className="text-muted">Sold Out</span>
                      ) : (
                        <span className="gradient-text">{`₹${artwork.price.toLocaleString("en-IN")}`}</span>
                      )}
                    </p>
                    {artwork.status === "sold" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSoldOutArtwork(artwork)}
                      >
                        Request This Piece
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => setPurchaseArtwork(artwork)}>
                        Buy Now
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
        )}

        <AnimatedSection delay={0.4}>
          <div className="text-center mt-12">
            <Link href="/gallery">
              <Button variant="outline" size="lg">
                View All Artworks
              </Button>
            </Link>
          </div>
        </AnimatedSection>
      </div>

      <PurchaseModal
        artwork={purchaseArtwork}
        isOpen={!!purchaseArtwork}
        onClose={() => setPurchaseArtwork(null)}
      />

      <SoldOutRequestModal
        artwork={soldOutArtwork}
        isOpen={!!soldOutArtwork}
        onClose={() => setSoldOutArtwork(null)}
      />
    </section>
  );
}
