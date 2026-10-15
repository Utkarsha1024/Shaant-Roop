"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/apiFetch";
import type { UserProfileResponseDTO, UserProfileRequestDTO } from "@/lib/types";

/* ── Field-level error state ───────────────────────────────────────────────── */
interface FieldErrors {
  fullName?: string;
  phone?: string;
  addressLine?: string;
  city?: string;
  state?: string;
  country?: string;
}

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfileRequestDTO>({
    fullName: "",
    altContactEmail: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    country: "",
    dateOfBirth: "",
  });
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Redirect guests
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?redirect=/profile");
    }
  }, [user, authLoading, router]);

  // Fetch profile from backend
  useEffect(() => {
    if (!user) return;
    api
      .get<UserProfileResponseDTO>("/api/profile")
      .then((data) =>
        setProfile({
          fullName: data.fullName ?? "",
          altContactEmail: data.altContactEmail ?? "",
          phone: data.phone ?? "",
          addressLine: data.addressLine ?? "",
          city: data.city ?? "",
          state: data.state ?? "",
          country: data.country ?? "",
          dateOfBirth: data.dateOfBirth ?? "",
        })
      )
      .catch(() => {
        /* profile may not exist yet – use empty default */
      })
      .finally(() => setIsFetching(false));
  }, [user]);

  // ── Validation ──────────────────────────────────────────────────────────────
  function validate(): FieldErrors {
    const errs: FieldErrors = {};
    if (!profile.fullName.trim()) errs.fullName = "Full Name is required.";
    if (!profile.phone.trim()) errs.phone = "Phone Number is required.";
    if (!profile.addressLine.trim())
      errs.addressLine = "Address Line is required.";
    if (!profile.city.trim()) errs.city = "City is required.";
    if (!profile.state.trim()) errs.state = "State is required.";
    if (!profile.country.trim()) errs.country = "Country is required.";
    return errs;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSaving(true);
    try {
      const updated = await api.put<UserProfileResponseDTO>(
        "/api/profile",
        profile
      );
      setProfile({
        fullName: updated.fullName ?? "",
        altContactEmail: updated.altContactEmail ?? "",
        phone: updated.phone ?? "",
        addressLine: updated.addressLine ?? "",
        city: updated.city ?? "",
        state: updated.state ?? "",
        country: updated.country ?? "",
      });
      setMessage({ type: "success", text: "Profile saved successfully!" });
    } catch {
      setMessage({
        type: "error",
        text: "Failed to save profile. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (authLoading || isFetching) {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--color-cream)" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
            style={{
              borderTopColor: "var(--color-forest-600)",
              borderRightColor: "var(--color-gold-400)",
            }}
          />
          <p
            className="text-sm"
            style={{
              color: "var(--color-earth-500)",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            Loading profile…
          </p>
        </div>
      </main>
    );
  }

  /* ── Reusable styling helpers ──────────────────────────────────────────────── */
  const inputBase =
    "w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm";
  const inputStyle = (field?: string) => ({
    borderColor:
      field && errors[field as keyof FieldErrors]
        ? "#f87171"
        : "var(--color-earth-200)",
    background: "var(--color-earth-50)",
    color: "var(--color-earth-900)",
    fontFamily: "var(--font-inter), sans-serif",
  });
  const focusGreen = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => (e.currentTarget.style.borderColor = "var(--color-forest-500)");
  const blurField = (
    field: string,
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.currentTarget.style.borderColor =
      errors[field as keyof FieldErrors]
        ? "#f87171"
        : "var(--color-earth-200)";
  };

  const labelStyle = {
    color: "var(--color-forest-700)",
    fontFamily: "var(--font-inter), sans-serif",
  };

  function renderError(field: keyof FieldErrors) {
    if (!errors[field]) return null;
    return (
      <p
        className="mt-1 text-xs font-medium"
        style={{ color: "#ef4444", fontFamily: "var(--font-inter), sans-serif" }}
        role="alert"
      >
        {errors[field]}
      </p>
    );
  }

  return (
    <main
      className="min-h-screen py-28 px-5 sm:px-8"
      style={{ background: "var(--color-cream)" }}
    >
      <div className="max-w-2xl mx-auto">

        {/* ── Page header ─────────────────────────────────────────────── */}
        <div className="mb-10">
          <p
            className="text-xs tracking-[0.25em] uppercase mb-2"
            style={{
              color: "var(--color-gold-500)",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            Account
          </p>
          <h1
            className="leading-tight"
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              color: "var(--color-forest-800)",
              letterSpacing: "-0.02em",
            }}
          >
            My Profile
          </h1>
          {user && (
            <p
              className="mt-1.5 text-sm"
              style={{
                color: "var(--color-earth-600)",
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              {user.email} ·{" "}
              <span className="capitalize">{user.role.toLowerCase()}</span>
            </p>
          )}
          <div
            className="mt-3 h-px w-16"
            style={{
              background:
                "linear-gradient(to right, var(--color-gold-400), transparent)",
            }}
            aria-hidden="true"
          />
        </div>

        {/* ── Card ────────────────────────────────────────────────────── */}
        <div
          className="rounded-2xl border p-6 sm:p-8"
          style={{
            background: "white",
            borderColor: "var(--color-earth-200)",
            boxShadow: "0 4px 24px rgba(15,28,13,0.06)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>

            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium mb-1.5"
                style={labelStyle}
              >
                Full Name <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={profile.fullName}
                onChange={(e) => {
                  setProfile({ ...profile, fullName: e.target.value });
                  if (errors.fullName)
                    setErrors({ ...errors, fullName: undefined });
                }}
                placeholder="Your full name"
                className={inputBase}
                style={inputStyle("fullName")}
                onFocus={focusGreen}
                onBlur={(e) => blurField("fullName", e)}
              />
              {renderError("fullName")}
            </div>

            {/* Email Address (read-only from auth) */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1.5"
                style={labelStyle}
              >
                Email Address <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                id="email"
                type="email"
                readOnly
                value={user?.email ?? ""}
                className={`${inputBase} cursor-not-allowed`}
                style={{
                  ...inputStyle(),
                  opacity: 0.7,
                }}
              />
              <p
                className="mt-1 text-xs"
                style={{
                  color: "var(--color-earth-400)",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                Email is tied to your login and cannot be changed here.
              </p>
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium mb-1.5"
                style={labelStyle}
              >
                Phone Number <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={profile.phone}
                onChange={(e) => {
                  setProfile({ ...profile, phone: e.target.value });
                  if (errors.phone)
                    setErrors({ ...errors, phone: undefined });
                }}
                placeholder="+91 98765 43210"
                className={inputBase}
                style={inputStyle("phone")}
                onFocus={focusGreen}
                onBlur={(e) => blurField("phone", e)}
              />
              {renderError("phone")}
            </div>

            {/* Date of Birth */}
            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium mb-1.5"
                style={labelStyle}
              >
                Date of Birth <span style={{ color: "var(--color-earth-400)", fontWeight: "normal" }}>(Optional)</span>
              </label>
              <input
                id="dateOfBirth"
                type="date"
                value={profile.dateOfBirth || ""}
                onChange={(e) => {
                  setProfile({ ...profile, dateOfBirth: e.target.value });
                }}
                className={inputBase}
                style={inputStyle("dateOfBirth")}
                onFocus={focusGreen}
                onBlur={(e) => blurField("dateOfBirth", e)}
              />
            </div>

            {/* Alt Contact Email (optional) */}
            <div>
              <label
                htmlFor="altEmail"
                className="block text-sm font-medium mb-1.5"
                style={labelStyle}
              >
                Alternative Contact Email
              </label>
              <input
                id="altEmail"
                type="email"
                value={profile.altContactEmail ?? ""}
                onChange={(e) =>
                  setProfile({ ...profile, altContactEmail: e.target.value })
                }
                placeholder="alternate@example.com"
                className={inputBase}
                style={inputStyle()}
                onFocus={focusGreen}
                onBlur={(e) => blurField("", e)}
              />
            </div>

            {/* ── Address section ────────────────────────────────────── */}
            <div
              className="pt-4 border-t"
              style={{ borderColor: "var(--color-earth-100)" }}
            >
              <p
                className="text-xs tracking-[0.2em] uppercase mb-4"
                style={{
                  color: "var(--color-gold-500)",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                Shipping Address
              </p>

              {/* Address Line */}
              <div className="mb-5">
                <label
                  htmlFor="addressLine"
                  className="block text-sm font-medium mb-1.5"
                  style={labelStyle}
                >
                  Address Line <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  id="addressLine"
                  type="text"
                  required
                  value={profile.addressLine}
                  onChange={(e) => {
                    setProfile({ ...profile, addressLine: e.target.value });
                    if (errors.addressLine)
                      setErrors({ ...errors, addressLine: undefined });
                  }}
                  placeholder="House / Flat no., Street, Apartment"
                  className={inputBase}
                  style={inputStyle("addressLine")}
                  onFocus={focusGreen}
                  onBlur={(e) => blurField("addressLine", e)}
                />
                {renderError("addressLine")}
              </div>

              {/* City + State side-by-side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium mb-1.5"
                    style={labelStyle}
                  >
                    City <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    required
                    value={profile.city}
                    onChange={(e) => {
                      setProfile({ ...profile, city: e.target.value });
                      if (errors.city)
                        setErrors({ ...errors, city: undefined });
                    }}
                    placeholder="Mumbai"
                    className={inputBase}
                    style={inputStyle("city")}
                    onFocus={focusGreen}
                    onBlur={(e) => blurField("city", e)}
                  />
                  {renderError("city")}
                </div>
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium mb-1.5"
                    style={labelStyle}
                  >
                    State <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    id="state"
                    type="text"
                    required
                    value={profile.state}
                    onChange={(e) => {
                      setProfile({ ...profile, state: e.target.value });
                      if (errors.state)
                        setErrors({ ...errors, state: undefined });
                    }}
                    placeholder="Maharashtra"
                    className={inputBase}
                    style={inputStyle("state")}
                    onFocus={focusGreen}
                    onBlur={(e) => blurField("state", e)}
                  />
                  {renderError("state")}
                </div>
              </div>

              {/* Country */}
              <div className="mt-4">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium mb-1.5"
                  style={labelStyle}
                >
                  Country <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  id="country"
                  type="text"
                  required
                  value={profile.country}
                  onChange={(e) => {
                    setProfile({ ...profile, country: e.target.value });
                    if (errors.country)
                      setErrors({ ...errors, country: undefined });
                  }}
                  placeholder="India"
                  className={inputBase}
                  style={inputStyle("country")}
                  onFocus={focusGreen}
                  onBlur={(e) => blurField("country", e)}
                />
                {renderError("country")}
              </div>
            </div>

            {/* Status message */}
            {message && (
              <div
                className="px-4 py-3 rounded-xl text-sm font-medium"
                style={{
                  background:
                    message.type === "success"
                      ? "rgba(47,74,40,0.08)"
                      : "rgba(185,28,28,0.08)",
                  color:
                    message.type === "success"
                      ? "var(--color-forest-700)"
                      : "#b91c1c",
                  fontFamily: "var(--font-inter), sans-serif",
                  border: `1px solid ${
                    message.type === "success"
                      ? "rgba(47,74,40,0.2)"
                      : "rgba(185,28,28,0.2)"
                  }`,
                }}
                role="status"
                aria-live="polite"
              >
                {message.type === "success" ? "✓ " : "✕ "}
                {message.text}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3.5 rounded-xl text-sm font-medium tracking-widest uppercase text-white transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-forest-600), var(--color-forest-700))",
                fontFamily: "var(--font-inter), sans-serif",
                letterSpacing: "0.1em",
              }}
            >
              {isSaving ? "Saving…" : "Save Profile"}
            </button>
          </form>
        </div>

        {/* ── Quick link to orders ─────────────────────────────────────── */}
        <div
          className="mt-4 rounded-2xl border px-5 py-4 flex items-center justify-between"
          style={{
            background: "white",
            borderColor: "var(--color-earth-200)",
            boxShadow: "0 2px 8px rgba(15,28,13,0.04)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--color-earth-100)" }}
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="w-4.5 h-4.5"
                style={{ color: "var(--color-forest-600)" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
                />
              </svg>
            </div>
            <div>
              <p
                className="text-sm font-medium"
                style={{
                  color: "var(--color-earth-800)",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                Order History
              </p>
              <p
                className="text-xs"
                style={{
                  color: "var(--color-earth-400)",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                View all your past purchases
              </p>
            </div>
          </div>
          <Link
            href="/orders"
            className="flex-shrink-0 flex items-center gap-1.5 text-sm font-medium transition-colors"
            style={{
              color: "var(--color-forest-600)",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            View
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>

        {/* ── Back to shop ─────────────────────────────────────────────── */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm transition-colors hover:text-[--color-gold-500]"
            style={{
              color: "var(--color-earth-500)",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            ← Back to the Shop
          </a>
        </div>
      </div>
    </main>
  );
}
