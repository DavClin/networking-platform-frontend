"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import MatchRing from "@/components/MatchRing";
import { Button } from "@/components/ui";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);

  return (
    <main className="flex-1 flex flex-col">
      <header className="mx-auto max-w-6xl w-full px-6 h-16 flex items-center justify-between">
        <span className="font-display text-xl font-semibold tracking-tight">Bridge</span>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-ink-soft hover:text-ink">
            Log in
          </Link>
          <Link href="/signup">
            <Button className="!py-2">Get started</Button>
          </Link>
        </div>
      </header>

      <section className="flex-1 mx-auto max-w-6xl w-full px-6 grid md:grid-cols-2 gap-12 items-center py-16 md:py-24">
        <div>
          <p className="font-data text-xs tracking-widest uppercase text-indigo mb-4">
            Skill-matched, not keyword-matched
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold leading-[1.1] text-ink text-balance">
            Know your match before you apply.
          </h1>
          <p className="mt-5 text-ink-soft text-lg max-w-md">
            Bridge scores every open role against your actual skills — required
            coverage weighted first, nice-to-haves second — so you spend your
            time on jobs you can genuinely land.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link href="/signup">
              <Button>Create your profile</Button>
            </Link>
            <Link href="/jobs" className="text-sm font-medium text-ink-soft hover:text-ink">
              Browse open roles →
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {[
            { title: "Senior Backend Engineer", company: "Nordic Freight Co.", pct: 92 },
            { title: "Product Designer", company: "Halide Studio", pct: 68 },
            { title: "Data Analyst, Ops", company: "Verity Health", pct: 41 },
          ].map((job) => (
            <div
              key={job.title}
              className="flex items-center justify-between gap-4 bg-paper-raised border border-line rounded-2xl p-5"
            >
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-soft mb-1">{job.company}</p>
                <p className="font-display font-semibold text-ink">{job.title}</p>
              </div>
              <MatchRing percentage={job.pct} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
