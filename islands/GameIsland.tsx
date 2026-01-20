import { useGameSocket } from "yourturn/hooks";
import type { GameProps } from "yourturn/types";
import { GameView } from "@/components/gameviews.tsx";
import type { Move, Outcome, PlayerState, PublicState } from "@/game/types.ts";

export default function GameIsland(
  props: {
    gameId: string;
    initialGameProps: GameProps<PlayerState, PublicState, Outcome>;
  },
) {
  const gameProps = useGameSocket<Move, PlayerState, PublicState, Outcome>(
    `/game/${props.gameId}/socket`,
    props.initialGameProps,
  );

  return <GameView {...gameProps} />;
}
