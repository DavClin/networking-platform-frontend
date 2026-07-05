"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/jobs", label: "Jobs" },
  { href: "/network", label: "Network" },
  { href: "/messages", label: "Messages" },
];

export default function Navigation() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

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
