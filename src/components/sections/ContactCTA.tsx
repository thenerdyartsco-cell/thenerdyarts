import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import Glow from "@/components/ui/Glow";

export default function ContactCTA() {
  return (
    <section className="py-20 lg:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection>
          <div className="relative gradient-panel rounded-3xl ring-1 ring-border shadow-xl shadow-accent/10 overflow-hidden px-6 py-16 lg:py-20 text-center">
            <Glow className="-top-16 -right-10 w-80 h-80" intensity={0.2} />
            <Glow className="-bottom-20 -left-10 w-80 h-80" intensity={0.14} />
            <div className="relative">
              <p className="text-xs tracking-[0.3em] uppercase text-accent mb-3">
                Let&apos;s Connect
              </p>
              <h2 className="font-serif text-3xl lg:text-5xl text-foreground mb-6">
                Have a Vision?{" "}
                <span className="gradient-text">Let&apos;s Create Together</span>
              </h2>
              <p className="text-muted max-w-xl mx-auto leading-relaxed mb-10">
                Whether you&apos;re looking for a specific piece or want to commission
                something entirely unique, we&apos;d love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg">Get in Touch</Button>
                </Link>
                <Link href="/request-custom">
                  <Button variant="outline" size="lg">
                    Request Custom Art
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
