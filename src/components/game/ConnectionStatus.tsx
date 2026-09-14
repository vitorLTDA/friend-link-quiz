import { AlertTriangle, Loader2, PlugZap, Wifi, WifiOff } from "lucide-react";

import { CONNECTION_COPY } from "@/game/config";
import { cn } from "@/lib/utils";
import type { ConnectionStatus as Status } from "@/types/game";

const TONE: Record<Status, "idle" | "busy" | "good" | "bad"> = {
  idle: "idle",
  initializing: "busy",
  "creating-offer": "busy",
  gathering: "busy",
  "waiting-for-guest": "busy",
  "creating-answer": "busy",
  "waiting-for-host": "busy",
  connecting: "busy",
  connected: "good",
  disconnected: "bad",
  failed: "bad",
  "invalid-data": "bad",
};

export function ConnectionStatus({
  status,
  showHint = false,
  className,
}: {
  status: Status;
  showHint?: boolean;
  className?: string;
}) {
  const tone = TONE[status];
  const copy = CONNECTION_COPY[status];

  const Icon =
    tone === "busy" ? Loader2 : tone === "good" ? Wifi : tone === "bad" ? AlertTriangle : PlugZap;

  return (
    <div className={cn("space-y-1", className)}>
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold",
          tone === "good" && "border-success/40 bg-success/15 text-success",
          tone === "bad" && "border-destructive/40 bg-destructive/15 text-destructive",
          tone === "busy" && "border-primary/40 bg-primary/10 text-primary",
          tone === "idle" && "border-border bg-surface/70 text-muted-foreground",
        )}
      >
        <Icon className={cn("size-3.5", tone === "busy" && "animate-spin")} />
        {copy?.label ?? "Unknown"}
      </div>
      {showHint && copy?.hint ? (
        <p className="text-sm text-muted-foreground">{copy.hint}</p>
      ) : null}
    </div>
  );
}

export function DisconnectedBanner() {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      <WifiOff className="size-4" /> Your friend dropped out. Their progress may be incomplete.
    </div>
  );
}
