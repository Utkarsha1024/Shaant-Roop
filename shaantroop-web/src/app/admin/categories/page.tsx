"use client";

import { useState, useEffect, useCallback } from "react";
import AdminDashboardLayout from "@/components/admin/AdminDashboardLayout";

/* ─── Types ──────────────────────────────────────────────────────────── */
interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

/* ─── Helpers ────────────────────────────────────────────────────────── */
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8085";

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

/** Convert "Hair Care" → "hair-care" */
function toSlug(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ─── Category pill / row card ───────────────────────────────────────── */
function CategoryCard({ category }: { category: Category }) {
  return (
    <div
      className="flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-150 hover:shadow-sm"
      style={{
        background: "white",
        borderColor: "#CDE0C9",
      }}
    >
      <div className="flex items-center gap-3">
        {/* Colour dot */}
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ background: "#1E5021" }}
          aria-hidden="true"
        />
        <div>
          <p
            className="text-sm font-semibold leading-tight"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              color: "#0F2B10",
            }}
          >
            {category.name}
          </p>
          <p
            className="text-xs mt-0.5"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              color: "#6DA669",
            }}
          >
            /{category.slug}
          </p>
        </div>
      </div>
      {category.description && (
        <p
          className="hidden sm:block text-xs max-w-xs text-right"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            color: "#6DA669",
          }}
        >
          {category.description}
        </p>
      )}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */
export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* New-category form state */
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  /* ── Fetch categories ── */
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/categories`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data: Category[] = await res.json();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  /* ── Create category ── */
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);

    const trimmed = newName.trim();
    if (!trimmed) {
      setFormError("Category name cannot be empty.");
      return;
    }

    setSubmitting(true);
    try {
      const body = {
        name: trimmed,
        slug: toSlug(trimmed),
        description: newDesc.trim() || null,
      };
      const res = await fetch(`${API}/api/categories`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Server returned ${res.status}`);
      }
      setNewName("");
      setNewDesc("");
      setSuccessMsg(`"${trimmed}" created successfully!`);
      await fetchCategories();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Creation failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminDashboardLayout title="Categories">
      <div className="max-w-2xl space-y-8">

        {/* ── Section header ── */}
        <div>
          <p
            className="text-sm"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              color: "#6DA669",
            }}
          >
            Organise your products into browsable collections.
          </p>
        </div>

        {/* ── Existing categories ── */}
        <section aria-labelledby="existing-cats-heading">
          <h2
            id="existing-cats-heading"
            className="text-xs uppercase tracking-widest mb-3 font-semibold"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              color: "#2D6B2A",
              letterSpacing: "0.12em",
            }}
          >
            Existing Categories
          </h2>

          {loading ? (
            /* Skeleton rows */
            <div className="space-y-3">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-[60px] rounded-xl animate-pulse"
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
            >
              ⚠ {error}
            </div>
          ) : categories.length === 0 ? (
            <div
              className="rounded-xl border border-dashed px-5 py-8 text-center text-sm"
              style={{
                borderColor: "#CDE0C9",
                color: "#6DA669",
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              No categories yet. Create your first one below.
            </div>
          ) : (
            <div className="space-y-2">
              {categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          )}
        </section>

        {/* ── Divider ── */}
        <div
          className="h-px"
          style={{ background: "linear-gradient(90deg, #CDE0C9 0%, transparent 100%)" }}
        />

        {/* ── Create new category ── */}
        <section aria-labelledby="new-cat-heading">
          <h2
            id="new-cat-heading"
            className="text-xs uppercase tracking-widest mb-4 font-semibold"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              color: "#2D6B2A",
              letterSpacing: "0.12em",
            }}
          >
            Add New Category
          </h2>

          <form
            onSubmit={handleCreate}
            className="rounded-2xl border p-6 space-y-4"
            style={{
              background: "white",
              borderColor: "#CDE0C9",
            }}
            aria-label="Create new category"
          >
            {/* Name */}
            <div>
              <label
                htmlFor="cat-name"
                className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  color: "#174019",
                  letterSpacing: "0.1em",
                }}
              >
                Category Name <span aria-hidden="true" style={{ color: "#C99500" }}>*</span>
              </label>
              <input
                id="cat-name"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Hair Care"
                required
                maxLength={100}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-150"
                style={{
                  border: "1.5px solid #CDE0C9",
                  fontFamily: "var(--font-inter), sans-serif",
                  color: "#0F2B10",
                  background: "#F8FAF8",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#1E5021";
                  e.target.style.boxShadow = "0 0 0 3px rgba(30,80,33,0.08)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#CDE0C9";
                  e.target.style.boxShadow = "none";
                }}
              />
              {/* Live slug preview */}
              {newName.trim() && (
                <p
                  className="text-xs mt-1"
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    color: "#6DA669",
                  }}
                >
                  Slug: <code>/{toSlug(newName)}</code>
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="cat-desc"
                className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  color: "#174019",
                  letterSpacing: "0.1em",
                }}
              >
                Description <span style={{ color: "#6DA669", fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                id="cat-desc"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Brief description for this category…"
                rows={2}
                maxLength={500}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-150 resize-none"
                style={{
                  border: "1.5px solid #CDE0C9",
                  fontFamily: "var(--font-inter), sans-serif",
                  color: "#0F2B10",
                  background: "#F8FAF8",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#1E5021";
                  e.target.style.boxShadow = "0 0 0 3px rgba(30,80,33,0.08)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#CDE0C9";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Feedback messages */}
            {formError && (
              <p
                className="text-xs px-3 py-2 rounded-lg"
                style={{
                  background: "#FEF4CA",
                  color: "#9E7200",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
                role="alert"
              >
                ⚠ {formError}
              </p>
            )}
            {successMsg && (
              <p
                className="text-xs px-3 py-2 rounded-lg"
                style={{
                  background: "#CDE0C9",
                  color: "#0F2B10",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
                role="status"
              >
                ✓ {successMsg}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: submitting
                  ? "#2D6B2A"
                  : "linear-gradient(135deg, #1E5021 0%, #2D6B2A 100%)",
                color: "white",
                fontFamily: "var(--font-inter), sans-serif",
                letterSpacing: "0.04em",
                boxShadow: "0 2px 12px rgba(30,80,33,0.25)",
              }}
            >
              {submitting ? (
                <>
                  <span
                    className="inline-block w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin"
                    aria-hidden="true"
                  />
                  Creating…
                </>
              ) : (
                <>
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                  Create Category
                </>
              )}
            </button>
          </form>
        </section>

      </div>
    </AdminDashboardLayout>
  );
}
