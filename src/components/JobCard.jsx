"use client";

import Link from "next/link";
import MatchRing from "@/components/MatchRing";
import { Badge } from "@/components/ui";

const JOB_TYPE_LABELS = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  freelance: "Freelance",
  internship: "Internship",
};

const REMOTE_LABELS = {
  on_site: "On-site",
  hybrid: "Hybrid",
  remote: "Remote",
};

function formatSalary(job) {
  if (!job.salary_min && !job.salary_max) return null;
  const fmt = (n) => `${Math.round(n / 1000)}k`;
  if (job.salary_min && job.salary_max) {
    return `${job.currency} ${fmt(job.salary_min)}–${fmt(job.salary_max)}`;
  }
  return `${job.currency} ${fmt(job.salary_min || job.salary_max)}+`;
}

export default function JobCard({ job }) {
  const salary = formatSalary(job);

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="block bg-paper-raised border border-line rounded-2xl p-5 hover:border-indigo transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-ink-soft uppercase tracking-wide mb-1">
            {job.company_name || "Company not listed"}
          </p>
          <h3 className="font-display text-lg font-semibold text-ink leading-snug truncate">
            {job.title}
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm text-ink-soft">
            {job.location && <span>{job.location}</span>}
            {job.remote_type && <span>· {REMOTE_LABELS[job.remote_type]}</span>}
            {salary && <span className="font-data">· {salary}</span>}
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge>{JOB_TYPE_LABELS[job.job_type]}</Badge>
            {job.experience_level && <Badge>{job.experience_level}</Badge>}
            {job.skills?.slice(0, 3).map((s) => (
              <Badge key={s.skill_id} tone={s.is_required ? "amber" : "neutral"}>
                {s.name}
              </Badge>
            ))}
          </div>
        </div>
        {job.match_percentage !== null && job.match_percentage !== undefined && (
          <MatchRing percentage={job.match_percentage} />
        )}
      </div>
    </Link>
  );
}
