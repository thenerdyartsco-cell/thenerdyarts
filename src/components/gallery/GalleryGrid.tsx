"use client";

import { useState, useEffect, useCallback } from "react";
import ArtworkCard from "./ArtworkCard";
import PurchaseModal from "./PurchaseModal";
import SoldOutRequestModal from "./SoldOutRequestModal";
import Button from "@/components/ui/Button";
import AnimatedSection from "@/components/ui/AnimatedSection";
import type { Artwork } from "@/types";

type Filter = "all" | "available" | "sold";

export default function GalleryGrid() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [lastDocId, setLastDocId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [purchaseArtwork, setPurchaseArtwork] = useState<Artwork | null>(null);
  const [soldOutArtwork, setSoldOutArtwork] = useState<Artwork | null>(null);

  const fetchArtworks = useCallback(async (activeFilter: Filter, append = false, cursor?: string | null) => {
    if (!append) setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "8", filter: activeFilter });
      if (append && cursor) params.set("startAfter", cursor);

      const res = await fetch(`/api/artworks?${params}`);
      if (res.ok) {
        const data = await res.json();
        setArtworks((prev) => (append ? [...prev, ...data.items] : data.items));
        setLastDocId(data.lastDocId);
        setHasMore(data.hasMore);
      }
    } catch {
      // Leave existing data on error
    } finally {
      if (!append) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArtworks(filter);
  }, [filter, fetchArtworks]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await fetchArtworks(filter, true, lastDocId);
    setLoadingMore(false);
  };

  const handleFilterChange = (newFilter: Filter) => {
    setFilter(newFilter);
    setLastDocId(null);
    setHasMore(false);
  };

  const filters: { label: string; value: Filter }[] = [
    { label: "All", value: "all" },
    { label: "Available", value: "available" },
    { label: "Sold Out", value: "sold" },
  ];

  const filtered = filter === "all"
    ? artworks
    : artworks.filter((a) => a.status === filter);

  return (
    <>
      <div className="flex justify-center gap-2 mb-12">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => handleFilterChange(f.value)}
            className={`px-5 py-2 text-xs tracking-wider uppercase rounded-full transition-all duration-300 ${
              filter === f.value
                ? "gradient-gold text-white shadow-md shadow-accent/20"
                : "bg-surface/60 text-muted border border-border hover:border-accent hover:text-accent"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20">
          <p className="text-muted">Loading the collection…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted">
            {filter === "all"
              ? "No artworks yet — new pieces are on the way."
              : "No artworks found in this category."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {filtered.map((artwork, i) => (
            <AnimatedSection key={artwork.id} delay={i * 0.05}>
              <ArtworkCard
                artwork={artwork}
                onBuy={setPurchaseArtwork}
                onRequestSoldOut={setSoldOutArtwork}
              />
            </AnimatedSection>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="text-center mt-12">
          <Button variant="outline" onClick={handleLoadMore} loading={loadingMore}>
            Load More
          </Button>
        </div>
      )}

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
    </>
  );
}
