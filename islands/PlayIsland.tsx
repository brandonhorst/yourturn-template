import { usePlaySocket } from "jsr:@brandonhorst/yourturn/hooks";
import { PlayerState } from "../examples/uno/game/types.ts";
import { PlayerView } from "../examples/uno/components/gameviews.tsx";
import { PlayerProps } from "jsr:@brandonhorst/yourturn/types";

export default function PlayIsland(
  props: {
    gameId: string;
    sessionId: string;
    initialPlayerProps: PlayerProps<PlayerState>;
  },
) {
  const { playerState, perform } = usePlaySocket(
    `/play/${props.gameId}/${props.sessionId}/socket`,
    props.initialPlayerProps,
  );

  return (
    <PlayerView
      playerState={playerState}
      perform={perform}
    />
  );
}
