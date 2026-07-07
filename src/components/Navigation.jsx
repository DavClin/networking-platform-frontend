"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { notificationService } from "@/lib/notificationService";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/jobs", label: "Jobs" },
  { href: "/network", label: "Network" },
  { href: "/messages", label: "Messages" },
];

function BellIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.73 21a2 2 0 0 1-3.46 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Navigation() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    function refresh() {
      notificationService
        .unreadCount()
        .then((data) => {
          if (!cancelled) setUnreadCount(data.unread_count);
        })
        .catch(() => {});
    }

    refresh();
    const interval = setInterval(refresh, 30000); // poll every 30s
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [user, pathname]);

  if (!user) return null;

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <header className="border-b border-line bg-paper-raised sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="font-display text-xl font-semibold text-ink tracking-tight">
          Bridge
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const active = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  active ? "bg-indigo text-white" : "text-ink-soft hover:bg-paper"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/notifications"
            className="relative p-2 rounded-full hover:bg-paper text-ink-soft hover:text-ink transition-colors"
            aria-label="Notifications"
          >
            <BellIcon className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-amber text-white text-[10px] font-data font-medium flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
          <Link
            href="/profile/edit"
            className="text-sm font-medium text-ink-soft hover:text-ink hidden sm:inline"
          >
            {user.username}
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm font-medium px-3 py-1.5 rounded-full border border-line hover:bg-paper text-ink-soft hover:text-ink transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
      {/* Mobile nav */}
      <nav className="md:hidden flex overflow-x-auto gap-1 px-4 pb-3">
        {links.map((link) => {
          const active = pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                active ? "bg-indigo text-white" : "text-ink-soft bg-paper"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
