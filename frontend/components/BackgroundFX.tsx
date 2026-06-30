/**
 * Global animated background field — monochrome and subtle.
 * A faint drifting grid plus a few soft ink/beige blobs that morph slowly.
 * Fixed behind all content; respects prefers-reduced-motion.
 */
export default function BackgroundFX() {
  return (
    <div className="bgfx" aria-hidden>
      <div
        className="bgfx-blob animate-blob"
        style={{
          top: "-8%",
          left: "-6%",
          width: "48vw",
          height: "48vw",
          background:
            "radial-gradient(circle at 30% 30%, rgba(10,10,11,0.18), rgba(10,10,11,0))",
          animationDelay: "-4s",
        }}
      />
      <div
        className="bgfx-blob animate-blob"
        style={{
          top: "30%",
          right: "-10%",
          width: "42vw",
          height: "42vw",
          background:
            "radial-gradient(circle at 60% 40%, rgba(120,110,90,0.22), rgba(120,110,90,0))",
          animationDelay: "-12s",
        }}
      />
      <div
        className="bgfx-blob animate-blob"
        style={{
          bottom: "-12%",
          left: "25%",
          width: "40vw",
          height: "40vw",
          background:
            "radial-gradient(circle at 50% 50%, rgba(10,10,11,0.12), rgba(10,10,11,0))",
          animationDelay: "-20s",
        }}
      />
    </div>
  );
}
