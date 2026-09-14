export type PlayerRole = "host" | "guest";

export type GamePhase = "lobby" | "answering" | "guessing" | "waiting" | "results";

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  question: string;
  emoji?: string;
  options: QuestionOption[];
}

export interface GameState {
  gameId: string;
  role: PlayerRole;
  phase: GamePhase;
  currentQuestionIndex: number;
  myAnswers: Record<string, string>;
  friendAnswers: Record<string, string>;
  myGuesses: Record<string, string>;
  friendGuesses: Record<string, string>;
  friendFinished: boolean;
  iFinished: boolean;
  isConnected: boolean;
}

/** Messages exchanged over the RTCDataChannel. */
export type GameMessage =
  | { type: "PLAYER_READY" }
  | { type: "ANSWER_SUBMITTED"; questionId: string; answer: string }
  | { type: "GUESS_SUBMITTED"; questionId: string; answer: string }
  | { type: "GAME_FINISHED" };

/**
 * High-level, user-facing connection status. Deliberately free of any
 * WebRTC vocabulary so the UI never has to know about SDP or ICE.
 */
export type ConnectionStatus =
  | "idle"
  | "initializing"
  | "creating-offer"
  | "gathering"
  | "waiting-for-guest"
  | "creating-answer"
  | "waiting-for-host"
  | "connecting"
  | "connected"
  | "disconnected"
  | "failed"
  | "invalid-data";

export interface SignalPayload {
  /** payload version, so the encoding can change later */
  v: 1;
  kind: "offer" | "answer";
  gameId: string;
  sdp: string;
  candidates: string[];
}

export interface QuestionResultItem {
  question: Question;
  originalAnswerId: string | null;
  guessedAnswerId: string | null;
  isCorrect: boolean;
}

export interface ScoreResult {
  total: number;
  correct: number;
  incorrect: number;
  percentage: number;
  results: QuestionResultItem[];
}
