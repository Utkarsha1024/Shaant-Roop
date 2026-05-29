"use client";

import Link from "next/link";
import AdminDashboardLayout from "@/components/admin/AdminDashboardLayout";

const QUICK_LINKS = [
  { label: "Products", href: "/admin/products", icon: "📦", desc: "Manage your soap catalog" },
  { label: "Categories", href: "/admin/categories", icon: "🗂️", desc: "Organise product categories" },
  { label: "Orders", href: "/admin/orders", icon: "📋", desc: "View and manage orders" },
];

export default function AdminIndexPage() {
  return (
    <AdminDashboardLayout title="Dashboard">
      <div className="max-w-4xl">
        <p
          className="text-sm mb-8"
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
      </div>
    </AdminDashboardLayout>
  );
}
