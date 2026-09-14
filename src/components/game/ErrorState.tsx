import { Link } from "@tanstack/react-router";
import { AlertTriangle, RotateCcw } from "lucide-react";

import { GameButton } from "./GameButton";

interface ErrorStateProps {
  title: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({ title, message, onRetry, retryLabel = "Try again" }: ErrorStateProps) {
  return (
    <section className="surface-card animate-rise flex flex-col items-center gap-5 p-8 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-destructive/15 text-destructive">
        <AlertTriangle className="size-6" />
      </span>
      <div className="space-y-2">
        <h2 className="font-display text-2xl font-bold">{title}</h2>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        {onRetry ? (
          <GameButton onClick={onRetry}>
            <RotateCcw className="size-4" /> {retryLabel}
          </GameButton>
        ) : null}
        <GameButton variant="outline" asChild>
          <Link to="/">Back to start</Link>
        </GameButton>
      </div>
    </section>
  );
}
