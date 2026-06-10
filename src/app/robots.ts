import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow every crawler — including AI/LLM bots (GPTBot, ClaudeBot,
        // PerplexityBot, Google-Extended, etc.). Only the private admin
        // area and API routes are kept out of the index.
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
