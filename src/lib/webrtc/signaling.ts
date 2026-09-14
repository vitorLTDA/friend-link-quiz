import {
  buildAnswerLink,
  buildInviteLink,
  decodeAnswer,
  decodeOffer,
  encodeAnswer,
  encodeOffer,
  readSignalFromUrl,
} from "./serialization";
import type { SignalPayload } from "@/types/game";

/**
 * Manual (server-less) signaling: connection data travels inside shareable
 * links that the players send each other however they like.
 */
export const signaling = {
  offerToLink: (payload: SignalPayload) => buildInviteLink(encodeOffer(payload)),
  answerToLink: (payload: SignalPayload) => buildAnswerLink(encodeAnswer(payload)),
  offerToText: (payload: SignalPayload) => encodeOffer(payload),
  answerToText: (payload: SignalPayload) => encodeAnswer(payload),
  readOfferFromUrl: () => {
    const raw = readSignalFromUrl("o");
    return raw ? decodeOffer(raw) : null;
  },
  readAnswerFromUrl: () => {
    const raw = readSignalFromUrl("a");
    return raw ? decodeAnswer(raw) : null;
  },
  /** Accepts a full answer link OR a pasted payload. */
  parseAnswerInput: (input: string): SignalPayload | null => {
    const trimmed = input.trim();
    if (!trimmed) return null;
    const fromLink = trimmed.includes("#a=")
      ? trimmed.slice(trimmed.indexOf("#a=") + 3)
      : trimmed.includes("a=")
        ? trimmed.slice(trimmed.indexOf("a=") + 2)
        : trimmed;
    return decodeAnswer(fromLink);
  },
};

export const newGameId = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)
  )
    .replace(/-/g, "")
    .slice(0, 8)
    .toUpperCase();
