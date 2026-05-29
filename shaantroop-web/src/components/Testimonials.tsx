const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    quote:
      "I've tried dozens of soaps. Nothing comes close to Shaant Roop's Lavender & Oat bar. My eczema has calmed down significantly after just 3 weeks.",
    stars: 5,
    skin: "Sensitive / Dry",
  },
  {
    name: "Aditi Menon",
    location: "Bengaluru",
    quote:
      "The packaging alone tells you this is a brand that cares. The seed paper wrap was such a beautiful surprise. And the Neem soap? Absolute game changer.",
    stars: 5,
    skin: "Oily / Acne-prone",
  },
  {
    name: "Rohan Gupta",
    location: "Delhi",
    quote:
      "Gifted the Honey & Calendula set to my mother. She refuses to use anything else now. The quality is outstanding.",
    stars: 5,
    skin: "Mature / Normal",
  },
];

export default function Testimonials() {
  return (
    <section
      className="py-20 sm:py-28 xl:py-36 px-5 sm:px-8 xl:px-16"
      style={{ background: "var(--color-surface-1)" }}
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-[1600px] mx-auto">

        {/* ── Header ────────────────────────────────────── */}
        <div className="text-center max-w-xl mx-auto mb-12 xl:mb-16">
          <p
            className="text-xs tracking-[0.25em] uppercase mb-3"
            style={{
              color: "var(--color-green-600)",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            }}
          >
            Real Stories
          </p>
          <h2
            id="testimonials-heading"
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(2rem, 3vw + 1rem, 3.2rem)",
              letterSpacing: "-0.03em",
              color: "var(--color-text-primary)",
            }}
          >
            Loved by{" "}
            <em className="italic" style={{ color: "var(--color-green-600)" }}>
              Real People
            </em>
          </h2>
        </div>

        {/* ── Grid ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8">
          {testimonials.map((t, i) => (
            <blockquote
              key={i}
              className="relative p-6 xl:p-8 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={{
                background: "var(--color-surface-0)",
                border: "1px solid var(--color-surface-3)",
              }}
            >
              {/* Decorative quote mark */}
              <span
                className="absolute top-4 right-5 text-5xl leading-none select-none pointer-events-none"
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  color: "var(--color-green-100)",
                }}
                aria-hidden="true"
              >
                "
              </span>

              {/* Stars */}
              <div
                className="flex gap-1 mb-4"
                aria-label={`${t.stars} out of 5 stars`}
              >
                {Array.from({ length: t.stars }).map((_, j) => (
                  <svg
                    key={j}
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    style={{ color: "var(--color-gold-400)" }}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.062 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.287-3.957z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p
                className="mb-5 leading-relaxed"
                style={{
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                  fontSize: "0.9rem",
                  fontStyle: "italic",
                  color: "var(--color-text-secondary)",
                }}
              >
                "{t.quote}"
              </p>

              {/* Attribution */}
              <footer>
                <p
                  className="font-semibold text-sm"
                  style={{
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-inter), system-ui, sans-serif",
                  }}
                >
                  {t.name}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{
                    color: "var(--color-text-muted)",
                    fontFamily: "var(--font-inter), system-ui, sans-serif",
                  }}
                >
                  {t.location} · {t.skin}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
