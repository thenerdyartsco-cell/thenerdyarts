import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/gallery`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/request-custom`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/reviews`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Add an entry per artwork so each detail page is discoverable.
  let artworkRoutes: MetadataRoute.Sitemap = [];
  try {
    const { getAllArtworks } = await import("@/lib/firestore");
    const artworks = await getAllArtworks();
    artworkRoutes = artworks.map((a) => ({
      url: `${SITE_URL}/gallery/${a.id}`,
      lastModified: new Date(a.updatedAt || a.createdAt || now),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    // Firebase not configured — fall back to static routes only.
  }

  return [...staticRoutes, ...artworkRoutes];
}
