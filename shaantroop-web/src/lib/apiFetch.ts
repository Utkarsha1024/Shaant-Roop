/**
 * Authenticated fetch utility for the Shaant Roop admin dashboard.
 *
 * Strategy:
 * 1. First tries to read the JWT from the `shaantroop_token` HttpOnly cookie.
 * HttpOnly cookies are sent automatically by the browser on same-origin requests,
 * so for cross-origin calls we rely on `credentials: "include"`.
 * 2. Falls back to `localStorage` (dev-only) if no cookie is present, making it
 * easy to test from Postman-style tools or when the Spring Boot server is on
 * a different port and `SameSite` restrictions prevent cookie forwarding.
 */

// ─── NEW: Dual-URL Strategy to prevent Docker Hairpin crashes ─────────
const IS_SERVER = typeof window === "undefined";

const API_BASE_URL = IS_SERVER
  ? "http://backend:8085"                                         // Server-Side (Docker Internal Network)
  : (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8085"); // Client-Side (Phone/Mac Browser)
// ──────────────────────────────────────────────────────────────────────

/**
 * Reads the JWT from localStorage (dev fallback only).
 * Never store JWTs in localStorage in production.
 */
function getTokenFromLocalStorage(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("shaantroop_token");
}

/**
 * Build a headers object, injecting `Authorization: Bearer <token>` when a
 * JWT is available via localStorage. For cookie-based auth the browser handles
 * the cookie automatically when `credentials: "include"` is set.
 */
function buildHeaders(extraHeaders?: HeadersInit): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(extraHeaders as Record<string, string>),
  };

  const token = getTokenFromLocalStorage();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Wrapper around the native fetch API that:
 * - Prefixes the API base URL
 * - Injects the JWT Authorization header
 * - Sends credentials (cookies) for cross-origin requests
 * - Throws a descriptive Error on non-2xx responses
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const { headers: extraHeaders, ...restOptions } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers: buildHeaders(extraHeaders as HeadersInit),
    credentials: "include", // sends HttpOnly cookies cross-origin
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message =
      (errorBody as { message?: string }).message ??
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  // 204 No Content — return undefined cast as T
  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}

// ── Convenience methods ───────────────────────────────────────────────────────

export const api = {
  get: <T>(path: string) => apiFetch<T>(path, { method: "GET" }),

  post: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: "POST", body: JSON.stringify(body) }),

  put: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: "PUT", body: JSON.stringify(body) }),

  delete: <T>(path: string) => apiFetch<T>(path, { method: "DELETE" }),
};