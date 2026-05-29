"use client";

import { useState, useEffect, FormEvent } from "react";
import { Category, ProductFormData } from "@/lib/types";

interface ProductFormProps {
  categories: Category[];
  onSubmit: (data: ProductFormData) => Promise<void>;
  isSubmitting: boolean;
}

const EMPTY_FORM: ProductFormData = {
  name: "",
  description: "",
  price: "",
  stockQuantity: "",
  imageUrl: "",
  categoryId: "",
};

// Reusable field label component
function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
      style={{
        color: "var(--color-earth-600)",
        fontFamily: "var(--font-inter), sans-serif",
      }}
    >
      {children}
      {required && (
        <span className="ml-1" style={{ color: "var(--color-terracotta)" }} aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

const inputClass = "w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-150 outline-none";
const inputStyle = {
  background: "var(--color-earth-50)",
  border: "1.5px solid var(--color-earth-200)",
  color: "var(--color-earth-900)",
  fontFamily: "var(--font-inter), sans-serif",
};

export default function ProductForm({
  categories,
  onSubmit,
  isSubmitting,
}: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) return setError("Product name is required.");
    if (!form.categoryId) return setError("Please select a category.");
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      return setError("Please enter a valid price.");
    if (
      !form.stockQuantity ||
      isNaN(Number(form.stockQuantity)) ||
      Number(form.stockQuantity) < 0
    )
      return setError("Please enter a valid stock quantity.");

    try {
      await onSubmit(form);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError((err as Error).message ?? "Something went wrong.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Add new product"
      className="rounded-2xl border p-6"
      style={{ background: "white", borderColor: "var(--color-earth-200)" }}
    >
      <h2
        className="text-xl mb-6"
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          color: "var(--color-earth-900)",
          fontWeight: 400,
          letterSpacing: "-0.02em",
        }}
      >
        Add New Product
      </h2>

      {/* Error banner */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 px-4 py-3 rounded-xl mb-5 text-sm"
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            fontFamily: "var(--font-inter), sans-serif",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-4 h-4 flex-shrink-0 mt-0.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
        {/* Name */}
        <div className="sm:col-span-2">
          <FieldLabel htmlFor="product-name" required>
            Product Name
          </FieldLabel>
          <input
            id="product-name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Lavender & Oat Soap"
            className={inputClass}
            style={inputStyle}
            required
            aria-required="true"
          />
        </div>

        {/* Category */}
        <div>
          <FieldLabel htmlFor="product-category" required>
            Category
          </FieldLabel>
          <select
            id="product-category"
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className={inputClass}
            style={{ ...inputStyle, cursor: "pointer" }}
            required
            aria-required="true"
          >
            <option value="" disabled>
              Select a category…
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <FieldLabel htmlFor="product-price" required>
            Price (₹)
          </FieldLabel>
          <input
            id="product-price"
            name="price"
            type="number"
            min="0.01"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            placeholder="249.00"
            className={inputClass}
            style={inputStyle}
            required
            aria-required="true"
          />
        </div>

        {/* Stock */}
        <div>
          <FieldLabel htmlFor="product-stock" required>
            Stock Quantity
          </FieldLabel>
          <input
            id="product-stock"
            name="stockQuantity"
            type="number"
            min="0"
            step="1"
            value={form.stockQuantity}
            onChange={handleChange}
            placeholder="50"
            className={inputClass}
            style={inputStyle}
            required
            aria-required="true"
          />
        </div>

        {/* Image URL */}
        <div>
          <FieldLabel htmlFor="product-image">Image URL</FieldLabel>
          <input
            id="product-image"
            name="imageUrl"
            type="url"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="https://…"
            className={inputClass}
            style={inputStyle}
          />
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <FieldLabel htmlFor="product-description">Description</FieldLabel>
          <textarea
            id="product-description"
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the soap's scent, ingredients, and benefits…"
            className={inputClass}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-60"
          style={{
            background: "var(--color-terracotta)",
            color: "white",
            fontFamily: "var(--font-inter), sans-serif",
            letterSpacing: "0.02em",
          }}
        >
          {isSubmitting ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving…
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Product
            </>
          )}
        </button>
      </div>
    </form>
  );
}
