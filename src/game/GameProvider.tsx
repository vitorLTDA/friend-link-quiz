import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  clearPersistedState,
  createInitialState,
  gameReducer,
  loadPersistedState,
  persistState,
} from "./gameState";
import { QUESTIONS } from "./questions";
import { calculateScore } from "./scoring";
import { useWebRTC } from "@/hooks/useWebRTC";
import type { GameMessage, GameState, PlayerRole, ScoreResult, SignalPayload } from "@/types/game";

export interface GameContextValue {
  state: GameState;
  /** true once the provider tried to recover a persisted session */
  hydrated: boolean;
  connection: ReturnType<typeof useWebRTC>;
  currentQuestion: (typeof QUESTIONS)[number];
  selectedOptionId: string | null;
  score: ScoreResult;
  hasActiveGame: boolean;
  host: () => Promise<void>;
  join: (offer: SignalPayload) => Promise<void>;
  startGame: () => void;
  select: (optionId: string) => void;
  next: () => void;
  leaveGame: () => void;
}

export const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, createInitialState("", "host"));
  const stateRef = useRef(state);
  stateRef.current = state;

  const handleRemote = useCallback((message: GameMessage) => {
    dispatch({ type: "REMOTE", message });
  }, []);

  const connection = useWebRTC(handleRemote);
  const [hydrated, setHydrated] = useState(false);

  // Recover a refreshed session's local progress.
  useEffect(() => {
    const persisted = loadPersistedState();
    if (persisted) dispatch({ type: "HYDRATE", state: persisted });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (state.gameId) persistState(state);
  }, [state]);

  useEffect(() => {
    dispatch({ type: "SET_CONNECTED", value: connection.isConnected });
  }, [connection.isConnected]);

  const setRole = useCallback((gameId: string, role: PlayerRole) => {
    dispatch({ type: "HYDRATE", state: { ...createInitialState(gameId, role) } });
  }, []);

  const host = useCallback(async () => {
    clearPersistedState();
    await connection.createGame();
  }, [connection]);

  const join = useCallback(
    async (offer: SignalPayload) => {
      clearPersistedState();
      setRole(offer.gameId, "guest");
      await connection.joinGame(offer);
    },
    [connection, setRole],
  );

  // Keep the game id / role in sync once WebRTC produced one.
  useEffect(() => {
    if (connection.gameId && connection.gameId !== stateRef.current.gameId) {
      setRole(connection.gameId, connection.inviteLink ? "host" : stateRef.current.role);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection.gameId, connection.inviteLink]);

  const startGame = useCallback(() => dispatch({ type: "START" }), []);

  const select = useCallback((optionId: string) => {
    const current = stateRef.current;
    const question = QUESTIONS[current.currentQuestionIndex];
    if (!question) return;
    dispatch({ type: "SELECT", questionId: question.id, optionId });
  }, []);

  const next = useCallback(() => {
    const current = stateRef.current;
    const question = QUESTIONS[current.currentQuestionIndex];
    if (!question) return;
    if (current.phase === "answering") {
      const answer = current.myAnswers[question.id];
      if (!answer) return;
      connection.send({ type: "ANSWER_SUBMITTED", questionId: question.id, answer });
    }
    if (current.phase === "guessing") {
      const guess = current.myGuesses[question.id];
      if (!guess) return;
      connection.send({ type: "GUESS_SUBMITTED", questionId: question.id, answer: guess });
      if (current.currentQuestionIndex >= QUESTIONS.length - 1) {
        connection.send({ type: "GAME_FINISHED" });
      }
    }
    dispatch({ type: "NEXT" });
  }, [connection]);

  const leaveGame = useCallback(() => {
    clearPersistedState();
    dispatch({ type: "RESET" });
    connection.reset();
  }, [connection]);

  const currentQuestion =
    QUESTIONS[Math.min(Math.max(state.currentQuestionIndex, 0), QUESTIONS.length - 1)] ??
    QUESTIONS[0]!;

  const selectedOptionId =
    state.phase === "guessing"
      ? (state.myGuesses[currentQuestion.id] ?? null)
      : (state.myAnswers[currentQuestion.id] ?? null);

  const score = useMemo(
    () => calculateScore(state.friendAnswers, state.myGuesses),
    [state.friendAnswers, state.myGuesses],
  );

  const value: GameContextValue = {
    state,
    hydrated,
    connection,
    currentQuestion,
    selectedOptionId,
    score,
    hasActiveGame: state.phase !== "lobby" || connection.isConnected,
    host,
    join,
    startGame,
    select,
    next,
    leaveGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
