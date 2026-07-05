"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { jobService } from "@/lib/jobService";
import MatchRing from "@/components/MatchRing";
import { Button, Badge, Textarea, LoadingSpinner, ErrorBanner, Card } from "@/components/ui";

const STATUS_TONE = {
  pending: "neutral",
  reviewed: "amber",
  shortlisted: "amber",
  accepted: "signal",
  rejected: "danger",
  withdrawn: "danger",
};

export default function JobDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applications, setApplications] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await jobService.get(id);
        setJob(data);
        if (user?.role === "employer" && data.employer_id === user.id) {
          const apps = await jobService.listApplicationsForJob(id).catch(() => []);
          setApplications(apps);
        }
      } catch (err) {
        setError(err.message || "Couldn't load this job.");
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id, user]);

  async function handleApply(e) {
    e.preventDefault();
    setApplying(true);
    setError("");
    try {
      await jobService.apply(id, { cover_letter: coverLetter || null });
      setApplied(true);
    } catch (err) {
      setError(err.message || "Couldn't submit your application.");
    } finally {
      setApplying(false);
    }
  }

  async function handleStatusChange(applicationId, status) {
    try {
      const updated = await jobService.updateApplicationStatus(applicationId, status);
      setApplications((current) => current.map((a) => (a.id === updated.id ? updated : a)));
    } catch (err) {
      setError(err.message || "Couldn't update application status.");
    }
  }

  if (loading) return <LoadingSpinner />;
  if (!job) return <ErrorBanner message={error || "Job not found."} />;

  const isOwner = user?.role === "employer" && job.employer_id === user.id;
  const canApply = user?.role === "job_seeker" && job.status === "open";

  return (
    <div className="max-w-3xl flex flex-col gap-8">
      <div>
        <p className="text-xs font-medium text-ink-soft uppercase tracking-wide mb-1">
          {job.company_name || "Company not listed"}
        </p>
        <div className="flex items-start justify-between gap-4">
          <h1 className="font-display text-3xl font-semibold text-ink">{job.title}</h1>
          {job.match_percentage !== null && job.match_percentage !== undefined && (
            <MatchRing percentage={job.match_percentage} size={64} />
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge>{job.job_type.replace("_", " ")}</Badge>
          {job.remote_type && <Badge>{job.remote_type.replace("_", " ")}</Badge>}
          {job.location && <Badge>{job.location}</Badge>}
          {job.experience_level && <Badge>{job.experience_level}</Badge>}
        </div>
      </div>

      <ErrorBanner message={error} />

      <div className="whitespace-pre-wrap text-ink-soft leading-relaxed">{job.description}</div>

      {job.skills?.length > 0 && (
        <div>
          <h2 className="font-display font-semibold text-ink mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((s) => (
              <Badge key={s.skill_id} tone={s.is_required ? "amber" : "neutral"}>
                {s.name} {s.is_required ? "· required" : ""}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {canApply && !applied && (
        <Card className="p-6">
          <h2 className="font-display font-semibold text-ink mb-3">Apply for this role</h2>
          <form onSubmit={handleApply} className="flex flex-col gap-3">
            <Textarea
              placeholder="Add a short note for the employer (optional)"
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
            <Button type="submit" disabled={applying} className="self-start">
              {applying ? "Submitting…" : "Submit application"}
            </Button>
          </form>
        </Card>
      )}

      {applied && (
        <Card className="p-6 bg-signal-soft border-none">
          <p className="font-medium text-signal">Application submitted — good luck!</p>
        </Card>
      )}

      {isOwner && applications && (
        <div>
          <h2 className="font-display font-semibold text-ink mb-3">
            Applications ({applications.length})
          </h2>
          {applications.length === 0 ? (
            <p className="text-sm text-ink-soft">No applications yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {applications.map((app) => (
                <Card key={app.id} className="p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-sm text-ink-soft font-data">Applicant #{app.user_id.slice(-6)}</p>
                    {app.cover_letter && <p className="text-sm text-ink mt-1">{app.cover_letter}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={STATUS_TONE[app.status]}>{app.status}</Badge>
                    <select
                      className="text-xs border border-line rounded-lg px-2 py-1"
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    >
                      {["pending", "reviewed", "shortlisted", "accepted", "rejected"].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
