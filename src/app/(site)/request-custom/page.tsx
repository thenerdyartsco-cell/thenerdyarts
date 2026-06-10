import type { Metadata } from "next";
import CustomRequestForm from "@/components/forms/CustomRequestForm";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  title: "Request Custom Art",
  description: "Commission a custom art piece tailored to your vision. Tell us your ideas and we'll bring them to life.",
};

export default function RequestCustomPage() {
  return (
    <section className="py-16 lg:py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <AnimatedSection>
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-accent mb-3">
                Commission
              </p>
              <h1 className="font-serif text-3xl lg:text-5xl text-foreground mb-6">
                Request a Custom Art Piece
              </h1>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  Have a vision for a unique piece? We&apos;d love to bring it to life.
                  Share your ideas, preferences, and budget, and our artist will work
                  with you to create something truly special.
                </p>
                <p>
                  Custom commissions typically take 2-6 weeks depending on complexity.
                  We&apos;ll discuss timeline and details after reviewing your request.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 flex items-center justify-center bg-accent/10 text-accent font-serif text-sm shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">Share Your Vision</h3>
                    <p className="text-sm text-muted">Tell us about the piece you envision</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 flex items-center justify-center bg-accent/10 text-accent font-serif text-sm shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">Discuss & Refine</h3>
                    <p className="text-sm text-muted">We&apos;ll reach out to discuss details</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 flex items-center justify-center bg-accent/10 text-accent font-serif text-sm shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">Creation & Delivery</h3>
                    <p className="text-sm text-muted">Your unique piece comes to life</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <CustomRequestForm />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
