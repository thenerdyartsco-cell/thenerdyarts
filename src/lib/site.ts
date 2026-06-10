/**
 * Central site constants used by metadata, sitemap, robots, and structured data.
 * Set NEXT_PUBLIC_SITE_URL in the environment to your live domain.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://thenerdyarts.co.in"
).replace(/\/$/, "");

export const SITE_NAME = "The Nerdy Arts";

export const SITE_TAGLINE = "Handcrafted Art Pieces";

export const SITE_DESCRIPTION =
  "Discover handcrafted, one-of-a-kind art pieces that blend creativity with passion. Buy original artworks or commission a custom piece from The Nerdy Arts.";

export const SITE_KEYWORDS = [
  "The Nerdy Arts",
  "handcrafted art",
  "original artwork",
  "buy art online",
  "custom art commission",
  "acrylic paintings",
  "handmade paintings",
  "Radha Krishna painting",
  "wall art",
  "art gallery",
  "commission a painting",
];

export const INSTAGRAM_URL = "https://www.instagram.com/the_nerdy_arts";

export const ADMIN_EMAIL = "thenerdyarts.co@gmail.com";

export const OG_IMAGE = "/og-image.png";
