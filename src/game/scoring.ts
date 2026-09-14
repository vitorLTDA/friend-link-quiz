import { QUESTIONS } from "./questions";
import type { Question, ScoreResult } from "@/types/game";

/**
 * Pure scoring: compares the answers a player originally gave with the guesses
 * the other player made. No React, no side effects.
 */
export function calculateScore(
  originalAnswers: Record<string, string>,
  guesses: Record<string, string>,
  questions: Question[] = QUESTIONS,
): ScoreResult {
  const results = questions.map((question) => {
    const originalAnswerId = originalAnswers[question.id] ?? null;
    const guessedAnswerId = guesses[question.id] ?? null;
    return {
      question,
      originalAnswerId,
      guessedAnswerId,
      isCorrect:
        originalAnswerId !== null && guessedAnswerId !== null && originalAnswerId === guessedAnswerId,
    };
  });

  const correct = results.filter((item) => item.isCorrect).length;
  const total = results.length;

  return {
    total,
    correct,
    incorrect: total - correct,
    percentage: total === 0 ? 0 : Math.round((correct / total) * 100),
    results,
  };
}
