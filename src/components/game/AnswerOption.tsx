import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface AnswerOptionProps {
  optionId: string;
  text: string;
  selected: boolean;
  onSelect: () => void;
}

export function AnswerOption({ optionId, text, selected, onSelect }: AnswerOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200 active:scale-[0.99]",
        selected
          ? "border-primary bg-primary/12 shadow-glow animate-pop"
          : "border-border bg-background/50 hover:border-primary/50 hover:bg-surface",
      )}
    >
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold transition-colors",
          selected
            ? "bg-gradient-primary text-primary-foreground"
            : "bg-secondary text-muted-foreground group-hover:text-foreground",
        )}
      >
        {selected ? <Check className="size-4" /> : optionId}
      </span>
      <span className={cn("text-[0.95rem] leading-snug", selected && "font-medium")}>{text}</span>
    </button>
  );
}
