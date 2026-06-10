"use client";

import { motion } from "motion/react";
import ScrollZoomImage from "@/components/ui/ScrollZoomImage";

export default function QuoteBand() {
  return (
    <section className="relative h-[75vh] min-h-[460px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <ScrollZoomImage
          src="/images/quote-band.png"
          alt=""
          className="h-full w-full"
          sizes="100vw"
          from={1.2}
          to={1}
        />
      </div>
      {/* legibility scrim */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/45" />

      <div className="relative h-full flex items-center justify-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-white text-3xl sm:text-4xl lg:text-6xl text-center max-w-4xl leading-tight text-balance drop-shadow"
        >
          Let&apos;s bring a timeless{" "}
          <span className="italic gradient-text">artwork</span> to life
        </motion.h2>
      </div>
    </section>
  );
}
