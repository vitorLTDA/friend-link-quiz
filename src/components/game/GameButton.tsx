import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const gameButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-2xl font-display font-semibold tracking-tight transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] select-none",
  {
    variants: {
      variant: {
        primary: "bg-gradient-primary text-primary-foreground shadow-glow hover:brightness-110",
        accent: "bg-gradient-accent text-accent-foreground shadow-card hover:brightness-110",
        outline: "border border-border bg-surface/60 text-foreground hover:bg-surface",
        ghost: "text-muted-foreground hover:text-foreground hover:bg-surface/70",
      },
      size: {
        lg: "h-14 px-7 text-lg",
        md: "h-12 px-5 text-base",
        sm: "h-10 px-4 text-sm",
        icon: "h-11 w-11",
      },
      full: {
        true: "w-full",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface GameButtonProps
  extends ComponentProps<"button">,
    VariantProps<typeof gameButtonVariants> {
  asChild?: boolean;
}

export function GameButton({
  className,
  variant,
  size,
  full,
  asChild,
  ...props
}: GameButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(gameButtonVariants({ variant, size, full }), className)} {...props} />
  );
}
