"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { jobService } from "@/lib/jobService";
import { Badge, Card, LoadingSpinner, EmptyState, ErrorBanner } from "@/components/ui";

const STATUS_TONE = {
  pending: "neutral",
  reviewed: "amber",
  shortlisted: "amber",
  accepted: "signal",
  rejected: "danger",
  withdrawn: "danger",
};

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    jobService
      .myApplications()
      .then(setApplications)
      .catch((err) => setError(err.message || "Couldn't load your applications."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl font-semibold text-ink">My applications</h1>
      <ErrorBanner message={error} />

      {applications.length === 0 ? (
        <EmptyState title="No applications yet" description="Browse the job board and apply to roles that match your skills." />
      ) : (
        <div className="flex flex-col gap-3">
          {applications.map((app) => (
            <Card key={app.id} className="p-4 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <Link href={`/jobs/${app.job_id}`} className="font-medium text-ink hover:text-indigo">
                  View job listing
                </Link>
                {app.cover_letter && <p className="text-sm text-ink-soft mt-1 max-w-md">{app.cover_letter}</p>}
              </div>
              <Badge tone={STATUS_TONE[app.status]}>{app.status}</Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
