import StarRating from "@/components/ui/StarRating";
import type { Review } from "@/types";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-surface border border-border p-6 lg:p-8 space-y-4">
      <StarRating rating={review.rating} />
      <p className="text-foreground leading-relaxed text-sm italic">
        &ldquo;{review.text}&rdquo;
      </p>
      <p className="text-xs text-accent tracking-wider uppercase font-medium">
        {review.name}
      </p>
    </div>
  );
}
