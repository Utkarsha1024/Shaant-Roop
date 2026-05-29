"use client";

import Image from "next/image";

const shopLinks = ["All Products", "Face Care", "Body Care", "Gift Sets", "Bundles"];
const companyLinks = ["Our Story", "Ingredients", "Sustainability", "Press", "Careers"];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative py-16 xl:py-20 px-5 sm:px-8 xl:px-16 overflow-hidden"
      style={{ background: "var(--color-green-900)" }}
      aria-label="Site footer"
    >
      {/* Gold top divider */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, var(--color-gold-400), transparent)" }}
        aria-hidden="true"
      />
      {/* Subtle radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at top, rgba(245,184,0,0.06) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="max-w-[1600px] mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-10 xl:gap-16 mb-12">

          {/* ── Brand ──────────────────────────────────── */}
          <div className="sm:col-span-2 xl:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/logo.jpg"
                  alt="Shaant Roop logo"
                  fill
                  className="object-contain rounded-sm"
                />
              </div>
              <div>
                <p
                  className="leading-none"
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontSize: "1.5rem",
                    fontWeight: 400,
                    color: "#FFFDF7",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Shaant Roop
                </p>
                <p
                  className="text-[10px] tracking-[0.15em] uppercase mt-0.5"
                  style={{
                    color: "var(--color-gold-400)",
                    fontFamily: "var(--font-inter), sans-serif",
                  }}
                >
                  The calmness your skin deserves
                </p>
              </div>
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{
                color: "rgba(255,253,247,0.65)",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
              }}
            >
              Small-batch, cold-pressed soaps crafted with botanical love in the heart of India.
            </p>
          </div>

          {/* ── Shop ───────────────────────────────────── */}
          <div>
            <h3
              className="text-xs tracking-[0.2em] uppercase mb-5"
              style={{
                color: "var(--color-gold-400)",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
              }}
            >
              Shop
            </h3>
            <ul className="space-y-3">
              {shopLinks.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm transition-colors"
                    style={{
                      color: "rgba(255,253,247,0.62)",
                      fontFamily: "var(--font-inter), system-ui, sans-serif",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFDF7")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,253,247,0.62)")}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Company ────────────────────────────────── */}
          <div>
            <h3
              className="text-xs tracking-[0.2em] uppercase mb-5"
              style={{
                color: "var(--color-gold-400)",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
              }}
            >
              Company
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm transition-colors"
                    style={{
                      color: "rgba(255,253,247,0.62)",
                      fontFamily: "var(--font-inter), system-ui, sans-serif",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFDF7")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,253,247,0.62)")}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Newsletter ─────────────────────────────── */}
          <div>
            <h3
              className="text-xs tracking-[0.2em] uppercase mb-5"
              style={{
                color: "var(--color-gold-400)",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
              }}
            >
              Stay in the Loop
            </h3>
            <p
              className="text-sm mb-4 leading-relaxed"
              style={{
                color: "rgba(255,253,247,0.62)",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
              }}
            >
              New recipes, seasonal soaps, and self-care rituals — straight to your inbox.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 min-w-0 px-4 py-2.5 rounded-full text-sm outline-none transition-colors"
                style={{
                  background: "rgba(255,253,247,0.08)",
                  border: "1px solid rgba(245,184,0,0.30)",
                  color: "#FFFDF7",
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-gold-400)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(245,184,0,0.30)")}
                aria-label="Email address for newsletter"
              />
              <button
                type="submit"
                className="flex-shrink-0 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:brightness-110 hover:shadow-lg"
                style={{
                  background: "var(--color-gold-400)",
                  color: "var(--color-green-900)",
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                  letterSpacing: "0.1em",
                }}
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────────── */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t"
          style={{ borderColor: "rgba(255,253,247,0.10)" }}
        >
          <p
            className="text-xs"
            style={{
              color: "rgba(255,253,247,0.42)",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            }}
          >
            © {currentYear} Shaant Roop. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {["Privacy", "Terms", "Shipping"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-xs transition-colors"
                style={{
                  color: "rgba(255,253,247,0.42)",
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-gold-400)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,253,247,0.42)")}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
