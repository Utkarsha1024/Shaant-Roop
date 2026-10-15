"use client";

import { useState, useEffect, useCallback } from "react";
import AdminDashboardLayout from "@/components/admin/AdminDashboardLayout";
import { api } from "@/lib/apiFetch";
import type { Course } from "@/lib/types";

/* ── Form Data Shape ───────────────────────────────────────────────────── */
interface CourseFormData {
  title: string;
  description: string;
  instructor: string;
  price: string;
  duration: string;
}

const EMPTY_FORM: CourseFormData = {
  title: "",
  description: "",
  instructor: "",
  price: "",
  duration: "",
};

/* ── Inline Styles ─────────────────────────────────────────────────────── */
const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "12px",
  fontWeight: 600,
  color: "var(--color-earth-600)",
  letterSpacing: "0.04em",
  textTransform: "uppercase" as const,
};

const inputStyle: React.CSSProperties = {
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "14px",
  color: "var(--color-earth-900)",
  background: "white",
  border: "1px solid var(--color-earth-200)",
  borderRadius: "10px",
  padding: "10px 14px",
  width: "100%",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
};

type PageState = "loading" | "error" | "ready";

/* ═══════════════════════════════════════════════════════════════════════ */
export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [pageState, setPageState] = useState<PageState>("loading");
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  /* ── Helpers ──────────────────────────────────────────────────────────── */
  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  /* ── Fetch ───────────────────────────────────────────────────────────── */
  const fetchCourses = useCallback(async () => {
    setPageState("loading");
    setFetchError(null);
    try {
      const data = await api.get<Course[]>("/api/courses");
      setCourses(data);
      setPageState("ready");
    } catch (err) {
      setFetchError((err as Error).message ?? "Failed to load courses.");
      setPageState("error");
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  /* ── Open form for Add / Edit ────────────────────────────────────────── */
  function openAddForm() {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setFormOpen(true);
  }

  function openEditForm(course: Course) {
    setFormData({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      price: String(course.price),
      duration: course.duration,
    });
    setEditingId(course.id);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setFormData(EMPTY_FORM);
    setEditingId(null);
  }

  /* ── Submit (Create / Update) ────────────────────────────────────────── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      instructor: formData.instructor.trim(),
      price: parseFloat(formData.price),
      duration: formData.duration.trim(),
    };

    try {
      if (editingId) {
        // PUT update
        const updated = await api.put<Course>(
          `/api/admin/courses/${editingId}`,
          payload
        );
        setCourses((prev) =>
          prev.map((c) => (c.id === editingId ? updated : c))
        );
        showSuccess(`"${updated.title}" updated successfully!`);
      } else {
        // POST create
        const created = await api.post<Course>("/api/admin/courses", payload);
        setCourses((prev) => [created, ...prev]);
        showSuccess(`"${created.title}" added successfully!`);
      }
      closeForm();
    } catch (err) {
      alert((err as Error).message ?? "Failed to save course.");
    } finally {
      setIsSubmitting(false);
    }
  }

  /* ── Delete ──────────────────────────────────────────────────────────── */
  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this course?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/admin/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c.id !== id));
      showSuccess("Course deleted.");
    } catch (err) {
      alert((err as Error).message ?? "Failed to delete course.");
    } finally {
      setDeletingId(null);
    }
  }

  /* ── Form change ─────────────────────────────────────────────────────── */
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  /* ═══════════════════════════════════════════════════════════════════════ */
  return (
    <AdminDashboardLayout title="Course Management">
      <div className="max-w-6xl space-y-6">
        {/* ── Success toast ──────────────────────────────────────── */}
        {successMessage && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm"
            style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              color: "#15803d",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4 flex-shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {successMessage}
          </div>
        )}

        {/* ── Add / Edit Form (collapsible) ──────────────────────── */}
        <section
          className="rounded-2xl border overflow-hidden"
          style={{
            background: "white",
            borderColor: "var(--color-earth-200)",
            boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
          }}
        >
          {/* Header bar */}
          <button
            type="button"
            onClick={() => (formOpen ? closeForm() : openAddForm())}
            className="w-full flex items-center justify-between px-5 py-4 transition-colors"
            style={{ background: formOpen ? "var(--color-earth-50)" : "white" }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, var(--color-forest-600), var(--color-forest-700))",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth={2}
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </div>
              <span
                className="text-sm font-medium"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  color: "var(--color-earth-800)",
                }}
              >
                {editingId ? "Edit Course" : "Add New Course"}
              </span>
            </div>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className={`w-4 h-4 transition-transform duration-200 ${
                formOpen ? "rotate-180" : ""
              }`}
              style={{ color: "var(--color-earth-400)" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>

          {/* Form body */}
          {formOpen && (
            <form
              onSubmit={handleSubmit}
              className="px-5 pb-5 pt-3 space-y-4"
              style={{
                borderTop: "1px solid var(--color-earth-100)",
              }}
            >
              {/* Title */}
              <div className="space-y-1.5">
                <label htmlFor="course-title" style={labelStyle}>
                  Title <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  id="course-title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Natural Soap Making 101"
                  style={inputStyle}
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label htmlFor="course-description" style={labelStyle}>
                  Description <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <textarea
                  id="course-description"
                  name="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="A detailed overview of what this course covers…"
                  style={{ ...inputStyle, resize: "vertical" as const }}
                />
              </div>

              {/* Row: Instructor + Price + Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="course-instructor" style={labelStyle}>
                    Instructor <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    id="course-instructor"
                    name="instructor"
                    type="text"
                    required
                    value={formData.instructor}
                    onChange={handleChange}
                    placeholder="e.g. Dr. Priya Sharma"
                    style={inputStyle}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="course-price" style={labelStyle}>
                    Price (₹) <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    id="course-price"
                    name="price"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    style={inputStyle}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="course-duration" style={labelStyle}>
                    Duration <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    id="course-duration"
                    name="duration"
                    type="text"
                    required
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g. 4 Weeks"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-60"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-forest-600), var(--color-forest-700))",
                    color: "white",
                    fontFamily: "var(--font-inter), sans-serif",
                    letterSpacing: "0.02em",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="w-4 h-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-20"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="white"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-80"
                          fill="white"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Saving…
                    </>
                  ) : editingId ? (
                    "Update Course"
                  ) : (
                    "Add Course"
                  )}
                </button>
                {formOpen && (
                  <button
                    type="button"
                    onClick={closeForm}
                    className="text-sm transition-colors"
                    style={{
                      color: "var(--color-earth-400)",
                      fontFamily: "var(--font-inter), sans-serif",
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </section>

        {/* ── Course Table ────────────────────────────────────────── */}
        <section aria-labelledby="course-list-heading">
          <div className="flex items-center justify-between mb-4">
            <h2
              id="course-list-heading"
              className="text-xl"
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                color: "var(--color-earth-900)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
              }}
            >
              All Courses
              {pageState === "ready" && (
                <span
                  className="ml-2.5 text-sm align-middle px-2 py-0.5 rounded-full"
                  style={{
                    background: "var(--color-earth-100)",
                    color: "var(--color-earth-600)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontWeight: 500,
                  }}
                >
                  {courses.length}
                </span>
              )}
            </h2>

            <button
              onClick={fetchCourses}
              disabled={pageState === "loading"}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: "var(--color-earth-100)",
                color: "var(--color-earth-600)",
                fontFamily: "var(--font-inter), sans-serif",
              }}
              aria-label="Refresh course list"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className={`w-3.5 h-3.5 ${
                  pageState === "loading" ? "animate-spin" : ""
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              Refresh
            </button>
          </div>

          {/* Loading */}
          {pageState === "loading" && (
            <div
              className="rounded-2xl border py-16 flex flex-col items-center gap-3"
              style={{
                background: "white",
                borderColor: "var(--color-earth-200)",
              }}
            >
              <svg
                className="w-8 h-8 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-20"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="var(--color-earth-400)"
                  strokeWidth="4"
                />
                <path
                  className="opacity-70"
                  fill="var(--color-earth-500)"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <p
                className="text-sm"
                style={{
                  color: "var(--color-earth-400)",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                Loading courses…
              </p>
            </div>
          )}

          {/* Error */}
          {pageState === "error" && (
            <div
              role="alert"
              className="rounded-2xl border px-6 py-10 text-center"
              style={{
                background: "#fef2f2",
                borderColor: "#fecaca",
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              <p className="text-sm mb-3" style={{ color: "#b91c1c" }}>
                {fetchError}
              </p>
              <button
                onClick={fetchCourses}
                className="text-xs underline"
                style={{ color: "#dc2626" }}
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty state */}
          {pageState === "ready" && courses.length === 0 && (
            <div
              className="rounded-2xl border py-16 text-center"
              style={{
                background: "white",
                borderColor: "var(--color-earth-200)",
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                style={{ background: "var(--color-earth-100)" }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="w-6 h-6"
                  style={{ color: "var(--color-earth-400)" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342"
                  />
                </svg>
              </div>
              <p
                className="text-base font-medium mb-1"
                style={{
                  color: "var(--color-earth-700)",
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                }}
              >
                No courses yet
              </p>
              <p
                className="text-xs mb-4"
                style={{
                  color: "var(--color-earth-400)",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                Click &ldquo;Add New Course&rdquo; above to create your first
                course.
              </p>
            </div>
          )}

          {/* Data table */}
          {pageState === "ready" && courses.length > 0 && (
            <div
              className="rounded-2xl border overflow-hidden"
              style={{
                background: "white",
                borderColor: "var(--color-earth-200)",
                boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
              }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid var(--color-earth-100)",
                        background: "var(--color-earth-50)",
                      }}
                    >
                      {["Title", "Instructor", "Duration", "Price", "Actions"].map(
                        (heading) => (
                          <th
                            key={heading}
                            className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider"
                            style={{
                              color: "var(--color-earth-500)",
                              fontFamily: "var(--font-inter), sans-serif",
                            }}
                          >
                            {heading}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr
                        key={course.id}
                        className="transition-colors"
                        style={{
                          borderBottom: "1px solid var(--color-earth-50)",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "var(--color-earth-50)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        {/* Title + description preview */}
                        <td className="px-5 py-3.5 max-w-xs">
                          <p
                            className="text-sm font-medium truncate"
                            style={{
                              color: "var(--color-earth-900)",
                              fontFamily: "var(--font-inter), sans-serif",
                            }}
                          >
                            {course.title}
                          </p>
                          <p
                            className="text-xs truncate mt-0.5"
                            style={{
                              color: "var(--color-earth-400)",
                              fontFamily: "var(--font-inter), sans-serif",
                              maxWidth: "220px",
                            }}
                          >
                            {course.description}
                          </p>
                        </td>

                        {/* Instructor */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                              style={{
                                background:
                                  "linear-gradient(135deg, var(--color-forest-500), var(--color-forest-600))",
                                color: "white",
                                fontFamily: "var(--font-inter), sans-serif",
                              }}
                            >
                              {course.instructor.charAt(0).toUpperCase()}
                            </div>
                            <span
                              className="text-sm"
                              style={{
                                color: "var(--color-earth-700)",
                                fontFamily: "var(--font-inter), sans-serif",
                              }}
                            >
                              {course.instructor}
                            </span>
                          </div>
                        </td>

                        {/* Duration */}
                        <td className="px-5 py-3.5">
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium"
                            style={{
                              background: "var(--color-earth-100)",
                              color: "var(--color-forest-700)",
                              fontFamily: "var(--font-inter), sans-serif",
                            }}
                          >
                            {course.duration}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-5 py-3.5">
                          <span
                            className="text-sm font-semibold"
                            style={{
                              color: "var(--color-forest-700)",
                              fontFamily: "var(--font-inter), sans-serif",
                            }}
                          >
                            {course.price === 0
                              ? "Free"
                              : `₹${course.price.toLocaleString("en-IN")}`}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            {/* Edit */}
                            <button
                              onClick={() => openEditForm(course)}
                              className="p-1.5 rounded-lg transition-colors"
                              style={{ color: "var(--color-earth-400)" }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.color =
                                  "var(--color-forest-600)")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.color =
                                  "var(--color-earth-400)")
                              }
                              aria-label={`Edit ${course.title}`}
                            >
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.75}
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                />
                              </svg>
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(course.id)}
                              disabled={deletingId === course.id}
                              className="p-1.5 rounded-lg transition-colors disabled:opacity-40"
                              style={{ color: "var(--color-earth-400)" }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.color = "#dc2626")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.color =
                                  "var(--color-earth-400)")
                              }
                              aria-label={`Delete ${course.title}`}
                            >
                              {deletingId === course.id ? (
                                <svg
                                  className="w-4 h-4 animate-spin"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <circle
                                    className="opacity-20"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  />
                                  <path
                                    className="opacity-70"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={1.75}
                                  className="w-4 h-4"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </AdminDashboardLayout>
  );
}
