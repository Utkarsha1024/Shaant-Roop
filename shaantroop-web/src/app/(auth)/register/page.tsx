"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/apiFetch";
import { useAuth } from "@/context/AuthContext";
import type { AuthResponse } from "@/lib/types";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      const data = await api.post<AuthResponse>("/api/auth/register", {
        username,
        email,
        password,
      });
      // Auto-login after successful registration
      login(data.user, data.token);
      setSuccess(true);
      // Redirect to storefront after a brief success moment
      setTimeout(() => router.push("/"), 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      if (message.toLowerCase().includes("username")) {
        setError("That username is already taken. Please choose another.");
      } else if (message.toLowerCase().includes("email")) {
        setError("That email is already registered. Try signing in instead.");
      } else if (message.toLowerCase().includes("failed to fetch")) {
        setError("Cannot reach the server. Please check your connection and try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--color-cream)" }}>
        <div className="text-center max-w-sm">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "#dcfce7" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8" style={{ color: "#16a34a" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1
            className="text-3xl mb-3"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif", color: "var(--color-earth-900)", fontWeight: 400 }}
          >
            Welcome to Shaant Roop
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--color-earth-500)", fontFamily: "var(--font-inter), sans-serif" }}>
            Your account has been created. Redirecting you to the store…
          </p>
        </div>
      </main>
    );
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
            <Link href="/" className="inline-block no-underline hover:opacity-80 transition-opacity" aria-label="Back to home">
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
                Create an account
              </h1>
            </Link>
            <p className="mt-3 text-sm" style={{ color: "var(--color-earth-500)", fontFamily: "var(--font-inter), sans-serif" }}>
              Join Shaant Roop for faster checkout and order tracking.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-3xl p-8 shadow-sm border" style={{ background: "white", borderColor: "var(--color-earth-200)" }}>
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

            {/* Google sign-up — fastest path to account creation */}
            <GoogleSignInButton />

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px" style={{ background: "var(--color-earth-200)" }} />
              <span className="text-xs" style={{ color: "var(--color-earth-400)", fontFamily: "var(--font-inter), sans-serif" }}>or register with email</span>
              <div className="flex-1 h-px" style={{ background: "var(--color-earth-200)" }} />
            </div>

            <form onSubmit={handleRegister} noValidate className="space-y-5">
              {/* Username */}
              <div>
                <label
                  htmlFor="reg-username"
                  className="block text-xs font-medium mb-1.5 tracking-wide uppercase"
                  style={{ color: "var(--color-earth-600)", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  Username
                </label>
                <input
                  id="reg-username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="your_name"
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

              {/* Email */}
              <div>
                <label
                  htmlFor="reg-email"
                  className="block text-xs font-medium mb-1.5 tracking-wide uppercase"
                  style={{ color: "var(--color-earth-600)", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  Email address
                </label>
                <input
                  id="reg-email"
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

              {/* Password row — side by side on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="reg-password"
                    className="block text-xs font-medium mb-1.5 tracking-wide uppercase"
                    style={{ color: "var(--color-earth-600)", fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    Password
                  </label>
                  <input
                    id="reg-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
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

                <div>
                  <label
                    htmlFor="reg-confirm-password"
                    className="block text-xs font-medium mb-1.5 tracking-wide uppercase"
                    style={{ color: "var(--color-earth-600)", fontFamily: "var(--font-inter), sans-serif" }}
                  >
                    Confirm
                  </label>
                  <input
                    id="reg-confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
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
              </div>

              {/* Terms */}
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-earth-400)", fontFamily: "var(--font-inter), sans-serif" }}>
                By creating an account you agree to our{" "}
                <Link href="/terms" className="underline hover:opacity-80" style={{ color: "var(--color-earth-600)" }}>Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className="underline hover:opacity-80" style={{ color: "var(--color-earth-600)" }}>Privacy Policy</Link>.
              </p>

              {/* Submit */}
              <button
                id="register-submit"
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, var(--color-earth-500), var(--color-earth-600))",
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
                    Creating account…
                  </span>
                ) : (
                  "Create account"
                )}
              </button>
            </form>

            {/* Sign in link */}
            <p className="text-center text-sm mt-6" style={{ color: "var(--color-earth-500)", fontFamily: "var(--font-inter), sans-serif" }}>
              Already have an account?{" "}
              <Link href="/login" className="font-medium underline underline-offset-2 hover:opacity-80 transition-opacity" style={{ color: "var(--color-earth-700)" }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
