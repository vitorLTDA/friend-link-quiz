import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";

import { ConnectionStatus, DisconnectedBanner } from "@/components/game/ConnectionStatus";
import { GameButton } from "@/components/game/GameButton";
import { GameHeader, PageShell } from "@/components/game/GameHeader";
import { ProgressBar } from "@/components/game/ProgressBar";
import { QuestionCard } from "@/components/game/QuestionCard";
import { WaitingForPlayer } from "@/components/game/WaitingForPlayer";
import { PHASE_COPY } from "@/game/config";
import { TOTAL_QUESTIONS } from "@/game/questions";
import { useGame } from "@/hooks/useGame";

export const Route = createFileRoute("/game")({
  head: () => ({
    meta: [
      { title: "Playing — Do You Know Me?" },
      {
        name: "description",
        content: "Answer honestly, then guess what your friend picked. 17 questions, one score.",
      },
      { property: "og:title", content: "Playing — Do You Know Me?" },
      {
        property: "og:description",
        content: "Answer honestly, then guess what your friend picked.",
      },
    ],
  }),
  component: GamePage,
});

function GamePage() {
  const { state, connection, currentQuestion, selectedOptionId, select, next } = useGame();
  const navigate = useNavigate();

  // Route guard: no game in this tab -> back to the landing page.
  useEffect(() => {
    if (state.phase === "lobby" && !connection.isConnected && !connection.inviteLink) {
      navigate({ to: "/", replace: true });
    }
  }, [state.phase, connection.isConnected, connection.inviteLink, navigate]);

  useEffect(() => {
    if (state.phase === "results") navigate({ to: "/results", replace: true });
  }, [state.phase, navigate]);

  const isGuessing = state.phase === "guessing";
  const copy = isGuessing ? PHASE_COPY.guessing : PHASE_COPY.answering;
  const isLast = state.currentQuestionIndex >= TOTAL_QUESTIONS - 1;

  if (state.phase === "waiting") {
    return (
      <>
        <GameHeader right={<ConnectionStatus status={connection.status} />} />
        <PageShell>
          {connection.status === "disconnected" ? <DisconnectedBanner /> : null}
          <WaitingForPlayer />
        </PageShell>
      </>
    );
  }

  return (
    <>
      <GameHeader right={<ConnectionStatus status={connection.status} />} />
      <PageShell>
        {connection.status === "disconnected" ? <DisconnectedBanner /> : null}

        <div className="space-y-3">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-lg font-bold">{copy.title}</h2>
            <span className="font-display text-sm text-muted-foreground">
              {state.currentQuestionIndex + 1}/{TOTAL_QUESTIONS}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{copy.subtitle}</p>
          <ProgressBar current={state.currentQuestionIndex} total={TOTAL_QUESTIONS} />
        </div>

        <QuestionCard
          question={currentQuestion}
          selectedOptionId={selectedOptionId}
          onSelect={select}
          eyebrow={isGuessing ? "Guess their answer" : "About you"}
        />

        <GameButton size="lg" full disabled={!selectedOptionId} onClick={next}>
          {isLast ? (isGuessing ? "Finish" : "Start guessing") : "Continue"}
          <ArrowRight className="size-4" />
        </GameButton>
      </PageShell>
    </>
  );
}
