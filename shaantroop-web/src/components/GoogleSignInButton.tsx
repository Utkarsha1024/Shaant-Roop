"use client";

/**
 * GoogleSignInButton
 *
 * Branded "Continue with Google" button that:
 *  1. Triggers the Google implicit-flow popup via @react-oauth/google.
 *  2. Extracts `id_token` from the token response.
 *  3. POSTs it to POST /api/auth/google on the Spring Boot backend.
 *  4. On 200 OK, persists user data to AuthContext and redirects.
 *
 * Styling: Shaant Roop deep-green bg + gold border + authentic Google G logo.
 */

import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { AuthResponse } from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8085";

interface Props {
  /** Optional path to redirect after login (e.g. from ?redirect= query param). */
  redirectTo?: string;
}

/** Official multi-colour Google 'G' mark — no external image dependency. */
function GoogleGMark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <path fill="#EA4335" d="M24 9.5c3.27 0 6.19 1.13 8.49 3l6.3-6.3C35.1 2.6 29.87 0 24 0 14.63 0 6.6 5.45 2.82 13.37l7.36 5.72C11.95 13.08 17.5 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.36-5.72C1.18 16.78 0 20.27 0 24c0 3.73 1.18 7.22 3.17 10.31l7.36-5.72z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.5 0-12.05-3.58-14.82-8.8l-7.36 5.72C6.6 42.55 14.63 48 24 48z" />
    </svg>
  );
}

export default function GoogleSignInButton({ redirectTo }: Props) {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const googleLogin = useGoogleLogin({
    /**
     * `implicit` flow returns a TokenResponse that includes `id_token` — the
     * JWT our Spring Boot GoogleIdTokenVerifier expects. This avoids the need
     * for a PKCE server-side exchange.
     */
    flow: "implicit",

    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setError(null);

      try {
        // `id_token` is part of the implicit flow response
        const idToken = (tokenResponse as Record<string, unknown>).id_token as string | undefined;

        if (!idToken) {
          setError("Google did not return an ID token. Please try again.");
          return;
        }

        const res = await fetch(`${API_BASE}/api/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // lets the browser store the HttpOnly JWT cookie
          body: JSON.stringify({ idToken }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          const msg = (body as { message?: string }).message ?? "Google sign-in failed.";
          setError(msg);
          return;
        }

        const data = (await res.json()) as AuthResponse;
        login(data.user, data.token);

        // Honor ?redirect= (set by middleware) then fall back to role-based defaults
        if (redirectTo && redirectTo.startsWith("/")) {
          router.push(redirectTo);
        } else if (data.user.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } catch {
        setError("Could not reach the server. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    },

    onError: () => {
      setError("Google sign-in was cancelled or failed. Please try again.");
    },
  });

  return (
    <div className="w-full space-y-2">
      <button
        id="google-signin-btn"
        type="button"
        disabled={isLoading}
        onClick={() => {
          setError(null);
          googleLogin();
        }}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed select-none"
        style={{
          background: "#1a3d22",            // deep forest green
          border: "1px solid #c9983a",      // brand gold border
          color: "white",
          fontFamily: "var(--font-inter), sans-serif",
          letterSpacing: "0.01em",
          boxShadow: "0 1px 6px rgba(26,61,34,0.20)",
        }}
        onMouseEnter={(e) => {
          if (!isLoading) (e.currentTarget as HTMLButtonElement).style.background = "#122b18";
        }}
        onMouseLeave={(e) => {
          if (!isLoading) (e.currentTarget as HTMLButtonElement).style.background = "#1a3d22";
        }}
        aria-label="Continue with Google"
      >
        {/* White pill around the G mark so colours are always accurate */}
        <span
          className="flex items-center justify-center rounded-full flex-shrink-0"
          style={{ background: "white", width: 26, height: 26 }}
        >
          <GoogleGMark />
        </span>

        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Signing in…
          </span>
        ) : (
          "Continue with Google"
        )}
      </button>

      {error && (
        <p
          role="alert"
          className="text-center text-xs px-3 py-2 rounded-lg"
          style={{
            color: "#b91c1c",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            fontFamily: "var(--font-inter), sans-serif",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
