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
                  The Nerdy Arts is born from a deep passion for creating art
                  that resonates. Each piece is carefully handcrafted, blending
                  traditional techniques with a unique creative vision.
                </p>
                <p>
                  From concept to completion, every artwork is a journey of
                  exploration and expression. We believe art should not just be
                  seen, it should be felt.
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
