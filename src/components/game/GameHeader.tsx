import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

export function GameHeader({ right }: { right?: ReactNode }) {
  return (
    <header className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 px-5 pt-6">
      <Link to="/" className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground">
          <Sparkles className="size-4" />
        </span>
        <span className="font-display text-lg font-bold tracking-tight">Do You Know Me?</span>
      </Link>
      {right}
    </header>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 pb-16 pt-6 sm:pt-8">
      <div className="space-y-6">{children}</div>
    </main>
  );
}
