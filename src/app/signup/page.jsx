"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button, Input, Select, ErrorBanner } from "@/components/ui";
import { ApiError } from "@/lib/api";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", username: "", password: "", role: "job_seeker" });
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
      await signup(form);
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
        <h1 className="font-display text-2xl font-semibold mt-6 mb-1">Create your account</h1>
        <p className="text-sm text-ink-soft mb-8">Takes about a minute.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <ErrorBanner message={error} />

          <Select label="I am a…" value={form.role} onChange={(e) => update("role", e.target.value)}>
            <option value="job_seeker">Job seeker</option>
            <option value="employer">Employer</option>
          </Select>

          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@example.com"
          />
          <Input
            label="Username"
            required
            minLength={3}
            value={form.username}
            onChange={(e) => update("username", e.target.value)}
            placeholder="janedoe"
          />
          <Input
            label="Password"
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            placeholder="At least 8 characters"
          />

          <Button type="submit" disabled={submitting} className="mt-2">
            {submitting ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="text-sm text-ink-soft mt-6 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo font-medium">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
