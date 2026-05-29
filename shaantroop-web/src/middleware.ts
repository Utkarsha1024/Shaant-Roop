import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Protects all /admin/* routes at the edge.
 *
 * Strategy:
 *  1. Check for the HttpOnly JWT cookie (`shaantroop_token`) set by Spring Boot.
 *  2. If missing → redirect to /login and attach the original URL as ?redirect=
 *     so the login page can send the user back after a successful auth.
 *  3. If present → allow the request through. The Spring Boot backend will
 *     still validate the token on every API call, so this is a UX guard only.
 *
 * Public routes (/, /api/*, /login, /register, /checkout, static assets)
 * are entirely outside the matcher and are never touched by this middleware.
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get("shaantroop_token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    // Attach the original destination so login can redirect back
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Token present — allow through and set a security header
  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  // ONLY intercept /admin and its sub-paths.
  // Nothing else is affected — storefront, auth pages, and API routes are public.
  matcher: ["/admin/:path*"],
};
