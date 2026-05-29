"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, totalItems, totalPrice, increment, decrement, removeFromCart } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: "rgba(58,32,18,0.45)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed top-0 right-0 h-full w-full max-w-sm z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ background: "var(--color-cream)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "var(--color-earth-200)" }}
        >
          <div>
            <h2
              className="text-xl leading-none"
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                color: "var(--color-earth-900)",
                fontWeight: 400,
              }}
            >
              Your Cart
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--color-earth-500)", fontFamily: "var(--font-inter), sans-serif" }}
            >
              {totalItems === 0
                ? "Your cart is empty"
                : `${totalItems} item${totalItems !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="p-2 rounded-lg transition-colors hover:bg-[--color-earth-100]"
            style={{ color: "var(--color-earth-600)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.25}
                className="w-16 h-16"
                style={{ color: "var(--color-earth-300)" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
                />
              </svg>
              <div>
                <p
                  className="text-lg mb-1"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "var(--color-earth-700)" }}
                >
                  Nothing here yet
                </p>
                <p
                  className="text-sm"
                  style={{ color: "var(--color-earth-500)", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  Browse our collection and add some natural goodness.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-medium text-white transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, var(--color-green-600), var(--color-green-700))",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                Browse Products
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 p-3 rounded-xl border"
                style={{ borderColor: "var(--color-earth-200)", background: "white" }}
              >
                {/* Color swatch as placeholder */}
                <div
                  className="w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-[10px] font-medium"
                  style={{ background: "var(--color-earth-300)" }}
                >
                  soap
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium leading-tight truncate"
                    style={{ color: "var(--color-earth-900)", fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1.05rem" }}
                  >
                    {item.product.name}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--color-earth-500)", fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    ₹{item.product.price.toFixed(2)} each
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    {/* Qty controls */}
                    <div
                      className="flex items-center gap-2 rounded-full border px-2 py-1"
                      style={{ borderColor: "var(--color-earth-200)" }}
                    >
                      <button
                        onClick={() => decrement(item.product.id)}
                        aria-label={`Decrease quantity of ${item.product.name}`}
                        className="w-5 h-5 flex items-center justify-center rounded-full transition-colors"
                        style={{ color: "var(--color-text-primary)", background: "var(--color-surface-1)" }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3">
                          <path strokeLinecap="round" d="M20 12H4" />
                        </svg>
                      </button>
                      <span
                        className="text-xs font-medium w-4 text-center"
                        style={{ color: "var(--color-earth-900)", fontFamily: "var(--font-inter), sans-serif" }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increment(item.product.id)}
                        aria-label={`Increase quantity of ${item.product.name}`}
                        className="w-5 h-5 flex items-center justify-center rounded-full transition-colors"
                        style={{ color: "var(--color-text-primary)", background: "var(--color-surface-1)" }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3">
                          <path strokeLinecap="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>

                    {/* Line total */}
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--color-bark)", fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </span>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      aria-label={`Remove ${item.product.name} from cart`}
                      className="p-1 rounded-md transition-colors hover:bg-red-50"
                      style={{ color: "var(--color-earth-400)" }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            className="px-5 py-4 border-t space-y-3"
            style={{ borderColor: "var(--color-earth-200)" }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-sm font-medium"
                style={{ color: "var(--color-earth-600)", fontFamily: "var(--font-inter), sans-serif" }}
              >
                Subtotal
              </span>
              <span
                className="text-xl"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "var(--color-earth-900)", fontWeight: 400 }}
              >
                ₹{totalPrice.toFixed(2)}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full py-3.5 rounded-xl text-sm font-medium tracking-widest uppercase text-center text-white transition-all hover:opacity-90 hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, var(--color-green-600), var(--color-green-700))",
                fontFamily: "var(--font-inter), sans-serif",
                letterSpacing: "0.12em",
              }}
            >
              Proceed to Checkout
            </Link>
            <p
              className="text-center text-xs"
              style={{ color: "var(--color-earth-400)", fontFamily: "var(--font-inter), sans-serif" }}
            >
              Shipping & taxes calculated at checkout
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
