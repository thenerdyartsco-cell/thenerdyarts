"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Mounts Lenis for buttery momentum/smooth scrolling across the whole site,
 * including smooth handling of in-page anchor links (e.g. the hero scroll arrow).
 */
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      anchors: true,
    });

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
