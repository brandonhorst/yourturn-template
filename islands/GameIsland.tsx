import { useGameSocket } from "yourturn/hooks";
import type { GameProps } from "yourturn/types";
import { GameView } from "@/components/gameviews.tsx";
import type { Move, ObserverState, PlayerState } from "@/game/types.ts";

export default function GameIsland(
  props: {
    gameId: string;
    initialGameProps: GameProps<PlayerState, ObserverState>;
  },
) {
  const gameProps = useGameSocket<Move, PlayerState, ObserverState>(
    `/game/${props.gameId}/socket`,
    props.initialGameProps,
  );

  return <GameView {...gameProps} />;
}
