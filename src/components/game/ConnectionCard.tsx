import type { ReactNode } from "react";

import { ConnectionStatus } from "./ConnectionStatus";
import { cn } from "@/lib/utils";
import type { ConnectionStatus as Status } from "@/types/game";

interface ConnectionCardProps {
  title: string;
  description?: string;
  status?: Status;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function ConnectionCard({
  title,
  description,
  status,
  children,
  footer,
  className,
}: ConnectionCardProps) {
  return (
    <section className={cn("surface-card animate-rise p-6 sm:p-8", className)}>
      <header className="space-y-2">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        {status ? <ConnectionStatus status={status} showHint className="pt-2" /> : null}
      </header>
      {children ? <div className="mt-6 space-y-5">{children}</div> : null}
      {footer ? <div className="mt-6">{footer}</div> : null}
    </section>
  );
}

export function AdvancedDetails({ data }: { data: Record<string, unknown> | null }) {
  if (!data) return null;
  return (
    <details className="rounded-2xl border border-border bg-background/50 px-4 py-3 text-sm">
      <summary className="cursor-pointer font-medium text-muted-foreground">
        Advanced connection details
      </summary>
      <dl className="mt-3 space-y-1">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{key}</dt>
            <dd className="font-mono text-xs">{String(value)}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
