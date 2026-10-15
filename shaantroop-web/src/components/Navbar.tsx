"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import CartDrawer from "@/components/CartDrawer";
import UserSidebar from "@/components/UserSidebar";
import GradualBlur from "@/components/GradualBlur";

const navLinks = [
  { label: "Shop", href: "/#products" },
  { label: "Our Story", href: "/#story" },
  { label: "Courses", href: "/courses" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { user } = useAuth();

  const isHeroPage = pathname === "/";

  useEffect(() => {
    if (!isHeroPage) {
      setScrolled(true);
      return;
    }
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHeroPage]);

  const solid = scrolled || !isHeroPage;

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          Header — liquid glass with brand green tint
      ───────────────────────────────────────────────────────────── */}
      <header
        role="banner"
        className={`fixed top-0 left-0 w-full z-50 backdrop-blur-md transition-all duration-500 ${
          solid
            ? /* scrolled: slightly more visible border + subtle shadow for depth */
              "bg-[#1E5021]/20 border-b border-[#F5B800]/25 shadow-[0_2px_20px_rgba(30,80,33,0.15)]"
            : /* on hero: same glass, no border — blends into the image */
              "bg-[#1E5021]/10 border-b border-white/0"
        }`}
      >
        {/* ── GradualBlur: absolute background layer, behind all content ── */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <GradualBlur
            position="bottom"
            target="parent"
            height="3.5rem"
            strength={1.5}
            divCount={7}
            curve="ease-out"
            zIndex={0}
          />
        </div>

        {/* ── Nav content: strictly above the blur layer ────────────── */}
        <nav
          aria-label="Main navigation"
          className="relative z-10 max-w-[1600px] mx-auto px-5 sm:px-8 xl:px-16 flex items-center justify-between h-16 sm:h-20"
        >

          {/* ── Left: Hamburger + Logo ─────────────────────────────── */}
          <div className="flex items-center gap-3">

            {/* Hamburger → opens user sidebar */}
            <button
              id="user-menu-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open user menu"
              aria-haspopup="dialog"
              className="flex flex-col justify-center items-center gap-[5px] w-9 h-9 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-gold-400] hover:bg-white/10"
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`block h-[2px] rounded-full bg-white transition-all duration-300 ${
                    i === 1 ? "w-4" : "w-[22px]"
                  }`}
                />
              ))}
            </button>

            {/* Brand Logo — logo mark + "Shaant Roop" wordmark */}
            <Link
              href="/"
              aria-label="Shaant Roop — Go to home"
              className="flex items-center gap-3 group"
            >
              {/* Logo image */}
              <div className="relative w-9 h-9 flex-shrink-0">
                <Image
                  src="/logo.jpg"
                  alt="Shaant Roop logo"
                  fill
                  priority
                  className="object-contain rounded-sm"
                />
              </div>

              {/* Wordmark */}
              <span
                className="text-xl sm:text-2xl text-white drop-shadow-sm transition-opacity duration-300 group-hover:opacity-80"
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  textShadow: "0 1px 6px rgba(0,0,0,0.35)",
                }}
              >
                Shaant Roop
              </span>
            </Link>
          </div>

          {/* ── Centre: Desktop nav links ───────────────────────────── */}
          <ul className="hidden md:flex items-center gap-8" role="list">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm uppercase tracking-widest text-white/90 hover:text-[--color-gold-300] transition-colors duration-300"
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    letterSpacing: "0.12em",
                    textShadow: "0 1px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* ── Right: Auth + Cart ──────────────────────────────────── */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* User avatar (logged in) — compact, no name text */}
            {user ? (
              <button
                onClick={() => setSidebarOpen(true)}
                className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 hover:scale-110 hover:ring-2 hover:ring-[--color-gold-400]/50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-gold-400]"
                style={{
                  background: "linear-gradient(135deg, var(--color-gold-400), var(--color-gold-500))",
                  color: "var(--color-green-900)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 700,
                  fontSize: "13px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
                aria-label="Open profile menu"
              >
                {user.email.charAt(0).toUpperCase()}
              </button>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex text-sm font-medium text-white/90 hover:text-[--color-gold-300] transition-colors duration-300"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  textShadow: "0 1px 4px rgba(0,0,0,0.3)",
                }}
              >
                Log In
              </Link>
            )}

            {/* Register pill (desktop, guests only) */}
            {!user && (
              <Link
                href="/register"
                className="hidden sm:inline-flex px-4 py-2 rounded-full text-xs tracking-wider uppercase font-medium border border-[--color-gold-400]/70 text-[--color-gold-300] hover:bg-[--color-gold-400]/15 transition-all duration-300 hover:scale-105 active:scale-100"
                style={{ fontFamily: "var(--font-inter), sans-serif", letterSpacing: "0.1em" }}
              >
                Register
              </Link>
            )}

            {/* Cart button with live badge */}
            <button
              id="cart-btn"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart${totalItems > 0 ? `, ${totalItems} item${totalItems !== 1 ? "s" : ""}` : ""}`}
              className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-gold-400]"
            >
              {/* Shopping bag icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                className="w-[22px] h-[22px] text-white"
                style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.3))" }}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
                />
              </svg>

              {/* Item count badge */}
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold px-1"
                  style={{
                    background: "linear-gradient(135deg, var(--color-gold-400), var(--color-gold-500))",
                    color: "var(--color-green-900)",
                    fontFamily: "var(--font-inter), sans-serif",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                  }}
                  aria-hidden="true"
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* User Sidebar */}
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
