import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Loader2 } from "lucide-react";
import { useEffect } from "react";

import { AdvancedDetails, ConnectionCard } from "@/components/game/ConnectionCard";
import { ConnectionStatus } from "@/components/game/ConnectionStatus";
import { CopyButton } from "@/components/game/CopyButton";
import { ErrorState } from "@/components/game/ErrorState";
import { GameButton } from "@/components/game/GameButton";
import { GameHeader, PageShell } from "@/components/game/GameHeader";
import { QRCodeCard } from "@/components/game/QRCodeCard";
import { ShareLink } from "@/components/game/ShareLink";
import { useGame } from "@/hooks/useGame";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create a Game — Do You Know Me?" },
      {
        name: "description",
        content: "Create a private peer-to-peer quiz room and send the invite link to your friend.",
      },
      { property: "og:title", content: "Create a Game — Do You Know Me?" },
      {
        property: "og:description",
        content: "Create a private quiz room and invite your friend with one link.",
      },
    ],
  }),
  component: CreatePage,
});

function CreatePage() {
  const { connection, host, startGame } = useGame();
  const navigate = useNavigate();
  const { status, inviteLink, invitePayloadText, isConnected, debug } = connection;

  useEffect(() => {
    if (isConnected) startGame();
  }, [isConnected, startGame]);

  const busy =
    status === "initializing" || status === "creating-offer" || status === "gathering";

  if (status === "failed") {
    return (
      <>
        <GameHeader />
        <PageShell>
          <ErrorState
            title="We couldn't create your game"
            message="We couldn't establish the connection. Please try creating a new game."
            onRetry={host}
            retryLabel="Create a new game"
          />
        </PageShell>
      </>
    );
  }

  return (
    <>
      <GameHeader right={<ConnectionStatus status={status} />} />
      <PageShell>
        {!inviteLink ? (
          <ConnectionCard
            title="Create a Game"
            description="We'll set up a private room in your browser and give you a link to send to your friend. No account, no server."
            status={busy ? status : undefined}
          >
            <GameButton size="lg" full onClick={host} disabled={busy}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : null}
              {busy ? "Setting things up..." : "Create Room"}
            </GameButton>
            <p className="text-center text-xs text-muted-foreground">
              Keep this tab open while your friend joins.
            </p>
          </ConnectionCard>
        ) : (
          <ConnectionCard
            title={isConnected ? "Your friend is here! 🎉" : "Your game is ready!"}
            description={
              isConnected
                ? "You're connected. Time to answer some uncomfortable questions."
                : "Send this link to your friend. They'll send an answer back to finish the connection."
            }
            status={status}
          >
            <ShareLink link={inviteLink} title="Send this link to your friend." />
            <QRCodeCard value={inviteLink} />

            {!isConnected ? (
              <div className="space-y-4 rounded-2xl border border-border bg-background/50 p-4">
                <p className="text-sm font-medium">Waiting for your friend to connect...</p>
                <p className="text-sm text-muted-foreground">
                  When they send their answer back, open it or paste it on the connect screen.
                </p>
                <GameButton variant="outline" full asChild>
                  <Link to="/connect">
                    I have my friend's answer <ArrowRight className="size-4" />
                  </Link>
                </GameButton>
              </div>
            ) : (
              <GameButton size="lg" full asChild>
                <Link to="/game">Start Game</Link>
              </GameButton>
            )}

            {invitePayloadText ? (
              <CopyButton
                value={invitePayloadText}
                variant="ghost"
                label="Copy invite data instead"
                full
              />
            ) : null}
            <AdvancedDetails data={debug} />
          </ConnectionCard>
        )}
        <GameButton variant="ghost" full onClick={() => navigate({ to: "/" })}>
          Cancel
        </GameButton>
      </PageShell>
    </>
  );
}
