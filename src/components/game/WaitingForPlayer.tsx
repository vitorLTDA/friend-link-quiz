import { PHASE_COPY } from "@/game/config";

export function WaitingForPlayer({
  title = PHASE_COPY.waiting.title,
  subtitle = PHASE_COPY.waiting.subtitle,
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="surface-card animate-rise flex flex-col items-center gap-5 p-8 text-center">
      <div className="relative flex size-24 items-center justify-center">
        <span className="animate-pulse-ring absolute inset-0 rounded-full bg-primary/15" />
        <span className="animate-float text-5xl">🎉</span>
      </div>
      <div className="space-y-2">
        <h2 className="font-display text-2xl font-bold">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className="size-2.5 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: `${index * 0.15}s` }}
          />
        ))}
      </div>
    </section>
  );
}
