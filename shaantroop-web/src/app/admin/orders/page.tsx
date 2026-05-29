"use client";

import { useState, useEffect, useCallback } from "react";
import AdminDashboardLayout from "@/components/admin/AdminDashboardLayout";

/* ─── Types ──────────────────────────────────────────────────────────── */
type OrderStatus = "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

interface Order {
  id: number;
  contactName: string | null;
  contactEmail: string;
  contactPhone: string | null;
  shippingAddress: string | null;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

/* ─── Constants ──────────────────────────────────────────────────────── */
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8085";

const STATUS_OPTIONS: OrderStatus[] = ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"];

const STATUS_META: Record<
  OrderStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  PENDING: {
    label: "Pending",
    bg: "#FEF4CA",
    text: "#9E7200",
    dot: "#F5B800",
  },
  SHIPPED: {
    label: "Shipped",
    bg: "#CDE0C9",
    text: "#174019",
    dot: "#1E5021",
  },
  DELIVERED: {
    label: "Delivered",
    bg: "#EEF4EC",
    text: "#2D6B2A",
    dot: "#458841",
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "#FFF0F0",
    text: "#991B1B",
    dot: "#EF4444",
  },
};

/* ─── Helpers ────────────────────────────────────────────────────────── */
function authHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("shaantroop_token")
      : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/* ─── Status Badge ───────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{
        background: meta.bg,
        color: meta.text,
        fontFamily: "var(--font-inter), sans-serif",
        letterSpacing: "0.03em",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: meta.dot }}
        aria-hidden="true"
      />
      {meta.label}
    </span>
  );
}

/* ─── Status Dropdown ────────────────────────────────────────────────── */
function StatusDropdown({
  orderId,
  current,
  onUpdate,
}: {
  orderId: number;
  current: OrderStatus;
  onUpdate: (id: number, newStatus: OrderStatus) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as OrderStatus;
    if (next === current) return;
    setBusy(true);
    try {
      await onUpdate(orderId, next);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative">
      <select
        value={current}
        onChange={handleChange}
        disabled={busy}
        aria-label={`Change status for order #${orderId}`}
        className="appearance-none pl-3 pr-7 py-1.5 rounded-lg text-xs font-medium outline-none cursor-pointer transition-all duration-150 disabled:opacity-60 disabled:cursor-wait"
        style={{
          border: "1.5px solid #CDE0C9",
          fontFamily: "var(--font-inter), sans-serif",
          color: "#0F2B10",
          background: "white",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#1E5021";
          e.target.style.boxShadow = "0 0 0 3px rgba(30,80,33,0.1)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#CDE0C9";
          e.target.style.boxShadow = "none";
        }}
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {STATUS_META[s].label}
          </option>
        ))}
      </select>

      {/* Custom chevron */}
      {busy ? (
        <span
          className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-green-300 border-t-green-700 animate-spin"
          aria-hidden="true"
        />
      ) : (
        <svg
          className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none"
          viewBox="0 0 20 20"
          fill="#2D6B2A"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </div>
  );
}

