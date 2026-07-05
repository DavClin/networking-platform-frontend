"use client";

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-paper-raised border border-line rounded-2xl ${className}`}>{children}</div>
  );
}

export function Button({ children, variant = "primary", className = "", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-indigo text-white hover:bg-indigo-deep",
    secondary: "bg-transparent border border-line text-ink hover:bg-paper",
    ghost: "bg-transparent text-ink-soft hover:text-ink hover:bg-paper",
    danger: "bg-danger text-white hover:opacity-90",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Input({ label, error, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-ink-soft mb-1.5">{label}</span>}
      <input
        className={`w-full rounded-xl border border-line bg-paper-raised px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/50 focus:border-indigo transition-colors ${className}`}
        {...props}
      />
      {error && <span className="block text-xs text-danger mt-1">{error}</span>}
    </label>
  );
}

export function Textarea({ label, error, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-ink-soft mb-1.5">{label}</span>}
      <textarea
        className={`w-full rounded-xl border border-line bg-paper-raised px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/50 focus:border-indigo transition-colors ${className}`}
        {...props}
      />
      {error && <span className="block text-xs text-danger mt-1">{error}</span>}
    </label>
  );
}

export function Select({ label, error, className = "", children, ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-ink-soft mb-1.5">{label}</span>}
      <select
        className={`w-full rounded-xl border border-line bg-paper-raised px-4 py-2.5 text-sm text-ink focus:border-indigo transition-colors ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <span className="block text-xs text-danger mt-1">{error}</span>}
    </label>
  );
}

export function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-paper text-ink-soft",
    signal: "bg-signal-soft text-signal",
    amber: "bg-amber-soft text-amber",
    danger: "bg-danger-soft text-danger",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function LoadingSpinner({ label = "Loading…" }) {
  return (
    <div className="flex items-center gap-3 text-ink-soft text-sm py-12 justify-center">
      <span className="w-4 h-4 rounded-full border-2 border-line border-t-indigo animate-spin" />
      {label}
    </div>
  );
}

export function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-xl bg-danger-soft text-danger text-sm px-4 py-3 border border-danger/20">
      {message}
    </div>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="text-center py-16 px-6">
      <p className="font-display text-lg text-ink mb-1">{title}</p>
      {description && <p className="text-sm text-ink-soft mb-5 max-w-sm mx-auto">{description}</p>}
      {action}
    </div>
  );
}
