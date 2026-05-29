const pillars = [
  {
    icon: "🌿",
    title: "Cold-Pressed Process",
    desc: "Our soaps are made using the traditional cold-process method, preserving all the beneficial properties of natural oils and butters.",
  },
  {
    icon: "🌸",
    title: "Botanical Ingredients",
    desc: "We source ethically grown herbs, florals, and plant extracts directly from Indian farms — from Kerala turmeric to Himalayan rose petals.",
  },
  {
    icon: "♻️",
    title: "Zero-Waste Packaging",
    desc: "Every Shaant Roop bar arrives wrapped in seed paper you can plant, and kraft tissue from recycled sources.",
  },
  {
    icon: "🐰",
    title: "Cruelty-Free Always",
    desc: "Never tested on animals. Our formulas are certified vegan, free from animal-derived ingredients.",
  },
];

export default function WhyNatural() {
  return (
    <section
      id="story"
      className="relative py-20 sm:py-28 xl:py-36 px-5 sm:px-8 xl:px-16 overflow-hidden"
      style={{ background: "var(--color-green-800)" }}
      aria-labelledby="story-heading"
    >
      {/* Decorative rings — subtle so they don't compete with text */}
      <div
        className="absolute -top-40 -right-40 w-[28rem] h-[28rem] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(245,184,0,0.08) 0%, transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,253,247,0.05) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="max-w-[1600px] mx-auto relative z-10">

        {/* ── Header ──────────────────────────────────── */}
        <div className="max-w-2xl mb-16 xl:mb-20">
          <p
            className="text-xs tracking-[0.25em] uppercase mb-3"
            style={{
              color: "var(--color-gold-400)",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            }}
          >
            Why Choose Natural
          </p>
          <h2
            id="story-heading"
            className="mb-5 leading-tight"
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(2rem, 3vw + 1rem, 3.5rem)",
              letterSpacing: "-0.03em",
              color: "#FFFDF7",
            }}
          >
            Rooted in Nature,{" "}
            <em className="italic" style={{ color: "var(--color-gold-400)" }}>
              Crafted with Love
            </em>
          </h2>
          <p
            className="leading-relaxed"
            style={{
              color: "rgba(255,253,247,0.78)",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              fontSize: "clamp(0.9rem, 1.1vw + 0.5rem, 1.05rem)",
            }}
          >
            Every Shaant Roop bar begins as a small-batch recipe — handwritten, measured in grams,
            and poured with intention. We believe your skin deserves the same care as your food.
          </p>
        </div>

        {/* ── Pillars Grid ────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-8">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className="p-6 xl:p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 group"
              style={{
                background: "rgba(255,253,247,0.06)",
                border: "1px solid rgba(245,184,0,0.20)",
              }}
            >
              <span className="text-3xl mb-5 block" role="img" aria-hidden="true">
                {pillar.icon}
              </span>
              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontSize: "1.25rem",
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                  color: "#FFFDF7",
                }}
              >
                {pillar.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "rgba(255,253,247,0.72)",
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                }}
              >
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
