import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, PartyPopper } from "lucide-react";
import { useEffect, useState } from "react";

import { AdvancedDetails, ConnectionCard } from "@/components/game/ConnectionCard";
import { ConnectionStatus } from "@/components/game/ConnectionStatus";
import { ErrorState } from "@/components/game/ErrorState";
import { GameButton } from "@/components/game/GameButton";
import { GameHeader, PageShell } from "@/components/game/GameHeader";
import { useGame } from "@/hooks/useGame";
import { readSignalFromUrl } from "@/lib/webrtc/serialization";

export const Route = createFileRoute("/connect")({
  head: () => ({
    meta: [
      { title: "Complete the Connection — Do You Know Me?" },
      {
        name: "description",
        content: "Paste your friend's answer to finish the peer-to-peer connection and start playing.",
      },
      { property: "og:title", content: "Complete the Connection — Do You Know Me?" },
      {
        property: "og:description",
        content: "Finish connecting to your friend and start the quiz.",
      },
    ],
  }),
  component: ConnectPage,
});

function ConnectPage() {
  const { connection, startGame } = useGame();
  const { status, isConnected, completeConnection, debug, inviteLink } = connection;
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const fromUrl = readSignalFromUrl("a");
    if (fromUrl) setValue(fromUrl);
  }, []);

  useEffect(() => {
    if (isConnected) startGame();
  }, [isConnected, startGame]);

  const submit = async () => {
    setError(null);
    setBusy(true);
    const ok = await completeConnection(value);
    setBusy(false);
    if (!ok) {
      setError(
        "That answer doesn't look right. Ask your friend to copy it again, or start a new game.",
      );
    }
  };

  if (!inviteLink && !isConnected) {
    return (
      <>
        <GameHeader />
        <PageShell>
          <ErrorState
            title="No game running in this tab"
            message="This screen finishes a game you created. Create a game first, then come back with your friend's answer."
          />
        </PageShell>
      </>
    );
  }

  if (status === "failed") {
    return (
      <>
        <GameHeader />
        <PageShell>
          <ErrorState
            title="We couldn't finish the connection"
            message="We couldn't establish the connection. Please try creating a new game."
          />
        </PageShell>
      </>
    );
  }

  return (
    <>
      <GameHeader right={<ConnectionStatus status={status} />} />
      <PageShell>
        <ConnectionCard
          title={isConnected ? "You're connected! 🎉" : "Connect to your friend"}
          description={
            isConnected
              ? "Both browsers are talking directly to each other. Let's play."
              : "Open the answer link your friend sent, or paste their answer below."
          }
          status={status}
        >
          {isConnected ? (
            <GameButton size="lg" full asChild>
              <Link to="/game">
                <PartyPopper className="size-4" /> Start Game
              </Link>
            </GameButton>
          ) : (
            <>
              <label className="block space-y-2">
                <span className="text-sm font-medium">Paste your friend's answer here</span>
                <textarea
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  rows={5}
                  placeholder="Paste the answer link or answer data"
                  className="w-full resize-none rounded-2xl border border-input bg-background/60 p-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                />
              </label>
              {error ? (
                <p className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </p>
              ) : null}
              <GameButton size="lg" full onClick={submit} disabled={!value.trim() || busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : null}
                {busy ? "Connecting..." : "Connect"}
              </GameButton>
              <GameButton variant="ghost" full asChild>
                <Link to="/create">Back to my room</Link>
              </GameButton>
            </>
          )}
          <AdvancedDetails data={debug} />
        </ConnectionCard>
      </PageShell>
    </>
  );
}
