"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { jobService } from "@/lib/jobService";
import { skillService } from "@/lib/userService";
import { Button, Input, Select, Textarea, ErrorBanner, Badge } from "@/components/ui";

export default function CreateJobPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]); // { skill_id, name, is_required }
  const [form, setForm] = useState({
    title: "",
    description: "",
    job_type: "full_time",
    location: "",
    remote_type: "remote",
    salary_min: "",
    salary_max: "",
    currency: "USD",
    company_name: "",
    experience_level: "mid",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    skillService.list().then(setAllSkills).catch(() => {});
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleSkill(skill) {
    setSelectedSkills((current) => {
      const exists = current.find((s) => s.skill_id === skill.id);
      if (exists) return current.filter((s) => s.skill_id !== skill.id);
      return [...current, { skill_id: skill.id, name: skill.name, is_required: true }];
    });
  }

  function toggleRequired(skillId) {
    setSelectedSkills((current) =>
      current.map((s) => (s.skill_id === skillId ? { ...s, is_required: !s.is_required } : s))
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const job = await jobService.create({
        ...form,
        salary_min: form.salary_min ? Number(form.salary_min) : null,
        salary_max: form.salary_max ? Number(form.salary_max) : null,
        skills: selectedSkills.map(({ skill_id, is_required }) => ({ skill_id, is_required })),
      });
      router.push(`/jobs/${job.id}`);
    } catch (err) {
      setError(err.message || "Couldn't create this job listing.");
    } finally {
      setSubmitting(false);
    }
  }

  if (user && user.role !== "employer") {
    return (
      <div className="text-center py-16">
        <p className="font-display text-lg">Only employer accounts can post jobs.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-semibold text-ink mb-6">Post a job</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <ErrorBanner message={error} />

        <Input label="Title" required value={form.title} onChange={(e) => update("title", e.target.value)} />
        <Input
          label="Company name"
          value={form.company_name}
          onChange={(e) => update("company_name", e.target.value)}
        />
        <Textarea
          label="Description"
          required
          rows={5}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <Select label="Job type" value={form.job_type} onChange={(e) => update("job_type", e.target.value)}>
            <option value="full_time">Full-time</option>
            <option value="part_time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="freelance">Freelance</option>
            <option value="internship">Internship</option>
          </Select>
          <Select
            label="Location type"
            value={form.remote_type}
            onChange={(e) => update("remote_type", e.target.value)}
          >
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="on_site">On-site</option>
          </Select>
        </div>

        <Input label="Location" value={form.location} onChange={(e) => update("location", e.target.value)} />

        <div className="grid sm:grid-cols-3 gap-4">
          <Input
            label="Min salary"
            type="number"
            value={form.salary_min}
            onChange={(e) => update("salary_min", e.target.value)}
          />
          <Input
            label="Max salary"
            type="number"
            value={form.salary_max}
            onChange={(e) => update("salary_max", e.target.value)}
          />
          <Select
            label="Experience level"
            value={form.experience_level}
            onChange={(e) => update("experience_level", e.target.value)}
          >
            <option value="entry">Entry</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </Select>
        </div>

        <div>
          <span className="block text-sm font-medium text-ink-soft mb-2">
            Required / nice-to-have skills
          </span>
          <div className="flex flex-wrap gap-2">
            {allSkills.map((skill) => {
              const selected = selectedSkills.find((s) => s.skill_id === skill.id);
              return (
                <button
                  type="button"
                  key={skill.id}
                  onClick={() => toggleSkill(skill)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                    selected
                      ? "bg-indigo text-white border-indigo"
                      : "border-line text-ink-soft hover:border-indigo"
                  }`}
                >
                  {skill.name}
                </button>
              );
            })}
          </div>

          {selectedSkills.length > 0 && (
            <div className="mt-3 flex flex-col gap-1.5">
              {selectedSkills.map((s) => (
                <div key={s.skill_id} className="flex items-center gap-2 text-sm">
                  <span className="w-32 truncate">{s.name}</span>
                  <button
                    type="button"
                    onClick={() => toggleRequired(s.skill_id)}
                    className="cursor-pointer"
                  >
                    <Badge tone={s.is_required ? "amber" : "neutral"}>
                      {s.is_required ? "Required" : "Nice to have"}
                    </Badge>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button type="submit" disabled={submitting} className="mt-2 self-start">
          {submitting ? "Publishing…" : "Publish job"}
        </Button>
      </form>
    </div>
  );
}
