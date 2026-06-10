import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for The Nerdy Arts. Understand the terms governing the use of our website and services.",
};

export default function TermsPage() {
  return (
    <section className="py-16 lg:py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-3xl lg:text-4xl text-foreground mb-8">
          Terms of Service
        </h1>
        <p className="text-sm text-muted mb-8">Last updated: June 2026</p>

        <div className="space-y-8 text-sm text-muted leading-relaxed">
          <section>
            <h2 className="font-serif text-lg text-foreground mb-3">1. Overview</h2>
            <p>
              These Terms of Service govern your use of The Nerdy Arts website. By accessing
              or using our website, you agree to be bound by these terms. If you do not agree
              with any part of these terms, you may not use our website.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-foreground mb-3">2. Purchase Requests</h2>
            <p>
              Submitting a purchase request through our website does not constitute a binding
              purchase agreement. It is an expression of interest. We will review your request,
              verify stock availability, and contact you to finalize the transaction. Prices
              displayed on the website are subject to change without notice.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-foreground mb-3">3. Custom Commissions</h2>
            <p>
              Custom art requests submitted through our website are inquiries and do not
              constitute a binding agreement. Final pricing, timeline, and terms for custom
              commissions will be discussed and agreed upon separately via direct communication.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-foreground mb-3">4. Intellectual Property</h2>
            <p>
              All content on this website, including images, text, designs, logos, and artwork
              representations, is the intellectual property of The Nerdy Arts and is protected
              by copyright laws. You may not reproduce, distribute, or use any content without
              prior written permission.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-foreground mb-3">5. User Submissions</h2>
            <p>
              When you submit information through our forms (purchase requests, custom art
              requests, contact messages), you grant us permission to use this information
              solely for the purpose of fulfilling your request and communicating with you.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-foreground mb-3">6. Limitation of Liability</h2>
            <p>
              The Nerdy Arts shall not be liable for any indirect, incidental, special, or
              consequential damages arising from the use of this website. We make no warranties
              or representations about the accuracy of the information provided on this website.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-foreground mb-3">7. Sold Out Pieces</h2>
            <p>
              Requesting a sold out piece does not guarantee that the piece will become
              available again or that a similar piece can be created. We will make reasonable
              efforts to accommodate such requests but cannot make guarantees.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-foreground mb-3">8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective
              immediately upon posting on this page. Your continued use of the website after
              changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-foreground mb-3">9. Contact</h2>
            <p>
              If you have any questions about these terms, please contact us at{" "}
              <a href="mailto:thenerdyarts.co@gmail.com" className="text-accent hover:underline">
                thenerdyarts.co@gmail.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
