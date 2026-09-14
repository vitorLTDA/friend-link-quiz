import { cn } from "@/lib/utils";

interface PlayerAvatarProps {
  name: string;
  emoji?: string;
  tone?: "primary" | "accent";
  size?: "sm" | "md";
  online?: boolean;
}

export function PlayerAvatar({
  name,
  emoji,
  tone = "primary",
  size = "md",
  online,
}: PlayerAvatarProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div
          className={cn(
            "flex items-center justify-center rounded-2xl font-display font-bold",
            tone === "primary"
              ? "bg-gradient-primary text-primary-foreground"
              : "bg-gradient-accent text-accent-foreground",
            size === "md" ? "size-11 text-lg" : "size-9 text-base",
          )}
        >
          {emoji ?? name.slice(0, 1).toUpperCase()}
        </div>
        {online !== undefined ? (
          <span
            className={cn(
              "absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-background",
              online ? "bg-success" : "bg-muted-foreground",
            )}
          />
        ) : null}
      </div>
      <span className="text-sm font-medium">{name}</span>
    </div>
  );
}
