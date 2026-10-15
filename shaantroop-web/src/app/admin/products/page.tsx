"use client";

import { useState, useEffect, useCallback } from "react";
import AdminDashboardLayout from "@/components/admin/AdminDashboardLayout";
import ProductTable from "@/components/admin/ProductTable";
import ProductForm from "@/components/admin/ProductForm";
import { api } from "@/lib/apiFetch";
import type { Product, Category, ProductFormData } from "@/lib/types";

type PageState = "loading" | "error" | "ready";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pageState, setPageState] = useState<PageState>("loading");
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const fetchData = useCallback(async () => {
    setPageState("loading");
    setFetchError(null);
    try {
      const [productsData, categoriesData] = await Promise.all([
        api.get<Product[]>("/api/products"),
        api.get<Category[]>("/api/categories"),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setPageState("ready");
    } catch (err) {
      setFetchError((err as Error).message ?? "Failed to load data.");
      setPageState("error");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleCreateProduct(data: ProductFormData, file?: File | null) {
    setIsSubmitting(true);
    try {
      let finalImageUrl = data.imageUrl || null;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const token = localStorage.getItem("shaantroop_token");
        const uploadRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8085"}/api/upload`,
          {
            method: "POST",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData,
          }
        );

        if (!uploadRes.ok) {
          throw new Error("File upload failed.");
        }
        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.imageUrl;
      }

      const newProduct = await api.post<Product>("/api/products", {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        stockQuantity: parseInt(data.stockQuantity, 10),
        imageUrl: finalImageUrl,
        categoryId: parseInt(data.categoryId, 10),
        isActive: true, // always publish immediately on creation
      });
      setProducts((prev) => [newProduct, ...prev]);
      showSuccess(`"${newProduct.name}" was added successfully!`);
    } catch (err) {
      alert((err as Error).message ?? "Failed to create product.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteProduct(id: number) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setIsDeleting(id);
    try {
      await api.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showSuccess("Product deleted.");
    } catch (err) {
      alert((err as Error).message ?? "Failed to delete product.");
    } finally {
      setIsDeleting(null);
    }
  }

  async function handleUpdateStock(id: number, newStock: number) {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    try {
      const updatedProduct = await api.put<Product>(`/api/products/${id}`, {
        name: product.name,
        description: product.description,
        price: product.price,
        stockQuantity: newStock,
        imageUrl: product.imageUrl,
        categoryId: product.categoryId,
        isActive: true,
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? updatedProduct : p))
      );
      showSuccess(`Stock for "${product.name}" updated successfully.`);
    } catch (err) {
      alert((err as Error).message ?? "Failed to update stock.");
    }
  }

  async function handleToggleDiscontinue(id: number, discontinued: boolean) {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    try {
      const updatedProduct = await api.put<Product>(`/api/products/${id}`, {
        name: product.name,
        description: product.description,
        price: product.price,
        stockQuantity: product.stockQuantity,
        imageUrl: product.imageUrl,
        categoryId: product.categoryId,
        isActive: true,
        discontinued,
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? updatedProduct : p))
      );
      showSuccess(
        `"${product.name}" is now ${
          discontinued ? "discontinued" : "active again"
        }.`
      );
    } catch (err) {
      alert((err as Error).message ?? "Failed to update product state.");
    }
  }

  return (
    <AdminDashboardLayout title="Product Management">
      <div className="max-w-6xl space-y-6">
        {/* Success toast */}
        {successMessage && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm"
            style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              color: "#15803d",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 flex-shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {successMessage}
          </div>
        )}

        {/* Add product form */}
        <ProductForm
          categories={categories}
          onSubmit={handleCreateProduct}
          isSubmitting={isSubmitting}
        />

        {/* Product list */}
        <section aria-labelledby="product-list-heading">
          <div className="flex items-center justify-between mb-4">
            <h2
              id="product-list-heading"
              className="text-xl"
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                color: "var(--color-earth-900)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
              }}
            >
              All Products
              {pageState === "ready" && (
                <span
                  className="ml-2.5 text-sm align-middle px-2 py-0.5 rounded-full"
                  style={{
                    background: "var(--color-earth-100)",
                    color: "var(--color-earth-600)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontWeight: 500,
                  }}
                >
                  {products.length}
                </span>
              )}
            </h2>

            <button
              onClick={fetchData}
              disabled={pageState === "loading"}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: "var(--color-earth-100)",
                color: "var(--color-earth-600)",
                fontFamily: "var(--font-inter), sans-serif",
              }}
              aria-label="Refresh product list"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className={`w-3.5 h-3.5 ${pageState === "loading" ? "animate-spin" : ""}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Refresh
            </button>
          </div>

          {/* Loading state */}
          {pageState === "loading" && (
            <div
              className="rounded-2xl border py-16 flex flex-col items-center gap-3"
              style={{ background: "white", borderColor: "var(--color-earth-200)" }}
            >
              <svg className="w-8 h-8 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="var(--color-earth-400)" strokeWidth="4" />
                <path className="opacity-70" fill="var(--color-earth-500)" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p
                className="text-sm"
                style={{ color: "var(--color-earth-400)", fontFamily: "var(--font-inter), sans-serif" }}
              >
                Loading products…
              </p>
            </div>
          )}

          {/* Error state */}
          {pageState === "error" && (
            <div
              role="alert"
              className="rounded-2xl border px-6 py-10 text-center"
              style={{
                background: "#fef2f2",
                borderColor: "#fecaca",
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              <p className="text-sm mb-3" style={{ color: "#b91c1c" }}>
                {fetchError}
              </p>
              <button
                onClick={fetchData}
                className="text-xs underline"
                style={{ color: "#dc2626" }}
              >
                Try again
              </button>
            </div>
          )}

          {/* Table */}
          {pageState === "ready" && (
            <ProductTable
              products={products}
              onDelete={handleDeleteProduct}
              isDeleting={isDeleting}
              onUpdateStock={handleUpdateStock}
              onToggleDiscontinue={handleToggleDiscontinue}
            />
          )}
        </section>
      </div>
    </AdminDashboardLayout>
  );
}
