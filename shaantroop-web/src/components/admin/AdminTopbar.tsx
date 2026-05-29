"use client";

interface AdminTopbarProps {
  onMenuClick: () => void;
  title: string;
}

export default function AdminTopbar({ onMenuClick, title }: AdminTopbarProps) {
  return (
    <header
      className="sticky top-0 z-20 flex items-center gap-4 px-4 sm:px-6 py-4 border-b"
      style={{
        background: "rgba(253, 248, 243, 0.85)",
        backdropFilter: "blur(12px)",
        borderColor: "var(--color-earth-200)",
      }}
    >
      {/* Hamburger (mobile) */}
      <button
        className="lg:hidden p-2 rounded-lg transition-colors"
        style={{ color: "var(--color-earth-700)" }}
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        aria-controls="admin-sidebar"
        aria-expanded="false"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Page title */}
      <h1
        className="text-xl sm:text-2xl flex-1 truncate"
        style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          color: "var(--color-earth-900)",
          fontWeight: 400,
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h1>

      {/* Admin badge */}
      <span
        className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
        style={{
          background: "var(--color-earth-100)",
          color: "var(--color-earth-700)",
          fontFamily: "var(--font-inter), sans-serif",
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: "var(--color-terracotta)" }}
        />
        Admin
      </span>
    </header>
  );
}
