import { usePlaySocket } from "yourturn/hooks";
import { PlayerState } from "@/game/types.ts";
import { PlayerView } from "@/components/gameviews.tsx";
import { PlayerProps } from "yourturn/types";

export default function PlayIsland(
  props: {
    gameId: string;
    initialPlayerProps: PlayerProps<PlayerState>;
  },
) {
  const playProps = usePlaySocket(
    `/game/${props.gameId}/socket`,
    props.initialPlayerProps,
  );

  return <PlayerView {...playProps} />;
}
