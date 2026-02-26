import { useMatchChannel, useSocket } from "yourturn/client";
import type { MatchViewData } from "yourturn/types";
import { GameView } from "@/components/gameviews.tsx";
import type { TicTacToeTypes } from "@/game/types.ts";

export default function GameIsland(
  props: {
    gameId: string;
    initialMatchProps: MatchViewData<TicTacToeTypes>;
  },
) {
  const socket = useSocket("/api/socket");
  const gameProps = useMatchChannel(
    socket,
    props.gameId,
    props.initialMatchProps,
  );

  return <GameView {...gameProps} />;
}
