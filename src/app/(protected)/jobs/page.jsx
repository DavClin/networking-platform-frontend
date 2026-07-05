"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { jobService } from "@/lib/jobService";
import JobCard from "@/components/JobCard";
import { Button, Select, Input, LoadingSpinner, EmptyState, ErrorBanner } from "@/components/ui";

export default function JobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ job_type: "", remote_type: "", location: "" });

  async function load(activeFilters = filters) {
    setLoading(true);
    setError("");
    try {
      const results = await jobService.search(activeFilters);
      setJobs(results);
    } catch (err) {
      setError(err.message || "Couldn't load jobs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFilterSubmit(e) {
    e.preventDefault();
    load(filters);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-display text-3xl font-semibold text-ink">Job board</h1>
        {user?.role === "employer" && (
          <Link href="/jobs/create">
            <Button>Create job listing</Button>
          </Link>
        )}
      </div>

      <form onSubmit={handleFilterSubmit} className="grid sm:grid-cols-4 gap-3">
        <Input
          placeholder="Location"
          value={filters.location}
          onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
        />
        <Select
          value={filters.job_type}
          onChange={(e) => setFilters((f) => ({ ...f, job_type: e.target.value }))}
        >
          <option value="">Any job type</option>
          <option value="full_time">Full-time</option>
          <option value="part_time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="freelance">Freelance</option>
          <option value="internship">Internship</option>
        </Select>
        <Select
          value={filters.remote_type}
          onChange={(e) => setFilters((f) => ({ ...f, remote_type: e.target.value }))}
        >
          <option value="">Any location type</option>
          <option value="on_site">On-site</option>
          <option value="hybrid">Hybrid</option>
          <option value="remote">Remote</option>
        </Select>
        <Button type="submit" variant="secondary">
          Apply filters
        </Button>
      </form>

      <ErrorBanner message={error} />

      {loading ? (
        <LoadingSpinner />
      ) : jobs.length === 0 ? (
        <EmptyState title="No jobs match those filters" description="Try widening your search." />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
