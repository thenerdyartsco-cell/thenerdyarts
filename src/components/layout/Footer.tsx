import Link from "next/link";
import Image from "next/image";
import InstagramIcon from "@/components/ui/InstagramIcon";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Image
              src="/images/logo.svg"
              alt="The Nerdy Arts"
              width={200}
              height={34}
              className="h-7 w-auto mb-4"
            />
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              Handcrafted art pieces that blend creativity with passion. Each piece tells a unique story.
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-wider uppercase text-foreground mb-4 font-medium">
              Quick Links
            </h4>
            <div className="space-y-3">
              <Link href="/gallery" className="block text-sm text-muted hover:text-accent transition-colors">
                Gallery
              </Link>
              <Link href="/request-custom" className="block text-sm text-muted hover:text-accent transition-colors">
                Custom Art
              </Link>
              <Link href="/reviews" className="block text-sm text-muted hover:text-accent transition-colors">
                Reviews
              </Link>
              <Link href="/contact" className="block text-sm text-muted hover:text-accent transition-colors">
                Contact Us
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-wider uppercase text-foreground mb-4 font-medium">
              Legal
            </h4>
            <div className="space-y-3">
              <Link href="/privacy-policy" className="block text-sm text-muted hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-sm text-muted hover:text-accent transition-colors">
                Terms of Service
              </Link>
            </div>
            <div className="mt-6">
              <a
                href="https://www.instagram.com/the_nerdy_arts"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
              >
                <InstagramIcon size={18} />
                <span>Follow us</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} The Nerdy Arts. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
