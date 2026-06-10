interface GlowProps {
  className?: string;
  /** 0–1, intensity of the gold radial glow */
  intensity?: number;
}

/**
 * Soft blurred gold radial orb used as a decorative background accent.
 * Position and size it with `className` (e.g. "top-0 -left-20 w-96 h-96").
 */
export default function Glow({ className = "", intensity = 0.25 }: GlowProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      style={{
        background: `radial-gradient(circle, rgba(196,151,59,${intensity}), transparent 70%)`,
      }}
    />
  );
}
