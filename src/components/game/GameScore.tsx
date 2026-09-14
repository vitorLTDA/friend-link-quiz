import { getRating } from "@/game/config";
import type { ScoreResult } from "@/types/game";

export function GameScore({ score }: { score: ScoreResult }) {
  const rating = getRating(score.percentage);
  const circumference = 2 * Math.PI * 54;
  const dash = (score.percentage / 100) * circumference;

  return (
    <section className="surface-card animate-rise flex flex-col items-center gap-6 p-8 text-center">
      <div className="relative size-40">
        <svg viewBox="0 0 120 120" className="size-full -rotate-90">
          <circle cx="60" cy="60" r="54" className="fill-none stroke-secondary" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r="54"
            className="fill-none stroke-primary transition-all duration-1000"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-4xl font-bold">
            {score.correct}
            <span className="text-muted-foreground">/{score.total}</span>
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {score.percentage}%
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="font-display text-3xl font-bold">{rating.title}</h1>
        <p className="text-sm text-muted-foreground">{rating.blurb}</p>
      </div>

      <dl className="grid w-full grid-cols-3 gap-3">
        <Stat label="Correct" value={score.correct} tone="success" />
        <Stat label="Missed" value={score.incorrect} tone="destructive" />
        <Stat label="Score" value={`${score.percentage}%`} />
      </dl>
    </section>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone?: "success" | "destructive";
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/50 px-3 py-4">
      <dd
        className={
          tone === "success"
            ? "font-display text-2xl font-bold text-success"
            : tone === "destructive"
              ? "font-display text-2xl font-bold text-destructive"
              : "font-display text-2xl font-bold"
        }
      >
        {value}
      </dd>
      <dt className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
    </div>
  );
}