/* ─── Order Row ──────────────────────────────────────────────────────── */
function OrderRow({
  order,
  onStatusUpdate,
}: {
  order: Order;
  onStatusUpdate: (id: number, status: OrderStatus) => Promise<void>;
}) {
  return (
    <tr
      className="border-b transition-colors duration-100 hover:bg-[#F8FAF8]"
      style={{ borderColor: "#EEF4EC" }}
    >
      {/* Order ID */}
      <td
        className="px-4 py-3 text-sm font-mono font-semibold"
        style={{ color: "#1E5021", fontFamily: "monospace" }}
      >
        #{order.id}
      </td>

      {/* Customer email */}
      <td
        className="px-4 py-3 text-sm max-w-[200px] truncate"
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          color: "#0F2B10",
        }}
        title={order.contactEmail}
      >
        {order.contactEmail || (
          <span style={{ color: "#6DA669", fontStyle: "italic" }}>Guest</span>
        )}
        {order.contactName && (
          <span
            className="block text-xs"
            style={{ color: "#6DA669" }}
          >
            {order.contactName}
          </span>
        )}
      </td>

      {/* Date */}
      <td
        className="hidden sm:table-cell px-4 py-3 text-xs whitespace-nowrap"
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          color: "#2D6B2A",
        }}
      >
        {formatDate(order.createdAt)}
      </td>

      {/* Amount */}
      <td
        className="px-4 py-3 text-sm font-semibold text-right whitespace-nowrap"
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          color: "#0F2B10",
        }}
      >
        {formatAmount(order.totalAmount)}
      </td>

      {/* Status badge */}
      <td className="hidden md:table-cell px-4 py-3">
        <StatusBadge status={order.status} />
      </td>

      {/* Status control */}
      <td className="px-4 py-3 text-right">
        <StatusDropdown
          orderId={order.id}
          current={order.status}
          onUpdate={onStatusUpdate}
        />
      </td>
    </tr>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  /* Fetch all orders */
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/admin/orders`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data: Order[] = await res.json();
      setOrders(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /* Show toast for 2.5s */
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  /* Update order status in-place (optimistic) */
  const handleStatusUpdate = useCallback(
    async (id: number, newStatus: OrderStatus) => {
      // Optimistic update
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
      );

      try {
        const res = await fetch(`${API}/api/admin/orders/${id}/status`, {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify({ status: newStatus }),
        });
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        showToast(`Order #${id} → ${STATUS_META[newStatus].label}`);
      } catch (err) {
        // Roll back on failure
        setOrders((prev) =>
          prev.map((o) =>
            o.id === id ? { ...o, status: o.status } : o
          )
        );
        showToast(
          `Failed to update order #${id}: ${err instanceof Error ? err.message : "Unknown error"}`
        );
      }
    },
    []
  );

  /* Summary counts */
  const counts = orders.reduce(
    (acc, o) => {
      acc[o.status] = (acc[o.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<OrderStatus, number>
  );

  return (
    <AdminDashboardLayout title="Orders">
      <div className="space-y-6">

        {/* ── Toast notification ── */}
        {toast && (
          <div
            className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-xl transition-all duration-300"
            style={{
              background: "#0F2B10",
              color: "white",
              fontFamily: "var(--font-inter), sans-serif",
              boxShadow: "0 8px 32px rgba(15,43,16,0.35)",
            }}
            role="status"
            aria-live="polite"
          >
            {toast}
          </div>
        )}

        {/* ── Summary cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STATUS_OPTIONS.map((s) => {
            const meta = STATUS_META[s];
            return (
              <div
                key={s}
                className="rounded-xl p-4 border"
                style={{
                  background: meta.bg,
                  borderColor: meta.dot + "40",
                }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-1"
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    color: meta.text,
                    letterSpacing: "0.1em",
                  }}
                >
                  {meta.label}
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    color: meta.text,
                  }}
                >
                  {loading ? "—" : (counts[s] ?? 0)}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── Orders table ── */}
        <section aria-labelledby="orders-table-heading">
          <h2
            id="orders-table-heading"
            className="text-xs uppercase tracking-widest mb-3 font-semibold"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              color: "#2D6B2A",
              letterSpacing: "0.12em",
            }}
          >
            All Orders
            {!loading && (
              <span
                className="ml-2 normal-case font-normal text-[11px]"
                style={{ color: "#6DA669" }}
              >
                ({orders.length} total)
              </span>
            )}
          </h2>

          {loading ? (
            /* Skeleton */
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className="h-14 rounded-xl animate-pulse"
                  style={{ background: "#EEF4EC" }}
                />
              ))}
            </div>
          ) : error ? (
            <div
              className="rounded-xl px-5 py-4 text-sm"
              style={{
                background: "#FEF4CA",
                color: "#9E7200",
                fontFamily: "var(--font-inter), sans-serif",
              }}
              role="alert"
            >
              ⚠ {error}
              <button
                onClick={fetchOrders}
                className="ml-3 underline text-xs"
                style={{ color: "#9E7200" }}
              >
                Retry
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div
              className="rounded-2xl border border-dashed px-6 py-12 text-center"
              style={{
                borderColor: "#CDE0C9",
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              <p className="text-sm" style={{ color: "#6DA669" }}>
                No orders yet. They&apos;ll appear here once customers place them.
              </p>
            </div>
          ) : (
            <div
              className="rounded-2xl border overflow-hidden"
              style={{ borderColor: "#CDE0C9" }}
            >
              <div className="overflow-x-auto">
                <table className="w-full" style={{ background: "white" }}>
                  <thead>
                    <tr style={{ borderBottom: "1.5px solid #CDE0C9" }}>
                      {[
                        { label: "Order ID", align: "left" },
                        { label: "Customer", align: "left" },
                        { label: "Date", align: "left", hidden: "sm" },
                        { label: "Amount", align: "right" },
                        { label: "Status", align: "left", hidden: "md" },
                        { label: "Update", align: "right" },
                      ].map((col) => (
                        <th
                          key={col.label}
                          scope="col"
                          className={[
                            "px-4 py-3 text-left text-[10px] uppercase tracking-widest font-semibold",
                            col.hidden === "sm" ? "hidden sm:table-cell" : "",
                            col.hidden === "md" ? "hidden md:table-cell" : "",
                            col.align === "right" ? "text-right" : "",
                          ].join(" ")}
                          style={{
                            fontFamily: "var(--font-inter), sans-serif",
                            color: "#2D6B2A",
                            letterSpacing: "0.1em",
                            background: "#EEF4EC",
                          }}
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <OrderRow
                        key={order.id}
                        order={order}
                        onStatusUpdate={handleStatusUpdate}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

      </div>
    </AdminDashboardLayout>
  );
}
