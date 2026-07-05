"use client";

import Navigation from "@/components/Navigation";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { LoadingSpinner } from "@/components/ui";

export default function ProtectedLayout({ children }) {
  const { user, loading } = useRequireAuth();

  if (loading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner label="Loading your workspace…" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Navigation />
      <main className="flex-1 mx-auto max-w-6xl w-full px-6 py-8">{children}</main>
    </div>
  );
}
