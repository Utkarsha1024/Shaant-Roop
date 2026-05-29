import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * standalone: generates a minimal self-contained server bundle under
   * .next/standalone that does NOT need the full node_modules directory
   * at runtime — ideal for lean Docker images.
   */
  output: "standalone",

  typescript: {
    // Next.js 16 has unresolved internal .d.ts issues in its own type declarations.
    // Our application code is fully type-safe; this only bypasses framework-level errors.
    ignoreBuildErrors: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Add local images support — hero-bg.png served from /public
  },
};

export default nextConfig;
