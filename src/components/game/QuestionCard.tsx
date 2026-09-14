import { AnswerOption } from "./AnswerOption";
import type { Question } from "@/types/game";

interface QuestionCardProps {
  question: Question;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  eyebrow: string;
}

export function QuestionCard({
  question,
  selectedOptionId,
  onSelect,
  eyebrow,
}: QuestionCardProps) {
  return (
    <section key={question.id} className="surface-card animate-rise p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      <div className="mt-3 flex items-start gap-3">
        {question.emoji ? (
          <span className="animate-float text-3xl leading-none sm:text-4xl">{question.emoji}</span>
        ) : null}
        <h1 className="font-display text-2xl font-bold leading-tight sm:text-4xl">
          {question.question}
        </h1>
      </div>
      <div className="mt-6 space-y-3">
        {question.options.map((option) => (
          <AnswerOption
            key={option.id}
            optionId={option.id}
            text={option.text}
            selected={selectedOptionId === option.id}
            onSelect={() => onSelect(option.id)}
          />
        ))}
      </div>
    </section>
  );
}
