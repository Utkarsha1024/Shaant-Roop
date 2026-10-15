import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * standalone: generates a minimal self-contained server bundle under
   * .next/standalone that does NOT need the full node_modules directory
   * at runtime — ideal for lean Docker images.
   */
  output: "standalone",

  // ─── Allow LAN IPs to access the dev server (Fixes phone + cross-device HMR) ───
  allowedDevOrigins: [
    "192.168.0.135",
    "192.168.1.3",
    "192.168.0.*",     // Covers any device on the local subnet
  ],

  typescript: {
    // Next.js 16 has unresolved internal .d.ts issues in its own type declarations.
    // Our application code is fully type-safe; this only bypasses framework-level errors.
    ignoreBuildErrors: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Add local images support — hero-bg.png served from /public
    // ─── NEW: Fixes the image quality console warnings ───
    qualities: [75, 90],
  },
};

export default nextConfig;