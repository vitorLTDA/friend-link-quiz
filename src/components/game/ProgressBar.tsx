import { cn } from "@/lib/utils";

export function ProgressBar({
  current,
  total,
  className,
}: {
  current: number;
  total: number;
  className?: string;
}) {
  const percent = total === 0 ? 0 : Math.min(100, Math.round((current / total) * 100));
  return (
    <div className={cn("space-y-2", className)}>
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-secondary"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-gradient-primary transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex justify-between text-xs font-medium text-muted-foreground">
        <span>
          Question {Math.min(current + 1, total)} of {total}
        </span>
        <span>{percent}%</span>
      </div>
    </div>
  );
}
