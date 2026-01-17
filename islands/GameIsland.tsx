import { useGameSocket } from "yourturn/hooks";
import type { GameProps } from "yourturn/types";
import { GameView } from "@/components/gameviews.tsx";
import type { Move, PlayerState, PublicState } from "@/game/types.ts";

export default function GameIsland(
  props: {
    gameId: string;
    initialGameProps: GameProps<PlayerState, PublicState>;
  },
) {
  const gameProps = useGameSocket<Move, PlayerState, PublicState>(
    `/game/${props.gameId}/socket`,
    props.initialGameProps,
  );

  return <GameView {...gameProps} />;
}
