/**
 * Shared utility to build full asset URLs for database-stored image paths.
 *
 * The backend stores image URLs that may be:
 * - A relative path:      "uploads/img.jpg" or "/uploads/img.jpg"
 * - A full localhost URL:  "http://localhost:8085/uploads/img.jpg"
 *
 * This helper normalizes all of these into a full, publicly-reachable URL
 * using the configured NEXT_PUBLIC_API_URL (with a localhost fallback).
 */

const ASSET_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8085";

/**
 * Converts a database image URL into a fully-qualified public URL.
 *
 * @param rawUrl - The imageUrl string stored in the database
 * @returns      - A fully-qualified URL the browser can fetch
 *
 * @example
 * assetUrl("uploads/soap.jpg")                        → "http://…:8085/uploads/soap.jpg"
 * assetUrl("/uploads/soap.jpg")                       → "http://…:8085/uploads/soap.jpg"
 * assetUrl("http://localhost:8085/uploads/soap.jpg")   → "http://…:8085/uploads/soap.jpg"
 * assetUrl(null)                                       → ""
 */
export function assetUrl(rawUrl: string | null | undefined): string {
  if (!rawUrl) return "";

  // If it's already a full URL with a different host, strip to just the path
  // e.g. "http://localhost:8085/uploads/soap.jpg" → "/uploads/soap.jpg"
  let path = rawUrl;
  try {
    const parsed = new URL(rawUrl);
    // If it's a full URL (http/https), extract just the pathname
    path = parsed.pathname;
  } catch {
    // Not a full URL — it's a relative path, which is fine
  }

  // Ensure the path starts with exactly one "/"
  path = "/" + path.replace(/^\/+/, "");

  // Ensure the base does NOT end with "/"
  const base = ASSET_BASE.replace(/\/+$/, "");

  return `${base}${path}`;
}
