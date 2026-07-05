"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { userService } from "@/lib/userService";
import { Badge, Card, LoadingSpinner, ErrorBanner } from "@/components/ui";

export default function PublicProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    userService
      .getUserProfile(id)
      .then(setProfile)
      .catch((err) => setError(err.message || "Couldn't load this profile."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!profile) return <ErrorBanner message={error || "Profile not found."} />;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
        <h1 className="font-display text-3xl font-semibold text-ink">
          {profile.first_name} {profile.last_name}
        </h1>
        {profile.is_open_to_work && <Badge tone="signal">Open to work</Badge>}
      </div>
      {profile.headline && <p className="text-lg text-ink-soft mb-1">{profile.headline}</p>}
      {profile.location && <p className="text-sm text-ink-soft mb-6">{profile.location}</p>}

      {profile.bio && <p className="text-ink-soft leading-relaxed mb-8">{profile.bio}</p>}

      {profile.skills?.length > 0 && (
        <Card className="p-5 mb-6">
          <h2 className="font-display font-semibold text-ink mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s) => (
              <Badge key={s.skill_id}>
                {s.name} {s.proficiency_level && `· ${s.proficiency_level}`}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      <div className="flex gap-4 text-sm">
        {profile.website_url && (
          <a href={profile.website_url} target="_blank" rel="noreferrer" className="text-indigo font-medium">
            Website
          </a>
        )}
        {profile.linkedin_url && (
          <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="text-indigo font-medium">
            LinkedIn
          </a>
        )}
        {profile.github_url && (
          <a href={profile.github_url} target="_blank" rel="noreferrer" className="text-indigo font-medium">
            GitHub
          </a>
        )}
      </div>
    </div>
  );
}
