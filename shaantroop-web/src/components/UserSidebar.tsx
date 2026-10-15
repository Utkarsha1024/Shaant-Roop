"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/apiFetch";

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Nav link definition ──────────────────────────────────────────────────────

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const ICON_PROFILE = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    className="w-5 h-5 flex-shrink-0"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const ICON_ORDERS = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    className="w-5 h-5 flex-shrink-0"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
    />
  </svg>
);

const USER_NAV: NavItem[] = [
  { href: "/profile", label: "My Profile", icon: ICON_PROFILE },
  { href: "/orders",  label: "My Orders",  icon: ICON_ORDERS  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function UserSidebar({ isOpen, onClose }: UserSidebarProps) {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    onClose();
    try {
      await api.post("/api/auth/logout", {});
    } catch {
      // Server may not have the route yet — ignore and clear client state
    }
    logout();
  };

  return (
    <>
      {/* ── Backdrop ──────────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: "rgba(15,28,13,0.55)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Panel ─────────────────────────────────────────────────── */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="User navigation menu"
        className={`fixed top-0 left-0 h-full w-72 z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "var(--color-cream)",
          borderRight: "1px solid var(--color-earth-200)",
          boxShadow: "8px 0 32px rgba(15,28,13,0.12)",
        }}
      >
        {/* ── Header ────────────────────────────────────────────── */}
        <div
          className="flex items-start justify-between px-5 py-5 border-b"
          style={{ borderColor: "var(--color-earth-200)" }}
        >
          <div className="flex-1 min-w-0">
            {isLoading ? null : user ? (
              <>
                {/* Avatar */}
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white text-base font-semibold mb-3 shadow-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-forest-600), var(--color-forest-400))",
                    fontFamily: "var(--font-inter), sans-serif",
                  }}
                  aria-hidden="true"
                >
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <p
                  className="text-base font-medium leading-tight truncate"
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontSize: "1.2rem",
                    color: "var(--color-forest-800)",
                  }}
                >
                  {user.email}
                </p>
                <p
                  className="text-xs mt-0.5 truncate"
                  style={{
                    color: "var(--color-earth-500)",
                    fontFamily: "var(--font-inter), sans-serif",
                  }}
                >
                  {user.email}
                </p>
              </>
            ) : (
              <p
                className="text-lg"
                style={{
                  fontFamily: "var(--font-cormorant), Georgia, serif",
                  color: "var(--color-forest-800)",
                }}
              >
                Welcome
              </p>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="ml-3 p-2 rounded-lg transition-colors hover:bg-[--color-forest-50] flex-shrink-0 mt-0.5"
            style={{ color: "var(--color-forest-600)" }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Navigation ────────────────────────────────────────── */}
        <nav
          aria-label="User navigation"
          className="flex-1 overflow-y-auto px-4 py-4 space-y-1"
        >
          {user ? (
            <>
              {/* Authenticated nav items */}
              {USER_NAV.map(({ href, label, icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    aria-current={isActive ? "page" : undefined}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-150"
                    style={{
                      background: isActive
                        ? "linear-gradient(135deg, rgba(35,74,49,0.10), rgba(244,193,48,0.07))"
                        : "transparent",
                      color: isActive
                        ? "var(--color-forest-700)"
                        : "var(--color-forest-800)",
                      fontFamily: "var(--font-inter), sans-serif",
                      boxShadow: isActive
                        ? "inset 0 0 0 1px rgba(35,74,49,0.15)"
                        : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        e.currentTarget.style.background =
                          "rgba(35,74,49,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {/* Icon — tinted gold when active, forest when inactive */}
                    <span
                      style={{
                        color: isActive
                          ? "var(--color-gold-500)"
                          : "var(--color-forest-500)",
                      }}
                    >
                      {icon}
                    </span>
                    {label}

                    {/* Active indicator pill */}
                    {isActive && (
                      <span
                        className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: "var(--color-gold-400)" }}
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                );
              })}

              {/* ── Admin Dashboard ──────────────────────────────── */}
              {user.role === "ADMIN" && (
                <>
                  <div className="pt-2 pb-1 px-3">
                    <div
                      className="h-px"
                      style={{ background: "var(--color-earth-200)" }}
                      role="separator"
                    />
                  </div>
                  <Link
                    href="/admin"
                    onClick={onClose}
                    aria-current={pathname.startsWith("/admin") ? "page" : undefined}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-150"
                    style={{
                      color: "var(--color-forest-700)",
                      background: pathname.startsWith("/admin")
                        ? "linear-gradient(135deg, rgba(47,74,40,0.15), rgba(212,160,23,0.12))"
                        : "linear-gradient(135deg, rgba(47,74,40,0.10), rgba(212,160,23,0.08))",
                      fontFamily: "var(--font-inter), sans-serif",
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.75}
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: "var(--color-gold-500)" }}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 3h7.5M3.75 3v7.5M3.75 3l6.75 6.75m4.5-6.75h7.5M21 3v7.5M21 3l-6.75 6.75M3.75 21h7.5m-7.5 0v-7.5m0 7.5l6.75-6.75M21 21h-7.5m7.5 0v-7.5M21 21l-6.75-6.75"
                      />
                    </svg>
                    Admin Dashboard
                    <span
                      className="ml-auto text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                      style={{
                        background: "var(--color-gold-400)",
                        color: "white",
                        fontFamily: "var(--font-inter), sans-serif",
                      }}
                    >
                      Admin
                    </span>
                  </Link>
                </>
              )}
            </>
          ) : (
            /* ── Guest links ──────────────────────────────────── */
            <>
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all hover:bg-[--color-forest-50]"
                style={{
                  color: "var(--color-forest-800)",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color: "var(--color-forest-500)" }}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                  />
                </svg>
                Log In
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all hover:bg-[--color-forest-50]"
                style={{
                  color: "var(--color-forest-800)",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color: "var(--color-forest-500)" }}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                  />
                </svg>
                Create Account
              </Link>
            </>
          )}
        </nav>

        {/* ── Footer: Log Out ───────────────────────────────────── */}
        {user && (
          <div
            className="px-4 py-4 border-t"
            style={{ borderColor: "var(--color-earth-200)" }}
          >
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all hover:bg-red-50"
              style={{
                color: "#b91c1c",
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                className="w-5 h-5 flex-shrink-0"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
              Log Out
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
