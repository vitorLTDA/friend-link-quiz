import { QuestionResult } from "./QuestionResult";
import type { QuestionResultItem } from "@/types/game";

export function ResultsList({ items }: { items: QuestionResultItem[] }) {
  return (
    <section className="space-y-4">
      <h2 className="font-display text-xl font-bold">Question by question</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <QuestionResult key={item.question.id} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}
