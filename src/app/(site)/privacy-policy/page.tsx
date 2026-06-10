import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for The Nerdy Arts. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="py-16 lg:py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-3xl lg:text-4xl text-foreground mb-8">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted mb-8">Last updated: June 2026</p>

        <div className="space-y-8 text-sm text-muted leading-relaxed">
          <section>
            <h2 className="font-serif text-lg text-foreground mb-3">1. Information We Collect</h2>
            <p>When you interact with The Nerdy Arts, we may collect the following personal information:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Mailing address</li>
              <li>Messages and descriptions you provide via our forms</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-lg text-foreground mb-3">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Process and respond to your purchase requests</li>
              <li>Communicate with you about custom art commissions</li>
              <li>Respond to your inquiries and messages</li>
              <li>Notify you about artwork availability</li>
              <li>Send confirmation emails regarding your requests</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-lg text-foreground mb-3">3. Data Storage</h2>
            <p>
              Your data is securely stored using Firebase Firestore, a cloud-based database service
              provided by Google. We implement appropriate security measures to protect your personal
              information against unauthorized access, alteration, or destruction.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-foreground mb-3">4. Data Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties.
              Your information is only used for the purposes stated above and shared only with service
              providers essential to our operations (email delivery, data storage).
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-foreground mb-3">5. Email Communications</h2>
            <p>
              When you submit a form on our website, you will receive a confirmation email. We may
              also contact you regarding your request. We use Resend as our email service provider
              to deliver these communications.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-foreground mb-3">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Request access to the personal data we hold about you</li>
              <li>Request correction of any inaccurate data</li>
              <li>Request deletion of your personal data</li>
              <li>Withdraw your consent at any time</li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, please contact us at{" "}
              <a href="mailto:thenerdyarts.co@gmail.com" className="text-accent hover:underline">
                thenerdyarts.co@gmail.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-foreground mb-3">7. Cookies</h2>
            <p>
              Our website does not use tracking cookies or third-party analytics. We may use
              essential cookies required for the website to function properly.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-foreground mb-3">8. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. Any changes will be posted on
              this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg text-foreground mb-3">9. Contact</h2>
            <p>
              If you have any questions about this privacy policy, please contact us at{" "}
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
