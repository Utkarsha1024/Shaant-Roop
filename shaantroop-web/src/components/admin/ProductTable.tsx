"use client";

import { Product } from "@/lib/types";

interface ProductTableProps {
  products: Product[];
  onDelete: (id: number) => void;
  isDeleting: number | null;
}

export default function ProductTable({
  products,
  onDelete,
  isDeleting,
}: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div
        className="rounded-2xl border py-16 text-center"
        style={{
          background: "white",
          borderColor: "var(--color-earth-200)",
          color: "var(--color-earth-400)",
          fontFamily: "var(--font-inter), sans-serif",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          className="w-12 h-12 mx-auto mb-3 opacity-30"
          style={{ color: "var(--color-earth-400)" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
          />
        </svg>
        <p className="text-sm">No products yet. Add your first soap above!</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: "var(--color-earth-200)" }}
    >
      {/* Desktop table */}
      <div className="overflow-x-auto">
        <table
          className="w-full text-sm"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
          aria-label="Products table"
        >
          <thead>
            <tr
              style={{
                background: "var(--color-earth-50)",
                borderBottom: "1px solid var(--color-earth-200)",
              }}
            >
              {["Name", "Category", "Price", "Stock", ""].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-5 py-3 text-left text-xs font-semibold tracking-wider uppercase"
                  style={{ color: "var(--color-earth-500)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product, idx) => (
              <tr
                key={product.id}
                className="transition-colors group"
                style={{
                  background: idx % 2 === 0 ? "white" : "var(--color-earth-50)",
                  borderBottom: "1px solid var(--color-earth-100)",
                }}
              >
                {/* Name + image */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        style={{ border: "1px solid var(--color-earth-200)" }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center"
                        style={{ background: "var(--color-earth-100)" }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          className="w-5 h-5"
                          style={{ color: "var(--color-earth-400)" }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                          />
                        </svg>
                      </div>
                    )}
                    <div>
                      <p
                        className="font-medium"
                        style={{ color: "var(--color-earth-900)" }}
                      >
                        {product.name}
                      </p>
                      {product.description && (
                        <p
                          className="text-xs mt-0.5 max-w-xs truncate"
                          style={{ color: "var(--color-earth-400)" }}
                        >
                          {product.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-5 py-4">
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      background: "var(--color-earth-100)",
                      color: "var(--color-earth-700)",
                    }}
                  >
                    {product.categoryName}
                  </span>
                </td>

                {/* Price */}
                <td
                  className="px-5 py-4 font-semibold"
                  style={{ color: "var(--color-earth-800)" }}
                >
                  ₹{Number(product.price).toFixed(2)}
                </td>

                {/* Stock */}
                <td className="px-5 py-4">
                  <span
                    className="inline-flex items-center gap-1 text-xs font-medium"
                    style={{
                      color:
                        product.stockQuantity < 5
                          ? "#b91c1c"
                          : "var(--color-sage-600)",
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor:
                          product.stockQuantity < 5 ? "#ef4444" : "var(--color-sage-500)",
                      }}
                    />
                    {product.stockQuantity} in stock
                  </span>
                </td>

                {/* Actions */}
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => onDelete(product.id)}
                    disabled={isDeleting === product.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 disabled:opacity-50"
                    style={{
                      color: "#b91c1c",
                      background: "transparent",
                      border: "1px solid #fecaca",
                    }}
                    aria-label={`Delete ${product.name}`}
                  >
                    {isDeleting === product.id ? (
                      <svg
                        className="w-3 h-3 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="w-3 h-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    )}
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
