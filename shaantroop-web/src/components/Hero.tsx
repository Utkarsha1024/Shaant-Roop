import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* ─── Background Image ─── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.png"
          alt="Artisanal handcrafted natural soaps arranged on rustic wood with botanicals"
          fill
          priority
          quality={90}
          className="object-cover object-center scale-105"
          sizes="100vw"
        />
        {/* Layered gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[--color-green-900]/85 via-[--color-green-900]/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[--color-green-900]/60 via-transparent to-[--color-green-900]/20" />
      </div>

      {/* ─── Content Grid ─── */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-5 sm:px-8 xl:px-16 grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-16 items-center min-h-screen pt-24 pb-12 lg:pt-28">
        
        {/* Left Column — Text Content */}
        <div className="flex flex-col justify-center gap-6 sm:gap-8 max-w-xl lg:max-w-none">
          
          {/* Badge */}
          <div className="flex items-center gap-3 animate-fade-in-up">
            <span className="flex-shrink-0 w-8 h-[1px] bg-[--color-earth-300]" />
            <span
              className="text-[--color-earth-200] text-[11px] tracking-[0.25em] uppercase"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              Small-batch · Cold-pressed · Botanical
            </span>
          </div>

          {/* Main Headline — Brand Name */}
          <h1
            className="text-balance"
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(3rem, 6vw + 1rem, 7rem)",
              color: "var(--color-earth-50)",
              letterSpacing: "0.08em",
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            Shaant{" "}
            <em
              className="not-italic"
              style={{ color: "var(--color-gold-300)" }}
            >
              Roop
            </em>
          </h1>

          {/* Official brand slogan */}
          <p
            className="text-[--color-earth-200] max-w-md"
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(1.15rem, 1.5vw + 0.5rem, 1.55rem)",
              lineHeight: "1.55",
              fontWeight: 400,
              fontStyle: "italic",
              letterSpacing: "0.01em",
              color: "rgba(255,253,247,0.88)",
            }}
          >
            The calmness your skin deserves
          </p>

          {/* Trust Badges */}
          <ul className="flex flex-wrap gap-3 sm:gap-4">
            {["100% Natural", "Cruelty-Free", "Vegan", "Plastic-Free"].map((badge) => (
              <li
                key={badge}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[--color-earth-400]/50 text-[--color-earth-200]"
                style={{
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  background: "rgba(90,60,40,0.25)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[--color-gold-400] flex-shrink-0" />
                {badge}
              </li>
            ))}
          </ul>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
            {/* Primary CTA */}
            <a
              href="#products"
              id="hero-shop-cta"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full overflow-hidden text-sm font-medium tracking-widest uppercase transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-100"
              style={{
                background: "linear-gradient(135deg, var(--color-green-600), var(--color-green-700))",
                color: "#FFFDF7",
                letterSpacing: "0.12em",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
              }}
              aria-label="Browse the soap collection"
            >
              {/* Shimmer effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              Shop Collection
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>

            {/* Secondary CTA */}
            <a
              href="#story"
              className="inline-flex items-center gap-2 text-sm text-[--color-earth-200] hover:text-[--color-earth-50] transition-colors duration-300 group"
              style={{
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                letterSpacing: "0.05em",
              }}
            >
              <span className="w-8 h-[1px] bg-current transition-all duration-300 group-hover:w-12" />
              Our Story
            </a>
          </div>
        </div>

        {/* Right Column — Product Spotlight Card (visible on lg+) */}
        <div className="hidden lg:flex justify-center xl:justify-end items-center">
          <div
            className="relative w-full max-w-xs xl:max-w-sm rounded-3xl overflow-hidden border border-white/10 p-6 xl:p-8"
            style={{
              background: "rgba(253, 246, 236, 0.12)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              boxShadow: "0 32px 80px rgba(58, 32, 18, 0.4), inset 0 1px 0 rgba(255,255,255,0.12)",
            }}
          >
            {/* Season badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 text-[10px] tracking-widest uppercase"
              style={{
                background: "var(--color-green-600)",
                color: "#FFFDF7",
                letterSpacing: "0.15em",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[--color-gold-400] animate-pulse" />
              New Collection
            </div>

            <h2
              className="text-[--color-earth-50] mb-2 leading-tight"
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontWeight: 400,
                fontSize: "1.6rem",
                letterSpacing: "-0.02em",
              }}
            >
              Lavender & Oat{" "}
              <em className="italic text-[--color-earth-300]">Ritual Bar</em>
            </h2>
            <p
              className="text-[--color-earth-200] text-sm mb-6 leading-relaxed"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              Infused with dried lavender buds and colloidal oats. Soothes, calms, 
              and nourishes sensitive skin.
            </p>

            {/* Ingredients tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {["Lavender Oil", "Oat Milk", "Shea Butter", "Vitamin E"].map((ing) => (
                <span
                  key={ing}
                  className="px-2.5 py-1 rounded-full text-[10px] text-[--color-earth-200] border border-[--color-earth-400]/40"
                  style={{
                    background: "rgba(90,60,40,0.2)",
                    fontFamily: "var(--font-inter), system-ui, sans-serif",
                    letterSpacing: "0.05em",
                  }}
                >
                  {ing}
                </span>
              ))}
            </div>

            {/* Price & Add */}
            <div className="flex items-center justify-between">
              <div>
                <span
                  className="block text-[10px] text-[--color-earth-300] uppercase tracking-widest mb-0.5"
                  style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                >
                  From
                </span>
                <span
                  className="text-[--color-earth-100]"
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontSize: "1.8rem",
                    fontWeight: 400,
                  }}
                >
                  ₹299
                </span>
              </div>
              <a
                href="#products"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  background: "var(--color-earth-300)",
                  color: "var(--color-bark)",
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                  letterSpacing: "0.1em",
                }}
              >
                Add to Cart
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Scroll Indicator ─── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
        <span
          className="text-[10px] text-[--color-earth-300] tracking-[0.2em] uppercase"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
          Explore
        </span>
        <svg
          className="w-4 h-4 text-[--color-earth-300]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* ─── Diagonal Transition Edge ─── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 z-10"
        style={{
          background:
            "linear-gradient(to bottom right, transparent 49%, var(--color-cream) 50%)",
        }}
      />
    </section>
  );
}
