"use client";

import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { AuthResponse } from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8085";

interface Props {
  redirectTo?: string;
}

function GoogleGMark() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18" height="18" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.27 0 6.19 1.13 8.49 3l6.3-6.3C35.1 2.6 29.87 0 24 0 14.63 0 6.6 5.45 2.82 13.37l7.36 5.72C11.95 13.08 17.5 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.36-5.72C1.18 16.78 0 20.27 0 24c0 3.73 1.18 7.22 3.17 10.31l7.36-5.72z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.5 0-12.05-3.58-14.82-8.8l-7.36 5.72C6.6 42.55 14.63 48 24 48z" />
    </svg>
  );
}

function InnerGoogleSignInButton({ redirectTo }: Props) {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="w-full space-y-2">
      {/* ─── THE OVERLAY TRICK CONTAINER ─── */}
      <div
        className="relative w-full h-[50px] rounded-xl overflow-hidden cursor-pointer group"
        style={{ borderRadius: "0.75rem" }}
      >

        {/* 1. The Visual Button (What you see) */}
        <div
          className={`absolute inset-0 flex items-center justify-center gap-3 w-full h-full transition-colors duration-200 pointer-events-none ${isLoading ? 'opacity-60' : ''}`}
          style={{
            background: isLoading ? "#1a3d22" : "#1a3d22", // Default background
            border: "1px solid #c9983a",
            color: "white",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "0.875rem",
            fontWeight: 500,
            letterSpacing: "0.01em",
            boxShadow: "0 1px 6px rgba(26,61,34,0.20)",
            borderRadius: "0.75rem"
          }}
        >
          {/* Internal hover state using Tailwind group-hover */}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-200" />

          <span className="relative flex items-center justify-center rounded-full bg-white flex-shrink-0 z-10" style={{ width: 26, height: 26 }}>
            <GoogleGMark />
          </span>

          <span className="relative z-10">
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
          </span>
        </div>

        {/* 2. The Functional Button (Invisible, sits on top to catch clicks) */}
        {!isLoading && (
          <div className="absolute inset-0 z-20 opacity-[0.01] flex justify-center items-center scale-[2.5]">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                setIsLoading(true);
                setError(null);
                try {
                  const idToken = credentialResponse.credential;
                  if (!idToken) throw new Error("No token returned");

                  const res = await fetch(`${API_BASE}/api/auth/google`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ idToken }),
                  });

                  if (!res.ok) {
                    const body = await res.json().catch(() => ({}));
                    throw new Error(body.message || "Google sign-in failed on the server.");
                  }

                  const data = (await res.json()) as AuthResponse;

                  // Set the cookie for Next.js Middleware
                  document.cookie = `shaantroop_token=${data.token}; path=/; max-age=604800; SameSite=Lax`;

                  login(data.user, data.token);

                  if (redirectTo && redirectTo.startsWith("/")) {
                    router.push(redirectTo);
                  } else if (data.user.role === "ADMIN") {
                    router.push("/admin");
                  } else {
                    router.push("/");
                  }
                } catch (err: any) {
                  setError(err.message || "Could not reach the server.");
                  setIsLoading(false);
                }
              }}
              onError={() => setError("Google sign-in was cancelled.")}
            />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p role="alert" className="text-center text-xs px-3 py-2 rounded-lg" style={{ color: "#b91c1c", background: "#fef2f2", border: "1px solid #fecaca" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function GoogleSignInButton({ redirectTo }: Props) {
  // HARDCODED BYPASS TO DEFEAT DOCKER BUILD TRAP
  const clientId = "208348397525-qa6p49vd7jp8tmnnkl5llg95v52m2a0d.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <InnerGoogleSignInButton redirectTo={redirectTo} />
    </GoogleOAuthProvider>
  );
}