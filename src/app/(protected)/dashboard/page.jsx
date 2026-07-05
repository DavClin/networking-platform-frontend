"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { jobService } from "@/lib/jobService";
import { userService } from "@/lib/userService";
import JobCard from "@/components/JobCard";
import { Button, Card, LoadingSpinner, EmptyState, ErrorBanner } from "@/components/ui";

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    async function load() {
      setLoading(true);
      setError("");
      try {
        if (user.role === "job_seeker") {
          const myProfile = await userService.getMyProfile().catch(() => null);
          setProfile(myProfile);
          if (myProfile) {
            const recs = await jobService.recommended(6);
            setJobs(recs);
          }
        } else {
          const open = await jobService.search({ limit: 6 });
          setJobs(open);
        }
      } catch (err) {
        setError(err.message || "Couldn't load your dashboard.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">
          Welcome back, {user?.username}
        </h1>
        <p className="text-ink-soft mt-1">
          {user?.role === "job_seeker"
            ? "Here's what's matching your skills right now."
            : "Here's what's happening on the job board."}
        </p>
      </div>

      <ErrorBanner message={error} />

      {user?.role === "job_seeker" && !loading && !profile && (
        <Card className="p-6 flex items-center justify-between gap-6 flex-wrap">
          <div>
            <p className="font-display font-semibold text-lg text-ink mb-1">
              Set up your profile to get matched
            </p>
            <p className="text-sm text-ink-soft">
              Add your skills so we can score jobs against them.
            </p>
          </div>
          <Link href="/profile/edit">
            <Button>Build my profile</Button>
          </Link>
        </Card>
      )}

      {user?.role === "employer" && (
        <Card className="p-6 flex items-center justify-between gap-6 flex-wrap">
          <div>
            <p className="font-display font-semibold text-lg text-ink mb-1">Post a new role</p>
            <p className="text-sm text-ink-soft">Reach candidates matched by required skills.</p>
          </div>
          <Link href="/jobs/create">
            <Button>Create job listing</Button>
          </Link>
        </Card>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-ink">
            {user?.role === "job_seeker" ? "Matched for you" : "Recently posted"}
          </h2>
          <Link href="/jobs" className="text-sm font-medium text-indigo">
            View all →
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : jobs.length === 0 ? (
          <EmptyState
            title="No jobs to show yet"
            description={
              user?.role === "job_seeker"
                ? "Add skills to your profile, then check back here."
                : "Post your first job listing to see it here."
            }
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
