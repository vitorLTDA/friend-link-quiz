import type { SignalPayload } from "@/types/game";

/**
 * Serialization is isolated here on purpose: JSON -> compact string -> base64url.
 * Swap the two helpers below to change the encoding without touching the UI.
 */

function toBase64Url(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string): string {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeSignal(payload: SignalPayload): string {
  return encodeURIComponent(toBase64Url(JSON.stringify(payload)));
}

export function decodeSignal(raw: string, kind: "offer" | "answer"): SignalPayload | null {
  if (!raw) return null;
  try {
    const decoded = JSON.parse(fromBase64Url(decodeURIComponent(raw))) as SignalPayload;
    if (
      decoded?.v !== 1 ||
      decoded.kind !== kind ||
      typeof decoded.sdp !== "string" ||
      !decoded.sdp.includes("v=0") ||
      !Array.isArray(decoded.candidates)
    ) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

export const encodeOffer = (payload: SignalPayload) => encodeSignal({ ...payload, kind: "offer" });
export const decodeOffer = (raw: string) => decodeSignal(raw, "offer");
export const encodeAnswer = (payload: SignalPayload) => encodeSignal({ ...payload, kind: "answer" });
export const decodeAnswer = (raw: string) => decodeSignal(raw, "answer");

const origin = () => (typeof window === "undefined" ? "" : window.location.origin);

export const buildInviteLink = (encoded: string) => `${origin()}/join#o=${encoded}`;
export const buildAnswerLink = (encoded: string) => `${origin()}/connect#a=${encoded}`;

/** Reads a signal payload out of the current URL hash (or query, as a fallback). */
export function readSignalFromUrl(key: "o" | "a"): string | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.replace(/^#/, "");
  const fromHash = new URLSearchParams(hash).get(key);
  if (fromHash) return fromHash;
  return new URLSearchParams(window.location.search).get(key);
}
