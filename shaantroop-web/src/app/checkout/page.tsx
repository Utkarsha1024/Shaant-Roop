"use client";

import Link from "next/link";
import { useState, useEffect, type FormEvent } from "react";
import { useCart, type CartItem } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/apiFetch";
import { assetUrl } from "@/lib/assetUrl";

// ─── Types ───────────────────────────────────────────────────────────────────
type CheckoutMode = "choose" | "guest";

interface GuestFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

const EMPTY_GUEST: GuestFormData = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
};

// ─── Shared field component ───────────────────────────────────────────────────
function Field({
  id,
  label,
  type = "text",
  placeholder,
  autoComplete,
  value,
  onChange,
  required = true,
  readOnly = false,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  autoComplete?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-medium mb-1.5 tracking-wide uppercase"
        style={{ color: "var(--color-earth-600)", fontFamily: "var(--font-inter), sans-serif" }}
      >
        {label}
        {readOnly && (
          <span
            className="ml-2 normal-case font-normal tracking-normal"
            style={{ color: "var(--color-earth-400)", fontSize: "0.65rem" }}
          >
            (from your account)
          </span>
        )}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        value={value}
        readOnly={readOnly}
        onChange={readOnly ? undefined : (e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 placeholder:opacity-40"
        style={{
          borderColor: readOnly ? "var(--color-earth-100)" : "var(--color-earth-200)",
          color: readOnly ? "var(--color-earth-500)" : "var(--color-earth-900)",
          fontFamily: "var(--font-inter), sans-serif",
          background: readOnly ? "var(--color-earth-100)" : "var(--color-earth-50)",
          cursor: readOnly ? "default" : "text",
        }}
        onFocus={readOnly ? undefined : (e) => (e.target.style.borderColor = "var(--color-earth-400)")}
        onBlur={readOnly ? undefined : (e) => (e.target.style.borderColor = "var(--color-earth-200)")}
      />
    </div>
  );
}

// ─── Shipping logic ───────────────────────────────────────────────────────────
// Tiered rates keyed by total soap quantity.
const SHIPPING_TIERS: { min: number; cost: number }[] = [
  { min: 4, cost: 0 },
  { min: 3, cost: 20 },
  { min: 2, cost: 30 },
  { min: 1, cost: 45 },
];

function calcShipping(totalQty: number): number {
  if (totalQty === 0) return 0;
  const tier = SHIPPING_TIERS.find((t) => totalQty >= t.min);
  return tier?.cost ?? 45;
}

// Returns the promo banner text based on current qty.
function shippingPromo(totalQty: number): string | null {
  if (totalQty === 0) return null;
  if (totalQty >= 4) return "You unlocked Free Shipping! Shaant Roop chips in the rest :)";
  const soapsNeeded = 4 - totalQty;
  return `Add ${soapsNeeded} more soap${soapsNeeded > 1 ? "s" : ""} for cheaper shipping!`;
}

// ─── Colour palette for product image placeholders ───────────────────────────
const PALETTE = ["#9b8ea0", "#c49a3a", "#7a9b7a", "#d4a227"];
function swatchColor(id: number) { return PALETTE[id % PALETTE.length]; }

// ─── Order Summary sidebar ────────────────────────────────────────────────────
function OrderSummary() {
  const { items, totalItems, totalPrice } = useCart();
  const shipping = calcShipping(totalItems);
  const total = totalPrice + shipping;
  const promo = shippingPromo(totalItems);
  const isFree = totalItems >= 4;

  return (
    <aside
      className="rounded-2xl border overflow-hidden"
      style={{ background: "white", borderColor: "var(--color-earth-200)" }}
      aria-label="Order summary"
    >
      {/* Header */}
      <div
        className="px-6 py-4 border-b"
        style={{
          background: "var(--color-earth-50)",
          borderColor: "var(--color-earth-100)",
        }}
      >
        <h2
          className="text-xl"
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            color: "var(--color-earth-900)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
          }}
        >
          Order Summary
        </h2>
      </div>

      <div className="px-6 pt-5 pb-6 space-y-5">

        {/* ── Item list ── */}
        {items.length === 0 ? (
          <p
            className="text-sm text-center py-4"
            style={{ color: "var(--color-earth-400)", fontFamily: "var(--font-inter), sans-serif" }}
          >
            Your cart is empty.
          </p>
        ) : (
          <ul className="space-y-3" aria-label="Cart items">
            {items.map((item: CartItem) => {
              const color = swatchColor(item.product.id);
              return (
                <li
                  key={item.product.id}
                  className="flex items-center gap-3"
                >
                  {/* Product thumbnail */}
                  <div
                    className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
                    style={{
                      background: item.product.imageUrl
                        ? undefined
                        : `linear-gradient(135deg, ${color}33, ${color}88)`,
                    }}
                    aria-hidden="true"
                  >
                    {item.product.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={assetUrl(item.product.imageUrl)}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span
                        className="text-[8px] font-medium rotate-[-8deg] opacity-60"
                        style={{ color }}
                      >
                        soap
                      </span>
                    )}
                  </div>

                  {/* Name + qty */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{
                        color: "var(--color-earth-800)",
                        fontFamily: "var(--font-inter), sans-serif",
                      }}
                    >
                      {item.product.name}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{
                        color: "var(--color-earth-400)",
                        fontFamily: "var(--font-inter), sans-serif",
                      }}
                    >
                      Qty&nbsp;{item.quantity} &times; ₹{item.product.price.toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Line total */}
                  <span
                    className="text-sm font-semibold flex-shrink-0"
                    style={{
                      color: "var(--color-earth-700)",
                      fontFamily: "var(--font-inter), sans-serif",
                    }}
                  >
                    ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        {/* ── Divider ── */}
        <div className="h-px" style={{ background: "var(--color-earth-100)" }} />

        {/* ── Promo banner ── */}
        {promo && (
          <div
            className="rounded-xl px-4 py-3 flex items-start gap-2.5"
            style={{
              background: isFree ? "#EEF4EC" : "#FEF8E7",
              border: `1px solid ${isFree ? "#CDE0C9" : "#F5D87A"}`,
            }}
            role="status"
            aria-live="polite"
          >
            {/* Icon */}
            <span
              className="text-base flex-shrink-0 mt-px"
              aria-hidden="true"
            >
              {isFree ? "🎉" : "🚚"}
            </span>
            <p
              className="text-xs leading-snug font-medium"
              style={{
                color: isFree ? "var(--color-green-700)" : "#92640A",
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              {promo}
            </p>
          </div>
        )}

        {/* ── Cost breakdown ── */}
        <div className="space-y-2">
          {/* Subtotal */}
          <div
            className="flex justify-between text-sm"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              color: "var(--color-earth-500)",
            }}
          >
            <span>Subtotal</span>
            <span>₹{totalPrice.toLocaleString("en-IN")}</span>
          </div>

          {/* Shipping */}
          <div
            className="flex justify-between text-sm"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              color: isFree ? "var(--color-green-600)" : "var(--color-earth-500)",
            }}
          >
            <span>Shipping</span>
            <span className="font-medium">
              {isFree ? (
                <>
                  <s className="opacity-40 mr-1 font-normal">₹45</s>
                  Free
                </>
              ) : (
                `₹${shipping}`
              )}
            </span>
          </div>

          {/* Total */}
          <div
            className="flex justify-between text-base font-semibold pt-3 border-t"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              color: "var(--color-earth-900)",
              borderColor: "var(--color-earth-200)",
            }}
          >
            <span>Total</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* ── Shipping tier hint ── */}
        {!isFree && totalItems > 0 && (
          <div className="space-y-1.5">
            <p
              className="text-[10px] uppercase tracking-wider font-semibold"
              style={{
                color: "var(--color-earth-400)",
                fontFamily: "var(--font-inter), sans-serif",
                letterSpacing: "0.1em",
              }}
            >
              Shipping tiers
            </p>
            <div className="grid grid-cols-4 gap-1">
              {SHIPPING_TIERS.slice().reverse().map((tier) => {
                const isActive = calcShipping(totalItems) === tier.cost;
                return (
                  <div
                    key={tier.min}
                    className="rounded-lg px-1 py-1.5 text-center"
                    style={{
                      background: isActive ? "#EEF4EC" : "var(--color-earth-50)",
                      border: `1px solid ${isActive ? "#9EC49A" : "var(--color-earth-100)"}`,
                    }}
                  >
                    <p
                      className="text-[9px] font-semibold"
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        color: isActive ? "var(--color-green-700)" : "var(--color-earth-400)",
                      }}
                    >
                      {tier.min === 4 ? "4+" : `×${tier.min}`}
                    </p>
                    <p
                      className="text-[10px] font-bold mt-0.5"
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        color: isActive ? "var(--color-green-700)" : "var(--color-earth-300)",
                      }}
                    >
                      {tier.cost === 0 ? "Free" : `₹${tier.cost}`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Reassurance strip ── */}
        <div
          className="rounded-xl p-3 flex items-center gap-2.5"
          style={{
            background: "var(--color-earth-50)",
            border: "1px solid var(--color-earth-100)",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="w-5 h-5 flex-shrink-0"
            style={{ color: "var(--color-sage-500)" }}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          <p
            className="text-xs leading-relaxed"
            style={{ color: "var(--color-earth-500)", fontFamily: "var(--font-inter), sans-serif" }}
          >
            Secure checkout. Your data is never shared.
          </p>
        </div>
      </div>
    </aside>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const [mode, setMode] = useState<CheckoutMode>("choose");
  const [form, setForm] = useState<GuestFormData>(EMPTY_GUEST);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // When the user is already logged in: skip the choose screen and pre-fill their email.
  useEffect(() => {
    if (user) {
      setMode("guest"); // re-uses the same form; the UI adapts based on `user` presence
      setForm((prev) => ({ ...prev, email: user.email }));
    }
  }, [user]);

  function setField(key: keyof GuestFormData) {
    return (value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleGuestSubmit(e: FormEvent) {
    // STEP 1 — prevent browser from reloading the page
    e.preventDefault();
    console.log('[Checkout] Submission started');

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      // STEP 2 — validate the cart is not empty
      console.log('[Checkout] Cart items:', items);
      if (!items || items.length === 0) {
        throw new Error('Your cart is empty. Please add items before checking out.');
      }

      // STEP 3 — build the payload (only productId + quantity — no prices from client)
      const payload = {
        contactName: form.name,
        contactEmail: form.email,
        contactPhone: form.phone,
        shippingAddress: `${form.address}, ${form.city}, ${form.state}, ${form.country} - ${form.pincode}`,
        items: items.map((cartItem) => ({
          productId: cartItem.product.id,
          quantity: cartItem.quantity,
        })),
      };
      console.log('[Checkout] Payload built:', payload);

      // STEP 4 — Manual token injection fetch
      console.log('[Checkout] Posting to: /api/orders');

      const token = localStorage.getItem('shaantroop_token');

      const apiBase = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8085";
      const res = await fetch(`${apiBase}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server rejected order (Status ${res.status}): ${errorText}`);
      }

      const order = await res.json();
      console.log('[Checkout] Order created successfully:', order);

      // STEP 5 — success: clear the cart and show the confirmation screen
      clearCart();
      setSubmitted(true);
      return; // skip the old res.ok / res.json() block below
    } catch (err) {
      // Catch ALL errors — network failures, validation, server errors, JS crashes
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[Checkout] handleGuestSubmit failed:', msg, err);
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--color-cream)" }}>
        <div className="text-center max-w-sm">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "var(--color-earth-100)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8" style={{ color: "var(--color-earth-600)" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl mb-3" style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "var(--color-earth-900)", fontWeight: 400 }}>
            Order placed!
          </h1>
          <p className="text-sm mb-2" style={{ color: "var(--color-earth-500)", fontFamily: "var(--font-inter), sans-serif" }}>
            Thank you, {form.name}. A confirmation has been sent to{" "}
            <strong style={{ color: "var(--color-earth-700)" }}>{form.email}</strong>.
          </p>
          <p className="text-sm mb-8" style={{ color: "var(--color-earth-400)", fontFamily: "var(--font-inter), sans-serif" }}>
            Your handcrafted soaps are on their way 🌿
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 rounded-xl text-sm font-medium text-white transition-all duration-200"
            style={{ background: "linear-gradient(135deg, var(--color-earth-500), var(--color-earth-600))", fontFamily: "var(--font-inter), sans-serif" }}
          >
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ background: "var(--color-cream)" }}>
      {/* Top stripe */}
      <div
        className="h-1 w-full flex-shrink-0"
        style={{ background: "linear-gradient(90deg, var(--color-green-500), var(--color-gold-400), var(--color-green-600))" }}
      />

      {/* Header */}
      <header className="px-6 py-5 border-b" style={{ borderColor: "var(--color-earth-200)", background: "white" }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="no-underline hover:opacity-80 transition-opacity" aria-label="Back to home">
            <span
              className="text-lg"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "var(--color-earth-900)", fontWeight: 400, letterSpacing: "-0.02em" }}
            >
              Shaant Roop
            </span>
          </Link>

          {/* Breadcrumb */}
          <nav aria-label="Checkout steps" className="hidden sm:flex items-center gap-2 text-xs" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            {["Cart", "Details", "Payment"].map((step, i) => (
              <span key={step} className="flex items-center gap-2">
                <span
                  style={{
                    color: i === 1 ? "var(--color-earth-700)" : "var(--color-earth-300)",
                    fontWeight: i === 1 ? 600 : 400,
                  }}
                >
                  {step}
                </span>
                {i < 2 && <span style={{ color: "var(--color-earth-300)" }}>›</span>}
              </span>
            ))}
          </nav>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 px-4 sm:px-6 py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
          {/* ── LEFT PANEL ─────────────────────────────────────────────────── */}
          <section aria-label="Checkout options" className="space-y-6">
            <h1
              className="text-3xl"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "var(--color-earth-900)", fontWeight: 400, letterSpacing: "-0.02em" }}
            >
              Checkout
            </h1>

            {/* ── CHOOSE MODE ────────────────────────────────────────────────── */}
            {mode === "choose" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Login option */}
                <div
                  className="rounded-2xl p-6 border flex flex-col gap-4 transition-shadow duration-200 hover:shadow-md"
                  style={{ background: "white", borderColor: "var(--color-earth-200)" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "var(--color-earth-100)" }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5" style={{ color: "var(--color-earth-600)" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2
                      className="text-lg mb-1.5"
                      style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "var(--color-earth-900)", fontWeight: 400 }}
                    >
                      Log in for faster checkout
                    </h2>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--color-earth-400)", fontFamily: "var(--font-inter), sans-serif" }}>
                      Your address and preferences are saved. One click and you&apos;re done.
                    </p>
                  </div>
                  <Link
                    id="checkout-login-btn"
                    href="/login?next=/checkout"
                    className="w-full py-3 rounded-xl text-sm font-medium text-center transition-all duration-200 block"
                    style={{
                      background: "linear-gradient(135deg, var(--color-earth-500), var(--color-earth-600))",
                      color: "white",
                      fontFamily: "var(--font-inter), sans-serif",
                      boxShadow: "0 2px 8px rgba(166,112,67,0.25)",
                      textDecoration: "none",
                    }}
                  >
                    Sign in
                  </Link>
                  <p className="text-center text-xs" style={{ color: "var(--color-earth-400)", fontFamily: "var(--font-inter), sans-serif" }}>
                    New here?{" "}
                    <Link href="/register?next=/checkout" className="underline" style={{ color: "var(--color-earth-600)" }}>
                      Create an account
                    </Link>
                  </p>
                </div>

                {/* Guest option */}
                <div
                  className="rounded-2xl p-6 border flex flex-col gap-4 transition-shadow duration-200 hover:shadow-md"
                  style={{ background: "white", borderColor: "var(--color-earth-200)" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "var(--color-parchment)" }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5" style={{ color: "var(--color-earth-500)" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2
                      className="text-lg mb-1.5"
                      style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "var(--color-earth-900)", fontWeight: 400 }}
                    >
                      Continue as Guest
                    </h2>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--color-earth-400)", fontFamily: "var(--font-inter), sans-serif" }}>
                      No account needed. Just enter your details and we&apos;ll ship your order.
                    </p>
                  </div>
                  <button
                    id="checkout-guest-btn"
                    type="button"
                    onClick={() => setMode("guest")}
                    className="w-full py-3 rounded-xl text-sm font-medium transition-all duration-200 border"
                    style={{
                      borderColor: "var(--color-earth-300)",
                      color: "var(--color-earth-700)",
                      background: "transparent",
                      fontFamily: "var(--font-inter), sans-serif",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "var(--color-earth-50)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    }}
                  >
                    Continue as Guest
                  </button>
                  <p className="text-center text-xs" style={{ color: "var(--color-earth-300)", fontFamily: "var(--font-inter), sans-serif" }}>
                    Order tracking via email
                  </p>
                </div>
              </div>
            )}

            {/* ── GUEST FORM ──────────────────────────────────────────────────── */}
            {/* When the user is logged in we show a subtle identity banner instead of the choose screen */}
            {mode === "guest" && user && (
              <div
                className="rounded-xl px-4 py-3 flex items-center gap-3"
                style={{
                  background: "#EEF4EC",
                  border: "1px solid #CDE0C9",
                }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-semibold"
                  style={{
                    background: "linear-gradient(135deg, var(--color-forest-600), var(--color-forest-400))",
                    fontFamily: "var(--font-inter), sans-serif",
                  }}
                  aria-hidden="true"
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <p className="text-xs" style={{ color: "#234A31", fontFamily: "var(--font-inter), sans-serif" }}>
                  Checking out as <strong>{user.email}</strong>. This order will be saved to your account.
                </p>
              </div>
            )}
            {mode === "guest" && (
              <div className="rounded-2xl border overflow-hidden" style={{ background: "white", borderColor: "var(--color-earth-200)" }}>
                {!user && (
                  <div
                    className="px-6 py-4 border-b flex items-center gap-3"
                    style={{ borderColor: "var(--color-earth-100)", background: "var(--color-earth-50)" }}
                  >
                    <button
                      type="button"
                      onClick={() => setMode("choose")}
                      className="flex items-center gap-1.5 text-xs hover:opacity-70 transition-opacity"
                      style={{ color: "var(--color-earth-500)", fontFamily: "var(--font-inter), sans-serif" }}
                      aria-label="Back to checkout options"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                      Back
                    </button>
                    <span className="text-xs" style={{ color: "var(--color-earth-300)", fontFamily: "var(--font-inter), sans-serif" }}>|</span>
                    <span className="text-xs font-medium" style={{ color: "var(--color-earth-600)", fontFamily: "var(--font-inter), sans-serif" }}>
                      Guest Checkout
                    </span>
                  </div>
                )}

                <form onSubmit={handleGuestSubmit} noValidate className="p-6 space-y-5">
                  {/* Contact details */}
                  <div>
                    <h2
                      className="text-lg mb-4"
                      style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "var(--color-earth-900)", fontWeight: 400 }}
                    >
                      Contact Details
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field id="guest-name" label="Full name" placeholder="Priya Sharma" autoComplete="name" value={form.name} onChange={setField("name")} />
                      <Field id="guest-email" label="Email address" type="email" placeholder="priya@example.com" autoComplete="email" value={form.email} onChange={setField("email")} readOnly={!!user} />
                      <Field id="guest-phone" label="Phone number" type="tel" placeholder="+91 98765 43210" autoComplete="tel" value={form.phone} onChange={setField("phone")} />
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px" style={{ background: "var(--color-earth-100)" }} />

                  {/* Shipping address */}
                  <div>
                    <h2
                      className="text-lg mb-4"
                      style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "var(--color-earth-900)", fontWeight: 400 }}
                    >
                      Shipping Address
                    </h2>
                    <div className="space-y-4">
                      <Field
                        id="guest-address"
                        label="Street address"
                        placeholder="14, Rose Garden Apartments, MG Road"
                        autoComplete="street-address"
                        value={form.address}
                        onChange={setField("address")}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Field id="guest-city" label="City" placeholder="Bengaluru" autoComplete="address-level2" value={form.city} onChange={setField("city")} />
                        </div>
                        <div>
                          <Field id="guest-state" label="State" placeholder="Karnataka" autoComplete="address-level1" value={form.state} onChange={setField("state")} />
                        </div>
                        <div>
                          <Field id="guest-country" label="Country" placeholder="India" autoComplete="country-name" value={form.country} onChange={setField("country")} />
                        </div>
                        <div>
                          <Field id="guest-pincode" label="Pincode" placeholder="560001" autoComplete="postal-code" value={form.pincode} onChange={setField("pincode")} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Error banner */}
                  {submitError && (
                    <div
                      role="alert"
                      className="rounded-xl px-4 py-3 flex items-start gap-2.5"
                      style={{
                        background: "#FEF2F2",
                        border: "1px solid #FECACA",
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        className="w-4 h-4 flex-shrink-0 mt-px"
                        style={{ color: "#DC2626" }}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                      </svg>
                      <p
                        className="text-xs leading-snug"
                        style={{
                          color: "#B91C1C",
                          fontFamily: "var(--font-inter), sans-serif",
                        }}
                      >
                        {submitError}
                      </p>
                    </div>
                  )}

                  {/* Submit */}
                  <button

                    id="guest-checkout-submit"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, var(--color-earth-500), var(--color-earth-600))",
                      color: "white",
                      fontFamily: "var(--font-inter), sans-serif",
                      boxShadow: "0 2px 10px rgba(166,112,67,0.3)",
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Placing order…
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                        Place Order Securely
                      </>
                    )}
                  </button>

                  {!user && (
                    <p className="text-center text-xs" style={{ color: "var(--color-earth-400)", fontFamily: "var(--font-inter), sans-serif" }}>
                      Want to save your details for next time?{" "}
                      <Link href="/register?next=/checkout" className="underline" style={{ color: "var(--color-earth-600)" }}>
                        Create a free account
                      </Link>
                    </p>
                  )}
                </form>
              </div>
            )}
          </section>

          {/* ── RIGHT PANEL (Order summary) ─────────────────────────────────── */}
          <OrderSummary />
        </div>
      </div>
    </main>
  );
}
