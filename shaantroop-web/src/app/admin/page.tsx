"use client";

import { useState } from "react";
import Link from "next/link";
import AdminDashboardLayout from "@/components/admin/AdminDashboardLayout";
import { api } from "@/lib/apiFetch";

const QUICK_LINKS = [
  { label: "Products", href: "/admin/products", icon: "📦", desc: "Manage your soap catalog" },
  { label: "Categories", href: "/admin/categories", icon: "🗂️", desc: "Organise product categories" },
  { label: "Orders", href: "/admin/orders", icon: "📋", desc: "View and manage orders" },
];

interface CleanupResponse {
  message: string;
  deletedCount: number;
}

export default function AdminIndexPage() {
  const [isCleaning, setIsCleaning] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCleanup = async () => {
    setShowConfirm(false);
    setIsCleaning(true);
    setResult(null);

    try {
      const data = await api.post<CleanupResponse>("/api/admin/system/cleanup-images", {});
      setResult({
        type: "success",
        text:
          data.deletedCount > 0
            ? `Cleanup successful — ${data.deletedCount} orphaned image${data.deletedCount !== 1 ? "s" : ""} deleted.`
            : "Storage is clean — no orphaned images found.",
      });
    } catch (err) {
      setResult({
        type: "error",
        text: err instanceof Error ? err.message : "An unexpected error occurred.",
      });
    } finally {
      setIsCleaning(false);
    }
  };

  return (
    <AdminDashboardLayout title="Dashboard">
      <div className="max-w-4xl space-y-10">
        {/* ── Quick Links ──────────────────────────────────────────── */}
        <section>
          <p
            className="text-sm mb-6"
            style={{
              color: "var(--color-earth-500)",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            Welcome back! Manage your store from the sections below.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group block rounded-2xl p-6 border transition-all duration-200 hover:shadow-md"
                style={{
                  background: "white",
                  borderColor: "var(--color-earth-200)",
                  textDecoration: "none",
                }}
              >
                <div className="text-3xl mb-3">{link.icon}</div>
                <h2
                  className="text-lg mb-1"
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    color: "var(--color-earth-900)",
                    fontWeight: 400,
                  }}
                >
                  {link.label}
                </h2>
                <p
                  className="text-sm"
                  style={{
                    color: "var(--color-earth-500)",
                    fontFamily: "var(--font-inter), sans-serif",
                  }}
                >
                  {link.desc}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── System Maintenance ───────────────────────────────────── */}
        <section>
          <h2
            className="text-xl mb-4"
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              color: "var(--color-earth-900)",
              fontWeight: 400,
            }}
          >
            System Maintenance
          </h2>

          <div
            className="rounded-2xl border p-6"
            style={{
              background: "white",
              borderColor: "var(--color-earth-200)",
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-5">
              {/* Info */}
              <div
                className="flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0"
                style={{ background: "rgba(180, 83, 9, 0.08)" }}
              >
                {/* Trash / broom icon */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  className="w-6 h-6"
                  style={{ color: "#b45309" }}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  className="text-base font-medium mb-1"
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    color: "var(--color-earth-900)",
                  }}
                >
                  Storage Cleanup
                </h3>
                <p
                  className="text-sm mb-4 leading-relaxed"
                  style={{
                    color: "var(--color-earth-500)",
                    fontFamily: "var(--font-inter), sans-serif",
                  }}
                >
                  Scans the server&apos;s upload directory and permanently deletes product images
                  that are no longer referenced in the database. This frees up disk space and
                  keeps storage tidy.
                </p>

                {/* Action row */}
                {!showConfirm ? (
                  <button
                    onClick={() => setShowConfirm(true)}
                    disabled={isCleaning}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: isCleaning
                        ? "var(--color-earth-100)"
                        : "linear-gradient(135deg, #b45309, #92400e)",
                      color: isCleaning ? "var(--color-earth-500)" : "white",
                      fontFamily: "var(--font-inter), sans-serif",
                      boxShadow: isCleaning ? "none" : "0 2px 8px rgba(180, 83, 9, 0.25)",
                    }}
                  >
                    {isCleaning ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                          <path
                            fill="currentColor"
                            className="opacity-75"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Cleaning…
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        Delete Orphaned Images
                      </>
                    )}
                  </button>
                ) : (
                  /* Confirmation row */
                  <div
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-xl border"
                    style={{
                      background: "rgba(180, 83, 9, 0.04)",
                      borderColor: "rgba(180, 83, 9, 0.15)",
                    }}
                  >
                    <p
                      className="text-sm flex-1"
                      style={{
                        color: "#92400e",
                        fontFamily: "var(--font-inter), sans-serif",
                      }}
                    >
                      This action is irreversible. Orphaned images will be permanently deleted from the server.
                    </p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setShowConfirm(false)}
                        className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                        style={{
                          borderColor: "var(--color-earth-300)",
                          color: "var(--color-earth-700)",
                          fontFamily: "var(--font-inter), sans-serif",
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCleanup}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200"
                        style={{
                          background: "#b91c1c",
                          fontFamily: "var(--font-inter), sans-serif",
                          boxShadow: "0 2px 6px rgba(185, 28, 28, 0.3)",
                        }}
                      >
                        Yes, Delete
                      </button>
                    </div>
                  </div>
                )}

                {/* Result alert */}
                {result && (
                  <div
                    className="mt-4 flex items-start gap-3 p-4 rounded-xl border text-sm animate-in fade-in slide-in-from-top-2 duration-300"
                    style={{
                      background:
                        result.type === "success"
                          ? "rgba(22, 163, 74, 0.06)"
                          : "rgba(185, 28, 28, 0.06)",
                      borderColor:
                        result.type === "success"
                          ? "rgba(22, 163, 74, 0.2)"
                          : "rgba(185, 28, 28, 0.2)",
                      color: result.type === "success" ? "#15803d" : "#b91c1c",
                      fontFamily: "var(--font-inter), sans-serif",
                    }}
                  >
                    {result.type === "success" ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 flex-shrink-0 mt-px" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 flex-shrink-0 mt-px" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                    )}
                    <span>{result.text}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </AdminDashboardLayout>
  );
}

