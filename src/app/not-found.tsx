import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Glow from "@/components/ui/Glow";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-16 lg:pt-20">
        <section className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden px-6">
          <Glow className="left-1/2 top-1/4 h-[28rem] w-[28rem] -translate-x-1/2" intensity={0.14} />

          <div className="relative z-10 max-w-xl text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Error 404</p>

            <h1 className="mt-4 font-serif text-7xl leading-none sm:text-8xl lg:text-9xl">
              <span className="gradient-text">404</span>
            </h1>

            <div className="divider-gold mx-auto mt-6 w-24" />

            <h2 className="mt-8 font-serif text-2xl text-foreground sm:text-3xl">
              This piece isn&apos;t on display
            </h2>
            <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">
              The page you&apos;re looking for may have been moved, sold, or never
              existed. Let&apos;s get you back to the art.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/">
                <Button size="lg">Back to Home</Button>
              </Link>
              <Link href="/gallery">
                <Button variant="outline" size="lg">
                  Browse the Gallery
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
