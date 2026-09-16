import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, PartyPopper } from "lucide-react";
import { useEffect, useState } from "react";

import { AdvancedDetails, ConnectionCard } from "@/components/game/ConnectionCard";
import { ConnectionStatus } from "@/components/game/ConnectionStatus";
import { CopyButton } from "@/components/game/CopyButton";
import { ErrorState } from "@/components/game/ErrorState";
import { GameButton } from "@/components/game/GameButton";
import { GameHeader, PageShell } from "@/components/game/GameHeader";
import { PlayerAvatar } from "@/components/game/PlayerAvatar";
import { ShareLink } from "@/components/game/ShareLink";
import { TOTAL_QUESTIONS } from "@/game/questions";
import { useGame } from "@/hooks/useGame";
import { decodeOffer } from "@/lib/webrtc/serialization";
import { signaling } from "@/lib/webrtc/signaling";
import type { SignalPayload } from "@/types/game";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join a Game — Do You Know Me?" },
      {
        name: "description",
        content: "Your friend invited you to a 2-player quiz. Join with the link they sent you.",
      },
      { property: "og:title", content: "Join a Game — Do You Know Me?" },
      {
        property: "og:description",
        content: "Your friend invited you to a 2-player quiz. Tap to join.",
      },
    ],
  }),
  component: JoinPage,
});

function JoinPage() {
  const { connection, join, startGame } = useGame();
  const { status, answerLink, answerPayloadText, isConnected, debug } = connection;

  const [offer, setOffer] = useState<SignalPayload | null>(null);
  const [invalid, setInvalid] = useState(false);
  const [manual, setManual] = useState("");

  useEffect(() => {
    const fromUrl = signaling.readOfferFromUrl();
    if (fromUrl) setOffer(fromUrl);
    else if (window.location.hash.includes("o=")) setInvalid(true);
  }, []);

  useEffect(() => {
    if (isConnected) startGame();
  }, [isConnected, startGame]);

  const preparing = status === "initializing" || status === "creating-answer";

  if (invalid || status === "invalid-data") {
    return (
      <>
        <GameHeader />
        <PageShell>
          <ErrorState
            title="That invitation didn't work"
            message="The link looks incomplete or expired. Ask your friend to create a new game and send you a fresh link."
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
            title="We couldn't connect you"
            message="We couldn't establish the connection. Please ask your friend to create a new game."
            onRetry={() => offer && join(offer)}
          />
        </PageShell>
      </>
    );
  }

  return (
    <>
      <GameHeader right={<ConnectionStatus status={status} />} />
      <PageShell>
        {!offer ? (
          <ConnectionCard
            title="Got an invite link?"
            description="Open the link your friend sent you, or paste it below to join their game."
          >
            <textarea
              value={manual}
              onChange={(event) => setManual(event.target.value)}
              placeholder="Paste your friend's invite link here"
              rows={4}
              className="w-full resize-none rounded-2xl border border-input bg-background/60 p-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />
            <GameButton
              full
              size="lg"
              disabled={!manual.trim()}
              onClick={() => {
                const raw = manual.includes("o=")
                  ? manual.slice(manual.indexOf("o=") + 2).trim()
                  : manual.trim();
                const parsed = signaling.readOfferFromUrl() ?? decodeManual(raw);
                if (parsed) setOffer(parsed);
                else setInvalid(true);
              }}
            >
              Continue
            </GameButton>
            <GameButton variant="ghost" full asChild>
              <Link to="/">Back to start</Link>
            </GameButton>
          </ConnectionCard>
        ) : !answerLink ? (
          <ConnectionCard
            title="Your friend invited you to a game! 🎈"
            description="Two players, honest answers, and a score that settles it."
            status={preparing ? status : undefined}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-background/50 p-4">
              <PlayerAvatar name="Your friend" emoji="🎯" tone="accent" online />
              <div className="text-right text-xs text-muted-foreground">
                <p>Room {offer.gameId}</p>
                <p>{TOTAL_QUESTIONS} questions</p>
              </div>
            </div>
            <GameButton size="lg" full onClick={() => join(offer)} disabled={preparing}>
              {preparing ? <Loader2 className="size-4 animate-spin" /> : null}
              {preparing ? "Preparing your connection..." : "Join Game"}
            </GameButton>
          </ConnectionCard>
        ) : (
          <ConnectionCard
            title={isConnected ? "You're connected! 🎉" : "You're almost ready!"}
            description={
              isConnected
                ? "Your friend's browser is connected. Let's play."
                : "Send this answer back to your friend so they can finish the connection."
            }
            status={status}
          >
            {!isConnected ? (
              <>
                <ShareLink
                  link={answerLink}
                  title="Send this answer back to your friend."
                  copyLabel="Copy answer link"
                />
                {answerPayloadText ? (
                  <CopyButton
                    value={answerPayloadText}
                    variant="outline"
                    label="Copy answer data"
                    full
                  />
                ) : null}
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" /> Waiting for your friend to finish the
                  connection...
                </p>
              </>
            ) : (
              <GameButton size="lg" full asChild>
                <Link to="/game">
                  <PartyPopper className="size-4" /> Start Game
                </Link>
              </GameButton>
            )}
            <AdvancedDetails data={debug} />
          </ConnectionCard>
        )}
      </PageShell>
    </>
  );
}

function decodeManual(raw: string) {
  try {
    const url = new URL(raw);
    const hash = new URLSearchParams(url.hash.replace(/^#/, "")).get("o");
    if (hash) return decodeOffer(hash);
  } catch {
    /* not a URL, treat as a pasted payload */
  }
  return decodeOffer(raw);
}
