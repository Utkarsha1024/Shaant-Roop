"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/apiFetch";
import { useAuth } from "@/context/AuthContext";
import type { AuthResponse } from "@/lib/types";
import { Suspense } from "react";
import GoogleSignInButton from "@/components/GoogleSignInButton";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await api.post<AuthResponse>("/api/auth/login", {
        usernameOrEmail: email,
        password,
      });

      // AuthContext.login() persists both the token and user to localStorage
      // and updates global state so the Navbar instantly reflects the new user.
      login(data.user, data.token);

      // Honor ?redirect= param (set by middleware when bouncing unauthenticated
      // admin requests) — then fall back to role-based defaults.
      const redirectTo = searchParams.get("redirect");
      if (redirectTo && redirectTo.startsWith("/")) {
        router.push(redirectTo);
      } else if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      // apiFetch throws an Error with the server's message on non-2xx responses.
      // The Spring Boot AuthController returns 401 with a message for bad credentials.
      const message = err instanceof Error ? err.message : "";

      if (
        message.toLowerCase().includes("unauthorized") ||
        message.toLowerCase().includes("invalid") ||
        message.toLowerCase().includes("credentials") ||
        message === "Request failed with status 401"
      ) {
        setError("Invalid credentials. Please check your email and password.");
      } else if (message.toLowerCase().includes("failed to fetch")) {
        setError("Cannot reach the server. Please check your connection and try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ background: "var(--color-cream)" }}>
      {/* Top stripe */}
      <div
        className="h-1 w-full"
        style={{ background: "linear-gradient(90deg, var(--color-green-500), var(--color-gold-400), var(--color-green-600))" }}
      />

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Brand mark */}
          <div className="text-center mb-10">
            <Link
              href="/"
              className="inline-block no-underline hover:opacity-80 transition-opacity"
              aria-label="Back to Shaant Roop home"
            >
              <p
                className="text-sm tracking-[0.25em] uppercase mb-2"
                style={{ color: "var(--color-earth-400)", fontFamily: "var(--font-inter), sans-serif" }}
              >
                Shaant Roop
              </p>
              <h1
                className="text-4xl leading-none"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "var(--color-earth-900)", fontWeight: 400 }}
              >
                Welcome back
              </h1>
            </Link>
            <p
              className="mt-3 text-sm"
              style={{ color: "var(--color-earth-500)", fontFamily: "var(--font-inter), sans-serif" }}
            >
              Sign in to manage your orders and enjoy faster checkout.
            </p>
          </div>

          {/* Card */}
          <div
            className="rounded-3xl p-8 shadow-sm border"
            style={{
              background: "white",
              borderColor: "var(--color-earth-200)",
            }}
          >
            {/* Error banner */}
            {error && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm"
                style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontFamily: "var(--font-inter), sans-serif" }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 flex-shrink-0 mt-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} noValidate className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-xs font-medium mb-1.5 tracking-wide uppercase"
                  style={{ color: "var(--color-earth-600)", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  Email address
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 placeholder:opacity-40"
                  style={{
                    borderColor: "var(--color-earth-200)",
                    color: "var(--color-earth-900)",
                    fontFamily: "var(--font-inter), sans-serif",
                    background: "var(--color-earth-50)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--color-earth-400)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--color-earth-200)")}
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-medium tracking-wide uppercase"
                    style={{ color: "var(--color-earth-600)", fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs hover:underline"
                    style={{ color: "var(--color-earth-400)", fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 placeholder:opacity-40"
                  style={{
                    borderColor: "var(--color-earth-200)",
                    color: "var(--color-earth-900)",
                    fontFamily: "var(--font-inter), sans-serif",
                    background: "var(--color-earth-50)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--color-earth-400)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--color-earth-200)")}
                />
              </div>

              {/* Submit */}
              <button
                id="login-submit"
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background: isLoading
                    ? "var(--color-earth-300)"
                    : "linear-gradient(135deg, var(--color-earth-500), var(--color-earth-600))",
                  color: "white",
                  fontFamily: "var(--font-inter), sans-serif",
                  boxShadow: "0 2px 8px rgba(166,112,67,0.3)",
                }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in…
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px" style={{ background: "var(--color-earth-200)" }} />
              <span className="text-xs" style={{ color: "var(--color-earth-400)", fontFamily: "var(--font-inter), sans-serif" }}>
                or
              </span>
              <div className="flex-1 h-px" style={{ background: "var(--color-earth-200)" }} />
            </div>

            {/* Google sign-in — reads ?redirect= from URL and passes it through */}
            <GoogleSignInButton
              redirectTo={searchParams.get("redirect") ?? undefined}
            />

            <p
              className="text-center text-sm mt-5"
              style={{ color: "var(--color-earth-500)", fontFamily: "var(--font-inter), sans-serif" }}
            >
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium underline underline-offset-2 hover:opacity-80 transition-opacity"
                style={{ color: "var(--color-earth-700)" }}
              >
                Create one
              </Link>
            </p>
          </div>

          {/* Guest CTA */}
          <p className="mt-6 text-center text-sm" style={{ color: "var(--color-earth-400)", fontFamily: "var(--font-inter), sans-serif" }}>
            Just browsing?{" "}
            <Link
              href="/checkout"
              className="underline underline-offset-2 hover:opacity-80 transition-opacity"
              style={{ color: "var(--color-earth-500)" }}
            >
              Continue as guest
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
