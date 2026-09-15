import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { ConnectionStatus } from "@/components/game/ConnectionStatus";
import { GameButton } from "@/components/game/GameButton";
import { GameHeader, PageShell } from "@/components/game/GameHeader";
import { GameScore } from "@/components/game/GameScore";
import { ResultsList } from "@/components/game/ResultsList";
import { WaitingForPlayer } from "@/components/game/WaitingForPlayer";
import { useGame } from "@/hooks/useGame";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Your Score — Do You Know Me?" },
      {
        name: "description",
        content: "See how many of your friend's answers you guessed right, question by question.",
      },
      { property: "og:title", content: "Your Score — Do You Know Me?" },
      {
        property: "og:description",
        content: "See how well you really know your friend, question by question.",
      },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const { state, score, connection, leaveGame } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    if (state.phase === "lobby" && !connection.isConnected) {
      navigate({ to: "/", replace: true });
    }
  }, [state.phase, connection.isConnected, navigate]);

  if (state.phase !== "results") {
    return (
      <>
        <GameHeader right={<ConnectionStatus status={connection.status} />} />
        <PageShell>
          <WaitingForPlayer
            title="Almost there!"
            subtitle="Waiting for your friend's answers to arrive..."
          />
        </PageShell>
      </>
    );
  }

  return (
    <>
      <GameHeader right={<ConnectionStatus status={connection.status} />} />
      <PageShell>
        <GameScore score={score} />
        <ResultsList items={score.results} />
        <div className="flex flex-col gap-3 sm:flex-row">
          <GameButton full asChild onClick={leaveGame}>
            <Link to="/create">Play again</Link>
          </GameButton>
          <GameButton variant="outline" full asChild onClick={leaveGame}>
            <Link to="/">Back to start</Link>
          </GameButton>
        </div>
      </PageShell>
    </>
  );
}
