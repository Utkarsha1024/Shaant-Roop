"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/apiFetch";
import { assetUrl } from "@/lib/assetUrl";
import type { OrderDTO } from "@/lib/types";

// ─── Status badge config ──────────────────────────────────────────────────────

type OrderStatus = "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  PENDING: { label: "Pending", bg: "#FEF9E7", text: "#92640A", dot: "#F4C130" },
  SHIPPED: { label: "Shipped", bg: "#EFF6FF", text: "#1D4ED8", dot: "#3B82F6" },
  DELIVERED: { label: "Delivered", bg: "#EEF4EC", text: "#234A31", dot: "#3A7D44" },
  CANCELLED: { label: "Cancelled", bg: "#FEF2F2", text: "#B91C1C", dot: "#EF4444" },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: cfg.bg, color: cfg.text }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: cfg.dot }}
        aria-hidden="true"
      />
      {cfg.label}
    </span>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  // 1. Force JavaScript to recognize the backend timestamp as UTC
  const utcString = iso.endsWith('Z') ? iso : `${iso}Z`;
  const date = new Date(utcString);

  // 2. Format the output explicitly to Indian Standard Time (IST)
  const formattedDate = date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short", // Adds 'IST'
  });

  // 3. Find 'am' or 'pm' and convert exactly that part to uppercase
  return formattedDate.replace(/\b(am|pm)\b/i, (match) => match.toUpperCase());
}

