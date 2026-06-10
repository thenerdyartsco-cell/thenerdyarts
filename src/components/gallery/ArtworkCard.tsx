"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import type { Artwork } from "@/types";

interface ArtworkCardProps {
  artwork: Artwork;
  onBuy: (artwork: Artwork) => void;
  onRequestSoldOut: (artwork: Artwork) => void;
}

export default function ArtworkCard({ artwork, onBuy, onRequestSoldOut }: ArtworkCardProps) {
  const isSold = artwork.status === "sold";

  return (
    <div className="group bg-surface rounded-2xl overflow-hidden ring-1 ring-border shadow-sm hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1 transition-all duration-500 flex flex-col">
      <div className="aspect-[4/5] bg-gradient-to-br from-background to-border/40 overflow-hidden relative">
        {artwork.images.length > 0 ? (
          <Image
            src={artwork.images[0]}
            alt={artwork.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-accent/25">
            <span className="text-5xl font-serif">{artwork.title[0]}</span>
          </div>
        )}

        {isSold && (
          <div className="absolute top-3 right-3 bg-foreground/90 backdrop-blur text-background text-[10px] tracking-wider uppercase px-3 py-1 rounded-full">
            Sold
          </div>
        )}
      </div>

      <div className="space-y-2 p-5 flex flex-col flex-1">
        <h3 className="font-serif text-lg text-foreground">{artwork.title}</h3>
        <p className="text-sm text-muted line-clamp-2">{artwork.description}</p>
        <p className="text-sm text-muted">{artwork.category}</p>

        <div className="flex items-center justify-between pt-3 mt-auto">
          <p className="font-medium text-lg">
            {isSold ? (
              <span className="text-muted">Sold Out</span>
            ) : (
              <span className="gradient-text">{`₹${artwork.price.toLocaleString("en-IN")}`}</span>
            )}
          </p>

          {isSold ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRequestSoldOut(artwork)}
            >
              Request This Piece
            </Button>
          ) : (
            <Button size="sm" onClick={() => onBuy(artwork)}>
              Buy Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
