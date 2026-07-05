"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button, Input, ErrorBanner } from "@/components/ui";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight">
          Bridge
        </Link>
        <h1 className="font-display text-2xl font-semibold mt-6 mb-1">Welcome back</h1>
        <p className="text-sm text-ink-soft mb-8">Log in to your account.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <ErrorBanner message={error} />

          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            type="password"
            required
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            placeholder="Your password"
          />

          <Button type="submit" disabled={submitting} className="mt-2">
            {submitting ? "Logging in…" : "Log in"}
          </Button>
        </form>

        <p className="text-sm text-ink-soft mt-6 text-center">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-indigo font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
