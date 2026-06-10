import type { Metadata } from "next";
import ContactForm from "@/components/forms/ContactForm";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Mail } from "lucide-react";
import InstagramIcon from "@/components/ui/InstagramIcon";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with The Nerdy Arts. We'd love to hear from you about art, commissions, or any questions.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="py-16 lg:py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <AnimatedSection>
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-accent mb-3">
                Get in Touch
              </p>
              <h1 className="font-serif text-3xl lg:text-5xl text-foreground mb-6">
                Contact Us
              </h1>
              <p className="text-muted leading-relaxed mb-8">
                Have a question, feedback, or just want to say hello? We&apos;d love to
                hear from you. Fill out the form and we&apos;ll get back to you as
                soon as possible.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-accent" />
                  <a
                    href="mailto:thenerdyarts.co@gmail.com"
                    className="text-sm text-muted hover:text-accent transition-colors"
                  >
                    thenerdyarts.co@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <InstagramIcon size={18} className="text-accent" />
                  <a
                    href="https://www.instagram.com/the_nerdy_arts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted hover:text-accent transition-colors"
                  >
                    @the_nerdy_arts
                  </a>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <ContactForm />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