function formatINR(amount: number) {
  return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MyOrdersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?redirect=/orders");
    }
  }, [user, authLoading, router]);

  // Fetch orders once authenticated
  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        // 1. Manually grab the exact token key
        const token = localStorage.getItem('shaantroop_token');

        // 2. Fire the request with the token attached to the headers
        const apiBase = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8085";
        const res = await fetch(`${apiBase}/api/orders/my-orders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });

        if (!res.ok) {
          throw new Error('Failed to load your orders.');
        }

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load your orders.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // ── Full-page loading ───────────────────────────────────────────────────────
  if (authLoading || (isLoading && !error)) {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--color-cream)" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
            style={{
              borderTopColor: "var(--color-forest-600)",
              borderRightColor: "var(--color-gold-400)",
            }}
          />
          <p
            className="text-sm"
            style={{
              color: "var(--color-earth-500)",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            Loading your orders…
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen py-28 px-5 sm:px-8"
      style={{ background: "var(--color-cream)" }}
    >
      <div className="max-w-2xl mx-auto">

        {/* ── Page header ─────────────────────────────────────────────── */}
        <div className="mb-10">
          <p
            className="text-xs tracking-[0.25em] uppercase mb-2"
            style={{
              color: "var(--color-gold-500)",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            Account
          </p>
          <div className="flex items-end justify-between gap-4">
            <h1
              className="leading-tight"
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontWeight: 400,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: "var(--color-forest-800)",
                letterSpacing: "-0.02em",
              }}
            >
              My Orders
            </h1>
            {orders.length > 0 && (
              <span
                className="flex-shrink-0 mb-1.5 text-sm"
                style={{
                  color: "var(--color-earth-500)",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                {orders.length} order{orders.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div
            className="mt-3 h-px w-16"
            style={{
              background:
                "linear-gradient(to right, var(--color-gold-400), transparent)",
            }}
            aria-hidden="true"
          />
        </div>

        {/* ── Error ───────────────────────────────────────────────────── */}
        {error && (
          <div
            className="rounded-2xl px-5 py-4 flex items-start gap-3 mb-6"
            style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}
            role="alert"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="w-5 h-5 flex-shrink-0 mt-0.5"
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
              className="text-sm"
              style={{
                color: "#B91C1C",
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              {error}
            </p>
          </div>
        )}

        {/* ── Empty state ─────────────────────────────────────────────── */}
        {!error && orders.length === 0 && (
          <div
            className="rounded-2xl border flex flex-col items-center text-center py-16 px-8 gap-5"
            style={{
              background: "white",
              borderColor: "var(--color-earth-200)",
              boxShadow: "0 4px 24px rgba(15,28,13,0.06)",
            }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: "var(--color-earth-100)" }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.2}
                className="w-10 h-10"
                style={{ color: "var(--color-earth-400)" }}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
                />
              </svg>
            </div>
            <div>
              <h2
                className="text-2xl mb-2"
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  fontWeight: 400,
                  color: "var(--color-forest-800)",
                }}
              >
                No orders yet
              </h2>
              <p
                className="text-sm max-w-xs mx-auto"
                style={{
                  color: "var(--color-earth-500)",
                  fontFamily: "var(--font-inter), sans-serif",
                  lineHeight: "1.7",
                }}
              >
                You haven&apos;t placed any orders yet. Start exploring our
                handcrafted soaps!
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 hover:shadow-md"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-forest-600), var(--color-forest-700))",
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Shop Now
            </Link>
          </div>
        )}

        {/* ── Order list ──────────────────────────────────────────────── */}
        {orders.length > 0 && (
          <div className="space-y-3">
            {orders.map((order) => {
              const isOpen = expanded === order.id;

              return (
                <div
                  key={order.id}
                  className="rounded-2xl border overflow-hidden transition-all duration-200"
                  style={{
                    background: "white",
                    borderColor: isOpen
                      ? "var(--color-forest-300)"
                      : "var(--color-earth-200)",
                    boxShadow: isOpen
                      ? "0 0 0 3px rgba(35,74,49,0.07), 0 4px 16px rgba(15,28,13,0.08)"
                      : "0 2px 8px rgba(15,28,13,0.04)",
                  }}
                >
                  {/* ── Card header (always visible) ───────────────────── */}
                  <button
                    type="button"
                    id={`order-${order.id}-toggle`}
                    aria-expanded={isOpen}
                    aria-controls={`order-${order.id}-details`}
                    className="w-full text-left px-5 py-4 flex items-center gap-4 transition-colors"
                    style={{
                      background: isOpen
                        ? "rgba(35,74,49,0.025)"
                        : "transparent",
                    }}
                    onClick={() => setExpanded(isOpen ? null : order.id)}
                  >
                    {/* Left: order ID + date */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[11px] mb-0.5 font-mono tracking-wider"
                        style={{
                          color: "var(--color-earth-400)",
                          fontFamily: "monospace",
                        }}
                      >
                        ORDER #{String(order.id).padStart(4, "0")}
                      </p>
                      <p
                        className="text-sm font-medium"
                        style={{
                          color: "var(--color-earth-800)",
                          fontFamily: "var(--font-inter), sans-serif",
                        }}
                      >
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    {/* Centre: item count (hidden on mobile) */}
                    <p
                      className="text-xs hidden sm:block flex-shrink-0"
                      style={{
                        color: "var(--color-earth-400)",
                        fontFamily: "var(--font-inter), sans-serif",
                      }}
                    >
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </p>

                    {/* Right: total + badge */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <p
                        className="text-sm font-semibold"
                        style={{
                          color: "var(--color-forest-700)",
                          fontFamily: "var(--font-inter), sans-serif",
                        }}
                      >
                        {formatINR(order.totalAmount)}
                      </p>
                      <div className="hidden sm:block">
                        <StatusBadge status={order.status} />
                      </div>
                    </div>

                    {/* Chevron */}
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
                      style={{
                        color: "var(--color-earth-400)",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 7.5l5 5 5-5"
                      />
                    </svg>
                  </button>

                  {/* Mobile-only status badge row */}
                  <div
                    className="sm:hidden px-5 pb-3 flex items-center justify-between"
                    aria-hidden="true"
                  >
                    <StatusBadge status={order.status} />
                    <p
                      className="text-xs"
                      style={{
                        color: "var(--color-earth-400)",
                        fontFamily: "var(--font-inter), sans-serif",
                      }}
                    >
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* ── Expanded detail panel ────────────────────────────── */}
                  {isOpen && (
                    <div
                      id={`order-${order.id}-details`}
                      className="px-5 pb-6"
                      style={{
                        borderTop: "1px solid var(--color-earth-100)",
                      }}
                    >
                      {/* Items */}
                      <ul className="mt-4 space-y-0">
                        {order.items.map((item, idx) => (
                          <li
                            key={item.id}
                            className="flex items-center gap-3 py-3"
                            style={{
                              borderTop:
                                idx > 0
                                  ? "1px solid var(--color-earth-100)"
                                  : "none",
                            }}
                          >
                            {/* Thumbnail */}
                            <div
                              className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center"
                              style={{ background: "var(--color-earth-100)" }}
                              aria-hidden="true"
                            >
                              {item.productImageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={assetUrl(item.productImageUrl)}
                                  alt={item.productName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span
                                  className="text-[8px] font-medium"
                                  style={{ color: "var(--color-earth-400)" }}
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
                                {item.productName}
                              </p>
                              <p
                                className="text-xs mt-0.5"
                                style={{
                                  color: "var(--color-earth-400)",
                                  fontFamily: "var(--font-inter), sans-serif",
                                }}
                              >
                                Qty {item.quantity} ×{" "}
                                {formatINR(item.unitPrice)}
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
                              {formatINR(item.unitPrice * item.quantity)}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Cost breakdown */}
                      <div
                        className="mt-4 pt-4 space-y-2"
                        style={{
                          borderTop: "1px solid var(--color-earth-100)",
                        }}
                      >
                        {[
                          { label: "Subtotal", value: order.subTotal },
                          { label: "Shipping", value: order.shippingCost },
                        ].map(({ label, value }) => (
                          <div
                            key={label}
                            className="flex justify-between text-sm"
                          >
                            <span
                              style={{
                                color: "var(--color-earth-500)",
                                fontFamily: "var(--font-inter), sans-serif",
                              }}
                            >
                              {label}
                            </span>
                            <span
                              style={{
                                color: "var(--color-earth-700)",
                                fontFamily: "var(--font-inter), sans-serif",
                              }}
                            >
                              {value === 0 ? (
                                <span
                                  style={{
                                    color: "#3A7D44",
                                    fontWeight: 600,
                                  }}
                                >
                                  Free 🎉
                                </span>
                              ) : (
                                formatINR(value)
                              )}
                            </span>
                          </div>
                        ))}
                        <div
                          className="flex justify-between text-sm font-semibold pt-2"
                          style={{
                            borderTop: "1px solid var(--color-earth-100)",
                          }}
                        >
                          <span
                            style={{
                              color: "var(--color-forest-800)",
                              fontFamily: "var(--font-inter), sans-serif",
                            }}
                          >
                            Total
                          </span>
                          <span
                            style={{
                              color: "var(--color-forest-700)",
                              fontFamily: "var(--font-inter), sans-serif",
                            }}
                          >
                            {formatINR(order.totalAmount)}
                          </span>
                        </div>
                      </div>

                      {/* Delivery details */}
                      <div
                        className="mt-5 pt-4 grid sm:grid-cols-2 gap-4"
                        style={{
                          borderTop: "1px solid var(--color-earth-100)",
                        }}
                      >
                        <div>
                          <p
                            className="text-[10px] font-semibold uppercase tracking-widest mb-1"
                            style={{
                              color: "var(--color-gold-600)",
                              fontFamily: "var(--font-inter), sans-serif",
                            }}
                          >
                            Delivered to
                          </p>
                          <p
                            className="text-sm"
                            style={{
                              color: "var(--color-earth-600)",
                              fontFamily: "var(--font-inter), sans-serif",
                              lineHeight: "1.6",
                            }}
                          >
                            {order.contactName}
                            <br />
                            {order.shippingAddress}
                          </p>
                        </div>
                        <div>
                          <p
                            className="text-[10px] font-semibold uppercase tracking-widest mb-1"
                            style={{
                              color: "var(--color-gold-600)",
                              fontFamily: "var(--font-inter), sans-serif",
                            }}
                          >
                            Contact
                          </p>
                          <p
                            className="text-sm"
                            style={{
                              color: "var(--color-earth-600)",
                              fontFamily: "var(--font-inter), sans-serif",
                              lineHeight: "1.6",
                            }}
                          >
                            {order.contactEmail}
                            <br />
                            {order.contactPhone}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Footer nav ──────────────────────────────────────────────── */}
        <div className="mt-8 flex items-center justify-between">
          <Link
            href="/profile"
            className="text-sm transition-colors hover:text-[--color-forest-600]"
            style={{
              color: "var(--color-earth-500)",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            ← My Profile
          </Link>
          <Link
            href="/"
            className="text-sm transition-colors hover:text-[--color-gold-500]"
            style={{
              color: "var(--color-earth-500)",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            Back to Shop →
          </Link>
        </div>
      </div>
    </main>
  );
}
