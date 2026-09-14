import { Link2 } from "lucide-react";

import { CopyButton } from "./CopyButton";

interface ShareLinkProps {
  link: string;
  title?: string;
  description?: string;
  copyLabel?: string;
}

export function ShareLink({ link, title, description, copyLabel = "Copy link" }: ShareLinkProps) {
  return (
    <div className="space-y-3">
      {title ? <p className="font-display text-sm font-semibold">{title}</p> : null}
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 px-4 py-3">
        <Link2 className="size-4 shrink-0 text-primary" />
        <p className="truncate text-sm text-muted-foreground">{link}</p>
      </div>
      <CopyButton value={link} label={copyLabel} full />
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}
