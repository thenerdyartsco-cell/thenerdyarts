import AnimatedSection from "@/components/ui/AnimatedSection";
import Glow from "@/components/ui/Glow";
import ScrollZoomImage from "@/components/ui/ScrollZoomImage";

const stats = [
  { value: "5+", label: "Years of Practice" },
  { value: "100+", label: "Pieces Created" },
  { value: "50+", label: "Happy Collectors" },
];

export default function AboutArtist() {
  return (
    <section
      id="about"
      className="relative py-20 lg:py-32 px-6 overflow-hidden"
    >
      <Glow className="top-10 -left-24 w-[26rem] h-[26rem]" intensity={0.14} />
      <div className="max-w-7xl mx-auto relative">
        <AnimatedSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative">
              <div className="absolute -inset-3 gradient-gold opacity-15 rounded-2xl blur-xl" />
              <ScrollZoomImage
                src="/images/artist.png"
                alt="The artist at work in the studio"
                className="aspect-[4/5] rounded-2xl shadow-xl shadow-accent/10 ring-1 ring-border"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-accent mb-3">
                  About the Artist
                </p>
                <h2 className="font-serif text-3xl lg:text-4xl text-foreground leading-snug">
                  Every Piece Tells
                  <br />a <span className="gradient-text">Story</span>
                </h2>
              </div>

              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  The Nerdy Arts is a small creative space built from a genuine
                  love for art and storytelling.
                </p>
                <p>
                  Founded by <b>Swechchha Vishwakarma</b>, an MBBS student at
                  BRD Medical College, Gorakhpur, it reflects her journey of
                  balancing science with creativity. Alongside her studies, she
                  has continued to nurture her passion for art, earning
                  recognition in several inter-college art competitions for her
                  dedication and attention to detail.
                </p>
                <p>
                  For Swechchha, every artwork begins with a simple idea,
                  feeling, or moment of inspiration. Through careful
                  craftsmanship and a personal artistic touch, she hopes to
                  create pieces that feel meaningful, memorable, and connected
                  to the people who experience them.
                </p>
                <p>
                  Art, to her, is not just something to look at. It is something
                  to connect with.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <p className="font-serif text-2xl lg:text-3xl text-accent">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted tracking-wider uppercase mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
