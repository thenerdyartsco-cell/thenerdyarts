"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import PurchaseModal from "@/components/gallery/PurchaseModal";
import SoldOutRequestModal from "@/components/gallery/SoldOutRequestModal";
import type { Artwork } from "@/types";

/** Buy / request button + its modal, for use on the artwork detail page. */
export default function ArtworkActions({ artwork }: { artwork: Artwork }) {
  const [buyOpen, setBuyOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const isSold = artwork.status === "sold";

  return (
    <>
      {isSold ? (
        <Button variant="outline" size="lg" onClick={() => setRequestOpen(true)}>
          Request This Piece
        </Button>
      ) : (
        <Button size="lg" onClick={() => setBuyOpen(true)}>
          Buy Now
        </Button>
      )}

      <PurchaseModal artwork={artwork} isOpen={buyOpen} onClose={() => setBuyOpen(false)} />
      <SoldOutRequestModal
        artwork={artwork}
        isOpen={requestOpen}
        onClose={() => setRequestOpen(false)}
      />
    </>
  );
}
