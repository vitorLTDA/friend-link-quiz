import { QUESTIONS } from "./questions";
import type { GameMessage, GamePhase, GameState, PlayerRole } from "@/types/game";

const STORAGE_KEY = "friend-quiz:state";

export const createInitialState = (gameId: string, role: PlayerRole): GameState => ({
  gameId,
  role,
  phase: "lobby",
  currentQuestionIndex: 0,
  myAnswers: {},
  friendAnswers: {},
  myGuesses: {},
  friendGuesses: {},
  friendFinished: false,
  iFinished: false,
  isConnected: false,
});

export type GameAction =
  | { type: "START" }
  | { type: "SELECT"; questionId: string; optionId: string }
  | { type: "NEXT" }
  | { type: "SET_CONNECTED"; value: boolean }
  | { type: "REMOTE"; message: GameMessage }
  | { type: "HYDRATE"; state: GameState }
  | { type: "RESET" };

const allAnswered = (record: Record<string, string>) =>
  QUESTIONS.every((question) => Boolean(record[question.id]));

function advance(state: GameState): GameState {
  const isLast = state.currentQuestionIndex >= QUESTIONS.length - 1;
  if (!isLast) return { ...state, currentQuestionIndex: state.currentQuestionIndex + 1 };

  if (state.phase === "answering") {
    return { ...state, phase: "guessing", currentQuestionIndex: 0 };
  }
  if (state.phase === "guessing") {
    const finished: GameState = { ...state, iFinished: true };
    return {
      ...finished,
      phase: readyForResults(finished) ? "results" : "waiting",
    };
  }
  return state;
}

export const readyForResults = (state: GameState) =>
  state.iFinished && state.friendFinished && allAnswered(state.friendAnswers);

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START":
      return { ...state, phase: "answering", currentQuestionIndex: 0 };

    case "SELECT": {
      if (state.phase === "answering") {
        return {
          ...state,
          myAnswers: { ...state.myAnswers, [action.questionId]: action.optionId },
        };
      }
      if (state.phase === "guessing") {
        return {
          ...state,
          myGuesses: { ...state.myGuesses, [action.questionId]: action.optionId },
        };
      }
      return state;
    }

    case "NEXT":
      return advance(state);

    case "SET_CONNECTED":
      return { ...state, isConnected: action.value };

    case "REMOTE": {
      const message = action.message;
      switch (message.type) {
        case "ANSWER_SUBMITTED": {
          const next = {
            ...state,
            friendAnswers: { ...state.friendAnswers, [message.questionId]: message.answer },
          };
          return { ...next, phase: readyForResults(next) ? "results" : next.phase };
        }
        case "GUESS_SUBMITTED":
          return {
            ...state,
            friendGuesses: { ...state.friendGuesses, [message.questionId]: message.answer },
          };
        case "GAME_FINISHED": {
          const next = { ...state, friendFinished: true };
          return { ...next, phase: readyForResults(next) ? "results" : next.phase };
        }
        default:
          return state;
      }
    }

    case "HYDRATE":
      return { ...action.state, isConnected: false };

    case "RESET":
      return createInitialState(state.gameId, state.role);

    default:
      return state;
  }
}

export const phaseIsPlayable = (phase: GamePhase) =>
  phase === "answering" || phase === "guessing" || phase === "waiting";

export function persistState(state: GameState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage may be unavailable */
  }
}

export function loadPersistedState(): GameState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    return parsed && typeof parsed.gameId === "string" ? parsed : null;
  } catch {
    return null;
  }
}

export function clearPersistedState() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}
