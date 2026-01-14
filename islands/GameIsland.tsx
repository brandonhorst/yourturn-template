import { useGameSocket } from "yourturn/hooks";
import type { ObserverProps, PlayerProps } from "yourturn/types";
import { GameView } from "@/components/gameviews.tsx";
import type { Move, ObserverState, PlayerState } from "@/game/types.ts";

type GameProps = PlayerProps<PlayerState> | ObserverProps<ObserverState>;

export default function GameIsland(
  props: { gameId: string; initialGameProps: GameProps },
) {
  const gameProps = useGameSocket<Move, PlayerState, ObserverState>(
    `/game/${props.gameId}/socket`,
    props.initialGameProps,
  );

  return <GameView {...gameProps} />;
}
