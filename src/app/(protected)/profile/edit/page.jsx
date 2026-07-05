"use client";

import { useEffect, useState } from "react";
import { userService, skillService } from "@/lib/userService";
import { Button, Input, Textarea, Badge, LoadingSpinner, ErrorBanner } from "@/components/ui";

const PROFICIENCY = ["beginner", "intermediate", "advanced", "expert"];

export default function ProfileEditPage() {
  const [profile, setProfile] = useState(null);
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [allSkills, setAllSkills] = useState([]);
  const [mySkills, setMySkills] = useState([]);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    headline: "",
    bio: "",
    location: "",
    company: "",
    website_url: "",
    linkedin_url: "",
    github_url: "",
    years_experience: "",
    is_open_to_work: true,
  });

  useEffect(() => {
    async function load() {
      try {
        const [p, skills] = await Promise.all([
          userService.getMyProfile().catch(() => null),
          skillService.list(),
        ]);
        setAllSkills(skills);
        if (p) {
          setExists(true);
          setProfile(p);
          setForm({
            first_name: p.first_name || "",
            last_name: p.last_name || "",
            headline: p.headline || "",
            bio: p.bio || "",
            location: p.location || "",
            company: p.company || "",
            website_url: p.website_url || "",
            linkedin_url: p.linkedin_url || "",
            github_url: p.github_url || "",
            years_experience: p.years_experience || "",
            is_open_to_work: p.is_open_to_work,
          });
          setMySkills(
            p.skills.map((s) => ({
              skill_id: s.skill_id,
              name: s.name,
              proficiency_level: s.proficiency_level,
              years_experience: s.years_experience,
            }))
          );
        }
      } catch (err) {
        setError(err.message || "Couldn't load your profile.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    const payload = {
      ...form,
      years_experience: form.years_experience ? Number(form.years_experience) : null,
    };
    try {
      if (exists) {
        await userService.updateMyProfile(payload);
      } else {
        await userService.createMyProfile(payload);
        setExists(true);
      }
      setSuccess("Profile saved.");
    } catch (err) {
      setError(err.message || "Couldn't save your profile.");
    } finally {
      setSaving(false);
    }
  }

  function toggleSkill(skill) {
    setMySkills((current) => {
      const found = current.find((s) => s.skill_id === skill.id);
      if (found) return current.filter((s) => s.skill_id !== skill.id);
      return [...current, { skill_id: skill.id, name: skill.name, proficiency_level: "intermediate", years_experience: 1 }];
    });
  }

  function updateSkillField(skillId, field, value) {
    setMySkills((current) =>
      current.map((s) => (s.skill_id === skillId ? { ...s, [field]: value } : s))
    );
  }

  async function handleSaveSkills() {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await userService.setMySkills(
        mySkills.map(({ skill_id, proficiency_level, years_experience }) => ({
          skill_id,
          proficiency_level,
          years_experience: years_experience ? Number(years_experience) : null,
        }))
      );
      setSuccess("Skills updated.");
    } catch (err) {
      setError(err.message || "Couldn't update your skills.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl flex flex-col gap-10">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink mb-6">
          {exists ? "Edit your profile" : "Build your profile"}
        </h1>

        <ErrorBanner message={error} />
        {success && <p className="text-sm text-signal mb-4">{success}</p>}

        <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="First name"
              required
              value={form.first_name}
              onChange={(e) => update("first_name", e.target.value)}
            />
            <Input
              label="Last name"
              required
              value={form.last_name}
              onChange={(e) => update("last_name", e.target.value)}
            />
          </div>
          <Input
            label="Headline"
            placeholder="e.g. Senior Backend Engineer"
            value={form.headline}
            onChange={(e) => update("headline", e.target.value)}
          />
          <Textarea label="Bio" rows={4} value={form.bio} onChange={(e) => update("bio", e.target.value)} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Location" value={form.location} onChange={(e) => update("location", e.target.value)} />
            <Input label="Current company" value={form.company} onChange={(e) => update("company", e.target.value)} />
          </div>
          <Input
            label="Years of experience"
            type="number"
            value={form.years_experience}
            onChange={(e) => update("years_experience", e.target.value)}
          />
          <div className="grid sm:grid-cols-3 gap-4">
            <Input label="Website" value={form.website_url} onChange={(e) => update("website_url", e.target.value)} />
            <Input label="LinkedIn" value={form.linkedin_url} onChange={(e) => update("linkedin_url", e.target.value)} />
            <Input label="GitHub" value={form.github_url} onChange={(e) => update("github_url", e.target.value)} />
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={form.is_open_to_work}
              onChange={(e) => update("is_open_to_work", e.target.checked)}
            />
            Open to work
          </label>

          <Button type="submit" disabled={saving} className="self-start">
            {saving ? "Saving…" : "Save profile"}
          </Button>
        </form>
      </div>

      {exists && (
        <div>
          <h2 className="font-display text-xl font-semibold text-ink mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {allSkills.map((skill) => {
              const selected = mySkills.find((s) => s.skill_id === skill.id);
              return (
                <button
                  key={skill.id}
                  onClick={() => toggleSkill(skill)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                    selected ? "bg-indigo text-white border-indigo" : "border-line text-ink-soft hover:border-indigo"
                  }`}
                >
                  {skill.name}
                </button>
              );
            })}
          </div>

          {mySkills.length > 0 && (
            <div className="flex flex-col gap-2 mb-4">
              {mySkills.map((s) => (
                <div key={s.skill_id} className="flex items-center gap-3 text-sm">
                  <span className="w-32 truncate">{s.name}</span>
                  <select
                    className="border border-line rounded-lg px-2 py-1 text-xs"
                    value={s.proficiency_level || "intermediate"}
                    onChange={(e) => updateSkillField(s.skill_id, "proficiency_level", e.target.value)}
                  >
                    {PROFICIENCY.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    className="w-16 border border-line rounded-lg px-2 py-1 text-xs"
                    value={s.years_experience || ""}
                    onChange={(e) => updateSkillField(s.skill_id, "years_experience", e.target.value)}
                    placeholder="yrs"
                  />
                </div>
              ))}
            </div>
          )}

          <Button onClick={handleSaveSkills} disabled={saving} variant="secondary">
            {saving ? "Saving…" : "Save skills"}
          </Button>
        </div>
      )}
    </div>
  );
}
