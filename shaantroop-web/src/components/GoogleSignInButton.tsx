"use client";

import { GoogleOAuthProvider, GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { AuthResponse } from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8085";

interface Props {
  redirectTo?: string;
}

function InnerGoogleSignInButton({ redirectTo }: Props) {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSuccess(credentialResponse: CredentialResponse) {
    setIsLoading(true);
    setError(null);
    try {
      const idToken = credentialResponse.credential;
      if (!idToken) throw new Error("No credential returned from Google.");

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

      // Set cookie for Next.js middleware
      document.cookie = `shaantroop_token=${data.token}; path=/; max-age=604800; SameSite=Lax`;

      login(data.user, data.token);

      if (redirectTo && redirectTo.startsWith("/")) {
        router.push(redirectTo);
      } else if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not complete Google sign-in.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full space-y-2">
      {isLoading ? (
        <div
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm"
          style={{
            border: "1px solid var(--color-earth-300, #e2d9cc)",
            background: "var(--color-earth-50, #fcfbf9)",
            color: "var(--color-earth-700, #4a3e35)",
            fontFamily: "var(--font-inter), sans-serif",
          }}
        >
          <svg className="w-4 h-4 animate-spin text-stone-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Signing in with Google…</span>
        </div>
      ) : (
        <div className="w-full flex justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => setError("Google sign-in was cancelled or failed.")}
            theme="outline"
            size="large"
            text="continue_with"
            shape="rectangular"
            width="100%"
          />
        </div>
      )}

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

export default function GoogleSignInButton({ redirectTo }: Props) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return (
      <p
        role="alert"
        className="w-full text-center text-xs px-3 py-2 rounded-lg"
        style={{
          color: "#92400e",
          background: "#fffbeb",
          border: "1px solid #fde68a",
          fontFamily: "var(--font-inter), sans-serif",
        }}
      >
        Google sign-in is not configured.
      </p>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <InnerGoogleSignInButton redirectTo={redirectTo} />
    </GoogleOAuthProvider>
  );
}
