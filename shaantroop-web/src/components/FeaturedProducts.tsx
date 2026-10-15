"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { assetUrl } from "@/lib/assetUrl";
import type { Product } from "@/lib/types";

// ─── NEW: Dual-URL Strategy to prevent Docker Hairpin crashes ─────────
const IS_SERVER = typeof window === "undefined";

// 1. THE DATA FETCHER (Smart Routing)
// Server uses internal Docker network, Phone uses Public IP
const API_BASE_URL = IS_SERVER
  ? "http://backend:8085"
  : (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8085");

// 2. Asset URLs are handled by the shared assetUrl() helper in @/lib/assetUrl.ts
// ──────────────────────────────────────────────────────────────────────

/* ─── Visual accents ─────────────────────────────────────────────────── */
// Cycles through a palette for products that have no image
const PALETTE = ["#9b8ea0", "#c49a3a", "#7a9b7a", "#d4a227", "#8e9ba0", "#a07a6a"];
const BADGES = ["Bestseller", "New", null, null, null, null];

function colorFor(id: number) {
  return PALETTE[id % PALETTE.length];
}
function badgeFor(index: number) {
  return BADGES[index % BADGES.length];
}

/* ─── Add to cart button ─────────────────────────────────────────────── */
function AddToCartButton({ product }: { product: Product }) {
  const { items, addToCart, increment, decrement, removeFromCart } = useCart();

  const cartItem = items.find((i) => i.product.id === product.id);

  if (cartItem) {
    const isMaxReached =
      product.stockQuantity !== -1 && cartItem.quantity >= product.stockQuantity;

    const handleMinus = () => {
      if (cartItem.quantity === 1) {
        removeFromCart(product.id);
      } else {
        decrement(product.id);
      }
    };

    const handlePlus = () => {
      if (!isMaxReached) {
        increment(product.id);
      }
    };

    return (
      <div className="flex items-center justify-between border border-[#DECEB3] rounded-full px-2 py-1 w-28 bg-white">
        <button
          type="button"
          onClick={handleMinus}
          className="w-8 h-8 rounded-full bg-[#D7E6D9] text-[#234A31] flex items-center justify-center text-lg hover:bg-[#C1D5C4] transition-colors"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span
          className="text-sm font-semibold"
          style={{
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            color: "var(--color-earth-900)",
          }}
        >
          {cartItem.quantity}
        </span>
        <button
          type="button"
          onClick={handlePlus}
          disabled={isMaxReached}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-colors ${isMaxReached
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-[#D7E6D9] text-[#234A31] hover:bg-[#C1D5C4]"
            }`}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      aria-label={`Add ${product.name} to cart`}
      className="px-4 py-2 rounded-full text-xs tracking-wider uppercase font-medium transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95"
      style={{
        background: "linear-gradient(135deg, var(--color-green-600), var(--color-green-700))",
        color: "#FFFDF7",
        fontFamily: "var(--font-inter), system-ui, sans-serif",
        letterSpacing: "0.1em",
      }}
    >
      Add to Cart
    </button>
  );
}

/* ─── Product card ───────────────────────────────────────────────────── */
function ProductCard({ product, index }: { product: Product; index: number }) {
  const color = colorFor(product.id);
  const badge = badgeFor(index);

  return (
    <article
      className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-[--color-earth-100]"
      style={{ background: "var(--color-parchment)" }}
    >
      {/* Color swatch / image area */}
      <div
        className={`relative h-48 sm:h-52 xl:h-56 flex items-center justify-center transition-transform duration-500 origin-bottom overflow-hidden ${product.stockQuantity === 0 || product.discontinued ? "" : "group-hover:scale-105"
          }`}
        style={{
          background: product.imageUrl
            ? undefined
            : `linear-gradient(135deg, ${color}22, ${color}55)`,
        }}
      >
        {(product.stockQuantity === 0 || product.discontinued) && (
          <div className="absolute inset-0 bg-white/50 z-10"></div>
        )}

        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={assetUrl(product.imageUrl)}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          /* Soap bar placeholder */
          <div
            className="w-20 h-28 rounded-xl shadow-lg flex items-center justify-center text-white text-xs font-medium tracking-wide"
            style={{
              background: `linear-gradient(160deg, ${color}, ${color}99)`,
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            }}
          >
            <span className="rotate-[-8deg] opacity-70">soap</span>
          </div>
        )}

        {/* Badge */}
        {badge && (
          <span
            className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-semibold"
            style={{
              background:
                badge === "New"
                  ? "var(--color-green-600)"
                  : "var(--color-gold-400)",
              color:
                badge === "New" ? "#FFFDF7" : "var(--color-green-900)",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <p
          className="text-[10px] tracking-[0.2em] uppercase mb-1"
          style={{
            color: "var(--color-earth-500)",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
          }}
        >
          {product.categoryName}
        </p>
        <h3
          className="mb-2"
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "1.3rem",
            fontWeight: 400,
            letterSpacing: "-0.01em",
            color: "var(--color-earth-900)",
          }}
        >
          {product.name}
        </h3>
        <p
          className="text-sm mb-4 leading-relaxed"
          style={{
            color: "var(--color-text-secondary)",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
          }}
        >
          {product.description}
        </p>

        {product.stockQuantity === -1 && !product.discontinued && (
          <p className="text-xs mb-3 font-medium" style={{ color: "var(--color-green-700)", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
            🌿 Made to Order
          </p>
        )}
        {product.stockQuantity > 0 && product.stockQuantity <= 5 && !product.discontinued && (
          <p className="text-xs mb-3 font-semibold text-red-500" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
            Only {product.stockQuantity} left
          </p>
        )}

        {product.discontinued ? (
          <div
            className="w-full py-2.5 rounded-full text-center text-xs tracking-wider uppercase font-semibold"
            style={{
              backgroundColor: "#f3f4f6", // bg-gray-100
              border: "1px solid #d1d5db", // border-gray-300
              color: "#4b5563", // text-gray-600
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              letterSpacing: "0.1em",
            }}
          >
            Discontinued
          </div>
        ) : product.stockQuantity === 0 ? (
          <div
            className="w-full py-2.5 rounded-full text-center text-xs tracking-wider uppercase font-semibold"
            style={{
              backgroundColor: "#FFF4F4",
              border: "1px solid #5925254D",
              color: "#592525",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              letterSpacing: "0.1em",
            }}
          >
            Out of Stock
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "1.4rem",
                fontWeight: 400,
                color: "var(--color-earth-900)",
              }}
            >
              ₹{product.price}
            </span>
            <AddToCartButton product={product} />
          </div>
        )}
      </div>
    </article>
  );
}

/* ─── Skeleton card ──────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden border border-[--color-earth-100] animate-pulse"
      style={{ background: "var(--color-parchment)" }}
    >
      <div className="h-48 sm:h-52 xl:h-56" style={{ background: "#e5e5e5" }} />
      <div className="p-5 space-y-3">
        <div className="h-2.5 w-1/3 rounded-full" style={{ background: "#e5e5e5" }} />
        <div className="h-5 w-2/3 rounded-lg" style={{ background: "#e5e5e5" }} />
        <div className="h-3 w-full rounded" style={{ background: "#e5e5e5" }} />
        <div className="h-3 w-4/5 rounded" style={{ background: "#e5e5e5" }} />
        <div className="flex justify-between items-center pt-1">
          <div className="h-6 w-16 rounded" style={{ background: "#e5e5e5" }} />
          <div className="h-8 w-24 rounded-full" style={{ background: "#e5e5e5" }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Section ────────────────────────────────────────────────────────── */
export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        // cache: 'no-store' is enforced via the fetch option so Next.js
        // never serves a stale cached response for live product data.
        const res = await fetch(
          `${API_BASE_URL}/api/products`, // Uses the smart data fetching variable
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error(`Server returned ${res.status}`);

        const data: Product[] = (await res.json()) || [];

        if (!cancelled) setProducts(data);
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Failed to load products"
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true; // prevent stale state updates if component unmounts
    };
  }, []);

  return (
    <section
      id="products"
      className="relative py-20 sm:py-28 xl:py-36 px-5 sm:px-8 xl:px-16 bg-[--color-cream]"
      aria-labelledby="products-heading"
    >
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12 xl:mb-16">
          <div>
            <p
              className="text-xs tracking-[0.25em] uppercase mb-3"
              style={{
                color: "var(--color-green-600)",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
              }}
            >
              Handpicked for You
            </p>
            <h2
              id="products-heading"
              className="leading-tight"
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontWeight: 400,
                fontSize: "clamp(2rem, 3vw + 1rem, 3.5rem)",
                letterSpacing: "-0.03em",
                color: "var(--color-earth-900)",
              }}
            >
              Our Signature{" "}
              <em className="italic" style={{ color: "var(--color-green-600)" }}>
                Collection
              </em>
            </h2>
          </div>
          <a
            href="#products"
            className="flex-shrink-0 inline-flex items-center gap-2 text-sm transition-colors group"
            style={{
              color: "var(--color-text-secondary)",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--color-green-600)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--color-text-secondary)")
            }
          >
            View All
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 xl:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        ) : error ? (
          <div
            className="rounded-2xl border px-6 py-10 text-center"
            style={{
              background: "#FEF4CA",
              borderColor: "#F5B80040",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            }}
          >
            <p className="text-sm" style={{ color: "#9E7200" }}>
              ⚠ {error} — please check back shortly.
            </p>
          </div>
        ) : products.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed px-6 py-12 text-center"
            style={{
              borderColor: "var(--color-earth-200)",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              color: "var(--color-earth-400)",
            }}
          >
            <p className="text-sm">
              Our collection is being curated — check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 xl:gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}