import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard — Shaant Roop",
  description: "Manage products, categories, and orders for your Shaant Roop store.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
