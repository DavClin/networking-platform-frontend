"use client";

/**
 * The signature visual element of the app: a radial ring showing how well
 * a job seeker's skills match a job listing. Pulled directly from the
 * match_percentage the backend calculates (70% required-skill coverage +
 * 30% overall overlap).
 */
export default function MatchRing({ percentage, size = 56 }) {
  if (percentage === null || percentage === undefined) return null;

  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const color =
    percentage >= 75 ? "var(--color-signal)" : percentage >= 40 ? "var(--color-amber)" : "var(--color-ink-soft)";

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-data text-xs font-medium" style={{ color }}>
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
}
