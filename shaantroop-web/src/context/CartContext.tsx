"use client";

import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react";
import type { Product } from "@/lib/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD"; product: Product }
  | { type: "REMOVE"; productId: number }
  | { type: "INCREMENT"; productId: number }
  | { type: "DECREMENT"; productId: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: CartItem[] };

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  increment: (productId: number) => void;
  decrement: (productId: number) => void;
  clearCart: () => void;
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.items };

    case "ADD": {
      const existing = state.items.find((i) => i.product.id === action.product.id);
      if (existing) {
        if (action.product.stockQuantity !== -1 && existing.quantity >= action.product.stockQuantity) {
          return state; // Reached stock limit
        }
        return {
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      if (action.product.stockQuantity === 0) {
        return state;
      }
      return { items: [...state.items, { product: action.product, quantity: 1 }] };
    }

    case "REMOVE":
      return { items: state.items.filter((i) => i.product.id !== action.productId) };

    case "INCREMENT":
      return {
        items: state.items.map((i) => {
          if (i.product.id === action.productId) {
            if (i.product.stockQuantity !== -1 && i.quantity >= i.product.stockQuantity) {
              return i; // Reached stock limit
            }
            return { ...i, quantity: i.quantity + 1 };
          }
          return i;
        }),
      };

    case "DECREMENT":
      return {
        items: state.items
          .map((i) =>
            i.product.id === action.productId ? { ...i, quantity: i.quantity - 1 } : i
          )
          .filter((i) => i.quantity > 0),
      };

    case "CLEAR":
      return { items: [] };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "shaantroop_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Hydrate from localStorage on first mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          dispatch({ type: "HYDRATE", items: parsed });
        }
      }
    } catch {
      // Silently ignore corrupt storage
    }
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // Silently ignore storage quota errors
    }
  }, [state.items]);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  const value: CartContextValue = {
    items: state.items,
    totalItems,
    totalPrice,
    addToCart: (product) => dispatch({ type: "ADD", product }),
    removeFromCart: (productId) => dispatch({ type: "REMOVE", productId }),
    increment: (productId) => dispatch({ type: "INCREMENT", productId }),
    decrement: (productId) => dispatch({ type: "DECREMENT", productId }),
    clearCart: () => dispatch({ type: "CLEAR" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
