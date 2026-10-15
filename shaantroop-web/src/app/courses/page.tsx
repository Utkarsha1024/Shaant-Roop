"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/apiFetch";
import type { Course } from "@/lib/types";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Course[]>("/api/courses")
      .then((data) => setCourses(data))
      .catch(() => setError("Unable to load courses. Please try again later."))
      .finally(() => setIsLoading(false));
  }, []);

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
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
            Loading courses…
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen py-28 px-5 sm:px-8"
      style={{ background: "var(--color-cream)" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* ── Page header ─────────────────────────────────────────────── */}
        <div className="mb-12 text-center">
          <p
            className="text-xs tracking-[0.25em] uppercase mb-2"
            style={{
              color: "var(--color-gold-500)",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            Learn & Grow
          </p>
          <h1
            className="leading-tight"
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "var(--color-forest-800)",
              letterSpacing: "-0.02em",
            }}
          >
            Our Courses
          </h1>
          <p
            className="mt-3 max-w-xl mx-auto text-sm sm:text-base"
            style={{
              color: "var(--color-earth-500)",
              fontFamily: "var(--font-inter), sans-serif",
              lineHeight: "1.7",
            }}
          >
            Discover the art and science behind natural skincare. Learn from
            experts and elevate your craft.
          </p>
          <div
            className="mt-4 h-px w-16 mx-auto"
            style={{
              background:
                "linear-gradient(to right, transparent, var(--color-gold-400), transparent)",
            }}
            aria-hidden="true"
          />
        </div>

        {/* ── Error state ──────────────────────────────────────────────── */}
        {error && (
          <div
            className="max-w-lg mx-auto px-5 py-4 rounded-xl text-sm font-medium text-center mb-10"
            style={{
              background: "rgba(185,28,28,0.08)",
              color: "#b91c1c",
              fontFamily: "var(--font-inter), sans-serif",
              border: "1px solid rgba(185,28,28,0.2)",
            }}
            role="alert"
          >
            ✕ {error}
          </div>
        )}

        {/* ── Empty state ──────────────────────────────────────────────── */}
        {!error && courses.length === 0 && (
          <div className="text-center py-20">
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: "var(--color-earth-100)" }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="w-7 h-7"
                style={{ color: "var(--color-earth-400)" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.331 0 4.512.645 6.374 1.766m0-13.474a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.534v14.534"
                />
              </svg>
            </div>
            <p
              className="text-lg font-medium mb-1"
              style={{
                color: "var(--color-forest-800)",
                fontFamily: "var(--font-cormorant), Georgia, serif",
              }}
            >
              Courses coming soon
            </p>
            <p
              className="text-sm"
              style={{
                color: "var(--color-earth-400)",
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              We&apos;re preparing something special. Stay tuned!
            </p>
          </div>
        )}

        {/* ── Course grid ──────────────────────────────────────────────── */}
        {courses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <article
                key={course.id}
                className="group rounded-2xl border overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                style={{
                  background: "white",
                  borderColor: "var(--color-earth-200)",
                  boxShadow: "0 2px 12px rgba(15,28,13,0.05)",
                }}
              >
                {/* ── Decorative top bar ──────────────────────────────── */}
                <div
                  className="h-1.5"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--color-forest-600), var(--color-gold-400))",
                  }}
                  aria-hidden="true"
                />

                {/* ── Card body ───────────────────────────────────────── */}
                <div className="flex-1 p-6 flex flex-col">
                  {/* Duration badge */}
                  <span
                    className="inline-flex items-center self-start px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase mb-3"
                    style={{
                      background: "var(--color-earth-100)",
                      color: "var(--color-forest-700)",
                      fontFamily: "var(--font-inter), sans-serif",
                    }}
                  >
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3.5 h-3.5 mr-1 opacity-60"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {course.duration}
                  </span>

                  {/* Title */}
                  <h2
                    className="text-xl leading-snug mb-2"
                    style={{
                      fontFamily: "var(--font-cormorant), Georgia, serif",
                      fontWeight: 600,
                      color: "var(--color-forest-800)",
                    }}
                  >
                    {course.title}
                  </h2>

                  {/* Description */}
                  <p
                    className="text-sm flex-1 mb-4"
                    style={{
                      color: "var(--color-earth-500)",
                      fontFamily: "var(--font-inter), sans-serif",
                      lineHeight: "1.65",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {course.description}
                  </p>

                  {/* Instructor */}
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--color-forest-500), var(--color-forest-600))",
                        color: "white",
                        fontFamily: "var(--font-inter), sans-serif",
                      }}
                      aria-hidden="true"
                    >
                      {course.instructor.charAt(0).toUpperCase()}
                    </div>
                    <span
                      className="text-xs font-medium"
                      style={{
                        color: "var(--color-earth-600)",
                        fontFamily: "var(--font-inter), sans-serif",
                      }}
                    >
                      {course.instructor}
                    </span>
                  </div>

                  {/* ── Footer: price ──────────────────────────────────── */}
                  <div
                    className="pt-4 border-t flex items-center justify-between"
                    style={{ borderColor: "var(--color-earth-100)" }}
                  >
                    <span
                      className="text-lg font-semibold"
                      style={{
                        color: "var(--color-forest-700)",
                        fontFamily: "var(--font-inter), sans-serif",
                      }}
                    >
                      {course.price === 0
                        ? "Free"
                        : `₹${course.price.toLocaleString("en-IN")}`}
                    </span>
                    <span
                      className="text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 group-hover:scale-105"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--color-forest-600), var(--color-forest-700))",
                        color: "white",
                        fontFamily: "var(--font-inter), sans-serif",
                        letterSpacing: "0.05em",
                      }}
                    >
                      View Details
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* ── Back to shop ───────────────────────────────────────────── */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-sm transition-colors hover:text-[--color-gold-500]"
            style={{
              color: "var(--color-earth-500)",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            ← Back to the Shop
          </Link>
        </div>
      </div>
    </main>
  );
}
