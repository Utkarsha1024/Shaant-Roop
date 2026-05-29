"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

/**
 * NavbarWrapper renders the public Navbar on all routes except /admin/*.
 * Admin pages manage their own navigation via AdminSidebar + AdminTopbar.
 */
export default function NavbarWrapper() {
  const pathname = usePathname();

  // Suppress the public Navbar on any admin route
  if (pathname?.startsWith("/admin")) return null;

  return <Navbar />;
}
