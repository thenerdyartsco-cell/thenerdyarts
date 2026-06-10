import type { Metadata } from "next";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ReviewCard from "@/components/reviews/ReviewCard";
import type { Review } from "@/types";

export const metadata: Metadata = {
  title: "Reviews",
  alternates: { canonical: "/reviews" },
  description: "Read what our collectors and clients say about The Nerdy Arts and our handcrafted art pieces.",
};

export default async function ReviewsPage() {
  let reviews: Review[] = [];

  try {
    const { getApprovedReviews } = await import("@/lib/firestore");
    reviews = (await getApprovedReviews()) as Review[];
  } catch {
    // No reviews if Firebase is not configured
  }

  return (
    <section className="py-16 lg:py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-accent mb-3">
              Testimonials
            </p>
            <h1 className="font-serif text-3xl lg:text-5xl text-foreground mb-4">
              What Our Collectors Say
            </h1>
            <p className="text-muted max-w-xl mx-auto leading-relaxed">
              Hear from the people who&apos;ve welcomed our art into their spaces.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {reviews.map((review, i) => (
            <AnimatedSection key={review.id} delay={i * 0.1}>
              <ReviewCard review={review} />
            </AnimatedSection>
          ))}
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted">No reviews yet. Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </section>
  );
}
