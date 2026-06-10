import type { Metadata } from "next";
import { cache } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getArtworkById } from "@/lib/firestore";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, OG_IMAGE } from "@/lib/site";
import ArtworkActions from "@/components/gallery/ArtworkActions";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const dynamic = "force-dynamic";

// Dedupe the Firestore read between generateMetadata and the page render.
const loadArtwork = cache(async (id: string) => {
  try {
    return await getArtworkById(id);
  } catch {
    return null;
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const art = await loadArtwork(id);

  if (!art) {
    return { title: "Artwork", robots: { index: false, follow: true } };
  }

  const description =
    art.description?.slice(0, 160) ||
    `${art.title} — an original handcrafted piece from ${SITE_NAME}.`;
  const image = art.images?.[0] || OG_IMAGE;

  return {
    title: art.title,
    description,
    alternates: { canonical: `/gallery/${id}` },
    openGraph: {
      type: "website",
      title: `${art.title} | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/gallery/${id}`,
      images: [{ url: image, alt: art.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${art.title} | ${SITE_NAME}`,
      description,
      images: [image],
    },
  };
}

function inr(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default async function ArtworkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const art = await loadArtwork(id);
  if (!art) notFound();

  const isSold = art.status === "sold";
  const url = `${SITE_URL}/gallery/${id}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: art.title,
    description: art.description || SITE_DESCRIPTION,
    image: art.images?.length ? art.images : [`${SITE_URL}${OG_IMAGE}`],
    category: art.category,
    brand: { "@type": "Brand", name: SITE_NAME },
    url,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "INR",
      price: art.price,
      availability: isSold
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: SITE_NAME },
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Gallery", item: `${SITE_URL}/gallery` },
      { "@type": "ListItem", position: 2, name: art.title, item: url },
    ],
  };

  return (
    <section className="px-6 py-12 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="mx-auto max-w-6xl">
        <Link
          href="/gallery"
          className="mb-8 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-accent"
        >
          <ChevronLeft size={16} /> Back to Gallery
        </Link>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <AnimatedSection>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-background to-border/40 ring-1 ring-border">
              {art.images?.length ? (
                <Image
                  src={art.images[0]}
                  alt={art.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-accent/25">
                  <span className="font-serif text-6xl">{art.title[0]}</span>
                </div>
              )}
              {isSold && (
                <div className="absolute right-4 top-4 rounded-full bg-foreground/90 px-3 py-1 text-[10px] uppercase tracking-wider text-background backdrop-blur">
                  Sold
                </div>
              )}
            </div>

            {art.images?.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {art.images.slice(0, 4).map((src, i) => (
                  <div
                    key={i}
                    className="relative aspect-square overflow-hidden rounded-lg ring-1 ring-border"
                  >
                    <Image src={src} alt={`${art.title} ${i + 1}`} fill className="object-cover" sizes="120px" />
                  </div>
                ))}
              </div>
            )}
          </AnimatedSection>

          {/* Details */}
          <AnimatedSection delay={0.15}>
            <div className="lg:py-4">
              <p className="text-xs uppercase tracking-[0.3em] text-accent">{art.category}</p>
              <h1 className="mt-3 font-serif text-3xl text-foreground lg:text-5xl">{art.title}</h1>

              <p className="mt-5 text-2xl font-medium">
                {isSold ? (
                  <span className="text-muted">Sold Out</span>
                ) : (
                  <span className="gradient-text">{inr(art.price)}</span>
                )}
              </p>

              <div className="my-7 h-px w-full bg-border" />

              <p className="leading-relaxed text-muted">{art.description}</p>

              <div className="mt-8">
                <ArtworkActions artwork={art} />
              </div>

              {!isSold && (
                <p className="mt-4 text-xs text-muted">
                  Originals are one of a kind — purchase requests are handled on a
                  first-come, first-served basis.
                </p>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
