"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";

interface ScrollZoomImageProps {
  src: string;
  alt: string;
  /** classes for the outer (clipping) wrapper — set sizing/rounding here */
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** starting scale as the image enters the viewport */
  from?: number;
  /** ending scale as it leaves */
  to?: number;
}

/**
 * Image that gently scales (Ken-Burns style zoom) as the user scrolls past it.
 * The outer wrapper clips the overflow; size/round it via `className`.
 */
export default function ScrollZoomImage({
  src,
  alt,
  className = "",
  sizes,
  priority,
  from = 1.18,
  to = 1,
}: ScrollZoomImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [from, to]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ scale }} className="absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={sizes}
          priority={priority}
        />
      </motion.div>
    </div>
  );
}
