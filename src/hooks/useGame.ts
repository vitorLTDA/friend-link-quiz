import { useContext } from "react";

import { GameContext } from "@/game/GameProvider";

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used inside <GameProvider>");
  return context;
}
