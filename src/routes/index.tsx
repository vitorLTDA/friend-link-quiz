import { createFileRoute, Link } from "@tanstack/react-router";
import { Link2, ShieldCheck, Users } from "lucide-react";

import { GameButton } from "@/components/game/GameButton";
import { GameHeader, PageShell } from "@/components/game/GameHeader";
import { TOTAL_QUESTIONS } from "@/game/questions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Do You Know Me? — 2-Player Friendship Quiz" },
      {
        name: "description",
        content:
          "A peer-to-peer quiz for two friends. Answer honestly, guess your friend's answers, and see who really knows who. No accounts, no servers.",
      },
      { property: "og:title", content: "Do You Know Me? — 2-Player Friendship Quiz" },
      {
        property: "og:description",
        content: "Answer honestly, guess your friend's answers, and find out who really knows who.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <>
      <GameHeader />
      <PageShell>
        <section className="animate-rise space-y-6 pt-6 text-center sm:pt-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <Users className="size-3.5" /> 2 players · {TOTAL_QUESTIONS} questions
          </span>
          <h1 className="font-display text-5xl font-bold leading-[0.95] sm:text-6xl">
            How well do you <span className="text-gradient-primary">know your friend?</span>
          </h1>
          <p className="mx-auto max-w-md text-base text-muted-foreground">
            You both answer the same questions honestly. Then you each try to guess what the other
            one picked. The score tells the truth.
          </p>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center">
            <GameButton size="lg" full asChild>
              <Link to="/create">Create Game</Link>
            </GameButton>
            <GameButton size="lg" variant="outline" full asChild>
              <Link to="/join">Join Game</Link>
            </GameButton>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <Feature icon={<ShieldCheck className="size-4" />} title="No account">
            Nothing to sign up for, nothing stored anywhere.
          </Feature>
          <Feature icon={<Link2 className="size-4" />} title="Just a link">
            Create a game and send the link to your friend.
          </Feature>
          <Feature icon={<Users className="size-4" />} title="Peer-to-peer">
            Your two browsers talk directly to each other.
          </Feature>
        </section>

        <p className="text-center text-xs text-muted-foreground">
          This game runs entirely in your browsers over a direct peer-to-peer connection. No server
          keeps your answers.
        </p>
      </PageShell>
    </>
  );
}

function Feature({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="surface-card p-5">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
        {icon}
      </span>
      <h2 className="mt-3 font-display text-base font-bold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
