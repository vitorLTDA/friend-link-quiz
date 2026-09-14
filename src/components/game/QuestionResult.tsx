import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { QuestionResultItem } from "@/types/game";

export function QuestionResult({
  item,
  index,
}: {
  item: QuestionResultItem;
  index: number;
}) {
  const optionText = (id: string | null) =>
    item.question.options.find((option) => option.id === id)?.text ?? "No answer";

  return (
    <article
      className={cn(
        "rounded-3xl border p-5",
        item.isCorrect
          ? "border-success/40 bg-success/8"
          : "border-destructive/40 bg-destructive/8",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Question {index + 1}
          </p>
          <h3 className="mt-1 font-display text-lg font-bold leading-snug">
            {item.question.emoji} {item.question.question}
          </h3>
        </div>
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full",
            item.isCorrect
              ? "bg-success text-success-foreground"
              : "bg-destructive text-destructive-foreground",
          )}
        >
          {item.isCorrect ? <Check className="size-4" /> : <X className="size-4" />}
        </span>
      </div>

      <dl className="mt-4 space-y-3 text-sm">
        <Row
          label="Their answer"
          badge={item.originalAnswerId ?? "-"}
          text={optionText(item.originalAnswerId)}
        />
        <Row
          label="Your guess"
          badge={item.guessedAnswerId ?? "-"}
          text={optionText(item.guessedAnswerId)}
        />
      </dl>

      <p
        className={cn(
          "mt-4 text-sm font-semibold",
          item.isCorrect ? "text-success" : "text-destructive",
        )}
      >
        {item.isCorrect ? "✅ Correct" : "❌ Incorrect"}
      </p>
    </article>
  );
}

function Row({ label, badge, text }: { label: string; badge: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary font-display text-xs font-bold">
        {badge}
      </span>
      <div>
        <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
        <dd className="leading-snug">{text}</dd>
      </div>
    </div>
  );
}
