import { useCallback, useEffect, useRef, useState } from "react";

import { PeerSession } from "@/lib/webrtc/peerConnection";
import { newGameId, signaling } from "@/lib/webrtc/signaling";
import type { ConnectionStatus, GameMessage, SignalPayload } from "@/types/game";

export interface UseWebRTCResult {
  status: ConnectionStatus;
  gameId: string | null;
  inviteLink: string | null;
  invitePayloadText: string | null;
  answerLink: string | null;
  answerPayloadText: string | null;
  isConnected: boolean;
  debug: Record<string, unknown> | null;
  createGame: () => Promise<void>;
  joinGame: (offer: SignalPayload) => Promise<void>;
  completeConnection: (input: string) => Promise<boolean>;
  send: (message: GameMessage) => boolean;
  markInvalidData: () => void;
  reset: () => void;
}

/**
 * The only place in the app that touches WebRTC. Everything above this hook
 * deals with a friendly `ConnectionStatus` and typed game messages.
 */
export function useWebRTC(onMessage?: (message: GameMessage) => void): UseWebRTCResult {
  const sessionRef = useRef<PeerSession | null>(null);
  const messageHandler = useRef(onMessage);
  messageHandler.current = onMessage;

  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const [gameId, setGameId] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [invitePayloadText, setInvitePayloadText] = useState<string | null>(null);
  const [answerLink, setAnswerLink] = useState<string | null>(null);
  const [answerPayloadText, setAnswerPayloadText] = useState<string | null>(null);
  const [debug, setDebug] = useState<Record<string, unknown> | null>(null);

  const refreshDebug = useCallback(() => {
    setDebug(sessionRef.current ? sessionRef.current.debugInfo() : null);
  }, []);

  const createSession = useCallback(() => {
    sessionRef.current?.close();
    const session = new PeerSession({
      onStateChange: (state) => {
        refreshDebug();
        if (state === "connected") return;
        if (state === "failed") setStatus("failed");
        else if (state === "disconnected" || state === "closed") {
          setStatus((prev) => (prev === "connected" ? "disconnected" : prev));
        }
      },
      onChannelOpen: () => {
        setStatus("connected");
        refreshDebug();
      },
      onChannelClose: () => {
        setStatus((prev) => (prev === "connected" ? "disconnected" : prev));
      },
      onMessage: (message) => messageHandler.current?.(message),
      onError: () => setStatus("failed"),
    });
    sessionRef.current = session;
    return session;
  }, [refreshDebug]);

  const createGame = useCallback(async () => {
    try {
      setStatus("initializing");
      const id = newGameId();
      setGameId(id);
      const session = createSession();
      setStatus("creating-offer");
      const offerPromise = session.createOffer(id);
      setStatus("gathering");
      const offer = await offerPromise;
      setInviteLink(signaling.offerToLink(offer));
      setInvitePayloadText(signaling.offerToText(offer));
      setStatus("waiting-for-guest");
      refreshDebug();
    } catch {
      setStatus("failed");
    }
  }, [createSession, refreshDebug]);

  const joinGame = useCallback(
    async (offer: SignalPayload) => {
      try {
        setStatus("initializing");
        setGameId(offer.gameId);
        const session = createSession();
        setStatus("creating-answer");
        const answer = await session.acceptOfferAndCreateAnswer(offer);
        setAnswerLink(signaling.answerToLink(answer));
        setAnswerPayloadText(signaling.answerToText(answer));
        setStatus("waiting-for-host");
        refreshDebug();
      } catch {
        setStatus("failed");
      }
    },
    [createSession, refreshDebug],
  );

  const completeConnection = useCallback(
    async (input: string) => {
      const answer = signaling.parseAnswerInput(input);
      if (!answer) {
        setStatus("invalid-data");
        return false;
      }
      if (!sessionRef.current) {
        setStatus("failed");
        return false;
      }
      try {
        setStatus("connecting");
        await sessionRef.current.acceptAnswer(answer);
        refreshDebug();
        return true;
      } catch {
        setStatus("failed");
        return false;
      }
    },
    [refreshDebug],
  );

  const send = useCallback((message: GameMessage) => sessionRef.current?.send(message) ?? false, []);

  const reset = useCallback(() => {
    sessionRef.current?.close();
    sessionRef.current = null;
    setStatus("idle");
    setGameId(null);
    setInviteLink(null);
    setInvitePayloadText(null);
    setAnswerLink(null);
    setAnswerPayloadText(null);
    setDebug(null);
  }, []);

  useEffect(() => {
    const timer = setInterval(refreshDebug, 2000);
    return () => clearInterval(timer);
  }, [refreshDebug]);

  useEffect(() => () => sessionRef.current?.close(), []);

  return {
    status,
    gameId,
    inviteLink,
    invitePayloadText,
    answerLink,
    answerPayloadText,
    isConnected: status === "connected",
    debug,
    createGame,
    joinGame,
    completeConnection,
    send,
    markInvalidData: () => setStatus("invalid-data"),
    reset,
  };
}
